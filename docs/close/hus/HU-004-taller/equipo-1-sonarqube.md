# Equipo 1 - SonarQube

## Integracion

SonarQube para mostrar salud de calidad en dashboard general.

> Nota de flujo: esta tarjeta se trabaja en el dashboard de un proyecto seleccionado desde `/project-selector`.

## 4 metricas que deberian quedar

1. Quality Gate (passed/failed)
2. Coverage (%)
3. Bugs (cantidad)
4. Vulnerabilities (cantidad)

---

## Historia 1 (borrador sin refinar)

### Criterios de aceptacion

- Cuando yo abra el dashboard, deberia verse algo de Sonar sin tener que entrar a Sonar.
- Si Sonar responde mal, igual se ve la tarjeta y no se rompe todo.
- El semaforo de Sonar tiene que ser entendible (verde, amarillo o rojo, o algo parecido).
- Que se note de cual proyecto son los datos porque si no se confunde.

---

## Historia 2 (borrador sin refinar)

### Criterios de aceptacion

- Coverage tiene que salir en porcentaje y que sea facil de leer.
- Bugs y vulnerabilities se deben ver en la misma tarjeta para comparar rapido.
- Si no hay dato, poner un texto tipo "sin dato" pero que no se vea feo.
- Cuando actualice la pagina, los datos deberian volver a salir normal.

---

## Historia 3 (borrador sin refinar)

### Criterios de aceptacion

- La info de Sonar debe actualizarse "reciente" (luego definimos cada cuanto).
- Si falla la conexion, mostrar mensaje corto, no tecnico.
- Que no se demore tanto en cargar esa parte.
- El equipo de QA deberia poder validar con un proyecto bueno y uno malo.
