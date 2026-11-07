# فصل ۳: CSS — بخش C: پیشرفته

## ۳.۱۴ متغیرهای CSS (Custom Properties) `[ضروری]`

**مفهوم.** متغیر CSS مقداری است که یک بار تعریف و در جاهای زیاد استفاده می‌شود. با `--` شروع می‌شود و با `var()` خوانده می‌شود.

```css
:root {
  --color-primary: #2563eb;
  --color-text: #1e293b;
  --radius: 12px;
  --space-4: 1rem;
}

.btn {
  background: var(--color-primary);
  border-radius: var(--radius);
  padding: var(--space-4);
}

/* مقدار پیش‌فرض اگر متغیر تعریف نشده بود */
.title { color: var(--color-title, #111); }
```

**تفاوت با متغیر Sass:** متغیر CSS در مرورگر زنده است؛ می‌توان در سطح المان، در `@media`، یا با JavaScript تغییرش داد.

**Scope: تغییر مقدار برای یک بخش**

```css
.card { --card-bg: #fff; background: var(--card-bg); }
.card.featured { --card-bg: #fef9c3; }   /* همان کد، رنگ دیگر */
```

**تم تیره (Dark Mode)**

```css
:root {
  --bg: #ffffff;
  --text: #0f172a;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0b1220;
    --text: #e2e8f0;
  }
}

body { background: var(--bg); color: var(--text); }
```

با JavaScript هم می‌توان با یک کلاس یا `data-theme` روی `html` تم را دستی عوض کرد (فصل DOM).

**اشتباهات رایج**

- نوشتن متغیر خارج از `:root` و انتظار دسترسی سراسری.
- نام‌گذاری متغیر بر اساس مقدار (`--blue`) به‌جای نقش (`--color-primary`)؛ وقتی رنگ برند عوض شود نام بی‌معنی می‌شود.
- استفاده از `var()` داخل شرط `@media` (در Media Query condition کار نمی‌کند).
- متغیرهای بی‌نظم؛ یک سیستم بساز: رنگ، فاصله، اندازه‌ی فونت، شعاع، سایه.

**تمرین کوچک:** رنگ‌ها و فاصله‌های صفحه‌ی خودت را به متغیر تبدیل کن؛ بعد با یک `@media (prefers-color-scheme: dark)` تم تیره بساز.

---

## ۳.۱۵ `calc()`، `min()`، `max()`، `clamp()` و تایپوگرافی روان `[ضروری]`

```css
/* ترکیب واحدهای مختلف */
.sidebar { width: calc(100% - 280px); }

/* هر کدام کوچک‌تر است */
.container { width: min(100% - 2rem, 1100px); }

/* هر کدام بزرگ‌تر است */
.box { width: max(300px, 30%); }

h1 { font-size: clamp(1.75rem, 1.2rem + 2.5vw, 3rem); }
```

- `calc()`: محاسبه با ترکیب واحدها. دور `+` و `-` باید فاصله باشد.
- `min(a, b)`: کوچک‌ترین. `max(a, b)`: بزرگ‌ترین.
- `clamp(min, ترجیحی, max)`: مقدار «ترجیحی» که نه از `min` کمتر شود نه از `max` بیشتر.

**تایپوگرافی روان (Fluid Typography):** `clamp()` اجازه می‌دهد اندازه‌ی فونت بدون Media Query نرم با عرض صفحه تغییر کند:

```css
h1 { font-size: clamp(1.75rem, 1.2rem + 2.5vw, 3rem); }
p  { font-size: clamp(1rem, .95rem + .25vw, 1.125rem); }
```

> **نکته‌ی دسترس‌پذیری:** اگر اندازه‌ی ترجیحی فقط با `vw` باشد، بزرگ‌نمایی مرورگر روی آن اثر نمی‌گذارد؛ ترکیب (`rem + vw` مثل بالا) این مشکل را کم می‌کند.

**تمرین کوچک:** کانتینری بساز که همیشه ۱۶px از هر طرف فاصله داشته باشد ولی از ۱۱۰۰px پهن‌تر نشود (با `min()`)، و یک `h1` روان با `clamp()`.

---

## ۳.۱۶ Cascade، Specificity و Inheritance `[ضروری]`

وقتی چند قانون به یک المان اعمال شوند و با هم تعارض داشته باشند، مرورگر برنده را به این ترتیب انتخاب می‌کند:

