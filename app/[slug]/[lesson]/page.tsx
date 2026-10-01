import Link from "next/link";
import { notFound } from "next/navigation";
import LessonView from "../../../components/LessonView";
import { getLesson, getSectionLessons, getSections } from "../../../lib/content";

export function generateStaticParams() {
  return getSections().flatMap((s) => getSectionLessons(s.slug).map((l) => ({ slug: s.slug, lesson: l.id })));
}

export default async function LessonPage({ params }) {
  const { slug, lesson: id } = await params;
  const lessons = getSectionLessons(slug);
  const i = lessons.findIndex((l) => l.id === id);
  if (i < 0) notFound();
  const lesson = getLesson(slug, id);
  const prev = lessons[i - 1];
  const next = lessons[i + 1];
  return (
    <>
      <p className="crumb"><Link href={"/" + slug}>← فهرست درس‌های این بخش</Link></p>
      <LessonView lesson={lesson} />
      <div className="pager">
        {prev ? <Link href={"/" + slug + "/" + prev.id}>→ {prev.title}</Link> : <span />}
        {next ? <Link href={"/" + slug + "/" + next.id}>{next.title} ←</Link> : <span />}
      </div>
    </>
  );
}
