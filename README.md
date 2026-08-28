# static-viewers

A React + Vite single-page app hosting a couple of standalone viewer pages.

## Pages

- `/star-wars-musical-themes`
- `/oppenheimer-plot-map`

The home page (`/`) just lists links to both.

## Star Wars musical-theme data

The Star Wars viewer is being populated from Frank Lehman's **Complete Catalogue of the Musical Themes of Star Wars**, revised June 19, 2023.

Canonical catalogue page: https://franklehman.com/starwars/

The source PDF is intentionally treated as the authority for names, taxonomy, relationships, and analytical uncertainty. See [`STAR_WARS_DATA_MAPPING.md`](./STAR_WARS_DATA_MAPPING.md) for the page-by-page translation plan and the conventions future agents should follow when expanding `public/data/star-wars-musical-themes.json`.

The repository currently stores the hardcoded transcription rather than a copy of the PDF itself. If the PDF is added later, keep the mapping document pointed at the exact revision date because the catalogue is continually revised.

## License

Licensed under CC BY-NC 4.0 — see [LICENSE](./LICENSE).
