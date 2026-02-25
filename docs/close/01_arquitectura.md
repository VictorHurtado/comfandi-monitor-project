# Arquitectura del Proyecto

> Este documento define la arquitectura obligatoria para el proyecto.
> Es la fuente de verdad para cualquier implementacion.
> Codex/agentes DEBEN leer este documento ANTES de escribir codigo.

---

## 1. Vista rapida

```
Presentation --> Domain <-- Infrastructure
```

- **Presentation** consume **Use Cases**
- **Domain** define reglas y contratos
- **Infrastructure** implementa contratos y conecta con servicios externos

**Regla de oro**: Las dependencias siempre apuntan hacia adentro.
La capa mas interna (Domain) NO conoce nada de capas externas.

---

## 2. Principios arquitectonicos fundamentales

### 2.1 Clean Architecture

| Principio | Descripcion |
|-----------|-------------|
| Dependencias unidireccionales | Presentation depende de Domain; Infrastructure depende de Domain |
| Domain puro | Sin acceso a window, localStorage, fetch, frameworks |
| Contratos explicitos | Interfaces en Domain, implementaciones en Infrastructure |
| Testabilidad | Cada capa se puede testear de forma aislada |

### 2.2 Inversion de Control (IoC)

Todas las dependencias se inyectan usando un contenedor IoC (InversifyJS):

- **Testing**: facil mockear repositorios/servicios
- **Mantenibilidad**: cambios centralizados
- **Escalabilidad**: anadir features sin tocar codigo existente

**Reglas de uso**:
- NO instanciar servicios o repositorios en componentes UI
- Resolver dependencias desde el contenedor IoC
- Exponer contratos en Domain e implementar en Infrastructure

### 2.3 Principios SOLID

| Principio | Aplicacion |
|-----------|------------|
| **S** - Single Responsibility | Cada modulo/clase tiene una sola razon de cambio |
| **O** - Open/Closed | Extender sin modificar codigo existente |
| **L** - Liskov Substitution | Implementaciones respetan contratos definidos |
| **I** - Interface Segregation | Interfaces pequenas y especificas por caso de uso |
| **D** - Dependency Inversion | Depender de abstracciones, no de implementaciones |

---

## 3. Capas y responsabilidades

### 3.1 Presentation Layer

**Ruta**: `src/presentation/`

**Responsabilidades**:
- UI (componentes, paginas, layouts)
- Hooks de UI
- Redux store y slices
- Routing

**PUEDE**:
- Usar hooks de React/framework
- Renderizar UI con Tailwind CSS / NativeWind
- Consumir Use Cases del Domain
- Manejar loading/error/empty states

**NO PUEDE**:
- Llamar APIs/servicios externos directamente
- Conocer detalles de repositorios
- Contener logica de negocio
- Instanciar servicios manualmente

---

### 3.2 Domain Layer

**Ruta**: `src/domain/`

**Responsabilidades**:
- Entidades y tipos de dominio
- Contratos (interfaces) de repositorios
- Use Cases
- Errores de dominio
- Schemas de validacion (Yup)

**PUEDE**:
- Definir contratos y reglas de negocio
- Ser puro y testeable
- Lanzar errores tipados de dominio

**NO PUEDE**:
- Importar librerias externas (React, Next.js, Axios, NestJS)
- Acceder a window, localStorage, fetch
- Conocer infraestructura
- Depender de frameworks

---

### 3.3 Infrastructure Layer

**Ruta**: `src/infrastructure/`

**Responsabilidades**:
- Implementaciones de repositorios
- Clientes HTTP y servicios externos
- Configuracion IoC
- Integraciones (Auth, storage, etc.)

**Repositorios vs Servicios**:
| Tipo | Responsabilidad |
|------|-----------------|
| **Repositorio** | Implementa contratos del Domain, traduce datos externos a modelos de dominio |
| **Servicio** | Encapsula comunicacion con sistemas externos (HTTP, auth, storage), NO conoce reglas de negocio |

**PUEDE**:
- Llamar APIs externas
- Acceder a localStorage/IndexedDB
- Mapear respuestas a modelos de dominio

**NO PUEDE**:
- Logica de UI
- Reglas de negocio complejas
- Acceso directo a Redux desde servicios

---

## 4. Estructura de carpetas

### 4.1 Frontend (Next.js / React)

