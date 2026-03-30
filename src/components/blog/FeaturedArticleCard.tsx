import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleMeta } from "@/components/blog/ArticleMeta";
import type { Article } from "@/types/article";

interface FeaturedArticleCardProps {
  article: Article;
}

export function FeaturedArticleCard({ article }: FeaturedArticleCardProps) {
  return (
    <article className="ui-card ui-card-elevated overflow-hidden">
      <div className="grid lg:grid-cols-[1.1fr,1fr]">
        <div className="relative min-h-[240px] border-b border-border/70 lg:border-b-0 lg:border-r">
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 52vw"
              priority
            />
          ) : (
            <div className="h-full w-full bg-primary/10" aria-hidden="true" />
          )}
        </div>

        <div className="p-6 sm:p-7">
          <span className="ui-kicker">Featured Insight</span>
          <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-card-foreground sm:text-3xl">
            <Link href={`/blog/${article.slug}`} className="hover:text-primary">
              {article.title}
            </Link>
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{article.excerpt}</p>
          <ArticleMeta article={article} className="mt-4" />

          {article.tags.length ? (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Featured article tags">
              {article.tags.slice(0, 5).map((tag) => (
                <li key={tag} className="ui-pill ui-pill-muted">
                  #{tag}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-6">
            <Link href={`/blog/${article.slug}`} className="ui-button ui-button-primary">
              Read featured article
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}