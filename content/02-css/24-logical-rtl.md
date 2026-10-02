---
title: Logical Properties و RTL
description: CSS را برای رابط فارسی و دوطرفه با ویژگی‌های منطقی بنویسید.
difficulty: intermediate
estimatedMinutes: 20
objectives:
- جایگزینی left/right با logical properties
- استفاده از inline و block axis
- ساخت spacing مناسب RTL/LTR
- 'استفاده از text-align: start'
concepts:
- logical properties
- margin-inline
- padding-block
- inset-inline-start
- 'text-align: start'
- RTL
- LTR
prerequisites:
- 02-css/23-modern-css
relatedLessons:
- 02-css/25-real-ui
relatedProjects:
- css-advanced-dashboard
nextLesson: 02-css/25-real-ui
---

## مشکل ویژگی‌های فیزیکی
در CSS سنتی ممکن است بنویسیم:

```css
.box {
  margin-left: 16px;
  padding-right: 8px;
  text-align: left;
}
```

برای UI فارسی و انگلیسی بهتر است از محورهای منطقی استفاده کنیم:

```css
.box {
  margin-inline-start: 16px;
  padding-inline-end: 8px;
  text-align: start;
}
```

همین الگو برای `padding-block`، `margin-block` و `inset-inline-start` نیز قابل استفاده است.

### مزیت
وقتی `dir` تغییر کند، CSS منطقی بدون نوشتن نسخه دوم برای جهت مخالف، رفتار مناسب‌تری دارد.

## چرا Logical Properties برای فارسی مهم‌اند؟

CSS فیزیکی بر اساس left/right و top/bottom نوشته می‌شود؛ CSS منطقی بر اساس محورهای `inline` و `block` فکر می‌کند. این مدل با تغییر جهت متن بهتر سازگار است.

```css
.card {
  margin-inline: auto;
  padding-inline: 1rem;
  padding-block: 1.5rem;
  border-inline-start: 4px solid var(--color-primary);
}
```

در `direction: rtl`، start و end نسبت به جهت متن تفسیر می‌شوند.

## `inset` و نسخه‌های منطقی

```css
.badge {
  position: absolute;
  inset-block-start: .5rem;
  inset-inline-end: .5rem;
}
```

به‌جای نوشتن `top` و `right` برای یک UI فارسی، logical properties اجازه می‌دهند component در LTR نیز بدون بازنویسی کامل رفتار کند.

## Text alignment

برای محتوای عمومی:

```css
.article {
  text-align: start;
}
```

این معمولاً از `text-align: left` برای componentهای دوطرفه مناسب‌تر است.

## اشتباه رایج

استفاده از logical property فقط در یک بخش و نگه داشتن margin/padding فیزیکی در بقیه‌ی component باعث می‌شود رفتار RTL ناقص باشد. در یک component کامل، spacing و positioning را به‌صورت یک سیستم بررسی کنید.

## تست دوطرفه

یک component را در این دو حالت تست کنید:

```html
<html dir="rtl">
```

و:

```html
<html dir="ltr">
```

هدف این نیست که فقط متن برعکس شود؛ alignment، icon placement، badge، spacing و layout نیز باید منطقی باقی بمانند.

### چک‌لیست تسلط

- فرق محور inline و block را توضیح می‌دهم.
- component را بدون left/right hard-code برای RTL/LTR می‌سازم.
- `start/end` را برای متن و positioning به‌کار می‌برم.

