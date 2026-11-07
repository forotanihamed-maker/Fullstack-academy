# React — فصل ۳: React کاربردی و پیشرفته

> **مرحله ۷ از مسیر فول‌استک — React**  
> مباحث این فصل: React Router (صفحات چندگانه)، Error Boundary، Code Splitting و Lazy Loading، Portal، متغیرهای محیطی، و معرفی تست کامپوننت  
> پیش‌نیاز: فصل ۱ و ۲ React (Component، Props، State، useEffect، Custom Hook، Context)  
> زمان پیشنهادی: ۷ تا ۱۰ روز

---

## هدف فصل

در فصل ۱ و ۲ یاد گرفتی چگونه یک **صفحه تک**（Single Page) بسازی و با داده کار کنی. در این فصل یاد می‌گیری چگونه:

- سایت را به **چند صفحه** تقسیم کنی و کاربر را بین آن‌ها حرکت دهی (Router)
- وقتی خطایی در Component اتفاق افتاد، کل صفحه سفید نشود و پیام خطا نشان داده شود (Error Boundary)
- صفحه‌های سنگین را فقط وقتی که کاربر به آن می‌رسد بارگذاری کنی (Lazy Loading)
- पופ-ap و مدل را در لایه بالاترین صفحه نمایش دهی (Portal)
- مقادیر راز (مثل کلید API) را در متغیرهای محیطی نگه داری (Environment Variables)
- چگونه یک تست ساده برای کامپوننت بنویسی (React Testing Library)

---

# ۱. React Router: چند صفحه در یک برنامه

به‌صورت پیش‌فرض React فقط **یک صفحه** (`index.html`) دارد. وقتی کاربر روی لینک کلیک می‌کند، کل صفحه رفرش نمی‌شود؛ فقط محتوایComponent عوض می‌شود. این کار را **React Router** انجام می‌دهد.

## نصب

```bash
npm install react-router-dom
```

## راه‌اندازی پایه

```jsx
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";

function Home() {
  return <h2>صفحه اصلی</h2>;
}

function About() {
  return <h2>درباره ما</h2>;
}

function Product({ params }) {
  return <h2>محصول شماره: {params.id}</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">خانه</Link> |
        <Link to="/about">درباره ما</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<Product />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## نکات مهم

| موضوع | توضیح |
|--------|-------|
| `<BrowserRouter>` | باید ریشه برنامه باشد (まわり App را بپوشاند) |
| `<Link to="/">` | همان تگ `<a>` است، ولی رفرش نمی‌کند و فقط Component عوض می‌شود |
| `<Routes>` و `<Route>` | آدرس مسیر را به Component وصل می‌کند |
| `useParams()` | برای گرفتن متغیر از آدرس (مثل `/product/5` → `{ id: "5" }`) |
| `navigate` | برای تغییر مسیر به صورت_programmatic_ (مثل بعد از ذخیره فرم) |

> **قاعده:** `<Link>` را برای لینک‌های داخلی سایت استفاده کن؛ `<a>` برای سایت‌های خارجی.

---

# ۲. Error Boundary: когда خطا اتفاق بیفتد

اگر خطایی **در حین رندر** یک Component اتفاق بیفتد (مثل `user.name` وقتی `user` برابر `null` است)، کل برنامه React نابود می‌شود و صفحه سفید می gesehen. **Error Boundary** یک Component ویژه است که خطای فرزندانش را «می‌گیرد» و به جای صفحه سفید، پیام خطا نشان می‌دهد.

(Error Boundary فقط خطای **رندر** را می‌گیرد. خطای Event Handler یا `fetch` را باید با `try/catch` مدیریت کنی.)

## کد Error Boundary

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log("خطا trapping شد:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={{ padding: "20px", color: "red" }}>
          <h2>متاسفانه مشکلی پیش آمد.</h2>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            دوباره امتحان کن
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## نحوه استفاده

```jsx
function App() {
  return (
    <ErrorBoundary>
      <ProductList />
    </ErrorBoundary>
  );
}
```

هر Componentی که داخل `<ErrorBoundary>` باشد، اگر خطا داد، فقط همان بخش صفحه-message خطا نشان می‌دهد، نه کل برنامه.

---

# ۳. Code Splitting و Lazy Loading

به‌صورت پیش‌فرض React همه کدها را در یک فایل جاوااسکریپت جمع می‌کند. وقتی برنامه بزرگ شود، این فایل سنگین می‌شود و اولین بارگذاری صفحه کند است.

**Code Splitting** یعنی کدها را به چند تکه کوچک تقسیم کنیم و **Lazy Loading** یعنی هر تکه را فقط وقتی که کاربر واقعاً نیاز دارد، بارگذاری کنیم.

```jsx
import { Suspense, lazy } from "react";

