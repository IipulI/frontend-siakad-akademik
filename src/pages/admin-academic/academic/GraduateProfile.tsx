import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../../api/Index";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useNavigate } from "react-router-dom";
import { TableGraduateProfile } from "../../../components/Table";
import { CurriculumData, GraduateProfileData, ProgramStudi } from "../../../components/types.ts";
import { Search, ArrowLeft, Save, Plus } from "lucide-react";

// Api functions
const fetchProgramStudiData = async (): Promise<ProgramStudi[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get("/akademik/program-studi", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = response.data?.data;

  console.log("🔍 Raw program studi API data:", data);

  let programStudiData: ProgramStudi[] = [];

  if (Array.isArray(data)) {
    programStudiData = data as ProgramStudi[];
  } else if (typeof data === "object" && data !== null) {
    programStudiData = Object.values(data as Record<string, unknown>).filter((item): item is ProgramStudi => typeof item === "object" && item !== null && "id" in item);
  }

  return programStudiData;
};

const fetchCurriculumData = async (): Promise<CurriculumData[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get("/akademik/tahun-kurikulum", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = response.data?.data;

  console.log("🔍 Raw curriculum API data:", data);

  let curriculumData: CurriculumData[] = [];

  if (Array.isArray(data)) {
    curriculumData = data as CurriculumData[];
  } else if (typeof data === "object" && data !== null) {
    curriculumData = Object.values(data as Record<string, unknown>).filter((item): item is CurriculumData => typeof item === "object" && item !== null && "id" in item);
  }

  return curriculumData;
};

const fetchGraduateProfileData = async (page: number, size: number): Promise<GraduateProfileData[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get(`/akademik/profil-lulusan?page=${page}&size=${size}&sort=createdAt%2Cdesc`, { headers: { Authorization: `Bearer ${token}` } });

  const apiData = response.data.data;

  console.log("🔍 Raw graduate profile API data:", apiData);

  const formattedData = Array.isArray(apiData)
    ? apiData.map((item: any) => {
        const formatted = {
          id: item.id,
          siakProgramStudiId: item.siakProgramStudiId,
          siakTahunKurikulumId: item.siakTahunKurikulum,
          kodePl: item.kodePl,
          profil: item.profil,
          profesi: item.profesi,
          deskripsiPl: item.deskripsiPl,
        };

        return formatted;
      })
    : [];

  return formattedData;
};

const createProfile = async (data: Omit<GraduateProfileData, "id">): Promise<GraduateProfileData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const payload = {
    siakProgramStudiId: data.siakProgramStudiId,
    siakTahunKurikulumId: data.siakTahunKurikulumId,
    kodePl: data.kodePl,
    profil: data.profil,
    profesi: data.profesi,
    deskripsiPl: data.deskripsiPl,
  };

  console.log("Payload dikirim:", payload);

  const response = await Api.post("/akademik/profil-lulusan", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("Response dari API:", response.data);

  const newItemData = response.data?.data || response.data;
  return {
    id: newItemData.id,
    siakProgramStudiId: newItemData.siakProgramStudiId,
    siakTahunKurikulumId: newItemData.siakTahunKurikulumId,
    kodePl: newItemData.kodePl,
    profil: newItemData.profil,
    profesi: newItemData.profesi,
    deskripsiPl: newItemData.deskripsiPl,
  };
};

const updateProfile = async ({ id, data }: { id: string; data: Omit<GraduateProfileData, "id"> }): Promise<GraduateProfileData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const payload = {
    siakProgramStudiId: data.siakProgramStudiId,
    siakTahunKurikulumId: data.siakTahunKurikulumId,
    kodePl: data.kodePl,
    profil: data.profil,
    profesi: data.profesi,
    deskripsiPl: data.deskripsiPl,
  };

  await Api.put(`/akademik/profil-lulusan/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return { id, ...data };
};

const deleteProfile = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  await Api.delete(`/akademik/profil-lulusan/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const GraduateProfile: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // State
  const [programStudiData, setProgramStudiData] = useState<ProgramStudi[]>([]);
  const [curriculumData, setCurriculumData] = useState<CurriculumData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState<GraduateProfileData | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState("");

  // Queries
  const {
    data: profileData = [],
    isLoading: loading,
    error: profileError,
    refetch: refetchProfileData,
  } = useQuery({
    queryKey: ["profileData", currentPage, itemsPerPage],
    queryFn: () => fetchGraduateProfileData(currentPage, itemsPerPage),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: programStudi = [],
    isLoading: loadingProgramStudi,
    error: programStudiError,
  } = useQuery({
    queryKey: ["programStudiData"],
    queryFn: fetchProgramStudiData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: curriculum = [],
    isLoading: loadingCurriculum,
    error: curriculumError,
  } = useQuery({
    queryKey: ["curriculumData"],
    queryFn: fetchCurriculumData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileData"] });
      handleReset();
      setErrorMessage("");
    },
    onError: (error: any) => {
      console.error("Gagal menambah data:", error);
      handleMutationError(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileData"] });
      handleReset();
      setErrorMessage("");
    },
    onError: (error: any) => {
      console.error("Gagal mengupdate data:", error);
      handleMutationError(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileData"] });
      setErrorMessage("");
    },
    onError: (error: any) => {
      console.error("Gagal menghapus data:", error);
      handleMutationError(error);
    },
  });

  // Helper function for error handling
  const handleMutationError = (error: any) => {
    if (error.response?.status === 400) {
      setErrorMessage("Data tidak valid. Periksa kembali input Anda.");
    } else if (error.response?.status === 401) {
      setErrorMessage("Token tidak valid. Silakan login ulang.");
    } else if (error.response?.data?.message) {
      setErrorMessage(`Error: ${error.response.data.message}`);
    } else if (error.message) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  // Event handlers
  const handleEdit = (id: string) => {
    const selectedData = profileData.find((item) => item.id === id);
    if (selectedData) {
      setCurrentData(selectedData);
      setIsEditing(true);
      setIsAdding(false);
      setErrorMessage("");
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setCurrentData({
      id: "",
      siakProgramStudiId: "",
      siakTahunKurikulumId: "",
      kodePl: "",
      profil: "",
      profesi: "",
      deskripsiPl: "",
    });
    setErrorMessage("");
  };

  const isFormValid = () => {
    return !!(currentData?.kodePl && currentData?.profil && currentData?.profesi && currentData?.deskripsiPl);
  };

  const handleSave = async () => {
    if (!currentData || !isFormValid()) {
      setErrorMessage("Semua kolom harus diisi.");
      return;
    }

    setErrorMessage("");

    const dataToSave = {
      siakProgramStudiId: currentData.siakProgramStudiId,
      siakTahunKurikulumId: currentData.siakTahunKurikulumId,
      kodePl: currentData.kodePl,
      profil: currentData.profil,
      profesi: currentData.profesi,
      deskripsiPl: currentData.deskripsiPl,
    };

    if (isEditing && currentData.id) {
      updateMutation.mutate({ id: currentData.id, data: dataToSave });
    } else if (isAdding) {
      createMutation.mutate(dataToSave);
    }

    setCurrentData(null);
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

  // const handleRefresh = () => {
  //   queryClient.invalidateQueries({ queryKey: ["profileData"] });
  //   queryClient.invalidateQueries({ queryKey: ["programStudiData"] });
  //   queryClient.invalidateQueries({ queryKey: ["curriculumData"] });
  // };

  // Loading state
  const isLoading = loading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <MainLayout isGreeting={false} titlePage="Profil Lulusan" className="">
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex flex-col items-center justify-between mb-10 md:flex-row gap-4">
          <div className="flex items-center ">
            <button onClick={handleBack} className="flex items-center bg-primary-blueSoft text-white px-2 py-3 rounded-l-md">
              <ArrowLeft className="mr-2" size={16} />
            </button>
            <div className="flex items-center">
              <input type="search" placeholder="Cari Mata Kuliah" className="px-3 py-2 border border-black/50  w-64" />
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
            <button onClick={handleSave} className="bg-primary-blueSoft text-white px-4 py-2 rounded flex items-center">
              <Save className="mr-2" size={16} />
              Simpan
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar Menu */}
          <div className="w-full md:w-[20%] h-50 text-white p-3 space-y-2">
            <div className="flex items-center bg-[#116E63]/60  mb-1 text-black cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.obeManagement.graduateProfile)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p className="text-black font-semibold">Profil Lulusan</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.obeManagement.cpl)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>CPL </p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.obeManagement.cpmk)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>CPMK</p>
            </div>
          </div>

          {/* Detail Data Profil Lulusan */}
          <div className="w-full md:w-[80%] p-3">
            <div className="grid grid-cols-1 gap-2 bg-primary-green/10 p-4 md:grid-cols-2">
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Kode Prodi:</span>
                <span className="w-full text-left ">FF22</span>
              </div>
              <div className="flex justify-between ml-0 md:ml-8 ">
                <span className="font-semibold w-full text-left">Tahun Kurikulum:</span>
                <span className="w-full text-left">{selectedYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Program Studi:</span>
                <span className="w-full text-left">Pemrograman Lanjut</span>
              </div>
              <div className="flex justify-between  ml-0 md:ml-8">
                <span className="font-semibold w-full text-left">Ketua Prodi:</span>
                <span className="w-full text-left">1</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col  gap-2 md:flex-row md:items-center">
              <h2 className="text-lg font-semibold">Tahun Kurikulum</h2>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="border border-black/50 rounded-md px-2 py-1 w-full md:w-40">
                <option value="">Tahun Kurikulum</option>
                {curriculum.map((item) => (
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

            {errorMessage && <p className="text-red-600 mt-4 mx-4">{errorMessage}</p>}
            {isLoading && <p className="text-blue-600 mt-2 mx-4">Loading...</p>}
            {loadingCurriculum && <p className="text-blue-600 mt-2 mx-4">Loading periode curriculum...</p>}
            {loadingProgramStudi && <p className="text-blue-600 mt-2 mx-4">Loading program studi...</p>}

            <div className="mt-4 overflow-x-auto">
              <TableGraduateProfile
                data={profileData}
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
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GraduateProfile;
