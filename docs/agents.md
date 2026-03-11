# Agents

**Status:** 🧪 Beta

Agents are the core building block of Agent Teams. Each agent is a GitHub Copilot chat participant with a defined role, skills, routing rules, and optional context packs.

---

## Creating an Agent

Open the dashboard and navigate to **Agent Manager** → **Create Agent**, or use the **Quick Actions** card on the home page.

The wizard guides you through 6 steps:

<img width="1171" height="956" alt="imagen" src="/img/docs/agents-overview.png" />

### Step 0 — Identity

| Field | Description |
|---|---|
| **Name** | Display name shown in Copilot Chat |
| **Role** | `router`, `orchestrator`, or `worker` (see [Roles](#agent-roles)) |
| **Description** | What the agent does — shown in the chat participant list |
| **Domain** | Primary domain (e.g. `frontend`, `backend`, `testing`) |
| **Subdomain** | Optional specialization within the domain |

### Step 1 — Scope

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

### Step 3 — Skills

Browse and add skills from two sources:

- **Project skills** — skills defined in your local `skills.registry.yml`
- **Community registry** — install skills from the shared registry directly from this step

Each skill card shows its ID, category, security level, and recommended roles. Select the skills relevant to this agent's purpose.

### Step 4 — Rules

| Section | Description |
|---|---|
| **Permissions** | What the agent is allowed to do |
| **Constraints — Always** | Rules the agent must always follow |
| **Constraints — Never** | Actions the agent must never take |
| **Constraints — Escalate** | Situations where the agent should hand off to a human |
| **Handoffs — Receives from** | Which agents can delegate to this one |
| **Handoffs — Delegates to** | Which agents this one can hand off to |
| **Handoffs — Escalates to** | Which agents or roles to escalate to when stuck |

### Step 5 — Output & Context

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

<img width="1183" height="745" alt="imagen" src="/img/docs/agents-forms.png" />

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
| `router` | Receives all `@router` messages and delegates to the best-fit agent |
| `orchestrator` | Coordinates multi-step tasks across several worker agents |
| `worker` | Handles a specific, focused domain task |

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

<img width="535" height="366" alt="imagen" src="/img/docs/agents-status.png" />

---

## Reference: Agent YAML Format

The dashboard writes and reads this format automatically. You can also edit the file directly in VS Code — changes are picked up on the next sync or **Reload Agents**.

```yaml
id: my-agent
name: My Agent
description: Short description of what this agent does
role: worker          # router | orchestrator | worker

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
| `role` | ✅ | `router`, `orchestrator`, or `worker` |
| `skills` | — | List of skill IDs from the registry |
| `routing.keywords` | — | Words that trigger routing to this agent |
| `routing.paths` | — | Glob patterns for file-based routing |
| `context_packs` | — | Context pack IDs to embed in responses |

---

