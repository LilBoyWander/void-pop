import { AudioSystem } from './audio'
import { BALL_COLORS, BALL_RADII, LEVELS } from './levels'
import type { Ball, EnemyProjectile, FloatingText, GamePhase, HudState, LevelConfig, Particle, Player, Projectile } from './types'

const WIDTH = 960
const HEIGHT = 600
const FLOOR = 552
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
const circleRect = (cx: number, cy: number, radius: number, x: number, y: number, width: number, height: number) => {
  const dx = cx - clamp(cx, x, x + width)
  const dy = cy - clamp(cy, y, y + height)
  return dx * dx + dy * dy < radius * radius
}

interface Callbacks { onHud: (hud: HudState) => void; onHint: (hint: string) => void }

export class GameEngine {
  private ctx: CanvasRenderingContext2D
  private frame = 0
  private lastTime = 0
  private accumulator = 0
  private phase: GamePhase = 'start'
  private phaseTimer = 0
  private levelIndex = 0
  private score = 0
  private highScore = Number(localStorage.getItem('void-pop-high-score') ?? 0)
  private combo = 0
  private comboTimer = 0
  private shotsFired = 0
  private shotsHit = 0
  private nextId = 1
  private shake = 0
  private elapsed = 0
  private moveAxis = 0
  private shotCooldown = 0
  private keys = new Set<string>()
  private player: Player = this.makePlayer(3)
  private balls: Ball[] = []
  private projectiles: Projectile[] = []
  private enemyProjectiles: EnemyProjectile[] = []
  private particles: Particle[] = []
  private texts: FloatingText[] = []
  private audio = new AudioSystem()
  private stars = Array.from({ length: 110 }, (_, i) => ({
    x: (i * 193.71) % WIDTH, y: (i * 89.33) % HEIGHT, size: 0.5 + (i % 4) * 0.35, speed: 2 + (i % 5) * 1.2,
  }))

  constructor(private canvas: HTMLCanvasElement, private callbacks: Callbacks) {
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas is not supported')
    this.ctx = context
    this.resize()
    this.emitHud()
  }

