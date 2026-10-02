---
title: JavaScript در مرورگر
---

مرورگر صفحه‌ی HTML را به یک درخت از آبجکت‌ها به نام **DOM** تبدیل می‌کند و JavaScript می‌تواند آن را بخواند و تغییر دهد.

## انتخاب و تغییر المان‌ها

```js
const title = document.querySelector("h1");
title.textContent = "عنوان جدید";
title.classList.add("active");

const btn = document.createElement("button");
btn.textContent = "ثبت";
document.body.append(btn);
```

## رویدادها (Events)

```js
btn.addEventListener("click", () => {
  console.log("کلیک شد");
});
```

### Event Delegation

به‌جای گذاشتن شنونده روی هر آیتم یک لیست، یک شنونده روی والد می‌گذاریم:

```js
list.addEventListener("click", (e) => {
  if (e.target.matches("li")) {
    e.target.classList.toggle("done");
  }
});
```

## فرم‌ها

```js
form.addEventListener("submit", (e) => {
  e.preventDefault();               // جلوگیری از رفرش صفحه
  const value = input.value.trim();
  console.log(value);
});
```

## LocalStorage

```js
localStorage.setItem("user", JSON.stringify({ name: "Ali" }));
const user = JSON.parse(localStorage.getItem("user"));
```

فقط رشته ذخیره می‌شود، پس برای آبجکت‌ها `JSON.stringify` و `JSON.parse` لازم است.

## امنیت: XSS

اگر متنی را که کاربر وارد کرده با `innerHTML` در صفحه بگذارید، کاربر می‌تواند کد مخرب تزریق کند (**XSS**). برای نمایش متن کاربر از `textContent` استفاده کنید.

مطالعه بیشتر: [MDN – DOM](https://developer.mozilla.org/fa/docs/Web/API/Document_Object_Model)
