import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { Api } from "../../../api/Index";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Save } from "lucide-react";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { CourseData, CurriculumData, ProgramStudiData } from "../../../components/types.ts";

// --- Fetch Data ---
const fetchCourseData = async (page: number, size: number): Promise<CourseData[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get(`/akademik/mata-kuliah?page=${page}&size=${size}&sort=createdAt%2Cdesc`, { headers: { Authorization: `Bearer ${token}` } });

  const apiData = response.data.data;
  console.log("🔍 Raw matkul API data:", apiData);

  const formattedData = Array.isArray(apiData)
    ? apiData.map((item: any) => {
        const formatted = {
          id: item.id,
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

// --- Create ---
const createCourse = async (data: Omit<CourseData, "id">): Promise<CourseData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const payload = {
    siakProgramStudiId: data.siakProgramStudiId,
    siakTahunKurikulumId: data.siakTahunKurikulumId,
    semester: data.semester,
    nilaiMin: data.nilaiMin,
    sksTatapMuka: data.sksTatapMuka,
    sksPraktikum: data.sksPraktikum,
    adaPraktikum: data.adaPraktikum,
    opsiMataKuliah: data.opsiMataKuliah,
    kodeMataKuliah: data.kodeMataKuliah,
    namaMataKuliah: data.namaMataKuliah,
    jenisMataKuliah: data.jenisMataKuliah,
    prasyaratMataKuliah1: data.prasyaratMataKuliah1 || "",
    prasyaratMataKuliah2: data.prasyaratMataKuliah2 || "",
    prasyaratMataKuliah3: data.prasyaratMataKuliah3 || "",
  };

  const response = await Api.post("/akademik/mata-kuliah", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const newItemData = response.data?.data || response.data;
  return {
    id: newItemData.id,
    siakProgramStudiId: newItemData.siakProgramStudiId,
    siakTahunKurikulumId: newItemData.siakTahunKurikulumId,
    semester: newItemData.semester,
    nilaiMin: newItemData.nilaiMin,
    sksTatapMuka: newItemData.sksTatapMuka,
    sksPraktikum: newItemData.sksPraktikum,
    adaPraktikum: newItemData.adaPraktikum,
    opsiMataKuliah: newItemData.opsiMataKuliah,
    kodeMataKuliah: newItemData.kodeMataKuliah,
    namaMataKuliah: newItemData.namaMataKuliah,
    jenisMataKuliah: newItemData.jenisMataKuliah,
    prasyaratMataKuliah1: newItemData.prasyaratMataKuliah1 || "",
    prasyaratMataKuliah2: newItemData.prasyaratMataKuliah2 || "",
    prasyaratMataKuliah3: newItemData.prasyaratMataKuliah3 || "",
  };
};

const AddCourse: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- State Management ---
  const [formData, setFormData] = useState<Omit<CourseData, "id">>({
    siakProgramStudiId: "",
    siakTahunKurikulumId: "",
    kodeMataKuliah: "",
    namaMataKuliah: "",
    semester: "1",
    sksTatapMuka: 0,
    sksPraktikum: 0,
    opsiMataKuliah: false, // Default value 'Wajib', false merepresentasikan pilihan
    jenisMataKuliah: "Wajib",
    adaPraktikum: false,
    nilaiMin: "C",
    prasyaratMataKuliah1: "",
    prasyaratMataKuliah2: "",
    prasyaratMataKuliah3: "",
  });

  const totalSks = formData.sksTatapMuka + formData.sksPraktikum;
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(null);

  // --- React Query Data Fetching ---
  const { data: courseData = [] } = useQuery({
    queryKey: ["courseData"], // Fixed typo: was "couseData"
    queryFn: () => fetchCourseData(1, 999),
    staleTime: 5 * 60 * 1000,
  });

  const { data: curriculumData = [] } = useQuery({
    queryKey: ["curriculumData"],
    queryFn: fetchCurriculumData,
  });

  const { data: programStudiData = [] } = useQuery({
    queryKey: ["programStudiData"],
    queryFn: fetchProdiData,
  });

  // --- Mutation ---
  const createMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseData"] });
      navigate(AdminAcademicRoute.courseManagement.courseManagement, {
        state: { successMessage: "Mata kuliah berhasil ditambahkan!" },
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Gagal menambahkan data. Coba lagi.";
      setFeedback({ type: "error", message: message });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));

    // Clear feedback when user starts typing
    if (feedback) {
      setFeedback(null);
    }
  };

  const handleBack = () => {
    navigate(AdminAcademicRoute.courseManagement.courseManagement);
  };

  const isFormValid = () => {
    return formData.siakTahunKurikulumId && formData.siakProgramStudiId && formData.kodeMataKuliah && formData.namaMataKuliah && formData.sksTatapMuka > 0 && formData.sksPraktikum >= 0 && totalSks > 0;
  };

  const handleSave = async () => {
    setFeedback(null);

    if (!isFormValid()) {
      setFeedback({ type: "error", message: "Mohon isi semua kolom yang ditandai bintang (*)." });
      return;
    }

    const dataToSave = {
      ...formData,
      sksTatapMuka: Number(formData.sksTatapMuka),
      sksPraktikum: Number(formData.sksPraktikum),
      adaPraktikum: Number(formData.sksPraktikum) > 0,
      jenisMataKuliah: formData.opsiMataKuliah ? "Pilihan" : "Wajib",
    };

    createMutation.mutate(dataToSave);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <MainLayout isGreeting={false} titlePage="Tambah Mata Kuliah" className="">
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5 ">
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
            <button onClick={handleSave} className="bg-primary-blueSoft text-white px-4 py-2 rounded flex items-center" disabled={createMutation.isPending}>
              <Save className="mr-2" size={16} />
              {createMutation.isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>

        {/* Feedback Message */}
        {feedback && <div className={`mb-4 p-3 rounded ${feedback.type === "error" ? "bg-red-100 text-red-700 border border-red-300" : "bg-green-100 text-green-700 border border-green-300"}`}>{feedback.message}</div>}

        <div className="flex flex-col md:flex-row">
          {/* --- Sidebar Menu --- */}
          <div className="w-full h-50 text-white p-3 space-y-2 md:w-[20%]">
            <div className="flex items-center bg-[#116E63]/60  mb-1 text-black cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.courseManagement)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p className="text-black font-semibold">Data Mata Kuliah</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-not-allowed " onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.cplCpmkCourse)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>CPL dan CPMK</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-not-allowed " onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.rpsCourse)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>RPS</p>
            </div>
          </div>

          {/* --- Form Data Mata Kuliah --- */}
          <div className="w-full bg-white py-2 px-5 md:w-[80%]">
            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className="w-full font-semibold md:w-1/2">
                  Tahun Kurikulum <span className="text-red-500">*</span>
                </label>
                <select name="tahunKurikulum" value={formData.siakTahunKurikulumId} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="">-- Tahun Kurikulum --</option>
                  {curriculumData.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.tahun}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className=" w-full md:w-1/2 font-semibold">
                  Unit Pengampu <span className="text-red-500">*</span>
                </label>
                <select name="programStudi" value={formData.siakProgramStudiId} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="">-- Unit Pengampu --</option>
                  {programStudiData.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.namaProgramStudi}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className=" w-full md:w-1/2 font-semibold">
                  Kode Mata Kuliah
                  <span className="text-red-500">*</span>
                </label>
                <input type="text" name="kodeMataKuliah" value={formData.kodeMataKuliah} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/50 rounded" />
              </div>
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className=" w-full md:w-1/2 font-semibold">Semester</label>
                <select name="semester" value={formData.semester} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                  <option value={7}>7</option>
                  <option value={8}>8</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className=" w-full md:w-1/2 font-semibold">
                  Nama Mata Kuliah <span className="text-red-500">*</span>
                </label>
                <input type="text" name="namaMataKuliah" value={formData.namaMataKuliah} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/50 rounded" />
              </div>
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className=" w-full md:w-1/2 font-semibold">Prasyarat 1</label>
                <select name="prasyaratMataKuliah1" value={formData.prasyaratMataKuliah1} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="">Cari Mata Kuliah</option>
                  {courseData.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.kodeMataKuliah} - {item.namaMataKuliah}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className=" w-full md:w-1/2 font-semibold">
                  SKS Tatap Muka <span className="text-red-500">*</span>
                </label>
                <input type="number" name="sksTatapMuka" value={formData.sksTatapMuka} onChange={handleInputChange} min="0" className="w-full px-3 py-2 border border-black/50 rounded" />
              </div>
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className=" w-full md:w-1/2 font-semibold">Prasyarat 2</label>
                <select name="prasyaratMataKuliah2" value={formData.prasyaratMataKuliah2} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="">Cari Mata Kuliah</option>
                  {courseData.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.kodeMataKuliah} - {item.namaMataKuliah}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className=" w-full md:w-1/2 font-semibold">
                  SKS Praktikum <span className="text-red-500">*</span>
                </label>
                <input type="number" name="sksPraktikum" value={formData.sksPraktikum} onChange={handleInputChange} min="0" className="w-full px-3 py-2 border border-black/50 rounded" />
              </div>
              <div className="flex items-center gap-4  w-full md:w-1/2">
                <label className="w-full md:w-1/2 font-semibold">Prasyarat 3</label>
                <select name="prasyaratMataKuliah3" value={formData.prasyaratMataKuliah3} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="">Cari Mata Kuliah</option>
                  {courseData.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.kodeMataKuliah} - {item.namaMataKuliah}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <div className="flex items-center gap-4  w-full md:w-1/2">
                <label className=" w-full md:w-1/2 font-semibold">
                  Total SKS <span className="text-red-500">*</span>
                </label>
                <input type="number" value={totalSks} className="w-full px-3 py-2 border border-black/50 rounded bg-gray-200" readOnly />
              </div>
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className="w-full md:w-1/2 font-semibold">Jenis Mata Kuliah</label>
                <select
                  name="opsiMataKuliah"
                  value={formData.opsiMataKuliah ? "true" : "false"}
                  onChange={(e) => setFormData((prev) => ({ ...prev, opsiMataKuliah: e.target.value === "true" }))}
                  className="w-full px-3 py-2 border border-black/50 rounded"
                >
                  <option value="false">Wajib</option>
                  <option value="true">Pilihan</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className="w-full md:w-1/2 font-semibold">Nilai Minimum</label>
                <select name="nilaiMin" value={formData.nilaiMin} onChange={handleInputChange} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddCourse;
