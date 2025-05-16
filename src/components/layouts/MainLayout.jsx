import React from "react";
import {useState, useEffect} from "react";
import Navbar from "../Navbar";
import Breadcrumb from "../Breadcrumb";
import Header from "../Header";

export default function MainLayout({
  children,
  isGreeting = false,
  titlePage,
}) {
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
  return (
    <div className="bg-primary-white min-h-screen">
      <Header />
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
