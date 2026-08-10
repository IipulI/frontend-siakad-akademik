import { ChevronLeft, Save, Search } from "lucide-react";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import {
  DateInput,
  RadioInput,
  SelectInput,
  TextInput,
} from "../../../components/admin-academic/student-data/Input";
import { TabNavigationButton } from "../../../components/admin-academic/dashboard/TabNavigasiButton";
import { useState } from "react";
import FormGeneralInformation from "../../../components/admin-academic/student-data/bio-data/FormGeneralInformation";
import FormDomicili from "../../../components/admin-academic/student-data/bio-data/FormDomicili";
import FormParents from "../../../components/admin-academic/student-data/bio-data/FormParents";
import FormGuardian from "../../../components/admin-academic/student-data/bio-data/FormGuardian";
import FormSchool from "../../../components/admin-academic/student-data/bio-data/FormSchool";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import {
  CreateKeluargaMahasiswa,
  CreateStudentData,
  useCreateStudent,
} from "../../../hooks/admin-akademik/useMahasiswa";
// import {
//   getAcademicPeriodeDropdown,
//   getProgramStudi,
//   getYearCuriculum,
// } from "../../../hooks/useFilter";
import {
  showToast,
  ToastNotif,
} from "../../../components/admin-finance/Toastify";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  getAcademicPeriodeDropdown,
  getProgramStudi,
  getYearCuriculum,
} from "../../../hooks/useGeneral";

