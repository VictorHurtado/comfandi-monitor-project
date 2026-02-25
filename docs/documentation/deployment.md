# Guía de Despliegue — Portal Pólizas de Salud

## Arquitectura de despliegue

```mermaid
flowchart TD
    subgraph AWS["☁️ AWS"]
        subgraph AMPLIFY["📦 AWS Amplify"]
            HERMES["🌐 Hermes\nNext.js SSR\nFrontend"]
        end

        subgraph LAMBDA["⚡ AWS Lambda"]
            ATLAS["🏛️ Atlas\nNestJS + Serverless\nBackend API"]
        end

        subgraph RDS["🗄️ Amazon RDS"]
            PG["PostgreSQL\natlas_core"]
        end
    end

    subgraph EXTERNAL["🔗 Servicios externos"]
        KC["🔑 Keycloak\nIdentity Provider"]
        IPAAS["🔄 iPaaS\nDatos de afiliados"]
    end

    USERS["👤 Operadores"] -->|HTTPS| HERMES
    HERMES -->|"/api/v1"| ATLAS
    ATLAS -->|Prisma ORM| PG
    HERMES -->|OAuth2 / OIDC| KC
    ATLAS -->|Bearer Token| KC
    ATLAS -->|REST API| IPAAS

    style AMPLIFY fill:#e8f5e9,stroke:#2e7d32,color:#000
    style LAMBDA fill:#fff3e0,stroke:#e65100,color:#000
    style RDS fill:#ede7f6,stroke:#4527a0,color:#000
    style EXTERNAL fill:#fce4ec,stroke:#c62828,color:#000
```

---

## 1. Hermes (Frontend) — AWS Amplify

### Qué es Amplify

AWS Amplify Hosting despliega aplicaciones Next.js con soporte SSR (Server-Side Rendering). Amplify detecta automáticamente que es un proyecto Next.js y configura el entorno de ejecución.

### Archivo de configuración: `amplify.yml`

Este archivo va en la **raíz del repositorio** y le dice a Amplify cómo construir la aplicación:

```yaml
version: 1
applications:
  - appRoot: hermes
    frontend:
      phases:
        preBuild:
          commands:
            - npm i
            - env | grep -e NEXT_PUBLIC -e NEXT_PUBLIC >> .env
            - env | grep -e NEXTAUTH -e NEXTAUTH >> .env
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - "**/*"
```

### Explicación del `amplify.yml`

| Sección | Qué hace |
|---------|----------|
| `appRoot: hermes` | Indica que el frontend está en la carpeta `hermes/` del monorepo |
| `preBuild → npm i` | Instala dependencias de Hermes |
| `preBuild → env \| grep NEXT_PUBLIC >> .env` | Inyecta las variables de entorno de Amplify que empiezan con `NEXT_PUBLIC` al archivo `.env` para que Next.js las tenga disponibles en build time |
| `preBuild → env \| grep NEXTAUTH >> .env` | Inyecta las variables de NextAuth (`NEXTAUTH_URL`, `NEXTAUTH_SECRET`) al `.env` |
| `build → npm run build` | Ejecuta `next build` que genera el output en `.next/` |
| `artifacts → baseDirectory: .next` | Le dice a Amplify que el resultado del build está en `.next/` |
| `artifacts → files: "**/*"` | Sube todos los archivos generados |

### Variables de entorno en Amplify

