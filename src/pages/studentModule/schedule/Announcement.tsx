import React, { useState, useEffect, useMemo } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { TableAnnouncement } from "../../../components/Table"; // Adjusted import path
import { ArrowLeft, RefreshCw, Search } from "lucide-react";
import { usePengumumanMahasiswa } from "../../../hooks/usePengumuman";
import { IPengumuman } from "../../../types/common.types";
import getAnnouncements from "../../../hooks/useMahasiswa";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function Announcement() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: announcements,
    isLoading: isLoadingAnnouncements,
    isError: isErrorAnnouncements,
  } = getAnnouncements();

  if (isLoadingAnnouncements) {
    return <LoadingSpinner />;
  }

  console.log("Pengumuman data", announcements);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const ITEMS_PER_PAGE = 10;

  // Debouncing effect for search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedKeyword(searchTerm);
      if (currentPage !== 1) {
        setCurrentPage(1); // Reset to page 1 on new search
      }
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = usePengumumanMahasiswa({
    page: currentPage,
    size: ITEMS_PER_PAGE,
    sort: "createdAt,desc",
    keyword: debouncedKeyword,
  });

  // The headers for the table, matching the data fields
  const tableHead = ["Tanggal", "Judul", "Penulis", "Aksi"];

  // Memoize the data to prevent unnecessary re-renders of the table
  const announcements = useMemo(() => response?.data || [], [response]);
  const pagination = useMemo(() => response?.pagination, [response]);

  return (
      <MainLayout isGreeting={false} titlePage={"Pengumuman"} className={""}>
        <div className="w-full bg-white min-h-screen py-2 rounded-sm border-t-2 border-primary-yellow">
          <div className="px-2 gap-3 lg:gap-16 border-2 p-2 grid grid-cols-1 lg:grid-cols-3">
            <select className="rounded px-3 text-primary-brown border-primary-brown border p-1">
              <option value={"semua"}>-Semua-</option>
            </select>
            <div className="flex">
              <input
                  type="search"
                  placeholder="Cari Pengumuman"
                  className="px-2 py-1 w-full md:w-70 rounded shadow-md border border-black/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                  onClick={() => refetch()}
                  className="bg-primary-blueDark rounded-r-md w-10 flex items-center justify-center"
                  title="Refresh Data"
              >
                <RefreshCw color="white" size={20} />
              </button>
            </div>
          </div>

          <TableAnnouncement
              tableHead={tableHead}
              data={announcements}
              isLoading={isLoading}
              isError={isError}
              error={error?.message || "Gagal memuat data."}
          />

          {/* Pagination Controls */}
          <div className="flex justify-center items-center p-4 space-x-4">
            <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
            Page {pagination?.currentPage} of {pagination?.totalPages}
          </span>
            <button
                onClick={() =>
                    setCurrentPage((prev) =>
                        Math.min(prev + 1, pagination?.totalPages || 1)
                    )
                }
                disabled={currentPage === pagination?.totalPages || isLoading}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          )}
        </div>
        {id ? (
          <DetailAnnouncement data={dataDetail} />
        ) : (
          <TableAnnouncement
            tableHead={tableHead}
            data={announcements}
            error={"error"}
            setId={setId}
          />
        )}
      </div>
    </MainLayout>
  );
}
