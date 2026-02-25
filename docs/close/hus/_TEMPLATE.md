# HU-XXX — <Título>

**Como** <tipo de usuario>  
**Quiero** <necesidad>  
**Para** <beneficio>

---

## Dependencias

- Requiere: HU-00Y, HU-00Z (si aplica)
- Requiere: TC-002 (tema Tailwind `brand-*` — si la HU incluye UI)
- Requiere configuración previa: (Tailwind/IoC/Supabase/etc.)

---

## Contexto / Notas

- Decisiones relevantes (ej: “MUI + Tailwind se usan juntos”).
- Restricciones de arquitectura (Clean Architecture: Domain no depende de Presentation/Infrastructure).
- Si hay consideraciones del entorno (Codex Cloud sin npm), describirlo aquí.

---

## Diseño (OBLIGATORIO si hay UI)

Referencias:
- Diseño: `docs/design/<screen>.png` (o archivos `.md` de diseño)
- Design System: `docs/design/system.md`

Reglas:
- Respetar jerarquía visual del diseño.
- Usar tokens definidos en el Design System (no inventar tamaños/colores).
- Si algo no es claro en el diseño, preguntar antes de asumir.

---
---

## Reglas técnicas

- Arquitectura: ver `docs/01_arquitectura.md`
- Reglas Codex: ver `docs/02_reglas_de_codex.md`

## Alcance

Incluye:
- ...

No incluye:
- ...

---

## Criterios de aceptación (Given / When / Then)

### 1) <Criterio>

- **Dado** ...
- **Cuando** ...
- **Entonces** ...

### 2) <Criterio>

- **Dado** ...
- **Cuando** ...
- **Entonces** ...

---

## Reglas técnicas

### Arquitectura
- Presentation solo consume UseCases vía IoC (no importa repositorios concretos).
- Domain no importa React/Next/MUI/Tailwind/Inversify.
- Infrastructure contiene implementaciones y wiring IoC.

### UI (si aplica)
- UI con **Tailwind CSS**.
- **Usar SIEMPRE los tokens `brand-*`** del tema configurado en `tailwind.config.ts` (colores, tipografía, tamaños). No usar colores hex en línea ni inventar clases de color.
- Tipografía: `font-outfit`. Tamaños: `text-h1`..`text-button` (definidos en el tema).
- No agregar librerías de estilos adicionales sin HU específica.

### Dependencias / Paquetes
- No agregar dependencias nuevas salvo que esta HU lo indique explícitamente.
- Si aparece error 403/conectividad:
  1) Detenerse
  2) Pedir dominios requeridos
  3) Explicar por qué se requieren
  4) No continuar

---

## Implementación sugerida (opcional)

- Archivos/carpetas sugeridas:
  - `src/...`

---

## Validación

Comandos mínimos:
- `npm run dev`
- `npm run build`

(Agregar tests si aplica)

---

## Definición de Hecho

- [ ] Criterios de aceptación cumplidos
- [ ] `npm run dev` OK
- [ ] `npm run build` OK
- [ ] Sin violaciones de capas
- [ ] Sin cambios fuera del alcance
- [ ] Componentes usan tokens `brand-*` (si aplica UI)
- Commit sugerido:
  `<tipo>: <mensaje>`