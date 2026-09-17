# AGENT.md

Guidance for AI coding agents working in this repository.

## Response style

Be concise. Give the main point; if something needs clarification, the
user will follow up.

## What this project is

ezqueuez_me is a virtual-line app for small events at space-constrained
venues — attendees check in and track their place in line from their phone,
the host admits them in batches as space allows.

**Read [`.claude/product-concept.md`](.claude/product-concept.md) before
doing product or architecture work.** It carries the scope decisions,
functional requirements, and the governing principle that most often gets
violated by well-meaning design: the app is deliberately *not* an occupancy
authority. There is no departure signal, so it never computes how many
people are currently inside.

## Status

Scaffolding only — both halves build and run, but neither does anything real
yet. No HTTP server, storage, or API endpoints exist. Update the sections
below as real decisions land; don't leave them stale once there's code to
describe.

## Layout

The frontend and backend are deliberately separate, in one repo:

```
backend/    Go JSON API (module github.com/meeshic/ezqueuez_me/backend)
frontend/   React + Vite + TypeScript single-page app
```

They are separate builds and separate deploys. Nothing is shared between
them at build time — the API contract is the only coupling, so changes to it
have to be made on both sides in the same change.

## Commands

Backend (`cd backend`):

```bash
go build ./...          # build
go vet ./...            # static checks
go test ./...           # run tests
go run ./cmd/ezqueuez   # run the API
```

Frontend (`cd frontend`):

```bash
npm install             # first time
npm run dev             # dev server, proxies /api to localhost:8080
npm run build           # typecheck + production build
npm run lint            # oxlint
```

No CI or task runner yet — these commands are the whole workflow.

## Architecture

**Backend** is a placeholder entrypoint at `backend/cmd/ezqueuez/main.go`
(prints a hello-world line). Nothing real lives there yet. Intended shape
when it grows: domain packages under `backend/internal/`, with storage and
SMS behind interfaces so local dev and tests don't need a real database or a
real SMS provider.

**Frontend** routes are split by audience under `frontend/src/routes/`:
`attendee/` and `host/`. They are lazily imported in `App.tsx` so an
attendee's phone never downloads the host dashboard — keep that boundary
intact, and don't import host code outside it. `src/api/client.ts` is the
only place that talks to the backend.

**CORS**: dev avoids it entirely via the Vite proxy (`/api` →
`localhost:8080`). Production serves the two separately, so the backend will
need real CORS headers before the first deploy — easy to forget, since
nothing locally will tell you.

Prefer documenting the *why* behind non-obvious decisions over restating
what the code already shows.
