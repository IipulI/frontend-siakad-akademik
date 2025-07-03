import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Save } from "lucide-react";
import RichTextEditor from "../../../components/admin-academic/academic/RichTextEditor";
import { EditorState, convertToRaw, convertFromHTML, ContentState } from "draft-js";
import { Api } from "../../../api/Index.tsx";
import { RpsData } from "../../../components/types.ts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDosen } from "../../../hooks/academic/useDosen.ts";
import { getCourseData } from "../../../hooks/academic/useCourseManagement.ts";
import { RawDraftContentState } from "draft-js";
import LoadingSpinner from "../../../components/LoadingSpinner";

const fetchRpsDetail = async (id: string): Promise<RpsData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get(`/akademik/rps/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("🔍 Raw course detail API data:", response.data.data);
  return response.data.data;
};

// Fungsi untuk update RPS
const updateRps = async (id: string, formData: FormData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.put(`/akademik/rps/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      // Don't set Content-Type, let browser set it with boundary for multipart/form-data
    },
    timeout: 30000,
  });

  console.log("✅ RPS berhasil diupdate:", response.data);
  return response.data;
};

const EditRps = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

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
    dokumenRps: null as File | null,
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

  // Mutation untuk update RPS
  const updateRpsMutation = useMutation({
    mutationFn: (formData: FormData) => updateRps(id!, formData),
    onSuccess: (data) => {
      console.log("🔄 Invalidating RPS queries...");
      queryClient.invalidateQueries({ queryKey: ["rps"] });
      queryClient.invalidateQueries({ queryKey: ["rpsDetail", id] });
      alert("Data RPS berhasil diupdate!");
      navigate(AdminAcademicRoute.rpsManagement.rpsManagement);
    },
    onError: (error: any) => {
      console.error("❌ Update failed:", error);
      const msg = error?.response?.data?.message || error?.message || "Terjadi kesalahan tidak diketahui.";
      alert("Gagal mengupdate data RPS: " + msg);
    },
  });

  // Fungsi konversi HTML ke Draft.js yang lebih robust
  const convertHtmlToDraft = (html: string | null | undefined): RawDraftContentState => {
    if (!html || html.trim() === "") {
      return emptyDraftState;
    }

    try {
      // Cek apakah HTML sudah berupa JSON string (dari format lama)
      if (html.startsWith("{") && html.endsWith("}")) {
        try {
          const parsedJson = JSON.parse(html);
          // Jika sudah berupa Draft.js format, gunakan langsung
          if (parsedJson.blocks && Array.isArray(parsedJson.blocks)) {
            return parsedJson;
          }
        } catch (jsonError) {
          console.log("Not a JSON string, treating as HTML");
        }
      }

      // Konversi HTML ke Draft.js
      const blocksFromHTML = convertFromHTML(html);

      if (blocksFromHTML.contentBlocks && blocksFromHTML.contentBlocks.length > 0) {
        const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
        return convertToRaw(contentState);
      }

      return emptyDraftState;
    } catch (error) {
      console.error("Error converting HTML to Draft:", error);
      return emptyDraftState;
    }
  };

  useEffect(() => {
    if (rpsDetail) {
      console.log("🔄 Setting form data from RPS detail:", rpsDetail);

      setFormData({
        mataKuliah: rpsDetail.mataKuliah?.id || "",
        tanggalPenyusunan: rpsDetail.tanggalPenyusun?.split("T")[0] || "",
        dosenPenyusun: rpsDetail.dosenPenyusun[0]?.id || "",
        // Konversi HTML ke Draft.js format
        deskripsiMataKuliah: convertHtmlToDraft(rpsDetail.deskripsiMataKuliah),
        tujuanMataKuliah: convertHtmlToDraft(rpsDetail.tujuanMataKuliah),
        materiPembelajaran: convertHtmlToDraft(rpsDetail.materiPembelajaran),
        pustakaUtama: convertHtmlToDraft(rpsDetail.pustakaUtama),
        pustakaPendukung: convertHtmlToDraft(rpsDetail.pustakaPendukung),
        dokumenRps: null,
      });

      // Debug log untuk melihat hasil konversi
      console.log("📝 Converted rich text data:", {
        deskripsiMataKuliah: convertHtmlToDraft(rpsDetail.deskripsiMataKuliah),
        tujuanMataKuliah: convertHtmlToDraft(rpsDetail.tujuanMataKuliah),
        materiPembelajaran: convertHtmlToDraft(rpsDetail.materiPembelajaran),
        pustakaUtama: convertHtmlToDraft(rpsDetail.pustakaUtama),
        pustakaPendukung: convertHtmlToDraft(rpsDetail.pustakaPendukung),
      });
    }
  }, [rpsDetail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, dokumenRps: file }));
  };

  const handleEditorChange = (name: string, value: RawDraftContentState) => {
    console.log(`📝 Editor change for '${name}':`, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.mataKuliah || !formData.tanggalPenyusunan || !formData.dosenPenyusun) {
      alert("Harap lengkapi semua field yang wajib diisi (ditandai dengan *)!");
      return;
    }

    // Persiapkan payload untuk update
    const requestPayload = {
      siakMataKuliahId: formData.mataKuliah,
      siakProgramStudiId: rpsDetail?.programStudi.id,
      siakPeriodeAkademikId: rpsDetail?.periodeAkademik.id,
      siakTahunKurikulumId: rpsDetail?.tahunKurikulum.id,
      tanggalPenyusun: formData.tanggalPenyusunan,
      dosenIds: [formData.dosenPenyusun], // Convert to array format
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

    console.log("💾 Saving RPS with payload:", requestPayload);

    try {
      await updateRpsMutation.mutateAsync(formDataToSend);
    } catch (error) {
      console.error("❌ Save error:", error);
    }
  };

  if (isLoading || isDosenLoading || isCourseLoading) {
    return <LoadingSpinner />;
  }

  if (error || dosenError || courseError) {
    return <div className="text-red-500">Gagal memuat data. Silakan refresh halaman.</div>;
  }

  if (!rpsDetail) {
    return <div className="text-red-500">Data RPS tidak ditemukan.</div>;
  }

  return (
    <MainLayout isGreeting={false} titlePage="Edit RPS">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-green px-5 relative">
        <div className="flex items-center justify-end mb-6 mt-4">
          <div className="flex gap-2">
            <button onClick={handleBack} className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer" disabled={updateRpsMutation.isPending}>
              <ArrowLeft className="mr-2" size={16} />
              Kembali ke Daftar
            </button>
            <button onClick={handleSave} className="bg-primary-blueSoft text-white px-4 py-2 rounded flex items-center disabled:opacity-50 cursor-pointer" disabled={updateRpsMutation.isPending}>
              <Save className="mr-2" size={16} />
              {updateRpsMutation.isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>

        {/* Header Info */}
        <div className="flex mb-6 mt-8">
          <div className="bg-primary-green w-2"></div>
          <div className="flex flex-col justify-between bg-[#F5FFF9] p-4 flex-1 md:flex-row md:gap-4">
            <div className="flex-1">
              <div className="flex justify-between gap-2 md:justify-normal">
                <div className="font-semibold text-primary-green">Tahun Kurikulum:</div>
                <div>{rpsDetail?.tahunKurikulum.tahun}</div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between gap-2 md:justify-normal">
                <div className="font-semibold text-primary-green">Periode Akademik:</div>
                <div>{rpsDetail?.periodeAkademik.namaPeriode}</div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between md:justify-normal">
                <div className="font-semibold text-primary-green">Program Studi:</div>
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
          <div className="form-group flex flex-col items-start md:items-center md:flex-row gap-4">
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
                <RichTextEditor name={field.name} value={formData[field.name as keyof typeof formData] as RawDraftContentState} onChange={handleEditorChange} />
              </div>
            </div>
          ))}

          {/* Upload Dokumen */}
          <div className="form-group flex flex-col items-start gap-4 mb-4 md:flex-row">
            <label htmlFor="dokumenRps" className="w-48 font-medium text-gray-700 pt-2">
              Dokumen RPS
            </label>
            <div className="flex flex-col flex-1">
              {formData.dokumenRps && <div className="text-primary-green text-sm font-semibold mb-1">{formData.dokumenRps.name}</div>}
              <input
                id="dokumenRps"
                type="file"
                name="dokumenRps"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileChange}
                className="bg-gray-100 border border-gray-400 rounded px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-green file:text-white hover:file:bg-primary-green/80 transition cursor-pointer"
              />
              <p className="text-sm text-blue-500 mt-1">.pdf, .doc, .docx, .xls, .xlsx (maxsize: 10 MB)</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditRps;
