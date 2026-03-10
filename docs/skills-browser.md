# Skills Browser

**Status:** 🧪 Beta | [← Back to Index](../README.md)

The Skills Browser lets you explore the skill catalog defined in `skills.registry.yml`. Skills describe the capabilities an agent can have — from file operations and code analysis to git and deployment tasks.

---

## Opening the Skills Browser

Dashboard → sidebar → **Skills**

<img width="1169" height="812" alt="imagen" src="https://github.com/user-attachments/assets/769f757e-a70a-43b4-bedb-4a44a0354a1f" />

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

<img width="1184" height="1139" alt="imagen" src="https://github.com/user-attachments/assets/f8bef8b0-685d-4138-a6b6-03e1fbfa011e" />

---

## Applying Skills to an Agent

### Via the dashboard

1. Dashboard → **Agent Manager** → select agent → **Edit**.
2. In the **Skills** section, search and check the desired skills.
3. Save.

<img width="1171" height="832" alt="imagen" src="https://github.com/user-attachments/assets/4ebec413-7104-482c-81e7-465ec0cb45c2" />


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
