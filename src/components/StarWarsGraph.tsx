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

type NodeKind = 'character' | 'theme'

interface GraphNode extends SimulationNodeDatum {
  id: string
  label: string
  kind: NodeKind
  color: string
}

type GraphLink = SimulationLinkDatum<GraphNode> & { label: string }

const WIDTH = 480
const HEIGHT = 320

const initialNodes: GraphNode[] = [
  {
    id: 'anakin',
    label: 'Anakin Skywalker',
    kind: 'character',
    color: '#3a6ea5',
  },
  { id: 'vader', label: 'Darth Vader', kind: 'character', color: '#1c1c1c' },
  {
    id: 'imperial-march',
    label: 'Imperial March',
    kind: 'theme',
    color: '#6b3fa0',
  },
]

const initialLinks: GraphLink[] = [
  { source: 'anakin', target: 'vader', label: 'becomes' },
  { source: 'vader', target: 'imperial-march', label: 'leitmotif' },
  { source: 'anakin', target: 'imperial-march', label: 'foreshadows' },
]

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

function StarWarsGraph() {
  const [graph, setGraph] = useState<{
    nodes: GraphNode[]
    links: GraphLink[]
  }>(() => ({
    nodes: initialNodes.map((node) => ({ ...node })),
    links: initialLinks.map((link) => ({ ...link })),
  }))

  useEffect(() => {
    const simulationNodes = initialNodes.map((node) => ({ ...node }))
    const simulationLinks = initialLinks.map((link) => ({ ...link }))

    const simulation = forceSimulation(simulationNodes)
      .force(
        'link',
        forceLink<GraphNode, GraphLink>(simulationLinks)
          .id((node) => node.id)
          .distance(150),
      )
      .force('charge', forceManyBody().strength(-500))
      .force('center', forceCenter(WIDTH / 2, HEIGHT / 2))
      .force('collide', forceCollide(48))
      .on('tick', () => {
        setGraph({ nodes: [...simulationNodes], links: simulationLinks })
      })

    return () => {
      simulation.stop()
    }
  }, [])

  const { nodes, links } = graph

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Graph connecting Anakin Skywalker, Darth Vader, and the Imperial March"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <g>
        {links.map((link) => {
          const source = link.source as GraphNode
          const target = link.target as GraphNode
          if (typeof source.x !== 'number' || typeof target.x !== 'number') {
            return null
          }
          const midX = (source.x + target.x) / 2
          const midY = (source.y! + target.y!) / 2
          return (
            <g key={`${source.id}-${target.id}`}>
              <line
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="currentColor"
                strokeOpacity={0.35}
              />
              <text
                x={midX}
                y={midY}
                textAnchor="middle"
                fontSize={11}
                fill="currentColor"
                style={{
                  paintOrder: 'stroke',
                  stroke: 'var(--bg)',
                  strokeWidth: 4,
                }}
              >
                {link.label}
              </text>
            </g>
          )
        })}
      </g>
      <g>
        {nodes.map((node) => (
          <g
            key={node.id}
            transform={`translate(${node.x ?? WIDTH / 2}, ${node.y ?? HEIGHT / 2})`}
          >
            <circle
              r={32}
              fill={node.color}
              stroke="var(--bg)"
              strokeWidth={2}
            />
            {node.kind === 'theme' ? <NoteIcon /> : <PersonIcon />}
            <text y={48} textAnchor="middle" fontSize={13} fill="currentColor">
              {node.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}

export default StarWarsGraph
