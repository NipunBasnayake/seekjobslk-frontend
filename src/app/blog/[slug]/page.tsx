import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ArticleContentRenderer } from "@/components/blog/ArticleContentRenderer";
import { ArticleMeta } from "@/components/blog/ArticleMeta";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { BRAND_LOGO_PATH } from "@/lib/brand";
import { getAllArticles, getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import { buildArticleMetadata, toAbsoluteUrl } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import type { Article } from "@/types/article";

interface BlogArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 3600;
export const dynamicParams = false;

function toArticlePath(slug: string): string {
  return `/blog/${slug}`;
}

export function generateStaticParams() {
  return getAllArticles().map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return buildArticleMetadata({
      title: "Article not found",
      description: "This career insight article could not be found.",
      path: toArticlePath(slug),
      noIndex: true,
    });
  }

  return buildArticleMetadata({
    title: article.seo.metaTitle || article.title,
    description: article.seo.metaDescription || article.excerpt,
    path: toArticlePath(article.slug),
    image: article.coverImage ?? "/opengraph-image",
    imageAlt: article.title,
  });
}

function buildArticleSchema(article: Article) {
  const articleUrl = toAbsoluteUrl(toArticlePath(article.slug));
  const imageUrl = toAbsoluteUrl(article.coverImage ?? "/opengraph-image");

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteUrl(BRAND_LOGO_PATH),
      },
    },
    image: imageUrl,
    mainEntityOfPage: articleUrl,
    articleSection: article.category,
    keywords: article.tags.join(", "),
  };
}

function buildBreadcrumbSchema(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: toAbsoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Career Insights",
        item: toAbsoluteUrl("/blog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: toAbsoluteUrl(toArticlePath(article.slug)),
      },
    ],
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article, 3);
  const articleSchema = buildArticleSchema(article);
  const breadcrumbSchema = buildBreadcrumbSchema(article);

  return (
    <>
      <Navbar />

      <main className="ui-shell ui-shell-reading flex w-full flex-col gap-6 py-6 sm:gap-8 sm:py-8 lg:py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />

        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog" className="hover:text-foreground">
                Career Insights
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground">{article.title}</li>
          </ol>
        </nav>

        <article className="space-y-6">
          <header className="ui-card ui-card-tinted p-6 sm:p-8">
            <p className="ui-label">{article.category}</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-card-foreground sm:text-4xl">
              {article.title}
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{article.excerpt}</p>
            <ArticleMeta article={article} className="mt-4" showUpdatedAt />
          </header>

          {article.coverImage ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border/75">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 70vw"
                priority
              />
            </div>
          ) : null}

          <section className="ui-card p-6 sm:p-8">
            <ArticleContentRenderer blocks={article.content} />
          </section>
        </article>

        <section className="ui-card p-5 sm:p-6" aria-labelledby="article-tags-title">
          <h2 id="article-tags-title" className="ui-section-title">
            Topics in this article
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <li key={tag} className="ui-pill ui-pill-muted">
                #{tag}
              </li>
            ))}
          </ul>
        </section>

        <section className="ui-card ui-card-tinted p-6 sm:p-7" aria-labelledby="jobs-cta-title">
          <h2 id="jobs-cta-title" className="ui-section-title">
            Ready to apply what you learned?
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Explore active roles on SeekJobsLk and use these strategies in your next application.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/#jobs" className="ui-button ui-button-primary">
              <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
              Browse jobs
            </Link>
            <Link href="/blog" className="ui-button ui-button-secondary">
              More insights
            </Link>
          </div>
        </section>

        <RelatedArticles articles={relatedArticles} />

        <div>
          <Link href="/blog" className="ui-button ui-button-ghost text-sm">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to all articles
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}