Configurar en **Amplify Console → App settings → Environment variables**:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_ATLAS_API_URL` | URL del backend Atlas (API Gateway de Lambda) | `https://abc123.execute-api.us-east-1.amazonaws.com` |
| `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID` | Client ID del realm de Keycloak | `portal-polizas` |
| `NEXT_PUBLIC_KEYCLOAK_ISSUER` | URL del issuer de Keycloak | `https://keycloak.comfandi.com/realms/portal` |
| `NEXT_PUBLIC_KEYCLOAK_REFRESH_TOKEN` | Endpoint de token de Keycloak | `https://keycloak.comfandi.com/realms/portal/protocol/openid-connect/token` |
| `NEXT_PUBLIC_KEYCLOAK_END_SESSION` | Endpoint de logout de Keycloak | `https://keycloak.comfandi.com/realms/portal/protocol/openid-connect/logout` |
| `NEXTAUTH_URL` | URL pública de Hermes | `https://polizas.comfandi.com` |
| `NEXTAUTH_SECRET` | Secret para encriptar cookies de NextAuth | `(generado con openssl rand -base64 32)` |
| `NEXTAUTH_KEYCLOAK_URL_PROVIDER` | URL del proveedor Keycloak para NextAuth | `https://keycloak.comfandi.com/realms/portal` |
| `NEXTAUTH_API` | URL de la API de auth | `https://polizas.comfandi.com/api/auth` |

> ⚠️ **Importante**: Las variables `NEXT_PUBLIC_*` se inyectan en build time (visibles en el cliente). Las variables `NEXTAUTH_*` son server-side only.

### Paso a paso: Configurar Amplify

1. **Ir a AWS Amplify Console** → "New app" → "Host web app"
2. **Conectar repositorio**: seleccionar el repo de GitHub `ComfandiTD/comfandi-portal-polizas-salud`
3. **Seleccionar rama**: `main` (producción) o `development` (staging)
4. **Amplify detecta** el `amplify.yml` automáticamente
5. **Configurar variables de entorno** en "Environment variables" (tabla de arriba)
6. **Configurar dominio personalizado** (opcional): "Domain management" → agregar dominio
7. **Deploy**: Amplify construye y despliega automáticamente en cada push a la rama configurada

### Ambientes recomendados

| Ambiente | Rama | Dominio |
|----------|------|---------|
| **Producción** | `release` | `polizas.comfandi.com` |
| **Staging / QA** | `development` | `polizas-dev.comfandi.com` |

> Cada rama despliega su propio ambiente con sus propias variables de entorno.

---

## 2. Atlas (Backend) — AWS Lambda + Serverless Framework

### Qué es Serverless Framework

Serverless Framework empaqueta la aplicación NestJS y la despliega como una función AWS Lambda detrás de un API Gateway. Esto permite:
- **Escalado automático**: Lambda escala según la demanda
- **Pago por uso**: solo se cobra por invocaciones reales
- **Sin servidores que mantener**: AWS gestiona la infraestructura

### Archivo de configuración: `serverless.yml`

Este archivo va en la **carpeta `atlas/`**:

```yaml
service: atlas-api

frameworkVersion: "4"

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  stage: ${opt:stage, 'dev'}
  memorySize: 512
  timeout: 30
  environment:
    ENV: ${self:provider.stage}
    PORT: 3001
    DATABASE_URL_ATLAS: ${env:DATABASE_URL_ATLAS}
    KEYCLOAK_AUTH_URL: ${env:KEYCLOAK_AUTH_URL}
    KEYCLOAK_ADMIN_CLIENT_ID: ${env:KEYCLOAK_ADMIN_CLIENT_ID}
    KEYCLOAK_ADMIN_USER: ${env:KEYCLOAK_ADMIN_USER}
    KEYCLOAK_ADMIN_PWD: ${env:KEYCLOAK_ADMIN_PWD}
    KEYCLOAK_REALM: ${env:KEYCLOAK_REALM}
    IPAAS_USERNAME: ${env:IPAAS_USERNAME}
    IPAAS_PASSWORD: ${env:IPAAS_PASSWORD}
    IPAAS_URL_LOGIN: ${env:IPAAS_URL_LOGIN}
    URL_API_CONSULT_AFFILIATE: ${env:URL_API_CONSULT_AFFILIATE}
    API_KEY_SWAGGER_ATLAS: ${env:API_KEY_SWAGGER_ATLAS}
    URL_SWAGGER_ATLAS: ${env:URL_SWAGGER_ATLAS}

plugins:
  - serverless-offline

functions:
  api:
    handler: dist/main.handler
    events:
      - http:
          method: ANY
          path: /
      - http:
          method: ANY
          path: "{proxy+}"

custom:
  serverless-offline:
    httpPort: 3001
```

