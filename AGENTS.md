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
* **Componentes Pequeños y Modulares (Proactividad Obligatoria):** Minimizar el tamaño de los componentes. Crear siempre componentes pequeños, atómicos y desacoplados con la menor lógica posible. El agente **DEBE pensar y actuar con mentalidad modular por defecto**: ante cualquier elemento de UI interactivo, buscador, cabecera de página, selector, tarjeta o widget funcional, **el agente NO debe incrustar la lógica ni el maquetado directamente en la página consumidora**, sino **extraerlo de forma autónoma e inmediata como un componente Standalone atómico, altamente configurable y reutilizable** en `@shared/components` (con sus `@Input`, `@Output` y two-way bindings limpios), sin esperar a que el usuario se lo tenga que recordar o solicitar.
* **Importaciones Limpias:** Utilizar siempre los alias declarados en `tsconfig.json`:
  * `@shared/*` -> `src/app/shared/*`
  * `@pages/*` -> `src/app/pages/*`
  * `@components/*` -> `src/app/components/*`
  * `@assets/*` -> `src/assets/*`
* **Tipado Estricto:** Evitar el uso de `any`. Definir interfaces/tipos explicitos en `@shared/models`.
* **Inyección de Dependencias:** Usar la función `inject()` de `@angular/core` en lugar de constructores recargados cuando sea posible.
* **Manejo de Suscripciones:** Preferir el uso del pipe `async` en plantillas HTML o `takeUntilDestroyed()` / `firstValueFrom()` para evitar fugas de memoria con RxJS.
* **Comentarios Explicativos Concisos:** Escribir siempre comentarios breves, sencillos y claros en funciones complejas o algoritmos no triviales. No comentar código evidente ni sobre-documentar; la meta es dejar clara la intención o el porqué de la lógica compleja en 1-2 líneas.

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

---

## 🎨 5. Sistema de Diseño y Guía de Estilos (Verde Bulbasaur & Tactile Minimalism)

Para garantizar una interfaz limpia, profesional y coherente (*estilo minimalista plano Shadcn UI / Vercel Geist*), todo agente DEBE consultar y cumplir de forma estricta las especificaciones detalladas en la guía oficial:

👉 **[DESIGN_SYSTEM.md](file:///d:/vicen/Documents/Proyectos/MotorLog_Angular_rxDb_Tailwind/DESIGN_SYSTEM.md)**

### Reglas Clave:
1. **Paleta Verde Bulbasaur:** Usar `bg-primary-500` (`#48d0b0`) para elementos primarios. Prohibidos los degradados recargados.
2. **Uso Obligatorio de Clases Globales:** Usar siempre `.input-field`, `.btn-primary`, `.btn-secondary` y `.card-container` declaradas en `src/styles.scss`.
3. **Mobile-First & Dark Mode:** Garantizar diseño fluido y soporte de modo oscuro en toda la app.

---

## 🧩 6. Catálogo de Componentes Comunes y Reutilizables (Uso Obligatorio)

> [!IMPORTANT]
> **Mantenimiento Proactivo del Catálogo (OBLIGATORIO):** Cada vez que se cree, extraiga o refactorice un nuevo componente reutilizable en `@shared/components` o `@components`, el agente **DEBE añadirlo y registrarlo de forma inmediata y autónoma en esta tabla** (con su selector, ruta de importación, propiedades y eventos clave) **antes de dar por finalizada la tarea**, sin esperar a que el usuario se lo recuerde.

Todo desarrollo de UI debe consultar este catálogo antes de crear maquetación o lógica nueva. Si ya existe un componente común para la tarea, **es estrictamente obligatorio reutilizarlo**:

| Componente | Selector | Ruta de Importación | Descripción y Propiedades Clave |
| :--- | :--- | :--- | :--- |
| **`ActionRowComponent`** | `app-action-row` | `@shared/components/action-row/action-row.component` | **Fila táctil universal** para menús, opciones, listas divididas (`divide-y`), enlaces y perfiles. Soporta `[icon]`, `[iconType]` (`'primary' \| 'blue' \| 'amber' \| 'red' \| 'default'`), `[avatarUrl]`, `[title]`, `[subtitle]`, `[badge]`, `[rightIcon]`, `[isDanger]`, `[isStandaloneCard]` y evento `(action)`. |
| **`PageHeaderComponent`** | `app-page-header` | `@shared/components/page-header/page-header.component` | **Cabecera estándar de sub-pantallas** con botón circular táctil de retorno, títulos traducidos y proyección `<ng-content>`. Soporta `[title]`, `[subtitle]`, `[backRoute]`, `[showBackButton]`, `[backTitle]` y evento `(back)`. |
| **`SearchBarComponent`** | `app-search-bar` | `@shared/components/search-bar/search-bar.component` | **Buscador interactivo desplegable** con botón flotante de lupa, foco automático, botón `✕` de limpieza y two-way bindings `[(value)]` y `[(isOpen)]`. Emite `(search)`, `(clear)` y `(closed)`. |
| **`GDriveCardComponent`** | `app-gdrive-card` | `@shared/components/gdrive-card/gdrive-card.component` | **Tarjeta interactiva de sincronización en la nube** con Google Drive (login OAuth2, estado de copia y botón de sincronizar). |
| **`LangDropdownComponent`** | `app-lang-dropdown` | `@shared/components/lang-dropdown/lang-dropdown.component` | **Selector de idioma** estilizado con banderas e integración con `@ngx-translate`. |
| **`ImageSelectorComponent`** | `app-image-selector` | `@shared/components/image-selector/image-selector.component` | **Selector de avatares/imágenes** para vehículos y perfil de usuario. |
| **`VehicleSelectorComponent`** | `app-vehicle-selector` | `@shared/components/vehicle-selector/vehicle-selector.component` | **Selector dropdown** del vehículo activo en cabeceras. |
| **`MaintenanceTimelineComponent`** | `app-maintenance-timeline` | `@shared/components/maintenance-timeline/maintenance-timeline.component` | **Línea de tiempo cronológica** interactiva de mantenimientos, con soporte de filtrado en vivo y estados vacíos. |
| **`NavbarComponent`** | `app-navbar` | `@shared/components/navbar/navbar.component` | **Barra superior flotante** con avatar de usuario y acciones. |
| **`BottomNavComponent`** | `app-bottom-nav` | `@shared/components/bottom-nav/bottom-nav.component` | **Barra de navegación inferior fija** mobile-first con pestañas principales. |



