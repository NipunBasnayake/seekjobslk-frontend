import { CalendarDays, Clock3, UserRound } from "lucide-react";
import { formatArticleDate } from "@/lib/articles";
import { cn } from "@/lib/cn";
import type { Article } from "@/types/article";

type ArticleMetaFields = Pick<Article, "author" | "publishedAt" | "updatedAt" | "readingTime">;

interface ArticleMetaProps {
  article: ArticleMetaFields;
  className?: string;
  showUpdatedAt?: boolean;
}

export function ArticleMeta({
  article,
  className,
  showUpdatedAt = false,
}: ArticleMetaProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground", className)}>
      <span className="inline-flex items-center gap-1.5">
        <UserRound className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        {article.author}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        {formatArticleDate(article.publishedAt)}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock3 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        {article.readingTime}
      </span>
      {showUpdatedAt && article.updatedAt ? (
        <span className="inline-flex items-center gap-1.5">
          Updated {formatArticleDate(article.updatedAt)}
        </span>
      ) : null}
    </div>
  );
}