# Void Pop Team and Feature Graph

## Human

### Project Developer, Product Owner, and Lead Systems Architect

Final authority for product direction, game rules, architecture, security risk,
destructive changes, dependencies, visual/gameplay acceptance, and release.

## Hermes profiles

### `builder`

Human-facing orchestrator. Owns project context, feature intake, planning,
dependencies, bounded delegation, gate sequencing, and final synthesis. Builder
does not normally own production implementation.

### `frontend`

Primary implementation owner for this client-only game. Owns React UI, Canvas
gameplay, controls, accessibility, responsive behavior, audio presentation,
visual fidelity, and focused frontend checks.

### `testing`

Owns independent deterministic regression checks, type/build/lint verification,
and narrow headless browser checks. It does not replace human playtesting.

### `docs`

Owns canonical documentation reconciliation, append-only history, ADR indexing,
and consistency between implementation and evidence.

### `qc`

Independent completion gate. Audits scope, diff, evidence, tests, documentation,
security status, and definition of done.

### Conditional specialists

- `security`: only when a feature changes a security/trust boundary or fixes a
  vulnerability.
- `backend`: only after human approval introduces server-side behavior.
- `systems`: only after human approval introduces data services, deployment
  integrations, third-party APIs, or persistent infrastructure.

## Feature lifecycle

```text
Human goal
    |
Builder intake + plan
    |
Frontend implementation and in-scope fixes
    |
Integrated feature ready
    |
Human gameplay/product/visual review
    |
Testing regression pass
    |
Security review only if triggered
    |
Documentation reconciliation
    |
QC audit
    |
Builder synthesis -> Human decision
```

## Routing rules

- Game engine, Canvas, React, CSS, controls, audio, accessibility -> `frontend`
- Independent automated verification -> `testing`
- Current truth, evidence reconciliation, history, ADR index -> `docs`
- Completion audit -> `qc`
- Threat analysis -> `security` only when triggered
- Decomposition and coordination -> `builder`

The graph runs once per feature. Related fixes share one intake, implementation
loop, human review, and evidence folder. Testing, docs, and QC start only after
human approval of the integrated feature.
