import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { Api } from "../../../api/Index";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TableCurriculumProdi } from "../../../components/Table";
import { ProgramStudiData, CurriculumProdiData, CurriculumData } from "../../../components/types.ts";
import { RefreshCw, Search, Plus, Trash, Save } from "lucide-react";

type CurriculumQueryParams = {
  programStudi: string;
  tahunKurikulum: number;
};

// --- api functions ---
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

const fetchCurriculumProdiData = async ({ queryKey }: { queryKey: [string, CurriculumQueryParams] }): Promise<CurriculumProdiData[]> => {
  const [, { programStudi, tahunKurikulum }] = queryKey;
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get("/akademik/kurikulum-prodi", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      programStudi,
      tahunKurikulum,
    },
  });

  const data = response.data?.data;

  let curriculumProdiData: CurriculumProdiData[] = [];

  console.log("🔍 Raw kurikulum prodi API data:", data);

  if (Array.isArray(data)) {
    curriculumProdiData = data as CurriculumProdiData[];
  } else if (typeof data === "object" && data !== null) {
    curriculumProdiData = Object.values(data as Record<string, unknown>).filter((item): item is CurriculumProdiData => typeof item === "object" && item !== null && "id" in item);
  }

  return curriculumProdiData;
};

const CurriculumProdi: React.FC = () => {
  // --- state managements ---
  const [selectedProgramStudi, setSelectedProgramStudi] = useState<string>("");
  const [selectedTahunKurikulum, setSelectedTahunKurikulum] = useState<number>(2024);
  const [shouldFetchData, setShouldFetchData] = useState<boolean>(false);

  // --- React Query Data Fetching ---
  const queryParams = {
    programStudi: selectedProgramStudi,
    tahunKurikulum: selectedTahunKurikulum,
  };

  const { data: curriculumProdiData = [], isLoading } = useQuery({
    queryKey: ["kurikulumProdi", queryParams],
    queryFn: fetchCurriculumProdiData,
    enabled: shouldFetchData && selectedProgramStudi !== "", // Only fetch when shouldFetchData is true and program studi is selected
  });

  const { data: prodiData = [] } = useQuery({
    queryKey: ["prodiData"],
    queryFn: () => fetchProdiData(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: curriculumData = [] } = useQuery({
    queryKey: ["kurikulumData"],
    queryFn: () => fetchCurriculumData(1, 10),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleTambahData = () => {
    if (selectedProgramStudi === "") {
      alert("Silakan pilih Program Studi terlebih dahulu!");
      return;
    }
    setShouldFetchData(true);
  };

  const handleProgramStudiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProgramStudi(e.target.value);
    setShouldFetchData(false); // Reset fetch state when program studi changes
  };

  const handleTahunKurikulumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTahunKurikulum(parseInt(e.target.value));
    setShouldFetchData(false); // Reset fetch state when tahun kurikulum changes
  };

  return (
    <MainLayout isGreeting={false} titlePage="Kurikulum Prodi" className="">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5 flex flex-col items-center justify-between gap-4 md:flex-row ">
        <div className="flex flex-col gap-4 mb-4 md:flex-row md:mb-0 w-full">
          <div className="flex items-center gap-2 w-full md:w-96 ">
            <span className="whitespace-nowrap w-28 text-primary-yellow font-semibold">Program Studi</span>
            <select className="rounded px-3 py-2 border border-primary-brown flex-1 w-20" value={selectedProgramStudi} onChange={handleProgramStudiChange}>
              <option value="">-- Pilih Program Studi --</option>
              {prodiData.map((prodi) => (
                <option key={prodi.id} value={prodi.namaProgramStudi}>
                  {prodi.namaProgramStudi}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 w-full md:w-72">
            <span className="whitespace-nowrap w-28 text-primary-yellow font-semibold">Kurikulum</span>
            <select className="rounded px-3 py-2 border border-primary-brown flex-1" value={selectedTahunKurikulum} onChange={handleTahunKurikulumChange}>
              {curriculumData.map((item) => (
                <option key={item.id} value={item.tahun}>
                  {item.tahun}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 ">
          <button className="bg-primary-yellow text-white rounded px-6 py-2 flex items-center gap-1">
            <Save size={16} />
            Salin
          </button>
          <button className="bg-primary-blueSoft text-white rounded px-6 py-2 flex items-center gap-1">
            <Save size={16} />
            Cetak
          </button>
        </div>
      </div>

      <div className="w-full bg-white py-4 border-t-2 border-primary-green">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 px-4 md:px-8 max-w-screen-lg mx-auto">
          {/* Filter Section */}
          <div className="flex flex-col gap-4 md:flex-row w-full">
            <div className="flex flex-col gap-2 w-full md:w-96">
              <span className="text-primary-green font-semibold">Mata Kuliah</span>
              <div className="relative">
                <select className="w-full px-4 py-2 border border-primary-brown bg-primary-light rounded hover:bg-primary-hover focus:outline-primary-green transition duration-200 text-primary-green font-semibold">
                  <option value="all">-- Cari Mata Kuliah --</option>
                  <option value="CS101">TIF152 - Basis data + praktikum - 3 sks</option>
                  <option value="CS102">TIF451 - Komputasi Berbasis Jaringan + praktikum - 3sks</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-40">
              <span className="text-primary-green font-semibold">Semester</span>
              <div className="relative">
                <select className="w-full px-4 py-2 border border-primary-brown bg-primary-light rounded hover:bg-primary-hover focus:outline-primary-green transition duration-200 text-primary-green font-semibold">
                  <option value="all">-- Pilih Semester --</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-40">
              <span className="text-primary-green font-semibold">Nilai</span>
              <div className="relative">
                <select className="w-full px-4 py-2 border border-primary-brown bg-primary-light rounded hover:bg-primary-hover focus:outline-primary-green transition duration-200 text-primary-green font-semibold">
                  <option value="all">-- Pilih Nilai --</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
            </div>
          </div>

          {/* Checkbox & Button Section */}
          <div className="flex flex-col gap-3 md:gap-6 md:flex-row md:items-end">
            <div className="flex flex-col gap-2 text-primary-green">
              <h3 className="font-bold">Opsi Tambahan</h3>
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="showPassed" className="w-4 h-4" />
                  <label htmlFor="showPassed" className="font-semibold">
                    MK Wajib
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="showFailed" className="w-4 h-4" />
                  <label htmlFor="showFailed" className="font-semibold">
                    Paket MK
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="bg-primary-green text-white rounded px-4 py-2 flex items-center gap-1 hover:bg-green-600 transition duration-200 disabled:bg-gray-400"
                onClick={handleTambahData}
                disabled={isLoading || selectedProgramStudi === ""}
              >
                {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16} />}
                {isLoading ? "Loading..." : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white min-h-screen py-4 rounded-sm border-t-2 border-primary-yellow p-8">
        {/* Table Rendering */}
        <div className="mt-8 ">
          {!shouldFetchData ? (
            <div className="text-center py-8 text-gray-500">
              <p>Pilih Program Studi dan Tahun Kurikulum, kemudian klik tombol "Tambah" untuk menampilkan data kurikulum.</p>
            </div>
          ) : (
            <TableCurriculumProdi data={curriculumProdiData} tableHead={["No", "Kode", "Mata Kuliah", "SKS", "Status", "Nilai Min", "Prasyarat", "Konsentrasi", "Aksi"]} error="Data tidak ditemukan." />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CurriculumProdi;
