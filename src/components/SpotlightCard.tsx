import Link from "next/link";
import type { ContentMeta } from "@/lib/content";

export default function SpotlightCard({
  item,
  featured = false,
}: {
  item: ContentMeta;
  featured?: boolean;
}) {
  const isArticle = item.kind === "article";
  const href = isArticle
    ? `/articles/${item.slug}`
    : item.link ?? `/projects/${item.slug}`;
  const External = isArticle ? false : Boolean(item.link);

  const content = (
    <>
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-xs text-accent">
          {isArticle ? "Article" : "Project"}
        </p>
        {item.status === "live" && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent-light">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Live
          </span>
        )}
      </div>
      <h3 className="mt-3 text-xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-3">
        {item.description}
      </p>
      {item.tags && item.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent-light"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1 text-accent group-hover:text-accent-light transition-colors">
          {External
            ? "Visit site"
            : isArticle
              ? "Read the write-up"
              : "View project"}
          <svg
            className="h-4 w-4"
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
        <time
          dateTime={item.date}
          className="font-mono text-xs text-muted whitespace-nowrap"
        >
          {new Date(item.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })}
        </time>
      </div>
    </>
  );

  const classes = `group block rounded-xl border border-accent/30 bg-gradient-to-br from-accent/10 via-transparent to-transparent p-6 transition-all hover:border-accent/50 hover:from-accent/15 sm:p-8 ${
    featured ? "sm:col-span-2" : ""
  }`;

  if (External) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}