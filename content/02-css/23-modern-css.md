---
title: ویژگی‌های مدرن CSS
description: ویژگی‌های مدرن مانند logical properties، gap، aspect-ratio و accent-color را در جای مناسب بشناسید.
difficulty: advanced
estimatedMinutes: 24
objectives:
- شناخت gap و aspect-ratio
- شناخت inset و logical properties
- آشنایی با accent-color
- شناخت scroll-snap و text-wrap
- بررسی پشتیبانی قبل از استفاده
concepts:
- gap
- aspect-ratio
- inset
- accent-color
- scroll-snap
- svh
- dvh
- 'text-wrap: balance'
prerequisites:
- 02-css/22-accessibility-performance
relatedLessons:
- 02-css/24-logical-rtl
relatedProjects:
- css-advanced-dashboard
nextLesson: 02-css/24-logical-rtl
---

## چند قابلیت کاربردی

```css
.card-grid { gap: 1rem; }
.thumb { aspect-ratio: 16 / 9; }
.badge { inset: 0 auto auto 0; }
```

`gap` فاصله Flex و Grid را ساده می‌کند و `aspect-ratio` نسبت تصویر را بدون hack حفظ می‌کند.

ویژگی‌های دیگری که در جزوه به‌عنوان مرور حرفه‌ای آمده‌اند:
- `accent-color` برای کنترل رنگ native checkbox/radio
- `scroll-snap` برای اسکرول مرحله‌ای
- `svh` و `dvh` برای ارتفاع viewport موبایل
- `text-wrap: balance` برای متعادل کردن خطوط عنوان
- CSS Nesting، `@layer` و Container Query

قبل از استفاده از ویژگی جدید، جدول پشتیبانی MDN یا Can I Use را بررسی کنید و برای مرورگرهای قدیمی fallback مناسب در نظر بگیرید.

## ویژگی‌های مدرن را به‌صورت «ابزار مسئله» یاد بگیرید

به‌جای حفظ فهرست propertyها، مسئله را به ابزار وصل کنید:

| مسئله | ابزار |
|---|---|
| فاصله در Flex/Grid | `gap` |
| قاب تصویر | `aspect-ratio` |
| اندازه‌ی سیال محدودشده | `clamp()` |
| layout component مستقل | Container Query |
| جهت RTL/LTR | Logical Properties |
| کنترل cascade | `@layer` |
| انتخاب والد بر اساس فرزند | `:has()` |
| ارتفاع موبایل | `svh` / `dvh` |
| تعادل خطوط heading | `text-wrap: balance` |

## `dvh`، `svh` و `lvh`

در موبایل ارتفاع viewport می‌تواند با نمایش/پنهان شدن browser UI تغییر کند. واحدهای جدید viewport برای مدل‌های مختلف این وضعیت طراحی شده‌اند. برای heroهای تمام‌قد، انتخاب واحد مناسب را در دستگاه واقعی بررسی کنید.

## `@layer` برای معماری Cascade

```css
@layer reset, base, components, utilities;
```

Layerها را قبل از زیاد کردن specificity بررسی کنید. اگر conflict ناشی از ترتیب معماری است، layer می‌تواند راه‌حل تمیزتری باشد.

## `color-mix()` و progressive enhancement

ویژگی‌های جدید را طوری اضافه کنید که نبودشان کل UI را خراب نکند:

```css
.button {
  background: var(--color-primary);
}

@supports (color: color-mix(in srgb, black, white)) {
  .button:hover {
    background: color-mix(in srgb, var(--color-primary), black 10%);
  }
}
```

ایده‌ی اصلی progressive enhancement است: **fallback قابل استفاده + قابلیت جدید در صورت پشتیبانی**.

### چک‌لیست تسلط

- برای هر feature جدید، مسئله‌ی واقعی آن را توضیح می‌دهم.
- fallback و progressive enhancement را در نظر می‌گیرم.
- قبل از استفاده‌ی production، پشتیبانی مرورگر هدف را بررسی می‌کنم.
