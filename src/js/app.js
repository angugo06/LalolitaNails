/* Lalolita Beauty — interactions */
document.documentElement.classList.remove("no-js");

/* Idioma actual (es por defecto); las cadenas del formulario dependen de esto */
const LANG = document.documentElement.lang.startsWith("en") ? "en" : "es";
const T = {
  es: {
    locale: "es-MX",
    testimonial: (n) => `Testimonio ${n}`,
    rfcInvalid: "Revisa el RFC: 13 caracteres para persona física, 12 para moral.",
    cfdiTitle: (branch) => `Solicitud de factura (CFDI) - Lalolita Beauty ${branch}`,
    cfdiLabels: {
      fecha: "Fecha del servicio", folio: "Ticket", monto: "Monto",
      formaPago: "Forma de pago", rfc: "RFC", razonSocial: "Razon social",
      regimen: "Regimen fiscal", usoCfdi: "Uso del CFDI", cp: "CP fiscal",
      correo: "Correo", comentarios: "Comentarios",
    },
    cfdiFooter: "Adjunto mi Constancia de Situacion Fiscal.",
    cfdiSending: "Timbrando tu factura…",
    cfdiSend: "Emitir mi factura",
    cfdiOkTitle: "Factura <em>timbrada.</em>",
    cfdiOkBody: (uuid, emailed, correo) =>
      `Folio fiscal (UUID): <strong>${uuid}</strong>.` +
      (emailed
        ? ` Te enviamos el PDF y el XML a <strong>${correo}</strong>.`
        : " Guarda este folio: te enviaremos el PDF y el XML en breve."),
    cfdiFailTitle: "No pudimos timbrarla",
    cfdiFailWa: "Enviar por WhatsApp",
  },
  en: {
    locale: "en-US",
    testimonial: (n) => `Testimonial ${n}`,
    rfcInvalid: "Check the RFC: 13 characters for individuals, 12 for companies.",
    cfdiTitle: (branch) => `Invoice request (CFDI) - Lalolita Beauty ${branch}`,
    cfdiLabels: {
      fecha: "Service date", folio: "Ticket", monto: "Amount",
      formaPago: "Payment method", rfc: "RFC", razonSocial: "Legal name",
      regimen: "Tax regime", usoCfdi: "CFDI use", cp: "Fiscal postcode",
      correo: "Email", comentarios: "Comments",
    },
    cfdiFooter: "I'm attaching my Constancia de Situacion Fiscal.",
    cfdiSending: "Issuing your invoice…",
    cfdiSend: "Issue my invoice",
    cfdiOkTitle: "Invoice <em>issued.</em>",
    cfdiOkBody: (uuid, emailed, correo) =>
      `Fiscal folio (UUID): <strong>${uuid}</strong>.` +
      (emailed
        ? ` We've sent the PDF and XML to <strong>${correo}</strong>.`
        : " Keep this folio: we'll email the PDF and XML shortly."),
    cfdiFailTitle: "We couldn't issue it",
    cfdiFailWa: "Send on WhatsApp",
  },
}[LANG];

// Values from forms or external responses must never be interpreted as markup.
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/* ---------- Consentimiento de cookies ----------
   El píxel de Meta NO se carga hasta que la persona acepta. La decisión se
   guarda en localStorage y se puede cambiar desde el enlace del pie.        */
const CONSENT_KEY = "lb-consent";
const COOKIE_TXT = {
  es: {
    text: 'Usamos cookies propias para que el sitio funcione y, si lo aceptas, cookies de publicidad y medición. Consulta el <a href="aviso-de-privacidad.html">Aviso de Privacidad</a>.',
    accept: "Aceptar todas",
    reject: "Solo las esenciales",
    label: "Aviso de cookies",
  },
  en: {
    text: 'We use our own cookies to make the site work and, if you accept, advertising and measurement cookies. See our <a href="privacy.html">Privacy Notice</a>.',
    accept: "Accept all",
    reject: "Essential only",
    label: "Cookie notice",
  },
};

const readConsent = () => {
  try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || "null"); } catch { return null; }
};

