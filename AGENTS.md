# 🤖 Directrices de Desarrollo para Agentes de IA en MotorLog

Este documento define el contexto, arquitectura, estándares y líneas rojas para cualquier trabajo realizado por agentes de IA en el repositorio **MotorLog**.

---

## 🏗️ 1. Arquitectura de MotorLog

MotorLog es una aplicación web local-first para la gestión y seguimiento del mantenimiento de vehículos.

* **Patrón de Arquitectura:** Single Page Application (SPA) basada en **Angular Standalone Components** (Angular v17).
* **Capa de Persistencia:** **RxDB (IndexedDB)** de forma reactiva mediante RxJS. No asumir almacenamiento en backend tradicional; los datos son locales y reactivos.
* **Capa de Estilos:** Integración híbrida de **Tailwind CSS** (utilidades) y **PrimeNG** (componentes UI complejos) encapsulados vía SCSS layers (`@layer tailwind-base, primeng, tailwind-utilities;`).
* **i18n / Internacionalización:** Gestión de traducciones con `@ngx-translate` (archivos `motorlog/src/assets/i18n/es.json` y `motorlog/src/assets/i18n/en.json`).

---

## 📐 2. Estándares y Convenciones del Stack

### TypeScript & Angular (v17+)
* **Standalone First:** Todos los componentes, directivas y pipes deben ser `standalone: true`. No crear ni modificar NgModule a menos que sea estrictamente necesario.
* **Componentes Pequeños y Modulares:** Minimizar el tamaño de los componentes. Crear siempre componentes pequeños, atómicos y desacoplados con la menor lógica posible. Si una sección de UI (tarjeta, widget, modal) se puede modularizar, **DEBE extraerse como un componente Standalone propio** en `@components` o `@shared/components`.
* **Importaciones Limpias:** Utilizar siempre los alias declarados en `tsconfig.json`:
  * `@shared/*` -> `src/app/shared/*`
  * `@pages/*` -> `src/app/pages/*`
  * `@components/*` -> `src/app/components/*`
  * `@assets/*` -> `src/assets/*`
* **Tipado Estricto:** Evitar el uso de `any`. Definir interfaces/tipos explicitos en `@shared/models`.
* **Inyección de Dependencias:** Usar la función `inject()` de `@angular/core` en lugar de constructores recargados cuando sea posible.
* **Manejo de Suscripciones:** Preferir el uso del pipe `async` en plantillas HTML o `takeUntilDestroyed()` / `firstValueFrom()` para evitar fugas de memoria con RxJS.

### 🌍 Internacionalización (i18n) - OBLIGATORIO
* **Cero Literales Hardcodeados:** **Está estrictamente prohibido** escribir texto visible para el usuario (títulos, botones, descripciones, mensajes de error, confirmaciones, placeholders, tooltips) directamente en las plantillas HTML o en código TypeScript.
* **Uso de claves i18n:** Todos los textos deben registrarse en las claves correspondientes dentro de `src/assets/i18n/es.json` y `src/assets/i18n/en.json`.
* **Consumo:** En las plantillas HTML utilizar el pipe `translate` (ej. `{{ 'VEHICLES.TITLE' | translate }}`) o la directiva `translate`. En TypeScript utilizar `TranslateService.instant()` o `TranslateService.get()`.

### Estilos y UI
* Utilizar clases utilitarias de **Tailwind CSS** para layout, espaciados y tipografía.
* Emplear componentes de **PrimeNG** para modales, tablas, toasts y selectores avanzados.
* Respetar la paleta de colores del tema (`primary`, variables CSS definidas en `tailwind.config.js`).

---

## 🛑 3. Líneas Rojas de Desarrollo

1. **KISS & YAGNI:** Implementa la solución más directa, legible y sencilla posible. No crees abstracciones genéricas ni patrones de diseño complejos para necesidades futuras hipotéticas.
2. **Cero Dependencias Nuevas:** No agregues nuevos paquetes npm ni librerías externas sin justificación y confirmación explícita.
3. **Ámbito de Modificación Reducido:** Modifica **únicamente** los archivos requeridos para cumplir la tarea solicitada. Quedan prohibidas las reestructuraciones globales, formateos masivos o refactorizaciones "de limpieza" fuera de alcance.
4. **Respeto a Esquemas RxDB:** No modifiques las colecciones o esquemas de RxDB existentes de manera que invalide o rompa la persistencia local de usuarios con datos previos.
5. **Strict i18n:** Cualquier elemento de UI o mensaje que carezca de traducción estructurada en `es.json` y `en.json` será considerado un defecto de código.
6. **Consultar ante Dudas (Cero Asunciones):** Ante cualquier duda, ambigüedad en los requerimientos o decisión de diseño/arquitectura no especificada, el agente **DEBE preguntar explícitamente al usuario antes de iniciar el desarrollo**. Queda prohibido dar cosas por sabidas o tomar decisiones arbitrarias sobre el flujo o la lógica de negocio.

---

## 🔄 4. Control de Versiones y Cierre de Tareas

### Comandos y Reglas de Versionado (SemVer)
* **Autoevaluación Obligatoria del Agente (Cero Recordatorios del Usuario):** El agente DEBE verificar autónomamente antes de entregar cualquier tarea si los cambios representan una funcionalidad importante (`feat` minor/major) o refactorización relevante.
* **Actualización Proactiva Sincronizada:** Cuando corresponda subir la versión, el agente **DEBE actualizar de forma automática y proactiva** tanto la propiedad `version` en `motorlog/package.json` como la badge en `README.md` (`https://img.shields.io/badge/version-X.X-blue.svg`) **antes de dar por finalizada la respuesta**, sin esperar a que el usuario se lo pida o lo recuerde.
* Patch: `npm run release:patch`
* Minor: `npm run release:minor`
* Major: `npm run release:major`

### Protocolo de Respuesta Final (Obligatorio tras cada tarea)
Al completar cualquier tarea, el agente deberá entregar:
1. **Resumen técnico en 2-3 puntos breves** de lo modificado.
2. **Mensaje de commit de ejemplo:** Proporcionar SIEMPRE un mensaje de commit de ejemplo basado en *Conventional Commits* específico de la tarea realizada:
   * `feat(scope): descripción`
   * `fix(scope): descripción`
   * `refactor(scope): descripción`
   * `style(scope): descripción`
   * `docs(scope): descripción`
3. **Explicación súper sencilla ("Explicación para tontos"):** Una explicación en lenguaje coloquial, sin tecnicismos, que resuma en 2 frases qué se ha hecho y cómo probarlo.
