# React — فصل ۲: Hookها و کار با داده

> **مرحله ۷ از مسیر فول‌استک — React**  
> مباحث این فصل: `useEffect` و Cleanup، گرفتن داده از API (Loading / Error / Empty، لغو درخواست)، `useRef`، `useMemo` / `useCallback` / `React.memo`، Custom Hook، Context API، `useReducer`  
> پیش‌نیاز: فصل ۱ React، فصل‌های Async و Fetch  
> زمان پیشنهادی: ۱۰ تا ۱۴ روز

---

## هدف فصل

در فصل قبل Componentهایی ساختی که فقط با Props و State کار می‌کردند. برنامه‌ی واقعی با دنیای بیرون هم ارتباط دارد: سرور، `localStorage`، تایمر، عنوان صفحه، فوکوس فرم. در این فصل یاد می‌گیری React این «ارتباط با بیرون» را چطور مدیریت می‌کند و چطور منطق تکراری را در **Custom Hook** جمع کنی.

بعد از این فصل باید بتوانی:

- قاعده‌های Hook را بدانی و خطاهای رایج را بشناسی
- `useEffect` را درست بنویسی: Dependency Array، Cleanup، و رفتار `StrictMode`
- بدانی کجا اصلاً به Effect نیاز نداری
- داده را از API بگیری و Loading / Error / Empty را مدیریت کنی
- با `AbortController` جلوی Race Condition را بگیری
- از `useRef` برای DOM و مقدارهای «بدون Render» استفاده کنی
- `useMemo`، `useCallback` و `React.memo` را فقط وقتی لازم است به‌کار ببری
- Custom Hook بسازی (`useDebounce`، `useLocalStorage`، `useFetch`)
- Prop Drilling را با Context حل کنی
- State پیچیده را با `useReducer` مدیریت کنی
- Movie Explorer را در React بازنویسی کنی

> مثل فصل قبل، مثال‌ها با React ۱۹ در مرورگر اجرا و رفتارشان بررسی شده است. «خروجی»هایی که می‌بینی (مثل ترتیب `effect, cleanup, effect` یا پیام خطاها) واقعی‌اند. اگر پروژه‌ات هنوز React ۱۸ است، همه‌ی مثال‌ها همین‌طور کار می‌کنند؛ تفاوت‌های جزئی در متن گفته شده است.

---

# 1. قاعده‌های Hook (مرور)

**Hook** تابعی است که با `use` شروع می‌شود و به قابلیت‌های React وصل می‌شود (`useState`، `useEffect`، ...). دو قاعده:

1. Hookها را فقط در **سطح بالای** Component (یا Custom Hook) صدا بزن؛ نه داخل `if`، حلقه، تابع تودرتو یا بعد از `return` زودهنگام.
2. Hookها را فقط داخل **Component** یا **Custom Hook** صدا بزن.

دلیلش: React Hookها را به **ترتیب فراخوانی** به هم وصل می‌کند. اگر ترتیب بین دو Render فرق کند، همه‌چیز به‌هم می‌ریزد:

```jsx
function Bad() {
  const [show, setShow] = useState(true);

  if (show) {
    useState(0);              // ❌ Hook داخل شرط
  }
  useState(1);

  return <button onClick={() => setShow(false)}>go</button>;
}
```

با کلیک روی دکمه، تعداد Hookها کم می‌شود و خطای واقعی می‌گیری:

```text
Rendered fewer hooks than expected. This may be caused by an accidental early return statement.
```

ESLint در پروژه‌ی Vite (`eslint-plugin-react-hooks`) این اشتباه‌ها را در ویرایشگر نشانت می‌دهد؛ هشدارهایش را جدی بگیر.

---

# 2. Effect چیست؟

در فصل قبل دیدی که **Render باید خالص باشد**: فقط با Props و State، JSX بسازد. ولی بعضی کارها «بیرون از Render» هستند و به **Effect** (اثر جانبی) نیاز دارند:

```text
گرفتن داده از سرور
تغییر document.title
تایمر (setInterval / setTimeout)
ثبت Event Listener روی window
خواندن و نوشتن localStorage
اتصال به WebSocket
```

اگر این‌ها را مستقیم داخل بدنه‌ی Component بنویسی، با هر Render اجرا می‌شوند و Render ناخالص می‌شود. `useEffect` جایی است که می‌گوییم «بعد از اینکه React صفحه را به‌روز کرد، این کار را انجام بده».

---

# 3. `useEffect`: ساختار و زمان اجرا

