import Link from "next/link";
import { notFound } from "next/navigation";
import LessonView from "../../components/LessonView";
import { getLesson, getSectionLessons, getSections } from "../../lib/content";
import "../lessons.css";

export function generateStaticParams() {
  return getSections().filter((s) => s.ready).map((s) => ({ slug: s.slug }));
}

export default async function SectionPage({ params }) {
  const { slug } = await params;
  const section = getSections().find((s) => s.slug === slug);
  if (!section || !section.ready) notFound();

  const lessons = getSectionLessons(slug);
  if (lessons.length) {
    return (
      <div className="card">
        <h1>{section.title}</h1>
        <p>این بخش {lessons.length} درس دارد. به ترتیب پیش بروید:</p>
        <ol className="lessons">
          {lessons.map((l) => (<li key={l.id}><Link href={"/" + slug + "/" + l.id}>{l.title}</Link></li>))}
        </ol>
      </div>
    );
  }

  const lesson = getLesson(slug);
  if (!lesson) notFound();
  return <LessonView lesson={lesson} />;
}
