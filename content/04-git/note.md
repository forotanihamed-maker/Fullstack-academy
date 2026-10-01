---
title: Git و GitHub
---

**Git** سیستمی است که تاریخچه‌ی تغییرات پروژه را نگه می‌دارد. **GitHub** سرویسی آنلاین است که پروژه‌های Git را روی اینترنت ذخیره و به اشتراک می‌گذارد.

## مفاهیم اصلی

- **Repository (مخزن):** پوشه‌ی پروژه همراه با تاریخچه‌اش.
- **Commit:** یک «عکس فوری» از وضعیت پروژه، با یک پیام توضیحی.
- **Branch (شاخه):** مسیری جدا برای کار روی یک قابلیت، بدون تأثیر روی شاخه‌ی اصلی.
- **Merge:** ترکیب تغییرات یک شاخه با شاخه‌ی دیگر.

## دستورهای پایه

```bash
git init                      # ساخت مخزن جدید
git status                    # دیدن وضعیت فایل‌ها
git add .                     # آماده‌کردن همه‌ی تغییرات برای commit
git commit -m "first commit"  # ثبت تغییرات
git log --oneline             # دیدن تاریخچه

git switch -c feature-login   # ساخت و رفتن به شاخه‌ی جدید
git switch main               # برگشت به شاخه‌ی اصلی
git merge feature-login       # ترکیب شاخه‌ی جدید با main
```

## کار با GitHub

```bash
git clone https://github.com/user/repo.git   # دریافت یک پروژه
git remote add origin https://github.com/user/repo.git
git push -u origin main                      # ارسال تغییرات به GitHub
git pull                                     # دریافت تغییرات جدید
```

## فایل .gitignore

فایل‌هایی که نباید وارد Git شوند (مثل `node_modules`، `.next` و فایل‌های رمز و کلید `.env`) را در `.gitignore` می‌نویسیم، هر کدام در یک خط.

## Pull Request

وقتی روی یک شاخه کار می‌کنید، با **Pull Request** از بقیه می‌خواهید تغییراتتان را بررسی کنند و بعد در شاخه‌ی اصلی ادغام شود.

مطالعه بیشتر: [کتاب رایگان Pro Git](https://git-scm.com/book/fa/v2)
