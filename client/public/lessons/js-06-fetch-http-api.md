# جاوااسکریپت — فصل ۶: Fetch، HTTP و کار با API

> **مرحله ۶ از مسیر فول‌استک — ارتباط Front-End با سرور**  
> مباحث این فصل: API، HTTP، URL و Query Parameter، متدها و Status Code، JSON، REST، `fetch`، Error Handling، `POST` / `PUT` / `PATCH` / `DELETE`، `AbortController`، Debounce، Pagination، CORS، ساختار یک API Client  
> پیش‌نیاز: فصل ۵ (Promise و `async` / `await`)  
> زمان پیشنهادی: ۷ تا ۱۰ روز

---

## هدف فصل

تا اینجا همه‌ی داده‌های برنامه‌ات از خود صفحه می‌آمد. در برنامه‌ی واقعی، داده روی **سرور** است: کاربران، محصولات، سفارش‌ها. در این فصل یاد می‌گیری Front-End چطور با سرور حرف می‌زند، جواب را می‌گیرد، خطاها را درست مدیریت می‌کند و تجربه‌ی کاربری روانی می‌سازد.

بعد از این فصل باید بتوانی:

- توضیح بدهی API، Client و Server چیستند
- یک Request و Response HTTP را بخوانی (متد، URL، Header، Body، Status Code)
- با JSON کار کنی و محدودیت‌هایش را بدانی
- با `fetch` داده بگیری و بفرستی (`GET`، `POST`، `PUT`، `PATCH`، `DELETE`)
- بدانی چرا `fetch` برای ۴۰۴ و ۵۰۰ خطا نمی‌دهد و چه کار باید کرد
- Query Parameter را درست بسازی
- چند درخواست را همزمان یا پشت سر هم اجرا کنی
- درخواست را با `AbortController` لغو کنی و جلوی Race Condition را بگیری
- Debounce را برای جستجو بنویسی
- Pagination را پیاده‌سازی کنی
- خطای CORS را بفهمی و بدانی چه کسی باید آن را حل کند
- یک **API Client** تمیز و قابل‌استفاده‌ی مجدد بسازی
- با تب Network در DevTools مشکل‌های درخواست را پیدا کنی

> **API برای تمرین:** در مثال‌ها از `https://jsonplaceholder.typicode.com` استفاده می‌کنیم؛ یک API رایگان و آزمایشی (کاربر، پست، کامنت و ...). این سرویس «ساختگی» است: درخواست‌های `POST` / `PUT` / `DELETE` پاسخ موفق می‌دهند ولی چیزی واقعاً ذخیره نمی‌شود. همیشه مستندات هر API را بخوان؛ آدرس‌ها و فرمت‌ها ممکن است عوض شوند.
>
> مثال‌ها را در Console مرورگر (که `await` سطح بالا دارد) یا در فایل با `<script type="module">` اجرا کن.

---

# 1. API چیست؟

**API** (Application Programming Interface) یعنی یک «واسط» که یک برنامه از طریق آن با برنامه‌ی دیگر حرف می‌زند.

در وب، معمولاً منظور از API یک **سرور** است که آدرس‌هایی (Endpoint) در اختیار می‌گذارد و در جواب درخواست، داده برمی‌گرداند (معمولاً JSON).

```text
Client (مرورگر / برنامه‌ی تو)  ─── Request ───→  Server
                                ←── Response ───
```

تشبیه رستوران:

```text
مشتری  = Client (Front-End)
گارسون = API (واسطه)
آشپزخانه = Server / Database
منو    = مستندات API (چه چیزهایی می‌شود سفارش داد)
```

مشتری مستقیم وارد آشپزخانه نمی‌شود؛ سفارشش را از طریق گارسون با قاعده‌ی مشخص می‌دهد. Front-End هم مستقیم به دیتابیس وصل نمی‌شود و فقط از طریق API حرف می‌زند.

---

# 2. HTTP چیست؟

**HTTP** پروتکل (قرارداد) ارتباط بین Client و Server است. هر ارتباط یک **Request** است و یک **Response**.

**Request**

```text
GET /users/1 HTTP/1.1                    ← متد + مسیر
Host: jsonplaceholder.typicode.com       ← Header ها
Accept: application/json

(بدنه‌ی Body؛ در GET معمولاً خالی)
```

**Response**

```text
HTTP/1.1 200 OK                          ← Status Code
Content-Type: application/json           ← Header ها

{ "id": 1, "name": "Leanne Graham" }     ← Body
```

هر Request این بخش‌ها را دارد:

| بخش | توضیح |
|-----|-------|
| **Method** | چه کاری می‌خواهی انجام بدهی (`GET`، `POST` ...) |
| **URL** | منبع مورد نظر کجاست |
| **Headers** | اطلاعات جانبی (نوع داده، توکن، زبان ...) |
| **Body** | داده‌ای که می‌فرستی (در `POST` / `PUT` / `PATCH`) |

و هر Response:

| بخش | توضیح |
|-----|-------|
| **Status Code** | نتیجه‌ی کار (موفق، پیدا نشد، خطای سرور ...) |
| **Headers** | اطلاعات جانبی پاسخ (نوع محتوا، کش، ...) |
| **Body** | خود داده (JSON، متن، HTML، تصویر ...) |

**HTTP در برابر HTTPS:** HTTPS همان HTTP است که رمزگذاری شده. همیشه برای APIها از `https://` استفاده کن.

---

# 3. URL و بخش‌های آن

```text
https://api.example.com:443/users/1/posts?page=2&limit=10#top
└─┬─┘   └──────┬──────┘└┬┘ └─────┬─────┘ └──────┬───────┘└┬┘
Protocol      Host    Port      Path          Query      Hash
```

| بخش | مثال | معنی |
|-----|------|------|
| Protocol | `https` | روش ارتباط |
| Host | `api.example.com` | آدرس سرور |
| Port | `443` | درگاه (معمولاً نوشته نمی‌شود) |
| Path | `/users/1/posts` | کدام منبع |
| Query | `?page=2&limit=10` | پارامترهای فیلتر، جستجو، صفحه‌بندی |
| Hash | `#top` | بخشی از صفحه (به سرور فرستاده نمی‌شود) |

**ساخت امن URL و Query**

به‌جای چسباندن رشته‌ها، از `URL` و `URLSearchParams` استفاده کن؛ کاراکترهای خاص را خودشان Encode می‌کنند:

```js
const url = new URL("https://api.example.com/items");

url.searchParams.set("q", "Item 2");
url.searchParams.set("page", 2);

console.log(url.toString());
// https://api.example.com/items?q=Item+2&page=2
```

```js
const params = new URLSearchParams({ q: "Item 1", page: 2, limit: 5 });
console.log(params.toString()); // q=Item+1&page=2&limit=5
```

اگر باید یک تکه‌ی تنها را دستی Encode کنی (مثلاً داخل Path):

```js
encodeURIComponent("a b&c=d"); // "a%20b%26c%3Dd"
```

