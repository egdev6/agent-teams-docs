---
sidebar_position: 99
title: Roadmap
description: Mejoras planificadas y fases de desarrollo
---

# Roadmap

Este documento recoge las mejoras identificadas para las próximas releases, priorizadas y organizadas por versión. Combina quick wins de UX, deuda técnica y nuevas funcionalidades.

---

## Criterios de priorización

| Criterio | Descripción |
|----------|-------------|
| **v1.2** | ✅ Completado. Gemini CLI + estabilización. |
| **v1.3** | Release en curso. Quick wins de UX, nuevos targets y primeras mejoras de calidad. |
| **v1.4** | Feature release. Funcionalidades nuevas de alto valor que requieren diseño y más superficie de cambio. |
| **v2.0** | Breaking changes. Deuda técnica mayor que implica cambios de arquitectura o incompatibilidades. |

---

## ✅ v1.2 — Gemini + Estabilización

> Completado. Todos los ítems entregados.

### ✅ Gemini CLI como sync target

Genera `GEMINI.md` en la raíz del proyecto con context packs inlineados por prioridad (esenciales siempre, estándar hasta el presupuesto, referencia como enlaces). Sin archivos de agente individuales, sin configuración MCP.

### ✅ Consistencia del tipo `SyncTarget`

Los nombres internos ahora coinciden con los del schema y la UI en todos los puntos del código (`github_copilot`, `claude_code`, `codex`, `gemini`). Los alias legacy (`copilot`, `claude`) en perfiles existentes se siguen aceptando automáticamente.

### ✅ File watcher para auto-refresh del dashboard

El dashboard se actualiza automáticamente cuando se modifican archivos en `.agent-teams/` desde fuera de la extensión (CLI, editor de texto, git checkout). Debounce de 150ms con reset acumulativo.

### ✅ Dry-run con diff coloreado en el CLI

`--dry-run` ahora muestra los cambios con prefijos `+` / `~` / `-` codificados por color, agrupados por target. El resumen de contadores también está coloreado.

---

## 🔄 v1.3 — Quick Wins, nuevos targets y preparación marketplace

> Release en curso.

### ✅ OpenAI Agents SDK como sync target

Genera `AGENTS.md` en la raíz del proyecto siguiendo el mismo patrón que Gemini. Sin archivos de agente individuales. Seleccionable en el Profile Editor junto al resto de targets.

### ✅ Tests para MergeEngine y ProfileLoader

Cobertura inicial con Vitest para las piezas más críticas del sistema:

- **MergeEngine**: las 3 estrategias (`team-priority`, `profile-priority`, `explicit-only`), conflict tracking, y estrategias de merge de arrays (`replace`, `concat`, `union`). También `createDiff`.
- **ProfileLoader**: perfil válido, caché, archivo inexistente, YAML malformado, y validación de schema (campos requeridos ausentes).

### ✅ Validación en tiempo real en el editor de agentes

Mostrar errores de schema inline mientras el usuario edita, sin esperar al guardado.

- Hook `useAgentFieldErrors` con debounce de 300ms para los campos: nombre (3–80 chars), descripción (10–600 chars), rol (enum) y pasos de workflow (mínimo 1)
- Errores mostrados bajo cada campo en los pasos `IdentityStep` y `WorkflowToolsStep`
- Los estilos de borde cambian a `border-destructive` en campos inválidos
- Disponible tanto en Crear Agente como en Editar Agente

---

### ✅ Badge "sin sincronizar" en agentes y equipos

Indicador visual cuando un agente o equipo ha sido editado desde el último sync.

- La extensión calcula `unsynced` comparando el `mtime` del archivo YAML con el timestamp del último sync
- Badge "Not synced" (icono CircleDot en ámbar) visible en:
  - `AgentManagerCard` (lista de agentes)
  - `TeamCard` (lista de equipos)
  - `TeamAgentsCard` (agentes dentro de un equipo en el dashboard)

---

### ✅ Preview de context packs antes de sync

Simula el algoritmo de budget antes de sincronizar para que el usuario vea exactamente qué packs se inlinarán vs referenciarán.

- Botón **Preview** en la sección Context Packs del Profile Editor
- Barra de progreso de caracteres usados vs presupuesto (`agents_md_budget`)
- Lista de packs **inlineados** (verde) y **referenciados** (ámbar) con prioridad y conteo de caracteres
- Nota separada para GitHub Copilot (sin límite de budget; copia todos los packs como archivos individuales)
- Se actualiza automáticamente al seleccionar/deseleccionar packs mientras el preview está abierto

