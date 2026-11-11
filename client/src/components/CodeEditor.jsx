import { useState, useRef } from "react";
import { isExerciseSolved, markExerciseSolved, useProgress } from "../progress.js";
import { renderReactExercise } from "../lib/reactRunner.js";
import { runJsExercise } from "../lib/jsRunner.js";
import "./editor.css";

const escapeHtml = (text) =>
  text.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

const page = (body) =>
  `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8">` +
  `<style>body{font-family:system-ui,sans-serif;padding:8px;line-height:1.7}` +
  `pre{direction:ltr;text-align:left;white-space:pre-wrap}</style></head><body>${body}</body></html>`;

const placeholder =
  `<p style="color:#4b5f59">برای دیدن پیش‌نمایش، دکمه‌ی «اجرای کد» را بزنید.</p>`;

// تست‌های async نباید برای همیشه معلق بمانند
function withTimeout(promise, ms = 4000) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("timeout")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// کد JavaScript کاربر داخل یک iframe با دسترسی به DOM اجرا می‌شود.
// خروجی console و خطاها برای نمایش و تست در دسترس‌اند.
function jsDomBody(exercise, code) {
  const source = JSON.stringify(code).replace(/</g, "\\u003c");

  return `${exercise.html ?? ""}
<pre id="__logs" style="margin-top:12px;padding:8px;background:#f1f5f3;border:1px solid #c9d6d1;border-radius:6px;font-size:12px;min-height:1.5em"></pre>
<script>
  window.__logs = [];
  window.__done = false;
  (function () {
    var output = document.getElementById("__logs");
    ["log", "info", "warn", "error"].forEach(function (level) {
      console[level] = function () {
        var text = Array.prototype.map.call(arguments, function (value) {
          if (typeof value === "string") return value;
          try { return JSON.stringify(value); } catch (error) { return String(value); }
        }).join(" ");
        window.__logs.push({ level: level, text: text });
        if (output) output.textContent += "[" + level + "] " + text + "\\n";
      };
    });
    try {
      new Function(${source})();
    } catch (error) {
      window.__error = error.message;
      if (output) output.textContent += "خطا: " + error.message;
    }
    window.__done = true;
  })();
</script>`;
}

function jsLogPage({ logs = [], error }) {
  const status = error
    ? `<p style="color:#b42318;font-weight:600">${escapeHtml(error)}</p>`
    : `<p style="color:#0f766e;font-weight:600">کد با موفقیت اجرا شد.</p>`;

  const output = logs.length
    ? `<pre style="margin-top:12px;padding:8px;background:#f1f5f3;border:1px solid #c9d6d1;border-radius:6px;font-size:12px">${escapeHtml(
        logs.map((log) => `[${log.level}] ${log.text}`).join("\n")
      )}</pre>`
    : "";

  return page(status + output);
}

// برای تمرین‌های HTML/CSS کد خام داخل صفحه قرار می‌گیرد؛
// برای «code» فقط متن کد، برای React خروجی رندرشده و برای js خروجی console.
function buildDocument(exercise, code) {
  if (exercise.runner === "react" || exercise.runner === "js") return page(placeholder);
  if (exercise.runner === "js-dom") return page(jsDomBody(exercise, code));
  if (exercise.runner === "code") return page(`<pre>${escapeHtml(code)}</pre>`);
  return page(code);
}

