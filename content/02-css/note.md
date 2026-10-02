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

## روش مطالعه‌ی عمیق CSS

برای مباحث ضروری، فقط حفظ syntax کافی نیست. هر مبحث را با این چرخه تمام کنید:

`Concept → Mental Model → Syntax → 3 Examples → DevTools → Exercise → Debugging → Quiz → Project`

### معیار عبور از CSS

دانشجو باید بتواند بدون نگاه کردن به جواب:

- layout را از روی نیاز انتخاب کند؛
- overflow را ریشه‌یابی کند، نه اینکه با `overflow:hidden` پنهانش کند؛
- conflictهای Cascade را با DevTools تحلیل کند؛
- component را با token، state و accessibility کامل کند؛
- همان component را در RTL/LTR و viewportهای کوچک/بزرگ تست کند.

