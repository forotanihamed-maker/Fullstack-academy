# جاوااسکریپت — فصل ۵: Asynchronous JavaScript و Promise

> **مرحله ۵ از مسیر فول‌استک — Async JavaScript**  
> مباحث این فصل: setTimeout، Callback، Callback Hell، Promise، Chaining، `Promise.all` / `allSettled` / `race` / `any`، `async` / `await`، Error Handling، Sequential و Parallel  
> پیش‌نیاز: فصل ۴ (Closure، Call Stack، Event Loop)  
> زمان پیشنهادی: ۷ تا ۱۰ روز

---

## هدف فصل

تقریباً هر برنامه‌ی واقعی Front-End با چیزهایی سروکار دارد که **زمان می‌برند**: درخواست به سرور، تایمر، خواندن فایل، انتظار برای کلیک کاربر. در این فصل یاد می‌گیری JavaScript این «انتظارها» را بدون قفل کردن صفحه چطور مدیریت می‌کند.

بعد از این فصل باید بتوانی:

- توضیح بدهی چرا کد Asynchronous لازم است
- با `setTimeout` و `setInterval` درست کار کنی (و آن‌ها را لغو کنی)
- Callback و مشکل Callback Hell را بشناسی
- Promise را بسازی، زنجیره کنی و خطاهایش را مدیریت کنی
- تفاوت `Promise.all`، `allSettled`، `race` و `any` را بدانی و درست انتخاب کنی
- با `async` / `await` کد خوانا بنویسی
- تفاوت اجرای Sequential و Parallel را بفهمی و باگ‌های رایج آن را بشناسی
- ترتیب اجرای Microtask و Macrotask را پیش‌بینی کنی
- الگوهای کاربردی مثل Timeout و Retry را بنویسی
- وضعیت‌های Loading / Success / Error را در UI مدیریت کنی

> برای اجرای مثال‌ها می‌توانی از Console مرورگر (که `await` سطح بالا را پشتیبانی می‌کند) یا یک فایل با `<script type="module">` استفاده کنی. در Script معمولی، `await` باید داخل یک `async` Function باشد.

> در این فصل هنوز به سرور واقعی وصل نمی‌شویم. همه‌ی درخواست‌ها را با Promiseهای ساختگی شبیه‌سازی می‌کنیم تا مفهوم Async را بدون پیچیدگی شبکه یاد بگیری. در فصل بعد همین مفاهیم را روی `fetch` و APIهای واقعی به‌کار می‌بریم.

---

# 1. چرا Async لازم است؟

JavaScript در Browser روی یک **Thread اصلی** اجرا می‌شود؛ همان Threadی که صفحه را هم رندر می‌کند. اگر کدی منتظر بماند، همه‌چیز منتظر می‌ماند.

فرض کن گرفتن اطلاعات کاربر از سرور ۲ ثانیه طول بکشد. اگر JavaScript منتظر بماند:

```text
دکمه‌ها کار نمی‌کنند
اسکرول قفل می‌شود
انیمیشن‌ها می‌ایستند
صفحه «یخ می‌زند»
```

راه‌حل: کاری که زمان می‌برد را **شروع می‌کنیم**، بدون انتظار به کار بعدی می‌رویم، و وقتی نتیجه آماده شد، یک تابع را برای ادامه‌ی کار اجرا می‌کنیم.

کارهای Async معمول در Front-End:

```text
درخواست به سرور (fetch)
تایمرها (setTimeout / setInterval)
خواندن فایل انتخاب‌شده توسط کاربر
Eventها (کلیک، تایپ، اسکرول)
دسترسی به دوربین، موقعیت مکانی و ...
```

---

# 2. مرور سریع: Async و Event Loop

از فصل قبل به یاد داریم:

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

console.log("C");
```

خروجی:

```text
A
C
B
```

`setTimeout` کاری که «بعداً» باید انجام شود را به محیط اجرا (Browser) می‌سپارد. وقتی زمانش رسید و Call Stack خالی بود، Callback آن اجرا می‌شود.

دو نکته که در تمام این فصل به آن‌ها نیاز داری:

```text
۱) Callback یک تایمر، Macrotask است.
۲) Callback یک Promise (then / catch / finally و ادامه‌ی بعد از await)، Microtask است
   و قبل از Macrotaskها اجرا می‌شود.
```

---

# 3. `setTimeout` و `setInterval`

```js
const id = setTimeout(callback, delay, ...args);
```

- `callback`: تابعی که بعداً اجرا می‌شود.
- `delay`: حداقل زمان انتظار به میلی‌ثانیه.
- `args`: آرگومان‌هایی که به Callback داده می‌شوند.

```js
setTimeout((name) => {
  console.log(`Hello ${name}`);
}, 1000, "Ali");
```

**لغو یک تایمر**

`setTimeout` یک `id` برمی‌گرداند که با `clearTimeout` می‌توانیم تایمر را قبل از اجرا لغو کنیم:

```js
const timerId = setTimeout(() => {
  console.log("این چاپ نمی‌شود");
}, 2000);

clearTimeout(timerId);
```

**`setInterval`: اجرای تکراری**

```js
let count = 0;

const intervalId = setInterval(() => {
  count++;
  console.log("tick", count);

  if (count === 3) {
    clearInterval(intervalId); // بدون این، تایمر برای همیشه ادامه می‌دهد
  }
}, 1000);
```

خروجی (هر ثانیه یک خط):

```text
tick 1
tick 2
tick 3
```

**نکات مهم**

- `delay` فقط **حداقل** زمان انتظار است. اگر Call Stack مشغول باشد، اجرا دیرتر هم می‌شود.
- `setInterval` را حتماً پاک کن (`clearInterval`)؛ مخصوصاً وقتی کاربر صفحه یا بخشی از UI را ترک می‌کند. تایمرهای فراموش‌شده «نشت حافظه» و رفتار عجیب می‌سازند.
- برای کار Async که زمان اجرایش نامعلوم است، `setInterval` خطرناک است؛ ممکن است اجراها روی هم بیفتند. در این حالت بعد از تمام شدن هر کار، تایمر بعدی را با `setTimeout` بساز.

---

# 4. Callback چیست؟

**Callback** تابعی است که به تابع دیگری می‌دهیم تا بعداً آن را صدا بزند.

دو نوع Callback داریم:

```js
// Callback همزمان (Synchronous): فوراً اجرا می‌شود
[1, 2, 3].map((n) => n * 2);
```

```js
// Callback ناهمزمان (Asynchronous): بعداً اجرا می‌شود
setTimeout(() => {
  console.log("بعداً");
}, 1000);
```

بیایید یک عملیات «سرور» را شبیه‌سازی کنیم:

```js
function getUser(id, callback) {
  setTimeout(() => {
    callback({ id, name: "Ali" });
  }, 500);
}

