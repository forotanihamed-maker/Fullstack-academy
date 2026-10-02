import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Quiz from "./Quiz";
import Exercise from "./Exercise";
import Playground from "./Playground";
import LessonProgress from "./LessonProgress";
import Challenge from "./Challenge";
import "../app/lessons.css";

export default function LessonView({ lesson }) {
  return (
    <>
      <article className="card">
        <div className="lesson-meta">{lesson.difficulty && <span>{lesson.difficulty}</span>}{lesson.estimatedMinutes && <span>{lesson.estimatedMinutes} دقیقه</span>}</div>
        <h1>{lesson.title}</h1>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content}</ReactMarkdown>
      </article>
      <LessonProgress lessonId={`${lesson.moduleId}/${lesson.id}`} />
      {lesson.playground && (
        <section className="card">
          <h2>{lesson.playground.title || "تمرین عملی"}</h2>
          <Playground data={lesson.playground} />
        </section>
      )}
      {lesson.quiz && (<section className="card"><h2>کوییز</h2><Quiz questions={lesson.quiz} /></section>)}
      {lesson.exercise && (<section className="card"><h2>{lesson.exercise.title}</h2><Exercise exercise={lesson.exercise} /></section>)}
      {lesson.challenges?.map((challenge, index) => (<section className="card" key={String(challenge.id ?? index)}><Challenge challenge={challenge} /></section>))}
    </>
  );
}
