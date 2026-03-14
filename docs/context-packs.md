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

The page shows all context packs available in your workspace. Each pack displays:

- **Name** — the pack identifier
- **Priority** — how prominently the pack's content is included (`high`, `medium`, or `low`)
- **Toggle** — whether the pack is currently active

The header shows the current **agents.md budget** usage — a token budget indicator that reflects how much context space is being used across your active packs.

---

## Managing Packs

### Toggle a Pack On or Off

Click the toggle next to any pack to enable or disable it. Disabled packs are not embedded in agent specs during sync.

### Adjust Priority

Each pack has a priority selector: `high`, `medium`, or `low`. Priority determines the order in which packs are included when resolving the composition for an agent spec. Higher-priority packs take precedence.

### Save Changes

Click **Save** to persist your toggle and priority selections. Changes take effect on the next sync.

---

## Creating a New Pack

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
