import LayoutForTabNavigation from "../../dashboard/LayoutForTabNavigation";
import { DateInput, SelectInput, TextInput } from "./../Input";

export default function FormGeneralInformation() {
  const jenisKelaminOptions = [
    { value: "", label: "-- Pilih Status Hidup --" },
    { value: "laki-laki", label: "Laki-laki" },
    { value: "perempuan", label: "Perempuan" },
  ];

  const agamaOptions = [
    { value: "", label: "-- Pilih Agama --" },
    { value: "islam", label: "Islam" },
    { value: "kristen", label: "Kristen" },
    { value: "katolik", label: "Katolik" },
    { value: "hindu", label: "Hindu" },
    { value: "buddha", label: "Buddha" },
    { value: "konghucu", label: "Konghucu" },
  ];

  const golonganDarahOptions = [
    { value: "", label: "-- Pilih Golongan Darah --" },
    { value: "a", label: "A" },
    { value: "b", label: "B" },
    { value: "ab", label: "AB" },
    { value: "o", label: "O" },
  ];

  const transportasiOptions = [
    { value: "", label: "-- Pilih Transportasi --" },
    { value: "motor", label: "Motor" },
    { value: "mobil", label: "Mobil" },
    { value: "angkutan_umum", label: "Angkutan Umum" },
    { value: "jalan_kaki", label: "Jalan Kaki" },
  ];

  const kepemilikanOptions = [
    { value: "", label: "-- Pilih Kepemilikan --" },
    { value: "sendiri", label: "Sendiri" },
    { value: "orang_tua", label: "Orang Tua" },
    { value: "saudara", label: "Saudara" },
  ];

  const kewarganegaraanOptions = [
    { value: "", label: "-- Pilih Status Hidup --" },
    { value: "wni", label: "WNI" },
    { value: "wna", label: "WNA" },
  ];

  const statusNikahOptions = [
    { value: "", label: "-- Pilih Status Nikah --" },
    { value: "belum_menikah", label: "Belum Menikah" },
    { value: "menikah", label: "Menikah" },
    { value: "cerai", label: "Cerai" },
  ];

  const ukuranJasOptions = [
    { value: "", label: "-- Pilih Ukuran Jas Al... --" },
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "l", label: "L" },
    { value: "xl", label: "XL" },
    { value: "xxl", label: "XXL" },
  ];

  const pekerjaanOptions = [
    { value: "", label: "-- Pilih Pekerjaan --" },
    { value: "pns", label: "PNS" },
    { value: "swasta", label: "Karyawan Swasta" },
    { value: "wiraswasta", label: "Wiraswasta" },
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
      {/* Section Umum */}
      <div>
        <h2 className="text-primary-green font-bold border-b-2 border-primary-green pb-1 mb-4">
          Umum
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <SelectInput
              label="Jenis Kelamin"
              options={jenisKelaminOptions}
              required={true}
            />
            <TextInput label="Tempat Lahir" required={true} />
            <DateInput label="Tanggal Lahir" required={true} />
            <SelectInput label="Agama" options={agamaOptions} />
            <TextInput label="Berat Badan (kg)" />
            <TextInput label="Tinggi Badan (cm)" />
            <SelectInput
              label="Golongan Darah"
              options={golonganDarahOptions}
            />
            <SelectInput label="Transportasi" options={transportasiOptions} />
          </div>
        </div>

        {/* section kontak */}
        <h2 className="text-primary-green font-bold border-b-2 border-primary-green pb-1 mb-4">
          Kontak
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <TextInput label="No. Telepon" />
            <TextInput label="No. HP" />
            <SelectInput label="Kepemilikan" options={kepemilikanOptions} />
            <TextInput label="Email Kampus" />
            <TextInput label="Email Pribadi" />
          </div>
        </div>
      </div>

      {/* section administrasi */}
      <div className="space-y-4">
        <h2 className="text-primary-green font-bold border-b-2 border-primary-green pb-1 mb-4">
          Administrasi
        </h2>
        <SelectInput label="Kewarganegaraan" options={kewarganegaraanOptions} />
        <TextInput label="Paspor" required={true} />
        <TextInput label="No. KK" />
        <TextInput label="No. KPS" />
        <SelectInput label="Status Nikah" options={statusNikahOptions} />
        <SelectInput label="Ukuran Jas Almamater" options={ukuranJasOptions} />

        <div className=" w-full grid grid-cols-2 items-center">
          <label className="text-sm font-medium mb-1">
            File Akta Kelahiran
          </label>
          <div>
            <input type="file" className="text-xs border-1 p-0.5 w-30" />
            <div className="text-xs text-primary-green">
              pdf, jpg (maxsize: 2 MB)
            </div>
          </div>
        </div>

        {/* Section Pekerjaan */}
        <h2 className="text-primary-green font-bold border-b-2 border-primary-green pb-1 mb-4">
          Pekerjaan
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <SelectInput label="Pekerjaan" options={pekerjaanOptions} />
            <TextInput label="Instansi Pekerjaan" />
            <SelectInput label="Penghasilan" options={penghasilanOptions} />
          </div>
        </div>

        {/* Section Bank */}
        <h2 className="text-primary-green font-bold border-b-2 border-primary-green pb-1 mb-4">
          Bank
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <TextInput label="No. Rekening" />
            <TextInput label="Nama Rekening" />
            <TextInput label="Nama Bank" />
          </div>
        </div>
      </div>
    </LayoutForTabNavigation>
  );
}