```jsx
import { useEffect, useState } from "react";

function PageTitle() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `کلیک: ${count}`;
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

ساختار:

```jsx
useEffect(
  () => {
    // کد Effect (بعد از Render و Commit اجرا می‌شود)

    return () => {
      // Cleanup (اختیاری): قبل از اجرای بعدی Effect و هنگام حذف Component
    };
  },
  [dep1, dep2] // آرایه‌ی وابستگی‌ها
);
```

- Effect **بعد از Render** و بعد از اینکه DOM به‌روز شد اجرا می‌شود (نه در حین Render).
- تابع Effect نباید `async` باشد (چون Promise برمی‌گرداند و React انتظار Cleanup دارد). داخلش یک تابع async بساز.

## Dependency Array

| شکل | کِی اجرا می‌شود؟ |
|-----|------------------|
| `useEffect(fn)` (بدون آرایه) | بعد از **هر** Render |
| `useEffect(fn, [])` | فقط **یک بار** (بعد از اولین Render) |
| `useEffect(fn, [a, b])` | بعد از اولین Render و **هر بار که `a` یا `b` عوض شود** |

**قاعده‌ی اصلی:** هر مقدار «واکنشی» (Props، State، و متغیرهای تعریف‌شده داخل Component) که داخل Effect استفاده می‌کنی، باید در آرایه باشد. نگو «می‌خواهم فقط یک بار اجرا شود» و `[]` بگذاری؛ بپرس «Effect به چه چیزهایی وابسته است؟» و همان‌ها را بنویس. ESLint این را بررسی می‌کند (`react-hooks/exhaustive-deps`).

## تله‌ی Object و Array در Dependency

React وابستگی‌ها را با `Object.is` (مقایسه‌ی ارجاع) می‌سنجد. Object یا Array که داخل Component ساخته می‌شود، در هر Render **ارجاع جدید** دارد:

```jsx
function Demo() {
  const [n, setN] = useState(0);
  const options = { a: 1 };                       // هر Render یک Object جدید

  useEffect(() => { /* ... */ }, [options]);      // ❌ در هر Render اجرا می‌شود

  const stable = useMemo(() => ({ a: 1 }), []);
  useEffect(() => { /* ... */ }, [stable]);       // ✅ فقط یک بار

  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
```

نتیجه‌ی آزمایش: بعد از دو کلیک (۳ Render)، Effect اول **۳ بار** اجرا شد و Effect دوم **۱ بار**. راه‌حل‌ها: Object را بیرون از Component تعریف کن (اگر ثابت است)، فقط فیلدهای ساده‌ی لازم (`options.a`) را وابستگی بگذار، یا در صورت نیاز `useMemo`.

---

# 4. Cleanup (پاک‌سازی)

Effectهایی که چیزی را «راه می‌اندازند» (تایمر، Listener، اتصال)، باید آن را «خاموش» هم بکنند. تابعی که از Effect برمی‌گردانی، **Cleanup** است:

```jsx
function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);               // Cleanup
  }, []);

  return <p>{now.toLocaleTimeString("fa-IR")}</p>;
}
```

```jsx
function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return <p>عرض: {width}</p>;
}
```

**Cleanup چه وقت اجرا می‌شود؟**

1. قبل از اجرای **بعدی** همان Effect (وقتی وابستگی عوض شده).
2. وقتی Component از صفحه **حذف** می‌شود (Unmount).

بدون Cleanup: تایمر بعد از حذف Component هم ادامه دارد، Listenerها روی هم انباشته می‌شوند و نشت حافظه و باگ می‌سازی (همان مشکل «فراموش کردن `clearInterval`» که در JavaScript دیدی).

## `StrictMode` و اجرای دوباره‌ی Effect

در حالت توسعه، `StrictMode` هر Component را بعد از Mount، یک بار **جدا و دوباره سوار می‌کند** تا Effectهایی که Cleanup ندارند آشکار شوند. نتیجه‌ی آزمایش (Effect با `[]` و یک Cleanup که لاگ می‌نویسد):

```text
بدون StrictMode:  effect
با StrictMode:    effect, cleanup, effect
```

این فقط در **Development** است؛ در نسخه‌ی Build اتفاق نمی‌افتد. پس اگر Effectت «دو بار اجرا شد»، باگ React نیست؛ یعنی **Cleanupات ناقص است**. راهش «جلوگیری از دوبار اجرا» نیست؛ نوشتن Cleanup درست است:

```text
Effect درست = Setup ← Cleanup ← Setup باید بی‌خطر باشد
```

به Effect مثل «همگام‌سازی با یک سیستم بیرونی» فکر کن (شروع / پایان همگام‌سازی)، نه «رویدادهای چرخه‌ی عمر» (Mount / Unmount).

---

# 5. تله‌ی Stale Closure در Effect

```jsx
function Ticker() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);              // ❌ count همیشه همان مقدار Render اول است (۰)
    }, 1000);
    return () => clearInterval(id);
  }, []);                                // وابستگی count را ننوشتیم

  return <p>{count}</p>;
}
```

نتیجه‌ی آزمایش: عدد روی `1` می‌ماند و بالا نمی‌رود. چون Callback تایمر «عکس لحظه‌ای» همان Render اول را در Closure نگه داشته است (فصل ۴: Closure + فصل قبل: State یک Snapshot است).

راه‌حل: Updater Function (که به مقدار `count` وابسته نیست):

```jsx
setCount((c) => c + 1);                  // ✅ شمارنده بالا می‌رود
```

(نتیجه‌ی آزمایش: با این نسخه شمارنده درست بالا می‌رفت.)

اگر Effect واقعاً به مقدار فعلی نیاز دارد، آن را در آرایه بنویس تا Effect (و Cleanup) هر بار دوباره راه بیفتد.

---

# 6. Loop بی‌پایان در Effect

```jsx
function Bad() {
  const [c, setC] = useState(0);

  useEffect(() => {
    setC(c + 1);                         // ❌ بدون آرایه‌ی وابستگی: Render ← Effect ← State ← Render ...
  });

  return <p>{c}</p>;
}
```

خطای واقعی:

```text
Maximum update depth exceeded. This can happen when a component calls setState inside useEffect,
but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
```

دلیل‌های رایج: نبود آرایه‌ی وابستگی، یا وابستگی که در هر Render عوض می‌شود (Object/Array/تابع جدید).

---

# 7. شاید به Effect نیاز نداری

Effect فقط برای **همگام‌سازی با دنیای بیرون** است. بسیاری از کاربردهای رایج Effect اشتباه‌اند.

## ❌ مقدار محاسبه‌شده را در State نگه نداشته باش

```jsx
// ❌ دو State که باید همیشه هماهنگ باشند + Effect اضافه + یک Render اضافه
const [items, setItems] = useState([]);
const [count, setCount] = useState(0);
useEffect(() => setCount(items.length), [items]);

// ✅ Derived Data: در همان Render محاسبه کن
const [items, setItems] = useState([]);
const count = items.length;
```

## ❌ واکنش به رویداد کاربر را در Effect نگذار

```jsx
// ❌
useEffect(() => {
  if (submitted) sendToServer(form);
}, [submitted]);

// ✅ کار را داخل Event Handler انجام بده
function handleSubmit(event) {
  event.preventDefault();
  sendToServer(form);
}
```

قاعده: اگر کار با «یک عمل کاربر» شروع می‌شود (کلیک، ارسال فرم)، جایش Event Handler است. اگر چون «Component روی صفحه است» لازم است (مثل اتصال به سرور)، Effect.

## ❌ State را بر اساس Props در Effect ریست نکن

```jsx
// ❌
useEffect(() => { setComment(""); }, [userId]);

// ✅ با key: وقتی key عوض شود، React Component را «از نو» می‌سازد و State تازه می‌شود
<CommentBox key={userId} userId={userId} />
```

## چه چیزی Effect می‌خواهد؟

```text
✅ گرفتن داده (البته فصل‌های بعد کتابخانه‌ها بهتر انجامش می‌دهند)
✅ تایمر و Listener روی window/document
✅ اتصال به WebSocket و سرویس‌های بیرونی
✅ همگام‌سازی با localStorage و document.title
✅ کنترل ویجت غیر-React
```

---

# 8. گرفتن داده از API در React

حالا همه‌ی مفاهیم فصل Fetch را کنار هم می‌گذاریم. یک Component که لیست کاربران را می‌گیرد:

## ۸.۱ نسخه‌ی اول: ساده

```jsx
function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then(setUsers);
  }, []);

  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

مشکل‌ها: Loading و Error ندارد، `response.ok` چک نمی‌شود، و اگر Component قبل از رسیدن پاسخ حذف شود، به آن `setState` می‌زند.

## ۸.۲ State به‌شکل «وضعیت» (Status)

از Movie Explorer به یاد داری: `idle` / `loading` / `success` / `empty` / `error`. به‌جای چند Boolean جدا (`isLoading`، `hasError`، ...) که می‌توانند ناسازگار شوند، یک `status` بساز:

```jsx
const [state, setState] = useState({ status: "idle", data: null, error: null });
```

## ۸.۳ نسخه‌ی درست

```jsx
function Users() {
  const [state, setState] = useState({ status: "loading", data: null, error: null });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading", data: null, error: null });

    fetch("https://jsonplaceholder.typicode.com/users", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) =>
        setState({ status: data.length === 0 ? "empty" : "success", data, error: null })
      )
      .catch((error) => {
        if (error.name === "AbortError") return;      // لغو عمدی؛ خطا نیست
        setState({ status: "error", data: null, error });
      });

    return () => controller.abort();                  // Cleanup: درخواست را لغو کن
  }, []);

  if (state.status === "loading") return <p>در حال بارگذاری...</p>;
  if (state.status === "error") return <p role="alert">خطا: {state.error.message}</p>;
  if (state.status === "empty") return <p>کاربری پیدا نشد.</p>;

  return (
    <ul>
      {state.data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

چهار نکته‌ی مهم:

1. **`response.ok`** را چک می‌کنیم (همان تله‌ی فصل ۶).
2. **`status`** یک منبع حقیقت است و رندر با چند `if` ساده می‌شود.
3. **Cleanup با `AbortController`**: وقتی وابستگی عوض شود یا Component حذف شود، درخواست قبلی لغو می‌شود.
4. **`AbortError` را نادیده می‌گیریم.**

## ۸.۴ Race Condition: چرا Cleanup مهم است؟

فرض کن `q` یک State است و Effect درخواست می‌فرستد. کاربر اول عبارت «slow» (پاسخ دیر) و بعد «fast» (پاسخ سریع) را انتخاب می‌کند:

```jsx
useEffect(() => {
  fetch(`/api/${q}`)                          // ❌ بدون لغو
    .then((r) => r.json())
    .then((d) => setResult(d[0]?.id ?? "empty"));
}, [q]);
```

نتیجه‌ی آزمایش: بعد از اینکه هر دو پاسخ رسیدند، صفحه **`slow`** را نشان داد (یعنی جواب قدیمی روی جواب جدید نشست). با Cleanup:

```jsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/${q}`, { signal: controller.signal })
    .then((r) => r.json())
    .then((d) => setResult(d[0]?.id ?? "empty"))
    .catch(() => {});

  return () => controller.abort();            // ✅ با عوض شدن q، درخواست قبلی لغو می‌شود
}, [q]);
```

نتیجه‌ی آزمایش: صفحه **`fast`** را نشان داد (درست). این همان Race Condition فصل Fetch است، و Cleanup راه‌حل طبیعی‌اش در React است.

> اگر به `AbortController` دسترسی نداری (مثلاً کتابخانه‌ی قدیمی)، از یک متغیر `ignore` استفاده کن: `let ignore = false;` ... `if (!ignore) setState(...)` ... و در Cleanup `ignore = true`.

## ۸.۵ API Client فصل Fetch را دوباره استفاده کن

لازم نیست در هر Component `fetch` خام بنویسی. `api/client.js` و `api/users.js` که در فصل ۶ ساختی را همین‌جا استفاده کن:

```jsx
import { getUsers } from "./api/users.js";

useEffect(() => {
  const controller = new AbortController();

  getUsers({ signal: controller.signal })
    .then((data) => setState({ status: data.length ? "success" : "empty", data, error: null }))
    .catch((error) => {
      if (error.name !== "AbortError") setState({ status: "error", data: null, error });
    });

  return () => controller.abort();
}, []);
```

(بخش Custom Hook این الگوی تکراری را یک‌جا جمع می‌کند.)

---

# 9. `useRef`

`useRef` یک «جعبه» می‌سازد که مقدارش در بین Renderها می‌ماند، ولی **تغییرش Render جدید ایجاد نمی‌کند**:

```jsx
const ref = useRef(initialValue);

ref.current;            // خواندن
ref.current = newValue; // نوشتن (بدون Re-render)
```

## کاربرد ۱: دسترسی به المان DOM

```jsx
import { useRef } from "react";

function SearchBox() {
  const inputRef = useRef(null);

  return (
    <>
      <input ref={inputRef} />
      <button type="button" onClick={() => inputRef.current.focus()}>
        فوکوس
      </button>
    </>
  );
}
```

نتیجه‌ی آزمایش: با کلیک، فوکوس روی `input` رفت. `ref` به المان واقعی DOM وصل می‌شود (بعد از Commit)، پس مناسب فوکوس، اسکرول، اندازه‌گیری و تماس با کتابخانه‌های غیر-React است.

**نکته:** کارهایی که با State و JSX می‌شود انجام داد (مثل نمایش یا مخفی کردن)، با `ref` نکن. `ref` «راه فرار» برای کارهای ضروری DOM است.

## کاربرد ۲: نگه‌داشتن مقدار قابل‌تغییر بدون Render

```jsx
function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const timerId = useRef(null);                  // شناسه‌ی تایمر لازم به نمایش نیست

  function start() {
    if (timerId.current) return;
    timerId.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }

  function stop() {
    clearInterval(timerId.current);
    timerId.current = null;
  }

  useEffect(() => stop, []);                      // با حذف Component هم متوقف شود

  return (
    <>
      <p>{seconds}</p>
      <button onClick={start}>شروع</button>
      <button onClick={stop}>توقف</button>
    </>
  );
}
```

نتیجه‌ی آزمایش: دوبار تغییر `ref.current` با کلیک، مقدار آن را ۲ کرد ولی Component **هیچ Render جدیدی** نداشت (تعداد Render همان ۱ ماند).

## Ref در برابر State

| | State | Ref |
|---|-------|-----|
| تغییر → Re-render | بله | **خیر** |
| برای چیزی که روی صفحه دیده می‌شود | بله | خیر |
| در Render خواندن/نوشتن | مجاز | **ممنوع** (Render را ناخالص می‌کند) |
| مثال | شمارنده، متن فرم | `timerId`، المان DOM، مقدار قبلی |

## الگوی «مقدار قبلی» (usePrevious)

```jsx
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;                          // بعد از Render ذخیره می‌شود
  });

  return ref.current;                             // در این Render هنوز مقدار «قبلی» است
}
```

## ارسال Ref به Component فرزند

در **React ۱۹**، `ref` مثل یک Prop معمولی به Function Component می‌رسد:

