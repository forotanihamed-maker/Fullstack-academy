---
title: JavaScript پایه
---

## متغیرها

با `let` و `const` متغیر تعریف می‌کنیم. اگر مقدار هرگز تغییر نمی‌کند از `const` استفاده کنید.

```js
const name = "Ali";
let age = 20;
age = age + 1;

function greet(user) {
  return "Hello " + user;
}
console.log(greet(name));
```

## انواع داده

`string`، `number`، `boolean`، `null`، `undefined` و `object`. برای دیدن نوع یک مقدار از `typeof` استفاده می‌شود.

مطالعه بیشتر: [MDN – یادگیری JavaScript](https://developer.mozilla.org/fa/docs/Learn/JavaScript)
