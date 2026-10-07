/*
 * Datos del sitio PEHUEMO.
 * Los prestadores salen del listado entregado por la clienta (prestadores_de_servicio.pdf).
 * Descripción, fotos, servicios, precios y WhatsApp de cada uno se completan
 * a medida que cada prestador envíe su información.
 */

window.PEHUEMO_CONFIG = {
  // Número de WhatsApp central de PEHUEMO, en formato internacional sin "+" ni espacios.
  // Ejemplo: "5492942000000". Mientras esté vacío, el formulario de reserva muestra
  // el mensaje armado para copiarlo.
  whatsapp: "",
  email: "",
  instagram: ""
};

window.PEHUEMO_LOCALIDADES = {
  pehuenia: {
    nombre: "Villa Pehuenia",
    img: "assets/img/villa-pehuenia-aerea.webp",
    resumen:
      "A orillas del lago Aluminé, entre bosques de araucarias. Playas, penínsulas, el volcán Batea Mahuida y la mayor oferta de alojamiento y gastronomía de la zona.",
    datos: [
      ["Altura", "≈ 1.200 m s.n.m."],
      ["Lago", "Aluminé"],
      ["Acceso", "RP 13 desde Zapala"]
    ],
    coords: [-38.882, -71.170]
  },
  moquehue: {
    nombre: "Moquehue",
    img: "assets/img/lago-moquehue.webp",
    resumen:
      "Una aldea de montaña tranquila sobre el lago Moquehue. Cabañas entre el bosque, campings a la orilla del agua, cabalgatas, kayak y canopy.",
    datos: [
      ["Distancia", "≈ 20 km de Villa Pehuenia"],
      ["Lago", "Moquehue"],
      ["Acceso", "RP 11 por La Angostura"]
    ],
    coords: [-38.944, -71.326]
  }
};

window.PEHUEMO_CATEGORIAS = {
  alojamiento: {
    nombre: "Alojamientos",
    accion: "Encontrá dónde dormir y pedí tu reserva",
    img: "assets/img/araucaria-lago.webp",
    tipos: ["Cabañas", "Campings"]
  },
  experiencia: {
    nombre: "Experiencias",
    accion: "Elegí una actividad y consultá disponibilidad",
    img: "assets/img/kayak-playa.webp",
    tipos: ["Canopy", "Kayak", "Cabalgatas"]
  },
  gastronomia: {
    nombre: "Gastronomía",
    accion: "Conocé dónde comer y consultá por mesa",
    img: "assets/img/muelle-pehuenia.webp",
    tipos: ["Restaurantes"]
  },
  servicios: {
    nombre: "Supermercados",
    accion: "Proveedurías para abastecerte durante la estadía",
    img: "assets/img/playa-moquehue.webp",
    tipos: ["Supermercados"]
  }
};

(function () {
  const listado = [
    // ---- MOQUEHUE ----
    ["moquehue", "alojamiento", "Cabañas", [
      "Lo de Gallardo", "Natura", "Kellen", "Terrazas de Moquehue", "La Paz",
      "La Moquehuita", "Aliwen", "Aime", "Cuncumen", "Los Grillos",
      "Cuatro Araucarias", "Entre Cumbres", "Alicia", "Remanso del Quillahue",
      "Costa Quillahue", "Rincón de Paz", "LM Cabañas"
    ]],
    ["moquehue", "alojamiento", "Campings", [
      "La Bella Durmiente", "La Pradera", "El Verde", "Nahuelito", "Trenel"
    ]],
    ["moquehue", "gastronomia", "Restaurantes", [
      "Melewe Resto", "Los Pioneros", "Ruca Che", "Astrolabius",
      "La Galesa Escondida", "LM Aventura"
    ]],
    ["moquehue", "experiencia", "Canopy", ["Canopy Trenel"]],
    ["moquehue", "experiencia", "Kayak", ["Kayak Mawida"]],
    ["moquehue", "experiencia", "Cabalgatas", ["Cabalgatas Hípico"]],
    ["moquehue", "servicios", "Supermercados", [
      "La Montaña", "El Piñonero", "Autoservicio Moquehue"
    ]],
    // ---- VILLA PEHUENIA ----
    ["pehuenia", "alojamiento", "Cabañas", [
      "La Casa de Hunter", "Tamara", "La Esmeralda", "Refugio del Lago",
      "Peumayen", "Postal del Lago", "Reflejo del Sol", "Betty",
      "Complejo Patagonia", "Bahía Radal"
    ]],
    ["pehuenia", "alojamiento", "Campings", [
      "Lagrimitas", "Camping Villa Pehuenia", "Reverdecer", "El Puente",
      "Mario", "Camping Peumayen"
    ]],
    ["pehuenia", "gastronomia", "Restaurantes", [
      "Alfonsina", "Parador del Lago", "Skal", "Borravino", "Maddy Te",
      "Drumlin", "La Familia", "Magma", "Mandra"
    ]]
  ];

  const fotoPorTipo = {
    Cabañas: ["assets/img/araucaria-lago.webp", "assets/img/lago-alumine.webp", "assets/img/lago-moquehue.webp"],
    Campings: ["assets/img/playa-moquehue.webp", "assets/img/kayak-playa.webp"],
    Restaurantes: ["assets/img/muelle-pehuenia.webp", "assets/img/villa-pehuenia-aerea.webp"],
    Canopy: ["assets/img/canopy.webp"],
    Kayak: ["assets/img/kayak-playa.webp"],
    Cabalgatas: ["assets/img/volcan-batea-mahuida.webp"],
    Supermercados: ["assets/img/villa-pehuenia-aerea.webp"]
  };

  const slug = (s) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const prestadores = [];
  listado.forEach(([loc, cat, tipo, nombres]) => {
    nombres.forEach((nombre, i) => {
      const fotos = fotoPorTipo[tipo];
      prestadores.push({
        id: slug(loc + "-" + nombre),
        nombre,
        loc,
        cat,
        tipo,
        img: fotos[i % fotos.length],
        // Campos a completar por cada prestador:
        descripcion: "",
        servicios: [],
        whatsapp: "",
        direccion: "",
        precio: ""
      });
    });
  });

  window.PEHUEMO_PRESTADORES = prestadores;
})();