getUser(1, (user) => {
  console.log(user.name);
});

console.log("Request sent");
```

خروجی:

```text
Request sent
Ali
```

نتیجه را نمی‌توانیم `return` کنیم، چون وقتی `getUser` برمی‌گردد هنوز نتیجه‌ای وجود ندارد. تنها راه گرفتن نتیجه، همان Callback است.

**الگوی Error-First**

برای خطا، قرارداد رایج این است که اولین پارامتر Callback خطا باشد (در Node.js هم استاندارد است):

```js
function getUser(id, callback) {
  setTimeout(() => {
    if (id <= 0) {
      callback(new Error("Invalid id"));
      return;
    }

    callback(null, { id, name: "Ali" });
  }, 300);
}

getUser(-1, (error, user) => {
  if (error) {
    console.log("Error:", error.message);
    return;
  }

  console.log(user.name);
});
```

---

# 5. Callback Hell

وقتی چند کار Async به هم وابسته‌اند و هر کدام به نتیجه‌ی قبلی نیاز دارد، Callbackها داخل هم می‌روند:

```js
getUser(1, (error, user) => {
  if (error) return console.log(error.message);

  getPosts(user.id, (error, posts) => {
    if (error) return console.log(error.message);

    getComments(posts[0].id, (error, comments) => {
      if (error) return console.log(error.message);

      console.log(comments);
    });
  });
});
```

به شکل «هرم» (Pyramid of Doom) رشد می‌کند:

```text
getUser
  └── getPosts
        └── getComments
              └── ...
```

---

# 6. مشکل‌های Callback

```text
خوانایی: با هر مرحله کد به سمت راست می‌رود
خطا: برای هر مرحله باید جداگانه if (error) بنویسی
return: نمی‌توانی نتیجه را مستقیم برگردانی
اجرای موازی: هماهنگ کردن چند کار هم‌زمان سخت است
اعتماد: تابعی که Callback می‌گیرد ممکن است آن را دو بار صدا بزند یا هرگز صدا نزند
```

برای حل این مشکلات **Promise** به زبان اضافه شد.

---

# 7. Promise چیست؟

**Promise** یک Object است که نتیجه‌ی یک کار Async را که «در آینده» آماده می‌شود، نمایندگی می‌کند.

Promise همیشه در یکی از سه وضعیت است:

```text
pending     ← در حال انتظار (کار هنوز تمام نشده)
fulfilled   ← موفق (با یک مقدار)
rejected    ← ناموفق (با یک خطا / دلیل)
```

```text
              ┌── resolve(value) ──→ fulfilled
pending ──────┤
              └── reject(error)  ──→ rejected
```

وقتی Promise از `pending` خارج شد (به آن **settled** می‌گوییم)، وضعیتش دیگر **هرگز** عوض نمی‌شود و فقط یک بار نتیجه می‌دهد.

تشبیه: وقتی در رستوران سفارش می‌دهی، یک «شماره‌ی سفارش» می‌گیری. غذا هنوز آماده نیست (pending). بعداً یا غذا می‌آید (fulfilled) یا می‌گویند تمام شده (rejected).

---

# 8. ساخت Promise

```js
const promise = new Promise((resolve, reject) => {
  // کار Async
  // موفق شد   → resolve(value)
  // خطا داشت → reject(error)
});
```

تابعی که به `new Promise` می‌دهیم **Executor** نام دارد و **همان لحظه و همزمان** اجرا می‌شود (نه بعداً).

یک مثال پرکاربرد: تابع کمکی `wait`:

```js
const wait = (ms, value) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });

wait(1000, "done").then((result) => {
  console.log(result); // بعد از ۱ ثانیه: "done"
});
```

و یک مثال با موفقیت یا خطا:

```js
function checkAge(age) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (age >= 18) {
        resolve("Access granted");
      } else {
        reject(new Error("Too young"));
      }
    }, 500);
  });
}
```

**نکات**

- همیشه با `new Error(...)` reject کن، نه با یک رشته. `Error` اطلاعات Stack Trace دارد.
- بعد از اولین `resolve` یا `reject`، فراخوانی‌های بعدی بی‌اثرند.
- اگر داخل Executor خطای Synchronous رخ دهد (`throw`)، Promise خودکار `rejected` می‌شود.
- `resolve` و `reject` اجرای Executor را متوقف نمی‌کنند. کد بعدشان هم اجرا می‌شود (برای توقف `return` بنویس).

---

# 9. `then`، `catch` و `finally`

```js
checkAge(20)
  .then((result) => {
    console.log("Success:", result);
  })
  .catch((error) => {
    console.log("Error:", error.message);
  })
  .finally(() => {
    console.log("Finished");
  });
```

| متد | کِی اجرا می‌شود؟ |
|-----|------------------|
| `then(onFulfilled)` | وقتی Promise موفق شد؛ مقدار را می‌گیرد |
| `catch(onRejected)` | وقتی Promise شکست خورد (یا در زنجیره خطایی پرتاب شد) |
| `finally(fn)` | در هر دو حالت؛ آرگومان نمی‌گیرد؛ برای پاک‌سازی (مثل بستن Spinner) |

نکات:

- `then` می‌تواند دو آرگومان بگیرد (`then(onFulfilled, onRejected)`)، ولی در عمل `.catch()` جدا خواناتر و امن‌تر است، چون خطای خود `then` را هم می‌گیرد.
- `finally` مقدار یا خطای قبلی را عوض نمی‌کند؛ فقط «عبور» می‌دهد:

```js
Promise.resolve("v")
  .finally(() => "ignored")
  .then((value) => console.log(value)); // "v"
