---
description: Agent Designer and Team Builder are built-in agents that generate valid AgentSpec YAMLs and full team compositions from natural language. Available immediately after installing the extension.
---

# Agent Designer & Team Builder

**Status:** Coming soon

`@agent-designer` and `@team-builder` are built-in agents bundled with the extension. They are available immediately after installation — no marketplace copy or manual setup required.

---

## Agent Designer

The Agent Designer reads your workspace context — existing agents, installed skills, and your project's technology stack — and produces a spec that fits naturally into your team architecture. It:

- Infers the correct `role`, `domain`, `expertise`, and `intents` from your description
- Suggests up to 3 relevant workspace skills and adds them to `skills` with clear `when` conditions
- Avoids collisions with existing agent IDs
- Only references skills that are actually installed in the workspace
- Emits exactly one fenced YAML block — no explanatory text, no placeholders

It also supports **importing** existing agent definitions from other formats (Claude Code `.md`, Copilot `.agent.md`, plain markdown) and converting them to a valid `AgentSpec` YAML.

---

## Team Builder

<!-- TODO: screenshot — tarjeta "Design your first team" del dashboard cuando aún no existen equipos en el workspace. Nombre sugerido: agent-designer-team-builder-card.png -->

The Team Builder is an orchestrator agent that designs your full agent team from scratch:

1. **Reads your project context** — README, `project.profile.yml`, package manifests, directory structure
2. **Proposes agent explanation cards** — one per agent, with role, domain, intents, scope paths, context packs, skills, and handoffs
3. **Waits for your confirmation** before proceeding
4. **Fans out to `@agent-designer` workers** via Engram — one worker per proposed agent, all running in parallel
5. **Verifies cross-agent coherence** — unique IDs, valid handoff references, no circular delegations
6. **Writes the team binding file** to `.agent-teams/teams/<teamId>.yml`

> **Recommended:** use a capable model (e.g. Claude Sonnet) for best results. The Team Builder is available directly from the dashboard home page via the **"Design your first team"** card when no teams exist in the workspace.

---

## Using the Agent Designer

### Step 1 — Invoke the agent in Copilot Chat or Claude

<!-- TODO: screenshot — ventana de Copilot Chat con el mensaje `@agent-designer design an agent...` y la respuesta del agente generando el YAML. Nombre sugerido: agent-designer-chat-invocation.png -->

Address the agent directly with `@agent-designer` (Copilot) or mention it by name in your Claude conversation:

```
@agent-designer design an agent that reviews TypeScript pull requests for security issues and missing tests
```

### Step 2 — Describe what you need

The more context you give, the more accurate the result. You can include:

| Hint | Example |
|---|---|
| **Role** | "an orchestrator that coordinates the frontend pipeline" |
| **Domain** | "a backend agent focused on Node.js REST services" |
| **Main capability** | "reviews PRs", "generates API docs", "runs database migrations" |
| **Constraints** | "read-only, no file creation" |
| **Skills to use** | "use the search-codebase skill" |

> **Tip:** You don't need to mention every field. The agent infers what it can from the workspace and leaves optional fields empty when unsure.

### Step 3 — Use the generated YAML

The agent outputs a single YAML code block. You can:

1. **Copy → Create Agent wizard** — paste the YAML into the **Raw YAML** tab inside the agent wizard
2. **Save directly** — place the file in `.agent-teams/agents/your-agent.yml` and the dashboard will detect it on the next refresh
3. **Iterate** — ask the agent to adjust specific fields: `refine the constraints to also escalate when modifying a public API`

### Importing an existing agent definition

Provide the content of an existing agent file from any supported format and the Agent Designer will convert it:

```
@agent-designer convert this Claude Code agent to AgentSpec YAML:
<paste the .md file content here>
```

The agent extracts every mappable field, normalises values to AgentSpec conventions (role names, intent snake_case, permissions), and asks a single grouped clarification message for anything it cannot resolve before emitting the YAML.

---

## Example

**Input:**

```
@agent-designer create a worker agent that reviews pull requests in a TypeScript + Node.js backend project
```

**Output:**

