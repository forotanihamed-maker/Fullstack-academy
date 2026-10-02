---
title: "CSS Grid: چیدمان دوبعدی"
description: با Grid ستون، ردیف، template areas و شبکه‌های responsive بسازید.
difficulty: intermediate
estimatedMinutes: 34
objectives:
  - تفاوت Grid و Flexbox
  - ساخت ستون‌های fr و minmax
  - استفاده از grid-template-areas
  - ساخت card grid با auto-fit
concepts:
  - display:grid
  - grid-template-columns
  - grid-template-rows
  - gap
  - fr
  - repeat
  - minmax
  - grid-column
  - grid-row
  - grid-template-areas
  - auto-fit
prerequisites:
  - 02-css/10-flexbox
relatedLessons:
  - 02-css/12-responsive
relatedProjects:
  - css-responsive-landing
nextLesson: 02-css/12-responsive
---

## Grid برای دو محور است

```css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}
```

`fr` سهمی از فضای باقی‌مانده است.

## Areas

```css
.page {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
.page > header { grid-area: header; }
.page > aside { grid-area: sidebar; }
.page > main { grid-area: main; }
.page > footer { grid-area: footer; }
```

این الگو برای اسکلت صفحه بسیار خواناست و در RTL نیز جهت ستون‌ها با direction هماهنگ می‌شود.

## شبکه کارت responsive

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}
```

برای «ردیف/ستون با محتوای تعیین‌کننده» Flexbox و برای شبکه دوبعدی Grid انتخاب طبیعی‌تری است؛ ترکیب هر دو نیز کاملاً رایج است.

## Grid: شبکه را قبل از item طراحی کنید

در Grid معمولاً ابتدا trackها را تعریف می‌کنیم و بعد itemها را در آن‌ها قرار می‌دهیم:

```css
.dashboard {
  display: grid;
  grid-template-columns: 16rem 1fr;
  grid-template-areas:
    "sidebar main";
  gap: 1.5rem;
}
```

برای page shell، `grid-template-areas` نام‌گذاری رابطه‌ی بخش‌ها را خواناتر می‌کند.

## `fr`، `minmax` و `repeat`

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}
```

این الگو به‌جای تعیین breakpoint برای هر تعداد کارت، اجازه می‌دهد browser بر اساس فضای موجود ستون‌ها را تغییر دهد.

## auto-fit و auto-fill

هر دو برای ایجاد trackهای خودکار استفاده می‌شوند، اما در رفتار با trackهای خالی تفاوت دارند. برای card gridهای معمولی، `auto-fit` اغلب باعث می‌شود ستون‌های خالی جمع شوند و کارت‌ها فضای موجود را بهتر پر کنند؛ `auto-fill` trackهای قابل‌وجود را حفظ می‌کند.

## `minmax()` را برای محتوای واقعی تنظیم کنید

اگر حداقل را بیش از حد بزرگ بگیرید، در viewport کوچک horizontal overflow می‌سازید. اگر بیش از حد کوچک بگیرید، component خوانایی خود را از دست می‌دهد. مقدار min باید بر اساس حداقل عرض واقعی component انتخاب شود.

## Grid Areas برای responsive layout

```css
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
@media (max-width: 48rem) {
  .page {
    grid-template-areas:
      "header"
      "main"
      "footer";
  }
}
```

می‌توانید layout را بدون تغییر HTML از دو ستونه به تک‌ستونه تبدیل کنید.

## تصویر، `aspect-ratio` و `object-fit`

```css
.thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
```

`aspect-ratio` نسبت قاب را ثابت می‌کند؛ `object-fit: cover` تصویر را بدون کشیدگی داخل قاب پر می‌کند و ممکن است بخشی از تصویر را crop کند.

## Subgrid

`subgrid` برای زمانی مفید است که componentهای داخلی باید خطوط grid والد را به ارث ببرند، مثلاً کارت‌هایی که عنوان، metadata و footer آن‌ها باید هم‌تراز باشد. قبل از استفاده در محصول واقعی، پشتیبانی مرورگرهای هدف را بررسی کنید.

### چک‌لیست تسلط

- می‌توانم بین Flex و Grid انتخاب آگاهانه داشته باشم.
- `minmax()` و `auto-fit` را برای card grid می‌نویسم.
- layout چندبخشی را با `grid-template-areas` می‌سازم.
- می‌دانم چرا تصویر را با `object-fit` و `aspect-ratio` کنترل می‌کنیم.

