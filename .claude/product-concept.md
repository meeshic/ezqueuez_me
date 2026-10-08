# ezqueuez_me — product concept

Working document. Update as decisions land; don't leave stale claims here.

## What this is

A virtual-line app for small events at space-constrained venues. Today such
venues run the line and reservations by hand, typically 2+ staff plus a
homebrew system. This replaces that with something attendees drive from
their phone and the host runs from one dashboard.

Closest comparison: Yelp's reservation/waitlist feature.

## Guiding principle: not an occupancy authority

There is deliberately **no departure signal** — for a store-style event with
people flowing in and out, departures aren't practically detectable. So the
app never claims to know how many people are inside. The host judges
available space; the app supplies ordering, the attendance record, and
notification.

Don't build live occupancy counters, capacity math, or
auto-admit-when-space-frees. All three would quietly lie to the host.

## Requirements and the decisions behind them

**Host imports tickets via CSV upload.** Ezqueuez doesn't sell or issue
tickets; the roster comes from a third-party platform (Eventbrite and the
like). CSV was chosen over any one vendor's API as a platform-independent
fallback — a later API/webhook integration should land on the same internal
ingest path, not a parallel one.

**Host admits attendees in batches** sized by their own read of the room.
Gating is optional per host: space-constrained venues admit in controlled
batches, roomier ones admit everyone on arrival. The queue itself, not just
the gate, is the optional part — check-in plus the roster is the foundation;
queueing and notification layer on top.

**Attendee checks in day-of** via QR code, or a typed check-in code as the
fallback when scanning won't work. Either way it ties them to their imported
ticket.

**Attendee sees their place in line** from their phone.

**Attendee is notified by SMS** when they can enter. SMS specifically so no
account or app install is needed. Implies an SMS provider (e.g. Twilio)
behind an interface, so dev and tests don't hit a real API.

**Single venue for now**, not multi-tenant. Don't build a venue/org
abstraction yet.

## Flow

    imported ticket
        → arrival check-in (QR or code)   ← joins the line
        → waiting, can see position
        → host admits a batch of N
        → SMS: "you can come in"
        → entry check-in (QR or name)     ← confirms they actually entered
        → inside

**Admission is by count**, with individual admit as an escape hatch for
parties arriving together and accessibility/VIP cases. The common path has
to be one easy action.

**Entry check-in is the "they came in" signal.** Without it, an admitted
attendee who wandered off wastes their slot invisibly. It's also the only
count the app can state honestly.

## Open questions

- Scan mechanics at both check-in moments: who scans whom (staff scanning
  attendee phones vs. attendees scanning a posted code), and whether arrival
  and entry use the same mechanism.
- No-show handling: a grace period, or purely host-initiated "admit another"?
- Whether party size travels with an imported ticket, and whether it's
  reconfirmed at check-in.

## Technical direction

**Frontend and backend are separate** — Go JSON API in `backend/`, React +
Vite + TypeScript in `frontend/`, one repo, independent builds and deploys.
Chosen over a single server-rendered binary: costs CORS, two deploys and an
API contract; buys a conventional frontend stack and a path to a native app.
The frontend is route-split by audience so an attendee's phone doesn't
download the host dashboard.

Undecided: storage (SQLite leading — single venue, low concurrency, no DB
server to run) and live queue updates (SSE leading over WebSockets, since
updates only flow server→client). Storage and SMS both behind interfaces.

See AGENT.md for the state of the actual codebase.
