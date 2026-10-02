---
title: Position، Overflow و z-index
description: جایگذاری نسبی، مطلق، ثابت و sticky را همراه با overflow و لایه‌ها تمرین کنید.
difficulty: intermediate
estimatedMinutes: 30
objectives:
  - تفاوت static، relative، absolute، fixed و sticky
  - ساخت badge با parent نسبی و child مطلق
  - کنترل overflow
  - استفاده منظم از z-index
concepts:
  - position
  - inset
  - top
  - right
  - bottom
  - left
  - sticky
  - absolute
  - fixed
  - overflow
  - z-index
prerequisites:
  - 02-css/08-display
relatedLessons:
  - 02-css/10-flexbox
relatedProjects:
  - css-responsive-landing
nextLesson: 02-css/10-flexbox
---

## position چه می‌کند؟

مقادیر اصلی:

- `static`: رفتار پیش‌فرض؛ offsetهای top/right/bottom/left اثر معمولی ندارند.
- `relative`: عنصر در جریان می‌ماند و جای اصلی‌اش حفظ می‌شود.
- `absolute`: از جریان عادی خارج می‌شود و نسبت به نزدیک‌ترین ancestor مناسب جای‌گذاری می‌شود.
- `fixed`: نسبت به viewport ثابت می‌شود.
- `sticky`: تا رسیدن به آستانه مانند relative و سپس چسبان رفتار می‌کند.

## الگوی طلایی badge

```css
.card { position: relative; }
.card .badge {
  position: absolute;
  inset-block-start: 12px;
  inset-inline-end: 12px;
}
```

در RTL ویژگی‌های منطقی مانند `inset-inline-end` از left/right قابل نگهداری‌ترند.

## Sticky

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
}
```

`sticky` بدون offset مناسب مثل `top: 0` عملاً نتیجه مورد انتظار را نمی‌دهد و ancestorهای دارای overflow می‌توانند روی رفتار آن اثر بگذارند.

## Overflow

برای محتوای بیرون‌زده از `visible`، `hidden`، `scroll` و `auto` استفاده می‌شود. الگوی متن کوتاه‌شده:

```css
.title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

`z-index` فقط در context مناسب معنی دارد؛ عددهای بسیار بزرگ جای معماری درست لایه‌ها را نمی‌گیرند.

## Position را با «مرجع اندازه‌گیری» بفهمید

`position` فقط یک ابزار برای جابه‌جایی نیست؛ تعیین می‌کند عنصر نسبت به چه چیزی جای‌گذاری شود و چه اثری بر جریان عادی سند داشته باشد.

| مقدار | در جریان عادی؟ | کاربرد رایج |
|---|---|---|
| `static` | بله | حالت پیش‌فرض |
| `relative` | بله | ساخت containing block و جابه‌جایی محدود |
| `absolute` | خیر | badge، tooltip، overlay |
| `fixed` | خیر | کنترل‌های ثابت نسبت به viewport |
| `sticky` | در جریان می‌ماند تا sticky شود | header/sidebar |

## Absolute و containing block

```css
.card {
  position: relative;
}
.badge {
  position: absolute;
  inset-block-start: .75rem;
  inset-inline-end: .75rem;
}
```

`relative` در این مثال بیشتر از اینکه برای جابه‌جایی باشد، نقش **مرجع جای‌گذاری** برای فرزند absolute را دارد.

## Fixed در برابر Sticky

`fixed` عنصر را نسبت به viewport ثابت می‌کند؛ با اسکرول از جریان عادی جدا می‌ماند. `sticky` تا زمانی که به آستانه‌ی تعیین‌شده برسد مانند عنصر عادی رفتار می‌کند و سپس در محدوده‌ی scroll container می‌چسبد.

```css
.header {
  position: sticky;
  inset-block-start: 0;
  z-index: 100;
}
```

اگر sticky کار نمی‌کند، اول ancestorها را بررسی کنید؛ `overflow` و ارتفاع container می‌توانند رفتار scroll و sticky را تغییر دهند.

## Overflow را آگاهانه انتخاب کنید

- `visible`: محتوا می‌تواند بیرون بزند.
- `hidden`: بخش بیرون‌زده پنهان می‌شود.
- `auto`: در صورت نیاز scrollbar ایجاد می‌شود.
- `clip`: برش بدون ایجاد scrolling mechanism.

برای متن، `overflow: hidden` را کورکورانه نگذارید؛ ممکن است محتوا یا focus قابل مشاهده قطع شود.

## Debugging Scenario: چرا badge جای درست نیست؟

اگر این کد badge را نسبت به کل صفحه قرار می‌دهد:

```css
.badge {
  position: absolute;
  inset: 0;
}
```

احتمالاً والد موردنظر containing block نیست. `position: relative` را روی component مناسب بگذارید و سپس در DevTools مقدار `inset` و ancestorها را بررسی کنید.

### چک‌لیست تسلط

- می‌توانم containing block یک absolute را پیدا کنم.
- تفاوت sticky و fixed را با مثال توضیح می‌دهم.
- می‌دانم overflow چگونه روی clipping و scrolling اثر می‌گذارد.
- می‌توانم قبل از افزایش `z-index` علت واقعی مشکل را پیدا کنم.

