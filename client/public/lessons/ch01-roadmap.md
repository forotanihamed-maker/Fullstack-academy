# فصل ۱: نقشه راه Front-End

## جزوه جامع Front-End: HTML، CSS و JavaScript

| فصل | عنوان |
|-----|-------|
| ۱ | نقشه راه Front-End |
| ۲ | HTML (مقدماتی، متوسط، پیشرفته) |
| ۳ | CSS (مقدماتی، متوسط، پیشرفته) |
| ۴ | JavaScript (مقدماتی، متوسط، پیشرفته) |
| ۵ | DOM |
| ۶ | Browser APIs |
| ۷ | Modern JavaScript (ES6+) |
| ۸ | Asynchronous JavaScript |
| ۹ | Promise |
| ۱۰ | Async/Await |
| ۱۱ | Fetch |
| ۱۲ | API (و معماری پروژه‌های مبتنی بر API) |
| ۱۳ | Error Handling |
| ۱۴ | JavaScript Modules |
| ۱۵ | Code Organization |
| ۱۶ | Debugging |
| ۱۷ | Performance Basics |
| ۱۸ | Accessibility |
| ۱۹ | Security Basics |
| ۲۰ | پروژه‌های جمع‌بندی |
| ۲۱ | چک‌لیست نهایی Front-End |

---

## ۱.۱ Front-End یعنی چه؟

Front-End هر چیزی است که کاربر در مرورگر می‌بیند و با آن تعامل می‌کند: دکمه‌ها، فرم‌ها، منوها، انیمیشن‌ها، لیست محصولات و غیره. در مقابل، Back-End بخشی است که روی سرور اجرا می‌شود (دیتابیس، احراز هویت، منطق کسب‌وکار).

> **ارتباط با فصل‌های بعد:** در فصل‌های ۱۱ و ۱۲ (Fetch و API) می‌بینی که Front-End چطور با Back-End صحبت می‌کند. تا آن موقع روی سمت مرورگر تمرکز داریم.

---

## ۱.۲ سه تکنولوژی، سه وظیفه

یک مثال ساده: ساختمان.

| تکنولوژی | نقش | مثال ساختمان |
|----------|-----|--------------|
| HTML | ساختار و معنای محتوا | اسکلت و اتاق‌ها |
| CSS | ظاهر و چیدمان | رنگ دیوار، دکوراسیون، جانمایی |
| JavaScript | رفتار و منطق | برق، آسانسور، دربازکن خودکار |

نمونه‌ی کوچکی که هر سه را در یک فایل نشان می‌دهد:

```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <title>Three technologies</title>
    <style>
      /* CSS: appearance */
      button { padding: 8px 16px; background: #2563eb; color: white; border: 0;
               border-radius: 6px; }
    </style>
  </head>
  <body>
    <!-- HTML: structure -->
    <h1 id="title">سلام</h1>
    <button id="btn">کلیک کن</button>

    <script>
      // JavaScript: behavior
      document.getElementById("btn").addEventListener("click", () => {
        document.getElementById("title").textContent = "دکمه کلیک شد!";
      });
    </script>
  </body>
</html>
```

**توضیح بخش‌به‌بخش:**

- `<h1>` و `<button>` ساختار صفحه را می‌سازند (HTML).
- بلوک `<style>` ظاهر دکمه را تعیین می‌کند (CSS).
- در `<script>` به دکمه گوش می‌کنیم و با کلیک، متن عنوان را عوض می‌کنیم (JavaScript).

> این مثال فقط برای دیدن تصویر کلی است. هر خط را در فصل‌های بعد دقیق یاد می‌گیری. فعلاً لازم نیست همه‌چیز را بفهمی.

---

## ۱.۳ مرورگر چطور صفحه را نمایش می‌دهد؟

درک این مسیر در فصل‌های DOM، Performance و Event Loop خیلی کمک می‌کند:

```
HTML file --> DOM (object tree)
CSS file  --> CSSOM
                |
DOM + CSSOM --> Render Tree --> Layout --> Paint --> Display
JavaScript --> can modify DOM and CSS, and the cycle repeats
```

> **نکته‌ی کلیدی:** مرورگر HTML را به یک «درخت» به نام DOM تبدیل می‌کند و JavaScript با همین درخت کار می‌کند. وقتی در JS متن یک عنوان را عوض می‌کنی، در واقع یک گره از این درخت را تغییر داده‌ای.

---

## ۱.۴ مسیر یادگیری

```
HTML: Beginner -> Intermediate -> Advanced
        |
CSS: Beginner -> Intermediate -> Advanced
        |
JavaScript: Beginner -> Intermediate (Functions, Arrays, Objects)
        |
DOM -> Forms -> Browser APIs
        |
Advanced JS (Scope, Closure, this, Event Loop)
        |
Modern JS (ES6+) -> Async -> Promise -> Async/Await -> Fetch -> API
        |
Error Handling -> Modules -> Code Organization
        |
Debugging -> Performance -> Accessibility -> Security
        |
Final projects -> Ready for React
```

**چرا این ترتیب؟**

- بدون HTML درست، CSS و JS روی پایه‌ی خراب کار می‌کنند.
- بدون JS مقدماتی (توابع، آرایه، آبجکت)، DOM را فقط حفظ می‌کنی و نمی‌فهمی.
- بدون Async و Promise، Fetch و API درست درک نمی‌شوند.
- بدون Modules و تفکیک کد، React برایت گیج‌کننده خواهد بود.

---

## ۱.۵ سه برچسب اهمیت

در کل جزوه هر مبحث یکی از این برچسب‌ها را می‌گیرد:

| برچسب | معنی | چه کنم؟ |
|-------|------|---------|
| `[ضروری]` | بدون آن نمی‌شود پیش رفت | حتماً تسلط پیدا کن |
| `[مفید/حرفه‌ای]` | در کار واقعی زیاد استفاده می‌شود | یاد بگیر، ولی می‌توانی بعد از ضروری‌ها برگردی |
| `[پیشرفته/اختیاری]` | عمق بیشتر یا کاربرد محدودتر | در صورت نیاز یا علاقه |

و برچسب «**خارج از این جزوه**» برای موضوعاتی که به HTML/CSS/JS مربوط‌اند ولی در این جزوه نمی‌گنجند (مثلاً Git، npm، TypeScript، React، فریم‌ورک‌های CSS).

---

## ۱.۶ ابزارهای لازم `[ضروری]`

1. مرورگر مدرن (Chrome، Edge یا Firefox) همراه با DevTools (کلید `F12`).
2. ویرایشگر کد: VS Code انتخاب رایجی است.
3. افزونه‌ی Live Server در VS Code برای دیدن تغییرات بدون Refresh دستی.
4. Git و GitHub: خارج از این جزوه، ولی برای کار حرفه‌ای لازم است.

**ساختار پوشه‌ی تمرین**

```
frontend-notes/
|-- index.html
|-- css/
|   `-- style.css
`-- js/
    `-- main.js
```

و فایل `index.html` پایه:

```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>تمرین</title>
    <link rel="stylesheet" href="css/style.css" />
  </head>
  <body>
    <h1>شروع</h1>
    <script src="js/main.js"></script>
  </body>
</html>
```

---

## ۱.۷ اشتباهات رایج در شروع مسیر

- **ویدیو دیدن بدون کد زدن.** درک واقعی از تمرین می‌آید. هر مبحث را خودت تایپ و اجرا کن.
- **کپی‌کردن کد بدون فهمیدن.** اگر نمی‌توانی یک خط را توضیح بدهی، هنوز آن را یاد نگرفته‌ای.
- **پریدن سریع به React.** React روی JavaScript ساخته شده است. ضعف در Closure، `this`، متدهای Array و Promise در React چند برابر دردسر می‌شود.
- **نادیده‌گرفتن CSS.** بسیاری فکر می‌کنند «CSS ساده است»، ولی Layout درست (Grid/Flexbox) و Responsive مهارت جدی‌ای است.
- **نخواندن خطای Console.** خطاها بهترین معلم‌اند (فصل Debugging).

---

## ۱.۸ مسیر رشد: از Beginner تا آمادگی برای React

| سطح | چه چیزی باید بلد باشی |
|-----|------------------------|
| Beginner | HTML/CSS پایه، JS پایه |
| Junior | DOM، فرم‌ها، پروژه‌های کوچک بدون API |
| Strong Junior | Async، Fetch، API، Modules، Debugging |
| آمادگی برای React | همه موارد بالا + ساختار پروژه + Modern JS |

---

## ۱.۹ تمرین‌های فصل ۱

**ساده**

1. پوشه‌ی `frontend-notes` را با ساختار بالا بساز و با Live Server اجرا کن.
2. در `main.js` بنویس `console.log("سلام")` و پیام را در Console مرورگر (`F12`) پیدا کن.

**متوسط**

1. در همان صفحه، یک `<button>` بگذار. با JS کاری کن که با کلیک، متن یک `<h1>` عوض شود. (مثال ۱.۲ را از حفظ دوباره بنویس و فقط در صورت نیاز نگاه کن.)

**چالشی**

1. در تب Elements در DevTools، رنگ پس‌زمینه‌ی `<body>` را زنده تغییر بده. بعد توضیح بده: این تغییر روی فایل ذخیره شد؟ چرا؟

---

## ۱.۱۰ آیا این مبحث را بلدم؟

**سؤالات مفهومی**

1. اگر HTML نباشد و فقط CSS و JS داشته باشیم، چه چیزی از دست می‌رود؟ چرا؟
2. تفاوت Front-End و Back-End را با یک مثال از یک فروشگاه آنلاین توضیح بده.
3. DOM چیست و چرا JavaScript مستقیماً با «فایل HTML» کار نمی‌کند، بلکه با DOM کار می‌کند؟
4. چرا یاد گرفتن Promise قبل از Fetch منطقی‌تر است؟

**تمرین کوتاه**

5. کد زیر را بخوان و بدون اجرا بگو خروجی Console چیست. بعد اجرا کن و مقایسه کن:

```html
<h1 id="t">الف</h1>
<script>
  console.log(document.getElementById("t").textContent);
  document.getElementById("t").textContent = "ب";
  console.log(document.getElementById("t").textContent);
</script>
```

6. اگر تگ `<script>` را قبل از `<h1>` بگذاریم چه اتفاقی می‌افتد؟ حدس بزن، بعد امتحان کن. (جواب کامل در فصل‌های DOM و HTML پیشرفته می‌آید.)

---

## ۱.۱۱ پروژه‌ی پایان فصل

### پروژه: «صفحه معرفی من»

- **هدف:** تنظیم محیط و تمرین اولین ترکیب HTML+CSS+JS.
- **امکانات:** یک صفحه با نام و معرفی کوتاه، و یک دکمه که با کلیک متن معرفی را عوض می‌کند.
- **مهارت‌ها:** ساختار فایل‌ها، لینک کردن CSS و JS، Live Server.
- **محدودیت‌ها:** بدون فریم‌ورک و کتابخانه؛ CSS و JS در فایل جداگانه.
- **معیار قبولی:** صفحه بدون خطا در Console باز شود، دکمه کار کند، و سه فایل جدا داشته باشی.
