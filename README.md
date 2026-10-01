# آکادمی فول‌استک TypeScript

پلتفرم آموزشی مبتنی بر Next.js، TypeScript و PostgreSQL؛ شامل جزوه‌های Markdown، کوییز و playground تمرین.

## راه‌اندازی
1. `npm install`
2. فایل `.env.example` را به `.env` کپی و `DATABASE_URL` را تنظیم کنید.
3. `npx prisma generate`
4. `npx prisma migrate dev --name init`
5. `npm run dev` و سپس `http://localhost:3000`

ثبت‌نام از مسیر `/register` و API آن `POST /api/auth/register` است. رمز عبور با bcrypt هش می‌شود و فقط هش در دیتابیس ذخیره می‌شود.

## افزودن درس
فایل‌های Markdown، quiz.json، exercise.json و playground.json را مطابق ساختار پوشه‌های `content` اضافه کنید. فهرست بخش‌ها در `content/sections.json` است.

## نکته امنیتی
در حال حاضر ثبت‌نام پیاده‌سازی شده؛ ورود، نشست امن، تأیید ایمیل و بازیابی رمز عبور هنوز باید جداگانه افزوده شوند. اجرای کد تمرین باید در محیط ایزوله باقی بماند.
