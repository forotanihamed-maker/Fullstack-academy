# سایت آموزشی فول استک (فاز ۱: طراحی و ساختار)

اجرا (دو ترمینال جدا):

    cd server && npm install && npm start      # http://localhost:4000
    cd client && npm install && npm run dev    # http://localhost:5173

ساختار: server/curriculum.js فهرست ۱۹ مرحله را نگه می‌دارد و client صفحه‌ها، ادیتور و تمرین‌های تست‌دار را دارد.
برای افزودن تمرین، به client/src/exercises.js نگاه کن.

## تمرین‌ها

هر تمرین می‌تواند یکی از سه حالت را داشته باشد:

- `runner: "html"` (پیش‌فرض): کد خام در iframe اجرا می‌شود؛ مناسب HTML و CSS. تست‌ها DOM خروجی را می‌گیرند.
- `runner: "react"`: کد JSX با Babel به جاوااسکریپت تبدیل و با React رندر می‌شود. تست‌ها روی DOM رندرشده اجرا می‌شوند و آرگومان دوم آن‌ها `{ code }` است تا در صورت نیاز کد منبع هم بررسی شود.
- `runner: "js"`: کد در یک Function جداگانه اجرا می‌شود. نام توابعی که باید به تست‌ها برسند در `exports` می‌آید (مثل `exports: ["sum"]`) و تست با `r.values.sum(...)` به آن‌ها دسترسی دارد. تست‌ها می‌توانند async باشند. `fetch` با `fetchMock` ماک می‌شود.
- `runner: "js-dom"`: کد JavaScript داخل iframe و با دسترسی به DOM اجرا می‌شود. HTML پایه در فیلد `html` قرار می‌گیرد و تست‌ها `(document, { code, logs })` را می‌گیرند.
- `runner: "code"`: برای تمرین‌های متنی/مفهومی؛ کد فقط نمایش داده می‌شود و تست‌ها متن آن را می‌خوانند.

تست‌ها به‌ترتیب اجرا می‌شوند و هر کدام حداکثر ۴ ثانیه فرصت دارند.

Babel و رندر React به‌صورت chunk جداگانه و فقط هنگام اولین اجرای یک تمرین React بارگذاری می‌شوند.

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
