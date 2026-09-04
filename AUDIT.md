# Website audit — 4 September 2026

The site keeps its bilingual static architecture and pink/plum identity, with clearer service discovery, more consistent search data, and fixes to navigation, booking copy and invoice rendering. Changes are local; the public site has not been deployed from this audit.

## Scope

Reviewed all 19 source and generated HTML pages, shared CSS/JavaScript, the menu generator, structured data, metadata, sitemap, crawler files, build/development configuration and dependencies. Inspected the original public homepage and the local production build in Chrome. Placeholder images and their alt text were deliberately excluded. The invoice Worker was not changed or exercised against a payment/tax service.

## Design follow-up — all pages

The subsequent design passes cover both homepages, all 16 interior pages and the shared 404. The home illustration is now a CSS nail-color studio with eight shades and three finishes. Interior pages share the same typography and stationery-inspired details, with layouts specific to their purpose:

- Services: framed menu sections, category colors, clearer prices and a split FAQ layout.
- About and team: photo collages, a six-part journal timeline, colored values and numbered specialty panels.
- Locations: paired branch information and maps, with contact details, hours and directions grouped below.
- Booking and billing: appointment and receipt artwork, clearer form sections, branch selection and contextual information. Decorative hero artwork is hidden on phones for these functional pages; billing fields precede supporting guidance.
- Privacy and terms: paper reading columns, section dividers and a scrollable contents rail on desktop.
- 404: branded typography, a compact illustrated composition and recovery links.

Chrome geometry checks passed for all 17 non-home pages at 320, 390, 768 and 1280px (68 combinations). Fixed map overflow, a narrow English heading and long form/FAQ reveal behavior. Visually inspected every page type; verified service search, category filtering, empty/reset states, FAQ expansion, legal anchors and invoice branch selection. The embedded booking calendar loaded, but its third-party interface was not restyled and no appointment or invoice was submitted.

Latest build and static audit: 19 pages, 28 JSON-LD blocks, 14 indexable URLs and 1,774 assertions passed. Changes remain local and are not published.

## Implemented

| Area | Finding | Change |
|---|---|---|
| Homepage | Long introduction and no immediately accessible price overview | Shorter headline and copy, branch link, three service/price cards generated from the menu, clearer booking CTA |
| Readability | Light pink text/buttons and pale CTA gradient | Darker pink functional accents, stronger secondary text, plum CTA background, clearer header boundary |
| Service discovery | 49 services required substantial scrolling | Accent-insensitive search, category filters, result count, empty/reset state, readable mobile price columns |
| Wayfinding | Interior pages lacked visible breadcrumbs | Added localized breadcrumbs on all 16 interior pages |
| Mobile menu | No focus management, background remained interactive, short screens could clip links | Focus entry and trapping, inert background, focus restoration, Escape handler, scrollable menu, reset on desktop breakpoint |
| Motion | Auto-rotating testimonials and continuous decoration | Manual testimonial controls, correct button state, inactive quotes hidden from assistive technology, stationary marquee/orbit, removed entrance fades |
| JavaScript fallback | Counters contained zero in source; service controls and invoice submission unusable without JS | Real source counts, readable reveal content, fallback mobile navigation, hidden inactive controls, invoice WhatsApp fallback without exposing fields in a GET URL |
| Booking | Incorrect free-removal promise contradicted the service menu | Correct removal fees in both languages, direct calendar fallback, explicit initial iframe height, styled context cards |
| Team | Dummy names and biographies appeared on public pages | Replaced dummy profiles with service specialties and the existing founder information; calendar remains the source for available professionals |
| Local schema | Branches lacked shared identity; unverified payment methods and stale copied ratings appeared in JSON-LD | Stable branch IDs linked to organization and catalog; removed payment/rating assertions from schema |
| FAQ schema | Visible answers and JSON-LD differed | Generate JSON-LD from visible FAQ content; validate exact answer parity |
| Sitemap | English entries lacked reciprocal alternates; every build changed every lastmod | Generate from indexable pages and their canonical/hreflang; omit unsupported modification dates |
| Draft discovery | Incomplete legal drafts were advertised as indexable content | `noindex, follow` on four legal pages; omit them from sitemap and `llms.txt`, retain visitor access |
| AI reference | Price list had a separate manual copy and ratings could become stale | Generate service list from menu; remove rating snapshots and normalize the Spanish home URL |
| Dates | Hours depended on visitor timezone, invoice date limit used UTC | Use `America/Mexico_City` for both |
| Consent | Banner appeared with no configured advertising pixel; withdrawal did not revoke Meta consent | Avoid automatic banner without a pixel; validate pixel ID; grant/revoke Meta consent on preference changes |
| Invoice rendering | External error strings and returned values were inserted as HTML | Escape untrusted strings before rendering |
| Build | Development left unresolved tokens; nested 404 font path was relative | Shared asset/token pipeline in dev and production, root-safe 404 fonts, dedicated local preview server |
| Dependencies | npm initially reported 9 vulnerabilities, including 2 high | Updated vulnerable build tooling and lockfile; final audit reports zero. Node.js minimum is now 22.15, CI uses 24 |
| Regression prevention | `npm test` was a failing placeholder | Build-output audit checks all pages before GitHub Pages deployment |

