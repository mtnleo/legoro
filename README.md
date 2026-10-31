# LEGORO

Static Astro website for LEGORO, preserving the Spanish content, visual identity, nine services and three team entries. The contact form is the only hydrated React island.

## Local workflow

Use Node `24.14.1` (`.nvmrc`) and npm `11.12.1`:

```sh
npm ci --ignore-scripts
npm run check
npm run build
npm test
npm run preview -- --port 4321
```

Build before testing: the regression tests include contact validation/transport, native CAPTCHA layout selection and guarded provider lifecycle, plus checks against generated HTML. Preview binds to loopback. No live provider submission or CAPTCHA solving is part of automated verification.

## Architecture

- Astro emits static `/`, `/privacidad/` and `404.html` into `dist/`. Do not add an SPA fallback, server adapter, sessions or Worker entrypoint.
- Tailwind v4 uses its Vite integration. Four pinned Fontsource variable-font packages serve fonts locally with `font-display: swap`. Images remain local; AppleDouble metadata is excluded.
- `lib/data.ts` is the current content source. Static contact anchors, heading and form labels exist before JavaScript. `ContactForm.tsx` uses `client:load` to avoid early-interaction delays.
- Contact validation, retry/value retention, in-flight protection and a 15-second request timeout remain. Web3Forms receives the public provider key, business fields, honeypot and hCaptcha token directly. These public keys are not server credentials.
- hCaptcha uses its native normal layout when the measured container is at least 304px wide and compact below it. No iframe stretching or scaling. Layout changes invalidate prior tokens; generation guards ignore stale callbacks and load deadlines.
- Mobile navigation uses real anchors, dialog focus handling and a contact-aware sticky CTA. CSS motion respects reduced-motion preferences.

## Cloudflare Pages via GitHub

Connect this repository using Pages' native Git integration. Review a preview deployment before production cutover.

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Root directory | Repository root |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | `24.14.1` (`.nvmrc`; set `NODE_VERSION=24.14.1` explicitly if needed) |

No Cloudflare SSR adapter, deployment CLI, server secrets or runtime database is required. Keep environment files, development variables, caches and generated output out of Git. Dependency lifecycle behavior must remain audited when updating the lockfile.

**The existing production Worker stays active until the Pages deployment is verified and a separate cutover is approved.** Do not delete the Worker, change DNS or connect a production domain as part of source preparation. Preview acceptance must cover navigation, privacy/404 routes, contact layout on mobile/desktop, and provider loading without real submissions unless explicitly authorized.

Reference: [Cloudflare Astro guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/), [Pages build image](https://developers.cloudflare.com/pages/configuration/build-image/).
