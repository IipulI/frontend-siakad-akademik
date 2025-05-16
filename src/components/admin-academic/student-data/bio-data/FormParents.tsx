import LayoutForTabNavigation from "../../dashboard/LayoutForTabNavigation";
import { DateInput, SelectInput, TextInput } from "./../Input";

export default function FormParents() {
  const statusHidupOptions = [
    { value: "", label: "-- Pilih Status Hidup --" },
    { value: "hidup", label: "Hidup" },
    { value: "meninggal", label: "Meninggal" },
  ];

  const statusKerabatanOptions = [
    { value: "", label: "-- Pilih Status kekerabatan --" },
    { value: "kandung", label: "Kandung" },
    { value: "tiri", label: "Tiri" },
    { value: "angkat", label: "Angkat" },
    { value: "wali", label: "Wali" },
  ];

  const pendidikanOptions = [
    { value: "", label: "-- Pilih Pendidikan terakhir --" },
    { value: "sd", label: "SD" },
    { value: "smp", label: "SMP" },
    { value: "sma", label: "SMA/SMK" },
    { value: "d1", label: "D1" },
    { value: "d2", label: "D2" },
    { value: "d3", label: "D3" },
    { value: "d4", label: "D4" },
    { value: "s1", label: "S1" },
    { value: "s2", label: "S2" },
    { value: "s3", label: "S3" },
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
      {/* Biodata Ayah Section */}
      <div>
        <h2 className="text-primary-green font-bold border-b-2 border-primary-green pb-1 mb-4">
          Biodata Ayah
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <TextInput label="Nama Lengkap" />
            <TextInput label="NIK" />
            <DateInput label="Tanggal Lahir" required={true} />
            <SelectInput label="Status Hidup" options={statusHidupOptions} />
            <SelectInput
              label="Status Kekerabatan"
              options={statusKerabatanOptions}
            />
            <SelectInput
              label="Pendidikan Terakhir"
              options={pendidikanOptions}
            />
            <SelectInput label="Pekerjaan" options={pekerjaanOptions} />
            <SelectInput label="Penghasilan" options={penghasilanOptions} />
            <TextInput label="Alamat" />
            <TextInput label="No. Telepon" />
            <TextInput label="Alamat Email" />
            <div className=" grid grid-cols-2">
              <label htmlFor="ibuDapatLogin" className="text-sm font-medium">
                Dapat Login
              </label>
              <input
                type="checkbox"
                id="ibuDapatLogin"
                className="mr-2 h-4 w-4"
              />
            </div>
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
            <TextInput label="Nama Lengkap" />
            <TextInput label="NIK" />
            <DateInput label="Tanggal Lahir" required={true} />
            <SelectInput label="Status Hidup" options={statusHidupOptions} />
            <SelectInput
              label="Status Kekerabatan"
              options={statusKerabatanOptions}
            />
            <SelectInput
              label="Pendidikan Terakhir"
              options={pendidikanOptions}
            />
            <SelectInput label="Pekerjaan" options={pekerjaanOptions} />
            <SelectInput label="Penghasilan" options={penghasilanOptions} />
            <TextInput label="Alamat" />
            <TextInput label="No. Telepon" />
            <TextInput label="Alamat Email" />
            <div className=" grid grid-cols-2">
              <label htmlFor="ibuDapatLogin" className="text-sm font-medium">
                Dapat Login
              </label>
              <input
                type="checkbox"
                id="ibuDapatLogin"
                className="mr-2 h-4 w-4"
              />
            </div>
          </div>
        </div>
      </div>
    </LayoutForTabNavigation>
  );
}
