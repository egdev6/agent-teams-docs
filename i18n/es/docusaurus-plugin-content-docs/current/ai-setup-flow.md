---
description: Tres agentes de IA integrados guían la configuración completa del proyecto — configuración, creación de agentes y asesoría continua — cada uno disponible en el dashboard en el momento adecuado.
---

# Flujo de Configuración con IA

**Estado:** ✅ Disponible

Agent Teams incluye tres agentes de IA integrados que cubren todo el ciclo de vida del proyecto, desde la configuración inicial hasta la evolución continua del equipo. El dashboard muestra cada uno de forma contextual — solo cuando es relevante para tu estado actual.

> **Sintaxis de invocación** — los agentes integrados funcionan tanto en GitHub Copilot Chat como en Claude Code, pero la sintaxis varía según la plataforma:
>
> | Plataforma | Sintaxis | Ejemplo |
> |---|---|---|
> | **GitHub Copilot Chat** | `@nombre-agente` (chat participant) | `@project-configurator` |
> | **Claude Code** | `/nombre-agente` (slash command) | `/project-configurator` |
>
> El resto de este documento muestra ambas formas cuando se menciona la invocación. Usa la que corresponda a tu herramienta de IA activa.

---

## Los Tres Agentes

```
# GitHub Copilot Chat
@project-configurator  →  @agent-designer  →  @consultant

# Claude Code
/project-configurator  →  /agent-designer  →  /consultant

      (configurar)          (crear agentes)   (asesorar y evolucionar)
```

Cada agente es independiente y puede usarse por separado, pero juntos forman un flujo de incorporación progresivo que te lleva de cero a un workspace completamente configurado y listo para IA.

El flujo es intencionalmente incremental: empieza con un conjunto mínimo de agentes enfocados y deja que `@consultant` identifique las brechas y te guíe para añadir más. Esto evita diseñar una estructura de equipo compleja desde el inicio que consume tokens innecesarios antes de saber qué necesitas realmente.

---

## Paso 1 — Project Configurator

**Cuándo usar:** no existe todavía `project.profile.yml`
**Acceso:** inicio del dashboard → botón **"Auto-configurar con IA"**, o invocar directamente — `@project-configurator` (Copilot) / `/project-configurator` (Claude Code)

`@project-configurator` realiza un análisis exhaustivo e independiente de la tecnología de tu repositorio para generar automáticamente un `project.profile.yml` completo y un conjunto de context packs atomizados con contenido real derivado de la base de código.

### Qué detecta

El agente no asume ninguna tecnología. Lee el árbol de directorios de forma inductiva y busca **cualquier** manifiesto de build o descriptor de proyecto que encuentre — incluyendo, entre otros:

| Ecosistema | Archivos detectados |
|---|---|
| JavaScript / TypeScript | `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `nx.json` |
| Rust | `Cargo.toml`, `Cargo.lock` |
| .NET / C# | `*.csproj`, `*.sln`, `*.fsproj` |
| Android / Kotlin | `build.gradle`, `build.gradle.kts`, `settings.gradle`, `app.json` |
| Go | `go.mod`, `go.sum` |
| Python | `pyproject.toml`, `requirements.txt`, `Pipfile`, `setup.py` |
| Swift / iOS | `Package.swift`, `Podfile`, `*.xcodeproj`, `*.xcworkspace` |
| Flutter / Dart | `pubspec.yaml` |
| Java / Kotlin (JVM) | `pom.xml`, `build.gradle`, `build.sbt` |
| Elixir | `mix.exs` |
| C / C++ | `CMakeLists.txt`, `Makefile` |
| Infra | `Dockerfile`, `docker-compose.yml`, `*.tf`, `Pulumi.yaml`, `cdk.json` |
| CI/CD | `.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile` |

Para **monorepos** con múltiples sub-proyectos que usan stacks diferentes, cada workspace se analiza de forma independiente antes de sintetizar el perfil global.

### Qué genera

Tras tu confirmación, el agente escribe:

1. **`.agent-teams/context-packs/{nombre}.md`** — un pack por cada dominio funcional detectado (p. ej. `android-app`, `backend-api`, `infra`, `conventions`), más un pack universal `architecture`. Cada pack contiene **contenido real** derivado del análisis: responsabilidades de módulos, descripciones de flujo de datos, patrones arquitectónicos observados y convenciones de código — no texto genérico.

2. **`.agent-teams/project.profile.yml`** — todos los campos completados con evidencia del repositorio:
   - `technologies` — solo tecnologías con evidencia directa en archivos
   - `commands` — invocaciones textuales de los manifiestos (`./gradlew assembleDebug`, `cargo test --workspace`, etc.)
   - `paths` — mapeados desde la estructura de directorios real
   - `sync_targets` — inferidos de los directorios objetivo ya existentes (`.github/agents/` → `github_copilot`, `.claude/agents/` → `claude_code`, etc.)

> El agente siempre **espera tu confirmación explícita** antes de escribir cualquier archivo. Si ya existe un `project.profile.yml`, muestra un diff y pregunta antes de sobreescribir.

---

## Paso 2 — Agent Designer

**Cuándo usar:** perfil configurado, quieres crear o editar un agente
**Acceso:** tarjeta Team Agents → botón **"Diseñar con IA"** (acción primaria), o `@agent-designer` (Copilot) / `/agent-designer` (Claude Code)

El botón "Diseñar con IA" es la acción primaria en la cabecera de la tarjeta Team Agents y en el estado vacío cuando no existen agentes. El flujo de **"Crear manualmente"** sigue disponible como opción secundaria.

`@agent-designer` lee el contexto de tu workspace — agentes existentes, skills instaladas y el perfil del proyecto generado en el paso 1 — y produce un AgentSpec enfocado y validado. Empieza con uno o dos agentes que cubran tus flujos de trabajo principales; podrás añadir más después guiado por `@consultant`.

Ver [Diseñador de Agentes](agent-designer.md#diseñador-de-agentes) para el flujo completo.

---

## Paso 3 — Consultant

**Cuándo usar:** perfil + al menos un agente existen
**Acceso:** inicio del dashboard → tarjeta **"Consulta tu equipo"**, o `@consultant` (Copilot) / `/consultant` (Claude Code)

`@consultant` es un agente de asesoría de solo lectura. Analiza el estado actual de tu equipo respecto al perfil del proyecto y proporciona recomendaciones estructuradas. **Nunca modifica ningún archivo** — la ejecución siempre delega a `@agent-designer`.

### Qué analiza

- **Brechas de cobertura** — dominios funcionales del perfil del proyecto sin un agente dedicado
- **Solapamientos de responsabilidad** — pares de agentes que comparten la misma responsabilidad principal
- **Problemas de topología** — referencias de handoff rotas, objetivos de escalado faltantes, cadenas de delegación circulares
- **Asignaciones de context packs** — packs en `.agent-teams/context-packs/` no referenciados por ningún agente

### Qué recomienda

- **Propuestas de nuevos agentes** — `id`, `role`, `domain`, `intents` y `scope.topics` concretos para cada brecha, basados en el stack tecnológico real
- **Integraciones MCP** — servicios externos donde un servidor MCP permitiría a un agente actuar en lugar de solo asesorar (p. ej. `@modelcontextprotocol/server-github` para un agente orientado a GitHub)
- **Asignaciones de skills** — skills de `skills.registry.yml` que deberían añadirse a agentes existentes específicos, con condiciones `when`
- **Próximos pasos** — cada respuesta cierra con punteros explícitos: "Para añadir `data-engineer` → abre `@agent-designer`"

Este bucle de asesoría es como crece el equipo de forma incremental: añade agentes uno a uno según `@consultant` identifique brechas reales, en lugar de intentar diseñar el equipo completo desde el inicio.

---

## Visibilidad en el Dashboard

La página de inicio del dashboard muestra el CTA de agente adecuado en cada fase:

| Estado | Tarjeta mostrada | Acción primaria |
|---|---|---|
| Sin perfil | Configura tu proyecto | **Auto-configurar con IA** → `@project-configurator` (Copilot) / `/project-configurator` (Claude Code) |
| Sin perfil | Configura tu proyecto | Configurar manualmente → Profile Editor |
| Perfil ✓ | Cabecera y estado vacío de Team Agents | **Diseñar con IA** → `@agent-designer` (Copilot) / `/agent-designer` (Claude Code) |
| Perfil ✓ | Cabecera y estado vacío de Team Agents | Crear manualmente → Wizard de agentes |
| Perfil ✓, agentes > 0 | Consultant | **Consulta tu equipo** → `@consultant` (Copilot) / `/consultant` (Claude Code) |

---

## Usando los Tres Juntos

Una configuración típica de primera vez con un repositorio nuevo:

1. **Instala la extensión** → el dashboard se abre con la tarjeta "Configura tu proyecto"
2. Haz clic en **"Auto-configurar con IA"** → `@project-configurator` (Copilot) o `/project-configurator` (Claude Code) escanea tu repositorio, propone el perfil y los context packs → confirmas → se escriben los archivos
3. El dashboard detecta el nuevo perfil → la tarjeta Team Agents muestra **"Diseñar con IA"** → haz clic → `@agent-designer` / `/agent-designer` lee tu perfil y agentes existentes, produce un AgentSpec enfocado → guarda → repite para cada agente inicial que necesites
4. Sincroniza una vez → agentes desplegados en tus plataformas objetivo
5. A medida que el proyecto crece, abre **"Consulta tu equipo"** → `@consultant` / `/consultant` identifica nuevas brechas de cobertura → sigue sus punteros de "Próximos pasos" para abrir `@agent-designer` / `/agent-designer` para cada nuevo agente

Los tres agentes funcionan con cualquier tipo de proyecto o lenguaje — el flujo completo es independiente de la tecnología.
