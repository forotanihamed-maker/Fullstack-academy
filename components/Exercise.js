"use client";
import { useState } from "react";

export default function Exercise({ exercise }) {
  const [code, setCode] = useState(exercise.start);
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    const rs = [];
    for (const [label, expr] of exercise.tests) {
      try {
        const fn = new Function(code + "\n;return (" + expr + ");");
        // تست می‌تواند مقدار عادی یا Promise برگرداند؛ حداکثر ۳ ثانیه صبر می‌کنیم
        const out = await Promise.race([
          Promise.resolve(fn()),
          new Promise((_, reject) => setTimeout(() => reject(new Error("زمان تمام شد")), 3000)),
        ]);
        rs.push({ label, ok: out === true });
      } catch (e) {
        rs.push({ label, ok: false, err: e.message });
      }
    }
    setResults(rs);
    setRunning(false);
  }

  const passed = results ? results.filter((r) => r.ok).length : 0;
  return (
    <div>
      <p dangerouslySetInnerHTML={{ __html: exercise.desc }} />
      <textarea value={code} spellCheck={false} onChange={(e) => setCode(e.target.value)} />
      <button className="run" onClick={run} disabled={running}>{running ? "در حال اجرا..." : "▶ اجرا و بررسی"}</button>
      {results && (
        <div className="res">
          <strong className={passed === results.length ? "ok" : "bad"}>
            {passed === results.length ? "🎉 همه‌ی تست‌ها موفق بودند." : passed + " از " + results.length + " تست موفق بود."}
          </strong>
          {results.map((r, i) => (
            <div key={i} className={r.ok ? "ok" : "bad"}>{r.ok ? "✔ " : "✘ "}{r.label}{r.err ? " — " + r.err : ""}</div>
          ))}
        </div>
      )}
    </div>
  );
}
