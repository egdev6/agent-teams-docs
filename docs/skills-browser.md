# Skills Browser

**Status:** 🧪 Beta | [← Back to Index](../README.md)

The Skills Browser lets you explore the skill catalog defined in `skills.registry.yml`. Skills describe the capabilities an agent can have — from file operations and code analysis to git and deployment tasks.

---

## Opening the Skills Browser

Dashboard → sidebar → **Skills**

<!-- screenshot: Dashboard with the Skills icon highlighted in the left sidebar, and the Skills Browser page loaded in the main content area — showing the category filter bar at the top and a grid of skill cards below -->

---

## Skill Categories

The registry organizes skills into 9 categories:

| Category | Description |
|---|---|
| `file_operations` | Read, write, create, and delete files in the workspace |
| `code_analysis` | Analyse code structure, detect patterns, and review code |
| `execution` | Run scripts, shell commands, and build tasks |
| `browser` | Interact with or inspect web pages |
| `database` | Query, migrate, and seed databases |
| `testing` | Run tests, generate test cases, and check coverage |
| `documentation` | Generate or update docs, READMEs, and changelogs |
| `git` | Commit, branch, diff, and merge operations |
| `deployment` | Build, package, publish, and deploy |

---

## Browsing Skills

Use the category filter bar at the top of the page to narrow by category. Each skill card shows:

- **ID** — the identifier used in agent YAML (`skills: [code_analysis]`)
- **Category** — one of the 9 categories above
- **Security level** — indicates the risk level of the operations the skill enables
- **Recommended roles** — which agent roles benefit most (`router`, `orchestrator`, `worker`)

<!-- screenshot: Skills Browser page with the "testing" category filter active, showing only testing-related skill cards — each card displays the skill name, category badge, security level (low/medium/high), and recommended role tags -->

<!-- screenshot: A single expanded skill card showing all detail fields: id in monospace, category badge, security level badge (colour-coded), and recommended roles as clickable tags -->

---

## Applying Skills to an Agent

### Via the dashboard

1. Dashboard → **Agent Manager** → select agent → **Edit**.
2. In the **Skills** section, search and check the desired skills.
3. Save.

<!-- screenshot: The Edit Agent page with the Skills section expanded — a searchable list of skill checkboxes, with "code_analysis" and "testing" checked, and a search box filtering the list -->

### Via YAML

Add the skill IDs to the `skills` field in the agent spec:

```yaml
id: my-agent
skills:
  - code_analysis
  - testing
  - git
```

---

## Registry File

Skills are defined in `skills.registry.yml` at the workspace root. The schema is validated against `packages/core/schemas/skills.registry.schema.json`.

To add a custom skill, append an entry to `skills.registry.yml` following the existing format, then reload the extension:

Command Palette → **`Agent Teams: Reload Agents`**

---

[← Back to Index](../README.md)
