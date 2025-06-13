// Import dan interface tetap sama
import { Search, Trash2 } from "lucide-react";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import MainLayout from "../../../components/layouts/MainLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Api } from "../../../api/Index";

interface StudentData {
  id: string;
  npm: string;
  nama: string;
  namaFakultas: string;
  namaProgramStudi: string;
  semester: string;
  angkatan: string;
}

interface DataKomponenTagihan {
  id: string;
  kodeKomponen: string;
  nama: string;
  nominal: number;
  selected?: boolean;
}

interface FormData {
  tanggalTenggat: string;
  tahap: string;
}

export default function FormCreateBill() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedStudents, setSelectedStudents] = useState<StudentData[]>([]);

  const [biayaTersedia, setBiayaTersedia] = useState<DataKomponenTagihan[]>([]);
  const [biayaDipilih, setBiayaDipilih] = useState<DataKomponenTagihan[]>([]);
  const [totalTagihan, setTotalTagihan] = useState<number>(0);

  const [pencarianTersedia, setPencarianTersedia] = useState<string>("");
  const [pencarianDipilih, setPencarianDipilih] = useState<string>("");

  // State untuk form data
  const [formData, setFormData] = useState<FormData>({
    tanggalTenggat: "",
    tahap: "",
  });

  // State untuk loading
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stateData = location.state?.selectedStudents;
    if (stateData && stateData.length > 0) {
      setSelectedStudents(stateData);
    } else {
      alert(
        "Tidak ada mahasiswa yang dipilih. Silakan pilih mahasiswa terlebih dahulu."
      );
      navigate(-1);
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const ambilData = async () => {
      try {
        const response = await Api.get("/keuangan/invoice-komponen-mahasiswa");
        const semuaData: DataKomponenTagihan[] = response.data.data;
        setBiayaTersedia(semuaData.filter((item) => !item.selected));
        setBiayaDipilih(semuaData.filter((item) => item.selected));
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };
    ambilData();
  }, []);

  useEffect(() => {
    const total = biayaDipilih.reduce((sum, item) => sum + item.nominal, 0);
    setTotalTagihan(total);
  }, [biayaDipilih]);

  // Function untuk handle perubahan input form
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  function handleDelete(studentId: string) {
    const updated = selectedStudents.filter((s) => s.id !== studentId);
    setSelectedStudents(updated);
    if (updated.length === 0) {
      alert("Semua mahasiswa telah dihapus. Silakan pilih mahasiswa kembali.");
      navigate(-1);
    }
  }

  const tambahBiaya = (item: DataKomponenTagihan) => {
    setBiayaTersedia((prev) => prev.filter((x) => x.id !== item.id));
    setBiayaDipilih((prev) => [...prev, item]);
  };

  const hapusBiaya = (item: DataKomponenTagihan) => {
    setBiayaDipilih((prev) => prev.filter((x) => x.id !== item.id));
    setBiayaTersedia((prev) => [...prev, item]);
  };

  // Function untuk menyimpan data dengan API call
  const simpanData = async () => {
    if (isLoading) return; // Prevent double submission

    try {
      // Validasi input
      if (!formData.tanggalTenggat) {
        alert("Tanggal tenggat harus diisi!");
        return;
      }

      if (!formData.tahap) {
        alert("Tahap pembayaran harus dipilih!");
        return;
      }

      if (selectedStudents.length === 0) {
        alert("Pilih minimal satu mahasiswa!");
        return;
      }

      if (biayaDipilih.length === 0) {
        alert("Pilih minimal satu komponen biaya!");
        return;
      }

      setIsLoading(true);

      // Siapkan data untuk dikirim sesuai schema API
      const invoiceData = {
        siakMahasiswaIds: selectedStudents.map((student) => student.id),
        tanggalTenggat: formData.tanggalTenggat,
        tahap: formData.tahap,
        komponen: biayaDipilih.map((item) => ({
          komponenId: item.id,
        })),
      };

      console.log("Data yang akan dikirim:", invoiceData);

      // Kirim data ke API
      const response = await Api.post(
        "/keuangan/invoice-mahasiswa",
        invoiceData
      );

      if (response.status === 200 || response.status === 201) {
        alert(
          `Tagihan berhasil dibuat!\n` +
            `Total: ${formatRupiah(totalTagihan)}\n` +
            `Mahasiswa: ${selectedStudents.length} orang\n` +
            `Komponen biaya: ${biayaDipilih.length} item\n` +
            `Tanggal tenggat: ${formData.tanggalTenggat}\n` +
            `Tahap: ${formData.tahap}`
        );

        // Kembali ke halaman sebelumnya setelah berhasil
        navigate(-1);
      }
    } catch (error) {
      console.error("Error saat menyimpan tagihan:", error);

      // Handle different error types
      if (error.response) {
        // Server responded with error status
        const errorMessage =
          error.response.data?.message ||
          "Terjadi kesalahan saat menyimpan data";
        alert(`Gagal menyimpan tagihan: ${errorMessage}`);
      } else if (error.request) {
        // Request was made but no response
        alert("Gagal menghubungi server. Periksa koneksi internet Anda.");
      } else {
        // Something else happened
        alert("Terjadi kesalahan tidak terduga. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const batalkanData = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin membatalkan? Data yang telah diinput akan hilang."
      )
    ) {
      navigate(-1);
    }
  };

  const formatRupiah = (angka: number) => `Rp${angka.toLocaleString("id-ID")}`;

  const headerClassName =
    "bg-primary-green text-white p-2 border border-gray-500 font-semibold text-sm md:text-base text-center";
  const cellClassName =
    "border border-gray-500 font-semibold p-2 text-center text-sm md:text-base";

  return (
    <MainLayout isGreeting={false} titlePage="Buat Tagihan">
      <div className="border-2 border-t-2 border-t-primary-green rounded-sm p-3 bg-white">
        <h1 className="text-lg sm:text-2xl font-semibold mb-2">
          Mahasiswa yang dipilih
        </h1>

        {/* TABEL MAHASISWA */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <td className={headerClassName}>NPM</td>
                <td className={headerClassName}>Nama</td>
                <td className={headerClassName}>Fakultas</td>
                <td className={headerClassName}>Program Studi</td>
                <td className={headerClassName}>Semester</td>
                <td className={headerClassName}>Aksi</td>
              </tr>
            </thead>
            <tbody>
              {selectedStudents.length > 0 ? (
                selectedStudents.map((item) => (
                  <tr key={item.id}>
                    <td className={cellClassName}>{item.npm}</td>
                    <td className={`${cellClassName} text-left`}>
                      {item.nama}
                    </td>
                    <td className={cellClassName}>{item.namaFakultas}</td>
                    <td className={cellClassName}>{item.namaProgramStudi}</td>
                    <td className={cellClassName}>{item.semester}</td>
                    <td className={cellClassName}>
                      <div className="flex justify-center">
                        <ButtonClick
                          icon={<Trash2 size={16} />}
                          color="bg-red-500"
                          onClick={() => handleDelete(item.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className={`${cellClassName} text-center text-gray-500`}
                  >
                    Tidak ada mahasiswa yang dipilih
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* INPUT TANGGAL & TAHAP */}
        <div className="flex flex-col gap-5 lg:flex-row my-5">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm sm:text-base">
              Tanggal Tenggat <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="border-2 p-1 rounded-sm text-sm sm:text-base w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.tanggalTenggat}
              onChange={(e) =>
                handleInputChange("tanggalTenggat", e.target.value)
              }
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm sm:text-base">
              Tahap <span className="text-red-500">*</span>
            </label>
            <select
              className="border-2 p-1 rounded-sm text-sm sm:text-base w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.tahap}
              onChange={(e) => handleInputChange("tahap", e.target.value)}
              required
            >
              <option value="">- Pilih Tahap Pembayaran -</option>
              <option value="1">Tahap 1</option>
              <option value="2">Tahap 2</option>
              <option value="3">Tahap 3</option>
              <option value="4">Tahap 4</option>
              <option value="lunas">Lunas</option>
            </select>
          </div>
        </div>

        {/* PANEL BIAYA */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 mb-6">
          {/* Biaya Tersedia */}
          <div>
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
              <div className="p-2 max-h-64 overflow-y-auto">
                {biayaTersedia
                  .filter((item) =>
                    item.nama
                      .toLowerCase()
                      .includes(pencarianTersedia.toLowerCase())
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                    >
                      <span className="font-medium">{item.nama}</span>
                      <div className="flex items-center space-x-3">
                        <span>{formatRupiah(item.nominal)}</span>
                        <button
                          className="text-blue-500 text-sm hover:underline disabled:opacity-50"
                          onClick={() => tambahBiaya(item)}
                          disabled={isLoading}
                        >
                          Tambahkan
                        </button>
                      </div>
                    </div>
                  ))}
                {biayaTersedia.filter((item) =>
                  item.nama
                    .toLowerCase()
                    .includes(pencarianTersedia.toLowerCase())
                ).length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    Tidak ada biaya yang tersedia
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Biaya Dipilih */}
          <div>
            <h2 className="font-semibold text-center mb-4">
              Biaya yang Dipilih
            </h2>
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
              <div className="p-2 max-h-64 overflow-y-auto">
                {biayaDipilih
                  .filter((item) =>
                    item.nama
                      .toLowerCase()
                      .includes(pencarianDipilih.toLowerCase())
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0"
                    >
                      <span className="font-medium">{item.nama}</span>
                      <div className="flex items-center space-x-3">
                        <span>{formatRupiah(item.nominal)}</span>
                        <button
                          className="text-red-500 text-sm hover:underline disabled:opacity-50"
                          onClick={() => hapusBiaya(item)}
                          disabled={isLoading}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                {biayaDipilih.filter((item) =>
                  item.nama
                    .toLowerCase()
                    .includes(pencarianDipilih.toLowerCase())
                ).length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    Belum ada biaya yang dipilih
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Total & Tombol */}
        <div className="flex flex-col items-end mt-4">
          <div className="mb-4 text-right">
            <p className="text-sm font-medium text-gray-600">Total Tagihan</p>
            <p className="text-xl font-bold text-primary-green">
              {formatRupiah(totalTagihan)}
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-1/2">
            <button
              className="w-1/2 bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={batalkanData}
              disabled={isLoading}
            >
              Batalkan
            </button>
            <button
              className={`w-1/2 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary-green hover:bg-teal-700"
              } text-white py-2 px-4 rounded transition-colors`}
              onClick={simpanData}
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
      <div className="py-10"></div>
    </MainLayout>
  );
}
