---
title: فرم‌ها
---

فرم راه گرفتن اطلاعات از کاربر است: ثبت‌نام، ورود، جستجو، نظرسنجی. همه‌ی اینها با تگ `<form>` شروع می‌شوند.

## ساختار پایه

```html
<form action="/register" method="post">
  <label for="email">ایمیل</label>
  <input type="email" id="email" name="email" required>

  <label for="pass">رمز عبور</label>
  <input type="password" id="pass" name="password" minlength="8" required>

  <button type="submit">ثبت‌نام</button>
</form>
```

- `action`: آدرسی که داده به آن ارسال می‌شود.
- `method`: روش ارسال. **GET** داده را در آدرس می‌گذارد (مناسب جستجو). **POST** داده را در بدنه‌ی درخواست می‌فرستد (مناسب ثبت‌نام و رمز).
- `name` روی هر فیلد **اجباری** است؛ بدون آن مقدار فیلد ارسال نمی‌شود.

## Label؛ مهم‌ترین نکته‌ی دسترس‌پذیری

`<label for="email">` را با `id="email"` جفت کنید. با این کار با کلیک روی متن، فیلد فعال می‌شود و صفحه‌خوان‌ها هم درست می‌خوانند. `placeholder` جای `label` را **نمی‌گیرد**، چون با تایپ ناپدید می‌شود.

## انواع input

| type | کاربرد |
|---|---|
| `text` | متن کوتاه |
| `email` | ایمیل (با اعتبارسنجی ساده) |
| `password` | رمز (نقطه‌چین) |
| `number` | عدد (با `min`، `max`، `step`) |
| `date` | تاریخ |
| `checkbox` | انتخاب چندتایی |
| `radio` | انتخاب یک‌تایی (با `name` یکسان) |
| `file` | آپلود فایل |
| `range` | لغزنده |
| `color` | انتخاب رنگ |

```html
<!-- radio: name یکسان یعنی فقط یکی انتخاب می‌شود -->
<label><input type="radio" name="level" value="beginner"> مبتدی</label>
<label><input type="radio" name="level" value="pro"> حرفه‌ای</label>

<label><input type="checkbox" name="news" checked> عضویت در خبرنامه</label>
```

## سایر کنترل‌ها

```html
<label for="msg">پیام</label>
<textarea id="msg" name="message" rows="4"></textarea>

<label for="city">شهر</label>
<select id="city" name="city">
  <option value="">انتخاب کنید</option>
  <option value="tehran">تهران</option>
  <option value="shiraz">شیراز</option>
</select>

<fieldset>
  <legend>روش پرداخت</legend>
  <label><input type="radio" name="pay" value="online"> آنلاین</label>
  <label><input type="radio" name="pay" value="cash"> نقدی</label>
</fieldset>
```

## اعتبارسنجی داخلی مرورگر

| ویژگی | کار |
|---|---|
| `required` | پرکردن اجباری |
| `minlength` / `maxlength` | حداقل و حداکثر طول |
| `min` / `max` | حداقل و حداکثر عدد یا تاریخ |
| `pattern` | الگوی Regex |

> ⚠️ اعتبارسنجی سمت مرورگر فقط برای راحتی کاربر است و کاربر بدخواه می‌تواند آن را دور بزند. همیشه داده را **در سرور هم** بررسی کنید (در بخش‌های Backend می‌آموزید).

## اشتباهات رایج

- فراموش‌کردن `name` روی فیلدها.
- نداشتن `label` یا جفت‌نکردن `for` و `id`.
- دکمه‌ی بدون `type`: داخل فرم پیش‌فرض آن `submit` است. برای دکمه‌ای که نباید فرم را بفرستد `type="button"` بنویسید.
- ندادن `name` یکسان به radioهای یک گروه.

> 💡 **تمرین:** یک فرم ثبت‌نام بسازید: نام، ایمیل، رمز (حداقل ۸ حرف)، انتخاب سطح با radio، شهر با select و تیک قبول قوانین (اجباری).

مطالعه‌ی بیشتر: [W3Schools – Forms](https://www.w3schools.com/html/html_forms.asp) · [W3Schools – Input Types](https://www.w3schools.com/html/html_form_input_types.asp)
