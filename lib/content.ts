import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const dir = path.join(process.cwd(), "content");
const readJson = (p) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : null);

// درس‌های یک بخش: فایل‌هایی مثل 01-intro.md ، 02-elements.md ...
function lessonIds(slug) {
  const base = path.join(dir, slug);
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base).filter((f) => /^\d\d-.+\.md$/.test(f)).sort().map((f) => f.replace(/\.md$/, ""));
}

export function getSections() {
  const all = readJson(path.join(dir, "sections.json")) || [];
  return all.map((s) => ({
    ...s,
    ready: lessonIds(s.slug).length > 0 || fs.existsSync(path.join(dir, s.slug, "note.md")),
  }));
}

export function getSectionLessons(slug) {
  return lessonIds(slug).map((id) => {
    const { data } = matter(fs.readFileSync(path.join(dir, slug, id + ".md"), "utf8"));
    return { id, title: data.title || id };
  });
}

// id خالی = بخش‌های قدیمی که یک note.md دارند
export function getLesson(slug, id) {
  const base = path.join(dir, slug);
  const file = id ? id + ".md" : "note.md";
  const prefix = id ? id + "." : "";
  const notePath = path.join(base, file);
  if (!fs.existsSync(notePath)) return null;
  const { data, content } = matter(fs.readFileSync(notePath, "utf8"));
  return {
    title: data.title || slug,
    content,
    quiz: readJson(path.join(base, prefix + "quiz.json")),
    exercise: readJson(path.join(base, prefix + "exercise.json")),
    playground: readJson(path.join(base, prefix + "playground.json")),
  };
}
