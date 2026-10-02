"use client";
import { useEffect, useMemo, useRef, useState } from "react";

function buildRunner(code: string, tests: Array<[string, string]>) {
  const safeCode = JSON.stringify(code).replace(/</g, "\\u003c");
  const safeTests = JSON.stringify(tests || []).replace(/</g, "\\u003c");
  return `<!doctype html><html><body><script>
const source=${safeCode};
const tests=${safeTests};
(async()=>{
  const results=[];
  try {
    const fn=new Function(source+"\\n;return {"+tests.map((_,i)=>"t"+i+":"+tests[i][1]).join(",")+"};");
    const out=await Promise.race([Promise.resolve(fn()),new Promise((_,reject)=>setTimeout(()=>reject(new Error("زمان اجرا تمام شد")),3000))]);
    for(let i=0;i<tests.length;i++) results.push({label:tests[i][0],ok:out["t"+i]===true});
  } catch(e) {
    for(const t of tests) results.push({label:t[0],ok:false,err:String(e?.message||e)});
  }
  parent.postMessage({__exercise:true,results},"*");
})();
<\/script></body></html>`;
}

export default function Exercise({ exercise }: { exercise: { title?: string; desc: string; start: string; tests: Array<[string,string]> } }) {
  const [code, setCode] = useState(exercise.start);
  const [results, setResults] = useState<Array<{label:string;ok:boolean;err?:string}> | null>(null);
  const [running, setRunning] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const srcDoc = useMemo(() => buildRunner(code, exercise.tests), [code, exercise.tests]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (frame.current && event.source === frame.current.contentWindow && event.data?.__exercise) {
        setResults(event.data.results);
        setRunning(false);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  function run() {
    setResults(null);
    setRunning(true);
    if (frame.current) frame.current.srcdoc = srcDoc;
  }

  const passed = results?.filter((r) => r.ok).length ?? 0;
  return (
    <div>
      <p dangerouslySetInnerHTML={{ __html: exercise.desc }} />
      <textarea value={code} spellCheck={false} onChange={(e) => setCode(e.target.value)} />
      <button className="run" onClick={run} disabled={running}>{running ? "در حال اجرا..." : "▶ اجرا و بررسی"}</button>
      <iframe ref={frame} title="محیط اجرای امن تمرین" sandbox="allow-scripts" className="exercise-frame" />
      {results && (
        <div className="res" aria-live="polite">
          <strong className={passed === results.length ? "ok" : "bad"}>
            {passed === results.length ? "🎉 همه‌ی تست‌ها موفق بودند." : `${passed} از ${results.length} تست موفق بود.`}
          </strong>
          {results.map((r, i) => <div key={i} className={r.ok ? "ok" : "bad"}>{r.ok ? "✔ " : "✘ "}{r.label}{r.err ? ` — ${r.err}` : ""}</div>)}
        </div>
      )}
    </div>
  );
}
