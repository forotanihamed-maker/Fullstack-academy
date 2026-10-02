---
title: Cascade، Specificity و Inheritance
description: تعارض قوانین CSS را با منشأ، Specificity، ترتیب و وراثت تحلیل کنید.
difficulty: intermediate
estimatedMinutes: 28
objectives:
- محاسبه Specificity
- توضیح ترتیب Cascade
- تشخیص propertyهای inherited
- استفاده آگاهانه از inherit، initial، revert و unset
concepts:
- cascade
- specificity
- inheritance
- '!important'
- '@layer'
- DevTools
prerequisites:
- 02-css/15-fluid-values
relatedLessons:
- 02-css/17-advanced-selectors
relatedProjects:
- css-advanced-dashboard
nextLesson: 02-css/17-advanced-selectors
---

## ترتیب ساده‌شده Cascade
وقتی چند قانون با هم تعارض دارند، به‌صورت آموزشی این ترتیب را دنبال کنید:

1. اهمیت و منشأ
2. Specificity
3. ترتیب نوشتن؛ اگر قبلی‌ها برابر باشند، قانون بعدی برنده می‌شود.

## Specificity
به شکل سه‌تایی `(ID, Class, Element)` فکر کنید:

```css
p { color: black; }          /* 0,0,1 */
.note { color: blue; }       /* 0,1,0 */
p.note { color: green; }     /* 0,1,1 */
#intro { color: red; }       /* 1,0,0 */
```

مقایسه از چپ به راست است؛ یک ID از هر تعداد Class در این مدل قوی‌تر است. همین موضوع دلیل خوبی برای پرهیز از ID در styling است.

## Inheritance
ویژگی‌هایی مثل `color`، خانواده فونت، `line-height` و `text-align` معمولاً از والد به فرزند منتقل می‌شوند؛ `margin`، `padding`، `border` و `background` معمولاً inherited نیستند.

```css
a { color: inherit; }
```

کلیدواژه‌های مفید: `inherit`، `initial`، `revert` و `unset`.

## `@layer`
در پروژه‌های بزرگ می‌توان Cascade را با Layerها سازمان داد:

```css
@layer reset, base, components, utilities;
```

Layer بعدی در Cascade می‌تواند بر قبلی غلبه کند؛ این ابزار برای هماهنگ کردن CSS خودتان با کتابخانه‌ها مفید است.

## Cascade را مثل یک الگوریتم دیباگ کنید

وقتی یک property «اعمال نمی‌شود»، به‌جای بالا بردن Specificity این ترتیب را بررسی کنید:

1. آیا selector اصلاً match شده؟
2. آیا declaration معتبر است؟
3. آیا rule به دلیل origin/importance کنار رفته؟
4. Specificity کدام rule بیشتر است؟
5. اگر برابرند، کدام rule دیرتر آمده؟
6. آیا مقدار از inheritance آمده است؟

## Specificity را دقیق‌تر بخوانید

```css
p {}             /* 0-0-1 */
.note {}         /* 0-1-0 */
main .note {}    /* 0-1-1 */
#app .note {}    /* 1-1-0 */
```

این اعداد را مثل یک عدد معمولی جمع نکنید؛ مقایسه از ستون ID شروع می‌شود، بعد class/attribute/pseudo-class و سپس element/pseudo-element.

## `:is()`، `:where()` و Specificity

```css
:is(.card, .panel) a { }
:where(.card, .panel) a { }
```

`:is()` بالاترین Specificity آرگومان‌هایش را وارد selector می‌کند؛ `:where()` Specificity صفر دارد. برای CSS پایه و reset، `:where()` می‌تواند جلوی جنگ specificity را بگیرد.

## Inheritance را property به property ببینید

همه‌ی CSS propertyها inherited نیستند. `color` و `font-family` معمولاً به ارث می‌رسند؛ `margin`, `padding`, `border` و `background` معمولاً نه.

کلیدواژه‌ها:

- `inherit`: مقدار والد را بگیر.
- `initial`: مقدار اولیه‌ی specification.
- `unset`: اگر inherited باشد inherit وگرنه initial.
- `revert`: به لایه/منشأ قبلی cascade برگرد.

## چرا `!important` درمان نیست؟

`!important` مشکل طراحی cascade را پنهان می‌کند و override بعدی را دشوارتر می‌سازد. اگر به آن نیاز پیدا کردید، اول ساختار component، layer و specificity را بازبینی کنید.

## `@layer`

```css
@layer reset, base, components, utilities;
```

Layerها کمک می‌کنند ترتیب کلی cascade را عمداً طراحی کنید و مجبور نباشید برای بردن یک rule، selector را پیچیده‌تر کنید.

## DevTools Investigation

در تب Styles، ruleهای اعمال‌شده و خط‌خورده را بخوانید. سپس در Computed روی property کلیک کنید تا منبع مقدار نهایی را پیدا کنید. این workflow را به عادت تبدیل کنید: **اول علت، بعد تغییر CSS**.

### چک‌لیست تسلط

- می‌توانم دلیل override شدن یک property را مرحله‌به‌مرحله پیدا کنم.
- Specificity را بدون حدس محاسبه می‌کنم.
- می‌دانم چه زمانی `:where()` مناسب است.
- برای حل conflict بلافاصله سراغ `!important` نمی‌روم.

