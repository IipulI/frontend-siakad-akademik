import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { fetchMonitoringPdfBlobUrl, MonitoringJenis, MonitoringFilters } from "../../../hooks/academic/useObeMonitoring";

const JENIS_LABEL: Record<MonitoringJenis, string> = {
  "cpl-prodi": "CPL per Program Studi",
  "cpl-mahasiswa": "CPL per Mahasiswa",
  "cpl-mata-kuliah": "CPL per Mata Kuliah",
  "mk-mahasiswa": "Mata Kuliah per Mahasiswa",
  "transkrip-obe": "Transkrip OBE Mahasiswa",
  "cpmk-mahasiswa": "CPMK per Mahasiswa",
};

// Halaman cetak/pratinjau mandiri (tanpa MainLayout) -- dibuka di tab baru saat
// klik "Tampilkan" di halaman Monitoring OBE. Nampilin PDF asli dari endpoint
// export/pdf yang sudah ada di backend (bukan bikin ulang tampilannya).
export default function ObeMonitoringCetak() {
  const [searchParams] = useSearchParams();
  const jenis = (searchParams.get("jenis") as MonitoringJenis) || "cpl-prodi";
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const filters: MonitoringFilters = {
      tahunKurikulumId: searchParams.get("tahunKurikulumId") || undefined,
      prodiId: searchParams.get("prodiId") || undefined,
      angkatan: searchParams.get("angkatan") || undefined,
      metode: (searchParams.get("metode") as "rerata" | "progresif") || undefined,
      cpl: searchParams.get("cpl") || undefined,
      mataKuliahId: searchParams.get("mataKuliahId") || undefined,
      mahasiswaId: searchParams.get("mahasiswaId") || undefined,
      kop: searchParams.get("kop") !== "false",
    };

    let objectUrl: string | null = null;
    setIsLoading(true);
    setError("");
    fetchMonitoringPdfBlobUrl(jenis, filters)
      .then((url) => {
        objectUrl = url;
        setPdfUrl(url);
      })
      .catch((err) => setError(err?.message || "Gagal memuat PDF."))
      .finally(() => setIsLoading(false));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const handleCetak = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print();
    } else if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  const handleKembali = () => window.close();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <p className="font-semibold text-gray-700">Monitoring OBE ({JENIS_LABEL[jenis]})</p>
          <div className="flex gap-2">
            <button onClick={handleKembali} className="bg-[#00c0ef] text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
              <ArrowLeft size={16} /> Kembali ke Daftar
            </button>
            <button onClick={handleCetak} disabled={!pdfUrl} className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50">
              <Printer size={16} /> Cetak
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <iframe ref={iframeRef} src={pdfUrl || undefined} title="Monitoring OBE PDF" className="flex-1 w-full border-0" />
        )}
      </div>
    </div>
  );
}
