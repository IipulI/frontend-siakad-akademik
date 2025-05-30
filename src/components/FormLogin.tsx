// src/components/FormLogin.tsx
import React, { useState, useCallback } from "react"; // Added useCallback
import { useNavigate } from "react-router-dom";
// useMutation will be removed from here
import { Lock, User } from "lucide-react";
// Api will be removed if only used by the hook
import Swal from "sweetalert2";
import {
  AdminFinanceRoute,
  StudentRoute,
  AdminAcademicRoute,
  LecturerRoute,
} from "../types/VarRoutes";

import { useCaptcha, UseCaptchaReturn } from "../hooks/useCaptcha"; // Adjust path
import CaptchaChallenge from "./CaptchaChallenge"; // Adjust path
import { useAuthLogin, UserLoginData } from "../hooks/useAuthLogin"; // Adjust path

interface FormErrors {
  username?: string;
  password?: string;
}

export default function FormLogin() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string>(""); // For general form error message
  const navigate = useNavigate();

  const {
    isCaptchaVerified,
    isCaptchaLoading,
    isVerifying,
    elementInternals,
    messageInfo,
    triggerReload: reloadCaptchaHook,
    triggerResetAndReload: resetAndReloadCaptchaHook,
  }: UseCaptchaReturn = useCaptcha();

  // Define onSuccess handler for the auth hook
  const handleLoginSuccess = useCallback((data: UserLoginData) => {
    const role = data.user.roles[0];
    Swal.fire({
      title: "Login Berhasil",
      text: "Anda akan diarahkan ke Dashboard...",
      icon: "success",
      showConfirmButton: false,
      timer: 1000,
    }).then(() => {
      if (role === "MAHASISWA") {
        navigate(StudentRoute.dashboard);
      } else if (role === "DOSEN") {
        navigate(LecturerRoute.dashboard);
      } else if (
          role === "AKADEMIK_UNIV" ||
          role === "AKADEMIK_FAK" ||
          role === "AKADEMIK_PRODI"
      ) {
        navigate(AdminAcademicRoute.dashboardAdminAcademic);
      } else if (
          role === "KEUANGAN_UNIV" ||
          role === "KEUANGAN_FAK" ||
          role === "KEUANGAN_PRODI"
      ) {
        navigate(AdminFinanceRoute.dashboardAdminFinance);
      }
    });
  }, [navigate]); // Add any other stable dependencies if necessary

  // Define onError handler for the auth hook
  const handleLoginError = useCallback((error: Error) => { // Use Error type from the hook
    setFormError(error.message || "Login gagal, periksa kembali akun Anda");
    // console.error is already handled in the hook, but you can add more specific logging here if needed
    resetAndReloadCaptchaHook();
  }, [resetAndReloadCaptchaHook]); // setFormError is stable

  const { login, isLoggingIn } = useAuthLogin({
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
  });

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    let generalError = ""; // This will be set by handleLoginError now for API errors

    setFormError(""); // Clear previous general errors
    setErrors({});    // Clear previous field errors

    if (!username) newErrors.username = "Username tidak boleh kosong";
    if (!password) newErrors.password = "Password tidak boleh kosong";

    if (!username || !password) {
      // Set general error only if fields are empty, API error handled by hook's onError
      if (Object.keys(newErrors).length > 0) {
        generalError = "Akun Pengguna dan Password harus diisi";
      }
    }

    if (!isCaptchaVerified) {
      generalError = "Harap selesaikan CAPTCHA terlebih dahulu.";
    }

    if (Object.keys(newErrors).length > 0 || generalError) {
      setErrors(newErrors);
      setFormError(generalError);
      return;
    }

    // If all client-side checks pass, attempt login
    login({ username, password });
  };

  return (
      <div
          className="min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4"
          style={{ backgroundImage: 'url("/img/background_uika.jpg")' }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl w-full">
          {/* Informational Side */}
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

          {/* Login Form */}
          <form
              onSubmit={submitHandler}
              className="bg-white rounded-3xl shadow-lg p-8 md:p-10 w-full max-w-lg"
          >
            <h2 className="text-xl font-bold text-center mb-2">SIGN IN</h2>
            <p className="text-sm text-center text-gray-600 mb-5">
              Untuk Mengakses <br /> dipersilahkan untuk login terlebih dahulu.
            </p>

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

            {/* Google Sign-in and 'atau' separator */}
            {/*<button*/}
            {/*    type="button"*/}
            {/*    className="flex items-center justify-center gap-2 w-full border rounded-xl py-2 mb-4 text-sm text-gray-600 hover:bg-gray-100 transition"*/}
            {/*>*/}
            {/*  <img src="/img/google_logo.png" className="w-4 h-4" alt="Google" />*/}
            {/*  Google*/}
            {/*</button>*/}
            {/*<div className="text-center text-gray-400 text-xs mb-4">*/}
            {/*  atau lanjutkan dengan*/}
            {/*</div>*/}

            {/* Username Input */}
            <div className="mb-4 relative">
              <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full bg-gray-200 p-3 pr-10 rounded-xl text-sm focus:outline-none focus:ring-2 ${
                      errors.username ? "focus:ring-red-500" : "focus:ring-green-500"
                  }`}
              />
              <User className="absolute right-3 top-3 text-green-700" size={18} />
              {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password Input */}
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

            {/* CAPTCHA Section */}
            {!isCaptchaVerified ? (
                <CaptchaChallenge
                    elementInternals={elementInternals}
                    messageInfo={messageInfo}
                    isCaptchaLoading={isCaptchaLoading}
                    isVerifying={isVerifying}
                    isCaptchaVerified={isCaptchaVerified}
                    onReloadCaptcha={reloadCaptchaHook}
                />
            ) : (
                <div className="bg-green-100 text-green-800 text-sm px-4 py-3 rounded-xl mb-4 border border-green-300 text-center">
                  <p>✔️ Verifikasi keamanan berhasil. Silakan lanjutkan.</p>
                </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="accent-green-700" />
                <span>Ingat Saya</span>
              </label>
              <a href="#" className="text-green-700 hover:underline">
                Lupa Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoggingIn || !isCaptchaVerified || isCaptchaLoading || isVerifying}
                className="cursor-pointer w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {isLoggingIn ? "Memproses..." : "Login"}
            </button>
          </form>
        </div>
      </div>
  );
}