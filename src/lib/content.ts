import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface ContentMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
  published?: boolean;
}

const projectsDir = path.join(process.cwd(), "src/content/projects");
const articlesDir = path.join(process.cwd(), "src/content/articles");

function getSlugs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function parseMeta(dir: string, slug: string): ContentMeta {
  const filePath = path.join(dir, `${slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(source);
  return { slug, ...data } as ContentMeta;
}

export function getAllProjects(): ContentMeta[] {
  return getSlugs(projectsDir)
    .map((slug) => parseMeta(projectsDir, slug))
    .filter((p) => p.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllArticles(): ContentMeta[] {
  return getSlugs(articlesDir)
    .map((slug) => parseMeta(articlesDir, slug))
    .filter((a) => a.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getProjectBySlug(slug: string): ContentMeta {
  return parseMeta(projectsDir, slug);
}

export function getArticleBySlug(slug: string): ContentMeta {
  return parseMeta(articlesDir, slug);
}

function getContentBody(dir: string, slug: string): string {
  const filePath = path.join(dir, `${slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(source);
  return content;
}

export function getProjectContent(slug: string): string {
  return getContentBody(projectsDir, slug);
}

export function getArticleContent(slug: string): string {
  return getContentBody(articlesDir, slug);
}
