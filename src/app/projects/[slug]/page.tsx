import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllProjects, getProjectContent } from "@/lib/content";

export async function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const projects = getAllProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const projects = getAllProjects();
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  const source = getProjectContent(slug);

  return (
    <article>
      <header className="mb-10">
        <p className="font-mono text-sm text-accent">Project</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {project.title}
        </h1>
        <p className="mt-3 text-lg text-muted">{project.description}</p>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted">
          <time dateTime={project.date}>
            {new Date(project.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </time>
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent-light"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>
      <div className="prose">
        <MDXRemote source={source} />
      </div>
    </article>
  );
}
