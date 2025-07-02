import React, { useState, useMemo, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { TableOBE } from "../../../components/Table";
import { Search } from "lucide-react";
import { Pagination } from "../../../components/admin-academic/Pagination.tsx";
import { getObe } from "../../../hooks/academic/useObeManagement.ts";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear.ts";
import { getProdi } from "../../../hooks/academic/useProdi.ts";
import LoadingSpinner from "../../../components/LoadingSpinner";

const OBEManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [selectedCurriculum, setSelectedCurriculum] = useState("all");
  const [graduateProfileStatuses, setGraduateProfileStatuses] = useState<{ [key: string]: boolean }>({});

  const { data: ObeData = [], isLoading: isObeLoading, error: obeError } = getObe();
  const { data: curriculumData = [], isLoading: isCurriculumLoading, error: curriculumError } = getCurriculumYear();
  const { data: ProgramStudiData = [], isLoading: isProdiLoading, error: prodiError } = getProdi();

  useEffect(() => {
    const savedStatuses = JSON.parse(localStorage.getItem("graduateProfileStatuses") || "{}");
    setGraduateProfileStatuses(savedStatuses);
  }, []);

  useEffect(() => {
    const handleStatusUpdate = (event: CustomEvent) => {
      const { programStudiId, hasData } = event.detail;
      setGraduateProfileStatuses((prev) => {
        const updated = {
          ...prev,
          [programStudiId]: hasData,
        };

        localStorage.setItem("graduateProfileStatuses", JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener("graduateProfileStatusUpdated", handleStatusUpdate as EventListener);

    return () => {
      window.removeEventListener("graduateProfileStatusUpdated", handleStatusUpdate as EventListener);
    };
  }, []);

  // Enhanced filtered data with status information
  const filteredData = useMemo(() => {
    return ObeData.map((item) => ({
      ...item,
      hasGraduateProfile: graduateProfileStatuses[item.id] || false,
      pl: item.statusPl || false,
      cpl: item.statusCpl || false,
      plToCpl: item.statusPlCpl || false,
      cpmk: item.statusCpmk || false,
    }))
      .filter((item) => selectedProdi === "all" || item.programStudi === selectedProdi)
      .filter((item) => selectedCurriculum === "all" || item.tahunKurikulum === selectedCurriculum)
      .filter((item) => item.programStudi.toLowerCase().includes(searchTerm.toLowerCase()) || item.kodeProgramStudi.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [ObeData, selectedProdi, selectedCurriculum, searchTerm, graduateProfileStatuses]);

  const isLoading = isObeLoading || isCurriculumLoading || isProdiLoading;
  const errorMsg = obeError ? "Gagal memuat data Obe" : curriculumError ? "Gagal memuat tahun kurikulum" : prodiError ? "Gagal memuat data program studi" : null;

  if (isLoading) return <LoadingSpinner />;
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleProdiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProdi(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleCurriculumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurriculum(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <MainLayout isGreeting={false} titlePage="Manajemen OBE">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Tahun Kurikulum</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown" value={selectedCurriculum} onChange={handleCurriculumChange}>
              <option value="all">-- Semua --</option>
              {curriculumData.map((curriculum) => (
                <option key={curriculum.id} value={curriculum.tahun}>
                  {curriculum.tahun}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Program Studi</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown md:w-30" value={selectedProdi} onChange={handleProdiChange}>
              <option value="all">-- Semua --</option>
              {ProgramStudiData.map((prodi) => (
                <option key={prodi.id} value={prodi.namaProgramStudi}>
                  {prodi.namaProgramStudi}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Jenjang</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown">
              <option value="all">-- Semua --</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex">
          <input type="search" placeholder="Cari Program Studi" className="px-3 py-1 w-72 rounded-l-md border border-black/50" value={searchTerm} onChange={handleSearchChange} />
          <button className="bg-primary-yellow rounded-r-md w-10 flex items-center justify-center">
            <Search color="white" size={20} />
          </button>
        </div>

        {/* Tabel OBE */}
        <div className="mt-4">
          <TableOBE data={paginatedData} error="Data kosong" />
        </div>

        {/* Pagination info and controls */}
        <Pagination currentPage={currentPage} totalRows={filteredData.length} totalPages={totalPages} onPageChange={setCurrentPage} onRowsPerPageChange={setItemsPerPage} />
      </div>
    </MainLayout>
  );
};

export default OBEManagement;
