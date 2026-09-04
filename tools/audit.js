// Source-independent checks against the production output, run before deployment.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { parseDocument, DomUtils } = require("htmlparser2");
const { siteUrl, basePath } = require("../site.config");
const root = path.resolve(__dirname, "../dist");
const all = (doc, predicate) => DomUtils.findAll((el) => !!el.attribs && predicate(el), doc.children || []);
const tag = (doc, name) => all(doc, (el) => el.name === name);
const hasClass = (el, cls) => (el.attribs.class || "").split(/\s+/).includes(cls);
const text = (el) => DomUtils.textContent(el).replace(/\s+/g, " ").trim();
const meta = (doc, name) => all(doc, (el) => el.name === "meta" && (el.attribs.name === name || el.attribs.property === name))[0]?.attribs.content;
const link = (doc, rel) => all(doc, (el) => el.name === "link" && el.attribs.rel === rel);
const names = fs.readdirSync(root).filter((p) => p.endsWith(".html"))
  .concat(fs.readdirSync(path.join(root, "en")).filter((p) => p.endsWith(".html")).map((p) => `en/${p}`));
const pages = new Map(names.map((name) => {
  const html = fs.readFileSync(path.join(root, name), "utf8");
  return [name, { html, doc: parseDocument(html) }];
}));
const localFile = (url) => {
  let p = decodeURIComponent(url.pathname);
  if (basePath && p.startsWith(basePath + "/")) p = p.slice(basePath.length);
  if (p.endsWith("/")) p += "index.html";
  return p.replace(/^\//, "");
};
let checks = 0;
const check = (condition, message) => { checks++; assert.ok(condition, message); };
const titles = new Set();
const descriptions = new Set();
const canonicalPages = new Map();
let schemas = 0;
for (const [file, { html, doc }] of pages) {
  check(!/%(?:SITE_URL|BASE|FACTURA_ENDPOINT|META_PIXEL_ID|BUILD_DATE)%/.test(html), `${file}: unresolved build token`);
  check(tag(doc, "h1").length === 1, `${file}: exactly one H1 required`);
  check(tag(doc, "main").length === 1, `${file}: exactly one main required`);
  check(tag(doc, "html")[0]?.attribs.lang === (file.startsWith("en/") ? "en" : "es"), `${file}: wrong language`);
  const title = text(tag(doc, "title")[0]);
  check(title.length > 10 && !titles.has(title), `${file}: missing or duplicated title`);
  titles.add(title);
  const description = meta(doc, "description");
  check(description?.length > 30 && !descriptions.has(description), `${file}: missing or duplicated description`);
  descriptions.add(description);
  const ids = all(doc, (el) => !!el.attribs.id).map((el) => el.attribs.id);
  check(ids.length === new Set(ids).size, `${file}: duplicate HTML IDs`);
  const pageUrl = `${siteUrl}/${file === "index.html" ? "" : file}`;
  if (file !== "404.html") {
    const canonical = link(doc, "canonical");
    check(canonical.length === 1 && canonical[0].attribs.href === pageUrl, `${file}: canonical mismatch`);
    check(meta(doc, "og:url") === pageUrl, `${file}: Open Graph URL mismatch`);
    if (!meta(doc, "robots").includes("noindex")) canonicalPages.set(pageUrl, doc);
    const alternates = link(doc, "alternate");
    check(["es", "en", "x-default"].every((lang) => alternates.some((a) => a.attribs.hreflang === lang)), `${file}: incomplete language alternates`);
    for (const alternate of alternates) {
      const target = pages.get(localFile(new URL(alternate.attribs.href)));
      check(!!target, `${file}: missing translated page`);
      check(link(target.doc, "alternate").some((a) => a.attribs.href === pageUrl), `${file}: non-reciprocal language alternate`);
    }
  }
  for (const el of all(doc, (el) => !!el.attribs.href || !!el.attribs.src)) {
    const value = el.attribs.href || el.attribs.src;
    if (/^(tel:|mailto:|data:)/.test(value)) continue;
    const url = new URL(value, pageUrl);
    if (url.origin !== new URL(siteUrl).origin) continue;
    const targetFile = localFile(url);
    check(fs.existsSync(path.join(root, targetFile)), `${file}: broken local URL ${value}`);
    if (url.hash && pages.has(targetFile)) {
      check(all(pages.get(targetFile).doc, (node) => node.attribs.id === decodeURIComponent(url.hash.slice(1))).length > 0, `${file}: missing anchor ${value}`);
    }
  }
  for (const el of all(doc, (el) => !!el.attribs["aria-controls"] || !!el.attribs["aria-describedby"] || !!el.attribs["aria-labelledby"])) {
    for (const attr of ["aria-controls", "aria-describedby", "aria-labelledby"]) {
      for (const id of (el.attribs[attr] || "").split(/\s+/).filter(Boolean)) check(ids.includes(id), `${file}: ${attr} references missing ${id}`);
    }
  }
  const structured = [];
  const visit = (value) => {
    if (!value || typeof value !== "object") return;
    if (value["@type"]) structured.push(value);
    Object.values(value).forEach((v) => Array.isArray(v) ? v.forEach(visit) : visit(v));
  };
  for (const script of tag(doc, "script").filter((el) => el.attribs.type === "application/ld+json")) {
    const parsed = JSON.parse(DomUtils.textContent(script));
    schemas++;
    Array.isArray(parsed) ? parsed.forEach(visit) : visit(parsed);
  }
  for (const salon of structured.filter((s) => s["@type"] === "NailSalon")) {
    check(!!salon["@id"] && salon.parentOrganization?.["@id"] === `${siteUrl}/#organization`, `${file}: disconnected branch identity`);
    check(!salon.aggregateRating && !salon.paymentAccepted, `${file}: unverified rating/payment claims in schema`);
  }
  for (const faq of structured.filter((s) => s["@type"] === "FAQPage")) {
    const details = tag(doc, "details");
    for (const question of faq.mainEntity) {
      const visible = details.find((el) => text(tag(el, "summary")[0] || { children: [] }) === question.name);
      check(!!visible, `${file}: FAQ question missing from page: ${question.name}`);
      check(text(visible).includes(question.acceptedAnswer.text.replace(/\s+/g, " ").trim()), `${file}: FAQ answer differs from visible text: ${question.name}`);
    }
  }
  const catalog = structured.find((s) => s["@type"] === "OfferCatalog");
  if (catalog) {
    const items = all(doc, (el) => hasClass(el, "svc-item"));
    check(items.length === catalog.itemListElement.length && items.length === 49, `${file}: menu/catalog count mismatch`);
    catalog.itemListElement.forEach((offer, i) => {
      check(text(items[i]).includes(offer.itemOffered.name), `${file}: menu/schema service mismatch at ${i}`);
      const price = Number(offer.price || offer.priceSpecification.minPrice);
      check(text(items[i]).includes(`$${price.toLocaleString("en-US")}`), `${file}: menu/schema price mismatch at ${i}`);
    });
  }
}
const sitemapText = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemap = parseDocument(sitemapText, { xmlMode: true });
const urls = tag(sitemap, "url");
check(urls.length === canonicalPages.size, "Sitemap must include every indexable page exactly once");
check(!sitemapText.includes("lastmod"), "Do not replace actual modification dates with build dates");
const seenUrls = new Set();
for (const entry of urls) {
  const url = text(tag(entry, "loc")[0]);
  check(canonicalPages.has(url) && !seenUrls.has(url), `Unexpected or duplicate sitemap URL: ${url}`);
  seenUrls.add(url);
  check(tag(entry, "xhtml:link").length === 3, `Sitemap alternates missing: ${url}`);
  for (const alternate of tag(entry, "xhtml:link")) {
    check(canonicalPages.has(alternate.attribs.href), `Sitemap language target must be indexable: ${alternate.attribs.href}`);
    check(link(canonicalPages.get(url), "alternate").some((a) => a.attribs.href === alternate.attribs.href && a.attribs.hreflang === alternate.attribs.hreflang), `Sitemap and HTML language mismatch: ${url}`);
  }
}
console.log(`PASS: ${pages.size} pages, ${schemas} JSON-LD blocks, ${canonicalPages.size} indexable URLs, ${checks} assertions.`);
console.log("Scope: metadata, language pairs, local links/assets/fragments, ARIA references, FAQ parity, menu/schema prices and sitemap. Placeholder image alt text excluded.");