```yaml
id: pr-reviewer
name: PR Reviewer
version: 1.0.0
role: worker
domain: backend
description: >
  Reviews pull requests for correctness, security, and test coverage in
  TypeScript Node.js services. Leaves structured comments and approves or
  requests changes.
expertise:
  - TypeScript
  - Node.js
  - REST API design
  - security code review
  - test coverage analysis
intents:
  - review_pull_request
  - check_test_coverage
  - flag_security_issues
scope:
  topics:
    - pull request review
    - code quality
    - security analysis
  path_globs:
    - pattern: src/**/*.ts
      priority: high
    - pattern: '**/*.test.ts'
      priority: medium
  excludes:
    - dist/**
    - node_modules/**
workflow:
  - Read the PR diff and identify changed files within scope.
  - Check for missing or inadequate tests for changed logic.
  - Scan for common security issues (injection, auth bypass, secrets in code).
  - Review API contracts for breaking changes.
  - Produce a structured review using the code-review output template.
tools:
  - name: github
    when: fetching PR diff and posting review comments
permissions:
  can_create_files: false
  can_edit_files: false
  can_delete_files: false
  can_run_commands: false
  can_delegate: false
  can_modify_public_api: false
  can_touch_global_config: false
constraints:
  always:
    - Flag any change that removes or weakens authentication checks.
    - Require tests for every new exported function.
  never:
    - Approve a PR that introduces hardcoded secrets or credentials.
    - Review files outside the defined scope.
  escalate:
    - When a PR modifies public API contracts without a version bump.
output:
  template: code-review
  mode: detailed
  max_items: 10
targets:
  - github_copilot
  - claude_code
```

---

## The agent-spec-authoring skill

The `agent-spec-authoring` skill is **bundled with the extension** — no manual installation or workspace setup is required. It is injected automatically into every `@agent-designer` session. The skill provides the complete AgentSpec schema — all valid fields, types, validation rules, and role semantics — so the agent always produces specs that pass validation.

> **Local override:** if a skill with id `agent-spec-authoring` is present in `.agent-teams/skills/agent-spec-authoring/`, it takes precedence over the bundled version automatically.

### Required fields

| Field | Type | Rules |
|---|---|---|
| `id` | string | Slug: `^[a-z0-9-]+$`. Must be unique in the workspace. |
| `name` | string | Human-readable, 3–80 characters. |
| `role` | string | `worker` \| `orchestrator` \| `router` \| `aggregator` |
| `description` | string | 1–3 sentences, 10–600 characters. |

### Role semantics

| Role | When to use |
|---|---|
| `worker` | Executes a focused task within a defined scope |
| `orchestrator` | Decomposes a goal and delegates sub-tasks to workers within a domain |
| `router` | Receives requests and routes them to the best-matched agent via dispatch tools |
| `aggregator` | Merges results from parallel orchestrators and surfaces cross-domain conflicts |

### Common optional fields

| Field | Description |
|---|---|
| `domain` | Primary domain: `frontend`, `backend`, `testing`, `tooling`, `devops` |
| `expertise` | List of knowledge areas used for routing |
| `intents` | Snake_case action IDs this agent handles (e.g. `review_pull_request`) |
| `scope` | File globs, topics, and excludes that define the agent's operational boundary |
| `workflow` | Ordered imperative steps the agent follows |
| `skills` | Skill IDs from the workspace registry |
| `tools` | Environment capabilities (`github`, `terminal`, etc.) with optional `when` |
| `constraints` | `always` / `never` / `escalate` behavioral rules |
| `targets` | Platforms to sync to: `copilot`, `claude` (default: both) |

> For the full schema reference including sub-object definitions, see the `SKILL.md` inside `marketplace/skills/agent-spec-authoring/` or the bundled copy in the extension.

<!-- TODO: screenshot — captura del Raw YAML tab dentro del wizard de creación de agente donde se pega el YAML generado. Nombre sugerido: agent-designer-raw-yaml-tab.png -->

---

## Constraints

The Agent Designer enforces these rules in every generation:

**Always:**
- Emit exactly one fenced YAML block — no text before or after
- Use only fields defined in the AgentSpec schema
- `id` must match `^[a-z0-9-]+$` and must not collide with existing agent IDs
- Every intent must match `^[a-z0-9_]+$` (snake_case)
- Include all 4 required fields: `id`, `name`, `role`, `description`
- Reference only skills available in the current workspace

**Never:**
- Invent field names not in the schema
- Emit JSON instead of YAML
- Include markdown prose outside the fenced block
- Reuse an ID that already exists in the workspace
