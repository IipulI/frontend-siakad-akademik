import { useState } from "react";
import { Link } from "react-router-dom";

// Create separate component for dropdown menu items
const DropdownMenuItem = ({ icon, title, description, to }) => (
  <Link
    to={to}
    className="px-3 py-3 border-b-1 border-primary-yellow text-sm hover:bg-primary-yellow hover:rounded-sm flex items-center justify-between group mt-3 first:mt-0"
  >
    <div className="flex items-center gap-5">
      <img src={`/img/${icon}`} alt="" className="w-6" />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-xs font-extralight text-gray-300">{description}</p>
      </div>
    </div>
    <svg
      className="w-4 h-4 ml-1 transition-transform duration-200 -rotate-90 opacity-0 group-hover:opacity-100"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      ></path>
    </svg>
  </Link>
);

// Create separate component for dropdown menus
const DropdownMenu = ({ isOpen, title, items }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute mt-7 w-80 bg-primary-green rounded-md shadow-lg py-1 z-50 p-2">
      <h1 className="px-3 py-3">{title}</h1>
      {items.map((item, index) => (
        <DropdownMenuItem
          key={index}
          icon={item.icon}
          title={item.title}
          description={item.description}
          to={item.to}
        />
      ))}
    </div>
  );
};

// Define dropdown arrow component
const DropdownArrow = ({ isOpen }) => (
  <svg
    className={`w-4 h-4 ml-1 transition-transform duration-200 ${
      isOpen ? "rotate-180" : ""
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 9l-7 7-7-7"
    ></path>
  </svg>
);

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  // Define menu data
  const dropdownMenus = {
    jadwal: {
      title: "Jadwal",
      items: [
        {
          icon: "icon_annon.png",
          title: "Pengumuman",
          description: "Informasi Kegiatan Kampus",
          to: "/schedule/announcement",
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
          description: "Aktivitas Seminggu Ke Depan",
          to: "/schedule/this-week",
        },
        {
          icon: "icon_timetable.png",
          title: "Jadwal Semester",
          description: "Kegiatan Anda Satu Semester",
          to: "/schedule/semester",
        },
      ],
    },
    akademik: {
      title: "Akademik",
      items: [
        {
          icon: "icon_annon.png",
          title: "Pengisian Kartu Rencana Studi",
          description: "Tentukan Rencana Kuliah",
          to: "/academic/study-plan",
        },
        {
          icon: "icon_calendar.png",
          title: "Riwayat KRS",
          description: "Rekap rencana kuliah Anda",
          to: "/academic/history",
        },
        {
          icon: "icon_week.png",
          title: "Mengulang",
          description: "History Perbaikan Mata Kuliah",
          to: "/academic/retake",
        },
        {
          icon: "icon_timetable.png",
          title: "Nilai Mahasiswa",
          description: "Kualitas perkuliaha Anda",
          to: "/academic/student-grade",
        },
      ],
    },
    tingkatAkhir: {
      title: "Tingkat Akhir",
      items: [
        {
          icon: "icon_annon.png",
          title: "Konsultasi",
          description: "Temukan solusi masalah Anda",
          to: "#",
        },
        {
          icon: "icon_calendar.png",
          title: "Kegiatan Pendukung",
          description: "Salurkan bakat Anda disini",
          to: "#",
        },
        {
          icon: "icon_week.png",
          title: "Daftar Proposal",
          description: "Buat karya Anda sekarang juga",
          to: "#",
        },
        {
          icon: "icon_week.png",
          title: "Daftar Tugas Akhir",
          description: "Selesaikan karya Anda saat ini",
          to: "#",
        },
        {
          icon: "icon_week.png",
          title: "Pengajuan Yudisium",
          description: "Konfirmasi hasil studi Anda",
          to: "#",
        },
        {
          icon: "icon_timetable.png",
          title: "Pengajuan Wisuda",
          description: "Konfirmasi kehadiran Anda",
          to: "#",
        },
      ],
    },
    hasilStudi: {
      title: "Hasil Studi",
      items: [
        {
          icon: "icon_annon.png",
          title: "Kartu Hasil Studi",
          description: "Laporan Priode Anda",
          to: "/study-result/study-result-card",
        },
        {
          icon: "icon_timetable.png",
          title: "Transkrip",
          description: "Hasil Perkuliahan Anda",
          to: "/study-result/transcript",
        },
      ],
    },
    keuangan: {
      title: "Keuangan",
      items: [
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
          to: "/payment/payment-history",
        },
      ],
    },
  };

  // Define navigation items
  const navItems = [
    { name: "Beranda", path: "/dashboard", hasDropdown: false },
    { name: "Jadwal", dropdownKey: "jadwal", hasDropdown: true },
    { name: "Akademik", dropdownKey: "akademik", hasDropdown: true },
    { name: "Tingkat Akhir", dropdownKey: "tingkatAkhir", hasDropdown: true },
    { name: "Hasil Studi", dropdownKey: "hasilStudi", hasDropdown: true },
    { name: "Keuangan", dropdownKey: "keuangan", hasDropdown: true },
  ];

  return (
    <div className="px-40">
      <ul className="xl:flex space-x-12 text-white hidden bg-primary-green w-fit text-sm p-2.5 rounded-full">
        {navItems.map((item) => (
          <li key={item.name} className="relative">
            {item.hasDropdown ? (
              <>
                <button
                  className="flex items-center focus:outline-none cursor-pointer"
                  onClick={() => toggleDropdown(item.dropdownKey)}
                >
                  {item.name}
                  <DropdownArrow isOpen={openDropdown === item.dropdownKey} />
                </button>
                <DropdownMenu
                  isOpen={openDropdown === item.dropdownKey}
                  title={dropdownMenus[item.dropdownKey].title}
                  items={dropdownMenus[item.dropdownKey].items}
                />
              </>
            ) : (
              <Link to={item.path}>{item.name}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
