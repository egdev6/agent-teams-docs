# Context Packs

**Estado:** 🧪 Beta

Los context packs son fragmentos reutilizables de documentación o instrucciones que se incrustan en las specs de los agentes durante el proceso de composición. Permiten compartir conocimiento — convenciones, referencias de API, estándares de código — entre múltiples agentes sin duplicar contenido.

---

## Abrir la Página de Context Packs

Dashboard → panel lateral → **Context Packs**

---

## Vista General

La página muestra todos los context packs disponibles en tu workspace. Cada pack muestra:

- **Nombre** — el identificador del pack
- **Prioridad** — con qué prominencia se incluye el contenido del pack (`high`, `medium` o `low`)
- **Toggle** — si el pack está actualmente activo

La cabecera muestra el uso actual del **presupuesto de agents.md** — un indicador del presupuesto de tokens que refleja cuánto espacio de contexto están usando tus packs activos.

---

## Gestionar Packs

### Activar o Desactivar un Pack

Haz clic en el toggle junto a cualquier pack para activarlo o desactivarlo. Los packs desactivados no se incrustan en las specs de los agentes durante el sync.

### Ajustar la Prioridad

Cada pack tiene un selector de prioridad: `high`, `medium` o `low`. La prioridad determina el orden en que se incluyen los packs al resolver la composición de una spec de agente. Los packs de mayor prioridad tienen precedencia.

### Guardar Cambios

Haz clic en **Save** para guardar tus selecciones de toggle y prioridad. Los cambios surten efecto en el siguiente sync.

---

## Crear un Nuevo Pack

1. En la sección **Create Pack** al final de la página, introduce un nombre de pack y selecciona una prioridad
2. Haz clic en **Create** — el pack se añade al registro de tu workspace

Luego puedes añadir contenido al pack editando el archivo generado directamente en VS Code.

---

## Importar un Archivo Markdown como Pack

Haz clic en **Import Markdown** para seleccionar cualquier archivo `.md` de tu workspace. El archivo se importa como un nuevo context pack con su nombre de archivo como ID del pack. Esto es útil para convertir documentación existente — READMEs, guías de código, referencias de API — en context packs reutilizables.

---

## Usar Context Packs en Agentes

Los context packs se asignan a los agentes en dos lugares:

- **Profile Editor** → sección Context Packs — selecciona packs aplicados a todos los agentes del proyecto
- **Create Agent / Edit Agent** → Paso 5 (Output & Context) — selecciona packs para un agente específico

Las asignaciones de packs a nivel de equipo y agente sobreescriben los valores por defecto del proyecto.
