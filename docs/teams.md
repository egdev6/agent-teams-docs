---
description: Teams bundle agents, skills, and config into portable kit files. Drop a team kit into any project and the full agent team loads instantly with 4 merge strategies — no reconfiguration needed.
---

# Teams

**Status:** 🧪 Beta

A team is a curated selection of agents — sourced from kits and/or individual specs — configured for a specific project context. Teams are stored as YAML files under `.agent-teams/teams/`.

---

## Creating a Team

Dashboard → **Team Manager** → **Create Team**, or use the **Quick Actions** card on the home page.

<!-- IMAGE: Screenshot — Team Manager page listing all teams with their name, description, agent count, and active status badge. The Create Team and Design a new team with AI buttons are visible in the page header. Suggested filename: teams-overview.png -->

The wizard has three sections:

1. **Basics** — enter the team name and description
2. **Members** — select agents to include in this team from your available agent list. If no agents exist yet, a shortcut link to **Create Agent** is shown
3. **Summary** — a live preview of the team configuration appears in the right sidebar

Click **Create** to save the team. The file `.agent-teams/teams/<id>.yml` is created automatically.

---

## Managing Teams

### View All Teams

Dashboard → **Team Manager** lists all teams with their name, description, agent count, and active status. Click any team card to open it.

The page header has two action buttons: **Create Team** (opens the wizard) and **Design a new team with AI** (opens `@agent-designer` in Copilot Chat).

Teams whose source spec was modified after the last successful sync show a **Not synced** badge in the Team Manager. Sync the team to clear the badge.

### Edit a Team

Dashboard → **Team Manager** → select team → **Edit**

The edit page provides four actions:

| Action | Description |
|---|---|
| **Save** | Write changes to the team YAML file |
| **Cancel** | Discard unsaved changes |
| **Delete** | Permanently remove this team |
| **Set as Active** | Mark this team as the active team for sync operations |

<!-- IMAGE: Screenshot — Team Edit page showing the Basics section (name and description fields), the Members section with a list of agents to select, and the action buttons (Save, Cancel, Delete, Set as Active) at the bottom. Suggested filename: teams-creation.png -->

### Setting the Active Team

Only one team can be active at a time. The active team determines which agents are synced to `.github/agents/` and which agents register as Copilot Chat participants.

To change the active team: Dashboard → **Team Manager** → select team → **Edit** → **Set as Active**

The dashboard home page Stats card always shows which team is currently active.

---

## Syncing a Team

Sync resolves the full composition (kit defaults + project profile + team overrides) and writes the final output files for each configured sync target.

1. Dashboard home → **Sync Status** card shows a breakdown of pending changes:
   - `create` — new file will be written
   - `update` — existing file will be updated
   - `skip` — no changes detected, file left as-is
2. Click **Sync** to apply all changes

<!-- IMAGE: Screenshot — Sync Status card on the dashboard home page showing a breakdown of pending changes with create/update/skip counts per file, and the Sync button ready to apply them. Suggested filename: teams-sync.png -->

The dashboard detects changes to agent and team YAML files automatically — the sync status card updates whenever you save a file.

### Output per target

Each sync target writes its output to a different location:

| Target | Output |
|---|---|
| **Claude Code** | `.claude/agents/<id>.md` per agent + `AGENTS.md` at root |
| **Codex** | `AGENTS.md` at project root |
| **Gemini CLI** | `GEMINI.md` at project root |
| **OpenAI Agents SDK** | `AGENTS.md` at project root |
| **GitHub Copilot** | `.github/agents/<id>.agent.md` per agent |

For targets that generate a single root file (`AGENTS.md`, `GEMINI.md`), context packs are inlined directly into that file by priority: essential packs are always included, standard packs are included up to the configured character budget, and reference packs are listed as links at the bottom.

### Previewing changes before sync (CLI)

Use `--dry-run` to see exactly what would change without writing any files:

```bash
agent-teams team:sync --team my-team --dry-run
```

The output is colour-coded and grouped by target:

```
  + .claude/agents/frontend-agent.md    [create]
  ~ .claude/agents/backend-agent.md     [update]
  - .claude/agents/legacy-agent.md      [delete]
```

Add `--no-diff` to suppress the per-file detail and show only the summary.

### MCP Server sync

If any agent in the team declares `mcpServers`, Agent Teams merges them into the project MCP config files during sync:

- **Copilot target** → `.vscode/mcp.json` (`servers` key)
- **Claude Code target** → `.mcp.json` at project root (`mcpServers` key)

Servers are merged by `id`. Existing entries are never overwritten, so project-level overrides are always preserved. See [MCP Servers](./agents.md#mcp-servers) in the Agents reference.

---

## Merge Strategies

<!-- IMAGE: Diagram — Visual showing the three-layer priority stack: Kit defaults (bottom) → Project profile (middle) → Team overrides (top), with arrows indicating which layer wins under each of the four strategies (team-priority, profile-priority, kit-priority, explicit-only). Suggested filename: teams-merge-strategies.png -->

When multiple sources define the same agent field (kit default, project profile, team override), the Merge Engine resolves the conflict using one of four strategies:

| Strategy | Behaviour |
|---|---|
| `team-priority` (default) | Team overrides win over profile and kit |
| `profile-priority` | Project profile wins over kit and team |
| `kit-priority` | Kit defaults win — overrides are ignored |
| `explicit-only` | Only fields explicitly set at team level are used |

---

## Reference: Team YAML Format

The dashboard writes and reads this format automatically. You can also edit the file directly in VS Code.

```yaml
id: frontend-team
name: Frontend Team
description: Team focused on React and TypeScript frontend work

kits:
  - id: testing-vitest
    enabled: true

agents:
  - id: vitest-worker
    enabled: true
  - id: test-orchestrator
    enabled: false

overrides:
  vitest-worker:
    skills:
      - code_analysis
      - testing
```

### Fields

| Field | Required | Description |
|---|---|---|
| `id` | ✅ | Unique team identifier (kebab-case) |
| `name` | ✅ | Display name |
| `description` | — | Team purpose |
| `kits` | — | List of kit IDs to include, each with an `enabled` flag |
| `agents` | — | Per-agent overrides with `enabled` flag |
| `overrides` | — | Field-level overrides applied to specific agents within this team |

---


