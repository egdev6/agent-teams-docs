---
description: Agents are the core building block of Agent Teams. Each agent is a GitHub Copilot chat participant with a defined role, skills, routing rules, and optional context packs.
---

# Agents

**Status:** 🧪 Beta

Agents are the core building block of Agent Teams. Each agent is a GitHub Copilot chat participant with a defined role, skills, routing rules, and optional context packs.

---

## Creating an Agent

Open the dashboard and navigate to **Agent Manager** → **Create Agent**, or use the **Quick Actions** card on the home page.

The Agent Manager page header also provides a **Design a new agent with AI** button that opens `@agent-designer` directly in Copilot Chat — useful when you want AI to draft the spec first.

The wizard guides you through 6 steps:

<!-- IMAGE: Screenshot — Agent creation wizard showing all 6 step tabs (Identity, Scope, Workflow & Tools, Skills, Rules, Output & Context) with the live YAML preview sidebar on the right. Suggested filename: agents-overview.png -->

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
| **Tools** | Capabilities the agent can use. VS Code built-in tools (`read`, `edit`, `search`, `execute`, `browser`, `agent`, `web`, `todo`, `vscode`, `complete-subtask`) are shown as a checkbox grid. Custom or extension tools are added as free-text rows below. Each tool has an optional `when` condition |
| **MCP Servers** | *(Collapsible)* MCP servers required by this agent. On sync they are merged (by `id`) into `.vscode/mcp.json` (Copilot) or `.mcp.json` (Claude). New entries are added; existing ones are never overwritten |
| **Claude Code Sub-agent MCP Servers** | *(Visible when `claude_code` target is active)* MCP servers scoped to this sub-agent only — they connect when the sub-agent starts and disconnect when it finishes. Distinct from the MCP Servers section above, which syncs to the workspace config file |

> **Legacy tool names:** Agent specs that reference the old compound names (`search/codebase`, `edit/editFiles`) are automatically normalized to their current short equivalents (`search`, `edit`) during sync — no manual update to existing YAML files is required.

### Step 3 — Skills

> **Note:** This step is hidden for `router` agents — routers use dispatch tools (`agent-teams-handoff`, `agent-teams-dispatch-parallel`) rather than domain skills.

Browse and add skills from two sources:

- **Project skills** — skills defined in your local `skills.registry.yml`
- **Community registry** — install skills from the shared registry directly from this step

Each skill card shows its **title**, category, security level, and recommended roles. Select the skills relevant to this agent's purpose.

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
| **Engram** | Toggle **Autonomous task context** to enable direct dispatch. Available for all roles — the hint text updates to describe the behaviour for the current role. Workers recall task context from Engram at session start and call `complete_subtask` automatically when done. **Per-agent opt-in:** an agent that declares `engram` in its `mcpServers` list receives Engram memory features even when no global Engram MCP server is configured for the workspace — enabling self-contained agents that bootstrap on a fresh machine |

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
| **Claude Code Settings** | *(Visible when `claude_code` target is active)* Model, Max Turns, Effort, Permission Mode, Disallowed Tools, and Background task toggle — all optional and scoped to the Claude Code sub-agent |

A live preview of the agent configuration appears in the right sidebar throughout the wizard. Click **Create** when done — the agent spec is written to `.agent-teams/agents/<id>.yml`.

---

## Managing Agents

### View All Agents

Dashboard → **Agent Manager** shows all loaded agents organized into three tabs — **Router**, **Orchestrator**, and **Worker** — each showing a live count. An empty-state message is shown per tab when no agents of that role exist.

The page header has two action buttons: **Create Agent** (opens the wizard) and **Design a new agent with AI** (opens `@agent-designer` in Copilot Chat).

### Edit an Agent

1. Dashboard → **Agent Manager** → select agent → **Edit**
2. All 6 wizard steps are available for modification
3. Save — changes are written back to the YAML spec file

<!-- IMAGE: Screenshot — Agent Manager page showing the list of agents organized by role tabs (Router, Orchestrator, Worker), with one agent card expanded showing its Edit button and "Not synced" badge. Suggested filename: agents-forms.png -->

### Not Synced Badge

Agents whose source spec was modified after the last successful sync show a **Not synced** badge (orange indicator) in the Agent Manager card. Sync the team to clear the badge.

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

