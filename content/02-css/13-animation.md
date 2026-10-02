---
title: Transition، Transform و Animation
description: تغییر حالت نرم و animationهای کوتاه را با توجه به عملکرد و reduced-motion پیاده کنید.
difficulty: intermediate
estimatedMinutes: 28
objectives:
  - ساخت transition برای hover و focus
  - استفاده از transform برای حرکت و scale
  - ساخت keyframes ساده
  - محدود کردن animation به transform و opacity
concepts:
  - transition
  - transform
  - translate
  - scale
  - rotate
  - "@keyframes"
  - animation-duration
  - animation-timing-function
  - animation-iteration-count
  - animation-fill-mode
prerequisites:
  - 02-css/12-responsive
relatedLessons:
  - 02-css/14-variables
relatedProjects:
  - css-responsive-landing
nextLesson: 02-css/14-variables
---

## Transition

`transition` تغییر بین دو حالت را نرم می‌کند:

```css
.btn {
  transition: background-color .2s ease, transform .2s ease;
}
.btn:hover {
  transform: translateY(-2px);
}
```

Transition را روی حالت اصلی بنویسید تا رفت و برگشت هر دو نرم باشند.

## Transform

```css
.box {
  transform: translateY(-4px) scale(1.02);
}
```

Transform ظاهر را جابه‌جا یا تغییر اندازه می‌دهد بدون اینکه جای عنصر در flow مثل تغییر `top` یا `width` دوباره محاسبه شود؛ برای انیمیشن‌های UI معمولاً انتخاب مناسبی است.

## Keyframes

```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.card {
  animation: fade-in-up .5s ease-out both;
}
```

برای حرکت‌های معمول UI، کوتاه و ظریف بودن بهتر از animationهای طولانی و پرزرق‌وبرق است.

## عملکرد و دسترس‌پذیری

تا حد امکان `transform` و `opacity` را انیمیت کنید و به `prefers-reduced-motion` احترام بگذارید:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
```

## Transition، Transform و Animation چه تفاوتی دارند؟

- `transition`: تغییر property بین دو state را نرم می‌کند.
- `transform`: خود عنصر را جابه‌جا/چرخانده/scale می‌کند.
- `animation`: با `@keyframes` چند مرحله‌ی زمان‌بندی‌شده می‌سازد.

```css
.button {
  transition: transform .2s ease, background-color .2s ease;
}
.button:hover {
  transform: translateY(-2px);
}
```

## چرا transform و opacity؟

برای animationهای رابط کاربری، تغییر `transform` و `opacity` معمولاً انتخاب بهتری است؛ از تغییر مداوم layout properties مثل `width`, `height`, `top`, `left` برای motionهای ساده پرهیز کنید مگر دلیل مشخصی داشته باشید.

## Keyframes را معنادار بنویسید

```css
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(.75rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

برای animationهای UI کوتاه، duration، timing function و fill mode را مشخص و هدفمند انتخاب کنید. animation بی‌دلیلِ دائمی می‌تواند حواس‌پرت‌کننده باشد.

## Reduced Motion یک قابلیت اختیاری نیست

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

همه‌ی motionها را صرفاً حذف نکنید اگر اطلاعات مهمی را منتقل می‌کنند؛ هدف کاهش حرکت غیرضروری و حفظ usability است.

## Debugging Animation

اگر animation اجرا نمی‌شود:

1. نام `animation-name` با `@keyframes` یکی است؟
2. duration صفر یا `display: none` نیست؟
3. property واقعاً قابل animation است؟
4. reduced-motion سیستم فعال است؟
5. rule در DevTools خط نخورده است؟

### چک‌لیست تسلط

- transition و animation را از هم تشخیص می‌دهم.
- motion را با transform/opacity طراحی می‌کنم.
- reduced-motion را تست می‌کنم.
- می‌توانم animation اجرا نشدن را با DevTools پیدا کنم.

