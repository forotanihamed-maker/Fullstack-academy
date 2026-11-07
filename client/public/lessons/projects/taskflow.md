# TaskFlow — داشبورد مدیریت Task

> **سطح:** متوسط تا پیشرفته  
> **مرحله:** JavaScript / CRUD / State  
> **زمان پیشنهادی:** ۶ تا ۱۰ روز  
> **پیش‌نیاز:** فصل‌های ۱ تا ۴ جاوااسکریپت (به‌خصوص Closure، Spread و به‌روزرسانی Immutable)

## هدف

ساخت یک داشبورد مدیریت Task که شبیه یک محصول واقعی کار کند: ساخت، ویرایش، حذف، وضعیت‌ها، فیلترهای ترکیبی و آمار.

**چیزی که با این پروژه یاد می‌گیری:** مدیریت State، CRUD، ساختاردهی بهتر JavaScript و کار با داده‌های واقعی‌تر.

## قابلیت‌ها

- ساخت Task
- ویرایش (Edit)
- حذف (Delete)
- تغییر وضعیت (Status): `Pending`، `In Progress`، `Completed`
- Priority (اولویت)
- Category (دسته‌بندی)
- Due Date (تاریخ سررسید)
- جستجو (Search)
- **چند فیلتر هم‌زمان** (وضعیت + اولویت + دسته + جستجو)
- آمار داشبورد (تعداد کل، انجام‌شده، در حال انجام، دیرکرد)
- Empty State
- ذخیره در `localStorage`
- به‌روزرسانی هم‌زمان UI و Storage
- Event Delegation
- Responsive Design

## مدل داده

```js
const task = {
  id: "t_1696680000000",
  title: "Finish CSS chapter",
  status: "pending",        // "pending" | "in-progress" | "completed"
  priority: "high",         // "low" | "medium" | "high"
  category: "study",
  dueDate: "2026-10-12",    // رشته‌ی YYYY-MM-DD از input type="date"
  createdAt: 1696680000000
};
```

## طراحی State (یک منبع حقیقت)

```js
let state = {
  tasks: [],
  filters: { query: "", status: "all", priority: "all", category: "all" },
  editingId: null
};

function setState(updater) {
  state = updater(state);     // نسخه‌ی جدید، نه تغییر مستقیم
  saveTasks(state.tasks);     // Storage
  render();                   // UI
}
```

همه‌ی تغییرها فقط از `setState` عبور کنند تا UI و Storage هیچ‌وقت از هم جدا نشوند:

```js
const addTask = (task) =>
  setState((s) => ({ ...s, tasks: [...s.tasks, task] }));

const deleteTask = (id) =>
  setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));

const updateTask = (id, changes) =>
  setState((s) => ({
    ...s,
    tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...changes } : t))
  }));
```

## فیلترهای هم‌زمان و آمار

```js
function applyFilters(tasks, { query, status, priority, category }) {
  const q = query.trim().toLowerCase();

  return tasks.filter((t) =>
    (status === "all" || t.status === status) &&
    (priority === "all" || t.priority === priority) &&
    (category === "all" || t.category === category) &&
    t.title.toLowerCase().includes(q)
  );
}

function getStats(tasks) {
  const today = new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD (زمان محلی)

  return {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    overdue: tasks.filter((t) => t.status !== "completed" && t.dueDate && t.dueDate < today).length
  };
}
```

> **تله‌ی تاریخ:** `new Date("2026-10-07")` را مرورگر **UTC** حساب می‌کند و بسته به منطقه‌ی زمانی ممکن است روز قبل نشان بدهد. برای مقایسه‌ی «دیرکرد» از رشته‌های `YYYY-MM-DD` استفاده کن (ترتیب الفبایی آن‌ها همان ترتیب زمانی است).

## دو نوع Empty State

- **هیچ Taskی وجود ندارد:** «هنوز Taskی نساخته‌ای. اولین را بساز.»
- **Task هست ولی فیلتر چیزی پیدا نکرد:** «نتیجه‌ای با این فیلترها پیدا نشد» + دکمه‌ی «پاک کردن فیلترها»

