# Pull Request: [HU-007] [Feature] - Configuración SonarQube por proyecto y tarjeta con semáforo en dashboard

## 📌 Descripción

Se implementa la configuración de SonarQube por proyecto y una tarjeta de integración en el dashboard que muestra el Quality Gate con semáforo (verde/amarillo/rojo). La tarjeta se asocia al proyecto seleccionado y degrada elegantemente cuando Sonar no responde o no está configurado.

## 🔄 Cambios Principales

### 🚀 Servicios

- **SonarCloudRepository**: Implementa ISonarRepository, consume la API de SonarCloud para obtener el estado del Quality Gate.
- **SonarProjectKeyResolver**: Implementa IProjectKeyResolver, resuelve projectId → sonarProjectKey usando SONAR_PROJECT_KEY_MAP.

### 📦 Componentes Agregados

- **SonarIntegrationCard**: Tarjeta client-side que hace fetch a `/api/v1/projects/{projectId}/integrations/sonar` y muestra semáforo (PASSED/FAILED/SIN DATO), nombre del proyecto y degradación ante fallo.
- **GetSonarQualityGateUseCase**: Use case de dominio que orquesta la obtención del Quality Gate.
- **sonar-config**: Configuración de variables SONAR_BASE_URL, SONAR_TOKEN, SONAR_PROJECT_KEY_MAP.

### 📱 Pantallas Nuevas

No aplica (se actualiza IntegrationCardsGrid para recibir projectId/projectName y renderizar SonarIntegrationCard con datos reales).

## 🛠️ Archivos Modificados

| Archivo | Tipo de Cambio |
| --- | --- |
| `narnia/src/domain/models/SonarQualityGate.ts` | Nuevo modelo de dominio |
| `narnia/src/domain/repositories/ISonarRepository.ts` | Nueva interfaz |
| `narnia/src/domain/repositories/IProjectKeyResolver.ts` | Nueva interfaz |
| `narnia/src/domain/usecases/sonar/GetSonarQualityGateUseCase.ts` | Nuevo use case |
| `narnia/src/infrastructure/config/sonar-config.ts` | Nueva config Sonar |
| `narnia/src/infrastructure/repositories/SonarCloudRepository.ts` | Nueva implementación |
| `narnia/src/infrastructure/repositories/SonarProjectKeyResolver.ts` | Nueva implementación |
| `narnia/src/infrastructure/ioc/repositories/*` | Bindings ISonarRepository, IProjectKeyResolver |
| `narnia/src/infrastructure/ioc/usecases/*` | Binding GetSonarQualityGateUseCase |
| `narnia/src/app/api/v1/projects/[projectId]/integrations/sonar/route.ts` | Nueva API route |
| `narnia/src/presentation/components/organisms/SonarIntegrationCard.tsx` | Nuevo componente |
| `narnia/src/presentation/components/organisms/IntegrationCardsGrid.tsx` | Modificado para props y SonarIntegrationCard |
| `narnia/src/presentation/components/organisms/TechnicalHealthDashboardLayout.tsx` | Pasa projectId/projectName a grid |
| Tests asociados | Nuevos tests para use case, repo, config, card |

## ⚙️ Configuración y Entorno

### 🔑 Variables de Entorno

| Variable | Proyecto | Descripción | Ejemplo |
| --- | --- | --- | --- |
| SONAR_BASE_URL | narnia | URL base de SonarCloud | https://sonarcloud.io |
| SONAR_TOKEN | narnia | Token de autenticación | \<token\> |
| SONAR_PROJECT_KEY_MAP | narnia | Mapeo projectId → sonarProjectKey (JSON) | {"afiliaciones":"ComfandiTD_sucursal-afiliaciones"} |

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
| **Global** | **89.56%** | **82.58%** | **96.2%** | **90.71%** |
