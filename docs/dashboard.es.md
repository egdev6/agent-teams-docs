# Dashboard

**Estado:** 🧪 Beta | [← Volver al índice](../README.es.md)

El dashboard de Agent Teams es una SPA React embebida que se abre como panel de VS Code. Permite acceder a las 12 páginas de la extensión desde una sola interfaz.

---

## Abrir el Dashboard

Paleta de Comandos (`Ctrl+Shift+P` / `Cmd+Shift+P`) → **`Agent Teams: Open Dashboard`**

<!-- screenshot: Paleta de Comandos con "Agent Teams: Open Dashboard" escrito y el resultado resaltado en la lista de sugerencias -->

---

## Página de inicio

La página principal del dashboard muestra un resumen en tiempo real del workspace:

| Tarjeta | Qué muestra |
|---|---|
| **Estadísticas** | Equipo activo, total de agentes, estado del sync y estado de la integración con Engram |
| **Estado del Sync** | Desglose de cambios pendientes (agentes a crear / actualizar / omitir) con botón de sync directo |
| **Banner de Engram** | Aviso de configuración inicial — solo se muestra si la extensión de memoria Engram no está configurada |
| **Acciones Rápidas** | Botones de acceso rápido a las páginas más comunes (Crear Agente, Crear Equipo, Abrir Perfil) |

<!-- screenshot: Página principal del dashboard con las cuatro tarjetas visibles: Estadísticas (arriba izquierda), Estado del Sync (arriba derecha), Acciones Rápidas (abajo izquierda) y el banner de Engram (abajo, si aplica) -->

---

## Navegación

Usa los iconos del panel lateral o las Acciones Rápidas para moverte entre páginas:

| Página | Descripción |
|---|---|
| **Dashboard** | Resumen de estadísticas — la página de inicio |
| **Profile Editor** | Editar el perfil del proyecto (`.agent-teams/project.profile.yml`) |
| **Team Manager** | Listar, crear y gestionar equipos |
| **Agent Manager** | Ver todos los agentes cargados |
| **Create Agent** | Lanzar el wizard de creación de agentes |
| **Edit Agent** | Modificar un agente existente |
| **Create Team** | Lanzar el wizard de creación de equipos |
| **Edit Team** | Modificar un equipo y sus overrides |
| **Skills Browser** | Explorar el catálogo de skills |
| **Context Packs** | Ver y gestionar context packs |
| **Import / Export** | Importar o exportar el catálogo global de agentes |
| **Agent Wizard** | Creación guiada de agentes paso a paso |

<!-- screenshot: Dashboard con la navegación lateral expandida a la izquierda, mostrando todos los iconos de sección con sus etiquetas y la página activa resaltada -->

---

## Tarjeta de Estadísticas

La tarjeta de estadísticas se actualiza automáticamente cuando cambian agentes o equipos:

- **Equipo activo** — el equipo actualmente seleccionado para las operaciones de sync.
- **Nº de agentes** — total de agentes cargados desde specs y kits.
- **Estado del sync** — `Al día` o `X cambios pendientes`.
- **Engram** — `Conectado` o `No configurado`.

<!-- screenshot: Vista ampliada de la tarjeta de Estadísticas mostrando el nombre del equipo activo, el número de agentes, el badge de estado del sync (verde "Al día" o naranja "3 cambios pendientes") y el estado de Engram -->

---

## Actualizar datos

El dashboard reacciona automáticamente a los cambios de estado en VS Code. Si editas un archivo YAML directamente fuera del dashboard:

- Paleta de Comandos → **`Agent Teams: Reload Agents`** para forzar una recarga completa.
- O cierra y vuelve a abrir el panel.

---

[← Volver al índice](../README.es.md)
