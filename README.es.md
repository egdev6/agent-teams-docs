# Agent Teams

**Versión:** 1.0.0 | **Estado:** 🧪 Beta | **Lanzamiento:** Marzo 2026 | [📖 Sitio de Documentación](https://agent-teams-docs.netlify.app)

[🇬🇧 English](README.md) | 🇪🇸 Español

Sistema completo de gestión de agentes IA para GitHub Copilot dentro de VS Code. Crea kits de agentes reutilizables, configura perfiles de proyecto y accede a un dashboard embebido de 12 páginas — todo sin salir del editor.

---

## 🧪 Beta Testing

Estamos en fase beta activa. Tu feedback da forma a la release estable de v1.0.

### Cómo instalar la versión beta (.vsix)

1. Descarga el último archivo `.vsix` desde la página de [Releases](https://github.com/egdev6/agent-teams-docs/releases).
2. Abre **VS Code**.
3. Ve al panel de **Extensions** (`Ctrl+Shift+X` / `Cmd+Shift+X`).
4. Haz clic en el menú **`···`** (arriba a la derecha del panel) → **Install from VSIX…**
5. Selecciona el archivo `.vsix` descargado.
6. Recarga VS Code cuando se te solicite.

> **Requisitos:** VS Code ≥ 1.85.0 y Node.js ≥ 18.0.0

### Qué probar

Áreas en las que queremos feedback específico:

| Área | Qué probar | Prioridad |
|---|---|---|
| **Dashboard** | Abrir el panel, navegar todas las páginas, revisar la tarjeta de estadísticas | 🔴 Alta |
| **Agentes** | Usar el wizard para crear un agente, editarlo, recargarlo | 🔴 Alta |
| **Teams** | Crear un equipo, asignar agentes, ejecutar sync a `.github/agents/` | 🔴 Alta |
| **Chat Participants** | Usar `@router` y un `@<agentId>` directo en Copilot Chat | 🔴 Alta |
| **Perfiles** | Abrir el Profile Editor, usar auto-detección, rellenar todas las secciones, guardar | 🟡 Media |
| **Skills Browser** | Abrir el navegador de skills, explorar categorías, instalar una skill de la comunidad | 🟡 Media |
| **Context Packs** | Activar/desactivar packs, ajustar prioridades, crear un pack nuevo, importar markdown | 🟡 Media |

### Cómo reportar un bug

1. Ve a [Issues](https://github.com/egdev6/agent-teams-docs/issues).
2. Haz clic en **New issue**.
3. Incluye:
   - Versión de VS Code y sistema operativo
   - Pasos para reproducir
   - Comportamiento esperado vs. lo que ocurrió
   - Captura de pantalla o mensaje de error si está disponible

---

## 📦 Instalación rápida

| Requisito | Versión mínima |
|---|---|
| VS Code | 1.85.0 |
| Node.js | 18.0.0 |

1. Descarga el `.vsix` desde [Releases](https://github.com/egdev6/agent-teams-docs/releases).
2. En VS Code: **Extensions** → **`···`** → **Install from VSIX…** → selecciona el archivo.
3. Recarga VS Code.
4. Abre la Paleta de Comandos (`Ctrl+Shift+P`) → ejecuta **`Agent Teams: Open Dashboard`**.

Consulta la [Guía de Instalación](docs/installation.es.md) para detalles completos y resolución de problemas.

---

## 📚 Documentación

| Guía | Descripción | Estado |
|---|---|---|
| [Instalación](docs/installation.es.md) | Requisitos, instalación desde VSIX, resolución de problemas | ✅ |
| [Dashboard](docs/dashboard.es.md) | Vista general del panel, navegación, flujo de configuración inicial | ✅ |
| [Agentes](docs/agents.es.md) | Crear agentes con el wizard de 6 pasos, editar, gestionar, sincronizar | ✅ |
| [Teams](docs/teams.es.md) | Crear y configurar equipos, establecer equipo activo, sincronizar | ✅ |
| [Editor de Perfiles](docs/profiles.es.md) | Perfil de proyecto, auto-detección de tecnologías, importar/exportar | ✅ |
| [Skills Browser](docs/skills-browser.es.md) | Explorar e instalar skills, registro comunitario | ✅ |
| [Context Packs](docs/context-packs.es.md) | Gestionar context packs, prioridades, importar markdown | ✅ |
| [Arquitectura de Agentes](docs/agent-architecture.es.md) | Pipeline multi-agente ideal: prompt → router → orchestrator → worker | ✅ |

---

## 🗺️ Estado del Proyecto

**Versión actual:** 1.0.0 (Beta) — Marzo 2026

### Qué está funcionando

- Dashboard React embebido de 12 páginas (SPA dentro del webview de VS Code)
- Arquitectura de tres capas Kits & Teams (Core → Kits → Profile → Team)
- Agent Composer con 4 estrategias de merge + modo dry-run
- Motor de templates para Context Packs con variables, condicionales y bucles
- Skills Registry con 9 categorías y recomendaciones por rol
- Participantes de chat dinámicos — uno por cada agente cargado — en Copilot Chat

### Limitaciones conocidas (Beta)

- Sin suite de tests automatizados aún
- Kit Marketplace no disponible todavía (planificado)
- Icono de la extensión pendiente (placeholder en los metadatos del paquete)
- Metadatos del publisher son un placeholder (`your-publisher-name`)

---

## 👥 Colaboradores

¡Gracias a todas las personas que han contribuido a este proyecto!

<!-- CONTRIBUTORS:START -->
<!-- CONTRIBUTORS:END -->

---

## 📄 Licencia y Soporte

**Licencia:** Privado © 2026

- **Issues:** [github.com/egdev6/agent-teams-docs/issues](https://github.com/egdev6/agent-teams-docs/issues)
- **Código fuente:** [github.com/egdev6/agent-teams](https://github.com/egdev6/agent-teams)
