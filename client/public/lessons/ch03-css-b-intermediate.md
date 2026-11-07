# فصل ۳: CSS — بخش B: متوسط

## ۳.۹ position، z-index و overflow `[ضروری]`

`position` تعیین می‌کند المان چطور جایگذاری شود. با `top`، `right`، `bottom`، `left` (یا مختصر `inset`) جابه‌جا می‌شود.

| مقدار | رفتار | نسبت به |
|-------|-------|---------|
| `static` | پیش‌فرض؛ در جریان عادی؛ `top`/`left` اثر ندارد | |
| `relative` | در جریان عادی می‌ماند و جای اصلی‌اش محفوظ است؛ با `top`/`left` می‌توان جابه‌جایش کرد | جای اصلی خودش |
| `absolute` | از جریان عادی خارج می‌شود و جایش خالی می‌ماند | نزدیک‌ترین والد غیر `static` (یا کل صفحه) |
| `fixed` | از جریان خارج و ثابت در صفحه (حتی با اسکرول) | viewport |
| `sticky` | تا یک آستانه‌ی اسکرول مثل `relative`، بعد مثل `fixed` می‌چسبد | والد اسکرول‌دار |

**الگوی طلایی:** والد `relative` + فرزند `absolute`:

```css
.card { position: relative; }

.card .badge {
  position: absolute;
  top: 12px;
  inset-inline-end: 12px;    /* در RTL سمت چپ؛ در LTR سمت راست */
}
```

```html
<div class="card">
  <span class="badge">تخفیف</span>
  <h3>دوره‌ی CSS</h3>
</div>
```

**هدر چسبان:**

```css
.site-header {
  position: sticky;
  top: 0;                  /* بدون top، sticky عمل نمی‌کند */
  background: #fff;
  z-index: 100;
}
```

**`z-index`:** ترتیب لایه‌ها روی محور عمق. فقط روی المان‌هایی اثر دارد که `position` غیر `static` دارند (یا فرزند Flex/Grid باشند). عدد بزرگ‌تر بالاتر است. (نکته‌ی مهم درباره‌ی Stacking Context در بخش پیشرفته.)

**`overflow`:** رفتار وقتی محتوا از جعبه بیرون می‌زند.

| مقدار | رفتار |
|-------|-------|
| `visible` | بیرون می‌زند (پیش‌فرض) |
| `hidden` | بریده می‌شود |
| `scroll` | همیشه اسکرول‌بار |
| `auto` | فقط در صورت نیاز اسکرول‌بار |

بریدن متن طولانی با `...`:

```css
.title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

**اشتباهات رایج**

- `absolute` بدون والد `relative` و تعجب از اینکه المان به گوشه‌ی صفحه می‌رود.
- `sticky` بدون `top` یا با والدی که `overflow: hidden` دارد (`sticky` کار نمی‌کند).
- استفاده از `position: absolute` برای چیدمان کل صفحه (کار Flexbox و Grid است).
- عدد `z-index` خیلی بزرگ (`9999`) به‌جای مدیریت منظم لایه‌ها.

**تمرین کوچک:** یک کارت با نشان «جدید» در گوشه‌ی بالایش بساز؛ یک هدر `sticky` بساز و با اسکرول ببین چطور می‌چسبد.

---

## ۳.۱۰ Flexbox `[ضروری]`

**مفهوم.** Flexbox برای چیدمان یک‌بعدی (یک ردیف یا یک ستون) است. `display: flex` را روی المان والد (Flex Container) می‌کنیم و فرزندان مستقیم (Flex Items) خودکار چیده می‌شوند.

- **محور اصلی (Main Axis):** جهت `flex-direction`.
- **محور متقاطع (Cross Axis):** عمود بر محور اصلی.

### خاصیت‌های Container

```css
.row {
  display: flex;
  flex-direction: row;               /* row | row-reverse | column | column-reverse */
  justify-content: space-between;    /* چینش روی محور اصلی */
  align-items: center;               /* چینش روی محور متقاطع */
  flex-wrap: wrap;                   /* اجازه‌ی رفتن به خط بعد */
  gap: 16px;                         /* فاصله بین آیتم‌ها */
}
```

| خاصیت | مقادیر رایج |
|-------|--------------|
| `flex-direction` | `row` (پیش‌فرض)، `column` |
| `justify-content` | `flex-start`، `center`، `flex-end`، `space-between`، `space-around`، `space-evenly` |
| `align-items` | `stretch` (پیش‌فرض)، `flex-start`، `center`، `flex-end`، `baseline` |
| `flex-wrap` | `nowrap` (پیش‌فرض)، `wrap` |
| `gap` | فاصله‌ی بین آیتم‌ها (به‌جای `margin`) |

> **RTL:** با `dir="rtl"` جهت `row` از راست به چپ است. `flex-start` یعنی «ابتدای محور» (در RTL سمت راست). برای فارسی نیازی به `row-reverse` نیست؛ جهت خودکار درست می‌شود.

### خاصیت‌های Item

```css
.item {
  flex-grow: 1;          /* سهم از فضای اضافی */
  flex-shrink: 1;        /* اجازه‌ی کوچک شدن */
  flex-basis: 200px;     /* اندازه‌ی پایه قبل از رشد/کوچک شدن */
  align-self: flex-end;
  order: 2;              /* تغییر ترتیب بصری (مراقب دسترس‌پذیری باش) */
}

