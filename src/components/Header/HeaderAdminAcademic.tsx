import Navbar from "../Navbar";
import HamburgerMenu from "../HamburgerMenu";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { Bell, ArrowRight } from "lucide-react"; // Import ArrowRight
import React, { useState, useRef, useEffect } from "react"; // Import hooks
import { AdminAcademicRoute } from "../../types/VarRoutes";

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
    path: String(AdminAcademicRoute.collegeClass.class),
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
// Items yang memiliki `children` akan menampilkan sub-menu level 2
// Untuk item dengan children, `to` bersifat opsional (tidak perlu diisi)
const dropdownMenus = {
  mahasiswa: {
    title: "MAHASISWA",
    items: [
      {
        icon: "icon_annon.png",
        title: "Data Mahasiswa",
        description: "Manajemen Data Mahasiswa",
        to: String(AdminAcademicRoute.student.studentData),
      },
      {
        icon: "icon_calendar.png",
        title: "Pembimbing Akademik",
        description: "Set Pembimbing Mahasiswa Dosen",
        to: String(AdminAcademicRoute.student.academicAdvisor),
      },
    ],
  },
  akademik: {
    title: "AKADEMIK",
    items: [
      {
        icon: "icon_annon.png",
        title: "Tahun Kurikulum",
        description: "Tahun Kurikulum",
        to: String(AdminAcademicRoute.curriculumYear),
      },
      {
        icon: "icon_annon.png",
        title: "Mata Kuliah",
        description: "Manajemen Mata Kuliah",
        to: String(AdminAcademicRoute.courseManagement.courseManagement),
      },
      {
        icon: "icon_annon.png",
        title: "Kurikulum Program Studi",
        description: "Kurikulum Program Studi",
        to: String(AdminAcademicRoute.prodiCurriculum),
      },
      {
        // Item dengan sub-menu level 2
        icon: "icon_annon.png",
        title: "Manajemen OBE",
        description: "Managemen OBE",
        children: [
          {
            icon: "icon_annon.png",
            title: "Manajemen OBE",
            description: "Halaman Utama OBE",
            to: String(AdminAcademicRoute.obeManagement.obeManagement),
          },
          {
            icon: "icon_annon.png",
            title: "Profil Lulusan",
            description: "Data Profil Lulusan",
            to: String(AdminAcademicRoute.obeManagement.graduateProfile),
          },
          {
            icon: "icon_annon.png",
            title: "CPL",
            description: "Capaian Pembelajaran Lulusan",
            to: String(AdminAcademicRoute.obeManagement.cpl),
          },
          {
            icon: "icon_annon.png",
            title: "CPMK",
            description: "Capaian Pembelajaran Mata Kuliah",
            to: String(AdminAcademicRoute.obeManagement.cpmk),
          },
        ],
      },
      {
        // Item dengan sub-menu level 2
        icon: "icon_calendar.png",
        title: "Manajemen RPS",
        description: "Manajemen RPS",
        children: [
          {
            icon: "icon_calendar.png",
            title: "Daftar RPS",
            description: "Lihat Semua RPS",
            to: String(AdminAcademicRoute.rpsManagement.rpsManagement),
          },
          {
            icon: "icon_calendar.png",
            title: "Tambah RPS",
            description: "Buat RPS Baru",
            to: String(AdminAcademicRoute.rpsManagement.addRps),
          },
        ],
      },
    ],
  },
  pengaturan: {
    title: "PENGATURAN",
    items: [
      {
        icon: "icon_annon.png",
        title: "Tahun Ajaran",
        description: "Manajemen Tahun Ajaran",
        to: "/admin-akademik/tahun-ajaran",
      },
      {
        icon: "icon_annon.png",
        title: "Periode Akademik",
        description: "Manajemen Periode Akademik",
        to: "/admin-akademik/periode-akademik",
      },
      {
        icon: "icon_annon.png",
        title: "Jenjang Pendidikan",
        description: "Manajemen Jenjang Pendidikan",
        to: "/admin-akademik/jenjang-pendidikan",
      },
      {
        icon: "icon_annon.png",
        title: "Batas SKS",
        description: "Pengaturan Batas SKS",
        to: "/admin-akademik/batas-sks",
      },
      {
        icon: "icon_calendar.png",
        title: "Skala Penilaian",
        description: "Pengaturan Skala Penilaian",
        to: "/admin-akademik/skala-penilaian",
      },
      {
        icon: "icon_calendar.png",
        title: "Komposisi Nilai",
        description: "Pengaturan Komposisi Nilai",
        to: "/admin-akademik/komposisi-nilai",
      },
    ],
  },
  // --- START: TAMBAH DROPDOWN PROFILE UNTUK ADMIN AKADEMIK ---
  profile: {
    userName: "ADMIN AKADEMIK", // Ganti dengan nama admin yang sebenarnya
    userAvatar: "profile_logo.png", // Pastikan gambar ini ada di public/img
    menuItems: [
      {
        icon: "icon_logout_arrow.png", // Ikon logout (panah keluar)
        title: "Keluar",
        action: "logout", // Aksi logout
      },
    ],
  },
  // --- END: TAMBAH DROPDOWN PROFILE UNTUK ADMIN AKADEMIK ---
};

