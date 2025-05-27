import Navbar from "../Navbar";
import HamburgerMenu from "../HamburgerMenu";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import React from "react";
<<<<<<< HEAD
import { LecturerRoute } from "../../types/VarRoutes";
=======
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446

// Define navigation items
const navItems = [
  {
    id: "1",
    name: "Beranda",
<<<<<<< HEAD
    path: LecturerRoute.dashboard,
=======
    path: "",
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
    hasDropdown: false,
  },
  { id: "2", name: "Bimbingan", dropdownKey: "bimbingan", hasDropdown: true },
  { id: "3", name: "Jadwal", dropdownKey: "jadwal", hasDropdown: true },
  {
    id: "4",
    name: "Perkuliahan",
    dropdownKey: "perkuliahan",
    hasDropdown: true,
  },
  { id: "5", name: "Laporan", dropdownKey: "laporan", hasDropdown: true },
];

// Define menu data
const dropdownMenus = {
  bimbingan: {
    title: "KONSULTASI",
    items: [
      {
        icon: "icon_annon.png",
        title: "Konsultasi",
        description: "Konsultasi dengan Mahasiswa",
<<<<<<< HEAD
        to: LecturerRoute.guidance.consultation,
=======
        to: String(),
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
      },
      {
        icon: "icon_calendar.png",
        title: "Bimbingan Akademik",
        description: "Monitoring KRS Mahasiswa",
<<<<<<< HEAD
        to: LecturerRoute.guidance.advisor,
=======
        to: String(),
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
      },
      {
        icon: "icon_week.png",
        title: "Proposal Tugas Akhir",
        description: "Pengajuan Tugas Akhir Mahasiswa",
<<<<<<< HEAD
        to: LecturerRoute.guidance.proposal,
=======
        to: String(),
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
      },
      {
        icon: "icon_calendar.png",
        title: "Daftar Tugas Akhir",
        description: "Progres Tugas Akhir Mahasiswa",
<<<<<<< HEAD
        to: LecturerRoute.guidance.finalProject,
=======
        to: String(),
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
      },
      {
        icon: "icon_timetable.png",
        title: "Kegiatan Pendukung",
        description: "Monitoring Kegiatan Mahasiswa",
<<<<<<< HEAD
        to: LecturerRoute.guidance.supporter,
=======
        to: String(),
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
      },
    ],
  },
  jadwal: {
    title: "JADWAL",
    items: [
      {
<<<<<<< HEAD
        icon: "icon_calendar.png",
        title: "Kalendar Akademik",
        description: "Daftar Kegiatan Akademik",
        to: LecturerRoute.schedule.calendar,
=======
        icon: "icon_annon.png",
        title: "Kalendar Akademik",
        description: "Daftar Kegiatan Akademik",
        to: String(),
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
      },
      {
        icon: "icon_annon.png",
        title: "Jadwal Minggu Ini",
        description: "Kegiatan Dalam Seminggu",
        to: String(),
      },
      {
        icon: "icon_week.png",
        title: "Jadwal Semester Ini",
        description: "Kegiatan Dalam Semester",
        to: String(),
      },
    ],
  },
  perkuliahan: {
    title: "PERKULIAHAN",
    items: [
      {
        icon: "icon_annon.png",
        title: "E-Learning",
        description: "Pembelajaran Akademik",
        to: String(),
      },
      {
        icon: "icon_calendar.png",
        title: "Mata Kuliah",
        description: "Daftar Mata Kuliah Dosen",
<<<<<<< HEAD
        to: LecturerRoute.courses.course,
=======
        to: String(),
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
      },
      {
        icon: "icon_week.png",
        title: "Kelas Kuliah",
        description: "Reserensi SKS Mahasiswa",
<<<<<<< HEAD
        to: LecturerRoute.courses.class,
=======
        to: String(),
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
      },
      {
        icon: "icon_timetable.png",
        title: "Berhenti Studi",
        description: "Mahasiswa",
<<<<<<< HEAD
        to: LecturerRoute.courses.stopStudy,
=======
        to: String(),
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
      },
    ],
  },
  laporan: {
    title: "LAPORAN",
    items: [
      {
        icon: "icon_annon.png",
        title: "Konsultasi",
        description: "Temukan Solusi Masalah Anda",
        to: String(),
      },
      {
        icon: "icon_calendar.png",
        title: "Kegiatan Pendukung",
        description: "Salurkan Bakat Anda Disini",
        to: String(),
      },
      {
        icon: "icon_week.png",
        title: "Daftar Proposal",
        description: "Buat Karya Anda Sekarang Juga",
        to: String(),
      },
      {
        icon: "icon_week.png",
        title: "Daftar Tugas Akhir",
        description: "Selesaikan Karya Anda Saat Ini",
        to: String(),
      },
      {
        icon: "icon_week.png",
        title: "Pengajuan Yudisium",
        description: "Konfirmasi Hasil Studi Anda",
        to: String(),
      },
      {
        icon: "icon_timetable.png",
        title: "Pengajuan Wisuda",
        description: "Konfirmasi Kehadiran Anda",
        to: String(),
      },
    ],
  },
};

const HeaderAdminAcademic = () => {
  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex">
        <div className="flex bg-primary-green w-full rounded-tr-full py-4 px-5 md:px-10 xl:px-40">
          <div>
            <div>
              <div>
                <div className="flex items-center gap-4">
                  {/* menu hamburger */}
                  <HamburgerMenu
                    navItems={navItems}
                    dropdownMenus={dropdownMenus}
                  />
                  {/* logo */}
                  <Link
                    to={"/dashboard"}
                    className="hidden sm:block sm:w-12 xl:w-15"
                  >
                    <img width={60} src="/img/logo_uika.png" alt="" />
                  </Link>
                  <div>
                    <div className="text-white">
                      <h1 className="text-xs">SIM Akademik</h1>
                      <h1 className="text-sm xl:text-base font-semibold">
                        Universitas Ibn Khaldun
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" bg-primary-yellow w-1/2 rounded-bl-full flex justify-center items-center relative">
          {/* aksesoris navbar */}
          <img
            src="/img/aksesoris_navbar.png"
            alt=""
            className="absolute h-full right-0"
          />
          <div className="flex space-x-5 items-center">
            <Bell size={30} color="#fff" />
            <Link to="">
              <img
                width={30}
                src="/img/profile_logo.png"
                className="rounded-full"
              />
            </Link>
          </div>
        </div>
      </div>
      <Navbar navItems={navItems} dropdownMenus={dropdownMenus} />
    </div>
  );
};

export default HeaderAdminAcademic;
