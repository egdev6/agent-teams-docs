# Dashboard

**Estado:** 🧪 Beta

El dashboard de Agent Teams es una SPA React embebida que se abre como panel de VS Code. Es la interfaz principal para crear y gestionar agentes, equipos y la configuración del proyecto.

---

## Abrir el Dashboard

Haz clic en el icono de Agent Teams en el panel lateral de VS Code:

<img width="174" alt="imagen" src="/img/docs/dashboard-icon.png" style={{ height: "auto" }} />

O usa la Paleta de Comandos (`Ctrl+Shift+P` / `Cmd+Shift+P`) → **`Agent Teams: Open Dashboard`**

<img width="768" alt="imagen" src="/img/docs/dashboard-command.png" style={{ height: "auto" }} />

---

## Página de Inicio

La página principal del dashboard muestra un resumen en tiempo real del workspace:

| Tarjeta | Qué muestra |
|---|---|
| **Estadísticas** | Equipo activo, total de agentes, estado del sync y estado de la integración con Engram |
| **Estado del Sync** | Desglose de cambios pendientes (agentes a crear / actualizar / omitir) con botón de sync directo |
| **Banner de Engram** | Aviso de configuración inicial — solo se muestra si la extensión de memoria Engram no está configurada |
| **Acciones Rápidas** | Botones de acceso rápido a las páginas más comunes (Crear Agente, Crear Equipo, Abrir Perfil) |
| **Configura tu proyecto** | Visible cuando no existe ningún perfil. Dos opciones: **"Auto-configurar con IA"** (abre `@project-configurator`) y **"Configurar manualmente"** (abre el formulario del Profile Editor) |
| **Diseña tu primer equipo** | Visible cuando el perfil está configurado pero no existe ningún equipo. Abre `@team-builder` directamente en Copilot Chat. Solo aparece cuando no hay ningún equipo en el workspace |
| **Consultant** | Visible cuando existen perfil, equipo activo y al menos un agente. Abre `@consultant` para análisis de asesoría sobre la cobertura y salud del equipo |
| **Team Agents** | Cuando existe un equipo activo, muestra los agentes agrupados por rol. La cabecera incluye **"Diseñar con IA"** (abre `@agent-designer`) y **"Crear manualmente"** (abre el wizard) |

> Consulta [Flujo de Configuración con IA](ai-setup-flow) para un recorrido completo por la experiencia de onboarding guiada por IA.

<img width="1668" alt="imagen" src="/img/docs/dashboard-overview.png" style={{ height: "auto" }} />

---

## Navegación

Usa los iconos del panel lateral o las Acciones Rápidas para moverte entre páginas:

<img width="1637" alt="imagen" src="/img/docs/dashboard-actions.png" style={{ height: "auto" }} />

### Profile Editor

Edita el perfil de tu proyecto — tecnologías, rutas, comandos, context packs y destinos de sync. La página de inicio muestra un aviso de configuración cuando no existe ningún perfil. Ver [Profile Editor](profiles) para más detalles.

### Team Manager

Lista todos los equipos con su nombre, descripción, número de agentes y estado activo. Desde aquí puedes crear nuevos equipos, activar uno o abrirlo para editarlo. Ver [Teams](teams) para más detalles.

### Agent Manager

Muestra todos los agentes cargados organizados por rol (Router, Orchestrator, Worker). Haz clic en cualquier agente para editarlo, o en **Create Agent** para abrir el wizard. Ver [Agentes](agents) para más detalles.

### Create Agent / Edit Agent

El wizard de creación de agentes en 6 pasos. Cubre identidad, alcance, workflow, skills, reglas y configuración de salida. Una vista previa aparece en el panel lateral derecho durante todo el proceso.

### Create Team / Edit Team

El wizard de creación de equipos. Introduce un nombre, selecciona agentes miembro y previsualiza la configuración. Edit Team añade opciones para establecer el equipo como activo o eliminarlo.

### Skills Browser

Vista en dos pestañas: las skills locales de tu proyecto y el registro comunitario. Explora, busca, filtra por categoría e instala skills de la comunidad directamente. Ver [Skills Browser](skills-browser) para más detalles.

### Context Packs

Gestiona los context packs disponibles en tu workspace. Activa o desactiva packs, ajusta la prioridad, crea nuevos packs e importa archivos markdown como packs. Ver [Context Packs](context-packs) para más detalles.

### Import / Export

Haz copias de seguridad y comparte tu catálogo global de agentes, y exporta o importa el perfil completo del proyecto como ZIP. Ver [Editor de Perfiles — Importar / Exportar](profiles#importar--exportar) para más detalles.

---

## Tarjeta de Estadísticas

La tarjeta de estadísticas se actualiza automáticamente cuando cambian agentes o equipos:

- **Equipo activo** — el equipo actualmente seleccionado para las operaciones de sync.
- **Nº de agentes** — total de agentes cargados desde specs y kits.
- **Estado del sync** — `Al día` o `X cambios pendientes`.
- **Engram** — `Conectado` o `No configurado`.

<img width="1628" alt="imagen" src="/img/docs/dashboard-status.png" style={{ height: "auto" }} />

---

## Flujo de Configuración Inicial

Si abres Agent Teams por primera vez en un proyecto, sigue esta secuencia:

1. **Configura el perfil del proyecto** — la página de inicio muestra un aviso de configuración. Haz clic para abrir el Profile Editor, rellena tus tecnologías, rutas y comandos, y guarda.
2. **Crea tus agentes** — ve a Agent Manager → Create Agent y completa el wizard para cada agente que necesites.
3. **Crea un equipo** — ve a Team Manager → Create Team, añade tus agentes y guarda. Establécelo como equipo activo.
4. **Sincroniza** — la tarjeta Sync Status en la página de inicio mostrará los cambios pendientes. Haz clic en Sync para generar los archivos `.github/agents/` y activar tus agentes en Copilot Chat.

---

## Actualizar Datos

El dashboard reacciona automáticamente a los cambios de estado en VS Code. Si editas un archivo YAML directamente fuera del dashboard, las estadísticas y el estado del sync se actualizan al guardar el archivo.

Para forzar una recarga completa: Paleta de Comandos → **`Agent Teams: Reload Agents`**


