import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Pencil, Copy, X, Search } from "lucide-react";
import { getGraduateProfileData } from "../../../hooks/academic/useGraduateProfile";
import {
  getObePlCplMapping,
  useSaveObePlCplMapping,
  useOpsiSalinPlCpl,
  fetchPratinjauSalinPlCpl,
  useSalinPlCpl,
  PratinjauSalinPlCplItem,
} from "../../../hooks/academic/useObePlCpl";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import SidebarOBE from "../../../components/admin-academic/academic/obe/SidebarOBE";
import SearchableSelect from "../../../components/admin-academic/SearchableSelect";

type Matrix = Record<string, Record<string, number>>;
type Metode = "manual" | "otomatis";

const autoDistribute = (total: number, count: number): number[] => {
  if (count <= 0) return [];
  const each = parseFloat((total / count).toFixed(2));
  const dist = Array(count).fill(each);
  dist[count - 1] = parseFloat((total - each * (count - 1)).toFixed(2));
  return dist;
};

export default function ObePlCplMapping() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: graduateProfileResponse, isLoading: isHeaderLoading } = getGraduateProfileData(id!);
  const { data: mapping, isLoading: isMappingLoading } = getObePlCplMapping(id!);
  const saveMutation = useSaveObePlCplMapping();

  const [mode, setMode] = useState<"view" | "edit">("view");
  const [metode, setMetode] = useState<Metode>("manual");
  const [matrix, setMatrix] = useState<Matrix>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSalinModal, setShowSalinModal] = useState(false);

  const obeInfo = graduateProfileResponse?.header || {};
  const columns = mapping?.columns || [];
  const rows = mapping?.rows || [];

  const buildMatrixFromMapping = (): Matrix => {
    const seeded: Matrix = {};
    rows.forEach((row) => {
      seeded[row.id] = {};
      (row.bobotCpl || []).forEach((b) => {
        seeded[row.id][b.cplId] = b.bobot;
      });
    });
    return seeded;
  };

  useEffect(() => {
    if (!rows.length) return;
    setMatrix(buildMatrixFromMapping());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapping]);

  const handleBack = () => {
    navigate(AdminAcademicRoute.obeManagement.obeManagement);
  };

  const isChecked = (plId: string, cplId: string) => matrix[plId]?.[cplId] !== undefined;

  const toggleChecked = (plId: string, cplId: string) => {
    setMatrix((prev) => {
      const row = { ...(prev[plId] || {}) };
      if (row[cplId] !== undefined) {
        delete row[cplId];
      } else {
        row[cplId] = 0;
      }
      return { ...prev, [plId]: row };
    });
  };

  const handleCellChange = (plId: string, cplId: string, value: string) => {
    const num = value === "" ? 0 : Number(value);
    setMatrix((prev) => ({
      ...prev,
      [plId]: {
        ...(prev[plId] || {}),
        [cplId]: isNaN(num) ? 0 : num,
      },
    }));
  };

  const checkedColumnsFor = (plId: string) => columns.filter((col) => isChecked(plId, col.id)).map((col) => col.id);

  const displayValue = (plId: string, cplId: string): number => {
    if (metode === "otomatis") {
      const checkedIds = checkedColumnsFor(plId);
      const idx = checkedIds.indexOf(cplId);
      if (idx === -1) return 0;
      return autoDistribute(100, checkedIds.length)[idx];
    }
    return matrix[plId]?.[cplId] ?? 0;
  };

  const rowTotal = (plId: string) => {
    return columns.reduce((sum, col) => sum + (displayValue(plId, col.id) || 0), 0);
  };

  const handleMulaiUbah = () => {
    setMatrix(buildMatrixFromMapping());
    setMetode("manual");
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

    const pemetaan: { plId: string; cplId: string; bobot: number }[] = [];
    rows.forEach((row) => {
      columns.forEach((col) => {
        const bobot = displayValue(row.id, col.id);
        if (bobot > 0) pemetaan.push({ plId: row.id, cplId: col.id, bobot });
      });
    });

    saveMutation.mutate(
      { obeId: id!, pemetaan },
      {
        onSuccess: () => {
          setSuccessMessage("Pemetaan PL ke CPL berhasil disimpan.");
          setMode("view");
        },
        onError: (error: any) => {
          setErrorMessage(error?.response?.data?.message || "Gagal menyimpan pemetaan. Silakan coba lagi.");
        },
      }
    );
  };

  const isLoading = isHeaderLoading || isMappingLoading;

  const displayRows = rows.filter(
    (row) =>
      !searchTerm ||
      row.kode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.profil?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout isGreeting={false} titlePage="Pemetaan PL → CPL">
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
          <SidebarOBE id={id!} activeTab="plCpl" />

          <div className="w-full md:w-[80%] p-3">
            <div className="grid grid-cols-1 gap-2 bg-primary-green/10 p-4 md:grid-cols-2">
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Kode Prodi:</span>
                <span className="w-full text-left">{obeInfo?.kodeProgramStudi || obeInfo?.kodeProdi || "-"}</span>
              </div>
              <div className="flex justify-between md:ml-8">
                <span className="font-semibold w-full text-left">Tahun Kurikulum:</span>
                <span className="w-full text-left">{obeInfo?.tahunKurikulum || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Program Studi:</span>
                <span className="w-full text-left">{obeInfo?.programStudi || "-"}</span>
              </div>
            </div>

            {mode === "edit" && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="text-sm text-gray-600">
                  <p className="font-semibold text-gray-800 mb-1">Pilih Metode Pembobotan</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>Manual: Tentukan bobot secara mandiri pada kolom yang tersedia.</li>
                    <li>Otomatis (Rata): Cukup centang, bobot akan dibagi rata otomatis ke setiap CPL.</li>
                  </ul>
                </div>
                <div className="w-full md:w-56">
                  <SearchableSelect
                    value={metode}
                    onChange={(v) => setMetode(v as Metode)}
                    options={[
                      { value: "manual", label: "Isi Manual" },
                      { value: "otomatis", label: "Isi Otomatis" },
                    ]}
                  />
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center p-12">
                <LoadingSpinner />
              </div>
            ) : rows.length === 0 || columns.length === 0 ? (
              <div className="mt-4 p-6 text-center text-gray-500 italic border border-gray-200 rounded">
                Data Profil Lulusan atau CPL belum tersedia. Lengkapi data PL dan CPL terlebih dahulu.
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border border-gray-300 border-collapse">
                  <thead>
                    <tr className="bg-primary-green text-white text-sm">
                      <th className="p-2 border border-gray-400 text-left min-w-[100px]" rowSpan={2}>
                        Kode PL
                      </th>
                      <th className="p-2 border border-gray-400 text-left min-w-[220px]" rowSpan={2}>
                        Profil Lulusan
                      </th>
                      <th className="p-2 border border-gray-400 text-center" colSpan={columns.length}>
                        Pemetaan PL &rarr; CPL
                      </th>
                      <th className="p-2 border border-gray-400 min-w-[80px]" rowSpan={2}>
                        Total
                      </th>
                    </tr>
                    <tr className="bg-primary-green text-white text-xs">
                      {columns.map((col) => (
                        <th key={col.id} className="p-2 border border-gray-400 min-w-[70px]">
                          {col.kode}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {displayRows.map((row) => {
                      const total = rowTotal(row.id);
                      return (
                        <tr key={row.id}>
                          <td className="p-2 border border-gray-300 align-top font-semibold">{row.kode}</td>
                          <td className="p-2 border border-gray-300 align-top">{row.profil}</td>
                          {columns.map((col) => {
                            const value = displayValue(row.id, col.id);
                            if (mode === "view") {
                              return (
                                <td key={col.id} className="p-2 border border-gray-300 text-center">
                                  {value > 0 ? value : <span className="text-gray-400">-</span>}
                                </td>
                              );
                            }
                            if (metode === "otomatis") {
                              const checked = isChecked(row.id, col.id);
                              return (
                                <td key={col.id} className="p-1 border border-gray-300 text-center">
                                  <div className="flex flex-col items-center gap-0.5">
                                    <input type="checkbox" checked={checked} onChange={() => toggleChecked(row.id, col.id)} />
                                    <span className={`text-xs ${checked ? "text-gray-700 font-semibold" : "text-gray-300"}`}>
                                      {checked ? value : "-"}
                                    </span>
                                  </div>
                                </td>
                              );
                            }
                            return (
                              <td key={col.id} className="p-1 border border-gray-300 text-center">
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  className="w-16 p-1 border rounded text-center"
                                  value={matrix[row.id]?.[col.id] ?? 0}
                                  onChange={(e) => handleCellChange(row.id, col.id, e.target.value)}
                                />
                              </td>
                            );
                          })}
                          <td className={`p-2 border border-gray-300 text-center font-bold ${total === 100 ? "text-green-600" : "text-red-500"}`}>
                            {total}
                            {mode === "view" ? "" : "%"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSalinModal && (
        <SalinPlCplModal obeId={id!} onClose={() => setShowSalinModal(false)} onSuccess={(msg) => setSuccessMessage(msg)} />
      )}
    </MainLayout>
  );
}

function SalinPlCplModal({ obeId, onClose, onSuccess }: { obeId: string; onClose: () => void; onSuccess: (msg: string) => void }) {
  const { data, isLoading } = useOpsiSalinPlCpl(obeId, true);
  const salinMutation = useSalinPlCpl();
  const [sumberObeId, setSumberObeId] = useState("");
  const [preview, setPreview] = useState<PratinjauSalinPlCplItem[] | null>(null);
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
      const result = await fetchPratinjauSalinPlCpl(obeId, sumberObeId);
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
          onSuccess(`Berhasil menyalin ${result.jumlahDisalin} pemetaan PL ke CPL.`);
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
          <h4 className="text-lg font-bold text-gray-800">Salin Pemetaan PL &rarr; CPL</h4>
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
                <p className="text-sm text-gray-400 italic">Tidak ada Tahun Kurikulum lain yang punya pemetaan PL ke CPL untuk prodi ini.</p>
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
                        <th className="p-2 border border-gray-200 text-left">Kode PL</th>
                        <th className="p-2 border border-gray-200 text-left">Pemetaan CPL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((pl, idx) => (
                        <tr key={idx}>
                          <td className="p-2 border border-gray-200 font-semibold">{pl.kodePL}</td>
                          <td className="p-2 border border-gray-200">
                            {pl.pemetaanCpl.map((c) => `${c.kodeCPL} (${c.bobot})`).join(", ")}
                          </td>
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
