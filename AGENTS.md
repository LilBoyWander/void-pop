# Void Pop Agent Contract

## Human authority

The human is the Project Developer, Product Owner, and Lead Systems Architect.
Only the human may approve changes to product scope, core game rules, architecture
boundaries, security exceptions, destructive operations, dependencies, or
release. Agents may propose these changes but must not silently implement them.

## Required starting context

Builder reads this file, `TEAM.md`, and root `intake.md` before routing work. A
delegated worker reads this contract, its bounded Kanban body, the linked feature
folder, and only the exact source or canonical sections named in the assignment.
Workers do not reread the complete project history or the long-form `void-pop.md`
unless Builder points to a specific section.

## Feature evidence

Each feature or initiative uses one folder:

`tasks/YYYY-MM-DDTHHMMSSZ__short-slug/`

The folder owns `intake.md`, `plan.md`, `changes.md`, `tests.md`, `security.md`,
`handoff.md`, `review.md`, `completion.md`, and optional files under `artifacts/`.
Implementation, remediation, testing, documentation, and QC work append to that
same folder.

## Scope and ownership

- Work only within the approved feature intake and plan.
- Record newly discovered work as a blocker, required follow-up, or optional
  improvement; do not smuggle it into the current diff.
- Builder alone decides whether findings amend the feature or enter backlog.
- Every implementation assignment names owned files or symbols.
- Do not edit another active task's files without explicit coordination and an
  ordering or reconciliation owner.

## Architecture and game invariants

- Void Pop is a client-only React/TypeScript browser game rendered with HTML5
  Canvas. React owns the surrounding UI; the engine owns simulation and canvas
  rendering.
- Keep simulation, input, collision, scoring, level configuration, rendering,
  and audio responsibilities explicit. Avoid moving game rules into JSX or CSS.
- Use frame-rate-independent simulation and preserve fair, readable collision
  behavior.
- Browser persistence is limited to non-sensitive local preferences and high
  score unless the human approves a new data boundary.
- Do not add a server, database, external service, dependency, public contract,
  or new authority model without human approval and an ADR.
- Preserve keyboard controls and responsive/touch behavior unless the approved
  feature explicitly changes them.

## Security and privacy

Never commit secrets, log tokens or sensitive payloads, trust unvalidated
external input, or disable safeguards to unblock work. Changes involving remote
content, accounts, network services, user-generated content, payments, or new
persistence trigger a security review. Ordinary local gameplay and presentation
changes record `security: not triggered` with a reason.

## Testing and human review

Every behavior change requires test analysis and actual command evidence.
Focused implementer checks come first. Once the integrated feature is ready:

1. The human reviews gameplay feel, product behavior, and subjective visuals.
2. After approval, `testing` runs one feature-level regression pass.
3. `docs` reconciles canonical truth and feature evidence.
4. `qc` performs one final audit.
5. `security` participates only when the feature changes a security boundary or
   addresses a vulnerability.

Automated checks do not replace human gameplay, feel, audio, or visual approval.
Never delete or weaken checks merely to obtain a pass.

## Shared development runtime

Void Pop uses one shared Vite process. Before starting `npm run dev`, check port
`5173` and reuse a healthy existing process. Do not launch duplicate servers.
Browser automation must be headless or background-only; do not open visible
windows on the human's desktop.

## Documentation

Completed features update applicable files under `docs/current/`, append one
entry under `docs/chronicle/YYYY/MM/`, add an ADR for approved architecture
changes, and complete their feature evidence. Claims must match source code and
observed results.

## Context and execution budget

- Prefer exact pointers and bounded context over copied documents.
- Use at most one implementation card per necessary ownership boundary.
- Reuse the same implementation card for in-scope fixes.
- Do not create separate gate chains for small fixes.
- Pause for human direction before more than three implementation runs or any
  material scope expansion.
- Reuse existing artifacts, servers, and verified evidence.

## Git and change control

- Never initialize, reconstruct, or repair Git metadata.
- Do not commit, push, merge, rewrite history, or release unless asked.
- Do not overwrite unrelated human changes.
- Keep diffs focused and disclose generated files and dependency changes.
- If Git evidence is unavailable, continue with direct file and test evidence
  and record the limitation.

## Communication

State facts, assumptions, evidence, blockers, and uncertainty plainly. Never
fabricate file contents, command output, test results, or completion status.
