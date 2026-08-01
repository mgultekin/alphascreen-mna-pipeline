import dotenv from "dotenv";
// Load env vars before anything reads process.env.
// Vite loads .env.local for the frontend, but the Express server does not —
// so we load it explicitly here (.env.local first, then .env as fallback).
dotenv.config({ path: ".env.local" });
dotenv.config();

import express from "express";
import path from "path";
import YahooFinance from "yahoo-finance2";
import { GoogleGenAI, Type } from "@google/genai";
// NOTE: `vite` is a devDependency and is imported lazily in the dev branch of
// startServer() only — production never loads it, so the app deploys with
// production dependencies alone.

// This app is "bring your own key": each request may carry the caller's Gemini
// API key, which is used only for that request and never stored or logged.
// A server-side GEMINI_API_KEY is optional — a fallback for local dev, or a
// future hosted/credits mode. If neither is present, AI scoring is skipped and
// the pipeline returns quantitative results only.
if (process.env.GEMINI_API_KEY) {
  console.log("[INFO] Server GEMINI_API_KEY present — used as fallback when a request omits its own key.");
} else {
  console.log("[INFO] No server GEMINI_API_KEY — visitors supply their own key (or use demo mode).");
}

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

const app = express();
// Hosts (Render/Railway/Fly/etc.) inject the port via env — honor it.
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface SECData {
  cik: string;
  recentFilings: { form: string; filingDate: string; description: string }[];
  xbrlFacts: {
    revenue?: number;
    netIncome?: number;
    totalAssets?: number;
    grossProfit?: number;
    operatingIncome?: number;
    stockholdersEquity?: number;
  };
}

export interface ScreeningResult {
  ticker: string;
  companyName?: string;
  sector?: string;
  industry?: string;
  marketCapB: number;
  ebitdaMargin: number;
  peRatio?: number;
  revGrowthPct?: number;
  score: number | string;
  findings: string;
  riskFactors?: string;
  growthDrivers?: string;
  decision: string;
  rawProfile?: string;
  secData?: SECData;
  dataSources?: string[];
  aiStatus?: 'quota' | 'error' | 'nokey' | 'badkey';
}

// ------------------------------------------------------------------
// Helper Functions & Caching
// ------------------------------------------------------------------

const YAHOO_CACHE_TTL = 60 * 60 * 1000; // 1 hour
const SEC_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const yahooQuoteCache = new Map<string, CacheEntry<any>>();
const yahooSummaryCache = new Map<string, CacheEntry<any>>();
const secDataCache = new Map<string, CacheEntry<SECData | null>>();

// ------------------------------------------------------------------
// Exported Helpers for Testing
// ------------------------------------------------------------------

export function getMostRecentFull(concept: any): { val: number; end: string } | undefined {
  if (!concept?.units) return undefined;
  const units = concept.units['USD'] || concept.units['USD/shares'];
  if (!units || !units.length) return undefined;
  
  // Prefer annual (10-K) filings for consistency and harden selection to true annual periods
  let values = units.filter((u: any) => {
    if (u.form !== '10-K') return false;
    const isFY = u.fp === 'FY';
    let isAnnualSpan = false;
    if (u.start && u.end) {
      const days = (new Date(u.end).getTime() - new Date(u.start).getTime()) / (1000 * 3600 * 24);
      if (days >= 350 && days <= 380) isAnnualSpan = true;
    }
    return isFY || isAnnualSpan;
  });
  
  // Fall back to quarterly (10-Q) if no annual data available
  if (!values.length) {
    values = units.filter((u: any) => u.form === '10-Q');
  }
  if (!values.length) return undefined;
  
  // Sort by end date descending to get most recent
  values.sort((a: any, b: any) => new Date(b.end).getTime() - new Date(a.end).getTime());
  return { val: values[0].val, end: values[0].end };
}

