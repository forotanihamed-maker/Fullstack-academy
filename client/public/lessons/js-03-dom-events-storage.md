# جاوااسکریپت — فصل ۳: جاوااسکریپت در مرورگر

> **مرحله ۳ از مسیر فول‌استک — بخش «Browser»**
> مباحث این فصل: DOM، Events، Forms، Event Delegation، LocalStorage، SessionStorage
> پیش‌نیاز: فصل ۱ و ۲ (به‌خصوص آرایه‌ها، آبجکت‌ها، Callback و `map/filter/find`)
> زمان پیشنهادی: ۱۰ تا ۱۴ روز

---

## هدف فصل

تا اینجا کدها فقط در Console اجرا می‌شدند. حالا جاوااسکریپت را به **صفحه‌ی وب** وصل می‌کنیم. بعد از این فصل باید بتوانی:

- عناصر صفحه را پیدا کنی، بسازی، تغییر بدهی و حذف کنی
- به کلیک، تایپ، ارسال فرم و ... واکنش نشان بدهی
- فرم را بخوانی و اعتبارسنجی کنی
- با یک Event Listener، لیستی پویا از آیتم‌ها را مدیریت کنی
- داده را در مرورگر ذخیره کنی تا با Refresh از بین نرود

> بعد از این فصل برای اولین بار می‌توانی **اپلیکیشن واقعی** بسازی (Todo، سبد خرید، یادداشت‌برداری).

---

## ۱. DOM چیست؟

مرورگر HTML را می‌خواند و از آن یک **درخت از شیء‌ها** در حافظه می‌سازد. به این درخت **DOM (Document Object Model)** می‌گویند. جاوااسکریپت با DOM کار می‌کند، نه با فایل HTML.

```html
<body>
  <h1 id="title">سلام</h1>
  <ul>
    <li>یک</li>
    <li>دو</li>
  </ul>
</body>
```

درخت:

```
document
└── html
    └── body
        ├── h1#title
        └── ul
            ├── li
            └── li
```

- هر تگ یک **Element** است
- هر متن یک **Text Node** است
- شیء `document` نقطه‌ی شروع همه‌چیز است

### اتصال جاوااسکریپت به صفحه

```html
<body>
  <h1 id="title">سلام</h1>

  <!-- اسکریپت را انتهای body یا با defer بگذار -->
  <script src="app.js" defer></script>
</body>
```

**چرا `defer`؟** اگر اسکریپت قبل از ساخته‌شدن عناصر اجرا شود، آن‌ها را پیدا نمی‌کند (نتیجه: `null`). `defer` یعنی «بعد از خوانده‌شدن کامل HTML اجرا کن». این روش بهتر از گذاشتن اسکریپت در `<head>` بدون `defer` است.

---

## ۲. انتخاب عناصر (Selecting)

### روش‌های مدرن (توصیه می‌شود)

```js
document.querySelector("#title");        // اولین عنصر مطابق (با سلکتور CSS)
document.querySelector(".card");
document.querySelector("ul li");
document.querySelectorAll("li");         // همه‌ی مطابق‌ها → NodeList
```

سلکتورها **دقیقاً همان سلکتورهای CSS** هستند که در بخش CSS یاد گرفتی.

### روش‌های قدیمی‌تر

```js
document.getElementById("title");
document.getElementsByClassName("card");   // HTMLCollection (زنده)
document.getElementsByTagName("li");
```

### ‏NodeList در برابر آرایه

`querySelectorAll` یک **NodeList** برمی‌گرداند، نه آرایه:

```js
const items = document.querySelectorAll("li");

items.length;                 // ✅
items.forEach((li) => {});    // ✅
items.map((li) => {});        // ❌ NodeList متد map ندارد

const arr = [...items];       // تبدیل به آرایه
const arr2 = Array.from(items);
arr.map((li) => li.textContent);  // ✅
```

### اگر عنصر پیدا نشد

```js
const el = document.querySelector("#nope");
console.log(el);              // null
el.textContent = "x";         // ❌ TypeError: Cannot set properties of null
```

> بیشترین خطای مبتدی‌ها در DOM همین است. وقتی `null` می‌گیری: سلکتور را چک کن، و مطمئن شو اسکریپت بعد از HTML اجرا می‌شود (`defer`).

### جستجو در یک بخش

```js
const card = document.querySelector(".card");
const btn = card.querySelector("button");   // فقط داخل card
```

### ‏`closest` و `matches`

```js
btn.closest(".card");        // نزدیک‌ترین والد (یا خودش) که این سلکتور را دارد
btn.matches(".primary");     // آیا خودش این سلکتور را دارد؟ (true/false)
```

