import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Pencil, RefreshCw, Trash2, Search, Plus } from "lucide-react";
import {
  useCplUmumManagementList,
  useOpsiTingkatCpl,
  useSaveCplUmum,
  useDeleteCplUmum,
  CplUmumRow,
} from "../../../hooks/academic/useCplUmumManagement";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SearchableSelect from "../../../components/admin-academic/SearchableSelect";
import TahunKurikulumSidebar from "../../../components/admin-academic/academic/obe/TahunKurikulumSidebar";
import { AdminAcademicRoute } from "../../../types/VarRoutes";

const KATEGORI_OPTIONS = ["Sikap", "Pengetahuan", "Keterampilan Umum", "Keterampilan Khusus"];

const UNIV_VALUE = "__universitas__";

interface FormState {
  kode: string;
  deskripsiInd: string;
  deskripsiEng: string;
  targetCpl: string;
  kategori: string;
  tingkatCplValue: string; // UNIV_VALUE atau id fakultas
}

const EMPTY_FORM: FormState = {
  kode: "",
  deskripsiInd: "",
  deskripsiEng: "",
  targetCpl: "",
  kategori: "",
  tingkatCplValue: UNIV_VALUE,
};

export default function ObeCplUmum() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: tingkatCplOptions = [] } = useOpsiTingkatCpl();

  const [searchTerm, setSearchTerm] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null); // "new" atau id row
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { data, isLoading } = useCplUmumManagementList(id!, { search: searchTerm, kategori: kategoriFilter }, !!id);
  const saveMutation = useSaveCplUmum(id!);
  const deleteMutation = useDeleteCplUmum(id!);

  const header = data?.header;
  const rows = data?.tabel || [];

  const handleBack = () => navigate(AdminAcademicRoute.obeManagement.tahunKurikulum);

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrorMessage("");
  };

  const handleTambah = () => {
    setForm(EMPTY_FORM);
    setEditingId("new");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleEdit = (row: CplUmumRow) => {
    setForm({
      kode: row.kode,
      deskripsiInd: row.deskripsiInd,
      deskripsiEng: row.deskripsiEng,
      targetCpl: String(row.targetCpl ?? ""),
      kategori: row.kategori,
      tingkatCplValue: row.siakFakultasId || UNIV_VALUE,
    });
    setEditingId(row.id);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSimpan = () => {
    if (!form.kode.trim() || !form.deskripsiInd.trim() || !form.kategori || form.targetCpl === "") {
      setErrorMessage("Kode CPL, Deskripsi CPL (Bahasa Indonesia), Target CPL, dan Kategori wajib diisi.");
      return;
    }
    setErrorMessage("");
    saveMutation.mutate(
      {
        ...(editingId && editingId !== "new" ? { id: editingId } : {}),
        kode: form.kode.trim(),
        deskripsiInd: form.deskripsiInd.trim(),
        deskripsiEng: form.deskripsiEng.trim(),
        targetCpl: Number(form.targetCpl) || 0,
        kategori: form.kategori,
        siakFakultasId: form.tingkatCplValue === UNIV_VALUE ? null : form.tingkatCplValue,
      },
      {
        onSuccess: () => {
          setSuccessMessage("Data CPL Umum berhasil disimpan.");
          resetForm();
        },
        onError: (err: any) => setErrorMessage(err?.response?.data?.message || "Gagal menyimpan data."),
      }
    );
  };

  const handleHapus = (row: CplUmumRow) => {
    if (!window.confirm(`Hapus CPL Umum "${row.kode}"?`)) return;
    deleteMutation.mutate(row.id, {
      onSuccess: () => setSuccessMessage("Data CPL Umum berhasil dihapus."),
      onError: (err: any) => setErrorMessage(err?.response?.data?.message || "Gagal menghapus data."),
    });
  };

  const tingkatCplSelectOptions = [
    { value: UNIV_VALUE, label: "Universitas Ibn Khaldun" },
    ...tingkatCplOptions.filter((o) => o.id).map((o) => ({ value: o.id as string, label: o.nama })),
  ];

  const renderFormRow = () => (
    <tr className="bg-white align-top">
      <td className="p-2 border border-gray-200">
        <input
          type="text"
          value={form.kode}
          onChange={(e) => setForm((f) => ({ ...f, kode: e.target.value }))}
          placeholder="Kode CPL"
          className="w-28 p-1.5 border border-gray-300 rounded text-sm outline-none focus:ring-1 focus:ring-primary-green"
        />
      </td>
      <td className="p-2 border border-gray-200 min-w-[260px]">
        <div className="flex flex-col gap-2">
          <textarea
            value={form.deskripsiInd}
            onChange={(e) => setForm((f) => ({ ...f, deskripsiInd: e.target.value }))}
            placeholder="Bahasa Indonesia (Wajib)"
            rows={3}
            className="w-full p-1.5 border border-gray-300 rounded text-sm outline-none focus:ring-1 focus:ring-primary-green resize-none"
          />
          <textarea
            value={form.deskripsiEng}
            onChange={(e) => setForm((f) => ({ ...f, deskripsiEng: e.target.value }))}
            placeholder="Bahasa Inggris (Optional)"
            rows={2}
            className="w-full p-1.5 border border-gray-300 rounded text-sm outline-none focus:ring-1 focus:ring-primary-green resize-none"
          />
        </div>
      </td>
      <td className="p-2 border border-gray-200">
        <input
          type="number"
          min={0}
          max={100}
          value={form.targetCpl}
          onChange={(e) => setForm((f) => ({ ...f, targetCpl: e.target.value }))}
          placeholder="Target CPL"
          className="w-24 p-1.5 border border-gray-300 rounded text-sm outline-none focus:ring-1 focus:ring-primary-green"
        />
      </td>
      <td className="p-2 border border-gray-200 min-w-[170px]">
        <SearchableSelect
          value={form.kategori}
          onChange={(v) => setForm((f) => ({ ...f, kategori: v }))}
          placeholder="-- Pilih Kategori --"
          searchPlaceholder="Cari kategori..."
          options={KATEGORI_OPTIONS.map((k) => ({ value: k, label: k }))}
        />
      </td>
      <td className="p-2 border border-gray-200 min-w-[200px]">
        <SearchableSelect
          value={form.tingkatCplValue}
          onChange={(v) => setForm((f) => ({ ...f, tingkatCplValue: v }))}
          placeholder="-- Pilih Tingkat CPL --"
          searchPlaceholder="Cari fakultas..."
          options={tingkatCplSelectOptions}
        />
      </td>
      <td className="p-2 border border-gray-200">
        <div className="flex justify-center gap-2">
          <button
            onClick={handleSimpan}
            disabled={saveMutation.isPending}
            className="bg-primary-green hover:opacity-90 text-white p-1.5 rounded disabled:opacity-50"
            title="Simpan"
          >
            <Save size={16} />
          </button>
          <button onClick={resetForm} className="bg-primary-yellow hover:opacity-90 text-white p-1.5 rounded" title="Batal">
            <RefreshCw size={16} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <MainLayout isGreeting={false} titlePage="CPL Umum">
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex flex-col items-center justify-between mb-6 md:flex-row gap-4">
          <div className="flex items-center">
            <button onClick={handleBack} className="flex items-center bg-primary-yellow text-white px-2 py-3 rounded-l-md">
              <ArrowLeft className="mr-2" size={16} />
            </button>
            <div className="flex items-center">
              <input
                type="search"
                placeholder="Cari Tahun Kurikulum"
                className="px-3 py-2 border border-black/50 w-64"
                onChange={() => {}}
              />
              <button className="bg-primary-blueSoft px-3 py-3 rounded-r-md">
                <Search color="white" size={20} />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleBack} className="bg-primary-blueSoft text-white px-4 py-2 rounded flex items-center cursor-pointer">
              <ArrowLeft className="mr-2" size={16} />
              Kembali ke Daftar
            </button>
            {editingId === null && (
              <button onClick={handleTambah} className="bg-primary-green text-white px-4 py-2 rounded flex items-center cursor-pointer">
                <Plus className="mr-2" size={16} />
                Tambah Data
              </button>
            )}
          </div>
        </div>

        {errorMessage && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>}
        {successMessage && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</div>}

        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <TahunKurikulumSidebar tahunKurikulumId={id!} activeSection="cplUmum" />

          {/* Content */}
          <div className="w-full md:w-[80%]">
            {!header ? (
              <div className="flex justify-center p-12">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-2 bg-primary-green/10 p-4 md:grid-cols-2 mb-6">
                  <div className="flex justify-between">
                    <span className="font-semibold w-full text-left">Kurikulum:</span>
                    <span className="w-full text-left">{header.kurikulum}</span>
                  </div>
                  <div className="flex justify-between md:ml-8">
                    <span className="font-semibold w-full text-left">Tanggal Awal:</span>
                    <span className="w-full text-left">{header.tanggalAwal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold w-full text-left">Keterangan:</span>
                    <span className="w-full text-left">{header.keterangan}</span>
                  </div>
                  <div className="flex justify-between md:ml-8">
                    <span className="font-semibold w-full text-left">Tanggal Akhir:</span>
                    <span className="w-full text-left">{header.tanggalAkhir}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold w-full text-left">Mulai Berlaku:</span>
                    <span className="w-full text-left">{header.mulaiBerlaku}</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
                  <div className="flex items-center w-full md:w-auto">
                    <input
                      type="text"
                      placeholder="Cari Kode / Deskripsi CPL"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="p-2 border border-gray-300 rounded-l-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-72"
                    />
                    <button onClick={() => setSearchTerm("")} className="bg-primary-blueDark text-white p-2.5 rounded-r-md flex items-center justify-center">
                      <RefreshCw size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-primary-blueDark">Kategori</label>
                    <div className="w-52">
                      <SearchableSelect
                        value={kategoriFilter}
                        onChange={setKategoriFilter}
                        options={[{ value: "all", label: "-- Semua Kategori --" }, ...KATEGORI_OPTIONS.map((k) => ({ value: k, label: k }))]}
                      />
                    </div>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center p-12">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-gray-200 rounded-sm">
                    <table className="min-w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-primary-green text-white text-center">
                          <th className="p-2 border border-gray-400">Kode CPL</th>
                          <th className="p-2 border border-gray-400 text-left">Deskripsi CPL</th>
                          <th className="p-2 border border-gray-400">Target CPL</th>
                          <th className="p-2 border border-gray-400">Kategori</th>
                          <th className="p-2 border border-gray-400">Tingkat CPL</th>
                          <th className="p-2 border border-gray-400 w-24">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editingId === "new" && renderFormRow()}
                        {rows.length > 0 ? (
                          rows.map((row) =>
                            editingId === row.id ? (
                              <React.Fragment key={row.id}>{renderFormRow()}</React.Fragment>
                            ) : (
                              <tr key={row.id} className="hover:bg-gray-50 text-center align-top">
                                <td className="p-2 border border-gray-200 font-semibold">{row.kode}</td>
                                <td className="p-2 border border-gray-200 text-left">
                                  <p>{row.deskripsiInd}</p>
                                  {row.deskripsiEng && <p className="text-xs text-gray-400 italic mt-1">{row.deskripsiEng}</p>}
                                </td>
                                <td className="p-2 border border-gray-200">{Number(row.targetCpl).toFixed(2).replace(".", ",")}</td>
                                <td className="p-2 border border-gray-200">
                                  <span className="inline-block px-2 py-1 rounded text-xs font-semibold border bg-blue-50 text-primary-blueSoft border-blue-200">
                                    {row.kategori}
                                  </span>
                                </td>
                                <td className="p-2 border border-gray-200">{row.tingkatCpl}</td>
                                <td className="p-2 border border-gray-200">
                                  <div className="flex justify-center gap-2">
                                    <button onClick={() => handleEdit(row)} className="bg-primary-yellow hover:opacity-90 text-white p-1.5 rounded" title="Edit">
                                      <Pencil size={16} />
                                    </button>
                                    <button onClick={() => handleHapus(row)} className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded" title="Hapus">
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          )
                        ) : editingId !== "new" ? (
                          <tr>
                            <td colSpan={6} className="p-6 text-center text-gray-400 italic">
                              Belum ada data
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
