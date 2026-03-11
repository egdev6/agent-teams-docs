# Guía de Instalación

**Estado:** ✅ Disponible

---

## Requisitos

| Requisito | Versión mínima |
|---|---|
| VS Code | 1.85.0 |
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

<img width="782" height="345" alt="imagen" src="https://github.com/user-attachments/assets/0baf6a8d-8259-4a63-9a59-6354535b3a9a" />

---

## Primer inicio

Tras la instalación:

1. Abre la Paleta de Comandos:
   - Windows / Linux: `Ctrl+Shift+P`
   - macOS: `Cmd+Shift+P`
2. Escribe y ejecuta **`Agent Teams: Open Dashboard`**.
3. El panel de Agent Teams se abre en el lado derecho del editor.

<img width="186" height="57" alt="imagen" src="https://github.com/user-attachments/assets/48c955f3-2f35-4c97-9830-1a4704b81422" />

---

## Configuración del proyecto

Para usar Agent Teams en un proyecto, inicializa primero un perfil:

1. Paleta de Comandos → **`Agent Teams: Init Profile`**.
2. Sigue el wizard interactivo:
   - Selecciona las tecnologías usadas en el proyecto (p. ej. React, TypeScript, Node.js).
   - Define mapeos de rutas con nombre (p. ej. `src`, `tests`, `components`).
   - Define comandos con nombre (p. ej. `build`, `test`, `lint`).
3. Se crea el archivo `.agent-teams/project.profile.yml` en la raíz del workspace.

<img width="898" height="2100" alt="imagen" src="https://github.com/user-attachments/assets/e867283a-42bc-4c56-8f5b-790866827368" />

---

## Resolución de problemas

### El panel no se abre

- Verifica que VS Code sea versión ≥ 1.85.0 (`Ayuda → Acerca de`).
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
