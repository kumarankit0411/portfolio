import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type ProjectStatus = "live" | "in-progress" | "done";
export type ContentKind = "project" | "article";

export interface ContentMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
  published?: boolean;
  status?: ProjectStatus;
  link?: string;
  kind?: ContentKind;
  featured?: boolean;
  featuredOrder?: number;
}

const projectsDir = path.join(process.cwd(), "src/content/projects");
const articlesDir = path.join(process.cwd(), "src/content/articles");

function byDateDesc(a: ContentMeta, b: ContentMeta) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

function getSlugs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function parseMeta(dir: string, slug: string, kind: ContentKind): ContentMeta {
  const filePath = path.join(dir, `${slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(source);
  return { slug, kind, ...data } as ContentMeta;
}

export function getAllProjects(): ContentMeta[] {
  return getSlugs(projectsDir)
    .map((slug) => parseMeta(projectsDir, slug, "project"))
    .filter((p) => p.published !== false)
    .sort(byDateDesc);
}

export function getAllArticles(): ContentMeta[] {
  return getSlugs(articlesDir)
    .map((slug) => parseMeta(articlesDir, slug, "article"))
    .filter((a) => a.published !== false)
    .sort(byDateDesc);
}

export function getFeaturedItems(): ContentMeta[] {
  const projects = getAllProjects().filter((p) => p.featured);
  const articles = getAllArticles().filter((a) => a.featured);
  return [...projects, ...articles].sort(
    (a, b) =>
      (a.featuredOrder ?? 100) - (b.featuredOrder ?? 100) ||
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getAllShowcaseProjects(): ContentMeta[] {
  const featuredArticles = getAllArticles().filter((a) => a.featured);
  return [...getAllProjects(), ...featuredArticles].sort(byDateDesc);
}

export function getProjectBySlug(slug: string): ContentMeta {
  return parseMeta(projectsDir, slug, "project");
}

export function getArticleBySlug(slug: string): ContentMeta {
  return parseMeta(articlesDir, slug, "article");
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