```

---

# 10. Promise Chaining

`then` همیشه یک **Promise جدید** برمی‌گرداند. به همین دلیل می‌توانیم آن‌ها را زنجیره کنیم. خروجی هر `then` ورودی `then` بعدی می‌شود:

```js
Promise.resolve(2)
  .then((n) => n * 2)               // 4
  .then((n) => {
    console.log(n);                 // 4
    return wait(500, n + 1);        // یک Promise برمی‌گردانیم
  })
  .then((n) => {
    console.log(n);                 // 5  ← بعد از ۵۰۰ms، مقدار نهایی Promise
  })
  .finally(() => console.log("finally"));
```

خروجی:

```text
4
5
finally
```

قاعده‌ی کلیدی:

```text
اگر در then یک مقدار معمولی return کنی   → then بعدی همان مقدار را می‌گیرد
اگر در then یک Promise return کنی        → زنجیره منتظر آن Promise می‌ماند
اگر در then خطا throw کنی                → Promise به rejected می‌رود
اگر چیزی return نکنی                     → then بعدی undefined می‌گیرد
```

حالا Callback Hell فصل قبل را با Promise بنویس (فرض: `getUser` و ... Promise برمی‌گردانند):

```js
getUser(1)
  .then((user) => getPosts(user.id))
  .then((posts) => getComments(posts[0].id))
  .then((comments) => console.log(comments))
  .catch((error) => console.log("Error:", error.message));
```

کد «عمودی» شد و یک `.catch` برای کل زنجیره کافی است.

---

# 11. اشتباه رایج: فراموش کردن `return`

```js
Promise.resolve(1)
  .then((n) => {
    n + 1; // ❌ return نشده
  })
  .then((value) => {
    console.log(value); // undefined
  });
```

اگر داخل `then` یک Promise می‌سازی و `return` نمی‌کنی، زنجیره منتظر آن نمی‌ماند و خطای آن هم به `catch` نمی‌رسد:

```js
getUser(1)
  .then((user) => {
    getPosts(user.id); // ❌ return نشده؛ زنجیره صبر نمی‌کند
  })
  .then((posts) => {
    console.log(posts); // undefined
  });
```

قاعده: **داخل `then` یا مقدار را `return` کن، یا Promise را.**

---

# 12. مدیریت خطا در Promise Chain

وقتی در یک مرحله خطا رخ دهد (reject یا `throw`)، `then`های بعدی **رد می‌شوند** و اجرا به نزدیک‌ترین `catch` می‌رسد:

```js
Promise.resolve(1)
  .then(() => {
    throw new Error("boom");
  })
  .then(() => console.log("این اجرا نمی‌شود"))
  .catch((error) => {
    console.log("caught:", error.message);
    return "recovered";                  // خطا مدیریت شد؛ زنجیره ادامه دارد
  })
  .then((value) => console.log(value));
```

خروجی:

```text
caught: boom
recovered
```

نکته‌ها:

- `catch` هم یک Promise **موفق** برمی‌گرداند (با هر مقداری که `return` کنی). یعنی با `catch` خطا «مدیریت شده» حساب می‌شود.
- اگر می‌خواهی خطا به مرحله‌ی بالاتر برسد، دوباره `throw` کن:

```js
promise.catch((error) => {
  console.log("log:", error.message);
  throw error; // خطا را ادامه بده
});
```

- معمولاً `catch` را **آخر زنجیره** می‌گذاریم تا خطای همه‌ی مرحله‌ها را بگیرد.

---

# 13. `Promise.resolve` و `Promise.reject`

برای ساخت Promiseای که از اول settled است:

```js
const ok = Promise.resolve(42);
const fail = Promise.reject(new Error("no"));
```

کاربرد: یک Function که گاهی مقدار معمولی و گاهی Promise برمی‌گرداند را یکدست کنی:

```js
Promise.resolve(valueOrPromise).then((result) => {
  // در هر دو حالت اینجا همان نتیجه است
});
```

---

# 14. `Promise.all`

وقتی چند کار **مستقل** داری و می‌خواهی همه را همزمان شروع کنی و منتظر **همه‌ی آن‌ها** بمانی:

```js
const [users, posts] = await Promise.all([
  getUsers(),   // ۶۰۰ms
  getPosts()    // ۹۰۰ms
]);
// در مجموع حدود ۹۰۰ms (نه ۱۵۰۰ms)
```

با `then`:

```js
Promise.all([wait(300, "A"), wait(100, "B")]).then((results) => {
  console.log(results); // ["A", "B"]
});
```

**ویژگی‌ها**

- نتیجه یک Array است با **همان ترتیب ورودی** (نه ترتیب تمام شدن).
- اگر **یکی** از Promiseها reject شود، کل `Promise.all` بلافاصله reject می‌شود (Fail-Fast).
- بقیه‌ی درخواست‌ها لغو **نمی‌شوند** (ادامه می‌دهند، فقط نتیجه‌شان نادیده گرفته می‌شود).

```js
try {
  await Promise.all([wait(100, "x"), Promise.reject(new Error("fail"))]);
} catch (error) {
  console.log(error.message); // "fail"
}
```

**چه زمانی؟** وقتی بدون همه‌ی نتیجه‌ها ادامه‌دادن بی‌معنی است (مثلاً صفحه به «کاربر» و «سفارش‌هایش» هر دو نیاز دارد).

---

# 15. `Promise.allSettled`

منتظر **همه** می‌ماند و هیچ‌وقت reject نمی‌شود. برای هر Promise وضعیتش را گزارش می‌دهد:

```js
const results = await Promise.allSettled([
  wait(100, "ok"),
  Promise.reject(new Error("no"))
]);

console.log(results);
```

```text
[
  { status: "fulfilled", value: "ok" },
  { status: "rejected",  reason: Error("no") }
]
```

```js
results.forEach((result) => {
  if (result.status === "fulfilled") {
    console.log("OK:", result.value);
  } else {
    console.log("Failed:", result.reason.message);
  }
});
```

**چه زمانی؟** وقتی بخش‌های صفحه مستقل‌اند (مثلاً داشبورد با چند Widget) و می‌خواهی خرابی یک بخش، بقیه را خراب نکند.

---

# 16. `Promise.race`

نتیجه‌ی **اولین Promiseی** که settled شود (چه موفق چه ناموفق):

```js
const result = await Promise.race([
  wait(300, "slow"),
  wait(100, "fast")
]);

