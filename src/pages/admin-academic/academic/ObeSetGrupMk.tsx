import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { Pagination } from "../../../components/admin-academic/Pagination";
import SearchableSelect from "../../../components/admin-academic/SearchableSelect";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Plus, Save, RefreshCw, Trash2, Search } from "lucide-react";
import {
  useGrupMkOptions,
  useGrupMkTable,
  useUnmappedMk,
  useSetGrupMk,
  useRemoveGrupMk,
} from "../../../hooks/academic/useGrupMk";

type SearchType = "all" | "grup" | "mk";

const ObeSetGrupMk: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCurriculum, setSelectedCurriculum] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [searchType, setSearchType] = useState<SearchType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const [newGrupId, setNewGrupId] = useState("");
  const [newMkId, setNewMkId] = useState("");

  const { data: options } = useGrupMkOptions();
  const { data: result, isLoading } = useGrupMkTable({
    kurikulumId: selectedCurriculum,
    grupId: selectedGroup,
    page: currentPage,
    limit: itemsPerPage,
  });
  const { data: unmappedMk = [] } = useUnmappedMk(selectedCurriculum, isAdding && selectedCurriculum !== "all");
  const setMutation = useSetGrupMk();
  const removeMutation = useRemoveGrupMk();

  const allItems = result?.items || [];
  const items = allItems.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    if (searchType === "grup") return item.grupMk.toLowerCase().includes(term);
    if (searchType === "mk") return item.mataKuliah.toLowerCase().includes(term);
    return item.grupMk.toLowerCase().includes(term) || item.mataKuliah.toLowerCase().includes(term);
  });
  const totalPages = result?.totalPage || 1;

  const handleTambah = () => {
    setErrorMessage("");
    setNewGrupId("");
    setNewMkId("");
    setIsAdding(true);
  };

  const handleBatalTambah = () => {
    setIsAdding(false);
    setNewGrupId("");
    setNewMkId("");
    setErrorMessage("");
  };

  const handleSimpanTambah = () => {
    if (selectedCurriculum === "all") {
      setErrorMessage("Pilih Tahun Kurikulum terlebih dahulu sebelum menambahkan.");
      return;
    }
    if (!newGrupId || !newMkId) {
      setErrorMessage("Grup MK dan Mata Kuliah wajib dipilih.");
      return;
    }
    setErrorMessage("");
    setMutation.mutate(
      { mkId: newMkId, grupId: newGrupId },
      {
        onSuccess: () => {
          setIsAdding(false);
          setNewGrupId("");
          setNewMkId("");
        },
        onError: (err: any) => setErrorMessage(err?.response?.data?.message || "Gagal menyimpan."),
      }
    );
  };

  const handleHapus = (item: { id: string; mataKuliah: string }) => {
    if (!window.confirm(`Keluarkan "${item.mataKuliah}" dari grup ini?`)) return;
    removeMutation.mutate(item.id);
  };

  return (
    <MainLayout isGreeting={false} titlePage="Set Grup Mata Kuliah Wajib Pilihan">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Beranda &gt; Perkuliahan &gt; Manajemen Kurikulum &gt; Set Grup Mata Kuliah Wajib Pilihan</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-yellow shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-primary-yellow">Kurikulum</label>
              <SearchableSelect
                value={selectedCurriculum}
                onChange={(v) => { setSelectedCurriculum(v); setCurrentPage(1); handleBatalTambah(); }}
                placeholder="-- Semua Kurikulum --"
                searchPlaceholder="Cari tahun kurikulum..."
                options={[{ value: "all", label: "-- Semua --" }, ...(options?.kurikulum || []).map((c) => ({ value: c.id, label: c.tahun }))]}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-primary-yellow">Grup Mata Kuliah</label>
              <SearchableSelect
                value={selectedGroup}
                onChange={(v) => { setSelectedGroup(v); setCurrentPage(1); }}
                placeholder="-- Semua Grup --"
                searchPlaceholder="Cari grup mata kuliah..."
                options={[{ value: "all", label: "-- Semua --" }, ...(options?.grupMk || []).map((g) => ({ value: g.id, label: g.nama }))]}
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
            <div className="flex items-center w-full md:w-auto">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as SearchType)}
                className="border border-gray-300 rounded-l-md p-2 text-sm bg-white"
              >
                <option value="all">-- Semua --</option>
                <option value="grup">Grup MK</option>
                <option value="mk">Mata Kuliah</option>
              </select>
              <input
                type="text"
                placeholder="Cari Set Grup Mata Kuliah Wajib Pilihan"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border-t border-b border-gray-300 text-sm outline-none focus:ring-1 focus:ring-primary-green w-72"
              />
              <button className="bg-primary-green text-white p-2.5 flex items-center justify-center">
                <Search size={16} />
              </button>
              <button
                onClick={() => { setSearchTerm(""); setSearchType("all"); }}
                className="bg-primary-blueDark text-white p-2.5 rounded-r-md flex items-center justify-center"
              >
                <RefreshCw size={16} />
              </button>
            </div>
            {!isAdding && (
              <button onClick={handleTambah} className="bg-primary-green text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
                <Plus size={16} /> Tambah
              </button>
            )}
          </div>

          {errorMessage && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{errorMessage}</div>}

          {isLoading ? (
            <div className="flex justify-center p-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-primary-green text-white text-sm">
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-left">Grup MK</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-left">Mata Kuliah</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isAdding && (
                    <tr className="bg-green-50">
                      <td className="border border-gray-200 px-2 py-2">
                        <SearchableSelect
                          value={newGrupId}
                          onChange={setNewGrupId}
                          placeholder="-- Pilih Grup MK --"
                          searchPlaceholder="Cari grup..."
                          options={(options?.grupMk || []).map((g) => ({ value: g.id, label: g.nama }))}
                        />
                      </td>
                      <td className="border border-gray-200 px-2 py-2">
                        {selectedCurriculum === "all" ? (
                          <p className="text-xs text-gray-400 italic">Pilih Tahun Kurikulum di filter atas dulu.</p>
                        ) : (
                          <SearchableSelect
                            value={newMkId}
                            onChange={setNewMkId}
                            placeholder="-- Cari Mata Kuliah --"
                            searchPlaceholder="Cari mata kuliah..."
                            options={unmappedMk.map((mk) => ({ value: mk.id, label: `${mk.kode} - ${mk.nama} (${mk.sks} SKS)` }))}
                          />
                        )}
                      </td>
                      <td className="border border-gray-200 px-2 py-2">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={handleSimpanTambah}
                            disabled={setMutation.isPending}
                            className="bg-primary-green hover:opacity-90 text-white p-1.5 rounded disabled:opacity-50"
                            title="Simpan"
                          >
                            <Save size={16} />
                          </button>
                          <button onClick={handleBatalTambah} className="bg-primary-yellow hover:opacity-90 text-white p-1.5 rounded" title="Batal">
                            <RefreshCw size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {items.length > 0 ? (
                    items.map((item) => (
                      <tr key={item.id} className="text-sm text-gray-700 hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2">{item.grupMk}</td>
                        <td className="border border-gray-200 px-4 py-2">
                          <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs border border-gray-200">
                            {item.mataKuliah}
                          </span>
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-center">
                          <button onClick={() => handleHapus(item)} className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded" title="Hapus">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : !isAdding ? (
                    <tr>
                      <td colSpan={3} className="border border-gray-200 px-4 py-4 text-center text-gray-500">
                        Data kosong
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>

              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  rowsPerPage={itemsPerPage}
                  totalRows={result?.total || 0}
                  onRowsPerPageChange={(rows) => { setItemsPerPage(rows); setCurrentPage(1); }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ObeSetGrupMk;
