import React, { useState, useMemo } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { Api } from "../../../api/Index";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../../components/admin-academic/Pagination.tsx";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { CourseData, CurriculumData, ProgramStudiData } from "../../../components/types.ts";
import { TableCourseManagement } from "../../../components/Table";
import { RefreshCw, Search, Plus, Trash } from "lucide-react";

// --- api functions ---
const fetchCourseData = async (page: number, size: number): Promise<CourseData[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get(`/akademik/mata-kuliah?page=1&size=10&sort=createdAt%2Cdesc`, { headers: { Authorization: `Bearer ${token}` } });

  const apiData = response.data.data;

  const formattedData = Array.isArray(apiData)
    ? apiData.map((item: any) => {
        const formatted = {
          id: item.id,
          programStudi: item.programStudi,
          tahunKurikulum: item.tahunKurikulum,
          siakProgramStudiId: item.siakProgramStudiId,
          siakTahunKurikulumId: item.siakTahunKurikulumId,
          semester: item.semester,
          nilaiMin: item.nilaiMin,
          sksTatapMuka: item.sksTatapMuka,
          sksPraktikum: item.sksPraktikum,
          adaPraktikum: item.adaPraktikum,
          opsiMataKuliah: item.opsiMataKuliah,
          kodeMataKuliah: item.kodeMataKuliah,
          namaMataKuliah: item.namaMataKuliah,
          jenisMataKuliah: item.jenisMataKuliah,
          prasyaratMataKuliah1Id: item.prasyaratMataKuliah1Id,
          prasyaratMataKuliah2Id: item.prasyaratMataKuliah2Id,
          prasyaratMataKuliah3Id: item.prasyaratMataKuliah3Id,
          prasyaratMataKuliah1: item.prasyaratMataKuliah1 || "",
          prasyaratMataKuliah2: item.prasyaratMataKuliah2 || "",
          prasyaratMataKuliah3: item.prasyaratMataKuliah3 || "",
        };

        return formatted;
      })
    : [];

  return formattedData;
};

