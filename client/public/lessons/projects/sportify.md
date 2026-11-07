# Sportify — فروشگاه تجهیزات ورزشی بدون Backend

> **سطح:** متوسط  
> **مرحله:** JavaScript / DOM / localStorage  
> **زمان پیشنهادی:** ۵ تا ۸ روز  
> **پیش‌نیاز:** فصل‌های ۱ تا ۳ جاوااسکریپت (آرایه‌ها، DOM، Event، localStorage)

## هدف

ساخت یک فروشگاه کامل سمت مرورگر که محصولات را از یک آرایه‌ی JavaScript نشان می‌دهد، جستجو و فیلتر دارد و سبد خرید را در `localStorage` نگه می‌دارد.

**چیزی که با این پروژه یاد می‌گیری:** JavaScript را از حالت «صرفاً Syntax» خارج می‌کنی و وارد ساخت قابلیت‌های واقعی می‌شوی.

## قابلیت‌ها

- نمایش محصولات از یک آرایه‌ی JavaScript
- جستجو (Search)
- فیلتر دسته‌بندی (Category Filter)
- **ترکیب** جستجو و فیلتر (هر دو همزمان اعمال شوند)
- مودال جزئیات محصول (Product Details Modal)
- افزودن به سبد (Add to Cart)
- حذف از سبد (Remove from Cart)
- خالی کردن سبد (Clear Cart)
- محاسبه‌ی مجموع (Total)
- ذخیره‌ی سبد در `localStorage` و حفظ آن بعد از Refresh
- Event Delegation
- استفاده از `map`، `filter`، `find` و سایر متدهای آرایه
- رابط Responsive

## مدل داده

```js
const products = [
  {
    id: 1,
    name: "Yoga Mat",
    category: "yoga",
    price: 450000,
    image: "images/yoga-mat.jpg",
    description: "تشک ضدلغزش با ضخامت ۶ میلی‌متر"
  }
  // ...
];
```

**سبد خرید** فقط شناسه و تعداد را نگه می‌دارد، نه کپی کامل محصول:

```js
let cart = [
  { id: 1, qty: 2 },
  { id: 3, qty: 1 }
];
```

> **قاعده:** مقدارهای «قابل‌محاسبه» (مثل Total یا تعداد کل) را **ذخیره نکن**؛ هر بار از روی `cart` و `products` محاسبه کن (`reduce`). یک منبع حقیقت (Single Source of Truth)، باگ کمتر.

## ساختار پیشنهادی

```text
sportify/
├── index.html
├── css/style.css
└── js/
    ├── data.js        ← آرایه‌ی محصولات
    ├── storage.js     ← loadCart / saveCart
    ├── cart.js        ← addToCart، removeFromCart، clearCart، getTotal
    ├── products.js    ← getVisibleProducts
    ├── render.js      ← renderProducts، renderCart، openModal
    └── main.js        ← اتصال Event ها
```

(می‌توانی همه را در یک فایل شروع کنی و بعد با `import` / `export` ماژولار کنی.)

## کلید اصلی: ترکیب Search و Filter

```js
function getVisibleProducts(products, { query, category }) {
  const q = query.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    const matchesQuery = product.name.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });
}
```

## Event Delegation

به‌جای ثبت Listener روی هر دکمه، یک Listener روی والد:

```js
productList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);

  if (button.dataset.action === "add") addToCart(id);
  if (button.dataset.action === "details") openModal(id);
});
```

```html
<button data-action="add" data-id="1">افزودن به سبد</button>
```

## ذخیره‌سازی امن در localStorage

```js
const CART_KEY = "sportify:cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];                  // داده‌ی خراب یا storage غیرفعال
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    /* ذخیره نشد؛ برنامه باید ادامه بدهد */
  }
}
```

## مودال جزئیات

از `<dialog>` استفاده کن (فصل HTML پیشرفته): `showModal()` برای باز کردن، دکمه‌ی بستن با `form method="dialog"`، و بسته‌شدن با `Esc` خودکار است. محصول را با `products.find(...)` بر اساس `id` پیدا کن.

