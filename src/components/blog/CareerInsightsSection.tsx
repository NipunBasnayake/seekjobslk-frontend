import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleMeta } from "@/components/blog/ArticleMeta";
import type { Article } from "@/types/article";

interface CareerInsightsSectionProps {
  articles: Article[];
}

export function CareerInsightsSection({ articles }: CareerInsightsSectionProps) {
  if (!articles.length) {
    return null;
  }

  return (
    <section className="ui-card p-5 sm:p-6" aria-labelledby="career-insights-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="ui-label">Career Insights</p>
          <h2 id="career-insights-title" className="ui-section-title mt-2">
            Learn faster and apply smarter
          </h2>
          <p className="ui-section-subtitle mt-2 max-w-2xl">
            Practical articles for job seekers in Sri Lanka, including interviews, CVs, and
            in-demand skills.
          </p>
        </div>

        <Link href="/blog" className="ui-button ui-button-secondary">
          View all insights
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {articles.map((article) => (
          <article key={article.id} className="ui-list-item group">
            <p className="ui-label">{article.category}</p>
            <h3 className="mt-2 text-base font-semibold leading-snug text-card-foreground">
              <Link href={`/blog/${article.slug}`} className="hover:text-primary">
                {article.title}
              </Link>
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{article.excerpt}</p>
            <ArticleMeta article={article} className="mt-3" />
          </article>
        ))}
      </div>
    </section>
  );
}