# Agent Spec Authoring

## Purpose

This skill provides all the knowledge needed to generate a **valid AgentSpec YAML** from a natural-language description. It is used by agents that design or scaffold other agents (e.g. `agent-designer`).

When this skill is active, you must:
1. Read available workspace context (existing agents, available skills, tech stack).
2. Translate the user's description into a schema-compliant YAML spec.
3. Output **only** a fenced YAML block — no prose before or after.

---

## Output Format

Always emit exactly one fenced YAML block:

````
```yaml
id: my-agent
name: My Agent
...
```
````

No text, explanation, or commentary outside the code fence. Ever.

---

## Schema Reference

The AgentSpec has `additionalProperties: false` — only the fields listed below are valid. Using any other field name will fail validation.

### Required fields

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Slug format: `^[a-z0-9-]+$`. Derive from name using lowercase-kebab-case. Must be unique in the workspace. |
| `name` | string | Human-readable, 3–80 chars. |
| `role` | string | Enum: `worker` \| `orchestrator` \| `router` |
| `description` | string | 1–3 sentences, 10–600 chars. What this agent does. |

### Optional fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `version` | string | `"1.0.0"` | Semver: `^[0-9]+\.[0-9]+\.[0-9]+$` |
| `domain` | string | `"general"` | Primary domain (e.g. `frontend`, `backend`, `testing`, `tooling`, `devops`) |
| `subdomain` | string | — | Optional sub-category within the domain |
| `expertise` | string[] | `[]` | Knowledge areas for routing and selection |
| `intents` | string[] | `[]` | Canonical intent IDs this agent handles. Each must match `^[a-z0-9_]+$` (snake_case) |
| `scope` | object | — | Operational scope (see below) |
| `workflow` | string[] | `[]` | Ordered imperative steps. If empty, the role's base workflow is used. |
| `tools` | object[] | `[]` | Environment capabilities the agent can invoke (see below) |
| `skills` | object[] | `[]` | Reusable skill IDs from the registry (see below) |
| `permissions` | object | all `false` | Runtime permissions (see below) |
| `constraints` | object | — | Behavioral rules (see below) |
| `handoffs` | object | — | Agent coordination topology (see below) |
| `output` | object | — | Response format configuration (see below) |
| `context_packs` | string[] | `[]` | Context pack IDs to load at runtime. Pattern: `^[a-z0-9:_-]+$` |
| `context_strategy` | object | — | Runtime context loading config (see below) |
| `targets` | string[] | `["copilot","claude"]` | Platforms to sync to. Enum values: `copilot`, `claude` |

---

### `scope` object

```yaml
scope:
  topics:           # string[] — responsibility topics (human-readable)
    - "API design"
  path_globs:       # array — file patterns the agent owns
    - pattern: "src/api/**"
      priority: high   # high | medium | low  (default: medium)
    - "src/routes/**"  # shorthand string (medium priority)
  excludes:         # string[] — patterns explicitly out of scope
    - "**/*.test.ts"
```

### `tools` array

```yaml
tools:
  - name: "github"
    when: "creating or reviewing pull requests"
  - name: "terminal"
```

### `skills` array

```yaml
skills:
  - id: run-tests        # slug format ^[a-z0-9-]+$
    when: "validating changes"
  - id: search-codebase
```

### `permissions` object

All default to `false`. Only set to `true` what the agent genuinely needs.

```yaml
permissions:
  can_create_files: false
  can_edit_files: true
  can_delete_files: false
  can_run_commands: false
  can_delegate: false
  can_modify_public_api: false
  can_touch_global_config: false
```

### `constraints` object

```yaml
constraints:
  always:    # string[] — rules the agent must always follow
    - "Add tests for every change"
  never:     # string[] — behaviors the agent must never exhibit
    - "Modify files outside its scope"
  escalate:  # string[] — conditions that must trigger escalation
    - "When the change affects a public API"
```

### `handoffs` object

```yaml
handoffs:
  receives_from:   # string[] — agent IDs or role names that send tasks here
    - orchestrator
  delegates_to:    # string[] — agent IDs this agent can delegate to
    - test-runner
  escalates_to:    # string[] — agent IDs for blocked tasks
    - tech-lead
```