```jsx
function MyInput({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

در **React ۱۸** باید Component را در `forwardRef` بپیچی:

```jsx
const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} {...props} />;
});
```

---

# 10. `useMemo`، `useCallback` و `React.memo`

اول یک قاعده: **React به‌اندازه‌ی کافی سریع است.** Re-render ارزان است. این ابزارها را برای بهینه‌سازی «بعد از اندازه‌گیری» به‌کار ببر، نه از اول برای همه‌چیز.

## `useMemo`: ذخیره‌ی نتیجه‌ی محاسبه

```jsx
const visibleProducts = useMemo(
  () => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
  [products, query]
);
```

فقط وقتی `products` یا `query` عوض شود، دوباره محاسبه می‌کند. به درد محاسبه‌های **واقعاً سنگین** (لیست بزرگ، پردازش پیچیده) می‌خورد. برای `filter` روی ۲۰ آیتم، لازم نیست.

## `useCallback`: ذخیره‌ی خودِ تابع

تابعی که داخل Component تعریف می‌شود، در هر Render **تابع جدید** است. `useCallback` ارجاع تابع را ثابت نگه می‌دارد (تا وقتی وابستگی‌ها عوض نشده‌اند):

```jsx
const handleAdd = useCallback((id) => {
  setCart((prev) => [...prev, { id, qty: 1 }]);
}, []);
```

## `React.memo`: Render نکردن فرزند اگر Props عوض نشد

```jsx
import { memo } from "react";

const ProductCard = memo(function ProductCard({ product, onAdd }) {
  console.log("render", product.name);
  return <button onClick={() => onAdd(product.id)}>{product.name}</button>;
});
```

به‌تنهایی کافی نیست؛ اگر Props هر بار ارجاع جدید بگیرد، `memo` بی‌اثر می‌شود. نتیجه‌ی آزمایش (Parent با یک شمارنده و فرزند `memo` شده، دو کلیک روی شمارنده، یعنی ۳ Render):

```text
onClick={() => {}}  (تابع inline، هر بار جدید)   → فرزند ۳ بار Render شد
onClick={handle}    (با useCallback)              → فرزند ۱ بار Render شد
```

یعنی `memo` و `useCallback` **با هم** کار می‌کنند: `memo` تصمیم می‌گیرد «اگر Props یکی است Render نکن» و `useCallback` Props را «یکی نگه می‌دارد».

## کِی استفاده کنم؟

```text
✅ فرزند سنگین است و والد زیاد Render می‌شود (و واقعاً کند حس می‌شود)
✅ تابع یا Object به‌عنوان وابستگی useEffect می‌رود و نباید هر Render عوض شود
✅ محاسبه‌ی واقعاً سنگین
❌ همه‌جا «محض احتیاط»
```

قبل از هر بهینه‌سازی با تب **Profiler** در React DevTools اندازه بگیر. (ابزار **React Compiler** هم هست که بسیاری از این Memoizationها را خودکار انجام می‌دهد؛ ولی فهمیدن اصل موضوع لازم است.)

---

# 11. Custom Hook

**Custom Hook** یک تابع معمولی است که نامش با `use` شروع می‌شود و داخلش Hookهای دیگر را صدا می‌زند. هدف: **منطق تکراری را جمع کنی** و از Componentها بیرون بکشی. (Custom Hook مقدار State را بین Componentها به اشتراک نمی‌گذارد؛ فقط **منطق** را. هر Component که صدایش بزند State مستقل خودش را دارد.)

## `useToggle`

```jsx
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

const [isOpen, toggleOpen] = useToggle();
```

## `useDebounce`

همان Debounce فصل Fetch، حالا به‌شکل Hook:

```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);              // با هر تغییر، تایمر قبلی لغو می‌شود
  }, [value, delay]);

  return debounced;
}
```

```jsx
function Search() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  // debouncedQuery را برای Effect درخواست استفاده کن، نه query را
  ...
}
```

نتیجه‌ی آزمایش: با تایپ سریع `abc`، تا قبل از پایان تأخیر مقدار Debounce‌شده خالی بود و بعد از آن `abc` شد.

## `useLocalStorage`

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;                         // داده‌ی خراب یا storage غیرفعال
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ذخیره نشد؛ برنامه ادامه می‌دهد */
    }
  }, [key, value]);

  return [value, setValue];
}

const [name, setName] = useLocalStorage("name", "Ali");
```

نتیجه‌ی آزمایش: بار اول مقدار `Ali`؛ بعد از تغییر به `Reza` در Storage ذخیره شد؛ با Mount دوباره، `Reza` بازیابی شد؛ و با داده‌ی خراب (`{bad`) برنامه خطا نداد و به `Ali` برگشت. (همان `useState(() => ...)` تنبل و `try` / `catch` ایمن فصل‌های قبل.)

## `useFetch`

```jsx
function useFetch(url) {
  const [state, setState] = useState({ status: "idle", data: null, error: null });

  useEffect(() => {
    if (!url) {
      setState({ status: "idle", data: null, error: null });
      return;
    }

    const controller = new AbortController();
    setState({ status: "loading", data: null, error: null });

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) =>
        setState({
          status: Array.isArray(data) && data.length === 0 ? "empty" : "success",
          data,
          error: null,
        })
      )
      .catch((error) => {
        if (error.name === "AbortError") return;
        setState({ status: "error", data: null, error });
      });

    return () => controller.abort();
  }, [url]);

  return state;
}
```

استفاده:

```jsx
function UserList() {
  const { status, data, error } = useFetch("https://jsonplaceholder.typicode.com/users");

  if (status === "loading") return <p>در حال بارگذاری...</p>;
  if (status === "error") return <p role="alert">{error.message}</p>;
  if (status === "empty") return <p>موردی نیست.</p>;
  if (status === "success") return <ul>{data.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;

  return null;
}
```

نتیجه‌ی آزمایش: پاسخ موفق `success`، آرایه‌ی خالی `empty` و پاسخ `500` وضعیت `error` با پیام `HTTP 500` را داد.

## قواعد ساخت Custom Hook

- نام با `use` شروع شود (تا ESLint قاعده‌های Hook را روی آن اعمال کند)
- یک کار مشخص انجام دهد
- چیزی برگرداند که استفاده‌کننده بدون دانستن جزئیات استفاده کند (`[value, setValue]` یا Object)
- وقتی چند Component یک الگو را تکرار می‌کنند، به Custom Hook فکر کن (نه از قبل برای همه‌چیز)

---

# 12. Context API

وقتی داده‌ای در Componentهای زیادی و دور از هم لازم است (تم، کاربر واردشده، زبان، سبد خرید)، فرستادن آن با Props از چند سطح (**Prop Drilling**) خسته‌کننده می‌شود. **Context** داده را مستقیم در دسترس هر Component زیر یک Provider قرار می‌دهد.

## سه قدم

```jsx
import { createContext, useContext, useState } from "react";

// ۱) ساخت Context (با مقدار پیش‌فرض)
const ThemeContext = createContext("light");

// ۲) Provider: مقدار را در اختیار فرزندان می‌گذارد
function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}>
        تغییر تم
      </button>
      <Page />
    </ThemeContext.Provider>
  );
}

// ۳) Consumer: هر Component زیر Provider مقدار را می‌خواند
function Badge() {
  const theme = useContext(ThemeContext);
  return <span>تم: {theme}</span>;
}
```

