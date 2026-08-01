# Roadmap

Shared task backlog for AlphaScreen. Pick a task, confirm scope with the owner,
work on a branch, and open a PR. Keep `main` deployable at all times.

Status legend: 🔲 not started · 🟡 in progress · ✅ done

---

## Now — high value, well-scoped

### ✅ 1. Deploy + live demo link
Deployed to Render via [`render.yaml`](../render.yaml) blueprint; live at
https://alphascreen-mna-pipeline.onrender.com with the link in the README.
Demo mode works fully. Live screening is limited on the host — see #12.

### 🔲 12. Cloud-friendly market-data source (live mode on the deploy)
On cloud hosts, Yahoo Finance 429s the server's IP (`Failed to get crumb`), so
live screening fails on Render even though demo mode works. Local runs are fine
(residential IP). For live mode to work on the deploy, add a datacenter-friendly
quantitative source:
- Integrate an API that doesn't IP-block (e.g. Financial Modeling Prep, Finnhub,
  or Alpha Vantage free tier) as an alternative/fallback to Yahoo for market cap,
  EBITDA margin, P/E, revenue growth, and the business summary.
- Likely needs its own API key (server-side, or add to the bring-your-own-key
  flow). Keep Yahoo as the local-dev default.
- Interim: the UI now shows a clear "market data rate-limited" banner steering
  visitors to the sample demo (done).
- **Done when:** a live screen returns real quant data on the deployed site.

### 🔲 2. Automate ticker sourcing via SEC SIC codes
Today the sector ticker lists in `src/presets.ts` are hand-curated. SEC EDGAR
exposes each filer's **SIC industry code** (`submissions/CIK{cik}.json` →
`sic` / `sicDescription`). Build an optional "auto-source by industry" path that
assembles a candidate universe from SIC codes instead of a fixed list.
- Add a backend endpoint that, given an SIC code (or sector→SIC mapping), returns
  matching tickers; feed them into the existing screening pipeline.
- Keep the curated presets as a fast default; make auto-sourcing additive.
- **Done when:** a user can generate a sector universe without typing tickers.

### ✅ 3. Fix SEC XBRL revenue extraction (headline figure)
`getMostRecent` in `server.ts` picks the first matching revenue concept, which
resolves a **non-headline** figure for some large caps (e.g. AAPL shows ~$266B
instead of ~$391B because Apple reports under
`RevenueFromContractWithCustomerExcludingAssessedTax`, not `Revenues`).
- Prefer the concept whose most-recent annual value is largest / most complete,
  or map known per-company concepts.
- **Done when:** AAPL, MSFT, and a few other large caps report their headline
  consolidated revenue.

### 🔲 3b. Harden revenue period selection (follow-up to #3)
`getMostRecentFull` in `server.ts` picks the first entry at the latest fiscal
year-end without explicitly confirming it's the 12-month annual period. It
resolves correctly for all tickers tested so far (the across-concept
largest-value tiebreak covers it), but a company whose latest concept only
carries a Q4 (3-month) value could be under-reported.
- Filter to annual-duration entries — prefer `fp === 'FY'`, or a
  `start`→`end` span of roughly 350–380 days — before taking the value.
- **Done when:** the reducer provably returns a 12-month figure, with a quick
  note in the PR showing it still matches AAPL/MSFT/SFM/KR.

---

## Next — polish & robustness

### ✅ 4. First-visit onboarding overlay
A short, dismissible intro for first-time visitors explaining what the tool does,
the BYO-key model, and the "Load sample results" option. Persist dismissal in
`localStorage`. Improves the portfolio first impression.
_Done: `src/components/OnboardingOverlay.tsx`, shown on first visit, re-openable
via the header "?" button._

### ✅ 5. Result caching
In-memory TTL cache for Yahoo (1h) + SEC (24h) responses; cache-hit logging;
Gemini deliberately uncached. Done in `server.ts`.

### 🔲 6. Automated tests
Add a lightweight test setup (e.g. Vitest) covering the quant-filter logic, the
XBRL `getMostRecent` reducer, and the SSE result shaping. Wire a GitHub Actions
CI that runs `npm run lint` + tests on every PR.

---

## Later — bigger bets

