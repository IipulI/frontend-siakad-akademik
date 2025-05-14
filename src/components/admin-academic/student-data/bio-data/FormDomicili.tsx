import LayoutForTabNavigation from "../../dashboard/LayoutForTabNavigation";
import { SelectInput, TextInput } from "./../Input";

export default function FormDomicili() {
  const provinsiOptions = [
    { value: "", label: "-- Pilih Provinsi --" },
    { value: "aceh", label: "Aceh" },
    { value: "sumatera_utara", label: "Sumatera Utara" },
    { value: "jawa_barat", label: "Jawa Barat" },
    { value: "jawa_tengah", label: "Jawa Tengah" },
    { value: "jawa_timur", label: "Jawa Timur" },
  ];

  const kotaOptions = [
    { value: "", label: "-- Pilih Kota --" },
    { value: "jakarta", label: "Jakarta" },
    { value: "bandung", label: "Bandung" },
    { value: "surabaya", label: "Surabaya" },
  ];

  const kecamatanOptions = [
    { value: "", label: "-- Pilih Kecamatan --" },
    { value: "kec_1", label: "Kecamatan 1" },
    { value: "kec_2", label: "Kecamatan 2" },
    { value: "kec_3", label: "Kecamatan 3" },
  ];

  const statusTinggalOptions = [
    { value: "", label: "-- Pilih Status Tinggal --" },
    { value: "rumah_sendiri", label: "Rumah Sendiri" },
    { value: "rumah_orangtua", label: "Rumah Orang Tua" },
    { value: "kos", label: "Kos" },
    { value: "asrama", label: "Asrama" },
    { value: "kontrak", label: "Kontrak" },
  ];

  return (
    <LayoutForTabNavigation className="-mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5 border-1 border-gray-400 p-3">
      {/* KTP Section */}
      <div>
        <h2 className="text-primary-green font-bold border-b-2 border-primary-green pb-1 mb-4">
          KTP
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <TextInput label="Alamat" />
            <TextInput label="RT" />
            <TextInput label="RW" />
            <TextInput label="Dusun" />
            <TextInput label="Desa / Kelurahan" />
            <SelectInput label="Provinsi" options={provinsiOptions} />
            <SelectInput label="Kota" options={kotaOptions} />
            <SelectInput label="Kecamatan" options={kecamatanOptions} />
            <TextInput label="Kode Pos" />
          </div>
        </div>
      </div>

      {/* Domisili Section */}
      <div>
        <h2 className="text-primary-green font-bold border-b-2 border-primary-green pb-1 mb-4">
          Domisili
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2">
              <label htmlFor="sameDomisili" className="text-sm font-medium">
                Domisili Sama Dengan KTP
              </label>
              <input type="checkbox" id="sameDomisili" className="h-4 w-4" />
            </div>
            <TextInput label="Alamat" />
            <TextInput label="RT" />
            <TextInput label="RW" />
            <TextInput label="Dusun" />
            <TextInput label="Desa / Kelurahan" />
            <SelectInput label="Provinsi" options={provinsiOptions} />
            <SelectInput label="Kota" options={kotaOptions} />
            <SelectInput label="Kecamatan" options={kecamatanOptions} />
            <TextInput label="Kode Pos" />
            <SelectInput
              label="Status Tinggal"
              options={statusTinggalOptions}
            />
          </div>
        </div>
      </div>
    </LayoutForTabNavigation>
  );
}
