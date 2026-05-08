import Link from "next/link";
import type { ContentMeta } from "@/lib/content";

export default function ArticleCard({ article }: { article: ContentMeta }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block border-b border-border py-6 transition-colors hover:border-accent/40"
    >
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-muted line-clamp-2">
          {article.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted">
          <time dateTime={article.date}>
            {new Date(article.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {article.tags && article.tags.length > 0 && (
            <span className="text-accent">{article.tags[0]}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
