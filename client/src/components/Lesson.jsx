import { Children, isValidElement, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock.jsx";
import Toc from "./Toc.jsx";
import { extractHeadings, remarkHeadingIds, selectTocHeadings } from "../lib/markdown.js";
import { toggleLesson, toggleProject, useProgress } from "../progress.js";
import "./lesson.css";
import "./reading.css";

// متن یک Node را از بین فرزندان React بیرون می‌کشد
function childrenToText(children) {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      return isValidElement(child) ? childrenToText(child.props.children) : "";
    })
    .join("");
}

// بلوک‌های کد (```) را با CodeBlock (رنگی + دکمه‌ی کپی) نمایش می‌دهیم؛ کد درون‌خطی دست‌نخورده می‌ماند
const markdownComponents = {
  pre({ children }) {
    const code = Children.toArray(children)[0];

    if (isValidElement(code)) {
      const lang = /language-([\w-]+)/.exec(code.props.className || "")?.[1];
      const text = childrenToText(code.props.children).replace(/\n$/, "");
      return <CodeBlock lang={lang} text={text} />;
    }

    return <pre>{children}</pre>;
  },
};

function ReadToggle({ file, kind }) {
  const progress = useProgress();
  const isProject = kind === "project";
  const checked = Boolean((isProject ? progress.projects : progress.lessons)[file]);

  return (
    <label className="read-toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => (isProject ? toggleProject : toggleLesson)(file, event.target.checked)}
      />
      {isProject ? "این پروژه را انجام دادم" : "این درس را خواندم"}
    </label>
  );
}

export default function Lesson({ lesson, kind = "lesson" }) {
  const [state, setState] = useState({ status: "loading", text: "" });
  const url = `/lessons/${lesson.file}`;

  useEffect(() => {
    if (lesson.type !== "md") return;

    const controller = new AbortController(); // اگر کاربر زود درس را عوض کرد، درخواست قبلی لغو شود
    setState({ status: "loading", text: "" });

    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        // اگر فایل وجود نداشته باشد، سرور توسعه صفحه‌ی index.html برمی‌گرداند (نه خطای ۴۰۴)
        if ((response.headers.get("content-type") || "").includes("text/html")) {
          throw new Error("فایل درس پیدا نشد");
        }

        return response.text();
      })
      .then((text) => setState({ status: "ready", text }))
      .catch((error) => {
        if (error.name !== "AbortError") setState({ status: "error", text: "" });
      });

    return () => controller.abort();
  }, [url, lesson.type]);

  const headings = useMemo(() => (state.status === "ready" ? extractHeadings(state.text) : []), [state]);
  const tocHeadings = useMemo(() => selectTocHeadings(headings), [headings]);

  if (lesson.type === "pdf") {
    return (
      <div className="pdf">
        <p><a href={url} target="_blank" rel="noopener noreferrer">باز کردن در تب جدید</a></p>
        <iframe src={url} title={lesson.title} />
        <ReadToggle file={lesson.file} kind={kind} />
      </div>
    );
  }

  if (state.status === "error") {
    return <p className="empty" role="alert">بارگذاری درس ناموفق بود. فایل <code>{lesson.file}</code> را در پوشه‌ی <code>client/public/lessons</code> بررسی کن.</p>;
  }

  return (
    <div className="lesson-layout" aria-busy={state.status === "loading"}>
      <div className="lesson-main">
        <Toc headings={tocHeadings} />
        <article className="lesson">
          {state.status === "loading" ? (
            <p className="empty">در حال بارگذاری درس...</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm, [remarkHeadingIds, headings]]}
              components={markdownComponents}
            >
              {state.text}
            </ReactMarkdown>
          )}
        </article>
        <ReadToggle file={lesson.file} kind={kind} />
      </div>
    </div>
  );
}
