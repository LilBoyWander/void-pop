export type GamePhase = 'start' | 'playing' | 'paused' | 'levelClear' | 'hit' | 'gameOver' | 'victory'
export type BallSize = 0 | 1 | 2 | 3

export interface Vec2 { x: number; y: number }
export interface Player extends Vec2 {
  width: number; height: number; speed: number; lives: number; invulnerable: number
}
export interface Ball extends Vec2 {
  id: number; size: BallSize; radius: number; vx: number; vy: number; hue: number; shooter: boolean; shotTimer: number
}
export interface Projectile extends Vec2 { id: number; vy: number; length: number }
export interface EnemyProjectile extends Vec2 { id: number; vx: number; vy: number; radius: number }
export interface Particle extends Vec2 {
  id: number; vx: number; vy: number; life: number; maxLife: number; size: number; hue: number
}
export interface FloatingText extends Vec2 { id: number; text: string; life: number; color: string }
export interface Platform { x: number; y: number; width: number; height: number }
export interface Hazard { x: number; y: number; width: number; height: number; phase: number }
export interface LevelConfig {
  name: string; subtitle: string; balls: Array<{ size: BallSize; x: number; vx: number; shooter?: boolean }>
  gravity: number; speedScale: number; platforms: Platform[]; hazards: Hazard[]
}
export interface HudState {
  phase: GamePhase; score: number; highScore: number; level: number; lives: number; combo: number; accuracy: number
}