`closest` در Event Delegation (بخش ۸) خیلی مهم است.

### پیمایش در درخت (Traversal)

```js
const li = document.querySelector("li");

li.parentElement;            // والد
li.children;                 // فرزندان (فقط Element)
li.firstElementChild;
li.lastElementChild;
li.nextElementSibling;       // خواهر/برادر بعدی
li.previousElementSibling;
```

---

## ۳. خواندن و تغییر محتوا

### ‏`textContent` / `innerText` / `innerHTML`

```js
const title = document.querySelector("#title");

title.textContent;                  // خواندن متن
title.textContent = "عنوان جدید";   // تغییر متن (امن)

title.innerHTML = "<em>سلام</em>";  // HTML را تفسیر می‌کند (خطرناک!)
```

| ویژگی | رفتار | امنیت |
|-------|-------|-------|
| `textContent` | متن خام | ✅ امن |
| `innerText` | متن قابل‌مشاهده (به CSS توجه می‌کند) | ✅ امن |
| `innerHTML` | HTML را اجرا می‌کند | ⚠️ ریسک XSS |

> ⚠️ **قاعده‌ی امنیتی:** هرگز داده‌ی کاربر (ورودی فرم، داده‌ی API) را مستقیم در `innerHTML` نگذار. کاربر می‌تواند `<img src=x onerror="...">` وارد کند و کد مخرب اجرا کند (**XSS**). برای متن همیشه `textContent`.

### ‏Attribute ها

```js
const link = document.querySelector("a");

link.href;                          // ویژگی‌های استاندارد مستقیم
link.href = "https://example.com";

link.getAttribute("href");
link.setAttribute("target", "_blank");
link.removeAttribute("target");
link.hasAttribute("href");

const img = document.querySelector("img");
img.src = "photo.jpg";
img.alt = "توضیح تصویر";
```

### ‏`data-*` Attribute

```html
<button data-id="42" data-action="delete">حذف</button>
```

```js
const btn = document.querySelector("button");

btn.dataset.id;          // "42"  (همیشه رشته)
btn.dataset.action;      // "delete"
btn.dataset.userName = "علی";   // → data-user-name="علی"
```

> `data-*` راه استاندارد ذخیره‌ی داده روی عناصر است؛ در Event Delegation بسیار استفاده می‌شود.

---

## ۴. استایل و کلاس

### ‏`classList` (روش اصلی)

```js
const box = document.querySelector(".box");

box.classList.add("active");
box.classList.remove("active");
box.classList.toggle("active");           // اگر هست حذف، اگر نیست اضافه
box.classList.contains("active");         // true/false
box.classList.replace("old", "new");
```

> **بهترین روش:** استایل را در CSS با یک کلاس تعریف کن و با جاوااسکریپت فقط کلاس را اضافه/حذف کن. این کار منطق و ظاهر را جدا نگه می‌دارد.

### ‏`style` (برای مقدار پویا)

```js
box.style.color = "red";
box.style.backgroundColor = "#eee";      // camelCase
box.style.setProperty("--theme", "blue"); // CSS Variable
box.style.width = `${percent}%`;
```

- `element.style` فقط **استایل inline** را می‌خواند، نه استایل‌های CSS.
- برای خواندن استایل نهایی: `getComputedStyle(box).color`

---

## ۵. ساخت، افزودن و حذف عناصر

### ساخت

```js
const li = document.createElement("li");
li.textContent = "آیتم جدید";
li.classList.add("item");
```

تا زمانی که به صفحه اضافه نکنی، دیده نمی‌شود.

### افزودن

```js
const list = document.querySelector("ul");

list.append(li);               // انتها (می‌پذیرد چند آیتم و متن)
list.prepend(li);              // ابتدا
list.before(li);               // قبل از خود ul
list.after(li);                // بعد از خود ul
someLi.insertAdjacentElement("afterend", li);
```

`insertAdjacentHTML` موقعیت‌های `beforebegin`, `afterbegin`, `beforeend`, `afterend` را دارد:

```js
list.insertAdjacentHTML("beforeend", "<li>سریع</li>");
```

### حذف و جایگزینی

```js
li.remove();                   // حذف خود عنصر
list.replaceChildren();        // خالی کردن کامل
oldEl.replaceWith(newEl);
```

### کپی

```js
const copy = li.cloneNode(true);   // true = با فرزندان
```

### نمونه: رندر یک لیست از آرایه

```js
const fruits = ["سیب", "موز", "پرتقال"];
const list = document.querySelector("#list");

list.replaceChildren();            // پاک کردن قبلی‌ها

fruits.forEach((fruit) => {
  const li = document.createElement("li");
  li.textContent = fruit;
  list.append(li);
});
```

