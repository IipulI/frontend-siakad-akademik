import React, { useState, useEffect } from "react"; // Added useEffect
import MainLayout from "../../../components/layouts/MainLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TableObeCPL } from "../../../components/Table";
import { Search, ArrowLeft, Save, Plus } from "lucide-react"; // Removed 'Table' since it's not used
import { Api } from "../../../api/Index";
import { ToastNotif, showToast } from "../../../components/admin-finance/Toastify.tsx";
import { getCpl } from "../../../hooks/academic/useObeCpl.ts";
import { id } from "date-fns/locale";

// --- Interface Definition (Ensure this is in components/types.ts or similar) ---
export interface CplData {
  id: string;
  siakProgramStudiId: string;
  siakTahunKurikulumId: string;
  programStudi?: string;
  tahunKurikulum?: string;
  kodeCpl: string;
  deskripsiCpl: string;
  kategoriCpl: string;
  profilLulusanIds: string[]; // Corrected interface for `profilLulusanIds`
  pemetaan: string;
}

// --- API Functions ---

const fetchCplData = async (page: number, size: number, siakTahunKurikulumId?: string): Promise<CplData[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: "createdAt,desc",
  });

  if (siakTahunKurikulumId) {
    queryParams.append("siakTahunKurikulumId", siakTahunKurikulumId);
  }

  const response = await Api.get(`/akademik/capaian-pembelajaran-lulusan?${queryParams.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const apiData = response.data.data;

  // console.log("🔍 Raw graduate profile API data:", apiData); // Keep for debugging if needed

  if (!Array.isArray(apiData)) {
    console.warn("API response data for CPL is not an array:", apiData);
    return [];
  }

  const formattedData: CplData[] = apiData.map((item: any) => {
    // Ensure profilLulusanIds is an array of strings, even if backend sends null/undefined or other format
    const profilLulusanIdsArray = Array.isArray(item.profilLulusanIds)
      ? item.profilLulusanIds.map((profile: any) => (typeof profile === "object" && profile !== null && "ProfilLulusanId" in profile ? profile.ProfilLulusanId : profile))
      : [];

    return {
      id: item.id,
      siakProgramStudiId: item.siakProgramStudiId,
      siakTahunKurikulumId: item.siakTahunKurikulumId,
      programStudi: item.programStudi,
      tahunKurikulum: item.tahunKurikulum,
      kodeCpl: item.kodeCpl,
      deskripsiCpl: item.deskripsiCpl,
      kategoriCpl: item.kategoriCpl,
      profilLulusanIds: profilLulusanIdsArray, // Directly use the cleaned array of strings
      pemetaan: item.pemetaan,
    };
  });

  return formattedData;
};

// Data for creation won't have 'id', 'programStudi', or 'tahunKurikulum'
type CreateCplPayload = Omit<CplData, "id" | "programStudi" | "tahunKurikulum">;

const createCpl = async (data: CreateCplPayload): Promise<CplData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  // The payload should directly match the API's expected input for `profilLulusanIds`
  // which, based on your JSON, is an array of strings.
  const payload = {
    siakProgramStudiId: data.siakProgramStudiId,
    siakTahunKurikulumId: data.siakTahunKurikulumId,
    kodeCpl: data.kodeCpl,
    deskripsiCpl: data.deskripsiCpl,
    kategoriCpl: data.kategoriCpl,
    profilLulusanIds: data.profilLulusanIds, // Corrected: directly use the array of strings
    pemetaan: data.pemetaan,
  };

  // console.log("Payload dikirim:", payload); // Keep for debugging if needed

  const response = await Api.post("/akademik/capaian-pembelajaran-lulusan", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // console.log("Response dari API:", response.data); // Keep for debugging if needed

  const newItemData = response.data?.data || response.data;
  return {
    id: newItemData.id,
    siakProgramStudiId: newItemData.siakProgramStudiId,
    siakTahunKurikulumId: newItemData.siakTahunKurikulumId,
    programStudi: newItemData.programStudi,
    tahunKurikulum: newItemData.tahunKurikulum,
    kodeCpl: newItemData.kodeCpl,
    deskripsiCpl: newItemData.deskripsiCpl,
    kategoriCpl: newItemData.kategoriCpl,
    profilLulusanIds: newItemData.profilLulusanIds || [], // Ensure it's an array for consistency
    pemetaan: newItemData.pemetaan,
  };
};

type UpdateCplPayload = Omit<CplData, "id" | "programStudi" | "tahunKurikulum">;

const updateCpl = async ({ id, data }: { id: string; data: UpdateCplPayload }): Promise<CplData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  // Payload for update also includes siakProgramStudiId and siakTahunKurikulumId
  // and directly uses the string array for profilLulusanIds
  const payload = {
    siakProgramStudiId: data.siakProgramStudiId,
    siakTahunKurikulumId: data.siakTahunKurikulumId,
    kodeCpl: data.kodeCpl,
    deskripsiCpl: data.deskripsiCpl,
    kategoriCpl: data.kategoriCpl,
    profilLulusanIds: data.profilLulusanIds, // Corrected: directly use the array of strings
    pemetaan: data.pemetaan,
  };

  await Api.put(`/akademik/capaian-pembelajaran-lulusan/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Return the updated data including id and other properties for consistency
  return { id, ...data, programStudi: data.siakProgramStudiId || "", tahunKurikulum: data.siakTahunKurikulumId || "" };
};

