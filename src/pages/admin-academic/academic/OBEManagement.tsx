// src/pages/admin-academic/academic/OBEManagement.tsx
import React, { useState, useMemo, useEffect } from 'react';
import MainLayout from "../../../components/layouts/MainLayout";
import { getObe, getObeMataKuliah, getKelompokMataKuliah } from '../../../hooks/academic/useObeManagement';
import { getProdi } from "../../../hooks/academic/useProdi";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { RefreshCw, Search, Plus, Trash2, Link2, Eye } from 'lucide-react';
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useNavigate } from 'react-router-dom';
import { AdminAcademicRoute } from '../../../types/VarRoutes';

// ── Main Component ────────────────────────────────────────────────────────────
export const OBEManagement: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [selectedCurriculum, setSelectedCurriculum] = useState("all");
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [selectedJenis, setSelectedJenis] = useState("all");
  const [selectedKelompok, setSelectedKelompok] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [tempSearch, setTempSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Queries
  const { data: prodiData = [], isLoading: isProdiLoading } = getProdi();
  const { data: curriculumData = [], isLoading: isCurriculumLoading } = getCurriculumYear();
  const { data: obeResponse, isLoading: isObeLoading } = getObe({ page: 1, limit: 1000 });
  const { data: kelompokMataKuliahResult } = getKelompokMataKuliah();
  const kelompokMataKuliahData = kelompokMataKuliahResult?.items || [];

  const courseFilters = useMemo(() => ({
    page: currentPage,
    limit: itemsPerPage,
    prodiId: selectedProdi === "all" ? undefined : selectedProdi,
    tahunKurikulumId: selectedCurriculum === "all" ? undefined : selectedCurriculum,
    kelompokMataKuliahId: selectedKelompok === "all" ? undefined : selectedKelompok,
    search: searchTerm || undefined,
  }), [currentPage, itemsPerPage, selectedProdi, selectedCurriculum, selectedKelompok, searchTerm]);

  const {
    data: coursesResponse,
    isLoading: isCoursesLoading,
    error: coursesError,
    refetch: refetchCourses,
  } = getObeMataKuliah(courseFilters);

  // Helpers
  const handleCurriculumChange = (e: React.ChangeEvent<HTMLSelectElement>) => { setSelectedCurriculum(e.target.value); setCurrentPage(1); };
  const handleProdiChange = (e: React.ChangeEvent<HTMLSelectElement>) => { setSelectedProdi(e.target.value); setCurrentPage(1); };
  const handleJenisChange = (e: React.ChangeEvent<HTMLSelectElement>) => { setSelectedJenis(e.target.value); setCurrentPage(1); };
  const handleSearchSubmit = (e: React.FormEvent) => { e.preventDefault(); setSearchTerm(tempSearch); setCurrentPage(1); };
  const handleRefresh = () => {
    setTempSearch(""); setSearchTerm(""); setSelectedCurriculum("all");
    setSelectedProdi("all"); setSelectedJenis("all"); setSelectedKelompok("all");
    setCurrentPage(1); refetchCourses();
  };

  const cleanProdiName = (name: string) => {
    if (!name) return "";
    // Only strip s1/d3 to keep s2/s3 distinct and prevent collisions
    return name.toLowerCase().replace(/^(s1|d3)\s*[-–]*\s*/, '').replace(/[^a-z0-9]/g, '');
  };

  // ── OBE Lookup: map by (namaProdi + tahunKurikulum) → obeId ──
  const obeLookupByProdiAndYear = useMemo(() => {
    const byProdiName = new Map<string, string>(); // cleanName|year  → obeId

    // ResponseBuilder formats paginated array inside data.data or data
    const rawObe: any[] = Array.isArray(obeResponse?.data?.data)
      ? obeResponse.data.data
      : Array.isArray(obeResponse?.data)
        ? obeResponse.data
        : [];

    rawObe.forEach((item: any) => {
      if (!item.id) return; // skip if no OBE ID
      const year = item.tahunKurikulum; // e.g. "2025"

      if (item.programStudi && year) {
        const clean = cleanProdiName(item.programStudi);
        byProdiName.set(`${clean}|${year}`, item.id);
      }
    });

    return { byProdiName };
  }, [obeResponse]);

  const resolveObeId = (course: any): string | undefined => {
    const year = course.kurikulum;
    if (course.prodiPengampu && year) {
      const clean = cleanProdiName(course.prodiPengampu);
      return obeLookupByProdiAndYear.byProdiName.get(`${clean}|${year}`);
    }
    return undefined;
  };

  // Course data
  const rawData = coursesResponse?.data?.rows
    || coursesResponse?.data?.data?.rows
    || (Array.isArray(coursesResponse?.data) ? coursesResponse.data : [])
    || [];
  const allCourses: any[] = Array.isArray(rawData) ? rawData : [];

  const totalRowsBackend =
    coursesResponse?.data?.count
    || coursesResponse?.data?.data?.count
    || allCourses.length || 0;

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course: any) => {
      if (selectedJenis !== "all" && course.jenisMk !== selectedJenis) return false;
      return true;
    });
  }, [allCourses, selectedJenis]);

  const isLoading = isProdiLoading || isCurriculumLoading || isObeLoading || isCoursesLoading;

  return (
    <MainLayout isGreeting={false} titlePage="Mata Kuliah">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Daftar Mata Kuliah / Blok / Departemen</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-yellow shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-700 w-36">Tahun Kurikulum</label>
              <select
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600"
                value={selectedCurriculum}
                onChange={handleCurriculumChange}
              >
                <option value="all">-- Semua Tahun Kurikulum --</option>
                {curriculumData.map((item) => (
                  <option key={item.id} value={item.id}>{item.tahun}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-700 w-36">Jenis Mata Kuliah</label>
              <select
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600"
                value={selectedJenis}
                onChange={handleJenisChange}
              >
                <option value="all">-- Semua Jenis Mata Kuliah --</option>
                <option value="Kuliah">Kuliah</option>
                <option value="Praktikum">Praktikum</option>
                <option value="Praktik Lapangan">Praktik Lapangan</option>
                <option value="Simulasi">Simulasi</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-700 w-36">Prodi Pengampu</label>
              <select
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600"
                value={selectedProdi}
                onChange={handleProdiChange}
              >
                <option value="all">-- Semua Program Studi --</option>
                {prodiData.map((item: any) => (
                  <option key={item.id} value={item.id}>{item.nama || item.namaProgramStudi}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-700 w-36">Kelompok Mata Kuliah</label>
              <select
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600"
                value={selectedKelompok}
                onChange={(e) => setSelectedKelompok(e.target.value)}
              >
                <option value="all">-- Semua Kelompok Mata Kuliah --</option>
                {kelompokMataKuliahData.map((k: any) => (
                  <option key={k.id} value={k.id}>{k.nama}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action and Table Section */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          {/* Action Row */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-gray-100 pb-4">
            <div className="flex items-center w-full md:w-auto gap-2">
              <select className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600">
                <option value="all">-- Semua --</option>
              </select>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Cari Mata Kuliah"
                  className="p-2 pl-3 border border-gray-300 rounded-l-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white w-64 text-gray-700"
                  value={tempSearch}
                  onChange={(e) => setTempSearch(e.target.value)}
                />
                <button type="submit" className="bg-primary-green text-white p-2.5 rounded-none flex items-center justify-center hover:opacity-90 cursor-pointer">
                  <Search size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="bg-blue-600 text-white p-2.5 rounded-r-md flex items-center justify-center hover:opacity-90 cursor-pointer"
                >
                  <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => navigate(AdminAcademicRoute.obeManagement.addObeCourse)}
                className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:opacity-90 cursor-pointer"
              >
                <Plus size={16} /> Tambah
              </button>
              <button type="button" className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:opacity-90 cursor-pointer">
                <Trash2 size={16} /> Hapus
              </button>
              <button type="button" className="bg-yellow-500 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:opacity-90 cursor-pointer">
                Aksi <span className="text-[10px]">▼</span>
              </button>
              <button type="button" className="bg-cyan-500 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:opacity-90 cursor-pointer">
                Cetak <span className="text-[10px]">▼</span>
              </button>
            </div>
          </form>

          {/* Table */}
          {isLoading ? (
            <div className="p-8 flex justify-center"><LoadingSpinner /></div>
          ) : coursesError ? (
            <div className="p-8 text-center text-red-500">Gagal memuat data Mata Kuliah OBE. Silakan coba lagi.</div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-sm mb-4">
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center">
                    <th className="p-3 border border-gray-300 w-10" rowSpan={2}>
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="p-3 border border-gray-300 w-24" rowSpan={2}>Kurikulum</th>
                    <th className="p-3 border border-gray-300 w-28" rowSpan={2}>Kode MK</th>
                    <th className="p-3 border border-gray-300 text-left" rowSpan={2}>Nama Mata Kuliah</th>
                    <th className="p-3 border border-gray-300 w-16" rowSpan={2}>SKS</th>
                    <th className="p-3 border border-gray-300 w-24" rowSpan={2}>Jenis MK</th>
                    <th className="p-3 border border-gray-300 text-left" rowSpan={2}>Prodi Pengampu</th>
                    <th className="p-2 border border-gray-300 w-72" colSpan={3}>Status Pengisian</th>
                    <th className="p-3 border border-gray-300 w-36" rowSpan={2}>Aksi</th>
                  </tr>
                  <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center border-b border-gray-300">
                    <th className="p-2 border border-gray-300">RPS</th>
                    <th className="p-2 border border-gray-300">CPL</th>
                    <th className="p-2 border border-gray-300">CPMK</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-semibold text-gray-700 text-center">
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course: any, idx: number) => {
                      const obeId = resolveObeId(course);
                      const hasObe = !!obeId;

                      return (
                        <tr key={course.id || idx} className="hover:bg-gray-50 border-b border-gray-200">
                          <td className="p-3 border border-gray-200">
                            <input type="checkbox" className="rounded border-gray-300" />
                          </td>
                          <td className="p-3 border border-gray-200">{course.kurikulum || '-'}</td>
                          <td className="p-3 border border-gray-200">{course.kodeMk}</td>
                          <td className="p-3 border border-gray-200 text-left font-normal text-gray-800">{course.namaMataKuliah}</td>
                          <td className="p-3 border border-gray-200">{course.sks}</td>
                          <td className="p-3 border border-gray-200">{course.jenisMk || 'Kuliah'}</td>
                          <td className="p-3 border border-gray-200 text-left font-normal">{course.prodiPengampu}</td>

                          {/* RPS Badge */}
                          <td className="p-2 border border-gray-200">
                            {course.statusPengisian?.isRpsTerisi ? (
                              <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded text-xs block text-center">Sudah Terisi</span>
                            ) : (
                              <span className="bg-gray-50 text-gray-500 border border-gray-200 px-2.5 py-1 rounded text-xs block text-center">Belum Terisi</span>
                            )}
                          </td>

                          {/* CPL Badge */}
                          <td className="p-2 border border-gray-200">
                            {course.statusPengisian?.isCplTerisi ? (
                              <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded text-xs block text-center">Sudah Terisi</span>
                            ) : (
                              <span className="bg-gray-50 text-gray-500 border border-gray-200 px-2.5 py-1 rounded text-xs block text-center">Belum Terisi</span>
                            )}
                          </td>

                          {/* CPMK Badge */}
                          <td className="p-2 border border-gray-200">
                            {course.statusPengisian?.isCpmkTerisi ? (
                              <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded text-xs block text-center">Sudah Terisi</span>
                            ) : (
                              <span className="bg-gray-50 text-gray-500 border border-gray-200 px-2.5 py-1 rounded text-xs block text-center">Belum Terisi</span>
                            )}
                          </td>

                          {/* Aksi Buttons */}
                          <td className="p-3 border border-gray-200">
                            <div className="flex gap-1.5 justify-center items-center">

                              {/* Chain Button — Always clickable */}
                              <button
                                onClick={() => {
                                  const targetObeId = course?.obeId || 'default';
                                  navigate(`${AdminAcademicRoute.obeManagement.detailRps}/${targetObeId}/${course.id}`);
                                }}
                                className="bg-gray-200 hover:bg-cyan-500 hover:text-white text-gray-600 p-1.5 rounded transition flex items-center justify-center cursor-pointer"
                                title="Detail RPS"
                              >
                                <Link2 size={15} />
                              </button>

                              {/* Eye Button — Directly navigates to Data Mata Kuliah */}
                              <button
                                onClick={() => {
                                  const targetObeId = course?.obeId || 'default';
                                  navigate(`${AdminAcademicRoute.obeManagement.detailObeCourse}/${targetObeId}/${course.id}`);
                                }}
                                className="bg-gray-200 hover:bg-cyan-500 hover:text-white text-gray-600 p-1.5 rounded transition flex items-center justify-center cursor-pointer"
                                title="Lihat Data Mata Kuliah"
                              >
                                <Eye size={15} />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => {
                                  if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
                                    // Call delete
                                  }
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded transition cursor-pointer flex items-center justify-center"
                                title="Hapus"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={11} className="p-8 text-center text-gray-400 italic">Data tidak ditemukan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !coursesError && (
            <Pagination
              currentPage={currentPage}
              totalRows={totalRowsBackend}
              totalPages={Math.ceil(totalRowsBackend / itemsPerPage)}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
              rowsPerPage={itemsPerPage}
            />
          )}
        </div>
      </div>

    </MainLayout>
  );
};
