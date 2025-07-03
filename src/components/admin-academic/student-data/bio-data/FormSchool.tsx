import { CreateStudentData } from "../../../../hooks/admin-akademik/useMahasiswa";
import LayoutForTabNavigation from "../../dashboard/LayoutForTabNavigation";
import { DateInput, SelectInput, TextInput } from "./../Input";

interface FormSchoolProps {
  formData?: CreateStudentData;
  onInputChange: (field: keyof CreateStudentData, value: any) => void;
  ijazahSekolah: File | null;
  onIjazahChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormSchool({
  formData,
  onInputChange,
  ijazahSekolah,
  onIjazahChange,
}: FormSchoolProps) {
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

  const provinsiOptions = [
    { value: "aceh", label: "Aceh" },
    { value: "sumatera_utara", label: "Sumatera Utara" },
    { value: "sumatera_barat", label: "Sumatera Barat" },
    { value: "riau", label: "Riau" },
    { value: "kepulauan_riau", label: "Kepulauan Riau" },
    { value: "jambi", label: "Jambi" },
    { value: "sumatera_selatan", label: "Sumatera Selatan" },
    { value: "bangka_belitung", label: "Bangka Belitung" },
    { value: "bengkulu", label: "Bengkulu" },
    { value: "lampung", label: "Lampung" },
    { value: "dki_jakarta", label: "DKI Jakarta" },
    { value: "jawa_barat", label: "Jawa Barat" },
    { value: "jawa_tengah", label: "Jawa Tengah" },
    { value: "di_yogyakarta", label: "DI Yogyakarta" },
    { value: "jawa_timur", label: "Jawa Timur" },
    { value: "banten", label: "Banten" },
    { value: "bali", label: "Bali" },
    { value: "nusa_tenggara_barat", label: "Nusa Tenggara Barat" },
    { value: "nusa_tenggara_timur", label: "Nusa Tenggara Timur" },
    { value: "kalimantan_barat", label: "Kalimantan Barat" },
    { value: "kalimantan_tengah", label: "Kalimantan Tengah" },
    { value: "kalimantan_selatan", label: "Kalimantan Selatan" },
    { value: "kalimantan_timur", label: "Kalimantan Timur" },
    { value: "kalimantan_utara", label: "Kalimantan Utara" },
    { value: "sulawesi_utara", label: "Sulawesi Utara" },
    { value: "sulawesi_tengah", label: "Sulawesi Tengah" },
    { value: "sulawesi_selatan", label: "Sulawesi Selatan" },
    { value: "sulawesi_tenggara", label: "Sulawesi Tenggara" },
    { value: "gorontalo", label: "Gorontalo" },
    { value: "sulawesi_barat", label: "Sulawesi Barat" },
    { value: "maluku", label: "Maluku" },
    { value: "maluku_utara", label: "Maluku Utara" },
    { value: "papua", label: "Papua" },
    { value: "papua_barat", label: "Papua Barat" },
    { value: "papua_selatan", label: "Papua Selatan" },
    { value: "papua_tengah", label: "Papua Tengah" },
    { value: "papua_pegunungan", label: "Papua Pegunungan" },
    { value: "papua_barat_daya", label: "Papua Barat Daya" },
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
              onChange={(value) => onInputChange("provinsiSekolah", value)}
              options={provinsiOptions}
            />
            <TextInput
              label="Kota Sekolah"
              value={formData?.kotaKabSekolah}
              onChange={(value) => onInputChange("kotaKabSekolah", value)}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutForTabNavigation>
  );
}