1. **اهمیت و منشأ (ساده‌شده):** `!important` قوی‌تر از معمولی است، و استایل نویسنده (تو) قوی‌تر از پیش‌فرض مرورگر.
2. **Specificity (خاص‌بودن) Selector.**
3. **ترتیب نوشتن:** اگر باز هم مساوی بود، آخری برنده است.

### محاسبه‌ی Specificity

به‌صورت یک عدد سه‌قسمتی (ID، Class، Element):

| نوع | وزن |
|-----|-----|
| Inline style | بالاتر از همه‌ی Selectorها |
| `#id` | (۱، ۰، ۰) |
| `.class`، `[attr]`، `:pseudo-class` | (۰، ۱، ۰) |
| `element`، `::pseudo-element` | (۰، ۰، ۱) |
| `*` و combinatorها | صفر |

```css
/* (0,0,1) */
p { color: black; }

/* (0,1,0) */
.note { color: blue; }

/* (0,1,1) */
p.note { color: green; }

/* (1,0,0) */
#intro { color: red; }

/* (0,1,4) */
nav ul li a:hover { color: tomato; }
```

مقایسه از چپ به راست است: **یک ID از هر تعداد کلاس قوی‌تر است.**

**`!important`:** بالاترین اولویت (آخرین راه). به‌جز موارد خاص (مثلاً کلاس‌های ابزاری مثل `.hidden` یا بازنویسی استایل کتابخانه‌ی بیرونی)، استفاده نکن؛ چون دیباگ را سخت و «جنگ Specificity» ایجاد می‌کند.

**قاعده‌ی عملی:**

- Selectorها را کوتاه و کم‌وزن بنویس (یک کلاس).
- از `id` برای استایل استفاده نکن.
- به‌جای افزایش Specificity، ساختار را درست کن یا ترتیب را عوض کن.

### Inheritance (وراثت)

بعضی خاصیت‌ها از والد به فرزند ارث می‌رسند و بعضی نه:

| ارث می‌رسند | ارث نمی‌رسند |
|-------------|---------------|
| `color`، `font-*`، `line-height`، `text-align`، `direction`، `visibility` | `margin`، `padding`، `border`، `background`، `width`، `height`، `display`، `position` |

```css
/* همه‌ی فرزندان می‌گیرند */
body { font-family: "Vazirmatn", sans-serif; color: #1e293b; }

/* از والد بگیر */
a { color: inherit; }
```

کلیدواژه‌های کنترل: `inherit` (از والد)، `initial` (مقدار پیش‌فرض خود CSS)، `unset`، `revert`.

### `@layer`: کنترل Cascade در پروژه‌های بزرگ `[مفید/حرفه‌ای]`

```css
@layer reset, base, components, utilities;

@layer base { a { color: blue; } }
@layer components { .btn { color: white; } }
```

لایه‌ی بعدی (بر اساس ترتیب تعریف) بر قبلی بدون توجه به Specificity غلبه می‌کند. برای هماهنگ کردن استایل کتابخانه‌ها و کد خودت مفید است.

### دیباگ در DevTools

تب **Styles**: قوانین اعمال‌شده از قوی به ضعیف، قوانین خط‌خورده (override شده)، و تب **Computed** برای مقدار نهایی هر خاصیت و اینکه از کدام قانون آمده.

**اشتباهات رایج**

- جنگ Specificity: استایل را قوی‌تر می‌کنی (`#app .card .title`) و بعد باید باز هم قوی‌ترش کنی.
- فکر کردن به اینکه ترتیب class در HTML (`class="a b"`) مهم است (مهم ترتیب قوانین در CSS است).
- فراموش کردن اینکه `margin` و `padding` ارث نمی‌رسند.
- استفاده از `!important` در همه‌جا.

**تمرین کوچک:** سه قانون با Specificity متفاوت روی یک `p` بنویس و پیش از دیدن نتیجه حدس بزن کدام رنگ می‌شود. بعد در DevTools تأیید کن.

---

## ۳.۱۷ Selectorهای پیشرفته `[مفید/حرفه‌ای]`

