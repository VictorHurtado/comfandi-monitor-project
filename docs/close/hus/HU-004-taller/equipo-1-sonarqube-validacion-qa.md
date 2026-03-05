# Validación QA — Integración SonarQube (equipo 1)

Documento de apoyo para validar la implementación de SonarQube en el dashboard. HUs de implementación: **HU-007**, **HU-008**, **HU-009**.

---

## Política de actualización (HU-009)

- Los datos se consideran **actualizados recientemente** si se obtuvieron dentro del TTL de caché (por defecto 5 minutos, configurable con `SONAR_CACHE_TTL_MINUTES`).
- En cada visita al dashboard o al refrescar la página, se consultan los datos. Si el caché está vigente, se devuelven los datos cacheados (más rápido).
- La tarjeta muestra "Actualizado hace X min" cuando hay datos válidos.

---

## Prerequisitos

- Proyecto **afiliaciones** seleccionado en `/project-selector`.
- Variables de entorno Sonar configuradas en `narnia/.env` (ver HU-007):
  - `SONAR_BASE_URL`
  - `SONAR_TOKEN`
  - `SONAR_PROJECT_KEY_MAP` (ej. `{"afiliaciones":"<clave-proyecto-sonar>"}`)

---

## Escenario 1: Proyecto “bueno” (Quality Gate passed)

**Objetivo:** Verificar que con un proyecto en Sonar que cumple el Quality Gate y tiene métricas en rango, la tarjeta muestra datos correctos.

**Pasos:**

1. Configurar en Sonar un proyecto (o usar uno existente) con:
   - Quality Gate **passed**
   - Coverage > 0 %
   - Bugs y vulnerabilidades en valores bajos o cero
2. Asegurar que `SONAR_PROJECT_KEY_MAP` apunta a ese proyecto para `afiliaciones`.
3. Ir a `/project-selector`, elegir **Afiliaciones**, luego al dashboard de salud técnica.
4. Abrir la tarjeta de SonarQube.

**Resultado esperado:**

- Semáforo en **verde** (Quality Gate passed).
- Coverage en porcentaje visible.
- Bugs y Vulnerabilities con valores numéricos (o "sin dato" si la API no los devuelve).
- La tarjeta indica que los datos son del proyecto (ej. Afiliaciones).

---

## Escenario 2: Proyecto “malo” (Quality Gate failed o muchas issues)

**Objetivo:** Verificar que con un proyecto que no cumple el Quality Gate o tiene muchas bugs/vulnerabilidades, la tarjeta refleja el estado real.

**Pasos:**

1. Usar en Sonar un proyecto con:
   - Quality Gate **failed**, o
   - Muchas bugs / vulnerabilidades
2. Ajustar `SONAR_PROJECT_KEY_MAP` para que `afiliaciones` apunte a ese proyecto (o usar otro proyecto del monitor si estuviera disponible).
3. Entrar al dashboard con ese proyecto seleccionado y abrir la tarjeta SonarQube.

**Resultado esperado:**

- Semáforo en **rojo** (o estado que indique fallo).
- Coverage, Bugs y Vulnerabilities visibles según lo que devuelva Sonar.
- No se muestra mensaje de “error de conexión”; solo datos de calidad en mal estado.

---

## Escenario 3: Sonar no disponible (fallo de conexión)

**Objetivo:** Verificar que si Sonar no está disponible o la configuración es incorrecta, la tarjeta no rompe el dashboard y muestra un mensaje corto no técnico.

**Pasos:**

1. Simular fallo de conexión:
   - Opción A: comentar o vaciar `SONAR_TOKEN` o `SONAR_BASE_URL` en `.env` y reiniciar el servidor.
   - Opción B: poner `SONAR_BASE_URL` a una URL inalcanzable (ej. `http://localhost:99999`).
2. Ir al dashboard con **Afiliaciones** seleccionado.
3. Observar la tarjeta de SonarQube.

**Resultado esperado:**

- La tarjeta se muestra (no hay error de pantalla completa).
- Mensaje breve y no técnico: **"No se pudo conectar con Sonar"**.
- No se muestran códigos HTTP, stack traces ni mensajes de API.
- El resto del dashboard (otras tarjetas) sigue funcionando.

---

## Escenario 4: Actualización y refresco

**Objetivo:** Verificar que los datos se consideran recientes (TTL) y que al refrescar la página los datos se recargan.

**Pasos:**

1. Con Sonar configurado correctamente, abrir el dashboard y anotar los valores de la tarjeta Sonar.
2. Refrescar la página (F5).
3. Comprobar que los valores se vuelven a cargar (pueden ser los mismos si no ha cambiado Sonar).

**Resultado esperado:**

- Tras refrescar, los datos de Sonar se cargan de nuevo y se muestran correctamente.
- No queda estado corrupto ni datos en blanco por error de cache.

---

## Checklist rápido

- [ ] Escenario 1 (proyecto bueno): semáforo verde y métricas visibles.
- [ ] Escenario 2 (proyecto malo): semáforo rojo y métricas coherentes.
- [ ] Escenario 3 (Sonar no disponible): mensaje corto, sin detalles técnicos, dashboard estable.
- [ ] Escenario 4 (refresco): datos se recargan al actualizar la página.
