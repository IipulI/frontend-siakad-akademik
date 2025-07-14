import Navbar from "../Navbar";
import HamburgerMenu from "../HamburgerMenu";
import {Link, useNavigate} from "react-router-dom"; // Import useNavigate
import {Bell, ArrowRight} from "lucide-react"; // Import ArrowRight
import React, {useState, useRef, useEffect} from "react"; // Import hooks
import {AdminFinanceRoute} from "../../types/VarRoutes";

// Define navigation items
const navItems = [
    {
        id: "1",
        name: "Beranda",
        path: String(AdminFinanceRoute.dashboardAdminFinance),
        hasDropdown: false,
    },
    {
        id: "2",
        name: "Buat Tagihan",
        path: String(AdminFinanceRoute.createBill),
        hasDropdown: false,
    },
    {
        id: "3",
        name: "Tagihan Mahasiswa",
        path: String(AdminFinanceRoute.studentBill),
        hasDropdown: false,
    },
    {
        id: "4",
        name: "Komponen Tagihan",
        path: String(AdminFinanceRoute.componentBill),
        hasDropdown: false,
    },
];

// Define menu data
const dropdownMenus = {
    profile: {
        userName: "ADMIN KEUANGAN", // Ganti dengan nama admin keuangan yang sebenarnya
        userAvatar: "profile_logo.png", // Pastikan gambar ini ada di public/img
        menuItems: [
            {
                icon: "icon_logout_arrow.png", // Ikon logout (panah keluar)
                title: "Keluar",
                action: "logout", // Aksi logout
            },
        ],
    },
};

// --- START: KOMPONEN PROFILE DROPDOWN (Reusable) ---
const ProfileDropdown = ({profileData, onClose}) => {
    const navigate = useNavigate(); // Inisialisasi useNavigate

    const handleLogout = async () => { // Tambahkan 'async' di sini
        try {
            console.log("User initiating logout from Admin Finance...");

            // --- LOGIKA LOGOUT ANDA ---
            // Contoh: Menghapus token otentikasi dari localStorage
            localStorage.removeItem('token'); // Sesuaikan dengan kunci 'token' dari useAuthLogin
            localStorage.removeItem('user');  // Menghapus data user

            alert("Anda telah keluar dari akun Admin Keuangan!");

        } catch (error) {
            // Tangani error jika ada masalah saat logout (misalnya, API call gagal)
            console.error("Error during logout process:", error);
            alert("Terjadi kesalahan saat logout. Silakan coba lagi.");
        } finally {
            // Pastikan redirect selalu terjadi, terlepas dari sukses/gagalnya proses logout
            navigate('/'); // Ganti ini menjadi '/login' jika halaman login Anda ada di sana
            // Jika tetap ingin ke root '/', biarkan saja
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
                    {profileData.userName}
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
                                    <img src={`/img/${item.icon}`} alt="" className="w-4 h-4 mr-3"/>
                                )}
                                <span className="font-semibold">{item.title}</span> {/* Dibuat bold */}
                                <ArrowRight size={16} className="ml-auto"/> {/* Ikon panah kanan */}
                            </button>
                        ) : null}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
// --- END: KOMPONEN PROFILE DROPDOWN ---

const HeaderAdminFinance = () => {
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
                                    <HamburgerMenu navItems={navItems} dropdownMenus={dropdownMenus}/>
                                    {/* logo */}
                                    <Link
                                        to={"/admin-keuangan/dashboard"}
                                        className="hidden sm:block sm:w-12 xl:w-15"
                                    >
                                        <img width={60} src="/img/logo_uika.png" alt=""/>
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
                        <Bell size={30} color="#fff"/>
                        {/* START: Tambah Icon Profile dengan Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button onClick={toggleProfileDropdown} className="focus:outline-none">
                                <img
                                    width={30}
                                    src="/img/profile_logo.png"
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
            <Navbar navItems={navItems} dropdownMenus={dropdownMenus}/>
        </div>
    );
};

export default HeaderAdminFinance;