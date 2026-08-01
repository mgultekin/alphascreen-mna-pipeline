# AlphaScreen — AI-Powered M&A Deal Sourcing Pipeline

[![CI](https://github.com/mgultekin/alphascreen-mna-pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/mgultekin/alphascreen-mna-pipeline/actions/workflows/ci.yml)

> **🚀 [Live demo →](https://alphascreen-mna-pipeline.onrender.com)** · No sign-up needed — click **"Load sample results"** to explore a real screening run instantly. _(First load may take ~30s while the free instance wakes.)_

An automated screening tool that combines **quantitative financial data** from multiple sources with **qualitative NLP analysis** (Google Gemini) to identify and rank potential M&A acquisition targets.

Built as a case study demonstrating how AI can accelerate the deal sourcing process in capital markets — reducing initial screening from 40-60 analyst hours to under 30 seconds.

**Sector-agnostic:** the pipeline is not tied to any one industry. A dropdown of **sector playbooks** (Food Retail, Software & SaaS, Healthcare, Industrials, Financials, or a fully custom brief) reconfigures the ticker universe, the quantitative filters, the qualitative thesis, and the AI analyst persona in one click — see [`src/presets.ts`](src/presets.ts).

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 FRONTEND (React + TypeScript)            │
│  ┌──────────┐  ┌───────────────┐  ┌──────────────────┐ │
│  │ Sidebar  │  │   Dashboard   │  │  Pipeline Table  │ │
│  │ (Config) │  │  (KPIs/Charts)│  │  (Sortable/Exp.) │ │
│  └──────────┘  └───────────────┘  └──────────────────┘ │
│                    ▲ SSE Stream (real-time results)      │
├────────────────────┼────────────────────────────────────┤
│               EXPRESS.JS SERVER                         │
│                    │                                     │
│  ┌─────────────────┼───────────────────────────────┐   │
│  │      SCREENING PIPELINE (3 concurrent workers)  │   │
│  │                                                  │   │
│  │  Yahoo Finance ──▶ SEC EDGAR ──▶ Gemini AI/NLP  │   │
│  │  (Quantitative)    (Filings)     (Scoring 1-10) │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Key Features

- **Bring Your Own Key + Demo Mode**: Visitors run live screens with their own Gemini key (stored only in their browser) — or explore the full UI instantly with bundled sample data, no key required
- **Multi-Source Data Pipeline**: Combines Yahoo Finance (real-time financials) with SEC EDGAR (XBRL regulatory filings) for comprehensive company analysis
- **Sector Playbooks**: Preset "playbooks" for Food Retail, Software & SaaS, Healthcare, Industrials, and Financials — each bundling a ticker universe, sector-tuned filters, a qualitative thesis, and an AI analyst persona (e.g. P/E screening is disabled for high-growth SaaS; EBITDA margin is disabled for banks)
- **Two-Stage Screening**: Quantitative hard stops (Market Cap, EBITDA, P/E, Revenue Growth) filter before AI processing — saving time and API costs
- **AI Qualitative Analysis**: Google Gemini evaluates business profiles and SEC data against user-defined strategic M&A criteria, reasoning through the selected sector's analyst persona
- **Graceful Degradation**: If the AI quota is exhausted or a source fails, the pipeline continues on quantitative data and flags affected rows as "Quant only" rather than failing
- **Real-Time Streaming**: Server-Sent Events (SSE) deliver results as each company is processed — no waiting for all 20
- **Executive Dashboard**: KPI cards, score distribution chart, pipeline funnel, and top picks summary
- **Sortable Pipeline Table**: Sort by any metric, expand rows for detailed source data and SEC filing info
- **CSV Export**: Download results for further analysis in Excel

## Data Sources

| Source | Type | What It Provides |
|--------|------|-----------------|
| **Yahoo Finance** | Real-time Market Data | Market Cap, EBITDA Margin, P/E Ratio, Revenue Growth, Business Summary |
| **SEC EDGAR (XBRL)** | Regulatory Filings | Revenue, Net Income, Total Assets from official 10-K/10-Q filings |
| **Google Gemini** | AI/NLP Analysis | Strategic fit scoring, risk factors, growth drivers assessment |

## Design Decisions

1. **Why two-stage filtering?** Quantitative checks are instant and free. By filtering first, we avoid unnecessary AI API calls on companies that fail basic financial criteria. This mirrors real M&A workflows where financial thresholds are non-negotiable.

2. **Why SEC EDGAR?** It provides authoritative, machine-readable financial data (XBRL) directly from regulatory filings. This cross-validates Yahoo Finance estimates and demonstrates multi-source data pipeline design.

3. **Why SSE over WebSocket?** Server-Sent Events are simpler (unidirectional), have built-in browser reconnection, and are sufficient for our server→client streaming pattern.

4. **Why controlled concurrency (3 workers)?** Balances speed against API rate limits. Too many parallel requests trigger Yahoo Finance and SEC EDGAR throttling.

## Scalability

The pipeline architecture is modular. Adding enterprise data sources would involve:

```
Current:   Yahoo Finance ──▶ SEC EDGAR ──▶ Gemini AI
Future:    Capital IQ ──┐
           Refinitiv  ──┼──▶ Data Merger ──▶ SEC EDGAR ──▶ Gemini AI
           Yahoo      ──┘    (priority)
```

For 1,000+ company screening: add a job queue (Bull/Redis), caching layer, PostgreSQL for historical results, and webhook notifications.

## Using the App (Bring Your Own Key)

AlphaScreen is **bring-your-own-key**. No key is required to explore it:

- **Try it instantly** — click **Load sample results** to explore the full interface with a saved real screening run, no key needed.
- **Run it live** — paste your own **Google Gemini API key** into the sidebar ([get a free one here](https://aistudio.google.com/apikey)). The key is stored **only in your browser** (`localStorage`) and sent with each request solely to call Gemini — it is never persisted or logged server-side.
- **No key?** You still get full **quantitative + SEC EDGAR** results; only the AI strategic scoring is skipped, and the UI tells you so.

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the dev server (hot reload):
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) and either paste a Gemini key in the sidebar or click **Load sample results**.

> **Optional:** to preload a key server-side for local dev (so you don't paste it each time), create `.env.local` with `GEMINI_API_KEY=your_key`. This is only a fallback — visitor-supplied keys always take precedence. Never commit this file (it's git-ignored).

## Deployment

The app builds to a single Node server that serves the static frontend and the API — deployable to any host that runs Node (Render, Railway, Fly.io, a VPS, etc.).

### Deploy to Render (one-click via Blueprint)

This repo includes a [`render.yaml`](render.yaml) blueprint, so setup is automatic:

1. Push to GitHub (already done if you're reading this on GitHub).
2. On [Render](https://render.com): **New +** → **Blueprint** → connect this repository.
3. Render reads `render.yaml` and provisions a free web service (build `npm install && npm run build`, start `npm start`, health check `/`). Click **Apply**.
4. Wait for the first build (~2–3 min). Your app is live at `https://<service-name>.onrender.com`.

Leave `GEMINI_API_KEY` **unset** — the app is bring-your-own-key and the keyless demo works out of the box. (Free instances sleep after inactivity, so the first request after idle takes ~30s to wake.)

### Any Node host (manual)

```bash
npm install      # installs deps (build needs devDependencies)
npm run build    # → dist/ (frontend) + dist/server.mjs (server)
npm start        # runs the production server (node dist/server.mjs)
```

**Host configuration:**

| Setting | Value |
|--------|-------|
| Build command | `npm install && npm run build` |
| Start command | `npm start` |
| Port | Read from the `PORT` env var automatically (hosts inject it); defaults to `3000` |
| `GEMINI_API_KEY` (optional) | Leave **unset** for pure bring-your-own-key. Set it only if you want a server-side fallback key (a future "hosted credits" mode) |

Notes:
- Production never loads `vite` (it's imported lazily in dev only), so it runs on production dependencies alone.
- The server streams results via SSE, so prefer a host that supports long-lived HTTP responses (Render/Railway/Fly do). Serverless platforms with short function timeouts (e.g. Vercel hobby) would need the batch endpoint adapted.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19, TypeScript, Tailwind CSS v4 | UI with dark finance-terminal theme |
| Backend | Express.js, Node.js | API server with SSE streaming |
| Data | yahoo-finance2, SEC EDGAR XBRL API | Multi-source financial data |
| AI/NLP | Google Gemini (structured output) | Qualitative strategic analysis |
| Build | Vite, esbuild | Fast HMR in dev, optimized production builds |

## Limitations & Future Work

- **Yahoo Finance** is an unofficial API — production would use Capital IQ or Refinitiv
- **SEC EDGAR** only covers US-listed companies — European screening would need CONSOB, Companies House, etc.
- **AI analysis** is based on available text summaries — deeper analysis would involve full 10-K document processing, earnings call transcripts, and news sentiment
- **No persistence** — results are not saved between sessions (would add PostgreSQL)
- **No authentication** — production would add user management and API key scoping
