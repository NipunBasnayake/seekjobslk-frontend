import rawArticles from "@/data/articles.json";
import type { Article, ArticleContentBlock } from "@/types/article";

interface ArticleTagCount {
  tag: string;
  count: number;
}

type UnknownRecord = Record<string, unknown>;

const ARTICLE_DATE_FORMATTER = new Intl.DateTimeFormat("en-LK", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const DEFAULT_ARTICLE_CATEGORY = "Career Insights";
const DEFAULT_AUTHOR_NAME = "SeekJobsLk Editorial Team";
const DEFAULT_READING_TIME = "5 min read";

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const unique = new Set<string>();

  for (const item of value) {
    const normalized = toNonEmptyString(item);
    if (normalized) {
      unique.add(normalized);
    }
  }

  return [...unique];
}

function parseDateString(value: unknown): string | null {
  const normalized = toNonEmptyString(value);
  if (!normalized) {
    return null;
  }

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

function toDate(value?: string): Date | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function getDateTimestamp(value?: string): number {
  return toDate(value)?.getTime() ?? 0;
}

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function normalizeArticleSlug(value: string): string {
  return safeDecodeURIComponent(value)
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/\s+/g, "-");
}

function parseContentBlock(value: unknown): ArticleContentBlock | null {
  if (!isRecord(value)) {
    return null;
  }

  const type = toNonEmptyString(value.type);
  if (!type) {
    return null;
  }

  if (type === "paragraph") {
    const text = toNonEmptyString(value.text);
    if (!text) {
      return null;
    }

    return {
      type,
      text,
    };
  }

  if (type === "heading") {
    const text = toNonEmptyString(value.text);
    if (!text) {
      return null;
    }

    const levelValue = typeof value.level === "number" ? value.level : Number(value.level);
    const level = levelValue === 3 || levelValue === 4 ? levelValue : 2;

    return {
      type,
      text,
      level,
    };
  }

  if (type === "unordered-list" || type === "ordered-list") {
    const items = toStringArray(value.items);
    if (!items.length) {
      return null;
    }

    return {
      type,
      items,
    };
  }

  if (type === "quote") {
    const text = toNonEmptyString(value.text);
    if (!text) {
      return null;
    }

    const cite = toNonEmptyString(value.cite) ?? undefined;

    return {
      type,
      text,
      cite,
    };
  }

  return null;
}

function parseArticle(value: unknown, index: number): Article | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = toNonEmptyString(value.id) ?? `article-${index + 1}`;
  const rawSlug = toNonEmptyString(value.slug);
  const title = toNonEmptyString(value.title);
  const excerpt = toNonEmptyString(value.excerpt);
  const publishedAt = parseDateString(value.publishedAt);

  if (!rawSlug || !title || !excerpt || !publishedAt) {
    return null;
  }

  const slug = normalizeArticleSlug(rawSlug);
  if (!slug) {
    return null;
  }

  const contentItems = Array.isArray(value.content)
    ? value.content.map(parseContentBlock).filter((block): block is ArticleContentBlock => block !== null)
    : [];

  if (!contentItems.length) {
    return null;
  }

  const category = toNonEmptyString(value.category) ?? DEFAULT_ARTICLE_CATEGORY;
  const tags = toStringArray(value.tags);
  const author = toNonEmptyString(value.author) ?? DEFAULT_AUTHOR_NAME;
  const updatedAt = parseDateString(value.updatedAt) ?? undefined;
  const readingTime = toNonEmptyString(value.readingTime) ?? DEFAULT_READING_TIME;
  const featured = value.featured === true;
  const coverImage = toNonEmptyString(value.coverImage) ?? undefined;

  const seo = isRecord(value.seo)
    ? {
        metaTitle: toNonEmptyString(value.seo.metaTitle) ?? title,
        metaDescription: toNonEmptyString(value.seo.metaDescription) ?? excerpt,
      }
    : {
        metaTitle: title,
        metaDescription: excerpt,
      };

  return {
    id,
    slug,
    title,
    excerpt,
    category,
    tags,
    author,
    publishedAt,
    updatedAt,
    readingTime,
    featured,
    coverImage,
    seo,
    content: contentItems,
  };
}

function sortArticlesByDateDesc(left: Article, right: Article): number {
  return (
    getDateTimestamp(right.publishedAt) - getDateTimestamp(left.publishedAt) ||
    getDateTimestamp(right.updatedAt) - getDateTimestamp(left.updatedAt)
  );
}

