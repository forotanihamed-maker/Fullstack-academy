# React — فصل ۱: مبانی React

> **مرحله ۷ از مسیر فول‌استک — React**  
> مباحث این فصل: چرا React، ساخت پروژه با Vite، JSX، Component، Props، State (`useState`)، Eventها، Conditional Rendering، Lists و Keys، فرم‌ها (Controlled Components)، Lifting State Up، Thinking in React، استایل‌دهی، خطاهای رایج  
> پیش‌نیاز: JavaScript (به‌خصوص Closure، Spread، `map` / `filter`، به‌روزرسانی Immutable، Module) و Git  
> زمان پیشنهادی: ۸ تا ۱۲ روز

---

## هدف فصل

تا اینجا UI را به‌صورت دستی با DOM ساخته‌ای: المان پیدا می‌کردی، به آن Listener می‌دادی، `textContent` را عوض می‌کردی و `innerHTML` می‌ساختی. با بزرگ‌تر شدن پروژه (Sportify، TaskFlow) دیدی که «هماهنگ نگه‌داشتن داده و صفحه» سخت می‌شود. **React** دقیقاً برای حل همین مشکل ساخته شده است.

بعد از این فصل باید بتوانی:

- توضیح بدهی React چه مشکلی را حل می‌کند و فرق «Declarative» با «Imperative» چیست
- یک پروژه‌ی React با Vite بسازی و ساختارش را بفهمی
- JSX بنویسی و قواعدش را بدانی
- UI را به Componentهای کوچک و قابل‌استفاده‌ی مجدد تقسیم کنی
- با Props داده را از والد به فرزند بفرستی
- با `useState` حافظه‌ی Component بسازی و بدانی State چطور کار می‌کند
- Eventها را درست مدیریت کنی
- شرط‌ها و لیست‌ها را رندر کنی و `key` را درست بنویسی
- فرم‌ها را با Controlled Components بسازی
- State را به بالاترین والد مشترک ببری (Lifting State Up)
- یک UI را قدم‌به‌قدم به شکل React فکر و طراحی کنی
- مهم‌ترین خطاهای تازه‌کارها را بشناسی و رفع کنی
- پروژه‌ی Sportify را در React بازنویسی کنی

> **قول عملی:** مثال‌های این فصل با React ۱۹ در مرورگر اجرا و رفتارشان بررسی شده است؛ مثلاً اینکه `setCount(count + 1)` سه‌بار پشت‌سرهم فقط یک واحد اضافه می‌کند، یا اینکه `key` برابر `index` چه باگی می‌سازد. همه‌ی «خروجی»هایی که در متن می‌بینی واقعی‌اند.

---

# 1. React چیست و چرا؟

**React** یک کتابخانه‌ی JavaScript برای ساخت رابط کاربری (UI) است. ساخته‌ی شرکت Meta و پرکاربردترین ابزار Front-End دنیا.

## مشکل کد Imperative

در JavaScript خالص تو باید **قدم‌به‌قدم** به مرورگر بگویی چه کند:

```js
// شمارنده با JavaScript خالص (Imperative)
const button = document.querySelector("#btn");
const text = document.querySelector("#count");
let count = 0;

button.addEventListener("click", () => {
  count++;
  text.textContent = count;   // خودت باید DOM را هم به‌روز کنی
});
```

در یک شمارنده ساده است. ولی در Sportify باید در هر تغییر: لیست محصولات، شمارنده‌ی سبد، محتوای سبد، مجموع، `localStorage` و Empty State را **دستی هماهنگ** کنی. هر جا فراموش کنی، UI و داده از هم جدا می‌شوند.

## راه‌حل React: Declarative

در React به‌جای «چطور به‌روز کنم»، فقط **«UI با این داده چه شکلی است»** را توصیف می‌کنی. هر وقت داده عوض شد، React خودش صفحه را به‌روز می‌کند:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

فرمول اصلی React:

```text
UI = f(state)
```

یعنی UI یک «تابع از State» است. State را درست نگه دار؛ UI خودش درست می‌شود.

## چند مفهوم کلیدی

| مفهوم | معنی |
|-------|------|
| **Component** | یک تکه از UI که منطق و ظاهرش را با هم دارد (مثل `ProductCard`) |
| **State** | داده‌ای که در طول زمان عوض می‌شود و با تغییرش UI دوباره رسم می‌شود |
| **Props** | ورودی‌های یک Component از والدش |
| **Re-render** | اجرای دوباره‌ی تابع Component برای ساختن UI جدید |
| **Virtual DOM / Reconciliation** | React UI جدید را با قبلی مقایسه می‌کند و فقط تفاوت‌ها را روی DOM واقعی اعمال می‌کند |

**کتابخانه (Library) یا فریم‌ورک؟** React فقط لایه‌ی UI است. Routing، گرفتن داده، مدیریت State سراسری و غیره را با ابزارهای مکمل اضافه می‌کنی (React Router، TanStack Query و ...). در فصل‌های بعد می‌بینی.

> **قاعده:** React جایگزین JavaScript نیست. هرچه در JavaScript یاد گرفتی (`map`، `filter`، Spread، Closure، `async` / `await`) همین‌جا هم هر روز استفاده می‌شود. هرچه JavaScript را بهتر بدانی، React راحت‌تر است.

---

# 2. ساخت پروژه با Vite

**Vite** ابزار ساخت و اجرای پروژه‌های Front-End مدرن است (سرور توسعه‌ی سریع + Build).

**پیش‌نیاز:** Node.js نسخه‌ی LTS (ترجیحاً ۲۰ یا بالاتر). بررسی:

```bash
node -v
npm -v
```

**ساخت پروژه:**

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

بعد از `npm run dev` آدرسی مثل `http://localhost:5173` نشان داده می‌شود؛ آن را در مرورگر باز کن. (اگر Vite سؤال‌هایی پرسید، گزینه‌های «React» و «JavaScript» را انتخاب کن؛ متن سؤال‌ها بین نسخه‌ها کمی فرق می‌کند.)

> در PowerShell قدیمی ویندوز دستورها را در خطوط جدا بزن (نه با `&&`)، همان‌طور که در فصل Git دیدی.

**ساختار پروژه:**

```text
my-app/
├── index.html          ← تنها صفحه‌ی HTML؛ یک <div id="root"> دارد
├── package.json
├── vite.config.js
├── eslint.config.js
├── .gitignore          ← از قبل node_modules و dist را Ignore می‌کند
├── public/             ← فایل‌های ثابت (favicon، ...)
└── src/
    ├── main.jsx        ← نقطه‌ی شروع: React را به root وصل می‌کند
    ├── App.jsx         ← Component اصلی
    ├── App.css
    └── index.css
```

**`src/main.jsx`:**

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- `createRoot` React را به `<div id="root">` وصل می‌کند.
- `<App />` ریشه‌ی درخت Componentها است.
- `StrictMode` فقط در حالت توسعه به پیدا کردن باگ کمک می‌کند (بخش ۱۷).

**دستورهای مهم:**

| دستور | کار |
|-------|-----|
| `npm run dev` | سرور توسعه با Hot Reload |
| `npm run build` | ساخت نسخه‌ی نهایی در پوشه‌ی `dist` |
| `npm run preview` | دیدن نسخه‌ی Build‌شده |
| `npm run lint` | بررسی کد با ESLint |

**برای سایت فارسی:** در `index.html` همان تنظیمات فصل HTML را بگذار:

```html
<html lang="fa" dir="rtl">
```

و Font فارسی را در `index.css` تنظیم کن (فصل CSS).

