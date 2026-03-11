# Skills Browser

**Status:** 🧪 Beta

The Skills Browser lets you explore and manage agent skills. Skills describe the capabilities an agent can have — from file operations and code analysis to git and deployment tasks.

---

## Opening the Skills Browser

Dashboard → sidebar → **Skills**

<img width="1169" alt="imagen" src="/img/docs/skills-browser-overview.png" style={{ height: "auto" }} />

The browser has two tabs:

| Tab | Description |
|---|---|
| **Project Skills** | Skills available in this workspace (`skills.registry.yml`) |
| **Explore** | Community registry — browse and install skills from the shared catalog |

---

## Project Skills Tab

Shows all skills defined in your local `skills.registry.yml`.

- **Search** — filter by skill name or keyword
- **Category filter** — narrow by one of the 9 categories
- **Refresh** — reload the skill catalog from disk
- **Delete** — remove a skill from the project registry

The header shows how many skills match the current filter out of the total.

---

## Explore Tab (Community Registry)

Browse skills published to the shared community registry and install them directly into your project.

- **Search** — find skills by name or description in the remote registry
- Each skill card shows its ID, category, description, and a link to its source
- Click **Install** on any skill card to add it to your project's `skills.registry.yml`
- Use pagination to browse through the full catalog

<img width="1184" alt="imagen" src="/img/docs/skills-browser-install.png" style={{ height: "auto" }} />

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

## Applying Skills to an Agent

Skills are assigned to agents through the agent editor:

1. Dashboard → **Agent Manager** → select agent → **Edit**
2. Navigate to **Step 3 — Skills**
3. Search and select skills from the project registry or install new ones from the community
4. Save

<img width="1171" alt="imagen" src="/img/docs/skills-browser-apply.png" style={{ height: "auto" }} />

You can also assign skills during initial agent creation — the same skills step appears in the Create Agent wizard.

---

## Reference: Adding a Custom Skill

To add a skill that isn't in the community registry, append an entry to `skills.registry.yml` at the workspace root following the existing format, then reload the extension:

Command Palette → **`Agent Teams: Reload Agents`**

---


