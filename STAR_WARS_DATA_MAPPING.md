# Star Wars catalogue → graph JSON mapping

This viewer is being transcribed from Frank Lehman's **Complete Catalogue of the Musical Themes of Star Wars**, revised June 19, 2023. The graph data lives under `public/data/`.

The goal is not to reinterpret the catalogue. The JSON should preserve Lehman's categories, labels, uncertainty, and distinctions so later UI work can choose how to display them.

## Source map

| PDF pages | Catalogue section | JSON treatment |
| --- | --- | --- |
| 2 | Contents / taxonomy | Defines the high-level categories used by this project. |
| 4–18 | Original Trilogy leitmotifs | Parent theme nodes in `star-wars-musical-themes.json`; explicit A/B/etc. subcomponents in `star-wars-leitmotif-components.json`. |
| 19–30 | Prequel Trilogy leitmotifs | Parent nodes plus detachable subcomponents/forms in `star-wars-leitmotif-components.json`. |
| 31–46 | Sequel Trilogy leitmotifs | Parent nodes plus detachable subcomponents/forms in `star-wars-leitmotif-components.json`. |
| 47 | Rogue One | `r*` theme nodes. |
| 48–49 | Solo | `s*` theme nodes, retaining composer attribution where given. |
| 50 | Galaxy's Edge | `ge*` theme nodes. |
| 51 | Obi-Wan Kenobi | `owk*` theme nodes, retaining composer attribution and the catalogue's uncertainty for Becoming Vader. |
| 53–64 | Incidental Motifs | All 116 numbered motifs are transcribed into six page-paired JSON shards. |
| 65–66 | Set-Piece Themes | Every theme in the catalogue's “Notable Set-Piece Themes” list plus every entry in its “Small Sampling” table is in `star-wars-set-piece-themes.json`. |
| 67–70 | Battle of Hoth case study | Parent Battle of Hoth node plus all lettered motifs `a`–`z`; the 26 component nodes are in `star-wars-battle-of-hoth-motifs.json`. |
| 71–78 | Thematic Relationships | `star-wars-thematic-relationships.json` transcribes associative progressions, the ESB associative-tonality tables, confirmed/probable/speculative examples, transformation scope, micro-techniques, and advanced techniques. |
| 80–81 | Source Music | Deferred. These should eventually be their own music nodes rather than being conflated with underscore leitmotifs. |
| 82–86 | Concert Arrangements | Deferred. Likely work/arrangement nodes connected to the thematic material they contain. |
| 87 | End Credits | Deferred. |
| 89–98 | Cue Lists | Deferred. These should populate `cue` nodes and later occurrence edges/nodes. |
| 99–102 | Thematic Census | Used for `statementTotal` on parent leitmotifs and separable child components when the census supplies a component-level count. |
| 103–106 | Bibliography / citation / fair use | Provenance only; not graph data. |

## Data files loaded by the viewer

The graph renderer merges these source-aligned files at runtime:

- `star-wars-musical-themes.json`
- `star-wars-leitmotif-components.json`
- `star-wars-incidental-motifs-53-54.json`
- `star-wars-incidental-motifs-55-56.json`
- `star-wars-incidental-motifs-57-58.json`
- `star-wars-incidental-motifs-59-60.json`
- `star-wars-incidental-motifs-61-62.json`
- `star-wars-incidental-motifs-63-64.json`
- `star-wars-set-piece-themes.json`
- `star-wars-battle-of-hoth-motifs.json`
- `star-wars-thematic-relationships.json`

The shards are deliberate. They keep a large hardcoded transcription reviewable against bounded source regions rather than creating one opaque mega-file.

## Current node rules

### Works

The nine Skywalker Saga films plus Rogue One, Solo, Galaxy's Edge, and Obi-Wan Kenobi are `kind: work` nodes. Roman-numeral `Used In` codes from the PDF are retained in motif metadata rather than expanded into every possible work-to-theme edge.

### Parent leitmotifs

`star-wars-musical-themes.json` retains one parent node per numbered Skywalker Saga family, 1 through 62. Parent nodes are useful semantic anchors even when the catalogue subdivides the family.

Each parent can carry:

- `catalogNumber`
- `family`
- `usedIn`
- `statementTotal`
- `sourcePage`
- `composer` where supplied

### Leitmotif components

