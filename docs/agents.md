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

<img width="1171" height="956" alt="imagen" src="https://github.com/user-attachments/assets/4a9b94aa-4534-435c-919f-8d020889c08c" />

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

<img width="1183" height="745" alt="imagen" src="https://github.com/user-attachments/assets/254de2fe-41b3-47f1-930f-d5cd8cb17b85" />

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
@my-agent  What is the best way to structure this React component?
```

Use `@router` to let the extension automatically pick the most relevant agent based on your message and the current file:

```
@router  Help me write a unit test for this function.
```

The router scores agents by intent keywords, file path patterns, domain vocabulary, and role — then delegates to the top match.

<img width="535" height="366" alt="imagen" src="https://github.com/user-attachments/assets/3bc9dd8b-2b50-4241-b308-bfbafd58892e" />

---

[← Back to Index](../README.md)