### 🔲 7. EU / non-US data sources
SEC EDGAR is US-only. Add adapters for CONSOB (Italy), Companies House (UK), or a
licensed provider so non-US tickers get filings enrichment (currently they run on
Yahoo + AI only). Fits the existing "pluggable fetcher stage" design.

### 🔲 8. Deeper NLP on filings
Beyond the business summary: pull full 10-K text and target the MD&A and Risk
Factors sections; optionally add earnings-call transcript sentiment.

### 🔲 9. Persistence & history
Add PostgreSQL to save screening runs so users can revisit and compare past
results. Precursor to any multi-user / accounts work.

### 🔲 10. Hosted "credits" mode (optional monetization)
The backend already accepts a server-side fallback key. Build on that: a metered
mode where users without their own key can run a limited number of AI screens
(rate-limited, usage-tracked). Requires auth + billing — scope carefully.

---

## Product & growth (owner's list)

### ✅ 13. Product & scoring audit — how to attract more users
Delivered: a two-lens audit (senior AI engineer + senior M&A analyst) with a
ranked impact/effort table. Top findings: the score is non-deterministic and
unmeasured; the prompt has a rubric but no anchors; it lacks real deal metrics
(EV/EBITDA, Net Debt/EBITDA), peer-relative scoring, and catalysts. Spawned
tasks #17–#19 below.

### ✅ 17. Scoring reproducibility + rubric anchors (audit #1, #2)
Make the fit score stable and better-calibrated (highest-leverage, low effort):
set the Gemini call to `temperature: 0`; add 1–2 few-shot anchor examples (a
clear 9 and a clear 3, with reasoning) to the system prompt so the 1–10 scale is
consistent across companies. `server.ts` only.
- **Done when:** the same ticker + criteria scores identically on repeat runs.

### 🟡 18. Real deal metrics (audit — M&A lens)
EV/EBITDA, EV/Sales, and Net Debt/EBITDA now flow into the **AI prompt context**
(done, PR #10). Remaining: expose them as optional UI hard-stop filters and add
peer-relative scoring within the sector cohort.

### 🔲 19. Catalyst signal ("why now")
Light NLP pass over recent filings/news for triggers (management change,
strategic review, activist stake, spin-off) — the differentiator that turns a
list into a pipeline.

### 🔲 14. User accounts + saved analyses
Let users log in, save screening runs, and revisit past analyses. Builds on the
persistence work in #9.
- Auth: a hosted option (Clerk / Auth.js / Supabase Auth) to avoid handrolling

### 🔲 14. User accounts + saved analyses
Let users log in, save screening runs, and revisit past analyses. Builds on the
persistence work in #9.
- Auth: a hosted option (Clerk / Auth.js / Supabase Auth) to avoid handrolling
  passwords; support Google sign-in.
- Persist each run (config + results) per user; add a "History" view.
- Keep the app usable **without** login (current flow stays the default).
- **Done when:** a logged-in user can save a run and reopen it later.

### 🔲 15. Show estimated analysis cost before running
Display an estimated AI cost before/at run time, so users understand what a screen
will consume against their own key.
- Estimate = (tickers that would reach the AI stage) × per-call Gemini cost
  (~$0.002 with Flash). Since the pass-rate isn't known until data is fetched,
  show an **upper bound** ("up to ~$0.04 for 20 tickers") and the model used.
- Surface it near the Execute button and/or in the progress indicator.
- **Done when:** the user sees a clear cost estimate tied to their ticker count.

### ✅ 16. Support / donate link
Add a "Buy Me a Coffee" (or GitHub Sponsors / Ko-fi) link so the project can
accept optional support.
- No code platform needed: create an account (e.g. buymeacoffee.com), get your
  page URL, then add a badge to `README.md` and a small link in the app footer.
- GitHub Sponsors alternative: enable in repo Settings → add a `.github/FUNDING.yml`
  to show a **Sponsor** button on the repo.
- **Done when:** a support link is live in the README and/or the app.

---

## Ground rules
- Keep `main` deployable; do non-trivial work on branches + PRs.
- `npm run lint` must stay clean before every commit.
- Never commit secrets (`.env.local` is git-ignored; the key comes from the UI).
- See [CONTRIBUTING.md](../CONTRIBUTING.md) for the multi-machine git workflow.
