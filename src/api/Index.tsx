import axios from "axios";

export const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Cek dulu apakah ini request SSO atau request biasa
      const isAuthRequest =
        error.config?.url?.includes("/sso") ||
        error.config?.url?.includes("/auth") ||
        error.config?.url?.includes("/login");

      // Hanya logout kalau bukan request data biasa yang memang belum ada endpoint-nya
      // Cek apakah token masih ada — kalau ada tapi 401, baru logout
      const token = localStorage.getItem("token");
      if (token && !isAuthRequest) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("account_info");
        window.location.replace("http://103.158.196.79/eportal");
      }
    }
    return Promise.reject(error);
  },
);
