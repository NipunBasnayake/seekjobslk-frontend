import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenText, BriefcaseBusiness } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { FeaturedArticleCard } from "@/components/blog/FeaturedArticleCard";
import {
  getAllArticles,
  getArticleCategories,
  getFeaturedArticle,
  getPopularArticleTags,
} from "@/lib/articles";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: "Career Insights Blog",
  description:
    "Practical career advice for Sri Lankan job seekers: interviews, CV writing, LinkedIn, and hiring trends.",
  path: "/blog",
  image: "/opengraph-image",
  imageAlt: "SeekJobsLk Career Insights",
});

export default function BlogPage() {
  const articles = getAllArticles();
  const featuredArticle = getFeaturedArticle();
  const categories = getArticleCategories();
  const tags = getPopularArticleTags(12);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="ui-shell flex w-full flex-col gap-8 py-6 sm:py-8 lg:gap-10 lg:py-10">
        <header className="ui-hero">
          <div className="ui-hero-content">
            <span className="ui-hero-badge">
              <span className="ui-hero-badge-dot" aria-hidden="true" />
              Career Insights by SeekJobsLk
            </span>

            <h1 className="ui-page-title mt-4">Career insights for smarter job decisions</h1>
            <p className="ui-page-intro mt-4 max-w-3xl">
              Read actionable guidance on interviews, CV strategy, LinkedIn positioning, and market
              trends in Sri Lanka. Use these insights alongside live job opportunities on SeekJobsLk.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/#jobs" className="ui-button ui-button-primary">
                <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
                Browse active jobs
              </Link>
              <Link href="/contact" className="ui-button ui-button-secondary">
                Ask our team
              </Link>
            </div>
          </div>
        </header>

        {articles.length === 0 ? (
          <section className="ui-card ui-card-tinted p-8 text-center sm:p-10">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-primary/10 text-primary">
              <BookOpenText className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-xl font-semibold tracking-tight text-card-foreground">
              No articles published yet
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Career insights will appear here soon. Check back later for interview tips and hiring
              trends.
            </p>
          </section>
        ) : (
          <>
            {featuredArticle ? (
              <section aria-labelledby="featured-article-title" className="space-y-4">
                <h2 id="featured-article-title" className="ui-section-title">
                  Featured Article
                </h2>
                <FeaturedArticleCard article={featuredArticle} />
              </section>
            ) : null}

            <section className="ui-card p-5 sm:p-6">
              <h2 className="ui-section-title">Browse by category and topic</h2>

              <div className="mt-4 flex flex-wrap gap-2" aria-label="Article categories">
                {categories.map((category) => (
                  <span key={category} className="ui-pill ui-pill-muted">
                    {category}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2" aria-label="Popular tags">
                {tags.map((tag) => (
                  <span key={tag.tag} className="ui-tag">
                    #{tag.tag} ({tag.count})
                  </span>
                ))}
              </div>
            </section>

            <section aria-labelledby="all-articles-title" className="space-y-4">
              <h2 id="all-articles-title" className="ui-section-title">
                All Articles ({articles.length})
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                {articles.map((article, index) => (
                  <ArticleCard key={article.id} article={article} priority={index < 2} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}