export function applyQuantitativeFilters(
  config: { maxMarketCap: number; minEbitda: number; maxPeRatio: number; minRevenueGrowth: number },
  metrics: { marketCapB: number; ebitdaMargin: number; peRatio: number; revGrowthPct: number },
  baseResult: Partial<ScreeningResult>
): Partial<ScreeningResult> | null {
  if (config.maxMarketCap > 0 && metrics.marketCapB > config.maxMarketCap) {
    return { ...baseResult, findings: `Screened out: Market Cap ($${metrics.marketCapB.toFixed(1)}B) exceeds $${config.maxMarketCap}B limit`, decision: '⚪ SCREENED OUT' };
  }
  if (config.minEbitda && metrics.ebitdaMargin < config.minEbitda) {
    return { ...baseResult, findings: `Screened out: EBITDA Margin (${metrics.ebitdaMargin.toFixed(1)}%) below ${config.minEbitda}% minimum`, decision: '⚪ SCREENED OUT' };
  }
  if (config.maxPeRatio > 0 && metrics.peRatio > 0 && metrics.peRatio > config.maxPeRatio) {
    return { ...baseResult, findings: `Screened out: P/E Ratio (${metrics.peRatio.toFixed(1)}) exceeds ${config.maxPeRatio}x maximum`, decision: '⚪ SCREENED OUT' };
  }
  if (config.minRevenueGrowth && metrics.revGrowthPct < config.minRevenueGrowth) {
    return { ...baseResult, findings: `Screened out: Revenue Growth (${metrics.revGrowthPct.toFixed(1)}%) below ${config.minRevenueGrowth}% minimum`, decision: '⚪ SCREENED OUT' };
  }
  return null;
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2, delayMs = 1000): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, attempt)));
    }
  }
  throw new Error('Retry exhausted');
}

// ------------------------------------------------------------------
// SEC EDGAR Integration
// Based on SEC EDGAR XBRL API docs and community guidance.
// Key endpoints:
//   - company_tickers.json → Map ticker to CIK number
//   - /api/xbrl/companyfacts/CIK{cik}.json → All XBRL financial facts
//   - /submissions/CIK{cik}.json → Filing metadata (10-K, 10-Q, 8-K)
// Ref: https://www.sec.gov/edgar/sec-api-documentation
// ------------------------------------------------------------------

const SEC_HEADERS = { 'User-Agent': 'AlphaScreen/1.0 (alphascreen@demo.com)' };
let cikMapCache: Record<string, string> | null = null;
let lastSecCall = 0;

// Rate limiter for SEC requests (max 10 requests/second per SEC policy)
async function fetchWithRateLimit(url: string, options: RequestInit = {}) {
  const now = Date.now();
  const timeSinceLastCall = now - lastSecCall;
  if (timeSinceLastCall < 150) { // 150ms gap ≈ 6.6 req/s, safely under limit
    await new Promise(res => setTimeout(res, 150 - timeSinceLastCall));
  }
  lastSecCall = Date.now();
  return fetch(url, options);
}

// Map ticker → 10-digit zero-padded CIK number
// Uses SEC's company_tickers.json which contains all public company CIKs
async function getCompanyCIK(ticker: string): Promise<string | null> {
  if (!cikMapCache) {
    try {
      const res = await fetchWithRateLimit('https://www.sec.gov/files/company_tickers.json', { headers: SEC_HEADERS });
      if (res.ok) {
        const data = await res.json();
        cikMapCache = {};
        // The response is { "0": { cik_str, ticker, title }, "1": { ... }, ... }
        for (const key in data) {
          // CIK must be zero-padded to 10 digits for EDGAR API endpoints
          cikMapCache[data[key].ticker] = String(data[key].cik_str).padStart(10, '0');
        }
        console.log(`[SEC] Loaded CIK mapping for ${Object.keys(cikMapCache).length} companies`);
      }
    } catch (e) {
      console.error("[SEC] Failed to fetch CIK mapping:", e);
      return null;
    }
  }
  return cikMapCache ? (cikMapCache[ticker.toUpperCase()] || null) : null;
}

