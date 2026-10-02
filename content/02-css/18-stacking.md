---
title: Stacking Context و z-index
description: دلیل بی‌اثر شدن z-index را با Stacking Context و isolation بفهمید.
difficulty: advanced
estimatedMinutes: 24
objectives:
- تشخیص Stacking Context
- شناخت اثر opacity و transform
- مدیریت لایه‌های UI با Token
- استفاده از isolation برای مرزبندی
concepts:
- stacking context
- z-index
- opacity
- transform
- isolation
- layer tokens
prerequisites:
- 02-css/17-advanced-selectors
relatedLessons:
- 02-css/19-layout-advanced
relatedProjects:
- css-advanced-dashboard
nextLesson: 02-css/19-layout-advanced
---

## چرا `z-index: 9999` همیشه برنده نیست؟
هر Stacking Context مثل یک جزیره مستقل است. فرزندان آن فقط در همان Context با هم مقایسه می‌شوند.

مواردی مانند `opacity < 1`، `transform`، `filter`، `perspective`، `position: fixed` و بعضی حالت‌های `z-index` می‌توانند Context جدید بسازند.

```css
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 1000;
  --z-toast: 1100;
}
```

به‌جای عددهای تصادفی، یک scale برای لایه‌ها بسازید.

## `isolation`
برای اینکه Context داخلی یک کامپوننت روی بیرون اثر نگذارد:

```css
.card {
  isolation: isolate;
}
```

وقتی tooltip زیر کارت دیگری می‌رود، اول والدها و Contextهای آن را بررسی کنید، نه اینکه فقط `z-index` را بیشتر کنید.

## Stacking Context را با «جزیره» تصور کنید

هر stacking context یک فضای مستقل برای مقایسه‌ی لایه‌هاست. `z-index: 9999` در یک context الزاماً از `z-index: 2` در context دیگری بالاتر نیست.

موقعیت‌های مهمی که می‌توانند stacking context بسازند شامل مواردی مثل `opacity < 1`، `transform`، `filter`، `perspective`، `position: fixed/sticky` و برخی حالت‌های z-index در flex/grid هستند.

## مثال کلاسیک 9999

```css
.card { position: relative; z-index: 1; }
.card__tooltip { position: absolute; z-index: 9999; }
.card--next { position: relative; z-index: 2; }
```

tooltip فقط در context خودش مقایسه می‌شود. اگر context والد کارت پایین‌تر باشد، بالا بردن tooltip به 9999 مشکل را حل نمی‌کند.

## `isolation: isolate`

```css
.card {
  isolation: isolate;
}
```

این property برای مرزبندی stacking در componentها مفید است؛ مخصوصاً وقتی effectها و pseudo-elementها نباید با لایه‌های بیرونی قاطی شوند.

## Tokenهای لایه

```css
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 1000;
  --z-toast: 1100;
}
```

به‌جای اعداد تصادفی `999`, `9999`, `99999` یک scale محدود تعریف کنید. مهم‌تر از عدد، **ساختار contextها** است.

## Workflow دیباگ

وقتی tooltip یا modal پشت چیزی می‌رود:

1. عنصر مشکل‌دار را انتخاب کنید.
2. ancestorها را یکی‌یکی بررسی کنید.
3. `position`, `z-index`, `opacity`, `transform`, `filter` و `isolation` را بررسی کنید.
4. مشخص کنید context مشکل‌ساز کجاست.
5. فقط بعد از آن z-index را تغییر دهید.

### چک‌لیست تسلط

- می‌توانم دلیل بی‌اثر بودن z-index را توضیح دهم.
- stacking context را از DOM معمولی جدا می‌کنم.
- برای componentها z-index token تعریف می‌کنم.

