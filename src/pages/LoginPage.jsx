import React from "react";
import FormLogin from "../components/FormLogin";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <img
        src="/img/background_login.png"
        alt=""
        className="absolute w-full h-full -z-10 filter brightness-50 object-cover"
      />

      <div className="">
        <FormLogin />
      </div>
    </div>
  );
}