`star-wars-leitmotif-components.json` adds **80 child nodes** for explicit lettered or separately described forms/components. This includes material such as:

- Main Theme 1a/1b;
- Imperials 6a/6b/6c;
- Imperial March 10a–10g;
- Ewoks 19a–19c;
- Young Anakin 24a–24d;
- Duel of the Fates 25a–25c;
- Battle of the Heroes 38a–38d;
- Rey 45a–45d and 46a–46b;
- March of the Resistance 47a–47d;
- Rose 54a–54c;
- Luke in Exile 55a–55c;
- Psalm of the Sith 59a/59b;
- Sith Artifacts 60a/60b;
- Heroics 62a/62b.

Child nodes use `category: leitmotif-component` and link back to the numbered family with `kind: component`.

The catalogue does not always give each lettered component a standalone proper name. In those cases the display label is deliberately mechanical, for example `Boba Fett (14b)` or `Imperial March (10d)`. The `componentType`, `catalogNumber`, notes, and source page carry the useful meaning. Future agents should not retrofit fanciful names.

`statementTotal` is copied only when Appendix 3 supplies a separable count. When the census combines components (`6b/c`, `47b/c`) or omits a lettered component entirely, the child total is left absent rather than split or inferred.

Parenthetical/tentative uses remain tentative when the component page makes that distinction. For example, 37b Lament stores VIII/IX under `tentativeUsedIn` rather than silently promoting them.

The PDF's notation, melodic reductions, and images are still deliberately not represented.

### Incidental motifs

All numbered entries 1–116 from pp. 53–64 are represented as `kind: theme`, `category: incidental-motif`. They must not be silently promoted to leitmotifs.

Fields used in this extraction:

- `catalogNumber`
- `usedIn`
- `usedInRaw`
- `tentativeUsedIn`
- `usedInIsOpenEnded`
- `clearStatementWork`
- `clearStatementTime`
- `sourcePage`

`Clear Statement` is not renamed to `firstUsage`. The table does not claim those entries are first appearances. The visible edge label is therefore `clear statement`. The current internal edge kind remains `first-clear-statement` from the initial extraction; despite that legacy identifier, it must not be interpreted as evidence of first usage.

Source oddities are preserved when practical. For example, the table prints `1:13:74` for Kylo Ren's Sawing Strings and uses `N/A` for two unused TFA motifs. Those are not silently repaired.

### Set-piece themes

`star-wars-set-piece-themes.json` contains the named set-piece material the catalogue itself surfaces on pp. 65–66: every item in the **Notable Set-Piece Themes** lists and every row in the **Small Sampling of Set-Piece Motifs** table.

These are `kind: theme`, `category: set-piece-theme`. Cue metadata is copied only when the sampling table actually supplies it. This is exhaustive for the source's named list/table, not a fabricated census of all cue-specific ideas.

Some labels overlap other categories. That can be legitimate: Lehman explicitly says set-piece, incidental, and leitmotivic boundaries can be blurry and can migrate through later reuse.

### Battle of Hoth set-piece motifs

The Battle of Hoth case study is represented as:

- `set-battle-of-hoth`: parent sequence node;
- `set-hoth-a` through `set-hoth-z`: all 26 lettered components;
- parent-to-component edges;
- cue number/name, listed statement times, compact source-derived summary, and source page.

## Thematic relationship extraction

`star-wars-thematic-relationships.json` treats analysis itself as graphable data. Analysis nodes use `kind: analysis`, with the small connected-triangle SVG glyph in the viewer.

### Associative progressions

Page 72 gives **nine** triadic progression classes. Each becomes an `analysis` node carrying:

- the progression string;
- the source's generic example;
- the dramatic associations listed by Lehman;
- `motifsFeaturingRaw`, preserving the table's names;
- edges to graph nodes only where a source name can be mapped safely to an existing node.

The mapping is intentionally conservative. If the table names a motif for which this repo does not yet have a clearly equivalent node, the raw name remains metadata rather than being force-fit onto a nearby theme.

### Associative tonality

Pages 73–74 explicitly caution that **absolute key is generally not a strong independent associative or structural force**. Do not turn a G-minor appearance into a Darth Vader semantic edge merely because the Imperial March has iconic G-minor statements.

The relationship JSON preserves the ESB case study in two non-rendered structured records:

