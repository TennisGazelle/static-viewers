# Agent onboarding — static-viewers

React + Vite SPA hosting standalone viewer pages. Read this file, then the **one** spoke your task touches.

**Harness stubs** (thin; all point at this hub + the rules):

| Harness | Stub |
|---------|------|
| Cursor | this file + [`.cursor/rules/`](.cursor/rules/) (auto-loaded) |
| Claude Code | [`CLAUDE.md`](CLAUDE.md) |
| Gemini CLI | [`GEMINI.md`](GEMINI.md) |
| GitHub Copilot | [`.github/copilot-instructions.md`](.github/copilot-instructions.md) |

## Rules

**Index:** [`.cursor/rules/README.md`](.cursor/rules/README.md) — read and apply [`rules.mdc`](.cursor/rules/rules.mdc) on every task (DRY, architecture conventions, no-assumptions policy, model policy, doc sync, licensing).

## Task router

| Your task touches | Read | Code lives in |
|--------------------|------|----------------|
| Adding/editing a viewer page or route | [`docs/ai/architecture.md`](docs/ai/architecture.md#routing) | `src/pages/`, `src/App.tsx` |
| Graph rendering / d3-force layout | [`docs/ai/architecture.md`](docs/ai/architecture.md#graphs) | `src/components/*Graph.tsx` |
| Graph data (nodes, links, confidence) | [`docs/ai/architecture.md`](docs/ai/architecture.md#graphs) | `public/data/*.json` |
| Node icons | [`docs/ai/architecture.md`](docs/ai/architecture.md#icons) | inline SVG components in the owning `*Graph.tsx` |
| Repo-wide conventions, licensing, model policy | [`.cursor/rules/rules.mdc`](.cursor/rules/rules.mdc) | — |

## Skills

Reusable cross-tool skills are pinned as the [`ai-skills`](.agents/ai-skills) submodule. Cursor and Codex discover them under [`.agents/skills/`](.agents/skills/); Claude Code reaches the same set through [`.claude/skills`](.claude/skills).

After updating the submodule, rerun `./.agents/ai-skills/scripts/install-into-repo.sh` and commit any changed skill links. Clone with `--recurse-submodules` or run `git submodule update --init` after a plain clone.

## Doc split

| Audience | Location |
|----------|----------|
| Humans | [`README.md`](README.md) |
| Agents (how-to) | this file → [`docs/ai/`](docs/ai/README.md) |

## Quick paths

- Architecture / file map: [`docs/ai/architecture.md`](docs/ai/architecture.md)
- Rules: [`.cursor/rules/rules.mdc`](.cursor/rules/rules.mdc)
