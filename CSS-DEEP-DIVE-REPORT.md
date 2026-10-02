# CSS Deep Dive — گزارش نهایی

## هدف
این نسخه بر اساس ساختار و موضوعات جزوه‌ی `Frontend-Ch03-CSS.pdf` عمیق‌تر شده است. هدف این تغییر، زیاد کردن صرفِ تعداد درس‌ها نیست؛ مباحث مهم باید مدل ذهنی، مثال واقعی، دیباگ، تمرین و سنجش داشته باشند.

## چه چیزهایی عمیق‌تر شد؟

### مباحث پایه‌ی مهم
- Selectors
- Box Model
- Typography

### مباحث layout و responsive
- Position / Overflow / z-index
- Flexbox
- Grid
- Responsive / Media Query
- Animation / Transition / Transform

### مباحث حرفه‌ای
- Custom Properties / Design Tokens
- Fluid values: calc / min / max / clamp
- Cascade / Specificity / Inheritance
- Advanced Selectors
- Stacking Context
- Advanced Flexbox / Grid
- Container Query
- CSS Architecture / BEM / Reset / Nesting
- Accessibility / Performance
- Modern CSS
- Logical Properties / RTL
- Real UI / Design Tokens

## نوع عمق اضافه‌شده
در درس‌های کلیدی، علاوه بر محتوای قبلی، موارد زیر اضافه شده است:

- مدل ذهنی و روش انتخاب ابزار
- مثال‌های واقعی‌تر
- بخش Debugging و workflow با DevTools
- خطاهای رایج و روش ریشه‌یابی
- چک‌لیست تسلط
- مثال‌های مربوط به RTL/LTR
- نکات responsive در 320/768/1440
- ارتباط بین مفاهیم؛ مثل Flex + min-width:0، Grid + minmax، Cascade + DevTools و z-index + stacking context

## Quiz
Quizهای مباحث مهم توسعه داده شدند؛ درس‌های کلیدی اکنون معمولاً 5 سؤال یا بیشتر دارند و سؤال‌ها فقط syntax نیستند و شامل تحلیل رفتار CSS نیز می‌شوند.

## Challengeهای جدید
- `css-ch-002`: Flexbox debugging
- `css-ch-003`: Dashboard با CSS Grid
- `css-ch-004`: Responsive Audit
- `css-ch-005`: Cascade debugging
- `css-ch-006`: Accessibility CSS Audit

## پروژه
پروژه‌ی `css-advanced-dashboard` با معیارهای عمیق‌تر تکمیل شد:
- min-width: 0 و overflow debugging
- Grid auto-fit/minmax
- stacking context و z-index tokens
- keyboard / zoom / reduced-motion QA
- RTL/LTR test

Journey Project فروشگاه نیز همین مهارت‌های عمیق‌تر را در milestone مربوط به CSS دنبال می‌کند.

## QA
- YAML frontmatter: **0 error**
- JSON parse: **0 error**
- `node scripts/validate-content.mjs`: **PASS — 0 warning**
- stale `lib/content.js`: **none**
- stale `lib/projects.js`: **none**
- stale `lib/prisma.js`: **none**

## Build / Typecheck
در محیط بسته‌بندی این نسخه `node_modules` نصب نیست؛ بنابراین `npm run typecheck` و `npm run build` را ادعای موفقیت نمی‌کنیم.

نسخه‌ی قبلی که کاربر روی سیستم خودش اجرا کرده بود، typecheck و build را با موفقیت گذرانده بود. برای این نسخه، بعد از جایگزینی فایل‌ها اجرای محلی زیر توصیه می‌شود:

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item lib\content.js -Force -ErrorAction SilentlyContinue
Remove-Item lib\projects.js -Force -ErrorAction SilentlyContinue

npm run typecheck
npm run content:validate
npm run build
```

## نتیجه
این نسخه هنوز «تمام CSS دنیا» نیست و عمداً مباحثی مثل Sass/Tailwind را وارد فصل نکرده است؛ اما برای مباحث اصلی این فصل، از معرفی سطحی به یک مسیر آموزشی چندلایه نزدیک‌تر شده است: مفهوم → مثال → DevTools → تمرین → دیباگ → Quiz → Challenge → Project.
