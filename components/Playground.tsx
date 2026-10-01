"use client";
import { useEffect, useRef, useState } from "react";
import "./playground.css";

// ساخت سند پیش‌نمایش؛ تست‌ها داخل خود iframe اجرا و نتیجه با postMessage برگردانده می‌شود
function build(code, checks) {
  const data = JSON.stringify(checks || []).replace(/</g, "\\u003c");
  return (
    '<!DOCTYPE html><html lang="fa" dir="rtl"><head><meta charset="utf-8">' +
    "<style>body{font-family:Tahoma,sans-serif;margin:12px}</style>" +
    "<style>" + code.css + "</style></head><body>" + code.html +
    "<script>" + code.js + "<\/script>" +
    "<script>(function(){var c=" + data + ";var r=c.map(function(x){try{return{label:x[0],ok:!!eval(x[1])}}catch(e){return{label:x[0],ok:false}}});parent.postMessage({__pg:true,results:r},'*')})();<\/script>" +
    "</body></html>"
  );
}

export default function Playground({ data }) {
  const initial = { html: data.html || "", css: data.css || "", js: data.js || "" };
  const [code, setCode] = useState(initial);
  const [tab, setTab] = useState("html");
  const [doc, setDoc] = useState(() => build(initial, data.checks));
  const [results, setResults] = useState([]);
  const frame = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setDoc(build(code, data.checks)), 400);
    return () => clearTimeout(t);
  }, [code]);

  useEffect(() => {
    function onMsg(e) {
      if (frame.current && e.source === frame.current.contentWindow && e.data && e.data.__pg) setResults(e.data.results);
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const passed = results.filter((r) => r.ok).length;
  return (
    <div className="pg">
      {data.desc && <p dangerouslySetInnerHTML={{ __html: data.desc }} />}
      <div className="pg-grid">
        <div className="pg-ed">
          <div className="pg-tabs">
            {["html", "css", "js"].map((t) => (
              <button key={t} className={t === tab ? "on" : ""} onClick={() => setTab(t)}>{t.toUpperCase()}</button>
            ))}
            <button className="pg-reset" onClick={() => setCode(initial)}>بازنشانی</button>
          </div>
          <textarea value={code[tab]} spellCheck={false} onChange={(e) => setCode({ ...code, [tab]: e.target.value })} />
        </div>
        <iframe ref={frame} title="پیش‌نمایش" sandbox="allow-scripts" srcDoc={doc} className="pg-out" />
      </div>
      {data.checks && data.checks.length > 0 && (
        <div className="pg-checks">
          <strong>{passed === results.length && results.length > 0 ? "🎉 همه‌ی موارد درست است!" : "چک‌لیست تمرین (" + passed + " از " + data.checks.length + ")"}</strong>
          <ul>
            {data.checks.map((c, i) => {
              const ok = results[i] && results[i].ok;
              return <li key={i} className={ok ? "ok" : ""}>{ok ? "✔ " : "○ "}{c[0]}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
