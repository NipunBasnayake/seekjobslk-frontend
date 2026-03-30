export type ArticleBlockType =
  | "paragraph"
  | "heading"
  | "unordered-list"
  | "ordered-list"
  | "quote";

export interface ArticleSeo {
  metaTitle: string;
  metaDescription: string;
}

export interface ArticleParagraphBlock {
  type: "paragraph";
  text: string;
}

export interface ArticleHeadingBlock {
  type: "heading";
  text: string;
  level?: 2 | 3 | 4;
}

export interface ArticleUnorderedListBlock {
  type: "unordered-list";
  items: string[];
}

export interface ArticleOrderedListBlock {
  type: "ordered-list";
  items: string[];
}

export interface ArticleQuoteBlock {
  type: "quote";
  text: string;
  cite?: string;
}

export type ArticleContentBlock =
  | ArticleParagraphBlock
  | ArticleHeadingBlock
  | ArticleUnorderedListBlock
  | ArticleOrderedListBlock
  | ArticleQuoteBlock;

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  featured: boolean;
  coverImage?: string;
  seo: ArticleSeo;
  content: ArticleContentBlock[];
}