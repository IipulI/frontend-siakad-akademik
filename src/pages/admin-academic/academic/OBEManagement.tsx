// src/pages/admin-academic/academic/OBEManagement.tsx
import React, { useState } from 'react';
import MainLayout from "../../../components/layouts/MainLayout";
import { getObe } from '../../../hooks/academic/useObeManagement';
import { getProdi } from "../../../hooks/academic/useProdi";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear";
import { TableOBE } from "../../../components/Table";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { RefreshCw, Search } from 'lucide-react';
import LoadingSpinner from "../../../components/LoadingSpinner";

export const OBEManagement: React.FC = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    tahunKurikulumId: '',
    prodiId: '',
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Queries
  const { data: prodiData = [], isLoading: isProdiLoading } = getProdi();
  const { data: curriculumData = [], isLoading: isCurriculumLoading } = getCurriculumYear();
  const { data: obeResponse, isLoading: isObeLoading, error: obeError, refetch } = getObe(filters);

  const handleProdiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, prodiId: e.target.value, page: 1 });
  };

  const handleCurriculumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, tahunKurikulumId: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleRowsPerPageChange = (newLimit: number) => {
    setFilters({ ...filters, limit: newLimit, page: 1 });
  };

  const handleRefresh = () => {
    refetch();
  };

  // Filter data based on search term (since search is client side on mapped programStudi / ketuaProgramStudi)
  const allObeData = obeResponse?.data || [];
  const filteredObeData = allObeData.filter((item: any) => {
    const term = searchTerm.toLowerCase();
    return (
      item.programStudi?.toLowerCase().includes(term) ||
      item.ketuaProgramStudi?.toLowerCase().includes(term) ||
      item.kodeProdi?.toLowerCase().includes(term)
    );
  });

  const isLoading = isProdiLoading || isCurriculumLoading || isObeLoading;

  return (
    <MainLayout isGreeting={false} titlePage="Manajemen OBE">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Manajemen Capaian (OBE)</h1>
          <p className="text-gray-500 text-sm mt-1">Daftar Program Studi & Kurikulum Aktif OBE</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Tahun Kurikulum</label>
              <select 
                className="p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-600 bg-white"
                value={filters.tahunKurikulumId}
                onChange={handleCurriculumChange}
              >
                <option value="">-- Semua Tahun Kurikulum --</option>
                {curriculumData.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.tahun}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Program Studi</label>
              <select 
                className="p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-600 bg-white"
                value={filters.prodiId}
                onChange={handleProdiChange}
              >
                <option value="">-- Semua Program Studi --</option>
                {prodiData.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.namaProgramStudi}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="flex items-center w-full md:w-1/2 gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari Program Studi / Kaprodi..."
                className="w-full p-2.5 pl-4 pr-10 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute right-3 top-3 text-gray-400">
                <Search size={16} />
              </span>
            </div>
            <button 
              onClick={handleRefresh}
              className="bg-primary-blueDark rounded-xl w-10 h-10 flex items-center justify-center text-white hover:bg-opacity-90 transition"
              disabled={isLoading}
            >
              <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : obeError ? (
            <div className="p-8 text-center text-red-500">
              Gagal memuat data OBE. Silakan coba lagi.
            </div>
          ) : (
            <TableOBE 
              data={filteredObeData} 
              error="Data tidak ditemukan." 
            />
          )}

          {/* Pagination Footer */}
          {!isLoading && !obeError && (
            <Pagination
              currentPage={filters.page}
              totalRows={obeResponse?.count || 0}
              totalPages={Math.ceil((obeResponse?.count || 0) / filters.limit)}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};
