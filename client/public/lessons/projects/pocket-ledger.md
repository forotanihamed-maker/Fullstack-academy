# Pocket Ledger — مدیریت هزینه و درآمد (پروژه‌ی جمع‌بندی قبل از React)

> **سطح:** پیشرفته (جمع‌بندی)  
> **مرحله:** JavaScript Review  
> **وضعیت:** پروژه‌ی پیشنهادی بعد از Movie Explorer و Git  
> **زمان پیشنهادی:** ۸ تا ۱۲ روز  
> **پیش‌نیاز:** همه‌ی فصل‌های HTML، CSS و JavaScript (به‌خصوص فصل ۴: Closure، Module، Immutable) و Git

## هدف

پیش از ورود به React، یک برنامه‌ی کامل بساز که **معماری درست** را تمرین کند: Stateی که در یک جا نگه داشته می‌شود، توابع خالص، Moduleهای جدا، فرم با اعتبارسنجی، ذخیره‌سازی و دسترس‌پذیری. همان الگوهایی که در React هم لازم‌اند.

**چرا این پروژه؟** سه پروژه‌ی قبلی هرکدام یک لایه ساختند (DOM، CRUD، API). این پروژه همه را کنار هم می‌گذارد و روی کیفیت کد و معماری تمرکز دارد، نه فقط «کار کردن».

## قابلیت‌ها

- **ثبت تراکنش:** عنوان، مبلغ، نوع (درآمد / هزینه)، دسته، تاریخ، توضیح
- **ویرایش و حذف** تراکنش (و «واگرد» حذف تا ۵ ثانیه)
- **فیلتر:** بر اساس ماه (`input type="month"`)، نوع و دسته
- **خلاصه:** مجموع درآمد، مجموع هزینه و موجودی (محاسبه‌شده، نه ذخیره‌شده)
- **نمودار ساده‌ی میله‌ای** از هزینه‌ی هر دسته، فقط با CSS (ارتفاع میله با متغیر CSS)
- **ذخیره‌سازی** در `localStorage` با نسخه‌ی ساختار داده (`version`)
- **خروجی و ورودی JSON** (دانلود فایل و بارگذاری از فایل، با اعتبارسنجی)
- **تم روشن و تیره** با متغیرهای CSS، `prefers-color-scheme` و ذخیره‌ی انتخاب کاربر
- **فرمت فارسی** اعداد و تاریخ با `Intl`
- **دسترس‌پذیری:** کار با کیبورد، `label` برای همه‌ی فیلدها، `aria-live` برای پیام‌ها

## معماری پیشنهادی

```text
pocket-ledger/
├── index.html
├── css/
│   ├── base.css
│   ├── components.css
│   └── theme.css
└── js/
    ├── main.js                 ← اتصال همه‌چیز
    ├── store.js                ← Store با Closure (getState / setState / subscribe)
    ├── transactions.js         ← توابع خالص (add، update، remove، filter، summarize)
    ├── storage.js              ← load / save / migrate
    ├── validators.js           ← اعتبارسنجی فرم و فایل ورودی
    ├── format.js               ← Intl برای مبلغ و تاریخ
    └── ui/
        ├── form.js
        ├── list.js
        ├── summary.js
        └── toast.js
```

**قانون‌های معماری:**

- `transactions.js` و `validators.js` **هیچ‌وقت** به DOM دست نمی‌زنند (توابع خالص: ورودی بگیرند، خروجی بدهند)
- فقط `ui/*` با DOM کار می‌کند
- فقط `store.js` State را نگه می‌دارد؛ بقیه فقط از آن می‌خوانند و از طریق `setState` تغییر می‌دهند
- هر تغییر State باید **Immutable** باشد

## Store با Closure

```js
// store.js
export function createStore(initialState) {
  let state = initialState;                  // متغیر خصوصی Closure
  const listeners = new Set();

  return {
    getState: () => state,

    setState(updater) {
      const next = typeof updater === "function" ? updater(state) : updater;
      if (next === state) return;            // تغییری نبود؛ اطلاع نده
      state = next;
      listeners.forEach((listener) => listener(state));
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener); // تابع لغو اشتراک
    }
  };
}
```

استفاده:

```js
const store = createStore({ transactions: [], filters: { month: "", type: "all" } });

store.subscribe((state) => render(state));

store.setState((s) => ({
  ...s,
  transactions: [...s.transactions, newTransaction]
}));
```

## توابع خالص

```js
// transactions.js
export function summarize(transactions) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return { income, expense, balance: income - expense };
}

export function totalsByCategory(transactions) {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => ({ ...acc, [t.category]: (acc[t.category] ?? 0) + t.amount }), {});
}
```