console.log(result); // "fast"
```

اگر اولین Promise که تمام می‌شود reject باشد، `race` هم reject می‌شود.

**کاربرد رایج: Timeout** (در بخش ۲۷ می‌بینی).

---

# 17. `Promise.any`

نتیجه‌ی **اولین Promise موفق**؛ rejectها را نادیده می‌گیرد:

```js
const result = await Promise.any([
  Promise.reject(new Error("e1")),
  wait(100, "first ok")
]);

console.log(result); // "first ok"
```

اگر **همه** reject شوند، `AggregateError` پرتاب می‌شود که لیست خطاها در `error.errors` است:

```js
try {
  await Promise.any([
    Promise.reject(new Error("e1")),
    Promise.reject(new Error("e2"))
  ]);
} catch (error) {
  console.log(error.constructor.name);                // "AggregateError"
  console.log(error.errors.map((e) => e.message));    // ["e1", "e2"]
}
```

**کاربرد:** درخواست از چند سرور مشابه (Mirror) و استفاده از سریع‌ترین پاسخ موفق.

---

# 18. مقایسه‌ی چهار متد

| متد | چه زمانی تمام می‌شود؟ | اگر یکی reject شود؟ | نتیجه |
|-----|------------------------|----------------------|-------|
| `Promise.all` | وقتی **همه** موفق شدند | کل Promise فوراً reject | Array مقدارها (به ترتیب ورودی) |
| `Promise.allSettled` | وقتی **همه** settled شدند | مشکلی نیست؛ ثبت می‌شود | Array از `{ status, value / reason }` |
| `Promise.race` | **اولین** settled | اگر اولی reject باشد، reject | نتیجه‌ی اولین |
| `Promise.any` | **اولین موفق** | نادیده گرفته می‌شود | مقدار اولین موفق |

راهنمای انتخاب سریع:

```text
همه لازم‌اند و یکی خراب شد یعنی کل کار خراب؟   → all
می‌خواهم گزارش همه را داشته باشم؟               → allSettled
سریع‌ترین جواب (یا Timeout)؟                    → race
سریع‌ترین جواب «موفق»؟                          → any
```

---

# 19. Promise و ترتیب اجرا (Microtask)

دو قانون مهم:

۱) **Executor همزمان اجرا می‌شود.**  
۲) **`then` / `catch` / `finally` همیشه Async‌اند**، حتی اگر Promise از قبل settled باشد.

```js
console.log("1");

const p = new Promise((resolve) => {
  console.log("2");   // Executor همزمان اجرا می‌شود
  resolve("3");
});

p.then((value) => console.log(value)); // Microtask

console.log("4");
```

خروجی:

```text
1
2
4
3
```

ترکیب با Timer و `queueMicrotask`:

```js
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("promise"));
queueMicrotask(() => console.log("microtask"));
console.log("sync");
```

```text
sync
promise
microtask
timeout
```

اول Synchronous، بعد **همه‌ی** Microtaskها (به ترتیب ثبت)، بعد Macrotask.

---

# 20. `async` Function

با گذاشتن `async` قبل از Function، آن Function **همیشه یک Promise** برمی‌گرداند:

```js
async function getNumber() {
  return 1;
}

const result = getNumber();

console.log(result instanceof Promise); // true
result.then((value) => console.log(value)); // 1
```

- `return value` → Promise با موفقیت `fulfilled` شده با آن مقدار.
- `throw error` → Promise `rejected`.

سه شکل نوشتن:

```js
async function normal() {}

const arrow = async () => {};

const user = {
  async load() {}
};
```

---

# 21. `await`

`await` منتظر می‌ماند تا یک Promise تمام شود و **مقدارش** را برمی‌گرداند:

```js
async function showUser() {
  console.log("Loading...");

  const user = await getUser(1); // منتظر نتیجه
  console.log(user.name);
}
```

به‌جای `.then` زنجیره‌ای، کدی شبیه کد Synchronous می‌نویسیم:

```js
async function loadComments() {
  const user = await getUser(1);
  const posts = await getPosts(user.id);
  const comments = await getComments(posts[0].id);

  console.log(comments);
}
```

**مهم: `await` فقط همان Function را متوقف می‌کند، نه کل برنامه را.**

```js
async function main() {
  console.log("A");
  await null;
  console.log("B");
}

console.log("1");
main();
console.log("2");
```

```text
1
A
2
B
```

`A` همزمان اجرا می‌شود (تا اولین `await`). بعد کنترل به بیرون برمی‌گردد و `2` چاپ می‌شود. ادامه‌ی `main` (بعد از `await`) به‌صورت **Microtask** اجرا می‌شود.

**نکته‌ها**

- `await` فقط داخل `async` Function کار می‌کند (یا در **سطح بالای Module**، که به آن Top-Level Await می‌گویند).
- می‌توانی روی مقدار معمولی هم `await` کنی (`await 5` همان `5` را برمی‌گرداند).
- `async` / `await` فقط «ظاهر» Promise است؛ زیرش همان Promise و Microtask کار می‌کند.

---

# 22. `try` / `catch` / `finally` با `await`

با `await`، خطای Promise به‌صورت `throw` ظاهر می‌شود و با `try` / `catch` معمولی گرفته می‌شود:

```js
async function loadUser(id) {
  try {
    const user = await getUser(id);
    console.log(user.name);
  } catch (error) {
    console.log("Error:", error.message);
  } finally {
    console.log("Finished");
  }
}
```

نکات:

- هر `await` که reject شود، اجرا را به `catch` می‌برد.
- `finally` در هر حالت اجرا می‌شود (مناسب برای مخفی کردن Spinner).
- اگر `try` / `catch` نگذاری، خطا از Function بیرون می‌رود و Promise برگشتی `rejected` می‌شود؛ پس **بالاتر** باید گرفته شود.
- فقط خطاهایی را بگیر که می‌توانی واقعاً مدیریت کنی (پیام به کاربر، تلاش دوباره)؛ در غیر این صورت `throw` کن تا بالاتر گرفته شود.

---

# 23. Sequential در برابر Parallel

**Sequential (پشت سر هم):** هر کار بعد از تمام شدن قبلی شروع می‌شود.

```js
async function loadSequential() {
  const user = await getUser(1);     // ۶۰۰ms
  const posts = await getPosts(1);   // ۹۰۰ms
  // جمع: ۱۵۰۰ms
}
```

وقتی لازم است که **مرحله‌ی دوم به نتیجه‌ی اول نیاز دارد** (مثل `user.id`)، همین درست است.

**Parallel (هم‌زمان):** وقتی کارها مستقل‌اند، همه را با هم شروع کن:

```js
async function loadParallel() {
  const [user, posts] = await Promise.all([
    getUser(1),    // ۶۰۰ms
    getPosts(1)    // ۹۰۰ms
  ]);
  // جمع: حدود ۹۰۰ms
}
```

یک نمونه‌ی اندازه‌گیری:

```js
console.time("sequential");
for (const ms of [500, 500, 500]) {
  await wait(ms);
}
console.timeEnd("sequential"); // حدود 1500ms

