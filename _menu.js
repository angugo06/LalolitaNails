/* Genera el menú de servicios (HTML ES/EN) y el OfferCatalog desde una sola
   fuente de datos, para que las dos versiones no se desincronicen.
   Precios reales del salón (Google Maps). Sin duraciones: no las tenemos. */
const fs = require("fs");
process.chdir(__dirname + "/src");

const M = (es, en, price, opts = {}) => ({ es, en, price, ...opts });

const MENU = [
  {
    cat: "unas", id: "g-unas",
    es: { title: "Uñas", kicker: "Nuestra especialidad" },
    en: { title: "Nails", kicker: "Our specialty" },
    groups: [
      {
        es: "Manicure y pedicure", en: "Manicure and pedicure",
        items: [
          M("Manicure", "Manicure", 220, { desEs: "Limpieza, cutícula, forma y acabado natural.", desEn: "Cleanup, cuticle work, shaping and a natural finish." }),
          M("Manicure con gel", "Gel manicure", 420, { desEs: "Manicure con esmaltado en gel semipermanente.", desEn: "Manicure finished with semi-permanent gel colour." }),
          M("Pedicure spa", "Spa pedicure", 400, { desEs: "Exfoliación, hidratación y masaje.", desEn: "Exfoliation, hydration and massage." }),
          M("Pedicure spa con gel", "Spa pedicure with gel", 600, { desEs: "El ritual spa con acabado en gel de larga duración.", desEn: "The full spa ritual with long-lasting gel colour." }),
        ],
      },
      {
        es: "Gel, rubber y esculturales", en: "Gel, rubber and sculpted nails",
        items: [
          M("Gel hasta 2 tonos", "Gel, up to 2 shades", 240),
          M("Rubber (hasta 2 tonos de gel)", "Rubber base (up to 2 gel shades)", 460, { desEs: "Refuerzo flexible sobre tu uña natural.", desEn: "Flexible reinforcement over your natural nail." }),
          M("Uñas esculturales (acrílico, tip o polygel)", "Sculpted nails (acrylic, tip or polygel)", 670, { tagEs: "Popular", tagEn: "Popular", desEs: "Hasta 2 tonos de gel, largo #1 a #3.", desEn: "Up to 2 gel shades, length #1 to #3." }),
          M("Acrílico o polygel en uña natural", "Acrylic or polygel on natural nail", 470),
          M("Acripie", "Acrylic pedicure (acripie)", 570),
          M("Número extra de acrílico o polygel", "Extra length in acrylic or polygel", 100),
        ],
      },
      {
        es: "Retoques y retiros", en: "Fills and removals",
        items: [
          M("Retoque de rubber", "Rubber fill", 410),
          M("Retoque de acrílico o polygel (1 tono)", "Acrylic or polygel fill (1 shade)", 510),
          M("Retiro de gel o rubber", "Gel or rubber removal", 90),
          M("Retiro de acrílico o polygel", "Acrylic or polygel removal", 150),
          M("Reposición de 1 uña", "Single nail replacement", 70, { from: true }),
          M("Parche de uña", "Nail patch", 40),
        ],
      },
      {
        es: "Diseño y extras", en: "Nail art and extras",
        items: [
          M("Diseños", "Nail art designs", 120, { from: true, tagEs: "Firma de la casa", tagEn: "House signature" }),
          M("Francés", "French finish", 150, { from: true }),
          M("Efectos por uña", "Effects, per nail", 50, { from: true }),
          M("Swarovski", "Swarovski crystals", 100, { from: true }),
          M("Cortes y dijes (cada uno)", "Charms and cuts (each)", 50),
          M("Jelly Spa +", "Jelly Spa +", 150),
          M("Calcio o vitamina", "Calcium or vitamin treatment", 150),
          M("Esmaltado sencillo con barniz", "Regular polish", 150),
          M("Esmaltado con barniz adicional", "Additional regular polish", 75),
        ],
      },
    ],
  },
  {
    cat: "cabello", id: "g-cabello",
    es: { title: "Cabello", kicker: "Corte · Color · Peinado" },
    en: { title: "Hair", kicker: "Cut · Colour · Styling" },
    groups: [
      {
        es: "Corte, peinado y color", en: "Cut, styling and colour",
        items: [
          M("Corte de cabello", "Haircut", 700),
          M("Peinado semi-recogido", "Half-up hairstyle", 750, { from: true }),
          M("Peinado en ondas suaves", "Soft waves styling", 650),
          M("Tinte (cabello corto o medio)", "Colour (short or medium hair)", 1800, { from: true }),
          M("Tinte (cabello largo)", "Colour (long hair)", 2200, { from: true }),
          M("Mantenimiento: retoque, matiz y tratamiento hidratante", "Maintenance: root touch-up, toner and hydrating treatment", 1800),
          M("Balayage, mechas o babylights", "Balayage, highlights or babylights", 2900, { from: true, tagEs: "Tendencia", tagEn: "Trending" }),
          M("Tratamiento marroquí", "Moroccan treatment", 2000, { from: true }),
        ],
      },
      {
        es: "Tratamientos Davines", en: "Davines treatments",
        items: [
          M("Tailoring (personalizado)", "Tailoring (personalised)", 800),
          M("Butter (brillo y suavidad)", "Butter (shine and softness)", 600),
          M("Ampolletas", "Ampoules", 300),
          M("Shampoo y acondicionador", "Shampoo and conditioner", 150),
          M("Alisado express", "Express straightening", 280),
          M("Secado express", "Express blow-dry", 280),
        ],
      },
    ],
  },
  {
    cat: "cejas", id: "g-cejas",
    es: { title: "Cejas y depilación", kicker: "El marco de tu rostro" },
    en: { title: "Brows and waxing", kicker: "The frame of your face" },
    groups: [
      {
        es: "Diseño de cejas", en: "Brow design",
        items: [
          M("Diseño de ceja con hilo", "Brow design with thread", 500, { tagEs: "Especialidad", tagEn: "Specialty", desEs: "Threading: la técnica más precisa y gentil con tu piel.", desEn: "Threading: the most precise and skin-friendly technique." }),
          M("Diseño de ceja con cera", "Brow design with wax", 400),
          M("Brow lamination", "Brow lamination", 440),
          M("Diseño, brow lamination y henna", "Brow design, lamination and henna", 1000),
          M("Henna", "Brow henna", 400),
          M("Lifting", "Lash lifting", 450),
        ],
      },
      {
        es: "Depilación facial", en: "Facial waxing",
        items: [
          M("Depilación de bozo", "Upper lip waxing", 250),
          M("Depilación de rostro completo", "Full face waxing", 650),
        ],
      },
    ],
  },
  {
    cat: "maquillaje", id: "g-maquillaje",
    es: { title: "Maquillaje", kicker: "Para brillar" },
    en: { title: "Makeup", kicker: "Time to shine" },
    groups: [
      {
        es: "Maquillaje", en: "Makeup",
        items: [
          M("Maquillaje social", "Social makeup", 2000, { desEs: "Para eventos, fiestas y sesiones de fotos.", desEn: "For events, parties and photo shoots." }),
          M("Maquillaje express", "Express makeup", 900),
        ],
      },
    ],
  },
];