<!-- IMAGE: Screenshot — GitHub Copilot Chat panel in VS Code showing @router and a custom agent (@my-agent) as selectable chat participants, with an active conversation showing the router delegating to a worker. Suggested filename: agents-status.png -->

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
| `engram.mode` | — | `default` or `autonomous`. See [Engram Autonomous Mode](#engram-autonomous-mode) |
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

<!-- IMAGE: Screenshot — Agent wizard Step 4 (Rules) showing the Engram section with the "Autonomous task context" toggle enabled and its descriptive hint text visible beneath it. Suggested filename: agents-engram-toggle.png -->

To enable it in the wizard, go to **Step 4 — Rules** and check **Engram → Autonomous task context** (requires Engram configured).

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

## GitHub Copilot target

When `github_copilot` is included in the agent's `targets` (the default), the sync generates a `.md` file in `.github/agents/` that conforms to the VS Code Copilot agent format.

### Frontmatter

| Field | Description |
|---|---|
| `name` | Display name of the agent (from the spec `name` field) |
| `description` | One-line description used in Copilot Chat |
| `tools` | Allowlist of tools the agent can call (auto-populated — see below) |
| `user-invocable` | Set to `false` for workers with `receivesFrom` (subagents not meant to be called directly) |

### Tool auto-injection

The `tools` frontmatter field is built automatically from three sources:

1. **Standard workflow tools** — injected based on role so the agent can execute lean body steps:

   | Role | Auto-injected |
   |---|---|
   | All roles | `read`, `search` |
   | Worker | + `edit` |
   | Orchestrator | + `todo` |

2. **Engram tools** — `engram/*` is injected whenever the agent uses Engram (via `mcpServers` or `tools`). Additional dispatch tools are injected based on role:

   | Role | Additional tools |
   |---|---|
   | Router, Orchestrator | `egdev6.agent-teams/agent-teams-handoff`, `egdev6.agent-teams/agent-teams-dispatch-parallel` |
   | Worker with `receivesFrom` | `egdev6.agent-teams/agent-teams-complete-subtask` |

3. **Explicit spec tools** — any tools listed in the spec's `tools` field (e.g. `execute`, custom MCP tools) are appended after normalization.

> **`complete-subtask` belongs to workers, not orchestrators.** Workers that receive dispatched sub-tasks call `complete-subtask` to signal fan-in back to the orchestrator. The orchestrator dispatches and waits — it never calls `complete-subtask` itself.

### Memory

Persistent memory for Copilot agents is provided by **Engram MCP**, configured via `.vscode/mcp.json`. The `tools` frontmatter includes `engram/*` automatically when Engram is active — no manual configuration required. The body steps follow the same condensed session pattern as Claude Code (`mem_session_start` at start, `mem_save` + `mem_session_end` at end).

### Body structure

The generated body uses the same lean format as the Claude Code target:

```
You are the <name> agent.

## Role
- <expertise or scope topics>

## Constraints          ← only if defined in spec
- <always rules>
- Do not <never rules>
- Escalate when: <escalate rules>

## Approach
1. Start Engram session: call `mem_session_start`, then `mem_context` to load recent context.
2–N. <workflow steps>
N+1. Save to Engram: call `mem_save` with key from `mem_suggest_topic_key`, then `mem_session_end`.

## Delegates to         ← orchestrators and routers only
- `<agent-id>`

## Output Format
- <bullets derived from output.template>
```

Orchestrators also get a dispatch step injected after "Assign each sub-task":

```
For each delegation: use `egdev6.agent-teams/agent-teams-handoff` (single agent) or
`egdev6.agent-teams/agent-teams-dispatch-parallel` (parallel) — do NOT respond until
all invocations complete.
```

And the "Delegates to" section includes dispatch instructions with both tools plus a note that workers (not the orchestrator) call `complete-subtask` when done.

---

## Claude Code target

When `claude_code` is included in the agent's `targets`, the sync generates a `.md` file in `.claude/agents/` that conforms to the Claude Code sub-agent format.

### How the generated file differs from the GitHub Copilot format

| Aspect | GitHub Copilot | Claude Code |
|---|---|---|
| `name` frontmatter | Display name | Slug (`id` field) — used for `@agent-<name>` and `--agent` |
| Body | Lean system prompt: Role → Constraints → Approach → Output Format | Lean system prompt: Role → Constraints → Approach → Output Format |
| Tools frontmatter | Auto-injected per role + Engram + spec tools | Only emitted if explicitly declared in `tools` (translated to Claude names) |
| Dispatch tools | `agent-teams-handoff`, `agent-teams-dispatch-parallel` | `dispatch_task` (Claude Code SDK) |
| Complete fan-in | `agent-teams-complete-subtask` (worker) | `complete_subtask` (worker) |
| `id` field | Emitted | Not emitted (not a Claude Code field) |
| Engram config | `.vscode/mcp.json` (workspace) | `mcpServers` in agent frontmatter (sub-agent scoped) |

### Claude Code-specific spec fields

These fields are only used when syncing to the `claude_code` target. All are optional — omitting them lets Claude Code inherit the session default.

| Field | Type | Emitted as | Notes |
|---|---|---|---|
| `claude_model` | `inherit \| sonnet \| opus \| haiku` | `model` | Omit or set `inherit` to use session model |
| `claude_max_turns` | integer ≥ 1 | `maxTurns` | Omit to use Claude Code default |
| `claude_effort` | `low \| medium \| high \| max` | `effort` | Omit to inherit from session |
| `claude_permission_mode` | `default \| acceptEdits \| dontAsk \| bypassPermissions` | `permissionMode` | Omit to use `default` |
| `claude_disallowed_tools` | string[] | `disallowedTools` | Tools to deny on top of inherited set |
| `claude_background` | boolean | `background` | Run sub-agent as background task |
| `claude_mcp_servers` | object[] | `mcpServers` | MCP servers scoped to this sub-agent only (see below) |

> **`claude_mcp_servers` vs `mcpServers`:** `mcpServers` merges servers into the workspace config file (`.mcp.json`). `claude_mcp_servers` scopes servers to this sub-agent only — they appear in the agent's frontmatter `mcpServers` field and are connected when the sub-agent starts and disconnected when it finishes.

#### `claude_mcp_servers` fields

| Field | Required | Description |
|---|---|---|
| `name` | ✅ | Server name / key |
| `type` | — | `stdio \| http \| sse \| ws` |
| `command` | — | Executable to launch |
| `args` | — | Command-line arguments |
| `env` | — | Environment variables |

### Tool name translation

The wizard and YAML spec use VS Code tool names. During sync to `claude_code`, these are automatically translated to their Claude Code equivalents:

| Spec / wizard name | Claude Code tool(s) emitted |
|---|---|
| `read` | `Read` |
| `edit` | `Edit` |
| `search` | `Grep`, `Glob` |
| `execute` | `Bash` |
| `browser` | `WebFetch` |
| `web` | `WebSearch` |
| `agent` | `Agent` |
| `todo` | `TodoWrite` |
| `engram/*`, `egdev6.*`, `complete-subtask`, `vscode` | *(skipped — MCP or extension-only tools)* |

If no translatable tools are present, the `tools:` frontmatter line is omitted entirely and the sub-agent inherits all available tools.

### Memory

Persistent memory for Claude Code agents is provided exclusively by **Engram MCP**. The native Claude Code `memory:` frontmatter field is not used — Engram covers the same capability with richer features (semantic search, cross-agent context, session tracking).

When Engram is active, the generated body includes condensed session steps:
- **Start:** `mem_session_start` + `mem_context`
- **End:** `mem_save` + `mem_session_end`

### Claude Code body structure

The body structure is identical to the [GitHub Copilot target](#body-structure) — same sections, same Engram condensation pattern. The only differences are tool names:

- **Dispatch:** `dispatch_task` MCP tool (instead of `agent-teams-handoff` / `agent-teams-dispatch-parallel`)
- **Fan-in:** `complete_subtask` (instead of `agent-teams-complete-subtask`) — called by workers, not orchestrators
- **Orchestrator dispatch step:** same injection after "Assign each sub-task", with `dispatch_task` references

Example spec for a Claude Code worker with all optional fields shown:

```yaml
id: engram-dashboard-worker
name: Engram Dashboard Worker
role: worker
description: Use proactively for React/TypeScript work in the Engram dashboard, especially stats views, observation filtering, and files under src/pages/engram-dashboard/.
claude_model: sonnet
claude_max_turns: 10
claude_effort: high
claude_permission_mode: acceptEdits
claude_disallowed_tools:
  - Bash
claude_background: false
targets:
  - claude_code
```

`claude_mcp_servers` example (sub-agent scoped, not merged into workspace config):

```yaml
claude_mcp_servers:
  - name: my-data-server
    type: stdio
    command: npx -y my-data-mcp
    env:
      API_KEY: "${MY_API_KEY}"
```

---


