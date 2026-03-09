# Agent Teams

**Version:** 1.0.0 | **Status:** 🧪 Beta | **Released:** March 2026

🇬🇧 English | [🇪🇸 Español](README.es.md)

Complete system for creating, managing, and orchestrating AI agents with GitHub Copilot inside VS Code. Build reusable agent kits, configure project profiles, and run a 12-page embedded dashboard — all without leaving your editor.

---

## 🧪 Beta Testing

We are in active beta. Your feedback shapes the v1.0 stable release.

### How to Install the Beta (.vsix)

1. Download the latest `.vsix` file from the [Releases](https://github.com/egdev6/agent-teams-docs/releases) page.
2. Open **VS Code**.
3. Go to the **Extensions** panel (`Ctrl+Shift+X` / `Cmd+Shift+X`).
4. Click the **`···`** menu (top-right of the panel) → **Install from VSIX…**
5. Select the downloaded `.vsix` file.
6. Reload VS Code when prompted.

> **Requires:** VS Code ≥ 1.85.0 and Node.js ≥ 18.0.0

### What to Test

Focused areas we want feedback on:

| Area | What to try | Priority |
|---|---|---|
| **Dashboard** | Open the panel, navigate all pages, check the stats card | 🔴 High |
| **Agents** | Use the wizard to create an agent, edit it, reload | 🔴 High |
| **Teams** | Create a team, assign agents, run sync to `.github/agents/` | 🔴 High |
| **Chat Participants** | Use `@agent-teams.router` and a direct `@agent-teams.<agentId>` in Copilot Chat | 🔴 High |
| **Profiles** | Run `initProfile`, edit the generated YAML, check validation | 🟡 Medium |
| **Skills Browser** | Open the skills browser, browse categories | 🟡 Medium |
| **Dry-run sync** | Run `team:sync --dry-run` from CLI and verify the diff output | 🟡 Medium |

### How to Report a Bug

1. Go to [Issues](https://github.com/egdev6/agent-teams-docs/issues).
2. Click **New issue**.
3. Include:
   - VS Code version and OS
   - Steps to reproduce
   - Expected behaviour vs. what actually happened
   - Screenshot or error message if available

---

## 📦 Quick Installation

| Requirement | Minimum version |
|---|---|
| VS Code | 1.85.0 |
| Node.js | 18.0.0 |

1. Download the `.vsix` from [Releases](https://github.com/egdev6/agent-teams-docs/releases).
2. In VS Code: **Extensions** → **`···`** → **Install from VSIX…** → select the file.
3. Reload VS Code.
4. Open Command Palette (`Ctrl+Shift+P`) → run **`Agent Teams: Open Dashboard`**.

See the [Installation Guide](docs/installation.md) for full details and troubleshooting.

---

## 📚 Documentation

| Guide | Description | Status |
|---|---|---|
| [Installation](docs/installation.md) | Requirements, VSIX install, troubleshooting | ✅ |
| [Dashboard](docs/dashboard.md) | Panel overview, navigation, and quick actions | ✅ |
| [Agents](docs/agents.md) | Create, edit, and manage agents; YAML spec format | ✅ |
| [Teams](docs/teams.md) | Create and configure teams; sync to `.github/agents/` | ✅ |
| [Profile Editor](docs/profiles.md) | Project profile fields, editing, import/export | ✅ |
| [Skills Browser](docs/skills-browser.md) | Browse skill catalog, categories, apply to agents | ✅ |

---

## 🗺️ Project Status

**Current version:** 1.0.0 (Beta) — March 2026

### What's working

- Embedded 12-page React dashboard (SPA inside VS Code webview)
- Kits & Teams three-layer architecture (Core → Kits → Profile → Team)
- Agent Composer with 4 merge strategies + dry-run mode
- Dynamic Context Pack template engine with variables, conditionals, and loops
- Skills Registry with 9 categories and role-based recommendations
- Dynamic chat participants — one per loaded agent — via Copilot Chat
- Full CLI (`agent-teams` binary) with profile, team, agent, and skills commands

### Known limitations (Beta)

- No automated test suite yet
- Kit Marketplace not yet available (planned)
- Extension icon pending (placeholder in package metadata)
- Publisher metadata is a placeholder (`your-publisher-name`)

---

## 👥 Contributors

Thanks to everyone who has contributed to this project!

<!-- CONTRIBUTORS:START -->
<!-- CONTRIBUTORS:END -->

---

## 📄 License & Support

**License:** Private © 2026

- **Issues:** [github.com/egdev6/agent-teams-docs/issues](https://github.com/egdev6/agent-teams-docs/issues)
- **Source code:** [github.com/egdev6/agent-teams](https://github.com/egdev6/agent-teams)
