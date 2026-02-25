# 📄 Notas de liberación – v<VERSIÓN>

> _Fecha de despliegue_: YYYY-MM-DD
> _Responsable del release_: Nombre Apellido
> _Ambiente_: Production
> _PR_: #<NÚMERO> — [Ver en GitHub](<URL_PR>)

---

## 📦 Proyectos desplegados

- **Atlas** (Backend)
- **Hermes** (Frontend)

---

## 🆕 Nuevas Funcionalidades

<!-- Listar cada HU implementada con link a Jira o a la documentación del PR -->

- **🔧 HU <ID>**: Descripción breve — [Ver en Jira](<URL>) | [PR Doc](docs/documentation/PR_<ID>.md)

---

## 🔧 Mejoras y Cambios

<!-- Listar mejoras técnicas, refactors, cambios de configuración -->

- Descripción de la mejora o cambio

---

## 🐞 Corrección de Errores

<!-- Listar bugs corregidos con link a Jira si aplica -->

- **🔧 BUG <ID>**: Descripción — [Ver en Jira](<URL>)

---

## 📚 Documentación

<!-- Listar documentación creada o actualizada -->

- Descripción del documento

---

## 🎁 Extras Técnicos

<!-- Listar cambios técnicos que no son funcionalidades ni bugs -->

- Descripción

---

## ⚙️ Configuración y Entorno

### 🔑 Variables de Entorno nuevas o modificadas

| Variable | Proyecto | Descripción | Ejemplo |
|----------|----------|-------------|---------|
| — | — | — | — |

### 📜 Scripts o Comandos post-despliegue

```bash
# Listar comandos necesarios después del despliegue (migraciones, seeds, etc.)
# Si no aplica, indicar "No aplica"
```

### 📦 Dependencias Nuevas

| Paquete | Proyecto | Motivo |
|---------|----------|--------|
| — | — | — |

---

## ⚠️ Consideraciones Especiales

- ⚠️ _Migraciones_: Indicar si hay migraciones y el comando
- ⚠️ _Incompatibilidades_: Indicar si hay breaking changes
- ⚠️ _Rollback_: Indicar procedimiento de rollback si aplica

---

## ✅ Checklist de despliegue

```markdown
- [ ] Tests pasan (>= 80% coverage)
- [ ] Build OK en ambos proyectos
- [ ] SonarCloud quality gate OK
- [ ] Variables de entorno configuradas en el ambiente destino
- [ ] Migraciones aplicadas (si aplica)
- [ ] Seeds ejecutados (si aplica)
- [ ] Verificación funcional post-despliegue
- [ ] Comunicación al equipo / stakeholders
```

---

> _Este documento debe completarse en cada release para que todo el equipo y stakeholders tengan clara la versión que se despliega, qué cambios incluye y qué impactos tiene._
