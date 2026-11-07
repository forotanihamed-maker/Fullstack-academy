# جاوااسکریپت — فصل ۱: مبانی زبان

> **مرحله ۳ از مسیر فول‌استک — بخش «پایه»**
> مباحث این فصل: Variables، Data Types، Operators، Conditions، Loops، Functions
> پیش‌نیاز: HTML و CSS
> زمان پیشنهادی: ۷ تا ۱۰ روز (روزی ۱ تا ۲ ساعت تمرین)

---

## هدف فصل

بعد از این فصل باید بتوانی:

- داده‌ها را در متغیر ذخیره کنی و نوع آن‌ها را بشناسی
- با عملگرها محاسبه و مقایسه انجام بدهی
- با شرط‌ها و حلقه‌ها منطق برنامه را بنویسی
- کد تکراری را در قالب تابع جمع کنی

---

## ۱. اجرای جاوااسکریپت

جاوااسکریپت را در دو جا اجرا می‌کنیم: **مرورگر** و **Node.js**. فعلاً با مرورگر کار می‌کنیم.

**روش اول: Console مرورگر**
کلید `F12` ← تب Console.

**روش دوم: فایل HTML**

```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <title>تمرین JS</title>
  </head>
  <body>
    <script src="script.js"></script>
  </body>
</html>
```

```js
// script.js
console.log("سلام دنیا");
```

- `console.log()` برای نمایش خروجی در Console است.
- `//` کامنت تک‌خطی و `/* ... */` کامنت چندخطی است.
- هر دستور را می‌شود با `;` تمام کرد. در این دوره از `;` استفاده می‌کنیم.

---

## ۲. متغیرها (Variables)

متغیر یعنی **یک نام برای نگهداری یک مقدار**.

```js
let age = 25;
const name = "علی";
var city = "تهران"; // قدیمی؛ استفاده نکن
```

### ‏`let` / `const` / `var`

| کلمه | قابل تغییر؟ | Scope | توصیه |
|------|-------------|-------|-------|
| `const` | خیر (دوباره مقداردهی نمی‌شود) | Block | **پیش‌فرض** |
| `let` | بله | Block | وقتی مقدار باید عوض شود |
| `var` | بله | Function | استفاده نکن |

```js
const PI = 3.14;
PI = 3; // ❌ TypeError: Assignment to constant variable

let score = 0;
score = 10; // ✅
```

> **قاعده:** همیشه با `const` شروع کن. فقط اگر مجبور شدی مقدار را عوض کنی، `let` بگذار.

### قواعد نام‌گذاری

- فقط حروف، عدد، `_` و `$`؛ با عدد شروع نمی‌شود
- حساس به بزرگی و کوچکی حروف است (`age` ≠ `Age`)
- سبک رایج: **camelCase** → `userName`, `totalPrice`
- نام باید معنی داشته باشد: `price` بهتر از `p`

```js
let userName = "سارا"; // ✅
let 1user = "x";       // ❌
let user-name = "x";   // ❌
```

---

## ۳. انواع داده (Data Types)

### انواع Primitive

| نوع | مثال | توضیح |
|-----|------|-------|
| `string` | `"سلام"` | متن |
| `number` | `42`, `3.14` | عدد (صحیح و اعشاری) |
| `boolean` | `true`, `false` | درست / غلط |
| `undefined` | `undefined` | مقدار نگرفته |
| `null` | `null` | «هیچ» عمدی |
| `bigint` | `123n` | اعداد خیلی بزرگ |
| `symbol` | `Symbol("id")` | شناسه یکتا (فعلاً مهم نیست) |

نوع **Non-primitive**: `object` (شامل آرایه و تابع) — در فصل‌های بعد.

### ‏`typeof`

```js
typeof "hi";      // "string"
typeof 10;        // "number"
typeof true;      // "boolean"
typeof undefined; // "undefined"
typeof null;      // "object"  ← باگ تاریخی زبان!
typeof [];        // "object"
typeof function(){}; // "function"
```

### رشته‌ها (String)

```js
const first = "علی";
const last = 'رضایی';

// Template Literal (با بک‌تیک)
const msg = `سلام ${first} ${last}`;
console.log(msg); // سلام علی رضایی

// چندخطی
const text = `خط اول
خط دوم`;
```

متدهای پرکاربرد:

