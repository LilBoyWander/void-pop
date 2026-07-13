# Void Pop Project Intake

This is Builder's project-level baseline for scope checks and delegation.
Workers receive bounded task bodies and exact source/document pointers rather
than this entire file when the relevant invariants can be stated locally.

## Product

**Void Pop** is a polished, short-session, dark-space browser arcade game. The
player moves horizontally along the bottom of a Canvas arena, fires vertical
shots, avoids bouncing hazards, and clears sectors by splitting and destroying
all hostile spheres.

## Product promise

Deliver responsive, readable bounce-and-shoot gameplay with escalating chaos,
fair collisions, concise sci-fi presentation, and no heavy game engine.

## Approved current scope

The repository currently implements a client-only playable game with:

- React, TypeScript, Vite, and HTML5 Canvas;
- start, play, pause, hit, level-clear, game-over, victory, and restart states;
- keyboard movement and shooting plus touch movement/fire controls;
- five configured sectors with ball splitting, platforms, hazards, and a shooter
  ball in later progression;
- score, combo, accuracy, lives, timer contribution, and local high score;
- generated Canvas visuals, particles, screen shake, responsive presentation,
  fullscreen support, and procedural Web Audio.

The long-form concept and design source is `void-pop.md`. It is reference
material, not automatic approval for additional scope.

## Explicitly out of scope without human approval

- Accounts, cloud saves, leaderboards, multiplayer, matchmaking, monetization,
  analytics, ads, or social systems.
- A backend, database, remote API, content service, or deployment platform.
- Heavy game engines or copyrighted characters, art, music, or sound.
- New dependencies, major game modes, broad progression systems, or a redesign
  of the core control scheme.
- Native mobile packaging or console distribution.

## Primary flow

1. Open the game and read controls.
2. Start with Space or the start action.
3. Move left/right, fire upward, avoid balls and hazards, and clear each sector.
4. Lose lives on contact, recover with a brief invulnerability window, and
   continue until victory or game over.
5. Review score/accuracy and restart; retain the local high score.

## Current implementation baseline

| Area | Current implementation |
|---|---|
| UI | React components in `src/App.tsx` and `src/components/` |
| Game | Imperative Canvas engine in `src/game/GameEngine.ts` |
| Configuration | Typed levels and constants in `src/game/levels.ts` |
| Audio | Procedural browser audio in `src/game/audio.ts` |
| Styling | `src/styles.css` |
| Persistence | Browser `localStorage` high score only |
| Runtime | One shared Vite process, normally port 5173 |
| Verification | `npm run lint`, `npm run build`; no automated test script exists yet |
| Deployment | Static Vite build in `dist/`; production hosting is not defined |

## Architectural invariants

- React owns surrounding UI and lifecycle; the engine owns simulation and
  Canvas rendering.
- Simulation uses a fixed update step behind `requestAnimationFrame` and clamps
  large frame deltas.
- Level behavior remains data-driven through typed `LevelConfig` entries.
- Ball collisions are circular; player collision remains intentionally fairer
  than the visible shape.
- Game rules do not depend on DOM layout or CSS.
- No remote authority or sensitive data boundary exists.
- Use one reusable development server and headless/background automation only.
- Do not add dependencies, services, persistence, or scope without approval.

## Current objective

Establish a self-contained, feature-level engineering workflow for Void Pop.
After this bootstrap, future work should begin with one feature intake and plan,
then follow implementation -> human review -> testing -> docs -> QC.

## Project-level success criteria

- The production build loads as a playable browser game without runtime errors.
- Controls, state transitions, collision behavior, scoring, and local high score
  remain coherent and responsive.
- `npm run lint` and `npm run build` pass for releasable changes.
- Behavior changes include deterministic automated coverage where practical;
  gaps are recorded rather than hidden.
- The human approves gameplay feel, difficulty, audio, and subjective visuals.
- Canonical documentation and feature evidence match observed behavior.

## Context sources

- `AGENTS.md` — operating contract.
- `TEAM.md` — ownership and feature gates.
- This `intake.md` — approved project baseline.
- Assigned Kanban body and linked task folder — bounded task truth.
- `docs/current/` — concise implemented truth.
- `void-pop.md` — long-form product/design reference; use targeted sections.
- `.skills/void-pop-gameplay/SKILL.md` — game-specific implementation invariants.

## Human-owned decisions

Human approval is required for product or game-rule scope changes, architecture
boundaries, dependencies, persistence or network services, security exceptions,
destructive operations, production release, and subjective gameplay/visual/audio
acceptance. No other decision blocks the workflow bootstrap.
