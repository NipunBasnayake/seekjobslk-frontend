"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { socialIconRegistry, type SocialIconName } from "@/lib/socialIcons";

interface SocialIconProps {
  name: SocialIconName;
  href?: string;
  label?: string;
  size?: number;
  className?: string;
  iconClassName?: string;
}

export function SocialIcon({
  name,
  href,
  label,
  size = 18,
  className,
  iconClassName,
}: SocialIconProps) {
  const [failed, setFailed] = useState(false);
  const config = socialIconRegistry[name];
  const accessibleLabel = label ?? config.label;

  const iconContent = failed ? (
    <span
      className="text-[11px] font-semibold uppercase"
      style={{ color: '#2DA5BC' }}
    >
      {accessibleLabel.slice(0, 2)}
    </span>
  ) : (
    <Image
      src={config.src}
      alt=""
      width={size}
      height={size}
      className={cn(
        "h-4.5 w-4.5 object-contain",
        iconClassName
      )}
      style={{ filter: 'invert(51%) sepia(99%) saturate(322%) hue-rotate(148deg) brightness(97%) contrast(92%)' }}
      onError={() => setFailed(true)}
      aria-hidden="true"
    />
  );

  const shellClassName = cn(
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-card-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary",
    className,
  );

  if (!href) {
    return (
      <span className={shellClassName} aria-label={accessibleLabel} role="img">
        {iconContent}
      </span>
    );
  }

  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={accessibleLabel}
        title={accessibleLabel}
        className={shellClassName}
      >
        {iconContent}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={accessibleLabel} title={accessibleLabel} className={shellClassName}>
      {iconContent}
    </Link>
  );
}
