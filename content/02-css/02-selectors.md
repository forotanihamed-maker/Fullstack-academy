---
title: Selectorها در CSS
description: از selectorهای پایه تا combinatorها، attribute selectorها و pseudo-classهای پرکاربرد را یاد بگیرید.
difficulty: beginner
estimatedMinutes: 25
objectives:
  - استفاده از element، class و id selector
  - گروه‌بندی selectorها و ترکیب selector با عنصر
  - تشخیص descendant، child و sibling combinator
  - استفاده مقدماتی از attribute selector و pseudo-class
concepts:
  - selectors
  - class
  - id
  - combinators
  - attribute selectors
  - pseudo-classes
  - pseudo-elements
prerequisites:
  - 02-css/01-css-what
relatedLessons:
  - 02-css/03-color
relatedProjects:
  - css-personal-profile
nextLesson: 03-color
---

## Selector چیست؟

Selector مشخص می‌کند کدام عنصر یا عناصر باید یک Rule را دریافت کنند.

### Selectorهای پایه

```css
p {
  line-height: 1.8;
}

.card {
  padding: 1rem;
}

#pricing {
  margin-top: 2rem;
}

* {
  box-sizing: border-box;
}
```

در این مثال‌ها به‌ترتیب عنصر، کلاس، شناسه و همه عناصر انتخاب می‌شوند.

برای استایل‌دهی پروژه‌های این مسیر، تا جای ممکن به‌جای `id` از class استفاده می‌کنیم؛ این کار معمولاً specificity را قابل‌کنترل‌تر نگه می‌دارد.

## گروه‌بندی و ترکیب

```css
h1, h2, h3 {
  font-weight: 700;
}

p.note {
  color: #92400e;
}
```

فاصله، `>`، `+` و `~` معنی متفاوتی دارند:

```css
nav li { }
ul > li { }
h2 + p { }
h2 ~ p { }
```

- فاصله: هر نسلِ داخل عنصر
- `>`: فرزند مستقیم
- `+`: خواهر/برادر بلافاصله بعدی
- `~`: همه خواهر/برادرهای بعدی در همان سطح

## Attribute Selector

```css
a[target="_blank"] { }
input[type="email"] { }
a[href^="https"] { }
a[href$=".pdf"] { }
a[href*="example"] { }
```

این selectorها زمانی مفیدند که بخواهیم بر اساس یک attribute یا مقدار آن انتخاب کنیم.

## Pseudo-class

Pseudo-class وضعیت یا شرایط یک عنصر را هدف می‌گیرد:

```css
a:hover {
  text-decoration: underline;
}

button:focus-visible {
  outline: 3px solid #2563eb;
}

li:first-child { }
li:last-child { }
li:nth-child(2n) { }
li:not(.active) { }
```

برای عناصر تعاملی، `focus-visible` را جدی بگیرید تا کاربر صفحه‌کلید هم وضعیت فوکوس را واضح ببیند.

## Pseudo-element

Pseudo-element بخشی از عنصر یا محتوای تولیدشده را هدف می‌گیرد:

```css
.badge::before {
  content: "جدید";
  background: #dc2626;
  color: white;
  padding: 0.125rem 0.375rem;
}
```

`::before` و `::after` در DOM محتوای مستقل ایجاد نمی‌کنند؛ محتوای مهم و قابل‌خواندن را در آن‌ها قرار ندهید.

## اشتباهات رایج

- فراموش کردن `.` برای class یا `#` برای id
- اشتباه گرفتن `li ul` با `li > ul`
- استفاده از selectorهای بسیار طولانی و شکننده
- فراموش کردن `content` برای `::before` و `::after`

## تمرین ذهنی

در یک فهرست شش‌تایی، با `:nth-child(2n)` ردیف‌های زوج را متفاوت کنید، اولین آیتم را ضخیم کنید و با `::after` یک علامت کنار آخرین آیتم قرار دهید.

