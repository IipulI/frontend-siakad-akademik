import React from 'react';
import ProfileLogo from "../../public/img/profile_logo.png";
import Navbar from "./Navbar";
import HamburgerMenu from "./HamburgerMenu";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";

const Header = () => {
  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex">
        <div className="flex bg-primary-green w-full rounded-tr-full py-4 px-5 md:px-10 xl:px-40">
          <div>
            <div>
              <div>
                <div className="flex items-center gap-4">
                  {/* menu hamburger */}
                  <HamburgerMenu />
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
                      <h1 className="text-sm xl:text-base font-semibold">Universitan Ibn Khaldun</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" bg-primary-yellow w-1/2 rounded-bl-full flex justify-center items-center relative">
          {/* aksesoris navbar */}
          <img src="/img/aksesoris_navbar.png" alt="" className="absolute h-full right-0"/>
          <div className="flex space-x-5 items-center">
            <Bell size={30} color="#fff" />
            <Link to={"/profile"}>
              <img width={30} src={ProfileLogo} className="rounded-full" />
            </Link>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Header;
