# Editor de Perfiles

**Estado:** 🧪 Beta | [← Volver al índice](../README.es.md)

Un perfil de proyecto (`.agent-teams/project.profile.yml`) define el contexto tecnológico, los mapeos de rutas, los comandos y los overrides base de agentes para un workspace. Se incorpora al motor de composición al resolver placeholders de kits y aplicar valores por defecto a nivel de proyecto.

---

## Inicializar un Perfil

Paleta de Comandos → **`Agent Teams: Init Profile`**

El wizard interactivo solicita:

- **Tecnologías** en uso (p. ej. React, TypeScript, Node.js) — se usan en los condicionales `{{#if technology:*}}`.
- **Mapeos de rutas** (p. ej. `src → src/`, `tests → tests/`) — disponibles como `{{path:src}}` en templates.
- **Comandos** (p. ej. `build → pnpm build`) — disponibles como `{{command:build}}` en templates.

Se crea un `project.profile.yml` en `.agent-teams/project.profile.yml`.

<!-- screenshot: Los pasos del wizard initProfile dentro de VS Code, mostrando el paso de selección múltiple de tecnologías — una lista de opciones (React, TypeScript, Node.js, Vue, Python, etc.) con algunas marcadas -->

---

## Formato YAML del Perfil

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

---

## Editar un Perfil

### Usando el Dashboard

1. Dashboard → **Profile Editor**.
2. Edita tecnologías (checkboxes), rutas (lista clave-valor) y comandos (lista clave-valor).
3. Guarda — escribe el YAML actualizado en disco.

<!-- screenshot: La página del Profile Editor en el dashboard mostrando tres secciones: una cuadrícula de checkboxes de tecnologías (arriba), una tabla clave-valor de rutas (centro) y una tabla clave-valor de comandos (abajo), con un botón Guardar -->

### Editar el YAML directamente

Abre `.agent-teams/project.profile.yml` en VS Code. El archivo se valida contra el esquema JSON en cada sync — los errores se notifican en el canal de salida.

Los cambios en el perfil se recogen automáticamente en el siguiente sync o al ejecutar `Reload Agents`.

---

## Importar / Exportar

La página **Import / Export** del dashboard gestiona el catálogo global de agentes almacenado en el almacenamiento global de VS Code:

| Acción | Descripción |
|---|---|
| **Capture Workspace** | Toma una instantánea del estado actual del workspace (agentes + equipos + skills) en el catálogo |
| **Export** | Guarda el catálogo completo en un archivo JSON a elegir |
| **Import (additive)** | Fusiona las entradas de un archivo JSON en el catálogo existente |
| **Import (replace)** | Reemplaza el catálogo completo con los datos importados |

<!-- screenshot: La página de Import/Export en el dashboard mostrando cuatro botones de acción (Capture Workspace, Export, Import Additive, Import Replace), con un resumen del recuento actual del catálogo (p. ej. "12 agentes, 3 equipos, 45 skills") debajo -->

Equivalentes en la Paleta de Comandos:

```
Agent Teams: Capture Workspace Catalog
Agent Teams: Export Catalog
Agent Teams: Import Catalog
```

---

[← Volver al índice](../README.es.md)
