import Navbar from "../Navbar";
import HamburgerMenu from "../HamburgerMenu";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ArrowRight } from "lucide-react"; // Import ArrowRight
import React, { useState, useRef, useEffect } from "react"; // Import hooks
import { LecturerRoute } from "../../types/VarRoutes";

// Define navigation items
const navItems = [
    {
        id: "1",
        name: "Beranda",
        path: String(LecturerRoute.dashboard),
        hasDropdown: false,
    },
    {
        id: "2",
        name: "Bimbingan Akademik",
        path: String(LecturerRoute.guidance.advisor),
        hasDropdown: false,
    },
    {
        id: "3",
        name: "Jadwal",
        path: String(LecturerRoute.schedule),
        hasDropdown: false
    },
    {
        id: "4",
        name: "Perkuliahan",
        dropdownKey: "perkuliahan",
        hasDropdown: true,
    },
];


const dropdownMenus = {
    // bimbingan: {
    //     title: "KONSULTASI",
    //     items: [
    //         {
    //             icon: "icon_timetable.png",
    //             title: "Pembimbing Akademik",
    //             description: "Daftar Mahasiswa Bimbingan",
    //             to: String(LecturerRoute.guidance.advisor),
    //         },
    //         {
    //             icon: "icon_annon.png",
    //             title: "Konsultasi",
    //             description: "Konsultasi dengan Mahasiswa",
    //             to: String(LecturerRoute.guidance.consultation),
    //         },
    //         {
    //             icon: "icon_week.png",
    //             title: "Proposal Tugas Akhir",
    //             description: "Pengajuan Tugas Akhir Mahasiswa",
    //             to: String(LecturerRoute.guidance.proposal),
    //         },
    //         {
    //             icon: "icon_calendar.png",
    //             title: "Daftar Tugas Akhir",
    //             description: "Progres Tugas Akhir Mahasiswa",
    //             to: String(LecturerRoute.guidance.finalProject),
    //         },
    //         {
    //             icon: "icon_timetable.png",
    //             title: "Kegiatan Pendukung",
    //             description: "Monitoring Kegiatan Mahasiswa",
    //             to: String(LecturerRoute.guidance.supporter),
    //         },
    //     ],
    // },
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
    // --- START: TAMBAH DROPDOWN PROFILE UNTUK DOSEN ---
    profile: {
        userName: "NAMA DOSEN ANDA", // Ganti dengan nama dosen yang sebenarnya
        userAvatar: "profile_logo.png", // Pastikan gambar ini ada di public/img
        menuItems: [
            {
                icon: "icon_logout_arrow.png", // Ikon logout
                title: "Keluar",
                action: "logout", // Aksi logout
            },
        ],
    },
    // --- END: TAMBAH DROPDOWN PROFILE UNTUK DOSEN ---
};

// --- START: KOMPONEN PROFILE DROPDOWN (Reusable) ---
const ProfileDropdown = ({ profileData, onClose }) => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            console.log("User initiating logout from Student Portal!");
            alert("Anda telah keluar dari akun dosen!"); // Sesuaikan pesan alert

            // --- SESUAIKAN DENGAN CARA TOKEN DISIMPAN DI useAuthLogin.ts ---
            localStorage.removeItem('token'); // Menghapus token
            localStorage.removeItem('user');  // Menghapus data user
            // --- AKHIR PENYESUAIAN ---

        } catch (error) {
            // Tangani error jika ada masalah saat logout (misalnya, API call gagal)
            console.error("Error during logout process:", error);
            alert("Terjadi kesalahan saat logout. Silakan coba lagi.");
        } finally {
            // Pastikan redirect selalu terjadi, terlepas dari sukses/gagalnya proses logout
            navigate('/');
            onClose(); // Tutup dropdown
        }
    }

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
                    {profileData.userName}
                </p>
            </div>

            {/* Garis Pemisah */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Bagian Menu Items */}
            <div className="py-2">
                {profileData.menuItems.map((item, index) => (
                    <React.Fragment key={index}>
                        {item.to && !item.action ? ( // Untuk item link (Lihat Profile)
                            <Link
                                to={item.to}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={onClose}
                            >
                                {item.icon && (
                                    <img src={`/img/${item.icon}`} alt="" className="w-4 h-4 mr-3" />
                                )}
                                <span className="font-semibold">{item.title}</span> {/* Dibuat bold */}
                                <ArrowRight size={16} className="ml-auto" />
                            </Link>
                        ) : item.action === "logout" ? ( // Untuk item logout
                            <button
                                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                onClick={handleLogout}
                            >
                                {item.icon && (
                                    <img src={`/img/${item.icon}`} alt="" className="w-4 h-4 mr-3" />
                                )}
                                <span className="font-semibold">{item.title}</span> {/* Dibuat bold */}
                                <ArrowRight size={16} className="ml-auto" />
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

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    // Tutup dropdown jika klik di luar
    useEffect(() => {
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
                                        to={"/dosen/dashboard"}
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
                        {/* START: Tambah Icon Profile dengan Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button onClick={toggleProfileDropdown} className="focus:outline-none">
                                <img
                                    width={30}
                                    src="/img/profile_logo.png" // Icon profile
                                    className="rounded-full"
                                    alt="Profile"
                                />
                            </button>
                            {isProfileDropdownOpen && (
                                <ProfileDropdown
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