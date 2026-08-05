export interface LabeledExample {
  ticker: string;
  category: 'Acquired' | 'Control';
  note: string;
}

export const LABELED_SET: LabeledExample[] = [
  // Acquired / Pending Acquisition / Targets / In Play (distressed/cheap)
  { ticker: 'CPRI', category: 'Acquired', note: 'Target of Tapestry' },
  { ticker: 'KSS', category: 'Acquired', note: 'Target of Franchise Group' },
  { ticker: 'M', category: 'Acquired', note: 'Target of Arkhouse/Brigade' },
  { ticker: 'TECK', category: 'Acquired', note: 'Target of Glencore' },
  { ticker: 'USFD', category: 'Acquired', note: 'Target of Sysco (historical proxy)' },
  { ticker: 'HES', category: 'Acquired', note: 'Target of Chevron' },
  { ticker: 'SMAR', category: 'Acquired', note: 'Target of Vista Equity' },
  { ticker: 'DT', category: 'Acquired', note: 'Target of Thoma Bravo rumors' },
  { ticker: 'ALGN', category: 'Acquired', note: 'Activist / distressed target' },
  { ticker: 'ROKU', category: 'Acquired', note: 'M&A rumors / distressed' },
  { ticker: 'PTON', category: 'Acquired', note: 'M&A rumors / distressed' },
  { ticker: 'WBA', category: 'Acquired', note: 'Distressed / strategic review' },
  { ticker: 'JWN', category: 'Acquired', note: 'Going private target' },
  { ticker: 'UAA', category: 'Acquired', note: 'Distressed turnaround' },
  { ticker: 'DDOG', category: 'Acquired', note: 'Target of Cisco rumors' },
  
  // Control (Independent Peers, high quality, expensive, not in play)
  { ticker: 'LULU', category: 'Control', note: 'Independent apparel peer' },
  { ticker: 'F', category: 'Control', note: 'Independent auto' },
  { ticker: 'DAL', category: 'Control', note: 'Independent airline' },
  { ticker: 'OXY', category: 'Control', note: 'Independent energy' },
  { ticker: 'EOG', category: 'Control', note: 'Independent energy' },
  { ticker: 'JBLU', category: 'Control', note: 'Independent airline' },
  { ticker: 'CRM', category: 'Control', note: 'Independent enterprise software' },
  { ticker: 'SNOW', category: 'Control', note: 'Independent data software' },
  { ticker: 'MDB', category: 'Control', note: 'Independent database software' },
  { ticker: 'NOW', category: 'Control', note: 'Independent IT software' },
  { ticker: 'ZM', category: 'Control', note: 'Independent communications' },
  { ticker: 'ADBE', category: 'Control', note: 'Independent creative software' },
  { ticker: 'INTU', category: 'Control', note: 'Independent financial software' },
  { ticker: 'V', category: 'Control', note: 'Independent payments' },
  { ticker: 'MA', category: 'Control', note: 'Independent payments' },
];
