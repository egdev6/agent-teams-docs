# Skills Browser

**Estado:** 🧪 Beta

El Skills Browser permite explorar y gestionar las skills de los agentes. Las skills describen las capacidades que puede tener un agente — desde operaciones de archivo y análisis de código hasta tareas de git y despliegue.

---

## Abrir el Skills Browser

Dashboard → panel lateral → **Skills**

<!-- IMAGEN: Captura — Vista principal del Skills Browser mostrando las dos pestañas (Project Skills y Explore), la barra de búsqueda, los chips de filtro por categoría y una cuadrícula de tarjetas de skill con su ID, categoría y descripción. Nombre sugerido: skills-browser-overview-es.png -->

El browser tiene dos pestañas:

| Pestaña | Descripción |
|---|---|
| **Project Skills** | Skills disponibles en este workspace (`skills.registry.yml`) |
| **Explore** | Registro comunitario — explora e instala skills del catálogo compartido |

---

## Pestaña Project Skills

Muestra todas las skills definidas en tu `skills.registry.yml` local.

- **Buscar** — filtra por nombre de skill o palabra clave
- **Filtro de categoría** — restringe a una de las 9 categorías
- **Refresh** — recarga el catálogo de skills desde disco
- **Delete** — elimina una skill del registro del proyecto

La cabecera muestra cuántas skills coinciden con el filtro actual del total.

---

## Pestaña Explore (Registro Comunitario)

Explora skills publicadas en el registro comunitario compartido e instálalas directamente en tu proyecto.

- **Buscar** — encuentra skills por nombre o descripción en el registro remoto
- Cada tarjeta de skill muestra su ID, categoría, descripción y un enlace a su fuente
- Haz clic en **Install** en cualquier tarjeta para añadirla al `skills.registry.yml` de tu proyecto
- Usa la paginación para navegar por el catálogo completo

<!-- IMAGEN: Captura — Pestaña Explore del Skills Browser mostrando el registro comunitario con tarjetas de skill, cada una con un botón "Install", controles de paginación al final, y una skill en proceso de instalación con estado de carga o éxito. Nombre sugerido: skills-browser-install-es.png -->

---

## Categorías de Skills

El registro organiza las skills en 9 categorías:

| Categoría | Descripción |
|---|---|
| `file_operations` | Leer, escribir, crear y eliminar archivos en el workspace |
| `code_analysis` | Analizar estructura de código, detectar patrones y revisar código |
| `execution` | Ejecutar scripts, comandos de shell y tareas de build |
| `browser` | Interactuar con o inspeccionar páginas web |
| `database` | Consultar, migrar y poblar bases de datos |
| `testing` | Ejecutar tests, generar casos de prueba y comprobar cobertura |
| `documentation` | Generar o actualizar documentación, READMEs y changelogs |
| `git` | Operaciones de commit, ramas, diff y merge |
| `deployment` | Construir, empaquetar, publicar y desplegar |

---

## Asignar Skills a un Agente

Las skills se asignan a los agentes a través del editor de agentes:

1. Dashboard → **Agent Manager** → selecciona agente → **Edit**
2. Navega al **Paso 3 — Skills**
3. Busca y selecciona skills del registro del proyecto o instala nuevas desde la comunidad
4. Guarda

<!-- IMAGEN: Captura — Paso 3 del wizard de agentes (Skills) mostrando el skill browser integrado dentro del wizard, con algunas skills ya seleccionadas (marcadas) y la opción de instalación desde la comunidad visible debajo de la lista de skills del proyecto. Nombre sugerido: skills-browser-apply-es.png -->

También puedes asignar skills durante la creación inicial del agente — el mismo paso de skills aparece en el wizard de creación.

---

## Referencia: Añadir una Skill Personalizada

Para añadir una skill que no está en el registro comunitario, agrega una entrada a `skills.registry.yml` en la raíz del workspace siguiendo el formato existente y recarga la extensión:

Paleta de Comandos → **`Agent Teams: Reload Agents`**


