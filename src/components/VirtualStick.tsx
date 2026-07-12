import { useRef, useState } from 'react'

interface Props {
  label: string
  onChange: (x: number, y: number) => void
}

const LIMIT = 34

export function VirtualStick({ label, onChange }: Props) {
  const padRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<number | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const update = (clientX: number, clientY: number) => {
    const rect = padRef.current?.getBoundingClientRect()
    if (!rect) return
    let x = clientX - (rect.left + rect.width / 2)
    let y = clientY - (rect.top + rect.height / 2)
    const distance = Math.hypot(x, y)
    if (distance > LIMIT) { x = x / distance * LIMIT; y = y / distance * LIMIT }
    setPosition({ x, y }); onChange(x / LIMIT, y / LIMIT)
  }

  const release = () => {
    pointerRef.current = null; setPosition({ x: 0, y: 0 }); onChange(0, 0)
  }

  return (
    <div className="stick-wrap">
      <div
        ref={padRef}
        className="stick-pad"
        role="application"
        aria-label={`${label} virtual joystick`}
        onPointerDown={(event) => {
          pointerRef.current = event.pointerId
          event.currentTarget.setPointerCapture(event.pointerId)
          update(event.clientX, event.clientY)
        }}
        onPointerMove={(event) => { if (pointerRef.current === event.pointerId) update(event.clientX, event.clientY) }}
        onPointerUp={release}
        onPointerCancel={release}
      >
        <span className="stick-axis horizontal" /><span className="stick-axis vertical" />
        <span className="stick-knob" style={{ transform: `translate(${position.x}px, ${position.y}px)` }} />
      </div>
      <span className="stick-label">{label}</span>
    </div>
  )
}