### نمونه: رندر با Template Literal

```js
function renderProducts(products) {
  const container = document.querySelector("#products");

  container.innerHTML = products
    .map(
      (p) => `
        <article class="card" data-id="${p.id}">
          <h3>${escapeHTML(p.title)}</h3>
          <p>${p.price} تومان</p>
          <button data-action="add">افزودن</button>
        </article>`
    )
    .join("");
}

// برای داده‌ی کاربر
function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
```

این الگو (**داده → رندر**) پایه‌ی تفکر React است: «UI نتیجه‌ی داده است».

### ‏`<template>` (روش حرفه‌ای‌تر)

```html
<template id="card-template">
  <article class="card">
    <h3 class="title"></h3>
    <p class="price"></p>
  </article>
</template>
```

```js
const tpl = document.querySelector("#card-template");

function createCard(product) {
  const node = tpl.content.cloneNode(true);
  node.querySelector(".title").textContent = product.title;
  node.querySelector(".price").textContent = product.price;
  return node;
}

container.append(createCard({ title: "کتاب", price: 120 }));
```

اینجا از `textContent` استفاده می‌شود؛ پس امن است.

---

## ۶. رویدادها (Events)

رویداد یعنی **اتفاقی که در صفحه می‌افتد** (کلیک، تایپ، ارسال فرم، حرکت ماوس، بارگذاری، ...). ما به آن «گوش می‌دهیم» و یک **Callback** اجرا می‌کنیم.

### ‏`addEventListener`

```js
const btn = document.querySelector("#btn");

btn.addEventListener("click", () => {
  console.log("کلیک شد");
});
```

- نوع رویداد: `"click"`
- Callback: تابعی که هنگام رویداد صدا زده می‌شود
- می‌شود چند Listener روی یک عنصر گذاشت

> از `onclick="..."` داخل HTML یا `btn.onclick = ...` استفاده نکن؛ `addEventListener` انعطاف بیشتری دارد.

### شیء رویداد (Event Object)

```js
btn.addEventListener("click", (event) => {
  event.type;            // "click"
  event.target;          // عنصری که روی آن اتفاق افتاد
  event.currentTarget;   // عنصری که Listener روی آن است
  event.clientX;         // موقعیت ماوس
});
```

### حذف Listener

```js
function handleClick() { console.log("hi"); }

btn.addEventListener("click", handleClick);
btn.removeEventListener("click", handleClick);   // باید همان تابع باشد
```

> با Arrow Function ناشناس نمی‌توانی حذف کنی؛ باید تابع را در متغیر بگذاری.

گزینه‌ی `{ once: true }` فقط بار اول اجرا می‌کند:

```js
btn.addEventListener("click", handler, { once: true });
```

### رویدادهای پرکاربرد

| دسته | رویدادها |
|------|----------|
| ماوس | `click`, `dblclick`, `mouseenter`, `mouseleave`, `mousemove`, `contextmenu` |
| صفحه‌کلید | `keydown`, `keyup` |
| فرم | `submit`, `input`, `change`, `focus`, `blur`, `reset` |
| صفحه | `DOMContentLoaded`, `load`, `scroll`, `resize` |
| لمس | `touchstart`, `touchend` (و بهتر: Pointer Events) |

### رویدادهای صفحه‌کلید

```js
document.addEventListener("keydown", (e) => {
  console.log(e.key);        // "Enter", "Escape", "a", "ArrowUp"
  console.log(e.code);       // "KeyA" (کلید فیزیکی)

  if (e.key === "Escape") closeModal();
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();      // جلوگیری از رفتار پیش‌فرض مرورگر
    save();
  }
});
```

### ‏`preventDefault`

بعضی عناصر رفتار پیش‌فرض دارند (لینک می‌رود، فرم صفحه را Reload می‌کند). با `preventDefault()` متوقفش می‌کنیم:

```js
link.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("لینک دنبال نشد");
});
```

### ‏Bubbling و Capturing

وقتی روی یک عنصر کلیک می‌کنی، رویداد از آن عنصر **به سمت بالا (والدین)** حرکت می‌کند. به این **Bubbling** می‌گویند.

```html
<div id="outer">
  <button id="inner">کلیک</button>
</div>
```

```js
outer.addEventListener("click", () => console.log("outer"));
inner.addEventListener("click", () => console.log("inner"));
// کلیک روی دکمه: inner → outer
```