const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>در حال بارگذاری صفحه...</p>}>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

- `lazy` تکه کد را فقط وقتی مورد نیاز است بارگذاری می‌کند.
- `<Suspense>` محتوای موقت (مثل پیام بارگذاری) را نشان می‌دهد تا cultivated کد بارگذاری شود.
- فایل‌های جدا برای هر صفحه (مثل `pages/About.jsx`) بساز.

---

# ۴. Portal: نمایش در لایه بالاترین صفحه

گاهی می‌خواهیم یک المان (مثل 팝-up، مدل، تбліغ) را در **بیرون از árbol Componentها** نمایش دهیم، مثلاً مستقیماً در `<body>`. به این کار **Portal** می‌گویند.

```jsx
import { createPortal } from "react-dom";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000 }}>
      <div style={{ background: "white", padding: "20px", margin: "50px auto", width: "300px" }}>
        {children}
        <button onClick={onClose}>بستن</button>
      </div>
    </div>,
    document.body
  );
}
```

دومین آرگومان `createPortal` المان DOM واقعی است که React محتوایJSX را داخلش قرار می‌دهد.

---

# ۵. متغیرهای محیطی (Environment Variables)

کلیدهای API، آدرس سرور و مقادیر راز را نباید مستقیماً در کد بنویس. برای این کار از متغیرهای محیطی استفاده می‌کنیم.

در Vite، متغیرها باید با `VITE_` شروع شوند:

```bash
# فایل .env در ریشه پروژه
VITE_API_URL=https://api.example.com
VITE_APP_NAME=سایت من
```

و در کد:

```jsx
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

> فایل `.env` را در `.gitignore` قرار ده و در GitCommit نکن؛ هر 개발 داشته باشد فایل `.env.local` خودش بسازد.

---

# ۶. معرفی تست کامپوننت (React Testing Library)

تست می‌گوید «کد من درست کار می‌کند». برای تست React از **Vitest** (راه‌اندازی سریع) و **React Testing Library** استفاده می‌کنیم.

## نصب

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

## فایل `vite.config.js` را به این شکل تغییر ده

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.jsx",
  },
});
```

## فایل `src/test/setup.jsx`

```js
import "@testing-library/jest-dom";
```

## مثال تست

فرض کنید این Component داریم:

```jsx
// src/components/Greeting.jsx
export default function Greeting({ name }) {
  return <h1 data-testid="greeting">سلام {name}</h1>;
}
```

و تست:

```jsx
// src/components/Greeting.test.jsx
import { render, screen } from "@testing-library/react";
import Greeting from "./Greeting.jsx";
import { describe, it, expect } from "vitest";

describe("Greeting", () => {
  it("نام را نمایش می‌دهد", () => {
    render(<Greeting name="علی" />);
    expect(screen.getByTestId("greeting")).toHaveTextContent("سلام علی");
  });
});
```

اجرای تست:

```bash
npx vitest run
```

---

# ۷. چک‌لیست پایانی فصل ۳

قبل از رفتن به فصل بعدی (تایپ‌اسکریپت)، مطمئن باش این‌ها را بلدی:

- [ ] می‌توانم با `react-router-dom` چند صفحه بسازم و بین آن‌ها ناوبری کنم.
- [ ] می‌دانم `useParams()` چطور متغیر آدرس را می‌گیرد.
- [ ] `Error Boundary` را می‌نویسم و در جای مناسب استفاده می‌کنم.
- [ ] `lazy` و `Suspense` را برای بارگذاری صفحه‌های سنگین می‌شناسم.
- [ ] `createPortal` را برای modal/popup می‌دانم.
- [ ] متغیرهای محیطی را با `VITE_` و `import.meta.env` استفاده می‌کنم.
- [ ] یک تست ساده با `vitest` و `React Testing Library` می‌نویسم و اجرا می‌کنم.

---

# ۸. تمرین‌های فصل ۳

(تمرین‌های عملی در فایل `exercises.js` اضافه شده‌اند. به صفحه‌ی مرحله‌ی React برو و آن‌ها را انجام بده.)