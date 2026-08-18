import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { TableGraduateProfile } from "../../../components/Table";
import { Search, ArrowLeft, Save, Plus, ChevronDown, Copy, Upload, Download, X } from "lucide-react";
import {
  getGraduateProfileData,
  useAddGraduateProfile,
  useDeleteGraduateProfile,
  useUpdateGraduateProfile,
  useOpsiSalinPL,
  useSalinDataPL,
  downloadTemplatePL,
  downloadDataPL,
  useImportDataPL,
  GraduateProfileData,
} from "../../../hooks/academic/useGraduateProfile.ts";
import LoadingSpinner from "../../../components/LoadingSpinner.tsx";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import SidebarOBE from "../../../components/admin-academic/academic/obe/SidebarOBE.tsx";
import SearchableSelect from "../../../components/admin-academic/SearchableSelect";
import { useSetBreadcrumbLabel } from "../../../context/BreadcrumbLabelContext";

const DetailOBE: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // State
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState<GraduateProfileData | null>(
    null
  );
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAksiMenu, setShowAksiMenu] = useState(false);
  const [showSalinModal, setShowSalinModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Queries
  const {
    data: graduateProfileResponse,
    isLoading: isGraduateProfileLoading,
    error: graduateProfileError,
  } = getGraduateProfileData(id!);
  const obeHeader = graduateProfileResponse?.header;
  useSetBreadcrumbLabel(
    id,
    obeHeader ? `${obeHeader.programStudi || ""} - ${obeHeader.tahunKurikulum || ""}`.trim() : undefined
  );

  // Mutations
  const createMutation = useAddGraduateProfile();
  const updateMutation = useUpdateGraduateProfile();
  const deleteMutation = useDeleteGraduateProfile();

  // Loading states
  if (isGraduateProfileLoading) {
    return <LoadingSpinner />;
  }

  // Error states
  if (graduateProfileError) {
    return <div className="text-red-500">Gagal memuat profil lulusan</div>;
  }

  const graduateProfileData = graduateProfileResponse?.dataPl || [];
  const obeInfo = graduateProfileResponse?.header || {};

  // Event handlers
  const handleEdit = (editId: string) => {
    const selectedData = graduateProfileData.find(
      (item) => item.id === editId
    );
    if (selectedData) {
      setCurrentData(selectedData);
      setIsEditing(true);
      setIsAdding(false);
      setErrorMessage("");
    }
  };

  const handleDelete = (deleteId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      deleteMutation.mutate(
        { id: deleteId, obeId: id! },
        {
          onSuccess: () => {
            setErrorMessage("");
          },
          onError: (error) => {
            console.error("Delete error:", error);
            setErrorMessage("Gagal menghapus data. Silakan coba lagi.");
          },
        }
      );
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setCurrentData({
      id: "",
      kode: "",
      profil: "",
      profesi: "",
      deskripsi: "",
      deskripsiEn: "",
    });
    setErrorMessage("");
  };

  const isFormValid = () => {
    return !!(
      currentData?.kode?.trim() &&
      currentData?.profil?.trim() &&
      currentData?.deskripsi?.trim()
    );
  };

  const handleSave = async () => {
    if (!currentData || !isFormValid()) {
      setErrorMessage("Kode, Profil Lulusan, dan Deskripsi harus diisi.");
      return;
    }

    setErrorMessage("");

    const dataToSave = {
      siakObeId: id!,
      kode: currentData.kode.trim(),
      profil: currentData.profil.trim(),
      deskripsi: currentData.deskripsi.trim(),
      ...(currentData.profesi?.trim() ? { profesi: currentData.profesi.trim() } : {}),
      ...(currentData.deskripsiEn?.trim() ? { deskripsiEn: currentData.deskripsiEn.trim() } : {}),
    };

    const onSuccessCallback = () => {
      setCurrentData(null);
      setIsAdding(false);
      setIsEditing(false);
      setErrorMessage("");
    };

    const onErrorCallback = (error: any) => {
      console.error("Save error:", error);
      if (error.response?.data?.message) {
        setErrorMessage(`Error: ${error.response.data.message}`);
      } else {
        setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
      }
    };

    if (isEditing && currentData.id) {
      const { siakObeId, ...updateData } = dataToSave;
      updateMutation.mutate(
        {
          id: currentData.id,
          obeId: id!,
          data: updateData,
        },
        {
          onSuccess: onSuccessCallback,
          onError: onErrorCallback,
        }
      );
    } else if (isAdding) {
      createMutation.mutate(dataToSave, {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
      });
    }
  };

  const handleReset = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentData(null);
    setErrorMessage("");
  };

  const handleBack = () => {
    navigate(AdminAcademicRoute.obeManagement.obeManagement);
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter data based on search term
  const displayData = graduateProfileData.filter(
    (item) =>
      item.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.profil.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.profesi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state for mutations
  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <MainLayout isGreeting={false} titlePage="Manajemen PL">
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex flex-col items-center justify-between mb-10 md:flex-row gap-4">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="flex items-center bg-primary-yellow text-white px-2 py-3 rounded-l-md"
            >
              <ArrowLeft className="mr-2" size={16} />
            </button>
            <div className="flex items-center">
              <input
                type="search"
                placeholder="Cari Kurikulum Program Studi"
                className="px-3 py-2 border border-black/50 w-64"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="bg-primary-blueSoft px-3 py-3 rounded-r-md">
                <Search color="white" size={20} />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleBack}
              className="bg-primary-blueSoft text-white px-4 py-2 rounded flex items-center cursor-pointer"
            >
              <ArrowLeft className="mr-2" size={16} />
              Kembali ke Daftar
            </button>
            <button
              onClick={handleAdd}
              disabled={isAdding || isEditing}
              className="bg-primary-green text-white px-4 py-2 rounded flex items-center disabled:opacity-50 cursor-pointer"
            >
              <Plus className="mr-2" size={16} />
              Tambah Data
            </button>
            <div className="relative">
              <button
                onClick={() => setShowAksiMenu((prev) => !prev)}
                className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer"
              >
                Aksi <ChevronDown className={`ml-2 transition-transform ${showAksiMenu ? "rotate-180" : ""}`} size={16} />
              </button>
              {showAksiMenu && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1">
                  <button
                    onClick={() => { setShowAksiMenu(false); setShowImportModal(true); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Import Data
                  </button>
                  <button
                    onClick={() => { setShowAksiMenu(false); setShowSalinModal(true); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Salin Data
                  </button>
                </div>
              )}
            </div>
            {(isAdding || isEditing) && (
              <button
                onClick={handleSave}
                disabled={!isFormValid() || isLoading}
                className="bg-primary-blueSoft text-white px-4 py-2 rounded flex items-center disabled:opacity-50"
              >
                <Save className="mr-2" size={16} />
                {isLoading ? "Menyimpan..." : "Simpan"}
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row">
          {/* Shared Sidebar Menu */}
          <SidebarOBE id={id!} activeTab="pl" />

          {/* Detail Data Profil Lulusan */}
          <div className="w-full md:w-[80%] p-3">
            <div className="grid grid-cols-1 gap-2 bg-primary-green/10 p-4 md:grid-cols-2">
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">
                  Kode Prodi:
                </span>
                <span className="w-full text-left">
                  {obeInfo?.kodeProdi || "-"}
                </span>
              </div>
              <div className="flex justify-between ml-0 md:ml-8">
                <span className="font-semibold w-full text-left">
                  Tahun Kurikulum:
                </span>
                <span className="w-full text-left">
                  {obeInfo?.tahunKurikulum || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">
                  Program Studi:
                </span>
                <span className="w-full text-left">
                  {obeInfo?.programStudi || "-"}
                </span>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <TableGraduateProfile
                data={displayData}
                tableHead={[
                  "Kode PL",
                  "Profil Lulusan",
                  "Profesi",
                  "Deskripsi",
                  "Deskripsi (EN)",
                  "Aksi",
                ]}
                error="Data tidak ditemukan."
                onEdit={handleEdit}
                onDelete={handleDelete}
                isEditing={isEditing}
                currentData={currentData}
                onSave={handleSave}
                onReset={handleReset}
                onInputChange={handleInputChange}
                isAdding={isAdding}
                isFormValid={isFormValid}
              />
            </div>

            {/* Info */}
            <div className="mt-4 mb-2 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded text-xs">
              <p className="font-semibold mb-1">Profil Lulusan:</p>
              <p>
                Cerminan pencapaian kualitas yang diharapkan dari lulusan, meliputi keterampilan, pengetahuan, dan sikap yang diharapkan dimiliki
                ketika menyelesaikan program pendidikan tertentu.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showSalinModal && (
        <SalinDataPLModal obeId={id!} onClose={() => setShowSalinModal(false)} onSuccess={(msg) => setSuccessMessage(msg)} />
      )}
      {showImportModal && (
        <ImportDataPLModal obeId={id!} onClose={() => setShowImportModal(false)} onSuccess={(msg) => setSuccessMessage(msg)} />
      )}
    </MainLayout>
  );
};

function SalinDataPLModal({ obeId, onClose, onSuccess }: { obeId: string; onClose: () => void; onSuccess: (msg: string) => void }) {
  const { data, isLoading } = useOpsiSalinPL(obeId, true);
  const salinMutation = useSalinDataPL();
  const [sumberObeId, setSumberObeId] = useState("");
  const [error, setError] = useState("");

  const handleSalin = () => {
    if (!sumberObeId) {
      setError("Pilih Tahun Kurikulum asal terlebih dahulu.");
      return;
    }
    setError("");
    salinMutation.mutate(
      { obeId, sumberObeId },
      {
        onSuccess: (result) => {
          onSuccess(`Berhasil menyalin ${result.jumlahDisalin} data PL.`);
          onClose();
        },
        onError: (err: any) => setError(err?.response?.data?.message || "Gagal menyalin data PL."),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h4 className="text-lg font-bold text-gray-800">Salin Data PL</h4>
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
                <p className="text-sm text-gray-400 italic">Tidak ada Tahun Kurikulum lain yang punya data PL untuk prodi ini.</p>
              ) : (
                <SearchableSelect
                  value={sumberObeId}
                  onChange={setSumberObeId}
                  placeholder="-- Pilih Tahun Kurikulum --"
                  searchPlaceholder="Cari tahun kurikulum..."
                  options={data.opsiSumber.map((o) => ({ value: o.obeId, label: `${o.tahunKurikulum} (${o.jumlahPL} data PL)` }))}
                />
              )}
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={onClose} className="bg-primary-yellow text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
                  <X size={14} /> Batalkan
                </button>
                <button
                  onClick={handleSalin}
                  disabled={salinMutation.isPending || data.opsiSumber.length === 0}
                  className="bg-primary-green text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
                >
                  <Copy size={14} /> {salinMutation.isPending ? "Menyalin..." : "Salin Data"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ImportDataPLModal({ obeId, onClose, onSuccess }: { obeId: string; onClose: () => void; onSuccess: (msg: string) => void }) {
  const importMutation = useImportDataPL();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState<"template" | "data" | null>(null);

  const handleDownloadTemplate = async () => {
    setIsDownloading("template");
    try {
      await downloadTemplatePL(obeId);
    } catch (err: any) {
      setError(err?.message || "Gagal mengunduh template.");
    } finally {
      setIsDownloading(null);
    }
  };

  const handleDownloadData = async () => {
    setIsDownloading("data");
    try {
      await downloadDataPL(obeId);
    } catch (err: any) {
      setError(err?.message || "Gagal mengunduh data PL.");
    } finally {
      setIsDownloading(null);
    }
  };

  const handleImport = () => {
    if (!file) {
      setError("Pilih file Excel terlebih dahulu.");
      return;
    }
    setError("");
    importMutation.mutate(
      { obeId, file },
      {
        onSuccess: () => {
          onSuccess("Data PL berhasil diimport.");
          onClose();
        },
        onError: (err: any) => setError(err?.response?.data?.message || "Gagal mengimport data PL."),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h4 className="text-lg font-bold text-gray-800">Import Data PL</h4>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded text-sm">
            <p className="mb-2">Gunakan template ini untuk menambahkan banyak data PL sekaligus.</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Unduh template dalam format Excel dengan klik tombol Unduh Template.</li>
              <li>Isi data sesuai dengan format dan kolom yang sudah disediakan pada template (dapat dibuka menggunakan Microsoft Excel atau sejenisnya).</li>
              <li>Unggah kembali file Excel yang telah diisi pada form yang telah tersedia.</li>
            </ol>
            <p className="mt-2 font-semibold">Catatan penting:</p>
            <p>Jika Anda ingin mengunduh data PL yang sudah ada di sistem, silakan klik tombol Unduh Data PL. Unduh Template hanya berisi format kosong.</p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{error}</div>}

          <div className="flex gap-2 mb-4">
            <button
              onClick={handleDownloadTemplate}
              disabled={isDownloading !== null}
              className="bg-primary-blueSoft text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
            >
              <Download size={14} /> {isDownloading === "template" ? "Mengunduh..." : "Unduh Template"}
            </button>
            <button
              onClick={handleDownloadData}
              disabled={isDownloading !== null}
              className="bg-primary-blueSoft text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
            >
              <Download size={14} /> {isDownloading === "data" ? "Mengunduh..." : "Unduh Data PL"}
            </button>
          </div>

          <label className="text-sm font-semibold text-gray-700 block mb-1">Unggah File</label>
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 border-dashed rounded-md p-2 text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">Format file Excel (.xlsx) dengan maks. ukuran 2 MB</p>

          <div className="flex justify-end gap-2 mt-6">
            <button onClick={onClose} className="bg-primary-yellow text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
              <X size={14} /> Batalkan
            </button>
            <button
              onClick={handleImport}
              disabled={importMutation.isPending}
              className="bg-primary-green text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
            >
              <Upload size={14} /> {importMutation.isPending ? "Mengimport..." : "Import Data"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailOBE;