console.time("parallel");
await Promise.all([500, 500, 500].map((ms) => wait(ms)));
console.timeEnd("parallel");   // حدود 500ms
```

**اشتباه رایج:** استفاده از `await` پشت سر هم برای کارهای مستقل، که صفحه را بی‌دلیل کند می‌کند.

> ترفند «شروع زودتر، `await` دیرتر» هم رایج است، ولی اگر Promise اول reject شود و بعد دومی هم reject شود، خطای دوم Unhandled می‌ماند. برای ایمنی، برای کارهای مستقل بهتر است از `Promise.all` یا `Promise.allSettled` استفاده کنی.

---

# 24. `async` / `await` در حلقه‌ها

## `forEach` با `async` کار نمی‌کند

```js
const items = [1, 2];

items.forEach(async (n) => {
  await wait(10);
  console.log("item", n);
});

console.log("after forEach");
```

خروجی:

```text
after forEach
item 1
item 2
```

`forEach` به Promise برگشتی Callback توجهی ندارد و منتظرش نمی‌ماند.

## راه‌حل ۱: `for...of` (Sequential)

```js
for (const n of items) {
  await wait(10);
  console.log("item", n);
}
console.log("after loop"); // بعد از همه
```

## راه‌حل ۲: `Promise.all` + `map` (Parallel)

```js
const results = await Promise.all(
  items.map(async (n) => {
    await wait(10);
    return n * 2;
  })
);

console.log(results); // [2, 4]
```

قاعده:

```text
ترتیب مهم است / هر مرحله به قبلی وابسته است  → for...of + await
مستقل‌اند و سرعت مهم است                       → Promise.all + map
```

> توجه: اگر تعداد درخواست‌ها خیلی زیاد است (مثلاً ۱۰۰۰ مورد)، همه را یکجا Parallel نکن؛ سرور یا مرورگر محدودیت دارند. آن‌ها را دسته‌دسته (Batch) اجرا کن.

---

# 25. `return await`: یک تفاوت ظریف

در `try` / `catch` تفاوت بین `return promise` و `return await promise` مهم است:

```js
async function fail() {
  throw new Error("inner");
}

async function withoutAwait() {
  try {
    return fail(); // Promise برگردانده می‌شود، خطا خارج از try رخ می‌دهد
  } catch (error) {
    return "caught here";
  }
}

async function withAwait() {
  try {
    return await fail(); // منتظر می‌ماند؛ خطا داخل try رخ می‌دهد
  } catch (error) {
    return "caught here";
  }
}

withoutAwait().catch((e) => console.log("escaped:", e.message)); // escaped: inner
withAwait().then((value) => console.log(value));                 // caught here
```

قاعده: اگر می‌خواهی `catch` همین Function خطای Promiseای که `return` می‌کنی را بگیرد، حتماً `return await` بنویس. بیرون از `try` فرق خاصی نمی‌کند.

---

# 26. Unhandled Rejection

اگر یک Promise reject شود و هیچ‌جا `catch` نداشته باشد، Browser خطای زیر را در Console نشان می‌دهد:

```text
Uncaught (in promise) Error: ...
```

این رایج‌ترین حالتش است:

```js
async function loadData() {
  throw new Error("Failed");
}

loadData(); // ❌ نه await، نه .catch → Unhandled Rejection
```

درست:

```js
loadData().catch((error) => console.log(error.message));
// یا
try {
  await loadData();
} catch (error) {
  console.log(error.message);
}
```

برای گرفتن خطاهای فراموش‌شده (مثلاً برای گزارش‌گیری) می‌توانی Event سراسری را گوش بدهی:

```js
window.addEventListener("unhandledrejection", (event) => {
  console.log("Unhandled:", event.reason);
});
```

> این فقط «شبکه‌ی ایمنی» است، نه جایگزین `catch` درست.

**Event Handlerهای async:** Callback یک Event Listener اگر `async` باشد، خطایش به‌صورت Unhandled Rejection دیده می‌شود، چون Browser منتظر Promise آن نمی‌ماند. داخل آن `try` / `catch` بگذار:

```js
button.addEventListener("click", async () => {
  try {
    await saveData();
  } catch (error) {
    showError(error.message);
  }
});
```

---

# 27. الگوهای کاربردی: `wait`، Timeout و Retry

## `wait`

```js
const wait = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));
```

## Timeout با `Promise.race`

```js
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), ms);
  });

  return Promise.race([promise, timeout]);
}

try {
  await withTimeout(wait(5000), 1000);
} catch (error) {
  console.log(error.message); // "Timeout"
}

