# Prompt: Generar Changelog de Release

> Usar este prompt el día del despliegue, cuando los PRs de release están aprobados/mergeados.

## Uso

```
Genera el changelog del release. PR #<NÚMERO>. Versión: v<X.Y.Z>.
Responsable: <Nombre Apellido>.
```

## Instrucciones para el agente

1. Obtener los commits del PR con:
   ```bash
   gh pr view <PR_NUMBER> --json commits --jq '.commits[] | .messageHeadline'
   ```

2. Filtrar los commits que son **merges de ramas a release**. Buscar patrones como:
   - `Merge pull request #XX from ComfandiTD/feature/<ID>`
   - `Merge branch 'feature/<ID>' into release`
   - `feat(<ID>):` o `fix(<ID>):`
   -  - `<ID>:` o `<ID><Descripción>:`

3. Extraer los IDs de las HUs/TCs de esos commits (ej: `TC-001`, `HU-015`).

4. Para cada ID encontrado, leer `docs/documentation/PR_<ID>.md`. Extraer:
   - Descripción
   - Tipo (Feature / Fix / Refactor)
   - Servicios afectados
   - Variables de entorno nuevas
   - Scripts post-despliegue
   - Dependencias nuevas
   - Cobertura de tests

5. Usar `docs/documentation/CHANGELOG_TEMPLATE.md` como base y completar TODAS las secciones con la información recopilada.

6. Clasificar los cambios en:
   - **🆕 Nuevas Funcionalidades**: commits tipo `feat` o PRs de tipo `Feature`
   - **🐞 Corrección de Errores**: commits tipo `fix` o PRs de tipo `Fix`
   - **🔧 Mejoras y Cambios**: commits tipo `refactor`, `chore`, renombramientos, mejoras técnicas
   - **📚 Documentación**: commits tipo `docs`

7. Consolidar variables de entorno, scripts y dependencias de TODOS los PRs en una sola tabla.

8. Guardar como `docs/documentation/CHANGELOG_v<VERSION>.md`.

9. Hacer commit y push.
