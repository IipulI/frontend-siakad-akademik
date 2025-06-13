import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../../api/Index";
import { TableCurriculumYear } from "../../../components/Table";
import { CurriculumData, PeriodeAkademik } from "../../../components/types.ts";
import { RefreshCw, Search, Plus } from "lucide-react";
import { Pagination } from "../../../components/admin-academic/Pagination.tsx";

// --- api functions ---
const fetchPeriodeAkademik = async (): Promise<PeriodeAkademik[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get("/akademik/periode-akademik", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = response.data?.data;

  let periodeData: PeriodeAkademik[] = [];

  if (Array.isArray(data)) {
    periodeData = data as PeriodeAkademik[];
  } else if (typeof data === "object" && data !== null) {
    periodeData = Object.values(data as Record<string, unknown>).filter((item): item is PeriodeAkademik => typeof item === "object" && item !== null && "id" in item);
  }
  return periodeData;
};

const fetchCurriculumData = async (page: number, size: number): Promise<CurriculumData[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get(`/akademik/tahun-kurikulum?page=${page}&size=${size}&sort=createdAt%2Cdesc`, { headers: { Authorization: `Bearer ${token}` } });

  const apiData = response.data.data;
  const formattedData = Array.isArray(apiData)
    ? apiData.map((item: any) => {
        const formatted = {
          id: item.id,
          mulaiBerlaku: item.mulaiBerlaku,
          tahun: item.tahun,
          keterangan: item.keterangan,
          tanggalMulai: item.tanggalMulai,
          tanggalSelesai: item.tanggalSelesai,
          siakPeriodeAkademikId: item.siakPeriodeAkademikId,
        };

        return formatted;
      })
    : [];

  return formattedData;
};

const createCurriculum = async (data: Omit<CurriculumData, "id">): Promise<CurriculumData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const payload = {
    siakPeriodeAkademikId: data.siakPeriodeAkademikId,
    tahun: data.tahun,
    keterangan: data.keterangan,
    tanggalMulai: data.tanggalMulai,
    tanggalSelesai: data.tanggalSelesai,
  };

  const response = await Api.post("/akademik/tahun-kurikulum", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const newItemData = response.data?.data || response.data;
  return {
    id: newItemData.id,
    tahun: newItemData.tahun,
    keterangan: newItemData.keterangan,
    mulaiBerlaku: newItemData.mulaiBerlaku,
    siakPeriodeAkademikId: newItemData.siakPeriodeAkademikId,
    tanggalMulai: newItemData.tanggalMulai,
    tanggalSelesai: newItemData.tanggalSelesai,
  };
};

const updateCurriculum = async ({ id, data }: { id: string; data: Omit<CurriculumData, "id"> }): Promise<CurriculumData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const payload = {
    siakPeriodeAkademikId: data.siakPeriodeAkademikId,
    tahun: data.tahun,
    keterangan: data.keterangan,
    tanggalMulai: data.tanggalMulai,
    tanggalSelesai: data.tanggalSelesai,
  };

  await Api.put(`/akademik/tahun-kurikulum/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return { id, ...data };
};

const deleteCurriculum = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  await Api.delete(`/akademik/tahun-kurikulum/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// --- curriculum year component ---
const CurriculumYear: React.FC = () => {
  const queryClient = useQueryClient();

  // --- state ---
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState<CurriculumData | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // --- queries ---
  const {
    data: periodeAkademikList = [],
    isLoading: loadingPeriode,
    error: periodeError,
  } = useQuery({
    queryKey: ["periodeAkademik"],
    queryFn: fetchPeriodeAkademik,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const {
    data: curriculumData = [],
    isLoading: loading,
    error: curriculumError,
    // refetch: refetchCurriculum,
  } = useQuery({
    queryKey: ["curriculumData", currentPage, itemsPerPage],
    queryFn: () => fetchCurriculumData(currentPage, itemsPerPage),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // --- mutations ---
  const createMutation = useMutation({
    mutationFn: createCurriculum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculumData"] });
      handleReset();
      setErrorMessage("");
    },
    onError: (error: any) => {
      console.error("Gagal menambah data:", error);
      handleMutationError(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCurriculum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculumData"] });
      handleReset();
      setErrorMessage("");
    },
    onError: (error: any) => {
      console.error("Gagal mengupdate data:", error);
      handleMutationError(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCurriculum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculumData"] });
      setErrorMessage("");
    },
    onError: (error: any) => {
      console.error("Gagal menghapus data:", error);
      handleMutationError(error);
    },
  });

  const filteredData = curriculumData.filter((item) => item.tahun.toLowerCase().includes(searchTerm.toLowerCase()));

  // --- error handling ---
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

  // --- set error messages from queries ---
  React.useEffect(() => {
    if (periodeError) {
      setErrorMessage(periodeError.message || "Gagal mengambil data periode akademik.");
    } else if (curriculumError) {
      setErrorMessage(curriculumError.message || "Terjadi kesalahan saat mengambil data.");
    }
  }, [periodeError, curriculumError]);

  // --- event handlers ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (id: string) => {
    const selectedData = curriculumData.find((item) => item.id === id);
    if (selectedData) {
      setCurrentData(selectedData);
      setSelectedPeriodeId(selectedData.siakPeriodeAkademikId);
      setIsEditing(true);
      setIsAdding(false);
      setErrorMessage("");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setCurrentData({
      id: "",
      tahun: "",
      keterangan: "",
      mulaiBerlaku: "",
      siakPeriodeAkademikId: "",
      tanggalMulai: "",
      tanggalSelesai: "",
    });
    setSelectedPeriodeId("");
    setErrorMessage("");
  };

  const isFormValid = () => {
    return !!(currentData?.tahun && currentData?.keterangan && selectedPeriodeId && currentData?.tanggalMulai && currentData?.tanggalSelesai);
  };

  const handleSave = async () => {
    if (!currentData || !isFormValid()) {
      setErrorMessage("Semua kolom harus diisi.");
      return;
    }

    setErrorMessage("");

    const dataToSave = {
      tahun: currentData.tahun,
      keterangan: currentData.keterangan,
      mulaiBerlaku: currentData.mulaiBerlaku,
      siakPeriodeAkademikId: selectedPeriodeId,
      tanggalMulai: currentData.tanggalMulai,
      tanggalSelesai: currentData.tanggalSelesai,
    };

    if (isEditing && currentData.id) {
      updateMutation.mutate({ id: currentData.id, data: dataToSave });
    } else if (isAdding) {
      createMutation.mutate(dataToSave);
    }
  };

  const handleReset = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentData(null);
    setSelectedPeriodeId("");
    setErrorMessage("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["periodeAkademik"] });
    queryClient.invalidateQueries({ queryKey: ["curriculumData"] });
  };

  // --- pagination logic ---
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = curriculumData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(curriculumData.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  // Loading state
  const isLoading = loading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <MainLayout isGreeting={false} titlePage="Tahun Kurikulum" className="">
      <div className="w-full bg-white min-h-screen py-4 rounded-sm border-t-2 border-primary-yellow">
        <div className="flex flex-col sm:flex-row px-4 py-2 gap-2 sm:gap-4  border-b-2 w-full flex-wrap">
          <div className="flex w-full sm:w-auto sm:order-1">
            <input type="search" placeholder="Cari Tahun Kurikulum" className="px-3 py-1 w-full sm:w-72 rounded-l-md border border-black/50" value={searchTerm} onChange={handleSearchChange} />
            <button className="bg-primary-yellow w-10 flex items-center justify-center">
              <Search color="white" size={20} />
            </button>
            <button onClick={handleRefresh} className="bg-primary-blueDark rounded-r-md w-10 flex items-center justify-center" disabled={isLoading}>
              <RefreshCw color="white" size={20} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>

          <button onClick={handleAdd} className="bg-primary-green rounded py-2 px-4 text-white flex items-center cursor-pointer disabled:opacity-50 w-full sm:w-auto sm:ml-auto sm:order-3" disabled={isLoading}>
            <Plus className="mr-2" size={16} />
            Tambah
          </button>
        </div>

        <div className="mt-8">
          <TableCurriculumYear
            data={filteredData}
            tableHead={["Tahun", "Keterangan", "Mulai Berlaku", "Tanggal Awal", "Tanggal Akhir", "Aksi"]}
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
            periodeAkademikList={periodeAkademikList}
            selectedPeriodeId={selectedPeriodeId}
            setSelectedPeriodeId={setSelectedPeriodeId}
          />
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} onRowsPerPageChange={setItemsPerPage} />
      </div>
    </MainLayout>
  );
};

export default CurriculumYear;
