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
  recentEventCount?: number;
  recentEventDates?: string[];
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
  confidence?: 'High' | 'Medium' | 'Low';
  targetVulnerability?: 'High' | 'Medium' | 'Low';
  findings: string;
  riskFactors?: string;
  growthDrivers?: string;
  catalyst?: string;
  decision: string;
  rawProfile?: string;
  secData?: SECData;
  dataSources?: string[];
  aiStatus?: 'quota' | 'error' | 'nokey' | 'badkey';
}

export interface ScreeningConfig {
  tickers: string;
  maxMarketCap: number;
  minEbitda: number;
  maxPeRatio: number;
  minRevenueGrowth: number;
  userCriteria: string;
  /** AI analyst persona (sector lens) — injected into the Gemini system prompt. */
  analystRole: string;
}
