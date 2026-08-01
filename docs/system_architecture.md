# AlphaScreen — System Architecture Deep Dive

> Use this document to explain every technical decision to interviewers. Each section maps to a likely interview question.

---

## 1. System Overview

AlphaScreen is an **AI-powered M&A deal sourcing pipeline** that automates the first stage of acquisition target screening. It combines quantitative financial data from multiple sources with qualitative NLP analysis to score and rank potential targets.

### Core Value Proposition
In traditional M&A workflows, analysts spend **40-60 hours** manually screening companies through Capital IQ, reading 10-K filings, and building Excel models. AlphaScreen reduces this initial screening phase to **minutes** by:
1. Pulling real financial data from Yahoo Finance and SEC EDGAR
2. Applying configurable quantitative filters (hard stops)
3. Using Gemini AI to perform qualitative strategic fit analysis on business profiles and SEC filings
4. Presenting results in a ranked, actionable pipeline format

```
  ┌─────────────────────────────────────────────────────────────────────┐
  │                        USER INTERFACE (React)                       │
  │                                                                     │
  │  ┌───────────┐    ┌─────────────────┐    ┌──────────────────────┐  │
  │  │  SIDEBAR   │    │    DASHBOARD     │    │   PIPELINE TABLE     │  │
  │  │            │    │                 │    │                      │  │
  │  │ • Tickers  │    │ • KPI Cards     │    │ • Sortable columns   │  │
  │  │ • Quant    │    │ • Score Dist.   │    │ • Expandable rows    │  │
  │  │   Filters  │    │ • Funnel Viz    │    │ • Data source badges │  │
  │  │ • AI       │    │ • Top Picks     │    │ • CSV Export         │  │
  │  │   Criteria │    │                 │    │                      │  │
  │  └─────┬─────┘    └────────▲────────┘    └──────────▲───────────┘  │
  │        │                   │                        │              │
  │        │            SSE Event Stream                │              │
  │        │        (real-time result updates)           │              │
  └────────┼───────────────────┼────────────────────────┼──────────────┘
           │                   │                        │
           ▼                   │                        │
  ┌────────────────────────────┴────────────────────────┴──────────────┐
  │                      EXPRESS.JS SERVER                             │
  │                                                                     │
  │  ┌──────────────────────────────────────────────────────────────┐  │
  │  │                    SCREENING PIPELINE                         │  │
  │  │                                                              │  │
  │  │   ┌──────────┐    ┌───────────┐    ┌──────────────────────┐ │  │
  │  │   │  STAGE 1  │    │  STAGE 2   │    │      STAGE 3        │ │  │
  │  │   │           │    │            │    │                      │ │  │
  │  │   │  Yahoo    │    │  SEC EDGAR │    │  Gemini AI (NLP)     │ │  │
  │  │   │  Finance  │───▶│  XBRL API  │───▶│                      │ │  │
  │  │   │           │    │            │    │  • Business profile   │ │  │
  │  │   │ Metrics:  │    │ Metrics:   │    │  • SEC filing context │ │  │
  │  │   │ • Mkt Cap │    │ • Revenue  │    │  • User criteria      │ │  │
  │  │   │ • EBITDA  │    │ • Net Inc  │    │                      │ │  │
  │  │   │ • P/E     │    │ • Assets   │    │  Output:             │ │  │
  │  │   │ • Rev Grw │    │ • Filing   │    │  • Score (1-10)      │ │  │
  │  │   │ • Profile │    │   dates    │    │  • Key findings      │ │  │
  │  │   │           │    │            │    │  • Action             │ │  │
  │  │   └──────────┘    └───────────┘    └──────────────────────┘ │  │
  │  │         │                                                    │  │
  │  │         ▼                                                    │  │
  │  │   QUANT FILTER                                               │  │
  │  │   (Hard stops before AI processing)                          │  │
  │  └──────────────────────────────────────────────────────────────┘  │
  │                                                                     │
  │  ┌──────────────────┐  ┌──────────────────┐                       │
  │  │  Concurrency Mgr  │  │  Error Handler   │                       │
  │  │  (3 parallel max) │  │  (retry + backoff)│                       │
  │  └──────────────────┘  └──────────────────┘                       │
  └─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Pipeline — Stage by Stage

### Stage 1: Yahoo Finance (Quantitative Data)

**Library:** `yahoo-finance2` (Node.js)
**API Call:** `quoteSummary(ticker, { modules: ["summaryDetail", "financialData", "assetProfile"] })`

**What we extract:**

| Field | Source Module | Purpose |
|-------|-------------|---------|
| Market Cap | `summaryDetail.marketCap` | Size filter — M&A deals target specific size ranges |
| EBITDA Margin | `financialData.ebitdaMargins` | Profitability proxy — acquirers want healthy margins |
| P/E Ratio | `summaryDetail.forwardPE` or `trailingPE` | Valuation filter — avoid overpaying |
| Revenue Growth | `financialData.revenueGrowth` | Growth trajectory assessment |
| Business Summary | `assetProfile.longBusinessSummary` | Text corpus for NLP analysis |
| Company Name | `assetProfile.shortName` | Display purposes |
| Sector / Industry | `assetProfile.sector` / `industry` | Categorization |

**Why Yahoo Finance?**
- Free, no API key required
- Real-time data (15-min delayed for most markets)
- Covers all major US and international exchanges
- In a production environment, this would be replaced/augmented by Capital IQ or Refinitiv (Bloomberg Terminal API) — but those require enterprise licenses ($20K+/year)

### Stage 2: SEC EDGAR (Regulatory Filings)

**APIs Used (3-step data pipeline):**
1. **CIK Ticker Map:** `https://www.sec.gov/files/company_tickers.json` — Maps stock tickers to 10-digit CIK numbers
2. **XBRL Company Facts:** `https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json` — All structured financial data
3. **Submissions:** `https://data.sec.gov/submissions/CIK{cik}.json` — Filing metadata (dates, forms, descriptions)

