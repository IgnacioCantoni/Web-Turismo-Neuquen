(function () {
  "use strict";

  const CONFIG = window.PEHUEMO_CONFIG;
  const LOCS = window.PEHUEMO_LOCALIDADES;
  const CATS = window.PEHUEMO_CATEGORIAS;
  const ITEMS = window.PEHUEMO_PRESTADORES;
  const PLACES = window.PEHUEMO_LUGARES;
  const TRIPS = window.PEHUEMO_VIAJES;
  const byId = Object.fromEntries(ITEMS.map((p) => [p.id, p]));

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const tipoSingular = { Cabañas: "Cabañas", Campings: "Camping", Restaurantes: "Restaurante", Supermercados: "Supermercado" };
  const tipoLabel = (p) => tipoSingular[p.tipo] || p.tipo;

  // ---------- Favoritos (Mi viaje) ----------
  const FAV_KEY = "pehuemo-mi-viaje";
  let favs = [];
  try { favs = JSON.parse(localStorage.getItem(FAV_KEY) || "[]").filter((id) => byId[id]); } catch (e) { favs = []; }
  const saveFavs = () => {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (e) { /* sin almacenamiento */ }
    $("#trip-count").textContent = favs.length;
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
    btn.textContent = on ? "♥" : "♡";
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
      <button class="fav" type="button" data-id="${p.id}" aria-pressed="${isFav(p.id)}" aria-label="${isFav(p.id) ? "Quitar de" : "Guardar en"} Mi viaje">${isFav(p.id) ? "♥" : "♡"}</button>
      <h3><a href="#p-${p.id}">${esc(p.nombre)}</a></h3>
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

    $("#places").innerHTML = PLACES.map((pl) => `
      <article class="place">
        <img src="${pl.img}" alt="${pl.nombre}" loading="lazy">
        <span class="place__loc">${LOCS[pl.loc].nombre}</span>
        <h3>${pl.nombre}</h3>
        <p>${pl.texto}</p>
      </article>`).join("");

    $("#planner-types").innerHTML = Object.entries(TRIPS).map(([key, t], i) => `
      <label class="chip"><input type="radio" name="trip" id="trip-${key}" value="${key}" ${i === 0 ? "checked" : ""}><span>${t.nombre}</span></label>`).join("");
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
    PLACES.forEach((pl) => {
      L.marker(pl.coords, { icon: icon("pin--place") }).addTo(map).bindPopup(`<strong>${pl.nombre}</strong><br>${pl.texto}`);
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
    const verb = p.cat === "alojamiento" ? "Solicitar reserva" : p.cat === "servicios" ? "Hacer una consulta" : "Consultar disponibilidad";
    const others = Object.keys(CATS).filter((c) => c !== p.cat && c !== "servicios");
    const related = others.map((c) => pick(ITEMS.filter((x) => x.cat === c && x.loc === p.loc).concat(
      ITEMS.filter((x) => x.cat === c && x.loc !== p.loc && !ITEMS.some((y) => y.cat === c && y.loc === p.loc))), hash(p.id + c))).filter(Boolean);

    box.innerHTML = `
      <a class="back" href="#explorar">← Volver a explorar</a>
      <div class="ficha">
        <div class="ficha__main">
          <div class="ficha__img">
            <img src="${p.img}" alt="Paisaje de ${LOCS[p.loc].nombre}">
            <button class="fav" type="button" data-id="${p.id}" aria-pressed="${isFav(p.id)}">${isFav(p.id) ? "♥" : "♡"}</button>
          </div>
          <div class="ficha__meta">
            <span class="pill">${esc(tipoLabel(p))}</span>
            <span class="pill">${LOCS[p.loc].nombre}</span>
          </div>
          <h1>${esc(p.nombre)}</h1>
          ${p.descripcion ? `<p>${esc(p.descripcion)}</p>` : `
          <p class="notice">Estamos armando esta ficha junto a ${esc(p.nombre)}. Pronto vas a ver fotos propias, servicios, precios y ubicación. Mientras tanto, podés enviar tu consulta y te ponemos en contacto.</p>`}
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
      ${related.length ? `
      <section class="related">
        <p class="eyebrow">Completá tu experiencia</p>
        <h2>Cerca de ${esc(p.nombre)}</h2>
        <div class="cards">${related.map(card).join("")}</div>
      </section>` : ""}`;

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
    const restos = inLoc("gastronomia");
    const food = Array.from({ length: t.restos || 1 }, (_, i) => pick(restos, seed + i * 3)).filter((x, i, a) => x && a.indexOf(x) === i);
    const places = PLACES.filter((pl) => t.lugares.includes(pl.nombre));
    const chosen = [stay].concat(exps, food).filter(Boolean);

    const row = (kind, p) => `
      <li class="plan__item">
        <span class="plan__kind">${kind}</span>
        <span class="plan__name"><a href="#p-${p.id}">${esc(p.nombre)}</a><small>${esc(tipoLabel(p))} · ${LOCS[p.loc].nombre}</small></span>
        <button class="fav" type="button" data-id="${p.id}" aria-pressed="${isFav(p.id)}" style="position:static">${isFav(p.id) ? "♥" : "♡"}</button>
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
          <button class="btn btn--sm" type="button" id="plan-save">Guardar todo en Mi viaje</button>
        </div>
      </div>
      <ul class="plan__list">
        ${stay ? row(`Dormir · ${nights} ${nights === 1 ? "noche" : "noches"}`, stay) : ""}
        ${exps.map((p) => row("Hacer", p)).join("")}
        ${food.map((p) => row("Comer", p)).join("")}
        ${places.map((pl) => `
          <li class="plan__item">
            <span class="plan__kind">Visitar</span>
            <span class="plan__name">${pl.nombre}<small>${LOCS[pl.loc].nombre}</small></span>
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
    const h = decodeURIComponent(location.hash.slice(1)) || "inicio";
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
