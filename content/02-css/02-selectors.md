---
title: Selectorها؛ انتخاب دقیق عناصر در CSS
---

## Selector چیست؟

Selector یا **انتخاب‌گر** مشخص می‌کند CSS روی کدام عنصر یا عناصر اعمال شود. انتخاب‌گرها از ساده‌ترین بخش‌های CSS شروع می‌شوند، اما در پروژه‌های واقعی می‌توانند بسیار دقیق باشند.

مثلاً:

```css
p {
  color: #333;
}
```

یعنی تمام عناصر `p` انتخاب شوند.

## انتخاب‌گر عنصر (Type Selector)

نام تگ را می‌نویسیم:

```css
h1 {
  color: navy;
}

p {
  line-height: 1.8;
}
```

این روش برای استایل پایه‌ی یک نوع عنصر مناسب است.

## انتخاب‌گر کلاس (Class Selector)

کلاس با `.` شروع می‌شود:

```html
<p class="note">این یک نکته است.</p>
<p>این متن معمولی است.</p>
```

```css
.note {
  background: #fff8cc;
}
```

یک کلاس می‌تواند روی چند عنصر استفاده شود:

```html
<p class="note">نکته‌ی اول</p>
<div class="note">نکته‌ی دوم</div>
```

> 💡 نام کلاس را بر اساس نقش یا معنای عنصر انتخاب کنید؛ مثلاً `card-title` معمولاً از نام‌هایی مثل `red-text` قابل‌نگهداری‌تر است.

## انتخاب‌گر ID

ID با `#` شروع می‌شود:

```html
<h1 id="page-title">صفحه‌ی اصلی</h1>
```

```css
#page-title {
  color: darkgreen;
}
```

در HTML یک `id` باید در همان سند یکتا باشد. برای استایل‌های قابل‌استفاده‌ی مجدد، کلاس معمولاً انتخاب مناسب‌تری است.

## انتخاب چند selector با کاما

اگر چند عنصر ظاهر مشترکی دارند، می‌توان آن‌ها را با کاما کنار هم نوشت:

```css
h1,
h2,
h3 {
  font-family: sans-serif;
}
```

## Selector ترکیبی ساده

```css
button.primary {
  background: royalblue;
  color: white;
}
```

این قانون فقط `button`هایی را هدف می‌گیرد که کلاس `primary` دارند.

## Descendant Selector

با فاصله، عنصرهای داخل یک عنصر را انتخاب می‌کنیم:

```html
<article class="card">
  <h2>عنوان</h2>
  <p>متن کارت</p>
</article>
```

```css
.card p {
  color: #555;
}
```

هر `p` که درون `.card` باشد انتخاب می‌شود، حتی اگر چند لایه پایین‌تر قرار گرفته باشد.

## Child Selector

با `>` فقط فرزند مستقیم انتخاب می‌شود:

```css
.card > p {
  margin-top: 1rem;
}
```

در این حالت `p` باید مستقیماً فرزند `.card` باشد.

## Next Sibling و Subsequent Sibling

با `+` فقط خواهر/برادر بلافاصله بعدی را انتخاب می‌کنیم:

```css
h2 + p {
  margin-top: 0;
}
```

با `~` تمام خواهر/برادرهای بعدی با selector مشخص انتخاب می‌شوند:

```css
h2 ~ p {
  color: #555;
}
```

## Attribute Selector

می‌توان عناصر را بر اساس attribute انتخاب کرد:

```css
input[type="email"] {
  border-color: royalblue;
}
```

مثال‌های دیگر:

```css
a[target] {
  font-weight: bold;
}

input[name^="user"] {
  background: #f5f5f5;
}
```

در مثال دوم، `^=` یعنی مقدار attribute با متن مشخص‌شده شروع شود.

## Pseudo-class

Pseudo-class وضعیت یا شرایط خاص یک عنصر را هدف می‌گیرد:

```css
button:hover {
  transform: translateY(-1px);
}

input:focus {
  outline: 2px solid royalblue;
}
```

برای فرم‌ها، focus قابل‌مشاهده را حذف نکنید مگر اینکه جایگزین دسترس‌پذیر داشته باشید:

```css
input:focus-visible {
  outline: 3px solid royalblue;
  outline-offset: 2px;
}
```

## Pseudo-element

Pseudo-element بخشی فرضی از یک عنصر را هدف می‌گیرد:

```css
.note::before {
  content: "نکته: ";
  font-weight: bold;
}
```

> ⚠️ متن مهم و معنایی را فقط با `::before` یا `::after` نسازید؛ محتوای اصلی بهتر است در HTML وجود داشته باشد.

## جدول سریع انتخاب‌گرها

| Selector | نمونه | کاربرد |
|---|---|---|
| عنصر | `p` | همه‌ی `p`ها |
| کلاس | `.card` | عناصر دارای کلاس |
| ID | `#header` | عنصر دارای ID مشخص |
| چندتایی | `h1, h2` | چند انتخاب‌گر با قوانین مشترک |
| فرزند مستقیم | `.card > p` | `p` فرزند مستقیم |
| داخل عنصر | `.card p` | هر `p` داخل کارت |
| attribute | `input[type="email"]` | بر اساس attribute |
| pseudo-class | `button:hover` | وضعیت عنصر |
| pseudo-element | `.note::before` | بخش مجازی عنصر |

## اشتباهات رایج مبتدی‌ها

- فراموش کردن `.` قبل از نام کلاس.
- استفاده‌ی بی‌دلیل از ID برای تمام استایل‌ها.
- اشتباه گرفتن `.card p` با `.card > p`.
- استفاده از selector بسیار پیچیده برای یک نیاز ساده.
- حذف `outline` حالت focus و جایگزین نکردن آن.
- قرار دادن محتوای ضروری در pseudo-element.

## تمرین متنی

یک کارت HTML بسازید که شامل عنوان، پاراگراف و یک دکمه باشد. سپس با selectorهای مختلف فقط عنوان کارت، پاراگراف فرزند مستقیم و دکمه‌ی دارای کلاس `primary` را جداگانه استایل دهید.

## مطالعه‌ی بیشتر

- [MDN – CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors)
- [MDN – Attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)
- [W3Schools – CSS Selectors](https://www.w3schools.com/css/css_selectors.asp)
- [DevDocs – CSS](https://devdocs.io/css/)
