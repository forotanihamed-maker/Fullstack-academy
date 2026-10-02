---
title: Box Model و اندازه‌گیری واقعی عناصر
description: content، padding، border و margin را بشناسید و با box-sizing چیدمان قابل پیش‌بینی بسازید.
difficulty: beginner
estimatedMinutes: 25
objectives:
  - تشخیص چهار بخش Box Model
  - محاسبه اثر padding و border بر اندازه با box-content
  - استفاده از border-box به‌عنوان الگوی پیش‌فرض
  - تفاوت margin و padding را توضیح دهید
concepts:
  - content
  - padding
  - border
  - margin
  - box-sizing
  - margin collapse
  - logical properties
prerequisites:
  - 02-css/04-units
relatedLessons:
  - 02-css/06-background
relatedProjects:
  - css-personal-profile
nextLesson: 02-css/06-background
---

## هر عنصر یک جعبه است

Box Model چهار لایه دارد:

```text
margin
└── border
    └── padding
        └── content
```

- **content**: خود محتوا؛ `width` و `height` در حالت پیش‌فرض به این بخش مربوط‌اند.
- **padding**: فاصله داخلی بین محتوا و border؛ پس‌زمینه این ناحیه را هم پوشش می‌دهد.
- **border**: حاشیه جعبه.
- **margin**: فاصله بیرونی از عناصر دیگر و شفاف است.

مثال:

```css
.card {
  width: 300px;
  padding: 16px;
  border: 2px solid #cbd5e1;
  margin: 24px auto;
  border-radius: 12px;
}
```

## Shorthand

```css
margin: 10px;
margin: 10px 20px;
margin: 10px 20px 30px;
margin: 10px 20px 30px 40px;
```

مقادیر چهارگانه به ترتیب بالا، راست، پایین و چپ خوانده می‌شوند.

## چرا box-sizing مهم است؟

با `box-sizing: content-box` مقدار `width` فقط content را تعیین می‌کند؛ بنابراین padding و border به اندازه نهایی اضافه می‌شوند.

برای رفتار قابل پیش‌بینی‌تر، الگوی پیشنهادی این است:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

در این حالت width شامل padding و border می‌شود.

## Margin و Padding را اشتباه نگیرید

`padding` فاصله داخل جعبه است و پس‌زمینه را شامل می‌شود. `margin` فاصله بیرون جعبه است و پس‌زمینه را شامل نمی‌شود.

دو بلوک عمودی مجاور ممکن است دچار **margin collapse** شوند؛ یعنی دو margin عمودی لزوماً با هم جمع نمی‌شوند و معمولاً بزرگ‌ترِ آن‌ها اثر می‌گذارد. این رفتار در Flex و Grid مانند جریان عادی بلوک‌ها نیست.

## وسط‌چین کردن بلوک

برای یک بلوک با عرض مشخص می‌توان از این الگو استفاده کرد:

```css
.card {
  max-width: 40rem;
  margin-inline: auto;
}
```

در RTL بهتر است برای جهت‌های افقی از ویژگی‌های منطقی مانند `margin-inline` استفاده کنیم.

## خطاهای رایج

- فراموش کردن `box-sizing: border-box`
- اشتباه گرفتن padding و margin
- استفاده از `height` ثابت برای محتوای متنی که ممکن است بزرگ‌تر شود
- انتظار اثر `margin: auto` روی عنصر inline

## تمرین

دو `div` پشت سر هم بسازید؛ برای یکی `margin-bottom: 20px` و برای دیگری `margin-top: 30px` قرار دهید و فاصله واقعی را با Box Model در DevTools بررسی کنید.

## Box Model را واقعاً محاسبه کنید

وقتی می‌گوییم عرض یک عنصر `300px` است، باید بدانیم این عدد متعلق به کدام بخش است. با `box-sizing: content-box` مقدار width فقط **content box** را مشخص می‌کند؛ با `border-box`، width کل جعبه تا لبه‌ی border را کنترل می‌کند.

```css
.card {
  width: 300px;
  padding: 24px;
  border: 2px solid;
}
```

در `content-box` عرض بیرونی می‌شود `300 + 48 + 4 = 352px`. در `border-box` عرض بیرونی همان `300px` است و فضای content کوچک‌تر می‌شود.

## الگوی پیش‌فرض پروژه

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

این الگو باعث می‌شود محاسبات layout قابل پیش‌بینی‌تر شوند؛ مخصوصاً وقتی componentها padding و border دارند.

## Margin یا Padding؟

یک قانون ذهنی ساده:

- `padding` فضای **داخل component** است و background آن را می‌پوشاند.
- `margin` فضای **بیرون component** است و برای فاصله با همسایه‌ها به‌کار می‌رود.

اگر کارت باید فضای داخلی بیشتری داشته باشد، padding مناسب است. اگر دو کارت باید از هم فاصله بگیرند، margin یا در layoutهای جدیدتر `gap` معمولاً مناسب‌تر است.

## Margin Collapse

در block formatting context معمولی، margin عمودی دو block ممکن است با هم collapse شود؛ یعنی مجموع ساده‌ی دو margin را نمی‌بینید. برای همین گاهی `margin-top` و `margin-bottom` نتیجه‌ای متفاوت از انتظار دارند.

به‌جای تکیه بر marginهای زنجیره‌ای، در containerهای layout‌محور استفاده از `gap`، padding والد یا ساختار روشن component معمولاً قابل پیش‌بینی‌تر است.

## Logical Box Model

برای رابط فارسی/انگلیسی، به‌جای `margin-left` و `margin-right` از `margin-inline` و `margin-inline-start/end` استفاده کنید:

```css
.card {
  margin-inline: auto;
  padding-inline: 1rem;
  padding-block: 1.25rem;
}
```

این کار با تغییر `dir="rtl"` و `dir="ltr"` نیاز به دو نسخه CSS را کم می‌کند.

## DevTools: اندازه‌ی واقعی را ببینید

در DevTools عنصر را انتخاب کنید و بخش **Computed / Box Model** را باز کنید. از آنجا content، padding، border و margin را جداگانه ببینید. اگر عنصر «بیش از حد بزرگ» است، قبل از تغییر width، همین چهار بخش را بررسی کنید.

### چک‌لیست تسلط

- می‌توانم تفاوت `content-box` و `border-box` را محاسبه کنم.
- می‌دانم چه زمانی `padding` و چه زمانی `margin` مناسب‌تر است.
- می‌توانم overflow ناشی از width + padding را پیدا کنم.
- می‌توانم spacing یک component را با logical properties بنویسم.

