// پروژه‌های هر مرحله. فایل‌ها در client/public/lessons/projects/ هستند.
// level: سطح | status: وضعیت | summary: یک خط توضیح برای کارت
const fitzone = {
  title: "FitZone",
  level: "مبتدی تا متوسط",
  status: "نمونه‌ی کامل",
  summary: "Landing Page فروش تجهیزات ورزشی با HTML و CSS و طراحی Responsive",
  file: "projects/fitzone.md",
  demo: "/demos/fitzone/index.html",
};

const sportify = {
  title: "Sportify",
  level: "متوسط",
  status: "نمونه‌ی کامل",
  summary: "فروشگاه بدون Backend: جستجو، فیلتر، سبد خرید و localStorage",
  file: "projects/sportify.md",
  demo: "/demos/sportify/index.html",
};

const taskflow = {
  title: "TaskFlow",
  level: "متوسط تا پیشرفته",
  status: "نمونه‌ی کامل",
  summary: "داشبورد مدیریت Task با CRUD، State، فیلترهای ترکیبی و آمار",
  file: "projects/taskflow.md",
  demo: "/demos/taskflow/index.html",
};

const pocketLedger = {
  title: "Pocket Ledger",
  level: "پیشرفته (جمع‌بندی)",
  status: "پیشنهادی قبل از React",
  summary: "مدیریت هزینه و درآمد با معماری ماژولار، Store، Immutable و دسترس‌پذیری",
  file: "projects/pocket-ledger.md",
};

const movieExplorer = {
  title: "Movie Explorer",
  level: "متوسط تا پیشرفته",
  status: "در حال انجام",
  summary: "جستجوی فیلم با API خارجی، Debounce، AbortController و مدیریت Loading / Empty / Error",
  file: "projects/movie-explorer.md",
};

const movieExplorerAi = {
  title: "Movie Explorer — AI",
  level: "متوسط تا پیشرفته",
  status: "نمونه‌ی کامل",
  summary: "نسخه‌ی دوم همان بریف: Skeleton، مودال دسترس‌پذیر، پوستر جایگزین SVG و بازبینی کامل کد",
  file: "projects/movie-explorer-ai.md",
  demo: "/demos/movie-explorer-ai/index.html",
};

export const projectsBySlug = {
  html: [fitzone],
  css: [fitzone],
  javascript: [sportify, taskflow, pocketLedger],
  api: [movieExplorer, movieExplorerAi],
};
