# Skills Browser

**Estado:** 🧪 Beta | [← Volver al índice](../README.es.md)

El Skills Browser permite explorar el catálogo de skills definido en `skills.registry.yml`. Las skills describen las capacidades que puede tener un agente — desde operaciones de archivo y análisis de código hasta tareas de git y despliegue.

---

## Abrir el Skills Browser

Dashboard → panel lateral → **Skills**

<img width="1169" height="812" alt="imagen" src="https://github.com/user-attachments/assets/3bf1e7d7-3430-4e56-9b96-e02228b72f83" />

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

<img width="1184" height="1139" alt="imagen" src="https://github.com/user-attachments/assets/8c868a71-4e50-4f68-b180-6cbb5835faa3" />

---

## Aplicar Skills a un Agente

### Desde el dashboard

1. Dashboard → **Agent Manager** → selecciona agente → **Edit**.
2. En la sección **Skills**, busca y marca las skills deseadas.
3. Guarda.

<img width="1171" height="832" alt="imagen" src="https://github.com/user-attachments/assets/b33c08b2-5f95-41d9-9121-906d5019576e" />


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