/* Shorthand: flex: grow shrink basis */
.item { flex: 1; }             /* = 1 1 0% ، فضا را مساوی تقسیم کن */
.item { flex: 0 0 200px; }     /* نه رشد نه کوچک شدن، ثابت ۲۰۰px */
```

### مثال ۱: نوار ناوبری

```html
<header class="navbar">
  <a class="logo" href="/">لوگو</a>
  <nav>
    <ul class="menu">
      <li><a href="/">خانه</a></li>
      <li><a href="/courses">دوره‌ها</a></li>
      <li><a href="/about">درباره</a></li>
    </ul>
  </nav>
  <button type="button" class="cta">ورود</button>
</header>
```

```css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 12px 24px;
}

.menu {
  display: flex;
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}
```

**توضیح:** `.navbar` سه فرزند دارد (لوگو، منو، دکمه)؛ `space-between` اولی را به ابتدا و آخری را به انتها می‌برد. `.menu` خودش یک Flex Container جداست (Flexbox تو در تو کاملاً رایج است).

### مثال ۲: وسط‌چین کامل (مشهورترین الگو)

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

### مثال ۳: کارت‌ها در یک ردیف با شکستن خودکار

```css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.cards .card {
  flex: 1 1 260px;      /* حداقل حدود ۲۶۰px، بعد رشد کن */
}
```

### مثال ۴: «فوتر به پایین» (Sticky Footer)

```css
body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main { flex: 1; }       /* فضای باقی‌مانده را بگیر */
```

**اشتباهات رایج**

- نوشتن `display: flex` روی فرزندان به‌جای والد.
- اشتباه گرفتن `justify-content` (محور اصلی) و `align-items` (محور متقاطع)؛ در `column` جایشان عوض می‌شود.
- استفاده از `margin` برای فاصله‌ی بین آیتم‌ها به‌جای `gap`.
- انتظار اینکه بدون `flex-wrap` یا `flex-basis` مناسب خوب بشکند.
- استفاده از `order` که ترتیب بصری را از ترتیب خواندن و Tab جدا می‌کند.

**تمرین کوچک:** فقط با Flexbox: (الف) سه دکمه را در یک ردیف با فاصله‌ی مساوی بچین؛ (ب) یک عنصر را دقیقاً وسط صفحه بگذار؛ (پ) سه کارت بساز که در عرض کم به خط بعد بروند.

---

## ۳.۱۱ Grid `[ضروری]`

**مفهوم.** Grid برای چیدمان دوبعدی (هم ردیف و هم ستون) است. اگر هم سطر و هم ستون برایت مهم است، Grid بهتر است.

```css
.layout {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;    /* سه ستون با نسبت ۱:۲:۱ */
  grid-template-rows: auto 1fr auto;
  gap: 16px;
}
```

واحد `fr` یعنی «سهم از فضای باقی‌مانده».

```css
grid-template-columns: repeat(3, 1fr);                /* ۳ ستون مساوی */
grid-template-columns: 240px 1fr;                     /* ستون ثابت + ستون انعطاف‌پذیر */
grid-template-columns: minmax(200px, 1fr) 2fr;        /* ستون با حداقل و حداکثر */
```

### قرار دادن آیتم‌ها

```css
.header { grid-column: 1 / -1; }     /* کل عرض: از خط اول تا آخرین خط */
.hero   { grid-column: span 2; }     /* ۲ ستون را بگیر */
.big    { grid-row: span 2; }
```

### Grid Areas (چیدمان با اسم)

```html
<div class="page">
  <header>سربرگ</header>
  <aside>سایدبار</aside>
  <main>محتوا</main>
  <footer>فوتر</footer>
