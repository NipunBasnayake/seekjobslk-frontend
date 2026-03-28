"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/cn";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Renders Markdown content with brand-styled prose.
 * Uses the ui-prose class from globals.css for consistent styling
 * including #31B0C7 colored list markers and premium typography.
 */
export function MarkdownContent({ content, className }: MarkdownContentProps) {
  if (!content || content.trim().length === 0) {
    return null;
  }

  return (
    <div className={cn("ui-prose", className)}>
      <ReactMarkdown
        components={{
          // Headings with proper semantic markup
          h1: ({ node, ...props }) => (
            <h1 className="font-semibold !mb-3 !mt-6 text-2xl" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="font-semibold !mb-2 !mt-5 text-xl" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="font-semibold !mb-2 !mt-4 text-lg" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="font-semibold !mb-2 !mt-3 text-base" {...props} />
          ),
          h5: ({ children, ...props }) => (
            <h5 {...props}>{children}</h5>
          ),
          h6: ({ children, ...props }) => (
            <h6 {...props}>{children}</h6>
          ),

          // Paragraphs
          p: ({ children, ...props }) => (
            <p {...props}>{children}</p>
          ),

          // Strong and emphasis
          strong: ({ node, ...props }) => (
            <strong className="font-semibold" {...props} />
          ),
          b: ({ node, ...props }) => (
            <b className="font-semibold" {...props} />
          ),

          // Lists - CSS handles the brand-colored bullets
          ul: ({ children, ...props }) => (
            <ul {...props}>{children}</ul>
          ),
          ol: ({ children, ...props }) => (
            <ol {...props}>{children}</ol>
          ),
          li: ({ children, ...props }) => (
            <li {...props}>{children}</li>
          ),

          // Links with safe external handling
          a: ({ href, children, ...props }) => {
            const isExternal = href?.startsWith("http://") || href?.startsWith("https://");
            return (
              <a
                href={href}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                {...props}
              >
                {children}
              </a>
            );
          },

          // Code blocks
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return <code {...props}>{children}</code>;
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children, ...props }) => (
            <pre {...props}>{children}</pre>
          ),

          // Blockquotes
          blockquote: ({ children, ...props }) => (
            <blockquote {...props}>{children}</blockquote>
          ),

          // Horizontal rules
          hr: (props) => <hr {...props} />,

          // Images with lazy loading
          img: ({ src, alt, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt || ""}
              loading="lazy"
              {...props}
            />
          ),

          // Tables
          table: ({ children, ...props }) => (
            <table {...props}>{children}</table>
          ),
          thead: ({ children, ...props }) => (
            <thead {...props}>{children}</thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody {...props}>{children}</tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr {...props}>{children}</tr>
          ),
          th: ({ children, ...props }) => (
            <th {...props}>{children}</th>
          ),
          td: ({ children, ...props }) => (
            <td {...props}>{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/**
 * A variant of MarkdownContent for job descriptions with optimized styling.
 * Removes top margin from first element for better card integration.
 */
export function JobDescriptionMarkdown({
  content,
  className,
}: MarkdownContentProps) {
  return (
    <MarkdownContent
      content={content}
      className={cn("max-w-none", className)}
    />
  );
}
