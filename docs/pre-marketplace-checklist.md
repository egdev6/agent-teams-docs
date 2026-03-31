# Pre-Marketplace QA Testing Checklist — Agent Teams

## Context
Checklist completo de pruebas para validar todas las funcionalidades del extension antes de publicar en el marketplace. Cubre todos los flujos de usuario documentados y funcionalidades del código.

### Leyenda de cobertura

| Marca | Significado |
|-------|-------------|
| `- [x]` | **Cubierto por E2E** — existe spec Playwright que lo verifica automáticamente |
| `- [ ]` | **Prueba manual** — requiere QA manual en cada release |
| ~~ítem~~ | **No automatizable** — depende de Copilot Chat, extensión VS Code, o IA |

Los specs viven en `packages/webviews/src/test/e2e/`. Ejecutar con:
```bash
pnpm test:e2e            # headless
pnpm test:e2e:ui         # con interfaz visual
```

---

## 0. Setup & Activación

> ⚠️ Esta sección requiere la extensión instalada — no es automatizable con Playwright WebView.

- [X] Instalar la extensión desde VSIX en VS Code limpio
- [X] El sidebar de Agent Teams aparece correctamente en la barra de actividades
- [X] Abrir el dashboard no lanza errores en la consola de Output (`Agent Teams`)
- [X] Los participantes de chat registran correctamente en **GitHub Copilot chat**: `@agent-teams.router`, `@agent-teams.agent-designer`, `@agent-teams.project-configurator`
- [X] Los slash commands registran correctamente en **Claude Code**: `/agent-designer`, `/project-configurator` disponibles en `.claude/commands/`
- [X] Los comandos de paleta están disponibles (`Agent Teams: Open Dashboard`, etc.)

---

## 1. Dashboard — Estado inicial (sin perfil)

- [x] La card "Configure Your Project" aparece cuando no existe `project.profile.yml` _(E2E: `dashboard/dashboard-states.spec.ts`)_
- [x] El botón "Auto-configure with AI" abre `@project-configurator` en el chat _(E2E: `dashboard/dashboard-states.spec.ts`)_
- [x] El botón "Configure manually" navega al Profile Editor _(E2E: `dashboard/dashboard-states.spec.ts`)_
- [x] Las stats muestran valores vacíos/cero sin errores _(E2E: `dashboard/dashboard-states.spec.ts`)_
- [x] No aparecen cards de Teams ni Consultant cuando no hay perfil _(E2E: `dashboard/dashboard-states.spec.ts`)_

---

## 2. Project Configurator (IA)

> ⚠️ Requiere Copilot Chat (`@` participant) o Claude Code CLI — no automatizable con Playwright WebView.

- [X] **Copilot chat:** `@project-configurator` detecta tecnologías, genera `project.profile.yml` y context packs
- [X] **Claude Code:** `/project-configurator` produce el mismo output
- [ ] Muestra diff si el perfil ya existe antes de sobreescribir
- [X] **Pide confirmación explícita** antes de escribir ficheros
- [ ] En monorepo: analiza cada sub-proyecto antes de sintetizar el perfil global

---

## 3. Profile Editor

- [x] Se abre desde el dashboard y carga el perfil existente correctamente _(E2E: `profile-editor/submit.spec.ts`, `accordion.spec.ts`)_
- [x] **Sección Basic Information:** editar id, name, version, type y guardar _(E2E: `profile-editor/submit.spec.ts`, `accordion.spec.ts`)_
- [x] **Sección Technologies:** togglear tecnologías manualmente + botón "Detect" auto-rellena _(E2E: `profile-editor/submit.spec.ts`)_
- [X] **Sección Paths:** añadir/editar/eliminar rutas + botón "Detect"
- [X] **Sección Commands:** añadir/editar/eliminar comandos + botón "Detect"
- [x] **Sección Context Packs:** seleccionar/deseleccionar packs activos _(E2E: `profile-editor/accordion.spec.ts`, `context-packs/context-packs.spec.ts`)_
  - [x] El botón "Preview" muestra barra de progreso de budget (8000 chars por defecto) _(E2E: `profile-editor/context-packs-budget.spec.ts`)_
  - [x] Packs esenciales siempre aparecen en verde (Inlined) _(E2E: `profile-editor/context-packs-budget.spec.ts`)_
  - [x] Packs que superan el budget aparecen en ámbar (Referenced) _(E2E: `profile-editor/context-packs-budget.spec.ts`)_
