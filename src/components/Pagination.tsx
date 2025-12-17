import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const DOTS = "dots";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) => {
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 5;

    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages
    );

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    const range: (number | typeof DOTS)[] = [];

    range.push(1);

    if (showLeftDots) {
      range.push(DOTS);
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPages) {
        range.push(i);
      }
    }

    if (showRightDots) {
      range.push(DOTS);
    }

    if (totalPages !== 1) {
      range.push(totalPages);
    }

    return range;
  }, [currentPage, totalPages, siblingCount]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-1 pt-4 flex-wrap">
      {/* Previous */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-md border px-3 py-1 disabled:opacity-50"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Pages */}
      {paginationRange.map((item, index) => {
        if (item === DOTS) {
          return (
            <span
              key={`dots-${index}`}
              className="px-2 text-muted-foreground"
            >
              …
            </span>
          );
        }

        return (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`rounded-md px-3 py-1 text-sm transition ${
              currentPage === item
                ? "bg-primary text-primary-foreground"
                : "border hover:bg-muted"
            }`}
          >
            {item}
          </button>
        );
      })}

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-md border px-3 py-1 disabled:opacity-50"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination;
