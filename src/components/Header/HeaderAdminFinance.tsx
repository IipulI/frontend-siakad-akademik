import Navbar from "../Navbar";
import HamburgerMenu from "../HamburgerMenu";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
<<<<<<< HEAD
import { AdminFinanceRoute } from "../../types/VarRoutes";
=======
import React from "react";
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446

// Define navigation items
const navItems = [
  {
    id: "1",
    name: "Beranda",
<<<<<<< HEAD
    path: String(AdminFinanceRoute.dashboardAdminFinance),
=======
    path: "",
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
    hasDropdown: false,
  },
  {
    id: "2",
    name: "Buat Tagihan",
<<<<<<< HEAD
    path: String(AdminFinanceRoute.createBill),
=======
    path: "",
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
    hasDropdown: false,
  },
  {
    id: "1",
    name: "Tagihan Mahasiswa",
<<<<<<< HEAD
    path: String(AdminFinanceRoute.studentBill),
=======
    path: "",
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
    hasDropdown: false,
  },
  {
    id: "1",
    name: "Komponen Tagihan",
<<<<<<< HEAD
    path: String(AdminFinanceRoute.componentBill),
=======
    path: "",
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
    hasDropdown: false,
  },
];

const HeaderAdminFinance = () => {
  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex">
        <div className="flex bg-primary-green w-full rounded-tr-full py-4 px-5 md:px-10 xl:px-40">
          <div>
            <div>
              <div>
                <div className="flex items-center gap-4">
                  {/* menu hamburger */}
                  <HamburgerMenu navItems={navItems} dropdownMenus={{}} />
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
            <Link to="">
              <img
                width={30}
                src="/img/profile_logo.png"
                className="rounded-full"
              />
            </Link>
          </div>
        </div>
      </div>
      <Navbar navItems={navItems} dropdownMenus={{}} />
    </div>
  );
};

export default HeaderAdminFinance;
