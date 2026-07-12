import { useCallback, useEffect, useRef, useState } from 'react'
import { GameCanvas } from './components/GameCanvas'
import { VirtualStick } from './components/VirtualStick'
import type { GameEngine } from './game/GameEngine'
import type { HudState } from './game/types'

const initialHud: HudState = { phase: 'start', score: 0, highScore: Number(localStorage.getItem('void-pop-high-score') ?? 0), level: 1, lives: 3, combo: 0, accuracy: 100 }

function App() {
  const [hud, setHud] = useState(initialHud)
  const [hint, setHint] = useState('SYSTEM READY')
  const [hintKey, setHintKey] = useState(0)
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement))
  const engineRef = useRef<GameEngine | null>(null)
  const showHint = useCallback((message: string) => { setHint(message); setHintKey((key) => key + 1) }, [])
  const action = () => engineRef.current?.action()
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        return
      }
      await document.documentElement.requestFullscreen()
      const orientation = screen.orientation as ScreenOrientation & { lock?: (mode: string) => Promise<void> }
      await orientation.lock?.('landscape').catch(() => undefined)
    } catch {
      showHint('FULLSCREEN UNAVAILABLE')
    }
  }

  useEffect(() => {
    const syncFullscreen = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', syncFullscreen)
    return () => document.removeEventListener('fullscreenchange', syncFullscreen)
  }, [])

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="topbar">
        <a className="brand" href="/" aria-label="Void Pop home"><span className="brand-mark" /> VOID<span>POP</span></a>
        <div className="status"><span className="status-dot" /> DEEP SPACE RELAY // ONLINE</div>
        <div className="best">BEST <strong>{hud.highScore.toLocaleString().padStart(6, '0')}</strong></div>
      </header>

      <section className="game-frame" aria-label="Void Pop arcade game">
        <div className="frame-corner corner-tl" /><div className="frame-corner corner-tr" />
        <div className="frame-corner corner-bl" /><div className="frame-corner corner-br" />
        <GameCanvas onHud={setHud} onHint={showHint} engineRef={engineRef} />
        <button className="fullscreen-toggle" onClick={() => void toggleFullscreen()} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
          <span className={fullscreen ? 'collapse-icon' : 'expand-icon'} /> {fullscreen ? 'EXIT' : 'FULLSCREEN'}
        </button>

        {hud.phase !== 'start' && <div className="hud">
          <div className="hud-block"><span>SCORE</span><strong>{hud.score.toLocaleString().padStart(6, '0')}</strong></div>
          <div className="hud-center"><span>SECTOR {String(hud.level).padStart(2, '0')}</span>{hud.combo > 1 && <strong key={hud.combo}>{hud.combo}× CHAIN</strong>}</div>
          <div className="lives" aria-label={`${hud.lives} lives remaining`}>{[0, 1, 2].map((life) => <i key={life} className={life < hud.lives ? 'active' : ''} />)}</div>
        </div>}

        <div className="hint" key={hintKey}>{hint}</div>

        {hud.phase === 'start' && <div className="overlay start-overlay">
          <div className="eyebrow">ARC // SURVIVAL PROTOCOL</div>
          <h1>VOID<span>POP</span></h1>
          <p>Contain the anomaly. Split every sphere.<br />Try not to become a cautionary report.</p>
          <button onClick={action}><span>INITIATE</span><kbd>SPACE</kbd></button>
          <div className="controls"><span><kbd>A</kbd><kbd>D</kbd> MOVE</span><i /><span><kbd>SPACE</kbd> FIRE</span><i /><span><kbd>ESC</kbd> PAUSE</span></div>
        </div>}

        {hud.phase === 'paused' && <div className="overlay compact-overlay"><div className="eyebrow">SIMULATION SUSPENDED</div><h2>PAUSED</h2><p>Press Escape to resume</p></div>}
        {hud.phase === 'hit' && <div className="overlay event-overlay"><div className="reticle" /><h2>HULL BREACH</h2><p>{hud.lives} {hud.lives === 1 ? 'life' : 'lives'} remaining</p></div>}
        {hud.phase === 'levelClear' && <div className="overlay event-overlay clear"><div className="eyebrow">ANOMALY CONTAINED</div><h2>SECTOR CLEAR</h2></div>}
        {(hud.phase === 'gameOver' || hud.phase === 'victory') && <div className="overlay result-overlay">
          <div className="eyebrow">{hud.phase === 'victory' ? 'ALL SECTORS STABLE' : 'TRANSMISSION TERMINATED'}</div>
          <h2>{hud.phase === 'victory' ? 'VOID SECURED' : 'SIGNAL LOST'}</h2>
          <div className="result-grid"><span>FINAL SCORE<strong>{hud.score.toLocaleString()}</strong></span><span>SECTOR<strong>{hud.level}</strong></span><span>ACCURACY<strong>{hud.accuracy}%</strong></span></div>
          <button onClick={action}><span>RUN IT AGAIN</span><kbd>SPACE</kbd></button>
        </div>}

        <div className="touch-controls">
          <VirtualStick label="MOVE" onChange={(x) => engineRef.current?.setMoveAxis(x)} />
          <div className="fire-wrap">
            <button className="fire-button" aria-label="Fire" onPointerDown={action}><span>FIRE</span></button>
            <span className="stick-label">TAP TO FIRE</span>
          </div>
        </div>
      </section>

      <footer><span>ARC-09 PILOT LINK</span><span className="desktop-tip">A / D TO MOVE&nbsp;&nbsp;·&nbsp;&nbsp;SPACE TO FIRE&nbsp;&nbsp;·&nbsp;&nbsp;M TO MUTE</span><span>BUILD 01.04</span></footer>
    </main>
  )
}

export default App
