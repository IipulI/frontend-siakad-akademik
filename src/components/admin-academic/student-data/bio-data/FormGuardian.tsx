import LayoutForTabNavigation from "../../dashboard/LayoutForTabNavigation";
import { DateInput, SelectInput, TextInput } from "./../Input";
import { CreateKeluargaMahasiswa } from "../../../../hooks/admin-akademik/useMahasiswa";

interface FormGuardianProps {
  formDataKeluarga: CreateKeluargaMahasiswa[];
  onInputChangeKeluarga: (
    index: number,
    field: keyof CreateKeluargaMahasiswa,
    value: any
  ) => void;
}

export default function FormGuardian({
  formDataKeluarga,
  onInputChangeKeluarga,
}: FormGuardianProps) {
  const statusHidupOptions = [
    { value: "Hidup", label: "Hidup" },
    { value: "Meninggal", label: "Meninggal" },
  ];

  const statusKerabatanOptions = [
    { value: "Kandung", label: "Kandung" },
    { value: "Tiri", label: "Tiri" },
    { value: "Angkat", label: "Angkat" },
    { value: "Wali", label: "Wali" },
  ];

  const pendidikanOptions = [
    { value: "SD", label: "SD" },
    { value: "SMP", label: "SMP" },
    { value: "SMA", label: "SMA/SMK" },
    { value: "D1", label: "D1" },
    { value: "D2", label: "D2" },
    { value: "D3", label: "D3" },
    { value: "D4", label: "D4" },
    { value: "S1", label: "S1" },
    { value: "S2", label: "S2" },
    { value: "S3", label: "S3" },
  ];

  const pekerjaanOptions = [
    { value: "PNS", label: "PNS" },
    { value: "Karyawan Swasta", label: "Karyawan Swasta" },
    { value: "Wiraswasta", label: "Wiraswasta" },
    { value: "TNI/POLRI", label: "TNI/POLRI" },
    { value: "Petani", label: "Petani" },
    { value: "Nelayan", label: "Nelayan" },
    { value: "Buruh", label: "Buruh" },
    { value: "Pensiunan", label: "Pensiunan" },
    { value: "Ibu Rumah Tangga", label: "Ibu Rumah Tangga" },
    { value: "Tidak Bekerja", label: "Tidak Bekerja" },
    { value: "Lainnya", label: "Lainnya" },
  ];

  const penghasilanOptions = [
    { value: "1000000", label: "< Rp. 1.000.000" },
    { value: "3000000", label: "Rp. 1.000.000 - Rp. 3.000.000" },
    { value: "5000000", label: "Rp. 3.000.000 - Rp. 5.000.000" },
    { value: "5000001", label: "> Rp. 5.000.000" },
  ];

  // Find guardian data from the array
  const waliData =
    formDataKeluarga.find((item) => item.hubungan === "Wali") ||
    formDataKeluarga[2];

  // Get index for updating
  const waliIndex = formDataKeluarga.findIndex(
    (item) => item.hubungan === "Wali"
  );

  return (
    <LayoutForTabNavigation className="-mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5 border-1 border-gray-400 p-3">
      {/* Biodata Wali Section */}
      <div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <TextInput
              label="Nama Lengkap"
              value={waliData?.nama || ""}
              onChange={(value) =>
                onInputChangeKeluarga(waliIndex, "nama", value)
              }
            />
            <TextInput
              label="NIK"
              value={waliData?.nik || ""}
              onChange={(value) =>
                onInputChangeKeluarga(waliIndex, "nik", value)
              }
            />
            <DateInput
              label="Tanggal Lahir"
              required={false}
              value={waliData?.tanggalLahir || ""}
              onChange={(value) =>
                onInputChangeKeluarga(waliIndex, "tanggalLahir", value)
              }
            />
            <SelectInput
              label="Status Hidup"
              options={statusHidupOptions}
              value={waliData?.statusHidup || ""}
              onChange={(value) =>
                onInputChangeKeluarga(waliIndex, "statusHidup", value)
              }
            />
            <SelectInput
              label="Status Kekerabatan"
              options={statusKerabatanOptions}
              value={waliData?.statusKerabat || ""}
              onChange={(value) =>
                onInputChangeKeluarga(waliIndex, "statusKerabat", value)
              }
            />
            <SelectInput
              label="Pendidikan Terakhir"
              options={pendidikanOptions}
              value={waliData?.pendidikan || ""}
              onChange={(value) =>
                onInputChangeKeluarga(waliIndex, "pendidikan", value)
              }
            />
          </div>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <SelectInput
              label="Pekerjaan"
              options={pekerjaanOptions}
              value={waliData?.pekerjaan || ""}
              onChange={(value) =>
                onInputChangeKeluarga(waliIndex, "pekerjaan", value)
              }
            />
            <SelectInput
              label="Penghasilan"
              options={penghasilanOptions}
              value={waliData?.penghasilan || ""}
              onChange={(value) =>
                onInputChangeKeluarga(waliIndex, "penghasilan", value)
              }
            />
            <TextInput
              label="Alamat"
              value={waliData?.alamat || ""}
              onChange={(value) =>
                onInputChangeKeluarga(waliIndex, "alamat", value)
              }
            />
            <TextInput
              label="No. Telepon"
              value={waliData?.noTelepon || ""}
              onChange={(value) =>
                onInputChangeKeluarga(waliIndex, "noTelepon", value)
              }
            />
            <TextInput
              label="Alamat Email"
              value={waliData?.email || ""}
              onChange={(value) =>
                onInputChangeKeluarga(waliIndex, "email", value)
              }
            />
          </div>
        </div>
      </div>
    </LayoutForTabNavigation>
  );
}
