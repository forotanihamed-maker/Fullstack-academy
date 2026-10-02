import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const content = path.join(root, "content");
const sectionsPath = path.join(content, "sections.json");
const errors = [];
const warnings = [];

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (error) { errors.push(`${path.relative(root, file)}: invalid JSON (${error.message})`); return null; }
}

const sections = readJson(sectionsPath) || [];
const sectionIds = new Set();
for (const section of sections) {
  if (!section.slug || !section.title) errors.push(`sections.json: section needs slug and title`);
  if (sectionIds.has(section.slug)) errors.push(`sections.json: duplicate slug ${section.slug}`);
  sectionIds.add(section.slug);
}

for (const section of sections) {
  const dir = path.join(content, section.slug);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    const full = path.join(dir, file);
    const base = file.replace(/\.md$/, "");
    const text = fs.readFileSync(full, "utf8");
    if (!text.startsWith("---")) warnings.push(`${path.relative(root, full)}: no frontmatter`);
    const quiz = path.join(dir, `${base}.quiz.json`);
    const exercise = path.join(dir, `${base}.exercise.json`);
    const playground = path.join(dir, `${base}.playground.json`);
    if (fs.existsSync(quiz)) {
      const items = readJson(quiz);
      if (!Array.isArray(items)) errors.push(`${path.relative(root, quiz)}: quiz must be an array`);
      else items.forEach((q, i) => {
        if (!q.q || !Array.isArray(q.o) || typeof q.a !== "number" || q.a < 0 || q.a >= q.o.length || !q.e) errors.push(`${path.relative(root, quiz)}[${i}]: invalid quiz item`);
      });
    }
    if (fs.existsSync(exercise)) {
      const item = readJson(exercise);
      if (!item || !item.title || !item.desc || typeof item.start !== "string" || !Array.isArray(item.tests)) errors.push(`${path.relative(root, exercise)}: invalid exercise`);
    }
    if (fs.existsSync(playground)) {
      const item = readJson(playground);
      if (!item || typeof item.html !== "string" || typeof item.css !== "string" || typeof item.js !== "string") errors.push(`${path.relative(root, playground)}: invalid playground`);
    }
    const challenge = path.join(dir, `${base}.challenge.json`);
    if (fs.existsSync(challenge)) {
      const item = readJson(challenge);
      if (!item || !item.id || !item.title || !item.brief || !Array.isArray(item.requirements) || !Array.isArray(item.hints) || !Array.isArray(item.acceptanceCriteria)) errors.push(`${path.relative(root, challenge)}: invalid challenge`);
    }
  }
}

const projectsDir = path.join(content, "projects");
if (fs.existsSync(projectsDir)) {
  for (const file of fs.readdirSync(projectsDir).filter(f => f.endsWith(".json"))) {
    const project = readJson(path.join(projectsDir, file));
    if (!project) continue;
    for (const key of ["id", "slug", "title", "type", "description", "difficulty", "milestones", "requirements", "acceptanceCriteria"]) {
      if (project[key] === undefined) errors.push(`projects/${file}: missing ${key}`);
    }
    const ids = new Set();
    for (const milestone of project.milestones || []) {
      if (!milestone.id || !milestone.title) errors.push(`projects/${file}: invalid milestone`);
      if (ids.has(milestone.id)) errors.push(`projects/${file}: duplicate milestone ${milestone.id}`);
      ids.add(milestone.id);
    }
  }
}

if (errors.length) {
  console.error(`Content validation failed: ${errors.length} error(s)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Content validation passed. ${warnings.length} warning(s).`);
for (const warning of warnings) console.log(`- ${warning}`);
