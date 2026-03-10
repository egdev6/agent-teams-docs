# Dashboard

**Estado:** 🧪 Beta | [← Volver al índice](../README.es.md)

El dashboard de Agent Teams es una SPA React embebida que se abre como panel de VS Code. Permite acceder a las 12 páginas de la extensión desde una sola interfaz.

---

## Abrir el Dashboard

Sidebar

<img width="174" height="60" alt="imagen" src="https://github.com/user-attachments/assets/9f217298-a220-429f-b14f-aa7175e24e1b" />

Paleta de Comandos (`Ctrl+Shift+P` / `Cmd+Shift+P`) → **`Agent Teams: Open Dashboard`**

<img width="768" height="127" alt="imagen" src="https://github.com/user-attachments/assets/ccd4c59b-3c1a-4949-b685-5326da9a3a5c" />

---

## Página de inicio

La página principal del dashboard muestra un resumen en tiempo real del workspace:

| Tarjeta | Qué muestra |
|---|---|
| **Estadísticas** | Equipo activo, total de agentes, estado del sync y estado de la integración con Engram |
| **Estado del Sync** | Desglose de cambios pendientes (agentes a crear / actualizar / omitir) con botón de sync directo |
| **Banner de Engram** | Aviso de configuración inicial — solo se muestra si la extensión de memoria Engram no está configurada |
| **Acciones Rápidas** | Botones de acceso rápido a las páginas más comunes (Crear Agente, Crear Equipo, Abrir Perfil) |

<img width="1668" height="1002" alt="imagen" src="https://github.com/user-attachments/assets/39d3977b-d90e-4aec-8547-df0e24b3d086" />

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

<img width="1637" height="291" alt="imagen" src="https://github.com/user-attachments/assets/a6d8ca85-3aa2-4686-9296-d82f6c29ce77" />

---

## Tarjeta de Estadísticas

La tarjeta de estadísticas se actualiza automáticamente cuando cambian agentes o equipos:

- **Equipo activo** — el equipo actualmente seleccionado para las operaciones de sync.
- **Nº de agentes** — total de agentes cargados desde specs y kits.
- **Estado del sync** — `Al día` o `X cambios pendientes`.
- **Engram** — `Conectado` o `No configurado`.

<img width="1628" height="119" alt="imagen" src="https://github.com/user-attachments/assets/8da74036-cdb1-4a4a-bb6f-542a1a0830a6" />

---

## Actualizar datos

El dashboard reacciona automáticamente a los cambios de estado en VS Code. Si editas un archivo YAML directamente fuera del dashboard:

- Paleta de Comandos → **`Agent Teams: Reload Agents`** para forzar una recarga completa.
- O cierra y vuelve a abrir el panel.

---

[← Volver al índice](../README.es.md)
