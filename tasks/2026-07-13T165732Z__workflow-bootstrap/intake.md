# Feature Intake: Workflow Bootstrap

## Goal and why it matters

Establish a self-contained, lightweight version of the existing feature-level
Builder workflow before further Void Pop development.

## Context

The repository contained a playable React/TypeScript/Canvas game and long-form
`void-pop.md`, but no root operating contract, team routing file, project intake,
canonical documentation, feature evidence template, README, or project skill.

## In scope

- Root project/workflow context
- Role and gate definitions
- Canonical current-truth documentation
- Feature evidence templates
- One Void Pop gameplay skill
- README and ignore rules

## Out of scope

Gameplay/source changes, dependency changes, Git index cleanup, test-framework
introduction, deployment, and production release.

## Acceptance criteria

- [x] Builder context exists at `AGENTS.md`, `TEAM.md`, and `intake.md`.
- [x] Current product, architecture, design, security, testing, operations, data,
  and API truth is indexed under `docs/`.
- [x] `tasks/_template/` contains the full shared feature evidence set.
- [x] A project-specific gameplay skill records implementation invariants.
- [x] Runtime and verification commands are documented without fabricated tests.
- [ ] Human accepts the workflow as the baseline for future work.

## Constraints and invariants

No production code, dependencies, history, or unrelated existing changes may be
modified. Preserve the client-only architecture and feature-level gate policy.

## Ownership

Builder owns the workflow/documentation files created by this bootstrap.

## Security trigger

Not triggered: documentation and local workflow scaffolding only.

## Definition of complete

Files exist, links resolve, documented npm checks are run, the diff is reviewed,
and the human receives a concise summary and notes any pre-existing workspace
changes.
