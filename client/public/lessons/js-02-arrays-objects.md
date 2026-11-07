# جاوااسکریپت — فصل ۲: آرایه‌ها، آبجکت‌ها و توابع مرتبه بالا

> **مرحله ۳ از مسیر فول‌استک — بخش «متوسط»**
> مباحث این فصل: Arrays، Objects، Array Methods، Functions، Callback، Higher Order Functions
> پیش‌نیاز: فصل ۱ (متغیرها، شرط‌ها، حلقه‌ها، توابع)
> زمان پیشنهادی: ۸ تا ۱۲ روز (این فصل مهم‌ترین فصل پایه‌ی جاوااسکریپت است؛ عجله نکن)

---

## هدف فصل

بعد از این فصل باید بتوانی:

- مجموعه‌ای از داده‌ها را در آرایه نگه داری و با آن کار کنی
- داده‌های ساختاریافته (کاربر، محصول، سفارش) را با آبجکت مدل‌سازی کنی
- با `map`، `filter`، `reduce` و بقیه‌ی متدها بدون حلقه‌ی دستی داده را پردازش کنی
- بفهمی «تابع به‌عنوان مقدار» یعنی چه و Callback چگونه کار می‌کند

> تقریباً تمام داده‌هایی که در پروژه‌های واقعی (API، دیتابیس، React) با آن‌ها کار می‌کنی، **آرایه‌ای از آبجکت‌ها** هستند. این فصل پایه‌ی همه‌ی آن‌هاست.

---

## ۱. آرایه‌ها (Arrays)

آرایه یعنی **لیست مرتب‌شده از مقادیر**. هر مقدار یک **اندیس (index)** دارد که از `0` شروع می‌شود.

### ساخت و دسترسی

```js
const fruits = ["سیب", "موز", "پرتقال"];

fruits[0];            // "سیب"
fruits[2];            // "پرتقال"
fruits[10];           // undefined (خطا نمی‌دهد)
fruits.length;        // 3
fruits[fruits.length - 1]; // "پرتقال" (آخرین عضو)
fruits.at(-1);        // "پرتقال" (روش مدرن)
```

آرایه می‌تواند انواع مختلف داشته باشد، ولی در عمل معمولاً هم‌نوع نگهشان می‌داریم:

```js
const mixed = [1, "متن", true, null, [1, 2]];
```

### تغییر مقدار

```js
const nums = [10, 20, 30];
nums[1] = 99;        // [10, 99, 30]
```

> `const` یعنی **متغیر** را نمی‌شود دوباره مقداردهی کرد، نه اینکه **محتوای** آرایه ثابت باشد. در بخش «Reference» بیشتر می‌گوییم.

### اضافه و حذف عضو

| متد | کار | محل | مقدار برگشتی |
|-----|-----|-----|--------------|
| `push(x)` | اضافه | انتها | طول جدید |
| `pop()` | حذف | انتها | عضو حذف‌شده |
| `unshift(x)` | اضافه | ابتدا | طول جدید |
| `shift()` | حذف | ابتدا | عضو حذف‌شده |

```js
const stack = [1, 2, 3];
stack.push(4);     // [1, 2, 3, 4]
stack.pop();       // 4  → [1, 2, 3]
stack.unshift(0);  // [0, 1, 2, 3]
stack.shift();     // 0  → [1, 2, 3]
```

### ‏`splice` — حذف/افزودن/جایگزینی در هر جا

```js
// splice(شروع، تعداد حذف، ...موارد جدید)
const arr = ["a", "b", "c", "d"];

arr.splice(1, 2);          // ["b", "c"] حذف شد → arr = ["a", "d"]
arr.splice(1, 0, "X");     // درج در اندیس 1 → ["a", "X", "d"]
arr.splice(0, 1, "Z");     // جایگزینی → ["Z", "X", "d"]
```

### ‏`slice` — کپی بخشی از آرایه (بدون تغییر اصل)