const loadMetaPixel = () => {
  const id = document.querySelector('meta[name="lb-pixel-id"]')?.content?.trim();
  if (!/^\d+$/.test(id) || window.fbq) return;
  /* snippet oficial de Meta, solo tras el consentimiento */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
    t = b.createElement(e); t.async = true; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", id);
  window.fbq("track", "PageView");
};

const applyConsent = (state) => {
  /* Consent Mode v2, por si más adelante se agrega Google Analytics o Ads */
  window.dataLayer = window.dataLayer || [];
  const gtag = function () { window.dataLayer.push(arguments); };
  gtag("consent", "update", {
    ad_storage: state === "granted" ? "granted" : "denied",
    ad_user_data: state === "granted" ? "granted" : "denied",
    ad_personalization: state === "granted" ? "granted" : "denied",
    analytics_storage: state === "granted" ? "granted" : "denied",
  });
  if (state === "granted") {
    loadMetaPixel();
    window.fbq?.("consent", "grant");
  } else {
    window.fbq?.("consent", "revoke");
  }
};

const saveConsent = (state) => {
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ state, date: new Date().toISOString() })); } catch {}
  applyConsent(state);
};

const showCookieBanner = () => {
  if (document.querySelector(".cookie-banner")) return;
  const t = COOKIE_TXT[document.documentElement.lang.startsWith("en") ? "en" : "es"];
  const el = document.createElement("aside");
  el.className = "cookie-banner";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-live", "polite");
  el.setAttribute("aria-label", t.label);
  el.innerHTML =
    `<p>${t.text}</p>` +
    `<div class="cookie-actions">` +
    `<button class="btn btn-ghost btn-sm" type="button" data-consent="denied">${t.reject}</button>` +
    `<button class="btn btn-cherry btn-sm" type="button" data-consent="granted">${t.accept}</button>` +
    `</div>`;
  el.addEventListener("click", (e) => {
    const choice = e.target.closest("[data-consent]")?.dataset.consent;
    if (!choice) return;
    saveConsent(choice);
    el.remove();
  });
  document.body.append(el);
};

{
  const stored = readConsent();
  if (stored?.state) applyConsent(stored.state);
  else if (/^\d+$/.test(document.querySelector('meta[name="lb-pixel-id"]')?.content || "")) showCookieBanner();
  document.querySelectorAll("[data-cookie-settings]").forEach((b) =>
    b.addEventListener("click", (e) => { e.preventDefault(); showCookieBanner(); })
  );
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

/* ---------- Header: blur on scroll, hide on scroll down ---------- */
const header = document.querySelector("[data-header]");
let lastScrollY = window.scrollY;

const syncHeader = () => {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 24);
  if (!document.body.classList.contains("menu-open")) {
    header?.classList.toggle("is-hidden", y > 420 && y > lastScrollY && !header.contains(document.activeElement));
  }
  lastScrollY = y;
};
window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();
header?.addEventListener("focusin", () => header.classList.remove("is-hidden"));

/* ---------- Fullscreen menu ---------- */
const menuToggle = document.querySelector("[data-menu-toggle]");
const menuOverlay = document.querySelector("[data-menu-overlay]");
const menuBackground = document.querySelectorAll("main, .site-footer");

const setMenu = (open) => {
  menuToggle?.setAttribute("aria-expanded", String(open));
  menuOverlay?.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
  menuBackground.forEach((el) => { el.inert = open; });
  if (menuOverlay) menuOverlay.inert = !open;
  if (open) {
    header?.classList.remove("is-hidden");
    menuOverlay?.querySelector("a")?.focus({ preventScroll: true });
  } else {
    menuToggle?.focus({ preventScroll: true });
  }
};
if (menuOverlay) menuOverlay.inert = true;

menuToggle?.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});
menuOverlay?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (!menuOverlay?.classList.contains("is-open")) return;
  if (e.key === "Escape") setMenu(false);
  if (e.key === "Tab") {
    const focusable = [...document.querySelectorAll('.site-header a, .site-header button, .menu-overlay a')]
      .filter((el) => el.getClientRects().length && getComputedStyle(el).visibility !== "hidden");
    const first = focusable[0];
    const last = focusable.at(-1);
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  }
});
window.matchMedia("(min-width: 64.01rem)").addEventListener("change", (e) => {
  if (e.matches && menuOverlay?.classList.contains("is-open")) {
    setMenu(false);
    header?.querySelector("a")?.focus();
  }
});

