/*
 * Datos del sitio PEHUEMO.
 *
 * - Prestadores: listado entregado por la clienta (prestadores_de_servicio.pdf).
 *   Teléfonos, webs y rubro oficial tomados de la guía de la Municipalidad de
 *   Villa Pehuenia-Moquehue (villapehuenia.gob.ar, consultada en octubre de 2026).
 *   Conviene confirmarlos con cada prestador antes de publicar.
 * - Lugares, cómo llegar y temporadas: guía municipal y prensa regional.
 * - Coordenadas: aproximadas, sirven para el mapa y para calcular distancias.
 */

window.PEHUEMO_CONFIG = {
  // Número de WhatsApp central de PEHUEMO, en formato internacional sin "+" ni espacios.
  // Ejemplo: "5492942000000". Mientras esté vacío, los formularios muestran
  // el mensaje armado para copiarlo.
  whatsapp: "",
  email: "",
  instagram: "",
  // Dominio final del sitio (para Google). Ejemplo: "https://pehuemo.com.ar"
  sitio: ""
};

window.PEHUEMO_LOCALIDADES = {
  pehuenia: {
    nombre: "Villa Pehuenia",
    img: "assets/img/villa-pehuenia-aerea.webp",
    resumen:
      "Aldea de montaña a orillas del lago Aluminé, rodeada de bosques de araucarias. Tiene la mayor oferta de alojamiento y gastronomía de la zona, playas de arena fina en la Península de los Coihues y el volcán Batea Mahuida a pocos kilómetros.",
    datos: [
      ["Altura", "≈ 1.200 m s.n.m."],
      ["Desde Neuquén", "≈ 310 km"],
      ["Paso a Chile", "11 km (Icalma)"]
    ],
    coords: [-38.8797, -71.1872]
  },
  moquehue: {
    nombre: "Moquehue",
    img: "assets/img/lago-moquehue.webp",
    resumen:
      "Una aldea tranquila sobre el lago Moquehue, a 23 km de Villa Pehuenia. Cabañas entre el bosque, campings junto al agua, el arroyo Quillahue y la puerta de entrada al Circuito Pehuenia y al lago Ñorquinco.",
    datos: [
      ["Desde Villa Pehuenia", "23 km por RP 11"],
      ["Lago", "Moquehue · 21 km²"],
      ["Altura del lago", "1.090 m s.n.m."]
    ],
    coords: [-38.95, -71.33]
  }
};

window.PEHUEMO_CATEGORIAS = {
  alojamiento: {
    nombre: "Alojamientos",
    accion: "Encontrá dónde dormir y pedí tu reserva",
    img: "assets/img/araucaria-lago.webp"
  },
  experiencia: {
    nombre: "Experiencias",
    accion: "Elegí una actividad y consultá disponibilidad",
    img: "assets/img/kayak-playa.webp"
  },
  gastronomia: {
    nombre: "Gastronomía",
    accion: "Restaurantes, cafeterías y cervecerías",
    img: "assets/img/muelle-pehuenia.webp"
  },
  servicios: {
    nombre: "Supermercados",
    accion: "Proveedurías para abastecerte durante la estadía",
    img: "assets/img/playa-moquehue.webp"
  }
};

