# جاوااسکریپت — فصل ۴: JavaScript عمیق‌تر

> **مرحله ۴ از مسیر فول‌استک — JavaScript Deep Dive**  
> مباحث این فصل: Scope، Closure، Hoisting، `this`، Execution Context، Call Stack، Event Loop، Modules، Destructuring، Spread/Rest  
> پیش‌نیاز: فصل‌های قبلی، مخصوصاً Function، Callback، Object و Array  
> زمان پیشنهادی: ۱۰ تا ۱۴ روز

---

## هدف فصل

تا اینجا با Syntax و رفتارهای پایه JavaScript آشنا شدیم و در فصل قبل JavaScript را وارد Browser کردیم.

در این فصل می‌خواهیم بفهمیم JavaScript **در پشت صحنه چگونه کد را اجرا می‌کند**.

بعد از این فصل باید بتوانی:

- Scopeهای مختلف را تشخیص بدهی
- تفاوت `var`، `let` و `const` را درک کنی
- Hoisting و Temporal Dead Zone را توضیح بدهی
- Closure را در مثال‌های واقعی استفاده کنی
- رفتار `this` را در حالت‌های مختلف تشخیص بدهی
- Call Stack و Execution Context را درک کنی
- تفاوت کد Synchronous و Asynchronous را بفهمی
- Event Loop را در حد موردنیاز Front-End توضیح بدهی
- از Destructuring و Spread/Rest حرفه‌ای استفاده کنی
- کد را به چند Module تقسیم کنی
- تفاوت `const` و تغییرناپذیری را بشناسی و State را به‌صورت Immutable به‌روزرسانی کنی
- باگ‌های از دست رفتن `this` و Closure در حلقه را تشخیص بدهی و حل کنی
- Moduleها را در مرورگر درست اجرا کنی و خطاهای رایج آن را رفع کنی

---

# 1. Scope چیست؟

Scope مشخص می‌کند یک Variable **در کدام قسمت از برنامه قابل دسترسی است**.

مثلاً:

```js
const name = "Ali";

function sayHello() {
  console.log(name);
}

sayHello();
```

تابع می‌تواند `name` را ببیند، چون `name` در Scope بیرونی قرار دارد.

اما:

```js
function sayHello() {
  const message = "Hello";
}

console.log(message); // ❌
```

چون `message` داخل Scope تابع ساخته شده و بیرون از آن قابل دسترسی نیست.

---

# 2. Global Scope

Variableهایی که خارج از Function یا Block ساخته می‌شوند، در Scope بیرونی قرار دارند.

```js
const appName = "Shop";

function showAppName() {
  console.log(appName);
}

showAppName();
```

`appName` از داخل Function قابل دسترسی است.

> در پروژه‌های واقعی بهتر است تعداد Variableهای Global را تا حد ممکن کم نگه داری.

---

# 3. Function Scope

هر Function Scope خودش را دارد:

```js
function test() {
  const message = "Hello";

  console.log(message); // ✅
}

test();

console.log(message); // ❌
```

`message` فقط داخل Function قابل دسترسی است.

---

# 4. Block Scope

`let` و `const` به Block Scope احترام می‌گذارند.

Block معمولاً با `{}` ساخته می‌شود:

```js
if (true) {
  const message = "Hello";
  let count = 10;

  console.log(message); // ✅
}

console.log(message); // ❌
```

همین موضوع درباره حلقه‌ها نیز وجود دارد:

```js
for (let i = 0; i < 3; i++) {
  console.log(i);
}

console.log(i); // ❌
```

---

# 5. Shadowing (سایه‌اندازی متغیر)

وقتی در یک Scope داخلی متغیری با همان نام متغیر Scope بیرونی بسازی، متغیر داخلی، متغیر بیرونی را «می‌پوشاند». به این کار **Shadowing** می‌گوییم:

```js
const name = "Ali";

function test() {
  const name = "Reza"; // یک متغیر جدید است، نه تغییر متغیر بیرونی
  console.log(name);   // "Reza"
}

test();
console.log(name);     // "Ali"
```

متغیر بیرونی تغییر نکرده؛ فقط داخل `test` دیده نمی‌شود.

Shadowing با Block هم اتفاق می‌افتد:

```js
let level = 1;

if (true) {
  let level = 2;
  console.log(level); // 2
}

console.log(level);   // 1
```

**چند نکته:**

- Shadowing گاهی بی‌ضرر است، ولی نام‌های تکراری کد را گیج‌کننده می‌کند. ابزارهایی مثل ESLint با قانون `no-shadow` به آن هشدار می‌دهند.
- در **یک Scope** نمی‌توان یک نام را دو بار با `let` یا `const` تعریف کرد:

```js
let a = 1;
let a = 2; // ❌ SyntaxError: Identifier 'a' has already been declared

var b = 1;
var b = 2; // مجاز است (و یکی از دلایل خطرناک بودن var)
```

---

# 6. `var` و Scope

`var` رفتار متفاوتی دارد و Function Scoped است:

```js
if (true) {
  var message = "Hello";
}

console.log(message); // "Hello"
```

به همین دلیل در کدهای مدرن معمولاً:

```text
const
let
```

را به:

```text
var
```

ترجیح می‌دهیم.

قاعده‌ی ساده:

```text
const → مقدار دوباره Assignment نمی‌شود
let   → مقدار ممکن است تغییر کند
var   → در کد مدرن معمولاً استفاده نکن
```

---

# 7. `const` یعنی «بدون Assignment مجدد»، نه «تغییرناپذیر»

یکی از رایج‌ترین سوءتفاهم‌ها:

```js
const user = { name: "Ali" };

user.name = "Reza";  // ✅ مجاز است: محتوای Object تغییر کرد
user = {};           // ❌ TypeError: Assignment to constant variable.

const list = [1, 2];
list.push(3);        // ✅ مجاز است
```

`const` فقط **اتصال نام به مقدار** را ثابت می‌کند. اگر مقدار یک Object یا Array باشد، محتوای آن همچنان قابل تغییر است.

برای جلوگیری از تغییر Object می‌توان از `Object.freeze` استفاده کرد (فقط سطح اول را قفل می‌کند):

```js
const settings = Object.freeze({ theme: "dark" });

settings.theme = "light"; // در Strict Mode: TypeError / در حالت عادی بی‌صدا نادیده گرفته می‌شود
console.log(settings.theme); // "dark"
```

**قاعده‌ی عملی انتخاب:**

| کلیدواژه | کِی؟ |
|----------|------|
| `const` | پیش‌فرض همیشگی؛ مگر اینکه واقعاً لازم باشد Assignment مجدد انجام بدهی |
| `let` | وقتی مقدار باید عوض شود (شمارنده، متغیر حلقه، نتیجه‌ی موقت) |
| `var` | در کد مدرن استفاده نمی‌شود |

> برای نگه‌داشتن Stateهای قابل پیش‌بینی، بعداً الگوی **به‌روزرسانی Immutable** را با Spread یاد می‌گیریم؛ یعنی به‌جای تغییر Object قدیمی، یک نسخه‌ی جدید می‌سازیم.

---

# 8. Strict Mode و متغیر Global ناخواسته

اگر در JavaScript متغیری را بدون `let`، `const` یا `var` مقداردهی کنی، در حالت عادی (Sloppy Mode) یک **متغیر Global** ساخته می‌شود:

```js
function setPrice() {
  price = 100; // فراموش شدن let / const
}

setPrice();
console.log(price); // 100  ← نشت به Global
```

این از بدترین باگ‌های تایپی است، چون خطا نمی‌دهد. با **Strict Mode** این اشتباه خطا می‌شود:

```js
"use strict";

function setPrice() {
  price = 100; // ❌ ReferenceError: price is not defined
}
```

نکات مهم:

- `"use strict"` را بالای فایل یا بالای یک Function می‌نویسیم.
- **ES Moduleها** (`<script type="module">`) و بدنه‌ی **Classها** همیشه Strict هستند؛ پس در پروژه‌های مدرن معمولاً نیازی به نوشتنش نداری.

تفاوت دیگر Scope سراسری:

```js
var a = 1;
let b = 2;

console.log(window.a); // 1          (در Script معمولی، var روی window می‌نشیند)
console.log(window.b); // undefined  (let و const نمی‌نشینند)
```

داخل یک Module، حتی `var` هم Global نمی‌شود، چون هر Module Scope مخصوص خودش را دارد.

---

# 9. Lexical Scope

JavaScript از **Lexical Scope** استفاده می‌کند.

یعنی Scope یک Function بر اساس **محل نوشته‌شدن آن در کد** مشخص می‌شود، نه جایی که Function اجرا می‌شود.

```js
const name = "Ali";

function outer() {
  const message = "Hello";

  function inner() {
    console.log(message);
    console.log(name);
  }

  inner();
}

outer();
```

