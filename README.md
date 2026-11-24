# PetCare 🐾

Plataforma web para **encontrar y reservar servicios para mascotas**: veterinaria, peluquería, paseo y cuidado temporal. El cliente busca proveedores, ve sus servicios y reseñas, reserva fecha y hora, y gestiona sus reservas; el proveedor confirma o rechaza las que recibe.

> 🎓 **Proyecto académico.** PetCare se desarrolló como trabajo de la universidad dentro del programa de **Ingeniería de Software** (ver [Contexto académico](#contexto-académico)). No es un negocio real: los proveedores, precios y reseñas son datos de ejemplo.

**Demo:** https://davidxever.github.io/petcare-web/ 

## Contexto académico

| | |
|---|---|
| Universidad | Corporación Universitaria Iberoamericana |
| Programa | Ingeniería de Software |
| Materia / módulo | Análisis y diseño de sistemas |
| Periodo | Sexto semestre - 2026 |
| Tipo de trabajo | En grupo de 3 personas |
| Mi rol | Diseño UI/UX en Figma |

El trabajo siguió este recorrido: **diseño en Figma** (UI Kit, vistas de computador y teléfono) → **implementación web** de esas pantallas con HTML, CSS y JavaScript.

## Funcionalidades

- Inicio con categorías y proveedores destacados.
- Registro e inicio de sesión (cliente o proveedor) con validación de campos.
- Búsqueda por texto, categoría y ubicación.
- Perfil del proveedor con servicios, precios y reseñas.
- Reserva con fecha y hora; evita reservar un horario ya ocupado.
- Confirmación, listado de **Mis reservas** y cancelación.
- **Panel del proveedor** para confirmar o rechazar reservas.
- Diseño **responsive**: navegación superior en computador y tablet, navegación inferior en teléfono.
- Accesibilidad básica: etiquetas en formularios, foco visible, `aria-live` en resultados y enlace para saltar al contenido.

## Tecnologías

HTML5 · CSS3 (variables, grid, media queries) · JavaScript (ES6+, sin librerías) · `localStorage` para simular la base de datos · Figma para el diseño.

La implementación web y la adaptación a teléfono se desarrollaron con asistencia de IA (Claude, de Anthropic) a partir de mi diseño en Figma. Yo definí las pantallas, requisitos, estilos y revisé el resultado.

## Cómo ejecutarlo

No necesita instalación. Opciones:

1. Abre `index.html` en el navegador, o
2. sirve la carpeta con un servidor local:
   ```bash
   python3 -m http.server 8000
   # luego abre http://localhost:8000
   ```

## Estructura

```
petcare-web/
├── index.html        # página única; las vistas se montan con JS
├── css/styles.css    # estilos y diseño responsive
├── js/data.js        # datos de ejemplo (categorías y proveedores)
├── js/app.js         # rutas, vistas y lógica
└── assets/logos/     # logos de proveedores (ver abajo)
```

### Logos

Exporta los logos desde Figma y guárdalos en `assets/logos/` con estos nombres: `petspa.png`, `vetcare.png`, `paseosfelices.png`, `guarderiapeludos.png`. Si un archivo no existe, la página muestra las iniciales del proveedor.

## Limitaciones conocidas

- **No hay backend**: usuarios y reservas viven en el `localStorage` del navegador y las contraseñas se guardan sin cifrar. Es solo una simulación para fines académicos; **no uses contraseñas reales**.
- Las notificaciones por correo están simuladas.
- El panel del proveedor muestra todas las reservas de la demo, sin separar por negocio.

## Próximos pasos

- Backend con base de datos y autenticación real (contraseñas con hash).
- Vincular cada cuenta de proveedor con su negocio.
- Notificaciones reales y pasarela de pago.
- Pruebas automáticas.

## Diseño

Diseño original en Figma: https://www.figma.com/design/iRbDvTOs21IhIkH8ulmuST/PetCare?node-id=2207-1332&t=FBXnVXaOaA958m2W-
