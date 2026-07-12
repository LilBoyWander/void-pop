import type { LevelConfig } from './types'

export const LEVELS: LevelConfig[] = [
  {
    name: 'FIRST CONTACT', subtitle: 'One signal. Many consequences.', gravity: 510, speedScale: 1,
    balls: [{ size: 3, x: 0.54, vx: -165 }], platforms: [], hazards: [],
  },
  {
    name: 'BINARY EVENT', subtitle: 'The void has learned duplication.', gravity: 535, speedScale: 1.08,
    balls: [{ size: 3, x: 0.3, vx: 185 }, { size: 2, x: 0.73, vx: -205 }], platforms: [], hazards: [],
  },
  {
    name: 'GRAVITY WELL', subtitle: 'Architecture was a mistake.', gravity: 550, speedScale: 1.12,
    balls: [{ size: 3, x: 0.3, vx: 185 }],
    platforms: [{ x: 0.34, y: 0.61, width: 0.32, height: 0.025 }], hazards: [],
  },
  {
    name: 'HOT FLOOR', subtitle: 'Please avoid standing in the plasma.', gravity: 565, speedScale: 1.16,
    balls: [{ size: 2, x: 0.24, vx: 205 }, { size: 2, x: 0.76, vx: -205 }],
    platforms: [{ x: 0.39, y: 0.52, width: 0.22, height: 0.025 }],
    hazards: [{ x: 0.44, y: 0.925, width: 0.12, height: 0.02, phase: 0 }],
  },
  {
    name: 'HOSTILE ORBIT', subtitle: 'Some spheres have developed opinions.', gravity: 580, speedScale: 1.2,
    balls: [{ size: 3, x: 0.48, vx: 190, shooter: true }, { size: 1, x: 0.78, vx: -225 }],
    platforms: [{ x: 0.16, y: 0.58, width: 0.22, height: 0.025 }, { x: 0.62, y: 0.58, width: 0.22, height: 0.025 }],
    hazards: [],
  },
]

export const BALL_RADII = [12, 20, 31, 47] as const
export const BALL_COLORS = [185, 205, 268, 322] as const
