import { useEffect, useState } from "react";
import Breadcrumb from "../Breadcrumb";
import Header from "../Header/Header";
import HeaderAdminAcademic from "../Header/HeaderAdminAcademic";
import HeaderAdminFinance from "../Header/HeaderAdminFinance";
import HeaderLecturer from "../Header/HeaderLecturer";
import React from "react";
import { useNavigate } from "react-router-dom";

interface MainLayout {
  children: React.ReactNode;
  isGreeting: boolean;
  titlePage: string;
  className?: string;
}

export default function MainLayout({
  children,
  isGreeting,
  titlePage,
  className,
}: MainLayout) {
  const [greeting, setGreeting] = useState("");
  const [userRole, setUserRole] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const hour = new Date().getHours();
    let message = ""; 
    
    const user = localStorage.getItem("user");
    if (user) {
      const userRole = JSON.parse(user).roles[0];
      setUserRole(userRole);
    } else {
      navigate("/");
    }

    if (hour >= 6 && hour <= 11) {
      message = "Selamat Pagi";
    } else if (hour >= 12 && hour <= 14) {
      message = "Selamat Siang";
    } else if (hour >= 15 && hour <= 17) {
      message = "Selamat Sore";
    } else {
      message = "Selamat Malam";
    }
    setGreeting(message);
  }, []);

  const renderHeader = () => {
    switch (userRole) {
      case "AKADEMIK_UNIV":
        return <HeaderAdminAcademic />;
      case "KEUANGAN_UNIV":
        return <HeaderAdminFinance />;
      case "DOSEN":
        return <HeaderLecturer />;
      default:
        return <Header />;
    }
  };

  return (
    <div className={`bg-primary-white min-h-screen ${className}`}>
      {renderHeader()}
      <div className="px-5 md:px-10 xl:px-40">
        {isGreeting ? (
          <div className="md:text-2xl text-lg md:justify-start justify-center flex py-4">
            <h1>{greeting},&nbsp;</h1>
            <h1 className="text-gray-text font-semibold">Someone</h1>
          </div>
        ) : (
          <div className="py-4">
            <Breadcrumb />
            <div className="text-2xl flex">
              <h1 className="text-gray-text font-semibold">{titlePage}</h1>
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
