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
import {
  TabNavigationButton,
  TabNavigationButtonStudent,
} from "../../../components/admin-academic/dashboard/TabNavigasiButton";
import { useState } from "react";
import FormGeneralInformation from "../../../components/admin-academic/student-data/bio-data/FormGeneralInformation";
import FormDomicili from "../../../components/admin-academic/student-data/bio-data/FormDomicili";
import FormParents from "../../../components/admin-academic/student-data/bio-data/FormParents";
import FormGuardian from "../../../components/admin-academic/student-data/bio-data/FormGuardian";
import FormSchool from "../../../components/admin-academic/student-data/bio-data/FormSchool";
import SemesterStatus from "../../../components/admin-academic/student-data/detail/SemesterStatus";
import LearningProgres from "../../../components/admin-academic/student-data/detail/LearningProgres";
import StudyPlanCard from "../../../components/admin-academic/student-data/detail/StudyPlanCard";
import StudyResultCard from "../../../components/admin-academic/student-data/detail/StudyResultCard";
import Transkrip from "../../../components/admin-academic/student-data/detail/Transkrip";
import FinalizationMK from "../../../components/admin-academic/student-data/detail/FinalizationMK";
import CollegeGrades from "../../../components/admin-academic/student-data/detail/CollegeGrades";
import FinantialHistory from "../../../components/admin-academic/student-data/detail/FinantialHistory";
import Repeat from "../../../components/admin-academic/student-data/detail/Repeat";
import EditKRS from "../../../components/admin-academic/student-data/detail/EditKRS";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useLocation } from "react-router-dom";
import {
  getAcademicPeriodeDropdown,
  getJalurPendaftaran,
  getProgramStudi,
  getSistemKuliah,
  getYearCuriculum,
} from "../../../hooks/useGeneral";
import {
  CreateKeluargaMahasiswa,
  CreateStudentData,
  getFotoProfil,
  useStudentDetail,
} from "../../../hooks/admin-akademik/useMahasiswa";
import { useEffect } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";

const emptyFormDataKeluarga: CreateKeluargaMahasiswa[] = [
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
];

