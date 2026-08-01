import { expect, test, describe } from 'vitest';
import { getMostRecentFull, applyQuantitativeFilters } from './server';

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
