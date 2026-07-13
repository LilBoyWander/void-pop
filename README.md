# Void Pop

A dark-space arcade game built with React, TypeScript, Vite, and HTML5 Canvas.
Move along the bottom of the arena, fire upward, split hostile spheres, and clear
all sectors without losing every life.

## Requirements

- Node.js and npm

## Run locally

```sh
npm install
npm run dev
```

Reuse an existing healthy Vite process on port 5173 rather than starting a
second development server.

## Controls

- `A` / `D` or Left / Right Arrow: move
- `Space`: start, fire, or restart
- `Escape`: pause/resume
- `M`: mute/unmute
- Touch controls are available on supported layouts.

## Verification

```sh
npm run lint
npm run build
```

There is currently no automated test script. Feature work must record that gap
or add focused deterministic coverage when behavior warrants it.

## Project workflow

Start with `AGENTS.md`, `TEAM.md`, and root `intake.md`. Canonical project truth
lives under `docs/current/`; each feature keeps one evidence folder created from
`tasks/_template/`.