`inner` می‌تواند Variableهای Scopeهای بیرونی را ببیند.

---

# 10. Scope Chain

اگر JavaScript یک Variable را پیدا نکند، Scopeهای بیرونی را بررسی می‌کند.

```js
const a = 10;

function outer() {
  const b = 20;

  function inner() {
    const c = 30;

    console.log(c);
    console.log(b);
    console.log(a);
  }

  inner();
}
```

جستجو به شکل مفهومی:

```text
inner Scope
    ↓
outer Scope
    ↓
Global Scope
```

به این زنجیره، **Scope Chain** می‌گوییم.

---

# 11. Hoisting چیست؟

Hoisting به رفتار JavaScript در هنگام آماده‌سازی Execution Context مربوط است.

برای مثال:

```js
sayHello();

function sayHello() {
  console.log("Hello");
}
```

این کد کار می‌کند.

چون Declaration مربوط به Function قبل از اجرای کد در محیط اجرای آن شناخته شده است.

اما درباره `let` و `const` باید دقت بیشتری داشته باشیم.

---

# 12. Hoisting و `var`

```js
console.log(age);

var age = 25;
```

خروجی:

```text
undefined
```

می‌توان این رفتار را به شکل ساده این‌طور تصور کرد:

```js
var age;

console.log(age);

age = 25;
```

اما این فقط یک مدل ذهنی ساده برای فهم رفتار است؛ JavaScript واقعاً کد را به این شکل جابه‌جا نمی‌کند.

---

# 13. Hoisting و `let` / `const`

```js
console.log(age);

let age = 25;
```

یا:

```js
console.log(age);

const age = 25;
```

هر دو خطا می‌دهند: `ReferenceError: Cannot access 'age' before initialization`.

در این بازه، Variable در **Temporal Dead Zone (TDZ)** قرار دارد.

```text
Scope شروع می‌شود
      ↓
TDZ
      ↓
let / const initialization
      ↓
قابل استفاده
```

قاعده‌ی عملی:

> `let` و `const` را قبل از Declaration استفاده نکن.

---

# 14. پیام خطای TDZ و `typeof`

دو خطای مشابه را از هم تشخیص بده:

```text
ReferenceError: age is not defined
→ متغیر اصلاً در هیچ Scope‌ای تعریف نشده است.

ReferenceError: Cannot access 'age' before initialization
→ متغیر تعریف شده است (let/const)، ولی هنوز در TDZ است.
```

پیام دوم نشان می‌دهد `let` و `const` **Hoisted می‌شوند** (JavaScript از وجودشان خبر دارد)، ولی تا رسیدن اجرا به خط Declaration قابل استفاده نیستند.

حتی `typeof` هم در TDZ ایمن نیست:

```js
console.log(typeof notDeclared); // "undefined" ← متغیری با این نام وجود ندارد

console.log(typeof inTdz);       // ❌ ReferenceError
let inTdz = 1;
```

---

# 15. Hoisting در Function: Declaration در برابر Expression

همه‌ی Functionها یک‌جور Hoist نمی‌شوند:

```js
hello();                       // ✅ کار می‌کند
function hello() {
  console.log("Hello");
}

hi();                          // ❌ TypeError: hi is not a function
var hi = function () {
  console.log("Hi");
};

bye();                         // ❌ ReferenceError: Cannot access 'bye' before initialization
const bye = () => console.log("Bye");
```

| شکل تعریف | رفتار Hoisting |
|-----------|----------------|
| `function name() {}` (Declaration) | هم نام و هم بدنه آماده است؛ قبل از تعریف قابل فراخوانی است |
| `var name = function () {}` | فقط نام (با مقدار `undefined`) Hoist می‌شود؛ فراخوانی قبل از تعریف `TypeError` است |
| `const name = () => {}` / `let` | در TDZ است؛ فراخوانی قبل از تعریف `ReferenceError` است |

**قاعده‌ی عملی:** Functionها را قبل از استفاده تعریف کن (یا در Module جدا بگذار). به Hoisting تکیه نکن؛ ولی بدانش، چون هنگام خواندن کد دیگران و در مصاحبه‌ها زیاد مطرح می‌شود.

---

# 16. Closure چیست؟

Closure یکی از مهم‌ترین مفاهیم JavaScript است.

Closure یعنی یک Function می‌تواند به Variableهای Scope بیرونی خود دسترسی داشته باشد، حتی وقتی Function بیرونی اجرای خود را تمام کرده باشد.

مثال:

```js
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();

console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

در اینجا `count` بعد از تمام‌شدن `createCounter()` همچنان در دسترس Function داخلی است.

---

# 17. چرا Closure مهم است؟

Closure در موارد زیادی استفاده می‌شود:

```text
Private State
Callbacks
Event Handlers
Timers
Factory Functions
Memoization
Debounce
Throttle
```

مثلاً در فصل Browser با `debounce` روبه‌رو شدیم:

```js
function debounce(fn, delay = 300) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

متغیر `timer` بین اجرای Functionهای برگشتی حفظ می‌شود.

این یکی از کاربردهای Closure است.

---

# 18. Closure و Private State

می‌توانیم از Closure برای نگهداری State خصوصی استفاده کنیم:

```js
function createBankAccount() {
  let balance = 0;

  return {
    deposit(amount) {
      balance += amount;
    },

    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount();

account.deposit(100);

console.log(account.getBalance()); // 100
```

از بیرون مستقیماً به `balance` دسترسی نداریم:

```js
account.balance; // undefined
```

---

# 19. Closure مقدار را کپی نمی‌کند؛ به خود متغیر دسترسی دارد

Function داخلی یک **عکس لحظه‌ای** از مقدار نمی‌گیرد؛ به خود متغیر (در Scope بیرونی) دسترسی دارد و مقدار فعلی آن را می‌بیند:

```js
function createGreeter() {
  let name = "Ali";

  const greet = () => console.log(`Hello ${name}`);

  name = "Reza"; // بعد از ساخته‌شدن greet تغییر کرد

  return greet;
}

createGreeter()(); // "Hello Reza"
```

هر بار که Function بیرونی اجرا شود، یک **Closure مستقل** با State جدا ساخته می‌شود:

```js
const counterA = createCounter();
const counterB = createCounter();

counterA(); // 1
counterA(); // 2
counterB(); // 1  ← State جداست
```

---

# 20. Closure در حلقه: مشکل کلاسیک `var`

این یکی از معروف‌ترین سؤال‌های مصاحبه و منبع باگ‌های واقعی است:

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 0);
}
```

خروجی:

```text
3
3
3
```

دلیل: `var` فقط یک `i` در کل Function می‌سازد (Function Scope). وقتی Callbackها اجرا می‌شوند، حلقه تمام شده و `i` برابر `3` است؛ هر سه Callback همان یک متغیر را می‌بینند.

با `let` در هر دور حلقه یک `i` جدید ساخته می‌شود (Block Scope):

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 0);
}
```

خروجی:

```text
0
1
2
```

> قبل از `let`، این مشکل را با ساختن یک Function فوری (IIFE) حل می‌کردند: هر دور یک Scope جدا. امروز راه ساده `let` است.

---

# 21. الگوهای کاربردی Closure: `once` و `memoize`

**`once`: تابعی که فقط یک بار اجرا شود**

```js
function once(fn) {
  let called = false;
  let result;

  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

const init = once(() => {
  console.log("initialized");
  return 42;
});

init(); // چاپ می‌شود: initialized  → 42
init(); // چاپ نمی‌شود            → 42
```

**`memoize`: ذخیره‌ی نتیجه برای ورودی تکراری**

```js
function memoize(fn) {
  const cache = new Map();

  return function (arg) {
    if (cache.has(arg)) return cache.get(arg);

    const value = fn(arg);
    cache.set(arg, value);
    return value;
  };
}

const slowSquare = (n) => {
  console.log("computing...");
  return n * n;
};

const fastSquare = memoize(slowSquare);

fastSquare(4); // computing... → 16
fastSquare(4); // 16 (از cache؛ بدون محاسبه‌ی دوباره)
```

در هر دو مثال `called`، `result` و `cache` متغیرهای **خصوصی** Closure هستند.

**دو نکته‌ی تکمیلی**

- **حافظه:** تا وقتی Closure در دسترس باشد، متغیرهایی که به آن‌ها اشاره می‌کند هم در حافظه می‌مانند. وقتی یک Event Listener یا Closure دیگر لازم نیست، آن را حذف کن (`removeEventListener`) تا داده‌ی بزرگ بی‌دلیل نگه داشته نشود.
- **Stale Closure:** اگر Closure مقدار «قدیمی» یک متغیر را ببیند، خروجی اشتباه می‌دهد. این مشکل در React هم (در Hookها) زیاد دیده می‌شود، پس مفهوم Closure را خوب یاد بگیر.

