import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3'
import { useEffect, useState } from 'react'

type NodeKind = 'character' | 'theme' | 'work' | 'cue' | 'occurrence'

interface GraphNode extends SimulationNodeDatum {
  id: string
  label: string
  kind: NodeKind
  color: string
}

type GraphLink = SimulationLinkDatum<GraphNode> & {
  label: string
  kind: string
  confidence: number
}

type GraphData = { nodes: GraphNode[]; links: GraphLink[] }

const WIDTH = 760
const HEIGHT = 520

function PersonIcon() {
  return (
    <g fill="#fff" transform="translate(-10, -14)">
      <circle cx="10" cy="6" r="6" />
      <path d="M0 26 C0 15 20 15 20 26 Z" />
    </g>
  )
}

function NoteIcon() {
  return (
    <g fill="#fff" transform="translate(-9, -14)">
      <circle cx="5" cy="23" r="5" />
      <rect x="9" y="1" width="2.4" height="22" />
      <path d="M9 1 L20.5 5 L20.5 11 L9 7 Z" />
    </g>
  )
}

function WorkIcon() {
  return (
    <g fill="none" stroke="#fff" strokeWidth="2" transform="translate(-13, -13)">
      <rect x="2" y="2" width="22" height="22" rx="2" />
      <path d="M2 8 H24 M8 2 V8 M18 2 V8" />
    </g>
  )
}

function CueIcon() {
  return (
    <g fill="none" stroke="#fff" strokeWidth="2" transform="translate(-14, -14)">
      <path d="M3 5 H25 M3 10 H25 M3 15 H25 M3 20 H25" />
      <path d="M9 3 V23 M19 3 V23" strokeOpacity="0.65" />
    </g>
  )
}

function OccurrenceIcon() {
  return (
    <g fill="none" stroke="#fff" strokeWidth="2" transform="translate(-14, -14)">
      <circle cx="14" cy="14" r="10" />
      <path d="M14 8 V14 L19 17" />
    </g>
  )
}

function NodeIcon({ kind }: { kind: NodeKind }) {
  if (kind === 'theme') return <NoteIcon />
  if (kind === 'work') return <WorkIcon />
  if (kind === 'cue') return <CueIcon />
  if (kind === 'occurrence') return <OccurrenceIcon />
  return <PersonIcon />
}

function StarWarsGraph() {
  const [graph, setGraph] = useState<GraphData>({ nodes: [], links: [] })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let simulation: ReturnType<typeof forceSimulation<GraphNode>> | undefined
    let cancelled = false

    fetch('/data/star-wars-musical-themes.json')
      .then((response) => {
        if (!response.ok) throw new Error(`Graph data returned ${response.status}`)
        return response.json() as Promise<GraphData>
      })
      .then((data) => {
        if (cancelled) return
        const simulationNodes = data.nodes.map((node) => ({ ...node }))
        const simulationLinks = data.links.map((link) => ({ ...link }))

        simulation = forceSimulation(simulationNodes)
          .force(
            'link',
            forceLink<GraphNode, GraphLink>(simulationLinks)
              .id((node) => node.id)
              .distance(155),
          )
          .force('charge', forceManyBody().strength(-650))
          .force('center', forceCenter(WIDTH / 2, HEIGHT / 2))
          .force('collide', forceCollide(58))
          .on('tick', () => {
            setGraph({ nodes: [...simulationNodes], links: simulationLinks })
          })
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : 'Unable to load graph data')
      })

    return () => {
      cancelled = true
      simulation?.stop()
    }
  }, [])

  if (error) return <p>Could not load graph: {error}</p>
  if (graph.nodes.length === 0) return <p>Loading graph…</p>

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Graph of Star Wars characters, musical themes, works, cues, and occurrences"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <g>
        {graph.links.map((link, index) => {
          const source = link.source as GraphNode
          const target = link.target as GraphNode
          if (
            typeof source.x !== 'number' ||
            typeof source.y !== 'number' ||
            typeof target.x !== 'number' ||
            typeof target.y !== 'number'
          ) return null

          const midX = (source.x + target.x) / 2
          const midY = (source.y + target.y) / 2
          return (
            <g key={`${source.id}-${target.id}-${index}`}>
              <line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="currentColor"
                strokeOpacity={0.2 + link.confidence * 0.45}
                strokeWidth={1 + link.confidence}
                strokeDasharray={link.confidence < 0.7 ? '5 5' : undefined}
              />
              <text
                x={midX}
                y={midY}
                textAnchor="middle"
                fontSize={11}
                fill="currentColor"
                opacity={0.9}
                style={{ paintOrder: 'stroke', stroke: 'var(--bg)', strokeWidth: 4 }}
              >
                {link.label}
              </text>
            </g>
          )
        })}
      </g>
      <g>
        {graph.nodes.map((node) => (
          <g
            key={node.id}
            transform={`translate(${node.x ?? WIDTH / 2}, ${node.y ?? HEIGHT / 2})`}
          >
            <circle r={34} fill={node.color} stroke="var(--bg)" strokeWidth={2} />
            <NodeIcon kind={node.kind} />
            <text y={50} textAnchor="middle" fontSize={13} fill="currentColor">
              {node.label}
            </text>
            <text y={65} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.55}>
              {node.kind}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}

export default StarWarsGraph
