import { useEffect, useMemo, useRef, useState } from 'react'

type NamedColor = {
  id: string
  name: string
  source: string
  originalSpace: 'sRGB'
  rgb: [number, number, number]
  hex: string
}

type Space = 'rgb' | 'hsl' | 'oklab'

type Point3 = [number, number, number]

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

function rgbToHsl([r8, g8, b8]: Point3): Point3 {
  const r = r8 / 255, g = g8 / 255, b = b8 / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const light = (max + min) / 2
  const delta = max - min
  if (delta === 0) return [0, 0, light]
  const saturation = delta / (1 - Math.abs(2 * light - 1))
  let hue = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4
  hue = ((hue * 60) + 360) % 360
  return [hue / 360, saturation, light]
}

function rgbToOklab([r8, g8, b8]: Point3): Point3 {
  const linear = (v: number) => {
    const c = v / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const r = linear(r8), g = linear(g8), b = linear(b8)
  const l = Math.cbrt(0.4122214708*r + 0.5363325363*g + 0.0514459929*b)
  const m = Math.cbrt(0.2119034982*r + 0.6806995451*g + 0.1073969566*b)
  const s = Math.cbrt(0.0883024619*r + 0.2817188376*g + 0.6299787005*b)
  const L = 0.2104542553*l + 0.793617785*m - 0.0040720468*s
  const a = 1.9779984951*l - 2.428592205*m + 0.4505937099*s
  const bb = 0.0259040371*l + 0.7827717662*m - 0.808675766*s
  return [L, a / 0.8 + 0.5, bb / 0.8 + 0.5]
}

function coordinates(color: NamedColor, space: Space): Point3 {
  if (space === 'rgb') return color.rgb.map((v) => v / 255) as Point3
  if (space === 'hsl') return rgbToHsl(color.rgb)
  return rgbToOklab(color.rgb).map(clamp) as Point3
}

function ColorAtlas() {
  const [colors, setColors] = useState<NamedColor[]>([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<NamedColor | null>(null)
  const [space, setSpace] = useState<Space>('rgb')
  const [rotation, setRotation] = useState({ x: -0.35, y: 0.65 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dragRef = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null)

  useEffect(() => {
    fetch('./data/color-names.json').then((r) => r.json()).then((records: NamedColor[]) => setColors(records))
  }, [])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return needle ? colors.filter((c) => [c.name, c.hex, c.source].some((v) => v.toLowerCase().includes(needle))) : colors
  }, [colors, query])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const ratio = window.devicePixelRatio || 1
    const width = canvas.clientWidth, height = canvas.clientHeight
    canvas.width = width * ratio; canvas.height = height * ratio
    context.scale(ratio, ratio); context.clearRect(0, 0, width, height)

    const rotate = ([x0,y0,z0]: Point3): Point3 => {
      let x=x0-.5, y=y0-.5, z=z0-.5
      const cy=Math.cos(rotation.y), sy=Math.sin(rotation.y)
      ;[x,z]=[x*cy-z*sy,x*sy+z*cy]
      const cx=Math.cos(rotation.x), sx=Math.sin(rotation.x)
      ;[y,z]=[y*cx-z*sx,y*sx+z*cx]
      return [x,y,z]
    }
    const scale=Math.min(width,height)*.68
    const project=(p:Point3) => {
      const [x,y,z]=rotate(p)
      const perspective=1/(1.8-z*.55)
      return {x:width/2+x*scale*perspective,y:height/2-y*scale*perspective,z,perspective}
    }

    const corners: Point3[]=[[0,0,0],[1,0,0],[0,1,0],[0,0,1],[1,1,0],[1,0,1],[0,1,1],[1,1,1]]
    const edges=[[0,1],[0,2],[0,3],[1,4],[1,5],[2,4],[2,6],[3,5],[3,6],[4,7],[5,7],[6,7]]
    context.strokeStyle='rgba(128,128,128,.45)'; context.lineWidth=1
    edges.forEach(([a,b])=>{const p=project(corners[a]),q=project(corners[b]);context.beginPath();context.moveTo(p.x,p.y);context.lineTo(q.x,q.y);context.stroke()})

    const points=visible.map((color)=>({color,p:project(coordinates(color,space))})).sort((a,b)=>a.p.z-b.p.z)
    points.forEach(({color,p})=>{
      const active=selected?.id===color.id
      context.beginPath();context.arc(p.x,p.y,(active?8:5)*p.perspective*1.7,0,Math.PI*2)
      context.fillStyle=color.hex;context.fill();context.strokeStyle='rgba(255,255,255,.85)';context.stroke()
      context.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary')
      context.font='12px system-ui';context.fillText(color.name,p.x+9,p.y-7)
    })
  }, [visible, selected, space, rotation])

  const pointerDown=(event:React.PointerEvent<HTMLCanvasElement>)=>{
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current={x:event.clientX,y:event.clientY,rx:rotation.x,ry:rotation.y}
  }
  const pointerMove=(event:React.PointerEvent<HTMLCanvasElement>)=>{
    const start=dragRef.current;if(!start)return
    setRotation({x:start.rx+(event.clientY-start.y)*.008,y:start.ry+(event.clientX-start.x)*.008})
  }

  return (
    <section className="color-atlas">
      <div className="color-atlas-toolbar">
        <div className="color-atlas-tabs" aria-label="Color-space view">
          {(['rgb','hsl','oklab'] as Space[]).map((mode)=><button key={mode} className={space===mode?'active':''} onClick={()=>setSpace(mode)}>{mode==='rgb'?'RGB cube':mode==='hsl'?'HSL space':'OKLab space'}</button>)}
        </div>
        <input aria-label="Search named colors" placeholder="Search name, hex, or source…" value={query} onChange={(e)=>setQuery(e.target.value)} />
      </div>
      <div className="color-atlas-layout">
        <div className="color-atlas-stage">
          <canvas ref={canvasRef} aria-label={"Interactive three-dimensional "+space.toUpperCase()+" color space. Drag to rotate."} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={()=>dragRef.current=null} onPointerCancel={()=>dragRef.current=null} />
          <p className="color-atlas-hint">Drag to rotate · same colors, different coordinates</p>
        </div>
        <aside className="color-atlas-sidebar">
          <p className="eyebrow">{visible.length} named points</p>
          <div className="color-name-list">{visible.map((color)=><button key={color.id} onClick={()=>setSelected(color)}><span className="color-swatch" style={{background:color.hex}}/><span><strong>{color.name}</strong><small>{color.hex} · {color.source}</small></span></button>)}</div>
          {selected&&<div className="color-inspector"><div className="color-inspector-chip" style={{background:selected.hex}}/><h2>{selected.name}</h2><code>{selected.hex}</code><p>RGB {selected.rgb.join(' · ')}</p><p>{space.toUpperCase()} {coordinates(selected,space).map((v)=>v.toFixed(3)).join(' · ')}</p><small>Defined by {selected.source} in {selected.originalSpace}.</small></div>}
        </aside>
      </div>
    </section>
  )
}
export default ColorAtlas
