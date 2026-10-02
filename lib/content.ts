import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type LessonSummary = {
  id: string;
  title: string;
  description?: string;
  difficulty?: Difficulty;
  estimatedMinutes?: number;
};

export type Lesson = LessonSummary & {
  moduleId: string;
  content: string;
  objectives: string[];
  concepts: string[];
  prerequisites: string[];
  relatedLessons: string[];
  relatedProjects: string[];
  nextLesson?: string;
  quiz: unknown[] | null;
  exercise: Record<string, unknown> | null;
  playground: Record<string, unknown> | null;
  challenges: Record<string, unknown>[];
};

const contentDir = path.join(process.cwd(), "content");

function readJson<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function lessonIds(slug: string): string[] {
  const base = path.join(contentDir, slug);
  if (!fs.existsSync(base)) return [];

  return fs.readdirSync(base, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^\d\d-.+\.md$/.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name, "en"))
    .map((entry) => entry.name.replace(/\.md$/, ""));
}

export function getSections() {
  const all = readJson<Array<Record<string, unknown>>>(path.join(contentDir, "sections.json")) || [];
  return all.map((section) => {
    const slug = String(section.slug);
    return {
      ...section,
      slug,
      title: String(section.title ?? slug),
      ready: lessonIds(slug).length > 0 || fs.existsSync(path.join(contentDir, slug, "note.md")),
    };
  });
}

export function getSectionLessons(slug: string): LessonSummary[] {
  return lessonIds(slug).flatMap((id) => {
    const filePath = path.join(contentDir, slug, `${id}.md`);
    if (!fs.existsSync(filePath)) return [];

    const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
    return [{
      id,
      title: String(data.title || id),
      description: typeof data.description === "string" ? data.description : content.trim().split("\n").find(Boolean)?.slice(0, 160),
      difficulty: data.difficulty as Difficulty | undefined,
      estimatedMinutes: typeof data.estimatedMinutes === "number" ? data.estimatedMinutes : undefined,
    }];
  });
}

export function getLesson(slug: string, id?: string): Lesson | null {
  const base = path.join(contentDir, slug);
  const fileName = id ? `${id}.md` : "note.md";
  const prefix = id ? `${id}.` : "";
  const filePath = path.join(base, fileName);
  if (!fs.existsSync(filePath)) return null;

  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  const summary = getSectionLessons(slug).find((item) => item.id === id);

  return {
    id: id || slug,
    moduleId: slug,
    title: String(data.title || summary?.title || slug),
    description: typeof data.description === "string" ? data.description : summary?.description,
    difficulty: (data.difficulty as Difficulty | undefined) || summary?.difficulty,
    estimatedMinutes: typeof data.estimatedMinutes === "number" ? data.estimatedMinutes : summary?.estimatedMinutes,
    content,
    objectives: Array.isArray(data.objectives) ? data.objectives.map(String) : [],
    concepts: Array.isArray(data.concepts) ? data.concepts.map(String) : [],
    prerequisites: Array.isArray(data.prerequisites) ? data.prerequisites.map(String) : [],
    relatedLessons: Array.isArray(data.relatedLessons) ? data.relatedLessons.map(String) : [],
    relatedProjects: Array.isArray(data.relatedProjects) ? data.relatedProjects.map(String) : [],
    nextLesson: typeof data.nextLesson === "string" ? data.nextLesson : undefined,
    quiz: readJson<unknown[]>(path.join(base, `${prefix}quiz.json`)) ?? readJson<unknown[]>(path.join(base, "quiz.json")),
    exercise: readJson<Record<string, unknown>>(path.join(base, `${prefix}exercise.json`)) ?? readJson<Record<string, unknown>>(path.join(base, "exercise.json")),
    playground: readJson<Record<string, unknown>>(path.join(base, `${prefix}playground.json`)) ?? readJson<Record<string, unknown>>(path.join(base, "playground.json")),
    challenges: [readJson<Record<string, unknown>>(path.join(base, `${prefix}challenge.json`))].filter((x): x is Record<string, unknown> => Boolean(x)),
  };
}
