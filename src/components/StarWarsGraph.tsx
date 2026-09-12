import {
  drag,
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  select,
  zoom,
  type D3DragEvent,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3'
import { useEffect, useMemo, useRef, useState } from 'react'

type NodeKind = 'character' | 'subject' | 'theme' | 'work' | 'cue' | 'occurrence' | 'analysis'

interface GraphNode extends SimulationNodeDatum {
  id: string
  label: string
  kind: NodeKind
  category?: string
  catalogNumber?: string
  family?: string
  usedIn?: string[]
  statementTotal?: number
  sourcePage?: number
  composer?: string
  notes?: string
  description?: string
  componentType?: string
  episode?: number
  year?: number
  franchiseCode?: string
  mediaType?: string
  progression?: string
  cueNumber?: string
  cueName?: string
  clearStatementTime?: string
}

type GraphLink = SimulationLinkDatum<GraphNode> & {
  label: string
  kind: string
  confidence: number
  statementCount?: number
  sourcePage?: number
}

type CensusRecord = {
  themeId: string
  counts: Record<string, number>
  catalogueTotal: number
  sourcePage: number
  note?: string
}

type GraphData = {
  nodes: GraphNode[]
  links: GraphLink[]
  census?: CensusRecord[]
}

type NodeType =
  | 'work'
  | 'subject'
  | 'leitmotif-family'
  | 'leitmotif-component'
  | 'incidental-motif'
  | 'set-piece-theme'
  | 'set-piece-sequence'
  | 'set-piece-component'
  | 'analysis'
  | 'cue'
  | 'occurrence'

type TypeConfig = { label: string; color: string; radius: number }
type TableColumn = {
  label: string
  render: (node: GraphNode, related: GraphNode[], links: GraphLink[]) => string
}

const TYPE_ORDER: NodeType[] = [
  'work',
  'subject',
  'leitmotif-family',
  'leitmotif-component',
  'incidental-motif',
  'set-piece-theme',
  'set-piece-sequence',
  'set-piece-component',
  'analysis',
  'cue',
  'occurrence',
]

const TYPE_CONFIG: Record<NodeType, TypeConfig> = {
  work: { label: 'Works', color: '#f8d35d', radius: 17 },
  subject: { label: 'Subjects', color: '#45e0d5', radius: 15 },
  'leitmotif-family': { label: 'Leitmotif families', color: '#a78bfa', radius: 14 },
  'leitmotif-component': { label: 'Leitmotif components', color: '#d8b4fe', radius: 9 },
  'incidental-motif': { label: 'Incidental motifs', color: '#f472b6', radius: 9 },
  'set-piece-theme': { label: 'Set-piece themes', color: '#fb7185', radius: 10 },
  'set-piece-sequence': { label: 'Set-piece sequences', color: '#f97316', radius: 15 },
  'set-piece-component': { label: 'Set-piece components', color: '#fdba74', radius: 9 },
  analysis: { label: 'Analysis', color: '#60a5fa', radius: 12 },
  cue: { label: 'Cues', color: '#34d399', radius: 10 },
  occurrence: { label: 'Occurrences', color: '#a3e635', radius: 8 },
}

const DATA_FILES = [
  '/data/star-wars-musical-themes.json',
  '/data/star-wars-leitmotif-components.json',
  '/data/star-wars-incidental-motifs-53-54.json',
  '/data/star-wars-incidental-motifs-55-56.json',
  '/data/star-wars-incidental-motifs-57-58.json',
  '/data/star-wars-incidental-motifs-59-60.json',
  '/data/star-wars-incidental-motifs-61-62.json',
  '/data/star-wars-incidental-motifs-63-64.json',
  '/data/star-wars-set-piece-themes.json',
  '/data/star-wars-battle-of-hoth-motifs.json',
  '/data/star-wars-thematic-relationships.json',
  '/data/star-wars-census-subjects.json',
]

const EPISODE_IDS: Record<string, string> = {
  I: 'ep1',
  II: 'ep2',
  III: 'ep3',
  IV: 'ep4',
  V: 'ep5',
  VI: 'ep6',
  VII: 'ep7',
  VIII: 'ep8',
  IX: 'ep9',
}

function nodeType(node: GraphNode): NodeType {
  if (node.kind === 'work') return 'work'
  if (node.kind === 'subject' || node.kind === 'character') return 'subject'
  if (node.kind === 'analysis') return 'analysis'
  if (node.kind === 'cue') return 'cue'
  if (node.kind === 'occurrence') return 'occurrence'
  if (node.category === 'leitmotif-component') return 'leitmotif-component'
  if (node.category === 'incidental-motif') return 'incidental-motif'
  if (node.category === 'set-piece-theme') return 'set-piece-theme'
  if (node.category === 'set-piece-sequence') return 'set-piece-sequence'
  if (node.category === 'set-piece-component') return 'set-piece-component'
  return 'leitmotif-family'
}

function endpointId(endpoint: GraphLink['source']) {
  return typeof endpoint === 'object' ? endpoint.id : String(endpoint)
}

function shortLabel(label: string) {
  return label.length > 29 ? label.slice(0, 27) + '…' : label
}

function valueOrDash(value: unknown) {
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—'
  if (value === undefined || value === null || value === '') return '—'
  return String(value)
}

function expandCensus(records: CensusRecord[]): GraphLink[] {
  return records.flatMap((record) =>
    Object.entries(record.counts).map(([episode, count]) => ({
      source: record.themeId,
      target: EPISODE_IDS[episode],
      label: String(count) + (count === 1 ? ' statement' : ' statements'),
      kind: 'used-in-count',
      confidence: 1,
      statementCount: count,
      sourcePage: record.sourcePage,
    })),
  )
}

function mergeGraph(parts: GraphData[]): GraphData {
  const nodeMap = new Map<string, GraphNode>()
  for (const node of parts.flatMap((part) => part.nodes)) {
    nodeMap.set(node.id, { ...nodeMap.get(node.id), ...node })
  }

  const linkMap = new Map<string, GraphLink>()
  const links = parts.flatMap((part) => [...part.links, ...expandCensus(part.census ?? [])])
  for (const link of links) {
    const source = endpointId(link.source)
    const target = endpointId(link.target)
    linkMap.set([source, target, link.kind, link.label].join('|'), link)
  }

  return { nodes: [...nodeMap.values()], links: [...linkMap.values()] }
}

function connectedIds(data: GraphData, activeId: string | null) {
  const ids = new Set<string>()
  if (!activeId) return ids
  ids.add(activeId)
  for (const link of data.links) {
    const source = endpointId(link.source)
    const target = endpointId(link.target)
    if (source === activeId) ids.add(target)
    if (target === activeId) ids.add(source)
  }
  return ids
}

function detailLine(node: GraphNode) {
  if (node.kind === 'work') {
    return [node.year, node.episode ? 'Episode ' + node.episode : node.mediaType].filter(Boolean).join(' · ')
  }
  if (node.kind === 'subject') return [node.category, node.description].filter(Boolean).join(' · ')
  return [
    node.catalogNumber ? 'Catalogue ' + node.catalogNumber : undefined,
    node.category,
    node.statementTotal != null ? node.statementTotal + ' statements' : undefined,
  ].filter(Boolean).join(' · ')
}

function columnsFor(type: NodeType): TableColumn[] {
  if (type === 'work') {
    return [
      { label: 'Released', render: (node) => valueOrDash(node.year) },
      {
        label: 'Scope',
        render: (node) => valueOrDash(node.episode ? 'Episode ' + node.episode : node.mediaType ?? node.franchiseCode),
      },
      {
        label: 'Theme families',
        render: (_node, related) => String(related.filter((node) => nodeType(node) === 'leitmotif-family').length),
      },
      {
        label: 'Statements',
        render: (_node, _related, links) =>
          valueOrDash(links.reduce((total, link) => total + (link.statementCount ?? 0), 0) || undefined),
      },
    ]
  }
  if (type === 'subject') {
    return [
      { label: 'Subject type', render: (node) => valueOrDash(node.category) },
      { label: 'Represented by', render: (_node, related) => valueOrDash(related.map((node) => node.label)) },
      { label: 'Catalogue reading', render: (node) => valueOrDash(node.description) },
      { label: 'Page', render: (node) => valueOrDash(node.sourcePage) },
    ]
  }
  if (type === 'analysis') {
    return [
      { label: 'Analysis type', render: (node) => valueOrDash(node.category) },
      { label: 'Progression', render: (node) => valueOrDash(node.progression) },
      { label: 'Connected material', render: (_node, related) => valueOrDash(related.map((node) => node.label)) },
      { label: 'Page', render: (node) => valueOrDash(node.sourcePage) },
    ]
  }
  if (type === 'cue' || type === 'occurrence') {
    return [
      { label: 'Time / cue', render: (node) => valueOrDash(node.clearStatementTime ?? node.cueNumber ?? node.cueName) },
      { label: 'Connected material', render: (_node, related) => valueOrDash(related.map((node) => node.label)) },
      { label: 'Detail', render: (node) => valueOrDash(node.notes ?? node.description) },
      { label: 'Page', render: (node) => valueOrDash(node.sourcePage) },
    ]
  }
  return [
    { label: 'Catalogue', render: (node) => valueOrDash(node.catalogNumber) },
    { label: 'Appears in', render: (node) => valueOrDash(node.usedIn) },
    { label: 'Statements', render: (node) => valueOrDash(node.statementTotal) },
    {
      label: type === 'leitmotif-component' ? 'Component' : 'Family / detail',
      render: (node) => valueOrDash(node.componentType ?? node.family ?? node.notes ?? node.description),
    },
    { label: 'Connections', render: (_node, related) => String(related.length) },
    { label: 'Page', render: (node) => valueOrDash(node.sourcePage) },
  ]
}

function GraphTable({
  data,
  nodes,
  activeNodeId,
  onHover,
  onPin,
}: {
  data: GraphData
  nodes: GraphNode[]
  activeNodeId: string | null
  onHover: (id: string | null) => void
  onPin: (id: string) => void
}) {
  const nodeById = useMemo(() => new Map(data.nodes.map((node) => [node.id, node])), [data.nodes])
  const linksByNode = useMemo(() => {
    const map = new Map<string, GraphLink[]>()
    for (const link of data.links) {
      const source = endpointId(link.source)
      const target = endpointId(link.target)
      map.set(source, [...(map.get(source) ?? []), link])
      map.set(target, [...(map.get(target) ?? []), link])
    }
    return map
  }, [data.links])

  const groups = TYPE_ORDER.map((type) => ({
    type,
    nodes: nodes
      .filter((node) => nodeType(node) === type)
      .sort((a, b) => {
        const aNumber = Number.parseInt(a.catalogNumber ?? '', 10)
        const bNumber = Number.parseInt(b.catalogNumber ?? '', 10)
        if (Number.isFinite(aNumber) && Number.isFinite(bNumber) && aNumber !== bNumber) return aNumber - bNumber
        return a.label.localeCompare(b.label)
      }),
  })).filter((group) => group.nodes.length)

  return (
    <div className="catalogue-groups">
      {groups.map(({ type, nodes: groupNodes }) => {
        const config = TYPE_CONFIG[type]
        const columns = columnsFor(type)
        return (
          <section className="catalogue-group" key={type}>
            <div className="catalogue-group-heading">
              <span className="legend-swatch" style={{ background: config.color }} />
              <h3>{config.label}</h3>
              <span>{groupNodes.length}</span>
            </div>
            <div className="catalogue-table-wrap">
              <table className="catalogue-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    {columns.map((column) => <th key={column.label}>{column.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {groupNodes.map((node) => {
                    const links = linksByNode.get(node.id) ?? []
                    const related = [...new Map(
                      links
                        .map((link) => endpointId(link.source) === node.id ? endpointId(link.target) : endpointId(link.source))
                        .map((id) => nodeById.get(id))
                        .filter((candidate): candidate is GraphNode => Boolean(candidate))
                        .map((candidate) => [candidate.id, candidate]),
                    ).values()]
                    const isActive = node.id === activeNodeId
                    return (
                      <tr
                        key={node.id}
                        className={(isActive ? 'is-active ' : '') + (activeNodeId && !isActive ? 'is-dimmed' : '')}
                        onMouseEnter={() => onHover(node.id)}
                        onMouseLeave={() => onHover(null)}
                        onFocus={() => onHover(node.id)}
                        onBlur={() => onHover(null)}
                        onClick={() => onPin(node.id)}
                        tabIndex={0}
                      >
                        <th scope="row">
                          <span className="table-node-mark" style={{ background: config.color }} />
                          {node.label}
                        </th>
                        {columns.map((column) => <td key={column.label}>{column.render(node, related, links)}</td>)}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )
      })}
    </div>
  )
}

function StarWarsGraph() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] })
  const [error, setError] = useState<string | null>(null)
  const [width, setWidth] = useState(1200)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [pinnedNodeId, setPinnedNodeId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [enabledTypes, setEnabledTypes] = useState<Set<NodeType>>(() => new Set(TYPE_ORDER))

  const activeNodeId = hoveredNodeId ?? pinnedNodeId

  useEffect(() => {
    let cancelled = false
    Promise.all(
      DATA_FILES.map(async (path) => {
        const response = await fetch(path)
        if (!response.ok) throw new Error(path + ' returned ' + response.status)
        return response.json() as Promise<GraphData>
      }),
    )
      .then((parts) => {
        if (!cancelled) setData(mergeGraph(parts))
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : 'Unable to load graph data')
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(320, Math.floor(entry.contentRect.width)))
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const visibleData = useMemo(() => {
    const nodes = data.nodes.filter((node) => enabledTypes.has(nodeType(node)))
    const ids = new Set(nodes.map((node) => node.id))
    return {
      nodes,
      links: data.links.filter((link) => ids.has(endpointId(link.source)) && ids.has(endpointId(link.target))),
    }
  }, [data, enabledTypes])

  const tableNodes = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase()
    if (!normalized) return visibleData.nodes
    return visibleData.nodes.filter((node) =>
      [
        node.label,
        node.category,
        node.catalogNumber,
        node.family,
        node.description,
        node.notes,
        node.usedIn?.join(' '),
      ].filter(Boolean).join(' ').toLocaleLowerCase().includes(normalized),
    )
  }, [query, visibleData.nodes])

  const searchMatchIds = useMemo(() => new Set(tableNodes.map((node) => node.id)), [tableNodes])
  const neighborIds = useMemo(() => connectedIds(visibleData, activeNodeId), [visibleData, activeNodeId])
  const activeNode = data.nodes.find((node) => node.id === activeNodeId)
  const height = Math.max(620, Math.min(900, Math.round(width * 0.58)))

  useEffect(() => {
    if (!svgRef.current || visibleData.nodes.length === 0) return

    const svg = select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', '0 0 ' + width + ' ' + height)

    const root = svg.append('g').attr('class', 'graph-viewport')
    const links = visibleData.links.map((link) => ({ ...link }))
    const nodes = visibleData.nodes.map((node) => ({ ...node }))
    const simulation = forceSimulation(nodes)
      .force(
        'link',
        forceLink<GraphNode, GraphLink>(links)
          .id((node) => node.id)
          .distance((link) => link.kind === 'component' ? 34 : link.kind === 'used-in-count' ? 105 : 72)
          .strength((link) => link.kind === 'used-in-count' ? 0.18 : 0.45),
      )
      .force('charge', forceManyBody().strength(-82))
      .force('center', forceCenter(width / 2, height / 2))
      .force(
        'collide',
        forceCollide<GraphNode>()
          .radius((node) => TYPE_CONFIG[nodeType(node)].radius + 12)
          .iterations(2),
      )

    const link = root.append('g')
      .attr('class', 'graph-links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (datum) =>
        datum.statementCount ? 0.7 + Math.sqrt(datum.statementCount) * 0.38 : 0.8 + datum.confidence,
      )
      .attr('stroke-dasharray', (datum) => datum.confidence < 0.7 ? '5 5' : null)

    const node = root.append('g')
      .attr('class', 'graph-nodes')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodes, (datum) => datum.id)
      .join('g')
      .attr('class', 'graph-node')
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', (datum) => datum.label + ', ' + TYPE_CONFIG[nodeType(datum)].label)
      .on('mouseenter focus', (_event, datum) => setHoveredNodeId(datum.id))
      .on('mouseleave blur', () => setHoveredNodeId(null))
      .on('click', (event, datum) => {
        event.stopPropagation()
        setPinnedNodeId((current) => current === datum.id ? null : datum.id)
      })
      .on('keydown', (event: KeyboardEvent, datum) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          setPinnedNodeId((current) => current === datum.id ? null : datum.id)
        }
      })

    node.append('circle')
      .attr('r', (datum) => TYPE_CONFIG[nodeType(datum)].radius)
      .attr('fill', (datum) => TYPE_CONFIG[nodeType(datum)].color)
      .attr('stroke-width', (datum) => nodeType(datum) === 'work' ? 2.5 : 1.25)

    node.append('text')
      .attr('class', 'graph-label')
      .attr('x', (datum) => TYPE_CONFIG[nodeType(datum)].radius + 5)
      .attr('y', 3)
      .text((datum) => shortLabel(datum.label))

    node.append('title').text((datum) => [datum.label, detailLine(datum)].filter(Boolean).join('\n'))

    node.call(
      drag<SVGGElement, GraphNode>()
        .on('start', (event: D3DragEvent<SVGGElement, GraphNode, GraphNode>, datum) => {
          if (!event.active) simulation.alphaTarget(0.25).restart()
          datum.fx = datum.x
          datum.fy = datum.y
        })
        .on('drag', (event: D3DragEvent<SVGGElement, GraphNode, GraphNode>, datum) => {
          datum.fx = event.x
          datum.fy = event.y
        })
        .on('end', (event: D3DragEvent<SVGGElement, GraphNode, GraphNode>, datum) => {
          if (!event.active) simulation.alphaTarget(0)
          datum.fx = null
          datum.fy = null
        }),
    )

    svg.call(
      zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.35, 4])
        .on('zoom', (event) => root.attr('transform', event.transform)),
    )
      .on('dblclick.zoom', null)
      .on('click', (event) => {
        if (event.target === svgRef.current) setPinnedNodeId(null)
      })

    simulation.on('tick', () => {
      link
        .attr('x1', (datum) => (datum.source as GraphNode).x ?? 0)
        .attr('y1', (datum) => (datum.source as GraphNode).y ?? 0)
        .attr('x2', (datum) => (datum.target as GraphNode).x ?? 0)
        .attr('y2', (datum) => (datum.target as GraphNode).y ?? 0)
      node.attr('transform', (datum) => 'translate(' + (datum.x ?? 0) + ',' + (datum.y ?? 0) + ')')
    })

    return () => {
      simulation.stop()
    }
  }, [height, visibleData, width])

  useEffect(() => {
    if (!svgRef.current) return
    const svg = select(svgRef.current)
    const hasQuery = query.trim().length > 0
    svg.selectAll<SVGGElement, GraphNode>('.graph-node')
      .classed('is-active', (node) => node.id === activeNodeId)
      .classed('is-neighbor', (node) => Boolean(activeNodeId) && neighborIds.has(node.id) && node.id !== activeNodeId)
      .classed(
        'is-dimmed',
        (node) => activeNodeId ? !neighborIds.has(node.id) : hasQuery && !searchMatchIds.has(node.id),
      )
    svg.selectAll<SVGLineElement, GraphLink>('.graph-links line')
      .classed(
        'is-active',
        (link) => Boolean(activeNodeId) &&
          (endpointId(link.source) === activeNodeId || endpointId(link.target) === activeNodeId),
      )
      .classed(
        'is-dimmed',
        (link) => Boolean(activeNodeId) &&
          endpointId(link.source) !== activeNodeId &&
          endpointId(link.target) !== activeNodeId,
      )
  }, [activeNodeId, neighborIds, query, searchMatchIds])

  function toggleType(type: NodeType) {
    setEnabledTypes((current) => {
      const next = new Set(current)
      if (next.has(type) && next.size > 1) next.delete(type)
      else next.add(type)
      return next
    })
    setPinnedNodeId(null)
  }

  if (error) return <p className="graph-message">Could not load graph: {error}</p>
  if (data.nodes.length === 0) return <p className="graph-message">Charting the galaxy…</p>

  return (
    <section className="star-wars-explorer">
      <div className="graph-toolbar">
        <label className="graph-search">
          <span>Find anything</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rey, ostinato, Episode V…"
          />
        </label>
        <div className="graph-legend" aria-label="Toggle graph types">
          {TYPE_ORDER.filter((type) => data.nodes.some((node) => nodeType(node) === type)).map((type) => {
            const config = TYPE_CONFIG[type]
            const enabled = enabledTypes.has(type)
            return (
              <button
                key={type}
                type="button"
                className={enabled ? 'is-enabled' : ''}
                onClick={() => toggleType(type)}
                aria-pressed={enabled}
              >
                <span className="legend-swatch" style={{ background: config.color }} />
                {config.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="graph-stage" ref={containerRef}>
        <div className="graph-stage-meta">
          <span>{visibleData.nodes.length} nodes</span>
          <span>{visibleData.links.length} relationships</span>
          <span>Scroll to zoom · drag to rearrange · click to pin</span>
        </div>
        <svg
          ref={svgRef}
          className="force-graph"
          role="img"
          aria-label="Interactive force-directed knowledge graph of Star Wars music"
        />
        <aside className={'graph-inspector ' + (activeNode ? 'is-visible' : '')} aria-live="polite">
          {activeNode && (
            <>
              <span className="inspector-type" style={{ color: TYPE_CONFIG[nodeType(activeNode)].color }}>
                {TYPE_CONFIG[nodeType(activeNode)].label}
              </span>
              <strong>{activeNode.label}</strong>
              <span>{detailLine(activeNode)}</span>
              <span>{neighborIds.size - 1} direct connections</span>
            </>
          )}
        </aside>
      </div>

      <header className="catalogue-heading">
        <div>
          <p className="eyebrow">Catalogue index</p>
          <h2>Every node, with the useful details intact</h2>
        </div>
        <p>
          {tableNodes.length} of {visibleData.nodes.length} visible. Hover any row to isolate the same
          node in the graph; click to keep it pinned.
        </p>
      </header>
      <GraphTable
        data={visibleData}
        nodes={tableNodes}
        activeNodeId={activeNodeId}
        onHover={setHoveredNodeId}
        onPin={(id) => setPinnedNodeId((current) => current === id ? null : id)}
      />
    </section>
  )
}

export default StarWarsGraph
