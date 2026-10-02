---
title: "Flexbox: چیدمان یک‌بعدی"
description: با Flexbox ردیف، ستون، هم‌ترازی، فاصله و wrapping را بسازید.
difficulty: intermediate
estimatedMinutes: 32
objectives:
  - شناخت main axis و cross axis
  - استفاده از justify-content و align-items
  - ساخت navigation با gap
  - استفاده از flex و flex-wrap برای کارت‌ها
concepts:
  - display:flex
  - flex-direction
  - justify-content
  - align-items
  - flex-wrap
  - gap
  - flex-grow
  - flex-shrink
  - flex-basis
  - flex
prerequisites:
  - 02-css/09-position
relatedLessons:
  - 02-css/11-grid
relatedProjects:
  - css-responsive-landing
nextLesson: 02-css/11-grid
---

## Flexbox برای یک محور است

```css
.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
```

`justify-content` روی محور اصلی و `align-items` روی محور متقاطع کار می‌کند؛ اگر `flex-direction: column` شود، جهت این دو محور تغییر می‌کند.

## Navigation

```css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}
.menu {
  display: flex;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
```

در RTL نیازی نیست برای فارسی بی‌دلیل `row-reverse` بنویسید؛ start محور با direction صفحه هماهنگ می‌شود.

## flex shorthand

```css
.card { flex: 1 1 260px; }
.fixed { flex: 0 0 200px; }
```

سه مقدار به‌ترتیب grow، shrink و basis هستند.

## خطاهای رایج

- گذاشتن `display:flex` روی item به جای container
- اشتباه گرفتن محور اصلی و متقاطع
- استفاده از margin برای gap در همه موارد
- استفاده از `order` بدون توجه به ترتیب خواندن و keyboard navigation

## Flexbox: از محور شروع کنید

اول مشخص کنید **container** کجاست و محور اصلی چیست. بعد propertyها را انتخاب کنید:

```css
.toolbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between; /* main axis */
  align-items: center;            /* cross axis */
  gap: 1rem;
}
```

اگر `flex-direction: column` شود، main axis عمودی است؛ بنابراین `justify-content` هم عمودی عمل می‌کند. این نکته یکی از رایج‌ترین نقاط سردرگمی است.

## سه‌گانه‌ی flex

```css
.item {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 16rem;
}
```

- `basis`: اندازه‌ی اولیه قبل از توزیع فضای اضافی/کمبود.
- `grow`: سهم item از فضای اضافی.
- `shrink`: سهم item از فضای کمبود.

شورت‌هند `flex: 1 1 16rem` همین سه مفهوم را یکجا بیان می‌کند.

## مشکل کلاسیک `min-width: auto`

Flex itemها به‌صورت پیش‌فرض ممکن است بر اساس اندازه‌ی محتوای خود از کوچک شدن جلوگیری کنند. برای containerهای متنی، این الگو بسیار مهم است:

```css
.row {
  display: flex;
}
.content {
  min-width: 0;
}
```

اگر عنوان طولانی باعث horizontal overflow می‌شود، قبل از اضافه کردن `overflow: hidden` یا کوچک کردن فونت، `min-width: 0` را بررسی کنید.

## `margin-inline-start: auto`

در toolbar می‌توان یک گروه را به انتهای محور فرستاد:

```css
.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.nav__actions {
  margin-inline-start: auto;
}
```

این روش برای RTL/LTR نیز خواناتر از محاسبه‌ی فاصله با marginهای فیزیکی است.

## Flex یا Grid؟

- یک محور غالب دارید؟ Flexbox.
- ردیف و ستون باید هم‌زمان کنترل شوند؟ Grid.
- منوی افقی، toolbar، button group و alignment؟ معمولاً Flex.
- dashboard، gallery و page shell؟ معمولاً Grid.

این قانون مطلق نیست؛ هدف این است که ابزار را بر اساس مسئله انتخاب کنید، نه عادت.

## `order` و دسترس‌پذیری

`order` فقط ترتیب بصری را عوض می‌کند و لزوماً ترتیب DOM یا تجربه‌ی خواندن/keyboard را عوض نمی‌کند. اگر ترتیب منطقی محتوا تغییر کرده، بهتر است HTML را اصلاح کنید.

## تمرین دیباگ Flex

اگر سه کارت در یک ردیف هستند اما کارت دوم متن طولانی دارد و بیرون می‌زند:

1. container را انتخاب کنید.
2. `display`, `flex-direction`, `flex-basis` و `min-width` را در Computed ببینید.
3. روی item مشکل‌دار `min-width: 0` امتحان کنید.
4. سپس `flex-wrap` و `gap` را بررسی کنید.

### چک‌لیست تسلط

- محور اصلی و متقاطع را قبل از نوشتن CSS مشخص می‌کنم.
- `grow/shrink/basis` را توضیح می‌دهم.
- مشکل `min-width: 0` را می‌شناسم.
- می‌توانم یک toolbar و card row را بدون hack بسازم.