(function () {
  // [localidad, categoría, tipo, [ [nombre, {datos de la guía municipal}] ]]
  const listado = [
    // ---- MOQUEHUE ----
    ["moquehue", "alojamiento", "Cabañas", [
      ["Lo de Gallardo"], ["Natura"], ["Kellen"], ["Terrazas de Moquehue"], ["La Paz"],
      ["La Moquehuita"],
      ["Aliwen", { oficial: "Vivienda turística", telefono: "299 633-8127", web: "http://moquehuealiwwen.blogspot.com" }],
      ["Aime"],
      ["Cuncumen", { oficial: "Vivienda turística", telefono: "298 432-2609", web: "https://cabanacuncumen.negocio.site" }],
      ["Los Grillos"], ["Cuatro Araucarias"], ["Entre Cumbres"], ["Alicia"],
      ["Remanso del Quillahue"],
      ["Costa Quillahue", { oficial: "Cabañas", telefono: "2942 47-2453" }],
      ["Rincón de Paz"], ["LM Cabañas"]
    ]],
    ["moquehue", "alojamiento", "Campings", [
      ["La Bella Durmiente", { oficial: "Hostería", telefono: "2942 66-0993", web: "http://bdurmientemoquehue.com.ar" }],
      ["La Pradera"],
      ["El Verde", { oficial: "Camping municipal", telefono: "2942 69-6320", web: "https://www.instagram.com/camping.moquehue.elverde" }],
      ["Nahuelito"],
      ["Trenel", { oficial: "Camping de montaña", telefono: "2942 66-4720", web: "https://www.facebook.com/trenel.campingdemontana/" }]
    ]],
    ["moquehue", "gastronomia", "Restaurantes", [
      ["Melewe Resto", { oficial: "Restaurante", telefono: "299 504-7457" }],
      ["Ruca Che", { oficial: "Restaurante y parrilla", telefono: "299 457-2996" }],
      ["Astrolabius"],
      ["LM Aventura"]
    ]],
    ["moquehue", "gastronomia", "Cafeterías", [
      ["Los Pioneros", { oficial: "Confitería, bar y café", telefono: "299 587-8935", web: "https://www.instagram.com/lospionerosmoquehue" }],
      ["La Galesa Escondida", { oficial: "Cafetería y pastelería", telefono: "299 629-2673" }]
    ]],
    ["moquehue", "experiencia", "Canopy", [
      ["Canopy Trenel", { telefono: "2942 66-4720", web: "https://www.facebook.com/trenel.campingdemontana/", extra: "En la guía municipal, Trenel figura también con senderismo y mountain bike." }]
    ]],
    ["moquehue", "experiencia", "Kayak", [
      ["Kayak Mawida", { oficial: "Kayak y canoas", telefono: "299 326-6379", web: "http://www.mawida.ar" }]
    ]],
    ["moquehue", "experiencia", "Cabalgatas", [
      ["Hípico Cordillera", { oficial: "Cabalgatas", telefono: "11 3022-4041", web: "https://www.facebook.com/Hipico-Cordillera-101163314695897/" }]
    ]],
    ["moquehue", "servicios", "Supermercados", [
      ["La Montaña"], ["El Piñonero"], ["Autoservicio Moquehue"]
    ]],
    // ---- VILLA PEHUENIA ----
    ["pehuenia", "alojamiento", "Cabañas", [
      ["La Casa de Hunter"], ["Tamara"], ["La Esmeralda"], ["Refugio del Lago"],
      ["Peumayen", { oficial: "Vivienda turística (Peumayen El Chalet)", telefono: "299 508-1462", web: "https://www.facebook.com/cabana.villapehuenia" }],
      ["Postal del Lago"], ["Reflejo del Sol"], ["Betty"],
      ["Complejo Patagonia", { oficial: "Cabañas", telefono: "2942 54-8787", web: "http://complejopatagonia.com.ar" }],
      ["Bahía Radal", { oficial: "Cabañas", telefono: "2942 57-3731", web: "http://bahiaradal.com.ar" }]
    ]],
    ["pehuenia", "alojamiento", "Campings", [
      ["Lagrimitas", { oficial: "Camping y dormis", telefono: "2942 66-5441" }],
      ["Camping Villa Pehuenia"], ["Reverdecer"],
      ["El Puente", { oficial: "Camping", telefono: "2942 36-2882" }],
      ["Mario"], ["Camping Peumayen"]
    ]],
    ["pehuenia", "gastronomia", "Restaurantes", [
      ["Alfonsina", { oficial: "Restaurante", telefono: "2942 33-7742", web: "https://www.facebook.com/profile.php?id=734265240257704" }],
      ["Parador del Lago", { oficial: "Restaurante", telefono: "2942 65-0361", web: "https://www.instagram.com/paradordellagopehuenia" }],
      ["Borravino", { oficial: "Restaurante", telefono: "2942 59-8701", web: "https://www.facebook.com/borravinowine/" }],
      ["Maddy Te", { oficial: "Restaurante y casa de té", telefono: "11 6888-6659", web: "https://www.instagram.com/maddyteyresto_" }],
      ["La Familia", { oficial: "Restaurante", telefono: "2942 36-1699", web: "https://www.instagram.com/lafamiliavpa/" }],
      ["Mandra", { oficial: "Restaurante y bar", telefono: "02942 49-8105", web: "https://www.facebook.com/mandrapehuenia/" }]
    ]],
    ["pehuenia", "gastronomia", "Cafeterías", [
      ["Skal", { oficial: "Confitería, bar y café", telefono: "2942 41-2858" }]
    ]],
    ["pehuenia", "gastronomia", "Cervecerías", [
      ["Drumlin", { oficial: "Cervecería artesanal", telefono: "299 510-3928", web: "https://www.facebook.com/drumlinbrewpub" }],
      ["Magma", { oficial: "Cerveza artesanal y degustación", telefono: "2942 40-1809", web: "https://www.facebook.com/Magma-109860510427595/" }]
    ]]
  ];

  const fotoPorTipo = {
    Cabañas: ["assets/img/araucaria-lago.webp", "assets/img/lago-alumine.webp", "assets/img/lago-moquehue.webp"],
    Campings: ["assets/img/playa-moquehue.webp", "assets/img/kayak-playa.webp"],
    Restaurantes: ["assets/img/muelle-pehuenia.webp", "assets/img/villa-pehuenia-aerea.webp"],
    Cafeterías: ["assets/img/muelle-pehuenia.webp"],
    Cervecerías: ["assets/img/villa-pehuenia-aerea.webp"],
    Canopy: ["assets/img/canopy.webp"],
    Kayak: ["assets/img/kayak-playa.webp"],
    Cabalgatas: ["assets/img/volcan-batea-mahuida.webp"],
    Supermercados: ["assets/img/villa-pehuenia-aerea.webp"]
  };

  const descripcion = {
    "moquehue|Cabañas": "Cabañas en Moquehue, la aldea de montaña sobre el lago Moquehue, entre bosques de araucarias, coihues y lengas. Una base tranquila para kayak, pesca, el arroyo Quillahue y el Circuito Pehuenia.",
    "pehuenia|Cabañas": "Cabañas en Villa Pehuenia, sobre el lago Aluminé. Cerca del centro, de la Península de los Coihues y sus playas, y a pocos kilómetros de La Angostura y del volcán Batea Mahuida.",
    "moquehue|Campings": "Camping en Moquehue, para dormir entre el bosque y cerca del lago. Ideal para familias y para quienes buscan contacto directo con la naturaleza.",
    "pehuenia|Campings": "Camping en Villa Pehuenia, a orillas del lago Aluminé y su bosque de araucarias. Cerca de las playas y de los servicios del centro.",
    "moquehue|Restaurantes": "Para comer en Moquehue después de un día de lago, bosque o cabalgata.",
    "pehuenia|Restaurantes": "Para comer en Villa Pehuenia, conocida como capital de la gastronomía neuquina.",
    "moquehue|Cafeterías": "Para un café, algo dulce o una merienda en Moquehue.",
    "pehuenia|Cafeterías": "Para un café, una merienda o un trago en Villa Pehuenia.",
    "pehuenia|Cervecerías": "Cerveza artesanal en Villa Pehuenia, para probar la producción local.",
    "moquehue|Canopy": "Tirolesas en el bosque de Moquehue, con vista al lago. Una actividad de aventura para hacer en familia o con amigos.",
    "moquehue|Kayak": "Salidas en kayak y canoa por las aguas calmas del lago Moquehue, con playas y bosque hasta la orilla.",
    "moquehue|Cabalgatas": "Cabalgatas por la cordillera, entre bosques de araucarias, mallines y vistas a los lagos.",
    "moquehue|Supermercados": "Proveeduría en Moquehue para abastecerte durante la estadía."
  };

  const slug = (s) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const prestadores = [];
  listado.forEach(([loc, cat, tipo, items]) => {
    items.forEach(([nombre, guia = {}], i) => {
      const fotos = fotoPorTipo[tipo];
      prestadores.push({
        id: slug(loc + "-" + nombre),
        nombre,
        loc,
        cat,
        tipo,
        img: fotos[i % fotos.length],
        descripcion: [descripcion[loc + "|" + tipo], guia.extra].filter(Boolean).join(" "),
        oficial: guia.oficial || "",
        telefono: guia.telefono || "",
        web: guia.web || "",
        // Campos a completar por cada prestador:
        whatsapp: "",
        servicios: [],
        direccion: "",
        precio: ""
      });
    });
  });

  window.PEHUEMO_PRESTADORES = prestadores;
  window.PEHUEMO_SLUG = slug;
})();

