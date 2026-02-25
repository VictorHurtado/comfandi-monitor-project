# .cursor portable kit

Esta guia permite reutilizar tu configuracion de `.cursor` en cualquier proyecto sin perder el flujo completo de entrega.

## Objetivo

Convertir tus reglas y agentes en una base portable, parametrizable por proyecto.

## Archivos plantilla incluidos

- `rules/00-core.template.mdc`
- `rules/01-workflow.template.mdc`
- `rules/06-pr-process.template.mdc`
- `agents/delivery-orchestrator.template.md`

## Como usar en un nuevo proyecto

1. Copiar la carpeta `.cursor` al nuevo repositorio.
2. Duplicar las plantillas y quitar `.template` del nombre.
3. Reemplazar placeholders:
   - `<PRODUCT_VISION_PATH>`
   - `<ARCHITECTURE_PATH>`
   - `<APPROVED_LIBRARIES_SKILL_PATH>`
   - `<NAMING_SKILL_PATH>`
   - `<PROJECT_MAP_SKILL_PATH>`
   - `<TESTING_SKILL_PATH>`
   - `<PR_BASE_MAIN>`
   - `<PR_BASE_STABLE>`
   - `<SONAR_PROJECT_KEY>`
4. Ajustar comandos de tests/build segun el stack real.
5. Validar el flujo con una HU de prueba.

## Recomendacion de estructura minima

- `.cursor/rules/`
- `.cursor/agents/`
- `.cursor/skills/` (opcional, pero recomendado)

## Convencion para portabilidad

- Evitar rutas duras del tipo `docs/close/...` en reglas globales.
- Centralizar decisiones de proyecto en una sola regla/skill de mapeo.
- Usar placeholders para:
  - Ramas base de PR
  - Cobertura minima
  - Comandos de calidad
  - Sonar project key

## Checklist de adopcion

- [ ] Reglas globales sin rutas especificas del repo original
- [ ] Agente orquestador con flujo end-to-end
- [ ] Tests/build configurados para el stack real
- [ ] PR flow definido para ramas reales del repositorio
- [ ] SonarCloud parametrizado y validado por `pullRequest`

