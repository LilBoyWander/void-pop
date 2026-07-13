---
name: void-pop-gameplay
description: Preserve Void Pop gameplay, Canvas, controls, and verification invariants.
version: 1.0.0
platforms: [windows, linux, macos]
metadata:
  hermes:
    category: game-development
    tags: [void-pop, canvas, gameplay, react]
---

# Void Pop Gameplay

Load this skill for any change to gameplay, Canvas rendering, controls, levels,
scoring, audio, responsive presentation, or game-state UI.

## Required context

Read the bounded task body, its feature intake/plan, and only the affected source
files. Use targeted sections of `void-pop.md`; it is not automatic scope approval.

## Invariants

1. React owns application UI/lifecycle; `GameEngine` owns simulation and Canvas
   rendering.
2. Simulation stays frame-rate independent and protects against large frame
   deltas. Preserve deterministic logic where practical.
3. Keep level progression data-driven through typed `LevelConfig` values.
4. Preserve fair collision hitboxes and readable warnings/effects.
5. Keep keyboard controls working; do not regress touch or responsive behavior
   when changing shared inputs/layout.
6. Avoid allocations and unbounded particle/projectile growth in hot paths.
7. Generated visuals and procedural audio must not introduce copyrighted assets.
8. Browser persistence remains limited to non-sensitive local state unless the
   human approves a new boundary.
9. Do not add dependencies, services, or game-rule scope without approval.
10. Subjective feel, difficulty, visuals, and audio require human play review.

## Focused verification

- Run `npm run lint` and `npm run build`.
- Add or run deterministic tests for extracted game rules when available.
- Use headless/background browser checks only for wiring and runtime errors.
- Provide a short human checklist for controls, feel, collision fairness, visual
  readability, responsive behavior, and audio when applicable.
- Record commands, actual results, and gaps in the shared feature folder.
