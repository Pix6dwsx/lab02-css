let visibleCount = 4;
let allItems = [];

const FAVORITES_KEY = "catalogFavorites";

document.addEventListener("DOMContentLoaded", init);

async function init() {
  const container = document.querySelector("[data-catalog]");
  const searchInput = document.getElementById("search");
  const categorySelect = document.getElementById("category");
  const sortSelect = document.getElementById("sort");
  const loadMoreBtn = document.querySelector(".load-more");

  if (!container) return;

  try {
    container.textContent = "Завантаження...";

    const response = await fetch("../data/items.json");
    if (!response.ok) throw new Error();

    allItems = await response.json();

    const getFilteredItems = () => {
      let result = [...allItems];

      const searchValue = searchInput.value.toLowerCase();
      const categoryValue = categorySelect.value;
      const sortValue = sortSelect.value;

      if (searchValue) {
        result = result.filter(item =>
          item.title.toLowerCase().includes(searchValue) ||
          item.description.toLowerCase().includes(searchValue)
        );
      }

      if (categoryValue !== "all") {
        result = result.filter(item => item.category === categoryValue);
      }

      if (sortValue === "price") {
        result.sort((a, b) => a.price - b.price);
      }

      return result;
    };

    const updateUI = () => {
      const result = getFilteredItems();

      visibleCount = 4;

      if (!result.length) {
        container.textContent = "Нічого не знайдено";
        if (loadMoreBtn) loadMoreBtn.style.display = "none";
        return;
      }

      renderCards(result);
    };

    searchInput.addEventListener("input", updateUI);
    categorySelect.addEventListener("change", updateUI);
    sortSelect.addEventListener("change", updateUI);

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        visibleCount += 4;
        renderCards(getFilteredItems());
      });
    }

    updateUI();

  } catch {
    container.textContent = "Помилка завантаження даних";
  }
}

function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
}

function toggleFavorite(id) {
  const favorites = getFavorites();
  const updated = favorites.includes(id)
    ? favorites.filter(f => f !== id)
    : [...favorites, id];

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

function renderCards(items) {
  const container = document.querySelector("[data-catalog]");
  const loadMoreBtn = document.querySelector(".load-more");
  const favorites = getFavorites();

  container.innerHTML = "";

  items.slice(0, visibleCount).forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    const isFav = favorites.includes(item.id);

    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <p><strong>Категорія:</strong> ${item.category}</p>
      <p><strong>Ціна:</strong> $${item.price}</p>
      <button class="details-btn" data-id="${item.id}">Деталі</button>
      <button class="fav-btn" data-id="${item.id}">
        ${isFav ? "❤️ В обраному" : "🤍 В обране"}
      </button>
    `;

    container.appendChild(card);
  });

  document.querySelectorAll(".fav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      toggleFavorite(Number(btn.dataset.id));
      renderCards(items);
    });
  });

  initModal(items);

  if (loadMoreBtn) {
    loadMoreBtn.style.display = visibleCount >= items.length ? "none" : "inline-block";
  }
}

function initModal(items) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const closeBtn = document.getElementById("close-modal");

  if (!modal || !modalBody || !closeBtn) return;

  document.querySelectorAll(".details-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = items.find(i => i.id === Number(btn.dataset.id));

      modalBody.innerHTML = `
        <h2>${item.title}</h2>
        <p>${item.description}</p>
        <p><strong>Категорія:</strong> ${item.category}</p>
        <p><strong>Ціна:</strong> $${item.price}</p>
        <p><strong>Рейтинг:</strong> ${item.rating}</p>
      `;

      modal.classList.remove("hidden");
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
}