---

# 22. Execution Context چیست؟

هر بار که JavaScript یک Function را اجرا می‌کند، محیطی برای اجرای آن ایجاد می‌شود که به آن **Execution Context** می‌گوییم.

به شکل ساده:

```text
Execution Context
│
├── Variables
├── Functions
├── Scope Information
└── this
```

دو مفهوم مهم:

```text
Global Execution Context
Function Execution Context
```

برای هر Function Call، Execution Context مخصوص آن ساخته می‌شود.

---

# 23. دو مرحله‌ی Execution Context: Creation و Execution

هر Execution Context در دو مرحله ساخته و اجرا می‌شود:

```text
۱) Creation Phase (مرحله‌ی ساخت)
   • Declarationها شناسایی می‌شوند
   • var → با مقدار undefined ثبت می‌شود
   • let / const → ثبت می‌شوند ولی در TDZ هستند
   • Function Declarationها با بدنه‌ی کامل ثبت می‌شوند
   • مقدار this و Scope Chain مشخص می‌شود

۲) Execution Phase (مرحله‌ی اجرا)
   • کد خط‌به‌خط اجرا می‌شود و مقدارها Assign می‌شوند
```

مثال:

```js
console.log(a);        // undefined
console.log(sum(2, 3)); // 5

var a = 10;

function sum(x, y) {
  return x + y;
}
```

در مرحله‌ی Creation: `a` با `undefined` و `sum` با بدنه‌ی کامل ثبت شده‌اند. در مرحله‌ی Execution: اولین خط `undefined` را می‌بیند، چون هنوز به `a = 10` نرسیده‌ایم.

**Hoisting همان اثر مرحله‌ی Creation است.** همچنین هر Function Call، یک Execution Context جدید می‌سازد که روی Call Stack قرار می‌گیرد و با `return` از Stack خارج می‌شود.

---

# 24. Call Stack چیست؟

JavaScript برای مدیریت اجرای Functionها از **Call Stack** استفاده می‌کند.

مثلاً:

```js
function one() {
  two();
}

function two() {
  three();
}

function three() {
  console.log("Hello");
}

one();
```

Stack به شکل مفهومی:

```text
three()
two()
one()
Global
```

Function آخر باید زودتر تمام شود.

به این ساختار:

```text
LIFO
Last In, First Out
```

می‌گوییم.

---

# 25. Stack Trace

وقتی خطایی رخ می‌دهد، مرورگر معمولاً Call Stack را در Error نمایش می‌دهد.

مثلاً:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  throw new Error("Something went wrong");
}

a();
```

Stack Trace کمک می‌کند بفهمیم خطا از چه مسیر Functionهایی ایجاد شده است.

---

# 26. Recursion و Stack

اگر یک Function بدون توقف خودش را صدا بزند:

```js
function count() {
  count();
}

count();
```

Call Stack دائماً بزرگ‌تر می‌شود تا جایی که مرورگر خطایی مانند:

```text
Maximum call stack size exceeded
```

ایجاد می‌کند.

پس باید در Recursion حتماً یک **Base Case** داشته باشیم.

---

# 27. Base Case: مثال Factorial و ردیابی Stack

Recursion درست دو بخش دارد: **Base Case** (شرط توقف) و **Recursive Case** (صدا زدن خود Function با ورودی کوچک‌تر):

```js
function factorial(n) {
  if (n <= 1) return 1;          // Base Case
  return n * factorial(n - 1);   // Recursive Case
}

console.log(factorial(4)); // 24
```

Call Stack هنگام اجرا (از چپ به راست، رشد Stack):

```text
factorial(4)
  factorial(3)
    factorial(2)
      factorial(1)  → 1       (Base Case؛ از اینجا برگشت شروع می‌شود)
    ← 2 * 1 = 2
  ← 3 * 2 = 6
← 4 * 6 = 24
```

**دیدن Call Stack در DevTools:** در تب Sources روی یک خط Breakpoint بگذار یا `debugger;` بنویس. هنگام توقف، پنل **Call Stack** مسیر Functionهای فعال را نشان می‌دهد.

> برای تعداد تکرار بسیار زیاد، حلقه (`for`) معمولاً امن‌تر از Recursion است، چون Stack محدود است.

---

# 28. `this` چیست؟

`this` به یک Context مربوط به Function اشاره می‌کند.

اما مقدار آن همیشه یکسان نیست.

رفتار `this` به **نحوه‌ی فراخوانی Function** بستگی دارد.

مثلاً:

```js
const user = {
  name: "Ali",

  sayHello() {
    console.log(this.name);
  }
};

user.sayHello();
```

اینجا:

```text
this → user
```

پس:

```text
this.name → "Ali"
```

---

# 29. `this` در Method

وقتی Function به عنوان Method یک Object اجرا شود:

```js
const user = {
  name: "Ali",

  showName() {
    console.log(this.name);
  }
};

user.showName();
```

در این حالت `this` به Object سمت چپ Call مربوط می‌شود.

---

# 30. `this` در Function معمولی

در Function معمولی، رفتار `this` به حالت اجرای JavaScript بستگی دارد.

در **Strict Mode**:

```js
"use strict";

function test() {
  console.log(this);
}

test();
```

مقدار `this` برابر `undefined` است.

در حالت عادی (Sloppy Mode) مقدار `this` در Call ساده، `globalThis` است (در مرورگر `window`). ES Moduleها و Classها همیشه Strict هستند.

> برای درک رفتار دقیق `this` باید همیشه به نحوه‌ی Call کردن Function توجه کنی.

---

# 31. از دست رفتن `this` (جدا کردن Method از Object)

`this` در لحظه‌ی **فراخوانی** تعیین می‌شود، نه موقع تعریف. این باعث یکی از رایج‌ترین باگ‌ها می‌شود:

```js
const user = {
  name: "Ali",

  sayHello() {
    console.log(this.name);
  }
};

user.sayHello();       // "Ali"  ← در Call نقطه (user.) وجود دارد

const fn = user.sayHello;
fn();                  // ❌ this دیگر user نیست
```

در `fn()` هیچ Object سمت چپ Call نیست؛ پس `this` همان حالت Function معمولی است (در Strict Mode `undefined` و خطا، در حالت عادی `window` که `window.name` رشته‌ی خالی است).

همین مشکل هنگام پاس دادن Method به‌عنوان Callback رخ می‌دهد:

```js
setTimeout(user.sayHello, 100); // ❌ this از دست رفت
```

دو راه‌حل رایج:

```js
setTimeout(user.sayHello.bind(user), 100);   // ۱) bind
setTimeout(() => user.sayHello(), 100);      // ۲) Arrow که Method را «با نقطه» صدا می‌زند
```

---

# 32. `this` در Event Handler مرورگر

چون در Browser زیاد با Event کار می‌کنی، این تفاوت را بدان:

```js
const button = document.querySelector("button");

// Function معمولی: this = المانی که Listener روی آن ثبت شده
button.addEventListener("click", function () {
  console.log(this);              // خود button
  this.classList.toggle("active");
});

// Arrow Function: this مستقل ندارد
button.addEventListener("click", () => {
  console.log(this);              // this بیرونی (نه button)
});
```

**توصیه‌ی عملی:** برای دسترسی به المان از `event.currentTarget` استفاده کن؛ هم روشن‌تر است و هم با Arrow Function هم کار می‌کند:

```js
button.addEventListener("click", (event) => {
  event.currentTarget.classList.toggle("active");
});
```

---

# 33. `this` در `new`، Constructor و Class

وقتی Function را با `new` صدا بزنیم، یک Object جدید ساخته می‌شود و `this` به همان Object اشاره می‌کند:

```js
function User(name) {
  this.name = name;
}

const user = new User("Ali");
console.log(user.name); // "Ali"
```

Classها همین مفهوم را با Syntax ساده‌تر نشان می‌دهند:

```js
class Product {
  constructor(title) {
    this.title = title;
  }

  show() {
    console.log(this.title);
  }
}

const product = new Product("Laptop");
product.show(); // "Laptop"
```

Methodهای Class هم اگر جدا شوند (`const fn = product.show`)، `this` را از دست می‌دهند؛ دقیقاً مثل Methodهای Object.

> Classها را در فصل‌های بعد دقیق‌تر بررسی می‌کنیم؛ فعلاً کافی است بدانی `new` یک `this` تازه می‌سازد.

---

# 34. Arrow Function و `this`

Arrow Function `this` مستقل خودش را ایجاد نمی‌کند.

```js
const user = {
  name: "Ali",

  sayHello() {
    const arrow = () => {
      console.log(this.name);
    };

    arrow();
  }
};