**ابزار مهم:** افزونه‌ی مرورگر **React Developer Tools** را نصب کن. در DevTools دو تب جدید می‌دهد: **Components** (درخت Componentها، Props و State هرکدام) و **Profiler**. برای دیباگ React ضروری است.

**اولین تغییر:** فایل `App.jsx` را پاک کن و با این جایگزین کن تا مسیر را ببینی:

```jsx
function App() {
  return <h1>سلام React</h1>;
}

export default App;
```

و فایل را ذخیره کن؛ مرورگر بدون Refresh به‌روز می‌شود (Hot Module Replacement).

---

# 3. JSX

**JSX** ظاهراً HTML داخل JavaScript است، ولی در واقع **Syntax ویژه‌ای** است که به صورت Function Call به JavaScript تبدیل می‌شود:

```jsx
const element = <h1 className="title">سلام</h1>;
```

معادل (کاری که Vite/Babel در پشت صحنه می‌کند):

```js
const element = jsx("h1", { className: "title", children: "سلام" });
```

نیازی به نوشتن `import React` نیست؛ ابزار ساخت آن را خودکار اضافه می‌کند.

## قاعده‌های JSX

**۱) هر Component باید یک «ریشه» برگرداند.** برای چند المان از یک `div` یا از **Fragment** (`<>...</>`) استفاده کن:

```jsx
function Header() {
  return (
    <>
      <h1>عنوان</h1>
      <p>توضیح</p>
    </>
  );
}
```

**۲) همه‌ی تگ‌ها باید بسته شوند:**

```jsx
<img src="a.jpg" alt="..." />    {/* ✅ */}
<input type="text" />            {/* ✅ */}
<br />                           {/* ✅ */}
```

**۳) Attributeها camelCase هستند و بعضی نام‌ها فرق دارند:**

| HTML | JSX |
|------|-----|
| `class` | `className` |
| `for` | `htmlFor` |
| `onclick` | `onClick` |
| `tabindex` | `tabIndex` |
| `readonly` | `readOnly` |
| `maxlength` | `maxLength` |

اگر `class` بنویسی، React در Console هشدار می‌دهد:

```text
Invalid DOM property `class`. Did you mean `className`?
```

**۴) هر چیزی که JavaScript است داخل `{ }` می‌رود:**

```jsx
function Profile() {
  const name = "Ali";
  const age = 25;

  return (
    <div>
      <h2>{name}</h2>
      <p>{age + 1} سال بعد</p>
      <p>{name.toUpperCase()}</p>
      <p>{age >= 18 ? "بزرگسال" : "نوجوان"}</p>
      <img src={`/avatars/${name}.png`} alt={name} />
    </div>
  );
}
```

داخل `{ }` فقط **عبارت (Expression)** مجاز است، نه دستور (Statement). یعنی `if`، `for` و `const` را نمی‌توانی مستقیم داخل JSX بنویسی؛ از `? :`، `&&` و `map` استفاده کن (بخش‌های ۹ و ۱۰).

**۵) `style` یک Object است (نه رشته):**

```jsx
<p style={{ color: "red", fontSize: "1.6rem", marginTop: 8 }}>متن</p>
```

دو آکولاد: بیرونی برای «JavaScript در JSX» و درونی برای خود Object. نام ویژگی‌ها camelCase است (`fontSize` نه `font-size`).

**۶) کامنت در JSX:**

```jsx
{/* این یک کامنت است */}
```

**۷) Boolean Attributeها:**

```jsx
<button disabled>غیرفعال</button>          {/* disabled={true} */}
<input type="checkbox" checked={isOn} readOnly />
```

## امنیت: React به‌طور پیش‌فرض Escape می‌کند

```jsx
const comment = "<img src=x onerror=alert(1)>";

return <p>{comment}</p>;   // به‌صورت متن نمایش داده می‌شود، اجرا نمی‌شود
```

هر مقداری که با `{ }` در JSX می‌گذاری، به‌عنوان **متن** درج می‌شود؛ پس بسیاری از حمله‌های XSS که با `innerHTML` در پروژه‌های قبلی ممکن بود، اینجا پیش‌فرض بسته است.

دو استثنا که باید مراقبشان باشی:

- `dangerouslySetInnerHTML={{ __html: ... }}` دقیقاً «`innerHTML`» است؛ فقط با داده‌ی تمیزشده (Sanitize) و مطمئن.
- Attribute آدرس مثل `href={userInput}`: ورودی کاربر ممکن است `javascript:...` باشد. آدرس را قبل از استفاده اعتبارسنجی کن.

---

# 4. Component

**Component** یک تابع JavaScript است که **JSX برمی‌گرداند**:

```jsx
function Welcome() {
  return <h1>خوش آمدی</h1>;
}
```

و مثل یک تگ HTML از آن استفاده می‌کنیم:

```jsx
function App() {
  return (
    <div>
      <Welcome />
      <Welcome />
    </div>
  );
}
```

## قواعد

- **نام Component حتماً با حرف بزرگ** شروع شود (`Welcome` نه `welcome`). React با حرف کوچک آن را تگ HTML می‌داند (`<welcome>` یک المان ناشناخته است).
- هر Component یک **تابع** است و **JSX یا `null`** برمی‌گرداند.
- هر Component را در یک فایل جدا (`Welcome.jsx`) بنویس و Export کن:

```jsx
// components/Welcome.jsx
export default function Welcome() {
  return <h1>خوش آمدی</h1>;
}
```

```jsx
// App.jsx
import Welcome from "./components/Welcome.jsx";
```

(در Vite پسوند `.jsx` را بنویس.)

**Default Export در برابر Named Export:**

```jsx
export default function Button() {}   // import Button from "./Button.jsx"
export function Icon() {}              // import { Icon } from "./Icons.jsx"
```

## ساختن UI با ترکیب Componentها

```jsx
function App() {
  return (
    <>
      <Header />
      <main>
        <ProductList />
      </main>
      <Footer />
    </>
  );
}
```

UI یک **درخت** از Componentها است:

```text
App
├── Header
├── main
│   └── ProductList
│       ├── ProductCard
│       ├── ProductCard
│       └── ProductCard
└── Footer
```

## ❌ Component را داخل Component دیگر تعریف نکن

```jsx
function Parent() {
  const [n, setN] = useState(0);

  function Child() {                 // ❌ هر بار Parent رندر شود، Child «یک Component جدید» است
    return <input />;
  }

  return (
    <div>
      <button onClick={() => setN(n + 1)}>{n}</button>
      <Child />
    </div>
  );
}
```

نتیجه‌ی واقعی (آزمایش شد): وقتی داخل `<input>` چیزی تایپ کنی و روی دکمه کلیک کنی، `Parent` دوباره رندر می‌شود، `Child` هر بار یک Component **تازه** حساب می‌شود و `input` از نو ساخته می‌شود؛ مقداری که تایپ کرده بودی **پاک می‌شود**. اگر `Child` را **بیرون** از `Parent` تعریف کنی، مقدار می‌ماند.

**قاعده:** همه‌ی Componentها را در سطح بالای فایل تعریف کن.

---

# 5. Props

**Props** ورودی‌های یک Component هستند؛ مثل آرگومان‌های یک تابع:

```jsx
function ProductCard({ name, price }) {
  return (
    <article>
      <h3>{name}</h3>
      <p>{price} تومان</p>
    </article>
  );
}

function App() {
  return (
    <>
      <ProductCard name="کفش دویدن" price={890000} />
      <ProductCard name="کیف ورزشی" price={450000} />
    </>
  );
}
```

نکته: رشته را با `"..."` می‌دهیم، ولی عدد، Boolean، Object، آرایه و تابع را باید با `{ }`:

```jsx
<ProductCard name="کفش" price={890000} inStock={true} tags={["ورزش", "دویدن"]} onBuy={handleBuy} />
```

(`inStock` بدون مقدار، یعنی `true`.)

## Destructuring و مقدار پیش‌فرض

```jsx
function Button({ label = "تأیید", variant = "primary" }) {
  return <button className={`btn btn--${variant}`}>{label}</button>;
}
```

## `children`

هر چیزی که بین تگ باز و بسته بنویسی، در `props.children` می‌آید. این پایه‌ی **Composition** است:

```jsx
function Card({ title, children }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function App() {
  return (
    <Card title="درباره‌ی ما">
      <p>ما یک تیم کوچک هستیم.</p>
      <button>تماس</button>
    </Card>
  );
}
```

## ارسال تابع به‌عنوان Prop (برای ارتباط فرزند ← والد)

```jsx
function ProductCard({ product, onAdd }) {
  return (
    <article>
      <h3>{product.name}</h3>
      <button type="button" onClick={() => onAdd(product.id)}>افزودن</button>
    </article>
  );
}

function App() {
  function handleAdd(id) {
    console.log("added", id);
  }

  return <ProductCard product={{ id: 1, name: "کفش" }} onAdd={handleAdd} />;
}
```

نام‌گذاری رایج: Propهای تابع با `on` شروع می‌شوند (`onAdd`، `onChange`) و تابعی که در والد تعریف می‌شود با `handle` (`handleAdd`).

## Props فقط‌خواندنی‌اند

یک Component **هرگز** Props خودش را تغییر نمی‌دهد:

```jsx
function Title(props) {
  props.title = "changed";   // ❌
}
```

نتیجه‌ی واقعی (آزمایش شد):

```text
TypeError: Cannot assign to read only property 'title' of object '#<Object>'
```

اگر Component به یک مقدار قابل‌تغییر نیاز دارد، آن مقدار **State** است (بخش بعد).

## Spread Props

```jsx
const product = { name: "کفش", price: 890000 };

<ProductCard {...product} />   // معادل name="کفش" price={890000}
```

با احتیاط استفاده کن؛ مخصوصاً وقتی نمی‌دانی چه چیزی داخل Object است.

## Prop Drilling

وقتی داده را از چند سطح Component فقط برای رساندن به فرزند عمیق از بین می‌فرستی (`A → B → C → D`)، به آن **Prop Drilling** می‌گویند. برای چند سطح اشکالی ندارد؛ برای موارد زیاد، در فصل بعد با **Context** حل می‌کنیم.

---

# 6. State با `useState`

**State** حافظه‌ی یک Component است: داده‌ای که در طول زمان عوض می‌شود و باید UI را هم عوض کند.

## چرا متغیر معمولی کافی نیست؟

```jsx
function Counter() {
  let count = 0;                         // ❌ متغیر معمولی

  return <button onClick={() => { count++; }}>{count}</button>;
}
```

این کار نمی‌کند، به دو دلیل:

1. تغییر `count` به React خبر نمی‌دهد؛ پس Re-render اتفاق نمی‌افتد.
2. حتی اگر Re-render شود، تابع از اول اجرا می‌شود و `count` دوباره `0` می‌شود.

## `useState`

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>شمارش: {count}</button>;
}
```

- `useState(0)` مقدار اولیه را می‌گیرد.
- یک **آرایه‌ی دو‌عضوی** برمی‌گرداند: مقدار فعلی (`count`) و تابع تغییر (`setCount`).
- وقتی `setCount` صدا زده شود: React مقدار را عوض می‌کند و Component را **دوباره رندر** می‌کند.

## قاعده‌های Hook

`useState` یک **Hook** است (توابعی که با `use` شروع می‌شوند). دو قاعده:

1. Hookها را فقط در **سطح بالای** Component صدا بزن (نه داخل `if`، حلقه یا تابع تودرتو).
2. Hookها را فقط داخل **Component** (یا Hook سفارشی) صدا بزن.

## هر نمونه‌ی Component State خودش را دارد

```jsx
<Counter />
<Counter />   {/* شمارنده‌ی مستقل */}
```

دو `Counter` State جداگانه دارند و روی هم اثر نمی‌گذارند.

## State یک «عکس لحظه‌ای» (Snapshot) است

این مهم‌ترین مفهوم State است. **مقدار State در یک Render ثابت است.** صدا زدن `setCount` مقدار همان Render را عوض نمی‌کند؛ فقط یک Render **جدید** را درخواست می‌کند.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

یک کلیک چقدر اضافه می‌کند؟ نتیجه‌ی واقعی: **فقط ۱**، نه ۳. چون هر سه خط با همان مقدار `count` کار می‌کنند (مثلاً `0 + 1`).

```jsx
function handleClick() {
  setCount(count + 5);
  console.log(count);     // هنوز مقدار «قبلی»؛ State همین Render عوض نشده
}
```

نتیجه‌ی آزمایش: اگر `count` برابر ۴ بود، `console.log` مقدار ۴ را چاپ می‌کند، ولی بعد از Render UI عدد ۹ را نشان می‌دهد.

## Updater Function

وقتی مقدار جدید به مقدار **قبلی** وابسته است، یک تابع به `setState` بده:

```jsx
function handleClick() {
  setCount((c) => c + 1);
  setCount((c) => c + 1);
  setCount((c) => c + 1);
}
```

حالا یک کلیک **۳ واحد** اضافه می‌کند (آزمایش شد). `c` همیشه آخرین مقدار «در صف» است.

**قاعده‌ی عملی:** هر جا مقدار جدید از قبلی ساخته می‌شود (شمارنده، آرایه، سبد خرید)، از Updater Function استفاده کن.

## State می‌تواند هر نوعی باشد

```jsx
const [name, setName] = useState("");               // رشته
const [isOpen, setIsOpen] = useState(false);        // Boolean
const [items, setItems] = useState([]);             // آرایه
const [form, setForm] = useState({ name: "", age: 0 });   // Object
```

## ❌ State را مستقیم تغییر نده (Immutable)

از فصل ۴ می‌دانی: State باید **Immutable** به‌روز شود. React تغییر را با مقایسه‌ی **ارجاع (Reference)** تشخیص می‌دهد؛ اگر همان Object را تغییر بدهی و دوباره بفرستی، React فکر می‌کند چیزی عوض نشده:

```jsx
function toggle() {
  todos[0].done = !todos[0].done;   // ❌ Mutate
  setTodos(todos);                   // همان Array، همان ارجاع
}
```

نتیجه‌ی واقعی: **UI عوض نمی‌شود.** درست:

```jsx
function toggle() {
  setTodos(todos.map((t) => (t.id === 1 ? { ...t, done: !t.done } : t)));
}
```

الگوهای آشنا:

```jsx
// افزودن
setItems((prev) => [...prev, newItem]);

// حذف
setItems((prev) => prev.filter((item) => item.id !== id));

// ویرایش یک آیتم
setItems((prev) => prev.map((item) => (item.id === id ? { ...item, done: true } : item)));

// ویرایش Object
setForm((prev) => ({ ...prev, name: "Ali" }));

