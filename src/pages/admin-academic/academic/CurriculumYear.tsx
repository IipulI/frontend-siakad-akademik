import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../../api/Index";
import { TableCurriculumYear } from "../../../components/Table";
import { CurriculumData, PeriodeAkademik } from "../../../components/types.ts";
import { RefreshCw, Search, Plus } from "lucide-react";
import { Pagination } from "../../../components/admin-academic/Pagination.tsx";

// API Functions
const fetchPeriodeAkademik = async (): Promise<PeriodeAkademik[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get("/akademik/periode-akademik", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = response.data?.data;
  console.log("🔍 Raw periode akademik API data:", data);

  let periodeData: PeriodeAkademik[] = [];

  if (Array.isArray(data)) {
    periodeData = data as PeriodeAkademik[];
  } else if (typeof data === "object" && data !== null) {
    periodeData = Object.values(data as Record<string, unknown>).filter((item): item is PeriodeAkademik => typeof item === "object" && item !== null && "id" in item);
  }

  console.log("🔍 Processed periode akademik data:", periodeData);
  console.log(
    "🔍 Periode IDs available:",
    periodeData.map((p) => p.id)
  );

  return periodeData;
};

const fetchCurriculumData = async (page: number, size: number): Promise<CurriculumData[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get(`/akademik/tahun-kurikulum?page=${page}&size=${size}&sort=createdAt%2Cdesc`, { headers: { Authorization: `Bearer ${token}` } });

  const apiData = response.data.data;
  console.log("🔍 Raw curriculum API data:", apiData);

  const formattedData = Array.isArray(apiData)
    ? apiData.map((item: any) => {
        // Debug each item
        console.log("🔍 Processing curriculum item:", item);

        const formatted = {
          id: item.id,
          tahun: item.tahun,
          keterangan: item.keterangan || item.keterangan,
          siakPeriodeAkademikId: item.siakPeriodeAkademikId || item.periodeAkademikId || item.periode_akademik_id || item.periodeId || "",
          tanggalAwal: item.tanggalMulai || item.tanggalAwal,
          tanggalAkhir: item.tanggalSelesai || item.tanggalAkhir,
        };

        console.log("🔍 Formatted curriculum item:", formatted);
        return formatted;
      })
    : [];

  console.log("🔍 Final formatted curriculum data:", formattedData);
  return formattedData;
};

const createCurriculum = async (data: Omit<CurriculumData, "id">): Promise<CurriculumData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const payload = {
    siakPeriodeAkademikId: data.siakPeriodeAkademikId,
    tahun: data.tahun,
    keterangan: data.keterangan,
    tanggalMulai: data.tanggalAwal,
    tanggalSelesai: data.tanggalAkhir,
  };

  const response = await Api.post("/akademik/tahun-kurikulum", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const newItemData = response.data?.data || response.data;
  return {
    id: newItemData.id || Date.now().toString(),
    tahun: newItemData.tahun || data.tahun,
    keterangan: newItemData.keterangan || data.keterangan,
    siakPeriodeAkademikId: newItemData.siakPeriodeAkademikId || data.siakPeriodeAkademikId,
    tanggalAwal: newItemData.tanggalMulai || data.tanggalAwal,
    tanggalAkhir: newItemData.tanggalSelesai || data.tanggalAkhir,
  };
};

const updateCurriculum = async ({ id, data }: { id: string; data: Omit<CurriculumData, "id"> }): Promise<CurriculumData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const payload = {
    siakPeriodeAkademikId: data.siakPeriodeAkademikId,
    tahun: data.tahun,
    keterangan: data.keterangan,
    tanggalMulai: data.tanggalAwal,
    tanggalSelesai: data.tanggalAkhir,
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

const CurriculumYear: React.FC = () => {
  const queryClient = useQueryClient();

  // State
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState<CurriculumData | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Queries
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
    refetch: refetchCurriculum,
  } = useQuery({
    queryKey: ["curriculumData", currentPage, itemsPerPage],
    queryFn: () => fetchCurriculumData(currentPage, itemsPerPage),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const filteredData = curriculumData.filter((item) => item.tahun.toLowerCase().includes(searchTerm.toLowerCase()));

  // Mutations
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

  // Set error messages from queries
  React.useEffect(() => {
    if (periodeError) {
      setErrorMessage(periodeError.message || "Gagal mengambil data periode akademik.");
    } else if (curriculumError) {
      setErrorMessage(curriculumError.message || "Terjadi kesalahan saat mengambil data.");
    }
  }, [periodeError, curriculumError]);

  // Event handlers

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
      siakPeriodeAkademikId: "",
      tanggalAwal: "",
      tanggalAkhir: "",
    });
    setSelectedPeriodeId("");
    setErrorMessage("");
  };

  const isFormValid = () => {
    return !!(currentData?.tahun && currentData?.keterangan && selectedPeriodeId && currentData?.tanggalAwal && currentData?.tanggalAkhir);
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
      siakPeriodeAkademikId: selectedPeriodeId,
      tanggalAwal: currentData.tanggalAwal,
      tanggalAkhir: currentData.tanggalAkhir,
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

  // Pagination logic
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

          <select className="rounded px-3 py-1 border border-primary-brown w-full sm:w-35  ">
            <option value="all">-Semua-</option>
          </select>

          <button onClick={handleAdd} className="bg-primary-green rounded py-2 px-4 text-white flex items-center cursor-pointer disabled:opacity-50 w-full sm:w-auto sm:ml-auto sm:order-3" disabled={isLoading}>
            <Plus className="mr-2" size={16} />
            Tambah
          </button>
        </div>

        {errorMessage && <p className="text-red-600 mt-4 mx-4">{errorMessage}</p>}
        {isLoading && <p className="text-blue-600 mt-2 mx-4">Loading...</p>}
        {loadingPeriode && <p className="text-blue-600 mt-2 mx-4">Loading periode akademik...</p>}

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

        {/* <div className="flex justify-between items-center mt-4 px-4">
          <div className="text-sm flex items-center gap-2">
            <div className="flex items-center bg-sky-100 mr-3">
              <div className="w-2 h-7 bg-blue-500 mr-3"></div>
              <span className="pr-3">
                Hal {currentPage} / {totalPages} ({curriculumData.length} data)
              </span>
            </div>

            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="rounded px-3 py-1 border border-primary-brown">
              <option value={10}>10 Baris</option>
              <option value={25}>25 Baris</option>
              <option value={50}>50 Baris</option>
            </select>
          </div>

          <div className="flex items-center">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="bg-white border border-gray-300 w-8 h-8 flex items-center justify-center disabled:opacity-50">
              &lt;&lt;
            </button>
            <button onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)} disabled={currentPage === 1} className="bg-white border border-gray-300 w-8 h-8 flex items-center justify-center disabled:opacity-50">
              &lt;
            </button>

            {pageNumbers.map((number) => (
              <button key={number} onClick={() => setCurrentPage(number)} className={`w-8 h-8 ${currentPage === number ? "bg-primary-blueDark text-white" : "bg-white"} border border-gray-300 flex items-center justify-center`}>
                {number}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
              disabled={currentPage === totalPages}
              className="bg-white border border-gray-300 w-8 h-8 flex items-center justify-center disabled:opacity-50"
            >
              &gt;
            </button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="bg-white border border-gray-300 w-8 h-8 flex items-center justify-center disabled:opacity-50">
              &gt;&gt;
            </button>
          </div>
        </div> */}
      </div>
    </MainLayout>
  );
};

export default CurriculumYear;