user.sayHello();
```

Arrow Function، `this` را از Scope بیرونی خود می‌گیرد.

به این رفتار **Lexical `this`** می‌گوییم.

---

# 35. اشتباه رایج با Arrow Function

این کد ممکن است آن چیزی نباشد که انتظار داری:

```js
const user = {
  name: "Ali",

  sayHello: () => {
    console.log(this.name);
  }
};
```

در این مثال `this` به `user` اشاره نمی‌کند؛ Arrow Function آن را از Scope بیرونی می‌گیرد (در Script معمولی `window` که `window.name` رشته‌ی خالی است، و در Module مقدار `undefined`). پس `this.name` مقدار «Ali» نیست.

برای Methodهای Object معمولاً Function معمولی مناسب‌تر است:

```js
const user = {
  name: "Ali",

  sayHello() {
    console.log(this.name);
  }
};
```

قاعده‌ی ساده:

```text
Method روی Object
→ معمولاً Function معمولی

Callback که باید this بیرونی را حفظ کند
→ Arrow Function
```

---

# 36. `call`، `apply` و `bind`

می‌توانیم `this` را برای یک Function مشخص کنیم.

```js
function introduce(city) {
  console.log(`${this.name} from ${city}`);
}

const user = {
  name: "Ali"
};

introduce.call(user, "Baku");
```

خروجی:

```text
Ali from Baku
```

با `apply` آرگومان‌ها را به صورت Array می‌دهیم:

```js
introduce.apply(user, ["Baku"]);
```

و با `bind` یک Function جدید می‌سازیم:

```js
const boundIntroduce = introduce.bind(user);

boundIntroduce("Baku");
```

---

# 37. تفاوت `call`، `apply` و `bind`

| | چه زمانی اجرا می‌شود؟ | آرگومان‌ها | خروجی |
|---|-----------------------|------------|-------|
| `call` | همان لحظه | جدا از هم (`a, b`) | نتیجه‌ی Function |
| `apply` | همان لحظه | داخل Array (`[a, b]`) | نتیجه‌ی Function |
| `bind` | بعداً (هر وقت صدا بزنی) | جدا از هم؛ می‌تواند بخشی را از قبل بدهد | یک Function جدید |

`bind` می‌تواند آرگومان‌ها را هم از قبل پر کند (**Partial Application**):

```js
function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2); // this مهم نیست → null؛ آرگومان اول = 2

console.log(double(5)); // 10
console.log(double(8)); // 16
```

**نکته:** `this` یک Function که با `bind` ساخته شده، دیگر با `call` یا `apply` عوض نمی‌شود.

---

# 38. قواعد تعیین `this` به ترتیب اولویت

برای پیدا کردن `this` همیشه **محل Call** را نگاه کن. با این ترتیب (از قوی به ضعیف) بررسی کن:

| اولویت | شکل Call | مقدار `this` |
|--------|----------|---------------|
| ۱ | `new Fn()` | Object جدیدی که ساخته می‌شود |
| ۲ | `fn.call(obj)` / `apply` / `bind` | همان `obj` که دادی |
| ۳ | `obj.fn()` | `obj` (Object سمت چپ نقطه) |
| ۴ | `fn()` (Call ساده) | `undefined` در Strict؛ `globalThis` (در مرورگر `window`) در حالت عادی |
| استثنا | Arrow Function | `this` Scope بیرونی در لحظه‌ی تعریف (با `call`/`bind` هم عوض نمی‌شود) |

**روش سریع برای پاسخ دادن:**

```text
۱) Function با new صدا زده شده؟            → Object جدید
۲) call / apply / bind دارد؟               → آن Object
۳) قبل از نام Function یک نقطه هست؟        → Object سمت چپ نقطه
۴) Arrow Function است؟                     → this بیرونی
۵) غیر از اینها                            → undefined (Strict) یا window
```

---

# 39. Synchronous چیست؟

JavaScript در حالت عادی کد را به ترتیب اجرا می‌کند:

```js
console.log("A");
console.log("B");
console.log("C");
```

خروجی:

```text
A
B
C
```

این اجرای ترتیبی را به صورت ساده **Synchronous** می‌نامیم.

---

# 40. Asynchronous چیست؟

بعضی عملیات نباید اجرای برنامه را متوقف کنند.

مثلاً:

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 1000);

console.log("C");
```

خروجی:

```text
A
C
B
```

چون Callback مربوط به `setTimeout` بعداً اجرا می‌شود.

---

# 41. Event Loop

برای درک Async JavaScript باید چند بخش را بشناسیم:

```text
Call Stack
Web APIs / Runtime APIs
Task Queue (Macrotask)
Microtask Queue
Event Loop
```

به شکل ساده:

```text
JavaScript Code
      ↓
  Call Stack
      ↓
Async API
      ↓
   Queue
      ↓
 Event Loop
      ↓
  Call Stack
```

Event Loop بررسی می‌کند آیا Call Stack خالی شده است یا نه؛ سپس Taskهای آماده را برای اجرا وارد Stack می‌کند.

---

# 42. مثال Event Loop

```js
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

console.log("3");
```

خروجی:

```text
1
3
2
```

حتی با `0` میلی‌ثانیه، Callback مربوط به Timer فوراً وسط اجرای کد Synchronous اجرا نمی‌شود.

ابتدا کد فعلی تمام می‌شود.

---

# 43. Microtask و Macrotask

در JavaScript Queueهای مختلفی وجود دارند.

مهم‌ترین چیزی که فعلاً باید بدانی:

```text
Promise callbacks
→ Microtask

setTimeout
→ Task / Macrotask
```

مثال:

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");
```

خروجی:

```text
A
D
C
B
```

چون Microtaskها قبل از Taskهای معمولی اجرا می‌شوند.

> جزئیات Event Loop را در فصل Async JavaScript و Promiseها عمیق‌تر بررسی خواهیم کرد.

---

# 44. ترتیب اجرا گام‌به‌گام: یک مثال کامل از Event Loop

```js
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

(async () => {
  console.log("4");
  await null;
  console.log("5");
})();

console.log("6");
```

خروجی:

```text
1
4
6
3
5
2
```

**توضیح گام‌به‌گام:**

1. کد Synchronous اجرا می‌شود: `1` چاپ می‌شود. `setTimeout` در Macrotask Queue ثبت می‌شود. `then` در Microtask Queue ثبت می‌شود.
2. Async Function تا اولین `await` مثل کد معمولی (Synchronous) اجرا می‌شود: `4` چاپ می‌شود. بقیه‌ی Function (بعد از `await`) به Microtask Queue می‌رود.
3. `6` چاپ می‌شود؛ Call Stack خالی شد.
4. Event Loop همه‌ی Microtaskها را به ترتیب اجرا می‌کند: `3` و بعد `5`.
5. بعد یک Macrotask: `2`.

**قاعده‌ی کلی هر «دور» Event Loop:**

```text
۱) کد Synchronous تا خالی شدن Call Stack
۲) همه‌ی Microtaskها (تا خالی شدن Microtask Queue)
۳) در صورت لزوم، رندر صفحه
۴) یک Macrotask (مثل setTimeout یا Event) → برگشت به مرحله‌ی ۱
```

> کد بعد از `await` یعنی «ادامه‌ی Function به‌صورت Microtask». این را در فصل async/await عمیق‌تر می‌بینی.

---

# 45. Event Loop و کد سنگین: چرا صفحه فریز می‌شود؟

چون فقط یک Call Stack اصلی داریم، کد Synchronous سنگین جلوی همه‌چیز را می‌گیرد؛ حتی کلیک‌ها و رندر صفحه:

```js
button.addEventListener("click", () => {
  const start = Date.now();

  while (Date.now() - start < 3000) {
    // ۳ ثانیه کار سنگین Synchronous
  }

  console.log("done");
});
```

در این ۳ ثانیه Call Stack پر است؛ Event Loop نمی‌تواند Task بعدی (کلیک دیگر، انیمیشن، رندر) را اجرا کند. صفحه «یخ می‌زند».

**راه‌حل‌ها (در فصل Performance بیشتر می‌بینی):**

- تقسیم کار سنگین به تکه‌های کوچک با `setTimeout` یا `requestAnimationFrame`
- انتقال کار سنگین به **Web Worker** (Thread جدا)
- جلوگیری از حلقه‌های بسیار بزرگ روی Thread اصلی

**نکته‌ی تکمیلی:** مقدار تأخیر `setTimeout` **حداقل** زمان انتظار است، نه زمان دقیق:

```js
setTimeout(() => console.log("timer"), 100);
// اگر Call Stack ۵۰۰ میلی‌ثانیه مشغول باشد، این Callback بعد از ۵۰۰ms یا بیشتر اجرا می‌شود
```

---

# 46. Destructuring چیست؟

Destructuring اجازه می‌دهد مقدارهای داخل Array یا Object را به شکل راحت‌تری استخراج کنیم.

Object:

```js
const user = {
  name: "Ali",
  age: 25
};

const { name, age } = user;

