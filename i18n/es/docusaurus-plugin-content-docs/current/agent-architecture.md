# Arquitectura Ideal de Agentes

**Estado:** 🧪 Beta

Esta guía explica la arquitectura recomendada para construir un sistema multi-agente con Agent Teams. Seguir este patrón produce un pipeline escalable, mantenible y predecible donde cada capa tiene una única responsabilidad.

---

## El Pipeline

```
Dominio único:
  Prompt del Usuario  →  Router  →  Orchestrator  →  Worker(s)  →  Tarea Completada

Múltiples dominios (despacho en paralelo):
  Prompt del Usuario  →  Router  →  Orchestrator A ┐
                                     Orchestrator B ┤ → Workers → Aggregator → Tarea Completada
                                     Orchestrator C ┘
```

Cada capa transforma la entrada de una forma específica antes de pasarla a la siguiente. Ninguna capa se salta pasos ni asume responsabilidades fuera de su ámbito.

---

## Capa 1 — Prompt del Usuario

El punto de entrada. El usuario envía un mensaje en lenguaje natural a través de Copilot Chat usando `@router`.

```
@router  Refactoriza el módulo de autenticación para usar tokens JWT.
```

**Qué ocurre aquí:**
- El usuario expresa una intención en lenguaje natural
- No se espera ninguna estructura ni lógica de routing por parte del usuario
- El mensaje puede hacer referencia a un archivo, un dominio o un objetivo vago

**Buenas prácticas:**
- Mantén `@router` como único punto de entrada para todas las peticiones
- Evita saltarte el router dirigiéndote directamente a un agente específico, salvo que necesites control preciso

---

## Capa 2 — Router

El router es el controlador de tráfico. Recibe cada mensaje de `@router`, lo analiza y delega en el agente más adecuado.

**Responsabilidades:**
- Analizar palabras clave de intención (p. ej. `refactor`, `write`, `review`, `fix`)
- Comparar la ruta del archivo activo con los patrones glob de los agentes
- Puntuar agentes por vocabulario de dominio, áreas de expertise y rol
- Para tareas de dominio único: usar `agent-teams-handoff` para abrir un chat con un orchestrator específico
- Para tareas multi-dominio: usar `agent-teams-dispatch-parallel` para despachar en paralelo a múltiples orchestrators

**Lo que el router NO debe hacer:**
- Ejecutar ninguna tarea por sí mismo
- Hacer suposiciones sobre detalles de implementación
- Llamar a los orchestrators como herramientas de sub-agente directamente — siempre usar las herramientas de despacho (`agent-teams-handoff` o `agent-teams-dispatch-parallel`)

**Ejemplo de decisión de routing:**

| Señal | Valor | Agente seleccionado |
|---|---|---|
| Palabra clave de intención | `refactor` | `backend-orchestrator` |
| Archivo activo | `src/auth/jwt.ts` | `backend-orchestrator` |
| Coincidencia de dominio | `backend`, `auth` | `backend-orchestrator` |

> El router se configura como `role: router` en su YAML. Solo debe existir un agente router por equipo.

---

## Capa 3 — Orchestrator

El orchestrator recibe una tarea delegada por el router y la descompone en una secuencia ordenada de subtareas. Coordina a los workers pero no implementa nada por sí mismo.

**Responsabilidades:**
- Descomponer la petición original en pasos discretos y accionables
- Determinar qué agente worker gestiona cada paso
- Definir el orden y las dependencias entre los pasos
- Agregar o resumir los resultados de los workers antes de devolver una respuesta

**Lo que el orchestrator NO debe hacer:**
- Escribir, leer o modificar archivos directamente
- Ejecutar comandos de shell o llamar a APIs externas
- Saltarse el plan y responder al usuario sin completarlo

**Ejemplo de descomposición:**

```
Tarea: Refactorizar el módulo de autenticación para usar tokens JWT

Paso 1 → [backend-worker]   Analizar el código de auth existente e identificar puntos de acoplamiento
Paso 2 → [backend-worker]   Reemplazar la lógica de sesión con emisión y validación JWT
Paso 3 → [testing-worker]   Generar tests unitarios para las nuevas funciones JWT
Paso 4 → [docs-worker]      Actualizar la documentación de referencia de la API
```

> Un orchestrator se configura como `role: orchestrator`. Un equipo puede tener varios orchestrators, cada uno especializado en un dominio (p. ej. `frontend-orchestrator`, `backend-orchestrator`).

---

## Capa 4 — Worker(s)

Los workers son los agentes que realmente ejecutan el trabajo. Cada worker es un especialista de dominio con un ámbito estrecho y bien definido.

