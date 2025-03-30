import React, { useState } from "react";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({
    jadwal: false,
    akademik: false,
    tingkatAkhir: false,
    hasilStudi: false,
    keuangan: false,
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Reset all dropdowns when closing the menu
    if (isOpen) {
      setOpenDropdowns({
        jadwal: false,
        akademik: false,
        tingkatAkhir: false,
        hasilStudi: false,
        keuangan: false,
      });
    }
    // Prevent scrolling on body when menu is open
    document.body.style.overflow = isOpen ? "auto" : "hidden";
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="flex flex-col justify-center items-center cursor-pointer w-10 h-10 xl:hidden focus:outline-none transition-all duration-300 border-1 shadow-sm
          "
        aria-label="Menu"
      >
        <span
          className={`block w-6 h-0.5 bg-white transition-transform mb-1.5`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-white transition-opacity mb-1.5`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-white transition-transform`}
        ></span>
      </button>

      {/* Fullscreen Menu */}
      <div
        className={`fixed inset-0 bg-white flex flex-col items-start z-40 transition-all duration-300 pt-6.5 px-5 md:px-10 overflow-y-auto xl:hidden ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none -translate-y-50"
        }`}
      >
        {/* close button */}
        <button
          onClick={toggleMenu}
          className="flex flex-col justify-center cursor-pointer items-center w-10 h-10 xl:hidden focus:outline-none transition-all duration-300
          "
          aria-label="Menu"
        >
          <span
            className={`block w-6 h-0.5 bg-black transition-transform transform rotate-45 translate-y-1`}
          ></span>
          <span className={`block w-6 h-0.5 bg-black opacity-0 mb-1`}></span>
          <span
            className={`block w-6 h-0.5 bg-black transition-transform transform -rotate-45 -translate-y-1
            `}
          ></span>
        </button>

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
            {/* Beranda - No dropdown */}
            <li className="py-4 border-b border-gray-200 ">
              <a
                href="/dashboard"
                className="flex justify-between items-center"
                onClick={() => toggleMenu()}
              >
                <span className="font-medium">Beranda</span>
              </a>
            </li>

            {/* Jadwal - With dropdown */}
            <li className="border-b border-gray-200">
              <div
                className="py-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleDropdown("jadwal")}
              >
                <span className="font-medium">Jadwal</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform duration-300 ${
                    openDropdowns.jadwal ? "transform rotate-180" : ""
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
              {openDropdowns.jadwal && (
                <ul className="ml-4 mb-3 space-y-2 text-gray-600">
                  {/* menu pengumuman */}
                  <li>
                    <a
                      href="#"
                      className="px-3 py-3 text-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src="/img/icon_annon.png"
                          alt=""
                          className="w-6 invert"
                        />
                        <div>
                          <p>Pengumuman</p>
                          <p className="text-xs font-extralight">
                            Informasi Kegiatan Kampus
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  {/* menu kalender akademik */}
                  <li>
                    <a
                      href="#"
                      className="px-3 py-3 text-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src="/img/icon_calendar.png"
                          alt=""
                          className="w-6 invert"
                        />
                        <div>
                          <p>Kalender Akademik</p>
                          <p className="text-xs font-extralight">
                            Periksa Kegiatan Perkuliahan
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  {/* menu jadwal minggu ini */}
                  <li>
                    <a
                      href="#"
                      className="px-3 py-3 text-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src="/img/icon_week.png"
                          alt=""
                          className="w-6 invert"
                        />
                        <div>
                          <p>Jadwal Minggu Ini</p>
                          <p className="text-xs font-extralight">
                            Aktifitas Seminggu Ke Depan
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  {/* menu jadwal semester */}
                  <li>
                    <a
                      href="#"
                      className="px-3 py-3 text-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src="/img/icon_timetable.png"
                          alt=""
                          className="w-6 invert"
                        />
                        <div>
                          <p>Jadwal Semester</p>
                          <p className="text-xs font-extralight">
                            Kegiatan Anda Satu Semester
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Akademik - With dropdown */}
            <li className="border-b border-gray-200">
              <div
                className="py-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleDropdown("akademik")}
              >
                <span className="font-medium">Akademik</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform duration-300 ${
                    openDropdowns.akademik ? "transform rotate-180" : ""
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
              {openDropdowns.akademik && (
                <ul className="ml-4 mb-3 space-y-2 text-gray-600">
                  {/* menu pengisian krs */}
                  <li>
                    <a
                      href="#"
                      className="px-3 py-3 text-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src="/img/icon_annon.png"
                          alt=""
                          className="w-6 invert"
                        />
                        <div>
                          <p>Pengisisan Kartu Rencana Studi</p>
                          <p className="text-xs font-extralight">
                            Tentukan Rencana Kuliah
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  {/* menu riwayat krs */}
                  <li>
                    <a
                      href="#"
                      className="px-3 py-3 text-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src="/img/icon_calendar.png"
                          alt=""
                          className="w-6 invert"
                        />
                        <div>
                          <p>Riwayat KRS</p>
                          <p className="text-xs font-extralight">
                            Rekap Rencana Kuliah Anda
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  {/* menu mengulang */}
                  <li>
                    <a
                      href="#"
                      className="px-3 py-3 text-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src="/img/icon_week.png"
                          alt=""
                          className="w-6 invert"
                        />
                        <div>
                          <p>Mengulang</p>
                          <p className="text-xs font-extralight">
                            History Perbaikan Mata Kuliah
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  {/* menu nilai mahasiswa */}
                  <li>
                    <a
                      href="#"
                      className="px-3 py-3 text-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src="/img/icon_timetable.png"
                          alt=""
                          className="w-6 invert"
                        />
                        <div>
                          <p>Nilai Mahasiswa</p>
                          <p className="text-xs font-extralight">
                            Kualitas Perkuliahan Anda
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Tingkat Akhir - With dropdown */}
            <li className="border-b border-gray-200">
              <div
                className="py-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleDropdown("tingkatAkhir")}
              >
                <span className="font-medium">Tingkat Akhir</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform duration-300 ${
                    openDropdowns.tingkatAkhir ? "transform rotate-180" : ""
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
              {openDropdowns.tingkatAkhir && (
                <ul className="ml-4 mb-3 space-y-2 text-gray-600">
                  {/* menu konsultasi */}
                  <li>
                    <a
                      href="#"
                      className="px-3 py-3 text-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src="/img/icon_annon.png"
                          alt=""
                          className="w-6 invert"
                        />
                        <div>
                          <p>Konsultasi</p>
                          <p className="text-xs font-extralight">
                            Temukan Solusi Masalah Anda
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  {/* menu kegiatan pendukung */}
                  <li>
                    <a
                      href="#"
                      className="px-3 py-3 text-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src="/img/icon_calendar.png"
                          alt=""
                          className="w-6 invert"
                        />
                        <div>
                          <p>Kegiatan Pendukung</p>
                          <p className="text-xs font-extralight">
                            Salurkan Bakat Anda Disini
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  {/* menu daftar proposal */}
                  <li>
                    <a
                      href="#"
                      className="px-3 py-3 text-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src="/img/icon_week.png"
                          alt=""
                          className="w-6 invert"
                        />
                        <div>
                          <p>Daftar proposal</p>
                          <p className="text-xs font-extralight">
                            Buat Karya Anda Sekarang Juga
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  {/* menu daftar tugas akhir */}
                  <li>
                    <a
                      href="#"
                      className="px-3 py-3 text-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src="/img/icon_week.png"
                          alt=""
                          className="w-6 invert"
                        />
                        <div>
                          <p>Daftar Tugas Akhir</p>
                          <p className="text-xs font-extralight">
                            Selesaikan Karya Anda Saat Ini
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  {/* menu pengajuan yudisium */}
                  <li>
                    <a
                      href="#"
                      className="px-3 py-3 text-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src="/img/icon_week.png"
                          alt=""
                          className="w-6 invert"
                        />
                        <div>
                          <p>Pengajuan Yudisium</p>
                          <p className="text-xs font-extralight">
                            Konfirmasi Hasil Studi Anda
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  {/* menu pengajuan wisuda */}
                  <li>
                    <a
                      href="#"
                      className="px-3 py-3 text-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src="/img/icon_timetable.png"
                          alt=""
                          className="w-6 invert"
                        />
                        <div>
                          <p>Pengajuan Wisuda</p>
                          <p className="text-xs font-extralight">
                            Konfirmasi Kehadiran Anda
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Hasil Studi - With dropdown */}
            <li className="border-b border-gray-200">
              <div
                className="py-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleDropdown("hasilStudi")}
              >
                <span className="font-medium">Hasil Studi</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform duration-300 ${
                    openDropdowns.hasilStudi ? "transform rotate-180" : ""
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
              {openDropdowns.hasilStudi && (
                <ul className="ml-4 mb-3 space-y-2 text-gray-600">
                  {/* menu kartu hasil studi */}
                  <li>
                    <a
                      href="#"
                      className="px-3 py-3 text-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src="/img/icon_annon.png"
                          alt=""
                          className="w-6 invert"
                        />
                        <div>
                          <p>Kartu Hasil Studi</p>
                          <p className="text-xs font-extralight">
                            Laporan Priode Anda
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  {/* menu transkip */}
                  <li>
                    <a
                      href="#"
                      className="px-3 py-3 text-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src="/img/icon_timetable.png"
                          alt=""
                          className="w-6 invert"
                        />
                        <div>
                          <p>Transkip</p>
                          <p className="text-xs font-extralight">
                            Hasil Perkuliahan Anda
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Keuangan - With dropdown */}
            <li className="border-b border-gray-200">
              <div
                className="py-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleDropdown("keuangan")}
              >
                <span className="font-medium">Keuangan</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform duration-300 ${
                    openDropdowns.keuangan ? "transform rotate-180" : ""
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
              {openDropdowns.keuangan && (
                <ul className="ml-4 mb-3 space-y-2 text-gray-600">
                  {/* menu tagihan mahasiswa */}
                  <li>
                    <a
                      href="#"
                      className="px-3 py-3 text-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src="/img/icon_annon.png"
                          alt=""
                          className="w-6 invert"
                        />
                        <div>
                          <p>Tagihan Mahasiswa</p>
                          <p className="text-xs font-extralight">
                            Biaya Operasional Pendidikan
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  {/* menu riwayat keuangan*/}
                  <li>
                    <a
                      href="#"
                      className="px-3 py-3 text-sm flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-5">
                        <img
                          src="/img/icon_timetable.png"
                          alt=""
                          className="w-6 invert"
                        />
                        <div>
                          <p>Riwayat Keuangan</p>
                          <p className="text-xs font-extralight">Riwayat BOP</p>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default HamburgerMenu;