نتیجه‌ی آزمایش: با کلیک دکمه، `Badge` خودکار به `dark` عوض شد (Re-render شد)، و وقتی `Badge` بدون هیچ Provider استفاده شد، مقدار پیش‌فرض `light` را خواند.

**در React ۱۹** می‌توانی به‌جای `<ThemeContext.Provider>` مستقیم `<ThemeContext value={theme}>` بنویسی؛ در ۱۸ فقط شکل `.Provider` را داریم.

## الگوی حرفه‌ای: Provider + Custom Hook

```jsx
// theme-context.jsx
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggleTheme = useCallback(() => setTheme((t) => (t === "light" ? "dark" : "light")), []);

  // مقدار Context را ثابت نگه می‌داریم تا فقط وقتی واقعاً عوض شد، مصرف‌کننده‌ها Render شوند
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("useTheme must be used inside <ThemeProvider>");   // خطای واضح به‌جای باگ مبهم
  }

  return context;
}
```

```jsx
// main.jsx
<ThemeProvider>
  <App />
</ThemeProvider>

// هر جا لازم بود
const { theme, toggleTheme } = useTheme();
```

## نکته‌های Context

- هر بار **مقدار** Provider عوض شود، **همه‌ی** Componentهایی که `useContext` آن را صدا زده‌اند Render می‌شوند. اگر `value={{ a, b }}` را مستقیم بنویسی، در هر Render یک Object جدید است و همه‌ی مصرف‌کننده‌ها بی‌دلیل Render می‌شوند (راه‌حل: `useMemo` مثل بالا).
- Context برای داده‌ی «کم‌تغییر و سراسری» عالی است (تم، زبان، کاربر). برای داده‌ای که **خیلی سریع** عوض می‌شود (مثلاً مختصات ماوس) مناسب نیست.
- Contextهای جدا برای چیزهای نامرتبط بساز (یک Context غول‌پیکر برای همه‌چیز نه).
- Context «وسیله‌ی نقل مکان داده» است، نه جایگزین State: داده هنوز یک State یا Reducer می‌خواهد که در Provider زندگی کند.
- فقط برای چند سطح Prop Drilling Context نساز؛ اول ببین **Composition** (دادن `children`) مشکل را حل می‌کند یا نه.

---

# 13. `useReducer`

وقتی State پیچیده است و چند «نوع تغییر» دارد (سبد خرید: افزودن، تغییر تعداد، حذف، خالی کردن)، `useState` با چند `setX` پراکنده شلوغ می‌شود. `useReducer` همه‌ی منطق تغییر را در **یک تابع** (Reducer) جمع می‌کند.

```text
Reducer: (stateفعلی, action) => stateجدید
```

```jsx
import { useReducer } from "react";

function cartReducer(state, action) {
  switch (action.type) {
    case "add":
      return state.some((l) => l.id === action.id)
        ? state.map((l) => (l.id === action.id ? { ...l, qty: l.qty + 1 } : l))
        : [...state, { id: action.id, qty: 1 }];

    case "changeQty":
      return state
        .map((l) => (l.id === action.id ? { ...l, qty: l.qty + action.delta } : l))
        .filter((l) => l.qty > 0);

    case "remove":
      return state.filter((l) => l.id !== action.id);

    case "clear":
      return [];

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Cart() {
  const [cart, dispatch] = useReducer(cartReducer, []);

  return (
    <>
      <button onClick={() => dispatch({ type: "add", id: 1 })}>افزودن</button>
      <button onClick={() => dispatch({ type: "changeQty", id: 1, delta: -1 })}>کم کردن</button>
      <pre>{JSON.stringify(cart)}</pre>
    </>
  );
}
```

نتیجه‌ی آزمایش: دو بار «افزودن» → `[{"id":1,"qty":2}]`؛ دو بار «کم کردن» → `[]` (ردیف با تعداد صفر حذف شد)؛ و یک Action ناشناخته خطای `Unknown action: oops` پرتاب کرد.

**قاعده‌های Reducer:**

- **خالص** باشد: فقط از `state` و `action` استفاده کند، بدون تغییر مستقیم State و بدون کار جانبی (درخواست شبکه، `localStorage`، ...)
- Action یک Object توصیف‌گر است (`{ type: "add", id: 1 }`)؛ `dispatch` فقط «بگو چه اتفاقی افتاد»، نه «چطور State را عوض کن»
- State را همیشه Immutable برگردان

## `useState` در برابر `useReducer`

| | `useState` | `useReducer` |
|---|------------|--------------|
| State ساده | عالی | زیادی |
| چند عمل مختلف روی یک State | شلوغ | تمیز |
| منطق تغییر | پراکنده در Handlerها | یک‌جا و قابل‌تست |
| تست منطق | سخت‌تر | Reducer یک تابع خالص است؛ بدون React هم تست می‌شود |

## `useReducer` + Context = «Store» کوچک

الگوی پرکاربرد برای State سراسری (مثلاً سبد خرید Sportify):

```jsx
// cart-context.jsx
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);

function loadCart() {
  try {
    const data = JSON.parse(localStorage.getItem("cart"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, undefined, loadCart);   // مقداردهی اولیه‌ی تنبل

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch { /* ... */ }
  }, [cart]);

  const value = useMemo(() => ({ cart, dispatch }), [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
```

```jsx
function ProductCard({ product }) {
  const { dispatch } = useCart();

  return (
    <button onClick={() => dispatch({ type: "add", id: product.id })}>
      افزودن به سبد
    </button>
  );
}
```

(`useReducer(reducer, initialArg, init)`: آرگومان سوم تابع مقداردهی اولیه است؛ `loadCart` فقط یک بار اجرا می‌شود.)

---

# 14. چند Hook دیگر (معرفی کوتاه)

| Hook | کاربرد |
|------|--------|
| `useId` | ساخت شناسه‌ی یکتا و پایدار برای `label` و `id` (دسترس‌پذیری فرم) بدون تصادم |
| `useLayoutEffect` | مثل `useEffect` ولی قبل از رنگ‌آمیزی صفحه (برای اندازه‌گیری DOM و جلوگیری از «پرش»)؛ فقط وقتی لازم است |
| `useSyncExternalStore` | اتصال به یک «منبع بیرونی» (مثل همین `progress.js` در سایت خودت یا یک Store) |
| `useTransition`، `useDeferredValue` | روان نگه‌داشتن UI در به‌روزرسانی‌های سنگین (مبحث پیشرفته) |

```jsx
import { useId } from "react";

function Field({ label }) {
  const id = useId();

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </>
  );
}
```

