# Security

## Current boundary

Void Pop is a static client-only game. It has no authentication, backend, remote
API, user-generated content, payment flow, or secrets. Browser persistence is
limited to a numeric local high score.

## Controls

- Do not commit credentials or environment secrets.
- Do not introduce dynamic HTML execution for game or UI content.
- Treat future remote data and URLs as untrusted and validate at their boundary.
- Keep dependencies minimal and require human approval for additions.
- Do not claim localStorage provides integrity or authoritative scoring.

## Review trigger

Security review is required if a feature adds or changes network access,
accounts, remote content, user-generated content, payments, sensitive data,
external integrations, persistence beyond local preferences, or addresses a
vulnerability. Local gameplay/presentation work normally records that security
review was not triggered and why.
