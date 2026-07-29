document.documentElement.classList.remove("no-js");

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const bookingDialog = document.querySelector("[data-booking-dialog]");
const bookingForm = document.querySelector("[data-booking-form]");
const bookingSuccess = document.querySelector("[data-booking-success]");

const syncHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
const closeMenu = () => {
  menuToggle?.setAttribute("aria-expanded", "false");
  nav?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  nav?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});
nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.querySelectorAll("[data-open-booking]").forEach((button) => {
  button.addEventListener("click", () => {
    closeMenu();
    if (typeof bookingDialog?.showModal === "function") {
      bookingDialog.showModal();
      document.body.classList.add("dialog-open");
      bookingDialog.querySelector("input")?.focus();
    }
  });
});

document.querySelectorAll("[data-close-booking]").forEach((button) => button.addEventListener("click", () => bookingDialog?.close()));
bookingDialog?.addEventListener("click", (event) => { if (event.target === bookingDialog) bookingDialog.close(); });
bookingDialog?.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  window.setTimeout(() => {
    bookingForm?.removeAttribute("hidden");
    if (bookingSuccess) bookingSuccess.hidden = true;
  }, 250);
});
bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  bookingForm.hidden = true;
  if (bookingSuccess) bookingSuccess.hidden = false;
  bookingForm.reset();
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();
