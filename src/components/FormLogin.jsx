import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function FormLogin() {
  const [npm, setNPM] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submitHandler = () => {
    navigate("/dashboard");
  };

  return (
    <form className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <div className="flex items-center justify-center gap-5 mb-4">
          <img src="/img/logo_uika.png" alt="Logo" className="w-8 md:w-9" />
          <h2 className="text-2xl md:text-3xl font-bold text-[#198754]">
            S I A K A D
          </h2>
        </div>

        <p className="text-[11px] md:text-sm text-[#198754] mb-3 font-semibold">
          Sistem Informasi Akademik dan Keuangan
        </p>
        <p className="text-[11px] md:text-sm text-gray-800 mb-3">
          Untuk mengakses, dipersilahkan untuk login terlebih dahulu.
        </p>
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="NPM"
            onChange={(e) => setNPM(e.target.value)}
            className="w-full p-3 bg-[#DDDDDD] rounded-2xl focus:ring-2 focus:ring-green-500 focus:outline-none text-[11px] md:text-sm"
          />
        </div>
        <div className="mb-4 relative">
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-[#DDDDDD] rounded-2xl focus:ring-2 focus:ring-green-500 focus:outline-none text-[11px] md:text-sm"
          />
        </div>
        <div className="flex items-center justify-between text-sm mb-4">
          <label className="flex items-center space-x-2 text-gray-500 text-[11px]">
            <input type="checkbox" className="form-checkbox text-green-600" />
            <span>Ingat Saya</span>
          </label>
          <a href="#" className="text-green-600 hover:underline text-[11px]">
            Lupa Password?
          </a>
        </div>
        <button
          onClick={submitHandler}
          className="w-full cursor-pointer bg-green-700 text-white p-2 text-sm rounded-lg hover:bg-green-800 transition"
        >
          Login
        </button>
      </div>
    </form>
  );
}
