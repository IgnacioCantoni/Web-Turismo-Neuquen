// Genera una página HTML propia por prestador y por lugar, para que Google pueda
// indexarlas, más robots.txt y sitemap.xml.
//
// Uso:   node scripts/generar-paginas.mjs
// Correrlo cada vez que se modifique js/data.js. Si en PEHUEMO_CONFIG.sitio está
// cargado el dominio (ej. "https://pehuemo.com.ar"), también agrega URLs canónicas
// y el sitemap.

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "js/data.js"), "utf8"), ctx);
const W = ctx.window;
const CONFIG = W.PEHUEMO_CONFIG;
const LOCS = W.PEHUEMO_LOCALIDADES;
const site = (CONFIG.sitio || "").replace(/\/$/, "");
const template = fs.readFileSync(path.join(root, "index.html"), "utf8");

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const tipoSingular = { Cabañas: "Cabañas", Campings: "Camping", Restaurantes: "Restaurante", Cafeterías: "Cafetería", Cervecerías: "Cervecería", Supermercados: "Supermercado" };
const schemaType = { alojamiento: "LodgingBusiness", gastronomia: "FoodEstablishment", experiencia: "TouristAttraction", servicios: "GroceryStore" };

function page({ route, title, description, image, jsonld, view, body, url }) {
  let html = template;
  html = html.replace(/<html lang="es"[^>]*>/, '<html lang="es" data-paginas="1">');
  html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<base href="../">');
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(description)}">`);
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`);
  html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(description)}">`);
  html = html.replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${esc(site ? site + "/" + image : image)}">`);
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${JSON.stringify(jsonld)}\n</script>`);
  html = html.replace("<!--SEO-->", site ? `<link rel="canonical" href="${site}/${url}">` : "");
  html = html.replace("<body>", `<body data-route="${route}">`);
  html = html.replace('<section class="view" data-view="inicio">', '<section class="view" data-view="inicio" hidden>');
  html = html.replace(`data-view="${view}" hidden>`, `data-view="${view}">`);
  html = html.replace(`<div id="${view}"></div>`, `<div id="${view}">${body}</div>`);
  return html;
}

const urls = [""];
const write = (rel, html) => {
  fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  fs.writeFileSync(path.join(root, rel), html);
  urls.push(rel);
};

for (const dir of ["prestadores", "lugares"]) fs.rmSync(path.join(root, dir), { recursive: true, force: true });

for (const p of W.PEHUEMO_PRESTADORES) {
  const loc = LOCS[p.loc].nombre;
  const tipo = tipoSingular[p.tipo] || p.tipo;
  const title = `${p.nombre} · ${tipo} en ${loc} | PEHUEMO`;
  const description = `${p.nombre}, ${tipo.toLowerCase()} en ${loc}, Neuquén. ${p.descripcion}`.slice(0, 300);
  const jsonld = {
    "@context": "https://schema.org", "@type": schemaType[p.cat] || "LocalBusiness", name: p.nombre,
    description: p.descripcion,
    address: { "@type": "PostalAddress", addressLocality: loc, addressRegion: "Neuquén", addressCountry: "AR" },
    ...(p.telefono ? { telephone: p.telefono } : {}),
    ...(p.web ? { sameAs: [p.web] } : {})
  };
  const body = `
    <h1>${esc(p.nombre)}</h1>
    <p>${esc(tipo)} en ${esc(loc)}, Neuquén.</p>
    <p>${esc(p.descripcion)}</p>
    ${p.telefono ? `<p>Teléfono: ${esc(p.telefono)}</p>` : ""}`;
  write(`prestadores/${p.id}.html`, page({ route: `p-${p.id}`, title, description, image: p.img, jsonld, view: "ficha", body, url: `prestadores/${p.id}.html` }));
}

for (const l of W.PEHUEMO_LUGARES) {
  const loc = LOCS[l.loc].nombre;
  const title = `${l.nombre}, ${loc}: cómo llegar y qué hacer | PEHUEMO`;
  const description = `${l.texto} ${l.detalle}`.slice(0, 300);
  const jsonld = {
    "@context": "https://schema.org", "@type": "TouristAttraction", name: l.nombre, description: l.texto,
    ...(l.coords ? { geo: { "@type": "GeoCoordinates", latitude: l.coords[0], longitude: l.coords[1] } } : {}),
    containedInPlace: { "@type": "Place", name: `${loc}, Neuquén, Argentina` }
  };
  const body = `
    <h1>${esc(l.nombre)}</h1>
    <p>${esc(l.texto)}</p>
    <p>${esc(l.detalle)}</p>`;
  write(`lugares/${l.id}.html`, page({ route: `l-${l.id}`, title, description, image: l.img, jsonld, view: "lugar", body, url: `lugares/${l.id}.html` }));
}

fs.writeFileSync(path.join(root, "robots.txt"),
  `User-agent: *\nAllow: /\n${site ? `Sitemap: ${site}/sitemap.xml\n` : ""}`);
if (site) {
  const today = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(path.join(root, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${site}/${u}</loc><lastmod>${today}</lastmod></url>`).join("\n") + "\n</urlset>\n");
}
console.log(`Páginas generadas: ${urls.length - 1}${site ? " + sitemap.xml" : " (sin sitemap: falta PEHUEMO_CONFIG.sitio)"}`);