> ⚠️ **Nota**: Este `serverless.yml` es una referencia base. Ajustar según la configuración real del equipo de infraestructura.

### Adaptación de NestJS para Lambda

Para que NestJS funcione en Lambda, se necesita un **handler** que adapte el ciclo de vida. Agregar en `atlas/src/main.ts` o en un archivo separado `atlas/src/lambda.ts`:

```typescript
// atlas/src/lambda.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import serverlessExpress from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import passport from 'passport';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(passport.initialize());

  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
```

### Dependencia necesaria para Lambda

```bash
cd atlas
npm install @codegenie/serverless-express
```

### Variables de entorno en Lambda

Configurar en **AWS Lambda → Configuration → Environment variables** (o via `serverless.yml`):

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `ENV` | Ambiente de ejecución | `production`, `development` |
| `PORT` | Puerto (referencia interna) | `3001` |
| `DATABASE_URL_ATLAS` | Connection string de PostgreSQL (RDS) | `postgresql://user:pass@rds-host:5432/atlas_core?schema=public` |
| `KEYCLOAK_AUTH_URL` | URL base de Keycloak | `https://keycloak.comfandi.com` |
| `KEYCLOAK_ADMIN_CLIENT_ID` | Client ID admin de Keycloak | `admin-cli` |
| `KEYCLOAK_ADMIN_USER` | Usuario admin de Keycloak | `admin` |
| `KEYCLOAK_ADMIN_PWD` | Password admin de Keycloak | `(secreto)` |
| `KEYCLOAK_REALM` | Realm de Keycloak | `portal` |
| `IPAAS_USERNAME` | Usuario para iPaaS (datos de afiliados) | `api-user` |
| `IPAAS_PASSWORD` | Password para iPaaS | `(secreto)` |
| `IPAAS_URL_LOGIN` | URL de autenticación de iPaaS | `https://ipaas.comfandi.com/auth/login` |
| `URL_API_CONSULT_AFFILIATE` | URL de consulta de datos básicos del afiliado | `https://ipaas.comfandi.com/api/affiliate` |
| `API_KEY_SWAGGER_ATLAS` | API key para proteger Swagger (solo no-producción) | `swagger-key-123` |
| `URL_SWAGGER_ATLAS` | Ruta de Swagger | `/api-docs` |

### Perfiles de AWS

El despliegue requiere perfiles de AWS CLI configurados:

| Ambiente | Perfil AWS | Config Serverless |
|----------|-----------|-------------------|
| **Producción** | `polizas-prod` | `serverless.production.yml` |
| **QA** | `polizas-qa` | `serverless.qa.yml` |

Configurar los perfiles:

```bash
# Configurar perfil de producción
aws configure --profile polizas-prod

# Configurar perfil de QA
aws configure --profile polizas-qa

# Si usan token de sesión temporal (SSO/STS):
aws configure set aws_session_token '<TOKEN>' --profile polizas-prod
```

### Paso a paso: Desplegar Atlas con Serverless

#### Opción A — Script automatizado (recomendado)

Se incluye el script `atlas/deploy.sh` que ejecuta todo el flujo:

```bash
cd atlas

# Desplegar a producción (usa perfil polizas-prod)
./deploy.sh production

# Desplegar a QA (usa perfil polizas-qa)
./deploy.sh qa
```

El script ejecuta en orden:
1. Valida `.env.{stage}`, `serverless.{stage}.yml` y perfil AWS
2. Genera Prisma Client (`npm run generate:prisma`)
3. Ejecuta migraciones (`prisma migrate deploy`) usando la `DATABASE_URL_ATLAS` del `.env`
4. Despliega Lambda con `serverless deploy`

#### Opción B — Comandos manuales

Si se prefiere ejecutar paso a paso:

```bash
cd atlas

# 1. Generar Prisma Client
npm run generate:prisma

# 2. Ejecutar migraciones contra la BD remota
npx -y dotenv-cli -e .env.production -- npx prisma migrate deploy

# 3. Desplegar Lambda (producción)
npx -y dotenv-cli -e .env.production -- npx -y serverless deploy \
  --config serverless.production.yml \
  --stage production \
  --region us-east-1 \
  --aws-profile polizas-prod

# 3b. Desplegar Lambda (QA)
npx -y dotenv-cli -e .env.qa -- npx -y serverless deploy \
  --config serverless.qa.yml \
  --stage production \
  --region us-east-1 \
  --aws-profile polizas-qa
```

> ⚠️ **Importante**: Las migraciones se ejecutan **ANTES** del deploy. El comando usa `dotenv-cli` para cargar las variables del `.env` correspondiente (incluida `DATABASE_URL_ATLAS` que apunta a la BD remota).

#### Verificar

El output del deploy muestra la URL del API Gateway:

```
endpoints:
  ANY - https://abc123.execute-api.us-east-1.amazonaws.com/
  ANY - https://abc123.execute-api.us-east-1.amazonaws.com/{proxy+}
```

Usar esa URL como `NEXT_PUBLIC_ATLAS_API_URL` en Amplify.

---

## 3. Base de datos — Amazon RDS (PostgreSQL)

### Configuración

| Parámetro | Valor recomendado |
|-----------|------------------|
| Motor | PostgreSQL 15+ |
| Instancia | `db.t3.micro` (dev) / `db.t3.medium` (prod) |
| Storage | 20 GB gp3 |
| Multi-AZ | No (dev) / Sí (prod) |
| Nombre de BD | `atlas_core` |
| VPC | Misma VPC que Lambda |

### Migraciones en producción

Las migraciones se ejecutan **antes del deploy** usando `dotenv-cli` para cargar la `DATABASE_URL_ATLAS` del `.env` correspondiente:

```bash
cd atlas

# Producción
npx -y dotenv-cli -e .env.production -- npx prisma migrate deploy

# QA
npx -y dotenv-cli -e .env.qa -- npx prisma migrate deploy
```

> ⚠️ **Importante**: En producción usar `prisma migrate deploy` (NO `prisma migrate dev`). `deploy` solo aplica migraciones pendientes sin generar nuevas.
> 
> ⚠️ Tu máquina debe tener acceso de red al RDS (VPN, IP en Security Group, etc.)
> 
> 💡 Si usas `./deploy.sh`, las migraciones se ejecutan automáticamente antes del deploy.

---

## 4. Pipeline de despliegue

### Flujo recomendado

```mermaid
flowchart LR
    DEV["👨‍💻 Developer\npush a rama"] --> GH["🐙 GitHub\nPR a development"]
    GH --> SONAR["📊 SonarCloud\nQuality Gate"]
    SONAR -->|OK| MERGE["✅ Merge a\ndevelopment"]
    MERGE --> AMPLIFY_DEV["📦 Amplify\nStaging"]
    MERGE --> LAMBDA_DEV["⚡ Lambda\nStaging"]

    AMPLIFY_DEV --> QA["🧪 QA\nPruebas"]
    LAMBDA_DEV --> QA

    QA -->|OK| RELEASE["🔀 Merge a\nrelease"]
    RELEASE --> AMPLIFY_PROD["📦 Amplify\nProducción"]
    RELEASE --> LAMBDA_PROD["⚡ Lambda\nProducción"]

    style SONAR fill:#e3f2fd,stroke:#1565c0,color:#000
    style AMPLIFY_DEV fill:#e8f5e9,stroke:#2e7d32,color:#000
    style AMPLIFY_PROD fill:#e8f5e9,stroke:#2e7d32,color:#000
    style LAMBDA_DEV fill:#fff3e0,stroke:#e65100,color:#000
    style LAMBDA_PROD fill:#fff3e0,stroke:#e65100,color:#000
    style QA fill:#f3e5f5,stroke:#6a1b9a,color:#000
```

