import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rowsPerPage?: number;
  totalRows?: number;
  onRowsPerPageChange?: (rows: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage = 10,
  totalRows = 0,
  onRowsPerPageChange,
}) => {
  // Calculate page numbers to display
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // If total pages is less than max to show, display all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);

      // Calculate start and end of page range
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust in case we're at the beginning or end
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push(-1); // -1 indicates ellipsis
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push(-2); // -2 indicates ellipsis
      }

      // Always include last page
      if (totalPages !== 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-end gap-2 lg:items-center justify-between mt-4 text-sm">
      <div className="text-gray-600 flex gap-0 items-center lg:gap-20">
        <span className="text-xs border-l-7 px-2 border-blue-100 p-1">
          Hal {currentPage}/{totalPages} ({totalRows} Data)
        </span>

        {/* baris */}
        {onRowsPerPageChange && (
          <div className="flex items-center">
            <select
              className="border text-xs px-3 py-0.5"
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            >
              <option value={10}>10 Baris</option>
              <option value={25}>25 Baris</option>
              <option value={50}>50 Baris</option>
              <option value={100}>100 Baris</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center">
        <div className="flex items-center">
          <button
            className="border p-1 disabled:bg-gray-200 "
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft size={16} color="#116e63" />
          </button>

          <button
            className="border p-1 disabled:bg-gray-200"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} color="#116e63" />
          </button>

          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page < 0 ? (
                <span className="px-2">...</span>
              ) : (
                <button
                  className={`p-1 px-2 flex items-center justify-center text-xs 
                    ${
                      currentPage === page
                        ? "bg-primary-green text-white"
                        : "border hover:bg-gray-100"
                    }`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          <button
            className="border p-1 disabled:bg-gray-200"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} color="#116e63" />
          </button>

          <button
            className="border p-1 disabled:bg-gray-200"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight size={16} color="#116e63" />
          </button>
        </div>
      </div>
    </div>
  );
};
