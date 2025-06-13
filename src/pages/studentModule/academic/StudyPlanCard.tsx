import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import HorizontalLine from "../../../components/profile/HorizontalLine";
import {
  Check,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash,
} from "lucide-react";

const StudyPlanCard = () => {
  const [isClassExists, setIsClassExists] = useState(false);
  const courses = [
    {
      code: "TIF192",
      semester: 5,
      name: "Bahasa Inggris Teknik + Praktikum (REG_B)",
      schedule: "Rabu, 10.00 - 11.40",
      sks: 2,
      curiculum: 2021,
      lecturer: "MUHAAMMAD FURQAN, S.Pd., M.Pd.Bi",
    },
    // {
    //   code: "TIF311",
    //   semester: 5,
    //   name: "Keamanan Informasi + Praktikum (REG_B)",
    //   schedule: "Sabtu, 08.00 - 09.40",
    //   sks: 3,
    //   lecturer: "BAYU ADHI PRAKOSA, S.Kom., M.T.",
    // },
    // {
    //   code: "TIF321",
    //   semester: 5,
    //   name: "Pemrograman Perangkat Bergerak + Praktikum (REG_B)",
    //   schedule: "Jumat, 13.00 - 14.40",
    //   sks: 3,
    //   lecturer: "SAFARUDDIN HIDAYAT AL IKHSAN, S.Kom., M.Kom",
    // },
    // {
    //   code: "TIF341",
    //   semester: 5,
    //   name: "Sistem Pakar dan Penunjang Keputusan (REG_B)",
    //   schedule: "Selasa, 16.00 - 16.45",
    //   sks: 3,
    //   lecturer: "Dr ERWIN HERMAWAN, S.Si., M.Sc",
    // },
    // {
    //   code: "TIF343",
    //   semester: 5,
    //   name: "User Interface and Experience (REG_B)",
    //   schedule: "Rabu, 13.00 - 14.00",
    //   sks: 2,
    //   lecturer: "HERSANTO FAJRI, S.Ds.,M.M.D.",
    // },
    // {
    //   code: "TIF361",
    //   semester: 5,
    //   name: "Rekayasa Perangkat Lunak Lanjut + Praktikum (REG_B)",
    //   schedule: "Jumat, 09.40 - 11.20",
    //   sks: 3,
    //   lecturer: "FITRAH SATRYA FAJAR KUSUMAH",
    // },
    // {
    //   code: "TIF363",
    //   semester: 5,
    //   name: "Verifikasi dan Validasi (REG_B)",
    //   schedule: "Senin, 13.00 - 14.40",
    //   sks: 3,
    //   lecturer: "FITRAH SATRYA FAJAR KUSUMAH",
    // },
    // {
    //   code: "TIF391",
    //   semester: 5,
    //   name: "Komputer dan Masyarakat (REG_B)",
    //   schedule: "Senin, 08.00 - 09.40",
    //   sks: 2,
    //   lecturer: "H. IKSAL YANUARSYAH, S.Hut., M.Sc",
    // },
  ];

  return (
    <MainLayout
      isGreeting={false}
      titlePage={"Pengisian Kartu Rencana Studi"}
      className=""
    >
      <HorizontalLine />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 p-4 bg-[#F4F4F4] mx-auto">
        <StudyPlanCardHeader
          title={"Semester Saat Ini"}
          subtitle={"Semester 5"}
        />
        <StudyPlanCardHeader title={"Batas Total SKS"} subtitle={"24"} />
        <StudyPlanCardHeader
          title={"Periode Akademik"}
          subtitle={"2024 Ganjil"}
        />
        <StudyPlanCardHeader
          title={"Status"}
          subtitle={"KRS Sudah di Verifikasi"}
        />
        <StudyPlanCardHeader
          title={"Pembimbing Akademik"}
          subtitle={"BERLINA WULANDARI, S.T., M.KOM"}
        />
      </div>
      <InfoAlert />
      {courses ? <StudyPlanCardTable courses={courses} /> : "Kosong"}
    </MainLayout>
  );
};

const StudyPlanCardHeader = ({ title, subtitle }) => {
  return (
    <div className="w-full">
      <h1 className="font-semibold text-sm sm:text-base">{title}</h1>
      <h1 className="text-xs sm:text-sm">{subtitle}</h1>
    </div>
  );
};

const StudyPlanCardTable = ({ courses, krsValidated = true }) => {
  const [activeButton, setActiveButton] = useState("pilihKelas");
  const [selectedCourses, setSelectedCourses] = useState([]);

  const handleCheckboxChange = (code) => {
    setSelectedCourses((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const isAllSelected =
    courses.length > 0 && selectedCourses.length === courses.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(courses.map((c) => c.code));
    }
  };

  if (!courses || courses.length === 0) {
    return (
      <div className="bg-green-100 text-green-700 p-4 px-6 rounded-md mt-4 mb-6 text-sm">
        Belum ada Kelas Yang Ditawarkan
      </div>
    );
  }

  const notValidatedKRS = () => {
    return (
      <div className="mb-20">
        <div>
          <div className="grid grid-cols-1">
            {/* Tombol navigasi tab */}
            <div className="flex items-center">
              <button
                onClick={() => setActiveButton("pilihKelas")}
                className={`font-semibold cursor-pointer py-2 px-5 pr-14 transform scale-y-[-1] w-fit ${
                  activeButton === "pilihKelas"
                    ? "bg-primary-green text-white"
                    : "bg-white text-black"
                }`}
              >
                <p className="transform scale-y-[-1]">Pilih Kelas</p>
              </button>
              <button
                onClick={() => setActiveButton("krsTersimpan")}
                className={`font-semibold cursor-pointer py-2 px-5 pr-14 transform scale-y-[-1] w-fit border border-primary-green ${
                  activeButton === "krsTersimpan"
                    ? "bg-primary-green text-white"
                    : "bg-white text-black"
                }`}
                style={{
                  clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)",
                }}
              >
                <p className="transform scale-y-[-1]">KRS Tersimpan</p>
              </button>
            </div>

            {/* Search dan Filter */}
            <div className="flex">
              <input
                type="search"
                placeholder="Cari Kelas"
                className="px-4 py-2 w-60 text-sm rounded border border-slate-300"
              />
              <button className="bg-primary-green w-8 cursor-pointer flex items-center justify-center">
                <Search color="white" size={18} />
              </button>
              <button className="bg-primary-blueDark w-8 cursor-pointer flex items-center justify-center">
                <RefreshCw color="white" size={20} />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-semibold shadow">
                <SlidersHorizontal className="w-4 h-4" />
                Filter dan Urutkan
              </button>
              <button className="border border-orange-500 text-black px-4 py-2 rounded-md hover:bg-orange-100">
                Tepat Semester
              </button>
              <button className="border border-orange-500 text-black px-4 py-2 rounded-md hover:bg-orange-100">
                Semester Lalu
              </button>
              <button className="border border-orange-500 text-black px-4 py-2 rounded-md hover:bg-orange-100">
                Tidak Lulus
              </button>
            </div>
          </div>

          {/* Table Section */}
          {activeButton === "pilihKelas" && (
            <table className="min-w-full bg-white mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 border border-primary-green">
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={isAllSelected}
                    />
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    Nama Matkul
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    Jadwal
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    Kurikulum
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    SKS
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    Semester
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    Dosen Pengajar
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    Huruf Mutu
                  </th>
                </tr>
              </thead>
              <tbody className="font-semibold">
                {courses.map((course, index) => (
                  <tr
                    key={index}
                    className="text-center hover:bg-gray-50 transition"
                  >
                    <td className="px-3 py-2 border border-primary-green">
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.code)}
                        onChange={() => handleCheckboxChange(course.code)}
                      />
                    </td>
                    <td className="px-4 py-2 border border-primary-green text-left">
                      {course.name}
                    </td>
                    <td className="px-4 py-2 border border-primary-green">
                      {course.schedule}
                    </td>
                    <td className="px-4 py-2 border border-primary-green">
                      {course.curiculum}
                    </td>
                    <td className="px-4 py-2 border border-primary-green">
                      {course.sks}
                    </td>
                    <td className="px-4 py-2 border border-primary-green">
                      {course.semester}
                    </td>
                    <td className="px-4 py-2 border border-primary-green">
                      {course.lecturer}
                    </td>
                    <td className="px-4 py-2 border border-primary-green">
                      {course.grade || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="text-sm font-bold bg-white border">
                  <td className="px-4 py-2 text-left" colSpan={8}>
                    <button className="flex items-center gap-2 bg-primary-yellow hover:bg-[#fb8c00] text-white font-semibold px-4 py-2 rounded-md shadow-md">
                      <Check className="w-5 h-5" />
                      Simpan KRS
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          )}

          {activeButton === "krsTersimpan" && (
            <table className="min-w-full bg-white mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 border border-primary-green">
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={isAllSelected}
                    />
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    Nama Matkul
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    Jadwal
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    SKS
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    Semester
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    Dosen Pengajar
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    Status
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    <button className="flex items-center gap-2 bg-red-400 hover:bg-[#fb8c00] text-white font-semibold px-4 py-2 rounded-md shadow-md">
                      <Trash className="w-5 h-5" />
                      Hapus Semua
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="font-semibold">
                {courses.map((course, index) => (
                  <tr
                    key={index}
                    className="text-center hover:bg-gray-50 transition"
                  >
                    <td className="px-3 py-2 border border-primary-green">
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.code)}
                        onChange={() => handleCheckboxChange(course.code)}
                      />
                    </td>
                    <td className="px-4 py-2 border border-primary-green text-left">
                      {course.name}
                    </td>
                    <td className="px-4 py-2 border border-primary-green">
                      {course.schedule}
                    </td>
                    <td className="px-4 py-2 border border-primary-green">
                      {course.sks}
                    </td>
                    <td className="px-4 py-2 border border-primary-green">
                      {course.semester}
                    </td>
                    <td className="px-4 py-2 border border-primary-green">
                      {course.lecturer}
                    </td>
                    <td className="px-4 py-2 border border-primary-green">
                      {course.grade || "-"}
                    </td>
                    <td className="px-4 py-2 border border-primary-green flex justify-center">
                      <button className="flex items-center gap-2 bg-red-400 text-white font-semibold px-4 py-2 rounded-md shadow-md">
                        <Trash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="text-sm font-bold bg-white border">
                  <td className="px-4 py-2 text-left" colSpan={8}>
                    <button className="flex items-center gap-2 bg-primary-green hover:bg-[#fb8c00] text-white font-semibold px-4 py-2 rounded-md shadow-md">
                      <Check className="w-5 h-5" />
                      Ajukan KRS
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    );
  };
  const validatedKRS = () => {
    return (
      <div className="mb-20">
        <div className="">
          <div className="grid grid-cols-1 gap-3 lg:flex lg:justify-between xl:grid-cols-3 items-center">
            {/* Tombol navigasi tab */}
            <div className="flex items-center">
              <button
                className={`font-semibold cursor-pointer py-2 px-5 pr-14 transform scale-y-[-1] w-fit text-white bg-primary-green border border-primary-green
                  `}
                style={{
                  clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)",
                }}
              >
                <p className="transform scale-y-[-1]">KRS Tersimpan</p>
              </button>
            </div>

            {/* Search dan Filter */}
            <div className="flex">
              <input
                type="search"
                placeholder="Cari Kelas"
                className="px-4 py-2 w-60 text-sm rounded border border-slate-300"
              />
              <button className="bg-primary-green w-8 cursor-pointer flex items-center justify-center">
                <Search color="white" size={18} />
              </button>
              <button className="bg-primary-blueDark w-8 cursor-pointer flex items-center justify-center">
                <RefreshCw color="white" size={20} />
              </button>
            </div>

            <div className="lg:flex items-center space-x-2">
              <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 mb-3 lg:mb-0 text-white px-4 py-2 rounded-md font-semibold shadow">
                <SlidersHorizontal className="w-4 h-4" />
                Filter dan Urutkan
              </button>
              <button className="border border-orange-500 text-black px-4 py-2 rounded-md hover:bg-orange-100">
                Tepat Semester
              </button>
              <button className="border border-orange-500 text-black px-4 py-2 rounded-md hover:bg-orange-100">
                Semester Lalu
              </button>
              <button className="border border-orange-500 text-black px-4 py-2 rounded-md hover:bg-orange-100">
                Tidak Lulus
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-auto">
            {activeButton === "pilihKelas" && (
              <table className="min-w-full bg-white mt-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 border border-primary-green">
                      <input
                        type="checkbox"
                        onChange={toggleSelectAll}
                        checked={isAllSelected}
                      />
                    </th>
                    <th className="px-4 py-3 font-semibold border border-primary-green">
                      Nama Matkul
                    </th>
                    <th className="px-4 py-3 font-semibold border border-primary-green">
                      Jadwal
                    </th>
                    <th className="px-4 py-3 font-semibold border border-primary-green">
                      Kurikulum
                    </th>
                    <th className="px-4 py-3 font-semibold border border-primary-green">
                      SKS
                    </th>
                    <th className="px-4 py-3 font-semibold border border-primary-green">
                      Semester
                    </th>
                    <th className="px-4 py-3 font-semibold border border-primary-green">
                      Dosen Pengajar
                    </th>
                    <th className="px-4 py-3 font-semibold border border-primary-green">
                      Huruf Mutu
                    </th>
                  </tr>
                </thead>
                <tbody className="font-semibold">
                  {courses.map((course, index) => (
                    <tr
                      key={index}
                      className="text-center hover:bg-gray-50 transition"
                    >
                      <td className="px-3 py-2 border border-primary-green">
                        <input
                          type="checkbox"
                          checked={selectedCourses.includes(course.code)}
                          onChange={() => handleCheckboxChange(course.code)}
                        />
                      </td>
                      <td className="px-4 py-2 border border-primary-green text-left">
                        {course.name}
                      </td>
                      <td className="px-4 py-2 border border-primary-green">
                        {course.schedule}
                      </td>
                      <td className="px-4 py-2 border border-primary-green">
                        {course.curiculum}
                      </td>
                      <td className="px-4 py-2 border border-primary-green">
                        {course.sks}
                      </td>
                      <td className="px-4 py-2 border border-primary-green">
                        {course.semester}
                      </td>
                      <td className="px-4 py-2 border border-primary-green">
                        {course.lecturer}
                      </td>
                      <td className="px-4 py-2 border border-primary-green">
                        {course.grade || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {activeButton === "krsTersimpan" && (
            <table className="min-w-full bg-white mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 border border-primary-green">
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={isAllSelected}
                    />
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    Nama Matkul
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    Jadwal
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    SKS
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    Semester
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    Dosen Pengajar
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    Status
                  </th>
                  <th className="px-4 py-3 font-semibold border border-primary-green">
                    <button className="flex items-center gap-2 bg-red-400 hover:bg-[#fb8c00] text-white font-semibold px-4 py-2 rounded-md shadow-md">
                      <Trash className="w-5 h-5" />
                      Hapus Semua
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="font-semibold">
                {courses.map((course, index) => (
                  <tr
                    key={index}
                    className="text-center hover:bg-gray-50 transition"
                  >
                    <td className="px-3 py-2 border border-primary-green">
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.code)}
                        onChange={() => handleCheckboxChange(course.code)}
                      />
                    </td>
                    <td className="px-4 py-2 border border-primary-green text-left">
                      {course.name}
                    </td>
                    <td className="px-4 py-2 border border-primary-green">
                      {course.schedule}
                    </td>
                    <td className="px-4 py-2 border border-primary-green">
                      {course.sks}
                    </td>
                    <td className="px-4 py-2 border border-primary-green">
                      {course.semester}
                    </td>
                    <td className="px-4 py-2 border border-primary-green">
                      {course.lecturer}
                    </td>
                    <td className="px-4 py-2 border border-primary-green">
                      {course.grade || "-"}
                    </td>
                    <td className="px-4 py-2 border border-primary-green flex justify-center">
                      <button className="flex items-center gap-2 bg-red-400 text-white font-semibold px-4 py-2 rounded-md shadow-md">
                        <Trash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="text-sm font-bold bg-white border">
                  <td className="px-4 py-2 text-left" colSpan={8}>
                    <button className="flex items-center gap-2 bg-primary-green hover:bg-[#fb8c00] text-white font-semibold px-4 py-2 rounded-md shadow-md">
                      <Check className="w-5 h-5" />
                      Ajukan KRS
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    );
  };

  return krsValidated ? validatedKRS() : notValidatedKRS();
};

const InfoAlert = () => {
  return (
    <div className="bg-green-100 text-green-700 p-4 px-6 rounded-md mt-4 mb-6 text-sm">
      Periode pengisian dan pengubahan <strong>KRS Teknik Informatika</strong>{" "}
      belum dibuka/sudah ditutup
    </div>
  );
};

export default StudyPlanCard;