// Lugares para visitar. Fuente: guía de sitios de la Municipalidad de Villa Pehuenia-Moquehue.
// Coordenadas aproximadas.
window.PEHUEMO_LUGARES = [
  {
    id: "lago-alumine", nombre: "Lago Aluminé", tipo: "Lagos y playas", loc: "pehuenia",
    img: "assets/img/lago-alumine.webp", coords: [-38.875, -71.13],
    texto: "57 km² de agua de deshielo, playas de arena fina e islotes frente a Villa Pehuenia.",
    detalle: "Su nombre viene del mapudungun y significa \"olla reluciente\" o \"que brilla en el fondo\". Sus aguas nacen del deshielo de las montañas y en verano la superficie llega a unos 19 a 21 °C, buena para nadar. Se puede navegar a vela, en lancha, kayak, canoa o bote a pedal, pescar desde la costa o embarcado y recorrer sus islas. Sobre la costa norte está el Muelle Turístico, con propuestas gastronómicas y culturales.",
    datos: [["Superficie", "57 km²"], ["Agua en verano", "19–21 °C"], ["Ideal para", "Nadar, navegar, pescar"]]
  },
  {
    id: "peninsula-de-los-coihues", nombre: "Península de los Coihues", tipo: "Paseos", loc: "pehuenia",
    img: "assets/img/araucaria-lago.webp", coords: [-38.895, -71.165],
    texto: "Un paseo de 3,5 km que se adentra en el lago Aluminé, con playas, lagunas y bosque de coihues y ñires.",
    detalle: "La península se extiende 3,5 km desde el centro comercial de Villa Pehuenia hacia el lago. Se recorre a pie o en bicicleta durante todo el año, con paradas en distintas playas, como Radal Có, y en el Mirador del Ciprés. En otoño se tiñe de ocres y rojos; en invierno, de nieve.",
    datos: [["Largo", "3,5 km"], ["Cómo", "A pie o en bici"], ["Temporada", "Todo el año"]]
  },
  {
    id: "mirador-del-cipres", nombre: "Mirador del Ciprés", tipo: "Miradores", loc: "pehuenia",
    img: "assets/img/villa-pehuenia-aerea.webp", coords: [-38.888, -71.175],
    texto: "El punto más alto de la península: vista de 360° al lago Aluminé, la cordillera y los volcanes.",
    detalle: "Está a 1 km del centro comercial, siguiendo la calle Los Coihues hasta el cartel de acceso. El último tramo es en subida. Desde arriba se ven el lago Aluminé, el nacimiento del río, el puente de La Angostura, el lago Moquehue, bosques de araucarias y volcanes. Lleva el nombre del ciprés de la cordillera, especie nativa.",
    datos: [["Desde el centro", "1 km"], ["Acceso", "A pie o en vehículo"], ["Dificultad", "Subida corta"]]
  },
  {
    id: "playas-radal-co", nombre: "Playas Radal Có", tipo: "Lagos y playas", loc: "pehuenia",
    img: "assets/img/lago-alumine.webp", coords: [-38.9, -71.155],
    texto: "Playas de arena blanca escondidas en el bosque, donde la península se angosta y las dos costas casi se tocan.",
    detalle: "Radal Có está en un sector angosto de la Península de los Coihues que forma un istmo. Es uno de los lugares preferidos para pasar el día de playa en verano, con agua clara y bosque nativo alrededor.",
    datos: [["Dónde", "Península de los Coihues"], ["Ideal para", "Día de playa"], ["Temporada", "Verano"]]
  },
  {
    id: "laguna-pollo-lafquen", nombre: "Laguna Pollo Lafquen", tipo: "Paseos", loc: "pehuenia",
    img: "assets/img/playa-moquehue.webp", coords: [-38.891, -71.1851],
    texto: "Reserva natural urbana a 500 m del centro, para caminar, tomar mate y ver aves.",
    detalle: "Es una reserva natural urbana creada por ordenanza municipal en 2010, de casi 35 hectáreas. Tiene sendero costero y mirador. Se ven macás, biguás y coipos. Su nombre en mapudungun se refiere al pato que habita la laguna (pollol) y a \"lafquen\", lago o laguna.",
    datos: [["Desde el centro", "500 m"], ["Superficie", "34,8 ha"], ["Temporada", "Todo el año"]]
  },
  {
    id: "la-angostura", nombre: "Puente y playa La Angostura", tipo: "Lagos y playas", loc: "pehuenia",
    img: "assets/img/araucaria-lago.webp", coords: [-38.905, -71.225],
    texto: "Un río de apenas 500 m une los lagos Aluminé y Moquehue. Playas de arena blanca y bosque nativo.",
    detalle: "Está a 4 km del centro cívico. Un puente de 50 m cruza el río La Angostura, uno de los más cortos del país. A los costados hay playas de arena blanca entre araucarias, lengas y coihues, ideales para pesca, kayak y canotaje. Desde aquí sale el camino a Cinco Lagunas.",
    datos: [["Desde el centro", "4 km"], ["Largo del río", "500 m"], ["Ideal para", "Playa, kayak, pesca"]]
  },
  {
    id: "cinco-lagunas", nombre: "Circuito Cinco Lagunas", tipo: "Senderos y trekking", loc: "pehuenia",
    img: "assets/img/volcan-batea-mahuida.webp", coords: [-38.925, -71.215],
    texto: "Cinco lagunas de altura en territorio de la Comunidad Mapuche Puel, a pie, en bici o en vehículo.",
    detalle: "Se cruza el puente de La Angostura y a unos 4 km está el ingreso de la Comunidad Mapuche Puel, donde se paga la entrada y se entrega un mapa del territorio. El circuito pasa por las lagunas Verde, Matethue (la más grande), Cohiuilla, Ralihuen y Redonda. En el camino, integrantes de la comunidad ofrecen comidas típicas y artesanías.",
    datos: [["Inicio", "≈ 3 km del centro"], ["Acceso", "Con entrada, Comunidad Puel"], ["Cómo", "A pie, bici o vehículo"]]
  },
  {
    id: "volcan-batea-mahuida", nombre: "Volcán Batea Mahuida", tipo: "Miradores", loc: "pehuenia",
    img: "assets/img/volcan-batea-mahuida.webp", coords: [-38.94, -71.24],
    texto: "Volcán de 2.000 m con laguna en el cráter. En invierno, parque de nieve de la Comunidad Mapuche Puel.",
    detalle: "Está a mitad de camino entre Villa Pehuenia y Moquehue. Se sube varios kilómetros en vehículo hasta la base del parque de nieve, que en invierno ofrece esquí, snowboard y caminatas con raquetas. En verano se puede caminar hasta la laguna del cráter y la cumbre, una caminata exigente. El acceso lo administra la Comunidad Mapuche Puel, que cobra la entrada y entrega mapas.",
    datos: [["Altura", "≈ 2.000 m"], ["Invierno", "Parque de nieve"], ["Verano", "Trekking al cráter"]]
  },
  {
    id: "mirador-de-las-antenas", nombre: "Mirador de las Antenas", tipo: "Miradores", loc: "pehuenia",
    img: "assets/img/villa-pehuenia-aerea.webp", coords: [-38.932, -71.22],
    texto: "La mejor vista de la zona: los dos lagos, Cinco Lagunas y los volcanes Llaima, Villarrica y Lanín.",
    detalle: "Está en tierras de la Comunidad Mapuche Puel, en la ladera del Batea Mahuida, a unos 5 km por el camino principal hasta el cartel de ingreso. Hay que avisar y pagar la entrada a la comunidad. El camino es apto para cualquier vehículo y cruza arroyos, bosques de lengas y araucarias. Desde arriba se ven los lagos Aluminé y Moquehue, La Angostura, las Cinco Lagunas y los volcanes Llaima, Villarrica y Lanín.",
    datos: [["Distancia", "≈ 5 km"], ["Acceso", "Cualquier vehículo"], ["Se ve", "Llaima, Villarrica, Lanín"]]
  },
  {
    id: "paso-del-arco", nombre: "Paso del Arco", tipo: "Circuitos", loc: "pehuenia",
    img: "assets/img/araucaria-lago.webp", coords: [-38.79, -71.17],
    texto: "Un paseo de 50 km entre araucarias milenarias, lagunas y mallines hasta el límite con Chile.",
    detalle: "Se accede por RP 13 recorriendo 12 km al norte del centro cívico. El camino sube desde unos 1.400 m entre bosques de araucarias antiguas, puestos de veranada, lagunas detrás del Batea Mahuida y mallines, con vistas a Villa Pehuenia, Moquehue y los volcanes de Chile. Termina en un puesto de Gendarmería en el hito fronterizo, el punto más alto.",
    datos: [["Recorrido", "50 km en total"], ["Inicio", "12 km al norte"], ["Mejor época", "Primavera y verano"]]
  },
  {
    id: "paso-icalma", nombre: "Paso Icalma", tipo: "Circuitos", loc: "pehuenia",
    img: "assets/img/lago-alumine.webp", coords: [-38.86, -71.29],
    texto: "Paso internacional a Chile a 11 km de Villa Pehuenia, hacia la Araucanía y el poblado de Icalma.",
    detalle: "Está a 1.260 m s.n.m. y se llega por RP 13 bordeando el lago Aluminé. Del lado chileno, la ruta S-61 lleva a Icalma. Funciona todo el año, en general de 8 a 19 h, salvo cuando el clima obliga a cerrarlo en invierno. Solo pueden cruzar vehículos particulares, no colectivos ni camiones.",
    datos: [["Distancia", "11 km"], ["Altura", "1.260 m"], ["Horario", "En general 8 a 19 h"]]
  },
  {
    id: "lago-moquehue", nombre: "Lago Moquehue", tipo: "Lagos y playas", loc: "moquehue",
    img: "assets/img/lago-moquehue.webp", coords: [-38.94, -71.29],
    texto: "21 km² a 1.090 m, con playas de arena volcánica y la isla Lepen. Ideal para kayak y pesca.",
    detalle: "Frente a la aldea se ve el cordón de la Bella Durmiente, formado por los cerros Chenque Co, Colorado y Bella Durmiente. El lago tiene una sola isla, Lepen, nombrada por un colono francés de principios del siglo XX. Se practica kayak, navegación, windsurf, buceo y pesca con trolling, spinning y mosca, rodeados de bosques de pehuén, coihue y lenga.",
    datos: [["Superficie", "21 km²"], ["Altura", "1.090 m"], ["Ideal para", "Kayak, pesca, buceo"]]
  },
  {
    id: "arroyo-quillahue", nombre: "Arroyo y desembocadura Quillahue", tipo: "Senderos y trekking", loc: "moquehue",
    img: "assets/img/playa-moquehue.webp", coords: [-38.96, -71.35],
    texto: "Un río de montaña que cruza el corazón de Moquehue y desemboca en playas de arena blanca.",
    detalle: "La desembocadura está a 3 km de la oficina de informes de Moquehue y se llega caminando o en cualquier vehículo mediano. El arroyo baja de la cordillera por un valle de araucarias, lengas, coihues y ñires. Su nombre en mapudungun significa \"arroyo que se cruza a pie\". Se puede pescar, hacer kayak y caminar por la orilla.",
    datos: [["Desde la aldea", "3 km"], ["Acceso", "A pie o en vehículo"], ["Ideal para", "Caminar, pescar"]]
  },
  {
    id: "circuito-pehuenia", nombre: "Circuito Pehuenia", tipo: "Circuitos", loc: "moquehue",
    img: "assets/img/kayak-playa.webp", coords: null,
    texto: "Un día completo de ruta: 120 km por cinco lagos, ríos y el Parque Nacional Lanín.",
    detalle: "Sale desde Moquehue por RP 11 y vuelve en parte por RP 23. Pasa por los lagos Moquehue, Nompehuen, Ñorquinco, Pulmarí y Aluminé, los ríos Pulmarí, Aluminé y Litrán, el paraje Lonco Luan (con comida y artesanías de la comunidad mapuche) y la casa del guardaparque del Parque Nacional Lanín, con área de picnic.",
    datos: [["Recorrido", "≈ 120 km"], ["Duración", "Día completo"], ["Rutas", "RP 11 y RP 23"]]
  },
  {
    id: "lago-norquinco", nombre: "Lago Ñorquinco", tipo: "Lagos y playas", loc: "moquehue",
    img: "assets/img/kayak-playa.webp", coords: [-39.14, -71.27],
    texto: "En la entrada norte del Parque Nacional Lanín, a 52 km de Villa Pehuenia. Campings, pesca y trekking.",
    detalle: "Se llega pasando por Moquehue, bordeando los lagos Aluminé y Moquehue. Tiene 5,3 km² de aguas cristalinas de deshielo. En la costa hay campings organizados. Se practica pesca deportiva, trekking, mountain bike y observación de aves. Su nombre en mapudungun hace referencia al apio silvestre.",
    datos: [["Desde Villa Pehuenia", "52 km"], ["Superficie", "5,3 km²"], ["Parque", "Nacional Lanín"]]
  },
  {
    id: "lago-nompehuen", nombre: "Lago Nompehuen", tipo: "Lagos y playas", loc: "moquehue",
    img: "assets/img/lago-moquehue.webp", coords: [-39.12, -71.3],
    texto: "Lago de aguas transparentes a metros del Ñorquinco, en el Circuito Pehuenia.",
    detalle: "Está a 51 km de Villa Pehuenia. Su nombre en mapudungun significa \"pino vano\", como llamaban a las araucarias que no dan piñones. Se puede pescar, cabalgar, hacer kayak, mountain bike y caminar entre pehuenes, coihues, lengas, ñires y cipreses.",
    datos: [["Desde Villa Pehuenia", "51 km"], ["Ideal para", "Pesca, kayak"], ["Circuito", "Pehuenia"]]
  }
];

