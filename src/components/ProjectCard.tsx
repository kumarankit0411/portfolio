import Link from "next/link";
import type { ContentMeta } from "@/lib/content";

const statusStyles: Record<string, string> = {
  live: "border-accent/40 bg-accent/10 text-accent-light",
  "in-progress": "border-amber-400/40 bg-amber-400/10 text-amber-300",
  done: "border-border bg-surface text-muted",
};

const statusLabels: Record<string, string> = {
  live: "Live",
  "in-progress": "In progress",
  done: "Shipped",
};

export default function ProjectCard({ project }: { project: ContentMeta }) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors truncate">
            {project.title}
          </h3>
          <p className="mt-2 text-sm text-muted line-clamp-2">
            {project.description}
          </p>
        </div>
      </div>
      {project.tags && project.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
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
      <div className="mt-4 flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-3">
          {project.status && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[project.status]}`}
            >
              {project.status === "live" && (
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              )}
              {statusLabels[project.status]}
            </span>
          )}
          <time dateTime={project.date}>
            {new Date(project.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </time>
        </div>
        {project.link && (
          <span className="inline-flex items-center gap-1 text-accent group-hover:text-accent-light transition-colors">
            Visit
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </span>
        )}
      </div>
    </>
  );

  if (project.link) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-lg border border-border bg-surface p-6 transition-all hover:border-accent/40 hover:bg-surface-alt"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={
        project.kind === "article"
          ? `/articles/${project.slug}`
          : `/projects/${project.slug}`
      }
      className="group block rounded-lg border border-border bg-surface p-6 transition-all hover:border-accent/40 hover:bg-surface-alt"
    >
      {content}
    </Link>
  );
}