console.log(await withTimeout(wait(100, "in time"), 1000)); // "in time"
```

> این روش فقط **منتظر ماندن** را قطع می‌کند؛ خود درخواست لغو نمی‌شود. برای لغو واقعی درخواست شبکه در فصل بعد از `AbortController` استفاده می‌کنیم.

## Retry (تلاش دوباره) با تأخیر فزاینده

```js
async function retry(task, times = 3, delay = 500) {
  let lastError;

  for (let attempt = 1; attempt <= times; attempt++) {
    try {
      return await task(attempt);
    } catch (error) {
      lastError = error;
      console.log(`attempt ${attempt} failed`);

      if (attempt < times) {
        await wait(delay * attempt); // ۵۰۰، ۱۰۰۰، ...
      }
    }
  }

  throw lastError; // همه‌ی تلاش‌ها ناموفق بود
}

const result = await retry(async (attempt) => {
  if (attempt < 3) throw new Error("temporary error");
  return `ok on attempt ${attempt}`;
});

console.log(result); // "ok on attempt 3"
```

نکته‌ی مهم: Retry فقط برای خطاهای **موقتی** (قطع شبکه، خطای ۵۰۰) منطقی است، نه برای خطای کاربر (مثل رمز اشتباه).

---

# 28. تبدیل Callback به Promise (Promisify)

اگر با تابعی روبه‌رو شدی که هنوز Callback می‌گیرد (کتابخانه‌ی قدیمی)، می‌توانی آن را در Promise بپیچی:

```js
// تابع قدیمی با Callback خطا-اول
function legacyDouble(x, callback) {
  setTimeout(() => {
    if (x < 0) {
      callback(new Error("negative"));
    } else {
      callback(null, x * 2);
    }
  }, 100);
}

