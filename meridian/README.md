# Meridian — a slow messaging app

Messages that arrive when the moment does, not the instant you hit send.
Delivery is governed by **real elapsed wall-clock time**: every message stores a
creation timestamp and an intended delivery timestamp, and its state is derived
by comparing those against the current time. Close the tab, reopen it hours
later — the timing is exactly where it should be.

## Run locally

```bash
pnpm install     # or npm install
pnpm dev         # Vite dev server
```

## Build (static production output)

```bash
pnpm build       # outputs a self-contained static site to ./dist
pnpm preview     # serve ./dist locally to verify the static build
```

The `dist/` folder is a plain static site — HTML/CSS/JS only, no Node server or
environment variables required.

## Deploy to Cloudflare Pages

- **Build command:** `pnpm build` (or `npm run build`)
- **Build output directory:** `dist`
- **Framework preset:** Vite

Or upload the contents of `dist/` directly via the Cloudflare Pages dashboard /
`wrangler pages deploy dist`.

## Demo authentication

Auth is a lightweight, static/demo-only system backed by `localStorage`
(`src/lib/auth.ts`). No backend, no environment variables.

- **Demo account:** username `you`, password `slow` (or tap “Try the demo”).
- Sign up creates a new local account; log out clears the session.

> Passwords are stored in plain text in the browser for the demo. This layer is
> intentionally swappable for a real auth provider.

## How slow delivery works

Centralised in `src/lib/timing.ts`. There is **no `setTimeout` that reveals a
message.** Instead:

1. On send, the message stores `createdAt` and `deliverAt` (`createdAt + delay`).
2. A once-per-second clock (`useNow`) provides the current time.
3. `statusOf()` / `isVisibleTo()` derive `sending → waiting → delivered → read`
   purely from timestamps vs. now.
4. All messages persist in `localStorage`, so refreshing or reopening the tab
   never resets a timer.

Senders can pick a delivery cadence in the composer (Soon, 1h, This evening,
Tomorrow).

## Structure

```
src/
  lib/        types, localStorage store, timing logic, auth, demo seed
  hooks/      useNow (ticking clock)
  components/ AuthScreen, Sidebar, Conversation, MessageBubble, Composer, …
  App.tsx     composition + responsive shell
```

The data layer (`src/lib/store.ts`) is the only code that touches storage, so it
can be replaced with a real backend without rewriting the UI.