**چرا مهم است؟** کاراکترهایی مثل `&`، `=`، `#` و فاصله یا حروف فارسی در URL معنی خاص دارند. اگر Encode نکنی، آدرس خراب می‌شود یا (بدتر) پارامتر دیگری وارد می‌شود:

```js
const q = "salad & fries";

// ❌ خطرناک: & پارامتر جدید می‌سازد
const bad = `/search?q=${q}`;

// ✅ درست
const good = `/search?q=${encodeURIComponent(q)}`;
```

---

# 4. متدهای HTTP

| متد | کاربرد | Body دارد؟ | مثال |
|-----|--------|-------------|------|
| `GET` | **خواندن** داده | خیر | لیست کاربران |
| `POST` | **ساختن** یک منبع جدید | بله | ثبت‌نام کاربر |
| `PUT` | **جایگزین کردن کامل** یک منبع | بله | بازنویسی کامل پروفایل |
| `PATCH` | **ویرایش جزئی** | بله | فقط تغییر نام |
| `DELETE` | **حذف** | معمولاً خیر | حذف یک پست |

دو مفهوم مهم:

- **Safe (بی‌خطر):** درخواستی که چیزی را تغییر نمی‌دهد. `GET` Safe است.
- **Idempotent:** اگر چندبار تکرار شود، نتیجه‌ی نهایی همان یک‌بار است. `GET`، `PUT` و `DELETE` Idempotent هستند؛ `POST` معمولاً نیست (دو بار `POST` یعنی دو منبع جدید).

نکته‌ی کاربردی: به همین دلیل، اگر کاربر دو بار روی «ثبت سفارش» کلیک کند، ممکن است دو سفارش ثبت شود؛ دکمه را هنگام ارسال غیرفعال کن.

---

# 5. Status Code

سرور با یک عدد سه‌رقمی می‌گوید کار چطور پیش رفت:

| دسته | معنی |
|------|------|
| `2xx` | موفق |
| `3xx` | تغییر مسیر (Redirect) |
| `4xx` | خطای **Client** (درخواست از سمت تو مشکل داشت) |
| `5xx` | خطای **Server** |

کدهایی که باید بشناسی:

| کد | نام | معنی |
|----|-----|------|
| `200` | OK | موفق |
| `201` | Created | منبع جدید ساخته شد (بعد از `POST`) |
| `204` | No Content | موفق، ولی بدنه‌ای ندارد (مثلاً بعد از `DELETE`) |
| `301` / `302` | Redirect | آدرس عوض شده |
| `304` | Not Modified | از کش استفاده کن |
| `400` | Bad Request | درخواست اشتباه یا ناقص |
| `401` | Unauthorized | **وارد نشده‌ای** (Authentication لازم است) |
| `403` | Forbidden | وارد شده‌ای ولی **اجازه نداری** |
| `404` | Not Found | منبع پیدا نشد |
| `409` | Conflict | تضاد (مثلاً ایمیل تکراری) |
| `422` | Unprocessable Entity | داده معتبر نیست (خطای Validation) |
| `429` | Too Many Requests | بیش از حد درخواست دادی |
| `500` | Internal Server Error | خطای داخلی سرور |
| `502` / `503` | Bad Gateway / Service Unavailable | سرور در دسترس نیست |

> برای Front-End مهم‌ترین تفکیک: `4xx` یعنی «کاربر یا برنامه‌ی تو باید چیزی را درست کند» (پیام مناسب به کاربر بده) و `5xx` یعنی «مشکل از سرور است» (پیام عمومی و امکان تلاش دوباره).

---

# 6. Headers

Headerها اطلاعات جانبی هستند. پرکاربردترین‌ها:

| Header | جهت | کاربرد |
|--------|-----|--------|
| `Content-Type` | هر دو | نوع Body (مثلاً `application/json`) |
| `Accept` | Request | نوع پاسخی که می‌خواهی |
| `Authorization` | Request | توکن یا اعتبارنامه (مثل `Bearer ...`) |
| `Cache-Control` | Response | قواعد کش |
| `Location` | Response | آدرس منبع تازه‌ساخته‌شده یا مقصد Redirect |

نام Headerها حساس به حروف بزرگ و کوچک نیست.

---

# 7. JSON

**JSON** (JavaScript Object Notation) قالب متنی استاندارد تبادل داده‌ی وب است:

```json
{
  "id": 1,
  "name": "Ali",
  "active": true,
  "tags": ["admin", "editor"],
  "address": { "city": "Baku" },
  "avatar": null
}
```

قواعد (سخت‌تر از Object جاوااسکریپت):

- کلیدها حتماً داخل **دابل‌کوتیشن**
- رشته‌ها فقط با **دابل‌کوتیشن** (نه `'`)
- بدون کامنت و بدون ویرگول اضافه‌ی آخر (Trailing Comma)
- مقدارهای مجاز: رشته، عدد، `true` / `false`، `null`، آرایه، Object
- `undefined`، Function و `Date` نوع JSON نیستند

**تبدیل:**

```js
const text = '{"name":"Ali","age":25}';

const obj = JSON.parse(text);        // رشته ← Object
console.log(obj.name);               // "Ali"

const back = JSON.stringify(obj);    // Object ← رشته
console.log(back);                   // '{"name":"Ali","age":25}'

// خوانا با ۲ فاصله
console.log(JSON.stringify(obj, null, 2));
```

**چیزهایی که `JSON.stringify` تغییر می‌دهد یا حذف می‌کند:**

```js
const data = {
  a: undefined,
  b: () => 1,
  c: new Date(0),
  d: NaN,
  e: [undefined]
};

console.log(JSON.stringify(data));
// {"c":"1970-01-01T00:00:00.000Z","d":null,"e":[null]}
```

- `undefined` و Function در Object حذف می‌شوند (در آرایه می‌شوند `null`)
- `Date` به رشته‌ی ISO تبدیل می‌شود (و برنمی‌گردد به `Date`)
- `NaN` و `Infinity` تبدیل به `null` می‌شوند

**`JSON.parse` روی ورودی نامعتبر خطا می‌دهد:**

```js
try {
  JSON.parse("{'a':1}");   // ❌ SyntaxError (تک‌کوتیشن)
} catch (error) {
  console.log(error.name); // "SyntaxError"
}
```

> خطای معروف `Unexpected token '<' ... is not valid JSON` معمولاً یعنی **سرور HTML فرستاده** (مثلاً صفحه‌ی ۴۰۴ یا آدرس اشتباه) و تو سعی کرده‌ای آن را JSON بخوانی.

---

# 8. REST و نام‌گذاری Endpointها

**REST** یک سبک طراحی API است که حول «منبع‌ها» (Resource) می‌چرخد. آدرس منبع را نشان می‌دهد و متد HTTP عمل را:

| درخواست | معنی |
|---------|------|
| `GET /users` | لیست کاربران |
| `GET /users/1` | کاربر شماره ۱ |
| `POST /users` | ساخت کاربر جدید |
| `PUT /users/1` | جایگزینی کامل کاربر ۱ |
| `PATCH /users/1` | ویرایش جزئی کاربر ۱ |
| `DELETE /users/1` | حذف کاربر ۱ |
| `GET /users/1/posts` | پست‌های کاربر ۱ |
| `GET /posts?userId=1` | پست‌ها با فیلتر |