```
src/
├── domain/
│   ├── models/              # Entidades del dominio
│   │   └── User.ts
│   ├── repositories/        # Interfaces (contratos)
│   │   └── IUserRepository.ts
│   ├── usecases/            # Casos de uso
│   │   └── auth/
│   │       ├── LoginUseCase.ts
│   │       └── LogoutUseCase.ts
│   ├── schema/              # Validaciones Yup
│   │   └── LoginForm/
│   │       └── loginForm.validation.ts
│   └── errors/              # Errores de dominio (ver utils/errors/)
│       └── domain-errors.ts
│
├── infrastructure/
│   ├── config/              # Configuraciones
│   │   └── environment.ts
│   ├── ioc/                 # Contenedor IoC
│   │   ├── container.ts
│   │   ├── repositories.container.ts
│   │   ├── services.container.ts
│   │   └── usecases.container.ts
│   ├── repositories/        # Implementaciones
│   │   └── UserRepository.ts
│   ├── services/            # Servicios externos
│   │   ├── ApiService.ts
│   │   └── AuthService.ts
│   └── network/             # Clientes HTTP
│       └── axiosInstance.ts
│
├── presentation/
│   ├── components/          # Atomic Design
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   └── templates/
│   ├── pages/               # Paginas/Vistas
│   │   └── LoginPage.tsx
│   ├── hooks/               # Hooks de UI
│   │   └── useAuth.ts
│   ├── store/               # Redux
│   │   ├── store.ts
│   │   ├── hooks.ts
│   │   └── slices/
│   │       └── authSlice.ts
│   └── router/              # Routing
│       └── router.tsx
│
└── lib/                     # Utilidades compartidas
    ├── errors/
    └── helpers/
```

### 4.2 Backend (NestJS)

```
src/
├── domain/
│   ├── models/              # Entidades de dominio
│   │   └── User.ts
│   ├── repositories/        # Interfaces (contratos)
│   │   └── IUserRepository.ts
│   └── errors/              # Errores de dominio
│       └── DomainError.ts
│
├── infrastructure/
│   ├── config/              # Configuraciones
│   │   └── environment.ts
│   ├── repositories/        # Implementaciones con Prisma
│   │   └── UserRepository.ts
│   └── services/            # Servicios externos
│       └── ExternalApiService.ts
│
├── application/             # Capa de aplicacion NestJS
│   ├── modules/
│   │   └── users/
│   │       ├── users.module.ts
│   │       ├── users.controller.ts
│   │       ├── users.service.ts
│   │       └── dto/
│   │           ├── create-user.dto.ts
│   │           └── update-user.dto.ts
│   └── guards/
│       └── auth.guard.ts
│
└── main.ts
```

---

## 5. Ejemplos de implementacion

### 5.1 Use Case (Domain)

```typescript
// src/domain/usecases/products/GetProductsUseCase.ts

import { IProductRepository } from '../../repositories/IProductRepository';
import { Product } from '../../models/Product';
import { AppError, ValidationError } from '@/utils/errors/domain-errors';

export interface GetProductsInput {
  categoryId?: string;
  limit?: number;
}

export interface GetProductsResult {
  products: Product[];
  total: number;
}

export class GetProductsUseCase {
  constructor(
    private readonly productRepository: IProductRepository
  ) {}

  async execute(input: GetProductsInput): Promise<GetProductsResult> {
    try {
      // Validaciones de negocio — usar errores tipados
      if (input.limit && input.limit < 0) {
        throw new ValidationError('Limit must be positive');
      }

      const products = await this.productRepository.findAll({
        categoryId: input.categoryId,
        limit: input.limit,
      });

      return {
        products,
        total: products.length,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        'Error al obtener productos',
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }
}
```

### 5.2 Interface de Repositorio (Domain)

```typescript
// src/domain/repositories/IProductRepository.ts

import { Product } from '../models/Product';

export interface FindAllParams {
  categoryId?: string;
  limit?: number;
}

export interface IProductRepository {
  findAll(params: FindAllParams): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(product: Omit<Product, 'id'>): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
}
```

### 5.3 Repositorio (Infrastructure - Frontend)