**XBRL Data Structure:**
The Company Facts API returns nested data: `facts → us-gaap → {concept_name} → units → USD → [{val, end, form, ...}]`

Each concept (e.g. `Revenues`, `Assets`) contains an array of values from different filings (10-K, 10-Q). We sort by end date and take the most recent annual (10-K) value, falling back to quarterly (10-Q) if no annual data exists.

**What we extract (6 financial concepts):**

| Data | XBRL Concept(s) | Purpose |
|------|------------------|---------|
| Revenue | `Revenues` → `RevenueFromContractWithCustomerExcludingAssessedTax` → `SalesRevenueNet` → `SalesRevenueGoodsNet` | Revenue with 4 fallback paths (concepts get deprecated) |
| Net Income | `NetIncomeLoss` | Bottom-line profitability from official filings |
| Total Assets | `Assets` | Balance sheet strength |
| Gross Profit | `GrossProfit` | Margin health |
| Operating Income | `OperatingIncomeLoss` | Core business profitability |
| Stockholders Equity | `StockholdersEquity` | Book value / financial health |
| Recent Filings | Submissions API | Filing timeline (latest 5 10-K/10-Q) |

**Why SEC EDGAR?**
- **Free and open** — no API key required, just a `User-Agent` header for identification
- **Authoritative** — this IS the regulatory data, not third-party estimates
- **XBRL structured data** — machine-readable financial statements (no PDF parsing needed)
- **Cross-validation** — compare Yahoo Finance estimates vs. SEC reported actuals
- **Compliance-aware** — demonstrates understanding of regulatory data pipelines

**Technical Details:**
- SEC requires `User-Agent` header: `"AlphaScreen/1.0 (contact@email.com)"`
- Rate limit: max 10 requests/second (we enforce 150ms gaps between calls ≈ 6.6 req/s)
- CIK numbers are zero-padded to 10 digits (e.g. Apple: `0000320193`)
- Revenue uses 4 fallback XBRL concepts because older ones get deprecated over time
- We prefer 10-K (annual) data over 10-Q (quarterly) for consistency

