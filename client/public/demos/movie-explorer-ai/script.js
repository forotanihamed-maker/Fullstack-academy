/* =========================================================
   Movie Explorer — OMDb search app
   Pure vanilla JS: fetch, async/await, AbortController, debounce
   ========================================================= */

const API_BASE = "https://www.omdbapi.com/";
const API_KEY = "12012f4d"; // free OMDb key (client-side demo project)

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 500;
const SKELETON_COUNT = 8;

/* Inline SVG fallback so the app never depends on a placeholder service */
const FALLBACK_POSTER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
       <rect width="300" height="450" fill="#1b2130"/>
       <circle cx="150" cy="200" r="46" fill="none" stroke="#3a445c" stroke-width="8"/>
       <circle cx="150" cy="200" r="12" fill="#3a445c"/>
       <text x="150" y="300" fill="#7f8ba4" font-family="Segoe UI, sans-serif" font-size="18"
             text-anchor="middle">No poster</text>
     </svg>`,
  );

/* =========================================================
   Small utilities
   ========================================================= */
const $ = (selector) => document.querySelector(selector);

/** Escape text coming from the API before inserting it as HTML. */
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** "N/A" and empty values become a dash in the details view. */
function orDash(value) {
  return !value || value === "N/A" ? "—" : value;
}

function posterUrl(poster) {
  return poster && poster !== "N/A" ? poster : FALLBACK_POSTER;
}

function debounce(fn, delay) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
}

/* =========================================================
   API layer
   ========================================================= */
class ApiError extends Error {
  constructor(message, type) {
    super(message);
    this.name = "ApiError";
    this.type = type; // "network" | "http" | "api"
  }
}

async function apiGet(params, signal) {
  const url = new URL(API_BASE);
  url.searchParams.set("apikey", API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  let response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError("Network error — check your connection and try again.", "network");
  }

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}.`, "http");
  }

  const data = await response.json();

  // OMDb reports logical errors in the body with a 200 status.
  if (data.Response === "False") {
    throw new ApiError(data.Error || "Unknown API error.", "api");
  }

  return data;
}

const searchMovies = (query, signal) => apiGet({ s: query }, signal);

const getMovieDetails = (imdbID, signal) =>
  apiGet({ i: imdbID, plot: "full" }, signal);

/* =========================================================
   DOM references
   ========================================================= */
const headerForm = $("#header-search");
const headerInput = $("#header-input");
const heroForm = $("#hero-search");
const heroInput = $("#hero-input");

const grid = $("#grid");
const statusEl = $("#status");
const resultsCount = $("#results-count");
const resultsSection = $("#results");

const modal = $("#modal");
const modalCard = $("#modal-card");
const modalBody = $("#modal-body");
const modalCloseBtn = $("#modal-close");

/* =========================================================
   App state
   ========================================================= */
const state = {
  searchController: null,
  detailsController: null,
  lastFocusedElement: null,
};

/* =========================================================
   Status messages
   ========================================================= */
function clearStatus() {
  statusEl.hidden = true;
  statusEl.className = "status";
  statusEl.innerHTML = "";
}

function showStatus({ icon, title, text, variant = "" }) {
  statusEl.hidden = false;
  statusEl.className = `status ${variant}`.trim();
  statusEl.innerHTML = `
    ${icon ? `<span class="status-icon" aria-hidden="true">${icon}</span>` : ""}
    ${title ? `<h3 class="status-title">${escapeHtml(title)}</h3>` : ""}
    ${text ? `<p class="status-text">${text}</p>` : ""}
  `;
}

function showEmpty(query) {
  showStatus({
    icon: "🎬",
    title: "No matches found",
    text: `Nothing matched “<strong>${escapeHtml(query)}</strong>”.
           Check the spelling or try a different keyword.`,
  });
}

function showTooMany() {
  showStatus({
    icon: "🔎",
    title: "Too many results",
    text: "That search matches a lot of titles. Add a word or two to narrow it down.",
  });
}

function showError(error) {
  showStatus({
    icon: "⚠️",
    title: "Something went wrong",
    text: escapeHtml(error.message),
    variant: "is-error",
  });
}

/* =========================================================
   Grid rendering
   ========================================================= */
function renderSkeletons(count = SKELETON_COUNT) {
  clearStatus();
  resultsCount.textContent = "";
  grid.setAttribute("aria-busy", "true");
  grid.innerHTML = Array.from({ length: count })
    .map(
      () => `
        <div class="skeleton" aria-hidden="true">
          <div class="skeleton-poster"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>`,
    )
    .join("");
}

function renderMovies(movies, query) {
  grid.setAttribute("aria-busy", "false");
  grid.innerHTML = "";

  const fragment = document.createDocumentFragment();

  movies.forEach((movie) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.dataset.id = movie.imdbID;
    card.setAttribute("aria-label", `${movie.Title} (${movie.Year}) — view details`);

    card.innerHTML = `
      <span class="card-poster">
        <img src="${escapeHtml(posterUrl(movie.Poster))}"
             alt="Poster for ${escapeHtml(movie.Title)}" loading="lazy" />
        <span class="badge-type">${escapeHtml(movie.Type || "title")}</span>
      </span>
      <span class="card-body">
        <span class="card-title">${escapeHtml(movie.Title)}</span>
        <span class="card-year">${escapeHtml(movie.Year)}</span>
      </span>
    `;

    const img = card.querySelector("img");
    img.addEventListener(
      "error",
      () => {
        img.src = FALLBACK_POSTER;
      },
      { once: true },
    );

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);

  const total = Number(movies.length);
  resultsCount.innerHTML = `<strong>${total}</strong> result${total === 1 ? "" : "s"} for “${escapeHtml(query)}”`;
}

