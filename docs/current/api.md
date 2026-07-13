# API

Void Pop currently exposes no HTTP, WebSocket, or public package API.

Internal boundaries consist of TypeScript interfaces in `src/game/types.ts`,
the `GameEngine` methods used by React/input components, and callback snapshots
for HUD/hint updates. These are internal implementation contracts and may change
within an approved feature with focused regression analysis.

Any remote or public API requires explicit human approval, an ADR, validation at
the trust boundary, security review, and updated operations/data documentation.
