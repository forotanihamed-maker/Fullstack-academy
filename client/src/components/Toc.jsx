import { useEffect, useState } from "react";

// فهرست مطالب درس: کنار صفحه (دسکتاپ) یا بالای متن (موبایل) + نمایش بخش فعلی هنگام اسکرول
export default function Toc({ headings }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (headings.length === 0) return;

    let frame = 0;

    function update() {
      frame = 0;
      let current = headings[0].id;

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= 140) current = heading.id;
        else break; // Headingها به‌ترتیب‌اند؛ بقیه هم پایین‌ترند
      }

      setActive(current);
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  const minLevel = Math.min(...headings.map((h) => h.level));

  const list = (
    <ol className="toc__list">
      {headings.map((heading) => (
        <li key={heading.id} className={`toc__item toc__item--l${heading.level - minLevel}`}>
          <a href={`#${heading.id}`} aria-current={heading.id === active ? "true" : undefined}>
            {heading.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <nav className="toc toc--side" aria-label="فهرست مطالب درس">
        <p className="toc__title">فهرست مطالب</p>
        {list}
      </nav>
      <details className="toc toc--inline">
        <summary>فهرست مطالب</summary>
        <nav aria-label="فهرست مطالب درس">{list}</nav>
      </details>
    </>
  );
}