export default function CreateStudent() {
  const [activeTab, setActiveTab] = useState("general-information");

  // State untuk file upload
  const [fotoProfil, setFotoProfil] = useState<File | null>(null);
  const [ijazahSekolah, setIjazahSekolah] = useState<File | null>(null);

  // State untuk form data - integrasi dengan input fields
  const [formData, setFormData] = useState<CreateStudentData>({
    siakProgramStudiId: "",
    nama: "",
    angkatan: "",
    kurikulum: "",
    npm: "",
    periodeMasuk: "",
    sistemKuliah: "",
    kelas: "",
    jenisPendaftaran: "",
    jalurPendaftaran: "",
    gelombang: "",
    jenisKelamin: "",
    tempatLahir: "",
    tanggalLahir: "",
    noKk: "",
    nik: "",
    tanggalMasuk: "",
    kebutuhanKhusus: false,
    statusMahasiswa: "aktif",
    alamatKtp: "",
    rtKtp: 0,
    rwKtp: 0,
    desaKtp: "",
    provinsiKtp: "",
    kodePosKtp: "",
    statusTinggalKtp: "",
    alamatDomisili: "",
    rtDomisili: 0,
    rwDomisili: 0,
    desaDomisili: "",
    provinsiDomisili: "",
    kodePosDomisili: "",
    statusTinggalDomisili: "",
    noTelepon: "",
    noHp: "",
    emailPribadi: "",
    emailKampus: "",
    noTerdaftar: "",
    pendidikanAsal: "",
    provinsiSekolah: "",
    kotaKabSekolah: "",
    namaPendidikanAsal: "",
    alamatSekolah: "",
    teleponSekolah: "",
    noIjazahSekolah: "",
    semester: 0,
    dusunRt: "",
    kotaRt: "",
    kecamatanRt: "",
    dusunDomisili: "",
    kotaDomisili: "",
    kecamatanDomisili: "",
    agama: "",
    beratBadan: "",
    tinggiBadan: "",
    golonganDarah: "",
    transportasi: "",
    kewarganegaraan: "",
    paspor: "",
    statusNikah: "",
    ukuranJasAlmamater: "",
    pekerjaan: "",
    instansiPekerjaan: "",
    penghasilan: "",
    noRekening: "",
    namaRekening: "",
    namaBank: "",
    nisn: "",
  });

  const [formDataKeluarga, setFormDataKeluarga] = useState<
    CreateKeluargaMahasiswa[]
  >([
    {
      noTelepon: "",
      hubungan: "Ayah",
      pekerjaan: "",
      nama: "",
      alamat: "",
      statusHidup: "",
      tanggalLahir: "",
      nik: "",
      pendidikan: "",
      statusKerabat: "",
      email: "",
      penghasilan: "",
    },
    {
      noTelepon: "",
      hubungan: "Ibu",
      pekerjaan: "",
      nama: "",
      alamat: "",
      statusHidup: "",
      tanggalLahir: "",
      nik: "",
      pendidikan: "",
      statusKerabat: "",
      email: "",
      penghasilan: "",
    },
    {
      noTelepon: "",
      hubungan: "Wali",
      pekerjaan: "",
      nama: "",
      alamat: "",
      statusHidup: "",
      tanggalLahir: "",
      nik: "",
      pendidikan: "",
      statusKerabat: "",
      email: "",
      penghasilan: "",
    },
  ]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Handler untuk update form data
  const handleInputChange = (field: keyof CreateStudentData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Perubahan pada handler untuk update form data keluarga
  const handleInputChangeKeluarga = (
    index: number,
    field: keyof CreateKeluargaMahasiswa,
    value: any
  ) => {
    setFormDataKeluarga((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleIjazahSekolahChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setIjazahSekolah(file);
    }
  };

  const { mutateAsync, isPending } = useCreateStudent();

  const { data: programStudiDropdown, isLoading: isLoadingProgramStudi } =
    getProgramStudi();

  const { data: periodeOptions, isLoading: isLoadingPeriode } =
    getAcademicPeriodeDropdown();

  const { data: kurikulumOptions, isLoading: isLoadingKurikulum } =
    getYearCuriculum();

  const sistemOptions = [
    { value: "reguler", label: "Reguler" },
    { value: "karyawan", label: "Karyawan" },
  ];

  const kelasOptions = [{ value: "-", label: "Belum ada Kelasssss" }];

  const jenisPendaftaranOptions = [
    { value: "peserta didik baru", label: "Peserta Didik Baru" },
    { value: "transfer", label: "Transfer" },
  ];

  const jalurPendaftaranOptions = [
    { value: "mandiri", label: "Seleksi Mandiri" },
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

  async function handleSimpan() {
    try {
      // Validasi required fields
      const requiredFields = [
        "npm",
        "nama",
        "siakProgramStudiId",
        "periodeMasuk",
        "kurikulum",
        "sistemKuliah",
        "jenisPendaftaran",
        "jalurPendaftaran",
        "gelombang",
        "tanggalMasuk",
        "jenisKelamin",
        "tempatLahir",
        "tanggalLahir",
        "paspor",
        "emailPribadi",
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        showToast.info(`Mohon lengkapi field ${missingFields.join(", ")}`);
        return;
      }

      await mutateAsync({
        request: JSON.stringify(formData),
        requestKeluarga: JSON.stringify(formDataKeluarga),
        fotoProfil: fotoProfil || undefined,
        ijazahSekolah: ijazahSekolah || undefined,
      });

      showToast.success("Data berhasil disimpan!");
      setTimeout(() => {
        navigate(AdminAcademicRoute.student.studentData);
      }, 1200);

      // Reset file setelah berhasil
      // setFotoProfil(null);
      setIjazahSekolah(null);
    } catch (error) {
      showToast.error("Gagal menyimpan data");
    }
  }

  function SearchSubmit() {
    alert("submit");
  }

  const navigate = useNavigate();
  function Back() {
    navigate(AdminAcademicRoute.student.studentData);
  }

  const kampusOptions = [];

  console.log("formdata", formData);
  console.log("PRODI", programStudiDropdown);
  //   console.log("PROGRAM STUDI", programStudiOptions);

  if (isLoadingProgramStudi) {
    return <LoadingSpinner />;
  }

  return (
    <MainLayout isGreeting={false} titlePage="Mahasiswa">
      <ToastNotif />
      <div className="border-t-2 border-primary-green rounded-t-sm py-4 bg-white">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
          {/* <div className="flex items-center">
            <input
              type="text"
              className="border-2 p-1 rounded text-xs w-50"
              placeholder="Cari Kelas Kuliah"
            />
            <ButtonClick
              icon={<Search size={16} strokeWidth={3} />}
              color="bg-primary-yellow"
              onClick={SearchSubmit}
            />
          </div> */}
          <div></div>

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
              text={isPending ? "Menyimpan..." : "Simpan"}
              color="bg-primary-blueSoft"
              onClick={handleSimpan}
              spacing="2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 p-4 border-1 rounded-sm shadow-sm mt-3">
          <div className="lg:col-span-2">
            {/* field daftar - Integrated with formData */}
            <TextInput
              label="NIM"
              required={true}
              value={formData.npm}
              onChange={(value) => handleInputChange("npm", value)}
            />
            <TextInput
              label="Nama Mahasiswa"
              required={true}
              value={formData.nama}
              onChange={(value) => handleInputChange("nama", value)}
            />
            <SelectInput
              label="Program Studi"
              options={programStudiDropdown}
              required
              getOptionLabel={(opt) => opt.nama}
              getOptionValue={(opt) => opt.id}
              value={formData.siakProgramStudiId}
              onChange={(value) =>
                handleInputChange("siakProgramStudiId", value?.id ?? "")
              }
            />
            {/* <SelectInput label="Konsentrasi" options={konsentrasiOptions} /> */}
            <SelectInput
              label="Periode Masuk"
              options={periodeOptions}
              required={true}
              getOptionLabel={(opt) => opt.nama}
              getOptionValue={(opt) => opt.kode}
              value={formData.periodeMasuk}
              onChange={(value) =>
                handleInputChange("periodeMasuk", value?.kode ?? "")
              }
            />
            <SelectInput
              label="Tahun Kurikulum"
              options={kurikulumOptions}
              getOptionLabel={(opt) => opt.tahun}
              getOptionValue={(opt) => opt.tahun}
              required={true}
              value={formData.kurikulum}
              onChange={(value) =>
                handleInputChange("kurikulum", value?.tahun ?? "")
              }
            />
            <SelectInput
              label="Sistem Kuliah"
              options={sistemOptions}
              required={true}
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              value={formData.sistemKuliah}
              onChange={(option) =>
                handleInputChange("sistemKuliah", option?.value ?? "")
              }
            />
            <SelectInput
              label="Kelas / Kelompok"
              options={kelasOptions}
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              value={formData.kelas}
              onChange={(option) =>
                handleInputChange("kelas", option?.value ?? "")
              }
            />
          </div>

          <div className="lg:col-span-2">
            <SelectInput
              label="Jenis Pendaftaran"
              options={jenisPendaftaranOptions}
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              required={true}
              value={formData.jenisPendaftaran}
              onChange={(option) =>
                handleInputChange("jenisPendaftaran", option?.value ?? "")
              }
            />

            <SelectInput
              label="Jalur Pendaftaran"
              options={jalurPendaftaranOptions}
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              required={true}
              value={formData.jalurPendaftaran}
              onChange={(option) =>
                handleInputChange("jalurPendaftaran", option?.value ?? "")
              }
            />

            <SelectInput
              label="Gelombang"
              options={gelombangOptions}
              required={true}
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              value={formData.gelombang}
              onChange={(value) =>
                handleInputChange("gelombang", value?.value ?? "")
              }
            />

            <DateInput
              label="Tanggal Masuk"
              value={formData.tanggalMasuk}
              onChange={(value) => handleInputChange("tanggalMasuk", value)}
            />

            <RadioInput
              label="Kebutuhan Khusus"
              value={formData.kebutuhanKhusus}
              onChange={(value) => handleInputChange("kebutuhanKhusus", value)}
            />

            <div className="gap grid grid-cols-2 mb-3 font-semibold text-sm sm:text-base">
              <h2>Status Mahasiswa</h2>
              <span className="">{formData.statusMahasiswa}</span>
            </div>
            <div className="gap grid grid-cols-2 mb-3 font-semibold text-sm sm:text-base">
              <h2>Periode Keluar</h2>
            </div>
            <div className="gap grid grid-cols-2 mb-3 font-semibold text-sm sm:text-base">
              <h2>Biodata Valid</h2>
              <span>❌</span>
            </div>

            {/* <SelectInput
              label="Kampus"
              options={kampusOptions}
              // Tidak ada di interface, jadi tidak diintegrasikan dengan formData
            /> */}
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
            {activeTab === "general-information" && (
              <FormGeneralInformation
                formData={formData}
                onInputChange={handleInputChange}
              />
            )}
            {activeTab === "domicili" && (
              <FormDomicili
                formData={formData}
                onInputChange={handleInputChange}
              />
            )}
            {activeTab === "parents" && (
              <FormParents
                formDataKeluarga={formDataKeluarga}
                onInputChangeKeluarga={handleInputChangeKeluarga}
              />
            )}
            {activeTab === "guardian" && (
              <FormGuardian
                formDataKeluarga={formDataKeluarga}
                onInputChangeKeluarga={handleInputChangeKeluarga}
              />
            )}
            {activeTab === "school" && (
              <FormSchool
                formData={formData}
                onInputChange={handleInputChange}
                ijazahSekolah={ijazahSekolah}
                onIjazahChange={handleIjazahSekolahChange}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
