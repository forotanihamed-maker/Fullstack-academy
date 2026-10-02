---
title: display و رفتار جعبه‌ها
description: تفاوت block، inline، inline-block و none را بفهمید و نمایش عناصر را آگاهانه تغییر دهید.
difficulty: intermediate
estimatedMinutes: 36
objectives:
  - تشخیص رفتار block و inline
  - استفاده از inline-block
  - شناخت display:none و visibility:hidden
  - درک اینکه width و margin عمودی روی inline چگونه رفتار می‌کنند
concepts:
  - display
  - block
  - inline
  - inline-block
  - none
  - visibility
  - flow-root
prerequisites:
  - 02-css/07-font-text
relatedLessons:
  - 02-css/09-position
relatedProjects:
  - css-responsive-landing
nextLesson: 02-css/09-position
---

## Display رفتار عنصر را تغییر می‌دهد

```css
.card { display: block; }
.badge { display: inline; }
.button { display: inline-block; }
```

- `block`: معمولاً خط جدید می‌گیرد و می‌تواند width/height داشته باشد.
- `inline`: در جریان متن می‌ماند؛ width و height معمولاً مثل یک جعبه block عمل نمی‌کنند.
- `inline-block`: کنار متن/عناصر inline می‌ماند ولی ویژگی‌های جعبه‌ای بیشتری می‌گیرد.

## مخفی کردن

`display: none` عنصر را از layout حذف می‌کند. `visibility: hidden` فضای عنصر را نگه می‌دارد ولی آن را قابل مشاهده نمی‌کند. این دو را با visually-hidden که برای دسترس‌پذیری طراحی می‌شود یکی نگیرید.

## نکته

برای layout پیچیده از `display: flex` و `display: grid` استفاده خواهیم کرد؛ `display` فقط «مخفی/نمایش» نیست، بلکه نوع formatting context را نیز تعیین می‌کند.

## خطای رایج

```css
span { width: 200px; margin-top: 30px; }
```

اگر `span` inline باشد، انتظار رفتار block از width و margin عمودی نداشته باشید. در صورت نیاز از `inline-block` یا ساختار مناسب استفاده کنید.

## Formatting Context را جدی بگیرید

`display` فقط انتخاب بین «نمایش» و «عدم نمایش» نیست. مقدار آن تعیین می‌کند عنصر و فرزندانش چگونه وارد layout شوند. درک این موضوع پایه‌ی ورود به Flexbox و Grid است.

```css
.box { display: block; }
.inline { display: inline; }
.component { display: inline-block; }
.layout { display: flex; }
.dashboard { display: grid; }
```

## Block و Inline در عمل

یک block معمولاً از خط جدید شروع می‌شود و فضای موجود در محور inline را می‌گیرد. یک inline در جریان متن باقی می‌ماند و width/height آن مثل block رفتار نمی‌کند. به همین دلیل این کد ممکن است برخلاف انتظار باشد:

```css
a {
  width: 240px;
  margin-top: 24px;
}
```

اگر لینک inline باشد، برای گرفتن رفتار جعبه‌ای قابل پیش‌بینی می‌توان از `inline-block` استفاده کرد؛ اما اگر هدف layout چندعنصری است، بهتر است container مناسب بسازید.

## margin عمودی و Inline

اشتباه رایج این است که فکر کنیم همه‌ی marginها روی inline دقیقاً مثل block عمل می‌کنند. در layout واقعی، قبل از تغییر margin بررسی کنید عنصر چه displayی دارد و آیا راه‌حل ساختاری‌تری مثل `gap` در container وجود دارد.

## display:none، visibility و visually-hidden

سه مفهوم را جدا نگه دارید:

- `display: none`: عنصر در layout وجود ندارد.
- `visibility: hidden`: فضا حفظ می‌شود ولی عنصر قابل مشاهده نیست.
- visually-hidden: الگوی مخصوص محتوایی که برای فناوری کمکی باید قابل دسترس بماند ولی به‌صورت بصری دیده نشود.

این‌ها جایگزین یکدیگر نیستند و انتخاب باید بر اساس هدف UI باشد.

## flow-root

`display: flow-root` یک formatting context جدید می‌سازد و می‌تواند در سناریوهایی که محتوای floatشده دارید برای کنترل جریان مفید باشد:

```css
.card { display: flow-root; }
```

در پروژه‌های مدرن کمتر از float برای layout استفاده می‌کنیم، اما شناخت flow-root به فهم formatting context کمک می‌کند.

## چرا برای layout از Flex/Grid استفاده می‌کنیم؟

`inline-block` و marginهای دستی برای چند عنصر ساده قابل استفاده‌اند، اما با افزایش حالت‌های responsive نگهداری سخت می‌شود. Flexbox برای layout یک‌بعدی و Grid برای layout دوبعدی ابزارهای مناسب‌تری هستند. بنابراین `display` را باید به‌عنوان ورودی سیستم layout ببینید، نه صرفاً یک property تزئینی.

## DevTools: چه چیزی را بررسی کنیم؟

وقتی یک عنصر «کنار عنصر دیگر قرار نمی‌گیرد»، ابتدا `display` واقعی آن و والدش را در Computed بررسی کنید. بعد به margin، width و formatting context بروید. تغییر تصادفی `position` یا `float` معمولاً مشکل را پنهان می‌کند، نه اینکه علت را حل کند.

### تمرین دیباگ

```html
<nav>
  <a class="item">خانه</a>
  <a class="item">دوره‌ها</a>
  <a class="item">پروفایل</a>
</nav>
```

```css
.item {
  width: 160px;
  margin-top: 20px;
}
```

چرا نتیجه احتمالاً آن چیزی نیست که انتظار دارید؟ دو راه‌حل ارائه کنید: یکی با `inline-block` و دیگری با Flexbox. سپس تفاوت نگهداری آن‌ها را توضیح دهید.

## معیار تسلط

باید بتوانید رفتار block/inline/inline-block را پیش‌بینی کنید، تفاوت روش‌های hiding را توضیح دهید و قبل از استفاده از position یا hackهای layout، formatting context مناسب را انتخاب کنید.
