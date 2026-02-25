# Narnia + Proteo - Vision del Proyecto (Plataforma de Reportes Tecnicos)

> Este documento define la vision del nuevo proyecto orientado a observabilidad tecnica y estado operativo de proyectos de desarrollo.
>
> Fecha de contexto base: 25 Feb 2026

---

## 1. Vision del proyecto

Construir una plataforma digital interna para consultar, de forma rapida y centralizada, el estado tecnico de los proyectos a partir de multiples fuentes: **Sonar**, **GitHub**, **Sentry** y otras APIs externas.

La solucion se compone de:
- **Frontend:** `narnia/` para experiencia de consulta, filtros y visualizacion de metricas.
- **Backend en Narnia (Next.js):** capa server-side (BFF) para autenticacion, autorizacion y consumo seguro de APIs externas.
- **API externa:** `proteo/`, consumida por el backend de Next.js para obtener informacion de PQRS.
- **Autenticacion:** **Keycloak** como proveedor de identidad y control de acceso.

La vision incluye habilitar un entorno practico para uso de **IA LLMs como asistentes de desarrollo**, con un framework propio de prompts.

---

## 2. Problema que resolvemos

Actualmente, la informacion de estado tecnico esta fragmentada:
- Calidad de codigo en Sonar
- Flujo de trabajo y repositorios en GitHub
- Errores en produccion en Sentry
- Señales operativas en servicios externos

Esto dificulta responder rapidamente preguntas criticas como:
- Cual es el status actual de cada proyecto
- Que riesgos tecnicos requieren atencion inmediata
- Que integracion esta degradada o en falla

El proyecto unifica esta lectura en una vista accionable y trazable.

---

## 3. Objetivo general

Implementar una plataforma que permita:
- Consolidar metricas tecnicas multi-fuente en una sola vista
- Exponer indicadores de estado por proyecto y por integracion
- Reducir tiempo de diagnostico para equipos tecnicos y de gestion
- Permitir analisis asistido por IA sobre el estado agregado

---

## 4. Definiciones de negocio clave

### 4.1 Que es el status de proyecto

Estado consolidado calculado a partir de reglas sobre señales de calidad, entrega y estabilidad operacional.

### 4.2 Que es una fuente de observabilidad

Sistema externo que aporta metricas o eventos (Sonar, GitHub, Sentry, APIs externas).

### 4.3 Rol de Proteo

`proteo/` es una API externa independiente donde **llegan las PQRS**. `narnia/` la consume a traves de su backend server-side en Next.js.

---

## 5. Poblaciones objetivo (usuarios)

### 5.1 Lider tecnico

**Objetivos:**
- Ver salud tecnica por proyecto
- Priorizar riesgos y deuda

**Necesidades:**
- Dashboard con indicadores confiables y actualizados
- Trazabilidad por fuente e historial

---

### 5.2 Equipo de desarrollo

**Objetivos:**
- Detectar rapido fallas de calidad, pipeline o errores
- Entender impacto por repositorio o servicio

**Necesidades:**
- Filtros por proyecto, entorno e integracion
- Alertas de degradacion y enlaces a evidencia

---

### 5.3 Equipo de operacion/soporte (PQRS)

**Objetivos:**
- Correlacionar estado tecnico con casos PQRS
- Mejorar tiempos de respuesta y diagnostico

**Necesidades:**
- Acceso consolidado a contexto tecnico desde Proteo
- Vista de dependencias e incidentes activos

---

## 6. Alcance funcional por etapas

### 6.1 Etapa 1 - MVP Reporte Unificado

**Incluye:**
- Login con Keycloak
- Dashboard base en `narnia/`
- Integracion inicial con Sonar, GitHub y Sentry consumida directamente por el backend de Next.js en `narnia/`
- Indicador de status por proyecto e integracion (OK, Warning, Error, Unknown)
- Consulta rapida de metricas clave

**Fuera de alcance MVP:**
- Prediccion avanzada de incidentes
- Automatizaciones complejas de remediacion

---

### 6.2 Etapa 2 - Expansion de integraciones

- Nuevas APIs externas conectadas por adaptadores desacoplados
- Reglas de correlacion entre fuentes
- Mejoras de trazabilidad y auditoria

---

### 6.3 Etapa 3 - Analitica asistida por IA

- Analisis contextual de estado global usando agente IA
- Recomendaciones de priorizacion tecnica
- Resumen ejecutivo automatico por proyecto

