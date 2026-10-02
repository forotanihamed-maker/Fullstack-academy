---
title: Selectorهای پیشرفته
description: Selectorهای مدرن را برای کاهش پیچیدگی و ساخت حالت‌های دقیق به‌کار ببرید.
difficulty: advanced
estimatedMinutes: 28
objectives:
- استفاده از :is و :where
- نوشتن استثنا با :not
- انتخاب والد با :has
- ساخت focus قابل دسترس
- استفاده از nth-child و Attribute Selector
concepts:
- :is()
- :where()
- :not()
- :has()
- :focus-visible
- :focus-within
- :nth-child
- attribute selectors
prerequisites:
- 02-css/16-cascade
relatedLessons:
- 02-css/18-stacking
relatedProjects:
- css-advanced-dashboard
nextLesson: 02-css/18-stacking
---

## `:is()` و `:where()`

```css
:is(h1, h2, h3) a { color: inherit; }
:where(ul, ol) { padding-inline-start: 1.25rem; }
```

`:is()` Specificity را از قوی‌ترین آرگومان می‌گیرد؛ `:where()` Specificity صفر دارد و برای Reset و پایه بسیار مناسب است.

## `:not()` و `:has()`

```css
button:not(:disabled):hover { background: #1d4ed8; }
.card:has(img) { grid-template-columns: 120px 1fr; }
```

`:has()` می‌تواند بر اساس وجود فرزند، والد را انتخاب کند.

## Focus
برای تجربه کیبورد از `:focus-visible` و برای حالت والد از `:focus-within` استفاده کنید:

```css
a:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
.field:focus-within { border-color: #2563eb; }
```

## nth و Attribute

```css
li:nth-child(3n + 1) { /* ... */ }
a[href^="https://"]:not([href*="mysite.com"])::after { content: " ↗"; }
```

پشتیبانی ویژگی‌های جدید را پیش از استفاده در محصول واقعی بررسی کنید.

## `:is()` برای کوتاه‌نویسی، `:where()` برای کنترل specificity

```css
:is(h1, h2, h3) a { color: inherit; }
:where(ul, ol) { padding-inline-start: 1.25rem; }
```

اگر یک reset باید به‌آسانی override شود، `:where()` انتخاب مهمی است. اگر فقط می‌خواهید چند selector را با یک rule کوتاه کنید، `:is()` خواناتر است.

## `:not()` را برای حذف استثناءها به کار ببرید

```css
.button:not(:disabled):hover { }
```

به‌جای ساختن چند selector برای همه‌ی حالت‌ها، می‌توانید یک استثناء روشن تعریف کنید.

## `:has()` و طراحی بر اساس رابطه

```css
.card:has(img) { }
.field:has(input:invalid) { }
```

`:has()` امکان انتخاب ancestor بر اساس وجود descendant را فراهم می‌کند. این ابزار قدرتمند است، اما باید خوانایی selector و browser support پروژه‌ی واقعی بررسی شود.

## nth-child را با فرمول بخوانید

```css
li:nth-child(odd) { }
li:nth-child(3n + 1) { }
li:nth-last-child(-n + 2) { }
```

در `an+b`، `n` مقادیر 0، 1، 2 و ... می‌گیرد. بنابراین `3n+1` یعنی 1، 4، 7، 10 و ... . این مدل برای patternهای تکرارشونده مفید است.

## Attribute Selector در component واقعی

```css
a[href^="https://"]::after { content: " ↗"; }
a[href$=".pdf"]::after { content: " PDF"; }
```

محتوای pseudo-element باید صرفاً اطلاعات تزئینی/کمکی باشد؛ اگر «PDF» بخشی از معنی ضروری لینک است، بهتر است در HTML هم قابل دسترس باشد.

### چک‌لیست تسلط

- می‌توانم `:is`, `:where`, `:not` و `:has` را از نظر کاربرد مقایسه کنم.
- می‌توانم nth-child را با فرمول محاسبه کنم.
- browser support را برای selectorهای جدید بررسی می‌کنم.
