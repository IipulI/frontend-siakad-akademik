// src/pages/admin-academic/academic/OBEManagement.tsx
import React, { useState } from 'react';
import { getObeMataKuliah } from '../../../hooks/academic/useObeManagement';
import { MataKuliahOBE } from '../../../types/obe.types';
import { Search, Plus, Trash2, Settings, Printer, Link as LinkIcon, Eye } from 'lucide-react';
// Asumsikan ada komponen reusable sesuai struktur[cite: 3]
// import MainLayout from '@/components/MainLayout'; 

export const OBEManagement: React.FC = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    tahunKurikulumId: '',
    prodiId: '',
    jenis: '',
  });

  const { data, isLoading, error } = getObeMataKuliah(filters);

  // Helper untuk warna badge status
  const getBadgeStyle = (status: string) => {
    return status === 'Sudah Terisi'
      ? 'bg-green-50 text-green-600 border border-green-200'
      : 'bg-gray-50 text-gray-500 border border-gray-200';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Mata Kuliah</h1>
        <p className="text-gray-500 text-sm mt-1">Daftar Mata Kuliah / Blok / Departemen</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <select className="p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-600">
              <option value="">-- Semua Tahun Kurikulum --</option>
              <option value="2025">2025</option>
            </select>
            <select className="p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-600">
              <option value="">S1 - Teknik Informatika</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <select className="p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-600">
              <option value="">-- Semua Jenis Mata Kuliah --</option>
              <option value="Kuliah">Kuliah</option>
            </select>
            <select className="p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-600">
              <option value="">-- Semua Kelompok Mata Kuliah --</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center w-full md:w-1/2 gap-2">
          <select className="p-2.5 border border-gray-200 rounded-xl text-sm bg-white">
            <option>-- Semua --</option>
          </select>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari Mata Kuliah"
              className="w-full p-2.5 pl-4 pr-10 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <button className="absolute right-0 top-0 bottom-0 px-3 bg-emerald-500 text-white rounded-r-xl hover:bg-emerald-600 transition">
              <Search size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-xl hover:bg-emerald-600 transition shadow-sm">
            <Plus size={16} /> Tambah
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 text-white text-sm font-medium rounded-xl hover:bg-rose-600 transition shadow-sm">
            <Trash2 size={16} /> Hapus
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm font-medium rounded-xl hover:bg-amber-600 transition shadow-sm">
            <Settings size={16} /> Aksi
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 text-white text-sm font-medium rounded-xl hover:bg-sky-600 transition shadow-sm">
            <Printer size={16} /> Cetak
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-white uppercase bg-[#00427c]">
              <tr>
                <th className="px-4 py-4 text-center w-12"><input type="checkbox" className="rounded-sm" /></th>
                <th className="px-4 py-4">Kurikulum</th>
                <th className="px-4 py-4">Kode MK</th>
                <th className="px-4 py-4">Nama Mata Kuliah</th>
                <th className="px-4 py-4 text-center">SKS</th>
                <th className="px-4 py-4">Jenis MK</th>
                <th className="px-4 py-4">Prodi Pengampu</th>
                <th className="px-4 py-4 text-center border-l border-blue-800" colSpan={3}>Status Pengisian</th>
                <th className="px-4 py-4 text-center border-l border-blue-800">Aksi</th>
              </tr>
              <tr className="bg-[#00386b] text-gray-200 text-xs">
                <th colSpan={7}></th>
                <th className="px-4 py-2 text-center border-l border-blue-800 font-medium">RPS</th>
                <th className="px-4 py-2 text-center font-medium">CPL</th>
                <th className="px-4 py-2 text-center font-medium">CPMK</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={11} className="p-8 text-center text-gray-500">Memuat data...</td></tr>
              ) : error ? (
                 <tr><td colSpan={11} className="p-8 text-center text-red-500">Gagal memuat data.</td></tr>
              ) : (
                data?.data?.map((mk: MataKuliahOBE, index: number) => {
                  // Hitung total SKS berdasarkan field dari backend BE OBE.json[cite: 4]
                  const totalSks = 
                    (mk.sksTatapMuka || 0) + 
                    (mk.sksPraktikum || 0) + 
                    (mk.sksPraktikLapangan || 0) + 
                    (mk.sksSimulasi || 0);

                  return (
                    <tr key={mk.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-center"><input type="checkbox" className="rounded-sm" /></td>
                      <td className="px-4 py-3">{mk.tahunKurikulum?.tahun || '2025'}</td>
                      <td className="px-4 py-3 font-medium text-gray-700">{mk.kode}</td>
                      <td className="px-4 py-3">{mk.nama}</td>
                      <td className="px-4 py-3 text-center">{totalSks}</td>
                      <td className="px-4 py-3">{mk.jenis}</td>
                      <td className="px-4 py-3">{mk.prodi?.nama || 'S1 - Teknik Informatika'}</td>
                      
                      {/* Status Badges - Menggunakan default 'Belum Terisi' jika field belum dikirim BE */}
                      <td className="px-2 py-3 text-center border-l border-gray-100">
                        <span className={`px-2.5 py-1 text-xs rounded-lg ${getBadgeStyle(mk.statusRps || 'Belum Terisi')}`}>
                          {mk.statusRps || 'Belum Terisi'}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <span className={`px-2.5 py-1 text-xs rounded-lg ${getBadgeStyle(mk.statusCpl || 'Belum Terisi')}`}>
                          {mk.statusCpl || 'Belum Terisi'}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <span className={`px-2.5 py-1 text-xs rounded-lg ${getBadgeStyle(mk.statusCpmk || 'Belum Terisi')}`}>
                          {mk.statusCpmk || 'Belum Terisi'}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-4 py-3 text-center border-l border-gray-100">
                        <div className="flex items-center justify-center gap-1.5">
                          <button className="p-1.5 bg-sky-500 text-white rounded hover:bg-sky-600 transition"><LinkIcon size={14} /></button>
                          <button className="p-1.5 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition"><Eye size={14} /></button>
                          <button className="p-1.5 bg-rose-500 text-white rounded hover:bg-rose-600 transition"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="flex justify-between items-center p-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-500">
          <div>Hal 1/83 (830 data, 0.0543 detik)</div>
          <div className="flex items-center gap-4">
             <select className="p-1.5 border border-gray-200 rounded-lg outline-none">
                <option>10 baris</option>
             </select>
             <div className="flex items-center gap-1">
                <button className="px-2.5 py-1.5 bg-gray-200 text-gray-500 rounded-md hover:bg-gray-300">«</button>
                <button className="px-2.5 py-1.5 bg-gray-200 text-gray-500 rounded-md hover:bg-gray-300">‹</button>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md">1</button>
                <button className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-md">2</button>
                <button className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-md">3</button>
                <button className="px-2.5 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-md text-gray-500">›</button>
                <button className="px-2.5 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-md text-gray-500">»</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