</div>
```

```css
.page {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  gap: 16px;
  min-height: 100vh;
}

.page > header { grid-area: header; }
.page > aside  { grid-area: sidebar; }
.page > main   { grid-area: main; }
.page > footer { grid-area: footer; }
```

**توضیح:** ماتریس متنی در `grid-template-areas` خودش شکل صفحه را نشان می‌دهد. برای چیدمان موبایل، فقط همین ماتریس را در Media Query عوض می‌کنیم. در RTL ستون اول (`sidebar`) سمت راست قرار می‌گیرد.

### شبکه‌ی کارت‌ها: Responsive بدون Media Query

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}
```

**معنی:** هر ستون حداقل ۲۴۰px، تا جایی که جا هست ستون اضافه کن و فضای باقی‌مانده را مساوی تقسیم کن. این یکی از پرکاربردترین الگوهای CSS است.

### Flexbox یا Grid؟

| سؤال | پاسخ |
|------|------|
| یک ردیف یا یک ستون؟ (محتوا تعیین‌کننده‌ی اندازه) | Flexbox |
| یک شبکه‌ی دوبعدی؟ (طرح تعیین‌کننده) | Grid |
| چیدمان کل صفحه | Grid |
| چیدمان اجزای داخل یک کامپوننت (نوار ابزار، دکمه + آیکن) | Flexbox |

هر دو را ترکیب می‌کنیم: Grid برای اسکلت صفحه، Flexbox برای داخل هر بخش.

**اشتباهات رایج**

- استفاده از Grid برای چیدن چند دکمه در یک ردیف (Flexbox ساده‌تر است).
- فراموش کردن `gap` و استفاده از `margin`.
- تعریف تعداد ستون‌ها ثابت (`repeat(4, 1fr)`) و شکستن در موبایل؛ از `minmax` یا `auto-fit` / Media Query استفاده کن.
- آیتم‌هایی که با `min-width` بزرگ از ستون بیرون می‌زنند.

**تمرین کوچک:** با `grid-template-areas` چیدمان «سربرگ، سایدبار، محتوا، فوتر» را بساز. بعد یک شبکه‌ی ۶کارتی با `auto-fit` بساز و عرض پنجره را تغییر بده.

---

## ۳.۱۲ طراحی واکنش‌گرا (Responsive) و Media Query `[ضروری]`

**مفهوم.** صفحه باید روی موبایل، تبلت و دسکتاپ خوب دیده شود. سه جزء اصلی:

1. تگ `viewport` در HTML (فصل ۲).
2. چیدمان انعطاف‌پذیر (`%`، `fr`، `max-width`، Flexbox، Grid و تصویر واکنش‌گرا).
3. Media Query برای تغییر استایل در اندازه‌های مختلف.

```css
/* تصاویر و ویدیو هرگز از والد بیرون نزنند */
img, video {
  max-width: 100%;
  height: auto;
  display: block;
}
```

### Media Query

```css
.layout { display: grid; gap: 16px; }

@media (min-width: 768px) {
  .layout { grid-template-columns: 240px 1fr; }
}

@media (min-width: 1200px) {
  .container { max-width: 1140px; margin-inline: auto; }
}
```

### Mobile-First

ابتدا استایل موبایل (ساده‌ترین حالت) را بنویس و با `min-width` برای صفحه‌های بزرگ‌تر اضافه کن.

```css
/* پایه: موبایل */
.menu { display: none; }

/* از ۷۶۸px به بالا */
@media (min-width: 768px) {
  .menu { display: flex; }
}
```

| رویکرد | شکل | مزیت |
|--------|-----|------|
| Mobile-First | `min-width` | کد ساده‌تر برای موبایل، بار کمتر؛ توصیه‌شده |
| Desktop-First | `max-width` | برای بازنویسی سایت‌های قدیمی |

**نقاط شکست (Breakpoints):** اعداد ثابت و قطعی نیستند. رایج (پیکسل): ۶۰۰، ۷۶۸، ۱۰۲۴، ۱۲۰۰. بهتر است جایی که طرح خراب می‌شود بشکنی، نه بر اساس مدل دستگاه.

**انواع دیگر:**

```css
@media (prefers-color-scheme: dark) { /* تم تیره */ }
@media (prefers-reduced-motion: reduce) { /* کاهش انیمیشن */ }
@media (orientation: landscape) { }
@media print { /* چاپ */ }
```