**Responsabilidades:**
- Ejecutar la subtarea específica delegada por el orchestrator
- Usar solo las herramientas y skills definidas en su spec
- Devolver un resultado estructurado al orchestrator
- Escalar si la subtarea está fuera de su ámbito

**Lo que un worker NO debe hacer:**
- Aceptar tareas fuera de su dominio declarado
- Delegar directamente en otros workers (toda la coordinación pasa por el orchestrator)
- Devolver resultados parciales sin señalar la incompletitud

**Ejemplos de workers:**

| Worker | Dominio | Tareas típicas |
|---|---|---|
| `backend-worker` | `backend` | Lógica de API, consultas a base de datos, capa de servicios |
| `frontend-worker` | `frontend` | Componentes, estilos, gestión de estado |
| `testing-worker` | `testing` | Tests unitarios, tests de integración, cobertura |
| `docs-worker` | `documentation` | Actualizaciones de README, docs de API, changelogs |

> Los workers se configuran como `role: worker`. Puedes tener tantos workers como necesites, cada uno cubriendo un dominio o subdominio específico.

---

## Capa 5 — Aggregator

El aggregator se usa exclusivamente en flujos de **despacho en paralelo**. Cuando el router despacha una tarea a múltiples orchestrators simultáneamente, el aggregator recibe todos sus resultados una vez que cada subtarea está completa, los fusiona y devuelve una respuesta unificada al usuario.

**Responsabilidades:**
- Cargar el resultado de cada orchestrator desde Engram usando el ID de tarea
- Detectar conflictos (p. ej. dos orchestrators modificando el mismo archivo)
- Informar los conflictos claramente antes de presentar el resultado unificado
- Persistir el resultado fusionado en Engram bajo `task:{taskId}:result`

**Lo que el aggregator NO debe hacer:**
- Ejecutar subtareas por sí mismo
- Proceder antes de que todas las subtareas paralelas hayan señalizado su finalización
- Ignorar conflictos en silencio — todas las superposiciones de archivos entre dominios deben reportarse

> El aggregator se configura como `role: aggregator`. Solo es necesario cuando el equipo usa despacho en paralelo. Un aggregator por equipo es suficiente.

---

## Ejemplo Completo: Flujo de Extremo a Extremo

### Dominio único

```
Usuario:
  @router  Refactoriza el módulo de autenticación para usar tokens JWT.

Router:
  → Puntúa los agentes
  → Selecciona: backend-orchestrator (intención=refactor, archivo=src/auth/, dominio=backend)
  → Llama a agent-teams-handoff → abre chat con backend-orchestrator

Orchestrator (backend-orchestrator):
  → Descompone la tarea en 4 pasos
  → Paso 1 → backend-worker   (analizar código existente)
  → Paso 2 → backend-worker   (reemplazar sesión por JWT)
  → Paso 3 → testing-worker   (escribir tests unitarios)
  → Paso 4 → docs-worker      (actualizar docs de API)
  → Agrega los resultados
  → Devuelve resumen al usuario

Tarea completada.
```

### Múltiples dominios (despacho en paralelo)

```
Usuario:
  @router  Añade un endpoint /payments con formulario frontend y cobertura de tests completa.

Router:
  → Identifica 3 dominios independientes: backend, frontend, testing
  → Llama a agent-teams-dispatch-parallel con subtareas para cada orchestrator
  → Abre 3 chats en paralelo simultáneamente

Orchestrators (en paralelo):
  backend-orchestrator  → implementa el endpoint REST
  frontend-orchestrator → construye el componente del formulario de pago
  testing-orchestrator  → escribe tests end-to-end y unitarios

  Cada orchestrator llama a agent-teams-complete-subtask al terminar

Aggregator:
  → Carga los 3 resultados desde Engram
  → Detecta conflictos (p. ej. backend y frontend tocaron api-client.ts)
  → Reporta conflictos y presenta el resultado unificado

Tarea completada.
```

---

## Diagrama de Arquitectura

### Dominio único

```
┌──────────────────────┐
│  Prompt del Usuario   │
└──────────┬───────────┘
           │  mensaje @router
           ▼
┌─────────────┐        agent-teams-handoff
│    Router    │ ──────────────────────────────┐
└─────────────┘                                │
                                               ▼
                                  ┌────────────────────────┐
                                  │      Orchestrator       │
                                  │  (descompone la tarea)  │
                                  └────────┬───────────────┘
                                           │  delega subtareas
                          ┌────────────────┼────────────────┐
                          ▼                ▼                 ▼
                   ┌────────────┐  ┌────────────┐  ┌────────────┐
                   │  Worker A  │  │  Worker B  │  │  Worker C  │
                   │ (backend)  │  │ (testing)  │  │   (docs)   │
                   └─────┬──────┘  └─────┬──────┘  └─────┬──────┘
                         │               │                │
                         └───────────────┴────────────────┘
                                         │  resultados
                                         ▼
                               ┌──────────────────┐
                               │  Tarea Hecha ✓   │
                               └──────────────────┘
```