- [x] **Sección Sync Targets:** seleccionar/deseleccionar targets (Claude Code, Copilot, Codex, Gemini, OpenAI) _(E2E: `profile-editor/sync-targets.spec.ts`)_
  - [x] Toggle "Add to .gitignore" funciona por target _(E2E: `profile-editor/sync-targets.spec.ts`)_
- [X] **Sección Gitignore:** toggle `.agent-teams/` al gitignore funciona
- [x] Guardar el perfil actualiza el fichero `project.profile.yml` _(E2E: `profile-editor/submit.spec.ts`)_
- [X] Errores de validación aparecen inline (id sin kebab-case, campos requeridos vacíos)

---

## 4. Agentes — Creación Manual (Wizard)

### Paso 1 — Identity
- [x] Campos: name, role, domain, subdomain, description _(E2E: `agent-wizard/field-validation.spec.ts`)_
- [x] Seleccionar rol `router` oculta los pasos Scope y Skills _(E2E: `agent-wizard/role-step-visibility.spec.ts`)_
- [x] Seleccionar rol `router` → contador "Step 1 of 4" _(E2E: `agent-wizard/role-step-visibility.spec.ts`)_
- [X] Seleccionar rol `orchestrator` oculta subdomain en el payload
- [x] Seleccionar rol `worker` muestra todos los pasos (Step 1 of 6) _(E2E: `agent-wizard/role-step-visibility.spec.ts`)_

### Paso 2 — Scope (solo worker)
- [x] Añadir expertise como chips _(E2E: `agent-wizard/scope-step.spec.ts`)_
- [x] Añadir intents — error "Add at least one intent" si no hay ninguno (worker) _(E2E: `agent-wizard/scope-step.spec.ts`, `field-validation.spec.ts`)_
- [ ] Validación snake_case de intents en tiempo real, 300ms debounce _(no implementado en el código actual)_
- [ ] Error inline si un intent no es snake_case _(no implementado en el código actual)_
- [ ] Añadir topics (chip input)
- [x] Añadir path globs — visible para worker, oculto para orchestrator _(E2E: `agent-wizard/scope-step.spec.ts`)_
- [x] Scope Excludes — visible para worker, oculto para orchestrator _(E2E: `agent-wizard/scope-step.spec.ts`)_

### Paso 3 — Workflow & Tools
- [x] Añadir steps de workflow (texto libre) _(E2E: `agent-wizard/field-validation.spec.ts`)_
- [x] Seleccionar tools del grid (read, edit, search, execute, browser, web, agent, todo) _(E2E: `agent-wizard/tools-checkboxes.spec.ts`)_
- [x] Sección MCP Servers: error inline si el env JSON es inválido (al guardar) _(E2E: `agent-wizard/mcp-server-env.spec.ts`)_

### Paso 4 — Skills
- [x] Listar skills del proyecto _(E2E: `agent-wizard/skills-step.spec.ts`)_
- [x] Botón "Browse registry" abre Skills Browser _(E2E: `agent-wizard/skills-step.spec.ts`)_
- [x] Asignar skill con condición `when` _(E2E: `agent-wizard/skills-step.spec.ts`)_
- [x] Estado vacío muestra "Browse registry" cuando no hay skills _(E2E: `agent-wizard/skills-step.spec.ts`)_

### Paso 5 — Rules (solo worker)
- [ ] Constraints: always, never, escalate (chips)
- [ ] Handoffs: receives_from, delegates_to, escalates_to
- [x] Engram mode: default / autonomous (descripción cambia según rol) _(E2E: `agent-wizard/engram-by-role.spec.ts`)_
- [ ] Permissions: can_edit_files, can_create_files, etc.

### Paso 6 — Output & Context
- [ ] Output template, mode, max_items, never_include
- [ ] Seleccionar context packs para el agente
- [ ] Sync targets por agente
- [ ] Sección Claude Code settings (colapsable): claude_model, claude_max_turns, claude_effort, claude_permission_mode, claude_disallowed_tools, claude_background

