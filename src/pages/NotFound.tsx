import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="text-7xl">🚫</div>
      <h1 className="text-5xl font-bold text-gray-800 mt-4">
        404 - Halaman Tidak Ditemukan
      </h1>
      <p className="text-gray-600 mt-3 text-lg">
        Maaf, halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
      </p>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
      >
        🔙 Kembali ke Beranda
      </button>
    </div>
  );
}