// --- START: KOMPONEN PROFILE DROPDOWN (Reusable, di-copy dari HeaderAdminFinance) ---
const ProfileDropdown = ({ userName, profileData, onClose }) => {
  const navigate = useNavigate(); // Inisialisasi useNavigate

  const handleLogout = async () => {
    // Tambahkan 'async' di sini
    try {
      console.log("User initiating logout from Admin Academic!");

      // --- SESUAIKAN DENGAN CARA TOKEN DISIMPAN DI useAuthLogin.ts ---
      localStorage.removeItem("token"); // Menghapus token
      localStorage.removeItem("user"); // Menghapus data user
      // --- AKHIR PENYESUAIAN ---
      alert("Anda telah keluar dari akun Admin Akademik!"); // Sesuaikan pesan alert
    } catch (error) {
      // Tangani error jika ada masalah saat logout (misalnya, API call gagal)
      console.error("Error during logout process:", error);
      alert("Terjadi kesalahan saat logout. Silakan coba lagi.");
    } finally {
      // Pastikan redirect selalu terjadi, terlepas dari sukses/gagalnya proses logout
      navigate("/"); // Ganti ini menjadi '/login' jika halaman login Anda ada di sana
      // Atau '/' jika itu root halaman login
      onClose(); // Tutup dropdown
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-1 z-50 overflow-hidden">
      {/* Bagian Atas: Nama Pengguna dan Avatar (Tidak bisa diklik) */}
      <div className="flex items-center p-4">
        <img
          src={`/img/${profileData.userAvatar}`} // Gambar profil bulat
          alt="User Avatar"
          className="w-12 h-12 rounded-full mr-3 border-2 border-gray-200"
        />
        <p className="font-semibold text-gray-900 text-base flex-grow">
          {userName}
        </p>
      </div>

      {/* Garis Pemisah (Hanya jika ada menuItems, dalam kasus ini selalu ada 'Keluar') */}
      {profileData.menuItems.length > 0 && (
        <div className="border-t border-gray-200 my-2"></div>
      )}

      {/* Bagian Menu Items */}
      <div className="py-2">
        {profileData.menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {/* Hanya untuk item logout */}
            {item.action === "logout" ? (
              <button
                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={handleLogout}
              >
                {item.icon && (
                  <img
                    src={`/img/${item.icon}`}
                    alt=""
                    className="w-4 h-4 mr-3"
                  />
                )}
                <span className="font-semibold">{item.title}</span>{" "}
                {/* Dibuat bold */}
                <ArrowRight size={16} className="ml-auto" />{" "}
                {/* Ikon panah kanan */}
              </button>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
// --- END: KOMPONEN PROFILE DROPDOWN ---

const HeaderAdminAcademic = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null); // Ref untuk elemen profile

  const [userName, setUserName] = useState<string>("");

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const accountInfoString = localStorage.getItem("account_info");
    const userString = localStorage.getItem("user");

    if (accountInfoString) {
      const accountInfo = JSON.parse(accountInfoString);
      setUserName(accountInfo.nama);
    } else if (userString) {
      const user = JSON.parse(userString);
      setUserName(user.username);
    }

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef]);

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
                    to={"/admin-akademik/dashboard"}
                    className="hidden sm:block sm:w-12 xl:w-15"
                  >
                    <img width={60} src="/img/logo_uika.png" alt="" />
                  </Link>
                  <div>
                    <div className="text-white">
                      <h1 className="text-lg">SIM Akademik</h1>
                      <h1 className="text-base xl:text-xl font-semibold">
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
            {/* START: Tambah Icon Profile dengan Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfileDropdown}
                className="focus:outline-none"
              >
                <img
                  width={30}
                  src="/img/profile_logo.png"
                  className="rounded-full"
                  alt="Profile"
                />
              </button>
              {isProfileDropdownOpen && (
                <ProfileDropdown
                  userName={userName}
                  profileData={dropdownMenus.profile}
                  onClose={() => setIsProfileDropdownOpen(false)}
                />
              )}
            </div>
            {/* END: Tambah Icon Profile dengan Dropdown */}
          </div>
        </div>
      </div>
      <Navbar navItems={navItems} dropdownMenus={dropdownMenus} />
    </div>
  );
};

export default HeaderAdminAcademic;
