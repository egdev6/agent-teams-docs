
# Diseñador de Agentes y Team Builder

**Estado:** ✅ Disponible

`@agent-designer` y `@team-builder` son agentes integrados incluidos con la extensión. Están disponibles inmediatamente después de la instalación — no requieren copia desde el marketplace ni configuración manual.

---


## Diseñador de Agentes

El Diseñador de Agentes lee el contexto de tu espacio de trabajo — agentes existentes, habilidades instaladas y la pila tecnológica de tu proyecto — y produce una especificación que encaja naturalmente en la arquitectura de tu equipo. Hace lo siguiente:

- Infiera el `role`, `domain`, `expertise` e `intents` correctos a partir de tu descripción
- Sugiere hasta 3 habilidades relevantes del workspace y las agrega en `skills` con condiciones `when` claras
- Evita colisiones con IDs de agentes existentes
- Solo referencia habilidades que realmente están instaladas en el espacio de trabajo
- Emite exactamente un bloque YAML con delimitadores — sin texto explicativo ni marcadores de posición

Además, admite **importar** definiciones de agentes existentes desde otros formatos (Claude Code `.md`, Copilot `.agent.md`, markdown plano) y convertirlos a un `AgentSpec` YAML válido.

---


## Team Builder

El Team Builder es un agente orquestador que diseña tu equipo de agentes completo desde cero:

1. **Lee el contexto de tu proyecto** — README, `project.profile.yml`, manifiestos de paquetes, estructura de directorios
2. **Propone tarjetas descriptivas de agentes** — una por agente, con rol, dominio, intenciones, rutas de alcance, context packs, skills y handoffs
3. **Espera tu confirmación** antes de continuar
4. **Distribuye el trabajo a los workers de `@agent-designer`** vía Engram — un worker por agente propuesto, todos en paralelo
5. **Verifica la coherencia entre agentes** — IDs únicos, referencias de handoff válidas, sin delegaciones circulares
6. **Escribe el archivo de binding del equipo** en `.agent-teams/teams/<teamId>.yml`

> **Recomendado:** usa un modelo potente (p. ej. Claude Sonnet) para obtener mejores resultados. El Team Builder está disponible directamente desde la página de inicio del dashboard a través de la tarjeta **„Diseña tu primer equipo“** cuando no existe ningún equipo en el workspace.

---


## Usar el Diseñador de Agentes

### Paso 1 — Invoca al agente en Copilot Chat o Claude

Dirígete al agente directamente con `@agent-designer` (Copilot) o menciónalo por nombre en tu conversación con Claude:

```
@agent-designer diseña un agente que revise pull requests de TypeScript en busca de problemas de seguridad y tests faltantes
```

### Paso 2 — Describe lo que necesitas

Cuanto más contexto des, más preciso será el resultado. Puedes incluir:

| Pista | Ejemplo |
|---|---|
| **Rol** | "un orquestador que coordina el pipeline de frontend" |
| **Dominio** | "un agente backend enfocado en servicios REST Node.js" |
| **Capacidad principal** | "revisa PRs", "genera documentación API", "ejecuta migraciones de base de datos" |
| **Restricciones** | "solo lectura, sin creación de archivos" |
| **Habilidades a usar** | "usa la habilidad search-codebase" |

> **Consejo:** No necesitas mencionar todos los campos. El agente infiere lo que puede del espacio de trabajo y deja vacíos los campos opcionales cuando no está seguro.

### Paso 3 — Usa el YAML generado

El agente produce un solo bloque de código YAML. Puedes:

1. **Copiar → Asistente de creación de agentes** — pega el YAML en la pestaña **Raw YAML** dentro del asistente
2. **Guardar directamente** — coloca el archivo en `.agent-teams/agents/tu-agente.yml` y el dashboard lo detectará en el próximo refresco
3. **Iterar** — pide al agente que ajuste campos específicos: `refina las restricciones para que también escale cuando se modifique una API pública`

### Importar una definición de agente existente

Proporciona el contenido de un archivo de agente existente en cualquier formato compatible y el Diseñador lo convertirá:

```
@agent-designer convierte este agente de Claude Code a YAML de AgentSpec:
<pega aquí el contenido del archivo .md>
```

El agente extrae cada campo mapeeable, normaliza los valores a las convenciones de AgentSpec (nombres de rol, intenciones en snake_case, permisos) y envía un único mensaje de aclaración agrupado para todo lo que no pueda resolver antes de emitir el YAML.

---


## Ejemplo

**Entrada:**

```
@agent-designer crea un agente worker que revise pull requests en un proyecto backend con TypeScript + Node.js
```

**Salida:**

