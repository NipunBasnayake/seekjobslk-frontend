import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Briefcase, CheckCircle2 } from "lucide-react";

interface JobContentProps {
    description?: string;
    requirements?: string[] | string;
}

const markdownClass = `
  prose
  dark:prose-invert
  max-w-none

  prose-headings:font-semibold
  prose-headings:text-foreground

  prose-h1:text-2xl
  prose-h2:text-xl
  prose-h3:text-lg

  prose-p:text-muted-foreground
  prose-li:text-muted-foreground

  prose-strong:text-foreground
  prose-em:text-foreground

  prose-ul:list-disc
  prose-ol:list-decimal
  prose-li:marker:text-primary

  prose-hr:my-6
`;

const JobContent: React.FC<JobContentProps> = ({
    description,
    requirements,
}) => {
    const normalizedRequirements = useMemo(() => {
        if (!requirements) return "";

        if (Array.isArray(requirements)) {
            // Convert array → markdown list
            return requirements.filter(Boolean).map(r => `- ${r}`).join("\n");
        }

        return requirements;
    }, [requirements]);

    const hasDescription = Boolean(description?.trim());
    const hasRequirements = Boolean(normalizedRequirements.trim());

    if (!hasDescription && !hasRequirements) return null;

    return (
        <>
            {/* ================= Job Description ================= */}
            {hasDescription && (
                <section className="rounded-xl border bg-card p-6">
                    <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                        <Briefcase className="w-5 h-5 text-primary" />
                        Job Description
                    </h2>

                    <div className={markdownClass}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {description!}
                        </ReactMarkdown>
                    </div>
                </section>
            )}

            {/* ================= Requirements ================= */}
            {hasRequirements && (
                <section className="rounded-xl border bg-card p-6">
                    <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        Requirements
                    </h2>

                    <div className={markdownClass}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {normalizedRequirements}
                        </ReactMarkdown>
                    </div>
                </section>
            )}
        </>
    );
};

export default JobContent;
