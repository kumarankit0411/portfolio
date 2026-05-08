import type { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Articles",
  description: "Thoughts, tutorials, and experiences in software engineering.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
      <p className="mt-2 text-muted">
        Thoughts, tutorials, and experiences in software engineering.
      </p>
      {articles.length > 0 ? (
        <div className="mt-10">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-sm text-muted">
          No articles yet. Check back soon.
        </p>
      )}
    </div>
  );
}
