# Agent Designer

**Status:** ✅ Available

The Agent Designer is a built-in **tooling agent** that generates a valid AgentSpec YAML from a natural-language description. Instead of filling out the Create Agent wizard manually, you describe what you need in plain language and get a ready-to-use spec in seconds.

---

## What it does

The Agent Designer reads your workspace context — existing agents, installed skills, and your project's technology stack — and produces a spec that fits naturally into your team architecture. It:

- Infers the correct `role`, `domain`, `expertise`, and `intents` from your description
- Avoids collisions with existing agent IDs
- Only references skills that are actually installed in the workspace
- Emits exactly one fenced YAML block — no explanatory text, no placeholders

---

## How to use it

Before invoking `@agent-designer`, install it from this repository's marketplace by copying the packaged files into your project's `.agent-teams` folder:

1. Copy `marketplace/agents/agent-designer.yml` into `.agent-teams/agents/`
2. Copy `marketplace/skills/agent-spec-authoring/` into `.agent-teams/skills/`
3. Reload Agent Teams or reopen the dashboard so the new agent and skill are detected

### Step 1 — Invoke the agent in Copilot Chat or Claude

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
  - copilot
  - claude
```

---

## The agent-spec-authoring skill

The Agent Designer's accuracy comes from the **`agent-spec-authoring`** skill installed in your workspace. This skill provides the complete AgentSpec schema — all valid fields, types, validation rules, and role semantics — so the agent always produces specs that pass validation.

### Required fields

| Field | Type | Rules |
|---|---|---|
| `id` | string | Slug: `^[a-z0-9-]+$`. Must be unique in the workspace. |
| `name` | string | Human-readable, 3–80 characters. |
| `role` | string | `worker` \| `orchestrator` \| `router` |
| `description` | string | 1–3 sentences, 10–600 characters. |

### Role semantics

| Role | When to use |
|---|---|
| `worker` | Executes a focused task within a defined scope |
| `orchestrator` | Decomposes a goal and delegates sub-tasks to workers |
| `router` | Receives requests and routes them to the best-matched agent |

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

> For the full schema reference including sub-object definitions, see the `SKILL.md` inside `marketplace/skills/agent-spec-authoring/`.

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
