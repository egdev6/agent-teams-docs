---
description: Four bundled AI agents guide you through the complete project setup — configuration, team design, agent creation, and ongoing advisory — each surfaced in the dashboard at the right moment.
---

# AI Setup Flow

**Status:** Coming soon

Agent Teams includes four bundled AI agents that cover the entire project lifecycle, from initial setup to ongoing team evolution. The dashboard surfaces each one contextually — only when it is relevant to your current state.

---

## The Four-Agent Flow

```
@project-configurator  →  @team-builder  →  @agent-designer  →  @consultant
   (configure)              (design team)      (create agents)     (advise & evolve)
```

Each agent is independent and can be used on its own, but together they form a progressive onboarding path that takes you from zero to a fully configured, AI-ready workspace.

---

## Step 1 — Project Configurator

**When:** no `project.profile.yml` exists yet  
**Access:** dashboard home → **"Auto-configure with AI"** button, or invoke directly with `@project-configurator`

<!-- TODO: screenshot — tarjeta "Configure Your Project" en el dashboard home cuando no existe perfil, mostrando el botón "Auto-configure with AI". Nombre sugerido: ai-setup-step1-configurator-card.png -->

`@project-configurator` performs an exhaustive, technology-agnostic analysis of your repository to auto-generate a complete `project.profile.yml` and a set of atomized context packs with real, codebase-derived content.

### What it detects

The agent does not assume any technology. It reads the directory tree inductively and looks for **any** build manifest or project descriptor it finds — including but not limited to:

