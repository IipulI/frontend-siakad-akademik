import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage,
  rowsPerPageOptions = [10, 25, 50],
  loadTime,
  infoComponent = null,
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row justify-between mt-4 border-t-3 pt-2 border-gray-400 space-x-5 lg:space-x-30">
      <div className="border-l-4 border-primary-yellow pl-1">
        <span className="text-xs xl:text-sm text-gray-600">
          {infoComponent ||
            `Hal ${currentPage}/${totalPages} (${totalItems} data, ${loadTime} detik)`}
        </span>
      </div>
      <div className="flex items-center text-sm xl:text-base flex-1 justify-between">
        <div className="relative w-32 mr-4">
          <select
            className="w-full p-1.5 border border-gray-300 rounded-md bg-white pr-8 text-gray-500"
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option} Baris
              </option>
            ))}
          </select>
        </div>
        <div className="flex">
          <button
            className="p-1.5 border border-gray-300 rounded-l bg-gray-200"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            {/* <FaAnglesLeft color={currentPage === 1 ? "gray" : "black"} /> */}
          </button>
          <button
            className="p-1.5 border-t border-b border-gray-300 bg-gray-200"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft color={currentPage === 1 ? "gray" : "black"} />
          </button>
          <button className="p-1.5 border px-3 border-gray-300 bg-primary-green text-white">
            {currentPage}
          </button>
          <button
            className="p-1.5 border-t border-b border-r border-gray-300 bg-gray-200 rounded-r"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight
              color={currentPage === totalPages ? "gray" : "black"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