// Tipos de viaje para "Armá tu viaje". Los lugares se indican por id.
window.PEHUEMO_VIAJES = {
  naturaleza: { nombre: "Naturaleza", exp: ["Kayak", "Cabalgatas"], lugares: ["cinco-lagunas", "laguna-pollo-lafquen", "lago-norquinco"] },
  aventura: { nombre: "Aventura", exp: ["Canopy", "Kayak"], lugares: ["volcan-batea-mahuida", "paso-del-arco"] },
  familia: { nombre: "En familia", exp: ["Cabalgatas", "Canopy"], lugares: ["peninsula-de-los-coihues", "la-angostura"], alojamiento: "Campings" },
  pareja: { nombre: "En pareja", exp: ["Kayak"], lugares: ["mirador-del-cipres", "mirador-de-las-antenas"], alojamiento: "Cabañas" },
  lago: { nombre: "Lago y playa", exp: ["Kayak"], lugares: ["playas-radal-co", "la-angostura", "arroyo-quillahue"] },
  trekking: { nombre: "Trekking", exp: ["Cabalgatas"], lugares: ["cinco-lagunas", "volcan-batea-mahuida", "arroyo-quillahue"] },
  pesca: { nombre: "Pesca", exp: ["Kayak"], lugares: ["lago-moquehue", "arroyo-quillahue", "lago-norquinco"] },
  gastronomia: { nombre: "Gastronomía", exp: ["Cabalgatas"], lugares: ["peninsula-de-los-coihues", "lago-alumine"], restos: 2, cerveceria: true }
};

