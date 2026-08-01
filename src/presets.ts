// ---------------------------------------------------------------------------
// Screening presets — sector "playbooks".
// Each preset bundles a curated ticker universe, the qualitative thesis, the AI
// analyst persona (drives the Gemini system prompt), and sensible default
// quantitative filters for that sector. Add a new sector by adding one object.
//
// Filter convention: 0 disables a filter (matches the server logic), so e.g.
// software targets can set maxPeRatio: 0 to skip P/E screening entirely.
// ---------------------------------------------------------------------------

export interface ScreeningPreset {
  id: string;
  label: string;
  /** Injected into the Gemini system prompt: "…specializing in {analystRole}." */
  analystRole: string;
  criteria: string;
  tickers: string;
  filters: {
    maxMarketCap: number;
    minEbitda: number;
    maxPeRatio: number;
    minRevenueGrowth: number;
  };
}

export const PRESETS: ScreeningPreset[] = [
  {
    id: "food-retail",
    label: "Food Retail & Distribution",
    analystRole: "food retail and distribution acquisitions",
    criteria:
      "Mid-cap food retail and distribution companies with strong margins, consolidation potential, private label growth, and operational efficiency through technology and automation adoption. Prioritize companies with supply chain innovation, e-commerce capabilities, or regional market dominance.",
    tickers:
      "UNFI, KR, SFM, ACI, GO, CASY, CHEF, IMKTA, PFGC, USFD, SYY, NGVC, WMK, HAIN, LANC, JBSS, CALM, BGS, THS, DAR",
    filters: { maxMarketCap: 50, minEbitda: 5, maxPeRatio: 30, minRevenueGrowth: 0 },
  },
  {
    id: "software-saas",
    label: "Software & SaaS",
    analystRole: "software, SaaS, and technology acquisitions",
    criteria:
      "High-growth B2B software and SaaS companies with durable recurring revenue, strong net retention, and expanding gross margins. Prioritize category leaders, mission-critical products with high switching costs, and clear paths to profitability or attractive rule-of-40 profiles.",
    tickers:
      "CRM, ADBE, ORCL, NOW, INTU, WDAY, TEAM, DDOG, SNOW, HUBS, ZS, NET, PANW, CRWD, MDB, TWLO, OKTA, DOCU, PLTR, GTLB",
    // Many SaaS names are unprofitable / high P/E — disable EBITDA & P/E screens, gate on growth.
    filters: { maxMarketCap: 200, minEbitda: 0, maxPeRatio: 0, minRevenueGrowth: 10 },
  },
  {
    id: "healthcare",
    label: "Healthcare & Life Sciences",
    analystRole: "healthcare, pharmaceutical, and life sciences acquisitions",
    criteria:
      "Healthcare and life sciences companies with defensible franchises, strong R&D pipelines or recurring device/diagnostics revenue, and pricing power. Prioritize durable moats (patents, regulatory approvals, installed base), stable cash flows, and demographic tailwinds.",
    tickers:
      "UNH, JNJ, PFE, MRK, ABBV, LLY, TMO, ABT, DHR, BMY, AMGN, GILD, MDT, ISRG, VRTX, REGN, DXCM, ALGN, PODD, ELV",
    filters: { maxMarketCap: 200, minEbitda: 5, maxPeRatio: 40, minRevenueGrowth: 0 },
  },
  {
    id: "industrials",
    label: "Industrials & Manufacturing",
    analystRole: "industrial, manufacturing, and machinery acquisitions",
    criteria:
      "Industrial and manufacturing companies with strong operating margins, pricing discipline, and aftermarket / recurring service revenue. Prioritize automation and reshoring beneficiaries, high returns on capital, and consolidation opportunities in fragmented niches.",
    tickers:
      "GE, HON, MMM, CAT, DE, EMR, ETN, ITW, PH, ROK, GD, RTX, CMI, PCAR, DOV, IR, XYL, AME, FTV, PNR",
    filters: { maxMarketCap: 150, minEbitda: 8, maxPeRatio: 30, minRevenueGrowth: 0 },
  },
  {
    id: "financials",
    label: "Financial Services",
    analystRole: "financial services, banking, and insurance acquisitions",
    criteria:
      "Banks, asset managers, and diversified financials with strong deposit franchises or fee-based recurring revenue, disciplined underwriting, and healthy capital ratios. Prioritize efficient operators, scale advantages, and consolidation potential among regional players.",
    tickers:
      "JPM, BAC, WFC, C, GS, MS, USB, PNC, TFC, SCHW, BLK, AXP, COF, NTRS, STT, FITB, HBAN, RF, KEY, CFG",
    // EBITDA margin is not meaningful for banks; screen on valuation instead.
    filters: { maxMarketCap: 200, minEbitda: 0, maxPeRatio: 20, minRevenueGrowth: 0 },
  },
  {
    id: "custom",
    label: "Custom / Generalist",
    analystRole: "cross-sector M&A acquisitions",
    criteria: "",
    tickers: "",
    // All filters disabled — the user brings their own tickers and thesis.
    filters: { maxMarketCap: 0, minEbitda: 0, maxPeRatio: 0, minRevenueGrowth: 0 },
  },
];

export const DEFAULT_PRESET = PRESETS[0];

// ---------------------------------------------------------------------------
// Thesis angles — cross-sector qualitative lenses.
// The sector preset decides WHAT industry and WHO the AI analyst is; the thesis
// angle decides the STRATEGIC ANGLE the AI screens for. They compose: e.g.
// "Healthcare" sector × "Turnaround & Value" angle. Selecting an angle only
// swaps the qualitative thesis text — the textarea stays fully editable.
// ---------------------------------------------------------------------------

export interface ThesisAngle {
  id: string;
  label: string;
  text: string;
}

export const THESIS_ANGLES: ThesisAngle[] = [
  {
    id: "consolidation",
    label: "Consolidation & Roll-up",
    text: "Companies positioned as consolidators or attractive roll-up targets in a fragmented market — regional or niche leaders with scale advantages, clear cost/revenue synergies, and a credible path to accretive integration.",
  },
  {
    id: "growth",
    label: "Growth & Innovation",
    text: "Companies investing aggressively in innovation, R&D, automation, and digital transformation to build durable competitive advantages. Prioritize expanding margins, strong reinvestment, and technology-driven differentiation.",
  },
  {
    id: "esg",
    label: "ESG & Sustainability",
    text: "Companies with strong ESG credentials — sustainable sourcing, decarbonization initiatives, transparent governance, and resilient, ethical supply chains — where sustainability is a competitive and regulatory advantage.",
  },
  {
    id: "turnaround",
    label: "Turnaround & Value",
    text: "Undervalued companies with turnaround potential — trading below intrinsic value, with recent leadership change or underperforming assets, but showing improving operational metrics and a credible path to margin recovery.",
  },
  {
    id: "efficiency",
    label: "Operational Efficiency & Margins",
    text: "Operationally excellent companies with above-peer margins, disciplined cost control, and clear levers for further efficiency through technology, automation, or scale. Prioritize high returns on capital and stable free cash flow.",
  },
  {
    id: "dividend",
    label: "Quality & Cash Generation",
    text: "High-quality, cash-generative companies with defensible moats, recurring revenue, low earnings volatility, and strong balance sheets. Prioritize resilient demand, pricing power, and consistent free-cash-flow conversion.",
  },
];
