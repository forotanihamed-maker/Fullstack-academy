---
title: Container Query
description: کامپوننت‌های مستقل را بر اساس عرض والد، نه viewport، واکنشگرا کنید.
difficulty: advanced
estimatedMinutes: 24
objectives:
- تعریف query container
- استفاده از @container
- تفاوت Media Query و Container Query
- طراحی کامپوننت مستقل
concepts:
- container-type
- container-name
- '@container'
- component responsiveness
prerequisites:
- 02-css/19-layout-advanced
relatedLessons:
- 02-css/21-architecture
relatedProjects:
- css-advanced-dashboard
nextLesson: 02-css/21-architecture
---

## Media Query در برابر Container Query
Media Query عرض viewport را می‌سنجد؛ Container Query اندازه container والد را.

```css
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

.card {
  display: grid;
  gap: 12px;
}

@container card (min-width: 480px) {
  .card {
    grid-template-columns: 160px 1fr;
  }
}
```

حالا همان Card می‌تواند در sidebar باریک ساده باشد و در ستون عریض دو ستونه شود.

`container-type: inline-size` والد را قابل پرس‌وجو می‌کند؛ شرط `@container` روی اندازه آن والد اعمال می‌شود.

این قابلیت برای کامپوننت‌های مستقل بسیار مناسب است، اما پشتیبانی مرورگرهای هدف را قبل از استفاده بررسی کنید.

## چرا Container Query با Media Query فرق دارد؟

Media Query می‌پرسد «viewport چقدر است؟»؛ Container Query می‌پرسد «فضایی که component در آن قرار گرفته چقدر است؟».

این تفاوت برای componentهای reusable مهم است. یک Card ممکن است در صفحه‌ی اصلی افقی باشد اما همان Card در sidebar عمودی بماند؛ بدون اینکه viewport تغییر کرده باشد.

## الگوی کامل

```css
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

.card {
  display: grid;
  gap: 1rem;
}

@container card (min-width: 30rem) {
  .card {
    grid-template-columns: 10rem 1fr;
  }
}
```

Container باید ancestor component باشد و query روی descendant اجرا می‌شود.

## Media یا Container؟

- تغییر navigation کل صفحه بر اساس viewport → Media Query.
- تغییر داخلی Card بر اساس فضای Card → Container Query.
- طراحی component قابل‌استفاده در چند parent مختلف → Container Query معمولاً مناسب‌تر.

## نکته‌ی معماری

Container Query نباید بهانه‌ای برای ساختن ده‌ها breakpoint کوچک باشد. اول component را با layout سیال بسازید؛ سپس فقط جایی query اضافه کنید که رفتار component واقعاً باید تغییر کند.

### تمرین

یک Card را در دو wrapper بسازید: یکی 20rem و دیگری 40rem. بدون تغییر viewport، با Container Query شکل Card را تغییر دهید و تفاوت آن با Media Query را توضیح دهید.
