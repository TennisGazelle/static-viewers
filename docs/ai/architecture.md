# Architecture

← [`docs/ai/README.md`](./README.md) · rules: [`.cursor/rules/rules.mdc`](../../.cursor/rules/rules.mdc)

## File map

| File | Role | Change here when… |
|------|------|--------------------|
| [`src/main.tsx`](../../src/main.tsx) | React root; applies the initial theme and mounts `<BrowserRouter>` | Changing startup behavior, router type, or adding a global provider |
| [`src/App.tsx`](../../src/App.tsx) | Route table and global theme control | Adding, removing, or renaming a page's route, or changing the app shell |
| [`src/theme.ts`](../../src/theme.ts) | Light/dark preference initialization, application, and persistence | Changing theme behavior or storage |
| [`src/components/ThemeToggle.tsx`](../../src/components/ThemeToggle.tsx) | Persistent light/dark toggle | Changing the theme control's behavior or label |
| [`src/pages/Home.tsx`](../../src/pages/Home.tsx) | Landing page; links to every viewer page | Adding a new viewer page (link it here too) |
| [`src/pages/StarWarsMusicalThemes.tsx`](../../src/pages/StarWarsMusicalThemes.tsx) | Star Wars viewer page | That page's layout/copy |
| [`src/pages/OppenheimerPlotMap.tsx`](../../src/pages/OppenheimerPlotMap.tsx) | Oppenheimer viewer page | That page's layout/copy |
| [`src/components/StarWarsGraph.tsx`](../../src/components/StarWarsGraph.tsx) | Observable-style D3 force graph, controls, and coordinated catalogue tables | Graph layout, interactions, visual type mappings, table columns, or loaded data shards |
| [`public/data/star-wars-*.json`](../../public/data) (12 shards — see `DATA_FILES` in `StarWarsGraph.tsx`) | Graph topology and catalogue-derived records, fetched and merged at runtime | Adding/editing nodes, links, census counts, or confidence values. For *what* to add/how it maps to the source catalogue, see [`STAR_WARS_DATA_MAPPING.md`](../../STAR_WARS_DATA_MAPPING.md) |
| [`src/index.css`](../../src/index.css) | Black-and-gold theme tokens, global base styles, and shared `.viewer-page` shell | Site-wide styles or viewer presentation |
| [`docs/reference/`](../../docs/reference/) | Source PDFs (Oppenheimer screenplay, Star Wars catalogue) | Adding reference material |

## Routing

Routes are `<Route path=".." element={<Page />} />` entries in `src/App.tsx`, rendered inside the `<BrowserRouter>` from `src/main.tsx`. To add a page: create `src/pages/<Name>.tsx`, add its `<Route>`, and link it from `Home.tsx`.

## Theme

The site uses one black-and-gold theme family with explicit light and dark modes. `App.tsx` owns the mode so the toggle remains available across routes; `src/theme.ts` initializes it from local storage or the operating-system preference and applies `data-theme` to the root element. Shared semantic CSS tokens in `src/index.css` style the home page and both viewer shells. Viewer-specific colors are reserved for data categories and timeline branches, where color carries meaning.

## Graphs

`StarWarsGraph.tsx` adapts Observable's force-directed graph component pattern to React:

1. Fetch source-aligned JSON shards from `public/data/`. Merge nodes by `id` and links by `source|target|kind|label`; merge duplicate node properties rather than replacing the earlier record wholesale.
2. Expand compact Appendix 3 `census` records into `used-in-count` edges between each parent leitmotif family and each Skywalker Saga film where it occurs. The edge retains `statementCount` and `sourcePage`; its stroke width uses the square root of the count so large values remain legible.
3. React owns fetched data, filters, search, hover/pin state, the inspector, and semantic HTML tables. A D3 effect owns the SVG graph layer: cloned simulation data, `forceLink`, `forceManyBody`, `forceCenter`, a warm-start `forceRadial` (seeded on a circle, strength eases off as alpha cools), `forceCollide`, node/link joins, tick updates, zoom, and drag. The stage is full-bleed (`100svh`) behind an overlaid toolbar, similar to the [d3-force](https://d3js.org/d3-force) docs hero.
4. A `ResizeObserver` makes the viewBox responsive to the full-bleed graph stage’s width and height. Rebuilding after a resize, data-type toggle, or source-data change stops the previous simulation in effect cleanup.
5. Hover or keyboard focus updates shared React state. A small follow-up D3 effect applies active/neighbor/dimmed classes to the SVG while React applies the same active/dimmed state to table rows. Clicking a node or row toggles it in a multi-pin set; a Reset pins control clears the set. On load, only `work` and `leitmotif-family` types are enabled. The canvas is full-bleed behind frosted overlay panes: hero (top-left), and a right sidebar (~20%) with search, type checkboxes, and independently scrolling tables.
6. Visual categories are derived from `kind` plus `category`. `TYPE_CONFIG` is the single source of truth for each category's label, color, and node radius. This lets leitmotif families, components, incidental motifs, set pieces, works, subjects, and analysis remain visually distinct without duplicating presentation colors throughout the JSON.
7. The bottom catalogue is grouped in the same visual-type order as the graph legend. `columnsFor` supplies type-specific columns: films summarize release and census totals, subjects show semantic associations, and musical/analysis rows expose their relevant catalogue metadata.

D3 receives clones because simulations mutate nodes and replace string link endpoints with object references. Never reuse those mutated objects as canonical application data.

## Accessibility and interaction

- Graph nodes are keyboard-focusable buttons. Enter or Space pins a node.
- The SVG has an accessible summary; each node has an `aria-label` and native title.
- Legend controls use `aria-pressed`, and at least one visual type always remains enabled.
- Hover is an enhancement: search, keyboard focus, type toggles, and the complete tables expose the same information without precise pointer movement.
