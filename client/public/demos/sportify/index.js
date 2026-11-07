/* =========================================================
   ۱. داده‌ها و State
========================================================= */

// ----- داده‌ی محصولات -----
const products = [
  {
    id: 1,
    name: "Running Shoes",
    price: 89,
    category: "shoes",
    image: "./images/running-shoes.svg",
    description: "Lightweight shoes built for speed and comfort.",
  },
  {
    id: 2,
    name: "Trail Sneakers",
    price: 120,
    category: "shoes",
    image: "./images/trail-sneakers.svg",
    description: "Durable grip for off-road running.",
  },
  {
    id: 3,
    name: "Adjustable Dumbbells",
    price: 150,
    category: "equipment",
    image: "./images/dumbbells.svg",
    description: "Space-saving dumbbells, 5 to 25kg.",
  },
  {
    id: 4,
    name: "Yoga Mat",
    price: 35,
    category: "equipment",
    image: "./images/yoga-mat.svg",
    description: "Non-slip mat for yoga and stretching.",
  },
  {
    id: 5,
    name: "Sports Bag",
    price: 45,
    category: "accessories",
    image: "./images/sports-bag.svg",
    description: "Roomy gym bag with shoe compartment.",
  },
  {
    id: 6,
    name: "Water Bottle",
    price: 18,
    category: "accessories",
    image: "./images/water-bottle.svg",
    description: "Insulated bottle, keeps drinks cold 24h.",
  },
];

// ----- State سبد خرید -----
// سبد فقط شناسه و تعداد را نگه می‌دارد: [{ id: 1, qty: 2 }]
// قیمت و نام همیشه از روی آرایه‌ی products خوانده می‌شود (یک منبع حقیقت)
const CART_KEY = "sportify:cart";

function isValidLine(line) {
  return (
    line &&
    Number.isInteger(line.id) &&
    Number.isInteger(line.qty) &&
    line.qty > 0 &&
    products.some((product) => product.id === line.id)
  );
}

function loadCart() {
  try {
    const data = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(data) ? data.filter(isValidLine) : [];
  } catch {
    return []; // داده‌ی خراب یا storage غیرفعال
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    /* ذخیره نشد؛ برنامه باید ادامه بدهد */
  }
}

let cart = loadCart();

// ----- State فیلتر و جستجو -----
let currentCategory = "all";
let searchTerm = "";

// ----- State مودال -----
let currentProductId = null;
let lastFocused = null; // المانی که قبل از باز شدن مودال فوکوس داشت

/* =========================================================
   ۲. ارجاع به عناصر DOM
========================================================= */

const productsGrid = document.getElementById("products-grid");
const noResults = document.getElementById("no-results");
const searchInput = document.getElementById("search-input");
const selectCategory = document.getElementById("filter");

const cartBtn = document.getElementById("cart-btn");
const cartCount = document.getElementById("cart-count");
const cartStatus = document.getElementById("cart-status");
const overlay = document.getElementById("overlay");
const cartClose = document.getElementById("cart-close");
const sabadItems = document.getElementById("sabad-items");
const sabadTotal = document.getElementById("sabad-total");
const clearBtn = document.getElementById("clear-cart");

const detailsOverlay = document.getElementById("details-overlay");
const detailsClose = document.getElementById("details-close");
const detailsImg = document.getElementById("details-img");
const detailsName = document.getElementById("details-name");
const detailsDesc = document.getElementById("details-desc");
const detailsCategory = document.getElementById("details-category");
const detailsPrice = document.getElementById("details-price");
const detailsAdd = document.getElementById("details-add");

/* =========================================================
   ۳. توابع کمکی
========================================================= */

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

// هر داده‌ای که داخل رشته‌ی HTML می‌رود، یک بار Escape می‌شود
function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const findProduct = (id) => products.find((product) => product.id === id);

// مقدارهای محاسبه‌شده ذخیره نمی‌شوند؛ هر بار از روی cart ساخته می‌شوند
function getCartDetails() {
  return cart.map((line) => ({ product: findProduct(line.id), qty: line.qty }));
}

const getTotal = () =>
  getCartDetails().reduce((sum, { product, qty }) => sum + product.price * qty, 0);

const getCount = () => cart.reduce((sum, line) => sum + line.qty, 0);

function announce(message) {
  cartStatus.textContent = message; // برای screen reader
}

/* =========================================================
   ۴. محصولات: رندر، فیلتر/جستجو، و کلیک‌های داخل کارت
========================================================= */

