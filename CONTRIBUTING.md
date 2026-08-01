# Contributing & Workflow

Notes for working on AlphaScreen — especially when editing from **more than one place**
(e.g. this machine + an agent platform like Google Antigravity). Following this keeps
history clean and avoids merge conflicts.

## Prerequisites

- Node.js 18+
- npm (this project standardizes on npm — there is a single `package-lock.json`, no other lockfiles)

## Local setup

```bash
git clone https://github.com/mgultekin/alphascreen-mna-pipeline.git
cd alphascreen-mna-pipeline
npm install
npm run dev        # http://localhost:3000 (hot reload)
```

No API key is required to start — click **Load sample results** in the UI, or paste a
Gemini key in the sidebar to run live. See the [README](README.md) for details.

## The golden rule for multi-machine work

**Pull before you start, push before you leave.**

```bash
git pull --rebase origin main    # before you begin editing
# ... make changes, then ...
git add -A
git commit -m "Describe the change"
git push origin main
```

- `--rebase` replays your local commits on top of the latest remote, keeping a linear
  history and surfacing conflicts immediately instead of creating noisy merge commits.
- The #1 cause of cross-agent conflicts is editing in two places without pulling in
  between. If you leave uncommitted work on one machine, the other won't see it — always
  **commit and push before switching environments**.

## Use branches for anything non-trivial

Keep `main` always working. For a feature or experiment:

```bash
git checkout -b feature/short-name
# ...work, commit...
git push -u origin feature/short-name
```

Then open a Pull Request on GitHub and merge when it's green. This is the safest pattern
when two agents/machines might touch the code around the same time.

## Environment & secrets

- Secrets are **never committed**. `.env.local` is git-ignored, so **each environment
  needs its own** (or just paste the key into the UI — the app is bring-your-own-key).
- `.env.local` is only an optional server-side fallback key for local dev:
  ```
  GEMINI_API_KEY=your_key
  ```
- Line endings are normalized to LF via `.gitattributes` — don't fight your editor over
  CRLF/LF; git handles it so Windows and Linux checkouts stay diff-clean.

## Build & deploy quick reference

```bash
npm run build      # → dist/ (frontend) + dist/server.mjs (server)
npm start          # runs the production server (node dist/server.mjs)
npm run lint       # tsc --noEmit (type-check only)
```

- Dev vs prod is decided by the `--dev` flag (set by `npm run dev`), not `NODE_ENV` —
  cross-platform, no shell env-prefix needed.
- The server reads `PORT` from the environment (hosts inject it); defaults to 3000.
- `vite` is loaded lazily in dev only, so production runs on production deps alone.

## Project structure

```
server.ts              Express API: Yahoo Finance + SEC EDGAR + Gemini, SSE streaming
src/App.tsx            Top-level UI state, screening orchestration, API-key handling
src/presets.ts         Sector playbooks + cross-sector thesis angles (add sectors here)
src/demoData.ts        Bundled sample results for keyless demo mode
src/components/         Sidebar, dashboard, results table, progress indicator
src/types.ts           Shared TypeScript types
docs/system_architecture.md   Deep-dive on the pipeline design
```