```css
/* is() ← چند selector را کوتاه می‌کند */
:is(h1, h2, h3) a { color: inherit; }

/* where() ← مثل is() ولی با Specificity صفر (عالی برای Reset و پایه) */
:where(ul, ol) { padding-inline-start: 1.25rem; }

/* :not() */
button:not(:disabled):hover { background: #1d4ed8; }

/* has() ← انتخاب والد بر اساس فرزند */
.card:has(img) { grid-template-columns: 120px 1fr; }
label:has(input:checked) { background: #eff6ff; }

/* focus-visible و focus-within */
a:focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; }
.field:focus-within { border-color: #2563eb; }

/* nth-child با فرمول */
li:nth-child(odd) { }
li:nth-child(3n + 1) { }
li:nth-last-child(-n + 2) { }

/* Attribute Selector پیشرفته */
a[href^="https://"]:not([href*="mysite.com"])::after { content: " ↗"; }
```

| Selector | کاربرد |
|----------|--------|
| `:is()` | کوتاه‌نویسی، Specificity = بزرگ‌ترین آرگومان |
| `:where()` | کوتاه‌نویسی، Specificity = صفر |
| `:not()` | استثنا |
| `:has()` | «والدی که شامل ... است»؛ ابزاری که سال‌ها از آن محروم بودیم |
| `:focus-visible` | فوکوس فقط وقتی لازم است (کیبورد) |
| `:focus-within` | والدی که فرزندش فوکوس دارد |

پشتیبانی `:has()` و ویژگی‌های جدید امروز در مرورگرهای اصلی خوب است؛ ولی پیش از استفاده در پروژه‌ی واقعی، جدول پشتیبانی را در `caniuse.com` یا MDN ببین.

**اشتباه رایج:** استفاده از `:focus` برای همه‌چیز (حلقه‌ی فوکوس هنگام کلیک ماوس هم نمایش داده می‌شود)؛ `:focus-visible` رفتار بهتر دارد.

---

## ۳.۱۸ Stacking Context `[مفید/حرفه‌ای]`

**مسئله‌ی کلاسیک:** المانی `z-index: 9999` دارد ولی باز هم زیر المان دیگری است. علت: **Stacking Context**.

هر Stacking Context یک «جزیره‌ی مستقل» لایه‌هاست: `z-index` فرزندان فقط داخل همان جزیره با هم مقایسه می‌شوند. المان‌هایی که Stacking Context جدید می‌سازند شامل:

- `position` غیر `static` همراه با `z-index` غیر `auto`
- `opacity` کمتر از ۱
- `transform`، `filter`، `perspective`
- `position: fixed` و `sticky`
- المان Flex/Grid با `z-index`
- `isolation: isolate` (روش صریح و تمیز برای ساختن آگاهانه)

```css
.card { position: relative; z-index: 1; }
.card .tooltip { position: absolute; z-index: 9999; }
/* tooltip فقط بالاتر از بقیه‌ی فرزندان card است،
   نه از کارت‌های مجاور با z-index بالاتر */
```

**راه‌حل:** ساختار را بررسی کن: المان شکایت‌کننده کدام والد را دارد که Stacking Context ساخته؟ یک مدیریت منظم `z-index` با متغیرها بساز:

```css
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 1000;
  --z-toast: 1100;
}
```

و برای کامپوننت‌ها از `isolation: isolate` استفاده کن تا `z-index`های داخلی بیرون نشت نکنند.

---

## ۳.۱۹ Flexbox و Grid پیشرفته `[مفید/حرفه‌ای]`

### Flexbox

چرا متن طولانی از Flex Item بیرون می‌زند؟ پیش‌فرض `min-width: auto` است، یعنی آیتم نمی‌تواند از اندازه‌ی محتوایش کوچک‌تر شود.

```css
.row { display: flex; gap: 16px; }
.row .content { flex: 1; min-width: 0; }   /* اجازه‌ی کوچک شدن و بریده شدن متن */
```

**ترفند `margin: auto` در Flex:**

```css
.navbar { display: flex; }
.navbar .logout { margin-inline-start: auto; }  /* آخرین آیتم را به انتها می‌فرستد */
```

**ترتیب رشد و کوچک شدن:** `flex-basis` اندازه‌ی اولیه است؛ بعد `flex-grow` فضای اضافی و `flex-shrink` کمبود فضا را بین آیتم‌ها تقسیم می‌کند. `flex: 1 1 0` یعنی «همه از صفر شروع کنند و مساوی تقسیم شوند».

### Grid

