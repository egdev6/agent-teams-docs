# Profile Editor

**Status:** 🧪 Beta | [← Back to Index](../README.md)

A project profile (`.agent-teams/project.profile.yml`) defines the technology context, path mappings, commands, and base agent overrides for a workspace. It feeds into the composition engine when resolving kit placeholders and applying project-level defaults.

---

## Initializing a Profile

Command Palette → **`Agent Teams: Init Profile`**

The interactive wizard asks for:

- **Technologies** in use (e.g. React, TypeScript, Node.js) — used in `{{#if technology:*}}` conditionals.
- **Path mappings** (e.g. `src → src/`, `tests → tests/`) — available as `{{path:src}}` in templates.
- **Commands** (e.g. `build → pnpm build`) — available as `{{command:build}}` in templates.

A `project.profile.yml` is created at `.agent-teams/project.profile.yml`.

<img width="898" height="2100" alt="imagen" src="https://github.com/user-attachments/assets/afd420cb-4235-4ea4-aa13-ff7922de95c8" />

---

## Profile YAML Format

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

## Editing a Profile

### Using the Dashboard

1. Dashboard → **Profile Editor**.
2. Edit technologies (checkboxes), paths (key-value list), and commands (key-value list).
3. Save — writes the updated YAML to disk.

### Editing the YAML directly

Open `.agent-teams/project.profile.yml` in VS Code. The file is validated against the JSON schema on every sync — errors are reported in the output channel.

Changes to the profile are picked up automatically on the next sync or `Reload Agents`.

---

## Import / Export

The **Import / Export** page in the dashboard manages the global agent catalog stored in VS Code global storage:

| Action | Description |
|---|---|
| **Capture Workspace** | Snapshots the current workspace state (agents + teams + skills) into the catalog |
| **Export** | Saves the full catalog to a JSON file you choose |
| **Import (additive)** | Merges entries from a JSON file into the existing catalog |
| **Import (replace)** | Replaces the entire catalog with the imported data |
| **Reset (delete)** | Delete the entire catalog in IDE |

<img width="1644" height="749" alt="imagen" src="https://github.com/user-attachments/assets/9c032e6a-bfe3-4db2-a891-921937b76fd1" />

Command Palette equivalents:

```
Agent Teams: Capture Workspace Catalog
Agent Teams: Export Catalog
Agent Teams: Import Catalog
```

---

[← Back to Index](../README.md)