### `output` object

```yaml
output:
  template: diff           # diff | code-review | planning | analysis |
                           # step-by-step | structured-qa | summary |
                           # routing-decision | custom
  extends: diff            # base template to extend (when template=custom)
  sections:                # string[] — ordered section list override
    - summary
    - changes
  format_instructions: >   # free-form instructions (when template=custom)
    Output a diff block followed by a one-paragraph explanation.
  mode: short              # short | detailed  (default: short)
  max_items: 5             # integer ≥ 1 (default: 5)
  never_include:           # default: ["disclaimers","apologies","placeholders"]
    - disclaimers
```

### `context_strategy` object

```yaml
context_strategy:
  max_files: 10             # integer ≥ 1 (default: 10)
  max_chars_per_file: 4000  # integer ≥ 100 (default: 4000)
  retrieval_mode: semantic  # semantic | glob | explicit  (default: semantic)
```

---

## Role Semantics

Choose the role that matches the agent's primary responsibility:

| Role | When to use |
|------|-------------|
| `worker` | Executes a focused task within a defined scope. Base workflow: understand → gather context → analyze → execute → verify. |
| `orchestrator` | Decomposes a goal and delegates sub-tasks to worker agents. Base workflow: understand → decompose → delegate → integrate → validate. |
| `router` | Receives requests and routes them to the best-matched agent. Base workflow: read → identify → apply rules → assign → escalate if no match. |

---

## Role-Specific Field Constraints

Some schema fields are valid only for certain roles. These restrictions are enforced by the generator — using a forbidden field for a given role will produce an invalid spec.

| Field | `worker` | `orchestrator` | `router` |
|-------|----------|----------------|----------|
| `subdomain` | optional | **omit** | **omit** |
| `scope.topics` | optional | optional | **omit** |
| `scope.path_globs` | optional | **omit** | **omit** |
| `scope.excludes` | optional | **omit** | **omit** |
| `constraints` | optional | optional | **omit** |
| `output.max_items` | optional | optional | **omit** |
| `output.never_include` | optional | optional | **omit** |

### Rules by role

**`worker`** — all optional fields are available. Use the full schema.

**`orchestrator`**
- Omit `subdomain`.
- If `scope` is needed, include **only** `topics`; never include `path_globs` or `excludes`.
- `constraints`, `output.max_items`, and `output.never_include` are fully available.

**`router`**
- Omit `subdomain`.
- Omit `scope` entirely.
- Omit `constraints` entirely.
- In `output`: include **only** `template` and, optionally, `mode` and `format_instructions`; never include `max_items` or `never_include`.
- Set `domain` to `global` (routers are platform-wide by design).

---

## Workspace Context Usage

Before generating a spec, read the available workspace context to ensure coherence:

- **Existing agent IDs** — never generate an `id` that already exists.
- **Available skills** — only reference skills that are installed or registered in the workspace. Do not invent skill IDs.
- **Technology stack** — adapt `domain`, `expertise`, `intents`, and `scope.path_globs` to match the actual tech (e.g. a React project should use `frontend` domain, not `backend`).
- **Existing agents' domains and intents** — avoid duplicating coverage that another agent already provides; design complementary agents instead.

---

## Complete Example

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
    - pattern: "src/**/*.ts"
      priority: high
    - pattern: "**/*.test.ts"
      priority: medium
  excludes:
    - "dist/**"
    - "node_modules/**"
workflow:
  - Read the PR diff and identify changed files within scope.
  - Check for missing or inadequate tests for changed logic.
  - Scan for common security issues (injection, auth bypass, secrets in code).
  - Review API contracts for breaking changes.
  - Produce a structured review using the code-review output template.
tools:
  - name: github
    when: fetching PR diff and posting review comments
skills:
  - id: search-codebase
    when: tracing dependencies of changed code
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
handoffs:
  receives_from:
    - orchestrator
  escalates_to:
    - tech-lead
output:
  template: code-review
  mode: detailed
  max_items: 10
targets:
  - copilot
  - claude
```
