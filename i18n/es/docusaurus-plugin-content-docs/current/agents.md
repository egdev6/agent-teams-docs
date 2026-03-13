# Agentes

**Estado:** 🧪 Beta

Los agentes son el bloque fundamental de Agent Teams. Cada agente es un participante de chat de GitHub Copilot con un rol definido, skills, reglas de routing y context packs opcionales.

---

## Crear un Agente

Abre el dashboard y navega a **Agent Manager** → **Create Agent**, o usa la tarjeta de **Acciones Rápidas** en la página de inicio.

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
| **Herramientas** | Capacidades que puede usar el agente, cada una con una condición `when` opcional |

### Paso 3 — Skills

> **Nota:** Este paso está oculto para los agentes `router` — los routers usan herramientas de despacho (`agent-teams-handoff`, `agent-teams-dispatch-parallel`) en lugar de skills de dominio.

Explora y añade skills de dos fuentes:

- **Skills del proyecto** — skills definidas en tu `skills.registry.yml` local
- **Registro comunitario** — instala skills del registro compartido directamente desde este paso

Cada tarjeta de skill muestra su ID, categoría, nivel de seguridad y roles recomendados. Selecciona las skills relevantes para el propósito de este agente.

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

Dashboard → **Agent Manager** muestra todos los agentes cargados agrupados por rol (Router, Orchestrator, Worker). Haz clic en cualquier agente para abrirlo en modo edición.

### Editar un Agente

1. Dashboard → **Agent Manager** → selecciona agente → **Edit**
2. Los 6 pasos del wizard están disponibles para modificación
3. Guarda — los cambios se escriben de vuelta en el archivo YAML de la spec

<img width="1183" alt="imagen" src="/img/docs/agents-forms.png" style={{ height: "auto" }} />

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