| Ecosystem | Detected files |
|---|---|
| JavaScript / TypeScript | `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `nx.json` |
| Rust | `Cargo.toml`, `Cargo.lock` |
| .NET / C# | `*.csproj`, `*.sln`, `*.fsproj` |
| Android / Kotlin | `build.gradle`, `build.gradle.kts`, `settings.gradle`, `app.json` |
| Go | `go.mod`, `go.sum` |
| Python | `pyproject.toml`, `requirements.txt`, `Pipfile`, `setup.py` |
| Swift / iOS | `Package.swift`, `Podfile`, `*.xcodeproj`, `*.xcworkspace` |
| Flutter / Dart | `pubspec.yaml` |
| Java / Kotlin (JVM) | `pom.xml`, `build.gradle`, `build.sbt` |
| Elixir | `mix.exs` |
| C / C++ | `CMakeLists.txt`, `Makefile` |
| Infra | `Dockerfile`, `docker-compose.yml`, `*.tf`, `Pulumi.yaml`, `cdk.json` |
| CI/CD | `.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile` |

For **monorepos** with multiple sub-projects using different stacks, each workspace is analysed independently before the global profile is synthesised.

### What it generates

After you confirm the proposal, the agent writes:

1. **`.agent-teams/context-packs/{name}.md`** — one pack per detected functional domain (e.g. `android-app`, `backend-api`, `infra`, `conventions`), plus a universal `architecture` pack. Every pack contains **real content** derived from the analysis: module responsibilities, data flow descriptions, architectural patterns observed, and code conventions — not boilerplate.

2. **`.agent-teams/project.profile.yml`** — all fields populated from evidence in the repository:
   - `technologies` — only techs with direct file evidence
   - `commands` — verbatim invocations from manifests (`./gradlew assembleDebug`, `cargo test --workspace`, etc.)
   - `paths` — mapped from the actual directory structure
   - `sync_targets` — inferred from which target directories already exist (`.github/agents/` → `github_copilot`, `.claude/agents/` → `claude_code`, etc.)

> The agent always **waits for your explicit confirmation** before writing any file. If a `project.profile.yml` already exists, it shows a diff and asks before overwriting.

---

## Step 2 — Team Builder

**When:** profile configured, no teams exist yet  
**Access:** dashboard home → **"Design your first team"** card, or `@team-builder`

<!-- TODO: screenshot — tarjeta "Design your first team" en el dashboard home cuando el perfil ya existe pero aún no hay ningún equipo. Nombre sugerido: ai-setup-step2-team-builder-card.png -->

Once a profile exists, `@team-builder` uses its `technologies` and context packs as direct input — skipping its own stack detection phase. It reads the available packs from `.agent-teams/context-packs/` and maps them to the right agents by domain when proposing the team composition.

See [Agent Designer & Team Builder](agent-designer.md#team-builder) for the full workflow.

---

## Step 3 — Agent Designer

**When:** active team exists, you want to add or edit an agent  
**Access:** Team Agents card → **"Design with AI"** button (primary), or `@agent-designer`

<!-- TODO: screenshot — cabecera de la tarjeta Team Agents mostrando el botón primario "Design with AI" junto al botón secundario "Create manually". Nombre sugerido: ai-setup-step3-design-with-ai-button.png -->

The "Design with AI" button is the primary action in the Team Agents card header and in the empty-state when no agents exist yet. The previous **"Create manually"** flow remains available as the secondary option.

See [Agent Designer & Team Builder](agent-designer.md#agent-designer) for the full workflow.

---

## Step 4 — Consultant

**When:** profile + active team + at least one agent all exist  
**Access:** dashboard home → **"Consult your team"** card, or `@consultant`

<!-- TODO: screenshot — tarjeta "Consult your team" en el dashboard home una vez que el perfil, equipo y agentes existen. Nombre sugerido: ai-setup-step4-consultant-card.png -->

`@consultant` is a read-only advisory agent. It analyses the current state of your team against the project profile and provides structured recommendations. It **never modifies any file** — execution always defers to `@agent-designer` or `@team-builder`.

### What it analyses

- **Coverage gaps** — functional domains in the project profile with no dedicated agent
- **Responsibility overlaps** — pairs of agents sharing the same primary responsibility
- **Topology issues** — broken handoff references, missing escalation targets, circular delegation chains
- **Context pack assignments** — packs in `.agent-teams/context-packs/` not referenced by any agent

### What it recommends

- **New agent proposals** — concrete `id`, `role`, `domain`, `intents`, and `scope.topics` for each gap, grounded in the actual tech stack
- **MCP integrations** — external services where an MCP server would let an agent act rather than just advise (e.g. `@modelcontextprotocol/server-github` for a GitHub-facing agent)
- **Skill assignments** — skills from `skills.registry.yml` that should be added to specific existing agents, with `when` conditions
- **Next steps** — every response closes with explicit pointers: "To add `data-engineer` → open `@agent-designer`"

---

## Dashboard Surfacing

<!-- TODO: screenshot — visión general del dashboard home mostrando alguno de los estados de la tabla de abajo (idealmente el estado inicial sin perfil). Si se tienen capturas de varios estados, incluir la más representativa. Nombre sugerido: ai-setup-dashboard-states.png -->

The dashboard home page shows the right agent CTA at each stage:

| State | Card shown | Primary action |
|---|---|---|
| No profile | Configure Your Project | **Auto-configure with AI** → `@project-configurator` |
| No profile | Configure Your Project | Configure manually → Profile Editor |
| Profile ✓, no teams | Design your first team | Design your team → `@team-builder` |
| Profile ✓, active team | Team Agents header & empty state | **Design with AI** → `@agent-designer` |
| Profile ✓, active team | Team Agents header & empty state | Create manually → Agent Wizard |
| Profile ✓, team ✓, agents > 0 | Consultant | **Consult your team** → `@consultant` |

---

## Using All Four Together

A typical first-time setup with a new repository:

1. **Install the extension** → dashboard opens with the "Configure Your Project" card
2. Click **"Auto-configure with AI"** → `@project-configurator` scans your repo, proposes the profile and context packs → confirm → files written
3. Dashboard detects the new profile → shows **"Design your first team"** → click it → `@team-builder` reads your profile and context packs, proposes agent composition → confirm → fans out to `@agent-designer` workers, generates all specs, writes team binding
4. Sync once → agents deployed to your target platforms
5. As the project grows, open **"Consult your team"** → `@consultant` identifies new coverage gaps → follow its "Next steps" pointers to open `@agent-designer` for each new agent

All four agents work on any project type or language — the entire flow is technology-agnostic.
