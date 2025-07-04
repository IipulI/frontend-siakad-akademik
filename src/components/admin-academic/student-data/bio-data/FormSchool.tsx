import { useEffect, useState } from "react";
import { CreateStudentData } from "../../../../hooks/admin-akademik/useMahasiswa";
import LayoutForTabNavigation from "../../dashboard/LayoutForTabNavigation";
import { DateInput, SelectInput, TextInput } from "./../Input";

interface FormSchoolProps {
  formData?: CreateStudentData;
  onInputChange: (field: keyof CreateStudentData, value: any) => void;
  ijazahSekolah: File | null;
  onIjazahChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  name: string;
  province_id: string;
}

export default function FormSchool({
  formData,
  onInputChange,
  ijazahSekolah,
  onIjazahChange,
}: FormSchoolProps) {
  // State untuk data API
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);

  // State untuk loading
  const [loading, setLoading] = useState({
    provinces: false,
    regencies: false,
  });

  // Fetch provinces saat component mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      setLoading((prev) => ({ ...prev, provinces: true }));
      const response = await fetch(
        "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
      );
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    } finally {
      setLoading((prev) => ({ ...prev, provinces: false }));
    }
  };

  // Fetch regencies berdasarkan provinsi
  const fetchRegencies = async (provinceId: string) => {
    try {
      setLoading((prev) => ({ ...prev, regencies: true }));
      const response = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`
      );
      const data = await response.json();
      setRegencies(data);
    } catch (error) {
      console.error("Error fetching regencies:", error);
    } finally {
      setLoading((prev) => ({ ...prev, regencies: false }));
    }
  };

  // Handler untuk perubahan provinsi sekolah
  const handleProvinceChange = (value: string) => {
    onInputChange("provinsiSekolah", value);
    onInputChange("kotaKabSekolah", ""); // Reset kota

    if (value) {
      fetchRegencies(value);
    } else {
      setRegencies([]);
    }
  };

  const pendidikanAsalOptions = [
    { value: "sd", label: "SD/Sederajat" },
    { value: "smp", label: "SMP/Sederajat" },
    { value: "sma", label: "SMA/Sederajat" },
    { value: "smk", label: "SMK/Sederajat" },
    { value: "ma", label: "MA/Sederajat" },
    { value: "paket_a", label: "Paket A" },
    { value: "paket_b", label: "Paket B" },
    { value: "paket_c", label: "Paket C" },
  ];

  const statusHidupOptions = [
    { value: "hidup", label: "Hidup" },
    { value: "meninggal", label: "Meninggal" },
  ];

  const statusKerabatanOptions = [
    { value: "kandung", label: "Kandung" },
    { value: "tiri", label: "Tiri" },
    { value: "angkat", label: "Angkat" },
    { value: "wali", label: "Wali" },
  ];

  const pekerjaanOptions = [
    { value: "", label: "-- Pilih Pekerjaan --" },
    { value: "pns", label: "PNS" },
    { value: "swasta", label: "Karyawan Swasta" },
    { value: "wiraswasta", label: "Wiraswasta" },
    { value: "tni_polri", label: "TNI/POLRI" },
    { value: "petani", label: "Petani" },
    { value: "nelayan", label: "Nelayan" },
    { value: "buruh", label: "Buruh" },
    { value: "pensiunan", label: "Pensiunan" },
    { value: "tidak_bekerja", label: "Tidak Bekerja" },
    { value: "lainnya", label: "Lainnya" },
  ];

  const penghasilanOptions = [
    { value: "", label: "-- Pilih Penghasilan --" },
    { value: "1", label: "< Rp. 1.000.000" },
    { value: "2", label: "Rp. 1.000.000 - Rp. 3.000.000" },
    { value: "3", label: "Rp. 3.000.000 - Rp. 5.000.000" },
    { value: "4", label: "> Rp. 5.000.000" },
  ];

  // Convert data untuk SelectInput
  const provinceOptions = provinces.map((province) => ({
    value: province.id,
    label: province.name,
  }));

  const regencyOptions = regencies.map((regency) => ({
    value: regency.id,
    label: regency.name,
  }));

  return (
    <LayoutForTabNavigation className="-mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5 border-1 border-gray-400 p-3">
      {/* Sekolah Section */}
      <div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <SelectInput
              label="Pendidikan Asal"
              options={pendidikanAsalOptions}
              value={formData?.pendidikanAsal}
              onChange={(value) => onInputChange("pendidikanAsal", value)}
            />
            <SelectInput
              label="Provinsi Sekolah"
              value={formData?.provinsiSekolah}
              onChange={handleProvinceChange}
              options={provinceOptions}
            />
            <SelectInput
              label="Kota Sekolah"
              value={formData?.kotaKabSekolah}
              onChange={(value) => onInputChange("kotaKabSekolah", value)}
              options={regencyOptions}
            />
            <TextInput
              label="Sekolah"
              value={formData?.namaPendidikanAsal}
              onChange={(value) => onInputChange("namaPendidikanAsal", value)}
            />
            <TextInput
              label="Alamat Sekolah"
              value={formData?.alamatSekolah}
              onChange={(value) => onInputChange("alamatSekolah", value)}
            />
          </div>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <TextInput
              label="Telepon Sekolah"
              value={formData?.teleponSekolah}
              onChange={(value) => onInputChange("teleponSekolah", value)}
            />
            <TextInput
              label="Nomor Ijazah Sekolah"
              value={formData?.noIjazahSekolah}
              onChange={(value) => onInputChange("noIjazahSekolah", value)}
            />

            {/* NISN */}
            <div className="grid grid-cols-2 items-center">
              <label
                htmlFor=""
                className=" w-fit font-medium text-sm sm:text-base"
              >
                NISN
              </label>
              <div>
                <input
                  type="text"
                  value={formData?.nisn}
                  onChange={(e) => onInputChange("nisn", e.target.value)}
                  className="bg-white border text-sm sm:text-base w-full border-gray-300 text-black/60 font-semibold  rounded focus:ring-blue-500 focus:border-blue-500 p-1"
                />
                <p className="text-xs font-medium">
                  Cari data nisn{" "}
                  <a
                    target="_blank"
                    href="https://nisn.data.kemdikbud.go.id/index.php/Cindex/formcaribynama/"
                    className="text-blue-400"
                  >
                    klik disini
                  </a>
                </p>
              </div>
            </div>

            {/* File Ijazah - Updated with integration */}
            <div className="w-full grid grid-cols-2 items-center">
              <label className="text-sm font-medium mb-1">
                File Ijazah Terakhir
              </label>
              <div>
                <input
                  type="file"
                  className="text-xs border-1 p-0.5 w-full"
                  accept=".pdf,.doc,.docx"
                  onChange={onIjazahChange}
                />
                <div className="text-xs text-primary-green">
                  pdf, word, dock (maxsize: 2 MB)
                </div>
                {ijazahSekolah && (
                  <div className="text-xs text-gray-600 mt-1">
                    File terpilih: {ijazahSekolah.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutForTabNavigation>
  );
}
