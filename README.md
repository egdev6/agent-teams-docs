<div align="center">
  
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

</div>

<!-- IMAGE: Hero banner — Full-width screenshot or composed graphic showing the Agent Teams dashboard open in VS Code with an active team, agents listed by role, and the Sync Status card visible. Should convey the full product at a glance (1202×526px). Suggested filename: agent-teams-hero.png -->

# Agent Teams

**Status:** 🧪 Beta | **Released:** Marzo 2026 | [📖 Documentation site](https://agent-teams-docs.netlify.app)

🇬🇧 English | [🇪🇸 Español](README.es.md)

Complete system for creating, managing, and orchestrating AI agents with GitHub Copilot, Claude code or Codex inside VS Code. Build reusable agent kits, configure project profiles, and run a 12-page embedded dashboard — all without leaving your editor.

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
| **Chat Participants** | Use `@router` and a direct `@<agentId>` in Copilot Chat | 🔴 High |
| **Profiles** | Open Profile Editor, use auto-detect, fill all sections, save | 🟡 Medium |
| **Skills Browser** | Open the skills browser, browse categories, install a community skill | 🟡 Medium |
| **Context Packs** | Toggle packs, adjust priorities, create a new pack, import markdown | 🟡 Medium |

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

<!-- IMAGE: GIF or short video — Screen recording of the core workflow: opening the dashboard → creating an agent with the wizard → assigning skills → syncing to targets → using @router in Copilot Chat. Approx. 30–60 seconds. Suggested filename: agent-teams-demo.gif -->

## 📚 Documentation

| Guide | Description | Status |
|---|---|---|
| [Installation](docs/installation.md) | Requirements, VSIX install, troubleshooting | ✅ |
| [Dashboard](docs/dashboard.md) | Panel overview, navigation, first-time setup workflow | ✅ |
| [Agents](docs/agents.md) | Create agents with the 6-step wizard, edit, manage, sync | ✅ |
| [Teams](docs/teams.md) | Create and configure teams, set active team, sync | ✅ |
| [Profile Editor](docs/profiles.md) | Project profile, auto-detect technologies, import/export | ✅ |
| [Skills Browser](docs/skills-browser.md) | Browse and install skills, community registry | ✅ |
| [Context Packs](docs/context-packs.md) | Manage context packs, priorities, import markdown | ✅ |
| [Agent Architecture](docs/agent-architecture.md) | Ideal multi-agent pipeline: prompt → router → orchestrator → worker | ✅ |

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


[stars-shield]: https://img.shields.io/github/stars/egdev6/agent-teams-docs.svg?style=for-the-badge&cacheBust=1
[stars-url]: https://github.com/egdev6/agent-teams-docs/stargazers
[issues-shield]: https://img.shields.io/github/issues/egdev6/agent-teams-docs.svg?style=for-the-badge
[issues-url]: https://github.com/egdev6/agent-teams-docs/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/egdev6
ds.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/egdev6
elds.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/egdev6
