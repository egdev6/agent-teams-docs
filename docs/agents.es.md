# Agentes

**Estado:** 🧪 Beta | [← Volver al índice](../README.es.md)

Los agentes son el bloque fundamental de Agent Teams. Cada agente es un participante de chat de GitHub Copilot con un rol definido, skills, reglas de routing y context packs opcionales.

---

## Crear un Agente

### Usando el Wizard (recomendado)

1. Paleta de Comandos → **`Agent Teams: Create Agent`**  
   O: Dashboard → **Acciones Rápidas** → **Create Agent**
2. Sigue los pasos: nombre, rol, skills, palabras clave de routing, context packs.
3. La spec del agente (`.yml`) se crea en `.agent-teams/agents/`.

<!-- screenshot: La página del wizard de creación de agentes dentro del dashboard, mostrando el paso 1 — campos para el nombre del agente y el selector de rol (router / orchestrator / worker) -->

### Desde una spec YAML (CLI)

```bash
agent-teams agents:create --spec ruta/al/agente.yml
```

---

## Formato YAML del Agente

```yaml
id: my-agent
name: My Agent
description: Descripción breve de lo que hace este agente
role: worker          # router | orchestrator | worker

skills:
  - code_analysis
  - file_operations

routing:
  keywords:
    - component
    - react
    - frontend
  paths:
    - src/components/**

context_packs:
  - frontend-conventions
```

### Campos

| Campo | Requerido | Descripción |
|---|---|---|
| `id` | ✅ | Identificador único (kebab-case) |
| `name` | ✅ | Nombre mostrado en Copilot Chat |
| `description` | ✅ | Qué hace el agente |
| `role` | ✅ | `router`, `orchestrator` o `worker` |
| `skills` | — | Lista de IDs de skills del registro |
| `routing.keywords` | — | Palabras que activan el routing hacia este agente |
| `routing.paths` | — | Patrones glob para routing basado en archivo |
| `context_packs` | — | IDs de context packs a incluir en las respuestas |

---

## Gestionar Agentes

### Editar un Agente

1. Dashboard → **Agent Manager** → selecciona agente → **Edit**.
2. Modifica los campos y guarda.
3. Los cambios se escriben de vuelta en el archivo YAML de la spec.

<!-- screenshot: La página de edición de agente con una spec cargada, mostrando los campos editables de skills (lista de checkboxes) y palabras clave de routing (entrada de etiquetas), con el botón Guardar al fondo -->

### Validar Specs

```bash
agent-teams agents:validate
```

Valida todas las specs de agentes del workspace contra el esquema JSON.

### Sincronizar Agentes a `.github/agents/`

```bash
# Previsualizar cambios sin escribir archivos
agent-teams agents:sync --dry-run

# Aplicar
agent-teams agents:sync
```

O mediante la Paleta de Comandos: **`Agent Teams: Sync Agents`**

### Recargar sin Reiniciar

Paleta de Comandos → **`Agent Teams: Reload Agents`**

Recoge los cambios realizados en archivos YAML desde la última carga.

---

## Usar un Agente en Copilot Chat

Cada agente cargado se registra como participante de chat dinámico:

```
@my-agent  ¿Cuál es la mejor forma de estructurar este componente React?
```

Usa `@router` para que la extensión seleccione automáticamente el agente más relevante en función de tu mensaje y del archivo activo:

```
@router  Ayúdame a escribir un test unitario para esta función.
```

El router puntúa los agentes por palabras clave de intención, patrones de ruta de archivo, vocabulario de dominio y rol — y delega al que obtiene mayor puntuación.

<!-- screenshot: Panel de Copilot Chat de VS Code con @router escrito, una pregunta enviada y la respuesta mostrando qué agente fue seleccionado y su respuesta -->

---

[← Volver al índice](../README.es.md)
