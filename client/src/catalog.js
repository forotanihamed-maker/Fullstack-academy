import { lessonsBySlug } from "./lessons.js";
import { exercises } from "./exercises.js";
import { projectsBySlug } from "./projects.js";
import { isExerciseSolved } from "./progress.js";

// آمار یک مرحله: چند درس، تمرین و پروژه دارد و چندتایش انجام شده
export function stageStats(slug, progress) {
  const lessons = lessonsBySlug[slug] ?? [];
  const list = exercises[slug] ?? [];
  const projects = projectsBySlug[slug] ?? [];

  return {
    lessons: { done: lessons.filter((l) => progress.lessons[l.file]).length, total: lessons.length },
    exercises: { done: list.filter((e) => isExerciseSolved(progress, e.id)).length, total: list.length },
    projects: { done: projects.filter((p) => progress.projects[p.file]).length, total: projects.length },
  };
}

// آمار کل (هر مورد فقط یک بار شمرده می‌شود، حتی اگر در چند مرحله باشد)
export function overallStats(progress) {
  const lessons = new Set(Object.values(lessonsBySlug).flat().map((l) => l.file));
  const exerciseIds = new Set(Object.values(exercises).flat().map((e) => e.id));
  const projects = new Set(Object.values(projectsBySlug).flat().map((p) => p.file));

  const done =
    [...lessons].filter((file) => progress.lessons[file]).length +
    [...exerciseIds].filter((id) => isExerciseSolved(progress, id)).length +
    [...projects].filter((file) => progress.projects[file]).length;

  const total = lessons.size + exerciseIds.size + projects.size;

  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}
