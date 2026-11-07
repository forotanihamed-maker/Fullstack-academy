import { useState, useRef } from "react";
import { isExerciseSolved, markExerciseSolved, useProgress } from "../progress.js";
import "./editor.css";

const wrap = c => `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"></head><body>${c}</body></html>`;

export default function CodeEditor({ exercise }) {
  const [code, setCode] = useState(exercise.starter);
  const [srcDoc, setSrcDoc] = useState(wrap(exercise.starter));
  const [results, setResults] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const progress = useProgress();
  const solved = isExerciseSolved(progress, exercise.id);
  const frame = useRef(null);
  const pending = useRef(false);

  const runTests = () => {
    const d = frame.current?.contentDocument;
    if (!d) return;
    const res = exercise.tests.map(t => {
      let ok = false;
      try { ok = !!t.run(d); } catch { ok = false; }
      return { label: t.label, ok };
    });
    setResults(res);
    if (res.every(r => r.ok)) markExerciseSolved(exercise.id);
  };

  const run = () => { setResults(null); setSrcDoc(wrap(code)); };
  const check = () => {
    const next = wrap(code);
    if (next === srcDoc) { runTests(); return; }   // صفحه دوباره بارگذاری نمی‌شود
    pending.current = true;
    setSrcDoc(next);
  };
  const reset = () => { setCode(exercise.starter); setSrcDoc(wrap(exercise.starter)); setResults(null); };
  const passed = results && results.every(r => r.ok);

  return (
    <section className="exercise">
      <h3>{exercise.title} {solved && <span className="badge-ok">✓ حل شده</span>}</h3>
      <p>{exercise.task}</p>
      <div className="editor-grid">
        <textarea dir="ltr" spellCheck="false" value={code} onChange={e => setCode(e.target.value)} aria-label="ادیتور کد" />
        <iframe ref={frame} title="پیش‌نمایش" sandbox="allow-same-origin" srcDoc={srcDoc}
          onLoad={() => { if (pending.current) { pending.current = false; runTests(); } }} />
      </div>
      <div className="actions">
        <button onClick={run}>اجرای کد</button>
        <button className="primary" onClick={check}>بررسی پاسخ</button>
        <button onClick={reset}>شروع دوباره</button>
        <button onClick={() => setShowSolution(s => !s)} aria-expanded={showSolution}>{showSolution ? "پنهان کردن راه‌حل" : "نمایش راه‌حل"}</button>
      </div>
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