  start() { this.lastTime = performance.now(); this.frame = requestAnimationFrame(this.loop) }
  destroy() { cancelAnimationFrame(this.frame) }
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2)
    this.canvas.width = WIDTH * dpr; this.canvas.height = HEIGHT * dpr
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  keyDown(code: string) {
    this.keys.add(code)
    if (code === 'Space') {
      if (this.phase === 'start' || this.phase === 'gameOver' || this.phase === 'victory') this.newGame()
      else if (this.phase === 'playing') this.shoot()
    }
    if (code === 'Escape' && (this.phase === 'playing' || this.phase === 'paused')) {
      this.phase = this.phase === 'playing' ? 'paused' : 'playing'; this.emitHud()
    }
    if (code === 'KeyM') { this.audio.toggle(); this.callbacks.onHint(this.audio.isMuted ? 'AUDIO MUTED' : 'AUDIO ONLINE') }
  }
  keyUp(code: string) { this.keys.delete(code) }
  setControl(control: 'left' | 'right', active: boolean) {
    const key = control === 'left' ? 'ArrowLeft' : 'ArrowRight'
    if (active) this.keys.add(key)
    else this.keys.delete(key)
  }
  setMoveAxis(value: number) { this.moveAxis = clamp(value, -1, 1) }
  action() {
    if (this.phase === 'playing') this.shoot()
    else if (this.phase === 'start' || this.phase === 'gameOver' || this.phase === 'victory') this.newGame()
  }

  private makePlayer(lives: number): Player {
    return { x: WIDTH / 2, y: FLOOR - 5, width: 34, height: 36, speed: 390, lives, invulnerable: 0 }
  }

  private newGame() {
    this.score = 0; this.combo = 0; this.levelIndex = 0; this.elapsed = 0; this.shotsFired = 0; this.shotsHit = 0
    this.player = this.makePlayer(3); this.moveAxis = 0; this.shotCooldown = 0
    this.loadLevel(); this.phase = 'playing'; this.callbacks.onHint('SIGNAL ACQUIRED'); this.emitHud()
  }

  private loadLevel() {
    const level = LEVELS[this.levelIndex]
    this.player.x = WIDTH / 2; this.player.invulnerable = 1.6
    this.projectiles = []; this.enemyProjectiles = []; this.particles = []; this.texts = []
    this.balls = level.balls.map((source) => this.makeBall(source.size, source.x * WIDTH, 145, source.vx, -250, Boolean(source.shooter)))
  }

  private makeBall(size: Ball['size'], x: number, y: number, vx: number, vy: number, shooter = false): Ball {
    return { id: this.nextId++, size, radius: BALL_RADII[size], x, y, vx, vy, hue: BALL_COLORS[size], shooter, shotTimer: 2.3 + Math.random() * 1.8 }
  }

  private shoot() {
    if (this.projectiles.length >= 2 || this.shotCooldown > 0) return
    this.projectiles.push({ id: this.nextId++, x: this.player.x, y: this.player.y - this.player.height, vy: -780, length: 22 })
    this.shotsFired++; this.shotCooldown = 0.13; this.audio.shoot(); this.burst(this.player.x, this.player.y - 42, 190, 4, 80)
  }

  private loop = (now: number) => {
    const delta = Math.min((now - this.lastTime) / 1000, 0.05)
    this.lastTime = now; this.accumulator += delta
    while (this.accumulator >= 1 / 120) { this.update(1 / 120); this.accumulator -= 1 / 120 }
    this.render(now / 1000)
    this.frame = requestAnimationFrame(this.loop)
  }

  private update(dt: number) {
    if (this.phase === 'paused' || this.phase === 'start' || this.phase === 'gameOver' || this.phase === 'victory') return
    this.phaseTimer -= dt
    if (this.phase === 'hit') {
      this.updateParticles(dt)
      if (this.phaseTimer <= 0) { this.phase = 'playing'; this.player.x = WIDTH / 2; this.player.invulnerable = 1.8; this.emitHud() }
      return
    }
    if (this.phase === 'levelClear') {
      this.updateParticles(dt)
      if (this.phaseTimer <= 0) {
        this.levelIndex++
        if (this.levelIndex >= LEVELS.length) { this.phase = 'victory'; this.saveHighScore() }
        else { this.loadLevel(); this.phase = 'playing'; this.callbacks.onHint(LEVELS[this.levelIndex].name) }
        this.emitHud()
      }
      return
    }

    const level = LEVELS[this.levelIndex]
    this.elapsed += dt; this.score += dt * (8 + this.levelIndex * 2)
    this.shotCooldown = Math.max(0, this.shotCooldown - dt)
    this.comboTimer -= dt
    if (this.comboTimer <= 0) this.combo = 0
    this.player.invulnerable = Math.max(0, this.player.invulnerable - dt)
    let move = this.moveAxis
    if (this.keys.has('ArrowLeft') || this.keys.has('KeyA')) move--
    if (this.keys.has('ArrowRight') || this.keys.has('KeyD')) move++
    this.player.x = clamp(this.player.x + move * this.player.speed * dt, this.player.width / 2 + 8, WIDTH - this.player.width / 2 - 8)

    this.updateBalls(dt, level)
    this.projectiles.forEach((shot) => { shot.y += shot.vy * dt })
    this.projectiles = this.projectiles.filter((shot) => shot.y + shot.length > 0)
    this.enemyProjectiles.forEach((shot) => { shot.x += shot.vx * dt; shot.y += shot.vy * dt })
    this.enemyProjectiles = this.enemyProjectiles.filter((shot) => shot.y < HEIGHT + 20 && shot.x > -20 && shot.x < WIDTH + 20)
    this.handleCollisions(level)
    this.updateParticles(dt)
    this.shake = Math.max(0, this.shake - dt * 18)
    if (Math.floor(this.elapsed * 4) % 2 === 0) this.emitHud()
  }

  private updateBalls(dt: number, level: LevelConfig) {
    for (const ball of this.balls) {
      const previousY = ball.y
      ball.vy += level.gravity * dt; ball.x += ball.vx * dt; ball.y += ball.vy * dt
      if (ball.x - ball.radius < 5) { const impact = Math.abs(ball.vx); ball.x = ball.radius + 5; ball.vx = Math.abs(ball.vx); this.audio.bounce(ball.size, impact, 'wall') }
      if (ball.x + ball.radius > WIDTH - 5) { const impact = Math.abs(ball.vx); ball.x = WIDTH - ball.radius - 5; ball.vx = -Math.abs(ball.vx); this.audio.bounce(ball.size, impact, 'wall') }
      if (ball.y - ball.radius < 5) { const impact = Math.abs(ball.vy); ball.y = ball.radius + 5; ball.vy = Math.abs(ball.vy); this.audio.bounce(ball.size, impact, 'wall') }
      if (ball.y + ball.radius > FLOOR) {
        const impact = Math.abs(ball.vy)
        ball.y = FLOOR - ball.radius; ball.vy = -Math.sqrt(2 * level.gravity * (110 + ball.size * 24)) * level.speedScale
        this.audio.bounce(ball.size, impact, 'floor')
      }
      for (const raw of level.platforms) {
        const platform = { x: raw.x * WIDTH, y: raw.y * HEIGHT, width: raw.width * WIDTH, height: raw.height * HEIGHT }
        if (circleRect(ball.x, ball.y, ball.radius, platform.x, platform.y, platform.width, platform.height)) {
          if (previousY + ball.radius <= platform.y + 4 && ball.vy > 0) { const impact = Math.abs(ball.vy); ball.y = platform.y - ball.radius; ball.vy = -Math.abs(ball.vy); this.audio.bounce(ball.size, impact, 'platform') }
          else if (previousY - ball.radius >= platform.y + platform.height - 4 && ball.vy < 0) { const impact = Math.abs(ball.vy); ball.y = platform.y + platform.height + ball.radius; ball.vy = Math.abs(ball.vy); this.audio.bounce(ball.size, impact, 'platform') }
          else { const impact = Math.abs(ball.vx); ball.vx = ball.x < platform.x + platform.width / 2 ? -Math.abs(ball.vx) : Math.abs(ball.vx); this.audio.bounce(ball.size, impact, 'platform') }
        }
      }
      if (ball.shooter) {
        ball.shotTimer -= dt
        if (ball.shotTimer <= 0 && ball.y < FLOOR - 100) {
          const dx = this.player.x - ball.x; const dy = this.player.y - ball.y; const length = Math.hypot(dx, dy) || 1
          this.enemyProjectiles.push({ id: this.nextId++, x: ball.x, y: ball.y + ball.radius, vx: dx / length * 165, vy: dy / length * 165, radius: 5 })
          ball.shotTimer = 2.6 + Math.random() * 1.4
        }
      }
    }
  }

  private handleCollisions(level: LevelConfig) {
    const hitShots = new Set<number>(); const hitBalls = new Set<number>()
    for (const shot of this.projectiles) for (const ball of this.balls) {
      const nearestY = clamp(ball.y, shot.y - shot.length, shot.y)
      if ((shot.x - ball.x) ** 2 + (nearestY - ball.y) ** 2 < (ball.radius + 3) ** 2) {
        hitShots.add(shot.id); hitBalls.add(ball.id); break
      }
    }
    if (hitBalls.size) {
      const children: Ball[] = []
      for (const ball of this.balls) if (hitBalls.has(ball.id)) {
        this.shotsHit++; this.combo++; this.comboTimer = 2.25
        const points = (4 - ball.size) * 100 * Math.max(1, this.combo)
        this.score += points; this.texts.push({ id: this.nextId++, x: ball.x, y: ball.y, text: `+${points}`, life: 0.8, color: `hsl(${ball.hue} 90% 72%)` })
        this.burst(ball.x, ball.y, ball.hue, 10 + ball.size * 5, 140 + ball.size * 30)
        this.audio.pop(ball.size); this.shake = Math.max(this.shake, ball.size * 1.8)
        if (ball.size > 0) {
          const childSize = (ball.size - 1) as Ball['size']; const speed = (205 + (3 - childSize) * 35) * level.speedScale
          children.push(this.makeBall(childSize, ball.x - 3, ball.y, -speed, -285, false), this.makeBall(childSize, ball.x + 3, ball.y, speed, -285, false))
        }
      }
      this.balls = this.balls.filter((ball) => !hitBalls.has(ball.id)).concat(children)
      this.projectiles = this.projectiles.filter((shot) => !hitShots.has(shot.id))
      if (!this.balls.length) this.clearLevel()
    }

    if (this.player.invulnerable <= 0 && this.phase === 'playing') {
      const px = this.player.x - this.player.width * 0.34; const py = this.player.y - this.player.height * 0.86
      const pw = this.player.width * 0.68; const ph = this.player.height * 0.82
      const ballHit = this.balls.some((ball) => circleRect(ball.x, ball.y, ball.radius * 0.88, px, py, pw, ph))
      const projectileHit = this.enemyProjectiles.some((shot) => circleRect(shot.x, shot.y, shot.radius, px, py, pw, ph))
      const hazardHit = level.hazards.some((raw) => circleRect(this.player.x, this.player.y - 10, 10, raw.x * WIDTH, raw.y * HEIGHT, raw.width * WIDTH, raw.height * HEIGHT))
      if (ballHit || projectileHit || hazardHit) this.playerHit()
    }
  }

  private playerHit() {
    this.player.lives--; this.combo = 0; this.phase = this.player.lives <= 0 ? 'gameOver' : 'hit'; this.phaseTimer = 1.25
    this.burst(this.player.x, this.player.y - 18, 8, 28, 240); this.shake = 12; this.audio.hit(); this.saveHighScore()
    this.callbacks.onHint(this.player.lives > 0 ? 'HULL BREACH — RECALIBRATING' : 'SIGNAL LOST'); this.emitHud()
  }

  private clearLevel() {
    const timeBonus = Math.max(500, 3200 - this.elapsed * 45); this.score += timeBonus
    this.phase = 'levelClear'; this.phaseTimer = 2.2; this.audio.clear(); this.callbacks.onHint(`SECTOR CLEAR  +${Math.round(timeBonus)}`); this.saveHighScore(); this.emitHud()
  }

  private saveHighScore() {
    this.highScore = Math.max(this.highScore, Math.floor(this.score)); localStorage.setItem('void-pop-high-score', String(this.highScore))
  }

  private burst(x: number, y: number, hue: number, count: number, speed: number) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2; const velocity = speed * (0.35 + Math.random() * 0.65); const life = 0.28 + Math.random() * 0.5
      this.particles.push({ id: this.nextId++, x, y, vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity, life, maxLife: life, size: 1.5 + Math.random() * 3, hue })
    }
  }

  private updateParticles(dt: number) {
    for (const p of this.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.985; p.vy = p.vy * 0.985 + 80 * dt; p.life -= dt }
    for (const text of this.texts) { text.y -= 32 * dt; text.life -= dt }
    this.particles = this.particles.filter((p) => p.life > 0); this.texts = this.texts.filter((text) => text.life > 0)
  }

  private emitHud() {
    this.callbacks.onHud({ phase: this.phase, score: Math.floor(this.score), highScore: this.highScore, level: this.levelIndex + 1, lives: this.player.lives, combo: this.combo, accuracy: this.shotsFired ? Math.round(this.shotsHit / this.shotsFired * 100) : 100 })
  }

  private render(time: number) {
    const ctx = this.ctx; ctx.save()
    const shakeX = this.shake ? (Math.random() - 0.5) * this.shake : 0; const shakeY = this.shake ? (Math.random() - 0.5) * this.shake : 0
    ctx.translate(shakeX, shakeY)
    this.renderBackground(time)
    if (this.phase !== 'start') {
      this.renderLevel(time)
      this.renderProjectiles(time)
      this.renderBalls(time)
      this.renderPlayer(time)
      this.renderParticles()
    }
    ctx.restore()
  }

  private renderBackground(time: number) {
    const ctx = this.ctx
    const gradient = ctx.createRadialGradient(WIDTH * 0.52, HEIGHT * 0.38, 10, WIDTH * 0.5, HEIGHT * 0.48, WIDTH * 0.72)
    gradient.addColorStop(0, '#101a38'); gradient.addColorStop(0.48, '#080d20'); gradient.addColorStop(1, '#03050c')
    ctx.fillStyle = gradient; ctx.fillRect(-20, -20, WIDTH + 40, HEIGHT + 40)
    const nebula = ctx.createRadialGradient(WIDTH * 0.18, HEIGHT * 0.2, 0, WIDTH * 0.18, HEIGHT * 0.2, 270)
    nebula.addColorStop(0, 'rgba(64, 43, 145, .13)'); nebula.addColorStop(1, 'rgba(10, 5, 30, 0)')
    ctx.fillStyle = nebula; ctx.fillRect(0, 0, WIDTH, HEIGHT)
    for (const star of this.stars) {
      const y = (star.y + time * star.speed) % HEIGHT
      ctx.globalAlpha = 0.28 + star.size * 0.2; ctx.fillStyle = '#dbeeff'; ctx.fillRect(star.x, y, star.size, star.size)
    }
    ctx.globalAlpha = 1
    ctx.strokeStyle = 'rgba(95, 210, 255, .07)'; ctx.lineWidth = 1
    for (let y = FLOOR; y < HEIGHT; y += 12) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(WIDTH, y); ctx.stroke() }
    ctx.fillStyle = 'rgba(5, 10, 24, .75)'; ctx.fillRect(0, FLOOR, WIDTH, HEIGHT - FLOOR)
    ctx.strokeStyle = 'rgba(105, 224, 255, .28)'; ctx.beginPath(); ctx.moveTo(0, FLOOR); ctx.lineTo(WIDTH, FLOOR); ctx.stroke()
  }

  private renderLevel(time: number) {
    const level = LEVELS[this.levelIndex]
    for (const raw of level.platforms) {
      const x = raw.x * WIDTH, y = raw.y * HEIGHT, width = raw.width * WIDTH, height = raw.height * HEIGHT
      ctxRoundRect(this.ctx, x, y, width, height, 3); this.ctx.fillStyle = '#14213e'; this.ctx.fill()
      this.ctx.shadowBlur = 12; this.ctx.shadowColor = '#45cffa'; this.ctx.strokeStyle = 'rgba(91, 218, 255, .7)'; this.ctx.stroke(); this.ctx.shadowBlur = 0
    }
    for (const raw of level.hazards) {
      const x = raw.x * WIDTH, y = raw.y * HEIGHT, width = raw.width * WIDTH, height = raw.height * HEIGHT
      const pulse = 0.55 + Math.sin(time * 7 + raw.phase) * 0.25
      this.ctx.fillStyle = `rgba(255, 58, 92, ${pulse})`; this.ctx.shadowBlur = 18; this.ctx.shadowColor = '#ff315c'; this.ctx.fillRect(x, y, width, height); this.ctx.shadowBlur = 0
      for (let sx = x + 6; sx < x + width; sx += 14) { this.ctx.fillStyle = '#ffdf80'; this.ctx.fillRect(sx, y - 3, 5, 3) }
    }
  }

  private renderBalls(time: number) {
    for (const ball of this.balls) {
      const pulse = ball.shooter && ball.shotTimer < 0.65 ? 1 + Math.sin(time * 28) * 0.1 : 1
      this.ctx.save(); this.ctx.translate(ball.x, ball.y); this.ctx.scale(pulse, pulse)
      const glow = this.ctx.createRadialGradient(-ball.radius * .3, -ball.radius * .35, 1, 0, 0, ball.radius)
      glow.addColorStop(0, `hsl(${ball.hue} 100% 92%)`); glow.addColorStop(.2, `hsl(${ball.hue} 92% 65%)`); glow.addColorStop(.72, `hsl(${ball.hue} 80% 37%)`); glow.addColorStop(1, `hsl(${ball.hue} 86% 16%)`)
      this.ctx.shadowBlur = 16 + ball.size * 4; this.ctx.shadowColor = `hsla(${ball.hue} 100% 60% / .7)`
      this.ctx.fillStyle = glow; this.ctx.beginPath(); this.ctx.arc(0, 0, ball.radius, 0, Math.PI * 2); this.ctx.fill()
      this.ctx.shadowBlur = 0; this.ctx.strokeStyle = `hsla(${ball.hue} 100% 86% / .5)`; this.ctx.lineWidth = 1.5; this.ctx.stroke()
      if (ball.shooter) {
        this.ctx.strokeStyle = ball.shotTimer < .65 ? '#fff' : `hsl(${ball.hue} 90% 75%)`; this.ctx.lineWidth = 2
        this.ctx.beginPath(); this.ctx.arc(0, 0, ball.radius * .57, time, time + Math.PI * 1.45); this.ctx.stroke()
      }
      this.ctx.restore()
    }
  }

  private renderPlayer(time: number) {
    if (this.player.invulnerable > 0 && Math.floor(time * 12) % 2 === 0) return
    const { x, y } = this.player; const ctx = this.ctx; ctx.save(); ctx.translate(x, y)
    ctx.shadowBlur = 18; ctx.shadowColor = '#58ddff'; ctx.fillStyle = '#72e4ff'
    ctx.beginPath(); ctx.moveTo(0, -39); ctx.lineTo(17, -7); ctx.lineTo(12, 0); ctx.lineTo(-12, 0); ctx.lineTo(-17, -7); ctx.closePath(); ctx.fill()
    ctx.shadowBlur = 0; ctx.fillStyle = '#0d1830'; ctx.beginPath(); ctx.moveTo(0, -29); ctx.lineTo(7, -11); ctx.lineTo(-7, -11); ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#b7f6ff'; ctx.fillRect(-2, -42, 4, 9)
    const thrust = 7 + Math.sin(time * 28) * 4; ctx.fillStyle = '#7a6cff'; ctx.shadowBlur = 12; ctx.shadowColor = '#6658ff'
    ctx.beginPath(); ctx.moveTo(-7, 1); ctx.lineTo(0, thrust); ctx.lineTo(7, 1); ctx.fill(); ctx.restore()
  }

  private renderProjectiles(time: number) {
    this.ctx.lineCap = 'round'
    for (const shot of this.projectiles) {
      this.ctx.strokeStyle = '#eaffff'; this.ctx.shadowBlur = 16; this.ctx.shadowColor = '#58eaff'; this.ctx.lineWidth = 3
      this.ctx.beginPath(); this.ctx.moveTo(shot.x, shot.y); this.ctx.lineTo(shot.x, shot.y + shot.length); this.ctx.stroke()
    }
    for (const shot of this.enemyProjectiles) {
      const pulse = 1 + Math.sin(time * 20) * .2; this.ctx.fillStyle = '#ff496f'; this.ctx.shadowBlur = 14; this.ctx.shadowColor = '#ff315c'
      this.ctx.beginPath(); this.ctx.arc(shot.x, shot.y, shot.radius * pulse, 0, Math.PI * 2); this.ctx.fill()
    }
    this.ctx.shadowBlur = 0
  }

  private renderParticles() {
    for (const p of this.particles) {
      this.ctx.globalAlpha = p.life / p.maxLife; this.ctx.fillStyle = `hsl(${p.hue} 95% 70%)`; this.ctx.fillRect(p.x, p.y, p.size, p.size)
    }
    this.ctx.textAlign = 'center'; this.ctx.font = '700 16px Inter, sans-serif'
    for (const text of this.texts) { this.ctx.globalAlpha = text.life / .8; this.ctx.fillStyle = text.color; this.ctx.fillText(text.text, text.x, text.y) }
    this.ctx.globalAlpha = 1
  }
}

function ctxRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r)
}
