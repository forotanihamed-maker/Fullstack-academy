// هر تمرین: id یکتا، عنوان، شرح، کد شروع، راه‌حل نمونه و تست‌ها.
// هر تست تابعی است که document پیش‌نمایش را می‌گیرد و true/false برمی‌گرداند.
const px = v => parseFloat(v);
const cs = (d, el, pseudo) => d.defaultView.getComputedStyle(el, pseudo);

export const exercises = {
  html: [
    {
      id: "html-1", title: "یک عنوان و یک لینک بساز",
      task: "یک <h1> با هر متنی و یک لینک <a> که به https://example.com برود بنویس.",
      starter: "<!-- کد خود را اینجا بنویس -->\n",
      solution: `<h1>سلام دنیا</h1>\n<a href="https://example.com">رفتن به سایت</a>`,
      tests: [
        { label: "یک h1 با متن وجود دارد", run: d => !!d.querySelector("h1")?.textContent.trim() },
        { label: "لینک به example.com اشاره می‌کند", run: d => [...d.querySelectorAll("a")].some(a => a.href.startsWith("https://example.com")) },
      ],
    },
    {
      id: "html-2", title: "صفحه‌ای فقط با المان‌های Semantic",
      task: "ساختار یک وبلاگ را بنویس: header، nav (با فهرست حداقل دو لینک)، یک main و footer. هیچ div نگذار.",
      starter: "<!-- فقط المان‌های Semantic؛ بدون div -->\n",
      solution: `<header>\n  <h1>وبلاگ من</h1>\n  <nav>\n    <ul>\n      <li><a href="/">خانه</a></li>\n      <li><a href="/about">درباره</a></li>\n    </ul>\n  </nav>\n</header>\n<main><p>محتوای اصلی</p></main>\n<footer><small>همه‌ی حقوق محفوظ است</small></footer>`,
      tests: [
        { label: "یک header دارد", run: d => !!d.querySelector("header") },
        { label: "داخل nav یک ul با حداقل ۲ لینک دارد", run: d => d.querySelectorAll("nav ul li a").length >= 2 },
        { label: "دقیقاً یک main دارد", run: d => d.querySelectorAll("main").length === 1 },
        { label: "یک footer دارد", run: d => !!d.querySelector("footer") },
        { label: "هیچ div ندارد", run: d => d.querySelectorAll("div").length === 0 },
      ],
    },
    {
      id: "html-3", title: "لیست مرتب با زیرلیست",
      task: "«مراحل رزرو بلیت» را با ol و سه مرحله بساز و برای یکی از مراحل یک زیرلیست ul بگذار (زیرلیست باید داخل li باشد).",
      starter: "<h2>مراحل رزرو بلیت</h2>\n",
      solution: `<h2>مراحل رزرو بلیت</h2>\n<ol>\n  <li>انتخاب مقصد</li>\n  <li>انتخاب صندلی\n    <ul>\n      <li>پنجره</li>\n      <li>راهرو</li>\n    </ul>\n  </li>\n  <li>پرداخت</li>\n</ol>`,
      tests: [
        { label: "یک ol با ۳ آیتم دارد", run: d => { const ol = d.querySelector("ol"); return !!ol && ol.children.length === 3 && [...ol.children].every(c => c.tagName === "LI"); } },
        { label: "یک ul داخل یکی از li ها قرار دارد", run: d => !!d.querySelector("ol > li > ul") },
        { label: "هیچ ul مستقیم زیر ol یا ul نیست", run: d => !d.querySelector("ol > ul, ul > ul") },
      ],
    },
    {
      id: "html-4", title: "تصویر با alt درست",
      task: "دو تصویر بگذار: یکی با alt توصیفی و یکی صرفاً تزئینی (alt خالی). هیچ تصویری نباید alt نداشته باشد.",
      starter: "<!-- دو تگ img بنویس -->\n",
      solution: `<img src="cat.jpg" alt="گربه‌ی خاکستری روی مبل">\n<img src="line.svg" alt="">`,
      tests: [
        { label: "حداقل دو تصویر دارد", run: d => d.querySelectorAll("img").length >= 2 },
        { label: "هیچ تصویری بدون attribute ـ alt نیست", run: d => [...d.querySelectorAll("img")].every(i => i.hasAttribute("alt")) },
        { label: "یک تصویر alt توصیفی (حداقل ۳ حرف) دارد", run: d => [...d.querySelectorAll("img")].some(i => i.alt.trim().length >= 3) },
        { label: "یک تصویر تزئینی با alt=\"\" دارد", run: d => [...d.querySelectorAll("img")].some(i => i.getAttribute("alt") === "") },
      ],
    },
    {
      id: "html-5", title: "فرم ثبت‌نام اعتبارسنجی‌شده",
      task: "فرمی بساز با: ایمیل (required و name)، یک select با حداقل دو گزینه و یک دکمه‌ی submit. هر فیلد باید label متصل داشته باشد.",
      starter: "<form>\n  <!-- فیلدها اینجا -->\n</form>\n",
      solution: `<form>\n  <label for="email">ایمیل</label>\n  <input type="email" id="email" name="email" required>\n  <label for="level">سطح</label>\n  <select id="level" name="level">\n    <option value="b">مبتدی</option>\n    <option value="j">جونیور</option>\n  </select>\n  <button type="submit">ثبت‌نام</button>\n</form>`,
      tests: [
        { label: "یک form وجود دارد", run: d => !!d.querySelector("form") },
        { label: "ورودی email با required و name دارد", run: d => { const i = d.querySelector('input[type="email"]'); return !!i && i.required && !!i.name; } },
        { label: "یک select با حداقل ۲ option دارد", run: d => (d.querySelector("select")?.options.length || 0) >= 2 },
        { label: "همه‌ی فیلدها label متصل دارند", run: d => { const f = [...d.querySelectorAll("input:not([type=hidden]),select,textarea")]; return f.length > 0 && f.every(e => e.labels && e.labels.length > 0); } },
        { label: "دکمه‌ی submit دارد", run: d => !!d.querySelector('button[type="submit"], button:not([type]), input[type="submit"]') },
      ],
    },
  ],
  css: [
    {
      id: "css-1", title: "کارت وسط‌چین",
      task: "به .card استایل بده: عرض ۳۰۰px (با border-box)، padding برابر 16px، یک border، گوشه‌ی گرد (حداقل 8px) و وسط‌چین افقی با margin.",
      starter: `<style>\n  /* اینجا بنویس */\n</style>\n<div class="card">سلام، من یک کارت هستم</div>`,
      solution: `.card {\n  box-sizing: border-box;\n  width: 300px;\n  padding: 16px;\n  border: 2px solid #cbd5e1;\n  border-radius: 12px;\n  margin: 24px auto;\n}`,
      tests: [
        { label: "box-sizing برابر border-box است", run: d => cs(d, d.querySelector(".card")).boxSizing === "border-box" },
        { label: "عرض کل کارت ۳۰۰px است", run: d => Math.round(d.querySelector(".card").getBoundingClientRect().width) === 300 },
        { label: "padding همه‌ی طرف‌ها 16px است", run: d => { const s = cs(d, d.querySelector(".card")); return [s.paddingTop, s.paddingRight, s.paddingBottom, s.paddingLeft].every(v => px(v) === 16); } },
        { label: "border دارد", run: d => { const s = cs(d, d.querySelector(".card")); return px(s.borderTopWidth) > 0 && s.borderTopStyle !== "none"; } },
        { label: "گوشه‌ها حداقل 8px گرد هستند", run: d => px(cs(d, d.querySelector(".card")).borderTopLeftRadius) >= 8 },
        { label: "کارت وسط‌چین افقی است", run: d => { const s = cs(d, d.querySelector(".card")); return px(s.marginLeft) > 0 && s.marginLeft === s.marginRight; } },
      ],
    },
    {
      id: "css-2", title: "لینک بدون زیرخط با hover",
      task: "لینک‌ها را بدون زیرخط کن و فقط هنگام :hover زیرخط بده.",
      starter: `<style>\n  /* اینجا بنویس */\n</style>\n<a href="#">لینک نمونه</a>`,
      solution: `a { text-decoration: none; }\na:hover { text-decoration: underline; }`,
      tests: [
        { label: "لینک به‌طور عادی زیرخط ندارد", run: d => cs(d, d.querySelector("a")).textDecorationLine === "none" },
        { label: "قانونی برای a:hover با زیرخط وجود دارد", run: d => [...d.styleSheets].flatMap(s => [...s.cssRules]).some(r => /a:hover/.test(r.selectorText || "") && /underline/.test(r.style.textDecorationLine || r.style.textDecoration || "")) },
      ],
    },
    {
      id: "css-3", title: "لیست راه‌راه با ::after",
      task: "ردیف‌های زوج را رنگ دیگری بده، اولین آیتم را ضخیم کن و بعد از متن آخرین آیتم یک ✓ با ::after اضافه کن.",
      starter: `<style>\n  /* اینجا بنویس */\n</style>\n<ul>\n  <li>یک</li><li>دو</li><li>سه</li>\n  <li>چهار</li><li>پنج</li><li>شش</li>\n</ul>`,
      solution: `li:nth-child(even) { background: #f1f5f9; }\nli:first-child { font-weight: 700; }\nli:last-child::after { content: " ✓"; }`,
      tests: [
        { label: "ردیف‌های زوج رنگ متفاوتی دارند", run: d => { const b = [...d.querySelectorAll("li")].map(l => cs(d, l).backgroundColor); return b[1] !== b[0] && b[1] === b[3] && b[3] === b[5] && b[0] === b[2]; } },
        { label: "اولین آیتم ضخیم است", run: d => px(cs(d, d.querySelector("li:first-child")).fontWeight) >= 600 },
        { label: "آخرین آیتم با ::after یک ✓ دارد", run: d => cs(d, d.querySelector("li:last-child"), "::after").content.includes("✓") },
      ],
    },
    {
      id: "css-4", title: "وسط‌چین کامل با Flexbox",
      task: "فقط با Flexbox روی .parent، المان .child را هم افقی و هم عمودی وسط .parent بگذار.",
      starter: `<style>\n  .parent { height: 200px; background: #e2e8f0; }\n  .child { width: 80px; height: 40px; background: #2563eb; }\n  /* فقط .parent را تغییر بده */\n</style>\n<div class="parent"><div class="child"></div></div>`,
      solution: `.parent {\n  height: 200px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}`,
      tests: [
        { label: ".parent از display: flex استفاده می‌کند", run: d => cs(d, d.querySelector(".parent")).display === "flex" },
        { label: ".child افقی وسط است", run: d => { const p = d.querySelector(".parent").getBoundingClientRect(), c = d.querySelector(".child").getBoundingClientRect(); return Math.abs((p.left + p.width / 2) - (c.left + c.width / 2)) <= 1; } },
        { label: ".child عمودی وسط است", run: d => { const p = d.querySelector(".parent").getBoundingClientRect(), c = d.querySelector(".child").getBoundingClientRect(); return Math.abs((p.top + p.height / 2) - (c.top + c.height / 2)) <= 1; } },
      ],
    },
  ],
  react: [
    {
      id: "react-1", title: "یک Component ساده بساز",
      task: "یک Component به نام Welcome بنویس که یک <h1> با متن «سلام به ری‌اکت» برگرداند.",
      starter: `// یک Component بساز و export کن\n\n// کد خود را اینجا بنویس\n`,
      solution: `export default function Welcome() {\n  return <h1>سلام به ری‌اکت</h1>;\n}`,
      tests: [
        { label: "کلمه Welcome در کد وجود دارد", run: d => d.body.textContent.includes("Welcome") },
        { label: "vesrtion h1 در کد وجود دارد", run: d => d.body.textContent.includes("<h1>") },
      ],
    },
    {
      id: "react-2", title: "Component با Props",
      task: "یک Component به نام Greeting بنویس که Prop به نام name بگیرد و در <h1> نمایش دهد. مقدار پیش‌فرض name باید «میهمان» باشد.",
      starter: `// Greeting Component با prop name\n\n// کد خود را اینجا بنویس\n`,
      solution: `export default function Greeting({ name = "میهمان" }) {\n  return <h1>سلام {name}</h1>;\n}`,
      tests: [
        { label: "نام Greeting در کد وجود دارد", run: d => d.body.textContent.includes("Greeting") },
        { label: "prop name استفاده شده است", run: d => d.body.textContent.includes("name") },
      ],
    },
    {
      id: "react-3", title: "شمارنده با useState",
      task: "یک Component شمارنده بساز: دکمه‌ای برای افزایش و نمایش عدد. مقدار ابتدایی ۰ باشد.",
      starter: `import { useState } from "react";\n\n// کد خود را اینجا بنویس\n`,
      solution: `import { useState } from "react";\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={() => setCount(count + 1)}>افزایش</button>\n    </div>\n  );\n}`,
      tests: [
        { label: "useState در کد وجود دارد", run: d => d.body.textContent.includes("useState") },
        { label: "setCount در کد وجود دارد", run: d => d.body.textContent.includes("setCount") },
        { label: "دکمه در کد وجود دارد", run: d => d.body.textContent.includes("<button") },
      ],
    },
    {
      id: "react-4", title: "رویداد کلیک و تابع",
      task: "یک دکمه بساز که هنگام کلیک، یک پیام در <p> نمایش دهد (مثل «دکمه زده شد»).",
      starter: `import { useState } from "react";\n\n// کد خود را اینجا بنویس\n`,
      solution: `import { useState } from "react";\n\nexport default function ClickDemo() {\n  const [msg, setMsg] = useState("");\n  return (\n    <div>\n      <button onClick={() => setMsg("دکمه زده شد")}>کلیک کن</button>\n      <p>{msg}</p>\n    </div>\n  );\n}`,
      tests: [
        { label: "onClick در کد وجود دارد", run: d => d.body.textContent.includes("onClick") },
        { label: "setMsg یا setState استفاده شده است", run: d => d.body.textContent.includes("setMsg") || d.body.textContent.includes("setState") },
      ],
    },
    {
      id: "react-5", title: "نمایش شرطی (Conditional Rendering)",
      task: "یک Component بساز که اگر isLoggedIn true باشد «خوش آمدی» و در غیر این صورت «وارد شو» را نشان دهد.",
      starter: `import { useState } from "react";\n\n// کد خود را اینجا بنویس\n`,
      solution: `import { useState } from "react";\n\nexport default function Auth() {\n  const [isLoggedIn, setIsLoggedIn] = useState(false);\n  return (\n    <div>\n      {isLoggedIn ? <p>خوش آمدی</p> : <p>وارد شو</p>}\n      <button onClick={() => setIsLoggedIn((v) => !v)}>تغییر وضعیت</button>\n    </div>\n  );\n}`,
      tests: [
        { label: "عملگر ? : یا && استفاده شده است", run: d => d.body.textContent.includes("?") || d.body.textContent.includes("&&") },
        { label: "isLoggedIn نام متغییری است", run: d => d.body.textContent.includes("isLoggedIn") },
      ],
    },
    {
      id: "react-6", title: "رندر لیست با map",
      task: "یک آرایه از ۳ نام داشته باش و با map آنها را در <ul> به صورت <li> نمایش بده. هر li باید key داشته باشد.",
      starter: `// کد خود را اینجا بنویس\n`,
      solution: `const names = ["علی", "سارا", "رضا"];\n\nexport default function NameList() {\n  return (\n    <ul>\n      {names.map((n) => (<li key={n}>{n}</li>))}\n    </ul>\n  );\n}`,
      tests: [
        { label: "map در کد وجود دارد", run: d => d.body.textContent.includes(".map(") },
        { label: "key استفاده شده است", run: d => d.body.textContent.includes("key=") },
        { label: "li در کد وجود دارد", run: d => d.body.textContent.includes("<li") },
      ],
    },
    {
      id: "react-7", title: "فرم کنترل‌شده (Controlled Input)",
      task: "یک input بساز که مقدار آن در State ذخیره شود و زیر آن در یک <p> نمایش داده شود.",
      starter: `import { useState } from "react";\n\n// کد خود را اینجا بنویس\n`,
      solution: `import { useState } from "react";\n\nexport default function TextDemo() {\n  const [text, setText] = useState("");\n  return (\n    <div>\n      <input value={text} onChange={(e) => setText(e.target.value)} />\n      <p>{text}</p>\n    </div>\n  );\n}`,
      tests: [
        { label: "value در input استفاده شده است", run: d => d.body.textContent.includes("value=") },
        { label: "onChange در کد وجود دارد", run: d => d.body.textContent.includes("onChange") },
      ],
    },
    {
      id: "react-8", title: "useEffect برای تغییر عنوان صفحه",
      task: "با useEffect، هنگام لود صفحه، document.title را به «صفحه من» تغییر بده.",
      starter: `import { useEffect } from "react";\n\n// کد خود را اینجا بنویس\n`,
      solution: `import { useEffect } from "react";\n\nexport default function TitleDemo() {\n  useEffect(() => {\n    document.title = "صفحه من";\n  }, []);\n  return <p>title تغییر کرد</p>;\n}`,
      tests: [
        { label: "useEffect در کد وجود دارد", run: d => d.body.textContent.includes("useEffect") },
        { label: "document.title در کد وجود دارد", run: d => d.body.textContent.includes("document.title") },
        { label: "[] Dependency array وجود دارد", run: d => d.body.textContent.includes("[]") },
      ],
    },
    {
      id: "react-9", title: "React Router (نایاب)",
      task: "کد زیر را ببین و خطاهای آن را پیدا کن. react-router-dom از چه سه تکه اصلی استفاده می‌کند؟ (پاسخ را در کامنت بنویس)",
      starter: `// سه تکه اصلی react-router-dom:\n// 1. _________\n// 2. _________\n// 3. _________\n`,
      solution: `// سه تکه اصلی react-router-dom:\n// 1. BrowserRouter\n// 2. Routes و Route\n// 3. Link\n`,
      tests: [
        { label: "BrowserRouter در پاسخ وجود دارد", run: d => d.body.textContent.includes("BrowserRouter") },
        { label: "Routes در پاسخ وجود دارد", run: d => d.body.textContent.includes("Routes") },
        { label: "Link در پاسخ وجود دارد", run: d => d.body.textContent.includes("Link") },
      ],
    },
    {
      id: "react-10", title: "Error Boundary (مفاهیمی)",
      task: "Error Boundary چه خطایی را می‌گیرد؟ پاسخ کوتاه بنویس (مثلاً: خطای رندر Componentها).",
      starter: `// پاسخ خود را اینجا بنویس:\n\n// ...\n`,
      solution: `Error Boundary خطایی که در حین رندر یک Component اتفاق می‌افtritt را می‌گیرد و به جای صفحه سفید، پیام خطا نشان می‌دهد.`,

      tests: [
        { label: "متن پاسخ نوشته شده است", run: d => d.body.textContent.trim().length > 10 },
      ],
    },
  ],
};
