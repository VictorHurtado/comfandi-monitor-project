# Pull Request: [HU-007] [Feature] - Configuracion SonarQube por proyecto y tarjeta semaforo

## Descripcion

Se implemento la HU-007 end-to-end para consultar Sonar por proyecto y mostrar una tarjeta con semaforo de Quality Gate en el dashboard tecnico.

Incluye:
- Modelo, contrato y use case de Sonar en Domain.
- Servicio y repositorio Sonar en Infrastructure con degradacion graceful.
- Endpoint BFF por proyecto: `GET /api/v1/projects/[slug]/integrations/sonar`.
- Tarjeta de Sonar en dashboard con identificacion del proyecto y estado visual.
- Documentacion de variables de entorno en `narnia/.env.example`.

## Cambios principales

### Servicios

- `SonarApiService`: cliente HTTP para consultar Quality Gate de Sonar.
- `SonarRepository`: resolucion de `projectSlug -> projectKey` y manejo de fallback `unknown`.
- Extensiones de IoC para registrar repositorio, servicio y use case de Sonar.

### Componentes agregados

- `SonarIntegrationCard`: tarjeta Sonar con semaforo, mensaje y `projectKey`.

### Pantallas nuevas

- No aplica.

## Archivos modificados

| Archivo | Tipo de Cambio |
| --- | --- |
| `narnia/src/domain/models/SonarProjectStatus.ts` | Nuevo modelo de dominio Sonar |
| `narnia/src/domain/repositories/ISonarRepository.ts` | Nuevo contrato de repositorio Sonar |
| `narnia/src/domain/usecases/GetSonarProjectStatusUseCase.ts` | Nuevo use case por proyecto |
| `narnia/src/domain/usecases/__tests__/GetSonarProjectStatusUseCase.test.ts` | Tests del use case Sonar |
| `narnia/src/infrastructure/config/environment.ts` | Soporte de `SONAR_*` y parse de mapa JSON |
| `narnia/src/infrastructure/config/__tests__/environment.test.ts` | Tests de env Sonar |
| `narnia/src/infrastructure/services/SonarApiService.ts` | Nuevo servicio de consulta Sonar |
| `narnia/src/infrastructure/services/__tests__/SonarApiService.test.ts` | Tests de servicio Sonar |
| `narnia/src/infrastructure/repositories/SonarRepository.ts` | Nuevo repositorio Sonar |
| `narnia/src/infrastructure/repositories/__tests__/SonarRepository.test.ts` | Tests de repositorio Sonar |
| `narnia/src/infrastructure/ioc/services/services.types.ts` | Nuevo symbol `SonarApiService` |
| `narnia/src/infrastructure/ioc/services/services.module.ts` | Binding de `SonarApiService` |
| `narnia/src/infrastructure/ioc/repositories/repositories.types.ts` | Nuevo symbol `ISonarRepository` |
| `narnia/src/infrastructure/ioc/repositories/repositories.module.ts` | Binding de `SonarRepository` |
| `narnia/src/infrastructure/ioc/usecases/usecases.types.ts` | Nuevo symbol `GetSonarProjectStatusUseCase` |
| `narnia/src/infrastructure/ioc/usecases/usecases.module.ts` | Binding de use case Sonar |
| `narnia/src/infrastructure/ioc/__tests__/container.test.ts` | Validacion de resolucion IoC Sonar |
| `narnia/src/app/api/v1/projects/[slug]/integrations/sonar/route.ts` | Nuevo endpoint BFF Sonar por proyecto |
| `narnia/src/presentation/components/organisms/SonarIntegrationCard.tsx` | Nueva tarjeta Sonar en dashboard |
| `narnia/src/presentation/components/organisms/__tests__/SonarIntegrationCard.test.tsx` | Tests de tarjeta Sonar |
| `narnia/src/presentation/components/organisms/IntegrationCardsGrid.tsx` | Integracion de la tarjeta Sonar |
| `narnia/src/presentation/components/organisms/TechnicalHealthDashboardLayout.tsx` | Propagacion de `sonarStatus` |
| `narnia/src/presentation/components/organisms/__tests__/TechnicalHealthDashboardLayout.test.tsx` | Ajustes por tarjeta Sonar real |
| `narnia/src/presentation/pages/HealthStatusPage.tsx` | Nuevo prop `sonarStatus` |
| `narnia/src/presentation/pages/__tests__/HealthStatusPage.test.tsx` | Ajuste de tests por nuevo prop |
| `narnia/src/app/dashboard/technical-health/[projectId]/page.tsx` | Resolucion server-side de estado Sonar |
| `narnia/.env.example` | Documentacion de variables de entorno |
| `narnia/.gitignore` | Permitir versionar `.env.example` |

## Configuracion y entorno

### Variables de entorno

| Variable | Proyecto | Descripcion | Ejemplo |
| --- | --- | --- | --- |
| `SONAR_BASE_URL` | narnia | URL base de SonarQube/SonarCloud | `https://sonarcloud.io` |
| `SONAR_TOKEN` | narnia | Token para autenticar consulta API Sonar | `***` |
| `SONAR_PROJECT_KEY_MAP` | narnia | JSON slug monitor -> projectKey Sonar | `{"afiliaciones":"monitor_afiliaciones"}` |
| `AUTH_DISABLED` | narnia | Deshabilita auth en dev para pruebas locales | `true` |
| `NARNIA_BFF_BASE_URL` | narnia | Base URL usada por cliente HTTP interno | `<set-your-bff-base-url>` |

### Scripts o comandos necesarios

```bash
npx jest --coverage
npm run build
```

### Dependencias nuevas

- N/A (no se agregaron dependencias)

## Proceso de revision y merge

- Un revisor debe aprobar el PR antes del merge.
- El codigo debe cumplir con buenas practicas y estandares de calidad.
- No se permite merge directo sin revision.

### Cobertura de tests

| Archivo | Stmts | Branch | Funcs | Lines |
| --- | --- | --- | --- | --- |
| **Global** | **88.1%** | **78.57%** | **96.34%** | **89.05%** |

## Documentacion complementaria

- `docs/documentation/PR_HU-008.md`
- `docs/documentation/PR_HU-009.md`
