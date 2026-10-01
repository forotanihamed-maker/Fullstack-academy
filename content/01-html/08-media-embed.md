---
title: صوت، ویدیو و المان‌های جاسازی‌شده
---

## ویدیو

```html
<video controls width="480" poster="cover.jpg">
  <source src="movie.mp4" type="video/mp4">
  <source src="movie.webm" type="video/webm">
  مرورگر شما از ویدیو پشتیبانی نمی‌کند.
</video>
```

| ویژگی | کار |
|---|---|
| `controls` | نمایش دکمه‌های پخش و صدا |
| `poster` | تصویر روی ویدیو قبل از پخش |
| `autoplay` | پخش خودکار (مرورگرها معمولاً فقط با `muted` اجازه می‌دهند) |
| `loop` | تکرار |
| `muted` | بی‌صدا |
| `preload` | چقدر از فایل از قبل دانلود شود (`none` / `metadata` / `auto`) |

چند `<source>` می‌گذاریم تا مرورگر اولین فرمتی را که پشتیبانی می‌کند انتخاب کند. متن داخل تگ فقط برای مرورگرهای قدیمی است.

## صوت

```html
<audio controls src="song.mp3">مرورگر شما از صوت پشتیبانی نمی‌کند.</audio>
```

## زیرنویس ویدیو (برای ناشنوایان و زبان‌های دیگر)

```html
<video controls src="lesson.mp4">
  <track kind="subtitles" src="fa.vtt" srclang="fa" label="فارسی" default>
</video>
```

## iframe: قراردادن صفحه‌ای دیگر داخل صفحه‌ی شما

```html
<iframe src="https://www.example.com" title="توضیح محتوا" width="600" height="400" loading="lazy"></iframe>
```

- همیشه `title` بنویسید (برای دسترس‌پذیری).
- بعضی سایت‌ها اجازه‌ی نمایش در iframe نمی‌دهند.
- محتوای iframe از منبع ناشناس را با ویژگی `sandbox` محدود کنید.

## نکات مهم

- فایل‌های ویدیویی **حجیم** هستند. برای سایت‌های واقعی بهتر است ویدیو را روی سرویس‌های ویدیو آپلود کنید و با `<iframe>` جاسازی کنید.
- حجم فایل‌ها را کم کنید تا کاربرانی که اینترنت کند یا گران دارند هم بتوانند صفحه را باز کنند.

> 💡 **تمرین:** صفحه‌ای بسازید که یک ویدیو با دکمه‌های کنترل، یک فایل صوتی و یک نقشه (iframe) داشته باشد.

مطالعه‌ی بیشتر: [W3Schools – Video](https://www.w3schools.com/html/html5_video.asp) · [W3Schools – iframes](https://www.w3schools.com/html/html_iframe.asp)
