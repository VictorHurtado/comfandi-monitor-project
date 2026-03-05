# Equipo 2 - GitHub

## Integracion

GitHub para actividad de desarrollo en dashboard general.

> Nota de flujo: esta tarjeta se trabaja en el dashboard de un proyecto seleccionado desde `/project-selector`.

## 4 metricas que deberian quedar

1. Pull Requests abiertas
2. Pull Requests mergeadas (ultimos 7 dias)
3. Commits (ultimos 7 dias)
4. Build checks exitosos (% o ratio)

---

## Variables de entorno (GitHub)

Agregar en `narnia/.env`:

```env
GITHUB_BASE_URL=https://api.github.com
GITHUB_TOKEN=<GITHUB_TOKEN>
GITHUB_REPO_MAP={"afiliaciones":"ComfandiTD/sucursal-afiliaciones"}
GITHUB_TIME_WINDOW_DAYS=7
```

---

## Historia 1 (borrador sin refinar)

### Criterios de aceptacion

- En la tarjeta de GitHub quiero ver movimiento del repo sin tener que abrir GitHub.
- PR abiertas y mergeadas se deben ver claro y en el mismo bloque.
- Si el repo no existe o no tiene permisos, se muestra algo entendible.
- Debe funcionar con al menos un repo real del equipo.

---

## Historia 2 (borrador sin refinar)

### Criterios de aceptacion

- Commits de la semana deben verse como numero total.
- Build checks deberia verse como "bien/mal" o porcentaje, lo que quede mas claro.
- Si no hay actividad en la semana, mostrar 0 y no dejar vacio.
- Cambiar de proyecto debe cambiar tambien la info de GitHub.

---

## Historia 3 (borrador sin refinar)

### Criterios de aceptacion

- Cuando falle GitHub API que no explote la pantalla completa.
- Mensaje de error corto, nada de stacktrace ni cosas raras.
- Dejar visible cuando fue la ultima sincronizacion (aprox, no exacto por ahora).
- QA necesita probar con un repo activo y otro casi sin movimiento.