// ویرایش Object تو در تو
setUser((prev) => ({ ...prev, address: { ...prev.address, city: "Baku" } }));
```

## مقداردهی اولیه‌ی تنبل (Lazy Initial State)

اگر مقدار اولیه محاسبه‌ی سنگین دارد (مثلاً خواندن `localStorage`)، تابع بده، نه نتیجه:

```jsx
const [cart, setCart] = useState(() => loadCart());   // loadCart فقط یک بار اجرا می‌شود
const [cart, setCart] = useState(loadCart());          // ❌ loadCart در هر Render اجرا می‌شود
```

نتیجه‌ی آزمایش: با شکل اول، حتی بعد از چند Re-render، تابع فقط **یک بار** صدا زده می‌شود.

## کجا State بگذارم؟ و چه چیزی State نیست؟

State **نباید** برای چیزهایی باشد که از State/Props دیگر قابل‌محاسبه است (**Derived Data**):

```jsx
// ❌ تکرار اطلاعات؛ باید هماهنگشان نگه داری
const [items, setItems] = useState([]);
const [count, setCount] = useState(0);        // count همان items.length است

// ✅ محاسبه در هر Render
const [items, setItems] = useState([]);
const count = items.length;
const total = items.reduce((sum, i) => sum + i.price, 0);
```

این همان «یک منبع حقیقت» است که در Sportify و TaskFlow دیدی (Total را ذخیره نکن).

---

# 7. چطور React کار می‌کند (Render و Re-render)

برای نوشتن کد درست باید مدل ذهنی رندر را بدانی. هر به‌روزرسانی سه مرحله دارد:

```text
۱) Trigger   : یک چیز باعث رندر شد (اولین بار، یا setState)
۲) Render    : React تابع Component را صدا می‌زند و JSX جدید می‌گیرد
۳) Commit    : React فقط تفاوت JSX جدید با قبلی را روی DOM واقعی اعمال می‌کند
```

نکته‌ها:

- «Render» یعنی **اجرای تابع Component** (محاسبه‌ی UI)، نه لزوماً تغییر DOM. اگر خروجی تغییری نکرده باشد، DOM دست نمی‌خورد.
- وقتی State یک Component عوض شود، **آن Component و همه‌ی فرزندانش** دوباره رندر می‌شوند.
- Re-render ارزان است و ترسناک نیست؛ نگرانی بهینه‌سازی را به فصل‌های بعد بسپار.

## Componentها باید «خالص» (Pure) باشند

تابع Component با ورودی (Props و State) یکسان، **همیشه خروجی یکسان** بدهد و در حین Render **کار جانبی** نکند:

```jsx
let counter = 0;

function Bad() {
  counter++;                     // ❌ تغییر چیزی بیرون از Component هنگام Render
  return <p>{counter}</p>;
}
```

کار جانبی (درخواست شبکه، تغییر DOM، `localStorage`، تایمر) باید در **Event Handler** یا در `useEffect` (فصل بعد) باشد.

**`StrictMode`** برای کمک به پیدا کردن همین مشکل‌ها، در حالت توسعه هر Component را **دوبار** رندر می‌کند (آزمایش شد: `console.log` داخل Component دو بار چاپ می‌شود). این فقط در Dev است و در نسخه‌ی Build اتفاق نمی‌افتد. اگر Component خالص باشد، دوبار رندر هیچ مشکلی نمی‌سازد.

---

# 8. Eventها

```jsx
function SaveButton() {
  function handleClick() {
    console.log("Saved!");
  }

  return <button onClick={handleClick}>ذخیره</button>;
}
```

قاعده‌ها:

- نام Event به‌صورت camelCase: `onClick`، `onChange`، `onSubmit`، `onKeyDown`، `onMouseEnter`، `onFocus`، ...
- **تابع** را می‌دهی، نه «نتیجه‌ی صدا زدن» آن:

```jsx
<button onClick={handleClick}>OK</button>       {/* ✅ */}
<button onClick={handleClick()}>OK</button>     {/* ❌ همان لحظه‌ی رندر صدا زده می‌شود */}
<button onClick={() => handleClick()}>OK</button>   {/* ✅ Arrow برای ارسال آرگومان */}
```

نمونه‌ی واقعی خطای دوم، وقتی داخل Handler `setState` باشد:

```jsx
<button onClick={setCount(count + 1)}>...</button>
```

```text
Too many re-renders. React limits the number of renders to prevent an infinite loop.
```

چون `setCount` همان لحظه‌ی رندر صدا زده می‌شود، رندر دوباره، دوباره... .

## ارسال آرگومان

```jsx
<button onClick={() => handleDelete(item.id)}>حذف</button>
```

## شیء Event

```jsx
function SearchBox() {
  const [query, setQuery] = useState("");

  function handleChange(event) {
    setQuery(event.target.value);
  }

  return <input value={query} onChange={handleChange} />;
}
```

- `event.target` المانی که رویداد از آن شروع شد، `event.currentTarget` المانی که Handler روی آن است (مثل فصل DOM).
- `event.preventDefault()` رفتار پیش‌فرض (مثل ارسال فرم) را متوقف می‌کند.
- `event.stopPropagation()` انتشار رویداد به والد را متوقف می‌کند.

React برای Eventها از Event Delegation استفاده می‌کند؛ نیازی نیست خودت Listener روی والد بگذاری. هر `onClick` را روی همان المان بنویس.

---

# 9. Conditional Rendering

چند روش داریم و همه‌شان JavaScript معمولی‌اند:

**۱) `if` بیرون از JSX و Early Return:**

```jsx
function Greeting({ user }) {
  if (!user) {
    return <p>لطفاً وارد شو.</p>;
  }

  return <h1>سلام {user.name}</h1>;
}
```

**۲) عملگر سه‌تایی `? :` (دو حالت):**

```jsx
<p>{isLoggedIn ? "خوش آمدی" : "وارد شو"}</p>

{isLoggedIn ? <Dashboard /> : <LoginForm />}
```

**۳) `&&` (نمایش یا هیچ):**

```jsx
{hasError && <p className="error">خطایی رخ داد</p>}
```

**۴) متغیر برای حالت‌های بیشتر:**

```jsx
function Status({ status }) {
  if (status === "loading") return <p>در حال بارگذاری...</p>;
  if (status === "error") return <p>خطا</p>;
  if (status === "empty") return <p>موردی نیست</p>;

  return <ul>...</ul>;
}
```

(همان `idle` / `loading` / `empty` / `error` / `success` که در پروژه‌ی Movie Explorer داشتی.)

## تله‌ی `0 &&`

```jsx
{items.length && <ul>...</ul>}      {/* ❌ وقتی items خالی است، عدد 0 روی صفحه می‌آید */}
{items.length > 0 && <ul>...</ul>}  {/* ✅ */}
```

نتیجه‌ی آزمایش: اولی وقتی آرایه خالی است، متن `0` را رندر می‌کند؛ دومی هیچ. چون `0` در JavaScript Falsy است ولی React عدد `0` را نمایش می‌دهد (برخلاف `false`، `null` و `undefined` که چیزی نمایش نمی‌دهند).

## `null` یعنی «هیچ‌چیز»

```jsx
function Modal({ isOpen, children }) {
  if (!isOpen) return null;     // Component هیچ‌چیز رندر نمی‌کند

  return <div className="modal">{children}</div>;
}
```

**نکته:** وقتی Componentای را «رندر نمی‌کنی»، State آن **از بین می‌رود**؛ ولی اگر فقط با CSS (`hidden`) مخفی‌اش کنی، State می‌ماند. گاهی همین تفاوت تصمیم درست را مشخص می‌کند.

---

# 10. لیست‌ها و `key`

برای رندر لیست از `map` استفاده می‌کنیم:

```jsx
const products = [
  { id: 1, name: "کفش" },
  { id: 2, name: "کیف" },
  { id: 3, name: "تشک" },
];