// Lugares para visitar. Las coordenadas son aproximadas.
window.PEHUEMO_LUGARES = [
  {
    nombre: "Lago Aluminé",
    loc: "pehuenia",
    img: "assets/img/lago-alumine.webp",
    texto: "El lago de Villa Pehuenia: playas de arena, islotes y agua turquesa rodeada de araucarias.",
    coords: [-38.905, -71.135]
  },
  {
    nombre: "Volcán Batea Mahuida",
    loc: "pehuenia",
    img: "assets/img/volcan-batea-mahuida.webp",
    texto: "Volcán con laguna en el cráter y vista a varios volcanes de Chile. En invierno funciona como parque de nieve.",
    coords: [-38.835, -71.130]
  },
  {
    nombre: "La Angostura",
    loc: "pehuenia",
    img: "assets/img/araucaria-lago.webp",
    texto: "El paso angosto que une los lagos Aluminé y Moquehue, en el camino entre las dos villas.",
    coords: [-38.912, -71.252]
  },
  {
    nombre: "Lago Moquehue",
    loc: "moquehue",
    img: "assets/img/lago-moquehue.webp",
    texto: "Aguas calmas, playas con bosque hasta la orilla y lugar ideal para kayak y pesca.",
    coords: [-38.955, -71.300]
  },
  {
    nombre: "Playas de Moquehue",
    loc: "moquehue",
    img: "assets/img/playa-moquehue.webp",
    texto: "Costas de arena entre coihues y araucarias, con campings a pocos metros del agua.",
    coords: [-38.940, -71.335]
  },
  {
    nombre: "Lago Ñorquinco",
    loc: "moquehue",
    img: "assets/img/kayak-playa.webp",
    texto: "Al sur de Moquehue, dentro del Parque Nacional Lanín. Un lago de montaña para pasar el día.",
    coords: [-39.140, -71.270]
  }
];

// Tipos de viaje para "Armá tu viaje".
window.PEHUEMO_VIAJES = {
  naturaleza: { nombre: "Naturaleza", exp: ["Kayak", "Cabalgatas"], lugares: ["Volcán Batea Mahuida", "Lago Ñorquinco"] },
  aventura: { nombre: "Aventura", exp: ["Canopy", "Kayak"], lugares: ["Volcán Batea Mahuida", "La Angostura"] },
  familia: { nombre: "En familia", exp: ["Cabalgatas", "Canopy"], lugares: ["Playas de Moquehue", "Lago Aluminé"], alojamiento: "Campings" },
  pareja: { nombre: "En pareja", exp: ["Kayak"], lugares: ["Lago Moquehue", "La Angostura"], alojamiento: "Cabañas" },
  lago: { nombre: "Lago y playa", exp: ["Kayak"], lugares: ["Lago Aluminé", "Playas de Moquehue"] },
  gastronomia: { nombre: "Gastronomía", exp: ["Cabalgatas"], lugares: ["Lago Aluminé", "Lago Moquehue"], restos: 2 }
};
