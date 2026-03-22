---
description: Project profiles define the technology context, path mappings, commands, and base agent overrides for a workspace. Configure your project once, and all agents inherit the right defaults automatically.
---

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

The editor groups its settings into seven collapsible accordion sections. Click any section header to expand or collapse it — each header shows a live summary of the current values so you can scan the whole profile at a glance without opening every panel.

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

Use the **Preview** button to simulate the budget algorithm before syncing. The preview shows:

- A progress bar with characters used vs the configured `agents_md_budget` (default 8 000 chars)
- **Inlined** packs (green) — essential packs always inlined; standard packs inlined until the budget is exhausted
- **Referenced** packs (amber) — standard packs that overflow the budget, plus all reference packs; listed in the root context file as headings without full content
- A separate **GitHub Copilot** note — Copilot has no budget limit and copies all selected packs as individual files under `.github/context/`

The preview refreshes automatically whenever you check or uncheck a pack while the panel is open.

### Sync Targets

Choose which AI tools this project's agents should be synced to. Each target generates its output in the expected location for that tool:

| Target | Output | Description |
|---|---|---|
| **Claude Code** | `.claude/agents/` + `AGENTS.md` | Per-agent files and a root context file for Claude Code |
| **Codex** | `AGENTS.md` | Root context file for OpenAI Codex |
| **Gemini CLI** | `GEMINI.md` | Root context file for Gemini CLI. Context packs are inlined by priority (essential always, standard up to budget, reference as links) |
| **OpenAI Agents SDK** | `AGENTS.md` | Root context file for OpenAI Agents SDK. Same inlining behaviour as Gemini |
| **GitHub Copilot** | `.github/agents/` | Per-agent markdown files and a Copilot instructions file |

Each target has an optional **Add to .gitignore** toggle that appears when the target is enabled. Use it to exclude that target's output from version control — useful when you want generated files to stay local.

### Gitignore

Toggle this option to add the `.agent-teams/` configuration directory to your project's `.gitignore`. Useful when you want to keep your agent configuration local to your machine.

---

## Saving the Profile

Click **Save** at the bottom of the editor. The profile is written to `.agent-teams/project.profile.yml`. Changes are picked up automatically on the next sync.

---

## Import / Export

The **Import / Export** page in the dashboard manages both the global agent catalog (stored in VS Code global storage) and the project profile. This is separate from saving the profile — it lets you back up and share configuration across workspaces.

<img width="1644" alt="imagen" src="/img/docs/profiles-editor.png" style={{ height: "auto" }} />

### Catalog (JSON)

| Action | Description |
|---|---|
| **Export** | Saves the full catalog to a JSON file you choose |
| **Import** | Merges entries from a JSON file into the existing catalog (non-destructive) |
| **Reset** | Permanently deletes the entire catalog — use with caution |

### Profile (ZIP)

| Action | Description |
|---|---|
| **Export Profile as ZIP** | Packages the entire `.agent-teams/` directory — agents, teams, context packs, skills, and profile config — into a portable ZIP file |
| **Import Profile from ZIP** | Restores a previously exported ZIP into the current workspace. Files that already exist prompt for confirmation before being overwritten |

---

## Reference: Profile YAML Format

The dashboard writes and reads this format automatically. You can also open `.agent-teams/project.profile.yml` directly in VS Code.

```yaml
project:
  id: my-project
  name: My Project
  version: "1.0.0"

technologies:
  typescript: true
  react: true

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

sync_targets:
  - claude_code
  - gemini

gitignore_targets:
  - gemini

overrides:
  vitest-worker:
    context_packs:
      - testing-setup
```

### Fields

| Field | Required | Description |
|---|---|---|
| `project.id` | ✅ | Project identifier (kebab-case) |
| `project.name` | ✅ | Project display name |
| `project.version` | ✅ | Version string |
| `technologies` | — | Technology flags for template conditionals (`{{#if technology:react}}`) |
| `paths` | — | Named path mappings for template variables (`{{path:src}}`) |
| `commands` | — | Named command mappings for template variables (`{{command:build}}`) |
| `context_packs` | — | Default context packs applied to all agents in this project |
| `sync_targets` | — | Platforms to sync to. Valid values: `claude_code`, `codex`, `gemini`, `openai`, `github_copilot`. Defaults to `claude_code` and `github_copilot` if omitted |
| `gitignore_targets` | — | Subset of `sync_targets` whose output paths are added to `.gitignore` |
| `overrides` | — | Per-agent field overrides applied at project level (lower priority than team overrides) |

---