## محدودیت‌ها

- بدون فریم‌ورک
- هیچ تغییر مستقیم (Mutate) روی `state.tasks`؛ فقط `map`، `filter` و Spread
- فقط یک تابع `setState` مجاز است Storage را بنویسد
- متن Taskها (ورودی کاربر) فقط با `textContent` نمایش داده شود

## معیار قبولی

- ساخت، ویرایش، حذف و تغییر وضعیت کار می‌کنند و بعد از Refresh باقی می‌مانند
- چهار فیلتر هم‌زمان درست ترکیب می‌شوند
- آمار همیشه با Taskهای فعلی هم‌خوان است
- هر دو Empty State درست نمایش داده می‌شوند
- اگر `state.tasks` را با `Object.freeze` قفل کنی، برنامه خطا نمی‌دهد (یعنی Mutate نکرده‌ای)
- Taskهای دیرکرد مشخص‌اند

## نقاط بازبینی نسخه‌ی اول (باید رفع شوند)

این موارد در Review نسخه‌ی اول عمداً به‌عنوان نقص مشخص شدند. اگر نسخه‌ی خودت را ساخته‌ای، آن‌ها را بررسی کن:

- [ ] **نمایش Priority در کارت‌ها:** اولویت هر Task باید روی کارت دیده شود (Badge با رنگ و متن، نه فقط رنگ)
- [ ] **تغییر Status داخل فرم Edit:** کاربر باید بتواند وضعیت را هنگام ویرایش هم عوض کند، نه فقط با دکمه‌ی کارت
- [ ] UI و Storage بعد از هر عملیات (ساخت، ویرایش، حذف) با هم به‌روز می‌شوند
- [ ] فرم Edit با داده‌ی فعلی Task پر می‌شود و انصراف، تغییری نمی‌دهد
- [ ] حذف از Event Delegation استفاده می‌کند (نه Listener روی هر دکمه)

## چالش‌های اختیاری

- تأیید حذف یا «واگرد» (Undo) برای ۵ ثانیه
- مرتب‌سازی (تاریخ، اولویت)
- خروجی و ورودی JSON
- Drag & Drop بین ستون‌های وضعیت
- جابه‌جایی کامل منطق در Moduleهای جدا (`state.js`، `storage.js`، `render.js`)

---

## نمونه‌ی زنده و بازبینی کد

[باز کردن نمونه‌ی زنده‌ی بازبینی‌شده](/demos/taskflow/index.html)

این نمونه، کد واقعی پروژه‌ی TaskFlow است که بازبینی و با تست مرورگر (Chromium، شامل آزمایش با منطقه‌ی زمانی آمریکا) بررسی شده است.

### نقاط قوت

- نام‌گذاری BEM و ساختار CSS تمیز
- Event Delegation با `closest`
- Seed فقط بار اول (تشخیص درست «هرگز ذخیره نشده» از «لیست خالی»)
- `try` / `catch` در `loadTasks` و `reset` فرم هنگام بستن مودال
- فیلترهای ترکیبی، آمار و Responsive

### مشکل‌های پیداشده و اصلاح‌ها