- `event.stopPropagation()` حرکت رویداد به بالا را متوقف می‌کند (کم استفاده کن؛ معمولاً مشکل را در طراحی پنهان می‌کند).
- ‏Capturing: فاز قبل از رسیدن به هدف است (`addEventListener("click", fn, true)`)؛ کم استفاده می‌شود.

### ‏`DOMContentLoaded`

```js
document.addEventListener("DOMContentLoaded", () => {
  // HTML کاملاً خوانده شده است
});
```

اگر `defer` استفاده کنی معمولاً لازم نیست.

### رویدادهای `input` و `change`

```js
const input = document.querySelector("#name");

input.addEventListener("input", (e) => {
  console.log(e.target.value);    // با هر تایپ
});

input.addEventListener("change", (e) => {
  console.log(e.target.value);    // وقتی مقدار نهایی شد (blur یا Enter)
});
```

---

## ۷. فرم‌ها (Forms)

### رویداد `submit`

```html
<form id="login-form">
  <input type="email" name="email" required />
  <input type="password" name="password" minlength="8" required />
  <label><input type="checkbox" name="remember" /> مرا به خاطر بسپار</label>
  <button type="submit">ورود</button>
  <p id="error" role="alert"></p>
</form>
```

```js
const form = document.querySelector("#login-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();               // جلوگیری از Reload صفحه

  const email = form.elements.email.value.trim();
  const password = form.elements.password.value;
  const remember = form.elements.remember.checked;

  console.log({ email, password, remember });
});
```

> به‌جای `click` روی دکمه از `submit` روی **فرم** استفاده کن؛ چون با زدن Enter داخل فیلدها هم کار می‌کند.

### خواندن مقدار فیلدها

| نوع | ویژگی |
|-----|-------|
| `input` متنی / `textarea` | `.value` |
| `checkbox` | `.checked` |
| `radio` | `form.elements.gender.value` (گروه) |
| `select` | `.value` |
| `select multiple` | `[...select.selectedOptions].map(o => o.value)` |
| `input type="number"` | `.valueAsNumber` یا `Number(.value)` |
| `input type="file"` | `.files` |

> `.value` **همیشه رشته** است، حتی در `type="number"`.

### ‏`FormData` (راه سریع)

```js
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);

  data.get("email");                          // یک فیلد
  const obj = Object.fromEntries(data);       // همه به‌صورت آبجکت
  console.log(obj);   // { email: "...", password: "..." }
});
```

> ‏checkbox تیک‌نخورده در `FormData` وجود ندارد.

### بازنشانی و فوکوس

```js
form.reset();
input.focus();
input.select();
input.disabled = true;
```

### اعتبارسنجی (Validation)

دو لایه داریم:

**۱) اعتبارسنجی HTML (Constraint Validation)**

```html
<input type="email" required />
<input type="text" minlength="3" maxlength="20" pattern="[A-Za-z]+" />
<input type="number" min="1" max="10" />
```

```js
input.validity.valid;         // true/false
input.validity.valueMissing;
input.validity.typeMismatch;
input.validationMessage;      // پیام مرورگر
form.checkValidity();         // آیا کل فرم معتبر است؟
input.setCustomValidity("پیام دلخواه"); // برای خالی کردن: ""
```

**۲) اعتبارسنجی با جاوااسکریپت (برای قوانین خودت)**

```js
function validate({ email, password }) {
  const errors = {};

  if (!email.includes("@")) errors.email = "ایمیل معتبر نیست";
  if (password.length < 8) errors.password = "حداقل ۸ کاراکتر";

  return errors;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  const errors = validate(values);

  if (Object.keys(errors).length > 0) {
    showErrors(errors);
    return;
  }

  console.log("معتبر است", values);
});
```

> ⚠️ **اعتبارسنجی سمت کلاینت فقط برای تجربه‌ی کاربر است، نه امنیت.** کاربر می‌تواند آن را دور بزند. وقتی بک‌اند ساختی، **همیشه** دوباره در سرور هم اعتبارسنجی کن.

### نکات تجربه‌ی کاربری

- خطا را **کنار همان فیلد** نشان بده
- برای دسترس‌پذیری: `aria-invalid="true"`، `aria-describedby` برای پیام خطا، و `role="alert"` برای پیام کلی
- دکمه‌ی ارسال را حین پردازش `disabled` کن تا دوبار ارسال نشود
- پیام خطا را وقتی کاربر اصلاح کرد پاک کن

---

## ۸. ‏Event Delegation

### مسئله

لیستی از آیتم‌ها داری و می‌خواهی روی هر دکمه‌ی «حذف» کلیک کنی:

```js
// ❌ روش ضعیف: Listener روی هر دکمه
document.querySelectorAll(".delete-btn").forEach((btn) => {
  btn.addEventListener("click", () => { /* ... */ });
});
```

