import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Breadcrumb from "../Breadcrumb";
import Header from "../Header/Header";
import HeaderAdminAcademic from "../Header/HeaderAdminAcademic";
import HeaderAdminFinance from "../Header/HeaderAdminFinance";
import HeaderLecturer from "../Header/HeaderLecturer";
import React from "react";

interface MainLayout {
  children: React.ReactNode;
  isGreeting: boolean;
  titlePage: string;
  className?: string;
  headerRole?: "student" | "lecturer" | "adminAcademic" | "adminFinance";
}

export default function MainLayout({
  children,
  isGreeting,
  titlePage,
  className,
  headerRole = "student",
}: MainLayout) {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
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
  }, []);

  // Fungsi render header berdasarkan role
  const renderHeader = () => {
    switch (headerRole) {
      case "lecturer":
        return <HeaderLecturer />;
      case "adminAcademic":
        return <HeaderAdminAcademic />;
      case "adminFinance":
        return <HeaderAdminFinance />;
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
