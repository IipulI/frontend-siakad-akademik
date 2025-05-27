import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import {
  ArrowLeft,
  CircleX,
  Eye,
  Plus,
  Save,
  Settings,
  Trash2,
} from "lucide-react";
import BorderedGreenContainer from "../../../components/BorderedGreenContainer";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import { useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { TabNavigationButtonStudent } from "../../../components/admin-academic/dashboard/TabNavigasiButton";

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
        <div className="flex justify-between items-center p-4 bg-[#DFF0D8]">
          <span>
            Default Isian Tanngal Mulai dan Tanggal Selesai diambil dari Periode
            Akademik dengan jenis Perkuliahan
          </span>
          <CircleX />
        </div>
        <BorderedGreenContainer>
          <div className="flex justify-end items-center space-x-4">
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
          <div className="grid grid-cols-6 gap-4 items-start">
            <div className="rounded overflow-hidden mb-5 col-span-1">
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
            <div className="col-span-5">
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
      <div className="space-y-3">
        <div>
          <div>
            <h1 className="font-bold text-2xl">Informasi Kelas</h1>
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
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
      </div>
      <div className="space-y-3">
        <div>
          <h1 className="font-bold text-2xl">Jadwal Mingguan</h1>
        </div>
        <DetailCollegeClassTable scheduleList={scheduleList} />
        <ButtonClick
          icon={<Plus size={15} strokeWidth={3} />}
          color="bg-primary-green"
          text="Tambah Jadwal"
          onClick={addNewSchedule}
        />
      </div>
    </>
  );
};

const ClassBio = () => {
  return (
    <div className="bg-[#F5FFF9] w-full px-4 py-2 mt-5 border-l-8 border-[#116E63]">
      <h2 className="font-semibold text-sm mb-2">Status</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-8 text-[16px]">
        <div className="flex flex-col space-y-2">
          <p>
            <span className="font-medium">
              Program Studi : S1 - Teknik Informatika
            </span>
          </p>
          <p>
            <span className="font-medium">
              Mata Kuliah : FTS113 - Bahasa Inggris + Praktikum - 2 SKS
            </span>
          </p>
          <p>
            <span className="font-medium">Kurikulum : 2022</span>
          </p>
          <p>
            <span className="font-medium">Kapasitas : 30</span>
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <p>
            <span className="font-medium">Periode : 2024 Genap</span>
          </p>
          <p>
            <span className="font-medium">Nama Kelas : REG_A</span>
          </p>
          <p>
            <span className="font-medium">Sistem Kuliah : Reguler</span>
          </p>
          <p>
            <span className="font-medium">Peserta : 20</span>
          </p>
        </div>
      </div>
    </div>
  );
};
const Lecturer = () => {
  return (
    <div className="space-y-4">
      <ClassBio />
      <div className="flex justify-end">
        <ButtonClick
          text="Tambah Dosen Pengajar"
          icon={<Plus size={15} />}
          color="bg-primary-green"
          onClick={() => alert("Tambah Dosen Pengajar")}
        />
      </div>
      <h1 className="font-semibold text-xl">Tidak Ada Dosen Pengajar</h1>
    </div>
  );
};

const ClassAttendant = () => {
  return (
    <div className="space-y-4">
      <ClassBio />
      <div className="flex justify-end items-center space-x-2">
        <ButtonClick
          text="Tambah"
          icon={<Plus size={15} />}
          color={"bg-primary-green"}
          onClick={() => alert("tambah")}
        />
        <ButtonClick
          icon={<Trash2 size={15} />}
          text="Hapus"
          color={"bg-red-400"}
          onClick={() => alert("Hapus")}
        />
        <ButtonClick
          icon={<Settings size={15} />}
          color={"bg-primary-yellow"}
          text="Aksi"
          onClick={() => alert("Aksi")}
        />
      </div>
      <CollegeClassTable data={sampleData} />
    </div>
  );
};

interface ClassAttendant {
  id: string;
  nim: string;
  name: string;
  program: string;
  year: string;
  status: string;
}
interface CollegeClassTableProps {
  data: ClassAttendant[];
}

