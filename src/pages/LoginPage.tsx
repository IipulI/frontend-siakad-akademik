import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FormLogin from "../components/FormLogin";
import { useAuthenticateEportal } from "../hooks/useEportalAuth";
import { useAuth } from "../context/AuthContext";
import {
  StudentRoute,
  AdminAcademicRoute,
  AdminFinanceRoute,
  LecturerRoute,
} from "../types/VarRoutes";

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const token = queryParams.get("token") || "";
  const role_id = queryParams.get("role_id") || "";
  const appModule_id = queryParams.get("appModule_id") || "";
  const unit_id = queryParams.get("unit_id") || "";

  const isSsoLogin = !!token && !!role_id && !!appModule_id;

  const { data, isLoading, isError } = useAuthenticateEportal(
    token,
    role_id,
    appModule_id,
    unit_id,
  );

  useEffect(() => {
    if (!data || !isSsoLogin) return;

    const userData = data.data;

    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData.user));
    localStorage.setItem("account_info", JSON.stringify(userData.account_info));

    const roleName = userData.user?.roles?.[0] || "";
    const role = roleName.toUpperCase();

    let dashboardPath = String(StudentRoute.dashboard);
    if (role === "MAHASISWA") {
      dashboardPath = String(StudentRoute.dashboard);
    } else if (role === "DOSEN") {
      dashboardPath = String(LecturerRoute.dashboard);
    } else if (
      [
        "AKADEMIK_UNIV",
        "AKADEMIK_FAK",
        "AKADEMIK_PRODI",
        "ADMIN",
        "PEGAWAI",
      ].includes(role)
    ) {
      dashboardPath = String(AdminAcademicRoute.dashboardAdminAcademic);
    } else if (
      ["KEUANGAN_UNIV", "KEUANGAN_FAK", "KEUANGAN_PRODI"].includes(role)
    ) {
      dashboardPath = String(AdminFinanceRoute.dashboardAdminFinance);
    }

    navigate(dashboardPath, { replace: true });
  }, [data, isSsoLogin]);

  if (isSsoLogin && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <img
          src="/img/bg_uika.png"
          alt=""
          className="absolute w-full h-full -z-10 filter brightness-50 object-cover"
        />
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }

  if (isSsoLogin && isError) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <img
          src="/img/bg_uika.png"
          alt=""
          className="absolute w-full h-full -z-10 filter brightness-50 object-cover"
        />
        <div className="text-white text-center bg-white/10 p-8 rounded-2xl backdrop-blur">
          <p className="text-lg font-semibold mb-2">Sesi tidak valid</p>
          <p className="text-sm text-white/70 mb-4">
            Silakan kembali ke E-Portal dan coba lagi.
          </p>
          <a
            href="http://localhost:5173"
            className="px-4 py-2 bg-blue-500 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Kembali ke E-Portal
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <img
        src="/img/bg_uika.png"
        alt=""
        className="absolute w-full h-full -z-10 filter brightness-50 object-cover"
      />
      <FormLogin />
    </div>
  );
}
