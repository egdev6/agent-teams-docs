# Editor de Perfiles

**Estado:** 🧪 Beta

Un perfil de proyecto (`.agent-teams/project.profile.yml`) define el contexto tecnológico, los mapeos de rutas, los comandos y los overrides base de agentes para un workspace. Se incorpora al motor de composición al resolver placeholders de kits y aplicar valores por defecto a nivel de proyecto.

---

## Abrir el Editor de Perfiles

Dashboard → panel lateral → **Profile Editor**

Si no existe ningún perfil todavía, la página de inicio del dashboard muestra un aviso **Configura el perfil del proyecto**. Haz clic en él para abrir el editor directamente.

<!-- IMAGEN: Captura — Profile Editor abierto en el dashboard mostrando las siete secciones de acordeón desplegables (Información Básica, Tecnologías, Rutas, Comandos, Context Packs, Destinos de Sync, Gitignore) con una sección expandida. Nombre sugerido: profiles-wizard-es.png -->

---

## Rellenar el Perfil

El editor agrupa sus ajustes en siete secciones de acordeón desplegables. Haz clic en cualquier encabezado de sección para expandirlo o contraerlo — cada encabezado muestra un resumen en tiempo real de los valores actuales para revisar el perfil completo de un vistazo sin abrir cada panel.

### Información Básica

| Campo | Descripción |
|---|---|
| **Project ID** | Identificador único para este proyecto (kebab-case) |
| **Nombre** | Nombre del proyecto legible por humanos |
| **Versión** | Cadena de versión del proyecto |
| **Tipo** | Tipo de proyecto: `frontend`, `backend`, `fullstack`, `monorepo` o `library` |

### Tecnologías

Lista las tecnologías que usa tu proyecto. Se usan en los condicionales de template (`{{#if technology:react}}`).

- Haz clic en **Añadir tecnología** para añadir una entrada manualmente
- Haz clic en **Detectar** para que la extensión analice tu workspace y sugiera tecnologías automáticamente

### Rutas

Mapeos de rutas con nombre usados en las variables de template (`{{path:src}}`).

- Añade pares clave-valor (p. ej. `src → src/`, `tests → tests/`, `components → src/components/`)
- Haz clic en **Detectar** para rellenar automáticamente basándose en la estructura de tu proyecto

### Comandos

Mapeos de comandos con nombre usados en las variables de template (`{{command:build}}`).

- Añade pares clave-valor (p. ej. `build → pnpm build`, `test → pnpm test`, `lint → pnpm lint`)
- Haz clic en **Detectar** para rellenar automáticamente basándose en tu `package.json` u otros archivos de configuración

### Context Packs

Selecciona qué context packs están activos para este proyecto. Se incrustan en cada agente que pertenece a este proyecto, salvo que se sobreescriba a nivel de equipo.

Usa el botón **Preview** para simular el algoritmo de presupuesto antes de sincronizar. La vista previa muestra:

- Una barra de progreso con los caracteres utilizados frente al `agents_md_budget` configurado (8 000 chars por defecto)
- Packs **Inlined** (verde) — packs esenciales siempre incluidos; packs estándar incluidos hasta agotar el presupuesto
- Packs **Referenced** (ámbar) — packs estándar que superan el presupuesto, más todos los packs de referencia; aparecen como encabezados en el archivo de contexto raíz sin contenido completo
- Una nota separada para **GitHub Copilot** — Copilot no tiene límite de presupuesto y copia todos los packs seleccionados como archivos individuales en `.github/context/`

La vista previa se actualiza automáticamente cada vez que marcas o desmarcar un pack mientras el panel está abierto.

### Destinos de Sync

Elige a qué herramientas de IA se sincronizarán los agentes de este proyecto. Cada destino genera su salida en la ubicación esperada por cada herramienta:

| Destino | Salida | Descripción |
|---|---|---|
| **Claude Code** | `.claude/agents/` + `AGENTS.md` | Archivos por agente y un archivo de contexto raíz para Claude Code |
| **Codex** | `AGENTS.md` | Archivo de contexto raíz para OpenAI Codex |
| **Gemini CLI** | `GEMINI.md` | Archivo de contexto raíz para Gemini CLI. Los context packs se incluyen por prioridad (esenciales siempre, estándar hasta el presupuesto, referencia como enlaces) |
| **OpenAI Agents SDK** | `AGENTS.md` | Archivo de contexto raíz para OpenAI Agents SDK. Mismo comportamiento de inlining que Gemini |
| **GitHub Copilot** | `.github/agents/` | Archivos markdown por agente y archivo de instrucciones de Copilot |

Cada destino tiene un toggle opcional **Añadir a .gitignore** que aparece cuando el destino está activado. Úsalo para excluir la salida de ese destino del control de versiones.

### Gitignore

Activa esta opción para añadir el directorio de configuración `.agent-teams/` al `.gitignore` de tu proyecto. Útil cuando quieres mantener tu configuración de agentes local a tu máquina.

---

## Guardar el Perfil

Haz clic en **Save** al final del editor. El perfil se escribe en `.agent-teams/project.profile.yml`. Los cambios se recogen automáticamente en el siguiente sync.

---

## Importar / Exportar

La página **Import / Export** del dashboard gestiona tanto el catálogo global de agentes (almacenado en el almacenamiento global de VS Code) como el perfil del proyecto. Esto es independiente de guardar el perfil — permite hacer copias de seguridad y compartir configuración entre workspaces.

<!-- IMAGEN: Captura — Página Import/Export del dashboard mostrando la sección Catálogo (JSON) con los botones Export/Import/Reset y la sección Perfil (ZIP) con los botones Export Profile as ZIP e Import Profile from ZIP. Nombre sugerido: profiles-editor.png -->

### Catálogo (JSON)

| Acción | Descripción |
|---|---|
| **Export** | Guarda el catálogo completo en un archivo JSON que elijas |
| **Import** | Fusiona las entradas de un archivo JSON en el catálogo existente (no destructivo) |
| **Reset** | Elimina permanentemente todo el catálogo — úsalo con precaución |

### Perfil (ZIP)

| Acción | Descripción |
|---|---|
| **Export Profile as ZIP** | Empaqueta el directorio `.agent-teams/` completo — agentes, equipos, context packs, skills y configuración del perfil — en un archivo ZIP portable |
| **Import Profile from ZIP** | Restaura un ZIP exportado anteriormente en el workspace actual. Los archivos que ya existen solicitan confirmación antes de ser sobreescritos |

---

## Referencia: Formato YAML del Perfil

El dashboard escribe y lee este formato automáticamente. También puedes abrir `.agent-teams/project.profile.yml` directamente en VS Code.

```yaml
project:
  id: my-project
  name: My Project
  version: "1.0.0"

technologies:
  typescript: true
  react: true

paths:
  src: src/
  tests: tests/
  components: src/components/

commands:
  build: pnpm build
  test: pnpm test
  lint: pnpm lint

context_packs:
  - project-conventions

sync_targets:
  - claude_code
  - gemini

gitignore_targets:
  - gemini

overrides:
  vitest-worker:
    context_packs:
      - testing-setup
```

### Campos

| Campo | Requerido | Descripción |
|---|---|---|
| `project.id` | ✅ | Identificador del proyecto (kebab-case) |
| `project.name` | ✅ | Nombre del proyecto |
| `project.version` | ✅ | Cadena de versión |
| `technologies` | — | Flags de tecnología para condicionales en templates (`{{#if technology:react}}`) |
| `paths` | — | Mapeos de rutas con nombre para variables de template (`{{path:src}}`) |
| `commands` | — | Mapeos de comandos con nombre para variables de template (`{{command:build}}`) |
| `context_packs` | — | Context packs por defecto aplicados a todos los agentes del proyecto |
| `sync_targets` | — | Plataformas de destino. Valores válidos: `claude_code`, `codex`, `gemini`, `openai`, `github_copilot`. Por defecto `claude_code` y `github_copilot` si se omite |
| `gitignore_targets` | — | Subconjunto de `sync_targets` cuyas rutas de salida se añaden al `.gitignore` |
| `overrides` | — | Overrides a nivel de campo por agente aplicados en el proyecto (menor prioridad que los overrides del equipo) |