/* ---------- Reveal on scroll ---------- */
const revealObserver = "IntersectionObserver" in window && !prefersReducedMotion ? new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
) : null;
document.querySelectorAll(".reveal").forEach((el) => {
  if (revealObserver) { el.classList.add("reveal-ready"); revealObserver.observe(el); }
  else el.classList.add("is-visible");
});

/* ---------- Magnetic buttons ---------- */
if (finePointer && !prefersReducedMotion) {
  document.querySelectorAll(".magnetic").forEach((el) => {
    const strength = 0.32;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });
}

/* ---------- Tilt cards ---------- */
if (finePointer && !prefersReducedMotion) {
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${px * 7}deg) rotateX(${py * -7}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

/* ---------- Color studio ---------- */
const tryonStage = document.querySelector("[data-tryon-stage]");
if (tryonStage) {
  const swatches = [...document.querySelectorAll(".swatch")];
  const finishes = [...document.querySelectorAll(".finish-btn")];
  let selectedShade = swatches.find((sw) => sw.getAttribute("aria-pressed") === "true") || swatches[0];
  let selectedFinish = finishes.find((button) => button.getAttribute("aria-pressed") === "true") || finishes[0];
  const renderLook = () => {
    if (!selectedShade || !selectedFinish) return;
    tryonStage.style.setProperty("--polish", selectedShade.dataset.polish);
    tryonStage.dataset.finish = selectedFinish.dataset.finish;
    swatches.forEach((sw) => sw.setAttribute("aria-pressed", String(sw === selectedShade)));
    finishes.forEach((button) => button.setAttribute("aria-pressed", String(button === selectedFinish)));
    document.querySelector("[data-shade-name]").textContent = selectedShade.dataset.name;
    document.querySelector("[data-shade-description]").textContent = `${selectedShade.dataset.desc} · ${selectedFinish.textContent}`;
    document.querySelector("[data-shade-chip]").style.backgroundColor = selectedShade.dataset.polish;
    document.querySelector("[data-shade-number]").textContent = `${selectedShade.dataset.swatchNumber} — 08`;
    document.querySelector("[data-nail-preview]").setAttribute("aria-label", LANG === "en"
      ? `Three glossy nail samples in ${selectedShade.dataset.name}, ${selectedFinish.textContent} finish`
      : `Tres muestras de uñas brillantes en ${selectedShade.dataset.name}, acabado ${selectedFinish.textContent}`);
  };
  swatches.forEach((sw) => {
    sw.addEventListener("click", () => {
      selectedShade = sw;
      renderLook();
    });
  });
  finishes.forEach((button) => button.addEventListener("click", () => {
    selectedFinish = button;
    renderLook();
  }));
  renderLook();
}

/* ---------- Animated counters ---------- */
const counters = document.querySelectorAll("[data-count]");
if (counters.length && "IntersectionObserver" in window) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countObserver.unobserve(entry.target);
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      if (prefersReducedMotion) {
        el.textContent = target;
        return;
      }
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => countObserver.observe(el));
}

/* ---------- Reader-controlled testimonials ---------- */
const quoteStage = document.querySelector("[data-quotes]");
if (quoteStage) {
  const items = Array.from(quoteStage.querySelectorAll(".quote-item"));
  const dotsWrap = document.querySelector("[data-quote-dots]");

  const dots = items.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", T.testimonial(i + 1));
    b.addEventListener("click", () => show(i));
    dotsWrap?.append(b);
    return b;
  });

  const show = (i) => {
    items.forEach((item, j) => {
      item.classList.toggle("is-active", j === i);
      item.hidden = j !== i;
    });
    dots.forEach((d, j) => d.setAttribute("aria-pressed", String(j === i)));
  };

  show(0);
}

/* ---------- Gallery drag-to-scroll ---------- */
const gallery = document.querySelector("[data-gallery]");
if (gallery && finePointer) {
  let isDown = false;
  let startX = 0;
  let startScroll = 0;

  gallery.addEventListener("pointerdown", (e) => {
    isDown = true;
    startX = e.clientX;
    startScroll = gallery.scrollLeft;
    gallery.setPointerCapture(e.pointerId);
    gallery.classList.add("is-dragging");
  });
  gallery.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    gallery.scrollLeft = startScroll - (e.clientX - startX);
  });
  const endDrag = () => {
    isDown = false;
    gallery.classList.remove("is-dragging");
  };
  gallery.addEventListener("pointerup", endDrag);
  gallery.addEventListener("pointercancel", endDrag);
}

