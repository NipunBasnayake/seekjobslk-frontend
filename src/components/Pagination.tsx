"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  currentItemCount?: number;
  onPageChange: (page: number) => void;
}

type PaginationItem = number | "start-ellipsis" | "end-ellipsis";

function buildPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const corePages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  const sortedPages = Array.from(corePages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const items: PaginationItem[] = [];

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];

    if (typeof previousPage === "number" && page - previousPage > 1) {
      if (page - previousPage === 2) {
        items.push(previousPage + 1);
      } else {
        items.push(index < sortedPages.length - 1 ? "start-ellipsis" : "end-ellipsis");
      }
    }

    items.push(page);
  });

  return items;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems = 0,
  pageSize = 0,
  currentItemCount = 0,
  onPageChange,
}: PaginationProps) {
  const safeTotalPages = Math.max(0, totalPages);

  if (safeTotalPages === 0) {
    return null;
  }

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), safeTotalPages);
  const items = buildPaginationItems(safeCurrentPage, safeTotalPages);
  const showControls = safeTotalPages > 1;

  // There is no UI test harness in this repo yet, so the range text is derived from
  // the same filtered length and page size that drive slicing on the Home page.
  const hasRangeData = totalItems > 0 && pageSize > 0;
  const rangeStart = hasRangeData ? (safeCurrentPage - 1) * pageSize + 1 : 0;
  const fallbackItemCount = hasRangeData
    ? Math.min(pageSize, Math.max(totalItems - (safeCurrentPage - 1) * pageSize, 0))
    : 0;
  const resolvedItemCount = currentItemCount || fallbackItemCount;
  const rangeEnd = hasRangeData ? Math.min(totalItems, rangeStart + resolvedItemCount - 1) : 0;

  return (
    <nav className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" aria-label="Jobs pagination">
      <p className="text-sm text-muted-foreground">
        {hasRangeData
          ? `Showing ${rangeStart}\u2013${rangeEnd} of ${totalItems}`
          : `Page ${safeCurrentPage} of ${safeTotalPages}`}
      </p>

      {showControls ? (
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => onPageChange(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
            className="ui-button ui-button-secondary min-h-10 px-4 text-sm"
            aria-label="Go to previous page"
          >
            Previous
          </button>

          {items.map((item, index) =>
            typeof item === "number" ? (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={item === safeCurrentPage ? "page" : undefined}
                aria-label={`Go to page ${item}`}
                className={
                  item === safeCurrentPage
                    ? "ui-button ui-button-primary min-h-10 w-10 px-0 text-sm"
                    : "ui-button ui-button-secondary min-h-10 w-10 px-0 text-sm"
                }
              >
                {item}
              </button>
            ) : (
              <span
                key={`${item}-${index}`}
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-[14px] px-2 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                ...
              </span>
            ),
          )}

          <button
            type="button"
            onClick={() => onPageChange(safeCurrentPage + 1)}
            disabled={safeCurrentPage === safeTotalPages}
            className="ui-button ui-button-secondary min-h-10 px-4 text-sm"
            aria-label="Go to next page"
          >
            Next
          </button>
        </div>
      ) : null}
    </nav>
  );
}
