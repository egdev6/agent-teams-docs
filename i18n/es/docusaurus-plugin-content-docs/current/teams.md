# Teams

**Estado:** 🧪 Beta

Un equipo es una selección curada de agentes — provenientes de kits y/o specs individuales — configurados para un contexto de proyecto específico. Los equipos se almacenan como archivos YAML bajo `.agent-teams/teams/`.

---

## Crear un Equipo

Dashboard → **Team Manager** → **Create Team**, o usa la tarjeta de **Acciones Rápidas** en la página de inicio.

<img width="1160" alt="imagen" src="/img/docs/teams-overview.png" style={{ height: "auto" }} />

El wizard tiene tres secciones:

1. **Básicos** — introduce el nombre y la descripción del equipo
2. **Miembros** — selecciona los agentes a incluir en este equipo de tu lista disponible. Si no existen agentes aún, se muestra un enlace directo a **Create Agent**
3. **Resumen** — una vista previa en tiempo real de la configuración del equipo aparece en el panel lateral derecho

Haz clic en **Create** para guardar el equipo. El archivo `.agent-teams/teams/<id>.yml` se crea automáticamente.

---

## Gestionar Equipos

### Ver Todos los Equipos

Dashboard → **Team Manager** lista todos los equipos con su nombre, descripción, número de agentes y estado activo. Haz clic en cualquier tarjeta de equipo para abrirlo.

### Editar un Equipo

Dashboard → **Team Manager** → selecciona equipo → **Edit**

La página de edición ofrece cuatro acciones:

| Acción | Descripción |
|---|---|
| **Save** | Escribe los cambios en el archivo YAML del equipo |
| **Cancel** | Descarta los cambios no guardados |
| **Delete** | Elimina permanentemente este equipo |
| **Set as Active** | Marca este equipo como equipo activo para las operaciones de sync |

<img width="1320" alt="imagen" src="/img/docs/teams-creation.png" style={{ height: "auto" }} />

### Establecer el Equipo Activo

Solo un equipo puede estar activo a la vez. El equipo activo determina qué agentes se sincronizan a `.github/agents/` y qué agentes se registran como participantes de Copilot Chat.

Para cambiar el equipo activo: Dashboard → **Team Manager** → selecciona equipo → **Edit** → **Set as Active**

La tarjeta de estadísticas en la página de inicio del dashboard siempre muestra qué equipo está activo en ese momento.

---

## Sincronizar un Equipo

El sync resuelve la composición completa (valores por defecto del kit + perfil de proyecto + overrides del equipo) y escribe los archivos markdown finales de agentes en `.github/agents/`.

1. Página de inicio del dashboard → la tarjeta **Sync Status** muestra un desglose de cambios pendientes:
   - `create` — se escribirá un nuevo archivo de agente
   - `update` — el archivo de agente existente será actualizado
   - `skip` — no se detectaron cambios, el archivo se deja como está
2. Haz clic en **Sync** para aplicar todos los cambios

<img width="1327" alt="imagen" src="/img/docs/teams-sync.png" style={{ height: "auto" }} />

El dashboard detecta cambios en los archivos YAML automáticamente mediante observación de archivos — la tarjeta de sync status se actualiza cada vez que guardas un agente o equipo.

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