---

# 15. Error Boundary (معرفی کوتاه)

خطایی که **در حین Render** رخ دهد (مثل `undefined.name`)، کل درخت React را خراب می‌کند و صفحه‌ی سفید می‌دهد. **Error Boundary** یک Component ویژه است که خطای فرزندانش را می‌گیرد و UI جایگزین نشان می‌دهد. (فقط Class Component می‌تواند باشد؛ برای راحتی معمولاً از کتابخانه‌ی `react-error-boundary` استفاده می‌شود.)

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <p role="alert">مشکلی پیش آمد.</p>;
    return this.props.children;
  }
}

<ErrorBoundary>
  <MovieList />
</ErrorBoundary>
```

دقت: Error Boundary خطای **Event Handlerها** و **کد Async** (مثل `fetch`) را نمی‌گیرد؛ آن‌ها را با `try` / `catch` و `status: "error"` مدیریت می‌کنیم.

---

# 16. نکات مهم فصل

### نکته ۱

Effect برای همگام‌سازی با دنیای بیرون است؛ اگر کار با «رویداد کاربر» شروع می‌شود، در Event Handler بنویس.

---

### نکته ۲

هر مقدار واکنشی که Effect استفاده می‌کند در Dependency Array باشد؛ به ESLint اعتماد کن.

---

### نکته ۳

هر Effect که چیزی را راه می‌اندازد (تایمر، Listener، درخواست) Cleanup داشته باشد. دوبار اجرا شدن در `StrictMode` یعنی Cleanup‌ات را بازبینی کن.

---

### نکته ۴

درخواست در Effect همیشه با `AbortController` و Cleanup؛ `AbortError` را نادیده بگیر.

---

### نکته ۵

وضعیت داده را با یک `status` نگه دار (`idle` / `loading` / `success` / `empty` / `error`)، نه چند Boolean جدا.

---

### نکته ۶

چیزی که محاسبه‌شدنی است State نیست؛ و چیزی که روی صفحه دیده نمی‌شود (مثل `timerId`) State نیست، `ref` است.

---

### نکته ۷

اول بهینه‌سازی نکن؛ بعد از اندازه‌گیری، `memo`، `useMemo` و `useCallback` را با هم و فقط جاهای لازم.

---

### نکته ۸

منطق تکراری را در Custom Hook جمع کن؛ نامش با `use` شروع شود.

---

### نکته ۹

Context برای داده‌ی کم‌تغییر و سراسری؛ `value` را `useMemo` کن؛ Custom Hook بساز که بیرون از Provider خطای واضح بدهد.

---

# 17. اشتباهات رایج

1. نوشتن Hook داخل `if`، حلقه یا بعد از `return` زودهنگام.
2. نوشتن `[]` فقط چون «می‌خواهم یک بار اجرا شود»، وقتی Effect به متغیرهای دیگر وابسته است.
3. وابستگی Object / Array / تابع که در هر Render ساخته می‌شود (Effect بی‌پایان).
4. نوشتن `setState` داخل Effect بدون آرایه‌ی وابستگی (`Maximum update depth exceeded`).
5. فراموش کردن Cleanup برای تایمر، Listener یا درخواست.
6. فکر کردن اینکه دوبار اجرا شدن Effect در Development «باگ React» است.
7. `async` کردن مستقیم تابع Effect.
8. Stale Closure در `setInterval` (نوشتن `setCount(count + 1)` به‌جای Updater).
9. استفاده از Effect برای Derived Data، یا برای کاری که باید در Event Handler باشد.
10. فراموش کردن `response.ok` و `AbortController` هنگام `fetch` در Effect.
11. نمایش `AbortError` به‌عنوان خطا.
12. ذخیره‌ی چند Boolean (`isLoading`، `isError`) که با هم ناسازگار می‌شوند.
13. خواندن یا نوشتن `ref.current` در حین Render.
14. استفاده از `ref` برای چیزی که باید State باشد (و UI به‌روز نمی‌شود).
15. `useMemo` و `useCallback` همه‌جا؛ یا `memo` همراه با تابع inline که هر بار جدید است.
16. `value={{ a, b }}` مستقیم در Provider Context (Render بی‌دلیل همه‌ی مصرف‌کننده‌ها).
17. یک Context غول‌پیکر برای کل برنامه.
18. Mutate کردن State داخل Reducer.
19. کار جانبی (`fetch`، `localStorage`) داخل Reducer.
20. نام Custom Hook بدون پیشوند `use`.

---

# 18. تمرین‌ها

## سطح ۱ — `useEffect` و Cleanup

### تمرین ۱

با `useEffect` عنوان صفحه را به مقدار یک State (نام کاربر) وصل کن. بعد با تایپ در یک `input` مقدار را عوض کن.

---

### تمرین ۲

یک ساعت دیجیتال بساز (`setInterval` + Cleanup). با `StrictMode` در Console ببین Effect دوبار اجرا می‌شود؟ Cleanup را بردار و تفاوت را ببین (چند تایمر ساخته می‌شود؟).

---

### تمرین ۳

یک Component بساز که عرض پنجره را نشان دهد (با Listener روی `resize` و Cleanup).

---

### تمرین ۴

چرا این کد روی `1` می‌ماند؟ دو راه اصلاح بنویس:

```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000);
  return () => clearInterval(id);
}, []);
```

---

### تمرین ۵

این Effect چند بار اجرا می‌شود؟ چرا؟ اصلاحش کن:

```jsx
function Demo() {
  const [n, setN] = useState(0);
  const options = { theme: "dark" };

  useEffect(() => {
    console.log("effect");
  }, [options]);

  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
```

---

## سطح ۲ — گرفتن داده

### تمرین ۶

لیست کاربران JSONPlaceholder را با `useEffect` بگیر و چهار حالت `loading`، `error`، `empty` و `success` را جدا نمایش بده. با حالت Offline در DevTools خطا را ببین.

---

### تمرین ۷

یک `input` جستجو بساز که با هر تغییر، پست‌ها را بگیرد (`?q=`). اول بدون Cleanup، بعد با `AbortController` پیاده‌سازی کن و در تب Network تفاوت (`canceled`) را ببین.

---

### تمرین ۸

دو Component جدا (یکی شمارنده، یکی لیست) بساز. کدام کارها در Event Handler و کدام‌ها در Effect می‌روند؟ توضیح بده.

---

## سطح ۳ — `useRef`

### تمرین ۹

فرمی بساز که هنگام Mount فیلد اول فوکوس بگیرد (`useRef` + `useEffect`).

---

### تمرین ۱۰

یک شمارنده‌ی «تعداد Render» بساز که با `useRef` تعداد Renderهای Component را بشمارد (و نمایش بدهد). چرا اینجا `useState` اشتباه است؟

---

### تمرین ۱۱

`usePrevious` را بنویس و نمایش بده: «مقدار فعلی: ۵، قبلی: ۴».

---

## سطح ۴ — Custom Hook

### تمرین ۱۲

`useToggle`، `useDebounce` و `useLocalStorage` را از حفظ بنویس. با `useLocalStorage` یک تم (روشن/تیره) بساز که بعد از Refresh حفظ شود.

---

### تمرین ۱۳

`useFetch` را بنویس و در یک Component لیست پست‌ها استفاده کن. بعد یک Prop به آن بده تا بتوانی آدرس را عوض کنی (و درخواست قبلی لغو شود).

---

### تمرین ۱۴

یک Hook به نام `useWindowSize` بساز که `{ width, height }` را برگرداند.

---

## سطح ۵ — Context و Reducer

### تمرین ۱۵

`ThemeProvider` و `useTheme` را بساز (با خطای واضح خارج از Provider). دو Component دور از هم از آن استفاده کنند.

---

### تمرین ۱۶

سبد خرید Sportify را با `useReducer` بنویس (`add`، `changeQty`، `remove`، `clear`) و Reducer را بدون React، با چند `console.assert` تست کن.

---

### تمرین ۱۷

`CartProvider` و `useCart` را بساز و سبد را با `useEffect` در `localStorage` ذخیره کن (با بازیابی ایمن).

---

## سطح ۶ — تحلیل و بهینه‌سازی

### تمرین ۱۸

خروجی را پیش‌بینی کن:

```jsx
useEffect(() => {
  console.log("effect");
  return () => console.log("cleanup");
}, []);
```

الف) بدون `StrictMode`؛ ب) با `StrictMode` (در Development).

---

### تمرین ۱۹

در یک Parent با یک `ProductList` سنگین، با Profiler ببین `ProductList` چند بار Render می‌شود. با `memo` و `useCallback` کاهشش بده و اندازه‌گیری کن.

---

### تمرین ۲۰

سؤال تحلیلی: در هر مورد Effect، Event Handler، Derived Data یا `key` مناسب است؟

```text
الف) نمایش تعداد آیتم‌های انتخاب‌شده (از روی آرایه‌ی items)
ب) ارسال فرم به سرور
ج) گرفتن اطلاعات کاربر وقتی userId عوض شد
د) ریست کردن State فرم وقتی کاربر دیگری انتخاب شد
ه) ثبت Listener روی window.resize
```

---

# 19. پاسخنامه‌ی مختصر (پس از تلاش خودت ببین)

**تمرین ۴:** Callback تایمر `count` همان Render اول (`0`) را در Closure نگه داشته؛ پس همیشه `0 + 1`. راه‌حل‌ها: `setCount((c) => c + 1)` (ترجیحاً)، یا `[count]` در آرایه‌ی وابستگی (که تایمر را در هر تغییر دوباره می‌سازد).

**تمرین ۵:** در هر Render اجرا می‌شود (دو کلیک یعنی ۳ بار)، چون `options` هر بار Object جدید است. راه‌حل: Object را بیرون از Component تعریف کن، یا فقط `options.theme` (رشته) را وابستگی بگذار، یا `useMemo`.

**تمرین ۷ (هسته‌ی Cleanup):**

```jsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`https://jsonplaceholder.typicode.com/posts?q=${encodeURIComponent(q)}`, {
    signal: controller.signal,
  })
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(setPosts)
    .catch((error) => {
      if (error.name !== "AbortError") setError(error);
    });

  return () => controller.abort();
}, [q]);
```

**تمرین ۸:** شمارنده: Event Handler (`onClick`). لیست: Effect (چون «Component روی صفحه است» و داده لازم دارد).

**تمرین ۹:**

```jsx
function SignupForm() {
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  return <input ref={nameRef} />;
}
```

**تمرین ۱۰:** `useRef` چون تغییر شمارنده‌ی Render نباید خودش Render جدید بسازد (با `useState` هر Render دوباره Render می‌ساخت: حلقه‌ی بی‌پایان).

```jsx
const renders = useRef(0);
renders.current += 1;     // استثنا: فقط برای آموزش/دیباگ؛ در کد واقعی در Render ref نمی‌نویسیم
```

**تمرین ۱۱:** از بخش ۹ (`usePrevious`).

**تمرین ۱۶ (نمونه‌ی تست Reducer):**

```js
console.assert(cartReducer([], { type: "add", id: 1 }).length === 1, "add creates a line");

