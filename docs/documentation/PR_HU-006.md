# Pull Request: [HU-006] [Feature] - Integrar tarjeta Jira en dashboard de salud tecnica

## 📌 Descripcion

Se implementa la HU-006 para mostrar la tarjeta Jira en el dashboard tecnico por proyecto, con las cuatro metricas de flujo (abiertas, bloqueadas, cerradas 7d y tiempo promedio en "In Progress"), incluyendo estados `ok`, `pending` y `unknown` sin romper la UI ni exponer mensajes tecnicos.

## 🔄 Cambios Principales

### 🚀 Servicios

- `narnia/src/infrastructure/services/JiraMetricsService.ts` (nuevo): cliente tecnico para consulta de metricas Jira por proyecto (`/api/v1/jira/metrics`) con traduccion de timeout a error tipado.
- `narnia/src/infrastructure/repositories/JiraMetricsRepository.ts` (nuevo): implementacion del contrato de dominio, mapeo DTO->dominio y traduccion de fallos a estados `pending`/`unknown` amigables.

### 📦 Componentes Agregados

- `narnia/src/presentation/components/organisms/JiraIntegrationCard.tsx` (nuevo): tarjeta Jira reactiva por `projectId`, con loading, empty, pending, unknown y semaforo de riesgo.

### 📱 Pantallas Nuevas

- No aplica.

## 🛠️ Archivos Modificados

| Archivo | Tipo de Cambio |
| --- | --- |
| `narnia/src/domain/models/JiraProjectMetrics.ts` | Nuevo modelo de dominio para metricas Jira por proyecto |
| `narnia/src/domain/repositories/IJiraMetricsRepository.ts` | Nuevo contrato de repositorio Jira |
| `narnia/src/domain/usecases/GetJiraMetricsByProjectUseCase.ts` | Nuevo use case con validacion y calculo de riesgo |
| `narnia/src/domain/usecases/__tests__/GetJiraMetricsByProjectUseCase.test.ts` | Tests unitarios del use case Jira |
| `narnia/src/infrastructure/services/JiraMetricsService.ts` | Nuevo servicio tecnico de consumo Jira/BFF |
| `narnia/src/infrastructure/services/__tests__/JiraMetricsService.test.ts` | Tests unitarios del servicio Jira |
| `narnia/src/infrastructure/services/JiraExternalApiService.ts` | Nuevo adaptador server-side para Jira REST con `EMAIL_API_JIRA` + `TOKEN_API_JIRA` |
| `narnia/src/infrastructure/services/__tests__/JiraExternalApiService.test.ts` | Tests unitarios de integracion server-side Jira |
| `narnia/src/infrastructure/repositories/JiraMetricsRepository.ts` | Nuevo repositorio Jira con fallback `pending/unknown` |
| `narnia/src/infrastructure/repositories/__tests__/JiraMetricsRepository.test.ts` | Tests unitarios del repositorio Jira |
| `narnia/src/infrastructure/config/environment.ts` | Lectura de variables Jira (`JIRA_BASE_URL`, `EMAIL_API_JIRA`, `TOKEN_API_JIRA`, `JIRA_PROJECT_KEY_MAP`) |
| `narnia/src/infrastructure/config/__tests__/environment.test.ts` | Cobertura de lectura de variables Jira |
| `narnia/src/infrastructure/ioc/services/services.types.ts` | Registro del symbol `JiraMetricsService` |
| `narnia/src/infrastructure/ioc/services/services.module.ts` | Binding IoC de servicios Jira (cliente dashboard + cliente externo Jira REST) |
| `narnia/src/infrastructure/ioc/repositories/repositories.types.ts` | Registro del symbol `IJiraMetricsRepository` |
| `narnia/src/infrastructure/ioc/repositories/repositories.module.ts` | Binding IoC del repositorio Jira |
| `narnia/src/infrastructure/ioc/usecases/usecases.types.ts` | Registro del symbol `GetJiraMetricsByProjectUseCase` |
| `narnia/src/infrastructure/ioc/usecases/usecases.module.ts` | Binding IoC del use case Jira |
| `narnia/src/infrastructure/ioc/__tests__/container.test.ts` | Ajuste de resolucion IoC para nuevo use case/repositorio/servicio |
| `narnia/src/app/api/v1/jira/metrics/route.ts` | Nuevo endpoint server-side para exponer metricas Jira por proyecto |
| `narnia/src/presentation/components/organisms/IntegrationCardsGrid.tsx` | Integracion de tarjeta Jira dinamica con contexto de proyecto |
| `narnia/src/presentation/components/organisms/TechnicalHealthDashboardLayout.tsx` | Propagacion de `projectId` y `projectName` al grid |
| `narnia/src/presentation/components/organisms/__tests__/TechnicalHealthDashboardLayout.test.tsx` | Ajustes de pruebas del dashboard con Jira dinamica |
| `narnia/src/presentation/components/organisms/__tests__/JiraIntegrationCard.test.tsx` | Nuevas pruebas UI (ordenado, riesgo, unknown, cambio de proyecto y loading) |

## ⚙️ Configuracion y Entorno

### 🔑 Variables de Entorno

| Variable | Proyecto | Descripcion | Ejemplo |
| --- | --- | --- | --- |
| `NARNIA_BFF_BASE_URL` | narnia | Base URL del BFF usado por el servicio Jira (`/jira/metrics`) | `https://<bff-host>/api/v1` |
| `JIRA_BASE_URL` | narnia | URL base de Jira Cloud usada server-side para consultar APIs REST | `https://<company>.atlassian.net` |
| `EMAIL_API_JIRA` | narnia | Email tecnico usado en Basic Auth de Jira | `integration.user@company.com` |
| `TOKEN_API_JIRA` | narnia | API token de Jira usado server-side (no exponer en UI) | `***` |
| `JIRA_PROJECT_KEY_MAP` | narnia | Mapa JSON opcional `projectId -> jiraProjectKey` | `{"afiliaciones":"AFI"}` |

### 📜 Scripts o Comandos Necesarios

```bash
npx jest --coverage
npm run build
```

### 📦 Dependencias Nuevas

- N/A (no se agregaron dependencias)

## ✅ Proceso de Revision y Merge

- Un revisor debe aprobar el PR antes del merge.
- El codigo debe cumplir con buenas practicas y estandares de calidad.
- No se permite merge directo sin revision.

### Cobertura de Tests

| Archivo | Stmts | Branch | Funcs | Lines |
| --- | --- | --- | --- | --- |
| **Global** | 87.26% | 72.40% | 96.15% | 87.44% |