## مدل ذهنی Selectorها: «چه چیزی را هدف گرفته‌ام؟»

قبل از نوشتن selector، اول رابطه‌ی عنصر با سند را مشخص کنید. چهار سؤال سریع:

1. آیا این سبک فقط برای یک نوع عنصر است؟ → element selector.
2. آیا چند عنصر یک نقش مشترک دارند؟ → class.
3. آیا باید بر اساس یک ویژگی HTML انتخاب کنم؟ → attribute selector.
4. آیا حالت یا رابطه‌ی خاصی مهم است؟ → pseudo-class یا combinator.

در پروژه‌های واقعی معمولاً **class انتخاب اصلی برای styling** است و ID بیشتر برای شناسه‌ی یکتا، anchor، JavaScript یا دسترسی به یک عنصر خاص نگه داشته می‌شود.

## Combinatorها را با ساختار HTML بخوانید

```html
<article class="card">
  <h2>CSS</h2>
  <div class="meta">
    <span>Beginner</span>
  </div>
</article>
```

```css
.card h2 { }       /* هر h2 در هر عمق داخل card */
.card > h2 { }      /* فقط فرزند مستقیم */
.card h2 + .meta { } /* .meta بلافاصله بعد از h2 */
.card h2 ~ .meta { } /* .metaهای هم‌سطح بعد از h2 */
```

**نکته‌ی دیباگ:** اگر selector ظاهراً درست است ولی اعمال نمی‌شود، اول DOM را نگاه کنید؛ بسیاری از خطاها از اشتباه گرفتن descendant با child یا sibling می‌آیند.

## Attribute Selectorها در UI واقعی

```css
input[type="email"] { }
input[required] { }
a[href^="https://"] { }
a[href$=".pdf"] { }
a[href*="github"] { }
```

این الگو برای فرم‌ها، لینک‌های خارجی و نوع فایل مفید است؛ اما برای کلاس‌های component معمولاً class selector خواناتر و قابل نگهداری‌تر است.

## Pseudo-class و Pseudo-element را قاطی نکنید

- `:hover`، `:focus-visible`، `:checked` و `:disabled` یک **حالت/شرایط عنصر** را انتخاب می‌کنند.
- `::before`، `::after`، `::placeholder` و `::marker` یک **بخش/شبه‌عنصر** را هدف می‌گیرند.

```css
button:hover { }
button:focus-visible { }
button::before { content: ""; }
```

برای `::before` و `::after` معمولاً `content` لازم است. همچنین محتوای مهم و معنایی را فقط در pseudo-element قرار ندهید.

## تمرین دیباگ Selector

کد زیر را قبل از اجرای صفحه تحلیل کنید:

```css
.nav > a { color: blue; }
.nav a.active { color: green; }
.nav a:hover { color: red; }
```

اگر لینک داخل `<li>` باشد، قانون اول به آن نمی‌رسد؛ چون `<a>` فرزند مستقیم `.nav` نیست. در DevTools روی عنصر کلیک کنید و در تب **Styles** ببینید کدام selectorها match شده‌اند و کدام ruleها خط خورده‌اند.

## قرارداد پیشنهادی برای پروژه‌های بزرگ

```css
.card { }
.card__title { }
.card__meta { }
.card--featured { }
```

هرچه selector به ساختار HTML کمتر وابسته باشد، تغییر markup یا انتقال component کم‌هزینه‌تر می‌شود.

### چک‌لیست تسلط

- می‌توانم selector را از روی DOM پیش‌بینی کنم.
- می‌دانم `>` با فاصله چه تفاوتی دارد.
- می‌توانم `:hover` و `::before` را از هم تشخیص دهم.
- می‌توانم یک selector بیش‌ازحد پیچیده را به classهای ساده‌تر تبدیل کنم.
- می‌توانم با DevTools علت match نشدن selector را پیدا کنم.

