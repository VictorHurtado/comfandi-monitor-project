# Equipo 4 - Proteo

## Integracion

Proteo para cumplimiento operativo relacionado con PQRS en dashboard general.

> Nota de flujo: esta tarjeta se trabaja en el dashboard de un proyecto seleccionado desde `/project-selector`.

## 4 metricas que deberian quedar

1. Cumplimiento general (%)
2. PQRS vencidas (cantidad)
3. Tiempo promedio de respuesta (horas)
4. Casos en riesgo de SLA (cantidad)

---

## Historia 1 (borrador sin refinar)

### Criterios de aceptacion

- La tarjeta de Proteo debe mostrar si vamos bien o mal con cumplimiento.
- El porcentaje principal debe verse grande y facil.
- Si hay PQRS vencidas, eso se tiene que notar de una.
- Si no hay dato de un proyecto nuevo, mostrar algo temporal.

---

## Historia 2 (borrador sin refinar)

### Criterios de aceptacion

- Tiempo promedio de respuesta debe salir en horas (por ahora).
- Casos en riesgo SLA deben verse en el mismo bloque.
- Cuando cambie el proyecto, los datos deben cambiar bien.
- La gente de operacion debe entenderlo sin explicacion tecnica.

---

## Historia 3 (borrador sin refinar)

### Criterios de aceptacion

- Si Proteo no responde, mostrar estado pendiente o desconocido.
- No bloquear toda la pantalla por esta integracion.
- Debe quedar claro de que periodo son los datos (aunque sea basico).
- QA quiere validar un proyecto con cumplimiento alto y otro bajo.
