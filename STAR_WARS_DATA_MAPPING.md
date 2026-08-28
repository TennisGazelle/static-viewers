# Star Wars catalogue → graph JSON mapping

This viewer is being transcribed from Frank Lehman's **Complete Catalogue of the Musical Themes of Star Wars**, revised June 19, 2023. The graph data lives in `public/data/star-wars-musical-themes.json`.

The goal is not to reinterpret the catalogue. The JSON should preserve Lehman's categories, labels, uncertainty, and distinctions so later UI work can choose how to display them.

## Source map

| PDF pages | Catalogue section | JSON treatment |
| --- | --- | --- |
| 2 | Contents / taxonomy | Defines the high-level categories used by this project. |
| 4–18 | Original Trilogy leitmotifs | `theme-1-*` through `theme-23-*` nodes. |
| 19–30 | Prequel Trilogy leitmotifs | `theme-24-*` through `theme-40-*` nodes. |
| 31–46 | Sequel Trilogy leitmotifs | `theme-41-*` through `theme-62-*` nodes. |
| 47 | Rogue One | `r*` theme nodes. |
| 48–49 | Solo | `s*` theme nodes, retaining composer attribution where given. |
| 50 | Galaxy's Edge | `ge*` theme nodes. |
| 51 | Obi-Wan Kenobi | `owk*` theme nodes, retaining composer attribution and the catalogue's uncertainty for Becoming Vader. |
| 52–64 | Incidental Motifs | Not yet transcribed. There are 116 numbered entries and they should eventually become theme-like nodes with `category: incidental-motif`, not be silently promoted to leitmotifs. |
| 65–70 | Set-Piece Themes / Battle of Hoth | Not yet exhaustively transcribed. These are distinct from incidental motifs and leitmotifs even though the boundaries can migrate over time. |
| 71–78 | Thematic Relationships | A small seed of explicit relationships is in JSON. This section is the authority for confidence and transformation semantics. |
| 80–81 | Source Music | Deferred. These should eventually be their own music nodes rather than being conflated with underscore leitmotifs. |
| 82–86 | Concert Arrangements | Deferred. Likely work/arrangement nodes connected to the thematic material they contain. |
| 87 | End Credits | Deferred. |
| 89–98 | Cue Lists | Deferred. These should populate `cue` nodes and later occurrence edges/nodes. |
| 99–102 | Thematic Census | Used now for `statementTotal` on Skywalker Saga leitmotif nodes. |
| 103–106 | Bibliography / citation / fair use | Provenance only; not graph data. |

## Current node rules

### Works

The nine Skywalker Saga films plus Rogue One, Solo, Galaxy's Edge, and Obi-Wan Kenobi are `kind: work` nodes. Roman-numeral `Used In` codes from the PDF are retained in theme metadata rather than expanded into hundreds of graph edges yet.

### Leitmotifs

The numbered Skywalker Saga catalogue is represented as one primary node per catalogue number, 1 through 62. Where Lehman divides a number into A/B/C components, this first pass usually keeps them under the parent catalogue number. This is intentional and reversible. Later passes can split detachable components into child theme nodes when the graph needs that resolution.

Each node currently carries:

- `catalogNumber`
- `family`
- `usedIn`
- `statementTotal` where the thematic census supplies a useful total
- `sourcePage`
- `composer` for anthology/miscellaneous entries where the catalogue explicitly identifies one

The PDF's notation, melodic reductions, images, and detailed harmonic/melodic descriptions are deliberately not represented yet.

## Relationship rules

The catalogue explicitly warns that thematic resemblance ranges from intentional to coincidental. The graph therefore must not flatten every comparison into an equally strong edge.

The current seed uses:

- `confidence: 1.0` for the catalogue's **confirmed** Young Anakin ↔ Imperial March connection.
- `confidence: 0.75` for the catalogue's **probable** Main Theme ↔ Luke & Leia connection.
- `confidence: 0.4` for the catalogue's **speculative** Emperor ↔ Kylo Ren A / Rey A comparisons.
- descriptive relationship labels such as `outgrowth of`, `generated from`, and `possibly derived from` where the individual theme entries use that language.

These numbers are visualization weights, not claims made by Lehman. The categorical labels and prose in the PDF remain authoritative.

## Important catalogue distinctions to preserve

Lehman's taxonomy separates:

1. **Leitmotifs**: distinctive recurring ideas prone to development, meaning, and symbolism.
2. **Incidental motifs**: recurring ideas that do not satisfy the full leitmotif criteria.
3. **Set-piece themes**: distinctive material restricted to a single cue or sequence, although later reuse can effectively promote one into another category.
4. **Thematic relationships**: cross-theme connections, including confirmed/probable/speculative interconnections and transformations.
5. **Diegetic / extra-diegetic music**: source music, concert arrangements, and end credits.

Do not infer that a node is a leitmotif merely because it is musically memorable or appears in this repository.

## Next extraction passes

The most useful next passes are:

1. Split compound leitmotif nodes into detachable A/B/C components where Lehman treats them autonomously.
2. Add all 116 incidental-motif nodes from pp. 53–64.
3. Add named set-piece themes from pp. 65–70.
4. Expand `work → theme` membership from `usedIn` metadata when the renderer can handle the density.
5. Add cue nodes from the appendices, then model theme occurrences separately from theme identity.
6. Extract the relationship section more exhaustively, preserving confirmed/probable/speculative confidence categories.
7. Add concert-arrangement and source-music nodes.

## Provenance note

The catalogue says cue names/numbers are drawn from original cue sheets and scores where available, while film timecodes are derived from official streaming versions. It also states that its leitmotif criteria are the author's analytical framework rather than a uniquely correct taxonomy. Future agents should preserve those caveats instead of presenting the JSON as an objective canonical ontology.