قواعد نام‌گذاری رایج:

- **اسم جمع** برای منبع‌ها (`/users` نه `/user`)
- **فعل در آدرس نگذار** (`/getUsers`، `/deleteUser` ❌)؛ عمل را متد HTTP مشخص می‌کند
- حروف کوچک و خط‌تیره برای چندکلمه‌ای (`/blog-posts`)
- فیلتر، جستجو و صفحه‌بندی با Query Parameter

> شکل پاسخ APIها یکسان نیست: بعضی آرایه‌ی ساده برمی‌گردانند و بعضی یک Object (مثل `{ data: [...], total: 100 }`). همیشه مستندات یا Response واقعی را ببین.

---

# 9. اولین `fetch`

```js
const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
const user = await response.json();

console.log(user.name);
```

`fetch` دو مرحله‌ای کار می‌کند:

```text
۱) fetch(url)        → Promise که وقتی Header ها رسید (Response آماده شد) تمام می‌شود
۲) response.json()   → Promise دیگر که بدنه را کامل می‌خواند و تبدیل می‌کند
```

برای همین دو `await` داریم. نسخه‌ی `then`:

```js
fetch("https://jsonplaceholder.typicode.com/users/1")
  .then((response) => response.json())
  .then((user) => console.log(user.name))
  .catch((error) => console.log("Error:", error));
```

`fetch` به‌صورت پیش‌فرض متد `GET` است.

---

# 10. شیء Response

```js
const response = await fetch(url);

response.status;        // 200
response.ok;            // true اگر status بین 200 تا 299
response.statusText;    // "OK" (در HTTP/2 معمولاً رشته‌ی خالی است)
response.url;           // آدرس نهایی (بعد از Redirect)
response.headers.get("content-type");   // "application/json; charset=utf-8"
```

**روش‌های خواندن Body (هرکدام یک Promise):**

| متد | خروجی |
|-----|-------|
| `response.json()` | Object از JSON |
| `response.text()` | رشته‌ی خام |
| `response.blob()` | فایل / تصویر |
| `response.formData()` | داده‌ی فرم |
| `response.arrayBuffer()` | داده‌ی باینری |

**نکته‌ی مهم: Body را فقط یک بار می‌شود خواند.**

```js
const response = await fetch(url);

await response.json();
await response.json(); // ❌ TypeError (Body قبلاً خوانده شده؛ متن پیام در مرورگرها فرق دارد)
```

اگر دو بار لازم داری از `response.clone()` استفاده کن:

```js
const copy = response.clone();

const data = await response.json();
const raw = await copy.text();
```

---

# 11. مهم‌ترین نکته‌ی `fetch`: ۴۰۴ و ۵۰۰ خطا نیستند!

```js
const response = await fetch("https://jsonplaceholder.typicode.com/users/9999");

console.log(response.status); // 404
console.log(response.ok);     // false
// هیچ خطایی پرتاب نشد! 
```

`fetch` فقط وقتی **reject** می‌شود که اصلاً ارتباط برقرار نشود (قطع اینترنت، آدرس اشتباه DNS، CORS، لغو درخواست):

```text
جواب رسید (حتی ۴۰۴ یا ۵۰۰)   → fetch موفق است (resolve) → خودت باید response.ok را چک کنی
جواب نرسید                    → fetch reject می‌شود با TypeError
```

پس هر بار باید دستی بررسی کنی:

```js
const response = await fetch(url);

if (!response.ok) {
  throw new Error(`HTTP error: ${response.status}`);
}

const data = await response.json();
```

این فراموشی یکی از رایج‌ترین باگ‌های Front-End است: برنامه به‌جای پیام خطا، با داده‌ی خراب (مثلاً `{}` یا `{ message: ... }`) ادامه می‌دهد.

---

# 12. Error Handling درست با `fetch`

سه نوع خطا داریم و هرکدام را جدا مدیریت می‌کنیم:

```text
۱) خطای شبکه        → fetch reject می‌شود (TypeError)         → «اتصال برقرار نشد»
۲) خطای HTTP        → response.ok === false (۴xx / ۵xx)       → پیام مناسب Status
۳) خطای تبدیل داده  → response.json() یک SyntaxError می‌دهد   → «پاسخ نامعتبر»
```

نسخه‌ی ساده:

```js
async function getUser(id) {
  let response;

  try {
    response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  } catch (error) {
    throw new Error("اتصال به سرور برقرار نشد");   // خطای شبکه
  }

  if (!response.ok) {
    throw new Error(`خطای سرور (${response.status})`);   // خطای HTTP
  }

  return response.json();
}
```

استفاده:

```js
try {
  const user = await getUser(1);
  console.log(user.name);
} catch (error) {
  console.log(error.message);
}
```

در بخش ۲۴ این منطق را در یک **API Client** قابل استفاده‌ی مجدد می‌گذاریم تا در هر Function تکرار نشود.

---

# 13. ارسال داده: `POST`، `PUT`، `PATCH`، `DELETE`

برای غیر از `GET`، گزینه‌ها را به `fetch` می‌دهیم:

```js
const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    title: "Hello",
    body: "My first post",
    userId: 1
  })
});

const created = await response.json();
console.log(response.status); // 201
console.log(created.id);      // شماره‌ی منبع جدید
```

سه چیز را فراموش نکن:

```text
۱) method           ← متد درست
۲) headers          ← Content-Type: application/json
۳) body             ← JSON.stringify(...)  (نه خود Object)
```

اگر `JSON.stringify` را فراموش کنی، `body` به `[object Object]` تبدیل می‌شود.

**`PUT` و `PATCH`:**

```js
// جایگزینی کامل
await fetch("https://jsonplaceholder.typicode.com/posts/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: 1, title: "New", body: "New body", userId: 1 })
});

// ویرایش جزئی
await fetch("https://jsonplaceholder.typicode.com/posts/1", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Only title changed" })
});
```

**`DELETE`:**

```js
const response = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
  method: "DELETE"
});

console.log(response.ok); // true
```

**ارسال فایل یا فرم (`FormData`):**

```js
const formData = new FormData();
formData.append("avatar", fileInput.files[0]);

await fetch("/upload", { method: "POST", body: formData });
// ❌ Content-Type را دستی تنظیم نکن؛ مرورگر خودش (با boundary) تنظیم می‌کند.
```

**نکته‌های مهم:**

- `GET` Body نمی‌تواند داشته باشد.
- بعد از `DELETE` یا برخی `PUT`ها سرور ممکن است `204 No Content` بدهد؛ در این حالت `response.json()` خطا می‌دهد، چون بدنه‌ای نیست. قبل از خواندن Body وضعیت را چک کن.

---

# 14. Query Parameter در عمل

برای فیلتر، جستجو، مرتب‌سازی و صفحه‌بندی:

```js
const url = new URL("https://jsonplaceholder.typicode.com/posts");

url.searchParams.set("userId", 1);
url.searchParams.set("_page", 2);
url.searchParams.set("_limit", 5);

const response = await fetch(url);
const posts = await response.json();
```

آدرس ساخته‌شده:

```text
https://jsonplaceholder.typicode.com/posts?userId=1&_page=2&_limit=5
```

`fetch` هم آدرس رشته‌ای و هم شیء `URL` را می‌پذیرد.

---

# 15. Headers در `fetch` و نکته‌ی امنیتی

```js
const response = await fetch(url, {
  headers: {
    Accept: "application/json",
    Authorization: "Bearer YOUR_TOKEN"
  }
});
```

خواندن Headerهای پاسخ:

```js
const total = response.headers.get("X-Total-Count"); // حساس به حروف بزرگ نیست
```

> **هشدار امنیتی:** هر چیزی که در JavaScript مرورگر باشد (کلید API، رمز، توکن سرویس) برای هر کسی که DevTools باز کند قابل دیدن است. **کلیدهای محرمانه را هرگز داخل کد Front-End نگذار.** اگر سرویسی کلید خصوصی می‌خواهد، درخواست را از طریق Back-End خودت بفرست. (احراز هویت را در فصل مخصوص خودش می‌بینی.)

---

# 16. چند درخواست: همزمان یا پشت سر هم

از فصل قبل می‌دانیم:

**مستقل → همزمان با `Promise.all`:**

```js
const [users, posts] = await Promise.all([
  fetch("https://jsonplaceholder.typicode.com/users").then((r) => r.json()),
  fetch("https://jsonplaceholder.typicode.com/posts").then((r) => r.json())
]);
```

**وابسته → پشت سر هم:**

```js
const user = await fetch(".../users/1").then((r) => r.json());
const posts = await fetch(`.../posts?userId=${user.id}`).then((r) => r.json());
```

**وقتی خرابی یکی نباید بقیه را خراب کند → `Promise.allSettled`:**

```js
const results = await Promise.allSettled([getUsers(), getPosts()]);

results.forEach((result) => {
  if (result.status === "fulfilled") {
    console.log("OK", result.value);
  } else {
    console.log("Failed", result.reason.message);
  }
});
```

> یادآوری: `fetch` برای ۴۰۴ reject نمی‌شود. اگر `Promise.all` را با `fetch` خام به‌کار ببری و `response.ok` را چک نکنی، درخواست ۴۰۴ هم «موفق» حساب می‌شود. با تابع‌هایی که خودشان `ok` را چک و خطا پرتاب می‌کنند (مثل `getUser` بخش ۱۲) کار کن.

---

# 17. لغو درخواست با `AbortController`

گاهی درخواست دیگر لازم نیست: کاربر صفحه را عوض کرد، یا در جستجو عبارت جدیدی تایپ کرد. با `AbortController` می‌توانیم درخواست را لغو کنیم:

```js
const controller = new AbortController();

const promise = fetch("https://jsonplaceholder.typicode.com/users", {
  signal: controller.signal
});

controller.abort(); // لغو

try {
  await promise;
} catch (error) {
  console.log(error.name); // "AbortError"
}
```

نکته‌ها:

- `fetch` با خطایی به نام `AbortError` reject می‌شود. این یک **خطای واقعی نیست**؛ یک لغو عمدی است. معمولاً آن را نادیده می‌گیریم و پیام خطا به کاربر نشان نمی‌دهیم:

```js
catch (error) {
  if (error.name === "AbortError") return; // لغو عمدی
  showError(error.message);
}
```

- هر `AbortController` فقط یک بار می‌تواند Abort شود. برای هر درخواست یک Controller جدید بساز.

**Timeout داخلی (مرورگرهای مدرن):**

```js
try {
  await fetch(url, { signal: AbortSignal.timeout(5000) });
} catch (error) {
  if (error.name === "TimeoutError") {
    console.log("سرور دیر جواب داد");
  }
}
```

(در فصل قبل با `Promise.race` فقط «منتظر ماندن» را قطع می‌کردیم؛ اینجا خود درخواست واقعاً لغو می‌شود.)

**حل Race Condition در جستجو**

فرض کن کاربر `a` را تایپ می‌کند (درخواست ۱) و سریع `ab` (درخواست ۲). اگر جواب درخواست ۱ **دیرتر** از ۲ برسد، نتیجه‌ی قدیمی روی نتیجه‌ی جدید نوشته می‌شود و UI اشتباه نشان می‌دهد:

```text
درخواست "a"  ──────────────(کند)───────→ جواب می‌رسد (دیر)  ← UI را خراب می‌کند
درخواست "ab" ──(سریع)→ جواب می‌رسد
```

راه‌حل: قبل از هر درخواست جدید، قبلی را لغو کن:

```js
let controller;

async function search(query) {
  controller?.abort();                      // درخواست قبلی را لغو کن
  controller = new AbortController();

  try {
    status.textContent = "Loading...";

    const results = await request("/users", {
      params: { q: query },
      signal: controller.signal
    });

    render(results);
    status.textContent = "";
  } catch (error) {
    if (error.name === "AbortError") return;   // لغو شد؛ خطا نیست
    status.textContent = error.message;
  }
}
```

---

# 18. Debounce

اگر در هر `input` یک درخواست بفرستیم، کاربر که «salam» را تایپ می‌کند ۵ درخواست می‌سازد. **Debounce** یعنی: «تا وقتی کاربر تایپ می‌کند صبر کن؛ وقتی برای مدتی ساکت شد، فقط یک بار اجرا کن».

```js
function debounce(fn, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);                       // تایمر قبلی را لغو کن
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

(این همان Closure فصل ۴ است: `timer` متغیر خصوصی است.)

استفاده:

```js
const input = document.querySelector("#search");

input.addEventListener(
  "input",
  debounce((event) => {
    search(event.target.value.trim());
  }, 300)
);
```

مثال زمانی (Debounce ۳۰۰ms):

```text
تایپ: a ... ab ... abc   (فاصله‌ها کمتر از ۳۰۰ms)  → هیچ اجرایی
سکوت ۳۰۰ms                                           → فقط یک اجرا با "abc"
```

**Throttle** (برای مقایسه): حداکثر یک بار در هر بازه. برای رویدادهای مداوم مثل `scroll` و `resize`:

```js
function throttle(fn, limit) {
  let last = 0;

  return (...args) => {
    const now = Date.now();

    if (now - last >= limit) {
      last = now;
      fn(...args);
    }
  };
}
```

| | Debounce | Throttle |
|---|----------|----------|
| ایده | بعد از **آرام شدن** یک بار اجرا کن | در هر بازه **حداکثر یک بار** اجرا کن |
| مناسب برای | جستجو، اعتبارسنجی هنگام تایپ | `scroll`، `resize`، کشیدن ماوس |

Debounce و `AbortController` مکمل هم هستند: Debounce تعداد درخواست‌ها را کم می‌کند و `AbortController` درخواست‌های قدیمی باقی‌مانده را لغو می‌کند.

---

# 19. Pagination (صفحه‌بندی)

گرفتن همه‌ی داده با یک درخواست (مثلاً ۱۰۰ هزار رکورد) کند و غیرعملی است. API معمولاً داده را **تکه‌تکه** می‌دهد.

| روش | Query Parameter | مناسب برای |
|-----|------------------|------------|
| **Page / Limit** | `?page=3&limit=10` | صفحه‌بندی با شماره‌ی صفحه |
| **Offset / Skip** | `?skip=20&limit=10` | رد کردن تعداد مشخص |
| **Cursor** | `?cursor=abc123` | فید بی‌پایان، داده‌ی متغیر |

JSONPlaceholder از `_page` و `_limit` پشتیبانی می‌کند و تعداد کل را در Header به نام `X-Total-Count` می‌فرستد:

```js
const response = await fetch(
  "https://jsonplaceholder.typicode.com/posts?_page=3&_limit=10"
);

