---
title: JavaScript عمیق‌تر
---

## Scope و Closure

**Scope** یعنی متغیر کجا در دسترس است. `let` و `const` به بلوک `{ }` محدودند. **Closure** وقتی است که یک تابع به متغیرهای محیطی که در آن ساخته شده دسترسی داشته باشد، حتی بعد از پایان اجرای تابع بیرونی:

```js
function makeCounter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}
const c = makeCounter();
c(); // 1
c(); // 2
```

## Hoisting

اعلان‌های `var` و `function` به بالای scope «کشیده» می‌شوند، ولی `let` و `const` قبل از خط تعریفشان قابل استفاده نیستند و خطا می‌دهند. به همین دلیل از `let/const` استفاده کنید.

## this

مقدار `this` به **نحوه‌ی فراخوانی** بستگی دارد، نه جایی که تابع نوشته شده:

```js
const user = {
  name: "Ali",
  hello() { return "سلام " + this.name; },
};
user.hello();        // this برابر user است
const f = user.hello;
f();                 // this از دست رفته (undefined name)
```

تابع‌های فلشی (`=>`) `this` خودشان را ندارند و از محیط بیرون می‌گیرند.

## Class و Prototype

```js
class Animal {
  constructor(name) { this.name = name; }
  speak() { return this.name + " صدا می‌دهد"; }
}
class Dog extends Animal {
  speak() { return this.name + " واق واق می‌کند"; }
}
new Dog("Rex").speak();
```

زیر پوشش، `class` روی **Prototype** ساخته شده؛ هر آبجکت یک زنجیره‌ی prototype دارد که متدها را از آن می‌گیرد.

## Event Loop

JavaScript تک‌نخی است. کدهای هم‌زمان روی **Call Stack** اجرا می‌شوند؛ کارهای ناهم‌زمان (مثل `setTimeout` و `fetch`) به صف می‌روند و **Event Loop** وقتی Stack خالی شد آن‌ها را اجرا می‌کند. صف **Microtask** (مثل `Promise.then`) قبل از صف **Macrotask** (مثل `setTimeout`) اجرا می‌شود.

```js
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
// خروجی: 1  4  3  2
```

## ویژگی‌های مدرن

```js
const { name, age = 18 } = user;        // Destructuring
const all = [...a, ...b];               // Spread
const sum = (...nums) => nums.reduce((x, y) => x + y, 0); // Rest
user?.address?.city;                    // Optional Chaining
const port = config.port ?? 3000;       // Nullish Coalescing
```

مطالعه بیشتر: [javascript.info](https://javascript.info/) و [MDN – JavaScript](https://developer.mozilla.org/fa/docs/Web/JavaScript)