```yaml
id: pr-reviewer
name: PR Reviewer
version: 1.0.0
role: worker
domain: backend
description: >
  Revisa pull requests para verificar corrección, seguridad y cobertura de tests en
  servicios Node.js con TypeScript. Deja comentarios estructurados y aprueba o
  solicita cambios.
expertise:
  - TypeScript
  - Node.js
  - Diseño de API REST
  - Revisión de código de seguridad
  - Análisis de cobertura de tests
intents:
  - review_pull_request
  - check_test_coverage
  - flag_security_issues
scope:
  topics:
    - revisión de pull requests
    - calidad de código
    - análisis de seguridad
  path_globs:
    - pattern: src/**/*.ts
      priority: high
    - pattern: '**/*.test.ts'
      priority: medium
  excludes:
    - dist/**
    - node_modules/**
workflow:
  - Lee el diff del PR e identifica archivos cambiados dentro del alcance.
  - Verifica tests faltantes o inadecuados para la lógica modificada.
  - Escanea problemas comunes de seguridad (inyección, bypass de auth, secretos en código).
  - Revisa contratos de API para cambios incompatibles.
  - Produce una revisión estructurada usando la plantilla de salida code-review.
tools:
  - name: github
    when: obteniendo el diff del PR y publicando comentarios de revisión
permissions:
  can_create_files: false
  can_edit_files: false
  can_delete_files: false
  can_run_commands: false
  can_delegate: false
  can_modify_public_api: false
  can_touch_global_config: false
constraints:
  always:
    - Señalar cualquier cambio que elimine o debilite controles de autenticación.
    - Requerir tests para cada nueva función exportada.
  never:
    - Aprobar un PR que introduzca secretos o credenciales hardcodeados.
    - Revisar archivos fuera del alcance definido.
  escalate:
    - Cuando un PR modifique contratos de API pública sin aumentar la versión.
output:
  template: code-review
  mode: detailed
  max_items: 10
targets:
  - github_copilot
  - claude_code
```

---


## La habilidad agent-spec-authoring

La habilidad `agent-spec-authoring` está **incluida con la extensión** — no requiere instalación manual ni configuración en el workspace. Se inyecta automáticamente en cada sesión de `@agent-designer`. Proporciona el esquema completo de AgentSpec — todos los campos válidos, tipos, reglas de validación y semántica de roles — para que el agente siempre produzca especificaciones que pasen la validación.

> **Override local:** si existe una habilidad con el id `agent-spec-authoring` en `.agent-teams/skills/agent-spec-authoring/`, tiene prioridad sobre la versión incluida automáticamente.

### Campos requeridos

| Campo | Tipo | Reglas |
|---|---|---|
| `id` | string | Slug: `^[a-z0-9-]+$`. Debe ser único en el espacio de trabajo. |
| `name` | string | Legible por humanos, 3–80 caracteres. |
| `role` | string | `worker` \| `orchestrator` \| `router` \| `aggregator` |
| `description` | string | 1–3 frases, 10–600 caracteres. |

### Semántica de roles

| Rol | Cuándo usarlo |
|---|---|
| `worker` | Ejecuta una tarea enfocada dentro de un alcance definido |
| `orchestrator` | Descompone un objetivo y delega sub-tareas a workers dentro de un dominio |
| `router` | Recibe solicitudes y las enruta al agente más adecuado mediante herramientas de despacho |
| `aggregator` | Fusiona los resultados de orchestrators en paralelo y reporta conflictos entre dominios |

### Campos opcionales comunes

| Campo | Descripción |
|---|---|
| `domain` | Dominio principal: `frontend`, `backend`, `testing`, `tooling`, `devops` |
| `expertise` | Lista de áreas de conocimiento usadas para el enrutamiento |
| `intents` | IDs de acción en snake_case que maneja este agente (ej. `review_pull_request`) |
| `scope` | Globs de archivos, temas y exclusiones que definen el alcance operacional del agente |
| `workflow` | Pasos imperativos ordenados que sigue el agente |
| `skills` | IDs de habilidades del registro del espacio de trabajo |
| `tools` | Capacidades del entorno (`github`, `terminal`, etc.) con `when` opcional |
| `constraints` | Reglas de comportamiento `always` / `never` / `escalate` |
| `targets` | Plataformas a sincronizar: `github_copilot`, `claude_code` (por defecto: ambas) |

> Para la referencia completa del esquema incluyendo sub-objetos, consulta el archivo `SKILL.md` dentro de `marketplace/skills/agent-spec-authoring/` o la copia incluida en la extensión.

---


## Restricciones

El Diseñador de Agentes aplica estas reglas en cada generación:

**Siempre:**
- Emitir exactamente un bloque YAML con delimitadores — sin texto antes ni después
- Usar solo campos definidos en el esquema AgentSpec
- `id` debe coincidir con `^[a-z0-9-]+$` y no debe colisionar con IDs de agentes existentes
- Cada intent debe coincidir con `^[a-z0-9_]+$` (snake_case)
- Incluir los 4 campos requeridos: `id`, `name`, `role`, `description`
- Referenciar solo habilidades disponibles en el espacio de trabajo

**Nunca:**
- Inventar nombres de campos que no estén en el esquema
- Emitir JSON en vez de YAML
- Incluir prosa markdown fuera del bloque delimitado
- Reutilizar un ID que ya exista en el espacio de trabajo