const posts = await response.json();
const total = Number(response.headers.get("X-Total-Count"));  // 100

const totalPages = Math.ceil(total / 10);   // 10
```

**دکمه‌ی «بیشتر نشان بده»:**

```js
let page = 1;
const limit = 5;

async function loadMore() {
  const { posts, total } = await getUserPosts(userId, page, limit);

  appendToList(posts);
  page++;

  const loaded = (page - 1) * limit;
  loadMoreButton.hidden = loaded >= total;   // همه لود شد؛ دکمه را پنهان کن
}
```

نکته‌ها:

- هنگام لود صفحه‌ی بعد، دکمه را غیرفعال کن (جلوگیری از کلیک چندباره).
- اگر کاربر فیلتر یا جستجو را عوض کرد، `page` را به `1` برگردان و لیست را خالی کن.
- **Infinite Scroll** (لود خودکار هنگام رسیدن به انتهای صفحه) معمولاً با `IntersectionObserver` ساخته می‌شود؛ همان منطق Pagination است.

---

# 20. حالت‌های Loading / Error / Empty با `fetch`

همان الگوی فصل ۵، حالا با درخواست واقعی:

```js
const status = document.querySelector("#status");
const list = document.querySelector("#list");
const button = document.querySelector("#load");

async function loadUsers() {
  button.disabled = true;
  status.textContent = "در حال بارگذاری...";
  list.replaceChildren();                     // خالی کردن لیست

  try {
    const users = await request("/users");

    if (users.length === 0) {
      status.textContent = "کاربری پیدا نشد";
      return;
    }

    status.textContent = "";

    for (const user of users) {
      const li = document.createElement("li");
      li.textContent = user.name;             // textContent، نه innerHTML
      list.append(li);
    }
  } catch (error) {
    status.textContent = `خطا: ${error.message}`;
  } finally {
    button.disabled = false;
  }
}

button.addEventListener("click", loadUsers);
```

> **توجه (امنیت):** در فصل قبل برای سادگی از `innerHTML` استفاده کردیم. وقتی داده از سرور می‌آید، هرگز آن را مستقیم داخل `innerHTML` نگذار؛ اگر داده شامل کد HTML یا اسکریپت باشد، به **XSS** می‌رسی. از `textContent` یا ساختن المان با `createElement` استفاده کن (همان درس Entityها در فصل HTML).

---

# 21. CORS

اگر از صفحه‌ای که روی `http://localhost:5173` است به `https://api.other.com` درخواست بدهی، ممکن است در Console چنین خطایی ببینی:

```text
Access to fetch at 'https://api.other.com/users' from origin 'http://localhost:5173'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
on the requested resource.
```

**CORS** (Cross-Origin Resource Sharing) یک قاعده‌ی امنیتی **مرورگر** است. **Origin** ترکیب پروتکل + دامنه + پورت است. صفحه‌ای از یک Origin به‌طور پیش‌فرض اجازه ندارد پاسخ Origin دیگری را بخواند، مگر اینکه آن سرور صراحتاً اجازه بدهد:

```text
Access-Control-Allow-Origin: http://localhost:5173
```

نکته‌های کلیدی:

- **سرور** باید اجازه بدهد؛ تو (در Front-End) نمی‌توانی با یک گزینه‌ی `fetch` آن را دور بزنی.
- خطا فقط در **مرورگر** دیده می‌شود. همان درخواست در Postman یا از سمت سرور درست کار می‌کند.
- `mode: "no-cors"` مشکل را حل نمی‌کند؛ فقط پاسخی «مبهم» (Opaque) می‌دهد که نمی‌توانی بخوانی.
- بعضی درخواست‌ها (مثلاً `PUT`، `DELETE`، یا هدر `Content-Type: application/json`) قبل از اصلی یک درخواست `OPTIONS` به نام **Preflight** می‌فرستند تا سرور اجازه را تأیید کند.
- اگر Back-End مال خودت است، Headerهای CORS را آنجا تنظیم کن (در فصل Express می‌بینی).
- در توسعه، راه رایج استفاده از **Proxy سرور توسعه** است. مثلاً در Vite می‌توانی در `vite.config.js` درخواست‌های `/api` را به سرور واقعی هدایت کنی تا مرورگر فکر کند همه‌چیز از یک Origin است (همین کاری که در پروژه‌ی این سایت انجام شده).

---

# 22. کش و درخواست تکراری

اگر هر بار کاربر به صفحه‌ای برمی‌گردد همان داده را دوباره بگیری، هم کند است و هم بار اضافی روی سرور. یک کش ساده‌ی درون‌حافظه‌ای:

```js
const cache = new Map();

export async function cachedRequest(path, ttl = 60_000) {
  const hit = cache.get(path);

  if (hit && Date.now() - hit.time < ttl) {
    return hit.data;                       // هنوز تازه است
  }

  const data = await request(path);
  cache.set(path, { data, time: Date.now() });
  return data;
}
```

`ttl` (Time To Live) مدت اعتبار کش است. این فقط یک نمونه‌ی آموزشی است. کتابخانه‌هایی مثل **TanStack Query** (در فصل React) کش، تلاش دوباره، بروزرسانی خودکار و ... را حرفه‌ای انجام می‌دهند.

مرورگر هم خودش کش HTTP دارد (با Headerهای `Cache-Control` و `ETag` سرور کنترل می‌شود). برای تست، در DevTools تیک **Disable cache** را بزن.

---

# 23. احراز هویت: یک نگاه سریع

بسیاری از APIها فقط برای کاربر واردشده جواب می‌دهند. دو شکل رایج:

```text
Token در Header:   Authorization: Bearer <token>
Cookie:            مرورگر خودکار می‌فرستد (و برای Cross-Origin: credentials: "include")
```

```js
await fetch("https://api.example.com/me", {
  headers: { Authorization: `Bearer ${token}` }
});

await fetch("https://api.example.com/me", {
  credentials: "include"      // ارسال Cookie در درخواست Cross-Origin
});
```