```js
const a = [1, 2, 3, 4, 5];
a.slice(1, 3);   // [2, 3]   (از اندیس 1 تا قبل از 3)
a.slice(2);      // [3, 4, 5]
a.slice(-2);     // [4, 5]
a.slice();       // کپی کامل
```

> ⚠️ `slice` و `splice` اسم‌های شبیه ولی رفتار متفاوت دارند: **slice نمی‌چسبد به اصل، splice اصل را تغییر می‌دهد.**

### جستجو در آرایه

```js
const colors = ["red", "green", "blue", "green"];

colors.indexOf("green");      // 1
colors.lastIndexOf("green");  // 3
colors.indexOf("pink");       // -1 (پیدا نشد)
colors.includes("blue");      // true
```

### ‏`join` و `split`

```js
["a", "b", "c"].join("-");   // "a-b-c"
"a-b-c".split("-");          // ["a", "b", "c"]
[1, 2, 3].join("");          // "123"
```

### ترکیب و معکوس

```js
[1, 2].concat([3, 4]);       // [1, 2, 3, 4]
[1, 2, 3].reverse();         // [3, 2, 1]  ← اصل را تغییر می‌دهد!
```

### آرایه‌ی تو در تو و ‏`flat`

```js
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
];
matrix[1][2];            // 6

[1, [2, [3]]].flat();    // [1, 2, [3]]
[1, [2, [3]]].flat(2);   // [1, 2, 3]
[1, [2, [3]]].flat(Infinity);
```

### ‏`Array.isArray`

```js
typeof [];            // "object"  (گمراه‌کننده)
Array.isArray([]);    // true
Array.isArray({});    // false
```

### پیمایش ساده

```js
const items = ["الف", "ب", "پ"];

for (let i = 0; i < items.length; i++) {
  console.log(i, items[i]);
}

for (const item of items) {
  console.log(item);
}

for (const [index, item] of items.entries()) {
  console.log(index, item);
}
```

---

## ۲. ارجاع (Reference) در برابر مقدار (Value)

این مفهوم **منبع بسیاری از باگ‌ها** است.

**Primitive ها (عدد، رشته، boolean) با «کپی مقدار» جابه‌جا می‌شوند:**

```js
let a = 10;
let b = a;
b = 20;
console.log(a); // 10  (تغییری نکرد)
```

**آرایه و آبجکت با «کپی ارجاع» جابه‌جا می‌شوند:**

```js
const original = [1, 2, 3];
const copy = original;   // هر دو به یک آرایه اشاره می‌کنند
copy.push(4);

console.log(original);   // [1, 2, 3, 4]  ← تغییر کرد!
console.log(original === copy); // true
```

**مقایسه‌ی دو آرایه‌ی هم‌محتوا:**

```js
[1, 2] === [1, 2];  // false  (دو آرایه‌ی جدا در حافظه)
```

### کپی واقعی (Shallow Copy)

```js
const arr = [1, 2, 3];

const c1 = arr.slice();
const c2 = [...arr];      // Spread (در فصل ۴ کامل‌تر می‌خوانیم)
const c3 = Array.from(arr);
```

### کپی عمیق (Deep Copy)

اگر داخل آرایه، آرایه یا آبجکت دیگری هست، کپی سطحی کافی نیست:

```js
const data = [{ id: 1 }, { id: 2 }];

const shallow = [...data];
shallow[0].id = 99;
console.log(data[0].id); // 99 ← آبجکت داخلی مشترک است!

const deep = structuredClone(data); // کپی عمیق
```

---

## ۳. آبجکت‌ها (Objects)

آبجکت یعنی **مجموعه‌ای از جفت‌های «کلید: مقدار»**. برای نمایش یک «چیز» با ویژگی‌های مختلف استفاده می‌شود.

### ساخت و دسترسی

