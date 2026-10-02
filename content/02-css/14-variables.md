---
title: Custom Properties و Design Tokens
description: متغیرهای CSS را برای رنگ، فاصله، تایپوگرافی و تم‌پذیری به‌کار ببرید.
difficulty: intermediate
estimatedMinutes: 24
objectives:
- ساخت Custom Property در :root
- مصرف متغیر با var()
- تعریف fallback با var()
- ساخت پایه یک Design Token system
concepts:
- custom properties
- var()
- fallback
- tokens
- :root
- inheritance
prerequisites:
- 02-css/13-animation
relatedLessons:
- 02-css/15-fluid-values
relatedProjects:
- css-advanced-dashboard
nextLesson: 02-css/15-fluid-values
---

## چرا Custom Properties؟
Custom Property مقدار زنده‌ای است که در CSS نگهداری می‌شود و با `var()` مصرف می‌شود. برخلاف ثابت‌های ساده، این مقدار در Cascade و inheritance رفتار CSS را حفظ می‌کند.

```css
:root {
  --color-primary: #2563eb;
  --space-4: 1rem;
  --radius: 12px;
}

.button {
  padding: var(--space-4);
  background: var(--color-primary);
  border-radius: var(--radius);
}
```

## Fallback
اگر متغیر تعریف نشده باشد می‌توانید مقدار جایگزین بدهید:

```css
color: var(--color-text, #111827);
```

## Tokenها
رنگ، فاصله، اندازه متن، radius و shadow را به Token تبدیل کنید تا تغییر سیستم طراحی در یک نقطه انجام شود.

## نکته مهم
Custom Property فقط «متغیر محلی» نیست؛ در DOM و Cascade قابل override است. همین ویژگی برای theme بسیار مفید است.

```css
[data-theme="dark"] {
  --color-bg: #0f172a;
  --color-text: #f8fafc;
}
```

### اشتباهات رایج
- تعریف Tokenهای زیاد بدون نام‌گذاری منظم
- hard-code کردن رنگ و فاصله در همه کامپوننت‌ها
- فراموش کردن fallback برای Tokenهایی که ممکن است unset باشند

## Custom Properties فقط «متغیر رنگ» نیستند

Custom Property بخشی از CSS runtime است و می‌تواند در cascade و inheritance شرکت کند:

```css
:root {
  --color-primary: #2563eb;
  --space-4: 1rem;
  --radius-md: .75rem;
}
.button {
  padding: var(--space-4);
  background: var(--color-primary);
  border-radius: var(--radius-md);
}
```

## Fallback

```css
color: var(--text-color, #222);
```

اگر `--text-color` مقدار معتبر نداشته باشد، fallback استفاده می‌شود. این موضوع در componentهای قابل‌استفاده مجدد مهم است.

## Tokenهای primitive و semantic

یک سیستم بهتر دو سطح دارد:

```css
:root {
  --blue-600: #2563eb; /* primitive */
  --gray-900: #0f172a;
  --color-action: var(--blue-600); /* semantic */
  --color-text: var(--gray-900);
}
```

اگر برند تغییر کند، می‌توان semantic tokenها را به primitiveهای جدید متصل کرد بدون اینکه همه‌ی componentها بازنویسی شوند.

## Theme با تغییر token

```css
:root {
  --surface: #fff;
  --text: #111;
}
[data-theme="dark"] {
  --surface: #111;
  --text: #fff;
}
```

Component نباید بداند dark mode چگونه پیاده شده؛ فقط باید از token استفاده کند.

## خطای مهم: undefined token

اگر `var(--gap)` تعریف نشده باشد، property ممکن است invalid شود. DevTools را برای Computed Value بررسی کنید. برای tokenهای حیاتی fallback مناسب یا validation در فرایند توسعه در نظر بگیرید.

### چک‌لیست تسلط

- فرق primitive token و semantic token را می‌دانم.
- می‌توانم theme را با تغییر tokenها بسازم.
- fallback و inheritance را در Custom Property تحلیل می‌کنم.

