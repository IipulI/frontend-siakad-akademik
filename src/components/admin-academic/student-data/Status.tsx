export default function Status() {
  return (
    <div className="bg-yellow-50 px-4 py-2 mt-5 border-l-8 border-[#F1E7BC] max-w-xl">
      <h2 className="font-semibold text-sm mb-2">Status</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-[10px]">
        <div className="flex flex-col space-y-2">
          <p>
            <span className="font-medium">A : Aktif</span>
          </p>
          <p>
            <span className="font-medium">G : Sedang Double Degree</span>
          </p>
          <p>
            <span className="font-medium">LL : Lainnya</span>
          </p>
          <p>
            <span className="font-medium">PN : Pensiun</span>
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          <p>
            <span className="font-medium">C : Cuti</span>
          </p>
          <p>
            <span className="font-medium">H : Hilang</span>
          </p>
          <p>
            <span className="font-medium">M : Mutasi</span>
          </p>
          <p>
            <span className="font-medium">T : Transfer</span>
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          <p>
            <span className="font-medium">D : Dropout/Dikeluarkan</span>
          </p>
          <p>
            <span className="font-medium">K : Keluar/Mengundurkan Diri</span>
          </p>
          <p>
            <span className="font-medium">N : Nonaktif</span>
          </p>
          <p>
            <span className="font-medium">U : Menunggu UKOM</span>
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          <p>
            <span className="font-medium">F : Alih Fungsi</span>
          </p>
          <p>
            <span className="font-medium">KM : Kampus Merdeka</span>
          </p>
          <p>
            <span className="font-medium">L : Lulus</span>
          </p>
          <p>
            <span className="font-medium">P : Putus Sekolah</span>
          </p>
          <p>
            <span className="font-medium">W : Wafat</span>
          </p>
        </div>
      </div>
    </div>
  );
}
