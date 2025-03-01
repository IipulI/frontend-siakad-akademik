import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [npm, setNPM] = useState();
  const [password, setPassword] = useState();

  const submitHandler = () => {
    console.log("NPM : ", npm);
    console.log("Password : ", password);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <img src="/logo.png" alt="Logo" className="mx-auto mb-4 w-16" />
        <h2 className="text-2xl font-bold text-green-800">S I A K A D</h2>
        <p className="text-sm text-gray-600 mb-6">
          Sistem Informasi Akademik dan Keuangan
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Untuk mengakses, dipersilahkan untuk login terlebih dahulu.
        </p>
        <div className="mb-4">
          <input
            type="text"
            placeholder="NPM"
            onChange={(e) => setNPM(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
        <div className="mb-4 relative">
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center justify-between text-sm mb-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox text-green-600" />
            <span>Ingat Saya</span>
          </label>
          <a href="#" className="text-green-600 hover:underline">
            Lupa Password?
          </a>
        </div>
        <button
          onClick={submitHandler}
          className="w-full bg-green-700 text-white p-3 rounded-lg hover:bg-green-800 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default App;
