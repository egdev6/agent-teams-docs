# Guía de Instalación

**Estado:** ✅ Disponible

---

## Requisitos

| Requisito | Versión mínima |
|---|---|
| VS Code | 1.112.0 |
| Node.js | 18.0.0 |

---

## Instalar desde VSIX

1. Ve a la página de [Releases](https://github.com/egdev6/agent-teams-docs/releases).
2. Descarga el último archivo `.vsix` (p. ej. `agent-teams-1.0.0.vsix`).
3. Abre **VS Code**.
4. Abre el panel de **Extensions**:
   - Windows / Linux: `Ctrl+Shift+X`
   - macOS: `Cmd+Shift+X`
5. Haz clic en el menú **`···`** (arriba a la derecha del panel).
6. Selecciona **Install from VSIX…**
7. Navega hasta el archivo descargado y selecciónalo.
8. Haz clic en **Reload** cuando se te solicite.

<!-- IMAGEN: Captura — Panel de Extensions de VS Code con el menú ··· abierto y "Install from VSIX…" resaltado, y el selector de archivos apuntando al archivo .vsix descargado. Nombre sugerido: installation-vsix.png -->

---

## Primer inicio

Tras la instalación:

1. Abre la Paleta de Comandos:
   - Windows / Linux: `Ctrl+Shift+P`
   - macOS: `Cmd+Shift+P`
2. Escribe y ejecuta **`Agent Teams: Open Dashboard`**.
3. El panel de Agent Teams se abre en el lado derecho del editor.

<!-- IMAGEN: Captura — Paleta de Comandos de VS Code con "Agent Teams: Open Dashboard" escrito y seleccionado, mostrando el comando de la extensión. Nombre sugerido: installation-open-dashboard-es.png -->

---

## Configuración del proyecto

Para usar Agent Teams en un proyecto, inicializa primero un perfil:

1. Paleta de Comandos → **`Agent Teams: Init Profile`**.
2. Sigue el wizard interactivo:
   - Selecciona las tecnologías usadas en el proyecto (p. ej. React, TypeScript, Node.js).
   - Define mapeos de rutas con nombre (p. ej. `src`, `tests`, `components`).
   - Define comandos con nombre (p. ej. `build`, `test`, `lint`).
3. Se crea el archivo `.agent-teams/project.profile.yml` en la raíz del workspace.

<!-- IMAGEN: Captura — Wizard de inicialización de perfil de Agent Teams abierto en el panel de VS Code, mostrando el selector de tecnologías, los mapeos de rutas y los campos de comandos siendo rellenados para un nuevo proyecto. Nombre sugerido: installation-init-profile-es.png -->

---

## Resolución de problemas

### El panel no se abre

- Verifica que VS Code sea versión ≥ 1.112.0 (`Ayuda → Acerca de`).
- Prueba a recargar: Paleta de Comandos → `Developer: Reload Window`.
- Comprueba que la extensión está habilitada en el panel de Extensions (busca "Agent Teams").

### Los comandos no aparecen en la Paleta de Comandos

- Verifica que la extensión está habilitada y no tiene errores en el panel de Extensions.
- Busca errores de activación: `Vista → Salida` → selecciona **Agent Teams** en el desplegable.

### Errores de sync al crear un equipo

- Asegúrate de que existe un `project.profile.yml` en la raíz del workspace (ejecuta primero `initProfile`).
- Verifica que `.agent-teams/teams/` contiene archivos YAML válidos (ejecuta `agent-teams agents:validate`).

### La extensión está instalada pero los agentes no se cargan

- Paleta de Comandos → **`Agent Teams: Reload Agents`**.
- Si el problema persiste, cierra y vuelve a abrir el panel del dashboard.


