import React from "react";
import FormLogin from "../components/FormLogin";
import background_uika from "../../public/img/bg_uika.png";

export default function LoginPage() {
  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <img
        src={background_uika}
        alt=""
        className="absolute w-full h-full -z-10 filter brightness-50 object-cover"
      />

      <div className="">
        <FormLogin />
      </div>
    </div>
  );
}
