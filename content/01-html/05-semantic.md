---
title: HTML معنایی (Semantic HTML)
description: ساختار صفحه را با header، nav، main، section، article، aside و footer معنا‌دار می‌کنید.
difficulty: beginner
estimatedMinutes: 22
objectives: ["تشخیص عناصر semantic", "ساخت layout معنایی", "ارتباط semantic HTML با accessibility و SEO"]
concepts: ["header", "nav", "main", "section", "article", "aside", "footer", "accessibility", "SEO"]
prerequisites: ["01-html/04-links-images"]
relatedLessons: ["01-html/04-links-images"]
relatedProjects: ["html-foundations-site"]
nextLesson: 06-tables
---

تا اینجا برای هر چیزی می‌شد از `<div>` استفاده کرد، ولی `<div>` هیچ معنایی ندارد. **HTML معنایی** یعنی هر بخش از صفحه را با تگی بنویسیم که **نقش آن بخش را بیان می‌کند**. این کار سه فایده‌ی بزرگ دارد:

1. **دسترس‌پذیری:** صفحه‌خوان‌ها (برای نابینایان) می‌توانند مستقیم به «منوی اصلی» یا «محتوای اصلی» بپرند.
2. **SEO:** موتورهای جستجو ساختار صفحه را بهتر می‌فهمند.
3. **خوانایی کد:** خودتان و هم‌تیمی‌هایتان راحت‌تر کد را می‌خوانید.

## تگ‌های ساختاری اصلی

| تگ | نقش |
|---|---|
| `<header>` | سربرگ صفحه یا یک بخش (لوگو، عنوان، گاهی منو) |
| `<nav>` | بلوک لینک‌های ناوبری اصلی |
| `<main>` | محتوای اصلی صفحه؛ **فقط یک‌بار** در هر صفحه |
| `<section>` | بخشی موضوعی از محتوا، معمولاً با یک عنوان |
| `<article>` | محتوایی مستقل که بیرون از صفحه هم معنا دارد (پست وبلاگ، خبر) |
| `<aside>` | محتوای جانبی (سایدبار، تبلیغ، مطالب مرتبط) |
| `<footer>` | پاورقی صفحه یا یک بخش |

## یک صفحه‌ی کامل

```html
<body>
  <header>
    <h1>وبلاگ برنامه‌نویسی</h1>
    <nav>
      <ul>
        <li><a href="/">خانه</a></li>
        <li><a href="/about">درباره</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <h2>آموزش HTML</h2>
      <p>متن مقاله...</p>
    </article>
    <aside>
      <h2>مطالب مرتبط</h2>
    </aside>
  </main>

  <footer>
    <p>تمام حقوق محفوظ است.</p>
  </footer>
</body>
```

## section یا article یا div؟

- محتوا **مستقل** است و می‌شود جدا منتشرش کرد؟ ← `<article>`
- بخشی از یک موضوع بزرگ‌تر با **عنوان** است؟ ← `<section>`
- فقط برای گروه‌بندی و استایل‌دهی است و **معنایی ندارد**؟ ← `<div>`

`<div>` و `<span>` بد نیستند؛ فقط وقتی استفاده کنید که تگ معنایی مناسبی وجود ندارد.

## اشتباهات رایج

- بیش از یک `<main>` در صفحه.
- استفاده از `<section>` بدون عنوان، فقط برای استایل‌دهی.
- نوشتن منو به‌صورت چند `<div>` و `<span>` به‌جای `<nav>` با `<ul>`.

> 💡 **تمرین:** صفحه‌ی «رزومه‌ی ساده» درس قبل را با تگ‌های معنایی بازنویسی کنید (header برای نام، main برای محتوا، footer برای راه ارتباطی).

مطالعه‌ی بیشتر: [W3Schools – Semantic Elements](https://www.w3schools.com/html/html5_semantic_elements.asp) · [DevDocs – HTML](https://devdocs.io/html/)