| مشکل | چرا مهم است | اصلاح |
|------|-------------|-------|
| **XSS:** `title` و `description` مستقیم داخل `innerHTML` می‌رفتند | کاربر با عنوانی مثل `<img src=x onerror=...>` کد اجرا می‌کند (این یک آسیب‌پذیری امنیتی واقعی است) | `escapeHTML` برای همه‌ی ورودی‌ها؛ تست شد که Payload اجرا نمی‌شود و به‌صورت متن نمایش داده می‌شود |
| Priority روی کارت‌ها دیده نمی‌شد | (از نقاط شناخته‌شده) | Badge با متن و رنگ (فقط رنگ کافی نیست) |
| Status داخل فرم Edit نبود | (از نقاط شناخته‌شده) | `select` وضعیت در فرم |
| `Object.assign(task, data)` خود Task را تغییر می‌داد (Mutate) | هماهنگ نبودن با State و بروز باگ‌های پنهان | `map` + Spread و یک تابع `commit()` که Storage، آمار و UI را با هم به‌روز می‌کند |
| `new Date("2026-09-28")` را مرورگر UTC حساب می‌کند | در منطقه‌های زمانی غربی (مثلاً آمریکا) تاریخ **یک روز عقب** نشان داده می‌شد (تست شد) | تبدیل رشته‌ی `YYYY-MM-DD` به تاریخ محلی |
| عنوان «فقط فاصله» از `required` رد می‌شد | Task بی‌نام ساخته می‌شد | `trim` و `setCustomValidity` + `reportValidity` |
| فقط یک Empty State | «Task نیست» با «فیلتر چیزی پیدا نکرد» دو وضعیت متفاوت‌اند | دو پیام + دکمه‌ی «Clear filters» |
| Task دیرکرد مشخص نبود | | `Overdue` با مقایسه‌ی رشته‌های `YYYY-MM-DD` |
| `loadTasks` به آرایه بودن داده و معتبر بودن فیلدها اعتماد می‌کرد | داده‌ی خراب (مثلاً `status` دلخواه که داخل `class` می‌رفت) UI را خراب یا ناامن می‌کرد | `normalizeTask` برای هر ردیف |
| `saveTasks` بدون `try` / `catch` | | اضافه شد |
| دکمه‌ی Status: برچسب مبهم؛ برای `Completed` کار بی‌اثر | | `aria-label` توضیحی و `disabled` برای آخرین وضعیت (بازگشت با فرم Edit) |
| مودال: بدون `aria-modal`، عنوان ثابت «New Task» حتی در Edit، دکمه‌ی `×` بی‌برچسب، بدون فوکوس | | `aria-modal`، `aria-labelledby`، فوکوس روی عنوان، Trap، `Escape` و بازگشت فوکوس |
| بدون `<h1>`؛ کارت‌ها `div` | | `h1` برای برند و `article` برای کارت |
| کنتراست: `--text-muted` برابر `#94a3b8` (۲.۵۶) و Badge تکمیل‌شده | | `#64748b` و `#15803d` |
| `innerText` | | `textContent` |
| بدون `font-family` | فونت Serif پیش‌فرض | Font Stack |

### تغییر ساختار مهم

```js
// تنها راه تغییر State
function commit(nextTasks) {
  tasks = nextTasks;
  saveTasks();
  updateStats();
  applyFilters();
}

commit([...tasks, { id: Date.now(), ...data }]);                                  // ساخت
commit(tasks.map((t) => (t.id === id ? { ...t, ...changes } : t)));               // ویرایش
commit(tasks.filter((t) => t.id !== id));                                         // حذف
```

### نکته‌هایی که تصمیمش با خودت است

- `confirm()` برای حذف کار می‌کند ولی صفحه را مسدود می‌کند؛ «واگرد» (Undo) تجربه‌ی بهتری است (از چالش‌های اختیاری).
- کلاس `sabad-close` در این پروژه از Sportify کپی شده؛ نام مناسب‌تر `modal__close` است.
- برای بزرگ‌تر شدن پروژه، منطق را به Moduleهای `state.js`، `storage.js` و `render.js` تقسیم کن.

### درس‌هایی که به پروژه‌های بعدی منتقل می‌شود

- هر ورودی کاربر که داخل `innerHTML` برود، یک راه ورود کد مخرب است؛ همیشه Escape یا `textContent`
- تاریخ `YYYY-MM-DD` را با `new Date(...)` تفسیر نکن؛ یا رشته‌ای مقایسه کن یا مؤلفه‌ها را جدا بخوان
- هر چیز خوانده‌شده از `localStorage` را مثل داده‌ی غیرمطمئن اعتبارسنجی کن
