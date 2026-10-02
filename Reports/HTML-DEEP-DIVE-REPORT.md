# HTML Deep Dive — گزارش تکمیل مباحث قبلی

## هدف

این نسخه به‌جای اضافه‌کردن مبحث جدید، ۹ درس موجود HTML را عمیق‌تر می‌کند تا از سطح معرفی به سطح یادگیری عملی برسند.

## مبنای محتوا

ساختار و اولویت‌بندی بر اساس جزوه‌ی `Frontend-Ch02-HTML` انجام شده است؛ به‌خصوص بخش‌های سند HTML، عناصر و attributes، متن و لیست‌ها، لینک و تصویر، Semantic HTML، فرم و Validation، جدول، Media، Accessibility و SEO.

## درس‌های تکمیل‌شده

1. HTML و ساختار سند — DOM، DOCTYPE، head/body، lang/dir، DevTools
2. Element/Tag/Attribute — void elements، nesting، Boolean attributes، id/class و debugging
3. Text و Lists — heading hierarchy، whitespace، semantic text، code/pre، entities و nested lists
4. Links و Images — relative/absolute URL، fragment، target، alt، figure، srcset، sizes، picture و lazy loading
5. Semantic HTML — landmarks، main/article/section/aside، time، nav و طراحی ساختار قبل از CSS
6. Tables — caption، thead/tbody/tfoot، th، scope، colspan/rowspan و responsive strategy
7. Forms — id/name/label، GET/POST، input types، fieldset/legend، autocomplete، validation و امنیت validation
8. Media/Embed — audio/video، source، track/captions، iframe، sandbox، responsive images و layout shift
9. Accessibility/SEO — native HTML، keyboard، tabindex، skip link، ARIA، headings، alt، metadata و performance پایه

## Practice chain

برای تمام ۹ درس:

- Quiz چندسؤالی
- Exercise قابل اجرا
- Playground

و برای مباحث کلیدی challenge اضافه شده است:

- ساخت سند استاندارد
- HTML Debugging Lab
- صفحه مقاله با رسانه بهینه
- Semantic Page Architecture
- فرم ثبت‌نام بدون JavaScript
- HTML Accessibility Audit

## پروژه

پروژه‌ی `html-foundations-site` از ۳ مرحله به ۴ مرحله ارتقا یافته است:

1. ساختار و محتوا
2. Semantic و داده
3. فرم و Validation
4. Accessibility و Media

## QA

- Content Validator: PASS — 0 warning
- JSON parsing: PASS
- Frontmatter/YAML: توسط validator بدون خطا پردازش شد
- Build/Typecheck: در این محیط اجرا نشده؛ `node_modules` این محیط موجود نیست

## نتیجه

HTML مقدماتی/متوسط/پیشرفته فعلی دیگر صرفاً فهرست تگ‌ها نیست؛ دانش‌آموز باید بتواند ساختار سند را طراحی کند، HTML را debug کند، فرم و جدول واقعی بسازد، semantic decisions بگیرد و accessibility را از خود HTML شروع کند.
