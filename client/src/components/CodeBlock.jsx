import { useEffect, useState } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import powershell from "highlight.js/lib/languages/powershell";
import markdown from "highlight.js/lib/languages/markdown";
import "highlight.js/styles/github-dark.css";

// فقط زبان‌هایی که در درس‌ها لازم‌اند ثبت می‌شوند (حجم کمتر)
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("json", json);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("powershell", powershell);
hljs.registerLanguage("markdown", markdown);

const ALIASES = {
  js: "javascript",
  jsx: "javascript",
  html: "xml",
  sh: "bash",
  shell: "bash",
  ps1: "powershell",
  md: "markdown",
};

function resolveLanguage(lang) {
  const name = ALIASES[lang] ?? lang;
  return name && hljs.getLanguage(name) ? name : null;
}

export default function CodeBlock({ lang, text }) {
  const [copied, setCopied] = useState(false);
  const language = resolveLanguage(lang);

  // خروجی highlight.js خودش Escape شده است؛ برای نمایش رنگی لازم است HTML باشد
  const html = language ? hljs.highlight(text, { language, ignoreIllegals: true }).value : null;

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      /* مرورگر اجازه نداد؛ کاربر می‌تواند دستی کپی کند */
    }
  }

  return (
    <div className="code-block">
      <div className="code-block__bar">
        <span className="code-block__lang" dir="ltr">{lang || "text"}</span>
        <button type="button" className="code-block__copy" onClick={copy}>
          {copied ? "کپی شد ✓" : "کپی"}
        </button>
      </div>
      <pre dir="ltr" tabIndex={0}>
        {html ? (
          <code className={`hljs language-${language}`} dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <code>{text}</code>
        )}
      </pre>
    </div>
  );
}