### Guardado
- [x] El botón "Save" está deshabilitado si faltan campos requeridos (con tooltip explicativo) _(E2E: `agent-wizard/save-button.spec.ts`)_
- [x] El ID se auto-deriva del nombre en kebab-case _(E2E: `agent-wizard/save-button.spec.ts`)_
- [x] Error si el ID ya existe (colisión — respuesta de la extensión) _(E2E: `agent-wizard/save-button.spec.ts`)_
- [ ] El ID debe cumplir `^[a-z0-9-]+$` (validación visual en UI)

---

## 5. Agentes — Edición

- [x] Editar un agente existente carga todos sus campos en el wizard _(E2E: `edit-agent/edit-agent-fields.spec.ts`)_
- [ ] Todos los pasos son editables
- [x] El ID del agente se preserva en el payload `saveAgent` (no editable) _(E2E: `edit-agent/edit-agent-fields.spec.ts`)_
- [ ] La versión del agente se preserva al guardar
- [ ] Agentes importados reciben tools por defecto según el rol
- [x] Confirmar antes de eliminar (con dialog de confirmación) _(E2E: `edit-agent/edit-agent-fields.spec.ts`)_

---

## 6. Agentes — Agent Designer (IA)

> ⚠️ Requiere Copilot Chat (`@` participant) o Claude Code CLI — no automatizable con Playwright WebView.

- [X] **Copilot chat:** `@agent-designer` genera YAML fenced válido sin prosa extra
- [ ] **Claude Code:** `/agent-designer` produce el mismo YAML
- [X] En ambos: evita colisión de IDs, intents en snake_case, solo referencia skills instaladas
- [ ] **Importar `.agent.md` de Copilot** → YAML AgentSpec equivalente generado
- [ ] **Importar `.md` de Claude Code** → YAML AgentSpec equivalente generado

---

## 7. Teams — Creación

- [x] Wizard de creación (3 pasos: Basics, Members, Summary) _(E2E: `create-team/create-team.spec.ts`)_
- [x] Paso Basics: name, description con validación (id kebab-case) _(E2E: `create-team/create-team.spec.ts`)_
- [x] Paso Members: lista todos los agentes disponibles para seleccionar _(E2E: `create-team/create-team.spec.ts`)_
  - [ ] Si no hay agentes, muestra acceso directo a "Create Agent"
- [x] Paso Summary: preview en tiempo real en el sidebar (nombre, descripción, miembros) _(E2E: `create-team/team-summary-preview.spec.ts`)_
- [x] Guardar envía `createTeam` con teamId y name correctos _(E2E: `create-team/create-team.spec.ts`)_

---

## 8. Teams — Gestión

- [x] Team Manager lista todos los equipos con nombre y descripción _(E2E: `team-manager/actions.spec.ts`)_
- [ ] Editar equipo: habilitar/deshabilitar agentes, overrides por agente
- [x] Botón "Set as Active" designa el equipo para sync _(E2E: `team-manager/actions.spec.ts`)_
  - [x] Solo un equipo puede estar activo a la vez (botón deshabilitado para el activo) _(E2E: `team-manager/actions.spec.ts`)_
  - [ ] El dashboard muestra el equipo activo en Stats
- [ ] Eliminar equipo con confirmación
- [x] Badge "Not synced" cuando el YAML fue modificado tras el último sync _(E2E: `team-manager/not-synced-badge.spec.ts`)_

---

## 9. Sync — Operación

> ⚠️ Requiere escritura en disco vía extension host — no automatizable con Playwright WebView.

- [x] La card "Sync Status" del dashboard muestra pending changes _(E2E: `agent-manager/actions.spec.ts` — botón "Sync Now")_
- [ ] **Claude Code target:**
  - [ ] Genera `.claude/agents/<id>.md` por agente
  - [ ] Genera `.claude/AGENTS.md` root
  - [ ] Hace merge de `mcpServers` en `.mcp.json` (sin sobreescribir por id)
  - [ ] Traduce tool names (read→Read, edit→Edit, search→Grep+Glob, execute→Bash, etc.)
- [ ] **GitHub Copilot target:**
  - [ ] Genera `.github/agents/<id>.agent.md` por agente
  - [ ] Genera `.github/agents/AGENTS.md`
  - [ ] Copia context packs a `.github/context/`
  - [ ] Hace merge de `mcpServers` en `.vscode/mcp.json` (`servers` key)
  - [ ] No aplica budget limit a context packs
