You are a senior frontend game developer and game designer. Build a polished web-based arcade mini-game with the working title **Void Pop**.

The game should be a clean, professional, dark space-themed arcade game inspired by classic bounce-and-shoot mechanics.

## Core Concept

A player character moves left and right along the bottom of the screen while dangerous bouncing balls move around the play area. The player can only shoot directly upward. The goal is to survive as long as possible and pop all bouncing balls without getting hit.

When a ball is popped, it splits into smaller balls. Smaller balls are faster and harder to avoid. The player clears a level by destroying every ball on screen.

## Tech Requirements

Build this as a modern web game using:

* Vite
* React
* TypeScript
* HTML5 Canvas for the actual game rendering
* CSS or Tailwind for the surrounding UI if needed

Keep the code clean, modular, and easy to expand. Do not use a heavy game engine. The game should run smoothly in a browser.

Organize the project with clear files for:

* Game loop
* Player
* Balls
* Projectiles
* Collision detection
* Levels
* Scoring
* Rendering
* Input handling
* UI screens

## Gameplay

The player is positioned near the bottom of the screen.

Controls:

* Left arrow / A = move left
* Right arrow / D = move right
* Spacebar = shoot upward
* Optional: support touch/mobile controls later, but keyboard is priority for the first version

Player behavior:

* Player can move left and right only
* Player cannot jump
* Player cannot shoot diagonally
* Player fires a vertical energy shot directly upward
* Only one or two shots should be allowed on screen at once at the start
* The player dies if touched by a ball or enemy projectile

Ball behavior:

* Balls bounce around the screen with simple arcade physics
* Balls bounce off the left wall, right wall, ceiling, floor, and later obstacles
* Balls are affected by gravity so they arc naturally
* Balls should feel lively and dangerous, not floaty
* When hit by a player projectile, a ball pops and splits

Ball size progression for Level 1:

* 1 big ball
* Big ball splits into 2 medium balls
* Each medium ball splits into 2 small balls
* Each small ball splits into 2 tiny balls
* Tiny balls disappear when popped

So Level 1 starts with 1 big ball and eventually becomes 8 tiny balls before the level is cleared.

## Levels and Difficulty

Create a level system that can scale over time.

Level 1:

* One big ball
* No hazards
* No walls except screen boundaries
* Simple clean introduction to the mechanic

Level 2:

* More than one starting ball or faster ball speed
* Slightly faster bounce behavior

Level 3:

* Add static walls or platforms that balls can bounce off
* Player must position carefully

Level 4:

* Add hazards such as laser zones, asteroid chunks, or electric floor panels
* Hazards should be readable and avoidable

Level 5 and beyond:

* Some balls begin to fight back
* Certain ball types can shoot small projectiles downward or diagonally after a delay
* Enemy projectiles should be slower than player shots and visually distinct
* Do not overwhelm the screen too early

Difficulty should increase through:

* More balls
* Faster balls
* More wall geometry
* More hazards
* Enemy ball projectile behavior
* Shorter safe windows
* Higher split chaos

## Scoring

The player earns score by:

* Surviving longer
* Popping balls
* Clearing levels
* Bonus points for clearing a level quickly
* Bonus points for accuracy or streaks if easy to implement

Display:

* Current score
* Current level
* Lives or health
* High score stored locally with localStorage

The longer the player lasts, the higher the score should climb. Survival time should matter, not just ball pops.

## Game States

Implement these game states:

1. Start screen
2. Playing
3. Level cleared
4. Player hit / life lost
5. Game over
6. Restart

Start screen should show:

* Game title
* Short instructions
* “Press Space to Start”

Game over screen should show:

* Final score
* Highest score
* Level reached
* Restart instruction

## Visual Direction

Create a dark space theme with professional polish while keeping the game clean and readable.

Style:

* Dark navy / black space background
* Subtle parallax stars
* Soft nebula gradients
* Glowing balls
* Energy projectile effects
* Clean sci-fi UI
* Smooth animations
* Simple but polished player character or ship/astronaut silhouette

The game should look professional, not childish. Avoid clutter. The screen should remain readable even when many balls are active.

Visual hierarchy:

* Player should be clearly visible
* Balls should be bright and readable
* Projectiles should be sharp and distinct
* Hazards should be obvious
* Background should look good but stay subtle

Suggested visual elements:

* Glowing orb balls with shaded spherical highlights
* Different colors by ball size
* Soft bloom-like glow using canvas gradients
* Particle burst when balls pop
* Tiny star particles on impact
* Smooth player movement
* Muzzle flash when shooting
* Screen shake lightly when a large ball pops
* Level transition animation

Keep effects optimized and do not overdo particles.

## Ball Types

Start simple, but structure the code so these can be added:

Normal Ball:

* Bounces
* Splits when popped

Heavy Ball:

* Slower
* Larger
* More dangerous
* Maybe needs multiple hits later

Volatile Ball:

* Splits more aggressively
* Creates a bigger pop effect

Shooter Ball:

* Introduced later
* Periodically fires enemy projectiles
* Has a visible charge-up animation before shooting

Do not add every advanced ball immediately if it makes the first version messy. Build the foundation cleanly.

## Collision Rules

Implement reliable collision detection:

* Player projectile vs ball
* Ball vs player
* Ball vs walls/platforms
* Enemy projectile vs player
* Player vs hazards

Use circular collision for balls.

Player can use a simple rectangle or capsule hitbox. Make the hitbox fair and slightly smaller than the visual player sprite.

## Physics Feel

The physics should be arcade-style, not realistic simulation.

Balls should:

* Bounce with consistent energy
* Have gravity
* Have minimum horizontal movement so they do not bounce in place forever
* Split into smaller balls with opposite horizontal directions
* Gain a little speed as sizes decrease

The game should feel responsive and fair.

## Code Quality

Use TypeScript types/interfaces for:

* Player
* Ball
* Projectile
* EnemyProjectile
* LevelConfig
* Hazard
* Particle
* GameState

Use requestAnimationFrame for the game loop.

Use delta time so movement is frame-rate independent.

Keep rendering and updating logic separated where practical.

Avoid deeply tangled code. This should be easy to expand into a full mini-game later.

## MVP Scope

Build a strong first playable version with:

* Start screen
* Level 1 fully playable
* Player movement
* Player shooting
* Ball bouncing
* Ball splitting
* Ball popping particles
* Collision detection
* Score
* Timer-based score
* Level clear
* Game over
* Restart
* High score saved locally
* Dark space visual theme

Then add at least two more levels showing progression:

* Level 2 with more/faster balls
* Level 3 with at least one bounce wall/platform

If time allows, include one early prototype shooter ball on a later level, but do not compromise the core gameplay.

## Polish Requirements

The game should feel finished enough to demo.

Add:

* Smooth start screen
* Clean HUD
* Particle effects
* Sound placeholders or simple Web Audio tones if easy
* Screen shake on large pops
* Pause support with Escape
* Responsive canvas sizing
* Clean restart flow

## Important Design Constraints

Keep it simple and clean.

Do not make the art overly busy.

Do not make the game too easy.

Do not make the first level overwhelming.

Do not use copyrighted characters, assets, or music.

All visuals should be generated with canvas drawing, CSS, gradients, particles, and simple procedural shapes unless placeholder assets are absolutely necessary.

The final result should be a playable browser mini-game that feels like a polished arcade prototype for **Void Pop**.
