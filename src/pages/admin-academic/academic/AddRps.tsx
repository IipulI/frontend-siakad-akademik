import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import RichTextEditor from "../../../components/admin-academic/academic/RichTextEditor";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { getCourseData } from "../../../hooks/academic/useCourseManagement";
import { getDosen } from "../../../hooks/academic/useDosen";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear";
// import { getAcademicPeriods as getPeriodeAkdemikCoba } from "../../../hooks/usePeriodeAkademik";
import { useAddRps } from "../../../hooks/academic/useRpsManagement";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { RawDraftContentState, EditorState, convertToRaw } from "draft-js";
import {
  getAcademicPeriods,
  getLecturers,
  getProgramStudi,
  getYearCuriculum,
} from "../../../hooks/useGeneral";

const emptyRichTextState = convertToRaw(
  EditorState.createEmpty().getCurrentContent()
);

// Tipe data untuk state form agar lebih aman dan terstruktur
interface RpsFormData {
  siakTahunKurikulumId: string;
  siakPeriodeAkademikId: string;
  siakProgramStudiId: string;
  siakMataKuliahId: string;
  tanggalPenyusun: string;
  dosenPenyusun: string[];
  deskripsiMataKuliah: RawDraftContentState;
  tujuanMataKuliah: RawDraftContentState;
  materiPembelajaran: RawDraftContentState;
  pustakaUtama: RawDraftContentState;
  pustakaPendukung: RawDraftContentState;
  dokumenRps: File | null;
}

