# CSS Medium Vertical Slice — گزارش پیاده‌سازی

## مبنای محتوا
این مرحله مستقیماً بر اساس `Frontend-Ch03-CSS.pdf` پیاده‌سازی شده و ترتیب مباحث PDF حفظ شده است.

## مباحث اضافه‌شده
- ۳.۶ Background
- ۳.۷ فونت و متن
- ۳.۸ display
- ۳.۹ Position، Overflow و z-index
- ۳.۱۰ Flexbox
- ۳.۱۱ Grid
- ۳.۱۲ Responsive و Media Query
- ۳.۱۳ Transition، Transform و Animation

## خروجی آموزشی هر درس
هر درس دارای:
- frontmatter و metadata
- objectives و concepts
- prerequisites و navigation
- محتوای آموزشی فارسی
- Playground
- Exercise
- Quiz

## پروژه
### Skill Project — Landing Page ریسپانسیو
پروژه متوسط فصل CSS با سه milestone:
1. سیستم بصری و تایپوگرافی
2. Position، Flexbox و Grid
3. Responsive و Motion

## Journey فروشگاه
Milestone مربوط به CSS در `journey-ecommerce.json` با درس‌های CSS متوسط تا Animation و مهارت‌های مرتبط به‌روزرسانی شد.

## اصلاح ساختاری
فایل قدیمی و تکراری `04-box-model.*` حذف شد تا ترتیب واقعی فصل با `04-units` و `05-box-model` منطبق بماند.

## QA
- `node scripts/validate-content.mjs` → **Content validation passed. 0 warning(s).**
- Typecheck و production build در محیط ابزار اجرا نشدند چون `node_modules` نصب‌شده در این workspace وجود ندارد.
- نسخه‌ای که قبلاً روی سیستم شما تست شده بود، typecheck و build موفق داشت؛ بعد از جایگزینی این نسخه، این سه دستور را اجرا کنید:
  - `npm run typecheck`
  - `npm run content:validate`
  - `npm run build`

## نکته
درس‌های بعدی PDF از ۳.۱۴ شروع می‌شوند: CSS Variables، سپس `calc/min/max/clamp`، Cascade/Specificity/Inheritance، Selectorهای پیشرفته، Stacking، Flex/Grid پیشرفته، Container Queries، معماری CSS، Accessibility/Performance، Modern CSS و Design Tokens.
