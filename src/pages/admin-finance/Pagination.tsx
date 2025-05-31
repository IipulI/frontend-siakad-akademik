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
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
  isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  isLoading = false,
}) => {
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const buttonBaseClass =
    "px-3 py-2 border text-sm font-medium transition-all duration-200 min-w-[40px] flex items-center justify-center";
  const activeButtonClass =
    "bg-primary-green text-white border-primary-green shadow-md";
  const inactiveButtonClass =
    "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400";
  const disabledButtonClass =
    "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed";

  // Don't render if no data
  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mt-6 p-4 bg-gray-50 rounded-lg border">
      {/* Items per page selector */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-700 font-medium">Tampilkan:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          disabled={isLoading}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-gray-700">per halaman</span>
      </div>

      {/* Page info */}
      <div className="text-sm text-gray-700 font-medium">
        Menampilkan {startItem.toLocaleString("id-ID")}-
        {endItem.toLocaleString("id-ID")} dari{" "}
        {totalItems.toLocaleString("id-ID")} data
      </div>

      {/* Pagination controls */}
      <div className="flex items-center">
        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || isLoading}
          className={`${buttonBaseClass} rounded-l-md ${
            currentPage === 1 || isLoading
              ? disabledButtonClass
              : inactiveButtonClass
          }`}
          title="Halaman pertama"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Previous page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className={`${buttonBaseClass} border-l-0 ${
            currentPage === 1 || isLoading
              ? disabledButtonClass
              : inactiveButtonClass
          }`}
          title="Halaman sebelumnya"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span
                className={`${buttonBaseClass} border-l-0 ${inactiveButtonClass} cursor-default`}
              >
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                disabled={isLoading}
                className={`${buttonBaseClass} border-l-0 ${
                  currentPage === page
                    ? activeButtonClass
                    : isLoading
                    ? disabledButtonClass
                    : inactiveButtonClass
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className={`${buttonBaseClass} border-l-0 ${
            currentPage === totalPages || isLoading
              ? disabledButtonClass
              : inactiveButtonClass
          }`}
          title="Halaman selanjutnya"
        >
          <ChevronRight size={16} />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || isLoading}
          className={`${buttonBaseClass} border-l-0 rounded-r-md ${
            currentPage === totalPages || isLoading
              ? disabledButtonClass
              : inactiveButtonClass
          }`}
          title="Halaman terakhir"
        >
          <ChevronsRight size={16} />
        </button>
      </div>

      {/* Mobile-friendly page info */}
      <div className="lg:hidden text-xs text-gray-600 text-center">
        Halaman {currentPage} dari {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
