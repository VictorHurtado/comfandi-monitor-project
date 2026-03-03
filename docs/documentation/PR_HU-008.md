# Pull Request: [HU-008] [Feature] - Mostrar metricas SonarQube en tarjeta

## Descripcion

Se implemento la HU-008 para ampliar la tarjeta Sonar en dashboard y mostrar:

- Coverage (%)
- Bugs (cantidad)
- Vulnerabilities (cantidad)

La tarjeta mantiene Quality Gate y ahora tambien presenta fallback "sin dato" cuando una metrica no esta disponible.

## Cambios principales

### Servicios

- `SonarApiService`: ahora consulta Quality Gate y metricas (`coverage`, `bugs`, `vulnerabilities`) desde Sonar.
- `SonarRepository`: mapea snapshot tecnico a modelo de dominio para la tarjeta.

### Componentes agregados

- No aplica (se extendio componente existente).

### Pantallas nuevas

- No aplica.

## Archivos modificados

| Archivo | Tipo de Cambio |
| --- | --- |
| `narnia/src/domain/models/SonarProjectStatus.ts` | Se agregan campos `coverage`, `bugs`, `vulnerabilities` |
| `narnia/src/infrastructure/services/SonarApiService.ts` | Se agrega consulta de metricas Sonar y parseo numerico |
| `narnia/src/infrastructure/services/__tests__/SonarApiService.test.ts` | Tests para snapshot completo y fallback de metricas |
| `narnia/src/infrastructure/repositories/SonarRepository.ts` | Mapeo de metricas al modelo de dominio |
| `narnia/src/infrastructure/repositories/__tests__/SonarRepository.test.ts` | Validacion de mapeo de metricas |
| `narnia/src/presentation/components/organisms/SonarIntegrationCard.tsx` | Render de Coverage/Bugs/Vulnerabilities y "sin dato" |
| `narnia/src/presentation/components/organisms/__tests__/SonarIntegrationCard.test.tsx` | Tests de render de metricas y fallback |
| `narnia/src/presentation/pages/__tests__/HealthStatusPage.test.tsx` | Ajuste de test de visualizacion de Coverage |

## Configuracion y entorno

### Variables de entorno

| Variable | Proyecto | Descripcion | Ejemplo |
| --- | --- | --- | --- |
| `SONAR_BASE_URL` | narnia | URL base SonarCloud/SonarQube | `https://sonarcloud.io` |
| `SONAR_TOKEN` | narnia | Token para autenticacion API Sonar | `***` |
| `SONAR_PROJECT_KEY_MAP` | narnia | Mapeo slug -> projectKey Sonar | `{"afiliaciones":"monitor_afiliaciones"}` |

### Scripts o comandos necesarios

```bash
npx jest --coverage
npm run build
```

### Dependencias nuevas

- N/A (no se agregaron dependencias)

## Proceso de revision y merge

- Un revisor debe aprobar el PR antes del merge.
- El codigo cumple arquitectura por capas y manejo de errores tipados.
- No se permite merge directo sin revision.

### Cobertura de tests

| Archivo | Stmts | Branch | Funcs | Lines |
| --- | --- | --- | --- | --- |
| **Global** | **89.47%** | **78.77%** | **95.83%** | **90.33%** |
