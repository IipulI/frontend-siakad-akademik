import LayoutForTabNavigation from "../../dashboard/LayoutForTabNavigation";
import { SelectInput, TextInput } from "./../Input";
import { CreateStudentData } from "../../../../hooks/admin-akademik/useMahasiswa";
import { useState } from "react";

interface FormDomiciliProps {
  formData?: CreateStudentData;
  onInputChange: (field: keyof CreateStudentData, value: any) => void;
}

export default function FormDomicili({
  formData,
  onInputChange,
}: FormDomiciliProps) {
  const [sameDomisili, setSameDomisili] = useState(false);

  const provinsiOptions = [
    { value: "", label: "-- Pilih Provinsi --" },
    { value: "Aceh", label: "Aceh" },
    { value: "Sumatera Utara", label: "Sumatera Utara" },
    { value: "Jawa Barat", label: "Jawa Barat" },
    { value: "Jawa Tengah", label: "Jawa Tengah" },
    { value: "Jawa Timur", label: "Jawa Timur" },
    { value: "DKI Jakarta", label: "DKI Jakarta" },
    { value: "Banten", label: "Banten" },
  ];

  const kotaOptions = [
    { value: "", label: "-- Pilih Kota --" },
    { value: "Jakarta", label: "Jakarta" },
    { value: "Bandung", label: "Bandung" },
    { value: "Bogor", label: "Bogor" },
    { value: "Depok", label: "Depok" },
    { value: "Bekasi", label: "Bekasi" },
    { value: "Tangerang", label: "Tangerang" },
    { value: "Surabaya", label: "Surabaya" },
  ];

  const kecamatanOptions = [
    { value: "", label: "-- Pilih Kecamatan --" },
    { value: "Bogor Tengah", label: "Bogor Tengah" },
    { value: "Bogor Selatan", label: "Bogor Selatan" },
    { value: "Bogor Utara", label: "Bogor Utara" },
    { value: "Bogor Barat", label: "Bogor Barat" },
    { value: "Bogor Timur", label: "Bogor Timur" },
  ];

  const statusTinggalOptions = [
    { value: "", label: "-- Pilih Status Tinggal --" },
    { value: "Rumah Sendiri", label: "Rumah Sendiri" },
    { value: "Dengan Orang Tua", label: "Dengan Orang Tua" },
    { value: "Kost", label: "Kost" },
    { value: "Asrama", label: "Asrama" },
    { value: "Kontrak", label: "Kontrak" },
  ];

  // Handler untuk checkbox "Domisili Sama Dengan KTP"
  const handleSameDomisiliChange = (checked: boolean) => {
    setSameDomisili(checked);

    if (checked) {
      // Copy data KTP ke Domisili
      onInputChange("alamatDomisili", formData?.alamatKtp);
      onInputChange("rtDomisili", formData?.rtKtp);
      onInputChange("rwDomisili", formData?.rwKtp);
      onInputChange("dusunDomisili", formData?.dusunRt);
      onInputChange("desaDomisili", formData?.desaKtp);
      onInputChange("provinsiDomisili", formData?.provinsiKtp);
      onInputChange("kotaDomisili", formData?.kotaRt);
      onInputChange("kecamatanDomisili", formData?.kecamatanRt);
      onInputChange("kodePosDomisili", formData?.kodePosKtp);
      onInputChange("statusTinggalDomisili", formData?.statusTinggalKtp);
    }
  };

  return (
    <LayoutForTabNavigation className="-mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5 border-1 border-gray-400 p-3">
      {/* KTP Section */}
      <div>
        <h2 className="text-primary-green font-bold border-b-2 border-primary-green pb-1 mb-4">
          KTP
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <TextInput
              label="Alamat"
              value={formData?.alamatKtp}
              onChange={(value) => onInputChange("alamatKtp", value)}
            />
            <TextInput
              label="RT"
              value={formData?.rtKtp?.toString() || ""}
              onChange={(value) => onInputChange("rtKtp", parseInt(value) || 0)}
            />
            <TextInput
              label="RW"
              value={formData?.rwKtp?.toString() || ""}
              onChange={(value) => onInputChange("rwKtp", parseInt(value) || 0)}
            />
            <TextInput
              label="Dusun"
              value={formData?.dusunRt}
              onChange={(value) => onInputChange("dusunRt", value)}
            />
            <TextInput
              label="Desa / Kelurahan"
              value={formData?.desaKtp}
              onChange={(value) => onInputChange("desaKtp", value)}
            />
            <SelectInput
              label="Provinsi"
              options={provinsiOptions}
              value={formData?.provinsiKtp}
              onChange={(value) => onInputChange("provinsiKtp", value)}
            />
            <SelectInput
              label="Kota"
              options={kotaOptions}
              value={formData?.kotaRt}
              onChange={(value) => onInputChange("kotaRt", value)}
            />
            <SelectInput
              label="Kecamatan"
              options={kecamatanOptions}
              value={formData?.kecamatanRt}
              onChange={(value) => onInputChange("kecamatanRt", value)}
            />
            <TextInput
              label="Kode Pos"
              value={formData?.kodePosKtp}
              onChange={(value) => onInputChange("kodePosKtp", value)}
            />
            <SelectInput
              label="Status Tinggal"
              options={statusTinggalOptions}
              value={formData?.statusTinggalKtp}
              onChange={(value) => onInputChange("statusTinggalKtp", value)}
            />
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
            <div className="grid grid-cols-2 items-center">
              <label htmlFor="sameDomisili" className="text-sm font-medium">
                Domisili Sama Dengan KTP
              </label>
              <input
                type="checkbox"
                id="sameDomisili"
                className="h-4 w-4"
                checked={sameDomisili}
                onChange={(e) => handleSameDomisiliChange(e.target.checked)}
              />
            </div>
            <TextInput
              label="Alamat"
              value={formData?.alamatDomisili}
              onChange={(value) => onInputChange("alamatDomisili", value)}
            />
            <TextInput
              label="RT"
              value={formData?.rtDomisili?.toString() || ""}
              onChange={(value) =>
                onInputChange("rtDomisili", parseInt(value) || 0)
              }
            />
            <TextInput
              label="RW"
              value={formData?.rwDomisili?.toString() || ""}
              onChange={(value) =>
                onInputChange("rwDomisili", parseInt(value) || 0)
              }
            />
            <TextInput
              label="Dusun"
              value={formData?.dusunDomisili}
              onChange={(value) => onInputChange("dusunDomisili", value)}
            />
            <TextInput
              label="Desa / Kelurahan"
              value={formData?.desaDomisili}
              onChange={(value) => onInputChange("desaDomisili", value)}
            />
            <SelectInput
              label="Provinsi"
              options={provinsiOptions}
              value={formData?.provinsiDomisili}
              onChange={(value) => onInputChange("provinsiDomisili", value)}
            />
            <SelectInput
              label="Kota"
              options={kotaOptions}
              value={formData?.kotaDomisili}
              onChange={(value) => onInputChange("kotaDomisili", value)}
            />
            <SelectInput
              label="Kecamatan"
              options={kecamatanOptions}
              value={formData?.kecamatanDomisili}
              onChange={(value) => onInputChange("kecamatanDomisili", value)}
            />
            <TextInput
              label="Kode Pos"
              value={formData?.kodePosDomisili}
              onChange={(value) => onInputChange("kodePosDomisili", value)}
            />
            <SelectInput
              label="Status Tinggal"
              options={statusTinggalOptions}
              value={formData?.statusTinggalDomisili}
              onChange={(value) =>
                onInputChange("statusTinggalDomisili", value)
              }
            />
          </div>
        </div>
      </div>
    </LayoutForTabNavigation>
  );
}