const deleteCpl = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  await Api.delete(`/akademik/capaian-pembelajaran-lulusan/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// --- React Component ---

const ObeCpl: React.FC = () => {
  const { id: obeManagementId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const obeDataFromState = location.state?.obeData;

  // State
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<CplData | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState(obeDataFromState?.tahunKurikulum || "2024");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Queries
  const {
    data: cplResponse = [],
    isLoading: isCplLoading,
    error: cplError,
  } = getCpl({
    page: currentPage,
    size: itemsPerPage,
  });

  // Mutations
  const createMutation = useMutation<CplData, Error, CreateCplPayload>({
    mutationFn: createCpl,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cplData"] });
      showToast.success("CPL berhasil ditambahkan!");
      handleReset();
      setErrorMessage("");
    },
    onError: (error: any) => {
      console.error("Gagal menambah data:", error);
      handleMutationError(error);
    },
  });

  const updateMutation = useMutation<CplData, Error, { id: string; data: UpdateCplPayload }>({
    mutationFn: updateCpl,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cplData"] });
      showToast.success("CPL berhasil diperbarui!");
      handleReset();
      setErrorMessage("");
    },
    onError: (error: any) => {
      console.error("Gagal mengupdate data:", error);
      handleMutationError(error);
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteCpl,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cplData"] });
      showToast.success("CPL berhasil dihapus!");
      setErrorMessage("");
    },
    onError: (error: any) => {
      console.error("Gagal menghapus data:", error);
      handleMutationError(error);
    },
  });

  // Fallback for obeInfo if state is empty
  const obeInfo = obeDataFromState || {
    kodeProgramStudi: "N/A",
    programStudi: "N/A",
    tahunKurikulum: "N/A",
    ketuaProdi: "N/A",
  };

  // Helper function for error handling
  const handleMutationError = (error: any) => {
    let message = "Terjadi kesalahan. Silakan coba lagi.";
    if (error.response?.status === 400) {
      message = "Data tidak valid. Periksa kembali input Anda.";
    } else if (error.response?.status === 401) {
      message = "Token tidak valid. Silakan login ulang.";
    } else if (error.response?.data?.message) {
      message = `Error: ${error.response.data.message}`;
    } else if (error.message) {
      message = error.message;
    }
    setErrorMessage(message);
    showToast.error(message);
  };

  // Event handlers
  const handleNavigation = (path: string) => {
    navigate(path, { state: { obeData: obeDataFromState } }); // Pass obeData for context
  };

  const handleBack = () => {
    navigate(AdminAcademicRoute.obeManagement.obeManagement);
  };

  const handleAddCpl = () => {
    setIsAdding(true);
    setIsEditing(false);
    setCurrentData({
      id: "", // ID will be generated by backend
      siakProgramStudiId: obeInfo.siakProgramStudiId, // Use the correct ID from obeInfo
      siakTahunKurikulumId: obeInfo.siakTahunKurikulumId, // Use the correct ID from obeInfo
      kodeCpl: "",
      deskripsiCpl: "",
      kategoriCpl: "",
      profilLulusanIds: [], // Initialize as an empty array of strings
      pemetaan: "",
    });
    setErrorMessage("");
  };

  const handleEdit = (id: string) => {
    const selectedData = cplResponse.find((item) => item.id === id);
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

  const handleSave = async () => {
    if (!currentData || !isFormValid()) {
      setErrorMessage("Semua kolom wajib diisi.");
      showToast.error("Mohon lengkapi semua kolom yang wajib diisi.");
      return;
    }

    setErrorMessage("");

    // The data to save should match the CreateCplPayload or UpdateCplPayload
    const dataToSave: CreateCplPayload = {
      siakProgramStudiId: currentData.siakProgramStudiId,
      siakTahunKurikulumId: currentData.siakTahunKurikulumId,
      kodeCpl: currentData.kodeCpl,
      deskripsiCpl: currentData.deskripsiCpl,
      kategoriCpl: currentData.kategoriCpl,
      profilLulusanIds: currentData.profilLulusanIds,
      pemetaan: currentData.pemetaan,
    };

    if (isEditing && currentData.id) {
      // For update, ensure the ID is passed correctly
      updateMutation.mutate({ id: currentData.id, data: dataToSave });
    } else if (isAdding) {
      createMutation.mutate(dataToSave);
    }

    // Don't immediately set currentData to null after calling mutate,
    // let onSuccess/onError handle the reset after mutation completes.
    // setCurrentData(null);
  };

  const handleReset = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentData(null);
    setErrorMessage("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // Improved form validation to check essential fields for CPL
  const isFormValid = () => {
    return !!(
      (currentData?.kodeCpl && currentData?.deskripsiCpl && currentData?.kategoriCpl && currentData?.pemetaan && currentData?.siakProgramStudiId && currentData?.siakTahunKurikulumId)
      // Add validation for profilLulusanIds if it's required to not be empty
      // && (currentData.profilLulusanIds && currentData.profilLulusanIds.length > 0)
    );
  };

  // Use useEffect to update selectedYear when obeDataFromState changes
  useEffect(() => {
    if (obeDataFromState?.tahunKurikulum) {
      setSelectedYear(obeDataFromState.tahunKurikulum);
    }
  }, [obeDataFromState]);

  // Loading and Error states
  if (isCplLoading) {
    return (
      <MainLayout isGreeting={false} titlePage="Data CPL">
        <div className="flex justify-center items-center h-screen">
          <p>Memuat data CPL...</p>
        </div>
      </MainLayout>
    );
  }

  if (cplError) {
    return (
      <MainLayout isGreeting={false} titlePage="Data CPL">
        <div className="flex justify-center items-center h-screen text-red-600">
          <p>Error mengambil data CPL: {cplError.message}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isGreeting={false} titlePage="Data Mata Kuliah" className="">
      <ToastNotif />
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
        {/* Top Section */}
        <div className="flex flex-col items-center justify-between mb-10 md:flex-row gap-4">
          <div className="flex items-center ">
            <button onClick={handleBack} className="flex items-center bg-primary-blueSoft text-white px-2 py-3 rounded-l-md">
              <ArrowLeft className="mr-2" size={16} />
            </button>
            <div className="flex items-center">
              <input type="search" placeholder="Cari Mata Kuliah" className="px-3 py-2 border border-black/50 w-64" />
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
            <button
              onClick={handleSave}
              className="bg-primary-blueSoft text-white px-4 py-2 rounded flex items-center"
              disabled={createMutation.isPending || updateMutation.isPending} // Disable during mutation
            >
              <Save className="mr-2" size={16} />
              {createMutation.isPending || updateMutation.isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-[20%] h-50 text-white p-3 space-y-2">
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(`${AdminAcademicRoute.obeManagement.graduateProfile}/${id}`)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>Profil Lulusan</p>
            </div>
            <div className="flex items-center bg-[#116E63]/60 mb-1 text-black cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.obeManagement.cpl)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p className="text-black font-semibold">CPL</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.obeManagement.cpmk)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>CPMK</p>
            </div>
          </div>

          {/* OBE Details and CPL Management */}
          <div className="w-full md:w-[80%] p-3">
            {/* OBE Information Display */}
            <div className="grid grid-cols-1 gap-2 bg-primary-green/10 p-4 md:grid-cols-2">
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Kode Prodi:</span>
                <span className="w-full text-left">{obeInfo.kodeProgramStudi}</span>
              </div>
              <div className="flex justify-between md:ml-8 ">
                <span className="font-semibold w-full text-left">Tahun Kurikulum:</span>
                <span className="w-full text-left">{obeInfo.tahunKurikulum}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Program Studi:</span>
                <span className="w-full text-left">{obeInfo?.programStudi}</span>
              </div>
              <div className="flex justify-between md:ml-8">
                <span className="font-semibold w-full text-left">Ketua Prodi:</span>
                <span className="w-full text-left">{obeInfo?.ketuaProdi}</span>
              </div>
            </div>

            {/* Year Selection and Add CPL Button */}
            <div className="mt-6 flex flex-col md:items-center gap-2 md:flex-row">
              <h2 className="text-lg font-semibold">Tahun Kurikulum</h2>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="border border-black/50 rounded-md px-2 py-1 w-full md:w-40">
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                {/* Add more options dynamically if needed based on available years */}
              </select>
              <button onClick={handleAddCpl} disabled={isAdding} className={`ml-auto bg-primary-green text-white w-full md:w-48 px-4 py-2 rounded flex items-center hover:bg-primary-blue ${isAdding ? " cursor-not-allowed opacity-50" : ""}`}>
                <Plus className="mr-2" size={16} />
                Tambah CPL
              </button>
            </div>

            {/* Validation Error Message */}
            {errorMessage && <p className="text-red-600 mt-4 mx-4">{errorMessage}</p>}

            {/* CPL Table */}
            <div className="mt-4 overflow-x-auto">
              <TableObeCPL
                data={cplResponse}
                tableHead={["Kode CPL", "Deskripsi Capaian Pembelajaran Lulusan (CPL)", "Kategori", "Pemetaan PL ke CPL", "Aksi"]}
                error={"Data tidak ditemukan."}
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

export default ObeCpl;
