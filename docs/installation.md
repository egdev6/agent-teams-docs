# Installation Guide

**Status:** ✅ Available

---

## Requirements

| Requirement | Minimum version |
|---|---|
| VS Code | 1.85.0 |
| Node.js | 18.0.0 |

---

## Install from VSIX

1. Go to the [Releases](https://github.com/egdev6/agent-teams-docs/releases) page.
2. Download the latest `.vsix` file (e.g. `agent-teams-1.0.0.vsix`).
3. Open **VS Code**.
4. Open the **Extensions** panel:
   - Windows / Linux: `Ctrl+Shift+X`
   - macOS: `Cmd+Shift+X`
5. Click the **`···`** menu at the top-right of the panel.
6. Select **Install from VSIX…**
7. Navigate to the downloaded file and select it.
8. Click **Reload** when prompted.

<img width="782" height="345" alt="imagen" src="/img/docs/installation-vsix.png" />

---

## First Launch

After installation:

1. Open Command Palette:
   - Windows / Linux: `Ctrl+Shift+P`
   - macOS: `Cmd+Shift+P`
2. Type and run **`Agent Teams: Open Dashboard`**.
3. The Agent Teams panel opens on the right side of the editor.

<img width="186" height="57" alt="imagen" src="/img/docs/installation-open-dashboard.png" />

---

## Project Setup

To use Agent Teams in a project, initialize a profile first:

1. Open Command Palette → **`Agent Teams: Init Profile`**.
2. Follow the interactive wizard:
   - Select the technologies used in the project (e.g. React, TypeScript, Node.js).
   - Define named path mappings (e.g. `src`, `tests`, `components`).
   - Define named commands (e.g. `build`, `test`, `lint`).
3. A `.agent-teams/project.profile.yml` file is created at the workspace root.

<img width="898" height="2100" alt="imagen" src="/img/docs/installation-init-profile.png" />

---

## Troubleshooting

### The panel doesn't open

- Ensure VS Code is version ≥ 1.85.0 (`Help → About`).
- Try reloading: Command Palette → `Developer: Reload Window`.
- Verify the extension is enabled in the Extensions panel (search "Agent Teams").

### Commands don't appear in Command Palette

- Check the extension is enabled and not in an error state in the Extensions panel.
- Look for activation errors: `View → Output` → select **Agent Teams** in the dropdown.

### Sync errors after creating a team

- Make sure a `project.profile.yml` exists at the workspace root (run `initProfile` first).
- Verify `.agent-teams/teams/` contains valid YAML files (run `agent-teams agents:validate`).

### Extension was installed but agents aren't loading

- Open Command Palette → `Agent Teams: Reload Agents`.
- If the issue persists, close and reopen the dashboard panel.

---