وقتی سرور `401` برگرداند، یعنی توکن نیست یا منقضی شده (مثلاً کاربر را به صفحه‌ی ورود ببر). `403` یعنی وارد شده، ولی اجازه ندارد.

> Token را کجا نگه داریم، چطور Refresh کنیم و چه خطرهایی دارد را در فصل Authentication به‌طور کامل می‌بینی. فعلاً کافی است بدانی `Authorization` و `credentials` کجا قرار می‌گیرند.

---

# 24. ساخت یک API Client قابل استفاده‌ی مجدد

اگر در هر Function دوباره `fetch`، `ok`، `json` و Error Handling بنویسی، کد تکراری و ناسازگار می‌شود. بهتر است همه‌ی منطق مشترک را در **یک جا** بگذاری:

**`api/client.js`**

```js
const BASE_URL = "https://jsonplaceholder.typicode.com";

export class HttpError extends Error {
  constructor(status, message, data) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.data = data;
  }
}

export async function requestRaw(
  path,
  { method = "GET", body, params, headers, signal } = {}
) {
  const url = new URL(path, BASE_URL);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    }
  }

  const options = {
    method,
    signal,
    headers: { Accept: "application/json", ...headers }
  };

  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    // لغو عمدی خطای واقعی نیست؛ همان را بالا بفرست
    if (error.name === "AbortError" || error.name === "TimeoutError") throw error;
    throw new Error("اتصال به سرور برقرار نشد. اینترنت خود را بررسی کن.");
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");

  const data =
    response.status === 204 ? null :
    isJson ? await response.json() :
    await response.text();

  if (!response.ok) {
    throw new HttpError(
      response.status,
      data?.message ?? `خطای سرور (${response.status})`,
      data
    );
  }

  return { data, headers: response.headers };
}

export async function request(path, options) {
  const { data } = await requestRaw(path, options);
  return data;
}
```

**`api/users.js`** (لایه‌ی سرویس: هر Function یک کار مشخص)

```js
import { request, requestRaw } from "./client.js";

export const getUsers = (options) => request("/users", options);

export const getUser = (id, options) => request(`/users/${id}`, options);

export async function getUserPosts(userId, page = 1, limit = 5, options) {
  const { data, headers } = await requestRaw("/posts", {
    ...options,
    params: { userId, _page: page, _limit: limit }
  });

  return { posts: data, total: Number(headers.get("x-total-count")) };
}

export const createPost = (post, options) =>
  request("/posts", { ...options, method: "POST", body: post });

export const deletePost = (id, options) =>
  request(`/posts/${id}`, { ...options, method: "DELETE" });
```

**استفاده در UI (بدون اطلاع از `fetch` و جزئیات)**

```js
import { getUser } from "./api/users.js";
import { HttpError } from "./api/client.js";

try {
  const user = await getUser(1);
  console.log(user.name);
} catch (error) {
  if (error instanceof HttpError && error.status === 404) {
    console.log("کاربر پیدا نشد");
  } else {
    console.log(error.message);
  }
}
```

مزیت‌ها:

- آدرس پایه، Header، `JSON.stringify`، `ok`، خطای شبکه و `204` فقط **یک بار** نوشته شده
- UI فقط با Functionهای معنادار (`getUser`) کار می‌کند
- برای تغییر آدرس سرور یا افزودن توکن، فقط یک فایل را عوض می‌کنی
- `HttpError` اجازه می‌دهد بر اساس `status` تصمیم بگیری
- `signal` به همه‌ی Functionها منتقل می‌شود، پس لغو درخواست همه‌جا ممکن است

---

# 25. دیباگ درخواست‌ها: تب Network

در DevTools (کلید `F12`) تب **Network** مهم‌ترین ابزار این فصل است. صفحه را Refresh کن یا درخواست را بزن، سپس روی درخواست کلیک کن:

| تب | چه چیزی نشان می‌دهد |
|----|---------------------|
| **Headers** | آدرس، متد، Status، Request Headers و Response Headers |
| **Payload** | داده‌ای که فرستاده‌ای (Query و Body) |
| **Preview / Response** | جواب سرور (خوانا یا خام) |
| **Timing** | زمان هر مرحله (انتظار سرور، دانلود) |

ترفندها:

- فیلتر **Fetch/XHR** فقط درخواست‌های API را نشان می‌دهد.
- کلیک راست روی درخواست ← **Copy ← Copy as fetch** برای تکرار همان درخواست در Console.
- **Throttling** (مثلاً Slow 4G یا Offline) برای دیدن حالت‌های Loading و Error.
- **Disable cache** برای جلوگیری از جواب‌های کش‌شده در حین تست.

**خطاهای رایج و معنی آن‌ها:**

| نشانه | علت محتمل |
|-------|-----------|
| `TypeError: Failed to fetch` | اینترنت، آدرس اشتباه، یا CORS (متن CORS را در Console بخوان) |
| `has been blocked by CORS policy` | سرور اجازه‌ی Origin تو را نداده |
| `404` | آدرس یا Path اشتباه است |
| `Unexpected token '<' ... not valid JSON` | سرور HTML فرستاده (آدرس اشتباه یا صفحه‌ی خطا) |
| `401` / `403` | توکن نیست یا اجازه نداری |
| `422` / `400` | داده‌ی ارسالی معتبر نیست؛ Body پاسخ را بخوان |
| درخواست `pending` می‌ماند | سرور جواب نمی‌دهد؛ Timeout لازم است |

---

# 26. نکات مهم فصل

### نکته ۱

`fetch` برای ۴xx و ۵xx خطا پرتاب **نمی‌کند**؛ همیشه `response.ok` را چک کن.

---

### نکته ۲

Body پاسخ را فقط یک بار می‌شود خواند (`json()` / `text()`).

---

### نکته ۳

برای ارسال JSON سه چیز لازم است: `method`، `Content-Type: application/json` و `JSON.stringify`.

---

### نکته ۴

URL را با `URL` و `URLSearchParams` بساز؛ ورودی کاربر را مستقیم به رشته نچسبان.

---

### نکته ۵

درخواست‌های مستقل را همزمان بفرست (`Promise.all` / `allSettled`).

---

### نکته ۶

برای جستجو، Debounce و `AbortController` را با هم به‌کار ببر.

---

### نکته ۷

داده‌ی سرور را با `textContent` نمایش بده، نه `innerHTML`.

---

### نکته ۸

هیچ کلید یا رمز محرمانه‌ای در کد Front-End نگذار.

---

### نکته ۹

منطق مشترک `fetch` را در یک API Client بگذار و UI را از جزئیات HTTP جدا کن.

---

# 27. اشتباهات رایج