مشکلات:

- برای ۱۰۰۰ آیتم، ۱۰۰۰ Listener
- آیتم‌هایی که **بعداً** اضافه می‌شوند Listener ندارند

### راه‌حل: Delegation

از **Bubbling** استفاده می‌کنیم: یک Listener روی **والد** می‌گذاریم و با `event.target` می‌فهمیم دقیقاً روی چه چیزی کلیک شده.

```html
<ul id="todo-list">
  <li data-id="1">
    <span class="text">خرید نان</span>
    <button data-action="done">✓</button>
    <button data-action="delete">✕</button>
  </li>
  <li data-id="2">...</li>
</ul>
```

```js
const list = document.querySelector("#todo-list");

list.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;                          // کلیک روی جای دیگر

  const li = btn.closest("li");
  const id = Number(li.dataset.id);
  const action = btn.dataset.action;

  if (action === "delete") deleteTodo(id);
  if (action === "done") toggleTodo(id);
});
```

**چرا `closest` و نه `e.target` مستقیم؟** اگر داخل دکمه آیکون یا `<span>` باشد، `e.target` همان فرزند است نه دکمه. `closest` از هر جای داخل دکمه، به خود دکمه می‌رسد.

مزایا:

- ✅ فقط یک Listener
- ✅ برای آیتم‌های پویا (بعداً اضافه‌شده) هم کار می‌کند
- ✅ کد تمیزتر

> رویدادهایی که Bubble **نمی‌کنند** (مثل `focus`/`blur`): از `focusin`/`focusout` استفاده کن. `mouseenter` هم Bubble نمی‌کند؛ `mouseover` می‌کند.

---

## ۹. ذخیره‌سازی در مرورگر (Web Storage)

متغیرها با Refresh صفحه از بین می‌روند. با **Web Storage** می‌شود داده‌ی کوچک را در مرورگر نگه داشت.

| ویژگی | `localStorage` | `sessionStorage` |
|-------|----------------|------------------|
| ماندگاری | تا زمانی که پاک شود | تا بسته‌شدن تب |
| اشتراک بین تب‌ها | بله (هم‌دامنه) | خیر (هر تب جدا) |
| ظرفیت | حدود ۵ مگابایت | حدود ۵ مگابایت |
| کاربرد | تم، زبان، پیش‌نویس، سبد خرید | داده‌ی موقت یک جلسه، مراحل فرم |

### ‏API (برای هر دو یکسان)

```js
localStorage.setItem("theme", "dark");
localStorage.getItem("theme");          // "dark"
localStorage.getItem("nope");           // null
localStorage.removeItem("theme");
localStorage.clear();                   // پاک کردن همه
localStorage.length;
localStorage.key(0);                    // نام کلید در اندیس 0
```

> **فقط رشته** ذخیره می‌شود!

```js
localStorage.setItem("count", 5);
typeof localStorage.getItem("count");   // "string"

localStorage.setItem("user", { name: "علی" });
localStorage.getItem("user");           // "[object Object]"  ❌
```

### ذخیره‌ی آرایه و آبجکت با JSON

```js
const todos = [{ id: 1, text: "نان", done: false }];

localStorage.setItem("todos", JSON.stringify(todos));

const saved = JSON.parse(localStorage.getItem("todos"));
```

### الگوی امن خواندن

اگر کلید وجود نداشته باشد یا JSON خراب باشد، برنامه نباید بشکند:

```js
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("ذخیره‌سازی ناموفق (حافظه پر یا غیرفعال)", err);
  }
}

const todos = load("todos", []);
save("todos", todos);
```

### نکات مهم Storage

- ⚠️ **داده‌ی حساس ذخیره نکن** (رمز عبور، توکن حساس، اطلاعات کارت). هر اسکریپتی در همان صفحه (از جمله XSS) می‌تواند آن را بخواند.
- Storage **همگام (Synchronous)** است؛ داده‌ی حجیم صفحه را کند می‌کند.
- کاربر می‌تواند آن را پاک کند یا در حالت Private/غیرفعال باشد؛ همیشه مقدار پیش‌فرض داشته باش.
- هر **Origin** (پروتکل + دامنه + پورت) Storage جداگانه دارد.
- رویداد `storage` وقتی در تب دیگر تغییر کند اجرا می‌شود:

```js
window.addEventListener("storage", (e) => {
  console.log(e.key, e.oldValue, e.newValue);
});
```

### ‏Cookie ها (مقدمه)

Cookie ها هم داده‌ی کوچک ذخیره می‌کنند ولی در **هر درخواست به سرور ارسال می‌شوند** و برای احراز هویت (فصل Auth) به‌کار می‌روند. فعلاً Storage کافی است.