export default function DetailStudent() {
  const [activeTab, setActiveTab] = useState("biodata");
  const { state } = useLocation();
  const { data: foto } = getFotoProfil(state);
  const { data: studentDetail, isLoading: isLoadingDetail } =
    useStudentDetail(state);

  const [formData, setFormData] = useState<Partial<CreateStudentData>>({});
  const [formDataKeluarga, setFormDataKeluarga] = useState<
    CreateKeluargaMahasiswa[]
  >(emptyFormDataKeluarga);

  useEffect(() => {
    if (studentDetail) {
      setFormData(studentDetail as Partial<CreateStudentData>);
      if (studentDetail.keluargaMahasiswaList?.length) {
        setFormDataKeluarga(studentDetail.keluargaMahasiswaList);
      }
    }
  }, [studentDetail]);

  const handleInputChange = (field: keyof CreateStudentData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputChangeKeluarga = (
    index: number,
    field: keyof CreateKeluargaMahasiswa,
    value: any
  ) => {
    setFormDataKeluarga((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  function SearchSubmit() {
    alert("submit");
  }

  const navigate = useNavigate();
  function Back() {
    navigate(AdminAcademicRoute.student.studentData);
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <MainLayout isGreeting={false} titlePage="Mahasiswa">
      <div className="border-t-2 border-primary-green rounded-t-sm py-4 bg-white">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
          {/* <div className="flex items-center">
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
              text="Simpan"
              color="bg-primary-blueSoft"
              onClick={Back}
              spacing="2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 lg:gap-3 py-3">
          <div className="rounded overflow-hidden mb-5">
            <div className="text-7xl font-bold text-white bg-[#F56954] flex justify-center items-center h-40">
              AL
            </div>
            <TabNavigationButtonStudent
              isActive={activeTab === "biodata"}
              onClick={() => handleTabClick("biodata")}
            >
              Biodata
            </TabNavigationButtonStudent>
            <TabNavigationButtonStudent
              isActive={activeTab === "Status Semester"}
              onClick={() => handleTabClick("Status Semester")}
            >
              Status Semester
            </TabNavigationButtonStudent>
            <TabNavigationButtonStudent
              isActive={activeTab === "Kemajuan Belajar"}
              onClick={() => handleTabClick("Kemajuan Belajar")}
            >
              Kemajuan Belajar
            </TabNavigationButtonStudent>
            <TabNavigationButtonStudent
              isActive={activeTab === "Kartu Rencana Studi"}
              onClick={() => handleTabClick("Kartu Rencana Studi")}
            >
              Kartu Rencana Studi
            </TabNavigationButtonStudent>
            <TabNavigationButtonStudent
              isActive={activeTab === "Kartu Hasil Studi"}
              onClick={() => handleTabClick("Kartu Hasil Studi")}
            >
              Kartu Hasil Studi
            </TabNavigationButtonStudent>
            <TabNavigationButtonStudent
              isActive={activeTab === "Transkrip"}
              onClick={() => handleTabClick("Transkrip")}
            >
              Transkrip
            </TabNavigationButtonStudent>
            <TabNavigationButtonStudent
              isActive={activeTab === "Finalisasi MK"}
              onClick={() => handleTabClick("Finalisasi MK")}
            >
              Finalisasi MK
            </TabNavigationButtonStudent>
            <TabNavigationButtonStudent
              isActive={activeTab === "Nilai Kuliah"}
              onClick={() => handleTabClick("Nilai Kuliah")}
            >
              Nilai Kuliah
            </TabNavigationButtonStudent>
            <TabNavigationButtonStudent
              isActive={activeTab === "Riwayat Keuangan"}
              onClick={() => handleTabClick("Riwayat Keuangan")}
            >
              Riwayat Keuangan
            </TabNavigationButtonStudent>
            <TabNavigationButtonStudent
              isActive={activeTab === "MK Mengulang"}
              onClick={() => handleTabClick("MK Mengulang")}
            >
              MK Mengulang
            </TabNavigationButtonStudent>
            <TabNavigationButtonStudent
              isActive={activeTab === "Sunting KRS"}
              onClick={() => handleTabClick("Sunting KRS")}
            >
              Sunting KRS
            </TabNavigationButtonStudent>
          </div>
          <div className="col-span-6">
            {activeTab === "biodata" && isLoadingDetail && <LoadingSpinner />}
            {activeTab === "biodata" && !isLoadingDetail && (
              <BiodataStudent
                formData={formData}
                onInputChange={handleInputChange}
                formDataKeluarga={formDataKeluarga}
                onInputChangeKeluarga={handleInputChangeKeluarga}
              />
            )}
            {activeTab === "Status Semester" && <SemesterStatus />}
            {activeTab === "Kemajuan Belajar" && <LearningProgres />}
            {activeTab === "Kartu Rencana Studi" && <StudyPlanCard />}
            {activeTab === "Kartu Hasil Studi" && <StudyResultCard />}
            {activeTab === "Transkrip" && <Transkrip />}
            {activeTab === "Finalisasi MK" && <FinalizationMK />}
            {activeTab === "Nilai Kuliah" && <CollegeGrades />}
            {activeTab === "Riwayat Keuangan" && <FinantialHistory />}
            {activeTab === "MK Mengulang" && <Repeat />}
            {activeTab === "Sunting KRS" && <EditKRS />}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

interface BiodataStudentProps {
  formData: Partial<CreateStudentData>;
  onInputChange: (field: keyof CreateStudentData, value: any) => void;
  formDataKeluarga: CreateKeluargaMahasiswa[];
  onInputChangeKeluarga: (
    index: number,
    field: keyof CreateKeluargaMahasiswa,
    value: any
  ) => void;
}

export function BiodataStudent({
  formData,
  onInputChange,
  formDataKeluarga,
  onInputChangeKeluarga,
}: BiodataStudentProps) {
  const { data: programStudiDropdown } = getProgramStudi();
  const { data: periodeOptions } = getAcademicPeriodeDropdown();
  const { data: kurikulumOptions } = getYearCuriculum();
  const { data: sistemKuliahOptions } = getSistemKuliah();
  const { data: jalurPendaftaranDropdown } = getJalurPendaftaran();

  const kelasOptions = [{ value: "-", label: "Belum ada Kelasssss" }];

  const jenisPendaftaranOptions = [
    { value: "peserta didik baru", label: "Peserta Didik Baru" },
    { value: "transfer", label: "Transfer" },
  ];

  const gelombangOptions = [
    { value: "1", label: "Gelombang 1" },
    { value: "2", label: "Gelombang 2" },
    { value: "3", label: "Gelombang 3" },
  ];

  const [activeTab, setActiveTab] = useState("general-information");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 p-4 border-1 rounded-sm shadow-sm">
      <div className="lg:col-span-2">
        <TextInput
          label="NIM"
          required={true}
          value={formData.npm}
          onChange={(value) => onInputChange("npm", value)}
        />
        <TextInput
          label="Nama Mahasiswa"
          required={true}
          value={formData.nama}
          onChange={(value) => onInputChange("nama", value)}
        />
        <SelectInput
          label="Program Studi"
          options={programStudiDropdown}
          required
          getOptionLabel={(opt) => opt.nama}
          getOptionValue={(opt) => opt.id}
          value={formData.siakProgramStudiId}
          onChange={(value) =>
            onInputChange("siakProgramStudiId", value?.id ?? "")
          }
        />
        <SelectInput
          label="Periode Masuk"
          options={periodeOptions}
          required={true}
          getOptionLabel={(opt) => opt.nama}
          getOptionValue={(opt) => opt.kode}
          value={formData.periodeMasuk}
          onChange={(value) => onInputChange("periodeMasuk", value?.kode ?? "")}
        />
        <SelectInput
          label="Tahun Kurikulum"
          options={kurikulumOptions}
          getOptionLabel={(opt) => opt.tahun}
          getOptionValue={(opt) => opt.id}
          required={true}
          value={formData.kurikulum}
          onChange={(value) => onInputChange("kurikulum", value?.id ?? "")}
        />
        <SelectInput
          label="Sistem Kuliah"
          options={sistemKuliahOptions}
          required={true}
          getOptionLabel={(opt) => opt.nama}
          getOptionValue={(opt) => opt.id}
          value={formData.sistemKuliah}
          onChange={(option) =>
            onInputChange("sistemKuliah", option?.id ?? "")
          }
        />
        <SelectInput
          label="Kelas / Kelompok"
          options={kelasOptions}
          getOptionLabel={(opt) => opt.label}
          getOptionValue={(opt) => opt.value}
          value={formData.kelas}
          onChange={(option) => onInputChange("kelas", option?.value ?? "")}
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
            onInputChange("jenisPendaftaran", option?.value ?? "")
          }
        />

        <SelectInput
          label="Jalur Pendaftaran"
          options={jalurPendaftaranDropdown}
          getOptionLabel={(opt) => opt.nama}
          getOptionValue={(opt) => opt.id}
          required={true}
          value={formData.jalurPendaftaran}
          onChange={(option) =>
            onInputChange("jalurPendaftaran", option?.id ?? "")
          }
        />

        <SelectInput
          label="Gelombang"
          options={gelombangOptions}
          required={true}
          getOptionLabel={(opt) => opt.label}
          getOptionValue={(opt) => opt.value}
          value={formData.gelombang}
          onChange={(value) => onInputChange("gelombang", value?.value ?? "")}
        />

        <DateInput
          label="Tanggal Masuk"
          value={formData.tanggalMasuk}
          onChange={(value) => onInputChange("tanggalMasuk", value)}
        />

        <RadioInput
          label="Kebutuhan Khusus"
          value={formData.kebutuhanKhusus}
          onChange={(value) => onInputChange("kebutuhanKhusus", value)}
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
            formData={formData as CreateStudentData}
            onInputChange={onInputChange}
          />
        )}
        {activeTab === "domicili" && (
          <FormDomicili
            formData={formData as CreateStudentData}
            onInputChange={onInputChange}
          />
        )}
        {activeTab === "parents" && (
          <FormParents
            formDataKeluarga={formDataKeluarga}
            onInputChangeKeluarga={onInputChangeKeluarga}
          />
        )}
        {activeTab === "guardian" && (
          <FormGuardian
            formDataKeluarga={formDataKeluarga}
            onInputChangeKeluarga={onInputChangeKeluarga}
          />
        )}
        {activeTab === "school" && (
          <FormSchool
            formData={formData as CreateStudentData}
            onInputChange={onInputChange}
            ijazahSekolah={null}
            onIjazahChange={() => {}}
          />
        )}
      </div>
    </div>
  );
}
