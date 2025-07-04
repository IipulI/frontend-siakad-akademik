import LayoutForTabNavigation from "../../dashboard/LayoutForTabNavigation";
import { DateInput, SelectInput, TextInput } from "./../Input";
import { CreateKeluargaMahasiswa } from "../../../../hooks/admin-akademik/useMahasiswa";

interface FormParentsProps {
  formDataKeluarga: CreateKeluargaMahasiswa[];
  onInputChangeKeluarga: (
    index: number,
    field: keyof CreateKeluargaMahasiswa,
    value: any
  ) => void;
}

export default function FormParents({
  formDataKeluarga,
  onInputChangeKeluarga,
}: FormParentsProps) {
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

  // Find father and mother data from the array
  const ayahData =
    formDataKeluarga.find((item) => item.hubungan === "Ayah") ||
    formDataKeluarga[0];
  const ibuData =
    formDataKeluarga.find((item) => item.hubungan === "Ibu") ||
    formDataKeluarga[1];

  // Get indexes for updating
  const ayahIndex = formDataKeluarga.findIndex(
    (item) => item.hubungan === "Ayah"
  );
  const ibuIndex = formDataKeluarga.findIndex(
    (item) => item.hubungan === "Ibu"
  );

  return (
    <LayoutForTabNavigation className="-mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5 border-1 border-gray-400 p-3">
      {/* Biodata Ayah Section */}
      <div>
        <h2 className="text-primary-green font-bold border-b-2 border-primary-green pb-1 mb-4">
          Biodata Ayah
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <TextInput
              label="Nama Lengkap"
              value={ayahData?.nama || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ayahIndex, "nama", value)
              }
            />
            <TextInput
              label="NIK"
              value={ayahData?.nik || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ayahIndex, "nik", value)
              }
            />
            <DateInput
              label="Tanggal Lahir"
              required={false}
              value={ayahData?.tanggalLahir || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ayahIndex, "tanggalLahir", value)
              }
            />
            <SelectInput
              label="Status Hidup"
              options={statusHidupOptions}
              value={ayahData?.statusHidup || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ayahIndex, "statusHidup", value)
              }
            />
            <SelectInput
              label="Status Kekerabatan"
              options={statusKerabatanOptions}
              value={ayahData?.statusKerabat || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ayahIndex, "statusKerabat", value)
              }
            />
            <SelectInput
              label="Pendidikan Terakhir"
              options={pendidikanOptions}
              value={ayahData?.pendidikan || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ayahIndex, "pendidikan", value)
              }
            />
            <SelectInput
              label="Pekerjaan"
              options={pekerjaanOptions}
              value={ayahData?.pekerjaan || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ayahIndex, "pekerjaan", value)
              }
            />
            <SelectInput
              label="Penghasilan"
              options={penghasilanOptions}
              value={ayahData?.penghasilan || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ayahIndex, "penghasilan", value)
              }
            />
            <TextInput
              label="Alamat"
              value={ayahData?.alamat || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ayahIndex, "alamat", value)
              }
            />
            <TextInput
              label="No. Telepon"
              value={ayahData?.noTelepon || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ayahIndex, "noTelepon", value)
              }
            />
            <TextInput
              label="Alamat Email"
              value={ayahData?.email || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ayahIndex, "email", value)
              }
            />
          </div>
        </div>
      </div>

      {/* Biodata Ibu Section */}
      <div>
        <h2 className="text-primary-green font-bold border-b-2 border-primary-green pb-1 mb-4">
          Biodata Ibu
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <TextInput
              label="Nama Lengkap"
              value={ibuData?.nama || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ibuIndex, "nama", value)
              }
            />
            <TextInput
              label="NIK"
              value={ibuData?.nik || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ibuIndex, "nik", value)
              }
            />
            <DateInput
              label="Tanggal Lahir"
              required={false}
              value={ibuData?.tanggalLahir || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ibuIndex, "tanggalLahir", value)
              }
            />
            <SelectInput
              label="Status Hidup"
              options={statusHidupOptions}
              value={ibuData?.statusHidup || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ibuIndex, "statusHidup", value)
              }
            />
            <SelectInput
              label="Status Kekerabatan"
              options={statusKerabatanOptions}
              value={ibuData?.statusKerabat || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ibuIndex, "statusKerabat", value)
              }
            />
            <SelectInput
              label="Pendidikan Terakhir"
              options={pendidikanOptions}
              value={ibuData?.pendidikan || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ibuIndex, "pendidikan", value)
              }
            />
            <SelectInput
              label="Pekerjaan"
              options={pekerjaanOptions}
              value={ibuData?.pekerjaan || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ibuIndex, "pekerjaan", value)
              }
            />
            <SelectInput
              label="Penghasilan"
              options={penghasilanOptions}
              value={ibuData?.penghasilan || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ibuIndex, "penghasilan", value)
              }
            />
            <TextInput
              label="Alamat"
              value={ibuData?.alamat || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ibuIndex, "alamat", value)
              }
            />
            <TextInput
              label="No. Telepon"
              value={ibuData?.noTelepon || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ibuIndex, "noTelepon", value)
              }
            />
            <TextInput
              label="Alamat Email"
              value={ibuData?.email || ""}
              onChange={(value) =>
                onInputChangeKeluarga(ibuIndex, "email", value)
              }
            />
          </div>
        </div>
      </div>
    </LayoutForTabNavigation>
  );
}