---

## ۱۰. الگوی ساخت اپلیکیشن: State → Render

در اپلیکیشن‌های واقعی، بهترین الگو این است:

1. یک **state** (آرایه/آبجکت) داریم که حقیقت برنامه است
2. تابع `render()` از روی state، صفحه را می‌سازد
3. رویدادها state را عوض می‌کنند، سپس `render()` دوباره صدا زده می‌شود
4. state در Storage ذخیره می‌شود

**مثال کامل: لیست کارها (Todo)**

```html
<form id="todo-form">
  <input name="text" placeholder="کار جدید..." required />
  <button>افزودن</button>
</form>
<ul id="todo-list"></ul>
<p id="count"></p>
<script src="app.js" defer></script>
```

```js
// ---------- State ----------
let todos = load("todos", []);

// ---------- Elements ----------
const form = document.querySelector("#todo-form");
const list = document.querySelector("#todo-list");
const countEl = document.querySelector("#count");

// ---------- Storage ----------
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}
const persist = () => localStorage.setItem("todos", JSON.stringify(todos));

// ---------- Actions (تغییر state) ----------
function addTodo(text) {
  todos = [...todos, { id: Date.now(), text, done: false }];
  update();
}
function toggleTodo(id) {
  todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  update();
}
function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  update();
}
function update() {
  persist();
  render();
}

// ---------- Render ----------
function render() {
  list.replaceChildren();

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.dataset.id = todo.id;
    li.classList.toggle("done", todo.done);

    const span = document.createElement("span");
    span.textContent = todo.text;           // امن

    const doneBtn = document.createElement("button");
    doneBtn.dataset.action = "toggle";
    doneBtn.textContent = "✓";

    const delBtn = document.createElement("button");
    delBtn.dataset.action = "delete";
    delBtn.textContent = "✕";

    li.append(span, doneBtn, delBtn);
    list.append(li);
  });

  const remaining = todos.filter((t) => !t.done).length;
  countEl.textContent = `${remaining} کار باقی مانده`;
}

// ---------- Events ----------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = form.elements.text.value.trim();
  if (!text) return;
  addTodo(text);
  form.reset();
  form.elements.text.focus();
});

list.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = Number(btn.closest("li").dataset.id);

  if (btn.dataset.action === "toggle") toggleTodo(id);
  if (btn.dataset.action === "delete") deleteTodo(id);
});

// ---------- Start ----------
render();
```

این ساختار را **حفظ کن**؛ در فصل React دقیقاً همین ایده با ابزار بهتر تکرار می‌شود.

---

## ۱۱. ابزار مفید: DevTools

- **Elements:** دیدن و ویرایش زنده‌ی DOM و CSS
- **Console:** اجرای کد و دیدن خطا
- **Sources:** گذاشتن Breakpoint و اجرای قدم‌به‌قدم
- **Application → Local Storage:** دیدن و ویرایش داده‌های ذخیره‌شده
- **`$0`** در Console = عنصر انتخاب‌شده در Elements
- **`console.table(array)`** نمایش آرایه‌ی آبجکت‌ها به‌صورت جدول
- **`debugger;`** در کد = توقف خودکار در DevTools

---

## ۱۲. اشتباهات رایج

1. **اجرای اسکریپت قبل از ساخته‌شدن HTML** → خطای `null` (راه‌حل: `defer`)
2. **استفاده از `innerHTML` با داده‌ی کاربر** → ریسک XSS
3. **فراموش‌کردن `e.preventDefault()` در فرم** → صفحه Reload می‌شود
4. **انتظار آرایه از `querySelectorAll`** → NodeList است
5. **فراموش‌کردن اینکه `.value` رشته است** → `"2" + "3" = "23"`
6. **Listener روی هر آیتم لیست پویا** → از Delegation استفاده کن
7. **ذخیره‌ی آبجکت در Storage بدون `JSON.stringify`**
8. **`JSON.parse(null)` یا JSON خراب بدون `try/catch`**
9. **ذخیره‌ی داده‌ی حساس در localStorage**
10. **استفاده از `e.target` به‌جای `closest` وقتی دکمه فرزند دارد**
11. **ثبت Listener جدید در هر `render()`** (Listener تکراری)؛ Listener ها را یک‌بار و خارج از `render` ثبت کن
12. **ساخت `id` با `Math.random()` یا اندیس آرایه**؛ `crypto.randomUUID()` یا `Date.now()` بهتر است

---

## ۱۳. خلاصه فصل

