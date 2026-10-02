---
title: معماری CSS، BEM، Reset و Nesting
description: CSS را کامپوننت‌محور و قابل نگهداری سازمان دهید و با Reset کوچک شروع کنید.
difficulty: advanced
estimatedMinutes: 30
objectives:
- نام‌گذاری BEM
- کاهش عمق Selector
- ساخت ساختار فایل CSS
- نوشتن Reset کوچک
- شناخت CSS Nesting
concepts:
- BEM
- Block
- Element
- Modifier
- CSS reset
- Nesting
- component architecture
prerequisites:
- 02-css/20-container-query
relatedLessons:
- 02-css/22-accessibility-performance
relatedProjects:
- css-advanced-dashboard
nextLesson: 02-css/22-accessibility-performance
---

## BEM
BEM قرارداد Block / Element / Modifier است:

```html
<article class="card card--featured">
  <img class="card__image" src="..." alt="" />
  <h3 class="card__title">عنوان</h3>
  <button class="card__button card__button--primary">خرید</button>
</article>
```

Selectorها کوتاه و کم‌عمق بمانند و به ساختار HTML وابستگی شدید نداشته باشند.

## ساختار فایل
یک ساختار قابل توسعه می‌تواند چنین باشد:

```text
css/
├── base/
│   ├── reset.css
│   ├── variables.css
│   └── typography.css
├── layout/
│   ├── container.css
│   └── grid.css
└── components/
    ├── button.css
    ├── card.css
    └── navbar.css
```

## Reset کوچک

```css
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; line-height: 1.6; }
img, picture, video, svg { display: block; max-width: 100%; height: auto; }
input, button, textarea, select { font: inherit; }
```

## CSS Nesting
در مرورگرهای مدرن می‌توان nesting بومی داشت:

```css
.card {
  padding: 1rem;
  & .title { font-size: 1.25rem; }
  &:hover { box-shadow: 0 4px 12px rgb(0 0 0 / .1); }
}
```

عمق nesting را زیاد نکنید و پشتیبانی مرورگر را بررسی کنید.

## معماری CSS یعنی کنترل تغییرات

هدف معماری CSS این نیست که فقط فایل‌های بیشتری بسازیم؛ هدف این است که تغییر یک component، بخش‌های نامرتبط را نشکند.

سه اصل پایه:

1. componentها مستقل باشند.
2. selectorها کوتاه و کم‌عمق باشند.
3. تصمیم‌های تکرارشونده به token یا utility مشخص منتقل شوند.

## BEM را با مثال واقعی بخوانید

```html
<article class="card card--featured">
  <h2 class="card__title">CSS</h2>
  <button class="card__button card__button--primary">شروع</button>
</article>
```

- Block: `card`
- Element: `card__title`
- Modifier: `card--featured`

از selectorهایی مثل `.page .content .card h2` تا حد امکان دوری کنید؛ این selector به ساختار صفحه وابسته است.

## Reset کوچک و مسئولانه

Reset باید predictable باشد، نه اینکه بدون دلیل رفتارهای مفید browser را حذف کند. الگوهایی مانند `box-sizing`, حذف margin پیش‌فرض body، responsive media و inherit کردن font در form controls معمولاً نقطه‌ی شروع خوبی هستند.

## Nesting با عمق کنترل‌شده

```css
.card {
  padding: 1rem;
  & .card__title { margin: 0; }
  &:hover { box-shadow: var(--shadow-md); }
}
```

Nesting خوانایی را بهتر می‌کند، اما nesting عمیق همان مشکل specificity و وابستگی به ساختار را بازمی‌گرداند. عمق کم و نام‌گذاری واضح را ترجیح دهید.

## ساختار فایل پیشنهادی

```text
css/
  base/
    reset.css
    variables.css
    typography.css
  layout/
    container.css
    grid.css
  components/
    button.css
    card.css
    navbar.css
```

در پروژه‌های واقعی این ساختار می‌تواند با CSS Modules، Sass یا ابزار build تغییر کند؛ اصل مهم separation of concerns است.

### چک‌لیست تسلط

- می‌توانم یک component را با BEM نام‌گذاری کنم.
- selectorها را حداکثر تا حد لازم کم‌عمق نگه می‌دارم.
- می‌دانم reset با normalize چه تفاوت مفهومی دارد.
- می‌توانم nesting را بدون ایجاد specificity جنگی استفاده کنم.