console.log(name);
console.log(age);
```

---

# 47. تغییر نام در Destructuring

می‌توانیم اسم Variable را تغییر دهیم:

```js
const user = {
  name: "Ali"
};

const { name: userName } = user;

console.log(userName);
```

خروجی:

```text
Ali
```

---

# 48. Default Value

اگر Property وجود نداشته باشد:

```js
const user = {
  name: "Ali"
};

const { name, age = 18 } = user;

console.log(age);
```

خروجی:

```text
18
```

---

# 49. Array Destructuring

```js
const colors = ["red", "green", "blue"];

const [first, second, third] = colors;

console.log(first);
console.log(second);
console.log(third);
```

---

# 50. رد کردن مقدارها

می‌توانیم بعضی Valueها را نادیده بگیریم:

```js
const numbers = [10, 20, 30];

const [, second] = numbers;

console.log(second); // 20
```

---

# 51. Destructuring تو در تو

Destructuring روی Objectها و Arrayهای تو در تو هم کار می‌کند:

```js
const user = {
  name: "Ali",
  address: {
    city: "Baku",
    zip: "AZ1000"
  }
};

const { address: { city } } = user;

console.log(city); // "Baku"
```

دقت کن در این شکل فقط `city` متغیر می‌شود؛ `address` خودش متغیر ساخته نمی‌شود. اگر `address` وجود نداشته باشد، خطای `TypeError` می‌گیری. برای ایمن‌تر شدن Default بده:

```js
const { address: { city } = {} } = user;
```

Array تو در تو:

```js
const [[a, b], c] = [[1, 2], 3];
console.log(a, b, c); // 1 2 3
```

---

# 52. Destructuring در پارامتر Function

یکی از پرکاربردترین الگوها (به‌خصوص در React):

```js
function showUser({ name, age = 18 }) {
  console.log(`${name} (${age})`);
}

showUser({ name: "Ali" });           // Ali (18)
showUser({ age: 30, name: "Reza" }); // Reza (30)  ← ترتیب مهم نیست
```

اگر ممکن است Function بدون آرگومان صدا زده شود، یک Default برای کل Object هم بگذار:

```js
function createUser({ name, role = "user", active = true } = {}) {
  return { name, role, active };
}

createUser();                  // { name: undefined, role: "user", active: true }
createUser({ name: "Ali" });   // { name: "Ali", role: "user", active: true }
```

مزیت‌ها: ترتیب آرگومان‌ها اهمیت ندارد، Defaultها در همان‌جا دیده می‌شوند، و Function با Parameterهای زیاد خواناتر می‌ماند. در React به‌صورت `function Card({ title, price })` می‌بینی.

---

# 53. Rest در Destructuring

`...` در Destructuring باقی‌مانده‌ها را جمع می‌کند:

```js
const [first, ...others] = [10, 20, 30, 40];
console.log(first);  // 10
console.log(others); // [20, 30, 40]

const { password, ...safeUser } = {
  name: "Ali",
  password: "123456",
  age: 25
};

console.log(safeUser); // { name: "Ali", age: 25 }
```

قانون: Rest همیشه باید **آخرین** مورد باشد. از الگوی دوم برای حذف یک Property از یک Object (بدون تغییر Object اصلی) زیاد استفاده می‌شود.

---

# 54. کاربردهای رایج Destructuring و Default

**جابه‌جایی دو متغیر:**

```js
let a = 1;
let b = 2;

[a, b] = [b, a];

console.log(a, b); // 2 1
```

**چند خروجی از یک Function:**

```js
function minMax(list) {
  return [Math.min(...list), Math.max(...list)];
}

const [min, max] = minMax([3, 9, 1]);
console.log(min, max); // 1 9
```

**Default فقط برای `undefined` اعمال می‌شود (نه `null`):**

```js
const { a = 1 } = { a: null };
console.log(a); // null

const { b = 1 } = { b: undefined };
console.log(b); // 1
```

---

# 55. Spread Operator

Spread با سه نقطه نوشته می‌شود:

```js
...
```

مثلاً:

```js
const numbers = [1, 2, 3];

const copy = [...numbers];

console.log(copy);
```

Spread عناصر Array را باز می‌کند.

---

# 56. ترکیب Arrayها

```js
const a = [1, 2];
const b = [3, 4];

const result = [...a, ...b];

console.log(result);
```

نتیجه:

```text
[1, 2, 3, 4]
```

---

# 57. Spread در Object

```js
const user = {
  name: "Ali",
  age: 25
};

const updatedUser = {
  ...user,
  age: 26
};
```

در اینجا Object جدید ساخته‌ایم.

```text
user.age
→ 25

updatedUser.age
→ 26
```

این الگو در React و مدیریت State بسیار مهم است.

---

# 58. Spread در فراخوانی Function و سایر Iterableها

Spread فقط برای Array و Object نیست؛ روی هر چیز «قابل پیمایش» (Iterable) کار می‌کند:

```js
const nums = [5, 1, 9];

console.log(Math.max(...nums));   // 9 (به‌جای Math.max.apply(null, nums))

console.log([..."salam"]);        // ["s", "a", "l", "a", "m"]

console.log([...new Set([1, 1, 2, 3])]); // [1, 2, 3] ← حذف مقدارهای تکراری
```

---

# 59. Spread فقط کپی سطحی (Shallow Copy) است

Spread فقط **سطح اول** را کپی می‌کند. Objectهای داخلی همچنان مشترک می‌مانند:

```js
const original = {
  name: "Ali",
  address: { city: "Baku" }
};

const copy = { ...original };

copy.address.city = "Tehran";

console.log(original.address.city); // "Tehran"  ← Object اصلی هم تغییر کرد!
```

`copy.address` و `original.address` به **همان Object** در حافظه اشاره می‌کنند.

**راه‌حل‌ها:**

```js
// ۱) کپی عمیق (در مرورگرهای مدرن)
const deepCopy = structuredClone(original);

// ۲) فقط بخشی که تغییر می‌کند را دوباره بساز
const updated = {
  ...original,
  address: { ...original.address, city: "Tehran" }
};
```

> `JSON.parse(JSON.stringify(obj))` هم رایج است، ولی `Date`، `undefined` و Function را درست کپی نمی‌کند.

---

# 60. به‌روزرسانی Immutable: الگوهای Array و Object

در برنامه‌های واقعی (و به‌خصوص React) State را **مستقیم تغییر نمی‌دهیم**؛ نسخه‌ی جدید می‌سازیم. این الگوها را حفظ کن:

```js
const todos = [
  { id: 1, title: "HTML", done: false },
  { id: 2, title: "CSS", done: false }
];

// افزودن
const added = [...todos, { id: 3, title: "JS", done: false }];

// حذف
const removed = todos.filter((t) => t.id !== 2);

// ویرایش یک آیتم
const toggled = todos.map((t) =>
  t.id === 1 ? { ...t, done: !t.done } : t
);

// ویرایش Object تو در تو
const state = { user: { name: "Ali", age: 25 }, theme: "light" };

const next = {
  ...state,
  user: { ...state.user, age: 26 }
};
```

**ترتیب در Spread مهم است؛ مقدار بعدی مقدار قبلی را بازنویسی می‌کند:**

```js
const user = { name: "Ali", age: 25 };

console.log({ ...user, age: 26 }); // { name: "Ali", age: 26 }
console.log({ age: 26, ...user }); // { age: 25, name: "Ali" }  ← age اصلی برنده شد
```

**چرا Immutable؟** (۱) در React تشخیص تغییر بر اساس «Object جدید» است. (۲) ردیابی باگ آسان‌تر می‌شود، چون داده‌ی قبلی دست‌نخورده می‌ماند. (۳) از تغییر ناخواسته‌ی داده‌ی مشترک جلوگیری می‌کند.

---

# 61. Rest Parameter

Rest نیز با:

```js
...
```

نوشته می‌شود.

اما در Function برای جمع‌کردن چند Argument استفاده می‌شود:

```js
function sum(...numbers) {
  return numbers;
}

console.log(sum(1, 2, 3));
```

خروجی:

```text
[1, 2, 3]
```

در اینجا `numbers` یک Array است.

---

# 62. Spread و Rest را اشتباه نگیریم

هر دو از:

```js
...
```

استفاده می‌کنند.

اما مفهومشان متفاوت است:

```text
Spread
→ باز کردن / پخش کردن

Rest
→ جمع کردن
```

مثال Spread:

```js
const arr = [1, 2, 3];

const copy = [...arr];
```

مثال Rest:

```js
function test(...args) {
  console.log(args);
}
```

---

# 63. Modules

وقتی پروژه بزرگ می‌شود، قرار دادن همه کدها در یک فایل مناسب نیست.

می‌توانیم کد را به Moduleهای مختلف تقسیم کنیم.

مثلاً:

```text
src/
├── app.js
├── utils.js
├── cart.js
└── api.js
```

---

# 64. Export

در `utils.js`:

```js
export function formatPrice(price) {
  return `${price} تومان`;
}
```

یا:

```js
const tax = 0.09;

