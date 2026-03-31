---
description: Three bundled AI agents guide you through the complete project setup — configuration, agent creation, and ongoing advisory — each surfaced in the dashboard at the right moment.
---

# AI Setup Flow

**Status:** Coming soon

Agent Teams includes three bundled AI agents that cover the entire project lifecycle, from initial setup to ongoing team evolution. The dashboard surfaces each one contextually — only when it is relevant to your current state.

> **Invocation syntax** — the bundled agents work in both GitHub Copilot Chat and Claude Code, but the syntax differs by platform:
>
> | Platform | Syntax | Example |
> |---|---|---|
> | **GitHub Copilot Chat** | `@agent-name` (chat participant) | `@project-configurator` |
> | **Claude Code** | `/agent-name` (slash command) | `/project-configurator` |
>
> The rest of this document shows both forms where invocation is mentioned. Use whichever matches your active AI tool.

---

## The Three-Agent Flow

```
# GitHub Copilot Chat
@project-configurator  →  @agent-designer  →  @consultant

# Claude Code
/project-configurator  →  /agent-designer  →  /consultant

      (configure)           (create agents)    (advise & evolve)
```

Each agent is independent and can be used on its own, but together they form a progressive onboarding path that takes you from zero to a fully configured, AI-ready workspace.

The flow is intentionally incremental: start with a minimal set of focused agents, then let `@consultant` identify gaps and guide you through adding more. This avoids front-loading a complex team structure that consumes unnecessary tokens before you know what you actually need.

---

## Step 1 — Project Configurator

**When:** no `project.profile.yml` exists yet
**Access:** dashboard home → **"Auto-configure with AI"** button, or invoke directly — `@project-configurator` (Copilot) / `/project-configurator` (Claude Code)

<!-- IMAGE: Screenshot — Dashboard home page in its initial state (no profile configured), showing the "Configure Your Project" card with the "Auto-configure with AI" primary button and the "Configure manually" secondary option. Suggested filename: ai-setup-step1-configurator-card.png -->

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

## Step 2 — Agent Designer

**When:** profile configured, you want to create or edit an agent
**Access:** Team Agents card → **"Design with AI"** button (primary), or `@agent-designer` (Copilot) / `/agent-designer` (Claude Code)

<!-- IMAGE: Screenshot — Team Agents card header on the dashboard home page showing the primary "Design with AI" button and the secondary "Create manually" button side by side. Suggested filename: ai-setup-step2-design-with-ai-button.png -->

The "Design with AI" button is the primary action in the Team Agents card header and in the empty-state when no agents exist yet. The previous **"Create manually"** flow remains available as the secondary option.

`@agent-designer` reads your workspace context — existing agents, installed skills, and the project profile generated in step 1 — and produces a focused, validated AgentSpec. Start with one or two agents covering your core workflows; you can always add more later guided by `@consultant`.

See [Agent Designer](agent-designer.md#using-the-agent-designer) for the full workflow.

---

## Step 3 — Consultant

**When:** profile + at least one agent exist
**Access:** dashboard home → **"Consult your team"** card, or `@consultant` (Copilot) / `/consultant` (Claude Code)

<!-- IMAGE: Screenshot — Dashboard home page in its fully configured state, showing the "Consult your team" card with the Consultant CTA, alongside the active team's agents in the Team Agents section. Suggested filename: ai-setup-step4-consultant-card.png -->

`@consultant` is a read-only advisory agent. It analyses the current state of your team against the project profile and provides structured recommendations. It **never modifies any file** — execution always defers to `@agent-designer`.

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

This advisory loop is how the team grows incrementally: add agents one at a time as `@consultant` identifies real gaps, rather than trying to design the full team upfront.

---

## Dashboard Surfacing

<!-- IMAGE: Screenshot — Dashboard home page showing the initial state (no profile) with the "Configure Your Project" card as the primary CTA. Alternatively, a composite of two states (no profile vs. fully configured) to illustrate the progression. Suggested filename: ai-setup-dashboard-states.png -->

The dashboard home page shows the right agent CTA at each stage:

| State | Card shown | Primary action |
|---|---|---|
| No profile | Configure Your Project | **Auto-configure with AI** → `@project-configurator` (Copilot) / `/project-configurator` (Claude Code) |
| No profile | Configure Your Project | Configure manually → Profile Editor |
| Profile ✓ | Team Agents header & empty state | **Design with AI** → `@agent-designer` (Copilot) / `/agent-designer` (Claude Code) |
| Profile ✓ | Team Agents header & empty state | Create manually → Agent Wizard |
| Profile ✓, agents > 0 | Consultant | **Consult your team** → `@consultant` (Copilot) / `/consultant` (Claude Code) |

---

## Using All Three Together

A typical first-time setup with a new repository:

1. **Install the extension** → dashboard opens with the "Configure Your Project" card
2. Click **"Auto-configure with AI"** → `@project-configurator` (Copilot) or `/project-configurator` (Claude Code) scans your repo, proposes the profile and context packs → confirm → files written
3. Dashboard detects the new profile → Team Agents card shows **"Design with AI"** → click it → `@agent-designer` / `/agent-designer` reads your profile and existing agents, produces a focused AgentSpec → save → repeat for each initial agent you need
4. Sync once → agents deployed to your target platforms
5. As the project grows, open **"Consult your team"** → `@consultant` / `/consultant` identifies coverage gaps → follow its "Next steps" pointers to open `@agent-designer` / `/agent-designer` for each new agent

All three agents work on any project type or language — the entire flow is technology-agnostic.