### Stage 3: Gemini AI (Qualitative NLP Analysis)

**Model:** `gemini-flash-latest` (stable alias for the current fast, cost-effective Flash model — used for structured extraction)

**Input Context:**
```
Ticker: {ticker}
Company: {companyName}
Sector: {sector} | Industry: {industry}

--- Yahoo Finance Business Summary ---
{longBusinessSummary}

--- SEC EDGAR Financial Highlights (from XBRL 10-K filings, CIK: {cik}) ---
Revenue: ${revenue}M | Gross Profit: ${grossProfit}M
Operating Income: ${opIncome}M | Net Income: ${netIncome}M
Total Assets: ${totalAssets}M | Stockholders Equity: ${equity}M
Latest Filing: {filingDate} ({filingType})
```

**System Prompt Design:**
The prompt positions the AI as a "Senior M&A Analyst" and provides:
- The user's specific qualitative criteria
- Instructions for strict, evidence-based scoring
- Clear rubric (1-10 scale with defined bands)

**Structured Output Schema (JSON):**
```json
{
  "is_target_fit": true/false,
  "key_findings": "Max 2 sentences...",
  "fit_score": 7,
  "risk_factors": "Key risks...",
  "growth_drivers": "Growth catalysts...",
  "action": "DEEP DIVE" | "DISCARD"
}
```

**Why structured output?**
- Guarantees parseable JSON (no regex extraction needed)
- Consistent fields across all companies for apples-to-apples comparison
- The schema acts as guardrails preventing hallucination or off-topic responses

---

## 3. Quantitative Filtering Logic

The quant filter is a **hard stop** — companies that fail are immediately discarded without consuming AI API calls. This is a deliberate design choice:

```
                    20 tickers input
                          │
                  ┌───────▼───────┐
                  │  Market Cap   │
                  │  ≤ threshold? │
                  └───┬───────┬───┘
                   YES│       │NO → SCREENED OUT
                  ┌───▼───────┐
                  │  EBITDA    │
                  │  ≥ min?    │
                  └───┬───────┬───┘
                   YES│       │NO → SCREENED OUT
                  ┌───▼───────┐
                  │  P/E Ratio │
                  │  ≤ max?    │
                  └───┬───────┬───┘
                   YES│       │NO → SCREENED OUT
                  ┌───▼───────┐
                  │  Rev Growth│
                  │  ≥ min?    │
                  └───┬───────┬───┘
                   YES│       │NO → SCREENED OUT
                      ▼
              Passes to AI Analysis
```

**Why filter first?**
1. **Cost efficiency** — Gemini API calls cost money; filtering saves ~30-50% of calls
2. **Speed** — Quant checks are instant (~2ms); AI calls take 2-5 seconds each
3. **Transparency** — Clearly separates objective criteria from subjective AI judgment
4. **M&A best practice** — This mirrors real deal screening workflows where financial thresholds are non-negotiable

---

## 4. Concurrency & Performance

### Problem
Processing 20 tickers sequentially: ~20 × 4 seconds = **80 seconds**

### Solution: Controlled Concurrent Processing

```javascript
// Semaphore pattern — max 3 concurrent requests
const CONCURRENCY = 3;
```

Each ticker goes through 3 API calls:
1. Yahoo Finance (~500ms)
2. SEC EDGAR (~300ms)  
3. Gemini AI (~2-4 seconds)

With 3 concurrent workers: ~20 tickers / 3 workers × 4 seconds = **~28 seconds**

### Server-Sent Events (SSE)

Instead of waiting for all 20 results, we stream each result to the frontend as it completes:

```
Server                          Client
  │                               │
  │◄── POST /api/batch-screen ────│
  │                               │
  │── SSE: {ticker: "KR", ...} ──▶│  ← Result appears immediately
  │── SSE: {ticker: "SFM", ...} ─▶│  ← 2nd result appears
  │── SSE: {ticker: "GO", ...} ──▶│  ← 3rd result appears
  │        ...                     │
  │── SSE: {type: "done"} ───────▶│  ← Screening complete
  │                               │
```