```typescript
// src/infrastructure/repositories/ProductRepository.ts

import { inject, injectable } from 'inversify';
import type { AxiosInstance } from 'axios';
import { IProductRepository, FindAllParams } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/models/Product';

interface ProductDto {
  id: string;
  name: string;
  price: number;
}

@injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @inject('AxiosInstance') private readonly http: AxiosInstance
  ) {}

  private mapToDomain(dto: ProductDto): Product {
    return {
      id: dto.id,
      name: dto.name,
      price: dto.price,
    };
  }

  async findAll(params: FindAllParams): Promise<Product[]> {
    const response = await this.http.get<{ products: ProductDto[] }>('/products', {
      params,
    });
    return response.data.products.map(this.mapToDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const response = await this.http.get<{ product: ProductDto }>(`/products/${id}`);
    return this.mapToDomain(response.data.product);
  }

  // ... otros metodos
}
```

### 5.4 Repositorio (Infrastructure - Backend con Prisma)

```typescript
// src/infrastructure/repositories/ProductRepository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/PrismaService';
import { IProductRepository, FindAllParams } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/models/Product';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(data: any): Product {
    return {
      id: data.id,
      name: data.name,
      price: data.price,
    };
  }

  async findAll(params: FindAllParams): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: params.categoryId ? { categoryId: params.categoryId } : undefined,
      take: params.limit,
    });
    return products.map(this.mapToDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    return product ? this.mapToDomain(product) : null;
  }

  // ... otros metodos
}
```

### 5.5 Contenedor IoC (Infrastructure)

La configuracion del contenedor IoC se divide en archivos separados por responsabilidad:

**Estructura de archivos:**

```
src/infrastructure/ioc/
├── container.ts                    # Contenedor principal (load modules)
├── index.ts                        # Export del container
├── repositories/
│   ├── repositories.module.ts      # Bindings de repositorios
│   └── repositories.types.ts       # Symbols/Types de repositorios
├── services/
│   ├── services.module.ts          # Bindings de servicios
│   └── services.types.ts           # Symbols/Types de servicios
└── usecases/
    ├── usecases.module.ts          # Bindings de use cases
    └── usecases.types.ts           # Symbols/Types de use cases
```

**Types (Symbols):**

```typescript
// src/infrastructure/ioc/repositories/repositories.types.ts

export const REPOSITORY_TYPES = {
  IProductRepository: Symbol.for('IProductRepository'),
  IUserRepository: Symbol.for('IUserRepository'),
  // ... otros repositorios
};
```

```typescript
// src/infrastructure/ioc/services/services.types.ts

export const SERVICE_TYPES = {
  AxiosInstance: Symbol.for('AxiosInstance'),
  AuthService: Symbol.for('AuthService'),
  // ... otros servicios
};
```

```typescript
// src/infrastructure/ioc/usecases/usecases.types.ts

export const USECASE_TYPES = {
  GetProductsUseCase: Symbol.for('GetProductsUseCase'),
  CreateProductUseCase: Symbol.for('CreateProductUseCase'),
  // ... otros use cases
};
```

**Modules (Bindings):**

```typescript
// src/infrastructure/ioc/services/services.module.ts

import { ContainerModule } from 'inversify';
import { SERVICE_TYPES } from './services.types';
import { axiosInstance } from '../../network/axiosInstance';

export const servicesModule = new ContainerModule((bind) => {
  bind(SERVICE_TYPES.AxiosInstance).toConstantValue(axiosInstance);
  // ... otros servicios
});
```

```typescript
// src/infrastructure/ioc/repositories/repositories.module.ts

import { ContainerModule } from 'inversify';
import { REPOSITORY_TYPES } from './repositories.types';
import { ProductRepository } from '../../repositories/ProductRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';

export const repositoriesModule = new ContainerModule((bind) => {
  bind<IProductRepository>(REPOSITORY_TYPES.IProductRepository)
    .to(ProductRepository)
    .inSingletonScope();
  // ... otros repositorios
});
```

```typescript
// src/infrastructure/ioc/usecases/usecases.module.ts

import { ContainerModule, interfaces } from 'inversify';
import { USECASE_TYPES } from './usecases.types';
import { REPOSITORY_TYPES } from '../repositories/repositories.types';
import { GetProductsUseCase } from '../../../domain/usecases/products/GetProductsUseCase';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';

export const usecasesModule = new ContainerModule((bind) => {
  bind(USECASE_TYPES.GetProductsUseCase).toDynamicValue(
    (context: interfaces.Context) => {
      const repo = context.container.get<IProductRepository>(
        REPOSITORY_TYPES.IProductRepository
      );
      return new GetProductsUseCase(repo);
    }
  );
  // ... otros use cases
});
```

