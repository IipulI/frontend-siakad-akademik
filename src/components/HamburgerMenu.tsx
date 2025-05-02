import React, { useState } from "react";
import { Link } from "react-router-dom";

interface MenuItemProps {
  icon: string;
  title: string;
  description: string;
  to: string;
  onClick: () => void;
}

// Component for rendering submenu items
const SubMenuItem = ({
  icon,
  title,
  description,
  to,
  onClick,
}: MenuItemProps) => (
  <li>
    <Link
      to={to}
      className="px-3 py-3 text-sm flex items-center justify-between group"
      onClick={onClick}
    >
      <div className="flex items-center gap-5">
        <img src={`/img/${icon}`} alt="" className="w-6 invert" />
        <div>
          <p>{title}</p>
          <p className="text-xs font-extralight">{description}</p>
        </div>
      </div>
    </Link>
  </li>
);

interface DropdownToggleProps {
  title: string;
  isOpen: boolean;
  onClick: () => void;
}

// Component for dropdown toggle button
const DropdownToggle = ({ title, isOpen, onClick }: DropdownToggleProps) => (
  <div
    className="py-4 flex justify-between items-center cursor-pointer"
    onClick={onClick}
  >
    <span className="font-medium">{title}</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-5 w-5 transition-transform duration-300 ${
        isOpen ? "transform rotate-180" : ""
      }`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  </div>
);

// Component for hamburger icon
const HamburgerIcon = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col justify-center items-center cursor-pointer w-10 h-10 xl:hidden focus:outline-none transition-all duration-300 border-1 shadow-sm"
    aria-label="Menu"
  >
    <span className="block w-6 h-0.5 bg-white transition-transform mb-1.5"></span>
    <span className="block w-6 h-0.5 bg-white transition-opacity mb-1.5"></span>
    <span className="block w-6 h-0.5 bg-white transition-transform"></span>
  </button>
);

// Component for close button
const CloseButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col justify-center cursor-pointer items-center w-10 h-10 xl:hidden focus:outline-none transition-all duration-300"
    aria-label="Menu"
  >
    <span className="block w-6 h-0.5 bg-black transition-transform transform rotate-45 translate-y-1"></span>
    <span className="block w-6 h-0.5 bg-black opacity-0 mb-1"></span>
    <span className="block w-6 h-0.5 bg-black transition-transform transform -rotate-45 -translate-y-1"></span>
  </button>
);

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Define all menu data
  const menuItems = [
    {
      id: "beranda",
      title: "Beranda",
      to: "/dashboard",
      hasDropdown: false,
    },
    {
      id: "jadwal",
      title: "Jadwal",
      hasDropdown: true,
      submenu: [
        {
          icon: "icon_annon.png",
          title: "Pengumuman",
          description: "Informasi Kegiatan Kampus",
          to: "#",
        },
        {
          icon: "icon_calendar.png",
          title: "Kalender Akademik",
          description: "Periksa Kegiatan Perkuliahan",
          to: "/schedule/calendar",
        },
        {
          icon: "icon_week.png",
          title: "Jadwal Minggu Ini",
          description: "Aktifitas Seminggu Ke Depan",
          to: "#",
        },
        {
          icon: "icon_timetable.png",
          title: "Jadwal Semester",
          description: "Kegiatan Anda Satu Semester",
          to: "#",
        },
      ],
    },
    {
      id: "akademik",
      title: "Akademik",
      hasDropdown: true,
      submenu: [
        {
          icon: "icon_annon.png",
          title: "Pengisisan Kartu Rencana Studi",
          description: "Tentukan Rencana Kuliah",
          to: "#",
        },
        {
          icon: "icon_calendar.png",
          title: "Riwayat KRS",
          description: "Rekap Rencana Kuliah Anda",
          to: "#",
        },
        {
          icon: "icon_week.png",
          title: "Mengulang",
          description: "History Perbaikan Mata Kuliah",
          to: "#",
        },
        {
          icon: "icon_timetable.png",
          title: "Nilai Mahasiswa",
          description: "Kualitas Perkuliahan Anda",
          to: "#",
        },
      ],
    },
    {
      id: "hasilStudi",
      title: "Hasil Studi",
      hasDropdown: true,
      submenu: [
        {
          icon: "icon_annon.png",
          title: "Kartu Hasil Studi",
          description: "Laporan Priode Anda",
          to: "#",
        },
        {
          icon: "icon_timetable.png",
          title: "Transkip",
          description: "Hasil Perkuliahan Anda",
          to: "#",
        },
      ],
    },
    {
      id: "keuangan",
      title: "Keuangan",
      hasDropdown: true,
      submenu: [
        {
          icon: "icon_annon.png",
          title: "Tagihan Mahasiswa",
          description: "Biaya Operasional Pendidikan",
          to: "/payment",
        },
        {
          icon: "icon_timetable.png",
          title: "Riwayat Keuangan",
          description: "Riwayat BOP",
          to: "#",
        },
      ],
    },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Reset all dropdowns when closing the menu
    if (isOpen) {
      setOpenDropdowns({});
    }
    // Prevent scrolling on body when menu is open
    document.body.style.overflow = isOpen ? "auto" : "hidden";
  };

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle menu item click
  const handleMenuItemClick = () => {
    toggleMenu();
  };

  return (
    <>
      {/* Hamburger Button */}
      <HamburgerIcon onClick={toggleMenu} />

      {/* Fullscreen Menu */}
      <div
        className={`fixed inset-0 bg-white flex flex-col items-start z-40 transition-all duration-300 pt-6.5 px-5 md:px-10 overflow-y-auto xl:hidden ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none -translate-y-50"
        }`}
      >
        {/* Close button */}
        <CloseButton onClick={toggleMenu} />

        {/* University Logo and Title */}
        <div className="flex items-center mb-8 mt-10">
          <img
            src="/img/logo_uika.png"
            alt="Universitas Ibn Khaldun Logo"
            className="w-12 mr-4"
          />
          <div>
            <p className="text-green-600 text-sm font-medium">SIM Akademik</p>
            <h1 className="text-gray-900 text-xl font-bold">
              Universitas Ibn Khaldun
            </h1>
          </div>
        </div>

        <nav className="w-full border-t border-gray-200">
          <ul className="w-full text-gray-800">
            {menuItems.map((item) => (
              <li key={item.id} className="border-b border-gray-200">
                {item.hasDropdown ? (
                  <>
                    <DropdownToggle
                      title={item.title}
                      isOpen={openDropdowns[item.id]}
                      onClick={() => toggleDropdown(item.id)}
                    />

                    {openDropdowns[item.id] && (
                      <ul className="ml-4 mb-3 space-y-2 text-gray-600">
                        {item.submenu?.map((subItem, idx) => (
                          <SubMenuItem
                            key={idx}
                            icon={subItem.icon}
                            title={subItem.title}
                            description={subItem.description}
                            to={subItem.to}
                            onClick={handleMenuItemClick}
                          />
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.to || "#"}
                    className="py-4 flex justify-between items-center"
                    onClick={handleMenuItemClick}
                  >
                    <span className="font-medium">{item.title}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default HamburgerMenu;
