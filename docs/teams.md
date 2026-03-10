# Teams

**Status:** 🧪 Beta | [← Back to Index](../README.md)

A team is a curated selection of agents — sourced from kits and/or individual specs — configured for a specific project context. Teams are stored as YAML files under `.agent-teams/teams/`.

---

## Creating a Team

### Using the Wizard (recommended)

1. Command Palette → **`Agent Teams: Create Team`**  
   Or: Dashboard → **Quick Actions** → **Create Team**
2. Enter a name and description.
3. Select which kits and/or agents to include.
4. A `.agent-teams/teams/<id>.yml` file is created.

<img width="1160" height="912" alt="imagen" src="https://github.com/user-attachments/assets/97911233-b78c-4ff9-805f-1dc918bbb4fb" />

### Team YAML Format

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

## Editing a Team

1. Dashboard → **Team Manager** → select team → **Edit**.
2. Modify kits, agents, or overrides.
3. Save — the changes update the YAML file immediately.

<img width="1320" height="329" alt="imagen" src="https://github.com/user-attachments/assets/6663c27e-241e-47da-860b-041a8cd70323" />

---

## Listing Teams

Command Palette → **`Agent Teams: List Teams`**

Opens a quick-pick with all available teams. Selecting one opens its YAML file directly in the editor.

---

## Syncing a Team

Sync resolves the full composition (kit + project profile + team overrides) and writes the final agent markdown files to `.github/agents/`.

### Dry-run (preview without writing)

```bash
agent-teams team:sync --dry-run
```

The output shows each agent with one of three actions:

| Action | Meaning |
|---|---|
| `create` | New agent file will be written |
| `update` | Existing agent file will be updated (diff shown) |
| `skip` | No changes detected, file left as-is |

<img width="1327" height="179" alt="imagen" src="https://github.com/user-attachments/assets/177e16c7-41ad-4e52-9ec5-61c1896b33f8" />

### Apply sync

```bash
agent-teams team:sync
```

Or via Command Palette: **`Agent Teams: Sync Team`**

The command supports `--no-diff` to suppress the per-file diff in the output.

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

[← Back to Index](../README.md)
