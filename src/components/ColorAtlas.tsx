import { useEffect, useMemo, useRef, useState } from 'react'

type NamedColor = {
  id: string
  name: string
  source: string
  originalSpace: 'sRGB'
  rgb: [number, number, number]
  hex: string
}

type ViewMode = 'cube' | 'wheel'

function ColorAtlas() {
  const [colors, setColors] = useState<NamedColor[]>([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<NamedColor | null>(null)
  const [view, setView] = useState<ViewMode>('cube')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    fetch('./data/color-names.json')
      .then((response) => response.json())
      .then((records: NamedColor[]) => setColors(records))
  }, [])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return needle
      ? colors.filter((color) =>
          [color.name, color.hex, color.source].some((value) =>
            value.toLowerCase().includes(needle),
          ),
        )
      : colors
  }, [colors, query])

  useEffect(() => {
    if (view !== 'cube') return
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const ratio = window.devicePixelRatio || 1
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    canvas.width = width * ratio
    canvas.height = height * ratio
    context.scale(ratio, ratio)
    context.clearRect(0, 0, width, height)

    const origin = { x: width * 0.5, y: height * 0.55 }
    const scale = Math.min(width, height) * 0.52
    const project = ([r, g, b]: [number, number, number]) => {
      const x = r / 255 - 0.5
      const y = g / 255 - 0.5
      const z = b / 255 - 0.5
      return {
        x: origin.x + (x - z) * scale * 0.72,
        y: origin.y + (x + z) * scale * 0.35 - y * scale * 0.9,
      }
    }

    const corners: [number, number, number][] = [
      [0,0,0],[255,0,0],[0,255,0],[0,0,255],
      [255,255,0],[255,0,255],[0,255,255],[255,255,255],
    ]
    const edges = [[0,1],[0,2],[0,3],[1,4],[1,5],[2,4],[2,6],[3,5],[3,6],[4,7],[5,7],[6,7]]
    context.strokeStyle = 'rgba(128,128,128,.5)'
    context.lineWidth = 1
    edges.forEach(([a,b]) => {
      const p = project(corners[a])
      const q = project(corners[b])
      context.beginPath(); context.moveTo(p.x,p.y); context.lineTo(q.x,q.y); context.stroke()
    })

    visible.forEach((color) => {
      const p = project(color.rgb)
      context.beginPath()
      context.arc(p.x, p.y, selected?.id === color.id ? 8 : 5, 0, Math.PI * 2)
      context.fillStyle = color.hex
      context.fill()
      context.strokeStyle = 'rgba(255,255,255,.85)'
      context.stroke()
      context.fillStyle = 'currentColor'
      context.font = '12px system-ui'
      context.fillText(color.name, p.x + 9, p.y - 7)
    })
  }, [visible, selected, view])

  return (
    <section className="color-atlas">
      <div className="color-atlas-toolbar">
        <div className="color-atlas-tabs" aria-label="Color-space view">
          <button className={view === 'cube' ? 'active' : ''} onClick={() => setView('cube')}>RGB cube</button>
          <button className={view === 'wheel' ? 'active' : ''} onClick={() => setView('wheel')}>Hue wheel</button>
        </div>
        <input
          aria-label="Search named colors"
          placeholder="Search name, hex, or source…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="color-atlas-layout">
        <div className="color-atlas-stage">
          {view === 'cube' ? (
            <canvas ref={canvasRef} aria-label="Projected three-dimensional RGB color cube" />
          ) : (
            <div className="hue-wheel" aria-label="Hue wheel placeholder">
              <div><strong>Hue wheel</strong><span>2D projection scaffold</span></div>
            </div>
          )}
        </div>

        <aside className="color-atlas-sidebar">
          <p className="eyebrow">{visible.length} named points</p>
          <div className="color-name-list">
            {visible.map((color) => (
              <button key={color.id} onClick={() => setSelected(color)}>
                <span className="color-swatch" style={{ background: color.hex }} />
                <span><strong>{color.name}</strong><small>{color.hex} · {color.source}</small></span>
              </button>
            ))}
          </div>
          {selected && (
            <div className="color-inspector">
              <div className="color-inspector-chip" style={{ background: selected.hex }} />
              <h2>{selected.name}</h2>
              <code>{selected.hex}</code>
              <p>RGB {selected.rgb.join(' · ')}</p>
              <small>Defined by {selected.source} in {selected.originalSpace}.</small>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}

export default ColorAtlas