مثال خروجی برای یک درآمد ۵٬۰۰۰٬۰۰۰ و دو هزینه‌ی غذا (۱٬۲۰۰٬۰۰۰ و ۳۰۰٬۰۰۰):

```text
summarize          → { income: 5000000, expense: 1500000, balance: 3500000 }
totalsByCategory   → { food: 1500000 }
```

## مبلغ را عدد صحیح نگه دار

```js
0.1 + 0.2;            // 0.30000000000000004  ← خطای ممیز شناور
```

برای پول، مبلغ را به‌صورت **عدد صحیح در کوچک‌ترین واحد** نگه دار (مثلاً ریال، یا سنت)، و فقط هنگام نمایش فرمت کن:

```js
// format.js
const money = new Intl.NumberFormat("fa-IR");
export const formatMoney = (amount) => money.format(amount);
// formatMoney(1234500) → "۱٬۲۳۴٬۵۰۰"

const dateFormat = new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" });
export const formatDate = (isoDate) => dateFormat.format(new Date(isoDate));
```

## فرم و اعتبارسنجی

ترکیب اعتبارسنجی HTML (فصل ۲) و JavaScript:

```html
<form id="tx-form" novalidate>
  <label for="title">عنوان</label>
  <input id="title" name="title" required minlength="2" maxlength="60" />
  <p id="title-error" role="alert"></p>

  <label for="amount">مبلغ</label>
  <input id="amount" name="amount" type="number" min="1" step="1" required inputmode="numeric" />
  ...
</form>
```

- با `novalidate` پیام پیش‌فرض مرورگر را خاموش و پیام فارسی خودت را کنار هر فیلد نشان بده
- `aria-invalid` و `aria-describedby` را به پیام خطا وصل کن
- منطق اعتبارسنجی در `validators.js` (تابع خالص) باشد تا بدون DOM تست شود
- یادت باشد: اعتبارسنجی سمت Client امنیت نیست (فصل HTML)

## ذخیره‌سازی با نسخه‌ی ساختار

```js
// storage.js
const KEY = "pocket-ledger";
const VERSION = 1;

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return data.version === VERSION && Array.isArray(data.transactions) ? data.transactions : [];
  } catch {
    return [];
  }
}

export function save(transactions) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: VERSION, transactions }));
  } catch {
    /* ذخیره نشد؛ برنامه ادامه بدهد */
  }
}
```

برای ساختار آینده، `version` اجازه می‌دهد داده‌ی قدیمی را «مهاجرت» (Migrate) بدهی، به‌جای اینکه برنامه با داده‌ی قدیمی خراب شود.

## خروجی و ورودی JSON

**خروجی (دانلود):**

```js
function exportJson(transactions) {
  const blob = new Blob([JSON.stringify({ version: 1, transactions }, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "pocket-ledger.json";
  link.click();
  URL.revokeObjectURL(url);                 // آزاد کردن حافظه
}
```

**ورودی (بارگذاری):** فایل را `async` بخوان و **قبل از استفاده اعتبارسنجی کن**:

```js
fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const data = JSON.parse(await file.text());
    const transactions = validateImport(data);   // خطا پرتاب می‌کند اگر ساختار غلط باشد
    store.setState((s) => ({ ...s, transactions }));
  } catch (error) {
    showToast("فایل نامعتبر است: " + error.message);
  }
});
```

> داده‌ی فایل مثل داده‌ی سرور است: **هرگز به آن اعتماد نکن**. نوع هر فیلد (`amount` عدد صحیح مثبت، `date` معتبر، `type` یکی از دو مقدار) را بررسی کن.

## تم تیره و ترجیح کاربر

```css
:root {
  --bg: #ffffff;
  --text: #0f172a;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0b1220;
    --text: #e2e8f0;
  }
}

:root[data-theme="dark"] {
  --bg: #0b1220;
  --text: #e2e8f0;
}
```

دکمه‌ی تغییر تم مقدار `data-theme` را روی `document.documentElement` عوض و انتخاب را در `localStorage` ذخیره کند.

## «واگرد حذف» با Closure و تایمر

```js
function deleteWithUndo(id) {
  const removed = store.getState().transactions.find((t) => t.id === id);
  store.setState((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== id) }));

  const timer = setTimeout(() => hideToast(), 5000);

  showToast("تراکنش حذف شد", {
    actionLabel: "واگرد",
    onAction() {
      clearTimeout(timer);                    // تایمر را پاک کن
      store.setState((s) => ({ ...s, transactions: [...s.transactions, removed] }));
      hideToast();
    }
  });
}
```

