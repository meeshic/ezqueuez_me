# ezqueuez_me — product concept

Working document. Update as decisions land; don't leave stale claims here.

## What this is

A virtual-line / reservation app for small events at space-constrained
venues. Today those venues typically need 2+ employees to manage the line
and reservations by hand alongside the venue's own homebrew/ad-hoc system.
The goal is a phone-based system that streamlines this for both attendees
(joining and tracking their place in line from their phone) and the host
(managing flow into the venue with less manual overhead).

Closest existing comparison: Yelp's reservation/waitlist feature.

## Guiding principle: the app is not an occupancy authority

There is deliberately **no departure signal**. For the target case — e.g. a
store holding an event, people flowing in and out — it isn't practical to
detect when someone leaves. So the app never computes or claims to know how
many people are currently inside.

The host supplies the judgment ("the room looks empty enough for about ten
more"). The app supplies fair ordering, the attendance record, and the
notification channel.

Avoid designing features that assume the system knows the true headcount
inside — live occupancy counters, capacity math, auto-admit-when-space-frees.
All of them would quietly lie to the host.

## Scope decisions

**Single venue for now**, not multi-tenant. Don't build a venue/org
abstraction prematurely; generalize later if this works.

**Notifications are SMS.** Attendees need no account and no app install to
receive updates. Implies an SMS provider dependency (e.g. Twilio), which
should sit behind an interface so local dev and tests don't hit a real API.

**Tickets are imported, not sold.** Ezqueuez does not issue or sell
tickets. The attendee roster originates from a third-party platform
(Eventbrite and the like); this app ingests and tracks it.

**Import is manual CSV upload** for now — deliberately chosen as a
platform-independent fallback rather than integrating any one vendor's API
first. If an Eventbrite/API/webhook integration comes later, it should land
on the same internal ingest path rather than a parallel one.

**Admission gating is optional, per host.** Some venues are
space-constrained and want to admit in controlled batches; others just want
check-in tracking with everyone admitted on arrival. The queue itself — not
just the gate — is the optional part. Check-in plus the roster is the
foundation; queueing and notification layer on top for hosts who enable it.

## Functional requirements

- **Host imports tickets** from a third party via CSV upload.
- **Host admits attendees** in batches sized by their own judgment of
  available space. Admitting by gate is optional depending on the venue.
- **Attendee checks in day-of** via QR code or a check-in code (the code
  being the fallback when scanning isn't possible), tied to their imported
  ticket.
- **Attendee checks their place in line** from their phone.
- **Attendee is notified** (SMS) when they can enter the venue.

## Flow

    imported ticket
        → arrival check-in (QR or code)   ← attendee joins the line
        → waiting, can see position
        → host admits a batch of N
        → SMS: "you can come in"
        → entry check-in (QR or name)     ← confirms they actually entered
        → inside

**Admission is by count, with an escape hatch.** The primary host action is
"admit the next N" — the host says how much room they have and the app picks
the next N in line. Individual/specific admit stays available for the real
cases that need it (a party of four who arrived together, accessibility or
VIP considerations), but the common path must be one easy action.

**Entry check-in is the "they came in" signal.** Because there's no
departure signal, an admitted attendee who wanders off would otherwise waste
their slot invisibly. A second verification at the door — QR or name — closes
that loop: if someone never completes entry check-in, the host can see the
admit didn't land and admit someone else. This is also the only count the
app can state honestly: how many people have actually entered.

## Open questions

- Exact scan mechanics at both check-in moments: who scans whom (staff
  scanning attendee phones vs. attendees scanning a venue-posted code), and
  whether arrival and entry check-in use the same mechanism.
- No-show handling specifics: is there a grace period before an admitted
  attendee is considered to have forfeited, or is it purely a host-initiated
  "admit another"?
- Whether party size travels with an imported ticket, and whether it's
  reconfirmed at check-in.

## Technical direction

**Frontend and backend are separate** — a Go JSON API under `backend/`, a
React + Vite + TypeScript app under `frontend/`, in one repo but built and
deployed independently. This was a deliberate choice over the simpler
single-binary, server-rendered alternative first proposed; it costs CORS
setup, two deploy artifacts and an API contract to maintain, and buys a
conventional frontend stack and a path to a native app later.

The frontend is one app, route-split by audience, so an attendee's phone
doesn't download the host dashboard.

Still undecided: storage (SQLite is the leading candidate — single venue,
low concurrency, no separate DB server to run), and the live-update
mechanism for queue position (SSE is the leading candidate over WebSockets,
since updates only need to flow server→client). Store and SMS should both
sit behind interfaces so local dev and tests don't need real infrastructure.

See AGENT.md for the current state of the actual codebase.
