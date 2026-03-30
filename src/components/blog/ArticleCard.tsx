import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleMeta } from "@/components/blog/ArticleMeta";
import { cn } from "@/lib/cn";
import type { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
  priority?: boolean;
  compact?: boolean;
  className?: string;
}

export function ArticleCard({
  article,
  priority = false,
  compact = false,
  className,
}: ArticleCardProps) {
  if (compact) {
    return (
      <article className={cn("ui-list-item group", className)}>
        <p className="ui-label">{article.category}</p>
        <h3 className="mt-2 text-base font-semibold leading-snug text-card-foreground">
          <Link href={`/blog/${article.slug}`} className="hover:text-primary">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{article.excerpt}</p>
        <ArticleMeta article={article} className="mt-3" />
      </article>
    );
  }

  return (
    <article className={cn("ui-card ui-card-hover overflow-hidden", className)}>
      {article.coverImage ? (
        <div className="relative aspect-[16/9] border-b border-border/70">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={priority}
          />
        </div>
      ) : null}

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="ui-pill">{article.category}</span>
          {article.featured ? <span className="ui-pill ui-pill-muted">Featured</span> : null}
        </div>

        <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-card-foreground">
          <Link href={`/blog/${article.slug}`} className="hover:text-primary">
            {article.title}
          </Link>
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">{article.excerpt}</p>

        <ArticleMeta article={article} className="mt-4" />

        {article.tags.length ? (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Article tags">
            {article.tags.slice(0, 4).map((tag) => (
              <li key={tag} className="ui-pill ui-pill-muted">
                #{tag}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-5">
          <Link href={`/blog/${article.slug}`} className="ui-button ui-button-secondary text-sm">
            Read article
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}