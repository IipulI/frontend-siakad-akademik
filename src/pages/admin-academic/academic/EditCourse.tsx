import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Search, ArrowLeft, Save, CheckCircle, XCircle, X } from "lucide-react";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { getCourseData, getCourseDataById, useUpdateCourse } from "../../../hooks/academic/useCourseManagement.ts";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear.ts";
import { getProdi } from "../../../hooks/academic/useProdi.ts";

// Popup Component
const NotificationPopup = ({ show, type, message, onClose }) => {
  return (
    <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${show ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-md shadow-lg border text-sm
        ${type === "success" ? "bg-green-100 border-green-400 text-green-800" : "bg-red-100 border-red-400 text-red-800"}`}
      >
        {type === "success" ? <CheckCircle size={20} className="text-green-600" /> : <XCircle size={20} className="text-red-600" />}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-700">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    tahunKurikulum: "",
    programStudi: "",
    siakProgramStudiId: "",
    siakTahunKurikulumId: "",
    sksTatapMuka: "",
    sksPraktikum: "",
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
  const totalSks = (parseInt(formData.sksTatapMuka || "0", 10) || 0) + (parseInt(formData.sksPraktikum || "0", 10) || 0);

  // --queries ---
  const { data: courseEdit, isLoading, error } = getCourseDataById(id!);
  const { data: curriculumData = [], isLoading: isCurriculumLoading, error: curriculumError } = getCurriculumYear();
  const { data: prodiData = [], isLoading: isProdiLoading, error: prodiError } = getProdi();
  const { data: courseResponse, isLoading: isCourseLoading, error: courseError } = getCourseData();
  const courseData = courseResponse?.data ?? [];
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState<{ type: "success" | "error"; message: string }>({ type: "success", message: "" });

  useEffect(() => {
    console.log("Course edit data:", courseEdit);

    if (courseEdit) {
      setFormData({
        tahunKurikulum: courseEdit.tahunKurikulum?.tahun || "",
        programStudi: courseEdit.programStudi?.nama || "",
        siakProgramStudiId: courseEdit.siakProgramStudiId || "",
        siakTahunKurikulumId: courseEdit.siakTahunKurikulumId || "",
        sksTatapMuka: courseEdit.sksTatapMuka || 0,
        sksPraktikum: courseEdit.sksPraktikum || 0,
        semester: courseEdit.semester || "",
        adaPraktikum: courseEdit.adaPraktikum || false,
        nilaiMin: courseEdit.nilaiMin || "",
        kodeMataKuliah: courseEdit.kode || "",
        namaMataKuliah: courseEdit.nama || "",
        jenisMataKuliah: courseEdit.jenis || "",
        opsiMataKuliah: courseEdit.opsiWajib || false,
        prasyaratMataKuliah1Id: courseEdit.prasyaratMataKuliah1?.id || "",
        prasyaratMataKuliah2Id: courseEdit.prasyaratMataKuliah2?.id || "",
        prasyaratMataKuliah3Id: courseEdit.prasyaratMataKuliah3?.id || "",
      });
    }
  }, [courseEdit]);

  // Update siakProgramStudiId ketika programStudi berubah
  useEffect(() => {
    if (formData.programStudi && prodiData.length > 0) {
      const selectedProdi = prodiData.find((prodi) => prodi.namaProgramStudi === formData.programStudi);
      if (selectedProdi) {
        setFormData((prev) => ({
          ...prev,
          siakProgramStudiId: selectedProdi.id,
        }));
      }
    }
  }, [formData.programStudi, prodiData]); // Fixed: changed programStudiData to prodiData

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

  const updateMutation = useUpdateCourse(); // Fixed: renamed from mutation to updateMutation

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

  const handleClosePopup = () => {
    setShowPopup(false);
    if (popupConfig.type === "success") {
      navigate(AdminAcademicRoute.courseManagement.courseManagement);
    }
  };

  const handleSave = () => {
    console.log("Klik Simpan"); // Tambahkan ini

    if (!id) return;

    if (!formData.kodeMataKuliah || !formData.namaMataKuliah) {
      alert("Kode Mata Kuliah dan Nama Mata Kuliah harus diisi!");
      return;
    }

    updateMutation.mutate(
      {
        id,
        data: {
          ...formData,
          sksTatapMuka: parseInt(formData.sksTatapMuka || "0", 10),
          sksPraktikum: parseInt(formData.sksPraktikum || "0", 10),
        },
      },
      {
        onSuccess: (data) => {
          console.log("✅ Sukses update:", data); // Tambahkan ini
          setPopupConfig({
            type: "success",
            message: "Mata kuliah berhasil disimpan!",
          });
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            navigate(AdminAcademicRoute.courseManagement.courseManagement);
          }, 2000);
        },
        onError: (error: any) => {
          console.error("❌ Error update:", error);
          setPopupConfig({
            type: "error",
            message: error?.response?.data?.message || error?.message || "Gagal menambahkan mata kuliah. Silakan coba lagi.",
          });
          setShowPopup(true);
        },
      }
    );
  };

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
  };

  // Filter mata kuliah untuk prasyarat (excludes mata kuliah yang sedang diedit)
  // Fixed: changed allCoursesData to courseData
  const availableCoursesForPrerequisite = courseData.filter((course) => course.id !== id);

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
      <NotificationPopup show={showPopup} type={popupConfig.type} message={popupConfig.message} onClose={handleClosePopup} />
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
            <button onClick={handleSave} disabled={updateMutation.isPending} className="bg-primary-green text-white px-4 py-2 rounded flex items-center disabled:opacity-50 cursor-pointer">
              <Save className="mr-2" size={16} />
              {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
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
                  {prodiData.map((prodi) => (
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
                      {course.kode} - {course.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 mb-4 flex-col md:flex-row">
              <div className="md:w-1/2 w-full">
                <label className="block mb-2 font-medium">
                  SKS Tatap Muka<span className="text-red-500">*</span>
                </label>
                <input type="number" name="sksTatapMuka" value={formData.sksTatapMuka} onChange={(e) => handleInputChange("sksTatapMuka", e.target.value)} className="w-full px-3 py-2 border border-black/50 rounded" min="0" />
              </div>
              <div className="md:w-1/2 w-full">
                <label className="block mb-2 font-medium">Mata Kuliah Prasyarat 2</label>
                <select value={formData.prasyaratMataKuliah2Id} onChange={(e) => handleInputChange("prasyaratMataKuliah2Id", e.target.value)} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="">Pilih Mata Kuliah Prasyarat</option>
                  {availableCoursesForPrerequisite.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.kode} - {course.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 mb-4 flex-col md:flex-row">
              <div className="md:w-1/2 w-full">
                <label className="block mb-2 font-medium">
                  SKS Praktikum<span className="text-red-500">*</span>
                </label>
                <input type="number" value={formData.sksPraktikum} onChange={(e) => handleInputChange("sksPraktikum", e.target.value)} className="w-full px-3 py-2 border border-black/50 rounded" min="0" />
              </div>
              <div className="md:w-1/2 w-full">
                <label className="block mb-2 font-medium">Mata Kuliah Prasyarat 3</label>
                <select value={formData.prasyaratMataKuliah3Id} onChange={(e) => handleInputChange("prasyaratMataKuliah3Id", e.target.value)} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value="">Pilih Mata Kuliah Prasyarat</option>
                  {availableCoursesForPrerequisite.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.kode} - {course.nama}
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
                <select name="nilaiMin" value={formData.nilaiMin} onChange={(e) => handleInputChange("nilaiMin", e.target.value)} className="w-full px-3 py-2 border border-black/50 rounded">
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

export default EditCourse;