/* ---------- Services filter ---------- */
const filterBar = document.querySelector("[data-filter-bar]");
if (filterBar) {
  const buttons = filterBar.querySelectorAll(".filter-btn");
  const groups = [...document.querySelectorAll(".svc-group")];
  const search = document.querySelector("[data-service-search]");
  const status = document.querySelector("[data-service-status]");
  const empty = document.querySelector("[data-service-empty]");
  const normalize = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  let filter = "all";
  const update = () => {
    const query = normalize(search?.value || "");
    let count = 0;
    groups.forEach((group) => {
      const categoryMatches = filter === "all" || group.dataset.cat === filter;
      let visible = 0;
      group.querySelectorAll(".svc-item").forEach((item) => {
        item.hidden = !categoryMatches || !normalize(item.textContent).includes(query);
        if (!item.hidden) { visible++; item.classList.add("is-visible"); }
      });
      group.hidden = visible === 0;
      group.querySelectorAll(".svc-subhead").forEach((heading) => {
        let next = heading.nextElementSibling;
        let hasItems = false;
        while (next?.classList.contains("svc-item")) { hasItems ||= !next.hidden; next = next.nextElementSibling; }
        heading.hidden = !hasItems;
      });
      count += visible;
    });
    if (status) status.textContent = LANG === "en" ? `${count} ${count === 1 ? "service" : "services"} · Prices in MXN` : `${count} ${count === 1 ? "servicio" : "servicios"} · Precios en MXN`;
    if (empty) empty.hidden = count > 0;
    buttons.forEach((btn) => btn.setAttribute("aria-pressed", String(btn.dataset.filter === filter)));
  };
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      update();
    });
  });
  search?.addEventListener("input", update);
  document.querySelector("[data-service-reset]")?.addEventListener("click", () => {
    filter = "all";
    if (search) search.value = "";
    update();
    search?.focus();
  });
  const revealAnchor = () => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target?.closest(".svc-group")) return;
    filter = "all";
    if (search) search.value = "";
    update();
    target.scrollIntoView({ block: "start", behavior: "instant" });
  };
  window.addEventListener("hashchange", revealAnchor);
  update();
  if (location.hash) revealAnchor();
}

/* ---------- Today highlight on every hours table (one per branch) ---------- */
const salonNow = new Date();
const today = String(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
  new Intl.DateTimeFormat("en-US", { timeZone: "America/Mexico_City", weekday: "short" }).format(salonNow)
));
document.querySelectorAll("[data-hours] .hours-row").forEach((row) => {
  const days = (row.dataset.day || "").split(/\s+/);
  row.classList.toggle("is-today", days.includes(today));
});