```js
const user = {
  name: "علی",
  age: 28,
  isAdmin: false,
  skills: ["HTML", "CSS", "JS"],
  address: {
    city: "تهران",
    zip: "12345",
  },
};

// Dot notation
user.name;               // "علی"
user.address.city;       // "تهران"

// Bracket notation
user["age"];             // 28
const key = "name";
user[key];               // "علی"  ← وقتی کلید در متغیر است
```

**چه موقع Bracket؟**

- کلید در یک متغیر است
- کلید فاصله یا کاراکتر خاص دارد: `obj["first name"]`

### افزودن، تغییر، حذف

```js
user.email = "ali@example.com";   // افزودن
user.age = 29;                    // تغییر
delete user.isAdmin;              // حذف
```

### بررسی وجود کلید

```js
"name" in user;                  // true
Object.hasOwn(user, "name");     // true (روش مدرن)
user.phone === undefined;        // true (ولی اگر مقدار undefined باشد گمراه‌کننده است)
```

### Shorthand و Computed Property

```js
const name = "سارا";
const age = 22;

const person = { name, age };      // = { name: name, age: age }

const field = "score";
const obj = { [field]: 100 };      // { score: 100 }
```

### متد (تابع داخل آبجکت)

```js
const calculator = {
  value: 0,
  add(n) {
    this.value += n;
    return this;
  },
  reset() {
    this.value = 0;
  },
};

calculator.add(5);
console.log(calculator.value); // 5
```

> `this` یعنی «آبجکتی که متد را صدا زده». توضیح کامل در فصل ۴ می‌آید؛ فعلاً فقط بدان داخل متد آبجکت به خود آبجکت اشاره می‌کند.
> ⚠️ در Arrow Function مقدار `this` متفاوت است؛ برای متدهای آبجکت از شکل معمولی استفاده کن.

### ‏Optional Chaining (برای جلوگیری از خطا)

```js
const u = { name: "علی" };

u.address.city;     // ❌ TypeError: Cannot read properties of undefined
u.address?.city;    // ✅ undefined
u.address?.city ?? "نامشخص"; // "نامشخص"
```

### ‏`Object.keys / values / entries`

```js
const product = { title: "کتاب", price: 120, stock: 5 };

Object.keys(product);     // ["title", "price", "stock"]
Object.values(product);   // ["کتاب", 120, 5]
Object.entries(product);  // [["title","کتاب"], ["price",120], ["stock",5]]
```

### پیمایش آبجکت

```js
for (const key in product) {
  console.log(key, product[key]);
}

for (const [key, value] of Object.entries(product)) {
  console.log(`${key}: ${value}`);
}
```

> برای آرایه‌ها از `for...of` استفاده کن، نه `for...in`.

### کپی و ادغام آبجکت

```js
const base = { a: 1, b: 2 };

const copy = { ...base };               // کپی سطحی
const merged = { ...base, b: 20, c: 3 }; // { a:1, b:20, c:3 }
const copy2 = Object.assign({}, base);
const deep = structuredClone(base);
```

### تغییر‌ناپذیر کردن: `Object.freeze`

```js
const config = Object.freeze({ mode: "prod" });
config.mode = "dev";   // بی‌اثر (در strict mode خطا)
```

### ‏JSON (مقدمه)

برای ارسال داده بین کلاینت و سرور از **JSON** استفاده می‌شود:

```js
const user = { name: "علی", age: 28 };

const text = JSON.stringify(user);
// '{"name":"علی","age":28}'

const obj = JSON.parse(text);
// { name: "علی", age: 28 }
```

قواعد JSON: کلیدها حتماً با `"` دو‌تایی، بدون کامنت، بدون کاما‌ی آخر، بدون تابع.

---

## ۴. آرایه‌ای از آبجکت‌ها (الگوی اصلی داده)