export { tax };
```

---

# 65. Import

در `app.js`:

```js
import { formatPrice, tax } from "./utils.js";

console.log(formatPrice(100));
console.log(tax);
```

در HTML:

```html
<script type="module" src="./app.js"></script>
```

---

# 66. Default Export

می‌توانیم یک Export اصلی داشته باشیم:

```js
export default function createUser(name) {
  return {
    name
  };
}
```

سپس:

```js
import createUser from "./user.js";
```

در Default Import نام Function می‌تواند متفاوت باشد.

---

# 67. Named Export و Default Export

به صورت ساده:

```text
Named Export
→ چند مورد می‌تواند Export شود
→ هنگام Import معمولاً همان نام استفاده می‌شود

Default Export
→ یک Export پیش‌فرض
→ نام Import می‌تواند متفاوت باشد
```

مثال:

```js
import { formatPrice } from "./utils.js";
```

در مقابل:

```js
import createUser from "./user.js";
```

---

# 68. تغییر نام، `import *` و Re-export

```js
// تغییر نام هنگام Import
import { formatPrice as fp } from "./utils.js";

// همه‌ی Exportها زیر یک نام (Namespace)
import * as utils from "./utils.js";
utils.formatPrice(100);

// Default + Named همزمان
import createUser, { validateUser } from "./user.js";
```

**Re-export:** یک فایل می‌تواند Exportهای فایل‌های دیگر را جمع کند (الگوی «Barrel»):

```js
// components/index.js
export { default as Button } from "./Button.js";
export { default as Card } from "./Card.js";
export * from "./helpers.js";
```

حالا بقیه‌ی پروژه فقط از یک مسیر Import می‌کنند:

```js
import { Button, Card } from "./components/index.js";
```

---

# 69. ویژگی‌های مهم Module

- **Scope جدا:** متغیرهای هر Module به Global نشت نمی‌کنند.
- **Strict Mode خودکار:** نیازی به `"use strict"` نیست.
- **فقط یک بار اجرا می‌شود:** Module بعد از اولین Import در حافظه نگه داشته می‌شود؛ هر کس Import کند همان نمونه را می‌بیند. به همین دلیل State داخل `cart.js` بین همه‌ی فایل‌ها مشترک است.
- **Importها فقط‌خواندنی هستند:** نمی‌توانی مقدار یک Import را در فایل دیگر مستقیم عوض کنی:

```js
import { count } from "./counter.js";
count = 5; // ❌ TypeError: Assignment to constant variable.
```

- **Live Binding:** Import یک «کپی» نیست؛ به همان متغیر Module اصلی وصل است:

```js
// counter.js
export let count = 0;
export function inc() { count++; }

// app.js
import { count, inc } from "./counter.js";
inc();
console.log(count); // 1  ← مقدار به‌روز دیده می‌شود
```

- **`import` باید در سطح بالای فایل باشد** و قبل از اجرای کد پردازش می‌شود.
- **`<script type="module">` به‌صورت defer بارگذاری می‌شود** (بعد از ساخته‌شدن HTML اجرا می‌شود).
- **Import چرخه‌ای** (`a.js` از `b.js` و `b.js` از `a.js`) باگ‌های گیج‌کننده می‌سازد؛ ساختار را طوری بچین که پیش نیاید.

---

# 70. اجرای Module در مرورگر: خطاهای رایج

وقتی Module را اولین بار امتحان می‌کنی، احتمالاً به این خطاها می‌خوری:

| خطا یا مشکل | علت و راه‌حل |
|-------------|--------------|
| `Access to script ... from origin 'null' has been blocked by CORS policy` | فایل HTML را با `file://` (دابل‌کلیک) باز کرده‌ای. Module به **سرور** نیاز دارد؛ از Live Server استفاده کن. |
| `Cannot use import statement outside a module` | یادت رفته `type="module"` را روی `<script>` بگذاری. |
| `Failed to resolve module specifier` یا ۴۰۴ | مسیر اشتباه است. در مرورگر مسیر نسبی باید با `./` یا `../` شروع شود و پسوند `.js` الزامی است. |
| `onclick="myFunction()"` کار نمی‌کند | توابع Module به Global نمی‌روند. به‌جای `onclick` داخل HTML، در JS از `addEventListener` استفاده کن. |

```html
<script type="module" src="./app.js"></script>
```

---

# 71. Dynamic Import (`import()`)

`import` معمولی همیشه بالای فایل است و از ابتدا بارگذاری می‌شود. با `import()` می‌توان Module را **فقط وقتی لازم است** بارگذاری کرد:

```js
button.addEventListener("click", async () => {
  const { openChart } = await import("./chart.js");
  openChart();
});
```

- `import()` یک Promise برمی‌گرداند (در فصل Async دقیق‌تر می‌بینی).
- برای بخش‌های سنگین (نمودار، ویرایشگر) سرعت بارگذاری اولیه‌ی صفحه را بهتر می‌کند. به این کار **Code Splitting** می‌گویند.

---

# 72. چرا Module مهم است؟

Moduleها باعث می‌شوند:

```text
کد کوچک‌تر
کد قابل نگهداری‌تر
وابستگی‌ها مشخص‌تر
نام‌ها کنترل‌شده‌تر
تست کردن آسان‌تر
```

در پروژه‌های بزرگ، ساختار Moduleها اهمیت زیادی پیدا می‌کند.

---

# 73. مثال ترکیبی

فرض کن فایل `cart.js` داریم:

```js
const cart = [];

function addToCart(product) {
  cart.push(product);
}

function getCart() {
  return [...cart];
}

export { addToCart, getCart };
```

و در `app.js`:

```js
import { addToCart, getCart } from "./cart.js";

addToCart({
  id: 1,
  title: "Laptop"
});

console.log(getCart());
```

اینجا State و منطق Cart در یک Module جدا قرار گرفته‌اند.

---

# 74. نکات مهم فصل

### نکته ۱

قبل از استفاده از `let` و `const` به آن‌ها دسترسی نداشته باش:

```js
console.log(name); // ❌

const name = "Ali";
```

---

### نکته ۲

Closure را با Scope اشتباه نکن.

```text
Scope
→ محدوده دسترسی

Closure
→ حفظ دسترسی Function به Scope بیرونی
```

---

### نکته ۳

برای فهم `this` به نحوه‌ی **Call کردن Function** توجه کن.

---

### نکته ۴

Arrow Function `this` مستقل خودش را ندارد.

---

### نکته ۵

`...` دو کاربرد اصلی دارد:

```text
Spread
Rest
```

---

### نکته ۶

Event Loop به معنی اجرای هم‌زمان چند کد JavaScript نیست.

JavaScript در محیط معمول Browser یک Call Stack اصلی دارد، اما Runtime مرورگر امکانات Async را در اختیار برنامه قرار می‌دهد.

---

# 75. اشتباهات رایج

1. تصور اینکه `let` و `const` اصلاً Hoisted نمی‌شوند.
2. استفاده از Variable در TDZ.
3. تصور اینکه Closure یعنی فقط یک Function داخل Function دیگر.
4. فرض اینکه `this` همیشه به Object بیرونی اشاره می‌کند.
5. استفاده از Arrow Function برای تمام Methodهای Object.
6. تصور اینکه `setTimeout(fn, 0)` یعنی Function فوراً اجرا می‌شود.
7. اشتباه گرفتن Spread و Rest.
8. فراموش کردن `type="module"` در HTML.
9. استفاده از مسیر اشتباه در `import`.
10. قرار دادن تمام منطق پروژه در یک فایل.
11. فکر کردن اینکه `const` یعنی Object تغییرناپذیر.
12. استفاده از `var` در حلقه و انتظار یک `i` مستقل برای هر Callback.
13. جدا کردن Method از Object (یا پاس دادنش به `setTimeout`) و از دست دادن `this`.
14. کپی یک Object تو در تو با Spread و انتظار کپی عمیق.
15. تغییر مستقیم (Mutate) State به‌جای ساخت نسخه‌ی جدید.
16. باز کردن پروژه‌ی Module با `file://` به‌جای سرور محلی.
17. استفاده از `onclick` داخل HTML برای تابعی که در Module تعریف شده.
18. اجرای کار سنگین Synchronous در Event Handler و انتظار پاسخ‌گو ماندن صفحه.

---

# 76. تمرین‌ها

## سطح ۱ — Scope و Hoisting

### تمرین ۱

خروجی را قبل از اجرا حدس بزن:

```js
let name = "Ali";

function test() {
  let name = "Reza";
  console.log(name);
}

test();
console.log(name);
```

---

