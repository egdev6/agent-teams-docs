# Dashboard

**Status:** 🧪 Beta

The Agent Teams dashboard is an embedded React SPA that opens as a VS Code panel. It is the primary interface for creating and managing agents, teams, and project configuration.

---

## Opening the Dashboard

Click the Agent Teams icon in the VS Code sidebar:

<img width="174" alt="imagen" src="/img/docs/dashboard-icon.png" style={{ height: "auto" }} />

Or use the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) → **`Agent Teams: Open Dashboard`**

<img width="768" alt="imagen" src="/img/docs/dashboard-command.png" style={{ height: "auto" }} />

---

## Home Page

The main dashboard page shows a live summary of your workspace:

| Card | What it shows |
|---|---|
| **Stats** | Active team name, total agent count, sync status, and Engram integration health |
| **Sync Status** | Breakdown of pending changes (agents to create / update / skip) with a one-click sync button |
| **Engram Banner** | First-time configuration prompt — only shown if the Engram memory extension is not set up |
| **Quick Actions** | Shortcut buttons to the most common pages (Create Agent, Create Team, Open Profile) |

<img width="1668" alt="imagen" src="/img/docs/dashboard-overview.png" style={{ height: "auto" }} />

---

## Navigation

Use the sidebar icons or the Quick Actions card to move between pages:

<img width="1637" alt="imagen" src="/img/docs/dashboard-actions.png" style={{ height: "auto" }} />

### Profile Editor

Edit your project profile — technologies, paths, commands, context packs, and sync targets. The dashboard home page shows a setup prompt when no profile exists yet. See [Profile Editor](profiles.md) for details.

### Team Manager

Lists all teams with their name, description, agent count, and active status. From here you can create new teams, activate a team, or open one for editing. See [Teams](teams.md) for details.

### Agent Manager

Shows all loaded agents organized by role (Router, Orchestrator, Worker). Click any agent to edit it, or click **Create Agent** to open the wizard. See [Agents](agents.md) for details.

### Create Agent / Edit Agent

The 6-step agent creation wizard. Covers identity, scope, workflow, skills, rules, and output configuration. A live preview appears in the right sidebar throughout the process.

### Create Team / Edit Team

The team creation wizard. Enter a name, select member agents, and preview the configuration. Edit Team adds options to set the team as active or delete it.

### Skills Browser

Two-tab view: your project's local skills and the community registry. Browse, search, filter by category, and install skills from the community directly. See [Skills Browser](skills-browser.md) for details.

### Context Packs

Manage the context packs available in your workspace. Toggle packs on or off, adjust priority, create new packs, and import markdown files as packs. See [Context Packs](context-packs.md) for details.

### Import / Export

Back up and share your global agent catalog. Export to JSON, import from a file, or reset the catalog. See [Profile Editor — Import / Export](profiles.md#import--export) for details.

---

## Stats Card

The stats card updates automatically when agents or teams change:

- **Active team** — the team currently selected for sync operations.
- **Agent count** — total agents loaded from specs and kits.
- **Sync status** — `Up to date` or `X changes pending`.
- **Engram** — `Connected` or `Not configured`.

<img width="1628" alt="imagen" src="/img/docs/dashboard-status.png" style={{ height: "auto" }} />

---

## First-Time Setup Workflow

If you are opening Agent Teams for the first time in a project, follow this sequence:

1. **Configure the project profile** — the home page shows a setup prompt. Click it to open the Profile Editor, fill in your technologies, paths, and commands, then save.
2. **Create your agents** — go to Agent Manager → Create Agent and walk through the wizard for each agent you need.
3. **Create a team** — go to Team Manager → Create Team, add your agents, and save. Set it as the active team.
4. **Sync** — the home page Sync Status card will show pending changes. Click Sync to generate the `.github/agents/` files and activate your agents in Copilot Chat.

---

## Refreshing Data

The dashboard reacts to VS Code state changes automatically. If you edit a YAML file directly outside the dashboard, the stats and sync status update on the next file save.

To force a full reload: Command Palette → **`Agent Teams: Reload Agents`**

---


