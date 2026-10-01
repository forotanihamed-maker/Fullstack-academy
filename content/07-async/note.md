---
title: Asynchronous JavaScript
---

## هم‌زمان و ناهم‌زمان

کد **هم‌زمان** (Synchronous) خط‌به‌خط اجرا می‌شود. کار **ناهم‌زمان** (Asynchronous) مثل دریافت داده از سرور زمان می‌برد و نباید صفحه را قفل کند.

## Callback

```js
setTimeout(() => console.log("بعد از ۱ ثانیه"), 1000);
```

وقتی چند کار پشت‌سرهم باشند، callbackهای تودرتو خوانایی را خراب می‌کنند (**Callback Hell**).

## Promise

Promise آبجکتی است که نتیجه‌ی یک کار آینده را نمایندگی می‌کند و سه حالت دارد: `pending`، `fulfilled`، `rejected`.

```js
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

wait(1000)
  .then(() => console.log("تمام شد"))
  .catch((err) => console.error(err))
  .finally(() => console.log("همیشه اجرا می‌شود"));
```

با **Promise Chaining** می‌توان `then`ها را زنجیر کرد؛ مقدار برگشتی هر `then` به بعدی می‌رسد.

## async / await

```js
async function loadUser() {
  try {
    const res = await fetch("https://api.example.com/user");
    if (!res.ok) throw new Error("خطای سرور: " + res.status);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}
```

`await` فقط داخل تابع `async` کار می‌کند و اجرای همان تابع را تا آماده‌شدن نتیجه نگه می‌دارد.

## ترتیبی یا موازی؟

```js
// ترتیبی: ۲ ثانیه
const a = await wait(1000);
const b = await wait(1000);

// موازی: ۱ ثانیه
const [x, y] = await Promise.all([wait(1000), wait(1000)]);
```

| متد | رفتار |
|---|---|
| `Promise.all` | منتظر همه؛ اگر یکی رد شود، کل رد می‌شود |
| `Promise.allSettled` | منتظر همه؛ نتیجه‌ی موفق و ناموفق هر کدام را می‌دهد |
| `Promise.race` | نتیجه‌ی اولین Promise که تمام شود |
| `Promise.any` | اولین Promise موفق |

مطالعه بیشتر: [MDN – JavaScript ناهم‌زمان](https://developer.mozilla.org/fa/docs/Learn/JavaScript/Asynchronous)