- [ ] **Codex/OpenAI target:** genera `AGENTS.md` root único con packs inlineados por prioridad
- [ ] **Gemini CLI target:** genera `GEMINI.md` root único
- [ ] Context pack budget: esenciales siempre inlineados, standard hasta budget, reference como headings
- [ ] Dry-run muestra diff con cambios coloreados sin escribir ficheros

---

## 10. Skills Browser

- [x] **Tab "Project Skills":** lista skills del `skills.registry.yml` local _(E2E: `skills-browser/skills-browser.spec.ts`)_
  - [x] Búsqueda por nombre/keyword funciona _(E2E: `skills-browser/skills-browser.spec.ts`)_
  - [x] Filtro por categoría _(E2E: `skills-browser/skills-browser.spec.ts`)_
  - [x] Botón Refresh actualiza la lista _(E2E: `skills-browser/skills-browser.spec.ts`)_
  - [x] Eliminar skill funciona _(E2E: `skills-browser/skills-browser.spec.ts`)_
- [x] **Tab "Explore":** navega el registro comunitario _(E2E: `skills-browser/skills-browser.spec.ts`)_
  - [x] Búsqueda funciona _(E2E: `skills-browser/skills-browser.spec.ts`)_
  - [x] Botón Install instala la skill localmente _(E2E: `skills-browser/skills-browser.spec.ts`)_
  - [x] Paginación funciona _(E2E: `skills-browser/skills-browser.spec.ts`)_
- [x] Instalar una skill desde el wizard de agente (flujo directo) _(E2E: `agent-wizard/skills-step.spec.ts`)_

---

## 11. Context Packs

- [x] Listar todos los context packs del workspace _(E2E: `context-packs/context-packs.spec.ts`)_
- [x] Toggle on/off por pack _(E2E: `context-packs/context-packs.spec.ts`)_
- [x] Cambiar prioridad (essential/standard/reference) por pack _(E2E: `context-packs/context-packs.spec.ts`)_
- [ ] Header muestra estado del `agents_md_budget`
- [x] **Crear nuevo pack:** nombre + prioridad → fichero `.agent-teams/context-packs/{name}.md` creado _(E2E: `context-packs/context-packs.spec.ts`)_
- [ ] **Importar markdown:** seleccionar `.md` existente → se convierte en pack
- [ ] **Template processing en packs:**
  - [ ] `{{path:src}}`, `{{command:build}}`, `{{project:name}}` se resuelven
  - [ ] `{{#if technology:react}}...{{/if}}` funciona condicionalmente
  - [ ] `{{#each technologies}}` genera la lista correcta
  - [ ] Include anidado: `{{include:project:pack-name}}`
  - [ ] Filtros: `{{uppercase:texto}}`
- [ ] Máximo 5 niveles de include anidado (no stack overflow)

---

## 12. Consultant (IA)

> ⚠️ Solo disponible como participante `@` en GitHub Copilot chat — no automatizable con Playwright WebView.

- [ ] Aparece la card "Consult your team" cuando hay perfil + agentes
- [ ] **Copilot chat:** todos los modos funcionan correctamente
- [ ] Es read-only (nunca modifica ficheros directamente)
- [ ] Las propuestas son concretas (id, role, domain, intents) y apuntan a `@agent-designer`

---

## 13. Chat Participants & Routing

> ⚠️ Solo disponible como participante `@` en GitHub Copilot chat — no automatizable con Playwright WebView.

- [ ] **Copilot chat:** `@agent-teams.router` enruta correctamente según intents, path globs y domain
- [ ] Handoff via `agent-teams-handoff` (single agent) funciona
- [ ] Handoff via `agent-teams-dispatch-parallel` (multi-dominio) funciona
- [ ] Protección contra loops: máximo 3 niveles de handoff depth
- [ ] Detección de agentes visitados (no loops infinitos)

---

## 14. Engram Integration

> ⚠️ El flujo de sesión real (mem_session_start, mem_context, etc.) requiere MCP activo — no automatizable con Playwright WebView.

- [x] Engram no visible en wizard si `engramConfigured=false` _(E2E: `agent-wizard/engram-by-role.spec.ts`)_
- [ ] Banner de Engram aparece en dashboard cuando no está configurado
- [ ] Comando `Agent Teams: Setup Engram` detecta versión instalada
  - [ ] Warning si versión < 1.9.9 con link de descarga