```css
/* ستون‌های خودکار + ارتفاع ثابت برای ردیف‌ها */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  grid-auto-rows: 160px;
  gap: 12px;
}
.gallery .wide { grid-column: span 2; }

/* وسط‌چین سریع */
.hero { display: grid; place-items: center; min-height: 60vh; }

/* نسبت ابعاد */
.thumb { aspect-ratio: 16 / 9; object-fit: cover; width: 100%; }
```

| تفاوت | `auto-fit` | `auto-fill` |
|-------|------------|-------------|
| رفتار با ستون‌های خالی | ستون‌های خالی جمع می‌شوند و آیتم‌ها کش می‌آیند | ستون‌های خالی باقی می‌مانند |

**Subgrid** (ارث بردن خطوط شبکه از والد، برای هم‌ترازی عناصر داخلی کارت‌ها) در مرورگرهای مدرن پشتیبانی می‌شود `[پیشرفته/اختیاری]`. پشتیبانی را پیش از استفاده بررسی کن.

**اشتباهات رایج**

- فراموش کردن `min-width: 0` و سرریز متن.
- `auto-fit` و `auto-fill` را یکسان فرض کردن.
- استفاده از Grid با ارتفاع ثابت و محتوای متغیر.

---

## ۳.۲۰ Container Queries `[پیشرفته/اختیاری]`

Media Query به اندازه‌ی صفحه نگاه می‌کند؛ Container Query به اندازه‌ی والد کامپوننت. این کار کامپوننت‌ها را واقعاً مستقل می‌کند: یک کارت وقتی در سایدبار باریک است ساده و وقتی در ستون پهن است افقی می‌شود، فارغ از عرض صفحه.

```css
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

.card { display: grid; gap: 12px; }

@container card (min-width: 480px) {
  .card { grid-template-columns: 160px 1fr; }
}
```

**توضیح:** `container-type: inline-size` والد را «کانتینر قابل‌پرس‌وجو» می‌کند. `@container` شرط را روی عرض آن والد می‌سنجد (باید المان داخل کانتینر باشد، نه خود کانتینر).

پشتیبانی در مرورگرهای مدرن خوب است؛ پیش از استفاده در محصول واقعی، پشتیبانی هدف پروژه‌ات را بررسی کن.

---

## ۳.۲۱ معماری CSS و نام‌گذاری `[مفید/حرفه‌ای]`

**مشکل:** CSS سراسری است؛ هر قانون می‌تواند روی هر جای صفحه اثر بگذارد. در پروژه‌ی بزرگ، بدون نظم، تغییر یک قانون جای دیگری را خراب می‌کند.

### BEM: یک قرارداد نام‌گذاری

Block، Element، Modifier:

```html
<article class="card card--featured">
  <img class="card__image" src="..." alt="..." />
  <h3 class="card__title">عنوان</h3>
  <button class="card__button card__button--primary">خرید</button>
</article>
```

```css
.card { }            /* Block: کامپوننت مستقل */
.card__title { }     /* Element: بخشی از Block (دو underline) */
.card--featured { }  /* Modifier: نسخه یا وضعیتی از Block (دو خط تیره) */
```

**مزیت‌ها:** همه‌ی Selectorها یک کلاس‌اند (Specificity یکسان و کم)؛ از روی نام می‌فهمی هر چیز به کجا تعلق دارد؛ کامپوننت‌ها بازاستفاده‌پذیرند.

### اصول معماری

- **کامپوننت‌محور:** هر بخش UI (دکمه، کارت، نوار ناوبری) یک بلوک مستقل با فایل یا بخش خودش.
- **Selectorهای کم‌عمق:** حداکثر یک یا دو سطح؛ از `header .nav ul li a` پرهیز کن.
- **بدون وابستگی به ساختار HTML:** `.card__title` بهتر از `.card > div > h3`.
- **کلاس ابزاری** برای موارد کوچک تکراری (`.visually-hidden`، `.container`) با احتیاط.

### ساختار فایل‌ها

```
css/
|-- base/
|   |-- reset.css
|   |-- variables.css
|   `-- typography.css
|-- layout/
|   |-- container.css
|   `-- grid.css
|-- components/
|   |-- button.css
|   |-- card.css
|   `-- navbar.css
`-- main.css        <- فایل ورودی؛ بقیه را import می‌کند
```

### CSS Reset / Normalize

مرورگرها استایل پیش‌فرض متفاوتی دارند. یک Reset کوچک مدرن:

