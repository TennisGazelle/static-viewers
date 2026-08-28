# Architecture

← [`docs/ai/README.md`](./README.md) · rules: [`.cursor/rules/rules.mdc`](../../.cursor/rules/rules.mdc)

## File map

| File | Role | Change here when… |
|------|------|--------------------|
| [`src/main.tsx`](../../src/main.tsx) | React root; mounts `<BrowserRouter>` | Changing router type or adding a global provider |
| [`src/App.tsx`](../../src/App.tsx) | Route table (`<Routes>`) | Adding, removing, or renaming a page's route |
| [`src/pages/Home.tsx`](../../src/pages/Home.tsx) | Landing page; links to every viewer page | Adding a new viewer page (link it here too) |
| [`src/pages/StarWarsMusicalThemes.tsx`](../../src/pages/StarWarsMusicalThemes.tsx) | Star Wars viewer page | That page's layout/copy |
| [`src/pages/OppenheimerPlotMap.tsx`](../../src/pages/OppenheimerPlotMap.tsx) | Oppenheimer viewer page | That page's layout/copy |
| [`src/components/StarWarsGraph.tsx`](../../src/components/StarWarsGraph.tsx) | d3-force graph renderer for the Star Wars page | Graph layout, forces, or node icons |
| [`public/data/star-wars-musical-themes.json`](../../public/data/star-wars-musical-themes.json) | Graph topology (nodes/links), fetched at runtime | Adding/editing nodes, links, or confidence values |
| [`src/index.css`](../../src/index.css) | Global base styles; light/dark via `prefers-color-scheme` | Site-wide look changes |

## Routing

Routes are `<Route path=".." element={<Page />} />` entries in `src/App.tsx`, rendered inside the `<BrowserRouter>` from `src/main.tsx`. To add a page: create `src/pages/<Name>.tsx`, add its `<Route>`, and link it from `Home.tsx`.

## Graphs

Pattern used by `StarWarsGraph.tsx` — reuse it for any future graph page (e.g. an Oppenheimer plot map graph):

1. Fetch the topology from a static JSON file in `public/data/` — never hardcode nodes/links inside the component (see [rules.mdc § DRY](../../.cursor/rules/rules.mdc)).
2. Clone the fetched nodes/links, then run d3's `forceSimulation` with `forceLink` + `forceManyBody` + `forceCenter` + `forceCollide`.
3. On each `tick`, copy the (in-place-mutated) node/link arrays into React state. d3 never touches the DOM directly — React renders the SVG purely from that state.
4. Stop the simulation in the effect's cleanup function; guard against a stale fetch resolving after unmount.

## Icons

Per-`kind` inline SVG glyphs (e.g. `PersonIcon`, `NoteIcon`, `WorkIcon`, `CueIcon`, `OccurrenceIcon` in `StarWarsGraph.tsx`) — small `<g>` fragments centered at `(0, 0)`, selected by a `NodeIcon({ kind })` switch. Add a new kind the same way rather than pulling in an image asset; see [rules.mdc § Licensing](../../.cursor/rules/rules.mdc) for why.
