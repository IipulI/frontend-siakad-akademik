import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../Breadcrumb";
import Header from "../Header/Header";
import HeaderAdminAcademic from "../Header/HeaderAdminAcademic";
import HeaderAdminFinance from "../Header/HeaderAdminFinance";
import HeaderLecturer from "../Header/HeaderLecturer";

interface MainLayoutProps {
  // Renamed for clarity, a common convention
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
}: MainLayoutProps) {
  const [greeting, setGreeting] = useState("");
  const [userRole, setUserRole] = useState<string>("");
  // 1. Add state for the user's name
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve both user and account info from localStorage
    const userString = localStorage.getItem("user");
    const accountInfoString = localStorage.getItem("account_info");

    // Check if user exists before proceeding
    if (userString) {
      const user = JSON.parse(userString);
      setUserRole(user.roles[0]);

      if (accountInfoString) {
        const accountInfo = JSON.parse(accountInfoString);
        setUserName(accountInfo.nama);
      } else {
        // Fallback to username if account_info is missing (e.g. for academic admin / admin prodi)
        setUserName(user.username);
      }
    } else {
      // If essential data is missing, redirect to login
      navigate("/");
    }

    // --- Greeting Logic (unchanged) ---
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

    // Add navigate to the dependency array as it's an external function used inside the effect
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
      <div className="px-5 md:px-10 xl:px-40">
        {isGreeting ? (
          <div className="md:text-2xl text-lg md:justify-start justify-center flex py-4">
            <h1>{greeting},&nbsp;</h1>
            {/* 3. Render the userName state variable instead of the hardcoded string */}
            <h1 className="text-gray-text font-semibold">{userName}</h1>
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