---

### ✅ Exportar e importar perfiles como ZIP

Permite compartir un perfil completo (agentes, equipos y context packs) como archivo portable. Útil para onboarding de nuevos miembros o plantillas de proyecto.

**Alcance:**
- Exportar: empaqueta `.agent-teams/` en un ZIP descargable desde el dashboard
- Importar: despliega un ZIP sobre el directorio `.agent-teams/` con validación previa
- Conflictos de IDs: avisar antes de sobrescribir

**Archivos afectados:**
- `packages/extension/src/profileExporter.ts` → nuevo `ProfileExporter` (clase con `exportProfileAsZip` / `importProfileFromZip`)
- `packages/extension/src/dashboardPanel.ts` → mensajes `exportProfile` / `importProfile`
- `packages/webviews/src/pages/import-export/` → sección "Project Profile (ZIP)" en Import/Export page

---

### Preparación para publicación en VS Code Marketplace

Con v1.3 la extensión cubre 5 plataformas (Claude Code, Copilot, Codex, Gemini CLI, OpenAI Agents SDK), tiene tests y una UX más pulida. Es el momento de publicar como `preview` en el marketplace.

#### Metadatos del paquete (`packages/extension/package.json`)

- **`"preview": true`** — publicar inicialmente en modo preview
- **Descripción** — actualizar para reflejar el soporte multi-target:
  > *"Multi-platform agent orchestration for VS Code — compose, sync and manage AI agent teams across Claude Code, GitHub Copilot, Codex, Gemini CLI and OpenAI Agents SDK"*
- **Keywords** — añadir `claude`, `claude-code`, `gemini`, `openai`, `codex`, `multi-agent`, `agent-orchestration`
- **Categories** — valorar añadir `"Machine Learning"` junto a `AI`, `Chat`, `Other`

#### Assets visuales (requisito del marketplace)

- **Screenshots** (mínimo 2-3): dashboard principal, profile editor con los sync targets, skills browser
- **Demo GIF o vídeo corto** (recomendado): crear agente → asignar skills → sincronizar a múltiples targets
- Resolución recomendada: 1280×800px. Añadir en `media/screenshots/`

#### Pipeline de publicación

- Configurar `vsce` en el workflow de CI
- Secret `VSCE_TOKEN` en GitHub Actions con el PAT del publisher `egdev6`
- Job `publish` condicionado a tag `v*` en rama `main`

#### Checklist pre-publicación

- [ ] `"preview": true` añadido al `package.json`
- [ ] Descripción y keywords actualizados
- [ ] Screenshots y/o GIF añadidos
- [ ] README de extensión revisado
- [ ] `vsce package` genera el `.vsix` sin errores
- [ ] `.vscodeignore` cubre todos los archivos que no deben publicarse
- [ ] `VSCE_TOKEN` configurado en el repositorio
- [ ] Job de publicación en CI funcionando en dry-run

---

## v1.4 — Feature release

> Funcionalidades nuevas de alto valor que requieren diseño propio y más superficie de cambio.

### Custom Skills en el catálogo

Permitir al usuario crear skills propias y registrarlas como ciudadanas de primera clase, con el mismo flujo de asignación a agentes que las skills descargadas.

> El sync ya funciona: todo lo que esté en `.agent-teams/skills/` se copia a los targets. El trabajo está en la capa de creación y gestión.

**2.1 — Nuevo tipo de fuente `local` en el schema**

- `packages/core/schemas/skill-catalog-entry.schema.json` → añadir `'local'` al enum de `source.type`
- `packages/core/src/types/index.ts` → actualizar `CatalogSkillEntry` con `'local'` y campo `custom?: boolean`
- `packages/extension/src/types.ts` → idem

**2.2 — Backend: creación y gestión de custom skills**

- `packages/extension/src/skillsCatalog.ts`:
  - Nuevo método `createCustomSkill(id, title, description, content)` → escribe `SKILL.md` + `metadata.yml` sin fetch
  - Helper `isCustomSkill(entry)`
  - Proteger `deleteSkill()` para custom skills
- `packages/extension/src/skillsRegistry.ts`:
  - Bypass de validación para `source.type === 'local'`

**2.3 — CLI: comando `skills:custom:create`**

