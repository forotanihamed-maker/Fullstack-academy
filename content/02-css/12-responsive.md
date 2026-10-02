---
title: Responsive و Media Query
description: صفحه را mobile-first طراحی کنید و با Media Query، Grid و واحدهای انعطاف‌پذیر برای عرض‌های مختلف آماده کنید.
difficulty: intermediate
estimatedMinutes: 30
objectives:
  - ساخت پایه mobile-first
  - استفاده از min-width media query
  - جلوگیری از overflow افقی
  - شناخت prefers-color-scheme و reduced-motion
concepts:
  - responsive
  - "@media"
  - min-width
  - mobile-first
  - max-width
  - auto-fit
  - prefers-color-scheme
  - prefers-reduced-motion
  - orientation
prerequisites:
  - 02-css/11-grid
relatedLessons:
  - 02-css/13-animation
relatedProjects:
  - css-responsive-landing
nextLesson: 02-css/13-animation
---

## Responsive یعنی سازگار با فضا

سه جزء مهم در جزوه:

1. viewport مناسب در HTML
2. layout انعطاف‌پذیر با Flexbox/Grid و واحدهایی مثل `%` و `fr`
3. Media Query برای تغییر قواعد در شرایط مشخص

برای رسانه‌ها:

```css
img,
video {
  max-width: 100%;
  height: auto;
  display: block;
}
```

## Mobile-first

ابتدا حالت ساده موبایل را بنویسید و برای فضای بزرگ‌تر با `min-width` توسعه دهید:

```css
.menu { display: none; }

@media (min-width: 768px) {
  .menu { display: flex; }
}
```

Breakpoint عدد مقدس نیست؛ جایی بشکنید که layout واقعاً به فضای بیشتری نیاز دارد.

## Queryهای مفید

```css
@media (prefers-color-scheme: dark) { /* theme */ }
@media (prefers-reduced-motion: reduce) { /* motion */ }
@media (orientation: landscape) { /* ... */ }
@media print { /* ... */ }
```

## خطاهای رایج

- container با عرض ثابت که در موبایل اسکرول افقی ایجاد می‌کند
- ترکیب بی‌برنامه min-width و max-width
- تست نکردن در 320px، 768px و عرض‌های واقعی
- فراموش کردن reduced-motion برای انیمیشن‌ها

## Responsive فقط breakpoint نیست

Responsive design یعنی layout، اندازه‌ی متن، فاصله، تصویر و interaction در فضای مختلف **قابل استفاده** بماند. breakpoint تنها یکی از ابزارهاست.

## Mobile-first

ابتدا CSS پایه را برای فضای کوچک بنویسید و سپس با `min-width` امکانات بیشتری اضافه کنید:

```css
.cards {
  display: grid;
  grid-template-columns: 1fr;
}
@media (min-width: 48rem) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 72rem) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

به‌جای «breakpoint برای هر دستگاه»، breakpoint را جایی بگذارید که **محتوا** دیگر کیفیت خود را حفظ نمی‌کند.

## جلوگیری از Horizontal Overflow

این موارد را بررسی کنید:

- تصویر یا ویدئوی بدون `max-width: 100%`.
- `width: 100vw` در کنار scrollbar.
- متن/URL غیرقابل شکستن.
- Grid با min track بیش از فضای موجود.
- Flex item بدون `min-width: 0`.
- padding و border در `content-box`.

`overflow-x: hidden` درمان عمومی نیست؛ اول علت overflow را پیدا کنید.

## Container width و خوانایی

```css
.container {
  width: min(100% - 2rem, 70rem);
  margin-inline: auto;
}
```

این الگو هم حاشیه‌ی امن می‌دهد و هم از کشیده شدن بیش از حد متن جلوگیری می‌کند. برای متن‌های طولانی `max-width` حدود `65ch` می‌تواند خوانایی را بهتر کند.

## Media Featureهای مهم

```css
@media (prefers-reduced-motion: reduce) { }
@media (prefers-color-scheme: dark) { }
@media (orientation: landscape) { }
```

Media Query فقط عرض صفحه نیست؛ می‌تواند preference کاربر یا جهت نمایش را نیز در نظر بگیرد.

## تست واقعی

حداقل سه حالت را بررسی کنید: حدود `320px`، `768px` و `1440px`. سپس با zoom مرورگر و تغییر اندازه‌ی متن نیز تست کنید. responsive بودن فقط «ظاهر در سه screenshot» نیست.

### چک‌لیست تسلط

- می‌توانم mobile-first را توضیح دهم.
- breakpoint را بر اساس شکست layout انتخاب می‌کنم.
- می‌توانم منشأ horizontal overflow را پیدا کنم.
- با `prefers-reduced-motion` و `prefers-color-scheme` کار می‌کنم.