// Fetch XBRL financial facts + filing metadata from SEC EDGAR
async function fetchSECData(ticker: string): Promise<SECData | null> {
  const cached = secDataCache.get(ticker);
  if (cached && Date.now() - cached.timestamp < SEC_CACHE_TTL) {
    console.log(`[cache] hit ${ticker} (SEC EDGAR)`);
    return cached.data;
  }

  const cik = await getCompanyCIK(ticker);
  if (!cik) {
    console.warn(`[SEC] No CIK found for ticker ${ticker}`);
    secDataCache.set(ticker, { data: null, timestamp: Date.now() });
    return null;
  }

  try {
    // ── 1. XBRL Company Facts ──
    // This gives us ALL structured financial data from all filings
    // Path: facts → us-gaap → {concept} → units → USD → [{val, end, form, ...}]
    const factsUrl = `https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`;
    const factsRes = await fetchWithRateLimit(factsUrl, { headers: SEC_HEADERS });
    
    let xbrlFacts: SECData['xbrlFacts'] = {};
    if (factsRes.ok) {
      const factsData = await factsRes.json();
      const usGaap = factsData.facts?.['us-gaap'];
      
      if (usGaap) {
        // (getMostRecentFull helper has been lifted to module scope for testing)

        // Wrapper to keep compatibility with other extractions
        const getMostRecent = (concept: any): number | undefined => {
          const res = getMostRecentFull(concept);
          return res ? res.val : undefined;
        };

        // Revenue: companies use different XBRL concepts for revenue
        // (some are deprecated, some are industry-specific). We evaluate all
        // to find the largest most recent headline figure.
        const revConcepts = [
          usGaap.Revenues,
          usGaap.RevenueFromContractWithCustomerExcludingAssessedTax,
          usGaap.SalesRevenueNet,
          usGaap.SalesRevenueGoodsNet
        ];
        
        let bestRev: { val: number; end: string } | undefined;
        for (const concept of revConcepts) {
          const current = getMostRecentFull(concept);
          if (current) {
            if (!bestRev) {
              bestRev = current;
            } else {
              const currentTime = new Date(current.end).getTime();
              const bestTime = new Date(bestRev.end).getTime();
              if (currentTime > bestTime) {
                bestRev = current;
              } else if (currentTime === bestTime && current.val > bestRev.val) {
                bestRev = current;
              }
            }
          }
        }
        
        const revenue = bestRev ? bestRev.val : undefined;

        xbrlFacts = {
          revenue,
          netIncome: getMostRecent(usGaap.NetIncomeLoss),
          totalAssets: getMostRecent(usGaap.Assets),
          grossProfit: getMostRecent(usGaap.GrossProfit),
          operatingIncome: getMostRecent(usGaap.OperatingIncomeLoss),
          stockholdersEquity: getMostRecent(usGaap.StockholdersEquity),
        };
      }
    } else {
      console.warn(`[SEC] XBRL facts request failed for ${ticker} (CIK: ${cik}): ${factsRes.status}`);
    }

    // ── 2. Submissions (filing metadata) ──
    // This gives us the list of all filings with dates, forms, and accession numbers
    const subUrl = `https://data.sec.gov/submissions/CIK${cik}.json`;
    const subRes = await fetchWithRateLimit(subUrl, { headers: SEC_HEADERS });
    
    let recentFilings: SECData['recentFilings'] = [];
    if (subRes.ok) {
      const subData = await subRes.json();
      const recent = subData.filings?.recent || {};
      const forms = recent.form || [];
      const dates = recent.filingDate || [];
      const desc = recent.primaryDocDescription || [];
      const accNums = recent.accessionNumber || [];
      
      // Extract the 5 most recent 10-K and 10-Q filings
      for (let i = 0; i < forms.length; i++) {
        if (forms[i] === '10-K' || forms[i] === '10-Q') {
          recentFilings.push({ 
            form: forms[i], 
            filingDate: dates[i], 
            description: desc[i] || `${forms[i]} filing`,
          });
          if (recentFilings.length >= 5) break;
        }
      }
    } else {
      console.warn(`[SEC] Submissions request failed for ${ticker} (CIK: ${cik}): ${subRes.status}`);
    }

    console.log(`[SEC] ✓ ${ticker}: CIK=${cik}, filings=${recentFilings.length}, revenue=${xbrlFacts.revenue ? '$' + (xbrlFacts.revenue/1e6).toFixed(0) + 'M' : 'N/A'}`);
    const result = { cik, recentFilings, xbrlFacts };
    secDataCache.set(ticker, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error(`[SEC] Error fetching data for ${ticker}:`, error);
    return null;
  }
}

// ------------------------------------------------------------------
// Core Screening Logic
// ------------------------------------------------------------------

async function screenSingleTicker(ticker: string, config: {
  maxMarketCap: number;
  minEbitda: number;
  maxPeRatio: number;
  minRevenueGrowth: number;
  userCriteria: string;
  analystRole?: string;
  apiKey?: string;
}): Promise<ScreeningResult> {
  const dataSources = ['Yahoo Finance'];
  
  // 1. Fetch Yahoo Finance data (quote + full summary for EBITDA/profile)
  let quote: any;
  const cachedQuote = yahooQuoteCache.get(ticker);
  if (cachedQuote && Date.now() - cachedQuote.timestamp < YAHOO_CACHE_TTL) {
    console.log(`[cache] hit ${ticker} (Yahoo Quote)`);
    quote = cachedQuote.data;
  } else {
    quote = await withRetry(() => yahooFinance.quote(ticker)) as any;
    yahooQuoteCache.set(ticker, { data: quote, timestamp: Date.now() });
  }

  // Delisted/renamed tickers (e.g. after an acquisition) can return no quote.
  // Fail cleanly with a readable message instead of a raw TypeError downstream.
  if (!quote) {
    return {
      ticker,
      marketCapB: 0,
      ebitdaMargin: 0,
      score: '-',
      findings: `No market data found for ${ticker} — ticker may be delisted, renamed, or invalid.`,
      decision: '⚪ NO DATA',
      dataSources,
    };
  }
  let assetProfile: any = {};
  let financialData: any = {};
  let summaryDetail: any = {};
  
  const cachedSummary = yahooSummaryCache.get(ticker);
  if (cachedSummary && Date.now() - cachedSummary.timestamp < YAHOO_CACHE_TTL) {
    console.log(`[cache] hit ${ticker} (Yahoo Summary)`);
    assetProfile = cachedSummary.data.assetProfile || {};
    financialData = cachedSummary.data.financialData || {};
    summaryDetail = cachedSummary.data.summaryDetail || {};
  } else {
    try {
      const summary = await withRetry(() => yahooFinance.quoteSummary(ticker, { 
        modules: ['assetProfile', 'financialData', 'summaryDetail'] 
      })) as any;
      yahooSummaryCache.set(ticker, { data: summary, timestamp: Date.now() });
      assetProfile = summary.assetProfile || {};
      financialData = summary.financialData || {};
      summaryDetail = summary.summaryDetail || {};
    } catch (e) {
      console.warn(`Could not fetch full summary for ${ticker}`);
    }
  }

  // 2. Compute/extract quantitative metrics
  const marketCapB = (quote.marketCap || summaryDetail.marketCap || 0) / 1e9;
  const ebitdaMargin = (financialData.ebitdaMargins || 0) * 100;
  const peRatio = summaryDetail.forwardPE || summaryDetail.trailingPE || quote.trailingPE || 0;
  const revGrowthPct = (financialData.revenueGrowth || 0) * 100;
  const companyName = quote.longName || quote.shortName || ticker;
  const rawProfile = assetProfile.longBusinessSummary || `No business summary available for ${ticker}.`;

  // Base result for screened-out companies
  const baseResult: ScreeningResult = {
    ticker,
    companyName,
    sector: assetProfile.sector,
    industry: assetProfile.industry,
    marketCapB: parseFloat(marketCapB.toFixed(2)),
    ebitdaMargin: parseFloat(ebitdaMargin.toFixed(1)),
    peRatio: peRatio ? parseFloat(peRatio.toFixed(1)) : undefined,
    revGrowthPct: parseFloat(revGrowthPct.toFixed(1)),
    score: '-',
    findings: '',
    decision: '',
    rawProfile,
    dataSources
  };

  // 3. Quantitative Filters — return SCREENED OUT instead of throwing
  const filterResult = applyQuantitativeFilters(config, { marketCapB, ebitdaMargin, peRatio, revGrowthPct }, baseResult);
  if (filterResult) return filterResult as ScreeningResult;

  // 4. Fetch SEC EDGAR data (graceful fallback — never fails the pipeline)
  let secData: SECData | null = null;
  try {
    secData = await fetchSECData(ticker);
    if (secData) dataSources.push('SEC EDGAR');
  } catch (e) {
    console.warn(`SEC EDGAR fetch failed for ${ticker}, continuing without it`);
  }

  // 5. Build context for Gemini AI with all available data
  const secContext = secData ? `
--- SEC EDGAR Financial Highlights (from XBRL 10-K filings, CIK: ${secData.cik}) ---
Revenue: ${secData.xbrlFacts.revenue ? '$' + (secData.xbrlFacts.revenue / 1e6).toFixed(0) + 'M' : 'N/A'}
Gross Profit: ${secData.xbrlFacts.grossProfit ? '$' + (secData.xbrlFacts.grossProfit / 1e6).toFixed(0) + 'M' : 'N/A'}
Operating Income: ${secData.xbrlFacts.operatingIncome ? '$' + (secData.xbrlFacts.operatingIncome / 1e6).toFixed(0) + 'M' : 'N/A'}
Net Income: ${secData.xbrlFacts.netIncome ? '$' + (secData.xbrlFacts.netIncome / 1e6).toFixed(0) + 'M' : 'N/A'}
Total Assets: ${secData.xbrlFacts.totalAssets ? '$' + (secData.xbrlFacts.totalAssets / 1e6).toFixed(0) + 'M' : 'N/A'}
Stockholders Equity: ${secData.xbrlFacts.stockholdersEquity ? '$' + (secData.xbrlFacts.stockholdersEquity / 1e6).toFixed(0) + 'M' : 'N/A'}
Latest Filing: ${secData.recentFilings[0]?.form || 'N/A'} (${secData.recentFilings[0]?.filingDate || 'N/A'})` : '';

  // The analyst persona is driven by the selected screening preset, so the AI
  // reasons through the right sector lens (grocery vs. SaaS vs. banking, etc.).
  const analystRole = config.analystRole || 'cross-sector M&A acquisitions';
  const systemPrompt = `You are a Senior M&A Analyst at a capital markets firm specializing in ${analystRole}.

Evaluate the target company based on these strategic criteria provided by the deal team:
"${config.userCriteria || 'General strategic fit and solid fundamentals'}"

Your M&A Fit Score (1-10) should reflect:
- 9-10: Exceptional strategic fit, clear synergies, strong financials
- 7-8: Strong fit with minor gaps
- 5-6: Moderate fit, some relevant elements but not a pure play
- 3-4: Weak fit, limited strategic alignment
- 1-2: No meaningful fit with the stated criteria

For example:
- A "9" means: "Exceptional fit; the target's core product perfectly fills our capability gap, and their 40% margin proves operational excellence."
- A "3" means: "Weak fit; the target operates in an adjacent space but lacks the requested enterprise focus, while growth is stagnating."

Be rigorous and evidence-based. Only reference information explicitly stated in the provided data. Do not infer or assume facts not present.`;

  const userContent = `Ticker: ${ticker}
Company: ${companyName}
Sector: ${assetProfile.sector || 'Unknown'} | Industry: ${assetProfile.industry || 'Unknown'}

--- Yahoo Finance Metrics ---
Market Cap: $${marketCapB.toFixed(2)}B
EBITDA Margin: ${ebitdaMargin.toFixed(1)}%
P/E Ratio: ${peRatio ? peRatio.toFixed(1) : 'N/A'}
Revenue Growth: ${revGrowthPct.toFixed(1)}%

--- Business Profile ---
${rawProfile}
${secContext}`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      is_target_fit: { type: Type.BOOLEAN, description: "True if score >= 7" },
      key_findings: { type: Type.STRING, description: "2-3 sentences on strategic fit assessment" },
      risk_factors: { type: Type.STRING, description: "Key risks for this acquisition (1-2 sentences)" },
      growth_drivers: { type: Type.STRING, description: "Key growth catalysts (1-2 sentences)" },
      fit_score: { type: Type.INTEGER, description: "M&A fit score from 1 to 10" },
      action: { type: Type.STRING, description: "Either 'DEEP DIVE' or 'DISCARD'" },
    },
    required: ["is_target_fit", "key_findings", "risk_factors", "growth_drivers", "fit_score", "action"],
  };

  let geminiResult;
  let aiStatus: 'quota' | 'error' | 'nokey' | 'badkey' | undefined;

  // Per-request key first (bring-your-own), then optional server fallback.
  const geminiKey = config.apiKey || process.env.GEMINI_API_KEY || '';

  if (!geminiKey) {
    // No key anywhere — skip AI entirely and return quantitative results only.
    aiStatus = 'nokey';
    geminiResult = {
      is_target_fit: false,
      key_findings: "No API key provided — quantitative screening only. Add your Gemini API key to enable AI strategic scoring.",
      risk_factors: "Not assessed.",
      growth_drivers: "Not assessed.",
      fit_score: 0,
      action: "QUANT_ONLY",
    };
  } else {
  try {
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    dataSources.push('Gemini AI');
    const response = await ai.models.generateContent({
      // 'gemini-flash-latest' is a stable alias that always points to the current
      // fast/low-cost Flash model. Pinned versions (e.g. gemini-2.5-flash) can be
      // retired for new API keys and start returning 404.
      model: 'gemini-flash-latest',
      contents: [
        { role: 'user', parts: [{ text: userContent }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0,
        topP: 0.1,
        topK: 1,
      }
    });

    const textOutput = response.text || "{}";
    geminiResult = JSON.parse(textOutput);
  } catch (error: any) {
    // Classify the failure so the UI can respond appropriately:
    //   badkey → invalid/unauthorized key   quota → rate/quota limit   error → other.
    const msg = String(error?.message || error);
    const status = error?.status;
    const isBadKey = status === 400 || status === 401 || status === 403
      || /API key not valid|API_KEY_INVALID|invalid.*key|permission|unauthorized/i.test(msg);
    const isQuota = status === 429 || /quota|RESOURCE_EXHAUSTED|rate.?limit/i.test(msg);
    aiStatus = isBadKey ? 'badkey' : isQuota ? 'quota' : 'error';
    console.warn(`Gemini AI ${isBadKey ? 'invalid key' : isQuota ? 'quota reached' : 'failed'} for ${ticker}`);
    // Gemini contributed nothing — don't claim it as a data source.
    const gi = dataSources.indexOf('Gemini AI');
    if (gi >= 0) dataSources.splice(gi, 1);
    geminiResult = {
      is_target_fit: false,
      key_findings: isBadKey
        ? "Invalid or unauthorized API key — please check your Gemini key."
        : isQuota
        ? "AI quota reached for this run — quantitative screening only. Passed all quant filters."
        : "AI evaluation unavailable — manual review recommended.",
      risk_factors: "Unable to assess.",
      growth_drivers: "Unable to assess.",
      fit_score: 0,
      // Key problems and quota both mean "AI didn't evaluate" → quant-only row.
      action: (isQuota || isBadKey) ? "QUANT_ONLY" : "REVIEW"
    };
  }
  } // end else (had a key)

  const decisionEmoji = geminiResult.action === 'DEEP DIVE' ? '🟢 DEEP DIVE' :
                         geminiResult.action === 'DISCARD' ? '🔴 DISCARD' :
                         geminiResult.action === 'QUANT_ONLY' ? '⚪ QUANT ONLY' : '🟡 REVIEW';

  return {
    ticker,
    companyName,
    sector: assetProfile.sector,
    industry: assetProfile.industry,
    marketCapB: parseFloat(marketCapB.toFixed(2)),
    ebitdaMargin: parseFloat(ebitdaMargin.toFixed(1)),
    peRatio: peRatio ? parseFloat(peRatio.toFixed(1)) : undefined,
    revGrowthPct: parseFloat(revGrowthPct.toFixed(1)),
    // No real AI score when the AI didn't run (no key / bad key / quota) — show a dash.
    score: (aiStatus === 'quota' || aiStatus === 'nokey' || aiStatus === 'badkey') ? '-' : geminiResult.fit_score,
    findings: geminiResult.key_findings,
    riskFactors: geminiResult.risk_factors,
    growthDrivers: geminiResult.growth_drivers,
    decision: decisionEmoji,
    rawProfile,
    secData: secData || undefined,
    dataSources,
    aiStatus
  };
}

// ------------------------------------------------------------------
// API Endpoints
// ------------------------------------------------------------------

// Legacy single-ticker endpoint
app.post("/api/screen-ticker", async (req, res) => {
  const { ticker, maxMarketCap, minEbitda, maxPeRatio, minRevenueGrowth, userCriteria, analystRole, apiKey } = req.body;
  if (!ticker) {
    return res.status(400).json({ error: "Ticker is required" });
  }

  try {
    const result = await screenSingleTicker(ticker, {
      maxMarketCap, minEbitda, maxPeRatio, minRevenueGrowth, userCriteria, analystRole, apiKey
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || "Failed to screen ticker",
      ticker 
    });
  }
});

// New batch-screen endpoint using Server-Sent Events
app.post("/api/batch-screen", async (req, res) => {
  const { tickers, maxMarketCap, minEbitda, maxPeRatio, minRevenueGrowth, userCriteria, analystRole, apiKey } = req.body;
  
  if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
    return res.status(400).json({ error: "A valid list of tickers is required" });
  }
  
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();
  
  // Helper to send SSE event
  const sendEvent = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };
  
  // Process tickers with controlled concurrency (3 at a time)
  const CONCURRENCY = 3;
  let completed = 0;
  
  // Use a semaphore pattern
  const processTicker = async (ticker: string) => {
    sendEvent({ type: 'progress', message: `Analyzing ${ticker}...`, ticker });
    
    try {
      const result = await screenSingleTicker(ticker, { maxMarketCap, minEbitda, maxPeRatio, minRevenueGrowth, userCriteria, analystRole, apiKey });
      completed++;
      sendEvent({ type: 'result', data: result });
    } catch (error: any) {
      completed++;
      sendEvent({ type: 'result', data: { 
        ticker, 
        marketCapB: 0, 
        ebitdaMargin: 0, 
        score: '-', 
        findings: `Error: ${error.message}`, 
        decision: '⚪ ERROR' 
      }});
    }
  };
  
  // Process in batches of CONCURRENCY
  for (let i = 0; i < tickers.length; i += CONCURRENCY) {
    const batch = tickers.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(processTicker));
  }
  
  sendEvent({ type: 'done', total: tickers.length });
  res.end();
});

// ------------------------------------------------------------------
// Server Startup
// ------------------------------------------------------------------

// Dev mode is opt-in via the `--dev` flag (set by `npm run dev`) — cross-platform,
// no NODE_ENV env-prefix needed. `npm start` / `node dist/server.mjs` runs production.
const IS_DEV = process.argv.includes("--dev");

async function startServer() {
  if (IS_DEV) {
    // Dev only: load Vite lazily so production doesn't need the devDependency.
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
