# سایت آموزشی فول استک (فاز ۱: طراحی و ساختار)

اجرا (دو ترمینال جدا):

    cd server && npm install && npm start      # http://localhost:4000
    cd client && npm install && npm run dev    # http://localhost:5173

ساختار: server/curriculum.js فهرست ۱۹ مرحله را نگه می‌دارد و client صفحه‌ها، ادیتور و تمرین‌های تست‌دار را دارد.
برای افزودن تمرین، به client/src/exercises.js نگاه کن.

## استقرار روی Vercel

پروژه به‌صورت monorepo روی یک پروژه‌ی Vercel اجرا می‌شود؛ تنظیمات در `vercel.json` است.

تنظیمات Import در داشبورد Vercel:

    Root Directory:      .            (ریشه‌ی ریپو، نه client)
    Framework Preset:    Other
    Build Command:       خالی بگذارید (از vercel.json خوانده می‌شود)
    Output Directory:    خالی بگذارید (از vercel.json خوانده می‌شود)

نقشه‌ی مسیرها:

    client/ + vite                →  فایل‌های استاتیک (خروجی client/dist)
    api/stages.js                 →  GET /api/stages
    api/stages/[slug].js          →  GET /api/stages/:slug
    هر مسیر دیگر                  →  index.html (برای BrowserRouter)

فایل `server/index.js` (Express) فقط برای اجرای محلی است و روی Vercel استفاده نمی‌شود؛
نسخه‌ی Serverless همان API در پوشه‌ی `api/` قرار دارد و از همان `server/curriculum.js` می‌خواند.
پس برای افزودن مرحله فقط `server/curriculum.js` را ویرایش کنید.
