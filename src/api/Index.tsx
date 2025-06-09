import axios from "axios"

export const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, //gatau ini error kenapa jir env nya
})

// interceptor request: tambahkan token ke header authorization jika tersedia
Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// interceptor response: cek jika token expired (status 401)
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // optional: hapus token dan redirect ke login
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)
