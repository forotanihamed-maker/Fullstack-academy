---
title: CSS
---

CSS ظاهر صفحه را مشخص می‌کند: رنگ، فونت، فاصله و چیدمان. هر قانون از یک **سلکتور** و چند **ویژگی** ساخته می‌شود.

```css
.card {
  background: white;
  padding: 16px;
  border-radius: 12px;
}

h1 { color: #0f766e; }
```

## Box Model

هر المان یک جعبه است با چهار لایه، از داخل به بیرون: `content` ← `padding` ← `border` ← `margin`.

با `box-sizing: border-box` عرض و ارتفاع شامل padding و border هم می‌شود، که محاسبه‌ی اندازه‌ها را ساده‌تر می‌کند.

## Flexbox

Flexbox برای چیدن المان‌ها در یک ردیف یا ستون است:

```css
.row {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
}
```

`justify-content` چینش را در راستای اصلی و `align-items` در راستای عمود تنظیم می‌کند.

مطالعه بیشتر: [MDN – یادگیری CSS](https://developer.mozilla.org/fa/docs/Learn/CSS)
