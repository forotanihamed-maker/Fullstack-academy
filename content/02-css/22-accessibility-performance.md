---
title: دسترس‌پذیری و عملکرد در CSS
description: Focus، reduced-motion، کنتراست، هدف لمسی و نکات عملکردی CSS را رعایت کنید.
difficulty: advanced
estimatedMinutes: 28
objectives:
- ساخت visible focus
- پشتیبانی prefers-reduced-motion
- رعایت contrast
- ساخت visually-hidden
- شناخت نکات عملکردی مهم
concepts:
- focus-visible
- prefers-reduced-motion
- contrast
- visually-hidden
- skip-link
- font-display
- CSS performance
prerequisites:
- 02-css/21-architecture
relatedLessons:
- 02-css/23-modern-css
relatedProjects:
- css-advanced-dashboard
nextLesson: 02-css/23-modern-css
---

## Focus قابل مشاهده
هرگز `outline: none` را بدون جایگزین استفاده نکنید:

```css
:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 3px;
}
```

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .card { transition: none; }
  * { scroll-behavior: auto !important; }
}
```

## نکات دسترس‌پذیری
- کنتراست متن معمولی حداقل حدود 4.5:1 باشد.
- هدف لمسی دکمه‌ها و لینک‌ها در موبایل حدود 44×44px باشد.
- رنگ تنها حامل معنا نباشد.
- اندازه متن را با `rem` بسازید.

## Visually Hidden

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
```

## Skip Link
لینک skip می‌تواند هنگام فوکوس ظاهر شود تا کاربر کیبورد سریع به محتوای اصلی برسد.

## عملکرد
- انیمیشن‌های UI را ترجیحاً روی `transform` و `opacity` محدود کنید.
- وزن‌های غیرضروری فونت را بارگذاری نکنید.
- تصاویر background بزرگ را بهینه کنید.
- Selectorهای بی‌دلیل پیچیده را زیاد نکنید.

## Accessibility بخشی از Definition of Done است

یک UI فقط وقتی «تمام» شده که کاربر keyboard، zoom، reduced-motion و تنظیمات خوانایی را هم بتواند استفاده کند.

## Focus را خراب نکنید

```css
:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 3px;
}
```

`outline: none` بدون جایگزین، مسیر دیداری keyboard را حذف می‌کند. `:focus-visible` کمک می‌کند focus برای interactionهای keyboard واضح‌تر نمایش داده شود.

## Contrast و رنگ

متن معمولی باید کنتراست کافی داشته باشد؛ در جزوه‌ی شما معیار 4.5:1 برای متن معمولی به‌عنوان قاعده‌ی عملی آمده است. همچنین وضعیت‌هایی مثل error و success را فقط با رنگ نشان ندهید؛ متن، icon یا الگوی دیگری اضافه کنید.

## Touch target

برای کنترل‌های لمسی، حدود 44×44 پیکسل به‌عنوان هدف عملی مناسب در نظر بگیرید. این الزام را با فاصله‌ی کافی بین کنترل‌ها و اندازه‌ی متن قابل خواندن همراه کنید.

## Visually Hidden در برابر `display:none`

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
```

این تکنیک برای متنی است که باید در accessibility tree باقی بماند ولی از دید بصری پنهان شود. `display:none` و `visibility:hidden` برای hidden واقعی مناسب‌ترند.

## Skip Link

```css
.skip-link {
  position: absolute;
  inset-inline-start: 1rem;
  inset-block-start: -4rem;
}
.skip-link:focus {
  inset-block-start: 1rem;
}
```

Skip link به کاربر keyboard اجازه می‌دهد از navigation طولانی عبور کند.

## Performance: کمتر اما هدفمند

- animation را به `transform` و `opacity` محدود کنید.
- فونت‌ها و weightهای غیرضروری را حذف کنید.
- تصاویر بزرگ و backgroundهای سنگین را بهینه کنید.
- CSS بلااستفاده را حذف کنید.
- selectorهای پیچیده را فقط وقتی لازم است استفاده کنید.

`content-visibility: auto` نیز در صفحات بزرگ می‌تواند یک تکنیک پیشرفته باشد؛ قبل از استفاده، رفتار accessibility و نیاز پروژه را تست کنید.

### چک‌لیست تسلط

- keyboard focus را تست می‌کنم.
- reduced-motion را واقعاً در مرورگر آزمایش می‌کنم.
- contrast را اندازه‌گیری می‌کنم، حدس نمی‌زنم.
- می‌توانم تفاوت visually-hidden و display:none را توضیح دهم.

