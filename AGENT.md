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

Go module is initialized (`github.com/meeshic/ezqueuez_me`, go1.27.0) with a
placeholder entrypoint — just enough to confirm the toolchain builds and
runs. No web framework, storage, or frontend has been chosen yet. Update the
sections below as real decisions land — don't leave them stale once there's
code to describe.

## Commands

```bash
go build ./...          # build everything
go vet ./...            # static checks
go test ./...           # run tests
go run ./cmd/ezqueuez   # run the app
```

No CI, linter beyond `go vet`, or task runner yet — plain `go` commands are
the whole workflow for now.

## Architecture

`cmd/ezqueuez/main.go` is a placeholder entrypoint (prints a hello-world
line) — nothing real lives here yet. Replace this note with the actual
module layout, storage, and external services once they exist; prefer
documenting the *why* behind non-obvious decisions over restating what the
code already shows.
