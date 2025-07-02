import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Save } from "lucide-react";
import RichTextEditor from "../../../components/admin-academic/academic/RichTextEditor";
import { EditorState, convertToRaw, convertFromHTML } from "draft-js";
import { Api } from "../../../api/Index.tsx";
import { RpsData } from "../../../components/types.ts";
import { useQuery } from "@tanstack/react-query";
import { getDosen } from "../../../hooks/academic/useDosen.ts";
import { getCourseData } from "../../../hooks/academic/useCourseManagement.ts";

const fetchRpsDetail = async (id: string): Promise<RpsData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get(`/akademik/rps/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("🔍 Raw course detail API data:", response.data.data);

  return response.data.data;
};

const EditRps = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: dosenData = [], isLoading: isDosenLoading, error: dosenError } = getDosen();
  const { data: courseData = [], isLoading: isCourseLoading, error: courseError } = getCourseData();

  const emptyDraftState = convertToRaw(EditorState.createEmpty().getCurrentContent());

  const handleBack = () => {
    navigate(AdminAcademicRoute.rpsManagement.rpsManagement);
  };

  const [formData, setFormData] = useState({
    mataKuliah: "",
    tanggalPenyusunan: "",
    dosenPenyusun: "",
    deskripsiMataKuliah: emptyDraftState,
    tujuanMataKuliah: emptyDraftState,
    materiPembelajaran: emptyDraftState,
    pustakaUtama: emptyDraftState,
    pustakaPendukung: emptyDraftState,
    dokumenRps: File | null,
  });

  const {
    data: rpsDetail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rpsDetail", id],
    queryFn: () => fetchRpsDetail(id!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const convertHtmlToDraft = (html: string | null | undefined) => {
    if (!html) {
      return emptyDraftState;
    }
    try {
      const contentBlocks = convertFromHTML(html);
      if (contentBlocks.contentBlocks) {
        return convertToRaw(EditorState.createWithContent(contentBlocks).getCurrentContent());
      }
      return emptyDraftState;
    } catch {
      return emptyDraftState;
    }
  };

  useEffect(() => {
    if (rpsDetail) {
      setFormData({
        mataKuliah: rpsDetail.mataKuliah?.id || "",
        tanggalPenyusunan: rpsDetail.tanggalPenyusun?.split("T")[0] || "",
        dosenPenyusun: rpsDetail.dosenPenyusun[0]?.id || "",
        // Konversi string HTML dari API ke format draft-js sebelum disimpan ke state
        deskripsiMataKuliah: convertHtmlToDraft(rpsDetail.deskripsiMataKuliah),
        tujuanMataKuliah: convertHtmlToDraft(rpsDetail.tujuanMataKuliah),
        materiPembelajaran: convertHtmlToDraft(rpsDetail.materiPembelajaran),
        pustakaUtama: convertHtmlToDraft(rpsDetail.pustakaUtama),
        pustakaPendukung: convertHtmlToDraft(rpsDetail.pustakaPendukung),
        dokumenRps: null,
      });
    }
  }, [rpsDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, dokumenRps: file }));
  };

  const handleEditorChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = () => {
    console.log("Data disimpan:", formData);
    // TODO: Simpan data ke backend di sini
  };

  return (
    <MainLayout isGreeting={false} titlePage="Edit RPS">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-green px-5 relative">
        <div className="flex items-center justify-end mb-6 mt-4">
          <div className="flex gap-2">
            <button onClick={handleBack} className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer">
              <ArrowLeft className="mr-2" size={16} />
              Kembali ke Daftar
            </button>
            <button onClick={handleSave} className="bg-primary-blueSoft text-white px-4 py-2 rounded flex items-center">
              <Save className="mr-2" size={16} />
              Simpan
            </button>
          </div>
        </div>

        {/* Header Info */}
        <div className="flex  mb-6 mt-8 ">
          {/* Garis hijau di kiri */}
          <div className="bg-primary-green w-2"></div>

          {/* Konten kanan */}
          <div className="flex flex-col justify-between bg-[#F5FFF9] p-4 flex-1 md:flex-row md:gap-4">
            {/* Kolom 1 */}
            <div className="flex-1">
              <div className="flex justify-between gap-2 md:justify-normal">
                <div className="font-semibold text-primary-green">Tahun Kurikulum:</div>
                <div>{rpsDetail?.tahunKurikulum.tahun}</div>
              </div>
            </div>

            {/* Kolom 2 */}
            <div className="flex-1">
              <div className="flex justify-between gap-2 md:justify-normal">
                <div className="font-semibold text-primary-green">Periode Akademik:</div>
                <div>{rpsDetail?.periodeAkademik.namaPeriode}</div>
              </div>
            </div>

            {/* Kolom 3 */}
            <div className="flex-1">
              <div className="flex justify-between  md:justify-normal">
                <div className="font-semibold text-primary-green">Program Studi: </div>
                <div className="ml-4">{rpsDetail?.programStudi.namaProgramStudi}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-6">
          {/* Mata Kuliah */}
          <div className="form-group flex flex-col items-start md:items-center gap-4 md:flex-row">
            <label className="w-48 font-medium">
              Mata Kuliah<span className="text-red-500">*</span>
            </label>
            <select name="mataKuliah" value={formData.mataKuliah} onChange={handleChange} className="flex-1 p-2 border border-gray-300 rounded w-full" required>
              <option value="" disabled>
                -- Pilih Mata Kuliah --
              </option>
              {courseData.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.namaMataKuliah}
                </option>
              ))}
            </select>
          </div>

          {/* Tanggal Perkuliahan */}
          <div className="form-group flex flex-col  items-start md:items-center md:flex-row gap-4">
            <label className="w-48 font-medium">
              Tanggal Perkuliahan<span className="text-red-500">*</span>
            </label>
            <input type="date" name="tanggalPenyusunan" value={formData.tanggalPenyusunan} onChange={handleChange} className="flex-1 p-2 border border-gray-300 rounded w-full" required />
          </div>

          {/* Dosen Pengajar */}
          <div className="form-group flex flex-col items-start md:items-center gap-4 md:flex-row">
            <label className="w-48 font-medium">
              Dosen Penyusun<span className="text-red-500">*</span>
            </label>
            <select name="dosenPenyusun" value={formData.dosenPenyusun} onChange={handleChange} className="flex-1 p-2 border border-gray-300 rounded w-full" required>
              <option value="" disabled>
                -- Pilih Dosen --
              </option>
              {dosenData.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama}
                </option>
              ))}
            </select>
          </div>

          {/* RichText Fields */}
          {[
            { name: "deskripsiMataKuliah", label: "Deskripsi Mata Kuliah" },
            { name: "tujuanMataKuliah", label: "Tujuan Mata Kuliah" },
            { name: "materiPembelajaran", label: "Materi Pembelajaran" },
            { name: "pustakaUtama", label: "Pustaka Utama" },
            { name: "pustakaPendukung", label: "Pustaka Pendukung" },
          ].map((field) => (
            <div key={field.name} className="form-group flex flex-col items-start gap-4 md:flex-row">
              <label className="w-48 font-medium pt-2">{field.label}</label>
              <div className="flex-1">
                <RichTextEditor name={field.name} value={formData[field.name]} onChange={handleEditorChange} />
              </div>
            </div>
          ))}

          {/* Upload Dokumen */}
          <div className="form-group flex flex-col items-start gap-4 mb-4  md:flex-row">
            {/* Label kiri */}
            <label htmlFor="dokumenRps" className="w-48 font-medium text-gray-700 pt-2">
              Dokumen RPS
            </label>

            {/* Konten kanan */}
            <div className="flex flex-col flex-1">
              {/* Nama file muncul kalau ada */}
              {formData.dokumenRps && <div className="text-primary-green text-sm font-semibold mb-1">{formData.dokumenRps.name}</div>}

              {/* Input file dengan border */}
              <input id="dokumenRps" type="file" name="dokumenRps" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={handleFileChange} className="border border-gray-300 rounded px-3 py-2" />

              {/* Info format file */}
              <p className="text-sm text-blue-500 mt-1">.pdf, .doc, .docx, .xls, .xlsx (maxsize: 10 MB)</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditRps;
