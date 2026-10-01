---
title: رنگ‌ها و واحدهای اندازه‌گیری در CSS
---

## چرا رنگ و واحد مهم است؟

CSS فقط «چه چیزی را رنگی کنیم» نیست. باید بتوانیم اندازه‌ها را طوری تعیین کنیم که در نمایشگرها و شرایط مختلف منطقی باقی بمانند.

## رنگ با نام

```css
p {
  color: navy;
}
```

## Hexadecimal

```css
.card {
  background-color: #ffffff;
  color: #222222;
}
```

نسخه‌ی کوتاه بعضی رنگ‌ها:

```css
color: #fff;
```

## RGB و RGBA

```css
color: rgb(30 64 175);
background-color: rgb(30 64 175 / 50%);
```

در کدهای قدیمی‌تر ممکن است `rgba()` ببینید:

```css
background-color: rgba(30, 64, 175, 0.5);
```

## HSL

```css
color: hsl(220 70% 40%);
```

## واحدهای مهم

| واحد | معنی کلی | نمونه |
|---|---|---|
| `px` | پیکسل CSS | `16px` |
| `%` | درصدی از مرجع مربوط | `50%` |
| `em` | نسبت به اندازه‌ی فونت context مربوط | `1.5em` |
| `rem` | نسبت به اندازه‌ی فونت ریشه | `1.5rem` |
| `vw` | درصدی از عرض viewport | `50vw` |
| `vh` | درصدی از ارتفاع viewport | `50vh` |
| `dvh` | ارتفاع dynamic viewport | `100dvh` |
| `ch` | تقریباً عرض کاراکتر `0` در فونت جاری | `60ch` |

> 💡 برای فاصله‌ها و اندازه‌ی متن، `rem` اغلب انتخاب خوبی است. برای عرض‌های وابسته به والد، `%` و برای viewport واحدهای `vw`/`vh`/`dvh` کاربرد دارند.

## rem و em

اگر اندازه‌ی فونت ریشه `16px` باشد:

```css
html {
  font-size: 16px;
}

.title {
  font-size: 2rem;
}
```

در این حالت `2rem` برابر `32px` است.

`em` به context فونت وابسته است:

```css
.parent {
  font-size: 20px;
}

.child {
  font-size: 1.5em;
}
```

## درصد

```css
.container {
  width: 80%;
}
```

درصد همیشه به معنی «درصدی از viewport» نیست؛ مرجع محاسبه به property بستگی دارد.

## واحدهای viewport

```css
.hero {
  min-height: 100vh;
}
```

در محیط‌های موبایلی، واحدهای پویا مانند `dvh` می‌توانند رفتار مناسب‌تری داشته باشند:

```css
.hero {
  min-height: 100dvh;
}
```

## clamp()

```css
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}
```

مقدار بین حداقل و حداکثر محدود می‌ماند و مقدار میانی از `5vw` تأثیر می‌گیرد.

## تفاوت alpha و opacity

```css
.overlay {
  background: rgb(0 0 0 / 60%);
}
```

اما:

```css
.card {
  opacity: 0.6;
}
```

`opacity` کل عنصر و محتوای آن را تحت تأثیر قرار می‌دهد؛ alpha در رنگ فقط همان رنگ را شفاف می‌کند.

## اشتباهات رایج

- استفاده از `px` برای همه‌چیز.
- تصور اینکه `%` همیشه نسبت به viewport است.
- اشتباه گرفتن `rem` و `em`.
- استفاده از `opacity` وقتی فقط پس‌زمینه باید شفاف باشد.
- استفاده‌ی افراطی از `vh` در موبایل.
- نادیده گرفتن کنتراست رنگ متن و پس‌زمینه.

## تمرین متنی

یک کارت بسازید که عرض آن `80%` باشد، اندازه‌ی عنوان با `clamp()` تغییر کند، فاصله‌ی داخلی با `rem` تعریف شود و پس‌زمینه با `rgb()` و alpha کمی شفاف باشد.

## مطالعه‌ی بیشتر

- [MDN – CSS values and units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)
- [MDN – CSS color](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors)
- [MDN – clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
- [W3Schools – CSS Units](https://www.w3schools.com/css/css_units.asp)
