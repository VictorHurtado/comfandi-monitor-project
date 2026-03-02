
Actúa como agente de implementación end-to-end para la HU `HU-004`.
 
## Contexto obligatorio
 
1. Lee y usa como fuente de verdad:
   - `docs/close/-01_project_vision.md`
   - `docs/close/01_arquitectura.md`
   - `docs/close/hus/<HU_FILE>.md`
2. Respeta estrictamente capas:
   - Presentation -> Domain <- Infrastructure
3. No diseñes arquitectura; impleméntala.
 
## Flujo BLOQUEANTE por fases (sin saltar)
 
1. **Planner**
   - Entrega plan de archivos a crear/modificar y orden.
   - Si HU es ambigua, detente y pregunta.
   - No escribas código en esta fase.
 
2. **Implementation**
   - Implementa en orden: Domain -> Infrastructure -> Presentation.
   - Usa errores tipados (`AppError` y subclases).
   - No pongas lógica de negocio en UI/hooks.
 
3. **Tester**
   - Escribe/ajusta tests de la HU.
   - Ejecuta `npx jest --coverage`.
   - Si cobertura < 80%, escribe más tests y repite.
 
4. **Quality gates**
   - Ejecuta F1: `npx jest --coverage` (>= 80%).
   - Ejecuta F2: `npm run build` (sin errores).
   - Si falla F1 o F2: corrige y repite, no avances.
 
5. **Delivery**
   - Entrega evidencias reales de comandos, cobertura y build.
   - Reporta archivos cambiados, tests, riesgos y checklist DoD.
 
## Política de ramas y PR (OBLIGATORIA)
 
- Activa explícitamente el skill de PR:
  - `.cursor/rules/06-pr-process.mdc`
- **PROHIBIDO** hacer commit/push directo a `development`, `release` o  `main` .
- Rama de trabajo obligatoria:
  - `feature/HU-004` creada desde `release`.
- Flujo obligatorio:
  1. `feature/HU-004` -> PR a `development`
  2. `feature/HU-004` -> PR a `release`
- Crea PRs con `gh pr create` y reporta las 2 URLs.
 
## Guardrails de seguridad
 
- No afirmar ejecuciones no realizadas.
- Si aparece error 403/conectividad: detenerse, listar dominios requeridos y explicar.
- Si `gh` no está autenticado: detenerse y pedir `gh auth login`.
 
## Cierre obligatorio
 
No cierres hasta entregar:
- Evidencia F1 (coverage >= 80%).
- Evidencia F2 (build OK).
- Commit + push en `feature/HU-004`.
- URL PR a `development`.
- URL PR a `release`.
- Si SonarCloud está configurado: `status=OK`, `new_coverage>=80`, issues 0 (excepto INFO) por `pullRequest=<PR_NUMBER>`.
 
---
 
## Plantilla rápida de invocación
 
Implementa la HU `HU-004` usando `docs/close/hus/<HU_FILE>.md` y ejecuta el proceso completo por fases (Planner -> Implementation -> Tester -> Quality gates -> Delivery), activando PR flow con `.cursor/rules/06-pr-process.mdc`.
 
Recuerda: prohibido push directo a `development`/`release`; trabaja en `feature/<ID-HU>` y crea dos PRs con `gh` (a `development` y `release`).