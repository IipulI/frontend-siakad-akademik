import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Pencil, X, Search, RefreshCw } from "lucide-react";
import { useDetailKurikulum, useSaveAturanObeBulk, ProdiSetting } from "../../../hooks/academic/useTahunKurikulumDetail";
import { getJenjang } from "../../../hooks/academic/useJenjang";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SearchableSelect from "../../../components/admin-academic/SearchableSelect";
import TahunKurikulumSidebar from "../../../components/admin-academic/academic/obe/TahunKurikulumSidebar";
import { AdminAcademicRoute } from "../../../types/VarRoutes";

type LocalSettings = Record<string, ProdiSetting>;

export default function ObeTahunKurikulumDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: jenjangData = [] } = getJenjang();
  const [jenjangId, setJenjangId] = useState("");

  useEffect(() => {
    if (jenjangData.length > 0 && !jenjangId) {
      const s1 = jenjangData.find((j: any) => j.jenjang === "S1");
      setJenjangId((s1 || jenjangData[0]).id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jenjangData]);

  const [searchTerm, setSearchTerm] = useState("");
  const [jenisFilter, setJenisFilter] = useState("all");
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [localSettings, setLocalSettings] = useState<LocalSettings>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { data, isLoading } = useDetailKurikulum(id!, jenjangId, { search: searchTerm, jenisKurikulum: jenisFilter }, !!id && !!jenjangId);
  const saveMutation = useSaveAturanObeBulk();

  const rows = data?.listProdi || [];

  const buildSettingsFromData = (): LocalSettings => {
    const seeded: LocalSettings = {};
    rows.forEach((row) => {
      seeded[row.programStudiId] = {
        programStudiId: row.programStudiId,
        isObe: row.isObe,
        targetCpl: row.targetCpl || 0,
        targetCpmk: row.targetCpmk || 0,
      };
    });
    return seeded;
  };

  useEffect(() => {
    if (mode === "edit") setLocalSettings(buildSettingsFromData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleBack = () => navigate(AdminAcademicRoute.obeManagement.tahunKurikulum);

  const handleMulaiEdit = () => {
    setLocalSettings(buildSettingsFromData());
    setErrorMessage("");
    setSuccessMessage("");
    setMode("edit");
  };

  const handleBatal = () => {
    setMode("view");
    setErrorMessage("");
  };

  const updateSetting = (programStudiId: string, patch: Partial<ProdiSetting>) => {
    setLocalSettings((prev) => ({
      ...prev,
      [programStudiId]: { ...prev[programStudiId], programStudiId, ...patch },
    }));
  };

  const handleSimpan = () => {
    setErrorMessage("");
    setSuccessMessage("");
    const prodiSettings = Object.values(localSettings);
    saveMutation.mutate(
      { tahunKurikulumId: id!, prodiSettings },
      {
        onSuccess: () => {
          setSuccessMessage("Aturan OBE Program Studi berhasil disimpan.");
          setMode("view");
        },
        onError: (error: any) => setErrorMessage(error?.response?.data?.message || "Gagal menyimpan. Silakan coba lagi."),
      }
    );
  };

  const header = data?.header;

  return (
    <MainLayout isGreeting={false} titlePage="Tahun Kurikulum">
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
            {mode === "view" ? (
              <button onClick={handleMulaiEdit} className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer">
                <Pencil className="mr-2" size={16} />
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSimpan}
                  disabled={saveMutation.isPending}
                  className="bg-primary-green text-white px-4 py-2 rounded flex items-center disabled:opacity-50 cursor-pointer"
                >
                  <Save className="mr-2" size={16} />
                  {saveMutation.isPending ? "Menyimpan..." : "Simpan"}
                </button>
                <button onClick={handleBatal} className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer">
                  <X className="mr-2" size={16} />
                  Batal
                </button>
              </>
            )}
          </div>
        </div>

        {errorMessage && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>}
        {successMessage && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</div>}

        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <TahunKurikulumSidebar tahunKurikulumId={id!} activeSection="tahun" />

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
                    <span className="font-semibold w-full text-left">Tahun Kurikulum:</span>
                    <span className="w-full text-left">{header.tahun}</span>
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

                <h3 className="text-lg font-bold text-primary-green border-b-2 border-primary-green pb-1 mb-4">Daftar Program Studi</h3>

                <div className={`mb-4 p-3 border rounded-md flex gap-3 text-sm ${mode === "edit" ? "bg-orange-50 border-orange-200 text-orange-800" : "bg-blue-50 border-blue-200 text-blue-800"}`}>
                  <span className="font-bold">i</span>
                  {mode === "edit" ? (
                    <p>Anda perlu memilih program studi yang menggunakan kurikulum OBE atau tidak sebelum melanjutkan.</p>
                  ) : (
                    <p>Secara default data yang tampil menggunakan kurikulum non OBE. Silakan atur kurikulum terlebih dahulu sesuai kebutuhan Anda.</p>
                  )}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
                  <div className="flex items-center w-full md:w-auto">
                    <input
                      type="text"
                      placeholder="Cari nama program studi"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="p-2 border border-gray-300 rounded-l-md text-sm outline-none focus:ring-1 focus:ring-primary-green w-72"
                    />
                    <button onClick={() => setSearchTerm("")} className="bg-primary-blueDark text-white p-2.5 rounded-r-md flex items-center justify-center">
                      <RefreshCw size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-semibold text-primary-blueDark">Jenjang</label>
                      <div className="w-56">
                        <SearchableSelect
                          value={jenjangId}
                          onChange={setJenjangId}
                          searchPlaceholder="Cari jenjang..."
                          options={jenjangData.map((j: any) => ({ value: j.id, label: `${j.jenjang} - ${j.nama}` }))}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-semibold text-primary-blueDark">Jenis Kurikulum</label>
                      <div className="w-40">
                        <SearchableSelect
                          value={jenisFilter}
                          onChange={setJenisFilter}
                          options={[
                            { value: "all", label: "-- Semua --" },
                            { value: "OBE", label: "OBE" },
                            { value: "Non OBE", label: "Non OBE" },
                          ]}
                        />
                      </div>
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
                          <th className="p-2 border border-gray-400" rowSpan={2}>Kode Prodi</th>
                          <th className="p-2 border border-gray-400 text-left" rowSpan={2}>Nama Program Studi</th>
                          <th className="p-2 border border-gray-400" rowSpan={2}>Jenis Kurikulum</th>
                          <th className="p-2 border border-gray-400" colSpan={2}>Target Capaian</th>
                        </tr>
                        <tr className="bg-primary-green text-white text-center text-xs">
                          <th className="p-2 border border-gray-400">CPL</th>
                          <th className="p-2 border border-gray-400">CPMK</th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {rows.length > 0 ? (
                          rows.map((row) => {
                            const setting = localSettings[row.programStudiId];
                            const isObe = mode === "edit" ? setting?.isObe ?? row.isObe : row.isObe;
                            return (
                              <tr key={row.programStudiId} className="hover:bg-gray-50">
                                <td className="p-2 border border-gray-200">{row.kodeProdi}</td>
                                <td className="p-2 border border-gray-200 text-left">{row.namaProgramStudi}</td>
                                <td className="p-2 border border-gray-200">
                                  {mode === "edit" ? (
                                    <label className="flex items-center justify-center gap-1.5">
                                      <input
                                        type="checkbox"
                                        checked={isObe}
                                        onChange={(e) => updateSetting(row.programStudiId, { isObe: e.target.checked })}
                                      />
                                      OBE
                                    </label>
                                  ) : (
                                    <span
                                      className={`inline-block px-3 py-1 rounded text-xs font-semibold border ${
                                        row.isObe ? "bg-blue-50 text-primary-blueSoft border-blue-200" : "bg-gray-50 text-gray-500 border-gray-200"
                                      }`}
                                    >
                                      {row.jenisKurikulum}
                                    </span>
                                  )}
                                </td>
                                <td className="p-2 border border-gray-200">
                                  {mode === "edit" ? (
                                    <input
                                      type="number"
                                      min={0}
                                      disabled={!isObe}
                                      className="w-24 border rounded p-1 text-center disabled:bg-gray-100"
                                      value={setting?.targetCpl ?? 0}
                                      onChange={(e) => updateSetting(row.programStudiId, { targetCpl: Number(e.target.value) || 0 })}
                                    />
                                  ) : (
                                    row.targetCpl.toFixed(2).replace(".", ",")
                                  )}
                                </td>
                                <td className="p-2 border border-gray-200">
                                  {mode === "edit" ? (
                                    <input
                                      type="number"
                                      min={0}
                                      disabled={!isObe}
                                      className="w-24 border rounded p-1 text-center disabled:bg-gray-100"
                                      value={setting?.targetCpmk ?? 0}
                                      onChange={(e) => updateSetting(row.programStudiId, { targetCpmk: Number(e.target.value) || 0 })}
                                    />
                                  ) : (
                                    row.targetCpmk.toFixed(2).replace(".", ",")
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-6 text-center text-gray-400 italic">
                              Tidak ada Program Studi untuk jenjang ini.
                            </td>
                          </tr>
                        )}
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