const CollegeClassTable = ({ data }: CollegeClassTableProps) => {
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectAll, setSelectAll] = useState(false);

  // Update selectAll state based on selectedItems changes
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

  function Link() {
    alert("link");
  }

  function Detail() {
    navigate(AdminAcademicRoute.collegeClass.detailClass);
  }

  function Remove() {
    alert("remove");
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-primary-green text-white">
            <th className="py-2 px-4 border font-semibold border-gray-300">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th className="p-2 border font-semibold border-gray-300">NIM</th>
            <th className="p-2 border font-semibold border-gray-300">
              Nama Mahasiswa
            </th>
            <th className="p-2 border font-semibold border-gray-300">
              Program Studi
            </th>
            <th className="p-2 border font-semibold border-gray-300">
              Angkatan
            </th>
            <th className="p-2 border font-semibold border-gray-300">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50 text-center">
              <td className="py-2 px-4 text-center border border-gray-300 font-semibold">
                <input
                  type="checkbox"
                  checked={!!selectedItems[student.id]}
                  onChange={() => handleSelectOne(student.id)}
                />
              </td>
              <td className="p-2 border border-gray-300 font-semibold">
                {student.nim}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.name}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.program}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.year}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.status === "disetujui" && (
                  <span className="py-1 px-2 text-white rounded-sm bg-primary-green">
                    {student.status}
                  </span>
                )}
                {student.status === "menunggu disetujui" && (
                  <span className="py-1 px-2 text-white rounded-sm bg-gray-500">
                    {student.status}
                  </span>
                )}
              </td>
            </tr>
          ))}
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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-primary-green text-white">
            <th className="p-2 border font-semibold border-gray-300">No</th>
            <th className="p-2 border font-semibold border-gray-300">Hari</th>
            <th className="p-2 border font-semibold border-gray-300">
              Jam Mulai
            </th>
            <th className="p-2 border font-semibold border-gray-300">
              Jam Selesai
            </th>
            <th className="p-2 border font-semibold border-gray-300">
              Jenis Pertemuan
            </th>
            <th className="p-2 border font-semibold border-gray-300">
              Metode Pembelajaran
            </th>
            <th className="p-2 border font-semibold border-gray-300">
              Ruangan
            </th>
            <th className="p-2 border font-semibold border-gray-300"></th>
          </tr>
        </thead>
        <tbody>
          {scheduleList.map((_, index) => (
            <tr key={index} className="hover:bg-gray-50 text-center">
              <td className="p-2 border border-gray-300 font-semibold">
                {index + 1}
              </td>
              <td className="p-2 border border-gray-300 font-semibold">
                <CreateCollegeSelectOption />
              </td>
              <td className="p-2 border border-gray-300 font-semibold">
                <CreateCollegeSelectOption />
              </td>
              <td className="p-2 border border-gray-300 font-semibold">
                <CreateCollegeSelectOption />
              </td>
              <td className="p-2 border border-gray-300 font-semibold">
                <CreateCollegeSelectOption />
              </td>
              <td className="p-2 border border-gray-300 font-semibold">
                <CreateCollegeSelectOption />
              </td>
              <td className="p-2 border border-gray-300 font-semibold">
                <CreateCollegeSelectOption />
              </td>
              <td className="p-2 border border-gray-300 font-semibold"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const RPS = () => {
  const InfoItem = ({ label, children }) => (
    <div className="mb-4">
      <h3 className="font-semibold text-gray-700">{label}</h3>
      <div className="mt-1 text-gray-800">{children}</div>
    </div>
  );

  return (
    <div className="space-y-4 w-full">
      <ClassBio />
      <div className="w-full p-6 bg-white rounded-lg shadow">
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
          <ol className="list-decimal ml-5">
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
          <ol className="list-decimal ml-5">
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
          <ol className="list-decimal ml-5">
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
          <ol className="list-decimal ml-5">
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
          <a href="#" className="text-green-700 underline hover:text-green-900">
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
    <div className="space-y-4">
      <ClassBio />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary-green text-white">
              <th className="py-2 px-4 border font-semibold border-gray-300">
                No
              </th>
              <th className="p-2 border font-semibold border-gray-300">NIM</th>
              <th className="p-2 border font-semibold border-gray-300">
                Nama Mahasiswa
              </th>
              <th className="p-2 border font-semibold border-gray-300">
                Tugas (20,00%)
              </th>
              <th className="p-2 border font-semibold border-gray-300">
                UTS (25,00%)
              </th>
              <th className="p-2 border font-semibold border-gray-300">
                UAS (40,00%)
              </th>
              <th className="p-2 border font-semibold border-gray-300">
                Kehadiran (15,00%)
              </th>
              <th className="p-2 border font-semibold border-gray-300">
                Nilai
              </th>
              <th className="p-2 border font-semibold border-gray-300">
                Grade
              </th>
              <th className="p-2 border font-semibold border-gray-300">
                Lulus
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((student) => (
              <tr key={student.no} className="hover:bg-gray-50 text-center">
                <td className="py-2 px-4 text-center border border-gray-300 font-semibold">
                  {student.no}
                </td>
                <td className="p-2 border border-gray-300 font-semibold">
                  {student.nim}
                </td>
                <td className="p-2 border border-gray-300 font-semibold text-center">
                  {student.name}
                </td>
                <td className="p-2 border border-gray-300 font-semibold text-center">
                  {student.task}
                </td>
                <td className="p-2 border border-gray-300 font-semibold text-center">
                  {student.midExam}
                </td>
                <td className="p-2 border border-gray-300 font-semibold text-center">
                  {student.finalExam}
                </td>
                <td className="p-2 border border-gray-300 font-semibold text-center">
                  {student.attendance}
                </td>
                <td className="p-2 border border-gray-300 font-semibold text-center">
                  {student.grade}
                </td>
                <td className="p-2 border border-gray-300 font-semibold text-center">
                  {student.alphaGrade}
                </td>
                <td className="p-2 border border-gray-300 font-semibold text-center">
                  {student.status === "lulus" && (
                    <span className="py-1 px-2 text-white rounded-sm ">✅</span>
                  )}
                  {student.status === "tidak lulus" && (
                    <span className="py-1 px-2 text-white text-center rounded-sm ">
                      ❌
                    </span>
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
export default DetailCollegeClass;
