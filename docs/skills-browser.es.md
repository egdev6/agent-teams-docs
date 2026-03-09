# Skills Browser

**Estado:** 🧪 Beta | [← Volver al índice](../README.es.md)

El Skills Browser permite explorar el catálogo de skills definido en `skills.registry.yml`. Las skills describen las capacidades que puede tener un agente — desde operaciones de archivo y análisis de código hasta tareas de git y despliegue.

---

## Abrir el Skills Browser

Dashboard → panel lateral → **Skills**

<!-- screenshot: Dashboard con el icono de Skills resaltado en el panel lateral izquierdo y la página del Skills Browser cargada en el área de contenido principal — mostrando la barra de filtro de categorías en la parte superior y una cuadrícula de tarjetas de skills debajo -->

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

## Explorar Skills

Usa la barra de filtro de categorías en la parte superior para filtrar por categoría. Cada tarjeta de skill muestra:

- **ID** — el identificador usado en el YAML del agente (`skills: [code_analysis]`)
- **Categoría** — una de las 9 categorías anteriores
- **Nivel de seguridad** — indica el nivel de riesgo de las operaciones que habilita la skill
- **Roles recomendados** — qué roles de agente se benefician más (`router`, `orchestrator`, `worker`)

<!-- screenshot: Página del Skills Browser con el filtro de categoría "testing" activo, mostrando solo tarjetas de skills relacionadas con testing — cada tarjeta muestra el nombre de la skill, badge de categoría, nivel de seguridad (bajo/medio/alto) y etiquetas de rol recomendado -->

<!-- screenshot: Una tarjeta de skill expandida mostrando todos los campos de detalle: id en monospacio, badge de categoría, badge de nivel de seguridad (con código de color) y roles recomendados como etiquetas -->

---

## Aplicar Skills a un Agente

### Desde el dashboard

1. Dashboard → **Agent Manager** → selecciona agente → **Edit**.
2. En la sección **Skills**, busca y marca las skills deseadas.
3. Guarda.

<!-- screenshot: La página de edición de agente con la sección Skills expandida — una lista de checkboxes de skills con búsqueda integrada, con "code_analysis" y "testing" marcadas y un campo de búsqueda filtrando la lista -->

### Desde YAML

Añade los IDs de skills al campo `skills` en la spec del agente:

```yaml
id: my-agent
skills:
  - code_analysis
  - testing
  - git
```

---

## Archivo de Registro

Las skills se definen en `skills.registry.yml` en la raíz del workspace. El esquema se valida contra `packages/core/schemas/skills.registry.schema.json`.

Para añadir una skill personalizada, agrega una entrada a `skills.registry.yml` siguiendo el formato existente y recarga la extensión:

Paleta de Comandos → **`Agent Teams: Reload Agents`**

---

[← Volver al índice](../README.es.md)
