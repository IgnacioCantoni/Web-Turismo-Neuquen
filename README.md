# PEHUEMO · Villa Pehuenia y Moquehue

Sitio web turístico de **Villa Pehuenia** y **Moquehue** (Neuquén, Argentina): alojamientos, experiencias, gastronomía y lugares para visitar, con contacto directo con cada prestador.

## Stack

Sitio estático en HTML, CSS y JavaScript sin dependencias de build. Se puede publicar tal cual en GitHub Pages, Netlify, Vercel o cualquier hosting.

- `index.html`: estructura de todas las vistas (inicio, explorar, ficha, Mi viaje, Sumá tu emprendimiento). La navegación usa `#hash`, así que funciona en cualquier hosting estático.
- `css/styles.css`: estilos, con modo claro y oscuro.
- `js/data.js`: **los datos del sitio** (prestadores, localidades, lugares, configuración).
- `js/app.js`: buscador, filtros, fichas, lugares, "Qué tenés cerca", "Armá tu viaje", favoritos y mapa.
- `prestadores/` y `lugares/`: una página por prestador y por lugar, generadas por `scripts/generar-paginas.mjs` para que Google las indexe. No editarlas a mano.
- `assets/img/`: fotos optimizadas en WebP.
- `assets/vendor/leaflet/`: Leaflet 1.9.4 para el mapa (OpenStreetMap).

## Ver el sitio en local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Páginas para Google

Cada vez que se cambie `js/data.js`, regenerar las páginas:

```bash
node scripts/generar-paginas.mjs
```

Cuando esté el dominio definitivo, cargarlo en `PEHUEMO_CONFIG.sitio` (ej. `https://pehuemo.com.ar`) y volver a correr el script: agrega URLs canónicas, `sitemap.xml` y la referencia en `robots.txt`. Después, dar de alta el sitio en Google Search Console y enviar el sitemap.

## Cómo cargar información

Todo se edita en `js/data.js`:

- **WhatsApp central**: completar `PEHUEMO_CONFIG.whatsapp` (formato `549XXXXXXXXXX`). Mientras esté vacío, los formularios arman el mensaje para copiarlo.
- **Prestadores**: el listado sale de `prestadores_de_servicio.pdf`. Teléfonos, webs y rubro de 27 de ellos se tomaron de la guía de la Municipalidad de Villa Pehuenia-Moquehue (octubre 2026); conviene confirmarlos con cada uno. Cada uno tiene campos `descripcion`, `servicios`, `whatsapp`, `direccion` y `precio` para completar. Si un prestador tiene WhatsApp propio, los pedidos van directo a él.
- **Fotos**: hoy cada ficha usa una foto del paisaje. Al tener fotos propias, agregarlas en `assets/img/` y cambiar el campo `img`.

- **Lugares**: `PEHUEMO_LUGARES`, con textos basados en la guía de sitios de interés de la Municipalidad. Las coordenadas son aproximadas.

## Próximas etapas (según el proyecto PEHUEMO)

Cuentas de turista y prestador, panel con calendario de disponibilidad, estados de reserva, reseñas y panel de administración requieren un backend (propuesto: Node.js + PostgreSQL). Este sitio es la primera etapa, sin backend.