const money = (n) => "$" + n.toLocaleString("en-US");

/* ---------- HTML ---------- */
function buildHtml(lang) {
  const L = lang === "en";
  const fromLbl = L ? "from" : "desde";
  return MENU.map((cat) => {
    const head = L ? cat.en : cat.es;
    const groups = cat.groups.map((g, gi) => {
      const items = g.items.map((it) => {
        const name = L ? it.en : it.es;
        const tag = L ? it.tagEn : it.tagEs;
        const desc = L ? it.desEn : it.desEs;
        return `        <article class="svc-item reveal">
          <h4>${name}${tag ? ` <span class="tag">${tag}</span>` : ""}</h4>${desc ? `\n          <p>${desc}</p>` : ""}
          <div class="svc-price">${it.from ? `<span>${fromLbl}</span>` : ""}<b>${money(it.price)}</b></div>
        </article>`;
      }).join("\n");
      const sub = cat.groups.length > 1
        ? `        <h3 class="svc-subhead">${L ? g.en : g.es}</h3>\n`
        : "";
      return sub + items;
    }).join("\n");

    return `      <section class="svc-group" data-cat="${cat.cat}" aria-labelledby="${cat.id}">
        <div class="svc-group-head reveal">
          <h2 id="${cat.id}">${head.title}</h2>
          <span>${head.kicker}</span>
        </div>
${groups}
      </section>`;
  }).join("\n\n");
}

