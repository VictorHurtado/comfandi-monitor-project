# Pull Request: [HU-002] [Feature] - Configurar Tailwind y theme base modo claro

## 📌 Descripción

Se implementa la HU-002 para dejar una base visual reusable en `narnia/` con Tailwind CSS y tema claro.
Se definieron tokens `brand-*`, escala tipográfica, radios/sombras y estilos globales base, además de normalizar componentes existentes para consumir los tokens del theme.

## 🔄 Cambios Principales

### 🚀 Servicios

- No aplica.

### 📦 Componentes Agregados

- No se crearon componentes nuevos.
- Se ajustó `HealthStatusCard` para usar tokens y utilidades globales de UI.

### 📱 Pantallas Nuevas

- No aplica.

## 🛠️ Archivos Modificados

| Archivo | Tipo de Cambio |
| --- | --- |
| `narnia/tailwind.config.ts` | Definición de tokens base (`brand-*`, tipografía, radius, shadows, estados) |
| `narnia/src/app/globals.css` | Estilos globales light theme y clases reutilizables (`ui-card`, `ui-control`, `ui-button-primary`) |
| `narnia/src/presentation/components/organisms/HealthStatusCard.tsx` | Normalización visual para usar tokens del theme |
| `narnia/src/presentation/pages/HealthStatusPage.tsx` | Estado de error alineado con tokens base |
| `docs/close/design/system.md` | Documentación de design tokens y reglas de uso |

## ⚙️ Configuración y Entorno

### 🔑 Variables de Entorno

| Variable | Proyecto | Descripción | Ejemplo |
| --- | --- | --- | --- |
| — | — | — | — |

### 📜 Scripts o Comandos Necesarios

```bash
cd narnia
npx jest --coverage
npm run build
```

### 📦 Dependencias Nuevas

- N/A (no se agregaron dependencias).

## ✅ Proceso de Revisión y Merge

- Un revisor debe aprobar el PR antes del merge.
- El código mantiene separación por capas (solo cambios en Presentation + documentación).
- No se permite merge directo sin revisión.

### Cobertura de Tests

| Archivo | Stmts | Branch | Funcs | Lines |
| --- | --- | --- | --- | --- |
| **Global** | **83.49%** | **69.07%** | **93.18%** | **84.86%** |
