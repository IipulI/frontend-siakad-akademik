import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Search, User } from "lucide-react";

export default function FormLogin() {
  const [npm, setNPM] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(""); // ✅ Tambahan untuk error umum
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    const newErrors = {};
    let generalError = "";

    if (!npm) newErrors.npm = "NPM tidak boleh kosong";
    if (!password) newErrors.password = "Password tidak boleh kosong";
    if (!captcha) newErrors.captcha = "Captcha tidak boleh kosong";

    if (!npm || !password) {
      generalError = "Akun Pengguna dan Password harus diisi";
    }

    setErrors(newErrors);
    setFormError(generalError);

    if (Object.keys(newErrors).length === 0) {
      setFormError(""); // Hapus error umum jika sukses
      navigate("/dashboard");
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: 'url("/img/background_uika.jpg")' }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl w-full">
        {/* Kiri */}
        <div className="text-white mb-10 md:mb-0 md:w-1/2 px-4 md:px-10">
          <img src="/img/logo_uika.png" className="w-20 mb-4" alt="Logo" />
          <h1 className="text-6xl font-bold tracking-widest mb-2">
            SIAKAD <span className="text-orange-400">UIKA</span>
          </h1>
          <p className="text-md leading-relaxed">
            Sistem informasi{" "}
            <span className="text-orange-400">
              Akademik, Penelitian, dan Pengabdian Masyarakat
            </span>
            ,<br />
            untuk Mendukung Tercapainya Universitas Kelas Dunia yang Berakar
            Kuat dan Menjulang Tinggi
          </p>
        </div>

        {/* Kanan (Form) */}
        <form
          onSubmit={submitHandler}
          className="bg-white rounded-3xl shadow-lg p-8 md:p-10 w-full max-w-md"
        >
          <h2 className="text-xl font-bold text-center mb-2">SIGN IN</h2>
          <p className="text-sm text-center text-gray-600 mb-5">
            Untuk Mengakses <br /> dipersilahkan untuk login terlebih dahulu.
          </p>

          {/* ✅ Error Umum */}
          {formError && (
            <div className="bg-red-100 text-red-800 text-sm px-4 py-2 rounded-xl mb-4 border border-red-300 flex items-center justify-between">
              <span>{formError}</span>
              <button
                type="button" 
                onClick={() => setFormError("")}
                className="text-red-500 ml-4 hover:text-red-700 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          <button
            type="button"
            className="flex items-center justify-center gap-2 w-full border rounded-xl py-2 mb-4 text-sm text-gray-600 hover:bg-gray-100 transition"
          >
            <img src="/img/google_logo.png" className="w-4 h-4" alt="Google" />
            Google
          </button>

          <div className="text-center text-gray-400 text-xs mb-4">
            atau lanjutkan dengan
          </div>

          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="NPM"
              value={npm}
              onChange={(e) => setNPM(e.target.value)}
              className={`w-full bg-gray-200 p-3 pr-10 rounded-xl text-sm focus:outline-none focus:ring-2 ${
                errors.npm ? "focus:ring-red-500" : "focus:ring-green-500"
              }`}
            />
            <User className="absolute right-3 top-3 text-green-700" size={18} />
            {errors.npm && (
              <p className="text-red-500 text-xs mt-1">{errors.npm}</p>
            )}
          </div>

          <div className="mb-4 relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-gray-200 p-3 pr-10 rounded-xl text-sm focus:outline-none focus:ring-2 ${
                errors.password ? "focus:ring-red-500" : "focus:ring-green-500"
              }`}
            />
            <Lock className="absolute right-3 top-3 text-green-700" size={18} />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="mb-4">
            <img src="/img/captcha.png" alt="Captcha" className="rounded-md" />
          </div>

          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Masukan kode diatas"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
              className={`w-full bg-gray-200 p-3 pr-10 rounded-xl text-sm focus:outline-none focus:ring-2 ${
                errors.captcha ? "focus:ring-red-500" : "focus:ring-green-500"
              }`}
            />
            <Search
              className="absolute right-3 top-3 text-green-700"
              size={18}
            />
            {errors.captcha && (
              <p className="text-red-500 text-xs mt-1">{errors.captcha}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-green-700" />
              <span>Ingat Saya</span>
            </label>
            <a href="#" className="text-green-700 hover:underline">
              Lupa Password?
            </a>
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-xl font-semibold transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
