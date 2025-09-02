import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FormLogin from "../components/FormLogin";
import axios from "axios";

export default function LoginPage() {
  const location = useLocation(); // ✅ ini wajib
  const [credentials, setCredentials] = useState({
    token: "",
    role_id: "",
    appModule_id: "",
    unit_id: "",
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const token = queryParams.get("token") || "";
    const role_id = queryParams.get("role_id") || "";
    const appModule_id = queryParams.get("appModule_id") || "";
    const unit_id = queryParams.get("unit_id") || "";

    setCredentials({ token, role_id, appModule_id, unit_id });
    console.log({ token, role_id, appModule_id, unit_id });
    console.log("credentials", credentials);

    if (token && role_id && appModule_id && unit_id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "https://eportal.uika-bogor.ac.id/api/call_user",
            {
              params: {
                token,
                role_id,
                appModule_id,
                unit_id,
              },
            }
          );
          console.log(response.data);
          return response.data;
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      fetchData();
    }
  }, [location.search]);

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
