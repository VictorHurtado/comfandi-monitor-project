# Equipo 3 - Jira

## Integracion

Jira para seguimiento operativo y flujo de trabajo en dashboard general.

> Nota de flujo: esta tarjeta se trabaja en el dashboard de un proyecto seleccionado desde `/project-selector`.

## 4 metricas que deberian quedar

1. Issues abiertas (cantidad)
2. Issues bloqueadas (cantidad)
3. Issues cerradas en 7 dias (cantidad)
4. Tiempo promedio en estado "In Progress" (horas)

---

## Variables de entorno (Jira)

Agregar en `narnia/.env` (token sin comillas):

```env
JIRA_BASE_URL=https://comfanditi.atlassian.net
EMAIL_API_JIRA=1005964681@comfandi.com.co
TOKEN_API_JIRA=<JIRA_API_TOKEN>
JIRA_PROJECT_KEY_MAP={"afiliaciones":"PSA"}
```

---

## Historia 1 (borrador sin refinar)

### Criterios de aceptacion

- La tarjeta de Jira debe decir rapido como va el trabajo del proyecto.
- Issues abiertas y bloqueadas deben verse sin entrar a Jira.
- Si no hay issues, que se vea claro que esta vacio y no que fallo.
- Los colores deben ayudar a entender si hay riesgo o no.

---

## Historia 2 (borrador sin refinar)

### Criterios de aceptacion

- Las cerradas de la semana se deben ver como numero.
- El promedio en "In Progress" deberia verse facil de entender.
- Si Jira esta caido, poner estado desconocido o pendiente.
- Cambiar de proyecto tiene que cambiar la data de Jira.

---

## Historia 3 (borrador sin refinar)

### Criterios de aceptacion

- No mostrar mensajes tecnicos de backend al usuario final.
- Si tarda mucho, no dejar la tarjeta congelada sin feedback.
- Debe existir un caso de prueba con proyecto ordenado y otro con bloqueos.
- QA necesita validar que el bloque no rompe el resto del dashboard.
