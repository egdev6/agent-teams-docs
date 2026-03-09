# Agents

**Status:** 🧪 Beta | [← Back to Index](../README.md)

Agents are the core building block of Agent Teams. Each agent is a GitHub Copilot chat participant with a defined role, skills, routing rules, and optional context packs.

---

## Creating an Agent

### Using the Wizard (recommended)

1. Command Palette → **`Agent Teams: Create Agent`**  
   Or: Dashboard → **Quick Actions** → **Create Agent**
2. Follow the steps: name, role, skills, routing keywords, context packs.
3. The agent spec (`.yml`) is created under `.agent-teams/agents/`.

<!-- screenshot: The Create Agent wizard page inside the dashboard, showing step 1 — fields for agent name and role selector (router / orchestrator / worker) -->

### From a YAML spec (CLI)

```bash
agent-teams agents:create --spec path/to/agent.yml
```

---

## Agent YAML Format

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

## Managing Agents

### Edit an Agent

1. Dashboard → **Agent Manager** → select agent → **Edit**.
2. Modify the fields and save.
3. Changes are written back to the YAML spec file.

<!-- screenshot: The Edit Agent page with an agent spec loaded, showing editable fields for skills (checkbox list) and routing keywords (tag input), with a Save button at the bottom -->

### Validate Specs

```bash
agent-teams agents:validate
```

Validates all agent specs found in the workspace against the JSON schema.

### Sync Agents to `.github/agents/`

```bash
# Preview changes without writing files
agent-teams agents:sync --dry-run

# Apply
agent-teams agents:sync
```

Or via Command Palette: **`Agent Teams: Sync Agents`**

### Reload Without Restarting

Command Palette → **`Agent Teams: Reload Agents`**

Picks up any changes made to YAML files since the last load.

---

## Using an Agent in Copilot Chat

Each loaded agent registers as a dynamic chat participant:

```
@agent-teams.my-agent  What is the best way to structure this React component?
```

Use `@agent-teams.router` to let the extension automatically pick the most relevant agent based on your message and the current file:

```
@agent-teams.router  Help me write a unit test for this function.
```

The router scores agents by intent keywords, file path patterns, domain vocabulary, and role — then delegates to the top match.

<!-- screenshot: VS Code Copilot Chat panel with @agent-teams.router typed, a question submitted, and the response showing which agent was selected and its answer -->

---

[← Back to Index](../README.md)
