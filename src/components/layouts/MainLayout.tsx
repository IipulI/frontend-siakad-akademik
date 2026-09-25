import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../Breadcrumb";
import Header from "../Header/Header";
import HeaderAdminAcademic from "../Header/HeaderAdminAcademic";
import HeaderAdminFinance from "../Header/HeaderAdminFinance";
import HeaderLecturer from "../Header/HeaderLecturer";

interface MainLayoutProps {
  children: React.ReactNode;
  isGreeting: boolean;
  titlePage: string;
  subTitle?: string;
  className?: string;
}

export default function MainLayout({
  children,
  isGreeting,
  titlePage,
  subTitle,
  className = "",
}: MainLayoutProps) {
  const [greeting, setGreeting] = useState("");
  const [userRole, setUserRole] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const accountInfoString = localStorage.getItem("account_info");

    if (userString) {
      const user = JSON.parse(userString);
      setUserRole(user.roles[0]);

      if (accountInfoString) {
        const accountInfo = JSON.parse(accountInfoString);
        setUserName(accountInfo.nama);
      } else {
        setUserName(user.username);
      }
    } else {
      navigate("/");
    }

    const hour = new Date().getHours();
    let message = "";
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
  }, [navigate]);

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
      <div className="px-4 sm:px-6 md:px-8 xl:px-12 max-w-[1780px] mx-auto pb-10">
        {isGreeting ? (
          <div className="md:text-2xl text-lg md:justify-start justify-center flex py-4">
            <h1 className="text-slate-600">{greeting},&nbsp;</h1>
            <h1 className="text-slate-800 font-bold">{userName}</h1>
          </div>
        ) : (
          <div className="py-3 sm:py-4">
            <Breadcrumb />
            <div className="mt-2 flex items-baseline gap-3">
              <h1 className="text-slate-800 font-bold text-xl md:text-2xl tracking-tight">
                {titlePage}
              </h1>
              {subTitle && (
                <span className="text-xs md:text-sm font-medium text-slate-400">
                  {subTitle}
                </span>
              )}
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
