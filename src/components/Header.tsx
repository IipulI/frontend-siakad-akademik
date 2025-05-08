import Navbar from "./Navbar";
import HamburgerMenu from "./HamburgerMenu";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import React from "react";
import { StudentRoute } from "../types/VarRoutes";

// Define navigation items
const navItems = [
  {
    id: "1",
    name: "Beranda",
    path: StudentRoute.dashboard,
    hasDropdown: false,
  },
  { id: "2", name: "Jadwal", dropdownKey: "jadwal", hasDropdown: true },
  { id: "3", name: "Akademik", dropdownKey: "akademik", hasDropdown: true },
  {
    id: "4",
    name: "Hasil Studi",
    dropdownKey: "hasilStudi",
    hasDropdown: true,
  },
  { id: "5", name: "Keuangan", dropdownKey: "keuangan", hasDropdown: true },
];

// Define menu data
const dropdownMenus = {
  jadwal: {
    title: "JADWAL",
    items: [
      {
        icon: "icon_annon.png",
        title: "Pengumuman",
        description: "Informasi Kegiatan Kampus",
        to: String(StudentRoute.schedule.announcement),
      },
      {
        icon: "icon_calendar.png",
        title: "Kalender Akademik",
        description: "Periksa Kegiatan Perkuliahan",
        to: String(StudentRoute.schedule.calendar),
      },
      {
        icon: "icon_week.png",
        title: "Jadwal Minggu Ini",
        description: "Aktivitas Seminggu Ke Depan",
        to: String(StudentRoute.schedule.thisWeek),
      },
    ],
  },
  akademik: {
    title: "AKADEMIK",
    items: [
      {
        icon: "icon_annon.png",
        title: "Pengisian Kartu Rencana Studi",
        description: "Tentukan Rencana Kuliah",
        to: String(StudentRoute.academic.studyPlan),
      },
      {
        icon: "icon_calendar.png",
        title: "Riwayat KRS",
        description: "Rekap rencana kuliah Anda",
        to: String(StudentRoute.academic.history),
      },
      {
        icon: "icon_week.png",
        title: "Mengulang",
        description: "History Perbaikan Mata Kuliah",
        to: String(StudentRoute.academic.retake),
      },
      {
        icon: "icon_timetable.png",
        title: "Nilai Mahasiswa",
        description: "Kualitas perkuliaha Anda",
        to: String(StudentRoute.academic.studentGrade),
      },
    ],
  },
  hasilStudi: {
    title: "HASIL STUDI",
    items: [
      {
        icon: "icon_annon.png",
        title: "Kartu Hasil Studi",
        description: "Laporan Priode Anda",
        to: String(StudentRoute.studyResult.studyResult),
      },
      {
        icon: "icon_timetable.png",
        title: "Transkrip",
        description: "Hasil Perkuliahan Anda",
        to: String(StudentRoute.studyResult.transcript),
      },
    ],
  },
  keuangan: {
    title: "KEUANGAN",
    items: [
      {
        icon: "icon_annon.png",
        title: "Tagihan Mahasiswa",
        description: "Biaya Operasional Pendidikan",
        to: String(StudentRoute.payment.payment),
      },
      {
        icon: "icon_timetable.png",
        title: "Riwayat Keuangan",
        description: "Riwayat BOP",
        to: String(StudentRoute.payment.paymentHistory),
      },
    ],
  },
};

const Header = () => {
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
            <Link to={StudentRoute.profile.profile}>
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

export default Header;
