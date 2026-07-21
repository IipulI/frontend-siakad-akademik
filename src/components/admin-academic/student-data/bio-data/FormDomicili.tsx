import LayoutForTabNavigation from "../../dashboard/LayoutForTabNavigation";
import { SelectInput, TextInput } from "./../Input";
import { CreateStudentData } from "../../../../hooks/admin-akademik/useMahasiswa";
import { useState, useEffect } from "react";

interface FormDomiciliProps {
  formData?: CreateStudentData;
  onInputChange: (field: keyof CreateStudentData, value: any) => void;
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

interface District {
  id: string;
  name: string;
  regency_id: string;
}

export default function FormDomicili({
  formData,
  onInputChange,
}: FormDomiciliProps) {
  const [sameDomisili, setSameDomisili] = useState(false);

  // State untuk data API
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [ktpRegencies, setKtpRegencies] = useState<Regency[]>([]);
  const [ktpDistricts, setKtpDistricts] = useState<District[]>([]);
  const [domisiliRegencies, setDomisiliRegencies] = useState<Regency[]>([]);
  const [domisiliDistricts, setDomisiliDistricts] = useState<District[]>([]);

  // State untuk loading
  const [loading, setLoading] = useState({
    provinces: false,
    ktpRegencies: false,
    ktpDistricts: false,
    domisiliRegencies: false,
    domisiliDistricts: false,
  });

  const statusTinggalOptions = [
    { value: "Rumah Sendiri", label: "Rumah Sendiri" },
    { value: "Dengan Orang Tua", label: "Dengan Orang Tua" },
    { value: "Kost", label: "Kost" },
    { value: "Asrama", label: "Asrama" },
    { value: "Kontrak", label: "Kontrak" },
  ];

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
      console.log('provinsi :', data)
      setProvinces(data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    } finally {
      setLoading((prev) => ({ ...prev, provinces: false }));
    }
  };

  // Fetch regencies untuk KTP
  const fetchKtpRegencies = async (provinceId: string) => {
    try {
      setLoading((prev) => ({ ...prev, ktpRegencies: true }));
      const response = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`
      );
      const data = await response.json();
      setKtpRegencies(data);
      setKtpDistricts([]); // Reset districts ketika province berubah
    } catch (error) {
      console.error("Error fetching KTP regencies:", error);
    } finally {
      setLoading((prev) => ({ ...prev, ktpRegencies: false }));
    }
  };

  // Fetch districts untuk KTP
  const fetchKtpDistricts = async (regencyId: string) => {
    try {
      setLoading((prev) => ({ ...prev, ktpDistricts: true }));
      const response = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regencyId}.json`
      );
      const data = await response.json();
      setKtpDistricts(data);
    } catch (error) {
      console.error("Error fetching KTP districts:", error);
    } finally {
      setLoading((prev) => ({ ...prev, ktpDistricts: false }));
    }
  };

  // Fetch regencies untuk Domisili
  const fetchDomisiliRegencies = async (provinceId: string) => {
    try {
      setLoading((prev) => ({ ...prev, domisiliRegencies: true }));
      const response = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`
      );
      const data = await response.json();
      setDomisiliRegencies(data);
      setDomisiliDistricts([]); // Reset districts ketika province berubah
    } catch (error) {
      console.error("Error fetching Domisili regencies:", error);
    } finally {
      setLoading((prev) => ({ ...prev, domisiliRegencies: false }));
    }
  };

  // Fetch districts untuk Domisili
  const fetchDomisiliDistricts = async (regencyId: string) => {
    try {
      setLoading((prev) => ({ ...prev, domisiliDistricts: true }));
      const response = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regencyId}.json`
      );
      const data = await response.json();
      setDomisiliDistricts(data);
    } catch (error) {
      console.error("Error fetching Domisili districts:", error);
    } finally {
      setLoading((prev) => ({ ...prev, domisiliDistricts: false }));
    }
  };

  // Handler untuk perubahan provinsi KTP
  const handleKtpProvinceChange = (value: string) => {
    onInputChange("provinsiKtp", value);
    onInputChange("kotaRt", ""); // Reset kota
    onInputChange("kecamatanRt", ""); // Reset kecamatan

    if (value) {
      fetchKtpRegencies(value);
    } else {
      setKtpRegencies([]);
      setKtpDistricts([]);
    }
  };

  // Handler untuk perubahan kota KTP
  const handleKtpRegencyChange = (value: string) => {
    onInputChange("kotaRt", value);
    onInputChange("kecamatanRt", ""); // Reset kecamatan

    if (value) {
      fetchKtpDistricts(value);
    } else {
      setKtpDistricts([]);
    }
  };

  // Handler untuk perubahan provinsi Domisili
  const handleDomisiliProvinceChange = (value: string) => {
    onInputChange("provinsiDomisili", value);
    onInputChange("kotaDomisili", ""); // Reset kota
    onInputChange("kecamatanDomisili", ""); // Reset kecamatan

    if (value) {
      fetchDomisiliRegencies(value);
    } else {
      setDomisiliRegencies([]);
      setDomisiliDistricts([]);
    }
  };

  // Handler untuk perubahan kota Domisili
  const handleDomisiliRegencyChange = (value: string) => {
    onInputChange("kotaDomisili", value);
    onInputChange("kecamatanDomisili", ""); // Reset kecamatan

    if (value) {
      fetchDomisiliDistricts(value);
    } else {
      setDomisiliDistricts([]);
    }
  };

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

      // Fetch data untuk domisili berdasarkan data KTP
      if (formData?.provinsiKtp) {
        fetchDomisiliRegencies(formData.provinsiKtp);
      }
      if (formData?.kotaRt) {
        fetchDomisiliDistricts(formData.kotaRt);
      }
    }
  };

  // Convert data untuk SelectInput
  const provinceOptions = provinces.map((province) => ({
    value: province.id,
    label: province.name,
  }));

  const ktpRegencyOptions = ktpRegencies.map((regency) => ({
    value: regency.id,
    label: regency.name,
  }));

  const ktpDistrictOptions = ktpDistricts.map((district) => ({
    value: district.id,
    label: district.name,
  }));

  const domisiliRegencyOptions = domisiliRegencies.map((regency) => ({
    value: regency.id,
    label: regency.name,
  }));

  const domisiliDistrictOptions = domisiliDistricts.map((district) => ({
    value: district.id,
    label: district.name,
  }));

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
              options={provinceOptions}
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              value={formData?.provinsiKtp}
              onChange={handleKtpProvinceChange}
            />
            <SelectInput
              label="Kota"
              options={ktpRegencyOptions}
              value={formData?.kotaRt}
              onChange={handleKtpRegencyChange}
            />
            <SelectInput
              label="Kecamatan"
              options={ktpDistrictOptions}
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
              options={provinceOptions}
              value={formData?.provinsiDomisili}
              onChange={handleDomisiliProvinceChange}
            />
            <SelectInput
              label="Kota"
              options={domisiliRegencyOptions}
              value={formData?.kotaDomisili}
              onChange={handleDomisiliRegencyChange}

            />
            <SelectInput
              label="Kecamatan"
              options={domisiliDistrictOptions}
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
