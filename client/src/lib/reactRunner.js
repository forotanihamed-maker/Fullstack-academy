import React from "react";

// Babel و رندر سمت سرور فقط وقتی اولین تمرین React اجرا شود، در یک chunk جداگانه
// بارگذاری می‌شوند تا حجم اولیه‌ی سایت بالا نرود.
let runnerPromise = null;
function loadRunner() {
  if (!runnerPromise) {
    runnerPromise = Promise.all([
      import("@babel/standalone"),
      import("react-dom/server"),
    ]).then(([babel, server]) => ({
      Babel: babel.default ?? babel,
      renderToStaticMarkup: server.renderToStaticMarkup,
    }));
  }
  return runnerPromise;
}

// ماژول‌هایی که کد تمرین اجازه‌ی import کردنشان را دارد
const MODULES = { react: React };

function compile(Babel, code) {
  try {
    return Babel.transform(code, {
      filename: "exercise.jsx",
      presets: [["react", { runtime: "classic" }]],
      plugins: ["transform-modules-commonjs"],
      sourceType: "module",
      retainLines: true,
    }).code;
  } catch (error) {
    throw new Error(`خطای نگارشی در کد: ${error.message}`);
  }
}

/**
 * کد JSX کاربر را اجرا و کامپوننت پیش‌فرض آن را به HTML استاتیک تبدیل می‌کند.
 * خروجی برای پیش‌نمایش داخل iframe و اجرای تست‌ها روی DOM استفاده می‌شود.
 */
export async function renderReactExercise(code) {
  const { Babel, renderToStaticMarkup } = await loadRunner();
  const compiled = compile(Babel, code);

  const module = { exports: {} };
  const requireModule = (id) => {
    if (Object.hasOwn(MODULES, id)) return MODULES[id];
    throw new Error(`import از «${id}» در این تمرین پشتیبانی نمی‌شود.`);
  };

  try {
    // فقط کد خود کاربر (نه محتوای درس) اجرا می‌شود
    // eslint-disable-next-line no-new-func
    const execute = new Function("React", "exports", "module", "require", compiled);
    execute(React, module.exports, module, requireModule);
  } catch (error) {
    throw new Error(`اجرای کد ناموفق بود: ${error.message}`);
  }

  const Component = module.exports.default ?? module.exports;

  if (typeof Component !== "function") {
    throw new Error("کد باید یک Component را با export default برگرداند.");
  }

  try {
    return {
      html: renderToStaticMarkup(React.createElement(Component)),
      Component,
    };
  } catch (error) {
    throw new Error(`رندر Component ناموفق بود: ${error.message}`);
  }
}
