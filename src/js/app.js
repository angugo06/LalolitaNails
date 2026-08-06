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

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

/* ---------- Header: blur on scroll, hide on scroll down ---------- */
const header = document.querySelector("[data-header]");
let lastScrollY = window.scrollY;

const syncHeader = () => {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 24);
  if (!document.body.classList.contains("menu-open")) {
    header?.classList.toggle("is-hidden", y > 420 && y > lastScrollY);
  }
  lastScrollY = y;
};
window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

/* ---------- Fullscreen menu ---------- */
const menuToggle = document.querySelector("[data-menu-toggle]");
const menuOverlay = document.querySelector("[data-menu-overlay]");

const setMenu = (open) => {
  menuToggle?.setAttribute("aria-expanded", String(open));
  menuOverlay?.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
  if (open) header?.classList.remove("is-hidden");
};

menuToggle?.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});
menuOverlay?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuOverlay?.classList.contains("is-open")) setMenu(false);
});

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

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

/* ---------- Polish try-on ---------- */
const tryonStage = document.querySelector("[data-tryon-stage]");
if (tryonStage) {
  const label = document.querySelector("[data-tryon-label]");
  const swatches = document.querySelectorAll(".swatch");
  swatches.forEach((sw) => {
    sw.addEventListener("click", () => {
      swatches.forEach((s) => s.setAttribute("aria-pressed", "false"));
      sw.setAttribute("aria-pressed", "true");
      tryonStage.style.setProperty("--polish", sw.dataset.polish);
      if (label) {
        label.innerHTML = `<strong>${sw.dataset.name}</strong><span>${sw.dataset.desc}</span>`;
      }
      tryonStage.classList.remove("is-swiped");
      void tryonStage.offsetWidth; /* restart the shine animation */
      tryonStage.classList.add("is-swiped");
    });
  });
}

/* ---------- Animated counters ---------- */
const counters = document.querySelectorAll("[data-count]");
if (counters.length) {
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

/* ---------- Testimonials rotator ---------- */
const quoteStage = document.querySelector("[data-quotes]");
if (quoteStage) {
  const items = Array.from(quoteStage.querySelectorAll(".quote-item"));
  const dotsWrap = document.querySelector("[data-quote-dots]");
  let index = 0;
  let timer = null;

  const dots = items.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", T.testimonial(i + 1));
    b.addEventListener("click", () => { show(i); restart(); });
    dotsWrap?.append(b);
    return b;
  });

  const show = (i) => {
    index = i;
    items.forEach((item, j) => item.classList.toggle("is-active", j === i));
    dots.forEach((d, j) => d.setAttribute("aria-selected", String(j === i)));
  };

  const restart = () => {
    if (timer) clearInterval(timer);
    if (!prefersReducedMotion) {
      timer = setInterval(() => show((index + 1) % items.length), 6000);
    }
  };

  quoteStage.addEventListener("pointerenter", () => timer && clearInterval(timer));
  quoteStage.addEventListener("pointerleave", restart);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { if (timer) clearInterval(timer); } else restart();
  });

  show(0);
  restart();
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
  const groups = document.querySelectorAll(".svc-group");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      const filter = btn.dataset.filter;
      groups.forEach((group) => {
        const match = filter === "all" || group.dataset.cat === filter;
        group.classList.toggle("is-filtered-out", !match);
        if (match) {
          group.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
        }
      });
    });
  });

  /* Arriving via anchor (e.g. servicios.html#g-cabello): make sure reveals fire */
  if (location.hash) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }
}

/* ---------- Today highlight on every hours table (one per branch) ---------- */
const today = String(new Date().getDay());
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
  if (dateInput) dateInput.max = new Date().toISOString().split("T")[0];

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
              body.uuid,
              body.emailed,
              payload.correo
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
            `${body.error || "Error desconocido."} <a href="${waUrl}" target="_blank" rel="noopener">${T.cfdiFailWa}</a>`;
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
