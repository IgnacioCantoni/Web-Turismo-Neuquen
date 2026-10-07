(function () {
  "use strict";

  const CONFIG = window.PEHUEMO_CONFIG;
  const LOCS = window.PEHUEMO_LOCALIDADES;
  const CATS = window.PEHUEMO_CATEGORIAS;
  const ITEMS = window.PEHUEMO_PRESTADORES;
  const PLACES = window.PEHUEMO_LUGARES;
  const TRIPS = window.PEHUEMO_VIAJES;
  const byId = Object.fromEntries(ITEMS.map((p) => [p.id, p]));
  const placeById = Object.fromEntries(PLACES.map((l) => [l.id, l]));

  // Con páginas generadas (scripts/generar-paginas.mjs) los enlaces van a URLs reales,
  // que Google puede indexar. Sin ellas, se navega con #.
  const PAGES = document.documentElement.dataset.paginas === "1";
  const linkP = (p) => (PAGES ? `prestadores/${p.id}.html` : `#p-${p.id}`);
  const linkL = (l) => (PAGES ? `lugares/${l.id}.html` : `#l-${l.id}`);

  // Distancia aproximada en km entre dos coordenadas.
  const km = (a, b) => {
    if (!a || !b) return null;
    const R = 6371, r = Math.PI / 180;
    const dLat = (b[0] - a[0]) * r, dLon = (b[1] - a[1]) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };
  const fmtKm = (d) => (d == null ? "" : d < 1 ? "a menos de 1 km" : `a ≈ ${Math.round(d)} km`);

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const tipoSingular = { Cabañas: "Cabañas", Campings: "Camping", Restaurantes: "Restaurante", Cafeterías: "Cafetería", Cervecerías: "Cervecería", Supermercados: "Supermercado" };
  const HEART_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.9 3.8 4.5 7.2 4.5c2 0 3.5 1.1 4.8 2.8 1.3-1.7 2.8-2.8 4.8-2.8 3.4 0 5.5 3.4 4.4 6.6-1.7 4.8-9.2 9.4-9.2 9.4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
  const HEART_ON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.9 3.8 4.5 7.2 4.5c2 0 3.5 1.1 4.8 2.8 1.3-1.7 2.8-2.8 4.8-2.8 3.4 0 5.5 3.4 4.4 6.6-1.7 4.8-9.2 9.4-9.2 9.4z" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
  const heart = (on) => (on ? HEART_ON : HEART_OFF);
  const tipoLabel = (p) => tipoSingular[p.tipo] || p.tipo;

  // ---------- Favoritos (Mi viaje) ----------
  const FAV_KEY = "pehuemo-mi-viaje";
  let favs = [];
  try { favs = JSON.parse(localStorage.getItem(FAV_KEY) || "[]").filter((id) => byId[id]); } catch (e) { favs = []; }
  const saveFavs = () => {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (e) { /* sin almacenamiento */ }
    const c = $("#trip-count"); c.textContent = favs.length; c.toggleAttribute("data-zero", favs.length === 0);
  };
  const isFav = (id) => favs.includes(id);
  const toggleFav = (id) => {
    favs = isFav(id) ? favs.filter((f) => f !== id) : favs.concat(id);
    saveFavs();
    $$(`.fav[data-id="${id}"]`).forEach((b) => setFavBtn(b, id));
    if (current === "mi-viaje") renderTrip();
  };
  const setFavBtn = (btn, id) => {
    const on = isFav(id);
    btn.setAttribute("aria-pressed", on);
    btn.setAttribute("aria-label", on ? "Quitar de Mi viaje" : "Guardar en Mi viaje");
    btn.innerHTML = heart(on);
  };
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".fav");
    if (b) { e.preventDefault(); toggleFav(b.dataset.id); }
  });

  // ---------- Tarjetas ----------
  const card = (p) => `
    <article class="card">
      <div class="card__img">
        <img src="${p.img}" alt="" loading="lazy">
        <span class="card__tag">${esc(tipoLabel(p))}</span>
      </div>
      <button class="fav" type="button" data-id="${p.id}" aria-pressed="${isFav(p.id)}" aria-label="${isFav(p.id) ? "Quitar de" : "Guardar en"} Mi viaje">${heart(isFav(p.id))}</button>
      <h3><a href="${linkP(p)}">${esc(p.nombre)}</a></h3>
      <p class="card__loc">${LOCS[p.loc].nombre}</p>
    </article>`;

  // ---------- Inicio ----------
  function renderHome() {
    $("#cats").innerHTML = Object.entries(CATS).map(([key, c]) => {
      const n = ITEMS.filter((p) => p.cat === key).length;
      return `<a class="cat" href="#explorar-${key}">
        <img src="${c.img}" alt="" loading="lazy">
        <span class="cat__n">${n} ${n === 1 ? "prestador" : "prestadores"}</span>
        <h3>${c.nombre}</h3>
        <p>${c.accion}</p>
      </a>`;
    }).join("");

    $("#towns").innerHTML = Object.entries(LOCS).map(([key, l]) => `
      <article class="town">
        <img src="${l.img}" alt="${l.nombre}" loading="lazy">
        <div class="town__body">
          <h3>${l.nombre}</h3>
          <p>${l.resumen}</p>
          <dl class="town__data">${l.datos.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
          <div class="town__links">
            <a class="btn btn--sm" href="#explorar-alojamiento-${key}">Dónde dormir</a>
            <a class="btn btn--sm btn--ghost" href="#explorar-gastronomia-${key}">Dónde comer</a>
          </div>
        </div>
      </article>`).join("");

    const tipos = [...new Set(PLACES.map((pl) => pl.tipo))];
    $("#places-filter").innerHTML = ["Todos"].concat(tipos).map((t, i) => `
      <label class="chip"><input type="radio" name="pl-tipo" id="pl-tipo-${i}" value="${i ? esc(t) : ""}" ${i ? "" : "checked"}><span>${esc(t)}</span></label>`).join("");
    $("#places-filter").addEventListener("change", (e) => renderPlaces(e.target.value));
    renderPlaces("");

    $("#planner-types").innerHTML = Object.entries(TRIPS).map(([key, t], i) => `
      <label class="chip"><input type="radio" name="trip" id="trip-${key}" value="${key}" ${i === 0 ? "checked" : ""}><span>${t.nombre}</span></label>`).join("");
  }

  function placeCard(pl, from) {
    const d = from ? km(from, pl.coords) : null;
    return `
      <article class="place">
        <img src="${pl.img}" alt="${esc(pl.nombre)}" loading="lazy">
        <span class="place__loc">${esc(pl.tipo)} · ${LOCS[pl.loc].nombre}${d != null ? " · " + fmtKm(d) : ""}</span>
        <h3><a href="${linkL(pl)}">${esc(pl.nombre)}</a></h3>
        <p>${esc(pl.texto)}</p>
      </article>`;
  }
  function renderPlaces(tipo) {
    $("#places").innerHTML = PLACES.filter((pl) => !tipo || pl.tipo === tipo).map((pl) => placeCard(pl)).join("");
  }

  // ---------- Mapa ----------
  let mapReady = false;
  function initMap() {
    if (mapReady) return;
    const el = $("#map");
    if (!window.L) { el.parentElement.hidden = true; return; }
    mapReady = true;
    const map = L.map(el, { scrollWheelZoom: false }).setView([-38.93, -71.23], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    const icon = (cls) => L.divIcon({ className: "", html: `<span class="pin ${cls}"></span>`, iconSize: [28, 28], iconAnchor: [14, 28], popupAnchor: [0, -26] });
    Object.entries(LOCS).forEach(([key, l]) => {
      L.marker(l.coords, { icon: icon("pin--town") }).addTo(map)
        .bindPopup(`<strong>${l.nombre}</strong><br><a href="#explorar-alojamiento-${key}">Ver alojamientos</a>`);
    });
    PLACES.filter((pl) => pl.coords).forEach((pl) => {
      L.marker(pl.coords, { icon: icon("pin--place") }).addTo(map)
        .bindPopup(`<strong>${esc(pl.nombre)}</strong><br>${esc(pl.texto)}<br><a href="${linkL(pl)}">Ver más</a>`);
    });
    setTimeout(() => map.invalidateSize(), 200);
  }

  // ---------- Explorar ----------
  const filters = { q: "", cat: "", loc: "", tipo: "" };

  function renderFilterChips() {
    const catChips = [["", "Todas"]].concat(Object.entries(CATS).map(([k, c]) => [k, c.nombre]));
    $("#f-cat").innerHTML = catChips.map(([v, label]) => `
      <label class="chip"><input type="radio" name="f-cat" id="f-cat-${v || "all"}" value="${v}" ${filters.cat === v ? "checked" : ""}><span>${label}</span></label>`).join("");
    const tipos = [...new Set(ITEMS.filter((p) => !filters.cat || p.cat === filters.cat).map((p) => p.tipo))];
    if (filters.tipo && !tipos.includes(filters.tipo)) filters.tipo = "";
    $("#f-tipo").innerHTML = [["", "Todos"]].concat(tipos.map((t) => [t, t])).map(([v, label]) => `
      <label class="chip"><input type="radio" name="f-tipo" id="f-tipo-${v || "all"}" value="${esc(v)}" ${filters.tipo === v ? "checked" : ""}><span>${esc(label)}</span></label>`).join("");
    $$('input[name="f-loc"]').forEach((i) => { i.checked = i.value === filters.loc; });
  }

  function renderResults() {
    const q = filters.q.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const list = ITEMS.filter((p) =>
      (!filters.cat || p.cat === filters.cat) &&
      (!filters.loc || p.loc === filters.loc) &&
      (!filters.tipo || p.tipo === filters.tipo) &&
      (!q || p.nombre.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").includes(q))
    );
    const title = [filters.cat ? CATS[filters.cat].nombre : "Alojamientos, experiencias y gastronomía",
      filters.loc ? `en ${LOCS[filters.loc].nombre}` : ""].join(" ").trim();
    $("#explore-title").textContent = title;
    $("#results-count").textContent = `${list.length} ${list.length === 1 ? "resultado" : "resultados"}`;
    $("#results").innerHTML = list.length
      ? list.map(card).join("")
      : `<div class="empty">No encontramos resultados con esos filtros. Probá con otra localidad o categoría.</div>`;
  }

  $("#f-q").addEventListener("input", (e) => { filters.q = e.target.value; renderResults(); });
  $(".filters").addEventListener("change", (e) => {
    const t = e.target;
    if (t.name === "f-cat") { filters.cat = t.value; renderFilterChips(); }
    if (t.name === "f-loc") filters.loc = t.value;
    if (t.name === "f-tipo") filters.tipo = t.value;
    renderResults();
  });

  $("#search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const cat = $('input[name="s-cat"]:checked').value;
    const loc = $('input[name="s-loc"]:checked').value;
    location.hash = ["explorar", cat, loc].filter(Boolean).join("-");
  });

  // ---------- Ficha ----------
  function pick(list, seed) {
    if (!list.length) return null;
    return list[Math.abs(seed) % list.length];
  }
  const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7);

  function bookingFields(p) {
    const today = new Date().toISOString().slice(0, 10);
    if (p.cat === "alojamiento") return `
      <div class="form__row">
        <label class="field"><span>Llegada</span><input type="date" id="b-in" min="${today}" required></label>
        <label class="field"><span>Salida</span><input type="date" id="b-out" min="${today}" required></label>
      </div>
      <label class="field"><span>Personas</span><input type="number" id="b-people" min="1" max="30" value="2" required></label>`;
    if (p.cat === "gastronomia") return `
      <div class="form__row">
        <label class="field"><span>Día</span><input type="date" id="b-in" min="${today}" required></label>
        <label class="field"><span>Horario</span><input type="time" id="b-time" value="21:00"></label>
      </div>
      <label class="field"><span>Personas</span><input type="number" id="b-people" min="1" max="40" value="2" required></label>`;
    if (p.cat === "experiencia") return `
      <div class="form__row">
        <label class="field"><span>Fecha</span><input type="date" id="b-in" min="${today}" required></label>
        <label class="field"><span>Personas</span><input type="number" id="b-people" min="1" max="30" value="2" required></label>
      </div>`;
    return "";
  }

  const fmtDate = (v) => (v ? v.split("-").reverse().join("/") : "");

  function renderFicha(id) {
    const p = byId[id];
    const box = $("#ficha");
    if (!p) {
      box.innerHTML = `<a class="back" href="#explorar">← Volver a explorar</a><div class="empty">No encontramos ese prestador.</div>`;
      return;
    }
    document.title = `${p.nombre} · ${tipoLabel(p)} en ${LOCS[p.loc].nombre} | PEHUEMO`;
    const verb = p.cat === "alojamiento" ? "Solicitar reserva" : p.cat === "servicios" ? "Hacer una consulta" : "Consultar disponibilidad";

    box.innerHTML = `
      <a class="back" href="#explorar">← Volver a explorar</a>
      <div class="ficha">
        <div class="ficha__main">
          <div class="ficha__img">
            <img src="${p.img}" alt="Paisaje de ${LOCS[p.loc].nombre}">
            <button class="fav" type="button" data-id="${p.id}" aria-pressed="${isFav(p.id)}" aria-label="${isFav(p.id) ? "Quitar de" : "Guardar en"} Mi viaje">${heart(isFav(p.id))}</button>
          </div>
          <div class="ficha__meta">
            <span class="pill">${esc(tipoLabel(p))}</span>
            <span class="pill">${LOCS[p.loc].nombre}</span>
          </div>
          <h1>${esc(p.nombre)}</h1>
          ${p.descripcion ? `<p class="lead">${esc(p.descripcion)}</p>` : ""}
          ${contactBlock(p)}
          <p class="notice">Estamos completando esta ficha junto a ${esc(p.nombre)}: pronto vas a ver fotos propias, servicios, precios y ubicación exacta. Mientras tanto, podés enviar tu consulta.</p>
        </div>
        <aside class="ficha__side">
          <form class="form" id="booking-form">
            <h2>${verb}</h2>
            ${bookingFields(p)}
            <label class="field"><span>Tu nombre</span><input id="b-name" autocomplete="name" required></label>
            <label class="field"><span>Mensaje (opcional)</span><textarea id="b-msg" rows="3" placeholder="Contanos lo que necesites"></textarea></label>
            <button class="btn btn--wa" type="submit">Enviar por WhatsApp</button>
            <p class="plan__note">Sin pagos online: el pago se coordina directamente con el prestador.</p>
            <div class="form__out" id="booking-out" hidden></div>
          </form>
        </aside>
      </div>
      ${nearby(p.loc, p.id, p.cat, hash(p.id))}`;

    $("#booking-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = (sel) => ($(sel) ? $(sel).value.trim() : "");
      if (p.cat === "alojamiento" && v("#b-out") && v("#b-out") <= v("#b-in")) {
        showOut($("#booking-out"), null, "La fecha de salida tiene que ser posterior a la de llegada.");
        return;
      }
      const lines = [`Hola! Te escribo desde PEHUEMO por *${p.nombre}* (${LOCS[p.loc].nombre}).`];
      if (p.cat === "alojamiento") lines.push(`Fechas: del ${fmtDate(v("#b-in"))} al ${fmtDate(v("#b-out"))}`);
      else if (v("#b-in")) lines.push(`Fecha: ${fmtDate(v("#b-in"))}${v("#b-time") ? " a las " + v("#b-time") : ""}`);
      if (v("#b-people")) lines.push(`Personas: ${v("#b-people")}`);
      lines.push(`Nombre: ${v("#b-name")}`);
      if (v("#b-msg")) lines.push(v("#b-msg"));
      lines.push(p.cat === "alojamiento" ? "¿Tienen disponibilidad?" : "¿Me confirman disponibilidad?");
      showOut($("#booking-out"), lines.join("\n"), null, p.whatsapp || CONFIG.whatsapp);
    });
  }

  function contactBlock(p) {
    if (!p.telefono && !p.web && !p.oficial) return "";
    const tel = p.telefono ? p.telefono.replace(/[^0-9]/g, "") : "";
    return `
      <dl class="contact">
        ${p.oficial ? `<div><dt>Rubro</dt><dd>${esc(p.oficial)}</dd></div>` : ""}
        ${p.telefono ? `<div><dt>Teléfono</dt><dd><a href="tel:${tel}">${esc(p.telefono)}</a></dd></div>` : ""}
        ${p.web ? `<div><dt>Web o redes</dt><dd><a href="${esc(p.web)}" target="_blank" rel="noopener">${esc(p.web.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))}</a></dd></div>` : ""}
      </dl>
      <p class="source">Datos de contacto según la guía de la Municipalidad de Villa Pehuenia-Moquehue.</p>`;
  }

  // "Qué tenés cerca": lugares ordenados por distancia y otros prestadores de la zona.
  function nearby(loc, excludeId, cat, seed) {
    const center = LOCS[loc].coords;
    const places = PLACES.filter((pl) => pl.coords && pl.id !== excludeId)
      .map((pl) => [pl, km(center, pl.coords)])
      .sort((a, b) => a[1] - b[1]).slice(0, 4);
    const groups = [
      ["experiencia", "Qué hacer"], ["gastronomia", "Dónde comer"], ["alojamiento", "Dónde dormir"], ["servicios", "Dónde comprar"]
    ].filter(([c]) => c !== cat).map(([c, title]) => {
      const here = ITEMS.filter((x) => x.cat === c && x.loc === loc);
      const list = here.length ? here : ITEMS.filter((x) => x.cat === c);
      let picks = [0, 1, 2, 3, 4, 5].map((i) => pick(list, seed + i * 7)).filter((x, i, a) => x && a.indexOf(x) === i).slice(0, 4);
      if (picks.length > 1) picks = picks.slice(0, picks.length - (picks.length % 2)); // filas parejas
      return picks.length ? [title, picks] : null;
    }).filter(Boolean);
    return `
      <section class="related">
        <p class="eyebrow">Qué tenés cerca</p>
        <h2>Completá tu viaje en ${LOCS[loc].nombre}</h2>
        <h3 class="related__sub">Lugares para visitar</h3>
        <div class="places places--light">${places.map(([pl]) => placeCard(pl, center)).join("")}</div>
        ${groups.map(([title, list]) => `
          <h3 class="related__sub">${title}</h3>
          <div class="cards">${list.map(card).join("")}</div>`).join("")}
        <p class="source">Distancias aproximadas en línea recta desde el centro de ${LOCS[loc].nombre}.</p>
      </section>`;
  }

  // ---------- Lugar ----------
  function renderLugar(id) {
    const pl = placeById[id];
    const box = $("#lugar");
    if (!pl) {
      box.innerHTML = `<a class="back" href="#lugares">← Volver a lugares</a><div class="empty">No encontramos ese lugar.</div>`;
      return;
    }
    document.title = `${pl.nombre}, ${LOCS[pl.loc].nombre}: cómo llegar y qué hacer | PEHUEMO`;
    const mapsQuery = encodeURIComponent(`${pl.nombre}, ${LOCS[pl.loc].nombre}, Neuquén`);
    box.innerHTML = `
      <a class="back" href="#lugares">← Volver a lugares</a>
      <div class="ficha">
        <div class="ficha__main">
          <div class="ficha__img"><img src="${pl.img}" alt="${esc(pl.nombre)}"></div>
          <div class="ficha__meta">
            <span class="pill">${esc(pl.tipo)}</span>
            <span class="pill">${LOCS[pl.loc].nombre}</span>
          </div>
          <h1>${esc(pl.nombre)}</h1>
          <p class="lead">${esc(pl.texto)}</p>
          <p>${esc(pl.detalle)}</p>
        </div>
        <aside class="ficha__side">
          <div class="form">
            <h2>Datos útiles</h2>
            <dl class="contact">${pl.datos.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
            <a class="btn" href="https://www.google.com/maps/search/?api=1&query=${mapsQuery}" target="_blank" rel="noopener">Cómo llegar</a>
            <p class="source">Información de la guía de sitios de interés de la Municipalidad de Villa Pehuenia-Moquehue.</p>
          </div>
        </aside>
      </div>
      ${nearby(pl.loc, pl.id, "", hash(pl.id))}`;
  }

  function showOut(box, text, error, number) {
    box.hidden = false;
    if (error) { box.innerHTML = `<strong>${esc(error)}</strong>`; return; }
    const url = number
      ? `https://wa.me/${number}?text=${encodeURIComponent(text)}`
      : null;
    box.innerHTML = `
      ${url ? `<a class="btn btn--wa" href="${url}" target="_blank" rel="noopener">Abrir WhatsApp con el mensaje</a>`
            : `<strong>Tu mensaje está listo.</strong><span>Copialo y envialo por WhatsApp.</span>`}
      <pre id="out-text">${esc(text)}</pre>
      <button class="btn btn--sm btn--ghost" type="button" id="copy-btn">Copiar mensaje</button>`;
    $("#copy-btn", box).addEventListener("click", (ev) => {
      const btn = ev.currentTarget;
      const done = () => { btn.textContent = "Copiado"; };
      const fallback = () => {
        const r = document.createRange(); r.selectNodeContents($("#out-text", box));
        const s = getSelection(); s.removeAllRanges(); s.addRange(r);
        btn.textContent = "Seleccionado: copialo con Ctrl+C";
      };
      try { navigator.clipboard.writeText(text).then(done, fallback); } catch (err) { fallback(); }
    });
  }

  // ---------- Armá tu viaje ----------
  let planSeed = 0;
  function buildPlan() {
    const type = $('input[name="trip"]:checked').value;
    const t = TRIPS[type];
    const loc = $("#planner-loc").value;
    const nights = Math.max(1, Math.min(21, parseInt($("#planner-nights").value, 10) || 1));
    const seed = hash(type + loc) + planSeed;
    const inLoc = (cat, tipo) => ITEMS.filter((p) => p.cat === cat && p.loc === loc && (!tipo || p.tipo === tipo));
    const anyLoc = (cat, tipo) => ITEMS.filter((p) => p.cat === cat && (!tipo || p.tipo === tipo));

    const stay = pick(inLoc("alojamiento", t.alojamiento || "Cabañas"), seed);
    const exps = t.exp.map((tipo, i) => pick(inLoc("experiencia", tipo).length ? inLoc("experiencia", tipo) : anyLoc("experiencia", tipo), seed + i)).filter(Boolean);
    const restos = inLoc("gastronomia", "Restaurantes");
    const food = Array.from({ length: t.restos || 1 }, (_, i) => pick(restos, seed + i * 3)).filter((x, i, a) => x && a.indexOf(x) === i);
    if (t.cerveceria) { const c = pick(anyLoc("gastronomia", "Cervecerías"), seed); if (c) food.push(c); }
    const places = t.lugares.map((id) => placeById[id]).filter(Boolean);
    const chosen = [stay].concat(exps, food).filter(Boolean);

    const row = (kind, p) => `
      <li class="plan__item">
        <span class="plan__kind">${kind}</span>
        <span class="plan__name"><a href="${linkP(p)}">${esc(p.nombre)}</a><small>${esc(tipoLabel(p))} · ${LOCS[p.loc].nombre}</small></span>
        <button class="fav" type="button" data-id="${p.id}" aria-pressed="${isFav(p.id)}" style="position:static">${heart(isFav(p.id))}</button>
      </li>`;
    const plan = $("#plan");
    plan.hidden = false;
    plan.innerHTML = `
      <div class="plan__head">
        <div>
          <p class="plan__meta">${t.nombre.toUpperCase()} · ${nights} ${nights === 1 ? "NOCHE" : "NOCHES"} · ${LOCS[loc].nombre.toUpperCase()}</p>
          <h3>Tu viaje a ${LOCS[loc].nombre}</h3>
        </div>
        <div class="plan__actions">
          <button class="btn btn--sm btn--ghost" type="button" id="plan-again">Otra propuesta</button>
          <button class="btn btn--sm" type="button" id="plan-save">Guardar en Mi viaje</button>
        </div>
      </div>
      <ul class="plan__list">
        ${stay ? row(`Dormir · ${nights} ${nights === 1 ? "noche" : "noches"}`, stay) : ""}
        ${exps.map((p) => row("Hacer", p)).join("")}
        ${food.map((p) => row("Comer", p)).join("")}
        ${places.map((pl) => `
          <li class="plan__item">
            <span class="plan__kind">Visitar</span>
            <span class="plan__name"><a href="${linkL(pl)}">${esc(pl.nombre)}</a><small>${esc(pl.tipo)} · ${LOCS[pl.loc].nombre}</small></span>
            <span></span>
          </li>`).join("")}
      </ul>
      <p class="plan__note">Es una sugerencia armada con prestadores de la zona. Consultá disponibilidad con cada uno desde su ficha.</p>`;
    $("#plan-again").addEventListener("click", () => { planSeed += 1; buildPlan(); });
    $("#plan-save").addEventListener("click", (e) => {
      chosen.forEach((p) => { if (!isFav(p.id)) favs.push(p.id); });
      saveFavs();
      $$(".fav", plan).forEach((b) => setFavBtn(b, b.dataset.id));
      e.currentTarget.textContent = "Guardado en Mi viaje";
    });
  }
  $("#planner").addEventListener("submit", (e) => { e.preventDefault(); planSeed = 0; buildPlan(); });

  // ---------- Mi viaje ----------
  function renderTrip() {
    const box = $("#trip");
    const list = favs.map((id) => byId[id]).filter(Boolean);
    if (!list.length) {
      box.innerHTML = `<div class="empty">Todavía no guardaste nada. Empezá por <a href="#explorar">explorar</a> o <a href="#arma-tu-viaje">armá tu viaje</a>.</div>`;
      return;
    }
    const text = ["Mi viaje a Pehuenia y Moquehue (armado en PEHUEMO):"]
      .concat(list.map((p) => `• ${p.nombre} (${tipoLabel(p)}, ${LOCS[p.loc].nombre})`)).join("\n");
    box.innerHTML = `
      ${Object.entries(CATS).map(([k, c]) => {
        const items = list.filter((p) => p.cat === k);
        return items.length ? `<h3 style="margin:2rem 0 1rem">${c.nombre}</h3><div class="cards">${items.map(card).join("")}</div>` : "";
      }).join("")}
      <div class="trip__actions">
        <a class="btn btn--wa" href="https://wa.me/?text=${encodeURIComponent(text)}" target="_blank" rel="noopener">Compartir por WhatsApp</a>
        <button class="btn btn--ghost" type="button" id="trip-clear">Vaciar Mi viaje</button>
      </div>`;
    $("#trip-clear").addEventListener("click", (e) => {
      const b = e.currentTarget;
      if (b.dataset.confirm) { favs = []; saveFavs(); renderTrip(); return; }
      b.dataset.confirm = "1";
      b.textContent = "Tocá de nuevo para vaciar";
    });
  }

  // ---------- Sumate ----------
  $("#join-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = (s) => $(s).value.trim();
    const text = [
      "Hola PEHUEMO! Quiero sumar mi emprendimiento.",
      `Emprendimiento: ${v("#j-name")}`,
      `Rubro: ${v("#j-type")}`,
      `Localidad: ${v("#j-loc")}`,
      `Contacto: ${v("#j-contact")} · ${v("#j-phone")}`
    ].join("\n");
    showOut($("#join-out"), text, null, CONFIG.whatsapp);
  });

  // ---------- Router ----------
  let current = "";
  function show(view) {
    current = view;
    $$(".view").forEach((v) => { v.hidden = v.dataset.view !== view; });
    if (view === "inicio") initMap();
  }

  function route() {
    const h = decodeURIComponent(location.hash.slice(1)) || document.body.dataset.route || "inicio";
    $("#nav").classList.remove("is-open");
    $("#menu-btn").setAttribute("aria-expanded", "false");

    if (h.startsWith("explorar")) {
      const parts = h.split("-").slice(1);
      filters.cat = parts.find((x) => CATS[x]) || "";
      filters.loc = parts.find((x) => LOCS[x]) || "";
      filters.tipo = "";
      show("explorar");
      renderFilterChips();
      renderResults();
      window.scrollTo(0, 0);
    } else if (h.startsWith("p-")) {
      show("ficha");
      renderFicha(h.slice(2));
      window.scrollTo(0, 0);
    } else if (h.startsWith("l-")) {
      show("lugar");
      renderLugar(h.slice(2));
      window.scrollTo(0, 0);
    } else if (h === "mi-viaje") {
      show("mi-viaje"); renderTrip(); window.scrollTo(0, 0);
    } else if (h === "sumate") {
      show("sumate"); window.scrollTo(0, 0);
    } else {
      show("inicio");
      const target = document.getElementById(h);
      if (target && h !== "inicio") target.scrollIntoView();
      else window.scrollTo(0, 0);
    }
  }

  $("#menu-btn").addEventListener("click", (e) => {
    const open = $("#nav").classList.toggle("is-open");
    e.currentTarget.setAttribute("aria-expanded", open);
  });

  renderHome();
  saveFavs();
  window.addEventListener("hashchange", route);
  route();
})();
