# Star Wars catalogue → graph JSON mapping

This viewer is being transcribed from Frank Lehman's **Complete Catalogue of the Musical Themes of Star Wars**, revised June 19, 2023. The graph data lives under `public/data/`.

The goal is not to reinterpret the catalogue. The JSON should preserve Lehman's categories, labels, uncertainty, and distinctions so later UI work can choose how to display them.

## Source map

| PDF pages | Catalogue section | JSON treatment |
| --- | --- | --- |
| 2 | Contents / taxonomy | Defines the high-level categories used by this project. |
| 4–18 | Original Trilogy leitmotifs | `theme-1-*` through `theme-23-*` nodes in `star-wars-musical-themes.json`. |
| 19–30 | Prequel Trilogy leitmotifs | `theme-24-*` through `theme-40-*` nodes. |
| 31–46 | Sequel Trilogy leitmotifs | `theme-41-*` through `theme-62-*` nodes. |
| 47 | Rogue One | `r*` theme nodes. |
| 48–49 | Solo | `s*` theme nodes, retaining composer attribution where given. |
| 50 | Galaxy's Edge | `ge*` theme nodes. |
| 51 | Obi-Wan Kenobi | `owk*` theme nodes, retaining composer attribution and the catalogue's uncertainty for Becoming Vader. |
| 53–64 | Incidental Motifs | All 116 numbered motifs are transcribed into six page-paired JSON shards. |
| 65–66 | Set-Piece Themes | Every theme in the catalogue's “Notable Set-Piece Themes” list plus every entry in its “Small Sampling” table is in `star-wars-set-piece-themes.json`. |
| 67–70 | Battle of Hoth case study | Parent Battle of Hoth node plus all lettered motifs `a`–`z`; the 26 component nodes are in `star-wars-battle-of-hoth-motifs.json`. |
| 71–78 | Thematic Relationships | A seed of explicit relationships is in JSON. This section remains the authority for confidence and transformation semantics and is not yet exhaustively transcribed. |
| 80–81 | Source Music | Deferred. These should eventually be their own music nodes rather than being conflated with underscore leitmotifs. |
| 82–86 | Concert Arrangements | Deferred. Likely work/arrangement nodes connected to the thematic material they contain. |
| 87 | End Credits | Deferred. |
| 89–98 | Cue Lists | Deferred. These should populate `cue` nodes and later occurrence edges/nodes. |
| 99–102 | Thematic Census | Used for `statementTotal` on Skywalker Saga leitmotif nodes. |
| 103–106 | Bibliography / citation / fair use | Provenance only; not graph data. |

## Data files loaded by the viewer

The graph renderer merges these source-aligned files at runtime:

- `star-wars-musical-themes.json`
- `star-wars-incidental-motifs-53-54.json`
- `star-wars-incidental-motifs-55-56.json`
- `star-wars-incidental-motifs-57-58.json`
- `star-wars-incidental-motifs-59-60.json`
- `star-wars-incidental-motifs-61-62.json`
- `star-wars-incidental-motifs-63-64.json`
- `star-wars-set-piece-themes.json`
- `star-wars-battle-of-hoth-motifs.json`

The page-number shards are deliberate. They keep a large hardcoded transcription reviewable against a small, contiguous portion of the PDF instead of creating one monolithic generated-looking file.

## Current node rules

### Works

The nine Skywalker Saga films plus Rogue One, Solo, Galaxy's Edge, and Obi-Wan Kenobi are `kind: work` nodes. Roman-numeral `Used In` codes from the PDF are retained in motif metadata rather than expanded into every possible work-to-theme edge.

### Leitmotifs

The numbered Skywalker Saga catalogue is represented as one primary node per catalogue number, 1 through 62. Where Lehman divides a number into A/B/C components, this pass generally keeps them under the parent catalogue number. This is intentional and reversible. Later passes can split detachable components into child theme nodes when the graph needs that resolution.

Each leitmotif node currently carries some or all of:

- `catalogNumber`
- `family`
- `usedIn`
- `statementTotal` where the thematic census supplies a useful total
- `sourcePage`
- `composer` for anthology/miscellaneous entries where the catalogue explicitly identifies one

The PDF's notation, melodic reductions, images, and detailed harmonic/melodic descriptions are deliberately not represented yet.

### Incidental motifs

All numbered entries 1–116 from pp. 53–64 are represented as `kind: theme`, `category: incidental-motif`. They must not be silently promoted to leitmotifs. The catalogue uses this category for recurring material that does not meet its full leitmotif criteria.

Fields used in this extraction:

