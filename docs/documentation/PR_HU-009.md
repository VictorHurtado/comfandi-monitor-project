# Pull Request: [HU-009] [Feature] - TTL Sonar, errores no tecnicos y carga no bloqueante

## Descripcion

Se implemento la HU-009 para robustecer la integracion Sonar en dashboard con:

- TTL de cache por proyecto (5 minutos)
- Mensajes no tecnicos ante fallo de conexion
- Carga no bloqueante de la tarjeta Sonar (loading por tarjeta)
- Documentacion QA actualizada para escenarios bueno/malo/caida/TTL/no bloqueante

## Cambios principales

### Servicios

- `SonarRepository`: se agrega cache en memoria con TTL de 5 minutos por `projectSlug`.
- `SonarRepository`: reutiliza cache vigente y revalida cuando expira.

### Componentes agregados

- No aplica (se ajustan componentes existentes).

### Pantallas nuevas

- No aplica.

## Archivos modificados

| Archivo | Tipo de Cambio |
| --- | --- |
| `narnia/src/infrastructure/repositories/SonarRepository.ts` | Cache TTL 5 min por proyecto y refresco al expirar |
| `narnia/src/infrastructure/repositories/__tests__/SonarRepository.test.ts` | Test de comportamiento cache hit/miss por expiracion |
| `narnia/src/presentation/components/organisms/IntegrationCardsGrid.tsx` | Carga no bloqueante por tarjeta con loading y fetch al BFF |
| `narnia/src/presentation/components/organisms/SonarIntegrationCard.tsx` | Estado de carga y mensajes cortos para usuario |
| `narnia/src/presentation/components/organisms/TechnicalHealthDashboardLayout.tsx` | Integracion de estado Sonar inicial |
| `narnia/src/app/dashboard/technical-health/[projectId]/page.tsx` | Estado inicial de loading para render inmediato |
| `narnia/src/presentation/components/organisms/__tests__/TechnicalHealthDashboardLayout.test.tsx` | Tests de loading no bloqueante y navegacion |
| `narnia/src/presentation/pages/__tests__/HealthStatusPage.test.tsx` | Test de render con carga asincrona de Sonar |
| `docs/close/hus/HU-004-taller/equipo-1-sonarqube-validacion-qa.md` | Escenarios QA para TTL y no bloqueante |

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
- No hay bloqueo global de dashboard por latencia o caida de Sonar.
- No se exponen detalles tecnicos a usuario final.

### Cobertura de tests

| Archivo | Stmts | Branch | Funcs | Lines |
| --- | --- | --- | --- | --- |
| **Global** | **89.47%** | **78.77%** | **95.83%** | **90.33%** |
