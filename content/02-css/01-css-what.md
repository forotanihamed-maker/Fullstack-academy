---
title: CSS چیست و چگونه به HTML اضافه می‌شود؟
---

## CSS چیست؟

CSS مخفف **Cascading Style Sheets** است و برای تعیین ظاهر و چیدمان صفحه‌های وب استفاده می‌شود. اگر HTML را اسکلت و محتوای ساختمان بدانیم، CSS مسئول ظاهر آن ساختمان است: رنگ دیوارها، فاصله‌ها، اندازه‌ها و چیدمان عناصر.

مثلاً HTML زیر فقط یک عنوان و یک پاراگراف می‌سازد:

```html
<h1>یادگیری وب</h1>
<p>من در حال یادگیری CSS هستم.</p>
```

با CSS می‌توانیم رنگ عنوان و اندازه‌ی متن را تغییر دهیم:

```css
h1 {
  color: royalblue;
  font-size: 2rem;
}

p {
  font-size: 1.1rem;
}
```

هر قانون CSS معمولاً از یک **selector** و یک یا چند **declaration** تشکیل می‌شود:

```css
h1 {
  color: royalblue;
}
```

در این مثال `h1` انتخاب‌گر (Selector) است و `color: royalblue` یک declaration است.

## سه روش اضافه کردن CSS به HTML

### ۱. CSS درون‌خطی (Inline)

با ویژگی `style` مستقیماً روی عنصر نوشته می‌شود:

```html
<p style="color: tomato;">یک متن قرمز</p>
```

این روش برای مثال‌های بسیار کوچک مفید است، اما در پروژه‌های واقعی معمولاً نگهداری آن سخت می‌شود.

### ۲. CSS داخلی (Internal)

داخل تگ `style` در همان صفحه قرار می‌گیرد:

```html
<!doctype html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>صفحه‌ی من</title>
  <style>
    body {
      font-family: sans-serif;
    }

    h1 {
      color: royalblue;
    }
  </style>
</head>
<body>
  <h1>سلام CSS</h1>
</body>
</html>
```

برای یک صفحه‌ی کوچک یا نمونه‌ی آموزشی مناسب است.

### ۳. CSS خارجی (External)

CSS در یک فایل جدا قرار می‌گیرد و با `link` به HTML وصل می‌شود:

```html
<head>
  <link rel="stylesheet" href="styles.css">
</head>
```

فایل `styles.css`:

```css
body {
  font-family: sans-serif;
  background: #f5f5f5;
}

h1 {
  color: royalblue;
}
```

در پروژه‌های واقعی، CSS خارجی یا سیستم‌های ماژولار CSS معمولاً انتخاب مناسب‌تری است؛ چون ظاهر چند صفحه را می‌توان منظم‌تر مدیریت کرد.

> 💡 مسیر `href` باید واقعاً به فایل CSS برسد. اگر CSS اعمال نشد، اولین چیزهایی که بررسی می‌کنید مسیر فایل و خطاهای DevTools هستند.

## کامنت در CSS

کامنت با `/*` شروع و با `*/` تمام می‌شود:

```css
/* رنگ اصلی صفحه */
h1 {
  color: royalblue;
}
```

کامنت توسط مرورگر برای اعمال استایل اجرا نمی‌شود.

## ساختار یک قانون CSS

```css
selector {
  property: value;
}
```

مثلاً:

```css
button {
  background-color: black;
  color: white;
  padding: 0.75rem 1rem;
}
```

- `button`: عنصرهایی که قرار است انتخاب شوند.
- `background-color`: ویژگی (Property).
- `black`: مقدار (Value).
- هر declaration معمولاً با `;` تمام می‌شود.

> ⚠️ نوشتن `color: red` به‌تنهایی کافی نیست؛ باید مشخص باشد این declaration برای کدام عنصر اعمال می‌شود.

## اشتباهات رایج مبتدی‌ها

| اشتباه | نتیجه | راه بررسی |
|---|---|---|
| مسیر اشتباه فایل CSS | هیچ استایلی اعمال نمی‌شود | `href` و Network/Console را بررسی کنید |
| فراموش کردن `}` | بخشی از CSS درست parse نمی‌شود | براکت‌ها را جفت کنید |
| نوشتن نام property اشتباه | آن declaration نادیده گرفته می‌شود | DevTools را بررسی کنید |
| قرار دادن CSS در فایل HTML بدون `<style>` | متن CSS به‌عنوان HTML دیده می‌شود | روش اتصال CSS را بررسی کنید |
| انتظار اعمال یک قانون روی عنصر اشتباه | ظاهر تغییر نمی‌کند | selector را بررسی کنید |

## تمرین متنی

یک صفحه‌ی HTML بسازید که یک `h1` و یک `p` داشته باشد. سپس همان ظاهر را سه بار امتحان کنید: یک بار با Inline CSS، یک بار با Internal CSS و یک بار با External CSS. در پایان توضیح دهید کدام روش برای یک پروژه‌ی چندصفحه‌ای نگهداری ساده‌تری دارد و چرا.

## مطالعه‌ی بیشتر

- [MDN – CSS basics](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps)
- [W3Schools – CSS Introduction](https://www.w3schools.com/css/css_intro.asp)
- [DevDocs – CSS](https://devdocs.io/css/)
