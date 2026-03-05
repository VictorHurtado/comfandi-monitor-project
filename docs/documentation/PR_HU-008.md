# Pull Request: [HU-008] [Feature] - Mostrar métricas SonarQube Coverage Bugs Vulnerabilities en tarjeta

## 📌 Descripción

Se extiende la tarjeta de SonarQube (HU-007) para incluir Coverage (%), Bugs y Vulnerabilities. Las métricas se obtienen de la API de SonarCloud (`api/measures/component`). Si alguna métrica no está disponible se muestra el placeholder "sin dato".

## 🔄 Cambios Principales

### 🚀 Servicios

- **SonarCloudRepository**: Se extiende para llamar `api/measures/component` en paralelo con `project_status`, parseando coverage, bugs y vulnerabilities.

### 📦 Componentes Agregados

No se agregan componentes nuevos. Se extiende `SonarIntegrationCard` para mostrar un grid con Coverage, Bugs y Vulnerabilities.

### 📱 Pantallas Nuevas

No aplica.

## 🛠️ Archivos Modificados

| Archivo | Tipo de Cambio |
| --- | --- |
| `narnia/src/domain/models/SonarQualityGate.ts` | Añadidos coverage, bugs, vulnerabilities opcionales |
| `narnia/src/infrastructure/repositories/SonarCloudRepository.ts` | Llamada a measures/component y parseo de métricas |
| `narnia/src/presentation/components/organisms/SonarIntegrationCard.tsx` | Grid de métricas con placeholder "sin dato" |
| Tests asociados | Actualizados y nuevos casos |

## ⚙️ Configuración y Entorno

### 🔑 Variables de Entorno

Las mismas que HU-007: SONAR_BASE_URL, SONAR_TOKEN, SONAR_PROJECT_KEY_MAP.

### 📜 Scripts o Comandos Necesarios

```bash
npx jest --coverage
npm run build
```

### 📦 Dependencias Nuevas

- N/A

## ✅ Proceso de Revisión y Merge

- Un revisor debe aprobar el PR antes del merge.
- El código debe cumplir con buenas prácticas y estándares de calidad.

### Cobertura de Tests

| Archivo | Stmts | Branch | Funcs | Lines |
| --- | --- | --- | --- | --- |
| **Global** | **90.18%** | **82.35%** | **96.29%** | **91.26%** |
