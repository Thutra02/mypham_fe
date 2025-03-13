import { Pagination } from "../../types/pagination.types";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'; // Import icons from Heroicons

const PaginationItem = ({
  length,
  pagination,
  pageSize,
  handlePageSizeChange,
  handlePageChange,
  classNames,
}: {
  length: number;
  pagination: Pagination | null;
  pageSize: number;
  handlePageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handlePageChange: (page: number) => void;
  classNames: (...classes: string[]) => string;
}) => {
  const renderPageNumbers = () => {
    const totalPages = Math.max(1, pagination?.totalPages ?? 1);
    const currentPage = Math.max(1, pagination?.currentPage ?? 1);
    const maxPagesToShow = 5;

    const pages: (number | string)[] = [];

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{length}</span> of{" "}
          <span className="font-medium">{pagination?.totalItems}</span> items
        </p>
        <div className="flex items-center">
          <label htmlFor="pageSize" className="text-sm text-gray-700 mr-2">
            Items per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="rounded-md border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          >
            {[5, 10, 15, 20].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => handlePageChange(Math.max(1, (pagination?.currentPage ?? 1) - 1))}
          disabled={(pagination?.currentPage ?? 1) <= 1}
          className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        {renderPageNumbers().map((page, index) =>
          typeof page === "string" ? (
            <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-700">
              {page}
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={classNames(
                (pagination?.currentPage || 1) === page
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300",
                "px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              )}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => handlePageChange(Math.min((pagination?.currentPage ?? 1) + 1, pagination?.totalPages ?? 1))}
          disabled={(pagination?.currentPage ?? 1) >= (pagination?.totalPages ?? 1)}
          className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default PaginationItem;