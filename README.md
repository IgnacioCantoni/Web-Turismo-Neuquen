# PEHUEMO · Villa Pehuenia y Moquehue

Sitio web turístico de **Villa Pehuenia** y **Moquehue** (Neuquén, Argentina): alojamientos, experiencias, gastronomía y lugares para visitar, con contacto directo con cada prestador.

## Stack

Sitio estático en HTML, CSS y JavaScript sin dependencias de build. Se puede publicar tal cual en GitHub Pages, Netlify, Vercel o cualquier hosting.

- `index.html`: estructura de todas las vistas (inicio, explorar, ficha, Mi viaje, Sumá tu emprendimiento). La navegación usa `#hash`, así que funciona en cualquier hosting estático.
- `css/styles.css`: estilos, con modo claro y oscuro.
- `js/data.js`: **los datos del sitio** (prestadores, localidades, lugares, configuración).
- `js/app.js`: buscador, filtros, fichas, "Armá tu viaje", favoritos y mapa.
- `assets/img/`: fotos optimizadas en WebP.
- `assets/vendor/leaflet/`: Leaflet 1.9.4 para el mapa (OpenStreetMap).

## Ver el sitio en local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Cómo cargar información

Todo se edita en `js/data.js`:

- **WhatsApp central**: completar `PEHUEMO_CONFIG.whatsapp` (formato `549XXXXXXXXXX`). Mientras esté vacío, los formularios arman el mensaje para copiarlo.
- **Prestadores**: el listado sale de `prestadores_de_servicio.pdf`. Cada uno tiene campos `descripcion`, `servicios`, `whatsapp`, `direccion` y `precio` para completar. Si un prestador tiene WhatsApp propio, los pedidos van directo a él.
- **Fotos**: hoy cada ficha usa una foto del paisaje. Al tener fotos propias, agregarlas en `assets/img/` y cambiar el campo `img`.

## Próximas etapas (según el proyecto PEHUEMO)

Cuentas de turista y prestador, panel con calendario de disponibilidad, estados de reserva, reseñas y panel de administración requieren un backend (propuesto: Node.js + PostgreSQL). Este sitio es la primera etapa, sin backend.
