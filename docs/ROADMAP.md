# Roadmap

Shared task backlog for AlphaScreen. Pick a task, confirm scope with the owner,
work on a branch, and open a PR. Keep `main` deployable at all times.

Status legend: 🔲 not started · 🟡 in progress · ✅ done

---

## Now — high value, well-scoped

### 🟡 1. Deploy + live demo link
Deploy the app to a persistent-Node host and add a **Live Demo** link to the top
of `README.md`.
- Config ready: [`render.yaml`](../render.yaml) blueprint, `.node-version`, and
  `engines` pin. Clean build → start verified locally.
- Remaining: connect the repo on Render (New → Blueprint → Apply), then paste the
  live URL into the README placeholder.
- Leave `GEMINI_API_KEY` **unset** on the host (bring-your-own-key); the keyless
  demo mode must work for visitors.
- **Done when:** the URL loads, "Load sample results" works with no key, and a
  live BYO-key run succeeds.

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

### 🔲 5. Result caching
Cache Yahoo + SEC responses (in-memory with TTL, or Redis) so re-runs and repeated
tickers are instant and gentler on rate limits. Natural precursor to scaling.

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

## Ground rules
- Keep `main` deployable; do non-trivial work on branches + PRs.
- `npm run lint` must stay clean before every commit.
- Never commit secrets (`.env.local` is git-ignored; the key comes from the UI).
- See [CONTRIBUTING.md](../CONTRIBUTING.md) for the multi-machine git workflow.