```js
const s = "  Hello World  ";

s.length;            // 15
s.trim();            // "Hello World"
s.toUpperCase();     // "  HELLO WORLD  "
s.toLowerCase();
s.includes("World"); // true
s.startsWith("  H"); // true
s.indexOf("o");      // 6
s.slice(2, 7);       // "Hello"
s.replace("World", "JS"); // "  Hello JS  "
s.split(" ");        // آرایه‌ای از تکه‌ها
```

> رشته‌ها **تغییرناپذیر (immutable)** هستند؛ متدها رشته جدید برمی‌گردانند.

### اعداد (Number)

```js
10 / 3;      // 3.3333333333333335
10 % 3;      // 1  (باقی‌مانده)
2 ** 3;      // 8  (توان)

0.1 + 0.2;   // 0.30000000000000004  ← خطای اعشار
(0.1 + 0.2).toFixed(2); // "0.30"  (خروجی string است!)

Number.isInteger(5);   // true
Math.round(4.6);       // 5
Math.floor(4.9);       // 4
Math.ceil(4.1);        // 5
Math.max(1, 9, 3);     // 9
Math.random();         // عدد تصادفی بین 0 و 1
```

حالت‌های خاص: `NaN` (Not a Number) و `Infinity`.

```js
"abc" * 2;            // NaN
Number.isNaN(NaN);    // true
```

### ‏`undefined` در برابر `null`

```js
let a;
console.log(a); // undefined → هنوز مقدار نگرفته

let b = null;   // برنامه‌نویس عمداً گفته «خالی است»
```

### تبدیل نوع (Type Conversion)

```js
Number("42");     // 42
Number("abc");    // NaN
Number("");       // 0
parseInt("42px"); // 42
parseFloat("3.5kg"); // 3.5

String(123);      // "123"
(123).toString(); // "123"

Boolean(0);       // false
Boolean("hi");    // true
```

**مقادیر Falsy** (فقط این ۸ مورد false می‌شوند):

`false`، `0`، `-0`، `0n`، `""`، `null`، `undefined`، `NaN`

بقیه همه **Truthy** هستند (حتی `"0"` و `[]` و `{}`).

---

## ۴. عملگرها (Operators)

### حسابی

```js
+  -  *  /  %  **
let x = 5;
x++;  // 6
x--;  // 5
```

### انتساب

```js
let n = 10;
n += 5;  // n = n + 5
n -= 3;
n *= 2;
n /= 4;
n %= 3;
```

### مقایسه

```js
5 > 3;    // true
5 >= 5;   // true
5 < 3;    // false

5 == "5";   // true   ← مقایسه با تبدیل نوع (خطرناک)
5 === "5";  // false  ← مقایسه دقیق (توصیه می‌شود)
5 != "5";   // false
5 !== "5";  // true
```

> **قاعده:** همیشه از `===` و `!==` استفاده کن.

### منطقی

```js
true && false;  // false  (AND)
true || false;  // true   (OR)
!true;          // false  (NOT)
```

**Short-circuit:** عملگرهای منطقی مقدار برمی‌گردانند، نه فقط true/false.

```js
const username = "" || "مهمان";   // "مهمان"
const ok = user && user.name;     // اگر user وجود داشت، name
```

### ‏Nullish Coalescing و Optional Chaining

```js
const count = 0;
count || 10;  // 10  ← 0 را falsy می‌داند
count ?? 10;  // 0   ← فقط null و undefined را کنار می‌گذارد

const user = { profile: { name: "علی" } };
user.profile?.name;   // "علی"
user.address?.city;   // undefined (به‌جای خطا)
```

### عملگر شرطی (Ternary)

```js
const age = 20;
const status = age >= 18 ? "بزرگسال" : "نوجوان";
```

---

## ۵. شرط‌ها (Conditions)

### ‏`if / else if / else`

```js
const score = 85;

if (score >= 90) {
  console.log("عالی");
} else if (score >= 70) {
  console.log("خوب");
} else if (score >= 50) {
  console.log("قبول");
} else {
  console.log("مردود");
}
```

### ‏`switch`

```js
const day = 3;

switch (day) {
  case 1:
    console.log("شنبه");
    break;
  case 2:
    console.log("یکشنبه");
    break;
  case 3:
    console.log("دوشنبه");
    break;
  default:
    console.log("نامعتبر");
}
```

> بدون `break` اجرا به case بعدی «سر می‌خورد» (fall-through).