```js
const products = [
  { id: 1, title: "کتاب",    price: 120, category: "book",  inStock: true },
  { id: 2, title: "خودکار",  price: 15,  category: "stationery", inStock: true },
  { id: 3, title: "دفتر",    price: 40,  category: "stationery", inStock: false },
  { id: 4, title: "لپ‌تاپ",  price: 9000, category: "tech", inStock: true },
];

products[0].title;      // "کتاب"
products.length;        // 4
```

از این‌جا به بعد، تمام متدهای آرایه روی همین داده تمرین می‌شوند.

---

## ۵. توابع به‌عنوان مقدار + Callback

در جاوااسکریپت **تابع هم یک مقدار است**؛ مثل عدد و رشته:

- می‌شود در متغیر ریخت
- می‌شود به تابع دیگر **پاس داد**
- می‌شود از تابع **برگرداند**

```js
const sayHi = () => console.log("سلام");

const fn = sayHi;     // فقط ارجاع؛ اجرا نشد
fn();                 // اجرا شد
```

### ‏Callback چیست؟

**Callback تابعی است که به تابع دیگر پاس می‌دهیم تا آن تابع در زمان مناسب صدایش بزند.**

```js
function repeat(times, action) {
  for (let i = 0; i < times; i++) {
    action(i);        // اینجا callback صدا زده می‌شود
  }
}

repeat(3, (i) => console.log("بار", i));
// بار 0 / بار 1 / بار 2
```

نکته‌ی مهم: **پرانتز نذار** وقتی می‌خواهی تابع را پاس بدهی.

```js
repeat(3, myFunc);     // ✅ ارجاع پاس شد
repeat(3, myFunc());   // ❌ تابع همین حالا اجرا شد و نتیجه‌اش پاس شد
```

### نمونه‌های واقعی Callback

```js
setTimeout(() => console.log("۲ ثانیه گذشت"), 2000);

button.addEventListener("click", () => console.log("کلیک شد")); // فصل DOM
```

---

## ۶. توابع مرتبه بالا (Higher-Order Functions)

تابع مرتبه بالا یعنی تابعی که **حداقل یکی از این دو را انجام می‌دهد:**

1. تابع دیگری را به‌عنوان آرگومان می‌گیرد
2. تابعی را برمی‌گرداند

### مثال ۱: تابع می‌گیرد

```js
function applyTwice(fn, value) {
  return fn(fn(value));
}

applyTwice((x) => x * 2, 5);   // 20
```

### مثال ۲: تابع برمی‌گرداند (Function Factory)

```js
function multiplier(factor) {
  return (n) => n * factor;
}

const double = multiplier(2);
const triple = multiplier(3);

double(10);   // 20
triple(10);   // 30
```

> این الگو بر پایه‌ی **Closure** کار می‌کند (فصل ۴). فعلاً فقط بپذیر که تابع داخلی `factor` را «یادش می‌ماند».

---

## ۷. متدهای آرایه (Array Methods)

متدهای زیر هسته‌ی کار روزمره‌ی تو هستند. همه تابع مرتبه بالا هستند و یک **Callback** می‌گیرند.

داده‌ی مثال:

```js
const numbers = [1, 2, 3, 4, 5];
```

### ‏`forEach` — اجرای کار برای هر عضو

```js
numbers.forEach((n, index) => {
  console.log(index, n);
});
```

- چیزی برنمی‌گرداند (`undefined`)
- نمی‌شود با `break` متوقفش کرد

### ‏`map` — تبدیل هر عضو به چیز دیگر

**آرایه‌ی جدید هم‌طول** برمی‌گرداند.

```js
numbers.map((n) => n * 2);       // [2, 4, 6, 8, 10]

products.map((p) => p.title);    // ["کتاب", "خودکار", "دفتر", "لپ‌تاپ"]

products.map((p) => ({
  ...p,
  price: p.price * 1.1,          // قیمت با ۱۰٪ افزایش
}));
```

