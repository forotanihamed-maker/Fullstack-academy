const format = (value) => {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

// console.log کاربر را برای نمایش در پیش‌نمایش و استفاده در تست‌ها ثبت می‌کند
function makeConsole(logs) {
  const push = (level) => (...args) => logs.push({ level, text: args.map(format).join(" ") });

  return {
    log: push("log"),
    info: push("info"),
    warn: push("warn"),
    error: push("error"),
  };
}

// fetch واقعی در تمرین‌ها استفاده نمی‌شود؛ پاسخ‌های از پیش تعیین‌شده برمی‌گردند
function makeFetch(responses = {}) {
  return async (url) => {
    if (!Object.hasOwn(responses, url)) {
      throw new Error(`در این تمرین آدرسی به نام «${url}» تعریف نشده است.`);
    }

    const { status = 200, body, ok } = responses[url];

    return {
      ok: ok ?? (status >= 200 && status < 300),
      status,
      json: async () => body,
      text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
    };
  };
}

/**
 * کد JavaScript کاربر را در یک Function ایزوله اجرا می‌کند.
 * توابع/متغیرهایی که در فیلد exports تمرین آمده‌اند، برای تست‌ها برگردانده می‌شوند.
 * کد می‌تواند async باشد (top-level await هم پشتیبانی می‌شود).
 */
export async function runJsExercise(exercise, code) {
  const logs = [];
  const names = exercise.exports ?? [];

  const picked = names.length
    ? `{ ${names
        .map((name) => `${JSON.stringify(name)}: typeof ${name} === "undefined" ? undefined : ${name}`)
        .join(", ")} }`
    : "{}";

  const source = `"use strict";\nreturn (async () => {\n${code}\n;return ${picked};\n})();`;

  let factory;
  try {
    // فقط کد خود کاربر اجرا می‌شود؛ نه محتوای درس
    // eslint-disable-next-line no-new-func
    factory = new Function("console", "fetch", source);
  } catch (error) {
    throw new Error(`خطای نگارشی در کد: ${error.message}`);
  }

  try {
    const values = await factory(makeConsole(logs), makeFetch(exercise.fetchMock));
    return { values, logs };
  } catch (error) {
    throw new Error(`اجرای کد ناموفق بود: ${error.message}`);
  }
}