const AddRps = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tahunKurikulumParam = searchParams.get("tahunKurikulum");
  const periodeAkademikParam = searchParams.get("periodeAkademik");
  const programStudiParam = searchParams.get("programStudi");

  const {
    data: courseData = [],
    isLoading: isCourseLoading,
    error: courseError,
  } = getCourseData();
  const {
    data: dosenData,
    isLoading: isDosenLoading,
    error: dosenError,
  } = getLecturers();
  const {
    data: curriculumData,
    isLoading: isCurriculumLoading,
    error: curriculumError,
  } = getYearCuriculum();
  const {
    data: prodiData,
    isLoading: isProdiLoading,
    error: prodiError,
  } = getProgramStudi();
  const {
    data: periodeAkademikData,
    isLoading: isPeriodeAkademikLoading,
    error: periodeAkademikError,
  } = getAcademicPeriods();

  const addRpsMutation = useAddRps();

  const [formData, setFormData] = useState<RpsFormData>({
    siakTahunKurikulumId: tahunKurikulumParam || "",
    siakPeriodeAkademikId: periodeAkademikParam || "",
    siakProgramStudiId: programStudiParam || "",
    siakMataKuliahId: "",
    tanggalPenyusun: "",
    dosenPenyusun: [], // State awal adalah array kosong
    deskripsiMataKuliah: emptyRichTextState,
    tujuanMataKuliah: emptyRichTextState,
    materiPembelajaran: emptyRichTextState,
    pustakaUtama: emptyRichTextState,
    pustakaPendukung: emptyRichTextState,
    dokumenRps: null,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      siakTahunKurikulumId: tahunKurikulumParam || "",
      siakPeriodeAkademikId: periodeAkademikParam || "",
      siakProgramStudiId: programStudiParam || "",
    }));
  }, [tahunKurikulumParam, periodeAkademikParam, programStudiParam]);

  if (
    isCourseLoading ||
    isDosenLoading ||
    isCurriculumLoading ||
    isProdiLoading ||
    isPeriodeAkademikLoading
  ) {
    return <LoadingSpinner />;
  }

  if (
    courseError ||
    dosenError ||
    curriculumError ||
    prodiError ||
    periodeAkademikError
  ) {
    return (
      <div className="text-red-500">
        Gagal memuat data. Silakan refresh halaman.
      </div>
    );
  }

  const handleBack = () => {
    navigate(AdminAcademicRoute.rpsManagement.rpsManagement);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDosen = () => {
    if (formData.dosenPenyusun.length >= 5) {
      // Limit to 5 dosen
      alert("Maksimal 5 dosen penyusun");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      dosenPenyusun: [...prev.dosenPenyusun, ""],
    }));
  };

  const handleChangeDosen = (index: number, value: string) => {
    const updatedDosen = [...formData.dosenPenyusun];
    updatedDosen[index] = value;

    setFormData((prev) => ({
      ...prev,
      dosenPenyusun: updatedDosen,
    }));
  };

  const handleRemoveDosen = (index: number) => {
    const updatedDosen = [...formData.dosenPenyusun];
    updatedDosen.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      dosenPenyusun: updatedDosen,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, dokumenRps: file }));
  };

  const handleEditorChange = (name: string, value: RawDraftContentState) => {
    console.log(
      `Data dari editor '${name}':`,
      JSON.parse(JSON.stringify(value))
    );

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const convertDraftToPlainText = (
    draftContent: RawDraftContentState
  ): string => {
    try {
      if (
        !draftContent ||
        !draftContent.blocks ||
        draftContent.blocks.length === 0
      ) {
        return "";
      }

      return draftContent.blocks
        .map((block) => (block.text || "").trim())
        .filter((text) => text !== "")
        .join("\n");
    } catch (error) {
      console.error("Error converting draft content to plain text:", error);
      return "";
    }
  };

  const handleSave = async () => {
    if (
      !formData.siakTahunKurikulumId ||
      !formData.siakPeriodeAkademikId ||
      !formData.siakProgramStudiId ||
      !formData.siakMataKuliahId ||
      !formData.tanggalPenyusun
    ) {
      alert("Harap lengkapi semua field yang wajib diisi (ditandai dengan *)!");
      return;
    }

    const uniqueDosenIds = [...new Set(formData.dosenPenyusun)].filter(
      (id) => id && id.trim() !== ""
    );
    if (uniqueDosenIds.length === 0) {
      alert("Harap pilih minimal satu dosen penyusun!");
      return;
    }

    // Buat JSON dari data request
    const requestPayload = {
      siakProgramStudiId: formData.siakProgramStudiId,
      siakPeriodeAkademikId: formData.siakPeriodeAkademikId,
      siakTahunKurikulumId: formData.siakTahunKurikulumId,
      siakMataKuliahId: formData.siakMataKuliahId,
      tanggalPenyusun: formData.tanggalPenyusun,
      dosenIds: uniqueDosenIds,
      deskripsiMataKuliah: JSON.stringify(formData.deskripsiMataKuliah),
      tujuanMataKuliah: JSON.stringify(formData.tujuanMataKuliah),
      materiPembelajaran: JSON.stringify(formData.materiPembelajaran),
      pustakaUtama: JSON.stringify(formData.pustakaUtama),
      pustakaPendukung: JSON.stringify(formData.pustakaPendukung),
    };

    const formDataToSend = new FormData();
    formDataToSend.append("request", JSON.stringify(requestPayload));

    if (formData.dokumenRps) {
      formDataToSend.append("dokumenRps", formData.dokumenRps);
    }

    try {
      await addRpsMutation.mutateAsync(formDataToSend);
      alert("Data RPS berhasil disimpan!");
      navigate(AdminAcademicRoute.rpsManagement.rpsManagement);
    } catch (error: any) {
      console.error("Full error object:", error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Terjadi kesalahan tidak diketahui.";
      alert("Gagal menyimpan data RPS: " + msg);
    }
  };

  const selectedTahunKurikulum = curriculumData.find(
    (item) => item.id === formData.siakTahunKurikulumId
  );
  const selectedPeriodeAkademik = periodeAkademikData.find(
    (item) => item.id === formData.siakPeriodeAkademikId
  );
  const selectedProgramStudi = prodiData.find(
    (item) => item.id === formData.siakProgramStudiId
  );

  return (
    <MainLayout isGreeting={false} titlePage="Tambah RPS">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-green px-5 relative">
        <div className="flex items-center justify-end mb-6 mt-4">
          <div className="flex gap-2">
            <button
              onClick={handleBack}
              className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer"
              disabled={addRpsMutation.isPending}
            >
              <ArrowLeft className="mr-2" size={16} />
              Kembali ke Daftar
            </button>
            <button
              onClick={handleSave}
              className="bg-primary-blueSoft text-white px-4 py-2 rounded flex items-center disabled:opacity-50 cursor-pointer"
              disabled={addRpsMutation.isPending}
            >
              <Save className="mr-2" size={16} />
              {addRpsMutation.isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>

        {/* Header Info */}
        <div className="flex mb-6 mt-8">
          {/* Garis hijau di kiri */}
          <div className="bg-primary-green w-2"></div>

          {/* Konten kanan */}
          <div className="flex flex-col justify-between bg-[#F5FFF9] p-4 flex-1 md:flex-row md:gap-4">
            {/* Kolom 1 */}
            <div className="flex-1">
              <div className="flex justify-between gap-2 md:justify-normal">
                <div className="font-semibold text-primary-green">
                  Tahun Kurikulum:
                </div>
                <div>{selectedTahunKurikulum?.tahun || "Belum dipilih"}</div>
              </div>
            </div>

            {/* Kolom 2 */}
            <div className="flex-1">
              <div className="flex justify-between gap-2 md:justify-normal">
                <div className="font-semibold text-primary-green">
                  Periode Akademik:
                </div>
                <div>
                  {selectedPeriodeAkademik?.namaPeriode || "Belum dipilih"}
                </div>
              </div>
            </div>

            {/* Kolom 3 */}
            <div className="flex-1">
              <div className="flex justify-between md:justify-normal">
                <div className="font-semibold text-primary-green">
                  Program Studi:
                </div>
                <div>
                  {selectedProgramStudi?.namaProgramStudi || "Belum dipilih"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-6">
          {/* Periode Akademik */}
          <div className="form-group flex flex-col items-start md:items-center gap-4 md:flex-row">
            <label className="w-48 font-medium">
              Periode Akademik<span className="text-red-500">*</span>
            </label>
            <select
              name="siakPeriodeAkademikId"
              value={formData.siakPeriodeAkademikId}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded w-full"
              required
            >
              <option disabled>-- Pilih Periode Akademik --</option>
              {periodeAkademikData.map((academicPeriod) => (
                <option key={academicPeriod.id} value={academicPeriod.id}>
                  {academicPeriod.namaPeriode}
                </option>
              ))}
            </select>
          </div>

          {/* Tahun Kurikulum */}
          <div className="form-group flex flex-col items-start md:items-center gap-4 md:flex-row">
            <label className="w-48 font-medium">
              Tahun Kurikulum<span className="text-red-500">*</span>
            </label>
            <select
              name="siakTahunKurikulumId"
              value={formData.siakTahunKurikulumId}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded w-full"
              required
            >
              <option disabled>-- Pilih Tahun Kurikulum --</option>
              {curriculumData.map((curriculum) => (
                <option key={curriculum.id} value={curriculum.id}>
                  {curriculum.tahun}
                </option>
              ))}
            </select>
          </div>

          {/* Program Studi */}
          <div className="form-group flex flex-col items-start md:items-center gap-4 md:flex-row">
            <label className="w-48 font-medium">
              Program Studi<span className="text-red-500">*</span>
            </label>
            <select
              name="siakProgramStudiId"
              value={formData.siakProgramStudiId}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded w-full"
              required
            >
              <option disabled>-- Program Studi --</option>
              {prodiData.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.namaProgramStudi}
                </option>
              ))}
            </select>
          </div>

          {/* Mata Kuliah */}
          <div className="form-group flex flex-col items-start md:items-center gap-4 md:flex-row">
            <label className="w-48 font-medium">
              Mata Kuliah<span className="text-red-500">*</span>
            </label>
            <select
              name="siakMataKuliahId"
              value={formData.siakMataKuliahId}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded w-full"
              required
            >
              <option disabled>-- Pilih Mata Kuliah --</option>

              {(() => {
                const selectedProdi = prodiData.find(
                  (p) => p.id === formData.siakProgramStudiId
                );

                const filteredCourses = courseData.filter(
                  (course) =>
                    course.programStudi === selectedProdi?.namaProgramStudi
                );

                if (filteredCourses.length === 0) {
                  return (
                    <option disabled>Tidak ada mata kuliah tersedia</option>
                  );
                }

                return filteredCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.namaMataKuliah}
                  </option>
                ));
              })()}
            </select>
          </div>

          {/* Tanggal Perkuliahan */}
          <div className="form-group flex flex-col items-start md:items-center md:flex-row gap-4">
            <label className="w-48 font-medium">
              Tanggal Penyusunan<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="tanggalPenyusun"
              value={formData.tanggalPenyusun}
              onChange={handleChange}
              className="flex-1 p-2 border border-gray-300 rounded w-full"
              required
            />
          </div>

          {/* Dosen Penyusun */}
          <div className="form-group flex flex-col items-start gap-4 md:flex">
            <label className="font-medium">
              Dosen Penyusun<span className="text-red-500">*</span>
            </label>
            <div className="space-y-3 w-full">
              {formData.dosenPenyusun.map((dosenId, index) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={dosenId}
                    onChange={(e) => handleChangeDosen(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded"
                  >
                    <option value="">-- Pilih Dosen --</option>
                    {dosenData.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nama}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveDosen(index)}
                    className="text-red-600 hover:text-red-800 text-sm p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddDosen}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                + Tambah Dosen
              </button>
            </div>
          </div>

          {/* RichText Fields */}
          {[
            { name: "deskripsiMataKuliah", label: "Deskripsi Mata Kuliah" },
            { name: "tujuanMataKuliah", label: "Tujuan Mata Kuliah" },
            { name: "materiPembelajaran", label: "Materi Pembelajaran" },
            { name: "pustakaUtama", label: "Pustaka Utama" },
            { name: "pustakaPendukung", label: "Pustaka Pendukung" },
          ].map((field) => (
            <div
              key={field.name}
              className="form-group flex flex-col items-start gap-4 md:flex-row"
            >
              <label className="w-full md:w-48 font-medium pt-2">
                {field.label}
              </label>
              <div className="flex-1 w-full">
                <RichTextEditor
                  name={field.name}
                  value={
                    formData[
                      field.name as keyof Omit<RpsFormData, "dokumenRps">
                    ]
                  }
                  onChange={handleEditorChange}
                />
              </div>
            </div>
          ))}

          {/* Upload Dokumen */}
          <div className="form-group flex flex-col items-start gap-4 mb-4 md:flex-row">
            <label
              htmlFor="dokumenRps"
              className="w-full md:w-48 font-medium text-gray-700 pt-2"
            >
              Dokumen RPS
            </label>
            <div className="flex flex-col flex-1 w-full">
              {formData.dokumenRps && (
                <div className="text-primary-green text-sm font-semibold mb-1">
                  {formData.dokumenRps.name}
                </div>
              )}
              <input
                id="dokumenRps"
                type="file"
                name="dokumenRps"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileChange}
                className="border border-gray-300 rounded px-3 py-2"
              />
              <p className="text-sm text-blue-500 mt-1">
                .pdf, .doc, .docx, .xls, .xlsx (maxsize: 10 MB)
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddRps;
