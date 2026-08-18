import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Pencil, Copy, X, Search, Printer } from "lucide-react";
import {
  getMatriksCplMk,
  useSaveMatriksCplMk,
  useOpsiSalinCplMk,
  fetchPratinjauSalinCplMk,
  useSalinCplMk,
  PratinjauSalinCplMkItem,
} from "../../../hooks/academic/useObeMatriksCplMk";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import SidebarOBE from "../../../components/admin-academic/academic/obe/SidebarOBE";
import SearchableSelect from "../../../components/admin-academic/SearchableSelect";

type Matrix = Record<string, Set<string>>; // mkId -> Set<cplId>

export default function ObePemetaanCplMk() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: mapping, isLoading } = getMatriksCplMk(id!);
  const saveMutation = useSaveMatriksCplMk();

  const [mode, setMode] = useState<"view" | "edit">("view");
  const [matrix, setMatrix] = useState<Matrix>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSalinModal, setShowSalinModal] = useState(false);

  const header = mapping?.header;
  const columns = mapping?.columns || [];
  const rows = mapping?.rows || [];

  const buildMatrixFromMapping = (): Matrix => {
    const seeded: Matrix = {};
    rows.forEach((row) => {
      seeded[row.id] = new Set(row.pemetaanCpl.filter((c) => c.isMapped).map((c) => c.cplId));
    });
    return seeded;
  };

  useEffect(() => {
    if (!rows.length) return;
    setMatrix(buildMatrixFromMapping());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapping]);

  const handleBack = () => navigate(AdminAcademicRoute.obeManagement.obeManagement);

  const isChecked = (mkId: string, cplId: string) => matrix[mkId]?.has(cplId) || false;

  const toggleChecked = (mkId: string, cplId: string) => {
    setMatrix((prev) => {
      const set = new Set(prev[mkId] || []);
      if (set.has(cplId)) set.delete(cplId);
      else set.add(cplId);
      return { ...prev, [mkId]: set };
    });
  };

  const handleMulaiUbah = () => {
    setMatrix(buildMatrixFromMapping());
    setErrorMessage("");
    setSuccessMessage("");
    setMode("edit");
  };

  const handleBatalkan = () => {
    setMatrix(buildMatrixFromMapping());
    setMode("view");
    setErrorMessage("");
  };

  const handleSave = () => {
    setErrorMessage("");
    setSuccessMessage("");

    const pemetaan: { mkId: string; cplId: string }[] = [];
    rows.forEach((row) => {
      if (row.isMku) return;
      (matrix[row.id] || new Set()).forEach((cplId) => pemetaan.push({ mkId: row.id, cplId }));
    });

    saveMutation.mutate(
      { obeId: id!, pemetaan },
      {
        onSuccess: () => {
          setSuccessMessage("Pemetaan CPL ke MK berhasil disimpan.");
          setMode("view");
        },
        onError: (error: any) => setErrorMessage(error?.response?.data?.message || "Gagal menyimpan pemetaan. Silakan coba lagi."),
      }
    );
  };

  const handleCetakLaporan = () => {
    window.open(`${AdminAcademicRoute.obeManagement.cplKeMkLaporan}/${id}`, "_blank");
  };

  const displayRows = rows.filter(
    (row) =>
      !searchTerm ||
      row.kode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isRowLengkap = (row: (typeof rows)[number]) => row.isMku || (matrix[row.id]?.size || 0) > 0;

  return (
    <MainLayout isGreeting={false} titlePage="Pemetaan CPL → MK">
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex flex-col items-center justify-between mb-10 md:flex-row gap-4">
          <div className="flex items-center">
            <button onClick={handleBack} className="flex items-center bg-primary-yellow text-white px-2 py-3 rounded-l-md">
              <ArrowLeft className="mr-2" size={16} />
            </button>
            <div className="flex items-center">
              <input
                type="search"
                placeholder="Cari Kurikulum Program Studi"
                className="px-3 py-2 border border-black/50 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            {mode === "view" ? (
              <>
                <button onClick={handleMulaiUbah} className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer">
                  <Pencil className="mr-2" size={16} />
                  Ubah Data
                </button>
                <button onClick={() => setShowSalinModal(true)} className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer">
                  <Copy className="mr-2" size={16} />
                  Salin Data
                </button>
                <button onClick={handleCetakLaporan} className="bg-primary-blueSoft text-white px-4 py-2 rounded flex items-center cursor-pointer">
                  <Printer className="mr-2" size={16} />
                  Cetak Laporan
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                  className="bg-primary-green text-white px-4 py-2 rounded flex items-center disabled:opacity-50 cursor-pointer"
                >
                  <Save className="mr-2" size={16} />
                  {saveMutation.isPending ? "Menyimpan..." : "Simpan Data"}
                </button>
                <button onClick={handleBatalkan} className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer">
                  <X className="mr-2" size={16} />
                  Batalkan
                </button>
              </>
            )}
          </div>
        </div>

        {errorMessage && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>}
        {successMessage && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</div>}

        <div className="flex flex-col md:flex-row">
          <SidebarOBE id={id!} activeTab="cplMk" />

          <div className="w-full md:w-[80%] p-3">
            <div className="grid grid-cols-1 gap-2 bg-primary-green/10 p-4 md:grid-cols-2">
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Kode Prodi:</span>
                <span className="w-full text-left">{header?.kodeProdi || "-"}</span>
              </div>
              <div className="flex justify-between md:ml-8">
                <span className="font-semibold w-full text-left">Tahun Kurikulum:</span>
                <span className="w-full text-left">{header?.tahunKurikulum || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Program Studi:</span>
                <span className="w-full text-left">{header?.programStudi || "-"}</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-md flex gap-3">
              <span className="text-primary-yellow font-bold">i</span>
              <div className="text-sm text-orange-800">
                <p className="font-semibold mb-0.5">Keterangan:</p>
                <p>Mata Kuliah bertanda MKU tidak dipetakan ke CPL. Terdapat data yang tidak bisa diubah karena sudah dipetakan dengan CPMK.</p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center p-12">
                <LoadingSpinner />
              </div>
            ) : rows.length === 0 || columns.length === 0 ? (
              <div className="mt-4 p-6 text-center text-gray-500 italic border border-gray-200 rounded">
                Data Mata Kuliah atau CPL belum tersedia.
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border border-gray-300 border-collapse">
                  <thead>
                    <tr className="bg-primary-green text-white text-sm">
                      <th className="p-2 border border-gray-400 min-w-[80px]" rowSpan={2}>
                        Semester
                      </th>
                      <th className="p-2 border border-gray-400 text-left min-w-[260px]" rowSpan={2}>
                        Mata Kuliah
                      </th>
                      <th className="p-2 border border-gray-400 text-center" colSpan={columns.length}>
                        Pemetaan CPL &rarr; MK
                      </th>
                    </tr>
                    <tr className="bg-primary-green text-white text-xs">
                      {columns.map((col) => (
                        <th key={col.id} className="p-2 border border-gray-400 min-w-[60px]">
                          {col.kode}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {displayRows.map((row) => (
                      <tr key={row.id}>
                        <td className="p-2 border border-gray-300 text-center align-top">{row.semester}</td>
                        <td className="p-2 border border-gray-300 align-top">
                          <p className="font-semibold text-primary-green">{row.nama}</p>
                          <p className="text-xs text-gray-500">
                            {row.kode} &middot; {row.sks} SKS
                          </p>
                          <div className="flex gap-1 mt-1">
                            {row.isMku && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-600">
                                🔒 MKU
                              </span>
                            )}
                            {!isRowLengkap(row) && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-yellow-50 border border-yellow-300 rounded text-yellow-700">
                                Pemetaan belum lengkap
                              </span>
                            )}
                          </div>
                        </td>
                        {columns.map((col) => {
                          if (row.isMku) {
                            return (
                              <td key={col.id} className="p-2 border border-gray-300 text-center text-gray-400">
                                -
                              </td>
                            );
                          }
                          const checked = isChecked(row.id, col.id);
                          if (mode === "view") {
                            return (
                              <td key={col.id} className="p-2 border border-gray-300 text-center">
                                {checked ? <span className="text-green-600 font-bold">&#10003;</span> : <span className="text-gray-300">-</span>}
                              </td>
                            );
                          }
                          return (
                            <td key={col.id} className="p-1 border border-gray-300 text-center">
                              <input type="checkbox" checked={checked} onChange={() => toggleChecked(row.id, col.id)} />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSalinModal && (
        <SalinCplMkModal obeId={id!} onClose={() => setShowSalinModal(false)} onSuccess={(msg) => setSuccessMessage(msg)} />
      )}
    </MainLayout>
  );
}

function SalinCplMkModal({ obeId, onClose, onSuccess }: { obeId: string; onClose: () => void; onSuccess: (msg: string) => void }) {
  const { data, isLoading } = useOpsiSalinCplMk(obeId, true);
  const salinMutation = useSalinCplMk();
  const [sumberObeId, setSumberObeId] = useState("");
  const [preview, setPreview] = useState<PratinjauSalinCplMkItem[] | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLihatPratinjau = async () => {
    if (!sumberObeId) {
      setError("Pilih Tahun Kurikulum asal terlebih dahulu.");
      return;
    }
    setError("");
    try {
      setIsPreviewLoading(true);
      const result = await fetchPratinjauSalinCplMk(obeId, sumberObeId);
      setPreview(result);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Gagal memuat pratinjau.");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleSalin = () => {
    salinMutation.mutate(
      { obeId, sumberObeId },
      {
        onSuccess: (result) => {
          onSuccess(`Berhasil menyalin ${result.jumlahDisalin} pemetaan CPL ke MK.`);
          onClose();
        },
        onError: (err: any) => setError(err?.response?.data?.message || "Gagal menyalin pemetaan."),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h4 className="text-lg font-bold text-gray-800">Salin Pemetaan CPL &rarr; MK</h4>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">
          {isLoading || !data ? (
            <div className="flex justify-center p-8">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-blue-50 rounded text-sm">
                <p><span className="font-semibold text-primary-blueSoft">Tahun Kurikulum</span> &nbsp; {data.obeInfo.tahunKurikulum}</p>
                <p><span className="font-semibold text-primary-blueSoft">Program Studi</span> &nbsp; {data.obeInfo.programStudi}</p>
              </div>
              {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{error}</div>}

              <label className="text-sm font-semibold text-primary-blueSoft block mb-1">Dari Tahun Kurikulum</label>
              {data.opsiSumber.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Tidak ada Tahun Kurikulum lain yang punya pemetaan CPL ke MK untuk prodi ini.</p>
              ) : (
                <SearchableSelect
                  value={sumberObeId}
                  onChange={(v) => { setSumberObeId(v); setPreview(null); }}
                  placeholder="-- Pilih Tahun Kurikulum --"
                  searchPlaceholder="Cari tahun kurikulum..."
                  options={data.opsiSumber.map((o) => ({ value: o.obeId, label: `${o.tahunKurikulum} (${o.jumlahPemetaan} pemetaan)` }))}
                />
              )}

              {preview && (
                <div className="mt-4 border border-gray-200 rounded-md overflow-hidden max-h-64 overflow-y-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 sticky top-0">
                        <th className="p-2 border border-gray-200 text-left">Kode CPL</th>
                        <th className="p-2 border border-gray-200 text-left">Mata Kuliah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((cpl, idx) => (
                        <tr key={idx}>
                          <td className="p-2 border border-gray-200 font-semibold">{cpl.kodeCPL}</td>
                          <td className="p-2 border border-gray-200">{cpl.mataKuliah.map((m) => m.kodeMK).join(", ")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <button onClick={onClose} className="bg-primary-yellow text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
                  <X size={14} /> Batalkan
                </button>
                {!preview ? (
                  <button
                    onClick={handleLihatPratinjau}
                    disabled={isPreviewLoading || data.opsiSumber.length === 0}
                    className="bg-primary-green text-white px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    {isPreviewLoading ? "Memuat..." : "Lihat Pratinjau"}
                  </button>
                ) : (
                  <button
                    onClick={handleSalin}
                    disabled={salinMutation.isPending}
                    className="bg-primary-green text-white px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                  >
                    {salinMutation.isPending ? "Menyalin..." : "Salin Data"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