```css
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; line-height: 1.6; -webkit-font-smoothing: antialiased; }
img, picture, video, svg { display: block; max-width: 100%; height: auto; }
input, button, textarea, select { font: inherit; }
p, h1, h2, h3, h4 { overflow-wrap: break-word; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
```

**تفاوت Reset و Normalize:** Reset همه‌چیز را صفر می‌کند؛ Normalize تفاوت‌های مرورگرها را هم‌سطح می‌کند و پیش‌فرض‌های مفید را نگه می‌دارد. امروز معمولاً یک «Reset مدرن و کوچک» مثل بالا کافی است.

### CSS Nesting (مدرن)

```css
.card {
  padding: 1rem;
  & .title { font-size: 1.25rem; }
  &:hover { box-shadow: 0 4px 12px rgb(0 0 0 / .1); }
  @media (min-width: 768px) { padding: 1.5rem; }
}
```

در مرورگرهای مدرن بدون Sass کار می‌کند؛ ولی عمق Nesting را زیاد نکن. (پشتیبانی را بررسی کن.)

> **خارج از این جزوه:** Sass/SCSS، Tailwind، CSS-in-JS، CSS Modules. بعد از React با آن‌ها آشنا می‌شوی؛ اصول بالا در همه‌ی آن‌ها لازم است.

---

## ۳.۲۲ دسترس‌پذیری و عملکرد در CSS `[ضروری]`

### حالت Focus

هرگز `outline: none` را بدون جایگزین نگذار؛ کاربر کیبورد گم می‌شود.

```css
:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 3px;
}
```

### `prefers-reduced-motion`

بعضی کاربران (مثلاً با مشکلات تعادل یا تشنج) انیمیشن را در سیستم‌عامل خاموش کرده‌اند:

```css
.card { transition: transform .3s; }

@media (prefers-reduced-motion: reduce) {
  .card { transition: none; }
  * { scroll-behavior: auto !important; }
}
```

### سایر نکات دسترس‌پذیری

- کنتراست رنگ‌ها (حداقل ۴.۵ به ۱ برای متن معمولی).
- اندازه‌ی هدف لمسی: دکمه‌ها و لینک‌ها حداقل حدود ۴۴ در ۴۴ پیکسل در موبایل.
- رنگ تنها معنا را منتقل نکند (علامت یا متن هم بگذار).
- فونت `rem` تا زوم و تنظیمات کاربر عمل کند.

**مخفی‌سازی فقط بصری** (متن برای screen reader ولی نامرئی):

```css
.visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  margin: -1px; padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
```

`display: none` و `visibility: hidden` المان را از screen reader هم پنهان می‌کنند (برای حالت مخفی واقعی مناسب‌اند).

**Skip Link** (ظاهر شدن هنگام فوکوس):

```css
.skip-link {
  position: absolute;
  inset-inline-start: 1rem;
  top: -4rem;
  background: #000; color: #fff; padding: .5rem 1rem;
}
.skip-link:focus { top: 1rem; }
```

### ملاحظات عملکرد

- انیمیشن فقط `transform` و `opacity`.
- فونت: تنها وزن‌های لازم، فرمت `woff2`، `font-display: swap`.
- حجم CSS را کم و بی‌استفاده‌ها را حذف کن.
- تصاویر پس‌زمینه‌ی بزرگ را بهینه کن.
- از Selectorهای فوق‌العاده پیچیده‌ی بی‌دلیل پرهیز کن (اثر عملکردی کوچک است، ولی نگهداری را سخت می‌کند).
- در صفحه‌های بسیار طولانی `content-visibility: auto` می‌تواند رندر بخش‌های خارج از دید را به تعویق بیندازد `[پیشرفته/اختیاری]`.

> **ارتباط با فصل‌های بعد:** در فصل Performance Basics و Accessibility دوباره به این نکات برمی‌گردیم.

---

## ۳.۲۳ مرور سریع ویژگی‌های مدرن CSS `[مفید/حرفه‌ای]`