function doublePromise(x) {
  return new Promise((resolve, reject) => {
    legacyDouble(x, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

console.log(await doublePromise(4)); // 8
```

نسخه‌ی عمومی:

```js
function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
}

const doubleAsync = promisify(legacyDouble);
console.log(await doubleAsync(5)); // 10
```

---

# 29. الگوی Loading / Success / Error در UI

هر عملیات Async در UI چهار حالت دارد:

```text
idle      ← هنوز شروع نشده
loading   ← در حال انتظار (Spinner)
success   ← داده آماده (لیست)  یا  empty (داده‌ای نیست)
error     ← خطا (پیام + دکمه‌ی تلاش مجدد)
```

یک نمونه‌ی ساده (بر اساس DOM فصل ۳):

```js
const status = document.querySelector("#status");
const list = document.querySelector("#list");
const button = document.querySelector("#load");

async function loadUsers() {
  button.disabled = true;               // جلوگیری از کلیک چندباره
  status.textContent = "Loading...";
  list.innerHTML = "";

  try {
    const users = await getUsers();

    if (users.length === 0) {
      status.textContent = "کاربری پیدا نشد";
      return;
    }

    status.textContent = "";
    list.innerHTML = users.map((u) => `<li>${u.name}</li>`).join("");
  } catch (error) {
    status.textContent = `خطا: ${error.message}`;
  } finally {
    button.disabled = false;            // در هر حالت دکمه فعال می‌شود
  }
}

button.addEventListener("click", loadUsers);
```

نکته‌ها:

- حتماً سه حالت **Loading**، **Error** و **Empty** را هر کدام جدا مدیریت کن؛ کاربر نباید با صفحه‌ی خالی و بدون توضیح مواجه شود.
- `finally` برای برگرداندن UI به حالت عادی ایده‌آل است.
- دکمه را هنگام Loading غیرفعال کن تا درخواست‌های تکراری ساخته نشود.
- اگر کاربر سریع دو درخواست بفرستد، ممکن است جواب **قدیمی‌تر دیرتر** برسد و UI را بازنویسی کند (Race Condition). راه‌حل (لغو درخواست قبلی) را در فصل بعد با `AbortController` می‌بینی.

---

# 30. نکات مهم فصل

### نکته ۱

`async` Function همیشه Promise برمی‌گرداند، حتی اگر مقدار ساده `return` کنی.

---

### نکته ۲

`await` فقط همان Function را متوقف می‌کند و Thread اصلی آزاد می‌ماند.

---

### نکته ۳

برای کارهای مستقل از `Promise.all` استفاده کن، نه چند `await` پشت هم.

---

### نکته ۴

`forEach` منتظر Callback‌های `async` نمی‌ماند. از `for...of` یا `Promise.all(map)` استفاده کن.

---

### نکته ۵

هر Promise باید یک مسیر مدیریت خطا داشته باشد (`catch` یا `try` / `catch`).

---

### نکته ۶

Callback Promise (Microtask) همیشه قبل از `setTimeout(fn, 0)` (Macrotask) اجرا می‌شود.

---

### مقایسه‌ی سه روش

| | Callback | Promise (`then`) | `async` / `await` |
|---|----------|------------------|-------------------|
| خوانایی | کم (تو در تو) | متوسط (زنجیره) | بالا (شبیه Sync) |
| مدیریت خطا | هر مرحله جدا | `.catch` یکجا | `try` / `catch` |
| کار موازی | سخت | `Promise.all` | `Promise.all` |
| امروز | کتابخانه‌های قدیمی، Eventها | زیر کار async/await | روش پیش‌فرض |

---

# 31. اشتباهات رایج

1. فراموش کردن `return` داخل `then`.
2. فراموش کردن `await` و کار با Promise به‌جای مقدار (مثلاً `user.name` روی Promise → `undefined`).
3. استفاده از `await` پشت سر هم برای کارهای مستقل.
4. استفاده از `forEach` با Callback `async` و انتظار اینکه صبر کند.
5. نداشتن `catch` و ایجاد Unhandled Rejection.
6. گرفتن خطا با `catch` و فقط `console.log` کردن، بدون اطلاع به کاربر یا ادامه‌ی منطقی.
7. تصور اینکه `await` کل برنامه را متوقف می‌کند.
8. فراموش کردن `try` / `catch` در Event Handlerهای `async`.
9. استفاده از `Promise.all` وقتی خرابی یک بخش نباید بقیه را خراب کند (به‌جای `allSettled`).
10. فراموش کردن `clearInterval` / `clearTimeout`.
11. reject کردن با رشته به‌جای `Error`.
12. تصور اینکه Executor داخل `new Promise` بعداً اجرا می‌شود (همزمان است).
13. نوشتن `async` روی Function‌ای که هیچ `await` ندارد و انتظار «Async شدن» کدش (فقط Promise برمی‌گرداند).
14. تصور اینکه `Promise.race` یا Timeout، درخواست اصلی را هم لغو می‌کند.

---

# 32. تمرین‌ها

## سطح ۱ — Timer و Callback

### تمرین ۱

خروجی را قبل از اجرا پیش‌بینی کن:

```js
console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => console.log("C"));

console.log("D");
```

---

### تمرین ۲

یک شمارش معکوس بنویس که از `5` شروع کند، هر ثانیه یک عدد چاپ کند و در `0` متوقف شود و `Go!` چاپ کند (با `setInterval`).

---

### تمرین ۳

تابع `getUser(id, callback)` را با الگوی Error-First بنویس. اگر `id` معتبر نبود خطا بدهد. سپس سه Callback تو در تو بنویس و Callback Hell را با چشم ببین.

---

## سطح ۲ — Promise

### تمرین ۴

تابع `wait(ms, value)` را از حفظ بنویس و با آن بعد از ۱ ثانیه پیام `Hello` را چاپ کن.

---

### تمرین ۵

تابع `checkAge(age)` را مثل نمونه‌ی درس بنویس. با دو ورودی (`20` و `10`) صدا بزن و موفقیت و خطا را با `then` / `catch` / `finally` چاپ کن.

---

### تمرین ۶

خروجی را پیش‌بینی کن:

```js
const p = new Promise((resolve) => {
  console.log("1");
  resolve("2");
  console.log("3");
});

p.then((value) => console.log(value));

console.log("4");
```

---

### تمرین ۷

خروجی را پیش‌بینی کن:

```js
Promise.resolve(1)
  .then((n) => n + 1)
  .then(() => {
    throw new Error("X");
  })
  .then(() => console.log("A"))
  .catch(() => console.log("B"))
  .then(() => console.log("C"));
```

---

## سطح ۳ — ترکیب Promiseها

### تمرین ۸

سه Promise با `wait(300, "A")`، `wait(100, "B")` و `wait(200, "C")` بساز. نتیجه‌ی هر یک از `all`، `race`، `allSettled` و `any` را پیش‌بینی کن، بعد اجرا و مقایسه کن.

---

### تمرین ۹

`Promise.all` با یک Promiseی که reject می‌شود را بنویس و ثابت کن بقیه‌ی Promiseها هنوز اجرا می‌شوند ولی نتیجه‌شان استفاده نمی‌شود. سپس همان را با `allSettled` بنویس.

---

## سطح ۴ — `async` / `await`

### تمرین ۱۰

زنجیره‌ی زیر را با `async` / `await` و `try` / `catch` بازنویسی کن:

```js
getUser(1)
  .then((user) => getPosts(user.id))
  .then((posts) => console.log(posts))
  .catch((error) => console.log(error.message))
  .finally(() => console.log("Done"));
```

(برای `getUser` و `getPosts` خودت دو تابع ساختگی بنویس.)

---

### تمرین ۱۱

خروجی را پیش‌بینی کن:

```js
async function a() {
  console.log("a1");
  await b();
  console.log("a2");
}

async function b() {
  console.log("b");
}

console.log("start");
a();
console.log("end");
```

---

### تمرین ۱۲

سه درخواست ساختگی (۵۰۰ms هرکدام) را یک بار Sequential و یک بار Parallel اجرا کن و زمان را با `console.time` اندازه بگیر.

---

### تمرین ۱۳

این کد چرا درست کار نمی‌کند؟ دو راه‌حل بنویس:

```js
const ids = [1, 2, 3];

ids.forEach(async (id) => {
  const user = await getUser(id);
  console.log(user.name);
});

console.log("All users loaded");
```

---

## سطح ۵ — الگوها

### تمرین ۱۴

تابع `withTimeout(promise, ms)` را بنویس و با یک Promise کند تست کن.

---

### تمرین ۱۵

تابع `retry(task, times, delay)` را بنویس که تا `times` بار دوباره تلاش کند. با تابعی که دو بار خطا می‌دهد و بار سوم موفق می‌شود تستش کن.

---

### تمرین ۱۶

یک تابع Callback-based بنویس و با `promisify` آن را به Promise تبدیل کن.

---

# 33. پاسخنامه‌ی مختصر (پس از تلاش خودت ببین)

**تمرین ۱:**

```text
A
D
C
B
```

**تمرین ۲:**

```js
let n = 5;

const id = setInterval(() => {
  console.log(n);
  n--;

  if (n < 0) {
    clearInterval(id);
    console.log("Go!");
  }
}, 1000);
```

**تمرین ۴:** `const wait = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms)); wait(1000, "Hello").then(console.log);`

**تمرین ۶:**

```text
1
3
4
2
```

`resolve` اجرای Executor را متوقف نمی‌کند (`3` چاپ می‌شود)، ولی `then` همیشه Async است و بعد از کد Synchronous (`4`) می‌آید.

**تمرین ۷:**

```text
B
C
```

خطا در مرحله‌ی دوم، `then` سوم (`A`) را رد می‌کند و به `catch` می‌رسد؛ چون `catch` موفق برمی‌گردد، `then` آخر هم اجرا می‌شود.

**تمرین ۸:** `all` → `["A", "B", "C"]` (به ترتیب ورودی). `race` → `"B"`. `any` → `"B"`. `allSettled` → سه آیتم `{ status: "fulfilled", value }` به ترتیب ورودی.

**تمرین ۱۰:**

```js
async function showPosts() {
  try {
    const user = await getUser(1);
    const posts = await getPosts(user.id);
    console.log(posts);
  } catch (error) {
    console.log(error.message);
  } finally {
    console.log("Done");
  }
}

