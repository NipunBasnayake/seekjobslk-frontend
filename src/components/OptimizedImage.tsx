"use client";

import Image, { type ImageProps } from "next/image";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";

interface OptimizedImageProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  showSkeleton?: boolean;
  containerClassName?: string;
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = "/globe.svg",
  showSkeleton = false,
  className,
  containerClassName,
  onError,
  onLoad,
  ...imageProps
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const resolvedSrc = useMemo(() => {
    if (!src || hasError) {
      return fallbackSrc;
    }

    return src;
  }, [fallbackSrc, hasError, src]);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {showSkeleton && !loaded ? (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      ) : null}
      <Image
        {...imageProps}
        src={resolvedSrc}
        alt={alt}
        className={cn(
          "object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
        onError={(event) => {
          setHasError(true);
          onError?.(event);
        }}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
      />
    </div>
  );
}
