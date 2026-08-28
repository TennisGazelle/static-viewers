# Agent rules (canonical)

**Location:** [`.cursor/rules/`](./) — Cursor auto-loads `*.mdc` with `alwaysApply: true`. Other harnesses must **read and apply** these via their root stub (`CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`) and [`AGENTS.md`](../../AGENTS.md).

Do **not** copy rule text into harness stubs (DRY). Link here; obey the linked file.

| Rule | File | Apply when |
|------|------|------------|
| DRY, architecture, no-assumptions, model policy, doc sync, licensing | [rules.mdc](./rules.mdc) | Every task |

**Audience split:** humans → [`README.md`](../../README.md). Agent how-to → [`AGENTS.md`](../../AGENTS.md) → [`docs/ai/`](../../docs/ai/README.md).
