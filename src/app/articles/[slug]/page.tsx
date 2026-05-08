import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllArticles, getArticleContent } from "@/lib/content";

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const articles = getAllArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const articles = getAllArticles();
  const article = articles.find((a) => a.slug === slug);

  if (!article) notFound();

  const source = getArticleContent(slug);

  return (
    <article>
      <header className="mb-10">
        <p className="font-mono text-sm text-accent">Article</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {article.title}
        </h1>
        <p className="mt-3 text-lg text-muted">{article.description}</p>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted">
          <time dateTime={article.date}>
            {new Date(article.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
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
