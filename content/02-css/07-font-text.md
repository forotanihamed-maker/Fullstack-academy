---
title: فونت و متن در CSS
description: فونت، اندازه، وزن، فاصله خطوط و ویژگی‌های متن را برای خوانایی و رابط فارسی تنظیم کنید.
difficulty: intermediate
estimatedMinutes: 40
objectives:
  - تنظیم font-family و fallback
  - استفاده از rem برای اندازه فونت
  - تنظیم line-height و خوانایی
  - شناخت text-align، decoration و overflow متن
concepts:
  - font-family
  - font-size
  - font-weight
  - line-height
  - letter-spacing
  - text-align
  - text-decoration
  - text-overflow
  - white-space
prerequisites:
  - 02-css/06-background
relatedLessons:
  - 02-css/08-display
relatedProjects:
  - css-responsive-landing
nextLesson: 02-css/08-display
---

## تایپوگرافی بخشی از ساختار UI است

فونت مناسب فقط ظاهر نیست؛ اندازه، وزن و فاصله خطوط مستقیماً روی خوانایی اثر دارند.

```css
body {
  font-family: "Vazirmatn", system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.7;
  color: #1e293b;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
}
```

برای فارسی، `direction: rtl` را روی HTML یا ناحیه مناسب قرار دهید و در فاصله‌های جهتی از ویژگی‌های منطقی استفاده کنید.

## متن طولانی

```css
.title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

برای متن‌های معمولی بهتر است اجازه دهید محتوا wrap شود؛ `nowrap` را فقط در جاهایی به کار ببرید که رفتار آن را کنترل کرده‌اید.

## خوانایی

عرض خط بسیار زیاد خوانایی را کم می‌کند. برای متن مقاله می‌توانید از `max-width: 65ch` استفاده کنید. رنگ متن و پس‌زمینه نیز باید کنتراست کافی داشته باشند.

## خطاهای رایج

- استفاده افراطی از `font-size` برحسب px
- `line-height` بسیار کم برای متن فارسی
- استفاده از `letter-spacing` زیاد برای متن فارسی
- نبود fallback برای فونت خارجی

## Typography فقط font-size نیست

برای متن خوانا باید چند عامل را با هم ببینید: خانواده‌ی فونت، وزن، اندازه، `line-height`، عرض خط و contrast.

```css
.article {
  max-width: 65ch;
  line-height: 1.7;
}
.article h1 {
  line-height: 1.15;
  text-wrap: balance;
}
```

`65ch` یک روش تقریبی برای محدود کردن عرض خط است؛ مقدار دقیق را بر اساس فونت و محتوای پروژه تنظیم کنید.

## rem برای احترام به تنظیمات کاربر

برای typography اصلی، `rem` معمولاً انتخاب مناسبی است چون به اندازه‌ی root وابسته است و با zoom بهتر کنار می‌آید. استفاده‌ی بی‌دلیل از px برای همه‌ی متن‌ها می‌تواند انعطاف‌پذیری را کاهش دهد.

## Font Loading و عملکرد

اگر فونت سفارشی دارید، فقط weightهای لازم را بارگذاری کنید. `font-display` را آگاهانه انتخاب کنید و حجم فایل‌های فونت را زیر نظر بگیرید.

## متن فارسی و RTL

برای رابط فارسی، فقط `direction: rtl` کافی نیست؛ فاصله‌ها، alignment، icon placement و logical properties نیز باید بررسی شوند. متن را با `text-align:start` و spacing منطقی طراحی کنید.

### تمرین دیباگ Typography

یک صفحه‌ی مقاله را در 320px و 1440px بررسی کنید. اگر heading از قاب خارج می‌شود یا پاراگراف‌ها بیش از حد پهن هستند، ابتدا width، line-height و font-size را بررسی کنید؛ قبل از کوچک کردن همه‌ی فونت‌ها علت واقعی را پیدا کنید.

## Font Stack و Fallback

مرورگر ممکن است فونت اول را در دسترس نداشته باشد. بنابراین font stack باید fallback داشته باشد:

```css
body {
  font-family: "Vazirmatn", system-ui, sans-serif;
}
```

فونت fallback فقط مسئله‌ی زیبایی نیست؛ تفاوت metrics فونت‌ها می‌تواند line wrapping و ارتفاع صفحه را تغییر دهد. پس صفحه را با fallback نیز آزمایش کنید.

## Weight فقط 400 و 700 نیست

اگر فونت انتخابی weightهای خاصی دارد، فقط weightهایی را بارگذاری کنید که واقعاً استفاده می‌شوند. درخواست ده‌ها فایل فونت بدون نیاز، حجم و زمان بارگذاری را بالا می‌برد.

```css
.title { font-weight: 700; }
.meta { font-weight: 500; }
```

## line-height و متن فارسی

`line-height` باید با اندازه فونت و شکل حروف هماهنگ باشد. مقدار خیلی کم باعث برخورد بصری خطوط می‌شود و مقدار خیلی زیاد رابطه‌ی پاراگراف‌ها را از بین می‌برد. برای متن فارسی یک مقدار حدودی مثل `1.6` یا `1.8` فقط نقطه‌ی شروع است؛ با فونت واقعی آزمایش کنید.

## اندازه و سلسله‌مراتب

یک صفحه نباید برای هر عنوان یک اندازه‌ی تصادفی داشته باشد. یک scale تعریف کنید:

```css
:root {
  --text-sm: .875rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-xl: 1.5rem;
  --text-2xl: 2rem;
}
```

سپس semantic roleهای UI را به این scale وصل کنید. این کار بعداً پایه‌ی Design Tokens می‌شود.

## text-align در RTL

برای کامپوننتی که باید با جهت سند سازگار باشد، `text-align: start` اغلب از `left`/`right` بهتر است:

```css
.article { text-align: start; }
```

همچنین برای فاصله‌های افقی از logical properties استفاده کنید تا همان CSS در RTL و LTR قابل استفاده باشد.

## Wrap، overflow و کلمات طولانی

در زبان فارسی، ترکیب متن، URL، شماره و کلمه‌های لاتین می‌تواند overflow ایجاد کند. قبل از استفاده از `overflow: hidden` علت را پیدا کنید. بسته به محتوا می‌توان از `overflow-wrap: anywhere` یا `overflow-wrap: break-word` با دقت استفاده کرد.

```css
.article {
  overflow-wrap: break-word;
}
```

برای عنوان‌های تک‌خطی، `white-space + overflow + text-overflow` الگوی مشخصی است؛ برای پاراگراف معمولی این الگو را تحمیل نکنید.

## Fluid Typography

برای titleهای واکنش‌گرا می‌توانید بعد از یادگیری `clamp()` از آن استفاده کنید:

```css
h1 {
  font-size: clamp(1.75rem, 1rem + 3vw, 3rem);
}
```

هدف این نیست که فونت دائماً تغییر کند؛ هدف این است که بین حداقل و حداکثر، رشد کنترل‌شده داشته باشد.

### تمرین دیباگ

یک مقاله در موبایل مشکل خوانایی دارد: عنوان بیرون می‌زند، پاراگراف‌ها خیلی پهن‌اند و line-height کم است. بدون تغییر HTML، با `max-width`، `line-height`، `font-size` و wrapping مشکل را حل کنید.

## معیار تسلط

باید بتوانید یک typography system کوچک بسازید، fallback مناسب بدهید، تفاوت `font-size` و `line-height` را توضیح دهید و یک overflow متنی را بدون مخفی‌کردن محتوای مهم اصلاح کنید.
