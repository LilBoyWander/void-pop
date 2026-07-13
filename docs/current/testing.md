# Testing

## Current automated commands

```sh
npm run lint
npm run build
```

`npm run build` performs TypeScript project compilation and a Vite production
build. The project currently has no `test` script or dedicated test suite; this
is a known gap, not a passing test claim.

## Feature expectations

Implementers run focused checks while building. After human acceptance, the
`testing` profile runs one feature-level regression pass. Deterministic game
rules should be extracted and unit tested when practical. Headless browser checks
may verify startup, controls wiring, state overlays, responsiveness, and runtime
errors.

## Human verification

The human evaluates gameplay feel, difficulty, collision fairness, visual
readability, responsive controls, fullscreen behavior, and audio. Record actual
commands, results, environment, and gaps in the feature's `tests.md`.