## محدودیت‌ها

- بدون فریم‌ورک، بدون کتابخانه
- هیچ داده‌ی ورودی کاربر (مثل عبارت جستجو) نباید مستقیم داخل `innerHTML` برود
- تغییر `cart` فقط از طریق توابع مشخص (`addToCart` و ...) انجام شود
- قیمت‌ها با `Intl.NumberFormat` فرمت شوند

## معیار قبولی

- جستجو و فیلتر دسته‌بندی همزمان درست کار می‌کنند (مثلاً دسته‌ی «یوگا» + جستجوی «mat»)
- افزودن چند بار یک محصول، **تعداد** را زیاد می‌کند (ردیف تکراری نمی‌سازد)
- Total همیشه با محتوای سبد هم‌خوان است
- بعد از Refresh سبد سر جایش است
- اگر `localStorage` را در DevTools خراب کنی (مثلاً مقدار `abc`)، برنامه خطا نمی‌دهد و سبد خالی می‌شود
- فقط با کیبورد می‌توانی محصول اضافه کنی و مودال را باز و بسته کنی
- هیچ خطایی در Console نیست

## چک‌لیست بازبینی (Review)

- [ ] `cart` فقط `id` و `qty` دارد و Total ذخیره نشده است
- [ ] هیچ کدی دو بار (در جستجو و در فیلتر) تکرار نشده است
- [ ] حالت «محصولی پیدا نشد» (Empty State) نمایش داده می‌شود
- [ ] دکمه‌ها `<button>` هستند و برچسب مناسب دارند
- [ ] تعداد نمی‌تواند منفی یا صفر شود
- [ ] بعد از هر تغییر سبد، هم UI و هم Storage به‌روز می‌شود

## چالش‌های اختیاری

- دکمه‌های `+` و `-` برای تغییر تعداد
- مرتب‌سازی (قیمت، نام)
- علاقه‌مندی‌ها (Favorites) با `localStorage`
- کد تخفیف
- نمایش اعداد و قیمت فارسی با `Intl.NumberFormat("fa-IR")`

---

## نمونه‌ی زنده و بازبینی کد

[باز کردن نمونه‌ی زنده‌ی بازبینی‌شده](/demos/sportify/index.html)

این نمونه، کد واقعی پروژه‌ی Sportify است که بازبینی، بازنویسی بخش‌های ضعیف و با تست مرورگر (Chromium) بررسی شده است. (در فایل zip پروژه تصاویر محصولات نبودند؛ برای نمونه‌ی زنده تصویرهای SVG جایگزین ساخته شد. در پروژه‌ی خودت تصاویر واقعی بگذار.)

### نقاط قوت

- کد در یک فایل با بخش‌بندی روشن و کامنت‌های گویا
- CSS Variables و `:focus-visible` برای دکمه‌ها
- Event Delegation برای کارت‌ها
- `hidden` برای حالت «محصولی پیدا نشد»
- ترکیب جستجو و فیلتر دسته‌بندی، مودال جزئیات و ذخیره‌ی سبد

### مشکل‌های پیداشده و اصلاح‌ها