// Información útil. Fuente: guía municipal (cómo llegar, temporadas).
window.PEHUEMO_INFO = {
  llegar: [
    ["Por RP 13 (Primeros Pinos)", "120 km desde Zapala, 55 km de ripio. Es el camino más corto."],
    ["Por RP 23 (Pino Hachado)", "155 km desde Zapala, 35 km de ripio."],
    ["Por RP 46 (Rahue) y Aluminé", "210 km desde Zapala, 50 km de ripio, pasando por el Parque Nacional Laguna Blanca."]
  ],
  distancias: [
    ["Neuquén", "304 km"], ["Zapala", "118 km"], ["San Martín de los Andes", "208 km"], ["Bariloche", "474 km"], ["Temuco (Chile)", "140 km"]
  ],
  temporadas: [
    ["Verano", "Lagos templados, playas de arena, kayak, navegación, trekking y la Fiesta Provincial del Lago y las Araucarias en enero, por el aniversario de la villa."],
    ["Otoño", "La época más cambiante: el bosque se tiñe de ocres, rojos y dorados. Ideal para recorrer tranquilo y fotografiar."],
    ["Invierno", "Nieve entre bosques de pehuenes. Parque de nieve Batea Mahuida con esquí, snowboard, raquetas y motos de nieve. Cadenas obligatorias en la ruta."],
    ["Primavera", "Vuelven las flores y las aves, y bajan los arroyos de deshielo. Buena época para el Paso del Arco."]
  ]
};
