import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import {
  ArrowLeft,
  CircleX,
  Eye,
  Plus,
  Save,
  Settings,
  Trash,
  Trash2,
} from "lucide-react";
import BorderedGreenContainer from "../../../components/BorderedGreenContainer";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import { useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { TabNavigationButtonStudent } from "../../../components/admin-academic/dashboard/TabNavigasiButton";

interface ClassAttendant {
  id: string;
  nim: string;
  name: string;
  program: string;
  sks_semester: string;
  sks_total: string;
  semester: string;
}
interface CollegeClassTableProps {
  data: ClassAttendant[];
}

const sampleData = [
  {
    id: "22110804305",
    nim: "22110604",
    name: "Maulana Ikhsan",
    program: "S1 - Teknik Informatika",
    year: "2022",
    status: "disetujui",
  },
  {
    id: "22110804306",
    nim: "22110604",
    name: "Azka Fadilah",
    program: "S1 - Teknik Informatika",
    year: "2022",
    status: "disetujui",
  },
  {
    id: "22110804307",
    nim: "22110604",
    name: "Muhammad Virzha Ardiansyah",
    program: "S1 - Teknik Informatika",
    year: "2022",
    status: "menunggu disetujui",
  },
  {
    id: "22110804308",
    nim: "22110604",
    name: "M.Syaifullah Nurrahman",
    program: "S1 - Teknik Informatika",
    year: "2022",
    status: "menunggu disetujui",
  },
  {
    id: "22110804309",
    nim: "22110604",
    name: "Margonda Panggabean",
    program: "S1 - Teknik Informatika",
    year: "2022",
    status: "menunggu disetujui",
  },
  {
    id: "22110804310",
    nim: "22110604",
    name: "Maulana Ikhsan",
    program: "S1 - Teknik Informatika",
    year: "2022",
    status: "disetujui",
  },
  {
    id: "22110804311",
    nim: "22110604",
    name: "Maulana Ikhsan",
    program: "S1 - Teknik Informatika",
    year: "2022",
    status: "disetujui",
  },
];

const sampleDataAttendant = [
  {
    id: "22110804305",
    nim: "22110604",
    name: "Maulana Ikhsan",
    program: "S1 - Teknik Informatika",
    sks_semester: "22",
    sks_total: "22",
    semester: "2",
  },
  {
    id: "22110804306",
    nim: "22110604",
    name: "Azka Fadilah",
    program: "S1 - Teknik Informatika",
    sks_semester: "22",
    sks_total: "22",
    semester: "2",
  },
  {
    id: "22110804307",
    nim: "22110604",
    name: "Muhammad Virzha Ardiansyah",
    program: "S1 - Teknik Informatika",
    sks_semester: "22",
    sks_total: "22",
    semester: "2",
  },
  {
    id: "22110804308",
    nim: "22110604",
    name: "M.Syaifullah Nurrahman",
    program: "S1 - Teknik Informatika",
    sks_semester: "22",
    sks_total: "22",
    semester: "2",
  },
  {
    id: "22110804309",
    nim: "22110604",
    name: "Margonda Panggabean",
    program: "S1 - Teknik Informatika",
    sks_semester: "22",
    sks_total: "22",
    semester: "2",
  },
  {
    id: "22110804310",
    nim: "22110604",
    name: "Maulana Ikhsan",
    program: "S1 - Teknik Informatika",
    sks_semester: "22",
    sks_total: "22",
    semester: "2",
  },
  {
    id: "22110804311",
    nim: "22110604",
    name: "Maulana Ikhsan",
    program: "S1 - Teknik Informatika",
    sks_semester: "22",
    sks_total: "22",
    semester: "2",
  },
];

const DetailCollegeClass = () => {
  const navigate = useNavigate();
  const [scheduleList, setScheduleList] = useState([
    {
      day: "",
      startTime: "",
      endTime: "",
      meetingType: "",
      learningMethod: "",
      room: "",
    },
  ]);

  const [activeTab, setActiveTab] = useState("classDetails");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const addNewSchedule = () => {
    setScheduleList((prev) => [
      ...prev,
      {
        day: "",
        startTime: "",
        endTime: "",
        meetingType: "",
        learningMethod: "",
        room: "",
      },
    ]);
  };

  const back = () => {
    navigate(AdminAcademicRoute.collegeClass.class);
  };

  const save = () => {
    alert("save");
  };

  return (
    <MainLayout titlePage="Data Kelas" isGreeting={false}>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#DFF0D8] space-y-2 sm:space-y-0">
          <span className="text-sm sm:text-base">
            Default Isian Tanggal Mulai dan Tanggal Selesai diambil dari Periode
            Akademik dengan jenis Perkuliahan
          </span>
          <CircleX className="self-end sm:self-center" />
        </div>

        <BorderedGreenContainer>
          {/* Tombol aksi */}
          <div className="flex flex-wrap justify-end items-center gap-2 sm:gap-4 mb-4">
            <ButtonClick
              icon={<ArrowLeft size={15} strokeWidth={3} />}
              color="bg-primary-yellow"
              text="Kembali Ke Daftar"
              onClick={back}
            />
            <ButtonClick
              icon={<Save size={15} strokeWidth={3} />}
              color="bg-primary-blueSoft"
              text="Simpan"
              onClick={save}
            />
          </div>

          {/* Navigasi Tab dan Konten */}
          <div className="flex flex-col lg:grid lg:grid-cols-6 gap-4 items-start">
            {/* Tab Navigation */}
            <div className="w-full lg:col-span-1">
              <div className="flex lg:flex-col gap-2 overflow-x-auto scrollbar-hide pb-2">
                <TabNavigationButtonStudent
                  isActive={activeTab === "classDetails"}
                  onClick={() => handleTabClick("classDetails")}
                >
                  Detail Kelas
                </TabNavigationButtonStudent>
                <TabNavigationButtonStudent
                  isActive={activeTab === "lecturer"}
                  onClick={() => handleTabClick("lecturer")}
                >
                  Dosen Pengajar
                </TabNavigationButtonStudent>
                <TabNavigationButtonStudent
                  isActive={activeTab === "classAttendant"}
                  onClick={() => handleTabClick("classAttendant")}
                >
                  Peserta Kelas
                </TabNavigationButtonStudent>
                <TabNavigationButtonStudent
                  isActive={activeTab === "rps"}
                  onClick={() => handleTabClick("rps")}
                >
                  RPS
                </TabNavigationButtonStudent>
                <TabNavigationButtonStudent
                  isActive={activeTab === "grading"}
                  onClick={() => handleTabClick("grading")}
                >
                  Penilaian
                </TabNavigationButtonStudent>
                <TabNavigationButtonStudent
                  isActive={activeTab === "examSchedule"}
                  onClick={() => handleTabClick("examSchedule")}
                >
                  Jadwal Ujian
                </TabNavigationButtonStudent>
              </div>
            </div>

            {/* Konten Tab */}
            <div className="w-full lg:col-span-5">
              {activeTab === "classDetails" && (
                <CollegeClassInformation
                  scheduleList={scheduleList}
                  addNewSchedule={addNewSchedule}
                />
              )}
              {activeTab === "lecturer" && <Lecturer />}
              {activeTab === "classAttendant" && <ClassAttendant />}
              {activeTab === "rps" && <RPS />}
              {activeTab === "grading" && <Grading />}
              {activeTab === "examSchedule" && <ExamSchedule />}
            </div>
          </div>
        </BorderedGreenContainer>
      </div>
    </MainLayout>
  );
};

const CollegeClassInformation = ({ scheduleList, addNewSchedule }) => {
  const systemOptions = [{ value: "", label: "Semua Sistem Kuliah" }];
  const periodOptions = [{ value: "", label: "2025 Ganjil" }];
  const yearOptions = [{ value: "", label: "2025" }];
  const prodiOptions = [{ value: "", label: "Universitas Ibnu Khaldun" }];

  return (
    <>
      {/* Informasi Kelas */}
      <div className="space-y-4">
        <div>
          <h1 className="font-bold text-xl sm:text-2xl mb-2">
            Informasi Kelas
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <InputFilter
              select={true}
              options={periodOptions}
              label="Periode Akademik"
            />
            <InputFilter
              select={true}
              options={systemOptions}
              label="Sistem Kuliah"
            />
            <InputFilter
              select={true}
              options={prodiOptions}
              label="Program Studi"
            />
            <InputFilter select={false} label="Kapasitas" />
            <InputFilter
              options={yearOptions}
              select={true}
              label="Tahun Kurikulum"
            />
            <InputFilter
              options={yearOptions}
              select={true}
              label="Tanggal Mulai"
            />
            <InputFilter select={false} label="Mata Kuliah" />
            <InputFilter
              options={yearOptions}
              select={true}
              label="Tanggal Selesai"
            />
            <InputFilter select={false} label="Nama Kelas" />
            <InputFilter select={false} label="Jumlah Pertemuan" />
          </div>
        </div>

        {/* Jadwal Mingguan */}
        <div className="space-y-4">
          <h1 className="font-bold text-xl sm:text-2xl">Jadwal Mingguan</h1>
          <DetailCollegeClassTable scheduleList={scheduleList} />
          <div className="flex justify-end">
            <ButtonClick
              icon={<Plus size={15} strokeWidth={3} />}
              color="bg-primary-green"
              text="Tambah Jadwal"
              onClick={addNewSchedule}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const ClassBio = () => {
  return (
    <div className="bg-[#F5FFF9] w-full px-4 py-4 mt-5 border-l-8 border-[#116E63] rounded-md">
      <h2 className="font-semibold text-base mb-4">Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm sm:text-base">
        <div className="flex flex-col space-y-2">
          <p>
            <span className="font-medium">
              Program Studi: S1 - Teknik Informatika
            </span>
          </p>
          <p>
            <span className="font-medium">
              Mata Kuliah: FTS113 - Bahasa Inggris + Praktikum - 2 SKS
            </span>
          </p>
          <p>
            <span className="font-medium">Kurikulum: 2022</span>
          </p>
          <p>
            <span className="font-medium">Kapasitas: 30</span>
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <p>
            <span className="font-medium">Periode: 2024 Genap</span>
          </p>
          <p>
            <span className="font-medium">Nama Kelas: REG_A</span>
          </p>
          <p>
            <span className="font-medium">Sistem Kuliah: Reguler</span>
          </p>
          <p>
            <span className="font-medium">Peserta: 20</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const Lecturer = () => {
  const [lecturers, setLecturers] = useState<
    { id: number; name: string; schedule: string[] }[]
  >([]);

  const handleAddLecturer = () => {
    setLecturers((prev) => [
      ...prev,
      { id: Date.now(), name: "", schedule: [] },
    ]);
  };

  const handleRemoveLecturer = (id: number) => {
    setLecturers((prev) => prev.filter((lec) => lec.id !== id));
  };

  const handleNameChange = (id: number, value: string) => {
    setLecturers((prev) =>
      prev.map((lec) => (lec.id === id ? { ...lec, name: value } : lec))
    );
  };

  const handleScheduleToggle = (id: number, time: string) => {
    setLecturers((prev) =>
      prev.map((lec) =>
        lec.id === id
          ? {
              ...lec,
              schedule: lec.schedule.includes(time)
                ? lec.schedule.filter((s) => s !== time)
                : [...lec.schedule, time],
            }
          : lec
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Informasi Kelas */}
      <ClassBio />

      {/* Tombol Tambah Dosen */}
      <div className="flex justify-end">
        <ButtonClick
          text="Tambah Dosen Pengajar"
          icon={<Plus size={15} />}
          color="bg-primary-green"
          onClick={handleAddLecturer}
        />
      </div>

      {/* Form Dosen */}
      {lecturers.length === 0 ? (
        <div className="text-center py-4">
          <h1 className="font-semibold text-lg sm:text-xl text-gray-700">
            Tidak Ada Dosen Pengajar
          </h1>
        </div>
      ) : (
        lecturers.map((lec, index) => (
          <div key={lec.id} className="border-b border-teal-700 pb-4 space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-semibold">
                Dosen Pengajar {index + 1}
              </label>
              <button
                onClick={() => handleRemoveLecturer(lec.id)}
                className="text-white bg-red-500 hover:bg-red-600 p-2 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <input
              type="text"
              value={lec.name}
              onChange={(e) => handleNameChange(lec.id, e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Masukkan nama atau NIP dosen"
            />

            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={lec.schedule.includes("Rabu")}
                  onChange={() => handleScheduleToggle(lec.id, "Rabu")}
                />
                Rabu, 13:00 – 14:00
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={lec.schedule.includes("Kamis")}
                  onChange={() => handleScheduleToggle(lec.id, "Kamis")}
                />
                Kamis, 13:00 – 14:00
              </label>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const ClassAttendant = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Informasi Kelas */}
      <ClassBio />

      {/* Tombol Aksi */}
      <div className="flex flex-wrap justify-end items-center gap-2">
        <ButtonClick
          text="Tambah"
          icon={<Plus size={15} />}
          color="bg-primary-green"
          onClick={() => setShowModal(true)} // Tampilkan modal
        />
        <ButtonClick
          icon={<Trash2 size={15} />}
          text="Hapus"
          color="bg-red-400"
          onClick={() => alert("Hapus")}
        />
        <ButtonClick
          icon={<Settings size={15} />}
          color="bg-primary-yellow"
          text="Aksi"
          onClick={() => alert("Aksi")}
        />
      </div>

      {/* Tabel Peserta */}
      <div className="overflow-x-auto">
        <CollegeClassTable data={sampleDataAttendant} />
      </div>

      {/* Modal Tambah Mahasiswa */}
      {showModal && <AddStudentModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

const CollegeClassTable = ({ data }: CollegeClassTableProps) => {
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const allChecked =
      data.length > 0 && data.every((item) => selectedItems[item.id]);
    setSelectAll(allChecked);
  }, [selectedItems, data]);

  const handleSelectAll = () => {
    const newChecked = !selectAll;
    const updated: { [key: string]: boolean } = {};
    data.forEach((item) => {
      updated[item.id] = newChecked;
    });
    setSelectedItems(updated);
  };

  const handleSelectOne = (id: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const statusClass = (status: string) => {
    if (status === "disetujui") return "bg-primary-green text-white";
    if (status === "menunggu disetujui") return "bg-gray-500 text-white";
    return "bg-gray-200 text-black";
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-[600px] w-full text-sm text-left">
        <thead>
          <tr className="bg-primary-green text-white text-center">
            <th className="py-2 px-4 border border-gray-300">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="cursor-pointer"
              />
            </th>
            <th className="py-2 px-4 border border-gray-300">NIM</th>
            <th className="py-2 px-4 border border-gray-300">Nama Mahasiswa</th>
            <th className="py-2 px-4 border border-gray-300">Program Studi</th>
            <th className="py-2 px-4 border border-gray-300">Sks Semester</th>
            <th className="py-2 px-4 border border-gray-300">Sks Total</th>
            <th className="py-2 px-4 border border-gray-300">Semester</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-gray-50 text-center transition-all duration-150"
              >
                <td className="py-2 px-4 border border-gray-300">
                  <input
                    type="checkbox"
                    checked={!!selectedItems[student.id]}
                    onChange={() => handleSelectOne(student.id)}
                    className="cursor-pointer"
                  />
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.nim}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.name}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.program}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.sks_semester}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.sks_total}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.semester}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                Tidak ada data peserta kelas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const CreateCollegeSelectOption = () => {
  return (
    <select className="border-2 py-0.5 px-2 text-primary-brown">
      <option value="">-- Pilih --</option>
    </select>
  );
};

const DetailCollegeClassTable = ({ scheduleList }) => {
  return (
    <div className="w-full overflow-x-auto rounded-md border border-gray-200">
      <table className="min-w-[900px] w-full border-collapse text-sm">
        <thead>
          <tr className="bg-primary-green text-white text-center">
            <th className="p-3 border border-gray-300">No</th>
            <th className="p-3 border border-gray-300">Hari</th>
            <th className="p-3 border border-gray-300">Jam Mulai</th>
            <th className="p-3 border border-gray-300">Jam Selesai</th>
            <th className="p-3 border border-gray-300">Jenis Pertemuan</th>
            <th className="p-3 border border-gray-300">Metode Pembelajaran</th>
            <th className="p-3 border border-gray-300">Ruangan</th>
            <th className="p-3 border border-gray-300">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {scheduleList.length > 0 ? (
            scheduleList.map((_, index) => (
              <tr key={index} className="text-center hover:bg-gray-50">
                <td className="p-3 border border-gray-300">{index + 1}</td>
                <td className="p-2 border border-gray-300">
                  <CreateCollegeSelectOption />
                </td>
                <td className="p-2 border border-gray-300">
                  <CreateCollegeSelectOption />
                </td>
                <td className="p-2 border border-gray-300">
                  <CreateCollegeSelectOption />
                </td>
                <td className="p-2 border border-gray-300">
                  <CreateCollegeSelectOption />
                </td>
                <td className="p-2 border border-gray-300">
                  <CreateCollegeSelectOption />
                </td>
                <td className="p-2 border border-gray-300">
                  <CreateCollegeSelectOption />
                </td>
                <td className="p-2 border border-gray-300">
                  <button
                    className="text-red-500 hover:underline text-xs"
                    onClick={() => alert(`Hapus jadwal ${index + 1}`)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-4 text-gray-500">
                Tidak ada jadwal perkuliahan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const RPS = () => {
  const InfoItem = ({ label, children }) => (
    <div className="mb-4">
      <h3 className="font-semibold text-gray-700 text-base md:text-lg">
        {label}
      </h3>
      <div className="mt-1 text-gray-800 text-sm md:text-base">{children}</div>
    </div>
  );

  return (
    <div className="space-y-4 w-full px-4 md:px-0">
      <ClassBio />
      <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow overflow-x-auto">
        <InfoItem label="Mata Kuliah">TIF01 - Basis Data</InfoItem>
        <InfoItem label="Tanggal Penyusunan">15 Januari 2021</InfoItem>
        <InfoItem label="Dosen Penyusun">
          221106043033 - Muhammad Syaifullah Nurohman
          <br />
          221106043029 - Azka Fadilah Rahman
        </InfoItem>

        <InfoItem label="Deskripsi Mata Kuliah">
          Mata kuliah ini akan memberikan pengetahuan dasar dalam konsep
          persamaan akuntansi, prosedur dan teknik dalam siklus akuntansi.
        </InfoItem>

        <InfoItem label="Tujuan Mata Kuliah">
          <ol className="list-decimal ml-5 space-y-1">
            <li>
              Mampu menjelaskan mengenai pengertian dan konsep akuntansi serta
              praktik akuntansi pada berbagai jenis organisasi.
            </li>
            <li>
              Mampu menjelaskan mengenai siklus akuntansi dalam menyusun laporan
              keuangan.
            </li>
            <li>Mampu menyusun laporan keuangan pada perusahaan jasa.</li>
            <li>Mampu menyusun laporan keuangan pada perusahaan dagang.</li>
          </ol>
        </InfoItem>

        <InfoItem label="Materi Pembelajaran">
          <ol className="list-decimal ml-5 space-y-1">
            <li>Sejarah dan Gambaran Umum Akuntansi</li>
            <li>Persamaan Akuntansi dan Akun</li>
            <li>Menganalisis Transaksi</li>
            <li>Proses Penyesuaian</li>
            <li>Menyelesaikan siklus Akuntansi Perusahaan Jasa</li>
            <li>Sistem Akuntansi</li>
            <li>Menyelesaikan siklus Akuntansi Perusahaan Dagang</li>
          </ol>
        </InfoItem>

        <InfoItem label="Pustaka Utama">
          <ol className="list-decimal ml-5 space-y-1">
            <li>
              Soemarso S.R., "Akuntansi Suatu Pengantar Edisi ke-6", Salemba
              Empat, 2020.
            </li>
            <li>
              Carl S. Warren, James M. Reeve, J.E. Duchac, dkk, "Pengantar
              Akuntansi 1 Adaptasi Indonesia Edisi 4", Salemba Empat, 2017.
            </li>
          </ol>
        </InfoItem>

        <InfoItem label="Pustaka Pendukung">
          <ol className="list-decimal ml-5 space-y-1">
            <li>
              Ikatan Akuntansi Indonesia, Pernyataan Standar Akuntansi Keuangan
              (PSAK).
            </li>
            <li>
              Weygandt, Kimmel, Kieso "Financial Accounting IFRS"; WileyPLUS,
              2015.
            </li>
          </ol>
        </InfoItem>

        <InfoItem label="Dokumen RPS">
          <a
            href="#"
            className="text-green-700 underline hover:text-green-900 break-words"
          >
            RPS Pengantar Akuntansi 1.pdf
          </a>
        </InfoItem>
      </div>
    </div>
  );
};

const Grading = () => {
  const data = [
    {
      no: "22110804305",
      nim: "22110604",
      name: "Maulana Ikhsan",
      task: "S1 - Teknik Informatika",
      midExam: "99",
      finalExam: "99",
      attendance: "80",
      grade: "80",
      alphaGrade: "A",
      status: "lulus",
    },
    {
      no: "22110804306",
      nim: "22110604",
      name: "Azka Fadilah",
      task: "S1 - Teknik Informatika",
      midExam: "99",
      finalExam: "99",
      attendance: "80",
      grade: "80",
      alphaGrade: "A",
      status: "lulus",
    },
    {
      no: "22110804307",
      nim: "22110604",
      name: "Muhammad Virzha Ardiansyah",
      task: "S1 - Teknik Informatika",
      midExam: "99",
      finalExam: "99",
      attendance: "80",
      grade: "80",
      alphaGrade: "A",
      status: "lulus",
    },
    {
      no: "22110804308",
      nim: "22110604",
      name: "M.Syaifullah Nurrahman",
      task: "S1 - Teknik Informatika",
      midExam: "99",
      finalExam: "99",
      attendance: "80",
      grade: "80",
      alphaGrade: "A",
      status: "lulus",
    },
    {
      no: "22110804309",
      nim: "22110604",
      name: "Margonda Panggabean",
      task: "S1 - Teknik Informatika",
      midExam: "80",
      finalExam: "85",
      attendance: "80",
      grade: "80",
      alphaGrade: "A",
      status: "lulus",
    },
    {
      no: "22110804310",
      nim: "22110604",
      name: "Maulana Ikhsan",
      task: "S1 - Teknik Informatika",
      midExam: "90",
      finalExam: "90",
      attendance: "80",
      grade: "80",
      alphaGrade: "A",
      status: "lulus",
    },
    {
      no: "22110804311",
      nim: "22110604",
      name: "Maulana Ikhsan",
      task: "S1 - Teknik Informatika",
      midExam: "85",
      finalExam: "85",
      attendance: "80",
      grade: "80",
      alphaGrade: "C",
      status: "tidak lulus",
    },
  ];
  return (
    <div className="space-y-4 px-4 md:px-0">
      <ClassBio />
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm md:text-base border-collapse">
          <thead>
            <tr className="bg-primary-green text-white">
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                No
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                NIM
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Nama Mahasiswa
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Tugas (20,00%)
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                UTS (25,00%)
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                UAS (40,00%)
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Kehadiran (15,00%)
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Nilai
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Grade
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Lulus
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((student) => (
              <tr key={student.no} className="hover:bg-gray-50 text-center">
                <td className="py-2 px-4 border border-gray-300 font-medium">
                  {student.no}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.nim}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.name}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.task}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.midExam}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.finalExam}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.attendance}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.grade}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.alphaGrade}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.status === "lulus" ? (
                    <span className="text-green-600 text-lg">✅</span>
                  ) : (
                    <span className="text-red-600 text-lg">❌</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ExamSchedule = () => {
  const data = [
    {
      no: "1",
      type: "UTS",
      date: "14 April 2025",
      time: "13:00 - 14:30",
      room: "Ruang Kuliah Lantai 3 No 305",
      watcher: "221106043035 - Maulana Ikhsan",
      attendance: "30",
    },
    {
      no: "2",
      type: "UTS",
      date: "15 April 2025",
      time: "13:00 - 18:30",
      room: "Ruang Kuliah Lantai 3 No 311",
      watcher: "221106043035 - Maulana Ikhsan",
      attendance: "10",
    },
  ];

  return (
    <div className="space-y-4 px-4 md:px-0">
      <ClassBio />
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm md:text-base border-collapse">
          <thead>
            <tr className="bg-primary-green text-white">
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                No
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Jenis Ujian
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Tanggal
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Waktu
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Ruang
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Pengawas Ujian
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Peserta
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((exam) => (
              <tr key={exam.no} className="hover:bg-gray-50 text-center">
                <td className="py-2 px-4 border border-gray-300 font-medium">
                  {exam.no}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {exam.type}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {exam.date}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {exam.time}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {exam.room}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {exam.watcher}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {exam.attendance}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  <button className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition">
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AddStudentModal = ({ onClose }: { onClose: () => void }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setShow(true);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-white/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className={`relative bg-white rounded-lg shadow-lg p-6 z-50 w-full max-w-md transform transition-all duration-300 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <h2 className="text-center text-lg font-semibold mb-4">
          Tambah Peserta Kelas
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="mahasiswa">
            Mahasiswa
          </label>
          <select
            id="mahasiswa"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-primary-green"
          >
            <option>-- Cari Mahasiswa --</option>
          </select>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
          >
            Batalkan
          </button>
          <button className="bg-primary-green text-white px-4 py-2 rounded hover:bg-green-700">
            Tambah Peserta
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailCollegeClass;
