import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "../../../lib/projects";

export function generateStaticParams() { return getProjects().map((p) => ({ slug: p.slug })); }

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <>
    <p className="crumb"><Link href="/projects">← همه پروژه‌ها</Link></p>
    <article className="card">
      <div className="lesson-meta"><span>{project.type}</span><span>{project.difficulty}</span></div>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <h2>فناوری‌ها</h2><p>{project.technologies.join(" · ")}</p>
      <h2>نیازمندی‌ها</h2><ul>{project.requirements.map((x) => <li key={x}>{x}</li>)}</ul>
      <h2>Milestones</h2>
      <ol className="milestones">{project.milestones.map((m) => <li key={m.id} className="project-milestone">
        <h3>{m.title}</h3><p>{m.description}</p><ul>{m.tasks.map((task) => <li key={task}>{task}</li>)}</ul>{m.checkpoint && <p><strong>Checkpoint:</strong> {m.checkpoint}</p>}
      </li>)}</ol>
      <h2>معیار پذیرش</h2><ul>{project.acceptanceCriteria.map((x) => <li key={x}>{x}</li>)}</ul>
    </article>
  </>;
}
