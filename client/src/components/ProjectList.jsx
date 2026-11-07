import { useState } from "react";
import Lesson from "./Lesson.jsx";
import { useProgress } from "../progress.js";
import "./projects.css";

export default function ProjectList({ projects }) {
  const [idx, setIdx] = useState(0);
  const progress = useProgress();
  const current = projects[idx];
  if (!current) return null;

  return (
    <section className="projects" aria-label="پروژه‌ها">
      <div className="project-cards">
        {projects.map((p, i) => (
          <button key={p.file} className="project-card" aria-pressed={i === idx} onClick={() => setIdx(i)}>
            <strong>{progress.projects[p.file] && "✓ "}{p.title}</strong>
            <span className="project-meta">
              <span className="chip">{p.level}</span>
              <span className="chip chip-status">{p.status}</span>
            </span>
            <small>{p.summary}</small>
          </button>
        ))}
      </div>
      {current.demo && (
        <p>
          <a className="project-demo" href={current.demo} target="_blank" rel="noopener noreferrer">
            باز کردن نمونه‌ی زنده (تب جدید)
          </a>
        </p>
      )}
      <Lesson lesson={{ type: "md", file: current.file, title: current.title }} kind="project" />
    </section>
  );
}