**اشتباهات رایج**

- فراموش کردن تگ `viewport` (Media Queryها روی موبایل درست کار نمی‌کنند).
- عرض‌های `px` ثابت برای کانتینر (اسکرول افقی در موبایل).
- ترکیب نادرست `min-width` و `max-width` در یک پروژه (سردرگمی).
- تست فقط با تغییر عرض پنجره؛ از Device Toolbar در DevTools و یک گوشی واقعی هم استفاده کن.

**تمرین کوچک:** صفحه‌ای بساز که در موبایل تک‌ستون، در تبلت دوستونه و در دسکتاپ سه‌ستونه باشد (یک بار با Media Query و یک بار با `auto-fit`).

---

## ۳.۱۳ Animation، Transition و Transform `[ضروری]`

### Transition: تغییر نرم بین دو حالت

```css
.btn {
  background: #2563eb;
  color: #fff;
  padding: .75rem 1.5rem;
  border-radius: 8px;
  transition: background-color .2s ease, transform .2s ease;
}

.btn:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}
```

`transition: property duration timing-function delay`

**توضیح:** وقتی ماوس روی دکمه می‌رود، رنگ و موقعیت در ۰.۲ ثانیه نرم عوض می‌شود، نه ناگهانی. `transition` را روی حالت اصلی (نه فقط `:hover`) بنویس تا هم رفتن و هم برگشتن نرم باشد.

**محدودیت:** همه‌ی خاصیت‌ها قابل‌انیمیشن نیستند؛ مثلاً `display` را نمی‌شود `transition` داد.

### Transform: تغییر شکل بدون به‌هم‌ریختن چیدمان

```css
.box {
  transform: translate(20px, 10px);          /* جابه‌جایی */
  transform: scale(1.1);                     /* بزرگ‌نمایی */
  transform: rotate(45deg);                  /* چرخش */
  transform: translateY(-4px) scale(1.05);   /* ترکیب (از چپ به راست اعمال می‌شود) */
}
```

`transform` جایگاه المان را در چیدمان تغییر نمی‌دهد (فقط ظاهر آن را)؛ برای همین برای انیمیشن مناسب است.

### Animation با `@keyframes`

```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card {
  animation: fade-in-up .5s ease-out both;
}

/* اسپینر بارگذاری */
@keyframes spin { to { transform: rotate(360deg); } }

.spinner {
  width: 32px; height: 32px;
  border: 4px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin .8s linear infinite;
}
```

| خاصیت Animation | توضیح |
|-----------------|-------|
| `animation-duration` | مدت |
| `animation-timing-function` | `ease`، `linear`، `ease-in-out` |
| `animation-iteration-count` | تعداد تکرار یا `infinite` |
| `animation-fill-mode` | `both`: تا حالت اول و آخر حفظ شود |

**Transition یا Animation؟** `Transition` برای واکنش به تغییر وضعیت (`hover`، `focus`، کلاس جدید)؛ `Animation` برای حرکتی که خودش شروع می‌شود یا چند مرحله‌ای.

**نکات عملکرد**

- ترجیحاً فقط `transform` و `opacity` را انیمیت کن (روان‌ترین‌اند).
- انیمیشن `width`، `height`، `top`، `left` چیدمان را دوباره محاسبه می‌کند و کند است.
- انیمیشن را کوتاه و ظریف نگه دار (حدود ۱۵۰ تا ۴۰۰ میلی‌ثانیه برای تعاملات).
- کاربرانی که «کاهش حرکت» را روشن کرده‌اند باید احترام ببینند (در بخش پیشرفته: `prefers-reduced-motion`).

**اشتباهات رایج**

- انیمیشن‌های پرزرق‌وبرق و طولانی.
- انیمیشن `margin` یا `top` به‌جای `transform`.
- فراموش کردن `animation-fill-mode` و پرش به حالت اول در پایان.
- `transition: all` در همه‌جا (هزینه و رفتار غیرمنتظره)؛ خاصیت‌ها را نام ببر.

**تمرین کوچک:** یک کارت بساز که با `hover` کمی بالا برود و سایه‌اش بیشتر شود؛ یک اسپینر و یک پیام ورودی با `fade-in-up` بساز.

---

## تمرین‌های CSS متوسط

**ساده**

1. یک هدر `sticky` با لوگو و منوی Flex بساز.
2. دکمه‌ای با `hover` و `transition` نرم بساز.
3. سه کارت هم‌اندازه را در یک ردیف Flex بچین.