function renderProducts(list) {
  noResults.hidden = list.length > 0;

  productsGrid.innerHTML = list
    .map(
      (product) => `
      <article class="product-card">
        <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" class="product-img" width="600" height="400" loading="lazy" />
        <div class="product-info">
          <h3>${escapeHTML(product.name)}</h3>
          <span class="product-category">${escapeHTML(product.category)}</span>
          <p class="product-price">${money.format(product.price)}</p>
          <p class="product-desc">${escapeHTML(product.description)}</p>
          <div class="product-actions">
            <button type="button" class="btn-details" data-action="details" data-id="${product.id}">View Details</button>
            <button type="button" class="btn-add" data-action="add" data-id="${product.id}">Add to Cart</button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

// ترکیب جستجو و فیلتر دسته‌بندی
function getVisibleProducts() {
  const query = searchTerm.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory =
      currentCategory === "all" || product.category === currentCategory;
    const matchesSearch = product.name.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
}

function applyFilters() {
  renderProducts(getVisibleProducts());
}

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value;
  applyFilters();
});

selectCategory.addEventListener("change", (event) => {
  currentCategory = event.target.value;
  applyFilters();
});

// Event Delegation: یک Listener برای همه‌ی دکمه‌های کارت‌ها
productsGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);

  if (button.dataset.action === "details") openDetails(id);
  if (button.dataset.action === "add") {
    addToCart(id);
    announce(`${findProduct(id).name} added to cart`);
  }
});

/* =========================================================
   ۵. عملیات سبد خرید (همه با به‌روزرسانی Immutable)
========================================================= */

function commitCart() {
  saveCart();
  cartCount.textContent = getCount();
  if (overlay.classList.contains("active")) renderCart();
}

function addToCart(id) {
  const exists = cart.some((line) => line.id === id);

  cart = exists
    ? cart.map((line) => (line.id === id ? { ...line, qty: line.qty + 1 } : line))
    : [...cart, { id, qty: 1 }];

  commitCart();
}

function changeQty(id, delta) {
  cart = cart
    .map((line) => (line.id === id ? { ...line, qty: line.qty + delta } : line))
    .filter((line) => line.qty > 0); // تعداد صفر یعنی حذف
  commitCart();
}

function removeFromCart(id) {
  cart = cart.filter((line) => line.id !== id);
  commitCart();
}

function clearCart() {
  cart = [];
  commitCart();
}

function renderCart() {
  const lines = getCartDetails();

  clearBtn.disabled = lines.length === 0;

  sabadItems.innerHTML =
    lines.length === 0
      ? '<p class="cart-empty">Your cart is empty.</p>'
      : lines
          .map(
            ({ product, qty }) => `
        <div class="sabad-item">
          <span class="sabad-name">${escapeHTML(product.name)}</span>
          <span class="qty-controls">
            <button type="button" class="qty-btn" data-action="decrease" data-id="${product.id}" aria-label="Decrease quantity of ${escapeHTML(product.name)}">−</button>
            <span class="qty-value">${qty}</span>
            <button type="button" class="qty-btn" data-action="increase" data-id="${product.id}" aria-label="Increase quantity of ${escapeHTML(product.name)}">+</button>
          </span>
          <span class="sabad-price">${money.format(product.price * qty)}</span>
          <button type="button" class="remove" data-action="remove" data-id="${product.id}" aria-label="Remove ${escapeHTML(product.name)} from cart">Remove</button>
        </div>`
          )
          .join("");

  sabadTotal.textContent = `Total: ${money.format(getTotal())}`;
}

// Event Delegation داخل سبد
sabadItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "increase") changeQty(id, 1);
  if (action === "decrease") changeQty(id, -1);
  if (action === "remove") removeFromCart(id);

  // بعد از رندر دوباره، فوکوس را به همان دکمه برگردان (یا به دکمه‌ی بستن)
  const next = sabadItems.querySelector(`[data-action="${action}"][data-id="${id}"]`);
  (next || cartClose).focus();
});

clearBtn.addEventListener("click", () => {
  clearCart();
  cartClose.focus();
});

/* =========================================================
   ۶. مودال‌ها (سبد و جزئیات): باز/بسته، فوکوس، Escape
========================================================= */

function openOverlay(element, focusTarget) {
  lastFocused = document.activeElement;
  element.classList.add("active");
  document.body.style.overflow = "hidden";
  focusTarget.focus(); // کار می‌کند چون .overlay.active فوراً visible می‌شود (CSS)
}

function closeOverlay(element) {
  element.classList.remove("active");

  if (!document.querySelector(".overlay.active")) {
    document.body.style.overflow = "";
  }

  lastFocused?.focus(); // فوکوس را به المان قبلی برگردان
  lastFocused = null;
}

function openCart() {
  renderCart();
  openOverlay(overlay, cartClose);
}

function openDetails(id) {
  const product = findProduct(id);
  currentProductId = id;

  detailsImg.src = product.image;
  detailsImg.alt = product.name;
  detailsName.textContent = product.name;
  detailsDesc.textContent = product.description;
  detailsCategory.textContent = product.category;
  detailsPrice.textContent = money.format(product.price);

  openOverlay(detailsOverlay, detailsClose);
}

cartBtn.addEventListener("click", openCart);
cartClose.addEventListener("click", () => closeOverlay(overlay));
detailsClose.addEventListener("click", () => closeOverlay(detailsOverlay));

// بستن با کلیک روی پس‌زمینه
[overlay, detailsOverlay].forEach((element) => {
  element.addEventListener("click", (event) => {
    if (event.target === element) closeOverlay(element);
  });
});

detailsAdd.addEventListener("click", () => {
  addToCart(currentProductId);
  announce(`${findProduct(currentProductId).name} added to cart`);
});

// یک Listener برای Escape و نگه‌داشتن Tab داخل مودال باز
document.addEventListener("keydown", (event) => {
  const active = document.querySelector(".overlay.active");
  if (!active) return;

  if (event.key === "Escape") {
    closeOverlay(active);
    return;
  }

  if (event.key !== "Tab") return;

  const focusable = [...active.querySelectorAll("button, [href], input, select, textarea")].filter(
    (element) => !element.disabled
  );
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (!active.contains(document.activeElement)) {
    event.preventDefault(); // فوکوس بیرون از مودال است؛ برش گردان
    first.focus();
  } else if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

// اگر سبد در تب دیگری تغییر کرد، همین‌جا هم هماهنگ شود
window.addEventListener("storage", (event) => {
  if (event.key !== CART_KEY) return;
  cart = loadCart();
  cartCount.textContent = getCount();
  if (overlay.classList.contains("active")) renderCart();
});

/* =========================================================
   ۷. شروع برنامه
========================================================= */

cartCount.textContent = getCount();
applyFilters();