### تمرین ۲

تفاوت این دو را بررسی کن:

```js
var a = 10;
let b = 20;
```

داخل یک `if` مقدار جدیدی تعریف کن و بررسی کن کدام Variable بیرون از Block قابل دسترسی است.

---

### تمرین ۳

کد زیر چرا خطا می‌دهد؟

```js
console.log(age);
let age = 20;
```

---

## سطح ۲ — Closure

### تمرین ۴

تابعی به نام `createCounter` بنویس که:

- مقدار اولیه `0` باشد
- هر بار Function برگشتی اجرا شد، عدد یکی زیاد شود
- مقدار جدید را برگرداند

خروجی مورد انتظار:

```text
1
2
3
4
```

---

### تمرین ۵

یک `createWallet` بساز که:

```text
deposit()
withdraw()
getBalance()
```

داشته باشد.

مقدار `balance` نباید مستقیماً از بیرون قابل تغییر باشد.

---

## سطح ۳ — `this`

### تمرین ۶

خروجی را پیش‌بینی کن:

```js
const user = {
  name: "Ali",

  sayHello() {
    console.log(this.name);
  }
};

user.sayHello();
```

سپس Method را به یک Variable منتقل کن و رفتار `this` را بررسی کن.

---

### تمرین ۷

یک Object به نام `product` بساز که Method زیر را داشته باشد:

```js
showInfo()
```

این Method باید با استفاده از `this` نام و قیمت محصول را چاپ کند.

---

## سطح ۴ — Destructuring و Spread/Rest

### تمرین ۸

از Object زیر:

```js
const user = {
  name: "Ali",
  age: 25,
  city: "Baku"
};
```

با Destructuring، `name` و `city` را استخراج کن.

---

### تمرین ۹

دو Array را با Spread ترکیب کن:

```js
const frontend = ["HTML", "CSS"];
const backend = ["Node.js", "Express"];
```

خروجی:

```text
["HTML", "CSS", "Node.js", "Express"]
```

---

### تمرین ۱۰

تابعی به نام `sum` بنویس که هر تعداد عدد دریافت کند:

```js
sum(1, 2, 3);
sum(10, 20, 30, 40);
```

و مجموع را برگرداند.

از Rest Parameter استفاده کن.

---

## سطح ۵ — Modules

### تمرین ۱۱

دو فایل بساز:

```text
math.js
app.js
```

در `math.js` دو Function به نام‌های:

```text
add
multiply
```

بساز و Export کن.

سپس در `app.js` آن‌ها را Import و استفاده کن.

## سطح ۶ — پیش‌بینی خروجی (Scope، Closure، Event Loop، `this`)

### تمرین ۱۲

خروجی هر دو حلقه را پیش‌بینی کن. بعد حلقه‌ی اول را **بدون تغییر `var` به `let`** طوری اصلاح کن که `0 1 2` چاپ کند.

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0);
}
```

---

### تمرین ۱۳

خروجی چیست؟ کدام خط خطا می‌دهد و چرا؟

```js
console.log(typeof a);
console.log(typeof b);

var a = 1;
let b = 2;
```

---

### تمرین ۱۴

ترتیب خروجی را پیش‌بینی کن:

```js
console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => console.log("C"));

setTimeout(() => console.log("D"), 0);

Promise.resolve().then(() => console.log("E"));

console.log("F");
```

---

### تمرین ۱۵

چرا این کد درست کار نمی‌کند؟ دو راه برای اصلاحش بنویس:

```js
const counter = {
  count: 0,
  inc() {
    this.count++;
  }
};

const inc = counter.inc;
inc();

console.log(counter.count);
```

---

## سطح ۷ — Destructuring و به‌روزرسانی Immutable

### تمرین ۱۶

با **یک** Destructuring تو در تو، `customerName`، `city` و `firstItem` را استخراج کن:

```js
const order = {
  id: 7,
  customer: { name: "Ali", address: { city: "Baku" } },
  items: ["Laptop", "Mouse", "Keyboard"]
};
```

---

### تمرین ۱۷

تابع `createProduct` را بنویس که یک Object بگیرد و با Destructuring در پارامتر، مقدار پیش‌فرض `price = 0` و `inStock = true` داشته باشد. باید بدون آرگومان هم کار کند.

---

### تمرین ۱۸

با Rest فیلد `password` را از Object زیر حذف کن (بدون تغییر `user`). بعد `city` را بدون Mutate تغییر بده و ثابت کن `user` اصلی تغییر نکرده است:

```js
const user = {
  name: "Ali",
  password: "123456",
  address: { city: "Baku" }
};
```

---

### تمرین ۱۹

آرایه‌ی `todos` را بدون `push`، `splice` یا Assignment مستقیم به عناصر:

- یک Task جدید اضافه کن
- Task با `id: 2` را حذف کن
- وضعیت `done` برای `id: 1` را برعکس کن

---

## سطح ۸ — ساخت ابزار با Closure

### تمرین ۲۰

تابع `once(fn)` را بنویس (مثل بخش «الگوهای کاربردی Closure») و تست کن که Function ورودی فقط یک بار اجرا شود.

---

### تمرین ۲۱

تابع `memoize(fn)` را بنویس و با یک تابع «کند» تست کن که برای ورودی تکراری دوباره محاسبه نمی‌شود.

---

### تمرین ۲۲

تابع `createLogger(prefix)` را بنویس که یک Function برگرداند و هر پیام را با پیشوند چاپ کند:

```js
const apiLog = createLogger("API");
apiLog("Loaded"); // [API] Loaded
```

---

# آیا این فصل را بلدم؟

**سؤالات مفهومی**

1. تفاوت Scope و Closure چیست؟
2. چرا با `const` می‌توان Property یک Object را تغییر داد ولی نمی‌توان خود متغیر را Assign کرد؟
3. TDZ چیست و چه خطایی می‌دهد؟
4. چرا حلقه‌ی `var` با `setTimeout` سه بار `3` چاپ می‌کند؟
5. `this` در Arrow Function و Function معمولی هنگام استفاده به‌عنوان Method Object چه فرقی دارد؟
6. چرا Callback یک Promise قبل از `setTimeout(fn, 0)` اجرا می‌شود؟
7. چرا Spread «کپی عمیق» نمی‌سازد و راه‌حل چیست؟
8. چرا باز کردن یک پروژه‌ی Module با `file://` خطای CORS می‌دهد؟

---

# پاسخنامه‌ی مختصر (پس از تلاش خودت ببین)

**تمرین ۱:** اول `Reza` و بعد `Ali` (Shadowing).

**تمرین ۲:** `var a` در بیرون `if` هم قابل دسترسی است؛ `let b` فقط داخل Block (بیرون `ReferenceError`).

**تمرین ۳:** `let age` در TDZ است: `ReferenceError: Cannot access 'age' before initialization`.

**تمرین ۴:**

```js
function createCounter() {
  let count = 0;
  return () => ++count;
}

const counter = createCounter();
counter(); // 1
counter(); // 2
counter(); // 3
counter(); // 4
```

**تمرین ۵:**

```js
function createWallet(initial = 0) {
  let balance = initial;

  return {
    deposit(amount) {
      balance += amount;
    },
    withdraw(amount) {
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
    },
    getBalance() {
      return balance;
    }
  };
}
```

**تمرین ۶:** `user.sayHello()` مقدار `Ali` را چاپ می‌کند. بعد از `const fn = user.sayHello; fn();` در Strict Mode و Module خطای `TypeError` (چون `this` برابر `undefined` است)، و در Script معمولی `window.name` یعنی رشته‌ی خالی چاپ می‌شود.

**تمرین ۷:**

```js
const product = {
  title: "Laptop",
  price: 30000000,
  showInfo() {
    console.log(`${this.title}: ${this.price}`);
  }
};
```

**تمرین ۸:** `const { name, city } = user;`

**تمرین ۹:** `const all = [...frontend, ...backend];`

**تمرین ۱۰:** `const sum = (...numbers) => numbers.reduce((total, n) => total + n, 0);`

**تمرین ۱۱:**

```js
// math.js
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }

// app.js
import { add, multiply } from "./math.js";
console.log(add(2, 3), multiply(2, 3));
```

و در HTML: `<script type="module" src="./app.js"></script>` (با Live Server).

**تمرین ۱۲:** حلقه‌ی اول `3 3 3` و دومی `0 1 2`. اصلاح حلقه‌ی اول:

```js
for (var i = 0; i < 3; i++) {
  ((n) => setTimeout(() => console.log(n), 0))(i);
}
```

**تمرین ۱۳:** اولی `"undefined"` چاپ می‌کند (`var` با `undefined` Hoist شده). خط دوم `ReferenceError` می‌دهد، چون `b` در TDZ است و `typeof` هم ایمن نیست.