**متوسط**

1. صفحه‌ی «سربرگ، سایدبار، محتوا، فوتر» را با Grid Areas بساز و در موبایل تک‌ستونی کن.
2. گالری ۸تصویری با `auto-fit` و `object-fit: cover` بساز (تصاویر هم‌اندازه).
3. منوی ناوبری را در موبایل عمودی و در دسکتاپ افقی کن (Mobile-First).

**چالشی**

1. بدون JavaScript، یک «منوی همبرگری» ساده با تکنیک `input[type=checkbox]:checked + nav` بساز (و محدودیت‌هایش در دسترس‌پذیری را بنویس؛ بعد از فصل DOM با JS درست‌ترش می‌کنیم).

---

## آیا CSS متوسط را بلدم؟

**سؤالات مفهومی**

1. چرا `position: absolute` بدون والد `relative` به گوشه‌ی صفحه می‌رود؟
2. چه موقع Flexbox و چه موقع Grid؟ دو مثال واقعی بزن.
3. چرا `justify-content` و `align-items` در `flex-direction: column` جابه‌جا می‌شوند؟
4. چرا Mobile-First توصیه می‌شود؟
5. چرا `transform: translateX()` بهتر از انیمیت `left` است؟
6. تفاوت `flex: 1` و `flex: 0 0 200px` چیست؟

**تمرین کوتاه (کد را بخوان)**

7. چرا فرزند در این کد وسط نیست و چه چیزی باید اصلاح شود؟

```css
.parent { display: flex; height: 300px; }
.child { align-items: center; justify-content: center; }
```

8. با این CSS، هر ستون چقدر عرض می‌گیرد؟ (سه فرزند با کلاس‌های `a`، `b` و `c` داخل `.row`)

```css
.row { display: flex; width: 900px; }
.a { flex: 1; }
.b { flex: 2; }
.c { flex: 0 0 150px; }
```

9. چرا هدر این صفحه با اسکرول نمی‌چسبد؟

```css
.page { overflow: hidden; }
.page header { position: sticky; }
```

---

## پروژه‌ی سطح CSS متوسط: «Landing Page و صفحه‌ی محصول ریسپانسیو»

- **هدف:** استایل‌دهی دو صفحه‌ی پروژه‌ی HTML پیشرفته (فصل ۲) به شکل کاملاً واکنش‌گرا.
- **امکانات:**
  - **Landing Page:** هدر `sticky` با منوی Flex، Hero تمام‌عرض با دکمه‌ی CTA، شبکه‌ی ویژگی‌ها (Grid)، نظرات کاربران، FAQ، فرم خبرنامه، فوتر.
  - **صفحه‌ی محصول:** گالری تصاویر، ستون اطلاعات (Grid)، جدول مشخصات، دکمه‌ی افزودن به سبد با `hover` و `transition`.
  - **هر دو:** سه حالت چیدمان (موبایل، تبلت، دسکتاپ)، انیمیشن ورود برای بخش‌ها.
- **مهارت‌ها:** Flexbox، Grid، Position، Media Query، Animation، Transition، `object-fit`.
- **محدودیت‌ها:** بدون فریم‌ورک (Bootstrap، Tailwind) و بدون JavaScript؛ Mobile-First؛ بدون `!important`؛ بدون ارتفاع ثابت `px` برای بخش‌های متنی.
- **معیار قبولی:**
  - روی عرض‌های ۳۲۰ و ۷۶۸ و ۱۴۴۰ پیکسل اسکرول افقی وجود ندارد.
  - تصاویر هیچ‌وقت کشیده یا بیرون‌زده نیستند.
  - Flexbox و Grid هر دو در پروژه با دلیل مناسب به‌کار رفته‌اند.
  - همه‌ی عناصر تعاملی حالت `hover` و `focus` دارند.
  - انیمیشن‌ها فقط `transform` و `opacity` را تغییر می‌دهند.

---

## پاسخنامه‌ی مختصر (پس از تلاش خودت ببین)

**سؤال ۷:** `align-items` و `justify-content` باید روی والد (`.parent`) باشند، نه فرزند.

**سؤال ۸:** `.c` = ۱۵۰px؛ فضای باقی‌مانده ۷۵۰px؛ `.a` = ۲۵۰px و `.b` = ۵۰۰px.

**سؤال ۹:** `overflow: hidden` روی والد (و نبود `top`) باعث می‌شود `sticky` کار نکند.