**Container principal (load modules):**

```typescript
// src/infrastructure/ioc/container.ts

import { Container } from 'inversify';
import { servicesModule } from './services/services.module';
import { repositoriesModule } from './repositories/repositories.module';
import { usecasesModule } from './usecases/usecases.module';

const container = new Container();

// Cargar modulos en orden de dependencia
container.load(servicesModule);      // 1) Services primero
container.load(repositoriesModule);  // 2) Repositories segundo
container.load(usecasesModule);      // 3) UseCases tercero (depende de repos)

export { container };
```

```typescript
// src/infrastructure/ioc/index.ts

export { container } from './container';
export { REPOSITORY_TYPES } from './repositories/repositories.types';
export { SERVICE_TYPES } from './services/services.types';
export { USECASE_TYPES } from './usecases/usecases.types';
```

**Uso en la aplicacion:**

```typescript
// En un hook o componente
import { container, USECASE_TYPES } from '@/infrastructure/ioc';
import { GetProductsUseCase } from '@/domain/usecases/products/GetProductsUseCase';

const useCase = container.get<GetProductsUseCase>(USECASE_TYPES.GetProductsUseCase);
```

---

## 6. Patron ViewModel (Presentation)

Para componentes complejos, usar el patron ViewModel:

### Estructura

```
presentation/components/organisms/
└── ProductForm/
    ├── ProductForm.tsx           # Componente UI puro
    ├── useProductForm.vm.ts      # ViewModel (logica)
    └── __tests__/
        └── ProductForm.spec.tsx
```

### Implementacion

```typescript
// useProductForm.vm.ts
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { productFormSchema } from '@/domain/schema/ProductForm/productForm.validation';

export const useProductFormVM = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: yupResolver(productFormSchema),
    defaultValues: { name: '', price: 0 },
  });

  const handleSubmit = useCallback(async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // logica de envio via UseCase
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { form, isSubmitting, handleSubmit };
};
```

```typescript
// ProductForm.tsx
import { useProductFormVM } from './useProductForm.vm';

export const ProductForm = () => {
  const { form, isSubmitting, handleSubmit } = useProductFormVM();

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {/* UI del formulario */}
    </form>
  );
};
```

---

## 7. Flujo de datos

### 7.1 Lectura (Frontend)

```
1. UI monta componente
2. Hook ejecuta UseCase
3. UseCase llama Repository (via interfaz)
4. Repository llama API/servicio
5. Repository mapea respuesta a modelo de dominio
6. UseCase retorna datos
7. Hook actualiza estado (Redux/local)
8. UI renderiza
```

### 7.2 Escritura (Frontend)

```
1. Usuario interactua con UI
2. Hook ejecuta UseCase
3. UseCase valida datos de negocio
4. UseCase llama Repository
5. Repository envia a API
6. Repository retorna resultado
7. Hook actualiza estado
8. UI refleja cambio
```

---

## 8. Reglas clave (resumen para agentes)

| Regla | Descripcion |
|-------|-------------|
| Presentation solo llama Use Cases | Nunca llama repositorios o servicios directamente |
| Domain NO depende de nada externo | Sin React, Axios, NestJS, frameworks |
| Infrastructure implementa contratos | Los contratos estan en Domain |
| Nunca saltarse capas | Presentation -> Domain -> Infrastructure |
| IoC para todo | No usar `new` en Presentation |
| Errores tipados | Usar AppError o subclases de `@/utils/errors/domain-errors` |
| Mapeo explicito | DTOs se mapean a modelos de dominio |

---

## 9. Prohibiciones absolutas

| Prohibicion | Razon |
|-------------|-------|
| Logica de negocio en UI | Debe estar en Use Cases |
| Acceso directo a APIs desde componentes | Debe pasar por Repository |
| Dependencias circulares | Rompe la arquitectura |
| DTOs en Domain | Domain solo conoce modelos puros |
| Framework en Domain | Domain debe ser puro |
| `new Service()` en Presentation | Usar IoC container |

---

> **Nota para agentes**: Este documento es la fuente de verdad arquitectonica.
> Cualquier codigo que viole estas reglas sera rechazado.
