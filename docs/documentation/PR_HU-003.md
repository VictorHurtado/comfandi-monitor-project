# Pull Request: [HU-003] [Feature] - Crear cascaron UI del selector de proyectos

## 📌 Descripción

Se implementa el cascaron UI de la pantalla de selector de proyectos en `narnia`, siguiendo la HU-003 y respetando el alcance de Presentation only.  
La pantalla incluye header, hero, filtros visuales, grid de tarjetas con estados estaticos (saludable, atencion, critico), tarjeta de nuevo proyecto y footer.  
No se agrego logica de negocio ni consumo de APIs.

## 🔄 Cambios Principales

### 🚀 Servicios

No aplica.

### 📦 Componentes Agregados

- `ProjectCard`: tarjeta reutilizable de proyecto con estado visual.
- `ProjectFilters`: bloque de busqueda y filtros visuales.
- `ProjectSelectorLayout`: layout principal del selector (header, contenido, footer).

### 📱 Pantallas Nuevas

- `ProjectSelectorPage`: pagina de Presentation con mocks estaticos para el selector.
- Ruta App Router: `/project-selector`.

## 🛠️ Archivos Modificados

| Archivo | Tipo de Cambio |
| --- | --- |
| `narnia/src/app/project-selector/page.tsx` | Nueva ruta del selector de proyectos |
| `narnia/src/presentation/components/molecules/ProjectCard.tsx` | Nuevo componente de tarjeta de proyecto |
| `narnia/src/presentation/components/molecules/ProjectFilters.tsx` | Nuevo componente de filtros visuales |
| `narnia/src/presentation/components/molecules/__tests__/ProjectCard.test.tsx` | Nuevo test de render para tarjeta |
| `narnia/src/presentation/components/organisms/ProjectSelectorLayout.tsx` | Nuevo layout principal del selector |
| `narnia/src/presentation/pages/ProjectSelectorPage.tsx` | Nueva pagina con datos mock estaticos |
| `narnia/src/presentation/pages/__tests__/ProjectSelectorPage.test.tsx` | Nuevo test de render de pagina |
| `docs/documentation/PR_HU-003.md` | Documentacion del PR de HU-003 |

## ⚙️ Configuración y Entorno

### 🔑 Variables de Entorno

| Variable | Proyecto | Descripción | Ejemplo |
| --- | --- | --- | --- |
| — | — | — | — |

### 📜 Scripts o Comandos Necesarios

```bash
npx jest --coverage
npm run build
```

### 📦 Dependencias Nuevas

- N/A (no se agregaron dependencias)

## ✅ Proceso de Revisión y Merge

- Un revisor debe aprobar el PR antes del merge.
- El codigo cumple arquitectura por capas (cambios en Presentation/route).
- No se permite merge directo sin revision.

### Cobertura de Tests

| Archivo | Stmts | Branch | Funcs | Lines |
| --- | --- | --- | --- | --- |
| **Global** | **84.4%** | **69.07%** | **94%** | **85.78%** |
