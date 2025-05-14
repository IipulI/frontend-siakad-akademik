import Navbar from "../Navbar";
import HamburgerMenu from "../HamburgerMenu";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import React from "react";

// Define navigation items
const navItems = [
  {
    id: "1",
    name: "Beranda",
    path: "/admin-akademik/dashboard",
    hasDropdown: false,
  },
  { id: "2", name: "Mahasiswa", dropdownKey: "mahasiswa", hasDropdown: true },
  { id: "3", name: "Akademik", dropdownKey: "akademik", hasDropdown: true },
  {
    id: "4",
    name: "Kelas kuliah",
    path: "",
    hasDropdown: false,
  },
  {
    id: "5",
    name: "Pengumuman",
    path: "/admin-akademik/pengumuman",
    hasDropdown: false,
  },
  { id: "6", name: "Pengaturan", dropdownKey: "pengaturan", hasDropdown: true },
];

// Define menu data
const dropdownMenus = {
  mahasiswa: {
    title: "MAHASISWA",
    items: [
      {
        icon: "icon_annon.png",
        title: "Data Mahasiswa",
        description: "Manajemen Data Mahasiswa",
        to: String(),
      },
      {
        icon: "icon_calendar.png",
        title: "Pembimbing Akademik",
        description: "Set Pembimbing Mahasiswa Dosen",
        to: String(),
      },
    ],
  },
  akademik: {
    title: "AKADEMIK",
    items: [
      {
        icon: "icon_annon.png",
        title: "Tahun Akademik",
        description: "lorem ipsum dolor sit amet",
        to: String(),
      },
      {
        icon: "icon_annon.png",
        title: "Mata Kuliah",
        description: "lorem ipsum dolor sit amet",
        to: String(),
      },
      {
        icon: "icon_annon.png",
        title: "Kurikulum Program Studi",
        description: "lorem ipsum dolor sit amet",
        to: String(),
      },
      {
        icon: "icon_annon.png",
        title: "Manajemen OBE",
        description: "lorem ipsum dolor sit amet",
        to: String(),
      },
      {
        icon: "icon_calendar.png",
        title: "Manajemen RPS",
        description: "lorem ipsum dolor sit amet",
        to: String(),
      },
    ],
  },
  pengaturan: {
    title: "PENGATURAN",
    items: [
      {
        icon: "icon_annon.png",
        title: "Tahun Ajaran",
        description: "lorem ipsum dolor sit amet",
        to: "/admin-akademik/tahun-ajaran",
      },
      {
        icon: "icon_annon.png",
        title: "Periode Akademik",
        description: "lorem ipsum dolor sit amet",
        to: "/admin-akademik/periode-akademik",
      },
      {
        icon: "icon_annon.png",
        title: "Jenjang Pendidikan",
        description: "lorem ipsum dolor sit amet",
        to: "/admin-akademik/jenjang-pendidikan",
      },
      {
        icon: "icon_annon.png",
        title: "Batas SKS",
        description: "lorem ipsum dolor sit amet",
        to: "/admin-akademik/batas-sks",
      },
      {
        icon: "icon_calendar.png",
        title: "Skala Penilaian",
        description: "lorem ipsum dolor sit amet",
        to: "/admin-akademik/skala-penilaian",
      },
      {
        icon: "icon_calendar.png",
        title: "Komposisi Nilai",
        description: "lorem ipsum dolor sit amet",
        to: "/admin-akademik/komposisi-nilai",
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
