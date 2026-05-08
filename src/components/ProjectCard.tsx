import Link from "next/link";
import type { ContentMeta } from "@/lib/content";

export default function ProjectCard({ project }: { project: ContentMeta }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-lg border border-border bg-surface p-6 transition-all hover:border-accent/40 hover:bg-surface-alt"
    >
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
      <div className="mt-4 flex items-center text-xs text-muted">
        <time dateTime={project.date}>
          {new Date(project.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })}
        </time>
      </div>
    </Link>
  );
}
