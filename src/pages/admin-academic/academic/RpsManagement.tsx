import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../../api/Index";
import { Search, Plus, CornerUpLeft } from "lucide-react";
import { TableRpsManagement } from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes.tsx";
import { Pagination } from "../../../components/admin-academic/Pagination.tsx";
import { getRps, useDeleteRps } from "../../../hooks/academic/useRpsManagement.ts";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear.ts";
import { getProdi } from "../../../hooks/academic/useProdi.ts";
import LoadingSpinner from "../../../components/LoadingSpinner";
import getAcademicPeriods from "../../../hooks/usePeriodeAkademik.ts";

const RpsManagement: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- states management (pindahkan ke atas sebelum hooks lain) ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // --- States for filters ---
  const [selectedTahunKurikulum, setSelectedTahunKurikulum] = useState("");
  const [selectedPeriodeAkademik, setSelectedPeriodeAkademik] = useState("");
  const [selectedProgramStudi, setSelectedProgramStudi] = useState("");
  const [selectedStatusRpsKelas, setSelectedStatusRpsKelas] = useState("");

  // --- Semua hooks harus dipanggil dalam urutan yang sama setiap render ---
  const { data: rpsData = [], isLoading: isRpsLoading, error: rpsError } = getRps();
  const { data: curriculumData = [], isLoading: isCurriculumLoading, error: curriculumError } = getCurriculumYear();
  const { data: prodiData = [], isLoading: isProdiLoading, error: prodiError } = getProdi();
  const { data: periodeAkademikData = [], isLoading: isPeriodeAkademikLoading, error: periodeAkademikError } = getAcademicPeriods();

  // --- Mutation ---
  const deleteMutation = useDeleteRps();

  // --- Conditional rendering setelah semua hooks ---
  if (isRpsLoading || isCurriculumLoading || isProdiLoading || isPeriodeAkademikLoading) {
    return <LoadingSpinner />;
  }

  // --- Error handling ---
  if (rpsError) {
    return <div className="text-red-500">Gagal memuat data RPS</div>;
  }

  if (curriculumError) {
    return <div className="text-red-500">Gagal memuat tahun kurikulum</div>;
  }

  if (prodiError) {
    return <div className="text-red-500">Gagal memuat data program studi</div>;
  }

  if (periodeAkademikError) {
    return <div className="text-red-500">Gagal memuat data periode akademik</div>;
  }

  const getSafeValue = (obj: any, path: string, defaultValue: string = "-") => {
    try {
      const value = path.split(".").reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
      }, obj);
      return value !== null && value !== undefined && value !== "" ? String(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const filteredRpsData = rpsData.filter((rpsItem) => {
    // Filter berdasarkan Tahun Kurikulum
    const matchesTahunKurikulum = selectedTahunKurikulum ? getSafeValue(rpsItem, "tahunKurikulum.id") === selectedTahunKurikulum : true;

    // Filter berdasarkan Periode Akademik
    const matchesPeriodeAkademik = selectedPeriodeAkademik ? getSafeValue(rpsItem, "periodeAkademik.id") === selectedPeriodeAkademik : true;

    // Filter berdasarkan Program Studi
    const matchesProgramStudi = selectedProgramStudi ? getSafeValue(rpsItem, "programStudi.id") === selectedProgramStudi : true;

    // Filter berdasarkan Status RPS Kelas
    const hasClasses = Array.isArray(rpsItem.kelas) && rpsItem.kelas.length > 0;
    const matchesStatusRpsKelas = selectedStatusRpsKelas ? (selectedStatusRpsKelas === "punya-kelas" && hasClasses) || (selectedStatusRpsKelas === "belum-punya-kelas" && !hasClasses) : true;

    return matchesTahunKurikulum && matchesPeriodeAkademik && matchesProgramStudi && matchesStatusRpsKelas;
  });

  // --- Kalkulasi pagination ---
  const totalPages = Math.ceil(filteredRpsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredRpsData.slice(startIndex, startIndex + itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  // --- Event handlers ---
  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAdd = () => {
    // Pass filter values as state to AddRps page
    const queryParams = new URLSearchParams();
    if (selectedTahunKurikulum) queryParams.set("tahunKurikulum", selectedTahunKurikulum);
    if (selectedPeriodeAkademik) queryParams.set("periodeAkademik", selectedPeriodeAkademik);
    if (selectedProgramStudi) queryParams.set("programStudi", selectedProgramStudi);

    navigate(`${AdminAcademicRoute.rpsManagement.addRps}?${queryParams.toString()}`);
  };

  return (
    <MainLayout isGreeting={false} titlePage="Manajemen RPS">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5">
        <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Tahun Kurikulum</label>
            <select value={selectedTahunKurikulum} onChange={(e) => setSelectedTahunKurikulum(e.target.value)} className="flex-1 rounded px-3 py-2 border border-primary-brown w-10">
              <option value="">-- Tahun Kurikulum --</option>
              {curriculumData.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.tahun}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Periode Akademik</label>
            <select value={selectedPeriodeAkademik} onChange={(e) => setSelectedPeriodeAkademik(e.target.value)} className="flex-1 rounded px-3 py-2 border border-primary-brown">
              <option value="">-- Periode --</option>
              {periodeAkademikData.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.namaPeriode}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700 ">Program Studi</label>
            <select value={selectedProgramStudi} onChange={(e) => setSelectedProgramStudi(e.target.value)} className="flex-1 rounded px-3 py-2 border border-primary-brown md:w-18 w-10">
              <option value="">-- Program Studi --</option>
              {prodiData.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.namaProgramStudi}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Status RPS Kelas</label>
            <select value={selectedStatusRpsKelas} onChange={(e) => setSelectedStatusRpsKelas(e.target.value)} className="flex-1 rounded px-3 py-2 border border-primary-brown w-36">
              <option value="">-- Status Kelas --</option>
              <option value="belum-punya-kelas">Rps Belum Memiliki Kelas</option>
              <option value="punya-kelas">Rps Sudah Memiliki Kelas</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex flex-col gap-6 md:flex-row md:gap-0">
          <div className="flex flex-row">
            <input type="search" placeholder="Cari Program Studi" className="px-3 py-1 w-full md:w-72 rounded-l-md border border-black/50" />
            <button className="bg-primary-yellow rounded-r-md w-10 flex items-center justify-center">
              <Search color="white" size={20} />
            </button>
          </div>

          <button onClick={handleAdd} className="bg-primary-green rounded py-2 px-4 text-white ml-auto w-full md:w-36 flex items-center justify-center cursor-pointer">
            <Plus className="mr-2" size={16} />
            <span className="text-center w-full md:w-auto">Tambah</span>
          </button>
        </div>

        {/* Tabel RPS */}
        <div className="mt-4">
          <TableRpsManagement data={paginatedData} error="Data tidak ditemukan." onEdit={(id) => console.log("Edit id:", id)} onDelete={handleDelete} />
        </div>

        {/* Pagination */}
        <Pagination currentPage={currentPage} totalRows={rpsData.length} totalPages={totalPages} onPageChange={setCurrentPage} onRowsPerPageChange={setItemsPerPage} />
      </div>
    </MainLayout>
  );
};

export default RpsManagement;
