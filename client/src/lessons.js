// نگاشت هر مرحله به درس‌نامه‌هایش. فایل‌ها در client/public/lessons/ هستند.
// type: "md" = متن مارک‌داون که در خود سایت نمایش داده می‌شود | "pdf" = نمایش فایل PDF
export const lessonsBySlug = {
  html: [
    { title: "فصل ۱: نقشه راه فرانت‌اند", type: "md", file: "ch01-roadmap.md" },
    { title: "فصل ۲ (بخش A): HTML مقدماتی", type: "md", file: "ch02-html-a-basic.md" },
    { title: "فصل ۲ (بخش B): HTML متوسط", type: "md", file: "ch02-html-b-intermediate.md" },
    { title: "فصل ۲ (بخش C): HTML پیشرفته", type: "md", file: "ch02-html-c-advanced.md" },
  ],
  css: [
    { title: "فصل ۳ (بخش A): CSS مقدماتی", type: "md", file: "ch03-css-a-basic.md" },
    { title: "فصل ۳ (بخش B): CSS متوسط", type: "md", file: "ch03-css-b-intermediate.md" },
    { title: "فصل ۳ (بخش C): CSS پیشرفته", type: "md", file: "ch03-css-c-advanced.md" },
  ],
  react: [
    { title: "فصل ۱: مبانی React", type: "md", file: "react-01-react-basics.md" },
    { title: "فصل ۲: Hookها و کار با داده", type: "md", file: "react-02-hooks-and-data.md" },
    { title: "فصل ۳: React کاربردی و پیشرفته", type: "md", file: "react-03-advanced.md" },
  ],
  git: [
    { title: "Git و GitHub", type: "md", file: "git-01-git-and-github.md" },
  ],
  javascript: [
    { title: "فصل ۱: مبانی زبان", type: "md", file: "js-01-basics.md" },
    { title: "فصل ۲: آرایه‌ها، آبجکت‌ها و توابع مرتبه بالا", type: "md", file: "js-02-arrays-objects.md" },
    { title: "فصل ۳: جاوااسکریپت در مرورگر", type: "md", file: "js-03-dom-events-storage.md" },
    { title: "فصل ۴: JavaScript عمیق‌تر", type: "md", file: "js-04-javascript-deep-dive.md" },
  ],
  "async-js": [
    { title: "Async JavaScript و Promise", type: "md", file: "js-05-async-promises.md" },
  ],
  api: [
    { title: "Fetch، HTTP و API", type: "md", file: "js-06-fetch-http-api.md" },
  ],
};
