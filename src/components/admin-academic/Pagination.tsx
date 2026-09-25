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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 text-sm">
      <div className="text-slate-600 flex flex-wrap items-center gap-3 sm:gap-6">
        <span className="text-xs font-medium bg-slate-100/80 text-slate-700 px-3 py-1 rounded-md border border-slate-200/60">
          Hal <span className="font-semibold text-slate-900">{currentPage}</span> / <span className="font-semibold text-slate-900">{totalPages || 1}</span> ({totalRows} Data)
        </span>

        {/* baris */}
        {onRowsPerPageChange && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Tampilkan</span>
            <select
              className="border border-slate-300 text-xs px-2.5 py-1 rounded-md bg-white font-medium text-slate-700 shadow-xs focus:ring-1 focus:ring-primary-green focus:border-primary-green transition-all"
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

      <div className="flex items-center gap-1">
        <button
          className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          title="Halaman Pertama"
        >
          <ChevronsLeft size={16} className="text-primary-green" />
        </button>

        <button
          className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Halaman Sebelumnya"
        >
          <ChevronLeft size={16} className="text-primary-green" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page < 0 ? (
                <span className="px-1.5 text-slate-400 text-xs">...</span>
              ) : (
                <button
                  className={`min-w-[28px] h-[28px] px-2 rounded-md flex items-center justify-center text-xs transition-all cursor-pointer
                    ${
                      currentPage === page
                        ? "bg-primary-green text-white font-semibold shadow-xs"
                        : "border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium"
                    }`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          title="Halaman Berikutnya"
        >
          <ChevronRight size={16} className="text-primary-green" />
        </button>

        <button
          className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          title="Halaman Terakhir"
        >
          <ChevronsRight size={16} className="text-primary-green" />
        </button>
      </div>
    </div>
  );
};
