"use client";

import React, { useState, useEffect } from "react";

interface OptimizedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  lazy?: boolean;
  skeleton?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  placeholderColor?: string; // tailwind class, e.g. "bg-gray-200"
}

export const OptimizedImage = React.forwardRef<HTMLImageElement, OptimizedImageProps>(
  (
    {
      src,
      alt,
      lazy = true,
      skeleton = true,
      onLoad,
      onError,
      placeholderColor = "bg-gray-200",
      className = "",
      width,
      height,
      ...props
    },
    ref
  ) => {
    const [isLoaded, setIsLoaded] = useState(!skeleton);
    const [imageSrc, setImageSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      setImageSrc(src);
      setHasError(false);
      setIsLoaded(!skeleton);
    }, [src, skeleton]);

    const handleLoad = () => {
      setIsLoaded(true);
      onLoad?.();
    };

    const handleError = () => {
      setHasError(true);
      onError?.();
    };

    return (
      <div className="relative overflow-hidden" style={{ width, height }}>
        {!isLoaded && skeleton && !hasError && (
          <div
            className={`absolute inset-0 animate-pulse ${placeholderColor}`}
            aria-hidden="true"
          />
        )}

        <img
          ref={ref}
          src={imageSrc}
          alt={alt}
          loading={lazy ? "lazy" : "eager"}
          decoding="async"
          className={`transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${className}`}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />

        {hasError && (
          <div
            className={`absolute inset-0 ${placeholderColor} flex items-center justify-center`}
          >
            <span className="text-xs text-gray-500">Image not available</span>
          </div>
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";
export default OptimizedImage;
