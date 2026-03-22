---
description: Context packs are reusable knowledge chunks injected into agent prompts using template syntax. Share conventions, API references, and coding standards across multiple agents without duplication.
---

# Context Packs

**Status:** 🧪 Beta

Context packs are reusable chunks of documentation or instructions that get embedded into agent specs during the composition process. They let you share knowledge — conventions, API references, coding standards — across multiple agents without duplicating content.

---

## Opening the Context Packs Page

Dashboard → sidebar → **Context Packs**

---

## Overview

<!-- TODO: screenshot — página completa de Context Packs en el dashboard mostrando la lista de packs con sus toggles, selectores de prioridad y el indicador del budget. Nombre sugerido: context-packs-overview.png -->

The page shows all context packs available in your workspace. Each pack displays:

- **Name** — the pack identifier
- **Priority** — how the pack is included in the root context file (`essential`, `standard`, or `reference`)
- **Toggle** — whether the pack is currently active

The header shows the current **agents.md budget** — a character budget that controls how much content is inlined in the root context file for budget-limited targets (Claude Code, Gemini CLI, OpenAI Agents SDK, Codex). Default: 8 000 characters.

---

## Managing Packs

### Toggle a Pack On or Off

Click the toggle next to any pack to enable or disable it. Disabled packs are not embedded in agent specs during sync.

<!-- TODO: screenshot — detalle de una fila de pack con el toggle en estado habilitado y otro en deshabilitado, para mostrar la diferencia visual. Nombre sugerido: context-packs-toggle.png -->

### Adjust Priority

Each pack has a priority selector with three levels:

| Priority | Behaviour |
|---|---|
| `essential` | Always inlined in full into the root context file, regardless of budget. Use for critical conventions that every agent must follow. |
| `standard` | Inlined greedily until the `agents_md_budget` is exhausted. Overflow packs are listed as reference headings instead. |
| `reference` | Never inlined. Always listed as a reference heading (pack name + description link). Use for large reference documents. |

GitHub Copilot is not subject to a budget — all selected packs are copied as individual files under `.github/context/` regardless of priority.

### Save Changes

Click **Save** to persist your toggle and priority selections. Changes take effect on the next sync.

---

## Creating a New Pack

<!-- TODO: screenshot — sección "Create Pack" en la parte inferior de la página con el campo de nombre y el selector de prioridad antes de hacer clic en Create. Nombre sugerido: context-packs-create.png -->

1. In the **Create Pack** section at the bottom of the page, enter a pack name and select a priority
2. Click **Create** — the pack is added to your workspace registry

You can then add content to the pack by editing the generated file directly in VS Code.

---

## Importing a Markdown File as a Pack

Click **Import Markdown** to select any `.md` file from your workspace. The file is imported as a new context pack with its filename as the pack ID. This is useful for turning existing documentation — READMEs, coding guides, API references — into reusable context packs.

---

## Using Context Packs in Agents

Context packs are assigned to agents in two places:

- **Profile Editor** → Context Packs section — selects packs applied to all agents in the project
- **Create Agent / Edit Agent** → Step 5 (Output & Context) — selects packs for a specific agent

Team-level and agent-level pack assignments override the project-level defaults.

---
