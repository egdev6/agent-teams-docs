# Agentes

**Estado:** 🧪 Beta

Los agentes son el bloque fundamental de Agent Teams. Cada agente es un participante de chat de GitHub Copilot con un rol definido, skills, reglas de routing y context packs opcionales.

---

## Crear un Agente

Abre el dashboard y navega a **Agent Manager** → **Create Agent**, o usa la tarjeta de **Acciones Rápidas** en la página de inicio.

El encabezado de la página Agent Manager también incluye el botón **Design a new agent with AI** que abre `@agent-designer` directamente en Copilot Chat — útil cuando quieres que la IA redacte la especificación primero.

El wizard te guía a través de 6 pasos:

<img width="1171" alt="imagen" src="/img/docs/agents-overview.png" style={{ height: "auto" }} />

### Paso 0 — Identidad

| Campo | Descripción |
|---|---|
| **Nombre** | Nombre mostrado en Copilot Chat |
| **Rol** | `router`, `orchestrator`, `worker` o `aggregator` (ver [Roles](#roles-de-agente)) |
| **Descripción** | Qué hace el agente — se muestra en la lista de participantes del chat |
| **Dominio** | Dominio principal (p. ej. `frontend`, `backend`, `testing`) |
| **Subdominio** | Especialización opcional dentro del dominio (oculto para `router` y `orchestrator`) |

### Paso 1 — Alcance

> **Nota:** Este paso está oculto para los agentes `router` — los routers reciben todos los mensajes de `@router` y no necesitan filtros de alcance.

Define cuándo este agente es activado por el `@router`.

| Campo | Descripción |
|---|---|
| **Áreas de expertise** | Temas en los que el agente es experto (entrada de etiquetas) |
| **Intenciones** | Verbos de acción a los que responde el agente (p. ej. `write`, `review`, `fix`) |
| **Temas** | Palabras clave que activan el routing (p. ej. `react`, `database`) |
| **Patrones glob de archivos** | Rutas de archivo que activan este agente, con un nivel de prioridad por patrón |
| **Patrones excluidos** | Rutas de archivo a excluir explícitamente del routing |

### Paso 2 — Workflow y Herramientas

| Campo | Descripción |
|---|---|
| **Pasos del workflow** | Lista ordenada de pasos que sigue el agente al gestionar una tarea |
| **Herramientas** | Capacidades que puede usar el agente. Las herramientas integradas de VS Code (`read`, `edit`, `search`, `execute`, `browser`, `agent`, `web`, `todo`, `vscode`, `complete-subtask`) se muestran como una cuadrícula de casillas. Las herramientas personalizadas o de extensión se añaden como filas de texto libre debajo. Cada herramienta tiene una condición `when` opcional |
| **Servidores MCP** | *(Desplegable)* Servidores MCP requeridos por este agente. En cada sync se fusionan (por `id`) en `.vscode/mcp.json` (Copilot) o `.mcp.json` (Claude). Las entradas nuevas se agregan; las existentes nunca se sobreescriben |

> **Nombres de herramientas heredados:** Las specs de agente que referencian los nombres compuestos anteriores (`search/codebase`, `edit/editFiles`) se normalizan automáticamente a sus equivalentes cortos actuales (`search`, `edit`) durante el sync — no es necesario actualizar manualmente los archivos YAML existentes.

### Paso 3 — Skills

> **Nota:** Este paso está oculto para los agentes `router` — los routers usan herramientas de despacho (`agent-teams-handoff`, `agent-teams-dispatch-parallel`) en lugar de skills de dominio.

Explora y añade skills de dos fuentes:

- **Skills del proyecto** — skills definidas en tu `skills.registry.yml` local
- **Registro comunitario** — instala skills del registro compartido directamente desde este paso

Cada tarjeta de skill muestra su **título**, categoría, nivel de seguridad y roles recomendados. Selecciona las skills relevantes para el propósito de este agente.

### Paso 4 — Reglas

> **Nota:** Los permisos y restricciones están ocultos para los agentes `router` — su comportamiento está gobernado enteramente por las herramientas de despacho.

| Sección | Descripción |
|---|---|
| **Permisos** | Qué puede hacer el agente |
| **Restricciones — Siempre** | Reglas que el agente debe seguir siempre |
| **Restricciones — Nunca** | Acciones que el agente nunca debe realizar |
| **Restricciones — Escalar** | Situaciones en las que el agente debe delegar a un humano |
| **Handoffs — Recibe de** | Qué agentes pueden delegar en este |
| **Handoffs — Delega a** | A qué agentes puede delegar este |
| **Handoffs — Escala a** | A qué agentes o roles escalar cuando está bloqueado |
| **Engram** | Activa **Contexto de tarea autónomo** para habilitar el despacho directo. Disponible para todos los roles — el texto descriptivo del toggle se actualiza para describir el comportamiento según el rol actual. Los workers recuperan el contexto de tarea desde Engram al inicio de la sesión y llaman a `complete_subtask` automáticamente al terminar. **Opt-in por agente:** un agente que declara `engram` en su lista `mcpServers` recibe las funciones de memoria Engram aunque no haya un servidor MCP de Engram configurado globalmente en el workspace — permitiendo agentes autónomos que arrancan en una máquina sin configuración previa |

### Paso 5 — Salida y Contexto

> **Nota:** Los campos Máx. elementos y Nunca incluir están ocultos para los agentes `router` — los routers producen una acción de despacho, no una respuesta de texto estructurada.

| Campo | Descripción |
|---|---|
| **Plantilla de salida** | Formato de respuesta del agente |
| **Modo de salida** | `short` o `detailed` |
| **Máx. elementos** | Número máximo de elementos a incluir en una respuesta de lista |
| **Nunca incluir** | Campos a omitir en la salida del agente |
| **Context packs** | Context packs a incrustar en la spec del agente |
| **Destinos de sync** | A qué herramientas sincronizar: Claude Code, Codex, GitHub Copilot |

Una vista previa en tiempo real de la configuración del agente aparece en el panel lateral derecho durante todo el wizard. Haz clic en **Create** cuando termines — la spec del agente se escribe en `.agent-teams/agents/<id>.yml`.

---

## Gestionar Agentes

### Ver Todos los Agentes

Dashboard → **Agent Manager** muestra todos los agentes cargados organizados en tres pestañas — **Router**, **Orchestrator** y **Worker** — cada una con un contador en tiempo real. Se muestra un mensaje de estado vacío por pestaña cuando no hay agentes de ese rol.

El encabezado de la página tiene dos botones: **Create Agent** (abre el wizard) y **Design a new agent with AI** (abre `@agent-designer` en Copilot Chat).

### Editar un Agente

1. Dashboard → **Agent Manager** → selecciona agente → **Edit**
2. Los 6 pasos del wizard están disponibles para modificación
3. Guarda — los cambios se escriben de vuelta en el archivo YAML de la spec

<img width="1183" alt="imagen" src="/img/docs/agents-forms.png" style={{ height: "auto" }} />

### Insignia "No sincronizado"

Los agentes cuya especificación de origen fue modificada después del último sync exitoso muestran una insignia **No sincronizado** (indicador naranja) en la tarjeta del Agent Manager. Sincroniza el equipo para eliminar la insignia.

### Sincronizar Agentes a `.github/agents/`

Cuando los agentes están listos, sincronízalos para generar los archivos markdown finales usados por GitHub Copilot:

1. Página de inicio del dashboard → la tarjeta **Sync Status** muestra los cambios pendientes
2. Haz clic en el botón **Sync** para aplicar todos los cambios
3. El dashboard actualiza la tarjeta de estadísticas para reflejar el nuevo estado del sync

> **Previsualizar antes de sincronizar:** la tarjeta Sync Status muestra un desglose de qué agentes se crearán, actualizarán u omitirán antes de confirmar.

---

## Roles de Agente

| Rol | Propósito |
|---|---|
| `router` | Recibe todos los mensajes de `@router` y delega mediante `agent-teams-handoff` (dominio único) o `agent-teams-dispatch-parallel` (multi-dominio) |
| `orchestrator` | Coordina tareas multi-paso entre varios agentes worker dentro de un dominio |
| `worker` | Gestiona una tarea de dominio específica y enfocada |
| `aggregator` | Recoge los resultados de orchestrators en paralelo, detecta conflictos y devuelve una respuesta unificada |

---

## Usar un Agente en Copilot Chat

Cada agente cargado se registra como participante de chat dinámico:

```
@my-agent  ¿Cuál es la mejor forma de estructurar este componente React?
```

Usa `@router` para que la extensión seleccione automáticamente el agente más relevante en función de tu mensaje y del archivo activo:

```
@router  Ayúdame a escribir un test unitario para esta función.
```

El router puntúa los agentes por palabras clave de intención, patrones de ruta de archivo, vocabulario de dominio y rol — y delega al que obtiene mayor puntuación.

<img width="535" alt="imagen" src="/img/docs/agents-status.png" style={{ height: "auto" }} />

---

## Referencia: Formato YAML del Agente

El dashboard escribe y lee este formato automáticamente. También puedes editar el archivo directamente en VS Code — los cambios se recogen en el siguiente sync o al ejecutar **Reload Agents**.

```yaml
id: my-agent
name: My Agent
description: Descripción breve de lo que hace este agente
role: worker          # router | orchestrator | worker | aggregator

skills:
  - code_analysis
  - file_operations

routing:
  keywords:
    - component
    - react
    - frontend
  paths:
    - src/components/**

context_packs:
  - frontend-conventions
```

### Campos

| Campo | Requerido | Descripción |
|---|---|---|
| `id` | ✅ | Identificador único (kebab-case) |
| `name` | ✅ | Nombre mostrado en Copilot Chat |
| `description` | ✅ | Qué hace el agente |
| `role` | ✅ | `router`, `orchestrator`, `worker` o `aggregator` |
| `skills` | — | Lista de IDs de skills del registro |
| `routing.keywords` | — | Palabras que activan el routing hacia este agente |
| `routing.paths` | — | Patrones glob para routing basado en archivo |
| `context_packs` | — | IDs de context packs a incluir en las respuestas |
| `engram.mode` | — | `default` o `autonomous`. Ver [Modo Autónomo de Engram](#modo-autónomo-de-engram) |
| `mcpServers` | — | Lista de servidores MCP a fusionar en la configuración MCP del proyecto en cada sync. Ver [Servidores MCP](#servidores-mcp) |

---

## Modo Autónomo de Engram

Los agentes worker pueden configurarse en **modo autónomo** cuando [Engram](https://github.com/EngineeredMonkey/engram) está configurado. Esto permite que el worker sea despachado directamente — sin pasar por un router u orchestrator — y gestione su propio ciclo de vida de tarea.

```yaml
id: my-worker
name: My Worker
role: worker
engram:
  mode: autonomous
```

En este modo el worker:

1. **Recupera el contexto de tarea desde Engram al inicio de la sesión:**
   - Si el chat contiene `[Handoff:{taskId}]` — recupera los detalles completos de la tarea escritos por el despachante.
   - Si el chat contiene `[Parallel:{taskId}]` — recupera sus instrucciones específicas de subtarea.
   - En caso contrario, carga solo los patrones de dominio.
2. **Señala la complección automáticamente** — tras persistir su resultado en Engram, llama a `complete_subtask` para notificar al agregador.
3. **Recibe la herramienta `complete-subtask` automáticamente** — no se requiere configuración manual de herramientas.

> **Cuándo usarlo:** elige el modo autónomo para workers que se despachan directamente mediante `agent-teams-dispatch-parallel` en flujos multi-dominio donde no se necesita un orchestrator intermedio. Para flujos estándar router → orchestrator → worker, el modo por defecto es suficiente.

Para activarlo en el wizard, ve al **Paso 4 — Reglas** y marca **Engram → Contexto de tarea autónomo** (requiere Engram configurado).

---

## Servidores MCP

Los agentes pueden declarar los servidores MCP de los que dependen. Cuando se sincroniza un equipo, Agent Teams fusiona esos servidores en la configuración MCP del proyecto automáticamente — de modo que todos los colaboradores dispongan de las herramientas correctas sin configuración manual.

```yaml
id: my-worker
role: worker
mcpServers:
  - id: my-mcp-server
    command: npx -y my-mcp-server
    args:
      - --port
      - "3000"
    env:
      API_KEY: "${MY_API_KEY}"
```

**Comportamiento de la fusión:**
- Destino Copilot → se fusiona en `.vscode/mcp.json` bajo la clave `servers`
- Destino Claude → se fusiona en `.mcp.json` en la raíz del proyecto bajo la clave `mcpServers`
- La clave de fusión es `id` — si ya existe un servidor con ese `id` en el archivo **no se sobreescribe**, preservando siempre los overrides a nivel de proyecto

### Campos de Servidor MCP

| Campo | Requerido | Descripción |
|---|---|---|
| `id` | ✅ | Identificador único del servidor usado como clave de fusión |
| `command` | ✅ | Comando para iniciar el servidor (p. ej. `npx -y my-mcp-server`) |
| `args` | — | Lista de argumentos de línea de comandos |
| `env` | — | Variables de entorno pasadas al proceso del servidor |

Para configurar servidores MCP en el wizard, abre el **Paso 2 — Workflow y Herramientas** y expande la sección desplegable **Servidores MCP**.

---

## Target GitHub Copilot

Cuando `github_copilot` está incluido en `targets` del agente (valor por defecto), la sincronización genera un archivo `.md` en `.github/agents/` conforme al formato de agente de VS Code Copilot.

### Frontmatter

| Campo | Descripción |
|---|---|
| `name` | Nombre de visualización del agente (del campo `name` del spec) |
| `description` | Descripción de una línea mostrada en Copilot Chat |
| `tools` | Lista de herramientas que el agente puede invocar (auto-generada — ver más abajo) |
| `user-invocable` | `false` para workers con `receivesFrom` (subagentes no destinados a invocación directa) |

### Auto-inyección de herramientas

El campo `tools` del frontmatter se construye automáticamente a partir de tres fuentes:

1. **Herramientas estándar del workflow** — inyectadas por rol para que el agente pueda ejecutar los pasos del body lean:

   | Rol | Auto-inyectado |
   |---|---|
   | Todos los roles | `read`, `search` |
   | Worker | + `edit` |
   | Orchestrator | + `todo` |

2. **Herramientas Engram** — `engram/*` se inyecta siempre que el agente use Engram (vía `mcpServers` o `tools`). Se añaden herramientas de despacho adicionales según el rol:

   | Rol | Herramientas adicionales |
   |---|---|
   | Router, Orchestrator | `egdev6.agent-teams/agent-teams-handoff`, `egdev6.agent-teams/agent-teams-dispatch-parallel` |
   | Worker con `receivesFrom` | `egdev6.agent-teams/agent-teams-complete-subtask` |

3. **Herramientas explícitas del spec** — cualquier herramienta listada en el campo `tools` del spec (p. ej. `execute`, herramientas MCP personalizadas) se añade al final tras normalización.

> **`complete-subtask` pertenece a los workers, no a los orchestrators.** Los workers que reciben sub-tareas despachadas llaman a `complete-subtask` para señalizar el fan-in de vuelta al orchestrator. El orchestrator despacha y espera — nunca llama `complete-subtask` él mismo.

### Memoria

La memoria persistente para los agentes de Copilot la proporciona **Engram MCP**, configurado vía `.vscode/mcp.json`. El frontmatter `tools` incluye `engram/*` automáticamente cuando Engram está activo. Los pasos del body siguen el mismo patrón condensado de sesión que el target Claude Code (`mem_session_start` al inicio, `mem_save` + `mem_session_end` al final).

### Estructura del body

El body generado usa el mismo formato lean que el target Claude Code:

```
You are the <name> agent.

## Role
- <expertise o scope topics>

## Constraints          ← solo si está definido en el spec
- <reglas always>
- Do not <reglas never>
- Escalate when: <reglas escalate>

## Approach
1. Start Engram session: call `mem_session_start`, then `mem_context` to load recent context.
2–N. <pasos del workflow>
N+1. Save to Engram: call `mem_save` with key from `mem_suggest_topic_key`, then `mem_session_end`.

## Delegates to         ← solo para orchestrators y routers
- `<agent-id>`

## Output Format
- <bullets derivados de output.template>
```

Los orchestrators reciben además un paso de despacho inyectado tras "Assign each sub-task":

```
For each delegation: use `egdev6.agent-teams/agent-teams-handoff` (single agent) or
`egdev6.agent-teams/agent-teams-dispatch-parallel` (parallel) — do NOT respond until
all invocations complete.
```

Y la sección "Delegates to" incluye instrucciones de despacho con ambas herramientas, más una nota de que son los workers (no el orchestrator) quienes llaman a `complete-subtask` al terminar.

---

## Target Claude Code

Cuando `claude_code` está incluido en `targets` del agente, la sincronización genera un archivo `.md` en `.claude/agents/` conforme al formato de subagente de Claude Code.

### Diferencias respecto al formato GitHub Copilot

| Aspecto | GitHub Copilot | Claude Code |
|---|---|---|
| Frontmatter `name` | Nombre de visualización | Slug (campo `id`) — usado para `@agent-<name>` y `--agent` |
| Body | System prompt lean: Role → Constraints → Approach → Output Format | System prompt lean: Role → Constraints → Approach → Output Format |
| Frontmatter `tools` | Auto-inyectado por rol + Engram + tools del spec | Solo se emite si está declarado explícitamente en `tools` (traducido a nombres Claude) |
| Herramientas de despacho | `agent-teams-handoff`, `agent-teams-dispatch-parallel` | `dispatch_task` (Claude Code SDK) |
| Fan-in | `agent-teams-complete-subtask` (worker) | `complete_subtask` (worker) |
| Campo `id` | Emitido | No emitido (Claude Code no lo reconoce) |
| Config Engram | `.vscode/mcp.json` (workspace) | `mcpServers` en el frontmatter del agente (scoped al subagente) |

### Campos específicos de Claude Code

Estos campos solo se usan al sincronizar al target `claude_code`. Todos son opcionales — omitirlos hace que Claude Code herede el valor por defecto de la sesión.

| Campo | Tipo | Emitido como | Notas |
|---|---|---|---|
| `claude_model` | `inherit \| sonnet \| opus \| haiku` | `model` | Omitir o `inherit` para usar el modelo de la sesión |
| `claude_max_turns` | entero ≥ 1 | `maxTurns` | Omitir para usar el valor por defecto de Claude Code |
| `claude_effort` | `low \| medium \| high \| max` | `effort` | Omitir para heredar de la sesión |
| `claude_permission_mode` | `default \| acceptEdits \| dontAsk \| bypassPermissions` | `permissionMode` | Omitir para usar `default` |
| `claude_disallowed_tools` | string[] | `disallowedTools` | Herramientas a denegar sobre el conjunto heredado |
| `claude_background` | boolean | `background` | Ejecutar el subagente como tarea en segundo plano |
| `claude_mcp_servers` | object[] | `mcpServers` | Servidores MCP con scope solo a este subagente (ver más abajo) |

> **`claude_mcp_servers` vs `mcpServers`:** `mcpServers` fusiona servidores en el archivo de configuración del workspace (`.mcp.json`). `claude_mcp_servers` scopea servidores solo a este subagente — aparecen en el campo `mcpServers` del frontmatter del agente y se conectan al iniciar el subagente y se desconectan al terminar.

#### Campos de `claude_mcp_servers`

| Campo | Requerido | Descripción |
|---|---|---|
| `name` | ✅ | Nombre / clave del servidor |
| `type` | — | `stdio \| http \| sse \| ws` |
| `command` | — | Ejecutable a lanzar |
| `args` | — | Argumentos de línea de comandos |
| `env` | — | Variables de entorno |

### Traducción de nombres de herramientas

El wizard y el spec YAML usan nombres de herramientas de VS Code. Durante la sincronización a `claude_code`, se traducen automáticamente a sus equivalentes de Claude Code:

| Nombre en spec / wizard | Herramienta(s) Claude Code emitidas |
|---|---|
| `read` | `Read` |
| `edit` | `Edit` |
| `search` | `Grep`, `Glob` |
| `execute` | `Bash` |
| `browser` | `WebFetch` |
| `web` | `WebSearch` |
| `agent` | `Agent` |
| `todo` | `TodoWrite` |
| `engram/*`, `egdev6.*`, `complete-subtask`, `vscode` | *(omitidos — herramientas MCP o exclusivas de extensión)* |

Si no hay herramientas traducibles, la línea `tools:` del frontmatter se omite completamente y el subagente hereda todas las herramientas disponibles.

### Memoria

La memoria persistente para los agentes de Claude Code la proporciona exclusivamente **Engram MCP**. El campo nativo `memory:` de Claude Code no se usa — Engram cubre la misma capacidad con características más ricas (búsqueda semántica, contexto entre agentes, seguimiento de sesiones).

Cuando Engram está activo, el body generado incluye pasos de sesión condensados:
- **Inicio:** `mem_session_start` + `mem_context`
- **Fin:** `mem_save` + `mem_session_end`

### Estructura del body de Claude Code

El body generado sigue el mismo patrón lean que el target GitHub Copilot (ver arriba), con estas diferencias en los nombres de herramientas:

- Despacho: `dispatch_task` MCP tool (en lugar de `agent-teams-handoff` / `agent-teams-dispatch-parallel`)
- Fan-in: `complete_subtask` (llamado por los workers, en lugar de `agent-teams-complete-subtask`)
- Engram scoped vía `mcpServers` en el frontmatter del agente (no requiere `.vscode/mcp.json`)

Ejemplo de spec para un worker Claude Code con todos los campos opcionales:

```yaml
id: engram-dashboard-worker
name: Engram Dashboard Worker
role: worker
description: Use proactively for React/TypeScript work in the Engram dashboard, especially stats views, observation filtering, and files under src/pages/engram-dashboard/.
claude_model: sonnet
claude_max_turns: 10
claude_effort: high
claude_permission_mode: acceptEdits
claude_disallowed_tools:
  - Bash
claude_background: false
targets:
  - claude_code
```

`claude_mcp_servers` ejemplo (scoped al subagente, no fusionado en la config del workspace):

```yaml
claude_mcp_servers:
  - name: my-data-server
    type: stdio
    command: npx -y my-data-mcp
    env:
      API_KEY: "${MY_API_KEY}"
```

---


