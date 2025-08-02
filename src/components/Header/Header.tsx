import Navbar from "../Navbar";
import HamburgerMenu from "../HamburgerMenu";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ArrowRight } from "lucide-react"; // Import ArrowRight lagi
import React, { useState, useRef, useEffect } from "react";
import { StudentRoute } from "../../types/VarRoutes";

// Define navigation items (Tidak Berubah)
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
  // --- MODIFIKASI PROFILE DROPDOWN DATA (Versi Final Sesuai Gambar) ---
  profile: {
    userName: "MUHAMMAD RIDHO FATHAN", // Nama pengguna di bagian atas
    userAvatar: "profile_logo.png", // Avatar di bagian atas
    menuItems: [
      // Ini adalah daftar submenu
      {
        icon: "logo_uika.png", // Ikon panah untuk Lihat Profile (contoh: bisa ArrowRight dari Lucide)
        title: "Lihat Profile",
        to: String(StudentRoute.profile.profile), // Ini adalah link
      },
      {
        icon: "logo_uika.png", // Ikon panah keluar
        title: "Keluar",
        action: "logout", // Menandakan ini adalah aksi logout
      },
    ],
  },
  // --- END: MODIFIKASI PROFILE DROPDOWN DATA ---
};

// --- START: KOMPONEN PROFILE DROPDOWN BARU (Disesuaikan untuk tampilan akhir) ---
const ProfileDropdown = ({ nama, profileData, onClose }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      console.log("User initiating logout from Student Portal!");
      alert("Anda telah keluar dari akun mahasiswa!"); // Sesuaikan pesan alert

      // --- SESUAIKAN DENGAN CARA TOKEN DISIMPAN DI useAuthLogin.ts ---
      localStorage.removeItem("token"); // Menghapus token
      localStorage.removeItem("user"); // Menghapus data user
      // --- AKHIR PENYESUAIAN ---
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
          {nama}
        </p>
      </div>

      {/* Garis Pemisah */}
      <div className="border-t border-gray-200 my-2"></div>

      {/* Bagian Menu Items */}
      <div className="py-2">
        {profileData.menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {/* Kondisi untuk item link (seperti "Lihat Profile") */}
            {item.to && !item.action ? ( // Jika ada 'to' TAPI BUKAN action (logout)
              <Link
                to={item.to}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={onClose}
              >
                {item.icon && (
                  <img
                    src={`/img/${item.icon}`}
                    alt=""
                    className="w-4 h-4 mr-3"
                  />
                )}
                <span>{item.title}</span>
                <ArrowRight size={16} className="ml-auto" />{" "}
                {/* Ikon panah kanan */}
              </Link>
            ) : item.action === "logout" ? ( // Jika ini adalah aksi logout
              <button
                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" // Warna merah untuk logout
                onClick={handleLogout}
              >
                {item.icon && (
                  <img
                    src={`/img/${item.icon}`}
                    alt=""
                    className="w-4 h-4 mr-3"
                  />
                )}
                <span>{item.title}</span>
                <ArrowRight size={16} className="ml-auto" />{" "}
                {/* Ikon panah kanan */}
              </button>
            ) : null}{" "}
            {/* Pastikan ada penanganan jika ada item tanpa to/action yang tidak diinginkan */}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
// --- END: KOMPONEN PROFILE DROPDOWN BARU ---

const Header = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null); // Ref untuk elemen profile

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };
  const [userName, setUserName] = useState<string>("");

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const accountInfoString = localStorage.getItem("account_info");

    if (accountInfoString) {
      const accountInfo = JSON.parse(accountInfoString);

      setUserName(accountInfo.nama);
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
                  nama={userName}
                  profileData={dropdownMenus.profile}
                  onClose={() => setIsProfileDropdownOpen(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Navbar navItems={navItems} dropdownMenus={dropdownMenus} />
    </div>
  );
};

export default Header;