const two = cartReducer(cartReducer([], { type: "add", id: 1 }), { type: "add", id: 1 });
console.assert(two[0].qty === 2, "adding twice increases qty");

console.assert(cartReducer(two, { type: "changeQty", id: 1, delta: -2 }).length === 0, "qty 0 removes the line");
```

**تمرین ۱۸:**

```text
الف) effect
ب) effect, cleanup, effect
```

**تمرین ۲۰:** الف) Derived Data (`items.length` در Render). ب) Event Handler (`onSubmit`). ج) Effect (با وابستگی `userId` و Cleanup). د) `key` (`<Form key={userId} />`). ه) Effect با Cleanup.

---

# 20. پروژه پایان فصل

## Movie Explorer در React

پروژه‌ی Movie Explorer را (که با JavaScript خالص و OMDb شروع کرده‌ای) در React بازنویسی کن. این بار منطق همان‌هاست؛ ولی با `useEffect`، Custom Hook و Context بسیار تمیزتر می‌شود. اگر نسخه‌ی خالص را تمام کرده‌ای، همان `api/client.js` و `api/omdb.js` را بدون تغییر دوباره استفاده کن (این نشان می‌دهد لایه‌ی API خوب از UI جداست).

**ساختار پیشنهادی:**

```text
src/
├── main.jsx
├── App.jsx
├── api/
│   ├── client.js          ← از فصل ۶ (بدون تغییر)
│   └── omdb.js            ← searchMovies، getMovieDetails، Adapter
├── hooks/
│   ├── useDebounce.js
│   ├── useMovies.js       ← جستجو + status + AbortController
│   └── useLocalStorage.js
├── context/
│   └── FavoritesContext.jsx
└── components/
    ├── SearchBar.jsx
    ├── MovieList.jsx
    ├── MovieCard.jsx
    ├── MovieDetails.jsx   ← <dialog> یا صفحه‌ی جدا
    └── StatusMessage.jsx  ← idle / loading / empty / error
```

**هسته‌ی `useMovies`** (اجرا و آزمایش شده با یک API ساختگی: وضعیت‌های `idle`، `loading`، `success`، `empty`، `error` و برنده شدن آخرین جستجو در مسابقه‌ی درخواست‌ها درست بودند):

```jsx
// hooks/useMovies.js
import { useEffect, useState } from "react";
import { searchMovies } from "../api/omdb.js";