---

## 7. Reglas de negocio y validaciones

- El estado consolidado se calcula por reglas explicitas y versionadas
- Cada fuente debe proveer timestamp y nivel de severidad
- Si una integracion no responde, el estado pasa a `Unknown` y se registra evento
- Toda consulta debe respetar permisos de acceso definidos en Keycloak
- La capa de presentacion no consume APIs externas directamente; siempre via backend server-side de Next.js

---

## 8. Arquitectura conceptual del proyecto

- **Frontend objetivo:** `narnia/`
- **Backend de aplicacion:** server-side de Next.js en `narnia/` (BFF)
- **API externa principal:** `proteo/`
- **Auth provider:** Keycloak (OIDC)
- **Fuentes externas iniciales:** Sonar, GitHub, Sentry
- **Canal operativo adicional:** integracion con flujo de PQRS en `proteo/`

Principios:
- Arquitectura desacoplada por capas (Domain, Infrastructure, Presentation)
- Contratos estables para trabajo paralelo de equipos
- Adaptadores por proveedor para evitar acoplamiento a una API especifica

---

## 9. Entidades principales del dominio

- Proyecto
- Fuente de metricas
- Metrica tecnica
- Estado consolidado
- Incidente
- Evento de integracion
- PQRS
- Recomendacion IA

---

## 10. Metricas de exito

- Tiempo promedio para responder "cual es el status del proyecto"
- % de proyectos con estado actualizado en tiempo objetivo
- Reduccion de tiempo de diagnostico tecnico inicial
- % de incidencias detectadas por dashboard antes de escalamiento manual
- Uso del analisis IA en decisiones de priorizacion

---

## 11. Restricciones y supuestos

### Restricciones

- Debe mantenerse la arquitectura actual sin romper contratos entre capas
- No se permite acceso directo desde UI a APIs externas
- El consumo de `proteo/` debe hacerse solo desde backend server-side de Next.js
- Integraciones externas sujetas a limites, tokens y disponibilidad de terceros
- Seguridad y autorizacion centralizadas en Keycloak

### Supuestos

- Sonar, GitHub y Sentry exponen APIs consumibles por el backend server-side de Next.js en `narnia/`
- Existen credenciales tecnicas y permisos para integraciones requeridas
- Los equipos adoptan contratos compartidos para desarrollo paralelo

---

## 12. Decisiones pendientes

- Definir formula exacta de estado consolidado por tipo de proyecto
- Confirmar frecuencia de refresco por fuente
- Definir politica de cache y reintentos por integracion
- Acordar esquema final de dashboards por rol
- Establecer catalogo inicial de prompts para agente IA

---

## 13. Vision a largo plazo

Consolidar la plataforma como capa de inteligencia tecnica para la organizacion:
- Observabilidad integral de proyectos
- Diagnostico rapido y consistente
- Soporte de decisiones con IA
- Evolucion continua con integraciones adicionales sin afectar el nucleo

---

## 14. Glosario de terminos

| Termino | Definicion |
|---------|------------|
| Narnia | Frontend del proyecto para visualizacion de metricas y estado |
| Proteo | API externa integradora y receptora de PQRS, consumida por `narnia/` via backend server-side |
| Status consolidado | Resultado agregado de reglas aplicadas sobre multiples fuentes |
| Fuente de observabilidad | Sistema externo que entrega senales tecnicas (Sonar, GitHub, Sentry, etc.) |
| Keycloak | Proveedor de autenticacion y autorizacion |
| Agente IA | Componente de analisis final que interpreta metricas y sugiere acciones |

---

## 15. Flujo de analisis con IA (paso final)

1. El backend server-side de Next.js en `narnia/` consulta y normaliza datos de Sonar, GitHub, Sentry y otras APIs.
2. Se calcula el estado consolidado por proyecto.
3. Se relaciona el contexto de PQRS consultando `proteo/` cuando aplique.
4. **Al final del flujo**, un agente de IA analiza el contexto agregado.
5. El agente devuelve:
   - resumen de estado
   - riesgos prioritarios
   - recomendaciones de accion
6. `narnia/` presenta resultado operativo y resumen asistido en una sola vista.

---

> Este documento es la base de vision del nuevo proyecto de reportes tecnicos.
> Debe leerse junto con `docs/close/01_arquitectura.md`.
