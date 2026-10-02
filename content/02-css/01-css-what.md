---
title: CSS چیست و چگونه به HTML اضافه می‌شود؟
description: با نقش CSS، ساختار یک قانون و سه روش اتصال CSS به HTML آشنا شوید.
difficulty: beginner
estimatedMinutes: 15
objectives:
  - توضیح نقش CSS در ظاهر و چیدمان صفحه
  - تشخیص selector، property، value و declaration
  - تفاوت Inline، Internal و External CSS
  - تشخیص چند خطای رایج هنگام اتصال CSS
concepts:
  - CSS
  - selector
  - property
  - value
  - declaration
  - external stylesheet
prerequisites:
  - 01-html/01-intro
relatedLessons:
  - 02-css/02-selectors
relatedProjects:
  - css-personal-profile
nextLesson: 02-selectors
---

## CSS چه کاری انجام می‌دهد؟

HTML ساختار و محتوای صفحه را مشخص می‌کند؛ CSS ظاهر و چیدمان همان ساختار را کنترل می‌کند. رنگ، اندازه، فاصله، پس‌زمینه و بسیاری از جزئیات بصری با CSS تعیین می‌شوند.

مثلاً:

```html
<h1>یادگیری وب</h1>
<p>من در حال یادگیری CSS هستم.</p>
```

می‌توانیم ظاهر آن را این‌طور تغییر دهیم:

```css
h1 {
  color: #1d4ed8;
  font-size: 2rem;
}

p {
  font-size: 1.1rem;
}
```

## ساختار یک Rule

```css
selector {
  property: value;
}
```

در این ساختار، `selector` مشخص می‌کند کدام عناصر انتخاب شوند، `property` نام ویژگی CSS است و `value` مقدار آن ویژگی است. یک یا چند declaration داخل `{}` قرار می‌گیرند.

```css
button {
  background-color: #111827;
  color: white;
  padding: 0.75rem 1rem;
}
```

## سه روش اتصال CSS

### ۱. Inline

```html
<p style="color: tomato;">یک متن</p>
```

برای آزمایش‌های بسیار کوچک ممکن است مفید باشد، اما برای پروژه واقعی نگهداری آن سخت‌تر می‌شود.

### ۲. Internal

```html
<head>
  <style>
    p { color: tomato; }
  </style>
</head>
```

برای نمونه‌های کوچک و تک‌صفحه‌ای مناسب است.

### ۳. External

```html
<link rel="stylesheet" href="styles.css">
```

و در `styles.css`:

```css
body {
  background: #f8fafc;
}
```

برای پروژه‌های چندصفحه‌ای، تفکیک HTML و CSS نگهداری را ساده‌تر می‌کند. در این دوره نیز روش اصلی پروژه‌ها External CSS است.

## کامنت

کامنت CSS با `/*` و `*/` نوشته می‌شود:

```css
/* رنگ اصلی عنوان */
h1 {
  color: #1d4ed8;
}
```

## خطاهای رایج

- مسیر فایل CSS در `href` اشتباه است.
- یک `property` غلط نوشته شده و همان declaration نادیده گرفته می‌شود.
- براکت `}` فراموش شده است.
- CSS بدون `<style>` یا `<link>` داخل HTML قرار گرفته است.

در DevTools می‌توان قوانین اعمال‌شده و قوانین خط‌خورده را بررسی کرد.

## نکات کلیدی

- HTML ساختار را می‌سازد؛ CSS ظاهر و چیدمان را کنترل می‌کند.
- Rule از selector و declarationها تشکیل می‌شود.
- External CSS انتخاب اصلی پروژه‌های این مسیر است.
- DevTools ابزار اصلی بررسی CSS است.
