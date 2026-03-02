# Pull Request: [HU-005] [Feature] - Integrar tarjeta SonarQube en dashboard con datos mock

## 📌 Descripción

Implementa la tarjeta de SonarQube en el dashboard de salud técnica (`/dashboard/technical-health`) con datos mock. La tarjeta muestra métricas clave (Quality Gate, Coverage, Bugs, Vulnerabilities) y estados visuales (healthy, warning, critical, unknown). Se respeta la arquitectura por capas (Presentation → Domain ← Infrastructure) con modelo, repositorio mock, use case e IoC.

## 🔄 Cambios Principales

### 🚀 Servicios

- No aplica (se usa repositorio mock sin llamadas externas)

### 📦 Componentes Agregados

| Componente | Capa | Descripción |
|---|---|---|
| `SonarQubeMetrics.ts` | Domain / Models | Modelo de métricas SonarQube (qualityGateStatus, coverage, bugs, vulnerabilities) |
| `ISonarQubeRepository.ts` | Domain / Repositories | Contrato del repositorio de datos SonarQube |
| `GetSonarQubeMetricsUseCase.ts` | Domain / UseCases | Caso de uso que obtiene datos de SonarQube via repositorio |
| `MockSonarQubeRepository.ts` | Infrastructure / Repositories | Implementación mock que retorna datos hardcodeados |
| `SonarQubeCard.tsx` | Presentation / Organisms | Tarjeta visual de SonarQube con estados, skeleton y fallback unknown |

### 📱 Pantallas Nuevas

- No aplica (se integra en dashboard existente)

## 🛠️ Archivos Modificados

| Archivo | Tipo de Cambio |
|---|---|
| `src/domain/models/SonarQubeMetrics.ts` | Nuevo — modelo de dominio |
| `src/domain/repositories/ISonarQubeRepository.ts` | Nuevo — contrato repositorio |
| `src/domain/usecases/GetSonarQubeMetricsUseCase.ts` | Nuevo — caso de uso |
| `src/infrastructure/repositories/MockSonarQubeRepository.ts` | Nuevo — repositorio mock |
| `src/infrastructure/ioc/repositories/repositories.types.ts` | Modificado — symbol ISonarQubeRepository |
| `src/infrastructure/ioc/repositories/repositories.module.ts` | Modificado — binding mock repo |
| `src/infrastructure/ioc/usecases/usecases.types.ts` | Modificado — symbol GetSonarQubeMetricsUseCase |
| `src/infrastructure/ioc/usecases/usecases.module.ts` | Modificado — binding use case |
| `src/presentation/components/organisms/SonarQubeCard.tsx` | Nuevo — componente tarjeta |
| `src/presentation/components/organisms/IntegrationCardsGrid.tsx` | Modificado — integra SonarQubeCard |
| `src/domain/usecases/__tests__/GetSonarQubeMetricsUseCase.test.ts` | Nuevo — tests use case |
| `src/infrastructure/repositories/__tests__/MockSonarQubeRepository.test.ts` | Nuevo — tests repo mock |
| `src/presentation/components/organisms/__tests__/SonarQubeCard.test.tsx` | Nuevo — tests tarjeta |
| `src/presentation/components/organisms/__tests__/TechnicalHealthDashboardLayout.test.tsx` | Modificado — ajuste assertions |

## ⚙️ Configuración y Entorno

### 🔑 Variables de Entorno

| Variable | Proyecto | Descripción | Ejemplo |
|---|---|---|---|
| — | — | No se requieren nuevas variables | — |

### 📜 Scripts o Comandos Necesarios

```bash
# No se requieren comandos post-merge
```

### 📦 Dependencias Nuevas

- N/A (no se agregaron dependencias)

## ✅ Proceso de Revisión y Merge

- Un revisor debe aprobar el PR antes del merge.
- El código debe cumplir con buenas prácticas y estándares de calidad.
- No se permite merge directo sin revisión.

### Cobertura de Tests

| Archivo | Stmts | Branch | Funcs | Lines |
|---|---|---|---|---|
| **Global** | 89.83% | 77.3% | 95.89% | 90.42% |
| GetSonarQubeMetricsUseCase.ts | 100% | 100% | 100% | 100% |
| MockSonarQubeRepository.ts | 100% | 100% | 100% | 100% |
| SonarQubeCard.tsx | 100% | 100% | 100% | 100% |
| IntegrationCardsGrid.tsx | 100% | 100% | 100% | 100% |