**تمرین ۱۴:** `A F C E B D` (ابتدا Synchronous، بعد همه‌ی Microtaskها، بعد Timerها).

**تمرین ۱۵:** با `inc()` جدا شده، `this` دیگر `counter` نیست. در Strict/Module خطای `TypeError`؛ در Script معمولی `counter.count` همان `0` می‌ماند و ناخواسته `window.count` ساخته می‌شود. راه‌حل‌ها: `const inc = counter.inc.bind(counter)` یا `() => counter.inc()`.

**تمرین ۱۶:**

```js
const {
  customer: { name: customerName, address: { city } },
  items: [firstItem]
} = order;
```

**تمرین ۱۷:**

```js
function createProduct({ title, price = 0, inStock = true } = {}) {
  return { title, price, inStock };
}
```

**تمرین ۱۸:**

```js
const { password, ...safeUser } = user;

const updated = {
  ...user,
  address: { ...user.address, city: "Tehran" }
};

console.log(user.address.city); // "Baku" (بدون تغییر)
```

**تمرین ۱۹:**

```js
const added = [...todos, { id: 3, title: "JS", done: false }];
const removed = todos.filter((t) => t.id !== 2);
const toggled = todos.map((t) => (t.id === 1 ? { ...t, done: !t.done } : t));
```

**تمرین ۲۰ تا ۲۲:** نمونه‌ی `once` و `memoize` در همین فصل آمده است. برای `createLogger`:

```js
function createLogger(prefix) {
  return (message) => console.log(`[${prefix}] ${message}`);
}
```

**سؤالات مفهومی (خلاصه):**

1. Scope محدوده‌ی دسترسی به متغیر است؛ Closure یعنی Function حتی بعد از پایان Function بیرونی به Scope بیرونی دسترسی دارد.
2. `const` اتصال نام به مقدار را قفل می‌کند، نه محتوای Object را.
3. بازه‌ای بین شروع Scope تا Declaration برای `let`/`const`؛ استفاده در آن `ReferenceError` می‌دهد.
4. `var` یک `i` مشترک دارد و Callbackها بعد از پایان حلقه اجرا می‌شوند.
5. Arrow `this` مستقل ندارد و از Scope بیرونی می‌گیرد؛ Function معمولی `this` را از نحوه‌ی Call (Object سمت چپ نقطه) می‌گیرد.
6. Promise Callback در Microtask Queue است و قبل از Macrotask مثل `setTimeout` اجرا می‌شود.
7. Spread فقط سطح اول را کپی می‌کند؛ راه‌حل `structuredClone` یا بازسازی بخش تو در تو.
8. Module به Origin معتبر نیاز دارد؛ `file://` Origin نامعتبر (`null`) است. با Live Server باز کن.

---


# 77. پروژه پایان فصل

## Mini Task Manager

یک برنامه کوچک مدیریت کار بساز.

ساختار پیشنهادی:

```text
src/
├── app.js
├── state.js
├── task.js
└── utils.js
```

قابلیت‌ها:

- افزودن Task
- حذف Task
- تغییر وضعیت Task
- نمایش تعداد Taskها
- استفاده از Moduleها
- استفاده از Destructuring
- استفاده از Spread/Rest
- حداقل یک Closure
- استفاده درست از `this` در صورت نیاز

لازم نیست برنامه را پیچیده کنی.

هدف اصلی پروژه، **استفاده از مفاهیم فصل** است.

### الزامات تکمیلی پروژه

- **هدف:** تمرین Module، Closure، Destructuring، Spread/Rest و به‌روزرسانی Immutable در یک برنامه‌ی کوچک واقعی.
- **نقش فایل‌ها:**
  - `state.js`: لیست Taskها را با Closure خصوصی نگه می‌دارد و فقط از طریق Functionهای Export‌شده (`getTasks`، `addTask`، `removeTask`، `toggleTask`) قابل تغییر است.
  - `task.js`: تابع `createTask({ title, done = false })` که Task جدید با `id` یکتا می‌سازد.
  - `utils.js`: توابع کمکی مثل ساخت `id` یا فرمت متن «۳ کار باقی مانده».
  - `app.js`: اتصال به DOM و Eventها.
- **نمونه‌ی شروع `state.js`:**

```js
// state.js
let tasks = [];

export function getTasks() {
  return [...tasks]; // کپی، تا بیرون مستقیم تغییرش ندهد
}

export function addTask(task) {
  tasks = [...tasks, task];
}
```

- **محدودیت‌ها:**
  - بدون فریم‌ورک و بدون کتابخانه.
  - هیچ متغیر Global ناخواسته (فایل‌ها Module باشند).
  - هیچ `push`، `splice` یا Assignment مستقیم روی Taskهای ذخیره‌شده (فقط `map`، `filter` و Spread).
  - حداقل یک Function با Destructuring در پارامتر.
  - در Event Handlerها از `event.currentTarget` استفاده شود، نه `this`.
- **معیار قبولی:**
  - با Live Server بدون هیچ خطای Console اجرا می‌شود.
  - افزودن، حذف و تغییر وضعیت کار می‌کند و شمارنده درست به‌روز می‌شود.
  - اگر آرایه‌ی `tasks` را با `Object.freeze` قفل کنی و برنامه خطا ندهد، یعنی هیچ‌جا Mutate نکرده‌ای.
  - `state.js` تنها جایی است که State را نگه می‌دارد.
  - هر Module یک مسئولیت مشخص دارد.
- **اختیاری:** ذخیره‌ی Taskها در `localStorage` (از فصل قبل).

---


# 78. چک‌لیست خودارزیابی

- [ ] تفاوت Global، Function و Block Scope را می‌دانم
- [ ] تفاوت `var`، `let` و `const` را می‌دانم
- [ ] Hoisting و TDZ را توضیح می‌دهم
- [ ] Scope Chain را می‌فهمم
- [ ] Closure را با یک مثال توضیح می‌دهم
- [ ] می‌دانم `this` به نحوه‌ی Call کردن Function وابسته است
- [ ] تفاوت Function معمولی و Arrow Function در `this` را می‌دانم
- [ ] مفهوم Execution Context را می‌دانم
- [ ] Call Stack را توضیح می‌دهم
- [ ] تفاوت Synchronous و Asynchronous را می‌فهمم
- [ ] Event Loop را در سطح پایه توضیح می‌دهم
- [ ] Destructuring Object و Array را انجام می‌دهم
- [ ] Spread و Rest را از هم تشخیص می‌دهم
- [ ] Named Export و Default Export را می‌دانم
- [ ] یک پروژه را به چند Module تقسیم می‌کنم

- [ ] تفاوت `const` و تغییرناپذیری را می‌دانم
- [ ] Shadowing را تشخیص می‌دهم
- [ ] مشکل `var` در حلقه با Closure را توضیح می‌دهم و حل می‌کنم
- [ ] دلیل از دست رفتن `this` را می‌دانم و با `bind` یا Arrow حل می‌کنم
- [ ] ترتیب اجرای Synchronous، Microtask و Macrotask را پیش‌بینی می‌کنم
- [ ] Destructuring تو در تو و در پارامتر Function را می‌نویسم
- [ ] تفاوت کپی سطحی و عمیق را می‌دانم
- [ ] به‌روزرسانی Immutable را با Spread، `map` و `filter` انجام می‌دهم
- [ ] خطاهای رایج اجرای Module در مرورگر را رفع می‌کنم

---


# خلاصه فصل

مفاهیم اصلی این فصل:

```text
Scope
↓
مشخص می‌کند Variable کجا قابل دسترسی است.

Hoisting
↓
به آماده‌سازی Declarationها قبل از اجرای کد مربوط است.

Closure
↓
Function می‌تواند به Scope بیرونی خود دسترسی را حفظ کند.

this
↓
به Context و نحوه‌ی Call شدن Function وابسته است.

Execution Context
↓
محیط اجرای Function و کد JavaScript است.

Call Stack
↓
ساختار مدیریت اجرای Functionهاست.

Event Loop
↓
هماهنگ‌کننده اجرای Callbackهای Async با Call Stack است.

Destructuring
↓
استخراج ساده‌تر Valueها از Object و Array.

Spread
↓
باز کردن Valueها.

Rest
↓
جمع کردن چند Value در یک Array.

Modules
↓
تقسیم کد به بخش‌های مستقل و قابل مدیریت.

Immutable Update
↓
به‌جای تغییر مستقیم، نسخه‌ی جدید بساز (Spread، map، filter).
```

---

# فصل بعد

در فصل بعد وارد بخش مهم **Async JavaScript** می‌شویم:

```text
Callback
Promise
async / await
fetch
HTTP
Request / Response
Error Handling
AbortController
Parallel Requests
Promise.all
Promise.allSettled
Promise.race
```

و از اینجا JavaScript را به APIها و داده‌های واقعی متصل می‌کنیم.

