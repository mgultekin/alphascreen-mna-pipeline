# Evaluation Harness & Backtest

A small, deterministic backtest suite that evaluates the predictive power of the AI fit score. 

## What it Measures
It compares the average fit score of companies that were *actually* acquired (or received formal buyout offers) against a control group of independent peers. The goal is to establish directional separation: do acquired companies score demonstrably higher than comparable companies that stayed independent?

## Running the Backtest
Ensure you have `GEMINI_API_KEY` set in `.env.local` to allow the AI to score the tickers.

```bash
npm run backtest
```

## Honest Limitations
- **Small Sample Size (n~12)**: Designed to fit within the Gemini free-tier daily quota and keep backtests fast.
- **Look-Ahead Bias**: The AI is scoring based on today's SEC filings and Yahoo Finance data, which may contain the actual acquisition news, announcements, or price-action reflecting the acquisition. While this artificially inflates separation, the harness proves the pipeline can programmatically measure real-world events.
- **Directional Only**: This is not a rigorous backtest for quantitative trading. It's a credibility baseline to ensure the AI scoring mechanism produces non-random, useful signals rather than returning generic scores.
