import type { JSX } from "react";
import { cn } from "@/lib/cn";
import type { ArticleContentBlock } from "@/types/article";

interface ArticleContentRendererProps {
  blocks: ArticleContentBlock[];
  className?: string;
}

function renderHeading(level: 2 | 3 | 4 | undefined, text: string): JSX.Element {
  if (level === 3) {
    return <h3>{text}</h3>;
  }

  if (level === 4) {
    return <h4>{text}</h4>;
  }

  return <h2>{text}</h2>;
}

export function ArticleContentRenderer({ blocks, className }: ArticleContentRendererProps) {
  return (
    <div className={cn("ui-prose max-w-none", className)}>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        if (block.type === "paragraph") {
          return <p key={key}>{block.text}</p>;
        }

        if (block.type === "heading") {
          return <div key={key}>{renderHeading(block.level, block.text)}</div>;
        }

        if (block.type === "unordered-list") {
          return (
            <ul key={key}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "ordered-list") {
          return (
            <ol key={key}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          );
        }

        return (
          <blockquote key={key}>
            <p>{block.text}</p>
            {block.cite ? (
              <footer className="mt-2 text-xs font-medium uppercase tracking-[0.02em] text-muted-foreground">
                {block.cite}
              </footer>
            ) : null}
          </blockquote>
        );
      })}
    </div>
  );
}