| مشکل | چرا مهم است | اصلاح |
|------|-------------|-------|
| سبد، **کپی کامل** محصول را نگه می‌داشت و تعداد نداشت | دو بار افزودن = دو ردیف؛ قیمت قدیمی در سبد می‌ماند | سبد فقط `{ id, qty }`؛ نام و قیمت از `products` خوانده می‌شود؛ دکمه‌های `+` و `−` |
| دو منبع حقیقت: `carts` در حافظه و خواندن دوباره از `localStorage` در `renderCart` | ناهماهنگی بین حافظه و Storage | یک State و یک تابع `commitCart()` که هم ذخیره و هم UI را به‌روز می‌کند |
| `JSON.parse` بدون `try` / `catch` | اگر مقدار `localStorage` خراب شود، کل اسکریپت متوقف می‌شود (صفحه خالی) | `loadCart` امن و اعتبارسنجی هر ردیف |
| `==` و مقایسه‌ی `id` رشته‌ای (از `dataset`) با عدد | باگ‌های تایپی ظریف | `Number()` و `===` |
| `event.target.classList.contains(...)` | اگر کلیک روی فرزند دکمه بخورد کار نمی‌کند | `event.target.closest("[data-action]")` |
| مودال‌ها: بدون `aria-modal`، بدون عنوان، دکمه‌ی `×` بی‌برچسب، بدون مدیریت فوکوس | کاربر کیبورد و screen reader گم می‌شود (فوکوس به مودال نمی‌رفت، Tab از مودال خارج می‌شد، بعد از بستن به جای قبلی برنمی‌گشت) | `aria-modal`، `aria-labelledby`، `aria-label`، فوکوس اولیه، نگه‌داشتن Tab داخل مودال، `Escape` و بازگشت فوکوس |
| فوکوس اولیه کار نمی‌کرد | `visibility` مودال با transition در لحظه‌ی صفر هنوز `hidden` است و `focus()` شکست می‌خورد | `.overlay.active { transition: ..., visibility 0s }` |
| جستجو و Select بدون `<label>`؛ گزینه‌ها با حرف کوچک | screen reader نمی‌داند فیلد چیست | `label` (کلاس `sr-only`) و متن گزینه‌ها اصلاح شد |
| دکمه‌ی Cart دارای `aria-label` متفاوت با متن قابل‌دیدن | نام دسترس‌پذیر باید شامل متن دیده‌شده باشد | `aria-label` حذف شد |
| تصویر جزئیات بدون `alt` | | `alt` = نام محصول |
| تغییر سبد در تب دیگر هماهنگ نمی‌شد | | رویداد `storage` |
| کنتراست: دکمه‌ها `#4d8bff` (۳.۲۵) و متن خطا `#e74c3c` (۳.۸۲) | زیر ۴.۵ | `#1e5eff` (۵.۱۲) و `#c0392b` (۵.۴۴) |
| بدون `font-family` | فونت Serif پیش‌فرض | Font Stack و `body { font-size: 1.6rem }` |
| لینک‌های About و Contact مقصد نداشتند و `<footer>` خالی بود | لینک شکسته | Footer با `id="about"` و `id="contact"` |
| نام‌های `carts` (جمع برای یک سبد) | | `cart` |
| تصاویر بدون `width` / `height` / `lazy` | پرش صفحه | اضافه شد |

### تغییر ساختار مهم

```js
// قبل: کپی کامل محصول در سبد
cart.push(product);

// بعد: فقط شناسه و تعداد، همه‌چیز دیگر از products خوانده می‌شود
cart = cart.some((l) => l.id === id)
  ? cart.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l))
  : [...cart, { id, qty: 1 }];
```

### نکته‌هایی که تصمیمش با خودت است

- نام کلاس‌های CSS مثل `sabad-*` انتقال فارسی به انگلیسی است؛ برای هماهنگی با `cart` در JS به `cart-*` تغییرشان بده.
- برای ساخت HTML با داده‌ی محلی `innerHTML` با Escape مشکلی ندارد؛ ولی اگر بعداً داده از سرور یا کاربر بیاید، `escapeHTML` یا `createElement` لازم است (در نمونه همین‌طور نوشته شده).
- با یادگیری `<dialog>` می‌توانی مودال‌ها را ساده‌تر و بدون Trap دستی بسازی.

### درس‌هایی که به پروژه‌های بعدی منتقل می‌شود

- State را کوچک نگه دار (`id` و `qty`) و بقیه را محاسبه کن
- هر `JSON.parse` از Storage باید `try` / `catch` و اعتبارسنجی داشته باشد
- هر مودال باید فوکوس را جابه‌جا کند و بعد از بسته شدن برگرداند
