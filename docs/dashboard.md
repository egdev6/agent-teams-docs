# Dashboard

**Status:** 🧪 Beta | [← Back to Index](../README.md)

The Agent Teams dashboard is an embedded React SPA that opens as a VS Code panel. It provides access to all 12 pages of the extension from a single interface.

---

## Opening the Dashboard

Sidebar

<img width="174" height="60" alt="imagen" src="https://github.com/user-attachments/assets/9f217298-a220-429f-b14f-aa7175e24e1b" />

Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) → **`Agent Teams: Open Dashboard`**

<img width="768" height="127" alt="imagen" src="https://github.com/user-attachments/assets/ccd4c59b-3c1a-4949-b685-5326da9a3a5c" />

---

## Overview Page

The main dashboard page shows a live summary of your workspace:

| Card | What it shows |
|---|---|
| **Stats** | Active team name, total agent count, sync status, and Engram integration health |
| **Sync Status** | Breakdown of pending changes (agents to create / update / skip) with a one-click sync trigger |
| **Engram Banner** | First-time configuration prompt — only shown if the Engram memory extension is not set up |
| **Quick Actions** | Shortcut buttons to the most common pages (Create Agent, Create Team, Open Profile) |

<img width="1668" height="1002" alt="imagen" src="https://github.com/user-attachments/assets/39d3977b-d90e-4aec-8547-df0e24b3d086" />

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

<img width="1637" height="291" alt="imagen" src="https://github.com/user-attachments/assets/a6d8ca85-3aa2-4686-9296-d82f6c29ce77" />

---

## Stats Card

The stats card updates automatically when agents or teams change:

- **Active team** — the team currently selected for sync operations.
- **Agent count** — total agents loaded from specs and kits.
- **Sync status** — `Up to date` or `X changes pending`.
- **Engram** — `Connected` or `Not configured`.

<img width="1628" height="119" alt="imagen" src="https://github.com/user-attachments/assets/8da74036-cdb1-4a4a-bb6f-542a1a0830a6" />

---

## Refreshing Data

The dashboard reacts to VS Code state changes automatically. If you edit a YAML file directly outside the dashboard:

- Command Palette → **`Agent Teams: Reload Agents`** to force a full refresh.
- Or close and reopen the panel.

---

[← Back to Index](../README.md)