```bash
# Wizard interactivo
agent-teams skills:custom:create

# O importando un SKILL.md existente
agent-teams skills:custom:create --from-file ./my-skill.md --id my-skill --title "My Skill"
```

**2.4 — UI: gestión de custom skills en el Skills Browser**

Nuevos componentes:
- `SkillsBrowserCustomCard.tsx` → listado de custom skills con preview del `SKILL.md`
- `CreateCustomSkillModal.tsx` → campos (ID, title, description, tags) + editor Markdown del contenido

Modificados:
- `SkillsBrowserPage.tsx` → tercer tab "Custom Skills"
- `EditAgentSkillsCard.tsx` / `CreateAgentSkillsCard.tsx` → custom skills visibles en el browser de asignación

**2.5 — Portabilidad: control de versiones de custom skills**

- Toggle "Track custom skills in git" en el Profile Editor
- `teamManager.ts` excluye selectivamente custom skills del `.gitignore` según el toggle

**2.6 — Protección de skills descargadas modificadas**

- Detectar si el archivo difiere del hash original
- Marcar `modified: true` en `metadata.yml`
- Avisar en la UI antes de sobrescribir

---

### "Agent health check"

Comando que verifica que todos los agentes del proyecto son válidos: skills existentes, context packs disponibles, placeholders resueltos, sin conflictos de merge. Útil en pipelines CI.

```bash
agent-teams health-check
# VS Code: "Agent Teams: Run Health Check"
```

**Archivos afectados:**
- `packages/cli/src/tools/` → nuevo comando `health-check`
- `packages/extension/src/` → nuevo comando VS Code
- `packages/webviews/src/pages/dashboard/` → botón con resultados inline

---

### Historial de syncs

Registrar qué se sincronizó en cada target, con resumen de cambios y posibilidad de consultar el historial desde el dashboard.

**Alcance:**
- `.agent-teams/sync-history.json` con las últimas 20 entradas por target
- Cada entrada: timestamp, target, archivos creados/modificados/eliminados
- Panel de historial en el dashboard

**Archivos afectados:**
- `packages/extension/src/teamManager.ts` → escritura del historial
- `packages/webviews/src/pages/dashboard/` → panel de historial

---

## v2.0 — Deuda técnica mayor

> Cambios de arquitectura que pueden ser breaking o requieren coordinación amplia. Se agrupan en un major para gestionarlos juntos.

### Refactorizar `dashboardPanel.ts`

El archivo concentra toda la lógica de comunicación con el webview. Dificulta el mantenimiento y los code reviews.

**Acción:** extraer handlers por área funcional:
- `dashboardPanel.agents.ts`
- `dashboardPanel.teams.ts`
- `dashboardPanel.skills.ts`
- `dashboardPanel.profiles.ts`
- `dashboardPanel.ts` queda como orquestador/router de mensajes

---

### Deprecar soporte legacy `.agent-team/`

El directorio antiguo `.agent-team/` (sin 's') sigue soportado con múltiples rutas de fallback en todo el código.

**Plan:**
- v1.x: mostrar aviso de deprecación en dashboard y CLI cuando se detecte directorio legacy
- v2.0: eliminar todos los fallbacks, solo `.agent-teams/`
- Publicar guía de migración

---

### Protocolo de mensajes tipado entre Extension y Webview

Actualmente el paso de mensajes usa `event.data` con tipado débil. Un mensaje mal formado puede fallar silenciosamente.

**Acción:** definir un tipo discriminado exhaustivo `DashboardMessage` en `packages/core`, compartido entre extension y webviews.

---

### Agent versioning y constraints

El campo `version` existe en `AgentSpec` pero no se usa. Sin versiones, los overrides de equipo no pueden ser version-específicos.

**Alcance:**
- Activar `version` en la UI de creación/edición
- Soporte para `requires_agent_version` en team overrides
- Changelog por agente (último editor, fecha, descripción del cambio)

---

## Resumen

| Versión | Foco principal | Estado | Esfuerzo |
|---------|---------------|--------|----------|
| **v1.2** | Gemini CLI + estabilización | ✅ Completado | Bajo |
| **v1.3** | Quick wins UX + tests + nuevos targets | 🔄 En curso | Bajo-Medio |
| **v1.4** | Custom Skills + health check + historial | — | Alto |
| **v2.0** | Arquitectura + deuda técnica breaking | — | Alto |
