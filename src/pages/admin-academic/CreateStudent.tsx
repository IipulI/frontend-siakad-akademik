import { ChevronLeft, Save, Search } from "lucide-react";
import ButtonClick from "../../components/admin-academic/student-data/ButtonClick";
import MainLayout from "../../components/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import {
  DateInput,
  RadioInput,
  SelectInput,
  TextInput,
} from "../../components/admin-academic/student-data/Input";
import {
  TabNavigationButton,
  TabNavigationButtonStudent,
} from "../../components/admin-academic/dashboard/TabNavigasiButton";
import { useState } from "react";
import FormGeneralInformation from "../../components/admin-academic/student-data/bio-data/FormGeneralInformation";
import FormDomicili from "../../components/admin-academic/student-data/bio-data/FormDomicili";
import FormParents from "../../components/admin-academic/student-data/bio-data/FormParents";
import FormGuardian from "../../components/admin-academic/student-data/bio-data/FormGuardian";
import FormSchool from "../../components/admin-academic/student-data/bio-data/FormSchool";

export default function CreateStudent() {
  function SearchSubmit() {
    alert("submit");
  }

  const navigate = useNavigate();
  function Back() {
    navigate("/portal/mahasiswa");
  }

  const programStudiOptions = [
    { value: "teknik_informatika", label: "Teknik Informatika" },
    { value: "sistem_informasi", label: "Sistem Informasi" },
    { value: "teknik_mesin", label: "Teknik Mesin" },
    { value: "teknik_sipil", label: "Teknik Sipil" },
    { value: "teknik_elektro", label: "Teknik Elektro" },
  ];

  const konsentrasiOptions = [
    { value: "ai", label: "Artificial Intelligence" },
    { value: "se", label: "Software Engineering" },
    { value: "iot", label: "IOT" },
    { value: "git", label: "GIT" },
  ];

  const periodeOptions = [
    { value: "2023-1", label: "Semester Ganjil 2023" },
    { value: "2023-2", label: "Semester Genap 2023" },
    { value: "2024-1", label: "Semester Ganjil 2024" },
  ];

  const kurikulumOptions = [
    { value: "2020", label: "Kurikulum 2020" },
    { value: "2023", label: "Kurikulum 2023" },
  ];

  const sistemOptions = [
    { value: "reguler", label: "Reguler" },
    { value: "karyawan", label: "Karyawan" },
  ];

  const kelasOptions = [
    { value: "a", label: "Kelas A" },
    { value: "b", label: "Kelas B" },
    { value: "c", label: "Kelas C" },
  ];

  const jenisPendaftaranOptions = [
    { value: "reguler", label: "Reguler" },
    { value: "transfer", label: "Transfer" },
    { value: "kelas_karyawan", label: "Kelas Karyawan" },
  ];

  const jalurPendaftaranOptions = [
    { value: "pmb", label: "PMB" },
    { value: "kerjasama", label: "Kerjasama" },
    { value: "beasiswa", label: "Beasiswa" },
  ];

  const gelombangOptions = [
    { value: "1", label: "Gelombang 1" },
    { value: "2", label: "Gelombang 2" },
    { value: "3", label: "Gelombang 3" },
  ];

  const kebutuhanKhususOptions = [
    { value: "tidak", label: "Tidak" },
    { value: "ya", label: "Ya" },
  ];

  const kampusOptions = [
    { value: "pusat", label: "Kampus Pusat" },
    { value: "cabang1", label: "Kampus Cabang 1" },
    { value: "cabang2", label: "Kampus Cabang 2" },
  ];

  const [activeTab, setActiveTab] = useState("general-information");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <MainLayout isGreeting={false} titlePage="Mahasiswa">
      <div className="border-t-2 border-primary-green rounded-t-sm py-4 bg-white">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
          <div className="flex items-center">
            <input
              type="text"
              className="border-2 p-1 rounded text-xs w-50  "
              placeholder="Cari Kelas Kuliah"
            />
            <ButtonClick
              icon={<Search size={16} strokeWidth={3} />}
              color="bg-primary-yellow"
              onClick={SearchSubmit}
            />
          </div>

          <div className="flex space-x-3">
            <ButtonClick
              icon={<ChevronLeft size={16} strokeWidth={3} />}
              text="Kembali Ke Daftar"
              color="bg-primary-yellow"
              onClick={Back}
              spacing="2"
            />
            <ButtonClick
              icon={<Save size={16} />}
              text="Simpan"
              color="bg-primary-blueSoft"
              onClick={Back}
              spacing="2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 p-4 border-1 rounded-sm shadow-sm mt-3">
          <div className="lg:col-span-2">
            <TextInput label="NIM" required={true} />
            <TextInput label="Nama Mahasiswa" required={true} />
            <SelectInput
              label="Program Studi"
              options={programStudiOptions}
              required={true}
            />
            <SelectInput label="Konsentrasi" options={konsentrasiOptions} />
            <SelectInput
              label="Periode Masuk"
              options={periodeOptions}
              required={true}
            />
            <SelectInput
              label="Tahun Kurikulum"
              options={kurikulumOptions}
              required={true}
            />
            <SelectInput
              label="Sistem Kuliah"
              options={sistemOptions}
              required={true}
            />
            <SelectInput label="Kelas / Kelompok" options={kelasOptions} />
          </div>

          <div className="lg:col-span-2">
            <SelectInput
              label="Jenis Pendaftaran"
              options={jenisPendaftaranOptions}
              required={true}
            />

            <SelectInput
              label="Jalur Pendaftaran"
              options={jalurPendaftaranOptions}
              required={true}
            />

            <SelectInput
              label="Gelombang"
              options={gelombangOptions}
              required={true}
            />

            <DateInput label="Tanggal Masuk" />

            <RadioInput label="Kebutuhan Khusus" />

            <div className="gap grid grid-cols-2 mb-3 font-semibold text-sm sm:text-base">
              <h2>Status Mahasiswa</h2>
              <span className="">Aktif</span>
            </div>
            <div className="gap grid grid-cols-2 mb-3 font-semibold text-sm sm:text-base">
              <h2>Periode Keluar</h2>
            </div>
            <div className="gap grid grid-cols-2 mb-3 font-semibold text-sm sm:text-base">
              <h2>Biodata Valid</h2>
              <span>❌</span>
            </div>

            <SelectInput label="Kampus" options={kampusOptions} />
          </div>

          <div className="rounded-sm lg:col-span-3">
            <div className=" rounded-xl flex w-full space-x-2 justify-between">
              <TabNavigationButton
                isActive={activeTab === "general-information"}
                onClick={() => handleTabClick("general-information")}
                colorTab="bg-primary-green"
                padding="py-1 sm:p-2"
              >
                Informasi Umum
              </TabNavigationButton>
              <TabNavigationButton
                isActive={activeTab === "domicili"}
                onClick={() => handleTabClick("domicili")}
                colorTab="bg-primary-green"
                padding="py-1 sm:p-2"
              >
                Domisili
              </TabNavigationButton>
              <TabNavigationButton
                isActive={activeTab === "parents"}
                onClick={() => handleTabClick("parents")}
                colorTab="bg-primary-green"
                padding="py-1 sm:p-2"
              >
                Orang Tua
              </TabNavigationButton>
              <TabNavigationButton
                isActive={activeTab === "guardian"}
                onClick={() => handleTabClick("guardian")}
                colorTab="bg-primary-green"
                padding="py-1 sm:p-2"
              >
                Wali
              </TabNavigationButton>
              <TabNavigationButton
                isActive={activeTab === "school"}
                onClick={() => handleTabClick("school")}
                colorTab="bg-primary-green"
                padding="py-0 sm:p-2"
              >
                Sekolah
              </TabNavigationButton>
            </div>
          </div>
          <div className="lg:col-span-4">
            {activeTab === "general-information" && <FormGeneralInformation />}
            {activeTab === "domicili" && <FormDomicili />}
            {activeTab === "parents" && <FormParents />}
            {activeTab === "guardian" && <FormGuardian />}
            {activeTab === "school" && <FormSchool />}
          </div>
        </div>
      </div>

      <select name="" id="">
        <option value="data">
          <a href="/portal/mahasiswa">data</a>
        </option>
        <option value="detail">
          <a href="/portal/mahasiswa/detail-mahasiswa">detail</a>
        </option>
      </select>
    </MainLayout>
  );
}
