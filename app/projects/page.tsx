import Link from "next/link";
import { getProjects } from "../../lib/projects";

export default function ProjectsPage() {
  const projects = getProjects();
  return <section className="card">
    <h1>پروژه‌ها</h1>
    <p>پروژه‌ها از تمرین‌های کوچک تا Journey Projectهای چندمرحله‌ای طراحی شده‌اند.</p>
    <div className="project-grid">
      {projects.map((project) => <Link key={project.id} className="project-card" href={`/projects/${project.slug}`}>
        <strong>{project.title}</strong><span>{project.type} · {project.difficulty}</span><p>{project.description}</p>
      </Link>)}
    </div>
  </section>;
}