function ProductList() {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

## `key` چیست؟

`key` به React می‌گوید «کدام آیتم همان آیتم قبلی است». بدون آن، وقتی لیست تغییر کند (حذف، افزودن، جابه‌جایی)، React نمی‌تواند آیتم‌ها را درست تطبیق بدهد.

اگر `key` ننویسی، در Console خطا می‌بینی:

```text
Each child in a list should have a unique "key" prop.
```

## قواعد `key`

- **یکتا** بین هم‌نوع‌ها (فقط در همان لیست)
- **ثابت**: برای یک آیتم همیشه یک مقدار (از `id` داده)
- بهتر است از **داده** بیاید (`product.id`)
- **`Math.random()` ممنوع** (هر Render کلید جدید می‌سازد و همه‌چیز از نو ساخته می‌شود)
- `index` فقط برای لیست‌های **ثابت** که هرگز ترتیب یا تعدادشان عوض نمی‌شود

## چرا `index` خطرناک است؟ (باگ واقعی)

لیست سه‌تایی A، B، C که هر کدام یک `<input>` دارند. در اولین `input` (مال A) چیزی تایپ کن و بعد A را حذف کن:

```jsx
{items.map((item, index) => (
  <li key={index}>
    <span>{item.title}</span>
    <input />
    <button onClick={() => remove(item.id)}>حذف</button>
  </li>
))}
```

نتیجه‌ی آزمایش با `key={index}`: برچسب اولین سطر شد «B» (درست)، ولی **متنی که برای A تایپ کرده بودی در سطر B ماند** (React فکر کرد سطر اول همان سطر قبلی است). با `key={item.id}` ورودی خالی است و هر چیز درست جا افتاده.

**قاعده:** هر جا لیست قابل افزودن، حذف یا مرتب‌سازی است، `key` را از `id` بنویس.

## `key` روی چه المانی؟

روی **بیرونی‌ترین** المانی که داخل `map` برمی‌گردانی:

```jsx
{products.map((p) => (
  <ProductCard key={p.id} product={p} />    {/* key روی Component، نه روی المان داخلش */}
))}
```

اگر دو المان را بدون والد می‌خواهی برگردانی، از `Fragment` با `key` استفاده کن:

```jsx
import { Fragment } from "react";

{items.map((item) => (
  <Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.description}</dd>
  </Fragment>
))}
```

## فیلتر و مرتب‌سازی

داده‌ی اصلی را تغییر نده؛ یک نسخه‌ی جدید بساز:

```jsx
// ✅ filter یک آرایه‌ی «جدید» برمی‌گرداند؛ sort روی همان نسخه‌ی جدید اثر می‌گذارد
const visible = products
  .filter((p) => p.name.includes(query))
  .sort((a, b) => a.price - b.price);

// ❌ sort خودِ آرایه را تغییر می‌دهد؛ اگر products State یا Props باشد، آن را Mutate کرده‌ای
products.sort((a, b) => a.price - b.price);

// ✅ اول کپی بگیر
const sorted = [...products].sort((a, b) => a.price - b.price);
```

---

# 11. فرم‌ها: Controlled Components

در HTML خالص، مقدار فیلد داخل خود DOM است. در React، **State منبع حقیقت مقدار فیلد** است. به این الگو **Controlled Component** می‌گویند:

```jsx
function NameForm() {
  const [name, setName] = useState("");

  return (
    <input
      value={name}
      onChange={(event) => setName(event.target.value)}
    />
  );
}
```

جریان: کاربر تایپ می‌کند ← `onChange` ← `setName` ← Render ← `value` جدید روی `input`.

اگر `value` بدهی ولی `onChange` ندهی، فیلد فقط‌خواندنی می‌شود و React هشدار می‌دهد:

```text
You provided a `value` prop to a form field without an `onChange` handler.
This will render a read-only field. If the field should be mutable use `defaultValue`...
```

## فرم با چند فیلد (یک Handler)

```jsx
function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "", agree: false });

  function handleChange(event) {
    const { name, type, value, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,   // کلید محاسبه‌شده
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();       // جلوگیری از Refresh صفحه
    console.log("Submitted:", form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">نام</label>
      <input id="name" name="name" value={form.name} onChange={handleChange} />

      <label htmlFor="email">ایمیل</label>
      <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />

      <label>
        <input name="agree" type="checkbox" checked={form.agree} onChange={handleChange} />
        قوانین را می‌پذیرم
      </label>

      <button type="submit">ثبت‌نام</button>
    </form>
  );
}
```

نتیجه‌ی آزمایش: بعد از پر کردن فیلدها و ارسال، State برابر بود با `{"name":"Ali","email":"a@b.c","agree":true}`، و `preventDefault` جلوی Refresh را گرفت.

نکته‌ها:

- `name` هر فیلد باید با کلید همان فیلد در State یکی باشد (`[name]: value`).
- Checkbox به `checked` وصل می‌شود، نه `value`.
- `<label htmlFor="...">` به `id` وصل می‌شود (دسترس‌پذیری همان قبلی؛ حالا با `htmlFor`).

## `select`، `textarea` و `radio`

```jsx
<select value={level} onChange={(e) => setLevel(e.target.value)}>
  <option value="beginner">مبتدی</option>
  <option value="junior">جونیور</option>
</select>

<textarea value={bio} onChange={(e) => setBio(e.target.value)} />   {/* در React مقدار با value می‌آید، نه بین دو تگ */}

<label>
  <input type="radio" name="plan" value="free" checked={plan === "free"} onChange={(e) => setPlan(e.target.value)} />
  رایگان
</label>
```

## اعتبارسنجی و پیام خطا

```jsx
function LoginForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.includes("@")) {
      setError("ایمیل معتبر نیست");
      return;
    }

    setError("");
    // ارسال...
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="email">ایمیل</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? "email-error" : undefined}
      />
      {error && <p id="email-error" role="alert">{error}</p>}
      <button type="submit">ورود</button>
    </form>
  );
}
```

(همان `aria-describedby` و `role="alert"` فصل HTML پیشرفته؛ اعتبارسنجی سمت Client امنیت نیست و سرور نیز باید بررسی کند.)

## ریست کردن فرم

```jsx
setForm({ name: "", email: "", agree: false });
```

## Uncontrolled (بدون State)

اگر به مقدار فقط هنگام ارسال نیاز داری، می‌توانی از `FormData` استفاده کنی:

```jsx
function handleSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log(data.get("email"));
}

<form onSubmit={handleSubmit}>
  <input name="email" defaultValue="" />
  <button type="submit">ارسال</button>
</form>
```

`defaultValue` فقط مقدار اولیه است. برای اعتبارسنجی لحظه‌ای یا وابستگی فیلدها به هم، Controlled بهتر است.

---

# 12. Lifting State Up (بالا بردن State)

وقتی **دو Component** باید یک داده را داشته باشند، State را به **نزدیک‌ترین والد مشترک** ببر و با Props پایین بفرست. جریان داده در React **یک‌طرفه** است (بالا ← پایین)، و فرزند با تابعی که از والد گرفته (Prop) به او خبر می‌دهد:

```text
         App  (state: query)
        /   \
 SearchBox   ProductList
 (query + onChange)   (query)
```

```jsx
function SearchBox({ query, onQueryChange }) {
  return (
    <input
      value={query}
      onChange={(e) => onQueryChange(e.target.value)}
      placeholder="جستجو..."
    />
  );
}

function ProductList({ products }) {
  return (
    <ul>
      {products.map((p) => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}

const allProducts = [
  { id: 1, name: "React" },
  { id: 2, name: "Redux" },
  { id: 3, name: "Router" },
  { id: 4, name: "Vite" },
];

function App() {
  const [query, setQuery] = useState("");

  // Derived Data: از query و allProducts محاسبه می‌شود، State نیست
  const visible = allProducts.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <>
      <SearchBox query={query} onQueryChange={setQuery} />
      <p>{visible.length} نتیجه</p>
      <ProductList products={visible} />
    </>
  );
}
```

آزمایش: با تایپ `" re "` دو نتیجه (React و Redux) نشان داده شد.

**چرا State در `App` است؟** هم `SearchBox` (برای نمایش و تغییر) و هم محاسبه‌ی لیست (برای فیلتر) به آن نیاز دارند. `App` نزدیک‌ترین والد مشترک است.

## State را کجا بگذارم؟ (قاعده)

```text
۱) فقط یک Component به آن نیاز دارد؟        → همان Component
۲) چند Component همسطح به آن نیاز دارند؟    → نزدیک‌ترین والد مشترک
۳) خیلی از Componentهای دور (در درخت) لازم دارند؟ → Context یا کتابخانه‌ی State (فصل بعد)
```

---

# 13. Thinking in React: ۵ قدم برای طراحی UI

این روش رسمی تیم React برای شروع هر UI است. مثلاً برای «جدول محصولات با جستجو»:

**قدم ۱: UI را به Component تقسیم کن (از روی طراحی)**

```text
App
├── SearchBar
└── ProductTable
    ├── ProductCategoryRow
    └── ProductRow
```

قاعده: هر Component یک مسئولیت. اگر برای نامش به «و» نیاز داری، احتمالاً باید دو Component باشد.

**قدم ۲: نسخه‌ی ثابت (Static) بساز.** فقط با Props، بدون هیچ State. UI را درست و کامل نشان بده.

**قدم ۳: «حداقل» State ممکن را پیدا کن.** از هر داده بپرس: «آیا با زمان عوض می‌شود؟ آیا از Props یا State دیگر قابل‌محاسبه نیست؟» فقط آنچه جواب «بله» و «خیر» می‌گیرد، State است (مثل `query`). بقیه Derived.

**قدم ۴: تصمیم بگیر State کجا زندگی کند.** نزدیک‌ترین والد مشترک Componentهایی که از آن استفاده می‌کنند.

**قدم ۵: جریان داده‌ی معکوس را اضافه کن.** فرزند با تابعی که از والد گرفته (`onQueryChange`) به او خبر می‌دهد.

---

# 14. استایل‌دهی در React

**۱) فایل CSS معمولی:**

