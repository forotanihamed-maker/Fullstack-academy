import fs from "node:fs";
import path from "node:path";

export type Project = {
  id: string;
  slug: string;
  title: string;
  type: "micro" | "skill" | "journey" | "capstone";
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  prerequisites: string[];
  technologies: string[];
  skills: string[];
  requirements: string[];
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    requiredLessons: string[];
    requiredSkills: string[];
    tasks: string[];
    checkpoint?: string;
  }>;
  deliverables: string[];
  acceptanceCriteria: string[];
  extensionIdeas?: string[];
};

const projectsDir = path.join(process.cwd(), "content", "projects");

function readProject(fileName: string): Project | null {
  const filePath = path.join(projectsDir, fileName);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as Project;
  } catch {
    return null;
  }
}

export function getProjects(): Project[] {
  if (!fs.existsSync(projectsDir)) return [];
  return fs.readdirSync(projectsDir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map(readProject)
    .filter((project): project is Project => Boolean(project));
}

export function getProject(slug: string): Project | null {
  return readProject(`${slug}.json`);
}
