# Operations

## Local development

Install dependencies with `npm install`, then run `npm run dev`. Use one shared
Vite process, normally on port 5173; check and reuse a healthy process before
starting another.

## Build

Run `npm run build`. Vite emits the static production bundle to `dist/`.
Production hosting, domains, telemetry, rollback automation, and release policy
are not currently defined.

## Runtime dependencies

The game requires a modern browser with Canvas, requestAnimationFrame,
localStorage, Fullscreen API (optional), screen-orientation locking (optional),
and Web Audio (optional/user activated). Unsupported optional APIs degrade
without becoming game authority.

Do not perform production deployment or destructive cleanup without human
approval and an explicit recovery plan.
