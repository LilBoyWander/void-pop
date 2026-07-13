# Architecture

## Runtime

Void Pop is a static Vite application using React, TypeScript, HTML5 Canvas, CSS,
and browser Web Audio/localStorage APIs. There is no backend or remote service.

## Components

- `src/main.tsx`: React entry point
- `src/App.tsx`: surrounding UI, HUD, overlays, fullscreen, and engine reference
- `src/components/GameCanvas.tsx`: Canvas lifecycle and input bridge
- `src/components/VirtualStick.tsx`: touch movement control
- `src/game/GameEngine.ts`: game state, fixed-step simulation, collisions,
  scoring, rendering, and transitions
- `src/game/levels.ts`: typed sector configuration and ball constants
- `src/game/types.ts`: gameplay and HUD contracts
- `src/game/audio.ts`: procedural browser audio
- `src/styles.css`: responsive presentation

## Data and control flow

React creates the Canvas integration and receives HUD/hint snapshots through
callbacks. Input events call the engine. `requestAnimationFrame` drives rendering
while a 120 Hz fixed-step accumulator advances simulation with a clamped delta.
Levels are local typed configuration. High score is stored in localStorage.

## Boundaries and invariants

React owns UI/lifecycle; the engine owns gameplay and Canvas rendering. Game
rules must not depend on CSS layout. Level behavior remains data-driven. Fair
collision geometry is allowed to be smaller than visible art. No network trust
boundary exists.

Adding a server, database, external integration, dependency, public contract, or
new persistence/authority boundary requires human approval and an ADR.
