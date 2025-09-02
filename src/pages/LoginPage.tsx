import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import FormLogin from "../components/FormLogin";
import axios from "axios";
import { useAuthenticateEportal } from "../hooks/useEportalAuth";

export default function LoginPage() {
  const location = useLocation();

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const token = queryParams.get("token") || "";
  const role_id = queryParams.get("role_id") || "";
  const appModule_id = queryParams.get("appModule_id") || "";
  const unit_id = queryParams.get("unit_id") || "";

  const { data, isLoading, isError, error } = useAuthenticateEportal(
    token,
    role_id,
    appModule_id,
    unit_id
  );

  console.log(data);

  //   if (isLoading) return <p>Loading...</p>;
  //   if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <img
        src="/img/bg_uika.png"
        alt=""
        className="absolute w-full h-full -z-10 filter brightness-50 object-cover"
      />

      <div>
        <FormLogin />
      </div>
    </div>
  );
}