- `tonalityProfiles`: inaugural/iconic/paratextual placements for the six principal ESB leitmotifs;
- `esbKeyIncidence`: the catalogue's 12-key incidence table plus ambiguous column.

The Leia profile row is kept with a raw table string because the PDF text extraction does not preserve its column boundaries cleanly enough to justify inventing a split.

### Confirmed / probable / speculative interconnections

The catalogue presents exactly one worked example for each confidence class:

- **confirmed**: Young Anakin ↔ Imperial March;
- **probable**: Main/Luke ↔ Luke & Leia;
- **speculative**: Emperor compared with Kylo Ren A and Rey A.

Those categorical labels are preserved on edges. Numeric `confidence` values (`1.0`, `0.75`, `0.4`) exist only to drive visual weight/dashing. They are not scores supplied by Lehman.

The probable discussion also explicitly notes a harmonic relationship between Luke & Leia and Leia's theme; that is represented separately rather than folded into the Luke/Main edge.

### Transformation vocabulary

Pages 77–78 distinguish **thematic transformation** from relatively unchanged repetition and enumerate six scopes of transformation. Those scopes are stored under `meta.transformationScopes`.

The graph has analysis nodes for all named micro-transformations:

- Ornamentation
- Reorchestration
- Reharmonization (basic)
- Augmentation / Diminution
- Extension / Fragmentation
- Mode Change
- Sequencing

The PDF's numbering jumps from item 5 to item 7 in this list. The JSON records that source oddity and does **not** manufacture a missing item 6.

All nine advanced techniques are also nodes:

- Reharmonization (profound)
- Contrapuntal Combination
- Leitmotivic Family Networks
- Alteration of Thematic Form
- Tonal Motivicism
- Concealed Repetition
- Developing Variation
- Motivic De/Reconstruction
- Teleological Genesis

Each technique node retains the catalogue's example in compact prose and links to the relevant theme/component nodes where the example identifies them.

### Additional explicit relationship edges

Where individual leitmotif descriptions use strong relationship language, this pass adds targeted component-aware edges, for example:

- It's A Trap! B partly derived from Imperial March Bridge;
- Descent/Lament spun from Dies Irae;
- Kylo Ren Redeemed as a transformation of Aggressive;
- Resistance Deployed spawned from March of the Resistance B;
- Victory described as probably a thematic transformation of Rey's Chimes;
- Luke in Exile possibly derived from Rey's Chimes;
- Desperation based on / arguably generated from Tension;
- Revelations as a motivic outgrowth of Yoda;
- March of the Resistance connective motif embedding Pathos, with the catalogue's “probably accidentally” qualifier retained.

Qualifiers matter. `possibly`, `arguably`, and `probably accidentally` should never be normalized away into categorical derivation.

## Important catalogue distinctions to preserve

Lehman's taxonomy separates:

1. **Leitmotifs**: distinctive recurring ideas prone to development, meaning, and symbolism.
2. **Leitmotif components**: detachable sections, ostinati, vamps, harmonic devices, variants, and other lettered children inside a numbered family.
3. **Incidental motifs**: recurring ideas that do not satisfy the full leitmotif criteria.
4. **Set-piece themes/motifs**: distinctive material restricted to a single cue or sequence, although later reuse can effectively promote material into another category.
5. **Thematic relationships**: cross-theme connections, associative progressions, interconnections, and transformations.
6. **Diegetic / extra-diegetic music**: source music, concert arrangements, and end credits.

Do not infer that a node is a leitmotif merely because it is musically memorable or appears in this repository.

## Next extraction passes

The largest remaining source-grounded passes are now:

1. Add source-music nodes from pp. 80–81.
2. Add concert-arrangement and end-credit nodes from pp. 82–87.
3. Add cue nodes from pp. 89–98, then model theme occurrences separately from theme identity.
4. Expand individual theme/motif descriptions and musical features where useful to the viewer, still without attempting notation representation.
5. Revisit direct cross-theme references scattered through the individual leitmotif and incidental-motif descriptions if a denser relationship network is desired.

## Provenance note

The catalogue says cue names/numbers are drawn from original cue sheets and scores where available, while film timecodes are derived from official streaming versions. It also states that its leitmotif criteria are the author's analytical framework rather than a uniquely correct taxonomy. Future agents should preserve those caveats instead of presenting the JSON as an objective canonical ontology.
