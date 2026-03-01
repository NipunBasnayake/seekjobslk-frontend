"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getVisiblePages(currentPage: number, totalPages: number): number[] {
  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
      aria-label="Jobs pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="ui-button ui-button-secondary min-h-10 px-4 text-sm"
        aria-label="Go to previous page"
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={`Go to page ${page}`}
          className={
            page === currentPage
              ? "ui-button ui-button-primary min-h-10 w-10 px-0 text-sm"
              : "ui-button ui-button-secondary min-h-10 w-10 px-0 text-sm"
          }
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="ui-button ui-button-secondary min-h-10 px-4 text-sm"
        aria-label="Go to next page"
      >
        Next
      </button>
    </nav>
  );
}
