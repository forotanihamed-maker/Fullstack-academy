# CSS Foundations Deep Dive — Report

## هدف
تکمیل مباحث قبلی CSS که در نسخه‌های اولیه بیشتر حالت معرفی داشتند، بدون افزودن فصل جدید.

## درس‌های عمیق‌شده
- 03 — رنگ‌ها در CSS
- 04 — واحدها در CSS
- 06 — Background
- 07 — Font و Text
- 08 — Display

## عمق اضافه‌شده
### رنگ‌ها
- تفاوت alpha و opacity
- palette نقش‌محور
- stateهای hover/focus
- دیباگ رنگ با Styles و Computed
- تمرین دیباگ contrast
- معیار تسلط

### واحدها
- مفهوم مرجع اندازه‌گیری
- دام‌های em تو در تو
- ترکیب واحدها با min/max/clamp/calc
- مشکل احتمالی 100vw
- انتخاب واحد بر اساس Typography/Spacing/Layout
- تست با DevTools و تغییر اندازه فونت

### Background
- چند background و ترتیب لایه‌ها
- تفاوت background-image و img
- overlay بدون شفاف کردن متن
- cover/contain و trade-off آن‌ها
- performance تصاویر
- دیباگ Hero واکنش‌گرا

### Font/Text
- font stack و fallback
- مدیریت weightها و performance فونت
- line-height برای فارسی
- typography scale
- text-align و RTL
- wrapping و overflow متن
- fluid typography با clamp
- دیباگ مقاله واکنش‌گرا

### Display
- formatting context
- رفتار دقیق block/inline/inline-block
- تفاوت روش‌های hiding
- flow-root
- دلیل استفاده از Flex/Grid برای layout
- مسیر دیباگ با DevTools
- تمرین مقایسه inline-block و Flexbox

## Quiz
Quizهای این پنج درس نیز گسترش داده شدند تا مفاهیم جدید فقط خواندنی نباشند.

## QA
- Project content validator: PASS — 0 warning
- YAML/frontmatter parse: PASS — 46 files
- JSON parse: PASS — 130 files
- هیچ ادعایی درباره typecheck/build این نسخه در محیط توسعه داده نشده است؛ چون node_modules در محیط بسته‌بندی موجود نیست.
