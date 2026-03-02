# Pull Request: [HU-004] [Feature] - Cascarón UI dashboard de salud técnica

## 📌 Descripción

Se implementa el cascarón visual completo del dashboard de salud técnica general en tema claro, usando datos mock estáticos y componentes reutilizables de Presentation. No se agregan integraciones reales ni lógica de negocio.

## 🔄 Cambios Principales

### 🚀 Servicios

No aplica.

### 📦 Componentes Agregados

- `TechnicalHealthDashboardLayout`: compone sidebar, header, filtros de tiempo, KPI principal y secciones del dashboard.
- `IntegrationCardsGrid`: renderiza cards mock de SonarQube, GitHub, Sentry y Proteo.
- `RecentAlertsPanel`: lista alertas recientes con estilos por severidad.
- `ComplianceSummaryTable`: tabla de métricas de cumplimiento con indicadores visuales.

### 📱 Pantallas Nuevas

No aplica (se actualiza la página existente `HealthStatusPage` para renderizar el nuevo dashboard).

## 🛠️ Archivos Modificados

| Archivo | Tipo de Cambio |
| --- | --- |
| `narnia/src/presentation/pages/HealthStatusPage.tsx` | Se reemplaza dependencia de UseCase por render de layout estático del dashboard |
| `narnia/src/presentation/components/organisms/TechnicalHealthDashboardLayout.tsx` | Nuevo layout principal de dashboard técnico (light-only) |
| `narnia/src/presentation/components/organisms/IntegrationCardsGrid.tsx` | Nuevo grid de cards de integraciones con mocks estáticos |
| `narnia/src/presentation/components/organisms/RecentAlertsPanel.tsx` | Nuevo panel de alertas recientes con placeholders |
| `narnia/src/presentation/components/organisms/ComplianceSummaryTable.tsx` | Nueva tabla de cumplimiento con indicadores visuales |
| `narnia/src/presentation/pages/__tests__/HealthStatusPage.test.tsx` | Pruebas ajustadas a la nueva estructura del dashboard |
| `narnia/src/presentation/components/organisms/__tests__/TechnicalHealthDashboardLayout.test.tsx` | Pruebas nuevas para secciones clave del layout |

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
- El código debe cumplir con buenas prácticas y estándares de calidad.
- No se permite merge directo sin revisión.

### Cobertura de Tests

| Archivo | Stmts | Branch | Funcs | Lines |
| --- | --- | --- | --- | --- |
| **Global** | **85.93%** | **69.91%** | **95.38%** | **87.08%** |
