# Profile Editor

**Status:** 🧪 Beta

A project profile (`.agent-teams/project.profile.yml`) defines the technology context, path mappings, commands, and base agent overrides for a workspace. It feeds into the composition engine when resolving kit placeholders and applying project-level defaults.

---

## Opening the Profile Editor

Dashboard → sidebar → **Profile Editor**

If no profile exists yet, the dashboard home page shows a **Configure project profile** prompt. Click it to open the editor directly.

<img width="898" alt="imagen" src="/img/docs/profiles-wizard.png" style={{ height: "auto" }} />

---

## Filling Out the Profile

The editor is divided into seven sections:

### Basic Information

| Field | Description |
|---|---|
| **Project ID** | Unique identifier for this project (kebab-case) |
| **Name** | Human-readable project name |
| **Version** | Project version string |
| **Type** | Project type: `frontend`, `backend`, `fullstack`, `monorepo`, or `library` |

### Technologies

List the technologies your project uses. These are used in template conditionals (`{{#if technology:react}}`).

- Click **Add technology** to add an entry manually
- Click **Detect** to have the extension scan your workspace and suggest technologies automatically

### Paths

Named path mappings used in template variables (`{{path:src}}`).

- Add key-value pairs (e.g. `src → src/`, `tests → tests/`, `components → src/components/`)
- Click **Detect** to auto-fill paths based on your project structure

### Commands

Named command mappings used in template variables (`{{command:build}}`).

- Add key-value pairs (e.g. `build → pnpm build`, `test → pnpm test`, `lint → pnpm lint`)
- Click **Detect** to auto-fill based on your `package.json` or other config files

### Context Packs

Select which context packs are active for this project. These are embedded in every agent that belongs to this project unless overridden at team level.

### Sync Targets

Choose which AI tools this project's agents should be synced to:

| Target | Description |
|---|---|
| **Claude Code** | Generates agent files for Anthropic Claude Code |
| **Codex** | Generates agent files for OpenAI Codex |
| **GitHub Copilot** | Generates `.github/agents/` markdown files for GitHub Copilot |

### Gitignore

Toggle this option to add the `.agent-teams/` configuration directory to your project's `.gitignore`. Useful when you want to keep your agent configuration local to your machine.

---

## Saving the Profile

Click **Save** at the bottom of the editor. The profile is written to `.agent-teams/project.profile.yml`. Changes are picked up automatically on the next sync.

---

## Import / Export

The **Import / Export** page in the dashboard manages the global agent catalog stored in VS Code global storage. This is separate from the project profile — it lets you back up and share your entire agent and team catalog across workspaces.

<img width="1644" alt="imagen" src="/img/docs/profiles-editor.png" style={{ height: "auto" }} />

| Action | Description |
|---|---|
| **Export** | Saves the full catalog to a JSON file you choose |
| **Import** | Merges entries from a JSON file into the existing catalog (non-destructive) |
| **Reset** | Permanently deletes the entire catalog — use with caution |

---

## Reference: Profile YAML Format

The dashboard writes and reads this format automatically. You can also open `.agent-teams/project.profile.yml` directly in VS Code.

```yaml
id: my-project
name: My Project

technologies:
  - react
  - typescript
  - nodejs

paths:
  src: src/
  tests: tests/
  components: src/components/

commands:
  build: pnpm build
  test: pnpm test
  lint: pnpm lint

context_packs:
  - project-conventions

overrides:
  vitest-worker:
    context_packs:
      - testing-setup
```

### Fields

| Field | Required | Description |
|---|---|---|
| `id` | ✅ | Project identifier (kebab-case) |
| `name` | ✅ | Project display name |
| `technologies` | — | Technology flags for template conditionals (`{{#if technology:react}}`) |
| `paths` | — | Named path mappings for template variables (`{{path:src}}`) |
| `commands` | — | Named command mappings for template variables (`{{command:build}}`) |
| `context_packs` | — | Default context packs applied to all agents in this project |
| `overrides` | — | Per-agent field overrides applied at project level (lower priority than team overrides) |

---


