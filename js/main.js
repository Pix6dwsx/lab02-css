document.addEventListener("DOMContentLoaded", init);

function init() {
  initActiveNav();
  initMenuToggle();
  initThemeToggle();
  initBackToTop();
  initYear();
  initContactForm();
  initAccordion();
}

function initActiveNav() {
  const links = document.querySelectorAll("nav a");
  const currentPage = window.location.pathname.split("/").pop();

  links.forEach(link => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (currentPage === linkPage) {
      link.classList.add("active");
    }
  });
}

function initMenuToggle() {
  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");

  if (!button || !nav) return;

  button.addEventListener("click", () => {
    nav.classList.toggle("open");
    button.classList.toggle("active");
  });
}

function initThemeToggle() {
  const button = document.querySelector(".theme-toggle");
  const body = document.body;

  if (!button) return;

  const savedTheme = localStorage.getItem("siteTheme");

  if (savedTheme === "dark") {
    body.classList.add("theme-dark");
    button.textContent = "Light mode";
  } else {
    button.textContent = "Dark mode";
  }

  button.addEventListener("click", () => {
    body.classList.toggle("theme-dark");

    const isDark = body.classList.contains("theme-dark");
    localStorage.setItem("siteTheme", isDark ? "dark" : "light");

    button.textContent = isDark ? "Light mode" : "Dark mode";
  });
}

function initBackToTop() {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 300);
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initYear() {
  const yearEl = document.querySelector(".year");
  if (!yearEl) return;

  yearEl.textContent = new Date().getFullYear();
}

function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const draftKey = "contactDraft";
  const messageInput = form.querySelector('textarea[name="message"]');
  const charCount = form.querySelector(".char-count");

  const saved = JSON.parse(localStorage.getItem(draftKey) || "{}");

  Object.keys(saved).forEach(name => {
    const input = form.querySelector(`[name="${name}"]`);
    if (input) input.value = saved[name];
  });

  if (messageInput && charCount) {
    charCount.textContent = `${messageInput.value.length} / 200`;

    messageInput.addEventListener("input", () => {
      charCount.textContent = `${messageInput.value.length} / 200`;
    });
  }

  form.addEventListener("input", () => {
    const data = new FormData(form);
    const obj = Object.fromEntries(data.entries());
    localStorage.setItem(draftKey, JSON.stringify(obj));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = Object.fromEntries(data.entries());

    let isValid = true;

    clearErrors(form);

    if (!obj.name || obj.name.length < 2) {
      showError(form, "name", "Мінімум 2 символи");
      isValid = false;
    }

    if (!obj.email || !obj.email.includes("@")) {
      showError(form, "email", "Невірний email");
      isValid = false;
    }

    if (!obj.message || obj.message.trim() === "") {
      showError(form, "message", "Введіть повідомлення");
      isValid = false;
    }

    if (!isValid) return;

    const result = document.createElement("div");
    result.className = "card";
    result.innerHTML = `
      <h2>Дані відправлено</h2>
      <p><strong>Ім’я:</strong> ${obj.name}</p>
      <p><strong>Email:</strong> ${obj.email}</p>
      <p><strong>Телефон:</strong> ${obj.phone || "-"}</p>
      <p><strong>Повідомлення:</strong> ${obj.message}</p>
    `;

    form.after(result);

    form.reset();
    localStorage.removeItem(draftKey);

    if (charCount) {
      charCount.textContent = "0 / 200";
    }
  });
}

function showError(form, name, message) {
  const input = form.querySelector(`[name="${name}"]`);
  if (!input) return;

  const error = input.parentElement.querySelector(".error");
  if (error) error.textContent = message;
}

function clearErrors(form) {
  form.querySelectorAll(".error").forEach(el => {
    el.textContent = "";
  });
}

function initAccordion() {
  const items = document.querySelectorAll(".accordion-item");
  if (!items.length) return;

  items.forEach(item => {
    const header = item.querySelector(".accordion-header");
    header.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });
}