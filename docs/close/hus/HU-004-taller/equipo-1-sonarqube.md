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

## Variables de entorno (SonarQube)

Agregar en `narnia/.env` (token sin comillas):

```env
SONAR_BASE_URL=https://sonarcloud.io
SONAR_TOKEN=<SONAR_TOKEN>
SONAR_PROJECT_KEY_MAP={"afiliaciones":"ComfandiTD_sucursal-afiliaciones"}
```

---

## HUs técnicas (refinadas)

Las historias de negocio se refinaron en las siguientes HUs técnicas para implementación por agentes:

| HU | Título |
|----|--------|
| **HU-007** | Configuración SonarQube por proyecto y tarjeta con semáforo en dashboard |
| **HU-008** | Mostrar métricas SonarQube (Coverage, Bugs, Vulnerabilities) en la tarjeta |
| **HU-009** | Actualización reciente de SonarQube, mensajes de error y validación QA |

- Ubicación: `docs/close/hus/HU-007.md`, `HU-008.md`, `HU-009.md`.
- Validación QA: `docs/close/hus/HU-004-taller/equipo-1-sonarqube-validacion-qa.md`.

**Contexto proyecto:** por ahora solo **afiliaciones** en el monitor (en Jira = proyecto **PSA** — Sucursal Afiliaciones). Configuración por variables de entorno; patrón análogo a Jira (`JIRA_BASE_URL`, `JIRA_PROJECT_KEY_MAP`, etc.). Sonar: `SONAR_BASE_URL`, `SONAR_TOKEN`, `SONAR_PROJECT_KEY_MAP`.

---

## Historia 1 (borrador sin refinar — reemplazada por HU-007)

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
