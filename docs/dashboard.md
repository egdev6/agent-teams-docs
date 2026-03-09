# Dashboard

**Status:** 🧪 Beta | [← Back to Index](../README.md)

The Agent Teams dashboard is an embedded React SPA that opens as a VS Code panel. It provides access to all 12 pages of the extension from a single interface.

---

## Opening the Dashboard

Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) → **`Agent Teams: Open Dashboard`**

<!-- screenshot: Command Palette with "Agent Teams: Open Dashboard" typed and the result highlighted in the suggestions list -->

---

## Overview Page

The main dashboard page shows a live summary of your workspace:

| Card | What it shows |
|---|---|
| **Stats** | Active team name, total agent count, sync status, and Engram integration health |
| **Sync Status** | Breakdown of pending changes (agents to create / update / skip) with a one-click sync trigger |
| **Engram Banner** | First-time configuration prompt — only shown if the Engram memory extension is not set up |
| **Quick Actions** | Shortcut buttons to the most common pages (Create Agent, Create Team, Open Profile) |

<!-- screenshot: Dashboard main page with all four cards visible: Stats (top-left), Sync Status (top-right), Quick Actions (bottom-left), and the Engram setup banner (bottom, if applicable) -->

---

## Navigation

Use the sidebar icons or the Quick Actions card to move between pages:

| Page | Description |
|---|---|
| **Dashboard** | Stats overview — the home page |
| **Profile Editor** | Edit the project profile (`.agent-teams/project.profile.yml`) |
| **Team Manager** | List, create, and manage teams |
| **Agent Manager** | View all loaded agents |
| **Create Agent** | Launch the agent creation wizard |
| **Edit Agent** | Modify an existing agent spec |
| **Create Team** | Launch the team creation wizard |
| **Edit Team** | Modify a team and its overrides |
| **Skills Browser** | Browse the skill catalog |
| **Context Packs** | View and manage context packs |
| **Import / Export** | Import or export the global agent catalog |
| **Agent Wizard** | Step-by-step guided agent creation |

<!-- screenshot: Dashboard with the sidebar navigation expanded on the left, showing all section icons with their labels, and the active page highlighted -->

---

## Stats Card

The stats card updates automatically when agents or teams change:

- **Active team** — the team currently selected for sync operations.
- **Agent count** — total agents loaded from specs and kits.
- **Sync status** — `Up to date` or `X changes pending`.
- **Engram** — `Connected` or `Not configured`.

<!-- screenshot: Close-up of the Stats card showing active team name, agent count number, sync status badge (green "Up to date" or orange "3 changes pending"), and Engram status -->

---

## Refreshing Data

The dashboard reacts to VS Code state changes automatically. If you edit a YAML file directly outside the dashboard:

- Command Palette → **`Agent Teams: Reload Agents`** to force a full refresh.
- Or close and reopen the panel.

---

[← Back to Index](../README.md)
