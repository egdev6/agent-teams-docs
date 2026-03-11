# Arquitectura Ideal de Agentes

**Estado:** 🧪 Beta

Esta guía explica la arquitectura recomendada para construir un sistema multi-agente con Agent Teams. Seguir este patrón produce un pipeline escalable, mantenible y predecible donde cada capa tiene una única responsabilidad.

---

## El Pipeline de Cuatro Capas

```
Prompt del Usuario  →  Router  →  Orchestrator  →  Worker(s)  →  Tarea Completada
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
- Delegar en un único **orchestrator** (para tareas multi-paso) o directamente en un **worker** (para tareas simples)

**Lo que el router NO debe hacer:**
- Ejecutar ninguna tarea por sí mismo
- Hacer suposiciones sobre detalles de implementación
- Delegar en más de un agente simultáneamente

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

## Ejemplo Completo: Flujo de Extremo a Extremo

```
Usuario:
  @router  Refactoriza el módulo de autenticación para usar tokens JWT.

Router:
  → Puntúa los agentes
  → Selecciona: backend-orchestrator (intención=refactor, archivo=src/auth/, dominio=backend)
  → Delega la petición completa

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

---

## Diagrama de Arquitectura

```
┌──────────────────────┐
│  Prompt del Usuario   │
└──────────┬───────────┘
           │  mensaje @router
           ▼
┌─────────────┐        puntúa y enruta
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

---

## Principios de Diseño

| Principio | Descripción |
|---|---|
| **Responsabilidad única** | Cada capa tiene un trabajo y no invade el de otra |
| **Un único punto de entrada** | Todas las peticiones pasan por `@router` — sin atajos |
| **Los orchestrators coordinan, los workers ejecutan** | Nunca mezcles planificación y ejecución en el mismo agente |
| **Handoffs explícitos** | Cada agente declara `handoffs.delegates_to` y `handoffs.receives_from` |
| **Escalado antes que fallo** | Los workers escalan al orchestrator cuando se bloquean — nunca fallan en silencio |

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

---

## Anti-Patrones Comunes

| Anti-patrón | Problema | Solución |
|---|---|---|
| El usuario se salta el router | No se aplica lógica de routing, se elige el agente incorrecto | Usar siempre `@router` como punto de entrada |
| El router ejecuta tareas | El router se convierte en un cuello de botella y punto único de fallo | El router solo enruta — nunca actúa |
| El orchestrator escribe código | Mezcla coordinación y ejecución, difícil de depurar | Mover la ejecución a un worker dedicado |
| Un worker delega en otro worker | Crea dependencias ocultas y llamadas circulares | Toda la delegación debe pasar por el orchestrator |
| Un único agente "que hace todo" | No escalable, saturación de contexto, salida impredecible | Dividir por dominio en múltiples workers especializados |

---
