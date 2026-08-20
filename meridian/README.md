# SlowMail

Messages that arrive when the moment does, not the instant you hit send.

Delivery is governed by real elapsed wall-clock time. Every message stores a
creation timestamp and an intended delivery timestamp, and its state is derived
by comparing those values against the current time. Refreshing or reopening the
browser does not reset a message timer.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

The build outputs a static site to `dist/`.

## Deploy to Cloudflare Workers

The repository root is already configured to build this folder through
`npm run build` and deploy `meridian/dist` through Wrangler.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Wrangler config: `../wrangler.jsonc`

## Demo authentication

Authentication and persistence are currently a browser-only demo layer backed by
`localStorage` in `src/lib/auth.ts` and `src/lib/store.ts`.

- Demo account: username `you`, password `slow`.
- Sign up creates a local account.
- Messages and sessions remain in the current browser.

Passwords are stored in plain text locally. This is intentionally suitable only
for a prototype or private demo. It must be replaced with real server-backed
authentication before using SlowMail for real users or private conversations.

## How slow delivery works

Centralised in `src/lib/timing.ts`. There is no `setTimeout` that reveals a
message. Instead:

1. On send, the message stores `createdAt` and `deliverAt`.
2. A once-per-second clock provides the current time.
3. Message visibility and status are derived from timestamps.
4. Data persists in `localStorage`, so refreshing the browser does not reset a timer.

The composer provides four deliberate delivery cadences: Soon, 1h, This
evening, and Tomorrow.

## Structure

```text
src/
  lib/        types, localStorage store, timing logic, auth, demo seed
  hooks/      useNow clock
  components/ AuthScreen, Sidebar, Conversation, MessageBubble, Composer, …
  App.tsx     responsive application shell
```

The data layer is kept separate from the UI so it can later be replaced by a
real backend without rewriting the interaction layer.
