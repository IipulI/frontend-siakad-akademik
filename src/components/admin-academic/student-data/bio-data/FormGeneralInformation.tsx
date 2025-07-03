import LayoutForTabNavigation from "../../dashboard/LayoutForTabNavigation";
import { DateInput, SelectInput, TextInput } from "./../Input";
import { CreateStudentData } from "../../../../hooks/admin-akademik/useMahasiswa";

interface FormGeneralInformationProps {
  formData?: CreateStudentData;
  onInputChange: (field: keyof CreateStudentData, value: any) => void;
}

export default function FormGeneralInformation({
  formData,
  onInputChange,
}: FormGeneralInformationProps) {
  const jenisKelaminOptions = [
    { value: "Laki-laki", label: "Laki-laki" },
    { value: "Perempuan", label: "Perempuan" },
  ];

  const agamaOptions = [
    { value: "Islam", label: "Islam" },
    { value: "Kristen", label: "Kristen" },
    { value: "Katolik", label: "Katolik" },
    { value: "Hindu", label: "Hindu" },
    { value: "Buddha", label: "Buddha" },
    { value: "Konghucu", label: "Konghucu" },
  ];

  const golonganDarahOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "AB", label: "AB" },
    { value: "O", label: "O" },
  ];

  const transportasiOptions = [
    { value: "Motor", label: "Motor" },
    { value: "Mobil", label: "Mobil" },
    { value: "Angkutan Umum", label: "Angkutan Umum" },
    { value: "Jalan Kaki", label: "Jalan Kaki" },
  ];

  const kewarganegaraanOptions = [
    { value: "Indonesia", label: "Indonesia" },
    { value: "WNA", label: "WNA" },
  ];

  const statusNikahOptions = [
    { value: "Belum Menikah", label: "Belum Menikah" },
    { value: "Menikah", label: "Menikah" },
    { value: "Cerai", label: "Cerai" },
  ];

  const ukuranJasOptions = [
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" },
  ];

  const pekerjaanOptions = [
    { value: "PNS", label: "PNS" },
    { value: "Karyawan Swasta", label: "Karyawan Swasta" },
    { value: "Wiraswasta", label: "Wiraswasta" },
    { value: "Mahasiswa", label: "Mahasiswa" },
    { value: "Lainnya", label: "Lainnya" },
  ];

  const penghasilanOptions = [
    { value: "< 1000000", label: "< Rp. 1.000.000" },
    { value: "1000000-3000000", label: "Rp. 1.000.000 - Rp. 3.000.000" },
    { value: "3000000-5000000", label: "Rp. 3.000.000 - Rp. 5.000.000" },
    { value: "> 5000000", label: "> Rp. 5.000.000" },
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
              value={formData?.jenisKelamin}
              onChange={(value) => onInputChange("jenisKelamin", value)}
            />
            <TextInput
              label="Tempat Lahir"
              required={true}
              value={formData?.tempatLahir}
              onChange={(value) => onInputChange("tempatLahir", value)}
            />
            <DateInput
              label="Tanggal Lahir"
              required={true}
              value={formData?.tanggalLahir}
              onChange={(value) => onInputChange("tanggalLahir", value)}
            />
            <SelectInput
              label="Agama"
              options={agamaOptions}
              value={formData?.agama}
              onChange={(value) => onInputChange("agama", value)}
            />
            <TextInput
              label="Berat Badan (kg)"
              value={formData?.beratBadan}
              onChange={(value) => onInputChange("beratBadan", value)}
            />
            <TextInput
              label="Tinggi Badan (cm)"
              value={formData?.tinggiBadan}
              onChange={(value) => onInputChange("tinggiBadan", value)}
            />
            <SelectInput
              label="Golongan Darah"
              options={golonganDarahOptions}
              value={formData?.golonganDarah}
              onChange={(value) => onInputChange("golonganDarah", value)}
            />
            <SelectInput
              label="Transportasi"
              options={transportasiOptions}
              value={formData?.transportasi}
              onChange={(value) => onInputChange("transportasi", value)}
            />
          </div>
        </div>

        {/* section kontak */}
        <h2 className="text-primary-green font-bold border-b-2 border-primary-green pb-1 mb-4 mt-6">
          Kontak
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <TextInput
              label="No. Telepon"
              value={formData?.noTelepon}
              onChange={(value) => onInputChange("noTelepon", value)}
            />
            <TextInput
              label="No. HP"
              value={formData?.noHp}
              onChange={(value) => onInputChange("noHp", value)}
            />
            <TextInput
              label="Email Kampus"
              value={formData?.emailKampus}
              onChange={(value) => onInputChange("emailKampus", value)}
            />
            <TextInput
              label="Email Pribadi"
              value={formData?.emailPribadi}
              required
              onChange={(value) => onInputChange("emailPribadi", value)}
            />
          </div>
        </div>
      </div>

      {/* section administrasi */}
      <div className="space-y-4">
        <h2 className="text-primary-green font-bold border-b-2 border-primary-green pb-1 mb-4">
          Administrasi
        </h2>
        <SelectInput
          label="Kewarganegaraan"
          options={kewarganegaraanOptions}
          value={formData?.kewarganegaraan}
          onChange={(value) => onInputChange("kewarganegaraan", value)}
        />
        <TextInput
          label="Paspor"
          required={true}
          value={formData?.paspor}
          onChange={(value) => onInputChange("paspor", value)}
        />
        <TextInput
          label="No. KK"
          value={formData?.noKk}
          onChange={(value) => onInputChange("noKk", value)}
        />
        <TextInput
          label="NIK"
          value={formData?.nik}
          onChange={(value) => onInputChange("nik", value)}
        />
        <SelectInput
          label="Status Nikah"
          options={statusNikahOptions}
          value={formData?.statusNikah}
          onChange={(value) => onInputChange("statusNikah", value)}
        />
        <SelectInput
          label="Ukuran Jas Almamater"
          options={ukuranJasOptions}
          value={formData?.ukuranJasAlmamater}
          onChange={(value) => onInputChange("ukuranJasAlmamater", value)}
        />

        {/* Section Pekerjaan */}
        <h2 className="text-primary-green font-bold border-b-2 border-primary-green pb-1 mb-4 mt-6">
          Pekerjaan
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <SelectInput
              label="Pekerjaan"
              options={pekerjaanOptions}
              value={formData?.pekerjaan}
              onChange={(value) => onInputChange("pekerjaan", value)}
            />
            <TextInput
              label="Instansi Pekerjaan"
              value={formData?.instansiPekerjaan}
              onChange={(value) => onInputChange("instansiPekerjaan", value)}
            />
            <SelectInput
              label="Penghasilan"
              options={penghasilanOptions}
              value={formData?.penghasilan}
              onChange={(value) => onInputChange("penghasilan", value)}
            />
          </div>
        </div>

        {/* Section Bank */}
        <h2 className="text-primary-green font-bold border-b-2 border-primary-green pb-1 mb-4 mt-6">
          Bank
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <TextInput
              label="No. Rekening"
              value={formData?.noRekening}
              onChange={(value) => onInputChange("noRekening", value)}
            />
            <TextInput
              label="Nama Rekening"
              value={formData?.namaRekening}
              onChange={(value) => onInputChange("namaRekening", value)}
            />
            <TextInput
              label="Nama Bank"
              value={formData?.namaBank}
              onChange={(value) => onInputChange("namaBank", value)}
            />
          </div>
        </div>
      </div>
    </LayoutForTabNavigation>
  );
}
