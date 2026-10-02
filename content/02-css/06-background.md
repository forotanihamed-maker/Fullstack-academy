---
title: "Background: رنگ، تصویر و گرادیان"
description: پس‌زمینه را با background-color، تصویر، gradient و ویژگی‌های اندازه/موقعیت کنترل کنید.
difficulty: intermediate
estimatedMinutes: 36
objectives:
  - شناخت background-color و shorthand
  - استفاده از تصویر پس‌زمینه با position و size
  - ساخت linear-gradient
  - جلوگیری از تکرار و بیرون‌زدگی پس‌زمینه
concepts:
  - background-color
  - background-image
  - background-repeat
  - background-position
  - background-size
  - linear-gradient
prerequisites:
  - 02-css/05-box-model
relatedLessons:
  - 02-css/07-font-text
relatedProjects:
  - css-responsive-landing
nextLesson: 02-css/07-font-text
---

## پس‌زمینه فقط یک رنگ نیست

CSS می‌تواند برای یک عنصر رنگ، تصویر یا گرادیان تعیین کند. برای پروژه‌های واقعی معمولاً پس‌زمینه باید با محتوای foreground خوانا بماند.

```css
.hero {
  background-color: #0f172a;
  background-image: linear-gradient(135deg, #1d4ed8, #7c3aed);
  color: white;
}
```

## تصویر پس‌زمینه

```css
.hero {
  background-image: url("hero.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
```

`cover` قاب را کامل پر می‌کند و ممکن است بخشی از تصویر را برش دهد؛ `contain` کل تصویر را نگه می‌دارد و ممکن است فضای خالی ایجاد کند.

## گرادیان

```css
.banner {
  background: linear-gradient(135deg, #2563eb, #9333ea);
}
```

گرادیان جای تصویر نیست؛ برای ساخت سطح‌های بصری، overlay و Heroهای سبک بسیار مفید است.

## اشتباهات رایج

- استفاده از تصویر بزرگ و غیرضروری به‌عنوان background
- فراموش کردن کنتراست متن روی تصویر
- استفاده از `background-size: cover` بدون بررسی نقطه مهم تصویر
- استفاده از background برای محتوایی که باید در HTML و برای دسترس‌پذیری قابل مشاهده باشد

## لایه‌های چندگانه‌ی Background

یک property می‌تواند چند لایه background داشته باشد. اولین لایه در لیست بالاتر قرار می‌گیرد:

```css
.hero {
  background:
    linear-gradient(rgb(15 23 42 / .55), rgb(15 23 42 / .55)),
    url("hero.webp") center / cover no-repeat;
}
```

این الگو برای ساخت overlay روی تصویر بسیار رایج است. به‌جای کاهش `opacity` کل Hero، فقط overlay را کنترل می‌کنید و متن خوانا باقی می‌ماند.

## background و img یکی نیستند

از background برای **تزئین یا بخشی از composition** استفاده کنید؛ اگر تصویر بخشی از محتوای واقعی صفحه است، معمولاً `<img>` انتخاب مناسب‌تری است چون `alt`، اندازه‌های واکنش‌گرا و semantics محتوایی دارد.

```html
<img src="product.webp" alt="نمای محصول آبی" />
```

## position و size را با هم بفهمید

```css
.hero {
  background-position: center top;
  background-size: cover;
}
```

`cover` یعنی کل box پر شود؛ در نتیجه بخشی از تصویر ممکن است خارج شود. `contain` کل تصویر را حفظ می‌کند، اما ممکن است فضای خالی باقی بماند. برای عکس محصول معمولاً نقطه‌ی مهم تصویر و نسبت قاب را بررسی کنید، نه اینکه همیشه `cover` بنویسید.

## گرادیان به‌عنوان لایه‌ی خوانایی

```css
.hero {
  background-image:
    linear-gradient(to bottom, rgb(0 0 0 / 0), rgb(0 0 0 / .72)),
    url("hero.webp");
}
```

این الگو مخصوصاً وقتی عنوان روی پایین تصویر قرار می‌گیرد مفید است. کنتراست را با تصویر واقعی بررسی کنید، چون یک overlay ثابت روی همه‌ی عکس‌ها نتیجه‌ی یکسانی نمی‌دهد.

## چند background و اندازه‌های جداگانه

وقتی چند لایه دارید، ترتیب `background-position` و `background-size` باید با همان ترتیب لایه‌ها هماهنگ باشد. اینجا shorthand می‌تواند خوانایی را کم کند؛ در حالت آموزشی ابتدا propertyها را جداگانه بنویسید و بعد shorthand را تمرین کنید.

## Performance

تصویر پس‌زمینه بزرگ می‌تواند اولین نمایش صفحه را سنگین کند. ابعاد، فرمت، فشرده‌سازی و اینکه آیا تصویر واقعاً لازم است را بررسی کنید. برای Heroهای بزرگ، نسخه‌ی مناسب تصویر و fallback مناسب مهم‌تر از افکت‌های زیاد است.

### تمرین دیباگ

یک Hero دارید که متن روی عکس خوانا نیست و تصویر نیز در موبایل بیش از حد crop می‌شود. سه تغییر انجام دهید: overlay اضافه کنید، `background-position` را متناسب با نقطه‌ی مهم تصویر تنظیم کنید و برای موبایل یک رفتار متفاوت در نظر بگیرید.

## معیار تسلط

باید بتوانید توضیح دهید چه زمانی `background-image` از `<img>` مناسب‌تر است، `cover` و `contain` چه trade-offای دارند و چگونه یک overlay خوانا و کم‌هزینه بسازید.