```jsx
import "./ProductCard.css";

function ProductCard() {
  return <article className="product-card">...</article>;
}
```

(CSS سراسری است؛ پس نام کلاس‌ها را با قرارداد، مثل BEM فصل CSS، تمیز نگه دار.)

**۲) کلاس شرطی:**

```jsx
<button className={isActive ? "tab tab--active" : "tab"}>...</button>

<button className={`tab ${isActive ? "tab--active" : ""}`}>...</button>

<li className={["item", done && "item--done", urgent && "item--urgent"].filter(Boolean).join(" ")}>
```

**۳) `style` برای مقدارهای پویا:**

```jsx
<div style={{ width: `${progress}%` }} />
```

برای استایل ثابت از کلاس استفاده کن؛ `style` برای مقداری که از JavaScript می‌آید.

**۴) CSS Modules** (نام کلاس‌ها فقط برای همان Component):

```jsx
import styles from "./Card.module.css";

<div className={styles.card}>...</div>
```

**۵) Tailwind CSS و ابزارهای دیگر:** در فصل «فرانت‌اند حرفه‌ای» می‌بینی.

---

# 15. ساختار پوشه‌ها و نام‌گذاری

برای پروژه‌های کوچک:

```text
src/
├── main.jsx
├── App.jsx
├── components/
│   ├── Header.jsx
│   ├── ProductCard.jsx
│   └── ProductCard.css
├── data/
│   └── products.js
└── utils/
    └── format.js
```

قواعد:

- نام فایل Component و نام خود Component: **PascalCase** (`ProductCard.jsx`)
- فایل‌های غیر Component (Utility): camelCase (`format.js`)
- هر Component یک فایل
- Componentهای کوچک و مخصوص یک Component بزرگ‌تر را می‌توانی در همان فایل بنویسی
- با بزرگ‌تر شدن پروژه، بر اساس **قابلیت** پوشه‌بندی کن (`features/cart/...`)؛ در فصل «فرانت‌اند حرفه‌ای» بیشتر می‌بینیم

---

# 16. React DevTools

بعد از نصب افزونه، در DevTools تب **Components**:

- درخت Componentها
- Props و State هر Component (و امکان ویرایش زنده‌ی State)
- گزینه‌ی «Highlight updates when components render»: Componentهایی که دوباره رندر می‌شوند را رنگی می‌کند

با آن می‌توانی بدون `console.log` ببینی State و Props چه هستند. وقتی «UI درست به‌روز نمی‌شود» باید اولین ابزارت باشد.

---

# 17. نکات مهم فصل

### نکته ۱

`UI = f(state)`: State را درست نگه دار، UI درست می‌شود.

---

### نکته ۲

State یک Snapshot است. `setState` مقدار همین Render را عوض نمی‌کند؛ یک Render جدید می‌خواهد.

---

### نکته ۳

برای مقدار جدید وابسته به قبلی، Updater Function (`setX(prev => ...)`) بنویس.

---

### نکته ۴

State را هرگز Mutate نکن؛ همیشه نسخه‌ی جدید (Spread، `map`، `filter`) بساز.

---

### نکته ۵

چیزی که از Props یا State دیگر قابل‌محاسبه است، State نیست.

---

### نکته ۶

`key` از `id` داده بیاید، نه `index` و نه `Math.random()`.

---

### نکته ۷

Component را بیرون از Componentهای دیگر تعریف کن.

---

### نکته ۸

State را به نزدیک‌ترین والد مشترک ببر؛ داده پایین می‌رود (Props) و رویداد بالا (توابع).

---

### نکته ۹

Render باید خالص باشد؛ کار جانبی در Event Handler یا `useEffect`.

---

# 18. اشتباهات رایج

1. نوشتن `class` به‌جای `className` یا `for` به‌جای `htmlFor`.
2. نام Component با حرف کوچک.
3. برگرداندن چند المان بدون ریشه (Fragment).
4. نوشتن `onClick={handle()}` به‌جای `onClick={handle}` (و خطای `Too many re-renders`).
5. تغییر مستقیم State (`todos[0].done = true`، `push`، `splice`).
6. فکر کردن به اینکه بعد از `setCount(count + 1)` فوراً `count` تازه است.
7. فراموش کردن `key` در `map` یا استفاده از `index` در لیست دینامیک.
8. تعریف Component داخل Component دیگر (و پاک شدن State).
9. `{items.length && ...}` و نمایش `0`.
10. Controlled Input با `value` بدون `onChange`.
11. فراموش کردن `event.preventDefault()` در `onSubmit`.
12. ذخیره‌ی مقدار محاسبه‌شده (مثل `total`) در State.
13. صدا زدن Hook داخل `if` یا حلقه.
14. نوشتن `style="color: red"` (رشته) به‌جای Object.
15. استفاده از `dangerouslySetInnerHTML` با داده‌ی غیرقابل‌اعتماد.
16. نگرانی بی‌جا درباره‌ی «Render زیاد» و بهینه‌سازی زودهنگام.
17. شروع State در بیش از حد نزدیک به فرزند، و بعد دردسر هماهنگی (به‌جای بردن به والد مشترک).
18. کپی کردن همه‌چیز در Props بدون فکر (Prop Drilling خیلی عمیق).

---

# 19. تمرین‌ها

## سطح ۱ — پروژه و JSX

### تمرین ۱

