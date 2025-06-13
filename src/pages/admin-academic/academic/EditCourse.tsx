import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { Api } from "../../../api/Index";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { CourseData, CurriculumData, ProgramStudiData } from "../../../components/types";
import { Search, ArrowLeft, Save } from "lucide-react";
import { AdminAcademicRoute } from "../../../types/VarRoutes";

// --- api functons ---
const fetchCourseEdit = async ({ queryKey }) => {
  const [, id] = queryKey;
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get(`/akademik/mata-kuliah/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.data;
};

const fetchAllCourses = async (): Promise<CourseData[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get("/akademik/mata-kuliah", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = response.data?.data;

  let courseData: CourseData[] = [];

  if (Array.isArray(data)) {
    courseData = data as CourseData[];
  } else if (typeof data === "object" && data !== null) {
    courseData = Object.values(data as Record<string, unknown>).filter((item): item is CourseData => typeof item === "object" && item !== null && "id" in item);
  }

  return courseData;
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

const updateCourse = async ({ id, data }) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const payload = {
    siakProgramStudiId: data.siakProgramStudiId,
    siakTahunKurikulumId: data.siakTahunKurikulumId,
    sksTatapMuka: data.sksTatapMuka,
    sksPraktikum: data.sksPraktikum,
    semester: data.semester,
    adaPraktikum: data.adaPraktikum,
    nilaiMin: data.nilaiMin,
    kodeMataKuliah: data.kodeMataKuliah,
    namaMataKuliah: data.namaMataKuliah,
    jenisMataKuliah: data.jenisMataKuliah,
    prasyaratMataKuliah1Id: data.prasyaratMataKuliah1Id || "",
    prasyaratMataKuliah2Id: data.prasyaratMataKuliah2Id || "",
    prasyaratMataKuliah3Id: data.prasyaratMataKuliah3Id || "",
  };

  await Api.put(`/akademik/mata-kuliah/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return { id, ...data };
};

// --- edit course component ---
const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    tahunKurikulum: "",
    programStudi: "",
    siakProgramStudiId: "",
    siakTahunKurikulumId: "",
    sksTatapMuka: 0,
    sksPraktikum: 0,
    semester: "",
    adaPraktikum: false,
    nilaiMin: "",
    kodeMataKuliah: "",
    namaMataKuliah: "",
    jenisMataKuliah: "",
    opsiMataKuliah: false,
    prasyaratMataKuliah1Id: "",
    prasyaratMataKuliah2Id: "",
    prasyaratMataKuliah3Id: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const totalSks = formData.sksTatapMuka + formData.sksPraktikum;

  // --queries ---
  const {
    data: courseEdit,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courseEditData", id],
    queryFn: fetchCourseEdit,
    enabled: !!id,
  });

  const { data: curriculumData = [] } = useQuery({
    queryKey: ["curriculumData"],
    queryFn: fetchCurriculumData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: programStudiData = [] } = useQuery({
    queryKey: ["programStudiData"],
    queryFn: fetchProdiData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: allCoursesData = [] } = useQuery({
    queryKey: ["allCoursesData"],
    queryFn: fetchAllCourses,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (courseEdit) {
      setFormData({
        tahunKurikulum: courseEdit.tahunKurikulum || "",
        programStudi: courseEdit.programStudi || "",
        siakProgramStudiId: courseEdit.siakProgramStudiId || "",
        siakTahunKurikulumId: courseEdit.siakTahunKurikulumId || "",
        sksTatapMuka: courseEdit.sksTatapMuka || 0,
        sksPraktikum: courseEdit.sksPraktikum || 0,
        semester: courseEdit.semester || "",
        adaPraktikum: courseEdit.adaPraktikum || false,
        nilaiMin: courseEdit.nilaiMin || "",
        kodeMataKuliah: courseEdit.kodeMataKuliah || "",
        namaMataKuliah: courseEdit.namaMataKuliah || "",
        jenisMataKuliah: courseEdit.jenisMataKuliah || "",
        opsiMataKuliah: courseEdit.opsiMataKuliah || false,
        prasyaratMataKuliah1Id: courseEdit.prasyaratMataKuliah1Id || "",
        prasyaratMataKuliah2Id: courseEdit.prasyaratMataKuliah2Id || "",
        prasyaratMataKuliah3Id: courseEdit.prasyaratMataKuliah3Id || "",
      });
    }
  }, [courseEdit]);

  // Update siakProgramStudiId ketika programStudi berubah
  useEffect(() => {
    if (formData.programStudi && programStudiData.length > 0) {
      const selectedProdi = programStudiData.find((prodi) => prodi.namaProgramStudi === formData.programStudi);
      if (selectedProdi) {
        setFormData((prev) => ({
          ...prev,
          siakProgramStudiId: selectedProdi.id,
        }));
      }
    }
  }, [formData.programStudi, programStudiData]);

  // Update siakTahunKurikulumId ketika tahunKurikulum berubah
  useEffect(() => {
    if (formData.tahunKurikulum && curriculumData.length > 0) {
      const selectedCurriculum = curriculumData.find((curriculum) => curriculum.tahun === formData.tahunKurikulum);
      if (selectedCurriculum) {
        setFormData((prev) => ({
          ...prev,
          siakTahunKurikulumId: selectedCurriculum.id,
        }));
      }
    }
  }, [formData.tahunKurikulum, curriculumData]);

  const mutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courseUpdateData", id] });
      alert("Data mata kuliah berhasil diperbarui!");
      navigate(AdminAcademicRoute.courseManagement.courseManagement);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBack = () => {
    navigate(AdminAcademicRoute.courseManagement.courseManagement);
  };

  const handleNavigation = (route) => {
    navigate(route);
  };

  const handleSave = () => {
    if (!id) return;

    // Validasi form
    if (!formData.kodeMataKuliah || !formData.namaMataKuliah) {
      alert("Kode Mata Kuliah dan Nama Mata Kuliah harus diisi!");
      return;
    }

    mutation.mutate({ id, data: formData });
  };

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  // Filter mata kuliah untuk prasyarat (excludes mata kuliah yang sedang diedit)
  const availableCoursesForPrerequisite = allCoursesData.filter((course) => course.id !== id);

  if (isLoading) {
    return (
      <MainLayout isGreeting={false} titlePage="Edit Mata Kuliah" className="">
        <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
          <div className="flex items-center justify-center py-10">
            <p>Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout isGreeting={false} titlePage="Edit Mata Kuliah" className="">
        <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
          <div className="flex items-center justify-center py-10">
            <p>Error: {error.message}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isGreeting={false} titlePage="Edit Mata Kuliah" className="">
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex flex-col items-center justify-between mb-10 md:flex-row gap-4">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="flex items-center bg-primary-blueDark text-white px-3 py-3 rounded">
              <ArrowLeft className="mr-2" size={16} />
            </button>
            <div className="flex items-center">
              <input type="search" placeholder="Cari Mata Kuliah" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-3 py-2 border border-black/50 rounded-l-md w-64" />
              <button onClick={handleSearch} className="bg-primary-yellow px-3 py-3 rounded-r-md">
                <Search color="white" size={20} />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleBack} className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center">
              <ArrowLeft className="mr-2" size={16} />
              Kembali ke Daftar
            </button>
            <button onClick={handleSave} disabled={mutation.isPending} className="bg-primary-green text-white px-4 py-2 rounded flex items-center disabled:opacity-50">
              <Save className="mr-2" size={16} />
              {mutation.isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar Menu */}
          <div className="w-full md:w-[20%] h-50 text-white p-3 space-y-2">
            <div className="flex items-center bg-[#116E63]/60 mb-1 text-black cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.courseManagement)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3"></div>
              <p className="text-black font-semibold">Data Mata Kuliah</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.cplCpmkCourse)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3"></div>
              <p>CPL dan CPMK</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.rpsCourse)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3"></div>
              <p>RPS</p>
            </div>
          </div>

          {/* Form Data Mata Kuliah */}
          <div className="w-full  md:w-[80%] bg-white py-2 px-5">
            <div className="flex gap-4 mb-4 flex-col md:flex-row">
              <div className=" w-full md:w-1/2">
                <label className="block mb-2 font-medium">Tahun Kurikulum</label>
                <select value={formData.tahunKurikulum} onChange={(e) => handleInputChange("tahunKurikulum", e.target.value)} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="">Pilih Tahun Kurikulum</option>
                  {curriculumData.map((curriculum) => (
                    <option key={curriculum.id} value={curriculum.tahun}>
                      {curriculum.tahun}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:w-1/2 w-full">
                <label className="block mb-2 font-medium">Unit Pengampu</label>
                <select value={formData.programStudi} onChange={(e) => handleInputChange("programStudi", e.target.value)} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="">Pilih Unit Pengampu</option>
                  {programStudiData.map((prodi) => (
                    <option key={prodi.id} value={prodi.namaProgramStudi}>
                      {prodi.namaProgramStudi}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 mb-4 flex-col md:flex-row">
              <div className="md:w-1/2 w-full ">
                <label className="block mb-2 font-medium">Kode Mata Kuliah*</label>
                <input type="text" value={formData.kodeMataKuliah} onChange={(e) => handleInputChange("kodeMataKuliah", e.target.value)} className="w-full px-3 py-2 border border-black/50 rounded" required />
              </div>
              <div className="md:w-1/2 w-full">
                <label className="block mb-2 font-medium">Semester</label>
                <select value={formData.semester} onChange={(e) => handleInputChange("semester", e.target.value)} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="">Pilih Semester</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mb-4 flex-col md:flex-row">
              <div className="md:w-1/2 w-full">
                <label className="block mb-2 font-medium">Nama Mata Kuliah*</label>
                <input type="text" value={formData.namaMataKuliah} onChange={(e) => handleInputChange("namaMataKuliah", e.target.value)} className="w-full px-3 py-2 border border-black/50 rounded" required />
              </div>
              <div className="md:w-1/2 w-full">
                <label className="block mb-2 font-medium">Mata Kuliah Prasyarat 1</label>
                <select value={formData.prasyaratMataKuliah1Id} onChange={(e) => handleInputChange("prasyaratMataKuliah1Id", e.target.value)} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="">Pilih Mata Kuliah Prasyarat</option>
                  {availableCoursesForPrerequisite.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.kodeMataKuliah} - {course.namaMataKuliah}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 mb-4 flex-col md:flex-row">
              <div className="md:w-1/2 w-full">
                <label className="block mb-2 font-medium">SKS Tatap Muka*</label>
                <input type="number" value={formData.sksTatapMuka} onChange={(e) => handleInputChange("sksTatapMuka", Number(e.target.value))} className="w-full px-3 py-2 border border-black/50 rounded" min="0" />
              </div>
              <div className="md:w-1/2 w-full">
                <label className="block mb-2 font-medium">Mata Kuliah Prasyarat 2</label>
                <select value={formData.prasyaratMataKuliah2Id} onChange={(e) => handleInputChange("prasyaratMataKuliah2Id", e.target.value)} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="">Pilih Mata Kuliah Prasyarat</option>
                  {availableCoursesForPrerequisite.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.kodeMataKuliah} - {course.namaMataKuliah}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 mb-4 flex-col md:flex-row">
              <div className="md:w-1/2 w-full">
                <label className="block mb-2 font-medium">SKS Praktikum*</label>
                <input type="number" value={formData.sksPraktikum} onChange={(e) => handleInputChange("sksPraktikum", Number(e.target.value))} className="w-full px-3 py-2 border border-black/50 rounded" min="0" />
              </div>
              <div className="md:w-1/2 w-full">
                <label className="block mb-2 font-medium">Mata Kuliah Prasyarat 3</label>
                <select value={formData.prasyaratMataKuliah3Id} onChange={(e) => handleInputChange("prasyaratMataKuliah3Id", e.target.value)} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="">Pilih Mata Kuliah Prasyarat</option>
                  {availableCoursesForPrerequisite.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.kodeMataKuliah} - {course.namaMataKuliah}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 mb-4 flex-col md:flex-row">
              <div className="md:w-1/2 w-full">
                <label className="block mb-2 font-medium">Total SKS*</label>
                <input type="number" value={totalSks} className="w-full px-3 py-2 border border-black/50 rounded bg-gray-200" readOnly />
              </div>
              <div className="md:w-1/2 w-full">
                <label className="block mb-2 font-medium">Jenis Mata Kuliah</label>
                <select value={formData.jenisMataKuliah} onChange={(e) => handleInputChange("jenisMataKuliah", e.target.value)} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="">Pilih Jenis Mata Kuliah</option>
                  <option value="Wajib">Wajib</option>
                  <option value="Pilihan">Pilihan</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mb-4 flex-col md:flex-row">
              <div className="md:w-1/2 w-full">
                <label className="block mb-2 font-medium">Nilai Minimum</label>
                <input type="text" value={formData.nilaiMin} onChange={(e) => handleInputChange("nilaiMin", e.target.value)} className="w-full px-3 py-2 border border-black/50 rounded" placeholder="Contoh: C" />
              </div>
              {/* <div className="w-1/2">
                <div className="flex items-center mt-8">
                  <input type="checkbox" id="adaPraktikum" checked={formData.adaPraktikum} onChange={(e) => handleInputChange("adaPraktikum", e.target.checked)} className="mr-2" />
                  <label htmlFor="adaPraktikum" className="font-medium">
                    Ada Praktikum
                  </label>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditCourse;
