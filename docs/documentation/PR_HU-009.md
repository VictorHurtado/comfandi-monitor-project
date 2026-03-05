# Pull Request: [HU-009] [Feature] - Actualización reciente SonarQube, mensajes de error y validación QA

## 📌 Descripción

Implementa política de actualización de datos Sonar (caché TTL 5 min), mensaje amigable ante fallo de conexión ("No se pudo conectar con Sonar"), indicador de antigüedad de datos, timeout de fetch (10s) y documentación QA actualizada.

## 🔄 Cambios Principales

### 🚀 Servicios

- **sonar-cache**: Módulo de caché en memoria con TTL configurable (`SONAR_CACHE_TTL_MINUTES`).

### 📦 Componentes

- **SonarIntegrationCard**: Timeout 10s con AbortController, mensaje "No se pudo conectar con Sonar", indicador "Actualizado hace X min".
- **SonarCloudRepository**: Mensaje unificado "No se pudo conectar con Sonar".
- **API route sonar**: Caché TTL, respuesta con `fetchedAt`.

### 📱 Documentación

- **equipo-1-sonarqube-validacion-qa.md**: Sección de política de actualización y mensaje de error esperado.

## 🛠️ Archivos Modificados

| Archivo | Cambio |
| --- | --- |
| `SonarQualityGate.ts` | Añadido `fetchedAt` |
| `sonar-config.ts` | `cacheTtlMinutes` (default 5) |
| `sonar-cache.ts` | Nuevo módulo de caché |
| `SonarCloudRepository.ts` | Mensaje "No se pudo conectar con Sonar" |
| `sonar/route.ts` | Integración de caché y `fetchedAt` |
| `SonarIntegrationCard.tsx` | Timeout, mensaje, indicador antigüedad |
| `equipo-1-sonarqube-validacion-qa.md` | Política y mensaje QA |

## ⚙️ Variables de Entorno

| Variable | Descripción | Default |
| --- | --- | --- |
| SONAR_CACHE_TTL_MINUTES | TTL de caché en minutos (0=sin caché) | 5 |

## ✅ Cobertura de Tests

| Global | Stmts | Branch | Funcs | Lines |
| --- | --- | --- | --- | --- |
| | 90.38% | 83.05% | 95.34% | 91.84% |