| ویژگی | کاربرد |
|-------|--------|
| `gap` | فاصله در Flex و Grid |
| `aspect-ratio` | نسبت ابعاد بدون هک |
| `inset` | کوتاه‌نویسی `top`/`right`/`bottom`/`left` |
| Logical properties | جایگزین ویژگی‌های فیزیکی مثل `padding-top`: `margin-inline`، `padding-block`، `inset-inline-start` (سازگار با RTL/LTR) |
| `:has()` | انتخاب والد |
| Container Queries | کامپوننت واکنش‌گرا به والد |
| CSS Nesting | تو در تو نوشتن بدون Sass |
| `@layer` | کنترل Cascade |
| `clamp()` | اندازه‌ی روان |
| `color-mix()` | ترکیب رنگ‌ها |
| `accent-color` | رنگ `checkbox` و `radio` بومی |
| `scroll-snap` | اسکرول مرحله‌ای (کاروسل) |
| `dvh`، `svh` | ارتفاع صحیح در موبایل |
| `text-wrap: balance` | متعادل کردن خطوط عنوان |

> **قاعده:** هر ویژگی جدید را قبل از استفاده در پروژه‌ی واقعی با `caniuse.com` و MDN بسنج. اگر مخاطبانت مرورگرهای قدیمی دارند، یک fallback بگذار (قاعده‌ای که اگر ویژگی جدید پشتیبانی نشد، همچنان کار کند).

### Logical Properties و RTL (مهم برای فارسی)

```css
/* فیزیکی: به جهت وابسته است */
.box { margin-left: 16px; padding-right: 8px; text-align: left; }

/* منطقی: با dir خودکار برمی‌گردد */
.box {
  margin-inline-start: 16px;   /* ابتدای خط */
  padding-inline-end: 8px;     /* انتهای خط */
  text-align: start;
}
```

اگر سایتت دوزبانه (فارسی و انگلیسی) است، ویژگی‌های منطقی مانع نوشتن دو نسخه‌ی CSS می‌شوند.

---

## ۳.۲۴ چطور یک UI واقعی و حرفه‌ای را فقط با CSS بسازیم؟ `[ضروری]`

ظاهر حرفه‌ای از سیستم می‌آید، نه از تعداد افکت‌ها. چهار گام:

### گام ۱: سیستم طراحی (Design Tokens) با متغیرها

```css
:root {
  /* رنگ‌ها */
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --gray-50: #f8fafc;
  --gray-200: #e2e8f0;
  --gray-600: #475569;
  --gray-900: #0f172a;

  /* مقیاس فاصله (مضرب ۴ یا ۸) */
  --space-1: .25rem;
  --space-2: .5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* مقیاس تایپوگرافی */
  --text-sm: .875rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-2xl: 1.75rem;

  /* شعاع و سایه */
  --radius: 12px;
  --shadow-sm: 0 1px 2px rgb(15 23 42 / .08);
  --shadow-md: 0 8px 24px rgb(15 23 42 / .12);
}
```

### گام ۲: Reset پایه (بخش ۳.۲۱)

### گام ۳: کامپوننت‌ها با حالت‌ها

هر کامپوننت باید این حالت‌ها را داشته باشد: عادی، `hover`، `focus-visible`، `active`، `disabled`.

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-6);
  border: 0;
  border-radius: var(--radius);
  background: var(--primary-600);
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background-color .2s ease, transform .2s ease;
}
.btn:hover { background: var(--primary-700); transform: translateY(-1px); }
.btn:active { transform: translateY(0); }
.btn:focus-visible { outline: 3px solid var(--primary-600); outline-offset: 3px; }
.btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }
.btn--ghost {
  background: transparent;
  color: var(--primary-600);
  box-shadow: inset 0 0 0 2px var(--primary-600);
}
```

### گام ۴: چیدمان واکنش‌گرا

```css
.container { width: min(100% - 2rem, 1100px); margin-inline: auto; }

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-6);
}

