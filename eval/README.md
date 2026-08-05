# Evaluation Harness & Backtest

A small backtest that asks the question a real analyst would: **does the AI fit score
actually track acquisition targets, or is it just rating "good companies"?**

## What it measures
It scores a labeled set — companies that were acquisition **targets** vs. a **control**
group of independent peers — against a sector-neutral criteria ("general strategic fit,
solid fundamentals, attractive valuation") with all quantitative filters disabled, so
every company reaches the AI. It then compares the mean score of each group, the
separation, and how often targets land above the overall median.

## Running it
Set `GEMINI_API_KEY` in `.env.local`, then:

```bash
npm run backtest
```

## Results (and the finding that matters)

Two runs (temperature 0):

| Run | Mean target | Mean control | Separation | Hit rate |
|-----|-------------|--------------|------------|----------|
| A   | 5.60        | 5.83         | **−0.23**  | 20%      |
| B   | 5.60        | 5.50         | **+0.10**  | 40%      |

**The score shows no meaningful separation between targets and controls** — it hovers
around zero and flips sign with run-to-run noise. High-quality independents (LULU 8,
EOG 8) score as high as or higher than cheap targets (CPRI 3, KSS 4).

### Why — and why that's a useful result
This is exactly what an eval is for. The finding: **the fit score measures strategic
*quality / fit*, not acquisition *likelihood*.** Those are different things — real
takeover targets are frequently *distressed and cheaply valued* (that's often *why*
they're targeted), so a criteria that rewards "solid fundamentals" will not flag them.
Predicting targets would require a separate **undervaluation / vulnerability signal**
(cheap multiples, underperformance vs. peers, activist ownership, weak governance) —
a concrete next step this backtest surfaced.

## Honest limitations
- **"Targets" ≠ completed acquisitions.** Completed deals delist, so their live data
  can't be fetched (e.g. `CHUY`, acquired by Darden, returns N/A). The set therefore
  uses mostly *announced-but-not-completed* bids — a weaker label.
- **Small n (~11 usable), mixed sectors** — noisy by construction.
- **Run-to-run score variance** (~±0.3) even at temperature 0, an inherent LLM trait.
- **Directional only** — a credibility probe, not a rigorous quant backtest.
