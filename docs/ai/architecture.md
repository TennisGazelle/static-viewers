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
| [`src/components/StarWarsGraph.tsx`](../../src/components/StarWarsGraph.tsx) | d3-force graph renderer for the Star Wars page | Graph layout, forces, node icons, or which data shards get loaded |
| [`public/data/star-wars-*.json`](../../public/data) (9 shards — see `DATA_FILES` in `StarWarsGraph.tsx`) | Graph topology (nodes/links), fetched and merged at runtime | Adding/editing nodes, links, or confidence values. For *what* to add/how it maps to the source catalogue, see [`STAR_WARS_DATA_MAPPING.md`](../../STAR_WARS_DATA_MAPPING.md) — that doc is the authority on content, this one on rendering |
| [`src/index.css`](../../src/index.css) | Global base styles; light/dark via `prefers-color-scheme` | Site-wide look changes |

## Routing

Routes are `<Route path=".." element={<Page />} />` entries in `src/App.tsx`, rendered inside the `<BrowserRouter>` from `src/main.tsx`. To add a page: create `src/pages/<Name>.tsx`, add its `<Route>`, and link it from `Home.tsx`.

## Graphs

Pattern used by `StarWarsGraph.tsx` — reuse it for any future graph page (e.g. an Oppenheimer plot map graph):

1. Fetch the topology from static JSON file(s) in `public/data/` — never hardcode nodes/links inside the component (see [rules.mdc § DRY](../../.cursor/rules/rules.mdc)). A graph can be split across multiple shard files (`DATA_FILES`); fetch them with `Promise.all` and merge by `id` (nodes) or `source|target|kind|label` (links) so overlapping shards de-dupe instead of double-rendering.
2. Clone the merged nodes/links, then run d3's `forceSimulation` with `forceLink` + `forceManyBody` + `forceCenter` + `forceCollide`. Retune `charge`/`collide`/`distance` as the node count grows — the viewBox scales automatically (step 3), but overly strong forces on a large graph still make it sprawling and hard to read.
3. On each `tick`, copy the (in-place-mutated) node/link arrays into React state. d3 never touches the DOM directly — React renders the SVG purely from that state. The `<svg>`'s `viewBox` is computed from the current nodes' bounding box (plus padding) each render, so it fits any node count without a hardcoded size.
4. Stop the simulation in the effect's cleanup function; guard against a stale fetch resolving after unmount.
5. Above a size threshold (`showLinkLabels` in `StarWarsGraph.tsx`), stop rendering link labels — they become unreadable line-noise before the nodes do.

## Icons

Per-`kind` inline SVG glyphs (e.g. `PersonIcon`, `NoteIcon`, `WorkIcon`, `CueIcon`, `OccurrenceIcon` in `StarWarsGraph.tsx`) — small `<g>` fragments centered at `(0, 0)`, selected by a `NodeIcon({ kind })` switch. Add a new kind the same way rather than pulling in an image asset; see [rules.mdc § Licensing](../../.cursor/rules/rules.mdc) for why. A node's optional `category` renders under its label as a finer-grained subtype than `kind` (falls back to `kind` when absent) — it doesn't need its own icon.