- `catalogNumber`: the 1–116 incidental-motif number, local to this section.
- `usedIn`: normalized film codes explicitly listed without parentheses.
- `usedInRaw`: the source table's compact `Uses` value retained so normalization is auditable.
- `tentativeUsedIn`: film codes shown parenthetically by the catalogue. Parentheses are not silently upgraded into ordinary `usedIn` membership.
- `usedInIsOpenEnded`: set when the table says `etc.` rather than pretending the displayed list is exhaustive.
- `clearStatementWork` and `clearStatementTime`: the catalogue's **Clear Statement** columns.
- `sourcePage`: PDF page containing the table row.

`Clear Statement` is not renamed to `firstUsage`. The incidental-motif table does not claim these entries are first appearances. The visible edge label is therefore `clear statement`. The current internal edge kind remains `first-clear-statement` from the first extraction commit; despite that legacy identifier, it must not be interpreted as evidence of first usage.

Source oddities are preserved when practical. For example, the table prints `1:13:74` for Kylo Ren's Sawing Strings; the JSON does not silently repair the timestamp. Likewise `N/A` for the two unused TFA motifs is preserved with a null normalized time plus `clearStatementTimeRaw: "N/A"`.

### Set-piece themes

`star-wars-set-piece-themes.json` contains the named set-piece material that the catalogue itself surfaces on pp. 65–66:

- every item in the **Notable Set-Piece Themes** lists for Original, Prequel, and Sequel trilogies;
- every row of the **Small Sampling of Set-Piece Motifs** table.

These are `kind: theme`, `category: set-piece-theme`. Where the sampling table supplies a film, timestamp, cue number, and cue title, those are copied into `sampledStatementWork`, `sampledStatementTime`, `cueNumber`, and `cueName`. A name appearing in the prose-only “Notable” list does not get invented cue metadata.

This file is thorough relative to what the catalogue *names*, but it is not presented as an exhaustive census of every one-scene musical idea. Lehman explicitly calls the table a small sampling and describes most cues as containing cue-specific material. In other words, this extraction is exhaustive for the source's named list/table, not for all possible set-piece material in the scores.

Some labels also exist elsewhere in the catalogue as incidental motifs or leitmotifs. That is not necessarily an extraction error. The catalogue says category boundaries can be blurry and can change through later repetition, tracking, and development. We preserve the source taxonomy rather than deduplicating across categories by name.

### Battle of Hoth set-piece motifs

The catalogue gives the Battle of Hoth unusually fine-grained treatment, describing roughly 25 distinct non-leitmotivic elements across four linked cue sections and then labeling components `a` through `z`.

The graph represents this as:

- `set-battle-of-hoth`: the parent set-piece theme/sequence node;
- `set-hoth-a` through `set-hoth-z`: all 26 lettered component nodes with `category: set-piece-motif`;
- parent-to-component `set-piece-component` edges;
- cue number/name, listed statement times, a short identifying summary, and `sourcePage` on each component.

The short `summary` fields are compact paraphrases of Lehman's table notes for graph inspection. They are not independent analytical claims.

## Relationship rules

The catalogue explicitly warns that thematic resemblance ranges from intentional to coincidental. The graph therefore must not flatten every comparison into an equally strong edge.

The current seed uses:

- `confidence: 1.0` for the catalogue's **confirmed** Young Anakin ↔ Imperial March connection.
- `confidence: 0.75` for the catalogue's **probable** Main Theme ↔ Luke & Leia connection.
- `confidence: 0.4` for the catalogue's **speculative** Emperor ↔ Kylo Ren A / Rey A comparisons.
- descriptive relationship labels such as `outgrowth of`, `generated from`, and `possibly derived from` where individual entries use that language.

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

The largest remaining source-grounded passes are:

1. Split compound leitmotif nodes into detachable A/B/C components where Lehman treats them autonomously.
2. Extract the thematic-relationship section more exhaustively, preserving confirmed/probable/speculative labels and the catalogue's transformation vocabulary.
3. Add source-music nodes from pp. 80–81.
4. Add concert-arrangement and end-credit nodes from pp. 82–87.
5. Add cue nodes from the appendices, then model theme occurrences separately from theme identity.
6. Expand individual motif/theme descriptions and musical features only where useful to the viewer, without attempting notation representation yet.

## Provenance note

The catalogue says cue names/numbers are drawn from original cue sheets and scores where available, while film timecodes are derived from official streaming versions. It also states that its leitmotif criteria are the author's analytical framework rather than a uniquely correct taxonomy. Future agents should preserve those caveats instead of presenting the JSON as an objective canonical ontology.
