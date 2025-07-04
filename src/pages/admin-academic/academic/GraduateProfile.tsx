import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TableGraduateProfile } from "../../../components/Table";
import { GraduateProfileData } from "../../../components/types.ts";
import { Search, ArrowLeft, Save, Plus } from "lucide-react";
import { getProdi } from "../../../hooks/academic/useProdi.ts";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear.ts";
import { getGraduateProfileData, useAddGraduateProfile, useDeleteGraduateProfile, useUpdateGraduateProfile } from "../../../hooks/academic/useGraduateProfile.ts";
import LoadingSpinner from "../../../components/LoadingSpinner.tsx";
import { AdminAcademicRoute } from "../../../types/VarRoutes";

const GraduateProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const obeDataFromState = location.state?.obeData;

  // State
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState<GraduateProfileData | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState("");
  const [filteredGraduateData, setFilteredGraduateData] = useState<GraduateProfileData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Queries
  const { data: programStudiData = [], isLoading: isProgramStudiLoading, error: programStudiError } = getProdi();
  const { data: curriculumData = [], isLoading: isCurriculumLoading, error: curriculumError } = getCurriculumYear();
  const { data: graduateProfileData = [], isLoading: isGraduateProfileLoading, error: graduateProfileError } = getGraduateProfileData(currentPage, itemsPerPage);

  // Mutations
  const createMutation = useAddGraduateProfile();
  const updateMutation = useUpdateGraduateProfile();
  const deleteMutation = useDeleteGraduateProfile();

  // Get OBE info
  const obeInfo = obeDataFromState || {
    kodeProgramStudi: "Loading...",
    programStudi: "Loading...",
    tahunKurikulum: "Loading...",
  };

  // Filter data berdasarkan program studi ID dari params
  useEffect(() => {
    if (graduateProfileData && obeInfo.programStudi) {
      const filtered = graduateProfileData.filter((item: GraduateProfileData) => item.programStudi?.toLowerCase() === obeInfo.programStudi.toLowerCase());
      setFilteredGraduateData(filtered);
    }
  }, [graduateProfileData, obeInfo.programStudi]);

  // Update status di parent component (OBE) ketika ada perubahan data
  useEffect(() => {
    if (id) {
      const hasData = filteredGraduateData.length > 0;

      // Update localStorage
      const existingStatuses = JSON.parse(localStorage.getItem("graduateProfileStatuses") || "{}");
      existingStatuses[id] = hasData;
      localStorage.setItem("graduateProfileStatuses", JSON.stringify(existingStatuses));

      // Trigger custom event
      window.dispatchEvent(
        new CustomEvent("graduateProfileStatusUpdated", {
          detail: { programStudiId: id, hasData },
        })
      );
    }
  }, [filteredGraduateData, id]);

  // Loading states
  if (isProgramStudiLoading || isCurriculumLoading || isGraduateProfileLoading) {
    return <LoadingSpinner />;
  }

  // Error states
  if (programStudiError) {
    return <div className="text-red-500">Gagal memuat program studi</div>;
  }
  if (curriculumError) {
    return <div className="text-red-500">Gagal memuat tahun kurikulum</div>;
  }
  if (graduateProfileError) {
    return <div className="text-red-500">Gagal memuat profil lulusan</div>;
  }

  // Event handlers
  const handleEdit = (editId: string) => {
    const selectedData = filteredGraduateData.find((item) => item.id === editId);
    if (selectedData) {
      setCurrentData(selectedData);
      setIsEditing(true);
      setIsAdding(false);
      setErrorMessage("");
    }
  };

  const handleDelete = (deleteId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          // Status akan otomatis terupdate melalui useEffect
        },
        onError: (error) => {
          console.error("Delete error:", error);
          setErrorMessage("Gagal menghapus data. Silakan coba lagi.");
        },
      });
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setCurrentData({
      id: "",
      programStudi: "",
      siakProgramStudiId: id || "",
      siakTahunKurikulumId: selectedYear || "",
      kodePl: "",
      profil: "",
      profesi: "",
      deskripsiPl: "",
    });
    setErrorMessage("");
  };

  const isFormValid = () => {
    return !!(currentData?.kodePl?.trim() && currentData?.profil?.trim() && currentData?.profesi?.trim() && currentData?.deskripsiPl?.trim() && currentData?.siakTahunKurikulumId);
  };

  const handleSave = async () => {
    if (!currentData || !isFormValid()) {
      setErrorMessage("Semua kolom harus diisi, termasuk tahun kurikulum.");
      return;
    }

    setErrorMessage("");

    const dataToSave = {
      siakProgramStudiId: id || currentData.siakProgramStudiId,
      siakTahunKurikulumId: currentData.siakTahunKurikulumId,
      kodePl: currentData.kodePl.trim(),
      profil: currentData.profil.trim(),
      profesi: currentData.profesi.trim(),
      deskripsiPl: currentData.deskripsiPl.trim(),
    };

    const onSuccessCallback = () => {
      setCurrentData(null);
      setIsAdding(false);
      setIsEditing(false);
      setErrorMessage("");
    };

    const onErrorCallback = (error: any) => {
      console.error("Save error:", error);
      if (error.response?.status === 400) {
        setErrorMessage("Data tidak valid. Periksa kembali input Anda.");
      } else if (error.response?.status === 401) {
        setErrorMessage("Token tidak valid. Silakan login ulang.");
      } else if (error.response?.data?.message) {
        setErrorMessage(`Error: ${error.response.data.message}`);
      } else {
        setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
      }
    };

    if (isEditing && currentData.id) {
      updateMutation.mutate(
        { id: currentData.id, data: dataToSave },
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleNavigation = (path: string) => {
    navigate(path, { state: { obeData: obeDataFromState } });
  };

  // Filter data based on search term
  const displayData = filteredGraduateData.filter(
    (item) => item.kodePl.toLowerCase().includes(searchTerm.toLowerCase()) || item.profil.toLowerCase().includes(searchTerm.toLowerCase()) || item.profesi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state for mutations
  const isLoading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <MainLayout isGreeting={false} titlePage="Profil Lulusan">
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex flex-col items-center justify-between mb-10 md:flex-row gap-4">
          <div className="flex items-center">
            <button onClick={handleBack} className="flex items-center bg-primary-blueSoft text-white px-2 py-3 rounded-l-md">
              <ArrowLeft className="mr-2" size={16} />
            </button>
            <div className="flex items-center">
              <input type="search" placeholder="Cari Profil Lulusan" className="px-3 py-2 border border-black/50 w-64" value={searchTerm} onChange={handleSearchChange} />
              <button className="bg-primary-yellow px-3 py-3 rounded-r-md">
                <Search color="white" size={20} />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleBack} className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer">
              <ArrowLeft className="mr-2" size={16} />
              Kembali ke Daftar
            </button>
            {(isAdding || isEditing) && (
              <button onClick={handleSave} disabled={!isFormValid() || isLoading} className="bg-primary-blueSoft text-white px-4 py-2 rounded flex items-center disabled:opacity-50">
                <Save className="mr-2" size={16} />
                {isLoading ? "Menyimpan..." : "Simpan"}
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>}

        <div className="flex flex-col md:flex-row">
          {/* Sidebar Menu */}
          <div className="w-full md:w-[20%] h-50 text-white p-3 space-y-2">
            <div className="flex items-center bg-[#116E63]/60 mb-1 text-black cursor-pointer">
              <div className="w-1.5 h-10 bg-primary-green mr-3"></div>
              <p className="text-black font-semibold">Profil Lulusan</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => navigate(AdminAcademicRoute.obeManagement.cpl, { state: { obeData: obeDataFromState } })}>
              <div className="w-1.5 h-10 bg-primary-green mr-3"></div>
              <p>CPL</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.obeManagement.cpmk)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3"></div>
              <p>CPMK</p>
            </div>
          </div>

          {/* Detail Data Profil Lulusan */}
          <div className="w-full md:w-[80%] p-3">
            <div className="grid grid-cols-1 gap-2 bg-primary-green/10 p-4 md:grid-cols-2">
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Kode Prodi:</span>
                <span className="w-full text-left">{obeInfo?.kodeProgramStudi}</span>
              </div>
              <div className="flex justify-between ml-0 md:ml-8">
                <span className="font-semibold w-full text-left">Tahun Kurikulum:</span>
                <span className="w-full text-left">{obeInfo?.tahunKurikulum}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Program Studi:</span>
                <span className="w-full text-left">{obeInfo?.programStudi}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center">
              <h2 className="text-lg font-semibold">Tahun Kurikulum</h2>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="border border-black/50 rounded-md px-2 py-1 w-full md:w-40">
                <option value="">Pilih Tahun Kurikulum</option>
                {curriculumData.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.tahun}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAdd}
                disabled={isAdding || isEditing}
                className={`ml-auto w-full md:w-56 bg-primary-green text-white px-4 py-2 rounded flex items-center hover:bg-primary-blue ${isAdding || isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Plus className="mr-2" size={16} />
                Tambah Profil Lulusan
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <TableGraduateProfile
                data={displayData}
                tableHead={["Kode PL", "Profil Lulusan", "Profesi", "Deskripsi", "Aksi"]}
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
            <div className="mt-4 text-sm text-gray-600">
              <p>Program Studi ID: {id}</p>
              <p>Total Data: {filteredGraduateData.length}</p>
              <p>Data Ditampilkan: {displayData.length}</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GraduateProfile;
