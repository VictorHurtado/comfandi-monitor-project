# Validación QA — Integración SonarQube (equipo 1)

Documento de apoyo para validar la implementación de SonarQube en el dashboard. HUs de implementación: **HU-007**, **HU-008**, **HU-009**.

---

## Prerequisitos

- Proyecto **afiliaciones** seleccionado en `/project-selector`.
- Variables de entorno Sonar configuradas en `narnia/.env` (ver HU-007):
  - `SONAR_BASE_URL`
  - `SONAR_TOKEN`
  - `SONAR_PROJECT_KEY_MAP` (ej. `{"afiliaciones":"<clave-proyecto-sonar>"}`)
- TTL de cache Sonar definido en BFF: **5 minutos** por proyecto.

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
- Mensaje breve y no técnico (ej. "Sonar no disponible" o "No se pudo conectar con Sonar").
- No se muestran códigos HTTP, stack traces ni mensajes de API.
- El resto del dashboard (otras tarjetas) sigue funcionando.

---

## Escenario 4: Actualización y refresco

**Objetivo:** Verificar que los datos se consideran recientes (TTL) y que al refrescar la página los datos se recargan.

**Pasos:**

1. Con Sonar configurado correctamente, abrir el dashboard y anotar los valores de la tarjeta Sonar.
2. Refrescar la página (F5) antes de cumplir 5 minutos.
3. Comprobar que la tarjeta responde rápido (cache vigente) y mantiene coherencia de datos.
4. Esperar más de 5 minutos o cambiar reloj de prueba para superar el TTL.
5. Refrescar nuevamente y validar que la tarjeta revalida la información.

**Resultado esperado:**

- Dentro de los 5 minutos, se puede reutilizar cache sin inconsistencias.
- Después de 5 minutos, se reconsulta Sonar y se actualizan datos.
- No queda estado corrupto ni datos en blanco por error de cache.

---

## Escenario 5: Carga no bloqueante del dashboard

**Objetivo:** Verificar que la tarjeta Sonar carga de forma independiente y no bloquea el resto del dashboard.

**Pasos:**

1. Configurar Sonar con respuesta lenta (o simular latencia de red).
2. Abrir el dashboard de salud técnica con **Afiliaciones**.
3. Observar el primer render de la página y luego la tarjeta Sonar.

**Resultado esperado:**

- El dashboard se muestra completo (sidebar, otras tarjetas y paneles) sin esperar a Sonar.
- La tarjeta Sonar muestra estado de carga propio y luego actualiza datos.
- Si Sonar falla, solo la tarjeta muestra mensaje corto no técnico; el resto de la página permanece usable.

---

## Checklist rápido

- [ ] Escenario 1 (proyecto bueno): semáforo verde y métricas visibles.
- [ ] Escenario 2 (proyecto malo): semáforo rojo y métricas coherentes.
- [ ] Escenario 3 (Sonar no disponible): mensaje corto, sin detalles técnicos, dashboard estable.
- [ ] Escenario 4 (TTL 5 min): cache reciente + revalidación tras expiración.
- [ ] Escenario 5 (no bloqueante): dashboard usable mientras Sonar carga o falla.
