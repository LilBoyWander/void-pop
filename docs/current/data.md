# Data

Void Pop has no database and no server-side persistence.

## Local state

- In-memory engine state: phase, player, balls, projectiles, particles, level,
  score, combo, timing, and controls
- React state: HUD snapshot, hints, and fullscreen presentation
- Browser persistence: `void-pop-high-score` in localStorage as a numeric string

The high score is convenience state, not trusted or tamper-resistant data.
Adding cloud saves, accounts, analytics, leaderboards, or other persistent data
requires human approval, architecture documentation, and security review.