export default function CodeEditor({ exercise }) {
  const runner = exercise.runner ?? "html";
  const [code, setCode] = useState(exercise.starter);
  const [srcDoc, setSrcDoc] = useState(() => buildDocument(exercise, exercise.starter));
  const [results, setResults] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const progress = useProgress();
  const solved = isExerciseSolved(progress, exercise.id);
  const frame = useRef(null);
  const pending = useRef(false);
  const frameTries = useRef(0);

  async function evaluate(subject, ctx) {
    const res = [];

    // تست‌ها به‌ترتیب اجرا می‌شوند تا تست‌های DOM/زمان‌دار به هم وابسته نباشند
    for (const test of exercise.tests) {
      let ok = false;
      try {
        const value = await withTimeout(Promise.resolve().then(() => test.run(subject, ctx)));
        ok = Boolean(value);
      } catch {
        ok = false;
      }
      res.push({ label: test.label, ok });
    }

    setResults(res);
    if (res.length > 0 && res.every((r) => r.ok)) markExerciseSolved(exercise.id);
  }

  async function runFrameTests() {
    const doc = frame.current?.contentDocument;
    if (!doc) return;

    if (runner === "js-dom") {
      const win = doc.defaultView;

      if (!win || !win.__done) {
        frameTries.current += 1;
        if (frameTries.current < 60) {
          setTimeout(runFrameTests, 20);
        } else {
          setError("اجرای کد بیش از حد طول کشید (احتمالاً حلقه‌ی بی‌پایان).");
        }
        return;
      }

      if (win.__error) {
        setError(win.__error);
        setResults(null);
        return;
      }

      await evaluate(doc, { code, logs: win.__logs ?? [] });
      return;
    }

    await evaluate(doc, { code });
  }

  async function runReact({ check = false } = {}) {
    setBusy(true);
    setError("");
    setResults(null);

    try {
      const { html } = await renderReactExercise(code);
      const doc = page(html);
      setSrcDoc(doc);
      if (check) await evaluate(new DOMParser().parseFromString(doc, "text/html"), { code });
    } catch (err) {
      setError(err.message);
      setSrcDoc(page(`<p style="color:#b42318">${escapeHtml(err.message)}</p>`));
    } finally {
      setBusy(false);
    }
  }

  async function runJs({ check = false } = {}) {
    setBusy(true);
    setError("");
    setResults(null);

    try {
      const result = await runJsExercise(exercise, code);
      setSrcDoc(jsLogPage(result));
      if (check) await evaluate(result, { code });
    } catch (err) {
      setError(err.message);
      setSrcDoc(jsLogPage({ logs: [], error: err.message }));
    } finally {
      setBusy(false);
    }
  }

  const run = () => {
    setError("");

    if (runner === "react") {
      runReact();
      return;
    }
    if (runner === "js") {
      runJs();
      return;
    }

    setResults(null);
    frameTries.current = 0;
    setSrcDoc(buildDocument(exercise, code));
  };

  const check = () => {
    setError("");

    if (runner === "react") {
      runReact({ check: true });
      return;
    }
    if (runner === "js") {
      runJs({ check: true });
      return;
    }

    const next = buildDocument(exercise, code);
    if (next === srcDoc && runner !== "js-dom") {
      runFrameTests(); // صفحه دوباره بارگذاری نمی‌شود
      return;
    }

    frameTries.current = 0;
    pending.current = true;
    setSrcDoc(next);
  };

  const reset = () => {
    setCode(exercise.starter);
    setSrcDoc(buildDocument(exercise, exercise.starter));
    setResults(null);
    setError("");
    frameTries.current = 0;
  };

  const passed = results && results.length > 0 && results.every((r) => r.ok);

  return (
    <section className="exercise">
      <h3>{exercise.title} {solved && <span className="badge-ok">✓ حل شده</span>}</h3>
      <p>{exercise.task}</p>
      {runner === "react" && (
        <p className="runner-note">
          کد JSX شما واقعاً با React رندر می‌شود. پیش‌نمایش، رندر اولیه است؛ رویدادها و
          <code>useEffect</code> در پیش‌نمایش اجرا نمی‌شوند.
        </p>
      )}
      {runner === "js" && (
        <p className="runner-note">
          کد در یک Function جداگانه اجرا می‌شود. خروجی <code>console.log</code> در پیش‌نمایش دیده می‌شود.
        </p>
      )}
      {runner === "js-dom" && (
        <p className="runner-note">
          کد شما داخل یک iframe جداگانه اجرا می‌شود و می‌تواند DOM همان پیش‌نمایش را تغییر دهد.
        </p>
      )}
      <div className="editor-grid">
        <textarea dir="ltr" spellCheck="false" value={code} onChange={e => setCode(e.target.value)} aria-label="ادیتور کد" />
        <iframe ref={frame} title="پیش‌نمایش" sandbox={runner === "js-dom" ? "allow-same-origin allow-scripts" : "allow-same-origin"} srcDoc={srcDoc}
          onLoad={() => { if (pending.current) { pending.current = false; frameTries.current = 0; runFrameTests(); } }} />
      </div>
      <div className="actions">
        <button onClick={run} disabled={busy}>اجرای کد</button>
        <button className="primary" onClick={check} disabled={busy}>{busy ? "در حال اجرا..." : "بررسی پاسخ"}</button>
        <button onClick={reset} disabled={busy}>شروع دوباره</button>
        <button onClick={() => setShowSolution(s => !s)} aria-expanded={showSolution}>{showSolution ? "پنهان کردن راه‌حل" : "نمایش راه‌حل"}</button>
      </div>
      {error && <p className="runner-error" role="alert">{error}</p>}
      {results && (
        <ul className="results" role="status">
          {results.map(r => <li key={r.label} className={r.ok ? "ok" : "bad"}>{r.ok ? "درست" : "نادرست"}: {r.label}</li>)}
          {passed && <li className="ok"><strong>آفرین، تمرین حل شد.</strong></li>}
        </ul>
      )}
      {showSolution && <div className="solution"><p>راه‌حل نمونه (اول خودت تلاش کن):</p><pre><code>{exercise.solution}</code></pre></div>}
    </section>
  );
}
