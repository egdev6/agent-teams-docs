# Editor de Perfiles

**Estado:** 🧪 Beta

Un perfil de proyecto (`.agent-teams/project.profile.yml`) define el contexto tecnológico, los mapeos de rutas, los comandos y los overrides base de agentes para un workspace. Se incorpora al motor de composición al resolver placeholders de kits y aplicar valores por defecto a nivel de proyecto.

---

## Abrir el Editor de Perfiles

Dashboard → panel lateral → **Profile Editor**

Si no existe ningún perfil todavía, la página de inicio del dashboard muestra un aviso **Configura el perfil del proyecto**. Haz clic en él para abrir el editor directamente.

<img width="898" alt="imagen" src="/img/docs/profiles-wizard-es.png" style={{ height: "auto" }} />

---

## Rellenar el Perfil

El editor se divide en siete secciones:

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

### Destinos de Sync

Elige a qué herramientas de IA se sincronizarán los agentes de este proyecto:

| Destino | Descripción |
|---|---|
| **Claude Code** | Genera archivos de agente para Anthropic Claude Code |
| **Codex** | Genera archivos de agente para OpenAI Codex |
| **GitHub Copilot** | Genera archivos markdown en `.github/agents/` para GitHub Copilot |

### Gitignore

Activa esta opción para añadir el directorio de configuración `.agent-teams/` al `.gitignore` de tu proyecto. Útil cuando quieres mantener tu configuración de agentes local a tu máquina.

---

## Guardar el Perfil

Haz clic en **Save** al final del editor. El perfil se escribe en `.agent-teams/project.profile.yml`. Los cambios se recogen automáticamente en el siguiente sync.

---

## Importar / Exportar

La página **Import / Export** del dashboard gestiona el catálogo global de agentes almacenado en el almacenamiento global de VS Code. Esto es independiente del perfil de proyecto — te permite hacer copias de seguridad y compartir todo tu catálogo de agentes y equipos entre workspaces.

<img width="1644" alt="imagen" src="/img/docs/profiles-editor.png" style={{ height: "auto" }} />

| Acción | Descripción |
|---|---|
| **Export** | Guarda el catálogo completo en un archivo JSON a elegir |
| **Import** | Fusiona las entradas de un archivo JSON en el catálogo existente (no destructivo) |
| **Reset** | Elimina permanentemente el catálogo completo — usar con precaución |

---

## Referencia: Formato YAML del Perfil

El dashboard escribe y lee este formato automáticamente. También puedes abrir `.agent-teams/project.profile.yml` directamente en VS Code.

```yaml
id: my-project
name: My Project

technologies:
  - react
  - typescript
  - nodejs

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

overrides:
  vitest-worker:
    context_packs:
      - testing-setup
```

### Campos

| Campo | Requerido | Descripción |
|---|---|---|
| `id` | ✅ | Identificador del proyecto (kebab-case) |
| `name` | ✅ | Nombre del proyecto |
| `technologies` | — | Flags de tecnología para condicionales en templates (`{{#if technology:react}}`) |
| `paths` | — | Mapeos de rutas con nombre para variables de template (`{{path:src}}`) |
| `commands` | — | Mapeos de comandos con nombre para variables de template (`{{command:build}}`) |
| `context_packs` | — | Context packs por defecto aplicados a todos los agentes del proyecto |
| `overrides` | — | Overrides a nivel de campo por agente aplicados en el proyecto (menor prioridad que los overrides del equipo) |


