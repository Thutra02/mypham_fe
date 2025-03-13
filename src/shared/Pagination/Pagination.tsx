import { FC } from "react";
import { Pagination as PG } from "../../types/pagination.types";
import twFocusClass from "../../utils/twFocusClass";

export interface PaginationProps {
  pagination?: PG;
  onPageChange: (page: number) => void;
  className?: string;
}
const Pagination: FC<PaginationProps> = ({ pagination, onPageChange, className = "" }) => {
  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const hasProducts = pagination?.totalItems ?? 0 > 0; // Giả sử API trả về totalItems

  const renderPageNumbers = () => {
    const maxPagesToShow = 3;
    const pages = [];

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
      let startPage = Math.max(1, currentPage - halfMaxPagesToShow);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = endPage - maxPagesToShow + 1;
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <nav className={`nc-Pagination flex space-x-1 text-base font-medium ${className}`}>
      <button
        className={`w-11 h-11 flex items-center justify-center rounded-full border ${
          currentPage === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-neutral-100"
        } ${twFocusClass()}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        «
      </button>

      {renderPageNumbers().map((page, index) =>
        typeof page === "string" ? (
          <span
            key={`ellipsis-${index}`}
            className="w-11 h-11 flex items-center justify-center rounded-full border text-gray-500"
          >
            {page}
          </span>
        ) : (
          <button
            key={page}
            className={`w-11 h-11 flex items-center justify-center rounded-full border ${
              page === currentPage ? "bg-primary-6000 text-white" : "hover:bg-neutral-100"
            } ${twFocusClass()}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className={`w-11 h-11 flex items-center justify-center rounded-full border ${
          currentPage === totalPages || !hasProducts
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-neutral-100"
        } ${twFocusClass()}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || !hasProducts}
      >
        »
      </button>
    </nav>
  );
};

export default Pagination;

