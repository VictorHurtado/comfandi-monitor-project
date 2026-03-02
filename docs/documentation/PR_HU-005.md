# Pull Request: [HU-005] [Feature] - Integrar tarjeta SonarQube en dashboard con datos mock

## 📌 Descripción

Se implementó la HU-005 para renderizar la tarjeta de SonarQube en el dashboard técnico con datos mock, incluyendo métricas legibles (`qualityGateStatus`, `coverage`, `bugs`, `vulnerabilities`) y estados visuales `healthy`, `warning`, `critical` y `unknown`, manteniendo arquitectura por capas.

## 🔄 Cambios Principales

### 🚀 Servicios

- No aplica.

### 📦 Componentes Agregados

- `IntegrationCardsGrid` actualizado para render dinámico de integraciones con tarjeta SonarQube mock y fallback visual `unknown`.

### 📱 Pantallas Nuevas

- No aplica.

## 🛠️ Archivos Modificados

| Archivo | Tipo de Cambio |
| --- | --- |
| `narnia/src/domain/models/TechnicalIntegrationCard.ts` | Nuevo modelo de dominio para tarjetas técnicas y métricas Sonar |
| `narnia/src/domain/repositories/ITechnicalIntegrationRepository.ts` | Nuevo contrato de repositorio de tarjetas técnicas |
| `narnia/src/domain/usecases/GetTechnicalIntegrationCardsUseCase.ts` | Nuevo use case para obtener tarjetas técnicas |
| `narnia/src/domain/usecases/__tests__/GetTechnicalIntegrationCardsUseCase.test.ts` | Tests del nuevo use case |
| `narnia/src/infrastructure/repositories/TechnicalIntegrationRepository.ts` | Nuevo repositorio mock con fallback `unknown` |
| `narnia/src/infrastructure/repositories/__tests__/TechnicalIntegrationRepository.test.ts` | Tests del repositorio mock |
| `narnia/src/infrastructure/ioc/repositories/repositories.types.ts` | Nuevo símbolo IoC para `ITechnicalIntegrationRepository` |
| `narnia/src/infrastructure/ioc/repositories/repositories.module.ts` | Binding IoC del repositorio técnico |
| `narnia/src/infrastructure/ioc/usecases/usecases.types.ts` | Nuevo símbolo IoC para `GetTechnicalIntegrationCardsUseCase` |
| `narnia/src/infrastructure/ioc/usecases/usecases.module.ts` | Binding IoC del nuevo use case |
| `narnia/src/infrastructure/ioc/__tests__/container.test.ts` | Validación de resolución IoC para el nuevo use case |
| `narnia/src/presentation/pages/HealthStatusPage.tsx` | Consumo del use case y envío de datos al layout |
| `narnia/src/presentation/components/organisms/TechnicalHealthDashboardLayout.tsx` | Recepción de cards por props |
| `narnia/src/presentation/components/organisms/IntegrationCardsGrid.tsx` | Render de SonarQube con métricas mock + estados visuales/fallback |
| `narnia/src/presentation/components/organisms/__tests__/TechnicalHealthDashboardLayout.test.tsx` | Ajuste de test del layout con datos dinámicos |
| `narnia/src/presentation/components/organisms/__tests__/IntegrationCardsGrid.test.tsx` | Nuevo test de métricas Sonar y estados visuales |

## ⚙️ Configuración y Entorno

### 🔑 Variables de Entorno

| Variable | Proyecto | Descripción | Ejemplo |
| --- | --- | --- | --- |
| `AUTH_DISABLED` | `narnia` | Permite correr local sin Keycloak para validación | `true` |

### 📜 Scripts o Comandos Necesarios

```bash
# No aplica (sin pasos post-merge adicionales)
```

### 📦 Dependencias Nuevas

- N/A (no se agregaron dependencias)

## ✅ Proceso de Revisión y Merge

- Un revisor debe aprobar el PR antes del merge.
- El código cumple arquitectura por capas: Presentation -> Domain <- Infrastructure.
- No se permite merge directo sin revisión.

### Cobertura de Tests

| Archivo | Stmts | Branch | Funcs | Lines |
| --- | --- | --- | --- | --- |
| **Global** | **89.05%** | **77.98%** | **96.42%** | **90.15%** |