const fetchCurriculumData = async (): Promise<CurriculumData[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get("/akademik/tahun-kurikulum", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = response.data?.data;

  let curriculumData: CurriculumData[] = [];

  if (Array.isArray(data)) {
    curriculumData = data as CurriculumData[];
  } else if (typeof data === "object" && data !== null) {
    curriculumData = Object.values(data as Record<string, unknown>).filter((item): item is CurriculumData => typeof item === "object" && item !== null && "id" in item);
  }

  return curriculumData;
};

const fetchProdiData = async (): Promise<ProgramStudiData[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get("/akademik/program-studi", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = response.data?.data;

  let programStudiData: ProgramStudiData[] = [];

  if (Array.isArray(data)) {
    programStudiData = data as ProgramStudiData[];
  } else if (typeof data === "object" && data !== null) {
    programStudiData = Object.values(data as Record<string, unknown>).filter((item): item is ProgramStudiData => typeof item === "object" && item !== null && "id" in item);
  }

  return programStudiData;
};

const deleteCourse = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  await Api.delete(`/akademik/mata-kuliah/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// --- course management component ---
const CourseManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // --- State Management ---
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCurriculum, setSelectedCurriculum] = useState("all");
  const [selectedCourseType, setSelectedCourseType] = useState("all");
  const [selectedCourseGroup, setSelectedCourseGroup] = useState("all");
  const [selectedProdi, setSelectedProdi] = useState("all");

  // --- queries ---
  const { data: courseData = [], error: courseDataError } = useQuery({
    queryKey: ["courseData", currentPage, itemsPerPage],
    queryFn: () => fetchCourseData(currentPage, itemsPerPage),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: curriculumData = [], error: curriculumError } = useQuery({
    queryKey: ["curriculumData"],
    queryFn: fetchCurriculumData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: programStudiData = [], error: programStudiError } = useQuery({
    queryKey: ["programStudiData"],
    queryFn: fetchProdiData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // --- Get unique values for dropdowns ---
  const uniqueCourseTypes = useMemo(() => {
    const types = courseData.map((item) => item.jenisMataKuliah).filter(Boolean);
    return [...new Set(types)];
  }, [courseData]);

  // --- filtered function ---
  const filteredData = useMemo(() => {
    return courseData
      .filter((item) => {
        // Curriculum Filter - menggunakan tahunKurikulum untuk matching
        return selectedCurriculum === "all" || item.tahunKurikulum === selectedCurriculum;
      })
      .filter((item) => {
        // Study Program Filter - menggunakan programStudi untuk matching
        return selectedProdi === "all" || item.programStudi === selectedProdi;
      })
      .filter((item) => {
        // Course Type Filter
        return selectedCourseType === "all" || item.jenisMataKuliah === selectedCourseType;
      })
      .filter((item) => {
        // Search Term Filter
        return item.namaMataKuliah.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [courseData, selectedCurriculum, selectedCourseType, selectedCourseGroup, selectedProdi, searchTerm]);

  // --- select handler ---
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map((item) => item.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // --- mutation ---
  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseData"] });
      setErrorMessage("");
    },
    onError: (error: any) => {
      console.error("Gagal menghapus data:", error);
      handleMutationError(error);
    },
  });

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

  // --- Event Handlers ---
  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAdd = () => {
    navigate(AdminAcademicRoute.courseManagement.addCourse);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // --- Filter Handlers ---
  const handleCurriculumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurriculum(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleCourseTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourseType(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleProdiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProdi(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setSelectedCurriculum("all");
    setSelectedCourseType("all");
    setSelectedProdi("all");
    setCurrentPage(1);
    queryClient.refetchQueries({ queryKey: ["courseData"] });
  };

  const setData = (newData: CourseData[]) => {
    queryClient.setQueryData(["courseData", currentPage, itemsPerPage], newData);
  };

  // --- Pagination ---
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <MainLayout isGreeting={false} titlePage="Mata Kuliah" className="">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5">
        <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Tahun Kurikulum</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown" value={selectedCurriculum} onChange={handleCurriculumChange}>
              <option value="all">-- Tahun Kurikulum --</option>
              {curriculumData.map((item) => (
                <option key={item.id} value={item.tahun || item.tahun}>
                  {item.tahun || item.tahun}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Jenis Mata Kuliah</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown" value={selectedCourseType} onChange={handleCourseTypeChange}>
              <option value="all">-- Jenis Mata Kuliah --</option>
              {uniqueCourseTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Unit / Prodi Pengampu</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown w-50 lg:w-8" value={selectedProdi} onChange={handleProdiChange}>
              <option value="all">-- Prodi Pengampu --</option>
              {programStudiData.map((item) => (
                <option key={item.id} value={item.namaProgramStudi}>
                  {item.namaProgramStudi}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="w-full bg-white min-h-screen py-4 rounded-sm border-t-2 border-primary-green mt-8 ">
        <div className="flex flex-col md:flex-row px-4 py-2 gap-4 border-b-2">
          <div className="flex">
            <input type="search" placeholder="Cari Mata Kuliah" className="px-3 py-1 w-72 rounded-l-md border border-black/50" value={searchTerm} onChange={handleSearchChange} />
            <button className="bg-primary-yellow w-10 flex items-center justify-center">
              <Search color="white" size={20} />
            </button>
            <button onClick={handleRefresh} className="bg-primary-blueDark rounded-r-md w-10 flex items-center justify-center">
              <RefreshCw color="white" size={20} />
            </button>
          </div>
          <div className="flex ml-auto gap-2">
            <button onClick={handleAdd} className="bg-primary-green rounded py-2 px-4 text-white flex items-center cursor-pointer">
              <Plus className="mr-2" size={16} />
              Tambah
            </button>

            <button
              onClick={() => {
                if (selectedIds.length > 0 && window.confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data yang dipilih?`)) {
                  selectedIds.forEach((id) => deleteMutation.mutate(id));
                  setSelectedIds([]);
                }
              }}
              className="bg-red-500 rounded py-2 px-4 text-white flex items-center cursor-pointer"
              disabled={selectedIds.length === 0}
            >
              <Trash className="mr-2" size={16} />
              Hapus
              {/* ({selectedIds.length}) */}
            </button>
          </div>
        </div>

        <div className="mt-8">
          <TableCourseManagement
            data={paginatedData}
            tableHead={["Combo BOX", "Kurikulum", "Kode", "Mata Kuliah", "SKS", "Jenis MK", "Prodi Pengampu", "Aksi"]}
            error="Data tidak ditemukan."
            onDelete={handleDelete}
            selectedIds={selectedIds}
            onSelect={(id) => {
              if (id === "-1") {
                toggleSelectAll();
              } else {
                toggleSelectOne(id);
              }
            }}
          />
        </div>

        {/* Show filter summary */}
        <div className="px-4 py-2 text-sm text-gray-600">
          Menampilkan {paginatedData.length} dari {filteredData.length} data
          {filteredData.length !== courseData.length && ` (difilter dari ${courseData.length} total data)`}
        </div>

        {/* --- pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(newSize) => {
            setItemsPerPage(newSize);
            setCurrentPage(1);
          }}
        />
      </div>
    </MainLayout>
  );
};

export default CourseManagement;
