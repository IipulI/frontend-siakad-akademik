import React from "react";
import Logo from "../../public/img/logo_uika.png";
import ProfileLogo from "../../public/img/profile_logo.png";

const Navbar = () => {
  return (
    <div className="bg-primary-green text-white py-4 w-full">
      <div className="container mx-auto max-w-6xl">
        <div className="w-full py-2">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <img
                className="bg-white p-1 rounded-lg"
                width={50}
                src={Logo}
                alt=""
              />
              <div>
                <h1>SIM Akademik</h1>
                <h1 className="font-semibold text-md">
                  Universitan Ibn Khaldun
                </h1>
              </div>
            </div>
            <div className="">
              <div className="hidden md:flex space-x-4 items-center">
                <h1>Bel</h1>
                <img className="rounded-full" width={30} src={ProfileLogo} />
              </div>
              <div className="md:hidden block">
                <button onClick={() => alert("Clicked")}>Hamburger</button>
              </div>
            </div>
          </div>
        </div>
        <ul className="md:flex hidden space-x-12 text-white">
          <li>Beranda</li>
          <li>Jadwal</li>
          <li>Akademik</li>
          <li>Tingkat Akhir</li>
          <li>Hasil Studi</li>
          <li>Keuangan</li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
