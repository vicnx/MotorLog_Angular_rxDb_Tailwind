# 🎨 Guía de Sistema de Diseño y Estilos: MotorLog 🍃

Este documento define la **Guía de Estilos Oficial**, la paleta de colores, los componentes universales y las reglas de diseño para la interfaz de **MotorLog** (*estilo Tactile Minimalism / Shadcn UI & Vercel Geist*).

---

## 🟢 1. Filosofía Visual y Paleta Verde Bulbasaur

MotorLog adopta una estética **plana, minimalista, precisa y limpia**, eliminando degradados recargados, sombras pesadas y efectos estidentes.

### Palette Tokens (`tailwind.config.js`)
* **Color Primario Base (`#48d0b0`):** `bg-primary-500`, `hover:bg-primary-600`, `active:bg-primary-700`
* **Superficies / Tarjetas:** Blanco `bg-white` (Modo claro) y `dark:bg-gray-800/90` (Modo oscuro)
* **Bordes de Precisión (1px):** `border border-gray-200/70 dark:border-gray-700/70`
* **Sombras:** Micro-elevación plana sutil `shadow-sm`
* **Tipografía:** `Outfit` (Cabeceras) e `Inter` (Cuerpo y datos)

---

## 🧩 2. Componentes Universales y Clases SCSS (`src/styles.scss`)

Toda la interfaz debe construirse reutilizando las clases maestras declaradas en `@layer components` dentro de `src/styles.scss`:

### 1. Sistema de Formularios y Campos (`.input-label`, `.input-field`, `.input-error`)
Se aplica de forma estandarizada a cualquier campo de formulario (`<input>`, `<select>`, `<p-dropdown>`, `<p-inputNumber>`, `<p-colorPicker>` y `<textarea>`).
```html
<div>
  <label class="input-label">Nombre del campo *</label>
  <input type="text" class="input-field" placeholder="Introduce el valor" />
  <div class="input-error">Campo obligatorio</div>
</div>
```

### 2. Botón Principal (`.btn-primary`)
Se utiliza exclusivamente para las acciones principales de la pantalla (Guardar, Confirmar, Empezar).
```html
<button type="submit" class="btn-primary">
  <span>Guardar</span>
  <i class="fas fa-check ml-2"></i>
</button>
```

### 3. Botón Secundario (`.btn-secondary`)
Se utiliza para acciones secundarias, de descarte o de cancelación.
```html
<button type="button" class="btn-secondary">
  <span>Cancelar</span>
</button>
```

### 4. Contenedores de Tarjeta (`.card-container`)
Se utiliza para encapsular cualquier tarjeta, widget o sección de contenido.
```html
<div class="card-container">
  <h3 class="font-bold text-gray-900 dark:text-white">Título de la Tarjeta</h3>
  <p class="text-sm text-gray-500 dark:text-gray-400">Descripción o contenido...</p>
</div>
```

---

## 📱 3. Directrices de Responsividad y Modo Oscuro

1. **Mobile-First por Defecto:** Los componentes deben ser fluidos en pantallas pequeñas (`w-full`) y limitarse o expandirse elegantemente en escritorio mediante breakpoints de Tailwind (`sm:max-w-md`, `grid-cols-1 sm:grid-cols-2`).
2. **Soporte Obligatorio de Modo Oscuro:** Todos los elementos de UI deben declarar variantes oscuras explícitas (`dark:bg-gray-800`, `dark:text-white`, `dark:border-gray-700`).