## تست توابع خالص

توابع خالص بدون DOM قابل تست‌اند. یک فایل `tests.html` (یا `tests.js`) با `console.assert` بساز:

```js
import { summarize, totalsByCategory } from "./js/transactions.js";

const sample = [
  { type: "income", amount: 5000000, category: "salary" },
  { type: "expense", amount: 1200000, category: "food" },
  { type: "expense", amount: 300000, category: "food" }
];

console.assert(summarize(sample).balance === 3500000, "balance should be 3500000");
console.assert(totalsByCategory(sample).food === 1500000, "food total should be 1500000");
console.assert(summarize([]).balance === 0, "empty list should give 0");
```

(اگر `console.assert` پیامی در Console چاپ کند، تست رد شده است.)

## محدودیت‌ها

- بدون فریم‌ورک و کتابخانه
- ماژولار (`import` / `export`) با ساختار بالا
- هیچ تغییر مستقیم (Mutate) روی State؛ در حالت توسعه State را با `Object.freeze` قفل کن و مطمئن شو برنامه خطا نمی‌دهد
- مبلغ‌ها عدد صحیح
- هیچ `innerHTML` با داده‌ی کاربر یا فایل
- هیچ متغیر Global ناخواسته
- در Event Handlerها از `event.currentTarget` استفاده شود، نه `this`

## معیار قبولی

- افزودن، ویرایش، حذف و واگرد کار می‌کنند و بعد از Refresh باقی می‌مانند
- فیلتر ماه و نوع و دسته با هم ترکیب می‌شوند و خلاصه با آن‌ها هماهنگ است
- ورودی JSON خراب (مثلاً مبلغ منفی یا `type` نامعتبر) رد می‌شود و برنامه نمی‌شکند
- خروجی JSON را دوباره وارد کنی، همان داده برمی‌گردد
- تست‌های `console.assert` همه موفق‌اند
- تم تیره با کنتراست کافی (حداقل ۴.۵ به ۱) و انتخاب کاربر ذخیره می‌شود
- فقط با کیبورد می‌توانی کل برنامه را استفاده کنی و فوکوس همیشه دیده می‌شود
- با `prefers-reduced-motion: reduce` انیمیشنی اجرا نمی‌شود
- Lighthouse Accessibility حداقل ۹۰

## الزامات Git و GitHub

- Repository روی GitHub با `.gitignore` درست
- حداقل ۱۵ Commit کوچک با پیام‌های Conventional
- حداقل ۳ Branch قابلیت جدا (مثلاً `feature/import-export`، `feature/dark-theme`) که با Pull Request Merge می‌شوند
- `README.md` شامل اسکرین‌شات، قابلیت‌ها، ساختار پروژه و طرز اجرا
- Tag به نام `v1.0.0`

## چک‌لیست بازبینی (Review)

- [ ] `transactions.js` و `validators.js` هیچ ارجاعی به `document` یا `window` ندارند
- [ ] State فقط در `store.js` است و فقط از `setState` تغییر می‌کند
- [ ] هیچ مقدار محاسبه‌شده (موجودی، مجموع) ذخیره نشده است
- [ ] ورودی کاربر و فایل قبل از ورود به State اعتبارسنجی می‌شود
- [ ] تایمرها (واگرد، پیام‌ها) در همه‌ی مسیرها پاک می‌شوند
- [ ] پیام‌های خطا و موفقیت با `aria-live` اعلام می‌شوند
- [ ] هیچ تکرار کد بین `form.js` و `list.js` نیست

## چالش‌های اختیاری

- جستجو در عنوان تراکنش‌ها (با Debounce)
- بودجه‌ی ماهانه برای هر دسته و هشدار تجاوز
- تراکنش‌های تکرارشونده (مثلاً اجاره‌ی ماهانه)
- نمودار دایره‌ای با CSS (`conic-gradient`)
- نصب‌شدنی بودن (PWA) و کار بدون اینترنت (مفهوم Service Worker؛ فقط معرفی)

## اشتباهات رایج

- ذخیره‌ی مبلغ به‌صورت اعشاری و خطای محاسبه
- ریختن همه‌ی منطق در یک فایل `main.js`
- ذخیره‌ی `balance` در State (و ناهماهنگ شدن با تراکنش‌ها)
- Mutate کردن آرایه با `push` یا `splice` و بروز باگ‌های بازتولید ناپذیر
- اعتماد به فایل ورودی JSON
- فراموش کردن پاک کردن تایمر `setTimeout`
