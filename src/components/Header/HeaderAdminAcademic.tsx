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
    path: String(AdminAcademicRoute.dashboardAdminAcademic),
    hasDropdown: false,
  },
  { id: "2", name: "Portal", dropdownKey: "portal", hasDropdown: true },
  {
    id: "3",
    name: "Perkuliahan",
    dropdownKey: "perkuliahan",
    hasDropdown: true,
  },
  {
    id: "4",
    name: "Data Pelengkap",
    dropdownKey: "dataPelengkap",
    hasDropdown: true,
  },
  { id: "5", name: "Pengaturan", dropdownKey: "pengaturan", hasDropdown: true },
  // Menu berisi item lama yang belum masuk ke struktur menu baru
  { id: "6", name: "Lainnya", dropdownKey: "lainnya", hasDropdown: true },
];

// Define menu data
// Items yang memiliki `children` akan menampilkan sub-menu level 2
// Untuk item dengan children, `to` bersifat opsional (tidak perlu diisi)
const dropdownMenus = {
  portal: {
    title: "PORTAL",
    items: [
      {
        title: "Mahasiswa",
        description: "Manajemen Data Mahasiswa",
        to: String(AdminAcademicRoute.student.studentData),
      },
      {
        title: "Pengumuman",
        description: "Manajemen Pengumuman",
        to: String(AdminAcademicRoute.announcement),
      },
      {
        title: "Dosen",
        description: "Manajemen Data Dosen",
        to: String(AdminAcademicRoute.portal.dosen),
      },
    ],
  },
  perkuliahan: {
    title: "PERKULIAHAN",
    items: [
      {
        // Item dengan sub-menu level 2
        title: "Manajemen Kurikulum",
        description: "Manajemen Kurikulum",
        children: [
          {
            title: "Mata Kuliah",
            description: "Manajemen Mata Kuliah",
            to: String(AdminAcademicRoute.courseManagement.courseManagement),
          },
          {
            title: "Kurikulum Prodi",
            description: "Kurikulum Program Studi",
            to: String(AdminAcademicRoute.prodiCurriculum),
          },
          {
            // Item dengan sub-menu level 3 (gabungan Manajemen OBE + Penilaian & Monitoring OBE)
            title: "Manajemen OBE",
            description: "Manajemen OBE",
            children: [
              {
                title: "Mata Kuliah",
                description: "Manajemen Mata Kuliah",
                to: String(AdminAcademicRoute.obeManagement.obeManagement),
              },
              {
                title: "Kurikulum Prodi (OBE)",
                description: "Kurikulum Program Studi",
                to: String(AdminAcademicRoute.obeManagement.kurikulumProdi),
              },
              {
                title: "Template Evaluasi",
                description: "Template Evaluasi",
                to: String(AdminAcademicRoute.obeManagement.templateEvaluasi),
              },
              {
                title: "Manajemen Capaian",
                description: "Manajemen OBE",
                to: String(AdminAcademicRoute.obeManagement.manajemenCapaian),
              },
              {
                title: "Set Grup MK Wajib Pilihan",
                description: "Set Grup MK Wajib Pilihan",
                to: String(AdminAcademicRoute.obeManagement.setGrupMk),
              },
              {
                title: "Tahun Kurikulum (OBE)",
                description: "Tahun Kurikulum",
                to: String(AdminAcademicRoute.obeManagement.tahunKurikulum),
              },
            ],
          },
          {
            title: "Tahun Kurikulum",
            description: "Tahun Kurikulum",
            to: String(AdminAcademicRoute.curriculumYear),
          },
        ],
      },
      {
        // Item dengan sub-menu level 2
        title: "Data Kelas",
        description: "Data Kelas",
        children: [
          {
            title: "Kelas Kuliah",
            description: "Manajemen Kelas Kuliah",
            to: String(AdminAcademicRoute.collegeClass.class),
          },
          {
            title: "Monitoring Ruang",
            description: "Monitoring Ruang Kuliah",
            to: String(AdminAcademicRoute.classData.monitoringRoom),
          },
        ],
      },
      {
        // Item dengan sub-menu level 2
        title: "Administrasi",
        description: "Administrasi Mahasiswa",
        children: [
          {
            title: "Status Semester",
            description: "Status Semester Mahasiswa",
            to: String(AdminAcademicRoute.administration.semesterStatus),
          },
          {
            title: "Pembimbing Akademik",
            description: "Set Pembimbing Mahasiswa Dosen",
            to: String(AdminAcademicRoute.student.academicAdvisor),
          },
          {
            title: "Evaluasi Mahasiswa",
            description: "Evaluasi Mahasiswa",
            to: String(AdminAcademicRoute.administration.studentEvaluation),
          },
          {
            title: "Transfer Mahasiswa",
            description: "Transfer Mahasiswa",
            to: String(AdminAcademicRoute.administration.studentTransfer),
          },
          {
            title: "Mahasiswa Keluar",
            description: "Mahasiswa Keluar",
            to: String(AdminAcademicRoute.administration.studentDropout),
          },
        ],
      },
    ],
  },
  dataPelengkap: {
    title: "DATA PELENGKAP",
    items: [
      {
        // Item dengan sub-menu level 2
        title: "Perguruan Tinggi",
        description: "Data Perguruan Tinggi",
        children: [
          {
            title: "Jenjang Pendidikan",
            description: "Manajemen Jenjang Pendidikan",
            to: String(AdminAcademicRoute.setting.level),
          },
          {
            title: "Sistem Kuliah",
            description: "Manajemen Sistem Kuliah",
            to: String(AdminAcademicRoute.institution.studySystem),
          },
          {
            title: "Ruang Kuliah",
            description: "Manajemen Ruang Kuliah",
            to: String(AdminAcademicRoute.institution.classroom),
          },
        ],
      },
      {
        // Item dengan sub-menu level 2
        title: "Perkuliahan",
        description: "Data Pelengkap Perkuliahan",
        children: [
          {
            title: "Jenis Mata Kuliah",
            description: "Manajemen Jenis Mata Kuliah",
            to: String(AdminAcademicRoute.lectureSetting.courseType),
          },
          {
            title: "Slot Waktu",
            description: "Manajemen Slot Waktu",
            to: String(AdminAcademicRoute.lectureSetting.timeSlot),
          },
          {
            title: "Jenis Pertemuan",
            description: "Manajemen Jenis Pertemuan",
            to: String(AdminAcademicRoute.lectureSetting.meetingType),
          },
        ],
      },
      {
        // Item dengan sub-menu level 2
        title: "Biodata",
        description: "Data Pelengkap Biodata",
        children: [
          {
            title: "Agama",
            description: "Manajemen Data Agama",
            to: String(AdminAcademicRoute.biodataSetting.religion),
          },
          {
            title: "Suku",
            description: "Manajemen Data Suku",
            to: String(AdminAcademicRoute.biodataSetting.ethnicity),
          },
          {
            title: "Penghasilan",
            description: "Manajemen Data Penghasilan",
            to: String(AdminAcademicRoute.biodataSetting.income),
          },
          {
            title: "Pekerjaan",
            description: "Manajemen Data Pekerjaan",
            to: String(AdminAcademicRoute.biodataSetting.occupation),
          },
          {
            title: "Jas Almamater",
            description: "Manajemen Data Jas Almamater",
            to: String(AdminAcademicRoute.biodataSetting.almamaterJacket),
          },
        ],
      },
      {
        // Item dengan sub-menu level 2
        title: "Mahasiswa",
        description: "Data Pelengkap Mahasiswa",
        children: [
          {
            title: "Status Mahasiswa",
            description: "Manajemen Status Mahasiswa",
            to: String(AdminAcademicRoute.studentSetting.studentStatus),
          },
          {
            title: "Jenis Tinggal",
            description: "Manajemen Jenis Tinggal",
            to: String(AdminAcademicRoute.studentSetting.residenceType),
          },
          {
            title: "Transportasi",
            description: "Manajemen Data Transportasi",
            to: String(AdminAcademicRoute.studentSetting.transportation),
          },
          {
            title: "Kebutuhan Khusus",
            description: "Manajemen Kebutuhan Khusus",
            to: String(AdminAcademicRoute.studentSetting.specialNeeds),
          },
        ],
      },
    ],
  },
  pengaturan: {
    title: "PENGATURAN",
    items: [
      {
        title: "Periode Akademik",
        description: "Manajemen Periode Akademik",
        to: String(AdminAcademicRoute.setting.period),
      },
    ],
  },
  // Menu sementara untuk item lama yang belum dimasukkan ke struktur menu baru
  lainnya: {
    title: "LAINNYA",
    items: [
      {
        // Item dengan sub-menu level 2
        title: "Manajemen RPS",
        description: "Manajemen RPS",
        children: [
          {
            title: "Daftar RPS",
            description: "Lihat Semua RPS",
            to: String(AdminAcademicRoute.rpsManagement.rpsManagement),
          },
          {
            title: "Tambah RPS",
            description: "Buat RPS Baru",
            to: String(AdminAcademicRoute.rpsManagement.addRps),
          },
        ],
      },
      {
        title: "Tahun Ajaran",
        description: "Manajemen Tahun Ajaran",
        to: String(AdminAcademicRoute.setting.year),
      },
      {
        title: "Batas SKS",
        description: "Pengaturan Batas SKS",
        to: String(AdminAcademicRoute.setting.limit),
      },
      {
        title: "Skala Penilaian",
        description: "Pengaturan Skala Penilaian",
        to: String(AdminAcademicRoute.setting.scale),
      },
      {
        title: "Komposisi Nilai",
        description: "Pengaturan Komposisi Nilai",
        to: String(AdminAcademicRoute.setting.composition),
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
      window.location.replace("http://103.158.196.79/eportal"); // Ganti ini menjadi '/login' jika halaman login Anda ada di sana
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