/* ---------- Facturación CFDI → WhatsApp (por sucursal) ---------- */
const cfdiForm = document.querySelector("[data-cfdi-form]");
if (cfdiForm) {
  /* Persona física: 4 letras + 6 dígitos + 3 (homoclave). Moral: 3 letras. */
  const RFC_RE = /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/;
  const rfc = cfdiForm.querySelector("[data-rfc]");
  const rfcHint = cfdiForm.querySelector("[data-rfc-hint]");
  const dateInput = cfdiForm.querySelector("[data-cfdi-date]");
  const success = cfdiForm.querySelector("[data-cfdi-success]");
  const branchNumber = () =>
    cfdiForm.querySelector("input[name='sucursal']:checked")?.dataset.wa || "525568856070";

  /* no se puede facturar un servicio futuro */
  if (dateInput) dateInput.max = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit" }).format(salonNow);

  rfc?.addEventListener("input", () => {
    rfc.value = rfc.value.toUpperCase().replace(/[^A-ZÑ&\d]/g, "");
    const bad = rfc.value.length > 0 && !RFC_RE.test(rfc.value);
    rfc.setCustomValidity(bad ? T.rfcInvalid : "");
    if (rfcHint) rfcHint.textContent = bad ? T.rfcInvalid : "";
  });

  /* Endpoint que timbra (Cloudflare Worker). Si viene vacío o sin sustituir,
     el formulario cae al modo WhatsApp: solicitud manual. */
  const rawEndpoint = cfdiForm.dataset.endpoint || "";
  const endpoint = rawEndpoint.startsWith("http") ? rawEndpoint : "";
  const submitBtn = cfdiForm.querySelector("button[type='submit']");

  /* La copy de la página describe el flujo real: timbrado o solicitud */
  document.querySelectorAll('[data-flow="wa"]').forEach((el) => (el.hidden = Boolean(endpoint)));
  document.querySelectorAll('[data-flow="auto"]').forEach((el) => (el.hidden = !endpoint));

  if (endpoint && submitBtn) submitBtn.innerHTML = `${T.cfdiSend} <span class="arrow">→</span>`;

  cfdiForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!cfdiForm.reportValidity()) return;

    const data = new FormData(cfdiForm);
    const L = T.cfdiLabels;
    const fecha = new Date(`${data.get("fecha")}T12:00:00`).toLocaleDateString(T.locale, {
      day: "numeric", month: "long", year: "numeric",
    });
    const monto = Number(data.get("monto")).toLocaleString(T.locale, {
      style: "currency", currency: "MXN",
    });
    const comentarios = String(data.get("comentarios") || "").trim();

    const message = [
      T.cfdiTitle(data.get("sucursal")),
      "",
      `${L.fecha}: ${fecha}`,
      `${L.folio}: ${data.get("folio")}`,
      `${L.monto}: ${monto}`,
      `${L.formaPago}: ${data.get("formaPago")}`,
      "",
      `${L.rfc}: ${data.get("rfc")}`,
      `${L.razonSocial}: ${data.get("razonSocial")}`,
      `${L.regimen}: ${data.get("regimen")}`,
      `${L.usoCfdi}: ${data.get("usoCfdi")}`,
      `${L.cp}: ${data.get("cp")}`,
      `${L.correo}: ${data.get("correo")}`,
      comentarios ? `${L.comentarios}: ${comentarios}` : null,
      "",
      T.cfdiFooter,
    ].filter((line) => line !== null).join("\n");

    const waUrl = `https://wa.me/${branchNumber()}?text=${encodeURIComponent(message)}`;

    /* Sin endpoint configurado: comportamiento anterior (solicitud) */
    if (!endpoint) {
      if (success) {
        const fallback = success.querySelector("[data-wa-fallback]");
        if (fallback) fallback.href = waUrl;
        success.hidden = false;
      }
      window.open(waUrl, "_blank", "noopener");
      return;
    }

    /* Con endpoint: se timbra de verdad contra el PAC */
    const payload = Object.fromEntries(data.entries());
    const original = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = T.cfdiSending;
    }

    fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => ({ ok: res.ok, body: await res.json().catch(() => ({})) }))
      .then(({ ok, body }) => {
        if (ok && body.ok) {
          cfdiForm.querySelectorAll("fieldset, .form-note").forEach((el) => (el.hidden = true));
          if (submitBtn) submitBtn.hidden = true;
          if (success) {
            success.querySelector("h2").innerHTML = T.cfdiOkTitle;
            success.querySelector("p").innerHTML = T.cfdiOkBody(
              escapeHtml(body.uuid),
              body.emailed,
              escapeHtml(payload.correo)
            );
            success.hidden = false;
            success.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          return;
        }
        /* Error del SAT/PAC: mostramos el motivo y ofrecemos WhatsApp */
        if (success) {
          success.querySelector("h2").innerHTML = T.cfdiFailTitle;
          success.querySelector("p").innerHTML =
            `${escapeHtml(body.error || (LANG === "en" ? "Unknown error." : "Error desconocido."))} <a href="${waUrl}" target="_blank" rel="noopener">${T.cfdiFailWa}</a>`;
          success.hidden = false;
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = original;
        }
      })
      .catch(() => {
        if (success) {
          success.querySelector("h2").innerHTML = T.cfdiFailTitle;
          success.querySelector("p").innerHTML =
            `<a href="${waUrl}" target="_blank" rel="noopener">${T.cfdiFailWa}</a>`;
          success.hidden = false;
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = original;
        }
      });
  });
}