> وقتی می‌خواهی **آبجکت** را مستقیم از Arrow Function برگردانی، آن را داخل `( )` بگذار.

### ‏`filter` — نگه داشتن اعضایی که شرط را دارند

```js
numbers.filter((n) => n % 2 === 0);      // [2, 4]

products.filter((p) => p.inStock);
products.filter((p) => p.price < 100 && p.category === "stationery");
```

### ‏`find` و `findIndex` — پیدا کردن اولین مورد

```js
products.find((p) => p.id === 3);        // { id: 3, title: "دفتر", ... }
products.find((p) => p.id === 99);       // undefined

products.findIndex((p) => p.id === 3);   // 2
products.findIndex((p) => p.id === 99);  // -1
```

`findLast` و `findLastIndex` از آخر جستجو می‌کنند.

### ‏`some` و `every` — بررسی شرط

```js
numbers.some((n) => n > 4);      // true  (حداقل یکی)
numbers.every((n) => n > 0);     // true  (همه)

products.every((p) => p.inStock); // false
```

### ‏`reduce` — کاهش آرایه به یک مقدار

```js
// reduce((انباشته، عضو) => ..., مقدار اولیه)
numbers.reduce((sum, n) => sum + n, 0);   // 15

// بیشترین قیمت
products.reduce((max, p) => (p.price > max ? p.price : max), 0);

// مجموع قیمت کالاهای موجود
products
  .filter((p) => p.inStock)
  .reduce((sum, p) => sum + p.price, 0);
```

**قدم‌به‌قدم** `numbers.reduce((sum, n) => sum + n, 0)`:

| دور | sum | n | نتیجه |
|-----|-----|---|-------|
| 1 | 0 | 1 | 1 |
| 2 | 1 | 2 | 3 |
| 3 | 3 | 3 | 6 |
| 4 | 6 | 4 | 10 |
| 5 | 10 | 5 | 15 |

**ساخت آبجکت با reduce (گروه‌بندی):**

```js
const byCategory = products.reduce((groups, p) => {
  if (!groups[p.category]) groups[p.category] = [];
  groups[p.category].push(p);
  return groups;
}, {});
// { book: [...], stationery: [...], tech: [...] }
```

> **همیشه مقدار اولیه بده.** بدون آن، اولین عضو به‌عنوان مقدار اولیه استفاده می‌شود و روی آرایه‌ی خالی خطا می‌دهد.

### ‏`sort` — مرتب‌سازی

⚠️ **`sort` به‌صورت پیش‌فرض بر اساس رشته مرتب می‌کند و آرایه‌ی اصلی را تغییر می‌دهد!**

```js
[10, 9, 1, 100].sort();                  // [1, 10, 100, 9]  ← اشتباه برای اعداد!

// Compare Function
[10, 9, 1, 100].sort((a, b) => a - b);   // [1, 9, 10, 100]  صعودی
[10, 9, 1, 100].sort((a, b) => b - a);   // [100, 10, 9, 1]  نزولی
```

قاعده‌ی Compare Function: اگر نتیجه **منفی** باشد `a` جلوتر، **مثبت** باشد `b` جلوتر، **صفر** یعنی تفاوتی نیست.

```js
// مرتب‌سازی آبجکت‌ها
products.slice().sort((a, b) => a.price - b.price);

// مرتب‌سازی متن (فارسی/انگلیسی)
names.slice().sort((a, b) => a.localeCompare(b, "fa"));
```

> برای اینکه آرایه‌ی اصلی خراب نشود، اول کپی بگیر (`slice()` یا `[...arr]`) یا از `toSorted()` استفاده کن.

### متدهای «غیرتغییردهنده» مدرن

| متد قدیمی (اصل را تغییر می‌دهد) | معادل مدرن (کپی جدید) |
|--------------------------------|----------------------|
| `sort()` | `toSorted()` |
| `reverse()` | `toReversed()` |
| `splice()` | `toSpliced()` |
| `arr[i] = x` | `with(i, x)` |

