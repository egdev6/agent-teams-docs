# Teams

**Estado:** 🧪 Beta | [← Volver al índice](../README.es.md)

Un equipo es una selección curada de agentes — provenientes de kits y/o specs individuales — configurados para un contexto de proyecto específico. Los equipos se almacenan como archivos YAML bajo `.agent-teams/teams/`.

---

## Crear un Equipo

### Usando el Wizard (recomendado)

1. Paleta de Comandos → **`Agent Teams: Create Team`**  
   O: Dashboard → **Acciones Rápidas** → **Create Team**
2. Introduce un nombre y descripción.
3. Selecciona los kits y/o agentes a incluir.
4. Se crea el archivo `.agent-teams/teams/<id>.yml`.

<!-- screenshot: La página del wizard de creación de equipo dentro del dashboard, mostrando el paso 2 — selección de kits con una lista de kits disponibles y checkboxes para habilitar cada uno -->

### Formato YAML del Equipo

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

---

## Editar un Equipo

1. Dashboard → **Team Manager** → selecciona equipo → **Edit**.
2. Modifica kits, agentes u overrides.
3. Guarda — los cambios actualizan el archivo YAML inmediatamente.

<!-- screenshot: La página de edición de equipo con un equipo cargado, mostrando la lista de agentes con toggles de habilitar/deshabilitar a la izquierda y un editor de overrides (pares clave-valor por agente) a la derecha -->

---

## Listar Equipos

Paleta de Comandos → **`Agent Teams: List Teams`**

Abre un quick-pick con todos los equipos disponibles. Al seleccionar uno, abre su archivo YAML directamente en el editor.

---

## Sincronizar un Equipo

El sync resuelve la composición completa (kit + perfil de proyecto + overrides del equipo) y escribe los archivos markdown finales de agentes en `.github/agents/`.

### Dry-run (previsualización sin escritura)

```bash
agent-teams team:sync --dry-run
```

La salida muestra cada agente con una de tres acciones:

| Acción | Significado |
|---|---|
| `create` | Se escribirá un nuevo archivo de agente |
| `update` | El archivo de agente existente será actualizado (se muestra el diff) |
| `skip` | No se detectaron cambios, el archivo se deja como está |

<!-- screenshot: Terminal de VS Code mostrando la salida del sync dry-run — una tabla con columnas para nombre del agente, acción (create / update / skip en distintos colores) y una línea de resumen al final (p. ej. "3 creados, 1 actualizado, 2 omitidos") -->

### Aplicar el sync

```bash
agent-teams team:sync
```

O mediante la Paleta de Comandos: **`Agent Teams: Sync Team`**

El comando acepta `--no-diff` para suprimir el diff por archivo en la salida.

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

[← Volver al índice](../README.es.md)
