---
title: Box Model؛ محتوای عنصر، Padding، Border و Margin
---

## Box Model چیست؟

مرورگر هر عنصر HTML را مانند یک جعبه در نظر می‌گیرد. این جعبه چهار بخش اصلی دارد:

1. **Content** — محتوای واقعی
2. **Padding** — فاصله‌ی داخلی بین محتوا و border
3. **Border** — کادر اطراف عنصر
4. **Margin** — فاصله‌ی بیرونی با عناصر اطراف

```text
Margin
┌──────────────────────────────┐
│ Border                       │
│  ┌────────────────────────┐  │
│  │ Padding                │  │
│  │  ┌──────────────────┐  │  │
│  │  │ Content          │  │  │
│  │  └──────────────────┘  │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

## Content

```css
.card {
  width: 300px;
  height: 150px;
}
```

در حالت پیش‌فرض، `width` و `height` به content box مربوط‌اند؛ بنابراین padding و border به اندازه اضافه می‌شوند.

## Padding

```css
.card {
  padding: 20px;
}
```

یا هر طرف جدا:

```css
.card {
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 30px;
  padding-left: 40px;
}
```

و shorthand:

```css
.card {
  padding: 10px 20px 30px 40px;
}
```

## Border

```css
.card {
  border: 1px solid #ddd;
}
```

## Margin

```css
.card {
  margin: 24px;
}
```

برای مرکز کردن یک block با عرض مشخص:

```css
.card {
  width: 400px;
  margin-inline: auto;
}
```

## تفاوت padding و margin

```css
.card {
  padding: 20px;
  margin: 20px;
}
```

- `padding`: فضای داخل جعبه.
- `margin`: فاصله‌ی بیرون جعبه.

## box-sizing

در حالت پیش‌فرض:

```css
box-sizing: content-box;
```

اگر بنویسیم:

```css
.box {
  width: 300px;
  padding: 20px;
  border: 2px solid;
}
```

عرض نهایی افقی:

```text
300 + 20 + 20 + 2 + 2 = 344px
```

اما با:

```css
.box {
  box-sizing: border-box;
  width: 300px;
  padding: 20px;
  border: 2px solid;
}
```

عدد `300px` شامل content + padding + border می‌شود.

یک reset رایج:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

## width و max-width

برای محتوای responsive:

```css
.container {
  width: 100%;
  max-width: 900px;
  margin-inline: auto;
  padding-inline: 1rem;
}
```

## Margin Collapse

در بعضی شرایط، margin عمودی blockها ممکن است collapse شوند و مانند جمع ساده‌ی دو عدد رفتار نکنند. این رفتار را در layoutهای پیچیده باید جداگانه درک کرد.

## اندازه‌گیری با DevTools

1. روی عنصر راست‌کلیک کنید و Inspect را بزنید.
2. عنصر را در Elements انتخاب کنید.
3. بخش Box Model را ببینید.
4. content، padding، border و margin را مقایسه کنید.

## اشتباهات رایج

- تصور اینکه `width` همیشه شامل padding و border است.
- اشتباه گرفتن padding با margin.
- استفاده از margin برای فضای داخل کارت.
- فراموش کردن `box-sizing: border-box`.
- تعیین عرض ثابت بزرگ برای همه‌ی نمایشگرها.
- حل همه‌ی فاصله‌ها با margin بدون بررسی layout.

## تمرین متنی

یک کارت با `width: 320px` بسازید. ابتدا `box-sizing: content-box` و سپس `border-box` را آزمایش کنید. به کارت padding و border بدهید و عرض واقعی را در DevTools مقایسه کنید. در پایان نسخه‌ای responsive با `width: 100%` و `max-width` بسازید.

## مطالعه‌ی بیشتر

- [MDN – Introduction to the CSS box model](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model/Introduction_to_the_CSS_box_model)
- [MDN – box-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing)
- [W3Schools – CSS Box Model](https://www.w3schools.com/css/css_boxmodel.asp)
- [DevDocs – CSS](https://devdocs.io/css/)
