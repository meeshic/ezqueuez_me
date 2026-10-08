# AGENT.md

Guidance for AI coding agents working in this repository.

## Response style

Be concise. Lead with what's new; skip preamble and skip recapping work the
diff already shows. If something needs clarification, the user will follow
up.

## What this project is

A virtual-line app for small events at space-constrained venues — attendees
check in and track their place in line from their phone, the host admits
them in batches as space allows.

**Read [`.claude/product-concept.md`](.claude/product-concept.md) before
product or architecture work.** It holds the scope decisions, requirements,
and the principle well-meaning design keeps violating: the app is
deliberately *not* an occupancy authority. There's no departure signal, so
it never computes how many people are inside.

## Status

Scaffolding only. Both halves build and run; neither does anything real.
No HTTP server, storage, or endpoints yet. Keep the sections below current
as that changes.

## Layout

```
backend/    Go JSON API (module github.com/meeshic/ezqueuez_me/backend)
frontend/   React + Vite + TypeScript SPA
```

Separate builds, separate deploys, nothing shared at build time. The API
contract is the only coupling, so changes to it land on both sides in the
same change.

## Commands

From `backend/`:

```bash
go build ./... && go vet ./... && go test ./...
go run ./cmd/ezqueuez   # the API
```

From `frontend/`:

```bash
npm install             # first time
npm run dev             # dev server; proxies /api to localhost:8080
npm run build           # typecheck + build
npm run lint            # oxlint
```

No CI or task runner yet.

## Architecture

**Backend**: `backend/cmd/ezqueuez/main.go` is a hello-world placeholder.
Intended shape as it grows — domain packages under `backend/internal/`, with
storage and SMS behind interfaces so dev and tests need neither a real
database nor a real SMS provider.

**Frontend**: routes split by audience under `frontend/src/routes/` —
`attendee/` and `host/`, lazily imported in `App.tsx` so an attendee's phone
never downloads the host dashboard. Keep that boundary; don't import host
code outside it. `src/api/client.ts` is the only place that talks to the
backend.

**CORS**: dev sidesteps it via the Vite proxy. Production serves the two
separately, so the backend needs real CORS headers before the first deploy —
easy to miss, since nothing local will tell you.

Document the *why* behind non-obvious decisions, not what the code shows.
