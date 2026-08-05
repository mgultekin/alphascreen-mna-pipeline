import { expect, test, describe } from 'vitest';
import { getMostRecentFull, applyQuantitativeFilters, computeConfidence, computeTargetVulnerability } from './server';

describe('SEC XBRL Extractor: getMostRecentFull', () => {
  test('returns undefined for empty or invalid concepts', () => {
    expect(getMostRecentFull(null)).toBeUndefined();
    expect(getMostRecentFull({})).toBeUndefined();
    expect(getMostRecentFull({ units: {} })).toBeUndefined();
    expect(getMostRecentFull({ units: { 'USD': [] } })).toBeUndefined();
  });

  test('prioritizes annual FY figures over shorter periods (harden check)', () => {
    const concept = {
      units: {
        'USD': [
          // Q4-only figure disguised in a 10-K (bad, shouldn't be picked as annual)
          { val: 1000, end: '2023-12-31', start: '2023-10-01', form: '10-K', fp: 'Q4' },
          // True annual figure (FY)
          { val: 5000, end: '2023-12-31', start: '2023-01-01', form: '10-K', fp: 'FY' },
        ]
      }
    };
    const res = getMostRecentFull(concept);
    expect(res).toBeDefined();
    expect(res?.val).toBe(5000);
  });

  test('accepts span of ~365 days as annual if fp is missing', () => {
    const concept = {
      units: {
        'USD': [
          { val: 100, end: '2023-12-31', start: '2023-10-01', form: '10-K' }, // ~90 days
          { val: 600, end: '2023-12-31', start: '2023-01-01', form: '10-K' }, // ~365 days
        ]
      }
    };
    const res = getMostRecentFull(concept);
    expect(res).toBeDefined();
    expect(res?.val).toBe(600);
  });

  test('falls back to 10-Q if no valid annual figures exist', () => {
    const concept = {
      units: {
        'USD': [
          { val: 1500, end: '2024-03-31', start: '2024-01-01', form: '10-Q', fp: 'Q1' }
        ]
      }
    };
    const res = getMostRecentFull(concept);
    expect(res).toBeDefined();
    expect(res?.val).toBe(1500);
    expect(res?.end).toBe('2024-03-31');
  });

  test('picks the most recent date if multiple valid options exist', () => {
    const concept = {
      units: {
        'USD': [
          { val: 4000, end: '2022-12-31', start: '2022-01-01', form: '10-K', fp: 'FY' },
          { val: 5000, end: '2023-12-31', start: '2023-01-01', form: '10-K', fp: 'FY' },
        ]
      }
    };
    const res = getMostRecentFull(concept);
    expect(res?.val).toBe(5000);
    expect(res?.end).toBe('2023-12-31');
  });
});

describe('Quantitative Filters', () => {
  const baseConfig = { maxMarketCap: 0, minEbitda: 0, maxPeRatio: 0, minRevenueGrowth: 0 };
  const baseMetrics = { marketCapB: 50, ebitdaMargin: 20, peRatio: 15, revGrowthPct: 10 };
  const baseResult = { ticker: 'TEST' };

  test('passes when no thresholds are active', () => {
    expect(applyQuantitativeFilters(baseConfig, baseMetrics, baseResult)).toBeNull();
  });

  test('filters out by max market cap', () => {
    const config = { ...baseConfig, maxMarketCap: 40 };
    const res = applyQuantitativeFilters(config, baseMetrics, baseResult);
    expect(res).not.toBeNull();
    expect(res?.decision).toBe('⚪ SCREENED OUT');
    expect(res?.findings).toMatch(/Market Cap/);
  });

  test('filters out by min EBITDA', () => {
    const config = { ...baseConfig, minEbitda: 25 };
    const res = applyQuantitativeFilters(config, baseMetrics, baseResult);
    expect(res).not.toBeNull();
    expect(res?.findings).toMatch(/EBITDA/);
  });

  test('filters out by max P/E ratio', () => {
    const config = { ...baseConfig, maxPeRatio: 10 };
    const res = applyQuantitativeFilters(config, baseMetrics, baseResult);
    expect(res).not.toBeNull();
    expect(res?.findings).toMatch(/P\/E/);
  });

  test('filters out by min revenue growth', () => {
    const config = { ...baseConfig, minRevenueGrowth: 15 };
    const res = applyQuantitativeFilters(config, baseMetrics, baseResult);
    expect(res).not.toBeNull();
    expect(res?.findings).toMatch(/Revenue Growth/);
  });
});

describe('computeConfidence', () => {
  test('returns High when most signals are present', () => {
    const inputs = {
      secData: { cik: '0000320193', xbrlFacts: { revenue: 1000 }, recentFilings: [], recentEventDates: ['2023-01-01 [8-K]'] },
      rawProfile: 'A'.repeat(150),
      evToEbitda: 15.5
    };
    expect(computeConfidence(inputs)).toBe('High');
  });

  test('returns Medium when some signals are present', () => {
    const inputs = {
      secData: { cik: '0000320193', xbrlFacts: { revenue: 1000 }, recentFilings: [], recentEventDates: [] },
      rawProfile: 'A'.repeat(150),
      evToEbitda: undefined
    };
    expect(computeConfidence(inputs)).toBe('Medium');
  });

  test('returns Low when few or no signals are present', () => {
    const inputs = {
      secData: null,
      rawProfile: 'No business summary available.',
      evToEbitda: undefined
    };
    expect(computeConfidence(inputs as any)).toBe('Low');
  });
});

describe('computeTargetVulnerability', () => {
  test('returns High when cheap and in play', () => {
    const inputs = {
      evToEbitda: 8,
      evToSales: 1.0,
      recentEventCount: 2,
      netDebtToEbitda: 3
    };
    // Base 5 + 2 (cheap EBITDA) + 1 (cheap Sales) + 2 (in play) + 1 (financeable) = 11 -> clamped to High (>= 7)
    expect(computeTargetVulnerability(inputs)).toBe('High');
  });

  test('returns Medium for average companies', () => {
    const inputs = {
      evToEbitda: 12,
      evToSales: 3,
      recentEventCount: 0,
      netDebtToEbitda: 5
    };
    // Base 5 + 0 + 0 + 0 + 0 = 5 -> Medium
    expect(computeTargetVulnerability(inputs)).toBe('Medium');
  });

  test('returns Low for expensive, no-event, high-debt companies', () => {
    const inputs = {
      evToEbitda: 20,
      evToSales: 6,
      recentEventCount: 0,
      netDebtToEbitda: 7
    };
    // Base 5 - 2 (expensive EBITDA) - 1 (expensive Sales) + 0 - 1 (high debt) = 1 -> Low
    expect(computeTargetVulnerability(inputs)).toBe('Low');
  });
});
