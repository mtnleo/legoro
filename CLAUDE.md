@AGENTS.md

# LEGORO — Contexto del proyecto

## Descripción
Landing page de **LEGORO**, empresa de ingeniería eléctrica y electromecánica con sede en **Mar del Plata, Buenos Aires, Argentina**. El objetivo de la página es funcionar como funnel de conversión hacia un formulario de contacto/presupuesto.

---

## Estructura de directorios

```
/legoro/legoro/          → Proyecto Next.js (este repo, trabajar acá)
/legoro/ai-studio-output/legoro-design-inspo/  → Código de referencia exportado desde Google AI Studio
```

El código de referencia en `ai-studio-output` tiene dos archivos principales:
- `main.tsx` — entry point
- `app.tsx` — todos los componentes de la página en un solo archivo, separados por comentarios

**El objetivo es migrar ese código a componentes React individuales dentro del proyecto Next.js**, respetando el diseño, estilos y lógica existentes.

---

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS v4** (con `@theme` en lugar de `tailwind.config.js`)
- **Framer Motion** (animaciones)
- **Lucide React** (íconos)
- **Plus Jakarta Sans / Space Grotesk / Outfit / Inter / JetBrains Mono** (Google Fonts)

---

## Estilos globales — CSS Variables y Tema

El proyecto usa **Tailwind CSS v4** con configuración via `@theme` en el CSS global. Estas son las variables definidas:

### Fuentes
```css
--font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
--font-jakarta: "Plus Jakarta Sans", var(--font-sans);
--font-display: "Space Grotesk", var(--font-sans);   /* H1 */
--font-title: "Outfit", var(--font-sans);             /* H2, H3, H4 */
--font-mono: "JetBrains Mono", ui-monospace, monospace;
```

### Paleta de colores
```css
--color-industrial-base:    #041d44   /* Navy principal — fondo body */
--color-industrial-navy:    #031634   /* Navy más oscuro */
--color-industrial-accent:  #B0BEC5   /* Gris metálico — color acento principal */
--color-industrial-yellow:  #FFCC00   /* Amarillo — solo para íconos */
--color-industrial-steel:   #1e293b   /* Gris acero */
--color-industrial-light:   #ffffff   /* Blanco */
--color-industrial-surface: rgba(255,255,255,0.05)  /* Superficie sutil */
```

### Utilidades globales
```css
.glass        → backdrop-blur-xl, bg-industrial-navy/60, border-white/10
.glass-light  → backdrop-blur-md, bg-white/5, border border-white/10
.btn-hover-effect → hover:bg-industrial-light hover:text-industrial-base hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300
```

### Reglas base
- `h1` → `font-display tracking-tight` (Space Grotesk)
- `h2, h3, h4` → `font-title` (Outfit)
- `body` → `font-sans antialiased text-industrial-light bg-industrial-base`
- `html` → `scroll-behavior: smooth`

---

## Paleta de colores — referencia rápida para Tailwind

Usar siempre las clases semánticas:
- `bg-industrial-base` / `text-industrial-base`
- `bg-industrial-navy` / `text-industrial-navy`
- `bg-industrial-accent` / `text-industrial-accent`  ← acento metálico principal
- `text-industrial-light` ← blanco
- `bg-industrial-steel`
- `text-industrial-yellow` ← solo íconos

---

## Secciones de la página

Orden y nombre de cada sección (migrar en este orden):

| # | Sección | ID anchor |
|---|---------|-----------|
| 1 | Navbar sticky | — |
| 2 | Hero | `#hero` |
| 3 | Servicios | `#servicios` |
| 4 | Por qué elegirnos | `#por-que` |
| 5 | Cómo trabajamos | `#como-trabajamos` | (No está implementado todavía, no implementar todavía)
| 6 | Equipo | `#equipo` |
| 7 | Contacto / Formulario | `#contacto` |
| 8 | Footer | — |

---

## Contenido clave

### Empresa
- **Nombre:** LEGORO
- **Ubicación:** Mar del Plata, Buenos Aires, Argentina
- **Rubro:** Ingeniería eléctrica y electromecánica

### Equipo
| Nombre | Rol |
|--------|-----|
| Ezequiel Leonardi | Ingeniero Electromecánico |
| Matias Rocca | Ingeniero Electromecánico (en formación) |
| Juan Pedro González | Ingeniero Electromecánico (en formación) |

- Las cards del equipo tienen foto circular (placeholder por ahora), nombre, rol y botón LinkedIn (href="#" por ahora)
- **Importante:** los ingenieros no están matriculados pero están habilitados para firmar proyectos. No usar la palabra "matriculados" en ningún lado.

### Servicios
1. Medición de puesta a tierra
2. Continuidad de las masas
3. Prueba de interruptores diferenciales
4. Relevamiento termográfico de tableros eléctricos
5. Diseño de instalaciones eléctricas (residencial, comercial e industrial)
6. Corrección de factor de potencia
7. Sistemas solares fotovoltaicos ON-GRID
8. Sistemas solares fotovoltaicos OFF-GRID
9. Sistemas solares híbridos

---

## Formulario de contacto

Campos (no modificar, ya tienen base de datos asociada):
- Nombre completo (text, required)
- Empresa / Rol (select: Empresa/Industria, PyME, Particular)
- Teléfono (tel, required)
- Servicio de interés (select con todos los servicios + "Otro / Consulta General")
- Mensaje (textarea, optional)

Estados del botón de envío: `idle` / `submitting` / `success`

---

## Convenciones de código

### Estructura de archivos
```
app/
├── page.tsx          → importa y ensambla todos los componentes
├── layout.tsx        → fuentes, metadata, globals
└── globals.css       → @theme, @layer base, @layer utilities

components/
├── Navbar.tsx
├── Hero.tsx
├── Servicios.tsx
├── PorQueElegirnos.tsx
├── ComoTrabajamos.tsx (No está implementado todavía)
├── Equipo.tsx
├── Contacto.tsx
└── Footer.tsx
```

### Reglas generales
- Un componente por sección, un archivo por componente
- Tailwind para todo el styling — sin CSS externo ni módulos CSS
- Usar clases semánticas de la paleta (`industrial-*`) en lugar de colores hardcodeados
- Animaciones con Framer Motion (`motion.div`, `whileHover`, `whileTap`, Intersection Observer para fade-in)
- Íconos con Lucide React
- Sin `"use client"` innecesario — solo en componentes con estado o eventos

### Migración desde ai-studio-output
- Leer `app.tsx` del directorio de referencia para entender cada sección
- Extraer cada bloque como componente independiente
- Respetar la lógica de Framer Motion y los nombres de clases Tailwind existentes
- No mezclar archivos del repo de referencia con el proyecto Next.js

---

## Pendiente / Placeholders

- [ ] Fotos reales del equipo (reemplazar avatars con iniciales)
- [ ] URLs de LinkedIn de cada ingeniero
- [ ] Teléfono y email de contacto real
- [ ] Imagen de fondo del Hero (render fotorrealista nocturno de ciudad, 16:9, se encuentra en /legoro/legoro/public/City_Background.png)
- [ ] Integración del formulario con backend (Resend o Formspree)
- [ ] Redes sociales en footer