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
  category?: string
}

type GraphLink = SimulationLinkDatum<GraphNode> & {
  label: string
  kind: string
  confidence: number
}

type GraphData = { nodes: GraphNode[]; links: GraphLink[] }

const WIDTH = 1200
const HEIGHT = 900

const DATA_FILES = [
  '/data/star-wars-musical-themes.json',
  '/data/star-wars-incidental-motifs-53-54.json',
  '/data/star-wars-incidental-motifs-55-56.json',
  '/data/star-wars-incidental-motifs-57-58.json',
  '/data/star-wars-incidental-motifs-59-60.json',
  '/data/star-wars-incidental-motifs-61-62.json',
  '/data/star-wars-incidental-motifs-63-64.json',
  '/data/star-wars-set-piece-themes.json',
  '/data/star-wars-battle-of-hoth-motifs.json',
]

function linkEndpointId(endpoint: GraphLink['source']) {
  return typeof endpoint === 'object' ? endpoint.id : String(endpoint)
}

function PersonIcon() {
  return (
    <g fill="#fff" transform="translate(-8, -11)">
      <circle cx="8" cy="5" r="5" />
      <path d="M0 21 C0 12 16 12 16 21 Z" />
    </g>
  )
}

function NoteIcon() {
  return (
    <g fill="#fff" transform="translate(-7, -11)">
      <circle cx="4" cy="18" r="4" />
      <rect x="7" y="1" width="2" height="17" />
      <path d="M7 1 L16 4 L16 9 L7 6 Z" />
    </g>
  )
}

function WorkIcon() {
  return (
    <g fill="none" stroke="#fff" strokeWidth="1.7" transform="translate(-10, -10)">
      <rect x="2" y="2" width="17" height="17" rx="2" />
      <path d="M2 7 H19 M7 2 V7 M14 2 V7" />
    </g>
  )
}

function CueIcon() {
  return (
    <g fill="none" stroke="#fff" strokeWidth="1.7" transform="translate(-11, -11)">
      <path d="M3 4 H20 M3 8 H20 M3 12 H20 M3 16 H20" />
      <path d="M8 2 V19 M15 2 V19" strokeOpacity="0.65" />
    </g>
  )
}

function OccurrenceIcon() {
  return (
    <g fill="none" stroke="#fff" strokeWidth="1.7" transform="translate(-11, -11)">
      <circle cx="11" cy="11" r="8" />
      <path d="M11 6 V11 L15 14" />
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

    Promise.all(
      DATA_FILES.map(async (path) => {
        const response = await fetch(path)
        if (!response.ok) throw new Error(`${path} returned ${response.status}`)
        return response.json() as Promise<GraphData>
      }),
    )
      .then((parts) => {
        if (cancelled) return

        const nodeMap = new Map<string, GraphNode>()
        for (const node of parts.flatMap((part) => part.nodes)) {
          nodeMap.set(node.id, node)
        }

        const linkMap = new Map<string, GraphLink>()
        for (const link of parts.flatMap((part) => part.links)) {
          const source = linkEndpointId(link.source)
          const target = linkEndpointId(link.target)
          linkMap.set(`${source}|${target}|${link.kind}|${link.label}`, link)
        }

        const simulationNodes = [...nodeMap.values()].map((node) => ({ ...node }))
        const simulationLinks = [...linkMap.values()].map((link) => ({ ...link }))

        simulation = forceSimulation(simulationNodes)
          .force(
            'link',
            forceLink<GraphNode, GraphLink>(simulationLinks)
              .id((node) => node.id)
              .distance(90),
          )
          .force('charge', forceManyBody().strength(-180))
          .force('center', forceCenter(WIDTH / 2, HEIGHT / 2))
          .force('collide', forceCollide(25))
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

  const showLinkLabels = graph.nodes.length < 120

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Graph of Star Wars works, leitmotifs, incidental motifs, and set-piece themes"
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
                strokeOpacity={0.12 + link.confidence * 0.32}
                strokeWidth={0.6 + link.confidence}
                strokeDasharray={link.confidence < 0.7 ? '5 5' : undefined}
              />
              {showLinkLabels && (
                <text
                  x={midX}
                  y={midY}
                  textAnchor="middle"
                  fontSize={9}
                  fill="currentColor"
                  opacity={0.9}
                  style={{ paintOrder: 'stroke', stroke: 'var(--bg)', strokeWidth: 4 }}
                >
                  {link.label}
                </text>
              )}
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
            <circle r={22} fill={node.color} stroke="var(--bg)" strokeWidth={1.5} />
            <NodeIcon kind={node.kind} />
            <text y={34} textAnchor="middle" fontSize={9} fill="currentColor">
              {node.label}
            </text>
            <text y={45} textAnchor="middle" fontSize={7} fill="currentColor" opacity={0.5}>
              {node.category ?? node.kind}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}

export default StarWarsGraph
