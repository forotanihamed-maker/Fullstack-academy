"use client";
import { useState } from "react";

export default function Quiz({ questions }) {
  const [picked, setPicked] = useState({});
  return (
    <>
      {questions.map((q, qi) => {
        const p = picked[qi];
        return (
          <div className="q" key={qi}>
            <p>{q.q}</p>
            {q.o.map((t, i) => {
              let c = "opt";
              if (p !== undefined) { if (i === q.a) c += " ok"; else if (i === p) c += " bad"; }
              return (
                <button key={i} className={c} disabled={p !== undefined} onClick={() => setPicked({ ...picked, [qi]: i })}>{t}</button>
              );
            })}
            {p !== undefined && <div className="exp">{p === q.a ? "✅ درست! " : "❌ نادرست. "}{q.e}</div>}
          </div>
        );
      })}
    </>
  );
}