export function useMovies(query) {
  const [state, setState] = useState({ status: "idle", movies: [], error: null });

  useEffect(() => {
    const q = query.trim();

    if (q.length < 3) {                              // حداقل ۳ حرف
      setState({ status: "idle", movies: [], error: null });
      return;
    }

    const controller = new AbortController();
    setState((s) => ({ ...s, status: "loading", error: null }));

    searchMovies(q, { signal: controller.signal })
      .then(({ movies }) =>
        setState({ status: movies.length ? "success" : "empty", movies, error: null })
      )
      .catch((error) => {
        if (error.name === "AbortError") return;     // لغو عمدی؛ خطا نیست
        setState({ status: "error", movies: [], error });
      });

    return () => controller.abort();                 // Cleanup: درخواست قبلی لغو شود
  }, [query]);

  return state;
}
```

```jsx
// App.jsx
function App() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const { status, movies, error } = useMovies(debouncedQuery);

  return (
    <main>
      <SearchBar value={query} onChange={setQuery} />
      <StatusMessage status={status} error={error} />
      {status === "success" && <MovieList movies={movies} />}
    </main>
  );
}
```

**قابلیت‌ها:**

- جستجو با Debounce و لغو خودکار درخواست قبلی
- پنج وضعیت `idle` / `loading` / `success` / `empty` / `error` با دکمه‌ی «تلاش دوباره» برای خطا
- جزئیات فیلم با `getMovieDetails` (و Cleanup، چون هنگام باز شدن جزئیات هم درخواست داریم)
- **علاقه‌مندی‌ها (Favorites)** با Context + `useReducer` + `useLocalStorage`
- مدیریت `N/A` برای پوستر و خلاصه
- پیام مناسب برای هر نوع خطا (شبکه، کلید نامعتبر، سقف درخواست)
- (اختیاری) همگام‌سازی عبارت جستجو با آدرس، و Pagination

**محدودیت‌ها:**

- فقط React، `fetch` و CSS؛ بدون کتابخانه‌ی دیگر (فعلاً بدون TanStack Query و Router)
- هیچ درخواستی بدون Cleanup نباشد
- هر Effect وابستگی‌های کامل داشته باشد و ESLint هشدار `exhaustive-deps` ندهد
- منطق تکراری فقط در Custom Hook باشد؛ Componentها کوتاه و روشن
- State سراسری فقط با Context + Reducer، و Provider با `useMemo`
- کلید API در Git نباشد
- بدون `dangerouslySetInnerHTML`

**معیار قبولی:**

- تایپ سریع یک عبارت فقط یک درخواست نهایی می‌فرستد و در تب Network درخواست‌های قبلی `canceled` هستند
- با `StrictMode` هیچ باگ یا درخواست تکراری مشکل‌ساز دیده نمی‌شود
- هیچ هشدار یا خطایی در Console نیست
- در حالت Offline پیام خطا و دکمه‌ی «تلاش دوباره» درست کار می‌کند
- علاقه‌مندی‌ها بعد از Refresh می‌مانند
- با Profiler نشان می‌دهی کدام Component‌ها هنگام تایپ Render می‌شوند و چرا
- پروژه روی GitHub با Commitهای مرتب، README و اسکرین‌شات است

---

# 21. چک‌لیست خودارزیابی

- [ ] قاعده‌های Hook را می‌دانم و علت خطای Hook شرطی را توضیح می‌دهم
- [ ] تفاوت سه شکل Dependency Array را می‌دانم
- [ ] وابستگی‌ها را کامل می‌نویسم و تله‌ی Object / Array را می‌شناسم
- [ ] برای هر Effect Cleanup درست می‌نویسم
- [ ] دلیل `effect, cleanup, effect` در `StrictMode` را توضیح می‌دهم
- [ ] Stale Closure در `setInterval` را تشخیص می‌دهم و حل می‌کنم
- [ ] می‌دانم چه زمانی «به Effect نیاز ندارم» (Derived Data، Event Handler، `key`)
- [ ] داده را با `useEffect` می‌گیرم و ۴–۵ وضعیت را مدیریت می‌کنم
- [ ] درخواست را با `AbortController` لغو می‌کنم و Race Condition را توضیح می‌دهم
- [ ] از `useRef` برای DOM و مقدار بدون Render استفاده می‌کنم
- [ ] تفاوت Ref و State را می‌دانم
- [ ] `memo` و `useCallback` را با هم و فقط جاهای لازم به‌کار می‌برم
- [ ] Custom Hook (`useDebounce`، `useLocalStorage`، `useFetch`) می‌نویسم
- [ ] Context + Provider + Custom Hook می‌سازم و `value` را Memoize می‌کنم
- [ ] `useReducer` و Reducer خالص می‌نویسم
- [ ] Context و Reducer را برای State سراسری ترکیب می‌کنم
- [ ] Error Boundary را در حد مفهوم می‌شناسم
- [ ] Movie Explorer را در React بازنویسی کرده‌ام

---

# خلاصه فصل

```text
Hook
↓
فقط در سطح بالا و داخل Component / Custom Hook؛ ترتیب فراخوانی مهم است.

useEffect
↓
همگام‌سازی با دنیای بیرون؛ بعد از Render؛ آرایه‌ی وابستگی کامل؛ Cleanup.

StrictMode
↓
Effect → Cleanup → Effect؛ یعنی Cleanup باید درست باشد.

شاید Effect نخواهی
↓
Derived Data را محاسبه کن؛ رویداد را در Handler؛ ریست State با key.

گرفتن داده
↓
status (idle / loading / success / empty / error)؛ response.ok؛ AbortController و Cleanup.

useRef
↓
DOM و مقدار بدون Render؛ تغییرش Re-render نمی‌سازد.

memo / useMemo / useCallback
↓
بعد از اندازه‌گیری؛ memo و useCallback با هم.

Custom Hook
↓
جمع‌کردن منطق تکراری: useDebounce، useLocalStorage، useFetch.

Context
↓
داده‌ی سراسری کم‌تغییر؛ Provider + useMemo + Custom Hook.

useReducer
↓
State پیچیده با Reducer خالص؛ با Context یک Store کوچک می‌شود.
```

---

# فصل بعد

در فصل بعد، پروژه‌ات را از «یک صفحه» به «چند صفحه و ساختار حرفه‌ای» می‌رسانیم:

```text
React Router (مسیرها، پارامترها، ناوبری، صفحه‌ی ۴۰۴، مسیر محافظت‌شده)
فرم‌های پیشرفته در React (اعتبارسنجی، کتابخانه‌ها)
TanStack Query (کش، Loading و Error خودکار، Refetch، Mutation)
ساختار پروژه‌های بزرگ‌تر (Feature-based)
```