1. فراموش کردن چک `response.ok` و ادامه با داده‌ی خراب.
2. فراموش کردن `await response.json()` (کار با Promise به‌جای داده).
3. خواندن Body بیش از یک بار.
4. فراموش کردن `JSON.stringify` یا `Content-Type` هنگام ارسال JSON.
5. تنظیم دستی `Content-Type` هنگام ارسال `FormData`.
6. چسباندن ورودی کاربر به URL بدون Encode.
7. فرستادن `GET` با Body.
8. فراموش کردن `try` / `catch` و ایجاد Unhandled Rejection.
9. نمایش `AbortError` به‌عنوان خطا برای کاربر.
10. درخواست در هر `input` بدون Debounce.
11. نشان‌دادن جواب قدیمی به‌خاطر Race Condition.
12. خواندن `response.json()` برای پاسخ `204`.
13. ریختن داده‌ی سرور مستقیم در `innerHTML` (XSS).
14. نگه‌داشتن کلید محرمانه در کد Front-End.
15. تکرار کامل منطق `fetch` در هر Function.
16. تصور اینکه `mode: "no-cors"` مشکل CORS را حل می‌کند.
17. فراموش کردن حالت‌های Loading، Error و Empty.
18. فراموش کردن غیرفعال کردن دکمه هنگام ارسال (ثبت دوباره‌ی `POST`).

---

# 28. تمرین‌ها

## سطح ۱ — JSON و URL

### تمرین ۱

خروجی را پیش‌بینی کن:

```js
console.log(JSON.stringify({ a: undefined, b: () => 1, c: new Date(0), d: NaN, e: [undefined] }));
```

---

### تمرین ۲

یک Object کاربر (نام، سن، لیست مهارت‌ها) را با `JSON.stringify` به رشته و دوباره با `JSON.parse` به Object تبدیل کن. چرا `JSON.parse("{'a': 1}")` خطا می‌دهد؟

---

### تمرین ۳

با `URL` و `searchParams` آدرس زیر را بساز و چاپ کن (جستجوی `salad & fries`، صفحه‌ی ۲، تعداد ۱۰):

```text
https://api.example.com/search?...
```

---

## سطح ۲ — `fetch`

### تمرین ۴

لیست کاربران را از `/users` بگیر و فقط نام‌ها را در Console چاپ کن.

---

### تمرین ۵

کاربر با `id = 9999` را بگیر. `status` و `ok` را چاپ کن. چرا خطا پرتاب نشد؟

---

### تمرین ۶

خروجی را پیش‌بینی کن:

```js
try {
  const response = await fetch("https://jsonplaceholder.typicode.com/users/9999");
  console.log("A");
  console.log(response.ok);
} catch {
  console.log("B");
}
```

---

### تمرین ۷

تابع `getUser(id)` را بنویس که برای خطای شبکه و خطای HTTP پیام فارسی مناسب پرتاب کند. با `id` معتبر، نامعتبر و با قطع اینترنت (حالت Offline در DevTools) تست کن.

---

## سطح ۳ — ارسال داده

### تمرین ۸

یک پست جدید با `POST` بساز و `status` و `id` پاسخ را چاپ کن.

---

### تمرین ۹

یک پست را با `PUT` کامل و با `PATCH` جزئی ویرایش کن و تفاوت دو درخواست را در تب Network ببین (Payload).

---

### تمرین ۱۰

پست شماره‌ی ۱ را با `DELETE` حذف کن و Status را چاپ کن.

---

## سطح ۴ — چند درخواست

### تمرین ۱۱

کاربران و پست‌ها را یک بار پشت سر هم و یک بار با `Promise.all` بگیر و با `console.time` مقایسه کن.

---

### تمرین ۱۲

سه درخواست بزن که یکی آدرس اشتباه دارد. نتیجه را یک بار با `Promise.all` و یک بار با `Promise.allSettled` ببین و تفاوت را توضیح بده.

---

## سطح ۵ — لغو، Debounce و Pagination

### تمرین ۱۳

خروجی را پیش‌بینی کن (Debounce با `delay = 200`):

```js
const log = debounce((text) => console.log(text), 200);

log("s");
log("sa");
log("sal");
// ۳۰۰ میلی‌ثانیه سکوت
log("salam");
// ۳۰۰ میلی‌ثانیه سکوت
```

---

### تمرین ۱۴

یک جعبه‌ی جستجو بساز که با Debounce و `AbortController` کاربران را فیلتر کند. نشان بده با درخواست دوم، درخواست اول لغو می‌شود (در Network وضعیت `canceled`).

---

### تمرین ۱۵

لیست پست‌ها را با دکمه‌ی «بیشتر نشان بده» (۵ تایی) نمایش بده. وقتی همه‌ی پست‌ها نمایش داده شد، دکمه پنهان شود (از `X-Total-Count` استفاده کن).

---

## سطح ۶ — API Client

### تمرین ۱۶

فایل `api/client.js` را از حفظ بنویس (`HttpError`، `requestRaw`، `request`). بعد `api/users.js` را با `getUsers`، `getUser`، `createPost` بساز.

---

### تمرین ۱۷

دو درخواست جستجو را فرض کن: درخواست قدیمی (`80ms`) و جدید (`10ms`). بدون `AbortController`، کدام نتیجه آخر در UI می‌نشیند؟ چرا؟

---

# 29. پاسخنامه‌ی مختصر (پس از تلاش خودت ببین)

**تمرین ۱:**

```text
{"c":"1970-01-01T00:00:00.000Z","d":null,"e":[null]}
```

`undefined` و Function در Object حذف می‌شوند، `Date` رشته‌ی ISO می‌شود، `NaN` و `undefined` داخل آرایه `null` می‌شوند.

**تمرین ۲:** JSON فقط دابل‌کوتیشن را می‌پذیرد؛ `'` مجاز نیست.

**تمرین ۳:**

```js
const url = new URL("https://api.example.com/search");
url.searchParams.set("q", "salad & fries");
url.searchParams.set("page", 2);
url.searchParams.set("limit", 10);

console.log(url.toString());
// https://api.example.com/search?q=salad+%26+fries&page=2&limit=10
```

**تمرین ۴:**

```js
const response = await fetch("https://jsonplaceholder.typicode.com/users");
const users = await response.json();
users.forEach((u) => console.log(u.name));
```

**تمرین ۵ و ۶:** `fetch` فقط وقتی reject می‌شود که ارتباط برقرار نشود. ۴۰۴ یک پاسخ معتبر HTTP است، پس خروجی `A` و `false` است و `B` چاپ نمی‌شود.

**تمرین ۷:** نمونه‌ی کامل در بخش ۱۲ آمده است.

**تمرین ۸ تا ۱۰:** نمونه‌ها در بخش ۱۳. (چون JSONPlaceholder ساختگی است، `POST` کد `201` و یک `id` جدید می‌دهد ولی داده ذخیره نمی‌شود.)

**تمرین ۱۱:** درخواست‌های پشت سر هم مجموع زمان‌ها و `Promise.all` حدود زمان کندترین درخواست است.

**تمرین ۱۲:** `Promise.all` با خطای یکی reject می‌شود و نتیجه‌ی بقیه را نمی‌دهد. `allSettled` وضعیت هر درخواست را جدا برمی‌گرداند. توجه کن اگر فقط `fetch` خام به‌کار ببری و `ok` را چک نکنی، حتی ۴۰۴ هم «موفق» حساب می‌شود. برای خطای HTTP حتماً `response.ok` را چک و خطا پرتاب کن.

