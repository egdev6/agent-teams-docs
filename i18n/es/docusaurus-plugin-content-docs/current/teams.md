# Teams

**Estado:** 🧪 Beta

Un equipo es una selección curada de agentes — provenientes de kits y/o specs individuales — configurados para un contexto de proyecto específico. Los equipos se almacenan como archivos YAML bajo `.agent-teams/teams/`.

---

## Crear un Equipo

Dashboard → **Team Manager** → **Create Team**, o usa la tarjeta de **Acciones Rápidas** en la página de inicio.

<!-- IMAGEN: Captura — Página Team Manager listando todos los equipos con su nombre, descripción, número de agentes y estado activo. Los botones Create Team y Design a new team with AI son visibles en el encabezado. Nombre sugerido: teams-overview.png -->

El wizard tiene tres secciones:

1. **Básicos** — introduce el nombre y la descripción del equipo
2. **Miembros** — selecciona los agentes a incluir en este equipo de tu lista disponible. Si no existen agentes aún, se muestra un enlace directo a **Create Agent**
3. **Resumen** — una vista previa en tiempo real de la configuración del equipo aparece en el panel lateral derecho

Haz clic en **Create** para guardar el equipo. El archivo `.agent-teams/teams/<id>.yml` se crea automáticamente.

---

## Gestionar Equipos

### Ver Todos los Equipos

Dashboard → **Team Manager** lista todos los equipos con su nombre, descripción, número de agentes y estado activo. Haz clic en cualquier tarjeta de equipo para abrirlo.

El encabezado de la página tiene dos botones: **Create Team** (abre el wizard) y **Design a new team with AI** (abre `@agent-designer` en Copilot Chat).

Los equipos cuya especificación de origen fue modificada después del último sync exitoso muestran una insignia **No sincronizado** en el Team Manager. Sincroniza el equipo para eliminar la insignia.

### Editar un Equipo

Dashboard → **Team Manager** → selecciona equipo → **Edit**

La página de edición ofrece cuatro acciones:

| Acción | Descripción |
|---|---|
| **Save** | Escribe los cambios en el archivo YAML del equipo |
| **Cancel** | Descarta los cambios no guardados |
| **Delete** | Elimina permanentemente este equipo |
| **Set as Active** | Marca este equipo como equipo activo para las operaciones de sync |

<!-- IMAGEN: Captura — Página de edición de equipo mostrando la sección Básicos (nombre y descripción), la sección Miembros con la lista de agentes seleccionables, y los botones de acción (Save, Cancel, Delete, Set as Active) al final. Nombre sugerido: teams-creation.png -->

### Establecer el Equipo Activo

Solo un equipo puede estar activo a la vez. El equipo activo determina qué agentes se sincronizan a `.github/agents/` y qué agentes se registran como participantes de Copilot Chat.

Para cambiar el equipo activo: Dashboard → **Team Manager** → selecciona equipo → **Edit** → **Set as Active**

La tarjeta de estadísticas en la página de inicio del dashboard siempre muestra qué equipo está activo en ese momento.

---

## Sincronizar un Equipo

El sync resuelve la composición completa (valores por defecto del kit + perfil de proyecto + overrides del equipo) y escribe los archivos de salida para cada destino de sync configurado.

1. Página de inicio del dashboard → la tarjeta **Sync Status** muestra un desglose de cambios pendientes:
   - `create` — se escribirá un nuevo archivo
   - `update` — el archivo existente será actualizado
   - `skip` — no se detectaron cambios, el archivo se deja como está
2. Haz clic en **Sync** para aplicar todos los cambios

<!-- IMAGEN: Captura — Tarjeta Sync Status en la página de inicio del dashboard mostrando el desglose de cambios pendientes con conteos de create/update/skip por archivo, y el botón Sync listo para aplicarlos. Nombre sugerido: teams-sync.png -->

El dashboard detecta cambios en los archivos de agentes y equipos automáticamente — la tarjeta de sync status se actualiza cada vez que guardas un archivo.

### Salida por destino

Cada destino de sync escribe su salida en una ubicación diferente:

| Destino | Salida |
|---|---|
| **Claude Code** | `.claude/agents/<id>.md` por agente + `AGENTS.md` en la raíz |
| **Codex** | `AGENTS.md` en la raíz del proyecto |
| **Gemini CLI** | `GEMINI.md` en la raíz del proyecto |
| **OpenAI Agents SDK** | `AGENTS.md` en la raíz del proyecto |
| **GitHub Copilot** | `.github/agents/<id>.agent.md` por agente |

Los destinos que generan un único archivo raíz (`AGENTS.md`, `GEMINI.md`) incluyen los context packs directamente en ese archivo por prioridad: los packs esenciales siempre se incluyen, los estándar hasta el presupuesto de caracteres configurado, y los de referencia se listan como enlaces al final.

### Vista previa de cambios antes de sincronizar (CLI)

Usa `--dry-run` para ver exactamente qué cambiaría sin escribir ningún archivo:

```bash
agent-teams team:sync --team mi-equipo --dry-run
```

La salida está codificada por colores y agrupada por destino:

```
  + .claude/agents/frontend-agent.md    [create]
  ~ .claude/agents/backend-agent.md     [update]
  - .claude/agents/legacy-agent.md      [delete]
```

Añade `--no-diff` para suprimir el detalle por archivo y mostrar solo el resumen.

### Sync de Servidores MCP

Si alguno de los agentes del equipo declara `mcpServers`, Agent Teams los fusiona en los archivos de configuración MCP del proyecto durante el sync:

- **Destino Copilot** → `.vscode/mcp.json` (clave `servers`)
- **Destino Claude Code** → `.mcp.json` en la raíz del proyecto (clave `mcpServers`)

Los servidores se fusionan por `id`. Las entradas existentes nunca se sobreescriben, preservando siempre los overrides a nivel de proyecto. Ver [Servidores MCP](./agents.md#servidores-mcp) en la referencia de Agentes.

---

## Estrategias de Merge

Cuando múltiples fuentes definen el mismo campo de agente (valor por defecto del kit, perfil de proyecto, override del equipo), el Merge Engine resuelve el conflicto usando una de cuatro estrategias:

| Estrategia | Comportamiento |
|---|---|
| `team-priority` (por defecto) | Los overrides del equipo tienen prioridad sobre perfil y kit |
| `profile-priority` | El perfil de proyecto tiene prioridad sobre kit y equipo |
| `kit-priority` | Los valores por defecto del kit tienen prioridad — los overrides se ignoran |
| `explicit-only` | Solo se usan los campos definidos explícitamente a nivel de equipo |

---

## Referencia: Formato YAML del Equipo

El dashboard escribe y lee este formato automáticamente. También puedes editar el archivo directamente en VS Code.

```yaml
id: frontend-team
name: Frontend Team
description: Equipo centrado en trabajo de frontend con React y TypeScript

kits:
  - id: testing-vitest
    enabled: true

agents:
  - id: vitest-worker
    enabled: true
  - id: test-orchestrator
    enabled: false

overrides:
  vitest-worker:
    skills:
      - code_analysis
      - testing
```

### Campos

| Campo | Requerido | Descripción |
|---|---|---|
| `id` | ✅ | Identificador único del equipo (kebab-case) |
| `name` | ✅ | Nombre de visualización |
| `description` | — | Propósito del equipo |
| `kits` | — | Lista de IDs de kits a incluir, cada uno con un flag `enabled` |
| `agents` | — | Overrides por agente con flag `enabled` |
| `overrides` | — | Overrides a nivel de campo aplicados a agentes específicos dentro del equipo |


