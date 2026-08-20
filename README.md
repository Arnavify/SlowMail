# SlowMail

SlowMail is a messaging app built around the anticipation of waiting. Messages do not appear instantly. They arrive after a deliberate delay, giving conversations more time and less pressure.

## Current build

The web app is a Vite + React single-page application in `meridian/`. It currently uses local browser storage for its demo data and authentication.

That local storage layer is suitable for a prototype or private demo, but it is **not production-grade authentication or multi-user storage**. Passwords are stored in the browser in plain text, and data is isolated to each browser. Do not treat the current auth layer as secure for real users.

## Cloudflare Workers

The repository is configured for Cloudflare Workers static assets.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Static output: `meridian/dist`
- SPA fallback: enabled in `wrangler.jsonc`

The root build script installs the `meridian` dependencies and creates the production Vite build.

## Local development

```bash
cd meridian
npm install
npm run dev
```

Production build:

```bash
cd meridian
npm install
npm run build
npm run preview
```

## Before a real public launch

Replace the demo `localStorage` auth and message store with a real backend such as Supabase. The current client-side auth must not be used for accounts or private conversations between real users.
