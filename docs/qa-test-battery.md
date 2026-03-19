# Batería de Pruebas QA — Agent Teams Extension v1.1.2

> **Versión del documento:** 1.0.0
> **Fecha:** 2026-03-18
> **Cobertura:** Extension v1.1.2 (todas las funcionalidades)

---

## Índice

1. [Agentes de prueba](#agentes-de-prueba)
2. [Módulo 1: Instalación y activación](#módulo-1-instalación-y-activación)
3. [Módulo 2: Dashboard — Navegación (12 páginas)](#módulo-2-dashboard--navegación-12-páginas)
4. [Módulo 3: Gestión de agentes — CRUD](#módulo-3-gestión-de-agentes--crud)
5. [Módulo 4: Agent Wizard — 6 pasos](#módulo-4-agent-wizard--6-pasos)
6. [Módulo 5: Gestión de equipos](#módulo-5-gestión-de-equipos)
7. [Módulo 6: Profile Editor](#módulo-6-profile-editor)
8. [Módulo 7: Sincronización (Sync)](#módulo-7-sincronización-sync)
9. [Módulo 8: Skills Browser](#módulo-8-skills-browser)
10. [Módulo 9: Context Packs](#módulo-9-context-packs)
11. [Módulo 10: Import / Export de catálogo](#módulo-10-import--export-de-catálogo)
12. [Módulo 11: MCP Servers](#módulo-11-mcp-servers)
13. [Módulo 12: Integración con Engram](#módulo-12-integración-con-engram)
14. [Módulo 13: LM Tools / Chat Participants](#módulo-13-lm-tools--chat-participants)
15. [Módulo 14: Task Coordinator](#módulo-14-task-coordinator)
16. [Módulo 15: Configuración de la extensión](#módulo-15-configuración-de-la-extensión-settings)
17. [Módulo 16: Flujos E2E completos](#módulo-16-flujos-e2e-completos)
18. [Módulo 17: Casos borde y errores](#módulo-17-casos-borde-y-errores)
19. [Resumen de prioridades](#resumen-de-prioridades)

---

## Agentes de prueba

Estos agentes se utilizan a lo largo de toda la batería. Deben crearse en orden y están diseñados para ser válidos contra el schema JSON de la extensión.

### `qa-worker-basic.yml`

```yaml
id: qa-worker-basic
name: "QA Worker Basic"
version: "1.0.0"
role: worker
domain: testing
description: "Agente worker mínimo para pruebas básicas de creación y sincronización."
expertise:
  - unit testing
  - code validation
intents:
  - run_tests
  - validate_code
scope:
  topics:
    - testing
  path_globs:
    - "src/**/*.test.ts"
permissions:
  can_create_files: false
  can_edit_files: false
  can_delete_files: false
  can_run_commands: false
  can_delegate: false
targets:
  - copilot
  - claude
```

**Propósito:** Worker sin permisos especiales. Usado en pruebas de creación básica, edición, eliminación y sincronización.

---

### `qa-orchestrator.yml`

```yaml
id: qa-orchestrator
name: "QA Orchestrator"
version: "1.0.0"
role: orchestrator
domain: testing
description: "Orquestador de pruebas que coordina workers y gestiona flujos de handoff."
expertise:
  - task decomposition
  - test coordination
intents:
  - coordinate_testing
  - orchestrate_workflow
permissions:
  can_delegate: true
  can_edit_files: true
handoffs:
  receives_from:
    - qa-router
  delegates_to:
    - qa-worker-basic
    - qa-worker-autonomous
  escalates_to: []
engram:
  mode: default
targets:
  - copilot
  - claude
```

**Propósito:** Orchestrator con Engram en modo default. Usado en flujos de handoff y dispatch paralelo.

---

### `qa-router.yml`

```yaml
id: qa-router
name: "QA Router"
version: "1.0.0"
role: router
domain: testing
description: "Router de pruebas que enruta tareas por intención a workers u orchestrators."
expertise:
  - intent detection
  - task routing
intents:
  - route_task
  - detect_intent
handoffs:
  delegates_to:
    - qa-worker-basic
    - qa-orchestrator
    - qa-worker-autonomous
constraints:
  always:
    - "Route to the most specific agent available"
  never:
    - "Execute tasks directly"
targets:
  - copilot
  - claude
```

**Propósito:** Router con intenciones definidas. Usado para probar routing por intención y la LM tool handoff.

---

### `qa-worker-autonomous.yml`

```yaml
id: qa-worker-autonomous
name: "QA Worker Autonomous"
version: "1.0.0"
role: worker
domain: testing
description: "Worker autónomo para pruebas de dispatch paralelo y subtask completion."
expertise:
  - autonomous execution
  - subtask completion
intents:
  - execute_subtask
  - autonomous_work
permissions:
  can_create_files: true
  can_edit_files: true
  can_run_commands: true
engram:
  mode: autonomous
mcpServers:
  - id: engram
    command: engram
    args:
      - mcp
  - id: agent-teams
    command: node
    args:
      - "${extensionPath}/dist/mcp/dispatch-server.js"
targets:
  - copilot
  - claude
```

**Propósito:** Worker autónomo con MCP servers y Engram autonomous. Usado en flujos de dispatch paralelo.

---

### `qa-aggregator.yml`

```yaml
id: qa-aggregator
name: "QA Aggregator"
version: "1.0.0"
role: aggregator
domain: testing
description: "Aggregator de pruebas que unifica resultados de subtareas paralelas."
expertise:
  - result aggregation
  - conflict resolution
  - unified output
intents:
  - aggregate_results
  - unify_outputs
permissions:
  can_edit_files: true
output:
  template: structured-qa
  mode: detailed
targets:
  - copilot
  - claude
```

**Propósito:** Aggregator (nuevo rol en v1.1.0). Usado al final de flujos de dispatch paralelo para unificar resultados.

---

## Módulo 1: Instalación y activación

### TC-001: Activación de la extensión

**Precondiciones:** VS Code instalado, extensión `.vsix` disponible.

**Pasos:**
1. Abrir VS Code → menú Extensions (`Ctrl+Shift+X`)
2. Clic en `...` → "Install from VSIX..." → seleccionar el fichero `.vsix`
3. Recargar VS Code cuando se solicite
4. Abrir una carpeta de workspace

**Resultado esperado:**
- Icono de Agent Teams visible en la Activity Bar
- Panel lateral (sidebar) muestra mensaje de bienvenida con enlace "Open Agent Teams Dashboard"
- Sin errores críticos en el Output channel "Agent Teams"

**Prioridad:** ⚠️ Alta

---

### TC-002: Comandos disponibles en Command Palette

**Precondiciones:** Extensión activada (TC-001 completado).

**Pasos:**
1. Abrir Command Palette (`Ctrl+Shift+P`)
2. Escribir "Agent Teams"

**Resultado esperado:** Se listan todos los comandos registrados:
- `Open Agent Teams Dashboard`
- `Create New Agent`
- `Sync Agents to .github/`
- `Generate Agent from Spec`
- `Reload Agents`
- `Select Agent Manually`
- `Initialize Project Profile (v2.0)`
- `Create Team Profile (v2.0)`
- `List Teams (v2.0)`
- `Sync Team to .github/ (v2.0)`
- `Browse Available Kits (v2.0)`
- `Setup Engram Memory`
- `Capture Workspace into Catalog`
- `Export Catalog`
- `Import Catalog`
- `Reset Catalog`

**Prioridad:** ⚠️ Alta

---

### TC-003: Sidebar panel

**Precondiciones:** Extensión activada.

**Pasos:**
1. Clic en el icono Agent Teams en la Activity Bar

**Resultado esperado:**
- Panel lateral `agentTeams.sidebar` visible
- Mensaje de bienvenida con enlace "Open Agent Teams Dashboard"

**Prioridad:** ⚠️ Alta

---

### TC-004: Output channel de logs

**Precondiciones:** Extensión activada.

**Pasos:**
1. Abrir panel Output (`Ctrl+Shift+U`)
2. En el selector de canales, elegir "Agent Teams"

**Resultado esperado:**
- Canal existe y muestra mensajes de inicialización
- Sin errores críticos (nivel `error`) en la inicialización

**Prioridad:** 🔵 Media

---

## Módulo 2: Dashboard — Navegación (12 páginas)

### TC-010: Apertura del dashboard

**Precondiciones:** Extensión activada.

**Pasos:**
1. Ejecutar comando "Open Agent Teams Dashboard" desde Command Palette o clic en enlace del sidebar

**Resultado esperado:**
- Webview se abre correctamente
- Página Dashboard principal carga sin errores de consola
- React SPA renderiza sin pantalla en blanco

**Prioridad:** ⚠️ Alta

---

### TC-011: Dashboard principal — bloques de contenido

**Precondiciones:** Dashboard abierto (TC-010).

**Pasos:**
1. Verificar presencia de cada bloque en la página principal

**Resultado esperado:**
- **Stats grid:** equipo activo, nº de agentes, sync status (pending changes)
- **Quick Actions:** tarjeta con accesos rápidos a Create Agent, Sync, etc.
- **Agent List:** lista de agentes con descripción, intenciones y equipo; estado vacío apropiado si no hay agentes
- **Team Agents:** tarjeta con agentes del equipo activo
- **Engram Setup Banner:** visible si Engram no está configurado

**Prioridad:** ⚠️ Alta

---

### TC-012: Navegación → Profile Editor

**Precondiciones:** Dashboard abierto.

**Pasos:**
1. Clic en "Profile Editor" en la barra de navegación lateral

**Resultado esperado:**
- Página Profile Editor carga
- Campos visibles: id, name, version, type, technologies (checkboxes), paths, commands, context_packs, sync_targets, agents_md_budget

**Prioridad:** ⚠️ Alta

---

### TC-013: Navegación → Team Manager

**Precondiciones:** Dashboard abierto.

**Pasos:**
1. Clic en "Team Manager"

**Resultado esperado:**
- Lista de equipos (vacía si no hay ninguno, con estado vacío apropiado)
- Botón "Create Team" visible

**Prioridad:** ⚠️ Alta

---

### TC-014: Navegación → Agent Manager

**Precondiciones:** Dashboard abierto.

**Pasos:**
1. Clic en "Agent Manager"

**Resultado esperado:**
- Lista de agentes con filtros por rol y dominio
- Columnas: nombre, descripción, intenciones, equipo al que pertenece
- Estado vacío apropiado si no hay agentes

**Prioridad:** ⚠️ Alta

---

### TC-015: Navegación → Skills Browser

**Precondiciones:** Dashboard abierto.

**Pasos:**
1. Clic en "Skills Browser"

**Resultado esperado:**
- Browser con 9 categorías: `file_operations`, `code_analysis`, `execution`, `browser`, `database`, `testing`, `documentation`, `git`, `deployment`
- Campo de búsqueda funcional

**Prioridad:** 🔵 Media

---

### TC-016: Navegación → Context Packs

**Precondiciones:** Dashboard abierto.

**Pasos:**
1. Clic en "Context Packs"

**Resultado esperado:**
- Lista de context packs (o estado vacío)
- Opción para crear nuevo pack

**Prioridad:** 🔵 Media

---

### TC-017: Navegación → Import/Export

**Precondiciones:** Dashboard abierto.

**Pasos:**
1. Clic en "Import/Export"

**Resultado esperado:** Página con cuatro secciones claramente diferenciadas:
- Capture Workspace into Catalog
- Export Catalog
- Import Catalog
- Reset Catalog

**Prioridad:** 🔵 Media

---

### TC-018: Engram setup banner — primer uso

**Precondiciones:** Engram no configurado en el workspace (sin entrada en `.vscode/mcp.json`).

**Pasos:**
1. Abrir Dashboard

**Resultado esperado:**
- Banner prominente de configuración de Engram
- CTA (call to action) para ejecutar "Setup Engram Memory"
- Banner desaparece tras completar el setup

**Prioridad:** 🔵 Media

---

## Módulo 3: Gestión de agentes — CRUD

### TC-020: Crear agente básico mediante wizard

**Precondiciones:** Dashboard abierto, página Agent Manager visible.

**Pasos:**
1. Clic en "Create Agent" o "New Agent"
2. **Identity:** id=`qa-worker-basic`, name="QA Worker Basic", role=`worker`, domain=`testing`, description="Agente worker mínimo para pruebas básicas."
3. **Scope:** topics=["testing"], path_globs=["src/**/*.test.ts"] (prioridad medium)
4. **Skills:** omitir (clic Next)
5. **Workflow & Tools:** añadir paso "Run tests and validate output"
6. **Output & Context:** omitir
7. **Rules:** sin permisos especiales; guardar

**Resultado esperado:**
- Fichero `.agent-teams/agents/qa-worker-basic.yml` creado con contenido válido
- Agente aparece en la lista del Agent Manager

**Agente de prueba:** `qa-worker-basic`
**Prioridad:** ⚠️ Alta

---

### TC-021: Crear agente con todos los campos configurados

**Precondiciones:** Dashboard abierto, `qa-worker-basic` ya creado.

**Pasos:**
1. Crear agente `qa-orchestrator` completando todos los pasos del wizard:
   - role=`orchestrator`, expertise=["task decomposition", "test coordination"]
   - intents=["coordinate_testing"]
   - can_delegate=true, can_edit_files=true
   - handoffs.delegates_to=["qa-worker-basic"]
   - engram.mode=`default`

**Resultado esperado:**
- YAML generado con todos los campos configurados
- Validación contra el JSON schema pasa sin errores
- Agente visible en Agent Manager

**Agente de prueba:** `qa-orchestrator`
**Prioridad:** ⚠️ Alta

---

### TC-022: Crear agente con MCP servers y modo autónomo

**Precondiciones:** Dashboard abierto.

**Pasos:**
1. Crear agente `qa-worker-autonomous`
2. En paso "Workflow & Tools", expandir sección "MCP Servers" (collapsible)
3. Añadir MCP servidor 1: id=`engram`, command=`engram`, args=["mcp"]
4. Añadir MCP servidor 2: id=`agent-teams`, command=`node`, args=["dist/mcp/dispatch-server.js"]
5. En paso "Rules", activar checkbox "Engram Autonomous Mode"
6. Guardar

**Resultado esperado:**
- YAML guardado con sección `mcpServers` y `engram.mode: autonomous`
- Tras sync: `.vscode/mcp.json` actualizado con entradas `engram` y `agent-teams`
- Tras sync: `.mcp.json` en raíz actualizado

**Agente de prueba:** `qa-worker-autonomous`
**Prioridad:** ⚠️ Alta

---

### TC-023: Editar agente existente — todos los campos precargan

**Precondiciones:** Agente `qa-worker-basic` creado (TC-020).

**Pasos:**
1. En Agent Manager, clic en "Edit" sobre `qa-worker-basic`
2. Verificar que todos los campos están pre-rellenados con los valores actuales
3. Cambiar description a "Updated description for QA testing"
4. Añadir expertise: "regression testing"
5. Guardar

**Resultado esperado:**
- Todos los campos del agente cargan correctamente en el formulario de edición
- YAML actualizado con los nuevos valores
- Versión del agente preservada (no se resetea ni incrementa automáticamente)
- Cambios reflejados inmediatamente en Agent Manager

**Prioridad:** ⚠️ Alta

---

### TC-024: Edición preserva el campo version

**Precondiciones:** Agente con `version: "1.0.0"` existente.

**Pasos:**
1. Editar cualquier campo del agente (e.g., añadir un expertise)
2. Guardar sin tocar el campo version

**Resultado esperado:**
- El campo `version` en el YAML resultante es exactamente `"1.0.0"` (no se resetea a null ni se incrementa)

**Prioridad:** ⚠️ Alta

---

### TC-025: Eliminar agente — con diálogo de confirmación

**Precondiciones:** Agente `qa-worker-basic` existente.

**Pasos:**
1. En Agent Manager, clic en "Delete" sobre `qa-worker-basic`
2. Verificar que aparece diálogo de confirmación antes de borrar
3. Confirmar eliminación

**Resultado esperado:**
- Diálogo de confirmación mostrado (borrado no inmediato)
- Tras confirmar: fichero `.agent-teams/agents/qa-worker-basic.yml` eliminado del disco
- Agente desaparece de Agent Manager
- Navegación correcta tras borrado (sin pantalla rota)

**Prioridad:** ⚠️ Alta

---

### TC-026: Cancelar eliminación de agente

**Precondiciones:** Agente `qa-worker-basic` existente.

**Pasos:**
1. Clic en "Delete" sobre el agente
2. En el diálogo de confirmación, clic en "Cancel"

**Resultado esperado:**
- Agente NO eliminado del disco
- Agente sigue apareciendo en Agent Manager sin cambios

**Prioridad:** 🔵 Media

---

### TC-027: Recargar agentes tras edición externa del YAML

**Precondiciones:** Agente `qa-worker-basic` existente.

**Pasos:**
1. Abrir directamente `.agent-teams/agents/qa-worker-basic.yml` en el editor
2. Modificar el campo `description` manualmente
3. Guardar el fichero
4. Ejecutar "Reload Agents" desde Command Palette

**Resultado esperado:**
- Agent Manager refleja el cambio de description
- Sin errores en el reload

**Prioridad:** 🔵 Media

---

### TC-028: Crear agente desde spec YAML mediante context menu

**Precondiciones:** Fichero `.yml` con spec de agente válida presente en el workspace.

**Pasos:**
1. Clic derecho sobre el fichero `.yml` en el Explorer de VS Code
2. Seleccionar "Create Agent from Spec"

**Resultado esperado:**
- Agente generado y sincronizado a los targets configurados en la spec
- Confirmación visible al usuario

**Prioridad:** 🔵 Media

---

### TC-029: Validación — ID inválido (no kebab-case)

**Precondiciones:** Wizard de creación abierto, paso Identity.

**Pasos:**
1. Introducir id: `"My Agent 1"` (con mayúsculas, espacio y número)

**Resultado esperado:**
- Error de validación visible en el campo: ID debe ser kebab-case (letras minúsculas, números y guiones)
- Botón Next/Save deshabilitado mientras el ID sea inválido

**Prioridad:** ⚠️ Alta

---

### TC-030: Botón Save deshabilitado sin campos requeridos

**Precondiciones:** Wizard de creación abierto.

**Pasos:**
1. Dejar el campo `name` vacío (o borrarlo si tiene valor)
2. Intentar clic en el botón Save/Guardar

**Resultado esperado:**
- Botón Save deshabilitado (no clickable)
- Tooltip del botón explica por qué está deshabilitado ("Name is required" o similar)

**Prioridad:** ⚠️ Alta

---

### TC-031: Env vars JSON inválido en MCP server

**Precondiciones:** Wizard en paso Workflow & Tools, al menos un MCP server añadido.

**Pasos:**
1. En el campo de env vars del MCP server, introducir JSON inválido: `{key: value}` (sin comillas en las claves)
2. Intentar guardar

**Resultado esperado:**
- Error capturado antes de guardar: "Invalid MCP env JSON" (o similar)
- Agente no guardado con datos corruptos

**Prioridad:** ⚠️ Alta

---

## Módulo 4: Agent Wizard — 6 pasos

### TC-040: Identity Step — 4 roles disponibles

**Precondiciones:** Wizard abierto en el paso 1 (Identity).

**Pasos:**
1. Verificar los campos del paso: id, name, role (selector), domain, expertise (input de tags), description
2. Expandir el selector de rol y comprobar las opciones disponibles
3. Seleccionar cada rol: `worker`, `orchestrator`, `router`, `aggregator`

**Resultado esperado:**
- Los 4 roles están disponibles en el selector
- Campos requeridos visualmente marcados (asterisco o similar)
- Contador de caracteres visible en el campo `description`

**Prioridad:** ⚠️ Alta

---

### TC-041: Scope Step — globs, topics y excludes

**Precondiciones:** Paso Identity completado, en paso Scope.

**Pasos:**
1. Añadir topics: "testing", "validation"
2. Añadir path_glob: `src/**/*.test.ts` con prioridad `high`
3. Añadir segundo path_glob: `src/**/*.spec.ts` con prioridad `medium`
4. Añadir exclude: `src/deprecated/**`

**Resultado esperado:**
- Topics guardados como array
- Path globs con selector de prioridad (high/medium/low) por cada glob
- Excludes en sección separada
- Todo persiste correctamente en el YAML generado

**Prioridad:** ⚠️ Alta

---

### TC-042: Skills Step — estado vacío con enlace al browser

**Precondiciones:** Navegando por el wizard, en paso Skills sin skills seleccionadas.

**Pasos:**
1. Llegar al paso Skills sin haber añadido ninguna skill

**Resultado esperado:**
- Estado vacío visible con mensaje descriptivo
- Botón "Browse registry" visible para navegar al Skills Browser
- Posibilidad de continuar sin skills (campo opcional)

**Prioridad:** ⚠️ Alta

---

### TC-043: Workflow & Tools Step — edición de pasos y MCP collapsible

**Precondiciones:** Wizard con role=`worker`, en paso Workflow & Tools.

**Pasos:**
1. Verificar que se muestran los pasos de workflow por defecto para el rol worker (5 pasos)
2. Editar el primer paso de workflow modificando su texto
3. Añadir un nuevo paso al workflow
4. Añadir tool: name=`editFiles`, when=`"when editing source code"`
5. Expandir la sección colapsable "MCP Servers"
6. Añadir un MCP server de prueba

**Resultado esperado:**
- Pasos de workflow editables para todos los roles (worker, orchestrator, router, aggregator)
- Sección MCP Servers colapsable/expandible
- Campo `when` opcional disponible en cada tool
- Cambios reflejados en el YAML resultante

**Prioridad:** ⚠️ Alta

---

### TC-044: Output & Context Step — configuración completa

**Precondiciones:** En paso Output & Context.

**Pasos:**
1. Seleccionar output template: `planning`
2. Cambiar mode a `detailed`
3. Ajustar max_items a `10`
4. Añadir context pack ID: `backend:conventions`
5. Configurar context_strategy: max_files=15, max_chars_per_file=8000, retrieval_mode=`semantic`

**Resultado esperado:**
- Todos los campos guardados correctamente en el YAML generado
- Template, mode, max_items, context_packs y context_strategy reflejados en el spec

**Prioridad:** 🔵 Media

---

### TC-045: Rules Step — permisos, constraints y handoffs

**Precondiciones:** En paso Rules.

**Pasos:**
1. Activar permisos: `can_create_files`, `can_edit_files`, `can_delegate`
2. Añadir constraint `always`: "Follow coding standards"
3. Añadir constraint `never`: "Delete production files"
4. Añadir constraint `escalate`: "When breaking changes are required"
5. Configurar handoffs: `delegates_to` = ["qa-worker-basic"]
6. Para agente de tipo worker: verificar que el checkbox "Engram Autonomous Mode" es visible

**Resultado esperado:**
- Permisos, constraints y handoffs reflejados en el YAML
- Checkbox "Engram Autonomous Mode" visible **únicamente** para agentes con role=`worker`

**Prioridad:** ⚠️ Alta

---

### TC-046: Auto-sync permisos → tools

**Precondiciones:** Wizard en paso Rules con role=`worker`.

**Pasos:**
1. Activar permiso `can_edit_files: true`
2. Volver al paso Workflow & Tools

**Resultado esperado:**
- El tool `editFiles` aparece automáticamente en la lista de tools al tener `can_edit_files: true`
- Auto-sync funciona también para `can_create_files` → `createFiles`

**Prioridad:** ⚠️ Alta

---

## Módulo 5: Gestión de equipos

### TC-050: Crear equipo básico

**Precondiciones:** Al menos `qa-worker-basic` y `qa-orchestrator` creados.

**Pasos:**
1. Ir a Team Manager → clic en "Create Team"
2. Completar: id=`qa-team`, name="QA Team", description="Team for QA testing"
3. Configurar agents.enable: ["qa-worker-basic", "qa-orchestrator"]
4. Guardar

**Resultado esperado:**
- Fichero `.agent-teams/teams/qa-team.yml` creado con estructura válida
- Equipo `qa-team` aparece en la lista del Team Manager

**Prioridad:** ⚠️ Alta

---

### TC-051: Editar equipo — añadir override por agente

**Precondiciones:** Equipo `qa-team` existente (TC-050).

**Pasos:**
1. En Team Manager, clic en "Edit" sobre `qa-team`
2. Añadir override para `qa-worker-basic`:
   - context.max_files: 5
   - output.mode_default: "short+diff"
3. Guardar

**Resultado esperado:**
- YAML del equipo actualizado con la sección `overrides.qa-worker-basic`
- Campos del override persistidos correctamente

**Prioridad:** ⚠️ Alta

---

### TC-052: Listar equipos

**Precondiciones:** Al menos un equipo creado.

**Pasos:**
1. Ejecutar "List Teams (v2.0)" desde Command Palette
2. Verificar que los equipos aparecen también en Team Manager del dashboard

**Resultado esperado:**
- Lista de equipos con nombre, descripción y número de agentes configurados

**Prioridad:** 🔵 Media

---

### TC-053: Sync de equipo — dry-run

**Precondiciones:** Equipo `qa-team` y agentes creados.

**Pasos:**
1. Ejecutar "Sync Team to .github/ (v2.0)" → seleccionar equipo `qa-team`
2. Activar modo dry-run
3. Ejecutar

**Resultado esperado:**
- Preview de cambios sin modificar ficheros reales en disco
- Diff visible por agente indicando acción: `create` / `update` / `skip` / `delete`
- Resumen de cambios pendientes (SyncResult)

**Prioridad:** ⚠️ Alta

---

### TC-054: Sync de equipo — real

**Precondiciones:** TC-053 completado satisfactoriamente.

**Pasos:**
1. Ejecutar sync real del equipo `qa-team` (sin dry-run)

**Resultado esperado:**
- Ficheros `.github/agents/*.agent.md` generados/actualizados para cada agente del equipo con target copilot
- Ficheros `.claude/agents/*.md` generados para agentes con target claude
- Sin errores durante el sync

**Prioridad:** ⚠️ Alta

---

## Módulo 6: Profile Editor

### TC-060: Inicializar perfil de proyecto

**Precondiciones:** Sin fichero `.agent-teams/project.profile.yml` en el workspace.

**Pasos:**
1. Ejecutar "Initialize Project Profile (v2.0)" desde Command Palette
2. Completar los campos del asistente: id, name, version, type (e.g., "web-app"), technologies (react=true, typescript=true)

**Resultado esperado:**
- Fichero `.agent-teams/project.profile.yml` creado con estructura YAML válida
- Campos completados reflejados en el fichero

**Prioridad:** ⚠️ Alta

---

### TC-061: Editar perfil desde el dashboard

**Precondiciones:** `project.profile.yml` existente (TC-060).

**Pasos:**
1. Ir a Profile Editor en el dashboard
2. Añadir tecnología: `node: true`
3. Añadir path: `src: "./src"`
4. Añadir command: `test: "npm test"`
5. Añadir sync_target: `claude_code`
6. Guardar

**Resultado esperado:**
- YAML actualizado correctamente con todos los nuevos campos
- Los campos existentes no se corrompen ni pierden

**Prioridad:** ⚠️ Alta

---

### TC-062: Campo agents_md_budget

**Precondiciones:** Profile Editor abierto.

**Pasos:**
1. Localizar el campo `agents_md_budget`
2. Introducir un valor numérico válido
3. Guardar

**Resultado esperado:**
- Campo disponible y persistido en el YAML

**Prioridad:** 🟡 Baja

---

## Módulo 7: Sincronización (Sync)

### TC-070: Sync a target Copilot

**Precondiciones:** Agente con `targets: [copilot]` creado.

**Pasos:**
1. Ejecutar "Sync Agents to .github/" desde Command Palette

**Resultado esperado:**
- Fichero `.github/agents/{id}.agent.md` generado
- Contenido del fichero incluye el prompt completo del agente en markdown

**Prioridad:** ⚠️ Alta

---

### TC-071: Sync a target Claude

**Precondiciones:** Agente con `targets: [claude]` creado.

**Pasos:**
1. Ejecutar sync

**Resultado esperado:**
- Fichero `.claude/agents/{id}.md` generado con el prompt del agente

**Prioridad:** ⚠️ Alta

---

### TC-072: Sync multi-target simultáneo

**Precondiciones:** Agente `qa-worker-basic` con `targets: [copilot, claude]`.

**Pasos:**
1. Ejecutar sync

**Resultado esperado:**
- `.github/agents/qa-worker-basic.agent.md` generado
- `.claude/agents/qa-worker-basic.md` generado
- Ambos ficheros en la misma ejecución de sync

**Prioridad:** ⚠️ Alta

---

### TC-073: MCP servers merge en ficheros de workspace

**Precondiciones:** Agente `qa-worker-autonomous` con `mcpServers` configurados, sync ejecutado.

**Pasos:**
1. Ejecutar sync del agente
2. Abrir `.vscode/mcp.json`
3. Abrir `.mcp.json` en raíz del workspace

**Resultado esperado:**
- `.vscode/mcp.json`: entrada `servers.engram` y `servers.agent-teams` con command/args correctos (formato Copilot)
- `.mcp.json`: entrada `mcpServers.engram` y `mcpServers.agent-teams` (formato Claude)

**Prioridad:** ⚠️ Alta

---

### TC-074: Tabla MCP en el prompt generado

**Precondiciones:** Agente con `mcpServers`, sync ejecutado.

**Pasos:**
1. Abrir el fichero `.github/agents/qa-worker-autonomous.agent.md` generado

**Resultado esperado:**
- Tabla markdown al final del prompt con los MCP servers configurados (id, command, args)

**Prioridad:** 🔵 Media

---

### TC-075: AGENTS.md generado en raíz del workspace

**Precondiciones:** Sync ejecutado con al menos un agente.

**Pasos:**
1. Verificar existencia del fichero `AGENTS.md` en la raíz del workspace

**Resultado esperado:**
- Fichero `AGENTS.md` presente con índice de todos los agentes sincronizados

**Prioridad:** 🔵 Media

---

### TC-076: .gitignore actualizado según targets

**Precondiciones:** Sync ejecutado.

**Pasos:**
1. Abrir `.agent-teams/.gitignore`

**Resultado esperado:**
- Exclusiones correctas según los targets configurados en los agentes

**Prioridad:** 🟡 Baja

---

## Módulo 8: Skills Browser

### TC-080: Explorar las 9 categorías de skills

**Precondiciones:** Dashboard → Skills Browser abierto.

**Pasos:**
1. Verificar presencia de las 9 categorías: `file_operations`, `code_analysis`, `execution`, `browser`, `database`, `testing`, `documentation`, `git`, `deployment`

**Resultado esperado:**
- Todas las categorías visibles con skills listadas bajo cada una
- Sin errores de carga

**Prioridad:** 🔵 Media

---

### TC-081: Búsqueda local de skills

**Precondiciones:** Skills Browser abierto.

**Pasos:**
1. Introducir "test" en el campo de búsqueda

**Resultado esperado:**
- Filtro aplicado: solo skills que contienen "test" en nombre, descripción o categoría
- Resultados actualizados en tiempo real

**Prioridad:** 🔵 Media

---

### TC-082: Búsqueda en comunidad (skills.lc API)

**Precondiciones:** API key configurada en settings (`agentTeams.skillsLcApiKey`).

**Pasos:**
1. Activar búsqueda en comunidad y buscar un término

**Resultado esperado:**
- Resultados de la API de comunidad mostrados
- Sin API key: mensaje informativo de cómo configurarla

**Prioridad:** 🟡 Baja

---

### TC-083: Añadir skill a un agente

**Precondiciones:** Skills Browser abierto, agente existente.

**Pasos:**
1. Seleccionar una skill
2. Añadirla a un agente existente

**Resultado esperado:**
- Skill agregada al spec del agente con campo `id` correcto
- Campo `when` opcional disponible

**Prioridad:** 🔵 Media

---

## Módulo 9: Context Packs

### TC-090: Listar context packs

**Precondiciones:** Dashboard → Context Packs abierto.

**Pasos:**
1. Verificar la lista de context packs del workspace

**Resultado esperado:**
- Packs listados con nombre y descripción
- Estado vacío apropiado si no hay ninguno definido

**Prioridad:** 🔵 Media

---

### TC-091: Resolución de variables básicas en context packs

**Precondiciones:** `project.profile.yml` con `name` y `version` definidos.

**Pasos:**
1. Crear un context pack con contenido: `Proyecto: {{project:name}} v{{project:version}}`
2. Asignar el pack a un agente
3. Ejecutar sync

**Resultado esperado:**
- En el prompt generado, las variables sustituidas por los valores reales del `project.profile.yml`

**Prioridad:** ⚠️ Alta

---

### TC-092: Condicionales en context packs

**Precondiciones:** `project.profile.yml` con `technologies.react: true`.

**Pasos:**
1. Crear context pack con: `{{#if technology:react}}Este proyecto usa React.{{/if}}`
2. Sincronizar agente que usa ese pack

**Resultado esperado:**
- Bloque condicional incluido en el output ya que `react=true`
- Con `react: false`, el bloque es omitido

**Prioridad:** 🔵 Media

---

### TC-093: Bucles en context packs

**Precondiciones:** `project.profile.yml` con varias tecnologías.

**Pasos:**
1. Usar `{{#each technologies}}{{this}}{{/each}}` en un context pack
2. Sincronizar

**Resultado esperado:**
- Iteración correcta sobre las tecnologías; todas listadas en el output

**Prioridad:** 🔵 Media

---

### TC-094: Filtros de texto en context packs

**Precondiciones:** Context pack con filtros definidos.

**Pasos:**
1. Usar: `{{uppercase:myProject}}`, `{{lowercase:MyProject}}`, `{{capitalize:myProject}}`
2. Sincronizar

**Resultado esperado:**
- `MYPROJECT`, `myproject`, `Myproject` respectivamente

**Prioridad:** 🟡 Baja

---

## Módulo 10: Import / Export de catálogo

### TC-100: Capturar workspace en catálogo global

**Precondiciones:** Agentes y equipos existentes en el workspace.

**Pasos:**
1. Ejecutar "Capture Workspace into Catalog"

**Resultado esperado:**
- Agentes del workspace capturados en el catálogo global de la extensión
- Notificación de éxito con número de agentes capturados

**Prioridad:** 🔵 Media

---

### TC-101: Exportar catálogo a JSON

**Precondiciones:** Catálogo con al menos un agente.

**Pasos:**
1. Dashboard → Import/Export → "Export Catalog"
2. Seleccionar ubicación de guardado (`agents-backup.json`)

**Resultado esperado:**
- Fichero JSON válido generado con todos los agentes del catálogo
- JSON parseable y con estructura correcta

**Prioridad:** 🔵 Media

---

### TC-102: Importar catálogo desde JSON

**Precondiciones:** Fichero `agents-backup.json` exportado previamente (TC-101).

**Pasos:**
1. Dashboard → Import/Export → "Import Catalog"
2. Seleccionar el fichero `agents-backup.json`

**Resultado esperado:**
- Agentes importados al catálogo
- Contador de `added` y `skipped` (duplicados) mostrado al usuario
- Sin duplicados si los agentes ya existen

**Prioridad:** 🔵 Media

---

### TC-103: Resetear catálogo

**Precondiciones:** Catálogo con agentes importados.

**Pasos:**
1. Dashboard → Import/Export → "Reset Catalog"
2. Confirmar la operación en el diálogo

**Resultado esperado:**
- Catálogo vaciado por completo
- Confirmación de éxito
- Operación requiere confirmación (no es inmediata)

**Prioridad:** 🔵 Media

---

## Módulo 11: MCP Servers

### TC-110: Configurar MCP server por agente en wizard

**Precondiciones:** Wizard de creación → paso Workflow & Tools.

**Pasos:**
1. Expandir sección "MCP Servers" (collapsible)
2. Añadir: id=`github`, command=`npx`, args=["@modelcontextprotocol/server-github"], env=`{"GITHUB_TOKEN": "ghp_test123"}`
3. Guardar el agente

**Resultado esperado:**
- Sección colapsible funciona (expand/collapse)
- MCP server guardado en el YAML con todos los campos

**Prioridad:** ⚠️ Alta

---

### TC-111: Merge en `.vscode/mcp.json` (formato Copilot)

**Precondiciones:** Agente con MCP `github` configurado, sync ejecutado con target copilot.

**Pasos:**
1. Abrir `.vscode/mcp.json`

**Resultado esperado:**
- Entrada `servers.github` presente con `command: "npx"` y `args: ["@modelcontextprotocol/server-github"]`
- No se sobreescriben entradas de otros MCPs ya existentes en el fichero

**Prioridad:** ⚠️ Alta

---

### TC-112: Merge en `.mcp.json` (formato Claude)

**Precondiciones:** Agente con MCP `github` configurado, sync ejecutado con target claude.

**Pasos:**
1. Abrir `.mcp.json` en la raíz del workspace

**Resultado esperado:**
- Entrada `mcpServers.github` presente con la configuración correcta

**Prioridad:** ⚠️ Alta

---

### TC-113: MCP server built-in `agent-teams`

**Precondiciones:** Extensión activada, `dist/mcp/dispatch-server.js` presente.

**Pasos:**
1. Verificar disponibilidad del MCP server `agent-teams`
2. Llamar `tools/list` al servidor

**Resultado esperado:**
- Servidor `agent-teams` disponible
- Tools listadas: `dispatch_task` y `complete_subtask`

**Prioridad:** ⚠️ Alta

---

## Módulo 12: Integración con Engram

### TC-120: Setup inicial de Engram

**Precondiciones:** Engram no configurado en el workspace.

**Pasos:**
1. Ejecutar "Setup Engram Memory" desde Command Palette

**Resultado esperado:**
- `.vscode/mcp.json` actualizado con entrada `engram` → `{command: "engram", args: ["mcp"]}`
- `.gitignore` del workspace (o `.agent-teams/.gitignore`) actualizado para excluir `.engram/engram.db`
- Si el binario `engram` no está instalado: mensaje informativo con instrucciones de instalación
- Banner de Engram desaparece del dashboard

**Prioridad:** ⚠️ Alta

---

### TC-121: Instrucciones de memoria generadas para worker (modo default)

**Precondiciones:** Agente `qa-worker-basic` con `engram.mode: default` sincronizado.

**Pasos:**
1. Abrir `.github/agents/qa-worker-basic.agent.md`

**Resultado esperado:**
- Sección de instrucciones Engram incluida en el prompt
- Patrones de recall y remember para worker presentes

**Prioridad:** ⚠️ Alta

---

### TC-122: Instrucciones de memoria para orchestrator

**Precondiciones:** Agente `qa-orchestrator` sincronizado.

**Pasos:**
1. Abrir prompt generado para `qa-orchestrator`

**Resultado esperado:**
- Instrucciones Engram para handoff: clave `handoff:{taskId}`
- Instrucciones para parallel dispatch: clave `task:{taskId}:subtask:{agentId}`
- Protocolo de delegación de Claude incluido

**Prioridad:** ⚠️ Alta

---

### TC-123: Instrucciones de memoria para router

**Precondiciones:** Agente `qa-router` sincronizado.

**Pasos:**
1. Abrir prompt generado para `qa-router`

**Resultado esperado:**
- Instrucciones para logging de decisiones de routing con clave `routing:patterns`

**Prioridad:** 🔵 Media

---

### TC-124: Modo autónomo — instrucciones en prompt del worker

**Precondiciones:** Agente `qa-worker-autonomous` con `engram.mode: autonomous` sincronizado.

**Pasos:**
1. Abrir prompt generado para `qa-worker-autonomous`

**Resultado esperado:**
- Instrucción de recall al inicio de sesión: `task:{taskId}:subtask:{agentId}`
- Instrucción explícita de llamar `complete_subtask` al finalizar la tarea

**Prioridad:** ⚠️ Alta

---

## Módulo 13: LM Tools / Chat Participants

### TC-130: Chat participant @router disponible

**Precondiciones:** Agente `qa-router` sincronizado y cargado.

**Pasos:**
1. Abrir Copilot Chat
2. Escribir `@router Necesito crear un componente de login en React`

**Resultado esperado:**
- Participant `@router` visible y seleccionable en el autocomplete del chat
- Responde con una `routing-decision` indicando el agente recomendado y la razón

**Prioridad:** ⚠️ Alta

---

### TC-131: Chat participant @agentId dinámico

**Precondiciones:** Agente `qa-worker-basic` cargado.

**Pasos:**
1. En Copilot Chat, escribir `@qa-worker-basic validate this file`

**Resultado esperado:**
- `@qa-worker-basic` disponible en autocomplete
- Responde usando el prompt del agente como contexto del sistema

**Prioridad:** ⚠️ Alta

---

### TC-132: Participants recargan automáticamente tras crear agente

**Precondiciones:** Chat abierto.

**Pasos:**
1. Crear nuevo agente `qa-new-agent` desde el wizard
2. Sin reiniciar VS Code, ir a Copilot Chat y escribir `@qa-new-agent`

**Resultado esperado:**
- `@qa-new-agent` aparece en el autocomplete sin necesidad de reiniciar

**Prioridad:** ⚠️ Alta

---

### TC-133: LM Tool — `agent-teams-handoff`

**Precondiciones:** Agentes `qa-router` y `qa-orchestrator` cargados, Engram configurado.

**Pasos:**
1. Chat con `@qa-router`: "Necesito refactorizar el módulo de autenticación completo, incluyendo frontend y backend"
2. La LM tool `agent-teams-handoff` es invocada por el router

**Resultado esperado:**
- Assessment escrito en Engram con clave `handoff:{taskId}`
- Nueva sesión de chat abierta apuntando a `@qa-orchestrator`
- Mensaje en la nueva sesión con prefijo `[Handoff:{taskId}]`

**Prioridad:** ⚠️ Alta

---

### TC-134: LM Tool — `agent-teams-dispatch-parallel` (mínimo 2 subtareas)

**Precondiciones:** `qa-orchestrator`, `qa-worker-autonomous`, `qa-aggregator` cargados; Engram y MCP `agent-teams` activos.

**Pasos:**
1. Chat con `@qa-orchestrator`: "Analiza en paralelo el frontend y el backend del proyecto"
2. La tool `agent-teams-dispatch-parallel` es invocada con 2 subtareas

**Resultado esperado:**
- Contexto de cada subtarea escrito en Engram: `task:{taskId}:subtask:qa-worker-autonomous`
- Una sesión de chat supervisada abierta por cada subtarea
- Aggregator abierto automáticamente cuando ambas subtareas completan

**Prioridad:** ⚠️ Alta

---

### TC-135: Validación — mínimo 2 subtareas en dispatch-parallel

**Precondiciones:** LM tool `agent-teams-dispatch-parallel` disponible.

**Pasos:**
1. Invocar la tool con solo 1 subtarea

**Resultado esperado:**
- Error devuelto: "Minimum 2 subtasks required for parallel dispatch"
- No se crean sesiones de chat ni ficheros de coordinación

**Prioridad:** ⚠️ Alta

---

### TC-136: LM Tool — `agent-teams-complete-subtask`

**Precondiciones:** Dispatch paralelo activo (TC-134), worker en sesión con prefijo `[Parallel:{taskId}]`.

**Pasos:**
1. Worker (`qa-worker-autonomous`) finaliza su subtarea
2. Invoca `agent-teams-complete-subtask` con parámetros: taskId, agentId=`qa-worker-autonomous`, summary="Análisis del frontend completado."

**Resultado esperado:**
- Fichero de coordinación `.agent-teams/coordination/{taskId}-qa-worker-autonomous.json` actualizado: `status: "completed"`
- Cuando todas las subtareas del taskId completan → chat con `@qa-aggregator` abierto

**Prioridad:** ⚠️ Alta

---

## Módulo 14: Task Coordinator

### TC-140: Ficheros de coordinación creados al hacer dispatch

**Precondiciones:** Dispatch paralelo ejecutado (TC-134).

**Pasos:**
1. Verificar directorio `.agent-teams/coordination/`

**Resultado esperado:**
- Ficheros JSON presentes: `{taskId}-{agentId}.json`
- Cada fichero contiene: `taskId`, `agentId`, `description`, `status: "pending"`, `dispatchedAt` (ISO timestamp), `engramKey`

**Prioridad:** ⚠️ Alta

---

### TC-141: Actualización de status a `completed`

**Precondiciones:** Worker ha llamado `complete_subtask` (TC-136).

**Pasos:**
1. Leer el fichero de coordinación correspondiente

**Resultado esperado:**
- `status: "completed"`
- `completedAt`: timestamp ISO de la finalización
- `summary`: texto del resumen pasado en la llamada

**Prioridad:** ⚠️ Alta

---

### TC-142: Apertura automática del Aggregator

**Precondiciones:** 2 subtareas paralelas, ambas han llamado `complete_subtask`.

**Pasos:**
1. Completar las 2 subtareas con `complete_subtask`
2. Observar el comportamiento de la extensión

**Resultado esperado:**
- Chat con `@qa-aggregator` abierto automáticamente por el TaskCoordinator
- Mensaje de apertura contiene: `[Aggregate:{taskId}]` y referencias a las claves Engram de resultados de cada worker

**Prioridad:** ⚠️ Alta

---

## Módulo 15: Configuración de la extensión (Settings)

### TC-150: `agentTeams.agentsPath` — ruta personalizada

**Precondiciones:** Workspace abierto.

**Pasos:**
1. Abrir Settings de VS Code
2. Cambiar `agentTeams.agentsPath` a `custom/my-agents`
3. Crear un agente y ejecutar sync

**Resultado esperado:**
- La extensión carga agentes desde `custom/my-agents/`
- Sync genera ficheros usando la ruta personalizada como base

**Prioridad:** 🔵 Media

---

### TC-151: `agentTeams.enableAutoRouting = false`

**Precondiciones:** Agente router cargado.

**Pasos:**
1. Cambiar `agentTeams.enableAutoRouting` a `false`
2. Usar `@router` en chat

**Resultado esperado:**
- Routing automático deshabilitado; behavior cambia según la configuración

**Prioridad:** 🔵 Media

---

### TC-152: `agentTeams.enablePathMatching = false`

**Precondiciones:** Agentes con path_globs configurados.

**Pasos:**
1. Deshabilitar `agentTeams.enablePathMatching`

**Resultado esperado:**
- Activación de agentes por path glob deshabilitada

**Prioridad:** 🟡 Baja

---

### TC-153: `agentTeams.logLevel = debug`

**Precondiciones:** Output channel "Agent Teams" visible.

**Pasos:**
1. Cambiar `agentTeams.logLevel` a `debug`
2. Ejecutar cualquier operación (e.g., Reload Agents)

**Resultado esperado:**
- Mensajes de nivel `debug` visibles en el output channel (más detallados que `info`)

**Prioridad:** 🟡 Baja

---

## Módulo 16: Flujos E2E completos

### E2E-001: Ciclo de vida básico (init → agent → sync → chat)

**Objetivo:** Verificar el ciclo de vida completo de un agente desde cero.

**Prerrequisitos:** VS Code con la extensión instalada, workspace vacío.

**Pasos:**
1. Ejecutar "Initialize Project Profile (v2.0)"; completar con name="QA Project", type="library"
2. Crear agente `qa-worker-basic` usando el wizard (rol: worker, domain: testing)
3. Crear equipo `qa-team` habilitando `qa-worker-basic`
4. Ejecutar "Sync Team to .github/" — dry-run primero, luego sync real
5. Verificar que `.github/agents/qa-worker-basic.agent.md` existe con contenido válido
6. Abrir Copilot Chat → `@qa-worker-basic run unit tests for the auth module`

**Resultado esperado:**
- Agente disponible en chat y responde con el prompt correcto
- Todos los ficheros generados correctamente

**Prioridad:** ⚠️ Alta

---

### E2E-002: Flujo de handoff (router → orchestrator → worker)

**Objetivo:** Verificar el flujo completo de delegación con Engram.

**Prerrequisitos:** Engram instalado y binario disponible.

**Pasos:**
1. Crear `qa-router`, `qa-orchestrator`, `qa-worker-basic`
2. Ejecutar "Setup Engram Memory"
3. Sincronizar los 3 agentes
4. Abrir chat: `@qa-router Necesito refactorizar el módulo de pagos, incluyendo tests y documentación`
5. Router evalúa e invoca `agent-teams-handoff`
6. Verificar en Engram que la clave `handoff:{taskId}` existe con el assessment
7. Nueva sesión con `@qa-orchestrator` abierta; prefijo `[Handoff:{taskId}]` en el mensaje
8. Orchestrator descompone la tarea y delega a `@qa-worker-basic`
9. Worker completa la tarea

**Resultado esperado:**
- Cadena completa de handoff funcional
- Context del router preservado y accesible por el orchestrator vía Engram

**Prioridad:** ⚠️ Alta

---

### E2E-003: Flujo de dispatch paralelo (orchestrator → workers → aggregator)

**Objetivo:** Verificar orquestación paralela completa de principio a fin.

**Prerrequisitos:** Engram instalado, MCP `agent-teams` disponible.

**Pasos:**
1. Crear y sincronizar: `qa-orchestrator`, `qa-worker-autonomous`, `qa-aggregator`
2. Verificar que `.vscode/mcp.json` y `.mcp.json` contienen entradas para `engram` y `agent-teams`
3. Chat: `@qa-orchestrator Analiza el módulo de frontend y el de backend en paralelo; necesito un informe consolidado`
4. Orchestrator invoca `agent-teams-dispatch-parallel` con 2 subtareas
5. Verificar ficheros en `.agent-teams/coordination/`
6. En cada sesión de worker: completar subtarea e invocar `complete_subtask`
7. TaskCoordinator detecta completitud → `@qa-aggregator` abierto automáticamente
8. Aggregator genera informe unificado

**Resultado esperado:**
- Ficheros de coordinación con estado correcto
- Aggregator produce output consolidado sin errores
- Flujo paralelo completo en una única sesión de trabajo

**Prioridad:** ⚠️ Alta

---

### E2E-004: Import/export y portabilidad entre workspaces

**Objetivo:** Verificar que los agentes pueden portarse entre workspaces.

**Prerrequisitos:** Dos workspaces disponibles (A y B).

**Pasos en Workspace A:**
1. Crear agentes `qa-worker-basic` y `qa-orchestrator`
2. Ejecutar "Capture Workspace into Catalog"
3. Dashboard → Import/Export → "Export Catalog" → guardar como `qa-agents-backup.json`

**Pasos en Workspace B:**
4. Abrir Workspace B (vacío)
5. Dashboard → Import/Export → "Import Catalog" → seleccionar `qa-agents-backup.json`
6. Verificar que ambos agentes aparecen en Agent Manager de Workspace B
7. Ejecutar sync en Workspace B

**Resultado esperado:**
- Agentes portados sin pérdida de configuración
- Sync genera ficheros correctos en Workspace B
- Contador de `added: 2, skipped: 0` en la importación

**Prioridad:** 🔵 Media

---

## Módulo 17: Casos borde y errores

### TC-170: Intent con formato incorrecto (no snake_case)

**Precondiciones:** Wizard abierto, paso Identity.

**Pasos:**
1. Introducir intent: `"MyIntent"` (camelCase) o `"my-intent"` (con guión)

**Resultado esperado:**
- Error de validación: intents deben ser snake_case (patrón `^[a-z0-9_]+$`)

**Prioridad:** ⚠️ Alta

---

### TC-172: Context pack ID con formato inválido

**Precondiciones:** Wizard paso Output & Context.

**Pasos:**
1. Introducir context pack ID: `"My Pack"` (espacio y mayúscula)

**Resultado esperado:**
- Error de validación: context pack IDs deben seguir `^[a-z0-9:_-]+$`

**Prioridad:** 🔵 Media

---

### TC-173: Semver inválido en campo version

**Precondiciones:** Edición de un agente.

**Pasos:**
1. Modificar manualmente el campo `version` a `"1.0"` (sin patch version)

**Resultado esperado:**
- Error de validación: `version` debe ser semver completo (`^[0-9]+\.[0-9]+\.[0-9]+$`)

**Prioridad:** 🔵 Media

---

### TC-174: Workspace sin profile.yml — degradación graceful

**Precondiciones:** Sin `.agent-teams/project.profile.yml`.

**Pasos:**
1. Abrir Dashboard sin profile inicializado
2. Intentar crear un agente

**Resultado esperado:**
- UI informa que el profile no existe, sugiriendo ejecutar "Initialize Project Profile"
- No se produce un error no manejado (crash)
- Si permite continuar, usa valores por defecto razonables

**Prioridad:** 🔵 Media

---

### TC-175: Agente con ID duplicado

**Precondiciones:** Agente `qa-worker-basic` ya existe.

**Pasos:**
1. Intentar crear un nuevo agente con id=`qa-worker-basic`

**Resultado esperado:**
- Error o advertencia clara de que el ID ya está en uso
- No se sobreescribe el agente existente sin confirmación

**Prioridad:** ⚠️ Alta

---

### TC-176: Dispatch paralelo sin Engram configurado

**Precondiciones:** Sin Engram en `.vscode/mcp.json`.

**Pasos:**
1. Invocar `agent-teams-dispatch-parallel`

**Resultado esperado:**
- Error descriptivo: Engram debe estar configurado para usar dispatch paralelo
- Sugerencia de ejecutar "Setup Engram Memory"

**Prioridad:** ⚠️ Alta

---

### TC-177: Profundidad máxima de handoff (límite: 3 niveles)

**Precondiciones:** Cadena de orchestrators configurada con 4 niveles.

**Pasos:**
1. Orchestrator A delega a B, B delega a C, C delega a D (nivel 4)

**Resultado esperado:**
- Error al intentar sobrepasar 3 niveles: "Max handoff depth exceeded"
- Delegación abortada con mensaje de error claro

**Prioridad:** ⚠️ Alta

---

### TC-178: Detección de loops en delegación

**Precondiciones:** Agente A configurado con `delegates_to: [B]`; Agente B con `delegates_to: [A]`.

**Pasos:**
1. A delega a B
2. B intenta delegar de vuelta a A

**Resultado esperado:**
- Loop detectado: "Same agent visited twice"
- Delegación abortada antes de ciclo infinito

**Prioridad:** ⚠️ Alta

---

### TC-179: YAML malformado en spec de agente

**Precondiciones:** Workspace con agentes válidos existentes.

**Pasos:**
1. Crear fichero `.agent-teams/agents/broken-agent.yml` con YAML malformado (indentación incorrecta)
2. Ejecutar "Reload Agents"

**Resultado esperado:**
- Error descriptivo en el Output channel indicando el fichero con error y la línea aproximada
- Los demás agentes válidos siguen cargando correctamente (error aislado)

**Prioridad:** ⚠️ Alta

---

### TC-180: Sync cuando el directorio target no existe

**Precondiciones:** Sin directorio `.github/agents/` en el workspace.

**Pasos:**
1. Ejecutar sync con target `copilot`

**Resultado esperado:**
- Directorio `.github/agents/` creado automáticamente
- Sync completado con éxito sin requerir acción manual del usuario

**Prioridad:** 🔵 Media

---

## Resumen de prioridades

| Prioridad | Símbolo | Casos |
|-----------|---------|-------|
| Alta | ⚠️ | TC-001/002/003, TC-010/011/012/013/014, TC-020/021/022/023/024/025, TC-029/030/031, TC-040/041/042/043/045/046, TC-050/051/053/054, TC-060/061, TC-070/071/072/073, TC-091, TC-110/111/112/113, TC-120/121/122/124, TC-130/131/132/133/134/135/136, TC-140/141/142, TC-170/175/176/177/178/179, E2E-001/002/003 |
| Media | 🔵 | TC-004, TC-015/016/017/018, TC-026/027/028, TC-044, TC-052, TC-062, TC-074/075, TC-080/081/083, TC-090/092/093, TC-100/101/102/103, TC-123, TC-150/151, TC-172/173/174/180, E2E-004 |
| Baja | 🟡 | TC-062, TC-076, TC-082, TC-094, TC-152/153 |

**Total de casos:** 93 TCs + 4 flujos E2E = **97 pruebas**

---

## Notas de ejecución

1. **Orden recomendado:** Ejecutar los módulos en orden numérico. Los módulos 13-14 requieren los módulos 12 (Engram) completados.
2. **Agentes de prueba:** Crear los 5 agentes al inicio antes de ejecutar los módulos 5+.
3. **Workspaces limpios:** Los flujos E2E están diseñados para workspaces limpios; usar uno diferente por cada E2E si es posible.
4. **Engram:** Los módulos 12, 13 y 14 requieren que Engram esté instalado localmente (`npm install -g engram` o equivalente).
5. **MCP agent-teams:** TC-113 y los flujos E2E-002/003 requieren la extensión compilada con `dist/mcp/dispatch-server.js` disponible.