### الگوی Early Return (در تابع‌ها)

```js
function check(age) {
  if (age < 18) return "ممنوع";
  return "مجاز";
}
```

---

## ۶. حلقه‌ها (Loops)

### ‏`for`

```js
for (let i = 0; i < 5; i++) {
  console.log(i); // 0 1 2 3 4
}
```

سه بخش: **مقدار اولیه؛ شرط ادامه؛ تغییر**.

### ‏`while` و `do...while`

```js
let n = 3;
while (n > 0) {
  console.log(n);
  n--;
}

let k = 0;
do {
  console.log(k); // حداقل یک‌بار اجرا می‌شود
  k++;
} while (k < 3);
```

### ‏`break` و `continue`

```js
for (let i = 1; i <= 10; i++) {
  if (i === 3) continue; // این دور را رد کن
  if (i === 6) break;    // حلقه را تمام کن
  console.log(i);        // 1 2 4 5
}
```

### ‏`for...of` (برای مقادیر)

```js
for (const ch of "سلام") {
  console.log(ch);
}
```

> روی آرایه‌ها در فصل بعد بیشتر کار می‌کنیم.

### حلقه تو در تو

```js
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    console.log(`${i} × ${j} = ${i * j}`);
  }
}
```

⚠️ **حلقه بی‌نهایت:** اگر شرط هیچ‌وقت false نشود، مرورگر هنگ می‌کند.

---

## ۷. توابع (Functions)

تابع یعنی **یک بلوک کد نام‌دار که می‌شود چندبار صدایش زد**.

### Function Declaration

```js
function greet(name) {
  return `سلام ${name}`;
}

greet("علی"); // "سلام علی"
```

### Function Expression

```js
const greet = function (name) {
  return `سلام ${name}`;
};
```

### Arrow Function

```js
const greet = (name) => {
  return `سلام ${name}`;
};

// کوتاه‌تر (return ضمنی)
const greet2 = (name) => `سلام ${name}`;
const square = (n) => n * n;
```

### پارامتر و آرگومان

```js
function add(a, b) { // a و b پارامتر
  return a + b;
}
add(2, 3);           // 2 و 3 آرگومان
```

### مقدار پیش‌فرض

```js
function greet(name = "مهمان") {
  return `سلام ${name}`;
}
greet(); // "سلام مهمان"
```

### Rest Parameters

```js
function sum(...numbers) {
  let total = 0;
  for (const n of numbers) total += n;
  return total;
}
sum(1, 2, 3, 4); // 10
```

### ‏`return`

- تابع بعد از `return` متوقف می‌شود.
- بدون `return`، مقدار `undefined` برمی‌گردد.

```js
function test() {
  return 1;
  console.log("هرگز اجرا نمی‌شود");
}
```

### Scope (دامنه متغیر) — مقدماتی

```js
const globalVar = "همه‌جا";

function demo() {
  const local = "فقط اینجا";
  console.log(globalVar); // ✅
}

console.log(local); // ❌ ReferenceError
```

متغیر `let`/`const` فقط داخل **همان بلوک `{ }`** وجود دارد.

### توابع خالص (ایده‌ی خوب)

تابع خوب: ورودی می‌گیرد، خروجی برمی‌گرداند، و چیز بیرونی را تغییر نمی‌دهد.

```js
// ✅ خوب
const addTax = (price) => price * 1.09;

// ❌ بد (به متغیر بیرونی وابسته است)
let tax = 1.09;
const addTax2 = (price) => price * tax;
```

---

## ۸. اشتباهات رایج مبتدی‌ها

1. استفاده از `=` به‌جای `===` در شرط
   ```js
   if (x = 5) {} // انتساب است، نه مقایسه!
   ```
2. فراموش کردن `return` در تابع
3. تغییر دادن `const` ‌ها
4. جمع شدن رشته با عدد:
   ```js
   "5" + 3;  // "53"
   "5" - 3;  // 2
   ```
5. نوشتن حلقه‌ای که تمام نمی‌شود
6. انتظار اینکه `typeof null` برابر `"null"` باشد
7. مقایسه اعشارها با `===` (به خاطر خطای اعشار)

---

## ۹. خلاصه فصل

