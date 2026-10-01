import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Quiz from "./Quiz";
import Exercise from "./Exercise";
import Playground from "./Playground";
import "../app/lessons.css";

export default function LessonView({ lesson }) {
  return (
    <>
      <article className="card">
        <h1>{lesson.title}</h1>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content}</ReactMarkdown>
      </article>
      {lesson.playground && (
        <section className="card">
          <h2>{lesson.playground.title || "تمرین عملی"}</h2>
          <Playground data={lesson.playground} />
        </section>
      )}
      {lesson.quiz && (<section className="card"><h2>کوییز</h2><Quiz questions={lesson.quiz} /></section>)}
      {lesson.exercise && (<section className="card"><h2>{lesson.exercise.title}</h2><Exercise exercise={lesson.exercise} /></section>)}
    </>
  );
}