- [ ] **Flujo de sesión de agentes:**
  - [ ] `mem_session_start` al inicio de la sesión
  - [ ] `mem_context` recupera estado previo
  - [ ] `mem_search` encuentra trabajo relacionado
  - [ ] `mem_save` persiste hallazgos
  - [ ] `mem_session_end` cierra la sesión
- [x] **Worker en modo autonomous:** descripción del toggle cambia según rol _(E2E: `agent-wizard/engram-by-role.spec.ts`)_
  - [ ] El worker recibe el tool `agent-teams-complete-subtask`
  - [ ] Llama `complete_subtask` al terminar
  - [ ] Recupera contexto de tarea con prefijos `[Handoff:{taskId}]` o `[Parallel:{taskId}]`
- [ ] MCP servers de Engram se mergean correctamente en sync (Copilot → `.vscode/mcp.json`, Claude → `.mcp.json`)

---

## 15. Parallel Dispatch & Aggregator

> ⚠️ Solo disponible vía `@router` en GitHub Copilot chat — no automatizable con Playwright WebView.

- [ ] Router usa `agent-teams-dispatch-parallel` para tareas multi-dominio
- [ ] Múltiples orchestrators/workers se ejecutan en paralelo
- [ ] El Aggregator espera a que todos los subtasks completen
- [ ] El Aggregator detecta conflictos (mismo fichero tocado por múltiples orchestrators)
- [ ] El Aggregator persiste el resultado merged en Engram bajo `task:{taskId}:result`
- [ ] El rol `aggregator` se genera correctamente en los ficheros de sync

---

## 16. Import / Export

- [x] **Export Profile (ZIP):** botón envía `exportProfile` _(E2E: `import-export/import-export.spec.ts`)_
- [ ] **Import Profile (ZIP):** importa y detecta conflictos antes de sobreescribir _(requiere OS file picker — manual)_
  - [ ] Confirmación requerida para sobreescribir
- [x] **Export Catalog (JSON):** botón envía `exportCatalog` _(E2E: `import-export/import-export.spec.ts`)_
- [ ] **Import Catalog (JSON):** importa de forma no-destructiva (additive) _(requiere OS file picker — manual)_
- [ ] **Reset Catalog:** elimina el catálogo completo (pide confirmación)

---

## 17. Validación de Schemas

- [x] AgentSpec: campos requeridos (name, role, description) generan error inline _(E2E: `agent-wizard/field-validation.spec.ts`)_
- [x] AgentSpec: id se genera en formato `^[a-z0-9-]+$` (derivado del nombre) _(E2E: `agent-wizard/save-button.spec.ts`)_
- [ ] AgentSpec: intents snake_case `^[a-z0-9_]+$` _(no implementado en el código actual)_
- [ ] ProjectProfile: campos requeridos (project.id, project.name, project.version)
- [ ] TeamProfile: campos requeridos (id, name)
- [x] MCP server env inválido muestra error al guardar _(E2E: `agent-wizard/mcp-server-env.spec.ts`)_
- [ ] Errores de schema muestran mensajes útiles en la UI (agentes importados con YAML malformado)

---

## 18. File Watchers & Auto-refresh

> ⚠️ Los watchers de ficheros externos requieren extension host — no automatizable con Playwright WebView.

- [x] Badge "Not synced" aparece en agents/teams modificados _(E2E: `agent-manager/not-synced-badge.spec.ts`, `team-manager/not-synced-badge.spec.ts`)_
- [ ] Editar un `.yml` de agente fuera del dashboard actualiza el dashboard (debounce 150ms)
- [ ] Editar `project.profile.yml` fuera del dashboard actualiza el Profile Editor
- [x] Badge "Local only" aparece en entidades en disco pero no en catálogo _(E2E: `team-manager/not-synced-badge.spec.ts`)_
- [ ] `Agent Teams: Reload Agents` fuerza recarga sin reiniciar VS Code

---

## 19. Error Handling