### Múltiples dominios (despacho en paralelo)

```
┌──────────────────────┐
│  Prompt del Usuario   │
└──────────┬───────────┘
           │  mensaje @router
           ▼
┌─────────────┐   agent-teams-dispatch-parallel
│    Router    │ ─────────────────────────────────────────────┐
└─────────────┘                                               │
                         ┌──────────────────────┬─────────────────────┐
                         ▼                      ▼                      ▼
              ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
              │  Orchestrator A  │   │  Orchestrator B  │   │  Orchestrator C  │
              └────────┬────────┘   └────────┬────────┘   └────────┬────────┘
                       │ workers              │ workers              │ workers
                       ▼                      ▼                      ▼
                [complete-subtask]     [complete-subtask]     [complete-subtask]
                       │                      │                      │
                       └──────────────────────┴──────────────────────┘
                                              │  todas las subtareas completadas
                                              ▼
                                    ┌──────────────────┐
                                    │    Aggregator    │
                                    │ (fusiona result., │
                                    │ detecta conflictos)│
                                    └────────┬─────────┘
                                             │
                                             ▼
                                    ┌──────────────────┐
                                    │  Tarea Hecha ✓   │
                                    └──────────────────┘
```

---

## Principios de Diseño

| Principio | Descripción |
|---|---|
| **Responsabilidad única** | Cada capa tiene un trabajo y no invade el de otra |
| **Un único punto de entrada** | Todas las peticiones pasan por `@router` — sin atajos |
| **Los orchestrators coordinan, los workers ejecutan** | Nunca mezcles planificación y ejecución en el mismo agente |
| **Handoffs explícitos** | Cada agente declara `handoffs.delegates_to` y `handoffs.receives_from` |
| **Escalado antes que fallo** | Los workers escalan al orchestrator cuando se bloquean — nunca fallan en silencio |
| **Herramientas de despacho para multi-dominio** | Los routers usan `agent-teams-handoff` o `agent-teams-dispatch-parallel` — nunca llaman directamente a los orchestrators |
| **El aggregator cierra el ciclo** | Los flujos en paralelo siempre terminan con un aggregator que fusiona resultados y reporta conflictos |

---

## Configurar Handoffs en YAML

```yaml
# backend-orchestrator.yml
id: backend-orchestrator
name: Backend Orchestrator
role: orchestrator
handoffs:
  receives_from:
    - router
  delegates_to:
    - backend-worker
    - testing-worker
    - docs-worker
  escalates_to:
    - human
```

```yaml
# backend-worker.yml
id: backend-worker
name: Backend Worker
role: worker
handoffs:
  receives_from:
    - backend-orchestrator
  delegates_to: []
  escalates_to:
    - backend-orchestrator
```

```yaml
# results-aggregator.yml
id: results-aggregator
name: Results Aggregator
role: aggregator
handoffs:
  receives_from:
    - backend-orchestrator
    - frontend-orchestrator
    - testing-orchestrator
  delegates_to: []
  escalates_to:
    - human
```

---

## Anti-Patrones Comunes

| Anti-patrón | Problema | Solución |
|---|---|---|
| El usuario se salta el router | No se aplica lógica de routing, se elige el agente incorrecto | Usar siempre `@router` como punto de entrada |
| El router ejecuta tareas | El router se convierte en un cuello de botella y punto único de fallo | El router solo enruta — nunca actúa |
| El router llama a orchestrators directamente como herramientas | Omite el traspaso de contexto y el seguimiento de tareas vía Engram | Usar siempre `agent-teams-handoff` o `agent-teams-dispatch-parallel` |
| El orchestrator escribe código | Mezcla coordinación y ejecución, difícil de depurar | Mover la ejecución a un worker dedicado |
| Un worker delega en otro worker | Crea dependencias ocultas y llamadas circulares | Toda la delegación debe pasar por el orchestrator |
| Un único agente "que hace todo" | No escalable, saturación de contexto, salida impredecible | Dividir por dominio en múltiples workers especializados |
| Despacho en paralelo sin aggregator | Los resultados nunca se fusionan; los conflictos no se detectan | Añadir un agente con `role: aggregator` al equipo |
| El aggregator inicia antes de que todas las subtareas terminen | Lee el estado incompleto de Engram y produce una salida incorrecta | `agent-teams-complete-subtask` garantiza que el aggregator solo se abre cuando todas las subtareas señalizan su finalización |

---