**تمرین ۱۳:** فقط یک بار برای هر بازه‌ی سکوت اجرا می‌شود:

```text
sal
salam
```

**تمرین ۱۴ تا ۱۶:** نمونه‌ها در بخش‌های ۱۷ تا ۲۴.

**تمرین ۱۷:** درخواست قدیمی دیرتر می‌رسد، پس آخر از همه UI را بازنویسی می‌کند و نتیجه‌ی قدیمی نشان داده می‌شود (ترتیب رسیدن: جدید، بعد قدیمی). `AbortController` درخواست قدیمی را لغو می‌کند و جلوی این مشکل را می‌گیرد.

---

# 30. پروژه پایان فصل

## Users & Posts Explorer

یک برنامه‌ی کوچک بساز که با API واقعی (JSONPlaceholder) کار کند و تمام الگوهای این فصل را در عمل نشان بدهد.

**ساختار پیشنهادی:**

```text
src/
├── index.html
├── api/
│   ├── client.js     ← HttpError، requestRaw، request
│   ├── users.js      ← getUsers، getUser، getUserPosts
│   └── posts.js      ← createPost، deletePost
├── utils/
│   └── debounce.js
└── app.js            ← UI و Eventها
```

**قابلیت‌ها:**

- لیست کاربران (`GET /users`) با حالت‌های Loading، Error (با دکمه‌ی «تلاش دوباره») و Empty
- جستجوی کاربران (فیلتر روی نام) با Debounce و `AbortController`
- با کلیک روی یک کاربر، پست‌هایش (`GET /posts?userId=`) با دکمه‌ی «بیشتر نشان بده»
- فرم ساخت پست جدید (`POST`) با نمایش پیام موفقیت یا خطا و غیرفعال شدن دکمه در حین ارسال
- دکمه‌ی حذف پست (`DELETE`) که آیتم را از لیست برمی‌دارد
- نمایش تعداد کل پست‌ها از `X-Total-Count`

**محدودیت‌ها:**

- بدون فریم‌ورک و کتابخانه
- همه‌ی درخواست‌ها فقط از طریق API Client (`request` / `requestRaw`)
- ماژولار (`import` / `export`)
- نمایش داده‌ی سرور فقط با `textContent` یا `createElement` (نه `innerHTML`)
- `AbortError` نباید به‌عنوان خطا به کاربر نشان داده شود

**معیار قبولی:**

- با Live Server بدون خطای Console اجرا می‌شود.
- در حالت Offline (DevTools) پیام خطای مناسب و دکمه‌ی «تلاش دوباره» نمایش داده می‌شود.
- آدرس اشتباه (`404`) و خطای شبکه پیام‌های متفاوت دارند.
- تایپ سریع در جستجو فقط یک درخواست نهایی می‌فرستد و درخواست‌های قبلی در تب Network با وضعیت `canceled` دیده می‌شوند.
- دو بار کلیک سریع روی «ارسال پست» فقط یک درخواست می‌سازد.
- هیچ Unhandled Rejection در Console نیست.

**ایده‌های جایگزین (بعد از تمام شدن پروژه):** برنامه‌ی «وضعیت آب‌وهوا»، «اطلاعات کشورها» یا «جستجوی فیلم» با APIهای رایگان دیگر. قبل از شروع، مستندات API را بخوان و ببین کلید (API Key) لازم است یا نه.

---

# 31. چک‌لیست خودارزیابی

- [ ] API، Client و Server را توضیح می‌دهم
- [ ] اجزای Request و Response (متد، URL، Header، Body، Status) را می‌شناسم
- [ ] بخش‌های URL را می‌دانم و با `URL` / `URLSearchParams` آدرس می‌سازم
- [ ] متدهای `GET`، `POST`، `PUT`، `PATCH`، `DELETE` را درست انتخاب می‌کنم
- [ ] Status Codeهای اصلی (۲۰۰، ۲۰۱، ۲۰۴، ۴۰۰، ۴۰۱، ۴۰۳، ۴۰۴، ۵۰۰) را می‌شناسم
- [ ] با JSON کار می‌کنم و محدودیت‌های `JSON.stringify` را می‌دانم
- [ ] با `fetch` داده می‌گیرم و می‌فرستم
- [ ] می‌دانم چرا `response.ok` را باید چک کنم
- [ ] سه نوع خطا (شبکه، HTTP، تبدیل) را از هم جدا می‌کنم
- [ ] Body را فقط یک بار می‌خوانم و `clone` را می‌شناسم
- [ ] Query Parameter را امن می‌سازم
- [ ] چند درخواست را همزمان (`all` / `allSettled`) اجرا می‌کنم
- [ ] درخواست را با `AbortController` لغو می‌کنم
- [ ] Race Condition در جستجو را توضیح می‌دهم و حل می‌کنم
- [ ] Debounce را می‌نویسم و فرقش با Throttle را می‌دانم
- [ ] Pagination را پیاده‌سازی می‌کنم
- [ ] خطای CORS را می‌فهمم و می‌دانم چه کسی آن را حل می‌کند
- [ ] داده‌ی سرور را امن (`textContent`) نمایش می‌دهم
- [ ] یک API Client با `HttpError` می‌سازم
- [ ] با تب Network مشکل درخواست را پیدا می‌کنم

---

# خلاصه فصل

```text
API و HTTP
↓
Client با Request حرف می‌زند و Server با Response (Status + Headers + Body) جواب می‌دهد.

URL و Query
↓
با URL و URLSearchParams بساز؛ ورودی را Encode کن.

متدها و Status Code
↓
GET بخوان، POST بساز، PUT / PATCH ویرایش کن، DELETE حذف کن؛ ۲xx موفق، ۴xx خطای Client، ۵xx خطای Server.

JSON
↓
parse / stringify؛ دابل‌کوتیشن؛ undefined و Function و Date را مراقب باش.

fetch
↓
دو مرحله: Response، بعد Body. برای ۴۰۴ و ۵۰۰ reject نمی‌شود؛ response.ok را چک کن.

Error Handling
↓
شبکه، HTTP و تبدیل داده را جدا مدیریت کن.

AbortController و Debounce
↓
درخواست‌های قدیمی را لغو کن و تعداد درخواست‌ها را کم کن.

Pagination
↓
داده را تکه‌تکه بگیر.

CORS
↓
قاعده‌ی امنیتی مرورگر؛ سرور باید اجازه بدهد.

API Client
↓
منطق مشترک fetch در یک جا؛ UI از جزئیات HTTP جدا باشد.
```

---

# فصل بعد

با تمام شدن مباحث JavaScript، دو مرحله‌ی بعدی مسیر شروع می‌شود:

```text
Git و GitHub
Repository، Commit، Branch، Merge، Pull، Push، Pull Request، .gitignore
↓
React
Component، JSX، Props، State، Eventها، useEffect، دریافت داده از API
```

Git را قبل از React یاد می‌گیریم، چون از همین‌جا باید پروژه‌هایت را نسخه‌بندی کنی و روی GitHub بگذاری.
