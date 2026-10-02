# Beauty Studio website template

This is the original bilingual, 19-page salon website, with its visual design and interactions preserved. It still has the full-screen menu, shade and finish preview, service filters, horizontal gallery, quote carousel, animated counters, responsive layouts, and invoice form design. The photos are retained as sample imagery.

The former salon's name, logo images, booking widget, social destinations, maps, phone numbers, addresses and reputation claims have been removed. The site is a **demo** until a buyer supplies real business details. Demo pages use `noindex`; the invoice form cannot submit or send customer data until a real endpoint or phone is configured.

## Buyer setup

1. In `site.config.js`, set the new public `siteUrl`. Leave `facturaEndpoint` and `metaPixelId` empty unless the buyer has their own accounts and has tested them.
2. Update the name, location descriptions, opening hours, contact links, and booking system in `src/` for both Spanish and English. The booking and map spaces are styled placeholders that retain the original page layouts.
3. Update the service list and example prices in `tools/menu.js`, then update the prices mentioned in editorial copy and FAQs. `npm run generate` refreshes the service HTML and the featured cards.
4. Replace the sample story, legal documents, and policies with information approved by the buyer. The invoice form is a visual template until the buyer supplies their own fiscal provider and phone numbers.
5. Confirm that the included photos can be used in the buyer's project. Replace `src/img/brand-mark.svg` and `src/img/brand-lockup.svg` with their brand assets if desired.
6. After the site is fully personalized, update the robots directives and the page-level `noindex` tags, then run `npm test` and inspect both languages on mobile and desktop.

## Local commands

Requires Node.js 22.15 or newer.

```sh
npm ci
npm run build
npm test
npm run preview
```

Preview at `http://127.0.0.1:4174/`. The existing GitHub Pages workflow builds and deploys `dist/` on pushes to `main`; publishing the demo before the buyer's details are added is not a launch.

The repository name and earlier Git commit history are separate from the current website files. A buyer should use their own repository and hosting URL when launching.
