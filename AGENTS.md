# LEGORO development contract

- Preserve the Spanish content, existing visual identity and public contact-form contract. `lib/data.ts` is the current content truth; do not restore stale database or Turnstile code.
- Use Astro static output and Tailwind v4 Vite integration. Do not add Next/OpenNext, Cloudflare SSR adapters, sessions or runtime database dependencies.
- Only the contact form is a hydrated React island. Preserve static contact anchors, headings and form labels in generated HTML.
- Use Node24.14.1/npm11.12.1. Run `npm ci --ignore-scripts`, `npm run check`, `npm run build`, then `npm test` before review. Tests read built HTML; keep all regressions green.
- Preserve native normal/compact hCaptcha layouts, measured-container selection and generation-guarded callbacks/timeouts. Never scale/crop the iframe, hide branding, weaken verification or run real provider submissions/CAPTCHA solving without explicit approval.
- Deploy through Cloudflare Pages' native Git integration: build `npm run build`, output `dist`, Node24.14.1. Keep generated output, caches, AppleDouble files and environment/development secrets out of Git.
- Keep the existing production Worker unchanged until Pages is verified and a separate cutover is approved. Commit, push, PR creation, deployments, DNS/domain changes and credential access require the relevant explicit authorization.
