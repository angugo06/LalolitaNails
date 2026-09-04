// Generate discovery files and featured prices from the actual page/menu sources.
const fs = require("node:fs");
const path = require("node:path");
const { MENU } = require("./menu");
const { parseDocument, DomUtils } = require("htmlparser2");
const root = path.resolve(__dirname, "..");
const src = path.join(root, "src");
const files = fs.readdirSync(src).filter((p) => p.endsWith(".html"))
  .concat(fs.readdirSync(path.join(src, "en")).filter((p) => p.endsWith(".html")).map((p) => `en/${p}`));
const xml = (s) => s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
const entries = [];
for (const file of files) {
  let html = fs.readFileSync(path.join(src, file), "utf8");
  if (html.includes('"@type": "FAQPage"')) {
    const doc = parseDocument(html);
    const details = DomUtils.findAll((el) => el.name === "details", doc.children);
    const content = (el) => DomUtils.textContent(el).replace(/\s+/g, " ").trim();
    const faq = {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: details.map((detail) => {
        const summary = DomUtils.findOne((el) => el.name === "summary", detail.children);
        const answer = DomUtils.findOne((el) => el.attribs?.class?.split(/\s+/).includes("faq-body"), detail.children);
        if (!summary || !answer) throw new Error(`Incomplete FAQ in ${file}`);
        return { "@type": "Question", name: content(summary), acceptedAnswer: { "@type": "Answer", text: content(answer) } };
      }),
    };
    html = html.replace(/<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema.org",\s*"@type": "FAQPage"[\s\S]*?<\/script>/, `<script type="application/ld+json">\n  ${JSON.stringify(faq, null, 2).replaceAll("\n", "\n  ")}\n  </script>`);
    fs.writeFileSync(path.join(src, file), html);
  }
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) throw new Error(`Missing canonical: ${file}`);
  const alternates = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
  entries.push(`  <url>\n    <loc>${xml(canonical)}</loc>\n${alternates.map((m) => `    <xhtml:link rel="alternate" hreflang="${xml(m[1])}" href="${xml(m[2])}"/>`).join("\n")}\n  </url>`);
}
// Omit lastmod: a deployment date is not evidence that every page changed.
fs.writeFileSync(path.join(root, "public/sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`);

const llmsPath = path.join(root, "public/llms.txt");
let llms = fs.readFileSync(llmsPath, "utf8");
const menuText = MENU.map((category) => `### ${category.es.title}\n\n` + category.groups.map((group) =>
  group.items.map((item) => `- ${item.es}: ${item.from ? "desde " : ""}$${item.price.toLocaleString("en-US")} MXN`).join("\n")
).join("\n")).join("\n\n");
llms = llms.replace(/### Uñas[\s\S]*?(?=## Cómo agendar)/, menuText + "\n\n");
llms = llms.replace(/ Calificación en Google: [^\n]+/g, "");
llms = llms.replace("%SITE_URL%/index.html", "%SITE_URL%/");
llms = llms.replace(/^- \[(Aviso de Privacidad|Términos y Condiciones|Privacy Notice|Terms and Conditions)\].*\n/gm, "");
llms = llms.replace("quiénes atienden en cada sucursal.", "especialidades del equipo y cómo elegir profesional al reservar.");
fs.writeFileSync(llmsPath, llms);

const featured = [MENU[0].groups[0].items[0], MENU[0].groups[0].items[1], MENU[0].groups[0].items[2]];
for (const lang of ["es", "en"]) {
  const en = lang === "en";
  const file = path.join(src, en ? "en/index.html" : "index.html");
  let html = fs.readFileSync(file, "utf8");
  const menu = en ? "services.html#g-nails" : "servicios.html#g-unas";
  const cards = featured.map((item, i) => `<a class="featured-service" href="${menu}"><span class="featured-index">0${i+1}</span><span><strong>${en ? item.en : item.es}</strong><span class="featured-detail">${en ? "View service menu" : "Ver en el menú"} ↗</span></span><span class="featured-price">$${item.price}<small>MXN</small></span></a>`).join("\n        ");
  const section = `    <!-- FEATURED-SERVICES:START -->
    <section class="featured-services container" aria-labelledby="featured-title">
      <div class="featured-heading"><div><p class="eyebrow">${en ? "A little time for you" : "Un ratito para ti"}</p><h2 id="featured-title">${en ? "Start with your <em>hands.</em>" : "Empieza por tus <em>manos.</em>"}</h2></div><p>${en ? "Explore the menu before you book. Prices in Mexican pesos." : "Conoce el menú antes de agendar. Precios en pesos mexicanos."}</p></div>
      <div class="featured-grid">
        ${cards}
      </div>
      <p class="featured-note">${en ? "Prices may change. Removal and designs are charged separately; see the full menu." : "Precios sujetos a cambio. El retiro y los diseños se cobran por separado; consulta el menú completo."}</p>
    </section>
    <!-- FEATURED-SERVICES:END -->`;
  if (!html.includes("<!-- FEATURED-SERVICES:START -->")) throw new Error(`Missing featured marker: ${file}`);
  html = html.replace(/    <!-- FEATURED-SERVICES:START -->[\s\S]*?    <!-- FEATURED-SERVICES:END -->/, section);
  fs.writeFileSync(file, html);
}
console.log(`Discovery: ${entries.length} indexable URLs; reciprocal languages; menu and featured prices synchronized.`);