## Verification

- `npm test`: production build and 1,811 assertions pass across 19 pages, 28 JSON-LD blocks and 14 indexable URLs. Checks unique metadata, canonical/Open Graph URLs, reciprocal languages, local resources/links/anchors, duplicate IDs, ARIA references, FAQ parity, 49 visible/schema menu prices per language and sitemap coverage.
- Chrome layout checks: all 19 pages at 390px and 1280px; home/services/booking in both languages additionally checked at 320px. No document overflow or clipped headings found. These are DOM geometry checks, not a full accessibility certification.
- Browser service checks: `acrilico` matches five accented service names; unknown search shows the empty state; reset restores 49 items; Hair shows 14 services; English `balayage` returns one result.
- Mobile menu opens, focuses its first link and removes background content from the accessibility tree. Switching back to desktop closes it and restores the page. Browser keyboard automation did not reliably dispatch Tab/Escape, so physical keyboard traversal remains a manual smoke check; handlers were reviewed in source.
- With JavaScript disabled through browser emulation, all 49 services remain readable and reveal blocks stay visible. The invoice form is hidden and both branch WhatsApp links remain available.
- Booking iframe loaded the external location chooser; no appointment or invoice was submitted.
- Development server starts on the upgraded tooling. English service HTML and the development 404 have resolved tokens. Production preview returns a real HTTP 404 for a nested missing path.
- `npm audit`: zero vulnerabilities. `git diff --check`: no whitespace errors.
- No new Lighthouse or field Core Web Vitals measurements. Existing photos, menus/prices and review counts were not independently verified against salon records.

## Remaining owner / platform work

1. **Resolve the San Rafael phone discrepancy.** The live embedded GoHighLevel chooser displays `+52 (552) 290-0915`; site content uses `+52 55 6885 6070`. Confirm the correct number and update the location settings in GoHighLevel or the site accordingly. Polanco agrees at `+52 56 1515 6061`.
2. **Complete legal business details.** The legal entity, RFC, fiscal address, privacy contact and certain business policies are still placeholders in the supplied content. Those values also appear in the short booking/invoicing notices. They need owner confirmation, not inferred replacements. Legal pages remain accessible but noindexed until completed.
3. **Configure the booking service itself.** Consent fields, service availability, pricing and confirmation behavior belong to GoHighLevel. The website cannot verify or enforce them inside a third-party iframe. Invoice issuance is still disabled (`facturaEndpoint` is empty); the existing Worker requires ticket/POS verification before activation.
4. **Put robots.txt at the host root.** Live check: `https://angugo06.github.io/robots.txt` returns 404. The generated `/LalolitaNails/robots.txt` does not control crawling for the host. Use the user-site repository or a custom domain/root deployment. A missing robots file does not itself block indexing. Google's [robots.txt location rules](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt) explain the requirement.
5. **Verify business evidence.** Check visible review counts, testimonials, follower totals, hours, policies and payment methods with the salon. These were supplied content, not independently substantiated during the audit. Removed rating markup also avoids implying eligibility for self-serving local-business review stars, which Google's [review snippet guidance](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) excludes.
6. **After publication**, verify the live pages, connect the owned domain to Search Console/Bing Webmaster Tools, submit the sitemap and keep both Google Business Profiles consistent. These account changes and publication were not performed.

## AI/search rationale

The work emphasizes accessible HTML, clear service/branch facts, useful internal links and agreement between visible content and structured data. `llms.txt` is supplementary; no special AI schema or file guarantees visibility. This follows Google's [guidance for AI features and websites](https://developers.google.com/search/docs/appearance/ai-features).

## Review locally

```sh
npm test
npm run preview
# http://127.0.0.1:4174/LalolitaNails/
```

Edit service data in `tools/menu.js`. `npm run generate` updates both service pages, visible-answer FAQ schemas, homepage price cards, sitemap and the service list in `llms.txt`. Editorial price mentions elsewhere still need review when prices change.
