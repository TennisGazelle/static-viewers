# static-viewers

A React + Vite single-page app hosting standalone visual explainers and exploratory viewers.

**Live site:** https://tennisgazelle.github.io/static-viewers/

## Pages

- [`/color-atlas`](https://tennisgazelle.github.io/static-viewers/color-atlas) — named colors across mathematical color spaces
- [`/star-wars-musical-themes`](https://tennisgazelle.github.io/static-viewers/star-wars-musical-themes)
- [`/oppenheimer-plot-map`](https://tennisgazelle.github.io/static-viewers/oppenheimer-plot-map)

The home page (`/`) is the gallery/index for all viewers.

Project intent is indexed in [`docs/ai/viewer-visions.md`](./docs/ai/viewer-visions.md). Color Atlas has a dedicated sourcing and product vision in [`docs/ai/color-atlas-vision.md`](./docs/ai/color-atlas-vision.md).

## Star Wars musical-theme data

The Star Wars viewer is being populated from Frank Lehman's **Complete Catalogue of the Musical Themes of Star Wars**, revised June 19, 2023.

Canonical catalogue page: https://franklehman.com/starwars/

The source PDF is intentionally treated as the authority for names, taxonomy, relationships, and analytical uncertainty. See [`STAR_WARS_DATA_MAPPING.md`](./STAR_WARS_DATA_MAPPING.md) for the page-by-page translation plan and the conventions future agents should follow when expanding the hardcoded data under `public/data/`.

The data is split into source-aligned JSON files rather than one giant graph fixture. The viewer currently merges the 62 parent Skywalker Saga leitmotif families, 80 explicit lettered/subcomponent nodes, all 116 numbered incidental motifs, every set-piece theme explicitly named in the catalogue's notable/sampling section, the complete lettered Battle of Hoth case study, and the catalogue's thematic-relationship section. The relationship data includes associative progression nodes, the confirmed/probable/speculative worked examples, the transformation taxonomy, and the ESB associative-tonality tables as structured metadata.

The set-piece section itself is a sampling rather than a claim to enumerate every cue-specific idea in the scores. Likewise, numeric relationship confidence values are visualization weights; Lehman's categorical wording remains authoritative.

The source PDF lives in [`docs/reference/`](./docs/reference/) alongside the Oppenheimer screenplay. Keep the mapping document pointed at the exact revision date because the catalogue is continually revised.

## License

Licensed under CC BY-NC 4.0 — see [LICENSE](./LICENSE).

## Contributing / agents

Working on this repo with an AI coding agent? Start at [`AGENTS.md`](./AGENTS.md).
