import Navbar from "../Navbar";
import HamburgerMenu from "../HamburgerMenu";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import React from "react";
import { LecturerRoute } from "../../types/VarRoutes";

// Define navigation items
const navItems = [
  {
    id: "1",
    name: "Beranda",
    path: LecturerRoute.dashboard,
    hasDropdown: false,
  },
  {
    id: "2",
    name: "Bimbingan Akademik",
    path: LecturerRoute.guidance.advisor,
    hasDropdown: false,
  },
  { id: "3",
    name: "Jadwal",
    path: LecturerRoute.schedule.calendar,
    hasDropdown: false
  },
  {
    id: "4",
    name: "Perkuliahan",
    dropdownKey: "perkuliahan",
    hasDropdown: true,
  },
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
        to: LecturerRoute.guidance.consultation,
      },
      {
        icon: "icon_week.png",
        title: "Proposal Tugas Akhir",
        description: "Pengajuan Tugas Akhir Mahasiswa",
        to: LecturerRoute.guidance.proposal,
      },
      {
        icon: "icon_calendar.png",
        title: "Daftar Tugas Akhir",
        description: "Progres Tugas Akhir Mahasiswa",
        to: LecturerRoute.guidance.finalProject,
      },
      {
        icon: "icon_timetable.png",
        title: "Kegiatan Pendukung",
        description: "Monitoring Kegiatan Mahasiswa",
        to: LecturerRoute.guidance.supporter,
      },
    ],
  },
  perkuliahan: {
    title: "PERKULIAHAN",
    items: [
      {
        icon: "icon_calendar.png",
        title: "Mata Kuliah",
        description: "Daftar Mata Kuliah Dosen",
        to: LecturerRoute.courses.course,
      },
      {
        icon: "icon_week.png",
        title: "Kelas Kuliah",
        description: "Reserensi SKS Mahasiswa",
        to: LecturerRoute.courses.class,
      },
      // {
      //   icon: "icon_timetable.png",
      //   title: "Berhenti Studi",
      //   description: "Mahasiswa",
      //   to: LecturerRoute.courses.stopStudy,
      // },
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
