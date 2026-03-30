import Link from "next/link";
import { ArticleCard } from "@/components/blog/ArticleCard";
import type { Article } from "@/types/article";

interface RelatedArticlesProps {
  articles: Article[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles.length) {
    return null;
  }

  return (
    <section className="space-y-4" aria-labelledby="related-articles-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="related-articles-title" className="ui-section-title">
          Related Career Insights
        </h2>
        <Link href="/blog" className="text-sm font-medium text-primary hover:underline">
          View all insights
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((relatedArticle) => (
          <ArticleCard key={relatedArticle.id} article={relatedArticle} compact />
        ))}
      </div>
    </section>
  );
}