با Vite یک پروژه‌ی React بساز. `App.jsx` را طوری بنویس که عنوان، یک پاراگراف و یک تصویر (با `alt`) نشان دهد. با `className` یک کلاس CSS بده.

---

### تمرین ۲

این JSX چند مشکل دارد؟ همه را بنویس و اصلاح کن:

```jsx
function profile() {
  return (
    <h1 class="title">سلام</h1>
    <img src="a.jpg">
    <label for="name">نام</label>
  );
}
```

---

## سطح ۲ — Component و Props

### تمرین ۳

Component `ProductCard` را با Props `name`، `price` و `inStock` بنویس. اگر `inStock` برابر `false` بود، متن «ناموجود» نمایش داده شود.

---

### تمرین ۴

Component `Card` با Prop `title` و `children` بنویس و سه بار با محتوای متفاوت استفاده کن.

---

### تمرین ۵

چرا این کد خطا می‌دهد؟ اصلاحش کن:

```jsx
function Title(props) {
  props.text = props.text.toUpperCase();
  return <h1>{props.text}</h1>;
}
```

---

## سطح ۳ — State و Eventها

### تمرین ۶

یک شمارنده با دکمه‌های `+`، `−` و «ریست» بساز. مقدار نباید منفی شود.

---

### تمرین ۷

خروجی را پیش‌بینی کن. بعد از یک کلیک `count` چند می‌شود؟

```jsx
const [count, setCount] = useState(0);

function handleClick() {
  setCount(count + 1);
  setCount(count + 1);
  setCount((c) => c + 1);
}
```

---

### تمرین ۸

یک «تغییر تم» (`روشن` / `تیره`) بساز که با State کلاس `dark` را به یک `div` بدهد و دکمه، متن تم فعلی را نشان دهد.

---

### تمرین ۹

این کد چه می‌کند و چرا؟

```jsx
<button onClick={setCount(count + 1)}>افزودن</button>
```

---

## سطح ۴ — لیست و شرط

### تمرین ۱۰

آرایه‌ای از ۵ دانشجو (`id`، `name`، `score`) بساز و با `map` نمایش بده. دانشجوی با نمره‌ی زیر ۱۰ را با کلاس `fail` مشخص کن. اگر لیست خالی بود، پیام «دانشجویی نیست» نشان بده.

---

### تمرین ۱۱

یک «کارهای من» (Todo) بساز: افزودن، حذف و تیک زدن انجام‌شده. State را **Immutable** به‌روز کن و `key` درست بنویس.

---

### تمرین ۱۲

کدام خروجی را دارد؟

```jsx
const items = [];
return <div>{items.length && <p>لیست</p>}</div>;
```

---

## سطح ۵ — فرم و Lifting State Up

### تمرین ۱۳

فرم ثبت‌نام (نام، ایمیل، رمز، تأیید قوانین) را با **یک** `handleChange` بساز. هنگام ارسال، اگر ایمیل معتبر نبود یا قوانین پذیرفته نشده بود، پیام خطا نشان بده.

---

### تمرین ۱۴

جستجو و فیلتر دسته‌بندی برای لیست محصولات را مثل Sportify بساز: `query` و `category` در `App` باشند و `SearchBox`، `CategoryFilter` و `ProductList` فقط Props بگیرند.

---

### تمرین ۱۵

سؤال تحلیلی: در هر مورد State کجا زندگی کند؟

```text
الف) باز یا بسته بودن یک منوی کشویی که فقط در Header استفاده می‌شود
ب) عبارت جستجو که هم SearchBox و هم ProductList به آن نیاز دارند
ج) کاربر واردشده که در ده Component مختلف و دور لازم است
```

---

# 20. پاسخنامه‌ی مختصر (پس از تلاش خودت ببین)

**تمرین ۲:** مشکل‌ها: نام Component باید با حرف بزرگ باشد (`Profile`)، `class` باید `className` و `for` باید `htmlFor` شود، `<img>` باید بسته شود (`<img ... />`)، و سه المان بدون ریشه‌اند (Fragment). نسخه‌ی درست:

```jsx
function Profile() {
  return (
    <>
      <h1 className="title">سلام</h1>
      <img src="a.jpg" alt="" />
      <label htmlFor="name">نام</label>
    </>
  );
}
```

**تمرین ۳:**

```jsx
function ProductCard({ name, price, inStock }) {
  return (
    <article>
      <h3>{name}</h3>
      <p>{price} تومان</p>
      {!inStock && <p>ناموجود</p>}
    </article>
  );
}
```

**تمرین ۵:** `props` فقط‌خواندنی است (`TypeError: Cannot assign to read only property`). درست: مقدار جدید را در یک متغیر بساز.

```jsx
function Title({ text }) {
  const upper = text.toUpperCase();
  return <h1>{upper}</h1>;
}
```

