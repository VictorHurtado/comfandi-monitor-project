# Design System Base (HU-002)

Este documento define los tokens iniciales de UI para `narnia/` en **modo claro**.

## Theme tokens (Tailwind)

Fuente: `narnia/tailwind.config.ts`

- Colores:
  - `brand-50` ... `brand-900`
  - `brand-canvas`, `brand-surface`, `brand-border`, `brand-muted`, `brand-focus`, `brand-disabled`
  - `status-success`, `status-warning`, `status-danger`
- Tipografia:
  - `font-outfit`
  - `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-caption`, `text-button`
- Border radius:
  - `rounded-card`, `rounded-input`, `rounded-button`
- Sombras:
  - `shadow-card`, `shadow-interactive`

## Clases base reutilizables

Fuente: `narnia/src/app/globals.css`

- `ui-card`: contenedor base de tarjeta
- `ui-control`: inputs/selects con estados `hover/focus/disabled`
- `ui-button-primary`: boton primario de tema

## Reglas de uso

- Usar tokens `brand-*` en componentes UI.
- Evitar hex inline en componentes Presentation.
- Mantener el alcance en **tema claro** (sin `darkMode`).
