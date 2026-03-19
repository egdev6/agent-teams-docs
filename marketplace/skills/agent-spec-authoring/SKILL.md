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
| `engram` | object | — | Engram memory integration settings (see below). Semantically applies to `worker` agents. |
| `mcpServers` | object[] | `[]` | MCP servers required by the agent. Merged into `.vscode/mcp.json` (copilot) or `.mcp.json` (claude) during sync. |

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

### `engram` object

Engram memory integration for workers. Only set when the agent should operate autonomously using persistent memory.

```yaml
engram:
  mode: autonomous   # default | autonomous
                     # autonomous: worker recalls task context from Engram at
                     # session start and calls complete_subtask when done.
```

### `mcpServers` array

MCP servers the agent requires. During sync, these are merged into `.vscode/mcp.json` (Copilot) or `.mcp.json` (Claude).

```yaml
mcpServers:
  - id: github          # unique server key
    command: npx        # executable to launch
    args:               # optional launch arguments
      - -y
      - "@modelcontextprotocol/server-github"
    env:                # optional environment variables
      GITHUB_TOKEN: "${GITHUB_TOKEN}"
  - id: linear
    command: npx
    args: ["-y", "@linear/mcp"]
```

### Permission → tool linkage

The following permissions automatically add or remove tools from the agent's toolset in the wizard UI:

| Permission | Effect |
|------------|--------|
| `can_edit_files: true` **or** `can_create_files: true` | `edit/editFiles` is added (and locked) to `tools` |

Default locked tools per role (always present, cannot be removed in the wizard):

| Role | Locked tool |
|------|-------------|
| `router` | `agent-teams-handoff` |
| `orchestrator` | `search/codebase` |
| `worker` | `search/codebase` |

When generating a spec, include these tools explicitly unless the role is `router` (which would only need `agent-teams-handoff`).

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

## Importing Existing Agent Definitions

When the input is an existing agent definition (not a natural-language description), apply the following rules to convert it into a valid AgentSpec YAML.

### Format Detection

Identify the source format before extracting fields:

| Signal | Format |
|--------|--------|
| YAML frontmatter with `id`, `name`, `role`, `domain` + markdown sections | **Claude Code** (`.claude/agents/*.md`) |
| YAML frontmatter with `name`, `description` only + markdown sections | **GitHub Copilot** (`.github/agents/*.agent.md`) |
| Plain markdown with headings (no frontmatter) | **Unstructured markdown** |
| YAML or JSON document with agent fields | **Other framework** (map best-effort) |

### Field Extraction Map

Extract fields from the source using this mapping:

| AgentSpec field | Claude Code `.md` | Copilot `.agent.md` | Plain markdown |
|-----------------|-------------------|---------------------|----------------|
| `id` | frontmatter `id` | derive from `name` | derive from heading |
| `name` | frontmatter `name` | frontmatter `name` | first `#` heading |
| `role` | frontmatter `role` | infer from body | infer from body |
| `domain` | frontmatter `domain` | infer from body | infer from body |
| `description` | frontmatter `description` | frontmatter `description` | first paragraph |
| `version` | frontmatter `version` | — | — |
| `expertise` | "Specialises in:" line | "Specialises in:" line | expertise/skills section |
| `intents` | "Handles intents:" line | "Handles intents:" line | infer from capabilities |
| `workflow` | `## Workflow` ordered list | `## Workflow` ordered list | steps/procedure section |
| `skills` | `## Skills` table | `## Skills` table | tools/skills section |
| `constraints.always` | `**Always:**` list | `**Always:**` list | rules/constraints section |
| `constraints.never` | `**Never:**` list | `**Never:**` list | restrictions section |
| `output.template` | `## Output` Template line | `## Output` Template line | output/format section |
| `output.mode` | `## Output` Mode line | `## Output` Mode line | — |
| `output.format_instructions` | Format instructions line | Format instructions line | — |
| `permissions` | `## Permissions` section | infer from described capabilities | infer from capabilities |
| `mcpServers` | `## MCP Servers` section | tools referencing external services | external tool references |
| `engram.mode` | `## Memory` section presence | `## Memory` section presence | memory/persistence section |

### Inference Rules for Missing Fields

When a required or important field cannot be directly extracted:

- **`role`** — infer from agent purpose: if it routes/dispatches → `router`; if it coordinates multiple sub-tasks → `orchestrator`; otherwise → `worker`
- **`domain`** — map technology/area keywords: frontend/UI/React → `frontend`; backend/API/server → `backend`; test/quality/coverage → `testing`; deploy/infra/docker → `devops`; tool/generator/scaffold → `tooling`; otherwise → `general`
- **`intents`** — derive from the agent's described actions: extract verb-noun pairs and convert to `snake_case` (e.g. "reviews pull requests" → `review_pull_request`)
- **`expertise`** — extract technology names, frameworks, and domain concepts mentioned anywhere in the source
- **`permissions`** — infer from capabilities: if edits/creates files → `can_edit_files: true`; if runs commands/tests → `can_run_commands: true`; if delegates to other agents → `can_delegate: true`
- **`scope.path_globs`** — extract file patterns or directories mentioned explicitly in the source
- **`id`** — derive from `name` using `lowercase-kebab-case`; if it collides with an existing agent ID, append a numeric suffix

### Clarification Protocol

Before emitting the YAML, check for unresolved ambiguities. If **any** of the conditions below apply, **stop and ask the user** — do not guess:

| Condition | What to ask |
|-----------|-------------|
| `role` cannot be determined from the source | "Should this agent be a `worker`, `orchestrator`, or `router`?" |
| Two or more domains are equally plausible | "Should the domain be `{A}` or `{B}`?" |
| A referenced skill is not in the workspace registry | "The source mentions `{skill}`. Is this available in your workspace, or should I omit it?" |
| `id` derived from the name collides with an existing agent | "The id `{id}` already exists. Should I use `{id}-2`, or do you prefer another name?" |
| `permissions` cannot be inferred (actions described are ambiguous) | "Does this agent need to edit files / run commands / delegate? I couldn't tell from the source." |
| Source mentions an external service but lacks connection details | "The source references `{service}`. Should I add an `mcpServers` entry, and if so, what command/args should I use?" |
| A required field (`id`, `name`, `description`) is absent and cannot be derived | "I couldn't find a {field} in the source. What should it be?" |
| Two sections of the source contradict each other | "The source says `{A}` here but `{B}` there — which should I use?" |

When asking, group all open questions into a **single message** — never ask one question, wait for the answer, then ask another. List each ambiguity with a label (e.g. **[role]**, **[domain]**) so the user can answer them all at once.

Only proceed to emit YAML once every open question is resolved.

### Import Constraints

- Preserve the original agent's intent faithfully — only adapt structure, not meaning.
- Do not silently drop capabilities: if a described capability has no direct AgentSpec field, map it to `constraints.always`, `expertise`, or `workflow`.
- If the source document explicitly mentions external services (GitHub, Linear, Jira, Slack, etc.), add the corresponding `mcpServers` entries.
- If the source mentions persistent memory, session context, or recall across conversations, set `engram.mode: autonomous`.
- Always verify the generated id is unique in the workspace after import.

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