- [x] Orphan Notification Card aparece cuando hay entidades huérfanas detectadas _(E2E: `dashboard/orphan-notification.spec.ts`)_
- [x] Botón "Import to catalog" envía `preserveOrphans` _(E2E: `dashboard/orphan-notification.spec.ts`)_
- [x] Campos requeridos vacíos bloquean el guardado con mensaje explicativo _(E2E: `agent-wizard/field-validation.spec.ts`, `agent-wizard/save-button.spec.ts`)_
- [ ] YAML malformado en un agente no rompe la extensión (error graceful)
- [ ] IDs duplicados: el primero encontrado gana, el duplicado se ignora silenciosamente
- [ ] Errores de sync se muestran inline en el dashboard

---

## 20. Bundled Agents — Materialización

> ⚠️ Requiere activación de la extensión VS Code — no automatizable con Playwright WebView.

- [ ] Los bundled agents se copian a `.claude/commands/{id}.md` al activar la extensión
- [ ] `/agent-designer` funciona como slash command en Claude Code
- [ ] `/project-configurator` funciona como slash command en Claude Code
- [ ] Los tools de VS Code se eliminan del workflow en la versión Claude Code
- [ ] Las skills se inlinean correctamente en los slash commands

---

## 21. Regresión — Flujos End-to-End

### Flujo 1: Proyecto desde cero

**1a — vía GitHub Copilot chat:**
1. [x] Clic "Auto-configure with AI" → se abre Copilot chat _(E2E: `dashboard/dashboard-states.spec.ts`)_
2. [ ] Confirmar → `project.profile.yml` y context packs creados _(requiere extension + AI)_
3. [ ] "Design with AI" → Copilot chat con `@agent-designer` → guardar YAML _(requiere AI)_
4. [ ] Crear team → Set as Active → Sync _(sync requiere extension host)_

**1b — vía Claude Code:**
1. [ ] En Claude Code: `/project-configurator` → confirmar → ficheros creados _(requiere extension)_
2. [ ] En Claude Code: `/agent-designer crea un agente worker para el dominio principal` _(requiere AI)_
3. [x] Crear team y sync desde la UI del dashboard _(E2E: `create-team/create-team.spec.ts`, `team-manager/actions.spec.ts`)_

### Flujo 2: Edición y re-sync
1. [x] Editar un agente existente (cambiar description e intents) _(E2E: `edit-agent/edit-agent-fields.spec.ts`)_
2. [x] Dashboard muestra badge "Not synced" _(E2E: `agent-manager/not-synced-badge.spec.ts`)_
3. [ ] Sync Status muestra el agente como "update" _(requiere extension host)_
4. [ ] Sync → fichero actualizado con los nuevos campos _(requiere extension host)_

### Flujo 3: Multi-target sync
> ⚠️ Requiere extension host para escritura de ficheros — manual.
1. [ ] Activar targets: Claude Code + Copilot + Gemini
2. [ ] Sync → verificar que se crean `.claude/agents/`, `.github/agents/`, `GEMINI.md`
3. [ ] Context packs con budget: verificar overflow como reference en Gemini
4. [ ] Copilot: verificar no hay límite de budget y context packs se copian a `.github/context/`

### Flujo 4: Consultant → Agent Designer

**4a — vía GitHub Copilot chat:**
> ⚠️ Requiere Copilot Chat — manual.
1. [ ] `@consultant AUTO` → identifica gap
2. [ ] `@agent-designer <propuesta del consultant>` → YAML generado
3. [ ] Guardar agente → añadir al team → sync

**4b — vía Claude Code** (sin consultant, ir directo al designer):
1. [ ] `/agent-designer crea un agente de testing` → YAML generado _(requiere Claude Code CLI)_
2. [x] Guardar agente → añadir al team → sync _(E2E: `agent-wizard/save-button.spec.ts`, `create-team/create-team.spec.ts`)_

### Flujo 5: Import/Export
1. [x] Export Profile → botón envía `exportProfile` _(E2E: `import-export/import-export.spec.ts`)_
2. [ ] Limpiar `.agent-teams/` del workspace
3. [ ] Import Profile desde el ZIP → todo restaurado correctamente _(requiere OS file picker — manual)_

---

## Notas de Testing

- Probar en repos reales con distinta estructura (monorepo, single package, Python, etc.)
- Verificar en VS Code 1.112.0 (versión mínima soportada)
- Revisar Output channel "Agent Teams" para logs de errores durante cada prueba
- Para tests de sync: verificar que los ficheros generados son válidos para cada plataforma destino