**Why SSE over WebSockets?**
- Simpler — unidirectional (server → client), no handshake protocol
- Built-in reconnection in browser `EventSource` API
- Sufficient for our use case (we don't need client → server streaming)
- Works through most firewalls and proxies

---

## 5. Frontend Architecture

### Component Tree

```
App
├── Sidebar
│   ├── TickerInput
│   ├── QuantFilters (Market Cap, EBITDA, P/E, Rev Growth)
│   ├── QualitativeCriteria (dropdown + textarea)
│   └── RunButton
│
├── DashboardCards
│   ├── KPICard (Total Screened)
│   ├── KPICard (Passed Quant)
│   ├── KPICard (AI Deep Dive)
│   ├── KPICard (Avg Score)
│   ├── ScoreDistribution (SVG bar chart)
│   └── PipelineFunnel (SVG funnel)
│
├── ProgressIndicator (during screening)
│   ├── ProgressBar
│   ├── CurrentTicker
│   └── TimeEstimate
│
└── ResultsTable
    ├── SortableHeader
    ├── ResultRow (expandable)
    │   ├── CompanyInfo
    │   ├── ScoreGauge
    │   ├── DataSourceBadges
    │   └── ExpandedDetail
    │       ├── QuantMetrics
    │       ├── SECFilingInfo
    │       └── RawProfile
    ├── MethodologyModal
    └── CSVExport
```

### State Management

Simple React `useState` — no Redux or external state library needed because:
- Single-page application with one main workflow
- State is localized (config in sidebar, results in main area)
- SSE results are accumulated in a single array

### Design System

CSS custom properties (variables) define the entire theme:

```css
--bg-primary: #0a0e1a;      /* Deep navy — main background */
--bg-card: #1a1f35;          /* Elevated card surface */
--bg-card-hover: #222845;    /* Interactive hover state */
--accent-green: #10b981;     /* Deep Dive / positive */
--accent-amber: #f59e0b;     /* Review / warning */
--accent-rose: #f43f5e;      /* Discard / negative */
--accent-blue: #3b82f6;      /* Interactive elements */
```

**Why dark theme?**
- Finance professionals work with Bloomberg/Refinitiv terminals — all dark
- Reduces eye strain for data-heavy screens
- Communicates "professional financial tool" immediately
- High contrast makes data more scannable

---

## 6. API Specification

### POST `/api/screen-ticker`

Screen a single ticker against quantitative and qualitative criteria.

**Request:**
```json
{
  "ticker": "KR",
  "maxMarketCap": 50,
  "minEbitda": 0,
  "maxPeRatio": 30,
  "minRevenueGrowth": -10,
  "userCriteria": "Mid-cap food retail with consolidation potential..."
}
```

**Response:**
```json
{
  "ticker": "KR",
  "companyName": "The Kroger Co.",
  "sector": "Consumer Defensive",
  "industry": "Grocery Stores",
  "marketCapB": 42.15,
  "ebitdaMargin": 5.8,
  "peRatio": 14.2,
  "revGrowthPct": 1.3,
  "score": 7,
  "findings": "Kroger is the largest US supermarket chain by revenue...",
  "riskFactors": "Thin margins, intense competition from Walmart...",
  "growthDrivers": "Digital transformation, private label growth...",
  "decision": "🟢 DEEP DIVE",
  "rawProfile": "The Kroger Co. operates as a retailer in the United States...",
  "secData": {
    "cik": "0000056873",
    "recentFilings": [...],
    "xbrlFacts": { "revenue": 150039, "netIncome": 2244 }
  },
  "dataSources": ["Yahoo Finance", "SEC EDGAR", "Gemini AI"]
}
```

### POST `/api/batch-screen` (SSE)

Screen multiple tickers with streaming results.

**Request:** Same as single ticker but with `tickers: string[]`

**Response:** Server-Sent Events stream with individual results.

---

## 7. Error Handling Strategy

```
┌─────────────────────┐
│    API Call Fails    │
└─────────┬───────────┘
          │
    ┌─────▼─────┐
    │  Retry?   │──── Attempt ≤ 3 ───▶ Exponential Backoff
    │           │                       (1s, 2s, 4s)
    └─────┬─────┘                           │
          │                                 ▼
    Attempts > 3                     Retry the call
          │
    ┌─────▼──────────┐
    │ Graceful Degrade│
    │                │
    │ Yahoo fails →  │  Continue with partial data
    │ SEC fails →    │  Skip SEC enrichment, note in output
    │ Gemini fails → │  Return quant data only, score = "-"
    └────────────────┘
```

**Key principle:** A failure in one data source should never crash the entire pipeline. Each source degrades independently.

---

## 8. Scalability — How This Would Grow

### Adding Capital IQ / Refinitiv (Enterprise Data)

```
Current:  Yahoo Finance ──▶ SEC EDGAR ──▶ Gemini
Future:   Capital IQ ──┐
          Refinitiv  ──┼──▶ Data Merger ──▶ SEC EDGAR ──▶ Gemini
          Yahoo      ──┘    (priority-based)
```

The architecture is designed as a **pipeline of enrichment stages**. Adding a new data source means:
1. Create a new fetcher function
2. Add it to the enrichment pipeline
3. Merge results with priority rules (Capital IQ > Yahoo for financial data)

### Scaling to 1000+ Companies

Current approach won't scale past ~100 companies due to:
- API rate limits
- Single-server processing

**Production architecture would add:**
- **Job queue** (Bull/Redis) for background processing
- **Caching layer** (Redis) for Yahoo Finance and SEC data (TTL: 24h)
- **Database** (PostgreSQL) for historical screening results
- **Webhook/email** notifications when screening completes

### Adding More NLP Sources

- **SEC 10-K full text** — Extract risk factors, MD&A sections
- **Earnings call transcripts** — Sentiment analysis on management commentary
- **News feed** — Real-time news sentiment via NewsAPI or GDELT
- **Patent filings** — Innovation signal from USPTO data

---

## 9. Security Considerations

| Concern | Mitigation |
|---------|-----------|
| API key exposure | Gemini key stored in `.env.local`, never sent to client |
| SEC EDGAR rate limits | Controlled concurrency (max 3), proper `User-Agent` |
| Yahoo Finance ToS | Using unofficial API via `yahoo-finance2` — production would use licensed data |
| Prompt injection | User criteria is passed as part of a structured prompt with guardrails |
| Data freshness | Yahoo Finance data is 15-min delayed; SEC data is quarterly — noted in UI |

---

## 10. Technology Choices — Interview Talking Points

| Choice | Why | Alternative Considered |
|--------|-----|----------------------|
| **React + TypeScript** | Type safety for complex financial data types | Vue.js — React has larger ecosystem for finance |
| **Express.js** | Lightweight, SSE support, fast to build | FastAPI (Python) — Node.js keeps full stack in one language |
| **Gemini AI** | Structured JSON output, fast, cost-effective | GPT-4 — Gemini's structured output is more reliable |
| **yahoo-finance2** | Free, comprehensive, real-time | Alpha Vantage — less data coverage |
| **SEC EDGAR XBRL** | Official regulatory data, machine-readable | Scraping PDFs — XBRL is structured and reliable |
| **SSE (not WebSocket)** | Simpler, sufficient for server→client streaming | WebSocket — overkill for unidirectional data |
| **CSS Custom Properties** | Full theme control, no build dependency | Tailwind — custom properties give more precise control |
| **No database** | Demo scope, stateless simplicity | PostgreSQL — would add for production |

---

## 11. Key Metrics to Quote in Interview

- **Screening time:** ~28 seconds for 20 companies (vs. 40-60 hours manually)
- **Data sources:** 2 live APIs (Yahoo Finance + SEC EDGAR) + 1 AI model
- **Cost per screening:** ~$0.002 per company (Gemini Flash pricing)
- **Accuracy trade-off:** AI scores are directional, not definitive — they guide analyst attention, not replace judgment
