import { useEffect, useState } from "react";
import { Routes, Route, NavLink, Link, useParams, useLocation } from "react-router-dom";
import CodeEditor from "./components/CodeEditor.jsx";
import Lesson from "./components/Lesson.jsx";
import ProjectList from "./components/ProjectList.jsx";
import { exercises } from "./exercises.js";
import { lessonsBySlug } from "./lessons.js";
import { projectsBySlug } from "./projects.js";
import { overallStats, stageStats } from "./catalog.js";
import { useProgress } from "./progress.js";
import "./app.css";

const fa = new Intl.NumberFormat("fa-IR");

function useStages() {
  const [state, setState] = useState({ status: "loading", stages: [] });

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/stages", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((stages) => setState({ status: "ready", stages }))
      .catch((error) => {
        if (error.name !== "AbortError") setState({ status: "error", stages: [] });
      });

    return () => controller.abort();
  }, []);

  return state;
}

// منوی «همه‌ی مراحل» در هدر
function StageMenu({ stages }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="menu">
      <button type="button" aria-expanded={open} aria-controls="stage-menu" onClick={() => setOpen((o) => !o)}>
        همه‌ی مراحل
      </button>
      {open && (
        <ol id="stage-menu" className="menu__list">
          {stages.map((s) => (
            <li key={s.slug}>
              <Link to={`/stage/${s.slug}`}>{fa.format(s.order)}. {s.title}</Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Home({ stages, status }) {
  const progress = useProgress();
  const overall = overallStats(progress);

  return (
    <main className="home">
      <h1>از صفر تا فول استک، با ساختن</h1>
      <p className="lead">درس‌نامه‌ی فارسی، تمرین با ادیتور زنده، و پروژه‌های واقعی برای تثبیت هر مرحله.</p>

      <section className="overall" aria-label="پیشرفت کلی">
        <p>
          پیشرفت تو: {fa.format(overall.done)} از {fa.format(overall.total)} مورد ({fa.format(overall.percent)}٪)
        </p>
        <progress value={overall.done} max={Math.max(overall.total, 1)} aria-label="پیشرفت کلی" />
      </section>

      {status === "loading" && <p className="empty">در حال بارگذاری مراحل...</p>}
      {status === "error" && (
        <p className="empty" role="alert">
          دریافت مراحل ناموفق بود. مطمئن شو سرور اجرا است (<code>npm start</code> در پوشه‌ی <code>server</code>).
        </p>
      )}

      <ol className="path">
        {stages.map((s) => {
          const stats = stageStats(s.slug, progress);
          return (
            <li key={s.slug}>
              <Link to={`/stage/${s.slug}`}>
                <span>{s.title}</span>
                <span className="meta">
                  {s.kind === "browser" && <small>ادیتور زنده</small>}
                  {stats.lessons.total > 0 && (
                    <span className="chip">درس {fa.format(stats.lessons.done)}/{fa.format(stats.lessons.total)}</span>
                  )}
                  {stats.exercises.total > 0 && (
                    <span className="chip">تمرین {fa.format(stats.exercises.done)}/{fa.format(stats.exercises.total)}</span>
                  )}
                  {stats.projects.total > 0 && (
                    <span className="chip">پروژه {fa.format(stats.projects.done)}/{fa.format(stats.projects.total)}</span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </main>
  );
}

function Stage({ stages, status }) {
  const { slug } = useParams();
  const progress = useProgress();
  const [idx, setIdx] = useState(0);

  useEffect(() => setIdx(0), [slug]);

  const stage = stages.find((s) => s.slug === slug);
  const lessons = lessonsBySlug[slug] ?? [];
  const list = exercises[slug] ?? [];
  const projects = projectsBySlug[slug] ?? [];

  if (status === "loading") return <main><p className="empty">در حال بارگذاری...</p></main>;

  if (!stage) {
    return (
      <main>
        <p className="empty">مرحله‌ای با این آدرس پیدا نشد. <Link to="/">بازگشت به صفحه‌ی اصلی</Link></p>
      </main>
    );
  }

  const nextStage = stages[stages.indexOf(stage) + 1];

  function goTo(index) {
    setIdx(index);
    document.getElementById("lessons")?.scrollIntoView();
  }

  return (
    <main className="stage">
      <h1>{stage.title}</h1>

      <nav className="tabs" aria-label="بخش‌های مرحله">
        <a href="#lessons">درس‌نامه</a>
        <a href="#exercises">تمرین</a>
        <a className="project" href="#projects">پروژه</a>
      </nav>

      <span id="lessons" />
      {lessons.length === 0 && <p className="empty">درس‌نامه‌ی این مرحله هنوز اضافه نشده است.</p>}

      {lessons.length > 1 && (
        <div className="lesson-nav">
          {lessons.map((l, i) => (
            <button key={l.file} aria-pressed={i === idx} onClick={() => goTo(i)}>
              {progress.lessons[l.file] && "✓ "}
              {l.title}
            </button>
          ))}
        </div>
      )}

      {lessons[idx] && <Lesson lesson={lessons[idx]} />}

      {lessons.length > 1 && (
        <nav className="lesson-pager" aria-label="درس قبلی و بعدی">
          <button type="button" disabled={idx === 0} onClick={() => goTo(idx - 1)}>
            درس قبلی
          </button>
          <button type="button" disabled={idx === lessons.length - 1} onClick={() => goTo(idx + 1)}>
            درس بعدی
          </button>
        </nav>
      )}

      <h2 id="exercises">تمرین‌های تعاملی</h2>
      {list.length === 0 && <p className="empty">تمرینی برای این مرحله ثبت نشده است.</p>}
      {list.map((ex) => <CodeEditor key={ex.id} exercise={ex} />)}

      <h2 id="projects">پروژه‌ها</h2>
      {projects.length === 0 && <p className="empty">پروژه‌ای برای این مرحله ثبت نشده است.</p>}
      <ProjectList key={slug} projects={projects} />

      {nextStage && (
        <p className="stage-next">
          مرحله‌ی بعد: <Link to={`/stage/${nextStage.slug}`}>{nextStage.title}</Link>
        </p>
      )}
    </main>
  );
}

export default function App() {
  const { status, stages } = useStages();

  return (
    <>
      <header className="top">
        <Link to="/" className="brand">مسیر فول استک</Link>
        <nav aria-label="ناوبری اصلی">
          <NavLink to="/" end>خانه</NavLink>
          <StageMenu stages={stages} />
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home stages={stages} status={status} />} />
        <Route path="/stage/:slug" element={<Stage stages={stages} status={status} />} />
      </Routes>
    </>
  );
}
