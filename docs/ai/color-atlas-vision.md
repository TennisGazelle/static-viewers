# Color Atlas vision

## Thesis

Color Atlas asks a simple question: **how many words is this color worth?**

The viewer maps names people, standards, artists, manufacturers, surveys, and cultures have attached to color onto mathematical color spaces. It is both a color-space explorer and a provenance-aware dictionary of color language.

## Experience

A color is one point with many possible labels. A label may also have multiple documented definitions. Users should be able to rotate and morph among RGB, HSL/HSV, XYZ, CIELAB/LCH, OKLab/OKLCH and other useful projections while the named points remain identifiable.

Hover exposes the name, swatch, original value/source, and coordinates in the active space. Search should answer questions such as “where is avocado?”, while perceptual-neighbor tools should answer “what documented names are closest to this color?”

Future geometry should respect each model rather than forcing every model into a cube: cylindrical/polar spaces should look cylindrical/polar, and gamut boundaries should be visible.

## Data model and provenance

Every bundled record must retain:
- displayed name;
- source/dictionary;
- the source's original color space/value when known;
- a normalized sRGB representation for display when conversion is defensible;
- aliases/tags only when sourced or clearly mechanical;
- license/provenance metadata at the dataset level.

Derived coordinates are computed from the canonical source value. They are not new source claims.

Near-duplicate colors and identical names are valid data. Do not collapse them merely for visual neatness. Perceptual comparisons should use an appropriate ΔE/OKLab-family distance rather than Euclidean sRGB.

## Source policy

This repository is CC BY-NC 4.0, but noncommercial intent does **not** make arbitrary proprietary datasets redistributable. A source is bundled only when its license or legal status permits redistribution in this project.

Preferred sources:
- standards whose color keywords are openly specified, such as CSS named colors;
- public-domain/CC0 datasets;
- MIT/BSD/Apache-style datasets;
- compatible Creative Commons datasets with required attribution;
- original research/survey data whose redistribution terms are documented.

Bundled open corpora now include **31,918** records from the MIT-licensed `meodai/color-names` Color Name List and **949** XKCD survey records distributed through the MIT-licensed `meodai/color-name-lists` dataset. They remain separate source shards and retain source IDs; overlap is intentional evidence, not deduplicated away. Wikipedia-derived records may be usable under CC BY-SA only with the required attribution/share-alike handling documented before ingestion.

Brand catalogs such as Pantone, LEGO/BrickLink, Crayola, RAL, and commercial paint systems are **not assumed redistributable merely because their names or swatches are visible online**. They stay in a research/candidate-source list until their terms permit bundling or permission is obtained. Pantone color data in particular should not be bundled or cross-referenced without permission.

## Scope

The long-term atlas should include:
- mathematical color-space views and gamut boundaries;
- large provenance-aware named-color corpora;
- historical and cultural naming systems where licensing permits;
- name density and synonym clusters;
- nearest-name / perceptual-distance exploration;
- comparison of how different dictionaries partition the same region of color space;
- source filters so a user can distinguish standards, surveys, historical dictionaries, brands, and community datasets.

The goal is a catalog, not a claim that one naming system is authoritative.


## Bundled source manifest

Runtime source membership lives in `public/data/color-names/manifest.json`. Large corpora are split into bounded JSON shards so changes remain reviewable and browser fetches can be cached independently. The viewer loads the manifest using Vite's `BASE_URL`, then merges shards in memory without erasing provenance.

Current bundled sources:
- CSS Color 4 seed set: 12 records.
- Color Name List: 31,918 records, MIT, https://github.com/meodai/color-names
- XKCD survey: 949 records, via MIT-licensed https://github.com/meodai/color-name-lists

Do not add a commercial/brand corpus to the manifest until its redistribution terms are documented here.
