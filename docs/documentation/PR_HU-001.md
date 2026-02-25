# Pull Request: [HU-001] [Feature] - Inicializar proyecto base Narnia

## 📌 Descripción

Se inicializa el proyecto `narnia` con Next.js (App Router + TypeScript) y estructura base de Clean Architecture (`domain`, `infrastructure`, `presentation`, `lib`).
Incluye wiring IoC con Inversify, endpoints BFF versionados (`/api/v1/*`), setup base de Keycloak server-side con NextAuth, shell UI de estado técnico y configuración de testing con Jest + cobertura.

## 🔄 Cambios Principales

### 🚀 Servicios

- `ExternalApiService`: adaptador HTTP para consultar estado de integraciones.
- `KeycloakService`: lectura de configuración server-side para auth.

### 📦 Componentes Agregados

- `HealthStatusCard`: componente UI para mostrar estado global e integraciones.

### 📱 Pantallas Nuevas

- `HealthStatusPage`: página técnica base de health/status del proyecto.

## 🛠️ Archivos Modificados

| Archivo | Tipo de Cambio |
| --- | --- |
| `narnia/package.json` | Bootstrap Next.js + scripts de test + dependencias aprobadas |
| `narnia/tailwind.config.ts` | Tokens `brand-*` y tipografía `font-outfit` |
| `narnia/src/domain/**` | Modelo, contrato y use case inicial de health status |
| `narnia/src/infrastructure/**` | Config, network, services, repository e IoC container |
| `narnia/src/presentation/**` | Shell UI y página técnica base |
| `narnia/src/app/api/v1/health/route.ts` | Endpoint BFF de salud global |
| `narnia/src/app/api/v1/integrations/[provider]/route.ts` | Endpoint BFF por integración |
| `narnia/src/app/api/auth/[...nextauth]/route.ts` | Setup auth server-side con Keycloak |
| `narnia/jest.config.mjs` | Configuración de Jest con cobertura por capas |
| `narnia/src/**/__tests__/**` | Pruebas unitarias por Domain/Infrastructure/Presentation |
| `narnia/.env.example` | Variables de entorno base para BFF y Keycloak |

## ⚙️ Configuración y Entorno

### 🔑 Variables de Entorno

| Variable | Proyecto | Descripción | Ejemplo |
| --- | --- | --- | --- |
| `NARNIA_BFF_BASE_URL` | `narnia` | URL base de endpoints BFF | `http://localhost:3000/api/v1` |
| `KEYCLOAK_ISSUER` | `narnia` | Issuer OIDC de Keycloak | `https://keycloak.example.com/realms/narnia` |
| `KEYCLOAK_CLIENT_ID` | `narnia` | Client ID para NextAuth | `narnia-web` |
| `KEYCLOAK_CLIENT_SECRET` | `narnia` | Client secret del cliente | `***` |
| `NEXTAUTH_SECRET` | `narnia` | Secret de sesión NextAuth | `***` |
| `NEXTAUTH_URL` | `narnia` | URL base de la app | `http://localhost:3000` |

### 📜 Scripts o Comandos Necesarios

```bash
cd narnia
npm install
npm run dev
npx jest --coverage
npm run build
```

### 📦 Dependencias Nuevas

- `inversify`
- `reflect-metadata`
- `axios`
- `next-auth`
- `jest`, `@types/jest`, `jest-environment-jsdom`
- `@testing-library/react`, `@testing-library/jest-dom`
- `tailwindcss@3`, `postcss`, `autoprefixer`

## ✅ Proceso de Revisión y Merge

- Un revisor debe aprobar el PR antes del merge.
- El código cumple separación por capas (Clean Architecture).
- No se permite merge directo sin revisión.

### Cobertura de Tests

| Archivo | Stmts | Branch | Funcs | Lines |
| --- | --- | --- | --- | --- |
| **Global** | **84.42%** | **64%** | **96.66%** | **86.66%** |