- متغیر: `const` پیش‌فرض، `let` در صورت نیاز، `var` هرگز
- نوع‌ها: string, number, boolean, undefined, null (+ bigint, symbol)
- همیشه `===`
- Falsy: `false 0 "" null undefined NaN` (و `-0`، `0n`)
- شرط: `if/else`, `switch`, ternary
- حلقه: `for`, `while`, `do...while`, `for...of`
- تابع: Declaration, Expression, Arrow؛ پارامتر پیش‌فرض و Rest

---

## ۱۰. تمرین‌ها

### سطح ۱ — گرم‌کردن

1. متغیرهایی برای `name`, `age`, `isStudent` بساز و با Template Literal یک جمله معرفی چاپ کن.
2. خروجی هر خط را **قبل از اجرا** حدس بزن، بعد اجرا کن:
   ```js
   console.log(typeof NaN);
   console.log("10" + 5);
   console.log("10" - 5);
   console.log(0 || "x");
   console.log(0 ?? "x");
   console.log(null == undefined);
   console.log(null === undefined);
   ```
3. برنامه‌ای بنویس که یک عدد بگیرد و زوج یا فرد بودنش را چاپ کند.

### سطح ۲ — منطق

4. تابع `getGrade(score)` بنویس: ۹۰+ → `A`، ۸۰+ → `B`، ۷۰+ → `C`، ۶۰+ → `D`، کمتر → `F`.
5. تابع `isLeapYear(year)` بنویس که سال کبیسه میلادی را تشخیص بدهد.
   *(راهنما: بر ۴ بخش‌پذیر، به‌جز مضرب ۱۰۰ که بر ۴۰۰ هم باید بخش‌پذیر باشد.)*
6. با `for` مجموع اعداد ۱ تا ۱۰۰ را حساب کن.
7. جدول ضرب عدد دلخواه را چاپ کن.
8. تابع `countVowels(str)` بنویس که تعداد حروف صدادار انگلیسی (`a e i o u`) را بشمارد.

### سطح ۳ — چالش

9. **FizzBuzz:** اعداد ۱ تا ۱۰۰ را چاپ کن؛ مضرب ۳ → `Fizz`، مضرب ۵ → `Buzz`، مضرب هر دو → `FizzBuzz`.
10. تابع `isPrime(n)` بنویس و همه اعداد اول زیر ۵۰ را چاپ کن.
11. تابع `reverseString(str)` بنویس (بدون استفاده از `reverse()`).
12. تابع `isPalindrome(str)` بنویس (مثلاً `"level"`).
13. تابع `factorial(n)` را یک‌بار با حلقه بنویس.

### پروژه کوچک پایان فصل: ماشین‌حساب ساده

یک صفحه HTML بساز با دو ورودی عدد و یک `prompt` برای عملگر (`+ - * /`).
خواسته‌ها:

- تابع جداگانه برای هر عملیات
- تابع `calculate(a, op, b)` با `switch`
- جلوگیری از تقسیم بر صفر
- در صورت ورودی نامعتبر، پیام خطا

> `prompt()` و `alert()` فقط برای تمرین هستند؛ در فصل DOM این بخش را با فرم واقعی جایگزین می‌کنیم.

---

## ۱۱. پاسخ نمونه (تمرین‌های منتخب)

<details>
<summary>تمرین ۴ — getGrade</summary>

```js
function getGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
```
</details>

<details>
<summary>تمرین ۹ — FizzBuzz</summary>

```js
for (let i = 1; i <= 100; i++) {
  if (i % 15 === 0) console.log("FizzBuzz");
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else console.log(i);
}
```
</details>

<details>
<summary>تمرین ۱۰ — isPrime</summary>

```js
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}
```
</details>

<details>
<summary>تمرین ۱۱ — reverseString</summary>

```js
function reverseString(str) {
  let result = "";
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}
```
</details>

---

## ۱۲. چک‌لیست خودارزیابی

- [ ] تفاوت `let` و `const` را می‌توانم توضیح بدهم
- [ ] تفاوت `==` و `===` را می‌دانم
- [ ] مقادیر Falsy را از حفظ می‌گویم
- [ ] تفاوت `||` و `??` را می‌دانم
- [ ] یک تابع با پارامتر پیش‌فرض می‌نویسم
- [ ] حلقه تو در تو می‌نویسم
- [ ] FizzBuzz را بدون نگاه کردن حل کردم

---

**فصل بعد:** جاوااسکریپت — بخش «متوسط»: Arrays، Objects، Array Methods، Callback و Higher Order Functions
