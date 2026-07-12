import { useEffect, useRef } from 'react'
import { GameEngine } from '../game/GameEngine'
import type { HudState } from '../game/types'

interface Props {
  onHud: (hud: HudState) => void
  onHint: (hint: string) => void
  engineRef: React.MutableRefObject<GameEngine | null>
}

export function GameCanvas({ onHud, onHint, engineRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const callbacksRef = useRef({ onHud, onHint })

  useEffect(() => {
    callbacksRef.current = { onHud, onHint }
  }, [onHud, onHint])

  useEffect(() => {
    if (!canvasRef.current) return
    const engine = new GameEngine(canvasRef.current, {
      onHud: (hud) => callbacksRef.current.onHud(hud),
      onHint: (hint) => callbacksRef.current.onHint(hint),
    })
    engineRef.current = engine
    engine.start()
    const keyDown = (event: KeyboardEvent) => {
      if (['Space', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault()
      if (!event.repeat || event.code !== 'Space') engine.keyDown(event.code)
    }
    const keyUp = (event: KeyboardEvent) => engine.keyUp(event.code)
    const resize = () => engine.resize()
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)
    window.addEventListener('resize', resize)
    return () => {
      engine.destroy(); engineRef.current = null
      window.removeEventListener('keydown', keyDown); window.removeEventListener('keyup', keyUp); window.removeEventListener('resize', resize)
    }
  }, [engineRef])

  return <canvas ref={canvasRef} width={960} height={600} aria-label="Void Pop game area" />
}