### ‏`flatMap`

```js
const sentences = ["سلام دنیا", "جاوا اسکریپت"];
sentences.flatMap((s) => s.split(" "));
// ["سلام", "دنیا", "جاوا", "اسکریپت"]
```

### ‏`Array.from` و `Array(n)`

```js
Array.from({ length: 5 }, (_, i) => i + 1);   // [1, 2, 3, 4, 5]
Array(3).fill(0);                             // [0, 0, 0]
```

### جدول مرجع: کدام متد؟

| می‌خواهم... | متد |
|------------|-----|
| روی هر عضو کاری انجام بدهم | `forEach` |
| هر عضو را تبدیل کنم | `map` |
| فقط بعضی را نگه دارم | `filter` |
| اولین مورد را پیدا کنم | `find` |
| بپرسم «آیا حداقل یکی...؟» | `some` |
| بپرسم «آیا همه...؟» | `every` |
| به یک مقدار برسم (مجموع، گروه‌بندی) | `reduce` |
| مرتب کنم | `sort` / `toSorted` |
| بدانم وجود دارد یا نه | `includes` |

### زنجیره‌ی متدها (Method Chaining)

خروجی `map` و `filter` آرایه است، پس می‌شود زنجیره‌شان کرد:

```js
const total = products
  .filter((p) => p.inStock)             // فقط موجودها
  .map((p) => p.price)                  // فقط قیمت‌ها
  .reduce((sum, price) => sum + price, 0); // جمع

const titles = products
  .filter((p) => p.category === "stationery")
  .sort((a, b) => a.price - b.price)
  .map((p) => p.title);
```

> خواناترین کد، کدی است که هر مرحله‌اش یک کار را انجام می‌دهد.

---

## ۸. ساخت متد خودمان (فهم عمیق Callback)

برای اینکه مطمئن شوی `map` و `filter` جادو نیستند، خودت بساز:

```js
function myMap(arr, callback) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(callback(arr[i], i));
  }
  return result;
}

function myFilter(arr, callback) {
  const result = [];
  for (const item of arr) {
    if (callback(item)) result.push(item);
  }
  return result;
}

myMap([1, 2, 3], (x) => x * 10);       // [10, 20, 30]
myFilter([1, 2, 3, 4], (x) => x > 2);  // [3, 4]
```

---

## ۹. اشتباهات رایج

1. **فراموش‌کردن `return` در `map`/`filter` با آکولاد:**
   ```js
   nums.map((n) => { n * 2 });       // [undefined, ...]
   nums.map((n) => { return n * 2 }); // ✅
   nums.map((n) => n * 2);            // ✅
   ```
2. **استفاده از `map` فقط برای اجرای کار** (به‌جای `forEach`) و نادیده گرفتن خروجی
3. **`sort()` بدون Compare Function روی اعداد**
4. **تغییر دادن آرایه‌ی اصلی بدون خبر** (`sort`, `reverse`, `splice`)
5. **فکر کردن اینکه `const arr` یعنی آرایه تغییر نمی‌کند**
6. **کپی کردن آرایه با `=`** (فقط ارجاع کپی می‌شود)
7. **استفاده از `reduce` بدون مقدار اولیه**
8. **`for...in` روی آرایه** (به‌جای `for...of`)
9. **دسترسی به کلید غیرموجود و بعد ادامه دادن زنجیره** (`a.b.c` وقتی `b` وجود ندارد) → از `?.` استفاده کن
10. **نوشتن `find` و انتظار آرایه** (`find` یک عضو یا `undefined` برمی‌گرداند)

---

## ۱۰. خلاصه فصل

