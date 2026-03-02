# Pull Request: [HU-005] [Feature] - Integrar tarjeta SonarQube en Dashboard con datos mock

## 📌 Descripción

Se integra la tarjeta de SonarQube en el dashboard de salud técnica con datos mock. La tarjeta muestra qualityGateStatus, coverage, bugs y vulnerabilities, estados visuales (healthy, warning, critical, unknown) y fallback amigable cuando no hay datos. Se respeta la arquitectura por capas (Domain, Infrastructure, Presentation).

## 🔄 Cambios Principales

### 🚀 Servicios

No aplica.

### 📦 Componentes Agregados

- `SonarIntegrationCard`: tarjeta de integración SonarQube con métricas, semáforo de estado y fallback para unknown.
- `useSonarIntegrationStatus`: hook que consume GetSonarIntegrationStatusUseCase vía IoC.

### 📱 Pantallas Nuevas

No aplica.

## 🛠️ Archivos Modificados

| Archivo | Tipo de Cambio |
| --- | --- |
| `narnia/src/domain/models/SonarIntegrationStatus.ts` | Nuevo modelo de dominio |
| `narnia/src/domain/repositories/ISonarRepository.ts` | Nuevo contrato de repositorio |
| `narnia/src/domain/usecases/sonar/GetSonarIntegrationStatusUseCase.ts` | Nuevo use case |
| `narnia/src/infrastructure/repositories/SonarRepository.ts` | Nueva implementación mock |
| `narnia/src/infrastructure/ioc/repositories/repositories.types.ts` | Añadido ISonarRepository |
| `narnia/src/infrastructure/ioc/repositories/repositories.module.ts` | Binding SonarRepository |
| `narnia/src/infrastructure/ioc/usecases/usecases.types.ts` | Añadido GetSonarIntegrationStatusUseCase |
| `narnia/src/infrastructure/ioc/usecases/usecases.module.ts` | Binding use case |
| `narnia/src/presentation/components/molecules/SonarIntegrationCard.tsx` | Nueva tarjeta Sonar |
| `narnia/src/presentation/hooks/useSonarIntegrationStatus.ts` | Nuevo hook |
| `narnia/src/presentation/components/organisms/IntegrationCardsGrid.tsx` | Usa SonarIntegrationCard |
| `narnia/src/presentation/components/organisms/__tests__/TechnicalHealthDashboardLayout.test.tsx` | Tests actualizados |
| `narnia/src/presentation/pages/__tests__/HealthStatusPage.test.tsx` | waitFor para Sonar |
| `narnia/src/infrastructure/ioc/__tests__/container.test.ts` | Test GetSonarIntegrationStatusUseCase |

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

| Métrica | Stmts | Branch | Funcs | Lines |
| --- | --- | --- | --- | --- |
| **Global** | **89.61%** | **76.51%** | **95.89%** | **90.14%** |