- DOM درختی از عناصر است؛ با `querySelector/All` انتخاب می‌شود
- محتوا: `textContent` (امن)، `innerHTML` (با احتیاط)؛ ویژگی‌ها: `getAttribute`, `dataset`
- استایل: ترجیحاً `classList`، برای مقدار پویا `style`
- ساخت عنصر: `createElement` + `append`؛ حذف: `remove`
- رویداد: `addEventListener`، شیء `event`، `preventDefault`، Bubbling
- فرم: رویداد `submit` روی فرم، `FormData`، اعتبارسنجی دو‌لایه
- Delegation: یک Listener روی والد + `closest` + `data-*`
- Storage: `localStorage` (ماندگار) و `sessionStorage` (موقت)؛ فقط رشته، با `JSON`
- الگوی اپ: **State → Render → Event → State**

---

## ۱۴. تمرین‌ها

### سطح ۱ — DOM

1. صفحه‌ای با یک `<h1>` و یک دکمه بساز؛ با کلیک، متن عنوان عوض شود.
2. دکمه‌ای بساز که با هر کلیک یک شمارنده را زیاد کند و عدد را نمایش بدهد (بعلاوه دکمه‌ی کم کردن و ریست).
3. دکمه‌ی «تغییر تم» بساز که کلاس `dark` را روی `body` Toggle کند.
4. از یک آرایه‌ی رشته‌ای، یک `<ul>` بساز (با `createElement`).

### سطح ۲ — Events و Forms

5. یک `<input>` و یک `<p>` بساز؛ با هر تایپ، متن زیر آن همان‌جا نمایش داده شود (به‌همراه شمارنده‌ی کاراکتر).
6. فرم ثبت‌نام (نام، ایمیل، رمز، تکرار رمز) بساز:
   - هیچ فیلدی خالی نباشد
   - ایمیل معتبر باشد
   - رمز حداقل ۸ کاراکتر باشد
   - رمز و تکرارش یکسان باشند
   - خطاها کنار هر فیلد نمایش داده شوند
7. فیلد جستجو بساز که لیستی از ۲۰ نام را به‌صورت زنده فیلتر کند.
8. **Modal** بساز: با دکمه باز شود؛ با دکمه‌ی بستن، کلیک بیرون Modal و کلید `Escape` بسته شود.

### سطح ۳ — Delegation و Storage

9. لیست کارها (Todo) را بدون نگاه کردن به نمونه‌ی بالا بساز؛ با ذخیره در `localStorage`.
10. قابلیت **ویرایش** متن Todo را با دوبار کلیک اضافه کن.
11. سه دکمه‌ی فیلتر (همه / فعال / انجام‌شده) اضافه کن.
12. دکمه‌ی «پاک کردن انجام‌شده‌ها» اضافه کن.
13. انتخاب تم (روشن/تاریک) را در `localStorage` ذخیره کن تا با Refresh حفظ شود.
14. با `sessionStorage` فرم چندمرحله‌ای (۳ مرحله) بساز که با Refresh مرحله‌ی فعلی را از دست ندهد.

### سطح ۴ — چالش

15. **Tabs:** سه تب بساز که با کلیک (و کلیدهای جهت‌دار) عوض شوند؛ فقط با یک Listener (Delegation).
16. **Accordion** بساز (FAQ) که فقط یک بخش هم‌زمان باز باشد.
17. **Star Rating:** ستاره‌های ۱ تا ۵ که با Hover و کلیک امتیاز را نشان بدهند و ذخیره کنند.
18. تابع `debounce(fn, delay)` بنویس و برای جستجوی زنده استفاده کن (فقط بعد از ۳۰۰ میلی‌ثانیه توقف تایپ، جستجو انجام شود).

### پروژه‌ی پایان فصل: اپلیکیشن سبد خرید / فروشگاه کوچک

بر پایه‌ی پروژه‌ی فصل ۲:

- صفحه‌ی محصولات (کارت‌ها از آرایه‌ی `products` رندر شوند)
- جستجو و فیلتر دسته‌بندی و مرتب‌سازی (قیمت صعودی/نزولی)
- دکمه‌ی «افزودن به سبد» با Event Delegation
- سبد خرید در پنل کناری با تغییر تعداد، حذف و جمع کل
- ذخیره‌ی سبد در `localStorage` تا با Refresh حفظ شود
- محصول ناموجود قابل افزودن نباشد
- نمایش وضعیت خالی («سبد خالی است»)
- رعایت دسترس‌پذیری: دکمه‌ها `button` باشند، فوکوس قابل مشاهده باشد، تغییرات سبد با `aria-live` اعلام شود
- ساختار کد: `state`، `actions`، `render`، `events` و `storage` جدا باشند