- آرایه: لیست مرتب با اندیس از ۰؛ `push/pop/shift/unshift/splice/slice/includes/join`
- آرایه و آبجکت **ارجاعی** هستند؛ برای کپی از `slice`, `[...]`, `{...}`, `structuredClone` استفاده کن
- آبجکت: کلید-مقدار؛ `.` و `[]`؛ `Object.keys/values/entries`؛ `?.`
- Callback: تابعی که به تابع دیگر می‌دهیم
- تابع مرتبه بالا: تابع می‌گیرد یا برمی‌گرداند
- ابزار اصلی: `forEach / map / filter / find / some / every / reduce / sort`
- `map` تبدیل، `filter` انتخاب، `reduce` کاهش به یک مقدار
- زنجیره‌سازی متدها کد را کوتاه و خوانا می‌کند

---

## ۱۱. تمرین‌ها

### سطح ۱ — آرایه

1. آرایه‌ای از ۵ شهر بساز؛ عضو اول و آخر را چاپ کن، یک شهر به انتها و یکی به ابتدا اضافه کن، دومی را حذف کن.
2. تابع `sum(arr)` بنویس که جمع اعضای آرایه را برگرداند (یک‌بار با `for` و یک‌بار با `reduce`).
3. تابع `unique(arr)` بنویس که عضوهای تکراری را حذف کند. *(راهنما: `includes` یا `Set`)*
4. تابع `max(arr)` بدون `Math.max` بنویس.

### سطح ۲ — آبجکت

5. آبجکتی برای یک «کتاب» (title, author, year, tags) بساز؛ یک ویژگی اضافه کن، یکی را حذف کن، و تمام کلید-مقدارها را چاپ کن.
6. تابع `countWords(text)` بنویس که آبجکتی مثل `{ سلام: 2, دنیا: 1 }` برگرداند.
7. تابع `invert(obj)` بنویس که کلید و مقدار را عوض کند: `{a:1, b:2}` → `{1:"a", 2:"b"}`.
8. دو آبجکت را بدون تغییر اصل، ادغام کن.

### سطح ۳ — Array Methods (روی داده‌ی زیر)

```js
const students = [
  { name: "علی",   grade: 18, city: "تهران" },
  { name: "سارا",  grade: 15, city: "شیراز" },
  { name: "رضا",   grade: 20, city: "تهران" },
  { name: "مریم",  grade: 12, city: "تبریز" },
  { name: "نیما",  grade: 17, city: "شیراز" },
];
```

9. فقط اسم دانشجوها را در آرایه بگیر.
10. دانشجوهایی که نمره‌شان ≥ ۱۷ است را پیدا کن.
11. میانگین نمره‌ها را حساب کن.
12. دانشجوی با بالاترین نمره را پیدا کن.
13. دانشجوها را بر اساس نمره‌ی نزولی مرتب کن (بدون خراب کردن آرایه‌ی اصلی).
14. بررسی کن آیا همه قبول هستند (نمره ≥ ۱۰)؟ آیا کسی هست که نمره‌ی ۲۰ دارد؟
15. دانشجوها را بر اساس شهر گروه‌بندی کن: `{ تهران: [...], شیراز: [...], ... }`.
16. آرایه‌ای از رشته‌ها بساز مثل `"علی — 18"`.

### سطح ۴ — Callback و HOF

17. تابع `times(n, fn)` بنویس که `fn` را `n` بار اجرا کند.
18. تابع `pipe(...fns)` بنویس که چند تابع را به‌ترتیب روی یک مقدار اجرا کند:
    ```js
    const addOne = (x) => x + 1;
    const double = (x) => x * 2;
    pipe(addOne, double)(5); // 12
    ```
19. تابع `once(fn)` بنویس که `fn` فقط بار اول اجرا شود.
20. `myReduce` را مثل `myMap` پیاده‌سازی کن.

### پروژه‌ی پایان فصل: مدیریت سبد خرید (در Console)

با آرایه‌ی `products` بالا این‌ها را پیاده کن:

- `cart` یک آرایه‌ی خالی است
- `addToCart(id)`: اگر محصول موجود بود اضافه کند؛ اگر قبلاً در سبد بود `qty` را زیاد کند
- `removeFromCart(id)`
- `getTotal()`: جمع کل (قیمت × تعداد) با `reduce`
- `getSummary()`: آرایه‌ای از رشته‌ها مثل `"کتاب × 2 = 240"`
- محصول ناموجود به سبد اضافه نشود
- هیچ‌کدام از توابع، آرایه‌ی `products` را تغییر ندهند

> همین منطق را در فصل‌های DOM و React با رابط کاربری واقعی دوباره می‌سازیم.

---

## ۱۲. پاسخ نمونه (تمرین‌های منتخب)

<details>
<summary>تمرین ۳ — unique</summary>

```js
const unique = (arr) => [...new Set(arr)];

// بدون Set
function unique2(arr) {
  const result = [];
  for (const item of arr) {
    if (!result.includes(item)) result.push(item);
  }
  return result;
}
```
</details>

<details>
<summary>تمرین ۶ — countWords</summary>

```js
function countWords(text) {
  return text
    .split(" ")
    .filter(Boolean)
    .reduce((counts, word) => {
      counts[word] = (counts[word] ?? 0) + 1;
      return counts;
    }, {});
}
```
</details>

<details>
<summary>تمرین ۱۱ تا ۱۵ — Array Methods</summary>

```js
// 11. میانگین
const avg = students.reduce((s, st) => s + st.grade, 0) / students.length;

// 12. بهترین دانشجو
const best = students.reduce((top, st) => (st.grade > top.grade ? st : top));

// 13. مرتب‌سازی نزولی
const sorted = [...students].sort((a, b) => b.grade - a.grade);

// 14.
const allPassed = students.every((s) => s.grade >= 10);
const hasPerfect = students.some((s) => s.grade === 20);

// 15. گروه‌بندی
const byCity = students.reduce((acc, st) => {
  (acc[st.city] ??= []).push(st);
  return acc;
}, {});
```
</details>

<details>
<summary>تمرین ۱۸ — pipe</summary>

```js
const pipe = (...fns) => (value) =>
  fns.reduce((result, fn) => fn(result), value);
```
</details>

<details>
<summary>تمرین ۱۹ — once</summary>

```js
function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}
```
</details>

<details>
<summary>پروژه — سبد خرید (هسته‌ی منطق)</summary>

```js
let cart = [];

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product || !product.inStock) return;

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    cart = cart.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    );
  } else {
    cart = [...cart, { ...product, qty: 1 }];
  }
}

const removeFromCart = (id) => {
  cart = cart.filter((item) => item.id !== id);
};

const getTotal = () =>
  cart.reduce((sum, item) => sum + item.price * item.qty, 0);

const getSummary = () =>
  cart.map((item) => `${item.title} × ${item.qty} = ${item.price * item.qty}`);
```
</details>

---

## ۱۳. چک‌لیست خودارزیابی

- [ ] فرق `slice` و `splice` را می‌دانم
- [ ] می‌دانم چرا `const copy = arr` کپی واقعی نیست
- [ ] آبجکت را با `.` و `[]` می‌خوانم و با `Object.entries` پیمایش می‌کنم
- [ ] از `?.` و `??` درست استفاده می‌کنم
- [ ] Callback و تابع مرتبه بالا را با زبان خودم توضیح می‌دهم
- [ ] `map / filter / reduce` را بدون نگاه کردن می‌نویسم
- [ ] `sort` را با Compare Function درست استفاده می‌کنم
- [ ] `myMap` و `myFilter` را خودم پیاده کرده‌ام
- [ ] پروژه‌ی سبد خرید را بدون کمک کامل کرده‌ام

---

**فصل بعد:** جاوااسکریپت در مرورگر — DOM، Events، Forms، Event Delegation، LocalStorage و SessionStorage
