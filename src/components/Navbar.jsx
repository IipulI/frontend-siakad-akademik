import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  // State untuk mengontrol dropdown mana yang sedang terbuka
  const [openDropdown, setOpenDropdown] = useState(null);

  // Fungsi untuk toggle dropdown tertentu
  const toggleDropdown = (dropdownName) => {
    if (openDropdown === dropdownName) {
      setOpenDropdown(null); // Tutup dropdown jika sudah terbuka
    } else {
      setOpenDropdown(dropdownName); // Buka dropdown yang diklik
    }
  };

  return (
    <ul className="xl:flex space-x-12 text-white hidden">
      {/* menu beranda - tanpa dropdown */}
      <li>
        <Link to={"/dashboard"}>Beranda</Link>
      </li>

      {/* menu jadwal dropdown */}
      <li className="relative">
        <button
          className="flex items-center focus:outline-none cursor-pointer"
          onClick={() => toggleDropdown("jadwal")}
        >
          Jadwal
          <svg
            className={`w-4 h-4 ml-1 transition-transform duration-200 ${
              openDropdown === "jadwal" ? "rotate-180" : ""
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
        </button>

        {openDropdown === "jadwal" && (
          <div className="absolute mt-7 w-80 bg-primary-green rounded-md shadow-lg py-1 z-50 p-2">
            <h1 className="px-3 py-3">Jadwal</h1>
            {/* menu pengumuman */}
            <a
              href="#"
              className="px-3 py-3 border-b-1 border-[#6FCF97C9] text-sm hover:bg-[#6FCF97C9] hover:rounded-sm flex items-center justify-between group"
            >
              <div className="flex items-center gap-5">
                <img src="/img/icon_annon.png" alt="" className="w-6" />
                <div>
                  <p className="font-semibold">Pengumuman</p>
                  <p className="text-xs font-extralight text-gray-300">
                    Informasi Kegiatan Kampus
                  </p>
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
            </a>
            {/* menu kalender akademik */}
            <Link
              to="/schedule/calendar"
              className="px-3 py-3 border-b-1 border-[#6FCF97C9] text-sm hover:bg-[#6FCF97C9] hover:rounded-sm flex items-center justify-between group mt-3"
            >
              <div className="flex items-center gap-5">
                <img src="/img/icon_calendar.png" alt="" className="w-6" />
                <div>
                  <p className="font-semibold">Kalender Akademik</p>
                  <p className="text-xs font-extralight text-gray-300">
                    Periksa Kegiatan Perkuliahan
                  </p>
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
            {/* menu jadwal minggu ini */}
            <a
              href="#"
              className="px-3 py-3 border-b-1 border-[#6FCF97C9] text-sm hover:bg-[#6FCF97C9] hover:rounded-sm flex items-center justify-between group mt-3"
            >
              <div className="flex items-center gap-5">
                <img src="/img/icon_week.png" alt="" className="w-6" />
                <div>
                  <p className="font-semibold">Jadwal Minggu Ini</p>
                  <p className="text-xs font-extralight text-gray-300">
                    Aktivitas Seminggu Ke Depan
                  </p>
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
            </a>
            {/* menu jadwal semester */}
            <a
              href="#"
              className="px-3 py-3 text-sm hover:bg-[#6FCF97C9] hover:rounded-sm flex items-center justify-between group mt-3"
            >
              <div className="flex items-center gap-5">
                <img src="/img/icon_timetable.png" alt="" className="w-6" />
                <div>
                  <p className="font-semibold">Jadwal Semester</p>
                  <p className="text-xs font-extralight text-gray-300">
                    Kegiatan Anda Satu Semester
                  </p>
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
            </a>
          </div>
        )}
      </li>

      {/* menu akademik dropdown */}
      <li className="relative">
        <button
          className="flex items-center focus:outline-none cursor-pointer"
          onClick={() => toggleDropdown("akademik")}
        >
          Akademik
          <svg
            className={`w-4 h-4 ml-1 transition-transform duration-200 ${
              openDropdown === "akademik" ? "rotate-180" : ""
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
        </button>

        {openDropdown === "akademik" && (
          <div className="absolute mt-7 w-80 bg-primary-green rounded-md shadow-lg py-1 z-50 p-2">
            <h1 className="px-3 py-3">Akademik</h1>
            {/* menu Pengisian Kartu Rencana Studi */}
            <a
              href="#"
              className="px-3 py-3 border-b-1 border-[#6FCF97C9] text-sm hover:bg-[#6FCF97C9] hover:rounded-sm flex items-center justify-between group"
            >
              <div className="flex items-center gap-5">
                <img src="/img/icon_annon.png" alt="" className="w-6" />
                <div>
                  <p className="font-semibold">Pengisian Kartu Rencana Studi</p>
                  <p className="text-xs font-extralight text-gray-300">
                    Tentukan Rencana Kuliah
                  </p>
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
            </a>
            {/* menu Riwayat KRS */}
            <a
              href="#"
              className="px-3 py-3 border-b-1 border-[#6FCF97C9] text-sm hover:bg-[#6FCF97C9] hover:rounded-sm flex items-center justify-between group mt-3"
            >
              <div className="flex items-center gap-5">
                <img src="/img/icon_calendar.png" alt="" className="w-6" />
                <div>
                  <p className="font-semibold">Riwayat KRS</p>
                  <p className="text-xs font-extralight text-gray-300">
                    Rekap rencana kuliah Anda
                  </p>
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
            </a>
            {/* menu Mengulang */}
            <a
              href="#"
              className="px-3 py-3 text-sm hover:bg-[#6FCF97C9] hover:rounded-sm flex items-center justify-between group mt-3"
            >
              <div className="flex items-center gap-5">
                <img src="/img/icon_week.png" alt="" className="w-6" />
                <div>
                  <p className="font-semibold">Mengulang</p>
                  <p className="text-xs font-extralight text-gray-300">
                    History Perbaikan Mata Kuliah
                  </p>
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
            </a>
            {/* menu Nilai Mahasiswa */}
            <a
              href="#"
              className="px-3 py-3 text-sm hover:bg-[#6FCF97C9] hover:rounded-sm flex items-center justify-between group mt-3"
            >
              <div className="flex items-center gap-5">
                <img src="/img/icon_timetable.png" alt="" className="w-6" />
                <div>
                  <p className="font-semibold">Nilai Mahasiswa</p>
                  <p className="text-xs font-extralight text-gray-300">
                    Kualitas perkuliaha Anda
                  </p>
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
            </a>
          </div>
        )}
      </li>

      {/* menu tingkat akhir dropdown */}
      <li className="relative">
        <button
          className="flex items-center focus:outline-none cursor-pointer"
          onClick={() => toggleDropdown("tingkatAkhir")}
        >
          Tingkat Akhir
          <svg
            className={`w-4 h-4 ml-1 transition-transform duration-200 ${
              openDropdown === "tingkatAkhir" ? "rotate-180" : ""
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
        </button>

        {openDropdown === "tingkatAkhir" && (
          <div className="absolute mt-7 w-80 bg-primary-green rounded-md shadow-lg py-1 z-50 p-2">
            <h1 className="px-3 py-3">Tingkat Akhir</h1>
            {/* menu konsultasi */}
            <a
              href="#"
              className="px-3 py-3 border-b-1 border-[#6FCF97C9] text-sm hover:bg-[#6FCF97C9] hover:rounded-sm flex items-center justify-between group"
            >
              <div className="flex items-center gap-5">
                <img src="/img/icon_annon.png" alt="" className="w-6" />
                <div>
                  <p className="font-semibold">Konsultasi</p>
                  <p className="text-xs font-extralight text-gray-300">
                    Temukan solusi masalah Anda
                  </p>
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
            </a>
            {/* menu kegiatan pendukung */}
            <a
              href="#"
              className="px-3 py-3 border-b-1 border-[#6FCF97C9] text-sm hover:bg-[#6FCF97C9] hover:rounded-sm flex items-center justify-between group mt-3"
            >
              <div className="flex items-center gap-5">
                <img src="/img/icon_calendar.png" alt="" className="w-6" />
                <div>
                  <p className="font-semibold">Kegiatan Pendukung</p>
                  <p className="text-xs font-extralight text-gray-300">
                    Salurkan bakat Anda disini
                  </p>
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
            </a>
            {/* menu daftar proposal */}
            <a
              href="#"
              className="px-3 py-3 border-b-1 border-[#6FCF97C9] text-sm hover:bg-[#6FCF97C9] hover:rounded-sm flex items-center justify-between group mt-3"
            >
              <div className="flex items-center gap-5">
                <img src="/img/icon_week.png" alt="" className="w-6" />
                <div>
                  <p className="font-semibold">Daftar Proposal</p>
                  <p className="text-xs font-extralight text-gray-300">
                    Buat karya Anda sekarang juga
                  </p>
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
            </a>
            {/* menu daftar tugas akhir */}
            <a
              href="#"
              className="px-3 py-3 border-b-1 border-[#6FCF97C9] text-sm hover:bg-[#6FCF97C9] hover:rounded-sm flex items-center justify-between group mt-3"
            >
              <div className="flex items-center gap-5">
                <img src="/img/icon_week.png" alt="" className="w-6" />
                <div>
                  <p className="font-semibold">Daftar Tugas Akhir</p>
                  <p className="text-xs font-extralight text-gray-300">
                    Selesaikan karya Anda saat ini
                  </p>
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
            </a>
            {/* menu pengajuan yudisium */}
            <a
              href="#"
              className="px-3 py-3 border-b-1 border-[#6FCF97C9] text-sm hover:bg-[#6FCF97C9] hover:rounded-sm flex items-center justify-between group mt-3"
            >
              <div className="flex items-center gap-5">
                <img src="/img/icon_week.png" alt="" className="w-6" />
                <div>
                  <p className="font-semibold">Pengajuan Yudisium</p>
                  <p className="text-xs font-extralight text-gray-300">
                    Konfirmasi hasil studi Anda
                  </p>
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
            </a>
            {/* menu pengajuan wisuda */}
            <a
              href="#"
              className="px-3 py-3 text-sm hover:bg-[#6FCF97C9] hover:rounded-sm flex items-center justify-between group mt-3"
            >
              <div className="flex items-center gap-5">
                <img src="/img/icon_timetable.png" alt="" className="w-6" />
                <div>
                  <p className="font-semibold">Pengajuan Wisuda</p>
                  <p className="text-xs font-extralight text-gray-300">
                    Konfirmasi kehadiran Anda
                  </p>
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
            </a>
          </div>
        )}
      </li>

      {/* menu hasil studi dropdown */}
      <li className="relative">
        <button
          className="flex items-center focus:outline-none cursor-pointer"
          onClick={() => toggleDropdown("hasilStudi")}
        >
          Hasil Studi
          <svg
            className={`w-4 h-4 ml-1 transition-transform duration-200 ${
              openDropdown === "hasilStudi" ? "rotate-180" : ""
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
        </button>

        {openDropdown === "hasilStudi" && (
          <div className="absolute mt-7 w-80 bg-primary-green rounded-md shadow-lg py-1 z-50 p-2">
            <h1 className="px-3 py-3">Hasil Studi</h1>
            <a
              href="#"
              className="px-3 py-3 border-b-1 border-[#6FCF97C9] text-sm hover:bg-[#6FCF97C9] hover:rounded-sm flex items-center justify-between group"
            >
              <div className="flex items-center gap-5">
                <img src="/img/icon_annon.png" alt="" className="w-6" />
                <div>
                  <p className="font-semibold">Kartu Hasil Studi</p>
                  <p className="text-xs font-extralight text-gray-300">
                    Laporan Priode Anda
                  </p>
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
            </a>
            {/* menu transkip */}
            <a
              href="#"
              className="px-3 py-3  text-sm hover:bg-[#6FCF97C9] hover:rounded-sm flex items-center justify-between group mt-3"
            >
              <div className="flex items-center gap-5">
                <img src="/img/icon_timetable.png" alt="" className="w-6" />
                <div>
                  <p className="font-semibold">Transkrip</p>
                  <p className="text-xs font-extralight text-gray-300">
                    Hasil Perkuliahan Anda
                  </p>
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
            </a>
          </div>
        )}
      </li>

      {/* menu keuangan dropdown */}
      <li className="relative">
        <button
          className="flex items-center focus:outline-none cursor-pointer"
          onClick={() => toggleDropdown("keuangan")}
        >
          Keuangan
          <svg
            className={`w-4 h-4 ml-1 transition-transform duration-200 ${
              openDropdown === "keuangan" ? "rotate-180" : ""
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
        </button>

        {openDropdown === "keuangan" && (
          <div className="absolute mt-7 w-80 bg-primary-green rounded-md shadow-lg py-1 z-50 p-2">
            <h1 className="px-3 py-3">Keuangan</h1>
            {/* menu tagihan mahasiswa */}
            <a
              href="#"
              className="px-3 py-3 border-b-1 border-[#6FCF97C9] text-sm hover:bg-[#6FCF97C9] hover:rounded-sm flex items-center justify-between group"
            >
              <div className="flex items-center gap-5">
                <img src="/img/icon_annon.png" alt="" className="w-6" />
                <div>
                  <p className="font-semibold">Tagihan Mahasiswa</p>
                  <p className="text-xs font-extralight text-gray-300">
                    Biaya Operasional Pendidikan
                  </p>
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
            </a>
            {/* riwayat keuangan */}
            <a
              href="#"
              className="px-3 py-3 text-sm hover:bg-[#6FCF97C9] hover:rounded-sm flex items-center justify-between group mt-3"
            >
              <div className="flex items-center gap-5">
                <img src="/img/icon_timetable.png" alt="" className="w-6" />
                <div>
                  <p className="font-semibold">Riwayat Keuangan</p>
                  <p className="text-xs font-extralight text-gray-300">
                    Riwayat BOP
                  </p>
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
            </a>
          </div>
        )}
      </li>
    </ul>
  );
};

export default Navbar;
