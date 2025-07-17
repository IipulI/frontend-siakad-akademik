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
    { value: "laki-laki", label: "Laki-laki" },
    { value: "perempuan", label: "Perempuan" },
  ];

  const agamaOptions = [
    { value: "islam", label: "Islam" },
    { value: "kristen", label: "Kristen" },
    { value: "katolik", label: "Katolik" },
    { value: "hindu", label: "Hindu" },
    { value: "buddha", label: "Buddha" },
    { value: "konghucu", label: "Konghucu" },
  ];

  const golonganDarahOptions = [
    { value: "a", label: "A" },
    { value: "b", label: "B" },
    { value: "ab", label: "AB" },
    { value: "o", label: "O" },
  ];

  const transportasiOptions = [
    { value: "motor", label: "Motor" },
    { value: "mobil", label: "Mobil" },
    { value: "angkutan umum", label: "Angkutan Umum" },
    { value: "jalan kaki", label: "Jalan Kaki" },
  ];

  const kewarganegaraanOptions = [
    { value: "indonesia", label: "Indonesia" },
    { value: "wna", label: "WNA" },
  ];

  const statusNikahOptions = [
    { value: "belum menikah", label: "Belum Menikah" },
    { value: "menikah", label: "Menikah" },
    { value: "cerai", label: "Cerai" },
  ];

  const ukuranJasOptions = [
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "l", label: "L" },
    { value: "xl", label: "XL" },
    { value: "xxl", label: "XXL" },
  ];

  const pekerjaanOptions = [
    { value: "pns", label: "PNS" },
    { value: "karyawan swasta", label: "Karyawan Swasta" },
    { value: "wiraswasta", label: "Wiraswasta" },
    { value: "mahasiswa", label: "Mahasiswa" },
    { value: "lainnya", label: "Lainnya" },
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
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              required={true}
              value={formData?.jenisKelamin}
              onChange={(option) =>
                onInputChange("jenisKelamin", option?.value ?? "")
              }
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
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              value={formData?.agama}
              onChange={(option) => onInputChange("agama", option?.value ?? "")}
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
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              value={formData?.golonganDarah}
              onChange={(option) =>
                onInputChange("golonganDarah", option?.value ?? "")
              }
            />
            <SelectInput
              label="Transportasi"
              options={transportasiOptions}
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              value={formData?.transportasi}
              onChange={(option) =>
                onInputChange("transportasi", option?.value ?? "")
              }
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
          getOptionLabel={(opt) => opt.label}
          getOptionValue={(opt) => opt.value}
          value={formData?.kewarganegaraan}
          onChange={(option) =>
            onInputChange("kewarganegaraan", option?.value ?? "")
          }
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
          getOptionLabel={(opt) => opt.label}
          getOptionValue={(opt) => opt.value}
          value={formData?.statusNikah}
          onChange={(option) =>
            onInputChange("statusNikah", option?.value ?? "")
          }
        />
        <SelectInput
          label="Ukuran Jas Almamater"
          options={ukuranJasOptions}
          getOptionLabel={(opt) => opt.label}
          getOptionValue={(opt) => opt.value}
          value={formData?.ukuranJasAlmamater}
          onChange={(option) =>
            onInputChange("ukuranJasAlmamater", option?.value ?? "")
          }
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
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              value={formData?.pekerjaan}
              onChange={(option) =>
                onInputChange("pekerjaan", option?.value ?? "")
              }
            />
            <TextInput
              label="Instansi Pekerjaan"
              value={formData?.instansiPekerjaan}
              onChange={(value) => onInputChange("instansiPekerjaan", value)}
            />
            <SelectInput
              label="Penghasilan"
              options={penghasilanOptions}
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              value={formData?.penghasilan}
              onChange={(option) =>
                onInputChange("penghasilan", option?.value ?? "")
              }
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