function parseArticles(items: unknown): Article[] {
  if (!Array.isArray(items)) {
    return [];
  }

  const parsed = items
    .map((item, index) => parseArticle(item, index))
    .filter((article): article is Article => article !== null);

  const uniqueBySlug = new Map<string, Article>();
  for (const article of parsed) {
    if (!uniqueBySlug.has(article.slug)) {
      uniqueBySlug.set(article.slug, article);
    }
  }

  return [...uniqueBySlug.values()].sort(sortArticlesByDateDesc);
}

// Single access point for article content. Swap this loader to migrate to Firebase/CMS.
const ARTICLES: Article[] = parseArticles(rawArticles as unknown);
const ARTICLE_BY_SLUG = new Map<string, Article>(
  ARTICLES.map((article) => [normalizeArticleSlug(article.slug), article]),
);

export function formatArticleDate(value: string): string {
  const parsed = toDate(value);

  if (!parsed) {
    return "Recently";
  }

  return ARTICLE_DATE_FORMATTER.format(parsed);
}

export function getAllArticles(): Article[] {
  return [...ARTICLES];
}

export function getArticleBySlug(slug: string): Article | null {
  return ARTICLE_BY_SLUG.get(normalizeArticleSlug(slug)) ?? null;
}

export function getFeaturedArticle(): Article | null {
  return ARTICLES.find((article) => article.featured) ?? ARTICLES[0] ?? null;
}

export function getFeaturedArticles(limit = 3): Article[] {
  if (limit <= 0) {
    return [];
  }

  return ARTICLES.filter((article) => article.featured).slice(0, limit);
}

export function getLatestArticles(limit = 3): Article[] {
  if (limit <= 0) {
    return [];
  }

  return ARTICLES.slice(0, limit);
}

export function getFeaturedOrLatestArticles(limit = 3): Article[] {
  if (limit <= 0) {
    return [];
  }

  const featured = getFeaturedArticles(limit);
  if (featured.length >= limit) {
    return featured;
  }

  const featuredIds = new Set(featured.map((article) => article.id));
  const latest = ARTICLES
    .filter((article) => !featuredIds.has(article.id))
    .slice(0, limit - featured.length);

  return [...featured, ...latest];
}

export function getArticleCategories(): string[] {
  return [...new Set(ARTICLES.map((article) => article.category))];
}

export function getPopularArticleTags(limit = 10): ArticleTagCount[] {
  if (limit <= 0) {
    return [];
  }

  const tagCounter = new Map<string, number>();

  for (const article of ARTICLES) {
    for (const tag of article.tags) {
      const normalizedTag = tag.toLowerCase();
      tagCounter.set(normalizedTag, (tagCounter.get(normalizedTag) ?? 0) + 1);
    }
  }

  return [...tagCounter.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((left, right) => right.count - left.count || left.tag.localeCompare(right.tag))
    .slice(0, limit);
}

function normalizeTag(value: string): string {
  return value.trim().toLowerCase();
}

function getRelatedScore(base: Article, candidate: Article): number {
  let score = 0;

  if (candidate.category === base.category) {
    score += 3;
  }

  const baseTags = new Set(base.tags.map(normalizeTag));
  for (const tag of candidate.tags) {
    if (baseTags.has(normalizeTag(tag))) {
      score += 2;
    }
  }

  const dayDifference =
    Math.abs(getDateTimestamp(candidate.publishedAt) - getDateTimestamp(base.publishedAt)) /
    (1000 * 60 * 60 * 24);

  if (dayDifference <= 120) {
    score += 1;
  }

  return score;
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  if (limit <= 0) {
    return [];
  }

  const scored = ARTICLES
    .filter((candidate) => candidate.id !== article.id)
    .map((candidate) => ({
      article: candidate,
      score: getRelatedScore(article, candidate),
    }))
    .filter((item) => item.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score || sortArticlesByDateDesc(left.article, right.article),
    )
    .slice(0, limit)
    .map((item) => item.article);

  if (scored.length >= limit) {
    return scored;
  }

  const selectedIds = new Set<string>([article.id, ...scored.map((item) => item.id)]);
  const fallback = ARTICLES
    .filter((candidate) => !selectedIds.has(candidate.id))
    .slice(0, limit - scored.length);

  return [...scored, ...fallback];
}

export function getArticleLastModified(article: Article): Date {
  return toDate(article.updatedAt) ?? toDate(article.publishedAt) ?? new Date();
}