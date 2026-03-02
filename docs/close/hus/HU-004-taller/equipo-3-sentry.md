# Equipo 3 - Sentry

## Integracion

Sentry para estabilidad y errores en dashboard general.

## 4 metricas que deberian quedar

1. Error rate (%)
2. Incidentes criticos (cantidad)
3. Issues nuevas (ultimas 24h)
4. Tiempo desde ultimo evento (min/h)

---

## Historia 1 (borrador sin refinar)

### Criterios de aceptacion

- La tarjeta de Sentry debe decir rapido si estamos "en problemas" o no.
- Error rate y criticos deben quedar visibles sin entrar al detalle.
- Si no hay eventos, que se note que esta tranquilo y no que fallo.
- Los colores deben ayudar (rojo, amarillo, etc.) sin exagerar.

---

## Historia 2 (borrador sin refinar)

### Criterios de aceptacion

- Las issues nuevas del dia deben aparecer como numero.
- El "ultimo evento" debe verse tipo hace 5 min, 1 hora, etc.
- Si Sentry esta caido, poner estado desconocido o parecido.
- Cambiar de proyecto tiene que cambiar la data de Sentry.

---

## Historia 3 (borrador sin refinar)

### Criterios de aceptacion

- No mostrar mensajes tecnicos de backend al usuario final.
- Si tarda mucho, no dejar la tarjeta congelada sin feedback.
- Debe existir un caso de prueba donde hay 0 criticos y otro con varios.
- QA necesita validar que el bloque no rompe el resto del dashboard.
