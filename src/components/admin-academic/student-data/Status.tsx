import { Info } from "lucide-react";

export default function Status() {
  const statusList = [
    { code: "A", label: "Aktif" },
    { code: "C", label: "Cuti" },
    { code: "D", label: "Dropout / Dikeluarkan" },
    { code: "F", label: "Alih Fungsi" },
    { code: "G", label: "Sedang Double Degree" },
    { code: "H", label: "Hilang" },
    { code: "K", label: "Keluar / Mengundurkan Diri" },
    { code: "KM", label: "Kampus Merdeka" },
    { code: "LL", label: "Lainnya" },
    { code: "M", label: "Mutasi" },
    { code: "N", label: "Nonaktif" },
    { code: "L", label: "Lulus" },
    { code: "PN", label: "Pensiun" },
    { code: "T", label: "Transfer" },
    { code: "U", label: "Menunggu UKOM" },
    { code: "P", label: "Putus Sekolah" },
    { code: "W", label: "Wafat" },
  ];

  return (
    <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 mt-6 max-w-3xl shadow-xs">
      <div className="flex items-center gap-2 mb-3 text-amber-900 font-semibold text-xs md:text-sm">
        <Info size={16} className="text-primary-yellow shrink-0" />
        <span>Keterangan Status Mahasiswa</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs text-slate-700">
        {statusList.map((item) => (
          <div
            key={item.code}
            className="flex items-center gap-2 bg-white/80 px-2.5 py-1.5 rounded-lg border border-amber-100/90 shadow-2xs hover:bg-white transition-all"
          >
            <span className="font-bold text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded text-[11px] min-w-[26px] text-center shrink-0">
              {item.code}
            </span>
            <span className="truncate text-slate-700 text-[11px] font-medium" title={item.label}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