showPosts();
```

**تمرین ۱۱:**

```text
start
a1
b
end
a2
```

`a()` تا اولین `await` همزمان اجرا می‌شود (`a1`، `b`)؛ بعد کنترل به بیرون برمی‌گردد (`end`) و ادامه‌ی `a` به‌صورت Microtask اجرا می‌شود (`a2`).

**تمرین ۱۲:** Sequential حدود ۱۵۰۰ms و Parallel حدود ۵۰۰ms.

**تمرین ۱۳:** `forEach` منتظر Callbackهای `async` نمی‌ماند، پس `All users loaded` قبل از نام کاربران چاپ می‌شود. راه‌حل‌ها:

```js
// ۱) Sequential
for (const id of ids) {
  const user = await getUser(id);
  console.log(user.name);
}
console.log("All users loaded");

// ۲) Parallel
const users = await Promise.all(ids.map((id) => getUser(id)));
users.forEach((user) => console.log(user.name));
console.log("All users loaded");
```

**تمرین ۱۴ و ۱۵:** نمونه‌ی کامل در بخش ۲۷ آمده است.

**تمرین ۱۶:** نمونه‌ی کامل در بخش ۲۸ آمده است.

---

# 34. پروژه پایان فصل

## Fake API Dashboard

یک داشبورد کوچک بساز که داده‌ی «سرور» را با Promiseهای ساختگی بگیرد و تمام الگوهای این فصل را در یک برنامه‌ی واقعی تمرین کند.

**ساختار پیشنهادی:**

```text
src/
├── index.html
├── api.js          ← توابع ساختگی که Promise برمی‌گردانند
├── utils.js        ← wait، withTimeout، retry
└── app.js          ← UI و Eventها
```

**نمونه‌ی شروع `api.js`:**

```js
// api.js
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getUsers() {
  await wait(600);
  return [{ id: 1, name: "Ali" }, { id: 2, name: "Reza" }];
}

export async function getPosts() {
  await wait(900);

  if (Math.random() < 0.3) {
    throw new Error("Posts service is down");
  }

  return [{ id: 1, title: "Hello" }];
}

export async function getStats() {
  await wait(400);
  return { visits: 1200, sales: 85 };
}
```

**قابلیت‌ها:**

- دکمه‌ی «بارگذاری» که هر سه بخش (کاربران، پست‌ها، آمار) را **همزمان** بگیرد
- هر بخش وضعیت جدا داشته باشد: Loading، موفق، خالی، خطا
- خرابی یک بخش، بقیه را خراب نکند
- دکمه‌ی «تلاش دوباره» برای بخش‌هایی که خطا دادند
- Timeout برای هر درخواست (مثلاً ۲ ثانیه)
- زمان کل بارگذاری نمایش داده شود
- هنگام Loading دکمه غیرفعال باشد

**محدودیت‌ها:**

- بدون فریم‌ورک و کتابخانه
- فقط از Promise و `async` / `await` استفاده شود (بدون Callback تو در تو)
- ماژولار (چند فایل با `import` / `export`)
- هر درخواست یا باید `catch` داشته باشد یا داخل `try` / `catch` باشد

**معیار قبولی:**

- با Live Server بدون هیچ خطای Console اجرا می‌شود.
- با `Promise.allSettled` یا ترکیب مناسب، خرابی «پست‌ها» باعث نمایش نیافتن «کاربران» نمی‌شود.
- هیچ Unhandled Rejection در Console دیده نمی‌شود.
- زمان کل بارگذاری حدود زمان کندترین درخواست است، نه جمع همه.
- دکمه‌ی «تلاش دوباره» فقط بخش خراب را دوباره می‌گیرد.

---

# 35. چک‌لیست خودارزیابی

- [ ] می‌توانم توضیح بدهم چرا Async لازم است
- [ ] `setTimeout` و `setInterval` را می‌نویسم و لغو می‌کنم
- [ ] Callback و Callback Hell را می‌شناسم
- [ ] سه وضعیت Promise را می‌دانم
- [ ] یک Promise می‌سازم (`resolve` / `reject`)
- [ ] `then`، `catch` و `finally` را درست به‌کار می‌برم
- [ ] زنجیره‌ی Promise می‌نویسم و می‌دانم `return` چقدر مهم است
- [ ] مسیر یک خطا در Promise Chain را توضیح می‌دهم
- [ ] تفاوت `all`، `allSettled`، `race` و `any` را می‌دانم
- [ ] ترتیب اجرای Sync، Microtask و Macrotask را پیش‌بینی می‌کنم
- [ ] `async` / `await` و `try` / `catch` می‌نویسم
- [ ] تفاوت Sequential و Parallel را می‌دانم و درست انتخاب می‌کنم
- [ ] مشکل `forEach` با `async` را می‌شناسم
- [ ] Unhandled Rejection را تشخیص می‌دهم و جلوگیری می‌کنم
- [ ] `withTimeout` و `retry` را می‌نویسم
- [ ] یک تابع Callback-based را به Promise تبدیل می‌کنم
- [ ] Loading / Empty / Error را در UI مدیریت می‌کنم

---

# خلاصه فصل

```text
Async
↓
کارهایی که زمان می‌برند را بدون قفل کردن صفحه انجام می‌دهد.

Callback
↓
تابعی که بعداً صدا زده می‌شود؛ تو در تو شدن آن Callback Hell می‌سازد.

Promise
↓
نماینده‌ی نتیجه‌ی آینده: pending → fulfilled یا rejected.

then / catch / finally
↓
مصرف نتیجه، مدیریت خطا و پاک‌سازی؛ زنجیره‌پذیر.

Promise.all / allSettled / race / any
↓
هماهنگی چند Promise با قاعده‌های مختلف.

async / await
↓
نوشتن کد Async به شکل خوانا؛ زیرش همان Promise است.

Sequential و Parallel
↓
وابسته → پشت سر هم؛ مستقل → Promise.all.

Microtask و Macrotask
↓
Promise / await قبل از تایمرها اجرا می‌شوند.

Error Handling
↓
هر Promise باید مسیر خطا داشته باشد؛ Loading / Error / Empty را در UI مدیریت کن.
```

---

# فصل بعد

در فصل بعد این مفاهیم را به **داده‌ی واقعی** وصل می‌کنیم:

```text
HTTP و Request / Response
fetch
JSON
Status Codeها و response.ok
Headers و Query Parameters
GET / POST / PUT / PATCH / DELETE
Error Handling درست با fetch
AbortController (لغو درخواست)
Debounce برای جستجو
Pagination
```
