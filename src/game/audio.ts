export class AudioSystem {
  private context: AudioContext | null = null
  private muted = false
  private lastBounce = 0

  toggle() { this.muted = !this.muted; return this.muted }
  get isMuted() { return this.muted }

  private ctx() {
    if (!this.context) this.context = new AudioContext()
    if (this.context.state === 'suspended') void this.context.resume()
    return this.context
  }

  tone(frequency: number, duration: number, volume: number, type: OscillatorType = 'sine', slide = 0) {
    if (this.muted) return
    const ctx = this.ctx()
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, frequency + slide), ctx.currentTime + duration)
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    oscillator.connect(gain).connect(ctx.destination)
    oscillator.start(); oscillator.stop(ctx.currentTime + duration)
  }

  private noise(duration: number, volume: number) {
    if (this.muted) return
    const ctx = this.ctx()
    const length = Math.ceil(ctx.sampleRate * duration)
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length)
    const source = ctx.createBufferSource()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()
    filter.type = 'highpass'; filter.frequency.value = 1100
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    source.buffer = buffer; source.connect(filter).connect(gain).connect(ctx.destination); source.start()
  }

  shoot() {
    this.tone(420, 0.09, 0.045, 'square', 760)
    this.tone(980, 0.12, 0.025, 'sine', 520)
    this.noise(0.045, 0.018)
  }
  bounce(size: number, impact: number, surface: 'floor' | 'wall' | 'platform') {
    const now = performance.now()
    if (now - this.lastBounce < 42) return
    this.lastBounce = now
    const strength = Math.min(1, Math.max(0.25, impact / 430))
    const base = surface === 'floor' ? 105 : surface === 'platform' ? 150 : 210
    const frequency = base + (3 - size) * 42
    this.tone(frequency, surface === 'floor' ? 0.09 : 0.055, 0.012 + strength * 0.018, surface === 'wall' ? 'triangle' : 'sine', surface === 'floor' ? -18 : 24)
  }
  pop(size: number) { this.tone(190 + (3 - size) * 95, 0.14, 0.06, 'triangle', 180) }
  hit() { this.tone(110, 0.5, 0.1, 'sawtooth', -60) }
  clear() { [0, 90, 180].forEach((delay, i) => setTimeout(() => this.tone(440 + i * 180, 0.2, 0.045), delay)) }
}
