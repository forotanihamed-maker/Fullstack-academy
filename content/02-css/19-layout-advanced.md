---
title: Flexbox و Grid پیشرفته
description: Flexbox و Grid را برای محتوای متغیر، auto-fit و auto-fill حرفه‌ای‌تر استفاده کنید.
difficulty: advanced
estimatedMinutes: 30
objectives:
- 'حل overflow با min-width: 0'
- استفاده درست از flex basis/grow/shrink
- ساخت Grid خودکار با minmax
- تفاوت auto-fit و auto-fill
- استفاده از aspect-ratio و place-items
concepts:
- 'min-width: 0'
- flex-basis
- flex-grow
- flex-shrink
- auto-fit
- auto-fill
- minmax()
- aspect-ratio
- subgrid
prerequisites:
- 02-css/18-stacking
relatedLessons:
- 02-css/20-container-query
relatedProjects:
- css-advanced-dashboard
nextLesson: 02-css/20-container-query
---

## Flex و `min-width: 0`
در Flex، مقدار پیش‌فرض `min-width: auto` می‌تواند باعث شود متن طولانی بیرون بزند:

```css
.row { display: flex; gap: 1rem; }
.row__content { min-width: 0; }
```

`flex-basis` اندازه اولیه است و `flex-grow` و `flex-shrink` فضای اضافی یا کمبود را تقسیم می‌کنند.

## Margin auto
یک آیتم می‌تواند فضای باقی‌مانده را بگیرد:

```css
.navbar__logout {
  margin-inline-start: auto;
}
```

## Grid خودکار

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}
```

`auto-fit` ستون‌های خالی را جمع می‌کند و آیتم‌ها را می‌کشد؛ `auto-fill` جای ستون‌های ممکن را حفظ می‌کند.

## Aspect Ratio

```css
.thumb {
  aspect-ratio: 16 / 9;
  object-fit: cover;
  width: 100%;
}
```

`subgrid` برای هم‌ترازی داخلی کارت‌ها در مرورگرهای مدرن مفید است؛ پشتیبانی هدف را بررسی کنید.

## Flexbox پیشرفته: `basis → grow/shrink`

وقتی `flex: 1 1 0` می‌نویسید، itemها برای توزیع فضای موجود از basis صفر شروع می‌کنند و سپس grow فضا را تقسیم می‌کند. در مقابل `flex: 1 1 260px` ابتدا 260px را به‌عنوان مبنای هر item در نظر می‌گیرد.

انتخاب بین این دو روی اندازه‌ی واقعی کارت‌ها اثر دارد؛ بنابراین shorthand را حفظ نکنید، منطق سه جزء آن را بفهمید.

## مشکل `min-width: 0` را به خاطر بسپارید

```css
.sidebar-layout {
  display: flex;
}
.main {
  min-width: 0;
}
```

این یک اصلاح رایج برای layoutهای دو ستونه است که محتوای طولانی داخل ستون اصلی باعث overflow می‌شود.

## Grid خودکار حرفه‌ای

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: 1rem;
}
```

برای کارت‌های معمولی، این الگو را با حداقل عرض واقعی component تنظیم کنید؛ صرفاً یک عدد تصادفی انتخاب نکنید.

## `auto-fill` یا `auto-fit`؟

اگر فضای اضافی دارید، `auto-fit` معمولاً trackهای خالی را جمع می‌کند و itemهای موجود را کش می‌دهد. `auto-fill` trackهای قابل‌وجود را نگه می‌دارد. این تفاوت را با یک playground در viewportهای مختلف مشاهده کنید.

## `place-items` و `aspect-ratio`

```css
.hero {
  display: grid;
  place-items: center;
}
.preview {
  aspect-ratio: 16 / 9;
}
```

`place-items` shorthand برای align/justify items است و برای centered UI بسیار خواناست.

## Subgrid و مرزبندی انتظار

`subgrid` برای هم‌ترازی خطوط داخلی componentها مفید است اما اختیاری است. آن را بعد از تسلط بر Grid پایه یاد بگیرید و قبل از استفاده، browser support پروژه را بررسی کنید.

### چک‌لیست تسلط

- می‌توانم یک overflow واقعی در Flex را اصلاح کنم.
- auto-fit و auto-fill را در یک مثال عملی مقایسه می‌کنم.
- از `minmax`، `aspect-ratio` و `place-items` درست استفاده می‌کنم.

