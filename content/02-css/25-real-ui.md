---
title: ساخت UI واقعی با Design Tokens
description: یک سیستم طراحی کوچک با Tokenها، حالت‌های کامپوننت و layout واکنشگرا بسازید.
difficulty: advanced
estimatedMinutes: 32
objectives:
- ساخت Tokenهای رنگ و فاصله
- تعریف stateهای component
- ساخت container و card grid
- استفاده ترکیبی از Flex و Grid
- ساخت UI قابل تغییر با یک Token
concepts:
- design tokens
- component states
- container
- card grid
- BEM
- responsive UI
prerequisites:
- 02-css/24-logical-rtl
relatedLessons:
- 02-css/24-logical-rtl
relatedProjects:
- css-advanced-dashboard
nextLesson: null
---

## ظاهر حرفه‌ای از سیستم می‌آید
چهار گام اصلی جزوه:

1. Design Tokens با Custom Properties
2. Reset و پایه‌های منظم
3. Componentها با stateهای عادی، hover، active، disabled و focus-visible
4. Layout واکنشگرا با container و Grid/Flex

نمونه Tokenها:

```css
:root {
  --primary-600: #2563eb;
  --gray-200: #e2e8f0;
  --gray-900: #0f172a;
  --space-2: .5rem;
  --space-6: 1.5rem;
  --radius: 12px;
}
```

نمونه Button:

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-6);
  border: 0;
  border-radius: var(--radius);
  background: var(--primary-600);
  color: #fff;
  font: inherit;
}
```

برای layout:

```css
.container {
  width: min(100% - 2rem, 1100px);
  margin-inline: auto;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-6);
}
```

تمرکز این درس روی ترکیب اصول است، نه افکت‌های زیاد. فاصله منظم، سلسله‌مراتب، رنگ محدود، همسویی و stateهای کامل نتیجه بهتری می‌دهند.

## از Token تا Component: یک workflow واقعی

برای ساخت UI حرفه‌ای، ابتدا component را طراحی نکنید و بعد رنگ‌ها را تصادفی انتخاب کنید. ترتیب پیشنهادی:

1. Tokenهای رنگ، فاصله، radius و typography.
2. Reset و base styles.
3. layout container.
4. componentهای کوچک مثل button و input.
5. componentهای ترکیبی مثل card و navbar.
6. stateها: hover، focus، active، disabled.
7. responsive behavior.
8. accessibility و تست نهایی.

## Design Token نمونه

```css
:root {
  --color-primary: #2563eb;
  --color-surface: #fff;
  --color-text: #0f172a;
  --space-2: .5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --radius-md: .75rem;
}
```

اگر همه‌ی componentها از این سیستم استفاده کنند، تغییر theme یا برند به جای اصلاح ده‌ها selector، با تغییر چند token انجام می‌شود.

## Component باید state داشته باشد

برای button فقط حالت عادی کافی نیست:

```css
.btn:hover { }
.btn:focus-visible { }
.btn:active { }
.btn:disabled { }
```

برای stateهای مهم، contrast و تفاوت بصری واضح را بررسی کنید.

## Card Grid واقعی

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: var(--space-6);
}
```

Card داخلی می‌تواند Flex باشد تا footer یا actionها در پایین هم‌تراز شوند؛ Grid برای صفحه و Flex برای داخل component می‌تواند هم‌زمان کاملاً منطقی باشد.

## UI را با تغییر token آزمایش کنید

یک تمرین مهم: فقط `--color-primary` و `--radius-md` را تغییر دهید. اگر تمام UI به‌درستی تغییر کرد، architecture شما واقعاً token-driven است. اگر مجبور شدید ده‌ها selector را دستکاری کنید، وابستگی مستقیم componentها به مقادیر خام زیاد است.

## Definition of Done برای UI

- در 320px horizontal scroll ناخواسته ندارد.
- در 768px layout منطقی است.
- در 1440px بیش از حد کشیده نیست.
- keyboard focus واضح است.
- reduced-motion رعایت می‌شود.
- contrast بررسی شده است.
- spacing از tokenها می‌آید.
- selectorها کم‌عمق هستند.
- هیچ ID برای styling استفاده نشده است.

### چک‌لیست تسلط

- می‌توانم از token به component برسم.
- stateهای اصلی component را طراحی می‌کنم.
- می‌توانم یک UI را در سه viewport و دو جهت RTL/LTR ارزیابی کنم.