/* ---------- OfferCatalog ---------- */
function buildCatalog(lang) {
  const L = lang === "en";
  const items = [];
  for (const cat of MENU) {
    for (const g of cat.groups) {
      for (const it of g.items) {
        const offer = {
          "@type": "Offer",
          priceCurrency: "MXN",
          availability: "https://schema.org/InStock",
          itemOffered: {
            "@type": "Service",
            name: L ? it.en : it.es,
            category: L ? cat.en.title : cat.es.title,
            provider: { "@id": "%SITE_URL%/#organization" },
            areaServed: { "@type": "City", name: "Ciudad de México" },
          },
        };
        if (it.from) {
          offer.priceSpecification = {
            "@type": "PriceSpecification",
            minPrice: it.price,
            priceCurrency: "MXN",
            valueAddedTaxIncluded: true,
          };
        } else {
          offer.price = String(it.price);
        }
        const desc = L ? it.desEn : it.desEs;
        if (desc) offer.itemOffered.description = desc;
        items.push(offer);
      }
    }
  }
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: L ? "Lalolita Beauty services and prices" : "Servicios y precios de Lalolita Beauty",
    inLanguage: L ? "en" : "es-MX",
    numberOfItems: items.length,
    itemListElement: items,
  };
}

/* ---------- aplicar ---------- */
for (const [file, lang] of [["servicios.html", "es"], ["en/services.html", "en"]]) {
  let h = fs.readFileSync(file, "utf8");

  const start = h.indexOf('      <section class="svc-group"');
  const end = h.indexOf('      <p class="price-note');
  if (start < 0 || end < 0) { console.log("MISS marcadores en " + file); continue; }
  h = h.slice(0, start) + buildHtml(lang) + "\n\n" + h.slice(end);

  /* nota de precios */
  const note = lang === "en"
    ? `      <p class="price-note reveal">Prices in Mexican pesos. Services marked <strong>from</strong> have a starting price: the final amount depends on length, hair volume, technique, design or the work involved, and we always confirm it before we start. Prices may change without notice. We accept cash and bank transfer.</p>`
    : `      <p class="price-note reveal">Precios en pesos mexicanos. Los servicios marcados con <strong>desde</strong> tienen un precio inicial: el final depende del largo, la cantidad de cabello, la técnica, el diseño o el trabajo requerido, y siempre te lo confirmamos antes de empezar. Precios sujetos a cambio sin previo aviso. Aceptamos efectivo y transferencia.</p>`;
  h = h.replace(/      <p class="price-note reveal">[\s\S]*?<\/p>/, note);

  /* catálogo estructurado */
  const cat = buildCatalog(lang);
  const block = `  <script type="application/ld+json">\n  ${JSON.stringify(cat, null, 2).split("\n").join("\n  ")}\n  </script>`;
  if (/<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema.org",\s*"@type": "OfferCatalog"/.test(h)) {
    h = h.replace(/  <script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "OfferCatalog"[\s\S]*?<\/script>/, block);
  } else {
    h = h.replace(/\n<\/head>/, "\n" + block + "\n</head>");
  }

  fs.writeFileSync(file, h);
  const n = (h.match(/class="svc-item/g) || []).length;
  console.log(`${file}: ${n} servicios en HTML, ${cat.numberOfItems} en OfferCatalog`);
}
