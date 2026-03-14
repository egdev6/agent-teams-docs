---
description: Teams bundle agents, skills, and config into portable kit files. Drop a team kit into any project and the full agent team loads instantly with 4 merge strategies — no reconfiguration needed.
---

# Teams

**Status:** 🧪 Beta

A team is a curated selection of agents — sourced from kits and/or individual specs — configured for a specific project context. Teams are stored as YAML files under `.agent-teams/teams/`.

---

## Creating a Team

Dashboard → **Team Manager** → **Create Team**, or use the **Quick Actions** card on the home page.

<img width="1160" alt="imagen" src="/img/docs/teams-overview.png" style={{ height: "auto" }} />

The wizard has three sections:

1. **Basics** — enter the team name and description
2. **Members** — select agents to include in this team from your available agent list. If no agents exist yet, a shortcut link to **Create Agent** is shown
3. **Summary** — a live preview of the team configuration appears in the right sidebar

Click **Create** to save the team. The file `.agent-teams/teams/<id>.yml` is created automatically.

---

## Managing Teams

### View All Teams

Dashboard → **Team Manager** lists all teams with their name, description, agent count, and active status. Click any team card to open it.

### Edit a Team

Dashboard → **Team Manager** → select team → **Edit**

The edit page provides four actions:

| Action | Description |
|---|---|
| **Save** | Write changes to the team YAML file |
| **Cancel** | Discard unsaved changes |
| **Delete** | Permanently remove this team |
| **Set as Active** | Mark this team as the active team for sync operations |

<img width="1320" alt="imagen" src="/img/docs/teams-creation.png" style={{ height: "auto" }} />

### Setting the Active Team

Only one team can be active at a time. The active team determines which agents are synced to `.github/agents/` and which agents register as Copilot Chat participants.

To change the active team: Dashboard → **Team Manager** → select team → **Edit** → **Set as Active**

The dashboard home page Stats card always shows which team is currently active.

---

## Syncing a Team

Sync resolves the full composition (kit defaults + project profile + team overrides) and writes the final agent markdown files to `.github/agents/`.

1. Dashboard home → **Sync Status** card shows a breakdown of pending changes:
   - `create` — new agent file will be written
   - `update` — existing agent file will be updated
   - `skip` — no changes detected, file left as-is
2. Click **Sync** to apply all changes

<img width="1327" alt="imagen" src="/img/docs/teams-sync.png" style={{ height: "auto" }} />

The dashboard detects changes to YAML files automatically via file watching — the sync status card updates whenever you save an agent or team.

---

## Merge Strategies

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


