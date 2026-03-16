---
description: Agents are the core building block of Agent Teams. Each agent is a GitHub Copilot chat participant with a defined role, skills, routing rules, and optional context packs.
---

# Agents

**Status:** 🧪 Beta

Agents are the core building block of Agent Teams. Each agent is a GitHub Copilot chat participant with a defined role, skills, routing rules, and optional context packs.

---

## Creating an Agent

Open the dashboard and navigate to **Agent Manager** → **Create Agent**, or use the **Quick Actions** card on the home page.

The wizard guides you through 6 steps:

<img width="1171" alt="imagen" src="/img/docs/agents-overview.png" style={{ height: "auto" }} />

### Step 0 — Identity

| Field | Description |
|---|---|
| **Name** | Display name shown in Copilot Chat |
| **Role** | `router`, `orchestrator`, `worker`, or `aggregator` (see [Roles](#agent-roles)) |
| **Description** | What the agent does — shown in the chat participant list |
| **Domain** | Primary domain (e.g. `frontend`, `backend`, `testing`) |
| **Subdomain** | Optional specialization within the domain (hidden for `router` and `orchestrator`) |

### Step 1 — Scope

> **Note:** This step is hidden for `router` agents — routers receive all `@router` messages and do not need scope filters.

Defines when this agent is activated by the `@router`.

| Field | Description |
|---|---|
| **Expertise areas** | Topics the agent is proficient in (tag input) |
| **Intents** | Action verbs the agent responds to (e.g. `write`, `review`, `fix`) |
| **Topics** | Subject keywords that trigger routing (e.g. `react`, `database`) |
| **File glob patterns** | File paths that activate this agent, with a priority level per pattern |
| **Exclude patterns** | File paths to explicitly exclude from routing |

### Step 2 — Workflow & Tools

| Field | Description |
|---|---|
| **Workflow steps** | Ordered list of steps the agent follows when handling a task |
| **Tools** | Capabilities the agent can use, each with an optional `when` condition |
| **MCP Servers** | *(Collapsible)* MCP servers required by this agent. On sync they are merged (by `id`) into `.vscode/mcp.json` (Copilot) or `.mcp.json` (Claude). New entries are added; existing ones are never overwritten |

### Step 3 — Skills

> **Note:** This step is hidden for `router` agents — routers use dispatch tools (`agent-teams-handoff`, `agent-teams-dispatch-parallel`) rather than domain skills.

Browse and add skills from two sources:

- **Project skills** — skills defined in your local `skills.registry.yml`
- **Community registry** — install skills from the shared registry directly from this step

Each skill card shows its ID, category, security level, and recommended roles. Select the skills relevant to this agent's purpose.

### Step 4 — Rules

> **Note:** Permissions and Constraints are hidden for `router` agents — their behavior is governed entirely by the dispatch tools.

| Section | Description |
|---|---|
| **Permissions** | What the agent is allowed to do |
| **Constraints — Always** | Rules the agent must always follow |
| **Constraints — Never** | Actions the agent must never take |
| **Constraints — Escalate** | Situations where the agent should hand off to a human |
| **Handoffs — Receives from** | Which agents can delegate to this one |
| **Handoffs — Delegates to** | Which agents this one can hand off to |
| **Handoffs — Escalates to** | Which agents or roles to escalate to when stuck |
| **Engram** | *(Worker agents only, requires Engram configured)* Toggle **Autonomous task context** to enable direct dispatch — the worker recalls task context from Engram at session start and calls `complete_subtask` automatically when done |

### Step 5 — Output & Context

> **Note:** Max items and Never include are hidden for `router` agents — routers produce a dispatch action, not a structured text response.

| Field | Description |
|---|---|
| **Output template** | Response format template |
| **Output mode** | `short` or `detailed` |
| **Max items** | Maximum number of items to include in a list response |
| **Never include** | Fields to omit from the agent's output |
| **Context packs** | Context packs to embed in the agent spec (feeds the composition engine) |
| **Sync targets** | Which AI tools to sync to: Claude Code, Codex, GitHub Copilot |

A live preview of the agent configuration appears in the right sidebar throughout the wizard. Click **Create** when done — the agent spec is written to `.agent-teams/agents/<id>.yml`.

---

## Managing Agents

### View All Agents

Dashboard → **Agent Manager** shows all loaded agents grouped by role (Router, Orchestrator, Worker). Click any agent to open it for editing.

### Edit an Agent

1. Dashboard → **Agent Manager** → select agent → **Edit**
2. All 6 wizard steps are available for modification
3. Save — changes are written back to the YAML spec file

<img width="1183" alt="imagen" src="/img/docs/agents-forms.png" style={{ height: "auto" }} />

### Sync Agents to `.github/agents/`

When agents are ready, sync them to generate the final markdown files used by GitHub Copilot:

1. Dashboard home → **Sync Status** card shows pending changes
2. Click the **Sync** button to apply all changes
3. The dashboard updates the stats card to reflect the new sync state

> **Preview before syncing:** the Sync Status card shows a breakdown of which agents will be created, updated, or skipped before you commit.

---

## Agent Roles

| Role | Purpose |
|---|---|
| `router` | Receives all `@router` messages and delegates via `agent-teams-handoff` (single) or `agent-teams-dispatch-parallel` (multi-domain) |
| `orchestrator` | Coordinates multi-step tasks across several worker agents within a domain |
| `worker` | Handles a specific, focused domain task. Can optionally operate in **autonomous mode** (see [`engram.mode`](#engram-autonomous-mode)) to accept direct dispatch without a router or orchestrator |
| `aggregator` | Collects results from parallel orchestrators, detects conflicts, and returns a unified response |

---

## Using an Agent in Copilot Chat

Each loaded agent registers as a dynamic chat participant:

```
@my-agent  What is the best way to structure this React component?
```

Use `@router` to let the extension automatically pick the most relevant agent based on your message and the current file:

```
@router  Help me write a unit test for this function.
```

The router scores agents by intent keywords, file path patterns, domain vocabulary, and role — then delegates to the top match.

<img width="535" alt="imagen" src="/img/docs/agents-status.png" style={{ height: "auto" }} />

---

## Reference: Agent YAML Format

The dashboard writes and reads this format automatically. You can also edit the file directly in VS Code — changes are picked up on the next sync or **Reload Agents**.

```yaml
id: my-agent
name: My Agent
description: Short description of what this agent does
role: worker          # router | orchestrator | worker | aggregator

skills:
  - code_analysis
  - file_operations

routing:
  keywords:
    - component
    - react
    - frontend
  paths:
    - src/components/**

context_packs:
  - frontend-conventions
```

### Fields

| Field | Required | Description |
|---|---|---|
| `id` | ✅ | Unique identifier (kebab-case) |
| `name` | ✅ | Display name shown in Copilot Chat |
| `description` | ✅ | What the agent does |
| `role` | ✅ | `router`, `orchestrator`, `worker`, or `aggregator` |
| `skills` | — | List of skill IDs from the registry |
| `routing.keywords` | — | Words that trigger routing to this agent |
| `routing.paths` | — | Glob patterns for file-based routing |
| `context_packs` | — | Context pack IDs to embed in responses |
| `engram.mode` | — | `default` or `autonomous`. Applies to `worker` agents only. See [Engram Autonomous Mode](#engram-autonomous-mode) |
| `mcpServers` | — | List of MCP server definitions to merge into the project MCP config on sync. See [MCP Servers](#mcp-servers) |

---

## Engram Autonomous Mode

Worker agents can be configured to operate in **autonomous mode** when [Engram](https://github.com/EngineeredMonkey/engram) is set up. This allows the worker to be dispatched directly — without going through a router or orchestrator — and manage its own task lifecycle.

```yaml
id: my-worker
name: My Worker
role: worker
engram:
  mode: autonomous
```

In this mode the worker:

1. **Recalls task context from Engram at session start:**
   - If the chat contains `[Handoff:{taskId}]` — retrieves the full task details written by the dispatcher.
   - If the chat contains `[Parallel:{taskId}]` — retrieves its specific subtask instructions.
   - Otherwise, loads domain patterns only.
2. **Signals completion automatically** — after persisting its result to Engram, calls `complete_subtask` to notify the aggregator.
3. **Receives the `complete-subtask` tool** automatically — no manual tool configuration required.

> **When to use it:** choose autonomous mode for workers that are dispatched directly via `agent-teams-dispatch-parallel` in multi-domain flows where no intermediate orchestrator is needed. For standard router → orchestrator → worker flows, the default mode is sufficient.

To enable it in the wizard, go to **Step 4 — Rules** and check **Engram → Autonomous task context** (only visible when Engram is configured and the role is `worker`).

---

## MCP Servers

Agents can declare the MCP servers they depend on. When a team is synced, Agent Teams merges those servers into the project MCP configuration automatically — so every collaborator gets the right tools without manual setup.

```yaml
id: my-worker
role: worker
mcpServers:
  - id: my-mcp-server
    command: npx -y my-mcp-server
    args:
      - --port
      - "3000"
    env:
      API_KEY: "${MY_API_KEY}"
```

**Merge behaviour:**
- Copilot target → merged into `.vscode/mcp.json` under the `servers` key
- Claude target → merged into `.mcp.json` at project root under the `mcpServers` key
- Merge key is `id` — if a server with that `id` already exists in the file it is **never overwritten**, so project-level overrides are always preserved

### MCP Server fields

| Field | Required | Description |
|---|---|---|
| `id` | ✅ | Unique server identifier used as the merge key |
| `command` | ✅ | Command to start the server (e.g. `npx -y my-mcp-server`) |
| `args` | — | List of command-line arguments |
| `env` | — | Environment variables passed to the server process |

To configure MCP servers in the wizard, open **Step 2 — Workflow & Tools** and expand the **MCP Servers** collapsible section.

---