/* =========================================================
   Details modal
   ========================================================= */
function detailsTemplate(movie) {
  const genres = (movie.Genre && movie.Genre !== "N/A" ? movie.Genre : "")
    .split(",")
    .filter(Boolean)
    .map((genre) => `<span class="badge">${escapeHtml(genre.trim())}</span>`)
    .join("");

  const rating =
    movie.imdbRating && movie.imdbRating !== "N/A"
      ? `<span class="badge badge-rating">★ ${escapeHtml(movie.imdbRating)} / 10</span>`
      : "";

  return `
    <div class="modal-poster">
      <img src="${escapeHtml(posterUrl(movie.Poster))}"
           alt="Poster for ${escapeHtml(movie.Title)}" />
    </div>

    <div class="modal-content">
      <h2 class="modal-title" id="modal-title">${escapeHtml(movie.Title)}</h2>

      <div class="modal-meta">
        <span>${escapeHtml(orDash(movie.Year))}</span>
        <span class="dot">•</span>
        <span>${escapeHtml(orDash(movie.Runtime))}</span>
        <span class="dot">•</span>
        <span>${escapeHtml(orDash(movie.Rated))}</span>
      </div>

      <div class="modal-badges">
        ${rating}
        ${genres}
      </div>

      <dl class="spec">
        <dt>Director</dt>
        <dd>${escapeHtml(orDash(movie.Director))}</dd>
        <dt>Actors</dt>
        <dd>${escapeHtml(orDash(movie.Actors))}</dd>
        <dt>Released</dt>
        <dd>${escapeHtml(orDash(movie.Released))}</dd>
        <dt>Box office</dt>
        <dd>${escapeHtml(orDash(movie.BoxOffice))}</dd>
      </dl>

      <p class="plot">${escapeHtml(orDash(movie.Plot))}</p>
    </div>
  `;
}

function openModalShell() {
  state.lastFocusedElement = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modalCloseBtn.focus();
}

function closeModal() {
  if (modal.hidden) return;

  state.detailsController?.abort();
  state.detailsController = null;

  modal.hidden = true;
  modalBody.innerHTML = "";
  document.body.style.overflow = "";

  if (state.lastFocusedElement instanceof HTMLElement) {
    state.lastFocusedElement.focus();
  }
  state.lastFocusedElement = null;
}

async function openDetails(imdbID, trigger) {
  state.lastFocusedElement = trigger ?? document.activeElement;

  state.detailsController?.abort();
  const controller = new AbortController();
  state.detailsController = controller;

  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modalBody.innerHTML = `
    <div class="modal-loading">
      <div class="spinner"></div>
      <p>Loading details…</p>
    </div>`;
  modalCloseBtn.focus();

  try {
    const movie = await getMovieDetails(imdbID, controller.signal);
    if (controller.signal.aborted) return;

    modalBody.innerHTML = detailsTemplate(movie);

    const poster = modalBody.querySelector(".modal-poster img");
    poster?.addEventListener(
      "error",
      () => {
        poster.src = FALLBACK_POSTER;
      },
      { once: true },
    );
  } catch (error) {
    if (error.name === "AbortError") return;
    modalBody.innerHTML = `
      <div class="modal-loading">
        <span class="status-icon" aria-hidden="true">⚠️</span>
        <p>${escapeHtml(error.message)}</p>
      </div>`;
  }
}

/** Keep Tab / Shift+Tab inside the open dialog. */
function trapFocus(event) {
  if (event.key !== "Tab" || modal.hidden) return;

  const focusables = modalCard.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  if (!focusables.length) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/* =========================================================
   Search flow
   ========================================================= */
async function runSearch(rawQuery, { scroll = false } = {}) {
  const query = rawQuery.trim();

  if (query.length < MIN_QUERY_LENGTH) {
    if (query.length === 1) {
      showStatus({
        icon: "✏️",
        title: "Keep typing",
        text: `Type at least ${MIN_QUERY_LENGTH} characters to search.`,
      });
    }
    return;
  }

  /* Cancel any search still in flight so an older response
     can never overwrite a newer one. */
  state.searchController?.abort();
  const controller = new AbortController();
  state.searchController = controller;

  renderSkeletons();
  if (scroll) {
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  try {
    const data = await searchMovies(query, controller.signal);
    if (controller.signal.aborted) return;

    renderMovies(data.Search ?? [], query);
  } catch (error) {
    if (error.name === "AbortError") return;

    grid.innerHTML = "";
    grid.setAttribute("aria-busy", "false");
    resultsCount.textContent = "";

    if (error.type === "api" && /too many results/i.test(error.message)) {
      showTooMany();
    } else if (error.type === "api" && /not found/i.test(error.message)) {
      showEmpty(query);
    } else {
      showError(error);
    }
  }
}

/* =========================================================
   Events
   ========================================================= */
headerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runSearch(headerInput.value, { scroll: true });
});

heroForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runSearch(heroInput.value, { scroll: true });
});

const debouncedLiveSearch = debounce(() => {
  runSearch(headerInput.value);
}, DEBOUNCE_MS);

headerInput.addEventListener("input", debouncedLiveSearch);

/* One listener for every card (event delegation). */
grid.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (!card || !grid.contains(card)) return;

  const imdbID = card.dataset.id;
  if (imdbID) openDetails(imdbID, card);
});

/* Close on backdrop, close button, or Esc. */
modal.addEventListener("click", (event) => {
  if (event.target.hasAttribute("data-close")) closeModal();
});

modalCloseBtn.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    closeModal();
    return;
  }
  trapFocus(event);
});