**تمرین ۶:**

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
      <button onClick={() => setCount((c) => Math.max(0, c - 1))}>−</button>
      <button onClick={() => setCount(0)}>ریست</button>
    </>
  );
}
```

**تمرین ۷:** `2`. دو خط اول هر دو از همان `count` فعلی (`0`) می‌سازند (`0 + 1`)، پس مجموعاً یک واحد؛ خط سوم Updater است و روی «آخرین مقدار در صف» (یعنی `1`) کار می‌کند و آن را `2` می‌کند.

**تمرین ۸:**

```jsx
function App() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "app dark" : "app"}>
      <button onClick={() => setDark((d) => !d)}>
        تم فعلی: {dark ? "تیره" : "روشن"}
      </button>
    </div>
  );
}
```

**تمرین ۹:** `setCount(count + 1)` همان لحظه‌ی رندر اجرا می‌شود (نه با کلیک)، State عوض می‌شود، دوباره رندر، دوباره... و خطای `Too many re-renders`. درست: `onClick={() => setCount(count + 1)}`.

**تمرین ۱۱ (هسته):**

```jsx
function Todos() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  function handleAdd(event) {
    event.preventDefault();
    if (!text.trim()) return;

    setTodos((prev) => [...prev, { id: Date.now(), title: text.trim(), done: false }]);
    setText("");
  }

  const toggle = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));

  return (
    <>
      <form onSubmit={handleAdd}>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">افزودن</button>
      </form>

      <ul>
        {todos.map((t) => (
          <li key={t.id} className={t.done ? "done" : ""}>
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            {t.title}
            <button onClick={() => remove(t.id)}>حذف</button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

**تمرین ۱۲:** عدد `0` روی صفحه نمایش داده می‌شود. درست: `items.length > 0 && ...`.

**تمرین ۱۵:** الف) خود Header. ب) والد مشترک (مثلاً `App`). ج) Context یا کتابخانه‌ی State سراسری (فصل بعد).

---

# 21. پروژه پایان فصل

## Sportify در React

همان فروشگاه Sportify را (که در JavaScript خالص ساختی) در React دوباره بساز. این بهترین راه برای حس کردن تفاوت React است: همان قابلیت‌ها، ولی بدون هیچ `querySelector`، `innerHTML` و هماهنگی دستی.

**ساختار پیشنهادی:**

```text
src/
├── main.jsx
├── App.jsx               ← State: query، category، cart
├── data/
│   └── products.js
└── components/
    ├── Header.jsx        ← شمارنده‌ی سبد
    ├── SearchBar.jsx
    ├── CategoryFilter.jsx
    ├── ProductList.jsx
    ├── ProductCard.jsx
    ├── CartPanel.jsx
    └── CartItem.jsx
```

**نمونه‌ی شروع `App.jsx`** (اجرا و آزمایش شده: دو بار افزودن، یک ردیف با تعداد ۲ و مجموع ۱۷۸ دلار؛ کاهش تا صفر ردیف را حذف می‌کند؛ ترکیب جستجو و فیلتر درست کار می‌کند):

```jsx
import { useState } from "react";
import { products } from "./data/products.js";
import ProductCard from "./components/ProductCard.jsx";
import CartItem from "./components/CartItem.jsx";

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState([]);              // [{ id, qty }]

  // Derived Data: هیچ‌کدام State نیستند
  const visibleProducts = products.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      p.name.toLowerCase().includes(query.trim().toLowerCase())
  );
  const count = cart.reduce((n, line) => n + line.qty, 0);
  const total = cart.reduce(
    (sum, line) => sum + products.find((p) => p.id === line.id).price * line.qty,
    0
  );

  function addToCart(id) {
    setCart((prev) =>
      prev.some((l) => l.id === id)
        ? prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l))
        : [...prev, { id, qty: 1 }]
    );
  }

  function changeQty(id, delta) {
    setCart((prev) =>
      prev.map((l) => (l.id === id ? { ...l, qty: l.qty + delta } : l)).filter((l) => l.qty > 0)
    );
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div>
      <header>
        <h1>Sportify</h1>
        <span>سبد: {count}</span>
      </header>

      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجو..." />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">همه</option>
        <option value="shoes">کفش</option>
        <option value="equipment">تجهیزات</option>
      </select>

      {visibleProducts.length === 0 ? (
        <p>محصولی پیدا نشد.</p>
      ) : (
        <section>
          {visibleProducts.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </section>
      )}

      <ul>
        {cart.map((line) => (
          <CartItem
            key={line.id}
            line={line}
            product={products.find((p) => p.id === line.id)}
            onChangeQty={changeQty}
            onRemove={removeFromCart}
          />
        ))}
      </ul>

      <p>مجموع: {total}</p>
    </div>
  );
}
```

(این فقط اسکلت است. تقسیم به Componentهای جدا، استایل، مودال جزئیات، وضعیت‌های Empty، و `localStorage` با `useState(() => loadCart())` کار خودت است.)

**قابلیت‌ها:**

- نمایش محصولات از آرایه
- جستجو + فیلتر دسته‌بندی (ترکیبی)
- افزودن به سبد با تعداد، `+` / `−` و حذف
- مجموع و تعداد (Derived، نه State)
- Empty State برای «محصولی پیدا نشد» و «سبد خالی است»
- مودال جزئیات محصول (State: `selectedProductId`)
- ذخیره‌ی سبد در `localStorage` (برای نوشتن در هر تغییر، در فصل بعد از `useEffect` استفاده می‌کنی؛ در این فصل می‌توانی داخل Handlerها ذخیره کنی)

**محدودیت‌ها:**

- فقط React و CSS؛ بدون کتابخانه‌ی دیگر
- حداقل ۷ Component جدا، هر کدام یک فایل
- هیچ Mutate مستقیم روی State
- `key` برای همه‌ی لیست‌ها از `id`
- هیچ مقدار محاسبه‌شده (`total`، `count`) در State نباشد
- بدون `dangerouslySetInnerHTML`

**معیار قبولی:**

- هر قابلیت Sportify قدیمی کار می‌کند
- در Console هیچ هشدار یا خطای React نیست (خصوصاً `key` و `value` بدون `onChange`)
- با React DevTools می‌توانی State هر Component را ببینی و توضیح بدهی کدام Component آن را نگه می‌دارد و چرا
- فقط با کیبورد قابل‌استفاده است
- پروژه روی GitHub با Commitهای مرتب و README است

**ایده برای مقایسه:** تعداد خط‌های کدی را که برای «هماهنگ کردن UI با داده» در نسخه‌ی خالص JavaScript نوشتی، با نسخه‌ی React مقایسه کن (`render`ها، `querySelector`ها، `innerHTML`ها).

---

# 22. چک‌لیست خودارزیابی

- [ ] توضیح می‌دهم React چه مشکلی را حل می‌کند (Declarative، `UI = f(state)`)
- [ ] پروژه‌ی React را با Vite می‌سازم و ساختارش را می‌شناسم
- [ ] JSX و قاعده‌هایش (`className`، `htmlFor`، یک ریشه، `{ }`، `style` به‌صورت Object) را می‌دانم
- [ ] می‌دانم React مقدارها را به‌طور پیش‌فرض Escape می‌کند و استثناها کدام‌اند
- [ ] Component می‌نویسم و می‌دانم چرا نام آن با حرف بزرگ است
- [ ] Props، `children` و ارسال تابع را به‌کار می‌برم
- [ ] می‌دانم چرا Props فقط‌خواندنی است
- [ ] `useState` را می‌نویسم و State را Snapshot می‌دانم
- [ ] از Updater Function درست استفاده می‌کنم
- [ ] State را همیشه Immutable به‌روز می‌کنم
- [ ] تشخیص می‌دهم چه چیزی State نیست (Derived Data)
- [ ] Render، Re-render و خالص بودن Component را توضیح می‌دهم
- [ ] Eventها را درست می‌نویسم و فرق `onClick={f}` و `onClick={f()}` را می‌دانم
- [ ] شرط‌ها را رندر می‌کنم و تله‌ی `0 &&` را می‌شناسم
- [ ] لیست را با `map` و `key` درست رندر می‌کنم و باگ `index` را توضیح می‌دهم
- [ ] فرم Controlled با چند فیلد و `preventDefault` می‌سازم
- [ ] State را به والد مشترک می‌برم (Lifting State Up)
- [ ] UI را با ۵ قدم Thinking in React طراحی می‌کنم
- [ ] از چند روش استایل‌دهی در React استفاده می‌کنم
- [ ] از React DevTools برای دیدن Props و State استفاده می‌کنم
- [ ] Sportify را در React بازنویسی کرده‌ام

---

# خلاصه فصل

```text
React
↓
UI = f(state). Declarative: توصیف می‌کنی، React به‌روز می‌کند.

Vite
↓
npm create vite@latest، npm run dev؛ main.jsx ریشه است.

JSX
↓
JavaScript با ظاهر HTML: className، htmlFor، {}، یک ریشه؛ پیش‌فرض Escape می‌شود.

Component
↓
تابعی با نام بزرگ که JSX برمی‌گرداند؛ بیرون از Componentهای دیگر تعریف شود.

Props
↓
ورودی از والد؛ فقط‌خواندنی؛ children برای Composition.

State (useState)
↓
حافظه‌ی Component؛ Snapshot؛ Updater Function؛ Immutable؛ Derived Data را ذخیره نکن.

Render
↓
Trigger ← Render ← Commit؛ Component باید خالص باشد.

Events
↓
onClick={handle}، نه handle()؛ preventDefault.

شرط و لیست
↓
?: و && (مراقب 0)؛ map + key از id.

فرم
↓
Controlled: value + onChange؛ یک Handler برای چند فیلد.

Lifting State Up
↓
State در نزدیک‌ترین والد مشترک؛ داده پایین، رویداد بالا.
```

---

# فصل بعد

در فصل بعد، React را از «ساخت UI ثابت» به «برنامه‌ی واقعی» می‌رسانیم:

```text
useEffect (کارهای جانبی، همگام‌سازی با localStorage، تایمر، Cleanup)
گرفتن داده از API در React (Loading / Error / Empty، لغو درخواست با AbortController)
useRef و دسترسی به DOM
useMemo و useCallback (بهینه‌سازی در حد لازم)
Custom Hook (مثل useLocalStorage و useFetch)
Context API (حل Prop Drilling)
useReducer (State پیچیده)
```

و پروژه‌ی Movie Explorer را در React بازنویسی می‌کنیم.