.card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6);
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  transition: box-shadow .2s ease, transform .2s ease;
}
.card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.card__title { font-size: var(--text-lg); color: var(--gray-900); margin: 0; }
.card__text { color: var(--gray-600); margin: 0; }
```

### اصول بصری که فرق ایجاد می‌کنند

| اصل | چکار کنیم |
|-----|-----------|
| فاصله‌ی منظم | فقط از مقیاس فاصله استفاده کن؛ فضای خالی کافی بده |
| سلسله‌مراتب | اندازه، وزن و رنگ را برای تفکیک اهمیت به‌کار ببر |
| محدودیت رنگ | یک رنگ اصلی، خاکستری‌های خنثی، رنگ‌های وضعیت (موفق/خطا) |
| همسویی | همه‌چیز روی یک شبکه‌ی نامرئی |
| سازگاری | شعاع گوشه، سایه و فونت یکسان در همه‌جا |
| حالت‌ها | `hover`، `focus`، `disabled`، `loading` |
| خوانایی | کنتراست، `line-height`، عرض خط (`max-width: 65ch`) |

**اشتباهات رایج**

- مقادیر تصادفی (`padding: 13px`، `margin: 27px`).
- رنگ‌های زیاد بدون سیستم.
- نبودن حالت `focus` و `disabled`.
- سایه‌های سنگین و گوشه‌های خیلی گرد بدون هماهنگی.
- ساختن UI قبل از ساختن قواعد (Tokens).

**تمرین کوچک:** یک «کارت محصول» کامل (تصویر، عنوان، قیمت، دکمه) با Tokens بساز؛ سپس فقط با تغییر متغیرها یک «تم دوم» بساز.

---

## ۳.۲۵ چک‌لیست مهارتی CSS

### پایه `[ضروری]`

- [ ] سه روش افزودن CSS و دلیل ترجیح فایل خارجی را می‌دانم.
- [ ] Selectorهای پایه، ترکیبی، Attribute، Pseudo-class و Pseudo-element را درست می‌نویسم.
- [ ] Box Model و `box-sizing` را توضیح می‌دهم و با DevTools می‌خوانم.
- [ ] واحدها (`px`، `%`، `rem`، `em`، `vw`، `vh`) را می‌شناسم و درست انتخاب می‌کنم.
- [ ] `display` و تفاوت روش‌های مخفی‌سازی را می‌دانم.

### چیدمان `[ضروری]`

- [ ] با `position` و `z-index` یک badge، هدر `sticky` و overlay می‌سازم.
- [ ] با Flexbox ناوبری، وسط‌چین، ردیف کارت و Sticky Footer می‌سازم.
- [ ] با Grid چیدمان صفحه (Areas) و شبکه‌ی کارت واکنش‌گرا می‌سازم.
- [ ] Media Query و Mobile-First را به‌کار می‌برم و روی گوشی واقعی تست می‌کنم.
- [ ] Transition و Animation را با `transform` و `opacity` می‌نویسم.

### پیشرفته `[ضروری و مفید]`

- [ ] متغیرهای CSS، تم تیره و `clamp()` را می‌نویسم.
- [ ] Specificity را حساب و دلیل override شدن را با DevTools پیدا می‌کنم.
- [ ] تفاوت وراثت (چه چیزی ارث می‌رسد) را می‌دانم.
- [ ] Stacking Context و دلیل `z-index` بی‌اثر را می‌فهمم.
- [ ] BEM یا یک قرارداد مشابه را به‌کار می‌برم و ساختار فایل‌ها را منظم می‌کنم.
- [ ] Focus، `prefers-reduced-motion` و کنتراست را در همه‌ی پروژه‌ها رعایت می‌کنم.
- [ ] Logical Properties را برای RTL می‌شناسم.
- [ ] یک UI کامل با Tokens و حالت‌های مختلف می‌سازم.

**اختیاری:** Container Queries، Subgrid، `@layer`، Nesting؛ مفید است ولی برای ورود به React شرط لازم نیست.

---

## تمرین‌های CSS پیشرفته

**ساده**

1. رنگ، فاصله و فونت پروژه‌ات را به متغیر ببر.
2. یک `h1` روان با `clamp()` بساز.
3. `:focus-visible` استایل‌دار برای همه‌ی عناصر تعاملی بنویس.

**متوسط**

1. یک تم تیره با `prefers-color-scheme` اضافه کن.
2. کارت‌های پروژه‌ات را با BEM بازنویسی کن.
3. یک مثال واقعی از Stacking Context بساز که `z-index: 9999` کار نکند و با `isolation` درست کن.

**چالشی**

1. یک کتابخانه‌ی کوچک کامپوننت (دکمه، کارت، Badge، Input، Alert) با Tokens بساز و در یک صفحه‌ی «Style Guide» نمایش بده.
2. همین کارت را در یک ستون باریک و یک ستون پهن با Container Query به دو شکل نمایش بده.

---

## آیا CSS پیشرفته را بلدم؟

**سؤالات مفهومی**

1. چرا یک ID در Specificity از ده کلاس قوی‌تر است؟ و چرا این موضوع برای نگهداری مشکل‌ساز است؟
2. چرا `z-index: 9999` گاهی بی‌اثر است؟
3. فرق `:is()` و `:where()` در Specificity چیست و کجا از `:where()` استفاده می‌کنی؟
4. متغیر CSS چه تفاوت اساسی با متغیر Sass دارد؟
5. فرق Media Query و Container Query را با یک مثال بگو.
6. چرا `outline: none` بدون جایگزین مشکل دسترس‌پذیری است؟
7. Logical Properties چه مشکلی را در سایت فارسی و انگلیسی حل می‌کنند؟

**تمرین کوتاه (کد را بخوان)**

8. این دکمه چه رنگی دارد و چرا؟

```html
<button id="save" class="btn primary">ذخیره</button>
```

```css
button { color: black; }
.btn { color: blue; }
.btn.primary { color: green; }
#save { color: red; }
button.primary { color: orange; }
```

9. حداقل و حداکثر اندازه‌ی این فونت چقدر است؟

```css
h1 { font-size: clamp(1.5rem, 1rem + 3vw, 2.5rem); }
```

10. چرا tooltip پشت کارت بعدی می‌رود؟ چطور اصلاحش می‌کنی؟

```css
.card { position: relative; z-index: 1; }
.card:nth-child(2) { z-index: 2; }
.tooltip { position: absolute; z-index: 9999; }
```

---

## پروژه‌ی سطح CSS پیشرفته: «Dashboard مدیریتی»

- **هدف:** ساخت یک داشبورد کامل با سیستم طراحی منسجم، تم روشن و تیره و واکنش‌گرا. (JavaScript لازم نیست؛ در فصل‌های بعد همین را زنده می‌کنیم.)
- **امکانات:**
  - سایدبار ناوبری (در موبایل جمع‌شونده با تکنیک بدون JS یا فقط افقی)، نوار بالا با جستجو و آواتار.
  - کارت‌های آماری (۴ عدد)، یک جدول داده، یک «نمودار» ساده با CSS (مثلاً میله‌ای با `height` درصدی)، لیست فعالیت‌های اخیر.
  - حالت‌های دکمه، Badgeهای وضعیت (موفق، هشدار، خطا) و یک Alert.
  - تم روشن و تیره با متغیرها و `prefers-color-scheme`.
- **مهارت‌ها:** Grid Areas، Flexbox، متغیرها و Tokens، `clamp()`، Media Query یا Container Query، BEM، دسترس‌پذیری در CSS.
- **محدودیت‌ها:** بدون فریم‌ورک و بدون JavaScript؛ بدون `!important` (به‌جز `prefers-reduced-motion`)؛ هیچ رنگ یا فاصله‌ی «سخت‌کد» خارج از Tokens؛ Selectorها حداکثر دو سطح.
- **معیار قبولی:**
  - تغییر یک متغیر (`--primary-600`) رنگ اصلی کل داشبورد را عوض می‌کند.
  - روی ۳۲۰، ۷۶۸ و ۱۴۴۰ پیکسل چیدمان سالم و بدون اسکرول افقی است (به‌جز جدول که در کانتینر خودش اسکرول می‌شود).
  - هر دو تم روشن و تیره حداقل کنتراست ۴.۵ به ۱ دارند.
  - همه‌ی عناصر تعاملی `:focus-visible` دیدنی دارند.
  - با `prefers-reduced-motion: reduce` هیچ انیمیشنی اجرا نمی‌شود.
  - هیچ Specificity بالا یا `id` در CSS نیست.

---

## پاسخنامه‌ی مختصر (پس از تلاش خودت ببین)

**سؤال ۸:** قرمز، چون `#save` با وزن (۱، ۰، ۰) از همه قوی‌تر است.

**سؤال ۹:** حداقل `1.5rem` (۲۴px) و حداکثر `2.5rem` (۴۰px)، با فونت پایه‌ی ۱۶px.

**سؤال ۱۰:** هر `.card` با `z-index` یک Stacking Context مستقل می‌سازد؛ `z-index: 9999` تولتیپ فقط داخل همان کارت اعتبار دارد و کارت دوم (با `z-index: 2`) کل کارت اول را همراه تولتیپش زیر خودش می‌گذارد. راه‌حل: برای کارتی که تولتیپش باز است (مثلاً با `:hover` یا `:focus-within`) `z-index` بالاتر بده، یا کارت‌ها را `z-index` یکسان بده تا تولتیپ در یک سطح مقایسه شود.
