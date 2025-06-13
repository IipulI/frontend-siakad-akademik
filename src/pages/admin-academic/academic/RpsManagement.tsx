import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../../api/Index";
import { Search, Plus, CornerUpLeft } from "lucide-react";
import { TableRpsManagement } from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes.tsx";
import { Pagination } from "../../../components/admin-academic/Pagination.tsx";
import { CourseData, CurriculumData, DosenData, ProgramStudiData, RpsData, PeriodeAkademik } from "../../../components/types.ts";

// --- fetching api ---
const fetchRpsData = async (): Promise<RpsData[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get("/akademik/rps", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = response.data?.data;

  console.log("🔍 Raw rps API data:", data);

  let rpsData: RpsData[] = [];

  if (Array.isArray(data)) {
    rpsData = data as RpsData[];
  } else if (typeof data === "object" && data !== null) {
    rpsData = Object.values(data as Record<string, unknown>).filter((item): item is RpsData => typeof item === "object" && item !== null && "id" in item);
  }

  return rpsData;
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

const fetchProdiData = async (): Promise<ProgramStudiData[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get("/akademik/program-studi", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = response.data?.data;

  console.log("🔍 Raw prodi API data:", data);

  let programStudiData: ProgramStudiData[] = [];

  if (Array.isArray(data)) {
    programStudiData = data as ProgramStudiData[];
  } else if (typeof data === "object" && data !== null) {
    programStudiData = Object.values(data as Record<string, unknown>).filter((item): item is ProgramStudiData => typeof item === "object" && item !== null && "id" in item);
  }

  return programStudiData;
};

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

const deleteRps = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  await Api.delete(`/akademik/rps/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const RpsManagement: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- query data ---
  const { data: rpsData = [], error: periodeError } = useQuery({
    queryKey: ["rpsData"],
    queryFn: fetchRpsData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: curriculumData = [], error: curriculumError } = useQuery({
    queryKey: ["curriculumData"],
    queryFn: fetchCurriculumData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: prodiData = [], error: prodiError } = useQuery({
    queryKey: ["prodiData"],
    queryFn: fetchProdiData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: periodeData = [], error: periodeErrorData } = useQuery({
    queryKey: ["periodeData"],
    queryFn: fetchPeriodeAkademik,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // --- states management ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(rpsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = rpsData.slice(startIndex, startIndex + itemsPerPage);

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  // --- Mutation ---
  const deleteMutation = useMutation({
    mutationFn: deleteRps,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rpsData"] });
    },
    onError: (error: any) => {
      console.error("Gagal menghapus data:", error);
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAdd = () => {
    navigate(AdminAcademicRoute.rpsManagement.addRps);
  };

  return (
    <MainLayout isGreeting={false} titlePage="Manajemen RPS">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5">
        <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Tahun Kurikulum</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown">
              <option value="all">-- Tahun Kurikulum --</option>
              {curriculumData.map((item) => (
                <option key={item.id} value={item.tahun}>
                  {item.tahun}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Periode Akademik</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown ">
              <option value="all">-- Periode --</option>
              {periodeData.map((item) => (
                <option key={item.id} value={item.namaPeriode}>
                  {item.namaPeriode}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Program Studi</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown w-36 ">
              <option value="all">-- Program Studi --</option>
              {prodiData.map((item) => (
                <option key={item.id} value={item.namaProgramStudi}>
                  {item.namaProgramStudi}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-36 text-gray-700">Program Studi</label>
            <select className="flex-1 rounded px-3 py-2 border border-primary-brown w-36 ">
              <option value="all">-- Program Studi --</option>
              {prodiData.map((item) => (
                <option key={item.id} value={item.namaProgramStudi}>
                  {item.namaProgramStudi}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex flex-col gap-6 md:flex-row md:gap-0">
          <div className="flex flex-row">
            <input type="search" placeholder="Cari Program Studi" className="px-3 py-1 w-full md:w-72 rounded-l-md border border-black/50" />
            <button className="bg-primary-yellow rounded-r-md w-10 flex items-center justify-center">
              <Search color="white" size={20} />
            </button>
          </div>

          <button onClick={handleAdd} className="bg-primary-green rounded py-2 px-4 text-white ml-auto w-full md:w-36 flex items-center justify-center">
            <Plus className="mr-2" size={16} />
            <span className="text-center w-full md:w-auto">Tambah</span>
          </button>
        </div>

        {/* Tabel RPS */}
        <div className="mt-4">
          <TableRpsManagement data={rpsData} error="Data tidak ditemukan." onEdit={(id) => console.log("Edit id:", id)} onDelete={handleDelete} />
        </div>

        {/* Pagination */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} onRowsPerPageChange={setItemsPerPage} />
      </div>
    </MainLayout>
  );
};

export default RpsManagement;
