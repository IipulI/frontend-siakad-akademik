import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Api } from "../../api/Index";

interface DataKomponenTagihan {
  id: string;
  kodeKomponen: string;
  nama: string;
  nominal: number;
  selected?: boolean;
}

export default function PanelPemilihanBiaya() {
  const [biayaTersedia, setBiayaTersedia] = useState<DataKomponenTagihan[]>([]);
  const [biayaDipilih, setBiayaDipilih] = useState<DataKomponenTagihan[]>([]);
  const [totalTagihan, setTotalTagihan] = useState<number>(0);

  const [pencarianTersedia, setPencarianTersedia] = useState<string>("");
  const [pencarianDipilih, setPencarianDipilih] = useState<string>("");

  async function ambilData() {
    try {
      const token = localStorage.getItem("token");
      const response = await Api.get("/keuangan/invoice-komponen-mahasiswa", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const semuaData: DataKomponenTagihan[] = response.data.data;

      const tersedia = semuaData.filter((item) => !item.selected);
      const dipilih = semuaData.filter((item) => item.selected);

      setBiayaTersedia(tersedia);
      setBiayaDipilih(dipilih);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  }

  useEffect(() => {
    ambilData();
  }, []);

  useEffect(() => {
    const total = biayaDipilih.reduce((sum, item) => sum + item.nominal, 0);
    setTotalTagihan(total);
  }, [biayaDipilih]);

  const formatRupiah = (angka: number) => {
    return `Rp${angka.toLocaleString("id-ID")}`;
  };

  const biayaTersediaTerseleksi = biayaTersedia.filter((item) =>
    item.nama.toLowerCase().includes(pencarianTersedia.toLowerCase())
  );

  const biayaDipilihTerseleksi = biayaDipilih.filter((item) =>
    item.nama.toLowerCase().includes(pencarianDipilih.toLowerCase())
  );

  const tambahBiaya = (item: DataKomponenTagihan) => {
    setBiayaTersedia((prev) => prev.filter((x) => x.id !== item.id));
    setBiayaDipilih((prev) => [...prev, item]);
  };

  const hapusBiaya = (item: DataKomponenTagihan) => {
    setBiayaDipilih((prev) => prev.filter((x) => x.id !== item.id));
    setBiayaTersedia((prev) => [...prev, item]);
  };

  const simpanData = () => {
    alert("Total tagihan: " + formatRupiah(totalTagihan));
  };

  const batalkanData = () => {
    alert("Pembatalan diproses");
  };

  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 mb-6">
        {/* Biaya Tersedia */}
        <div className="w-full">
          <h2 className="font-semibold text-center mb-4">
            Biaya yang Tersedia
          </h2>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cari biaya..."
              value={pencarianTersedia}
              onChange={(e) => setPencarianTersedia(e.target.value)}
            />
          </div>
          <div className="bg-[#EEF2F6] rounded border-2 p-2 sm:px-10 text-sm h-96">
            <div className="rounded-md p-2 max-h-64 overflow-y-auto">
              {biayaTersediaTerseleksi.length > 0 ? (
                biayaTersediaTerseleksi.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <span className="font-medium">{item.nama}</span>
                    <div className="flex items-center space-x-3">
                      <span>{formatRupiah(item.nominal)}</span>
                      <button
                        className="text-blue-500 text-sm hover:underline"
                        onClick={() => tambahBiaya(item)}
                      >
                        Tambahkan
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-3 text-center text-gray-500">
                  Tidak ada biaya
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Biaya Dipilih */}
        <div className="w-full">
          <h2 className="font-semibold text-center mb-4">Biaya yang Dipilih</h2>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cari biaya..."
              value={pencarianDipilih}
              onChange={(e) => setPencarianDipilih(e.target.value)}
            />
          </div>
          <div className="bg-[#EEF2F6] rounded border-2 p-2 sm:px-10 text-sm h-96 overflow-auto">
            <div className="rounded-md p-2 max-h-64 overflow-y-auto">
              {biayaDipilihTerseleksi.length > 0 ? (
                biayaDipilihTerseleksi.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <span className="font-medium">{item.nama}</span>
                    <div className="flex items-center space-x-3">
                      <span>{formatRupiah(item.nominal)}</span>
                      <button
                        className="text-red-500 text-sm hover:underline"
                        onClick={() => hapusBiaya(item)}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-3 text-center text-gray-500">
                  Belum ada biaya dipilih
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Total dan Tombol Aksi */}
      <div className="flex flex-col items-end mt-4">
        <div className="mb-4 text-right">
          <p className="text-sm font-medium text-gray-600">Total Tagihan</p>
          <p className="text-xl font-bold">{formatRupiah(totalTagihan)}</p>
        </div>
        <div className="flex gap-4 w-full md:w-1/2">
          <button
            className="w-1/2 bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded"
            onClick={batalkanData}
          >
            Batalkan
          </button>
          <button
            className="w-1/2 bg-primary-green hover:bg-teal-700 text-white py-2 px-4 rounded"
            onClick={simpanData}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
