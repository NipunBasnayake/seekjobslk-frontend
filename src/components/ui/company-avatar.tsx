"use client";

import { useMemo } from "react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { cn } from "@/lib/cn";

interface CompanyAvatarProps {
  name?: string;
  logoUrl?: string | null;
  size?: number;
  className?: string;
}

function getInitials(name?: string): string {
  if (!name) return "SJ";

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) return "SJ";

  return parts.map((part) => part.charAt(0).toUpperCase()).join("");
}

export function CompanyAvatar({
  name,
  logoUrl,
  size = 44,
  className,
}: CompanyAvatarProps) {
  const initials = useMemo(() => getInitials(name), [name]);

  return (
    <div
      className={cn("shrink-0 rounded-[14px]", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <OptimizedImage
        src={logoUrl ?? undefined}
        alt={`${name || "Company"} logo`}
        width={size}
        height={size}
        showSkeleton
        containerClassName="h-full w-full rounded-[14px] border border-border bg-background"
        className="h-full w-full rounded-[14px]"
        fallbackContent={
          <div className="grid h-full w-full place-items-center rounded-[14px] border border-border bg-primary/10 text-sm font-semibold text-primary">
            {initials}
          </div>
        }
      />
    </div>
  );
}