### Despliegue automático vs manual

| Servicio | Trigger automático | Manual |
|----------|:------------------:|:------:|
| **Amplify (Hermes)** | ✅ Push a rama conectada | `amplify publish` |
| **Lambda (Atlas)** | ⚠️ Requiere CI/CD (GitHub Actions) | `./deploy.sh production` o `./deploy.sh qa` |
| **Migraciones BD** | ✅ Incluidas en `deploy.sh` | `dotenv-cli -e .env.{stage} -- prisma migrate deploy` |

---

## 5. Checklist de despliegue

### Primera vez (setup)

```markdown
- [ ] RDS PostgreSQL creado con BD `atlas_core`
- [ ] Perfiles AWS configurados: `polizas-prod` y `polizas-qa`
- [ ] Migraciones ejecutadas (incluidas en `deploy.sh`)
- [ ] Seeds ejecutados (si aplica): descomentar en `deploy.sh` o `psql -d atlas_core -f docs/scripts/seeds.sql`
- [ ] Atlas desplegado en Lambda: `./deploy.sh production`
- [ ] URL de API Gateway obtenida
- [ ] Amplify app creada y conectada al repo
- [ ] Variables de entorno configuradas en Amplify (incluyendo URL de Lambda)
- [ ] Variables de entorno configuradas en Lambda
- [ ] Dominio personalizado configurado en Amplify (si aplica)
- [ ] Keycloak realm configurado con redirect URI de Amplify
- [ ] Verificar flujo completo: login → consulta → resultados → logout
```

### Cada despliegue

```markdown
- [ ] Tests pasan (>= 80% coverage)
- [ ] Build local OK
- [ ] PR aprobado y mergeado
- [ ] SonarCloud quality gate OK
- [ ] Migraciones aplicadas en destino (si hay nuevas)
- [ ] Verificar aplicación en ambiente destino
```

---

## 6. Archivos de referencia

| Archivo | Propósito |
|---------|-----------|
| `atlas/deploy.sh` | Script de despliegue automatizado (migraciones + serverless) |
| `atlas/.env.example` | Referencia de variables de entorno necesarias |
| `atlas/.env.production` | Variables de producción (no versionado) |
| `atlas/.env.qa` | Variables de QA (no versionado) |
| `atlas/serverless.production.yml` | Config Serverless para producción |
| `atlas/serverless.qa.yml` | Config Serverless para QA |
| `amplify.yml` | Config de build de Amplify (raíz del repo) |
| `docs/scripts/seeds.sql` | Datos iniciales para la BD |

---

## 7. Troubleshooting

| Problema | Causa probable | Solución |
|----------|---------------|----------|
| Amplify build falla en `npm i` | Versión de Node incompatible | Verificar que Amplify use Node 18+ en "Build settings" |
| Variables `NEXT_PUBLIC_*` no disponibles | No se inyectan en build time | Verificar que están en Amplify Environment Variables y que el `amplify.yml` las exporta al `.env` |
| Lambda timeout | Cold start + conexión a BD | Aumentar `timeout` en `serverless.yml` a 30s. Considerar Provisioned Concurrency |
| Error de Prisma en Lambda | Falta binary target | Agregar `"rhel-openssl-3.0.x"` en `binaryTargets` del `schema.prisma` |
| CORS errors desde Hermes | API Gateway no configura CORS | Verificar `enableCors` en Atlas y headers en API Gateway |
| `NEXTAUTH_URL` incorrecto | URL no coincide con dominio de Amplify | Debe ser la URL pública exacta (con `https://`) |
| Keycloak redirect error | Redirect URI no registrada | Agregar URL de Amplify en "Valid Redirect URIs" del client de Keycloak |
| BD connection refused | Lambda no tiene acceso a RDS | Verificar que Lambda y RDS están en la misma VPC y Security Group |
