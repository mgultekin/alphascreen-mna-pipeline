export interface LabeledExample {
  ticker: string;
  category: 'Acquired' | 'Control';
  note: string;
}

export const LABELED_SET: LabeledExample[] = [
  // Acquired / Pending Acquisition / Targets (using actively trading symbols to ensure data availability)
  { ticker: 'CPRI', category: 'Acquired', note: 'Target of Tapestry' },
  { ticker: 'KSS', category: 'Acquired', note: 'Target of Franchise Group' },
  { ticker: 'M', category: 'Acquired', note: 'Target of Arkhouse/Brigade' },
  { ticker: 'CHUY', category: 'Acquired', note: 'Target of Darden Restaurants' },
  { ticker: 'TECK', category: 'Acquired', note: 'Target of Glencore' },
  { ticker: 'USFD', category: 'Acquired', note: 'Target of Sysco (historical proxy)' },
  
  // Control (Independent Peers)
  { ticker: 'LULU', category: 'Control', note: 'Independent apparel peer' },
  { ticker: 'F', category: 'Control', note: 'Independent auto consumer' },
  { ticker: 'DAL', category: 'Control', note: 'Independent airline peer' },
  { ticker: 'OXY', category: 'Control', note: 'Independent energy peer' },
  { ticker: 'EOG', category: 'Control', note: 'Independent energy peer' },
  { ticker: 'JBLU', category: 'Control', note: 'Independent airline peer' },
];
