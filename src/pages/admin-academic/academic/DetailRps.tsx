import React, { useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { RpsData } from "../../../components/types.ts";
import { Api } from "../../../api/Index.tsx";
import { useQuery } from "@tanstack/react-query";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";

const fetchRpsDetail = async (id: string): Promise<RpsData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get(`/akademik/rps/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.data;
};

const RichTextDisplay: React.FC<{ content: string }> = ({ content }) => {
  if (!content || content.trim() === "") return <span>-</span>;

  try {
    const rawContent = JSON.parse(content);
    if (rawContent.blocks) {
      const contentState = convertFromRaw(rawContent);
      const html = stateToHTML(contentState);

      return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
    }
  } catch (e) {
    // Fallback untuk teks biasa jika parsing gagal
    return (
      <div className="prose prose-sm max-w-none">
        {content.split("\n").map((paragraph, index) =>
          paragraph.trim() ? (
            <p key={index} className="mb-2 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ) : null
        )}
      </div>
    );
  }

  return <span>-</span>;
};

const DetailRps = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: rpsDetail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rpsDetail", id],
    queryFn: () => fetchRpsDetail(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 menit
    gcTime: 1000 * 60 * 5, // 5 menit
  });

  const handleOpenRps = async () => {
    if (!id) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token tidak ditemukan, silakan login ulang.");
        return;
      }

      const response = await Api.get(`/akademik/rps/${id}/dokumen-rps`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      // Ambil Content-Type dari header respons API
      const contentType = response.headers["content-type"] || "application/octet-stream";

      // Gunakan contentType yang didapat dari API
      const fileBlob = new Blob([response.data], { type: contentType });

      const url = window.URL.createObjectURL(fileBlob);
      window.open(url, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Gagal membuka dokumen RPS:", error);
      alert("Gagal menampilkan dokumen. Silakan coba lagi.");
    }
  };

  const handleBack = () => {
    navigate(AdminAcademicRoute.rpsManagement.rpsManagement);
  };

  if (isLoading) {
    return (
      <MainLayout isGreeting={false} titlePage="Detail RPS">
        <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5 text-center">Memuat data...</div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout isGreeting={false} titlePage="Detail RPS">
        <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5 text-center text-red-500">Error: {error.message}</div>
      </MainLayout>
    );
  }

  if (!rpsDetail) {
    return (
      <MainLayout isGreeting={false} titlePage="Detail RPS">
        <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5 text-center">Data tidak ditemukan</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isGreeting={false} titlePage="Detail RPS">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5">
        <div className="flex items-center justify-end mb-6">
          <button onClick={handleBack} className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer">
            <ArrowLeft className="mr-2" size={16} />
            Kembali ke Daftar
          </button>
        </div>

        {/* --- Header Info --- */}

        <div className="flex  mb-6 mt-8 w-full">
          <div className="bg-primary-green w-2"></div>
          <div className="flex flex-col justify-between bg-[#F5FFF9] p-4 flex-1 md:flex-row md:gap-4">
            <div className="flex items-center gap-2 flex-1">
              <span className="font-semibold w-40">Tahun Kurikulum:</span>
              <span className="flex-1">{rpsDetail?.tahunKurikulum?.tahun || "-"}</span>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <span className="font-semibold w-40">Periode Akademik:</span>
              <span className="flex-1">{rpsDetail?.periodeAkademik?.namaPeriode || "-"}</span>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <span className="font-semibold w-40">Program Studi:</span>
              <span className="flex-1">{rpsDetail?.programStudi?.namaProgramStudi || "-"}</span>
            </div>
          </div>
        </div>

        {/* --- Detail Content --- */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="space-y-4">
            {/* --- Baris Data Umum --- */}
            {[
              { label: "Mata Kuliah", value: rpsDetail?.mataKuliah?.namaMataKuliah },
              { label: "Tanggal Penyusunan", value: rpsDetail?.tanggalPenyusun },
            ].map((item) => (
              <div key={item.label} className="flex flex-col md:flex-row md:items-center gap-2 border-b border-gray-200 pb-3">
                <label className="font-semibold text-gray-700 w-full md:w-60 flex-shrink-0">{item.label}:</label>
                <span className="text-gray-900 flex-1">{item.value || "-"}</span>
              </div>
            ))}

            {/* --- Baris Dosen Penyusun (Logika Khusus) --- */}
            <div className="flex flex-col md:flex-row gap-2 border-b border-gray-200 pb-3">
              <label className="font-semibold text-gray-700 w-full md:w-60 flex-shrink-0 pt-1">Dosen Penyusun:</label>
              <div className="flex-1">
                {rpsDetail?.dosenPenyusun && rpsDetail.dosenPenyusun.length > 0 ? (
                  <ol className="list-inside list-decimal space-y-1">
                    {rpsDetail.dosenPenyusun.map((dosen) => (
                      <li key={dosen.id} className="text-gray-900">
                        {dosen.nama} ({dosen.nidn})
                      </li>
                    ))}
                  </ol>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </div>
            </div>

            {/* --- Baris Rich Text Fields --- */}
            {[
              { label: "Deskripsi Mata Kuliah", content: rpsDetail?.deskripsiMataKuliah },
              { label: "Tujuan Mata Kuliah", content: rpsDetail?.tujuanMataKuliah },
              { label: "Materi Pembelajaran", content: rpsDetail?.materiPembelajaran },
              { label: "Pustaka Utama", content: rpsDetail?.pustakaUtama },
              { label: "Pustaka Pendukung", content: rpsDetail?.pustakaPendukung },
            ].map((item) => (
              <div key={item.label} className="flex flex-col md:flex-row gap-2 border-b border-gray-200 pb-3">
                <label className="font-semibold text-gray-700 w-full md:w-60 flex-shrink-0 pt-1">{item.label}:</label>
                <div className="flex-1 bg-white p-3 rounded border">
                  <RichTextDisplay content={item.content || ""} />
                </div>
              </div>
            ))}

            {/* --- Baris Dokumen RPS (Logika Buka Tab Baru) --- */}
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <label className="font-semibold text-gray-700 w-full md:w-60 flex-shrink-0">Dokumen RPS:</label>
              <div className="flex-1">
                <button
                  onClick={handleOpenRps} // Panggil fungsi yang sudah diubah
                  className="bg-primary-green text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Lihat Dokumen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DetailRps;