---

## ۱۵. پاسخ نمونه (تمرین‌های منتخب)

<details>
<summary>تمرین ۲ — شمارنده</summary>

```html
<p id="value">0</p>
<button data-step="-1">−</button>
<button data-step="1">+</button>
<button id="reset">ریست</button>
```

```js
let count = 0;
const valueEl = document.querySelector("#value");

function render() {
  valueEl.textContent = count;
}

document.addEventListener("click", (e) => {
  const stepBtn = e.target.closest("[data-step]");
  if (stepBtn) {
    count += Number(stepBtn.dataset.step);
    render();
  }
  if (e.target.id === "reset") {
    count = 0;
    render();
  }
});
```
</details>

<details>
<summary>تمرین ۶ — اعتبارسنجی فرم ثبت‌نام</summary>

```js
function validate({ name, email, password, confirm }) {
  const errors = {};

  if (!name.trim()) errors.name = "نام الزامی است";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "ایمیل معتبر نیست";

  if (password.length < 8) errors.password = "حداقل ۸ کاراکتر";

  if (password !== confirm) errors.confirm = "رمزها یکسان نیستند";

  return errors;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  const errors = validate(values);

  form.querySelectorAll("[data-error-for]").forEach((el) => {
    el.textContent = errors[el.dataset.errorFor] ?? "";
  });

  if (Object.keys(errors).length === 0) {
    console.log("ثبت‌نام موفق", values.email);
  }
});
```
</details>

<details>
<summary>تمرین ۸ — Modal</summary>

```html
<button id="open">باز کردن</button>
<div id="overlay" hidden>
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="m-title">
    <h2 id="m-title">عنوان</h2>
    <button id="close">بستن</button>
  </div>
</div>
```

```js
const overlay = document.querySelector("#overlay");

const openModal = () => (overlay.hidden = false);
const closeModal = () => (overlay.hidden = true);

document.querySelector("#open").addEventListener("click", openModal);
document.querySelector("#close").addEventListener("click", closeModal);

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();      // کلیک بیرون از Modal
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !overlay.hidden) closeModal();
});
```

> بعداً می‌توانی از تگ `<dialog>` و متد `showModal()` استفاده کنی که فوکوس و Escape را خودش مدیریت می‌کند.
</details>

<details>
<summary>تمرین ۷ — جستجوی زنده</summary>

```js
const names = ["علی", "سارا", "رضا", "مریم", "نیما"];
const input = document.querySelector("#search");
const list = document.querySelector("#results");

function render(items) {
  list.replaceChildren(
    ...items.map((name) => {
      const li = document.createElement("li");
      li.textContent = name;
      return li;
    })
  );
}

input.addEventListener("input", () => {
  const q = input.value.trim().toLowerCase();
  render(names.filter((n) => n.toLowerCase().includes(q)));
});

render(names);
```
</details>

<details>
<summary>تمرین ۱۸ — debounce</summary>

```js
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

input.addEventListener("input", debounce((e) => {
  search(e.target.value);
}, 300));
```

> ‏`debounce` ترکیبی از HOF + Closure است؛ `timer` بین دفعات فراخوانی «زنده می‌ماند». Closure را در فصل ۴ کامل می‌خوانیم.
</details>

---

## ۱۶. چک‌لیست خودارزیابی

- [ ] تفاوت `textContent` و `innerHTML` و خطر XSS را توضیح می‌دهم
- [ ] می‌دانم چرا `defer` لازم است
- [ ] فرق `querySelector` و `querySelectorAll` و NodeList را می‌دانم
- [ ] عنصر می‌سازم، اضافه و حذف می‌کنم
- [ ] `event.target` و `currentTarget` را از هم تشخیص می‌دهم
- [ ] می‌دانم چرا `preventDefault` در فرم لازم است
- [ ] فرم را با `FormData` می‌خوانم و اعتبارسنجی می‌کنم
- [ ] Event Delegation را با `closest` و `data-*` بدون نگاه کردن پیاده می‌کنم
- [ ] داده را با `JSON` در `localStorage` ذخیره و بازیابی می‌کنم (با `try/catch`)
- [ ] تفاوت `localStorage` و `sessionStorage` را می‌دانم
- [ ] الگوی State → Render را می‌شناسم و Todo را از صفر ساخته‌ام
- [ ] پروژه‌ی فروشگاه کوچک را کامل کرده‌ام

---

**فصل بعد:** جاوااسکریپت عمیق‌تر — Scope، Closure، Hoisting، `this`، Execution Context، Call Stack، Event Loop، Modules، Destructuring، Spread/Rest
