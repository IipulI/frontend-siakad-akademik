import React, {useState} from "react"; // Baris ini diperbaiki
import {Api} from "../../../api/Index"; // Import your axios instance
import {Save, X} from "lucide-react"; // Import icons for buttons

interface FormAddAnnouncementProps {
    onCancel: () => void;
    onSubmit: (data: any) => void; // onSubmit will now be triggered after API call
}

const FormAddAnnouncement: React.FC<FormAddAnnouncementProps> = ({onCancel, onSubmit}) => {
    // Mengubah state banner untuk menyimpan objek File atau null
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [judul, setJudul] = useState("");
    const [pengumuman, setPengumuman] = useState(""); // This will be mapped to 'isi'
    const [aktif, setAktif] = useState(false); // Maps to 'isActive'
    const [prioritas, setPrioritas] = useState(false); // Maps to 'isPriority'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fungsi untuk menangani perubahan input file
    const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setBannerFile(e.target.files[0]);
        } else {
            setBannerFile(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        // Siapkan data untuk API menggunakan FormData
        const formData = new FormData();

        // Contoh respons API untuk 'isi' adalah string JSON dari Draft.js ContentState.
        const isiContent = {
            blocks: [{
                key: "1", // Kunci sederhana
                text: pengumuman,
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
            }],
            entityMap: {},
        };

        // Buat objek 'request' yang berisi data non-file
        const requestData = {
            judul: judul,
            isi: JSON.stringify(isiContent), // Mengubah objek content state menjadi string JSON
            isActive: aktif,
            isPriority: prioritas,
        };

        // Tambahkan objek 'request' sebagai string JSON ke FormData
        formData.append("request", JSON.stringify(requestData));

        // Tambahkan file banner jika ada
        if (bannerFile) {
            formData.append("banner", bannerFile); // 'banner' adalah nama field yang diharapkan oleh backend
        }

        try {
            // Mengirim FormData. Axios akan secara otomatis mengatur Content-Type menjadi multipart/form-data
            const response = await Api.post("/akademik/pengumuman", formData);

            if (response.data.status === "success") {
                setSuccessMessage("Pengumuman berhasil ditambahkan!");
                // Panggil prop onSubmit yang biasanya akan menutup form dan mengambil ulang data di parent
                onSubmit(response.data.data); // Meneruskan data pengumuman baru jika diperlukan oleh parent
            } else {
                setError(response.data.message || "Gagal menambahkan pengumuman.");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Terjadi kesalahan saat menambahkan pengumuman.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 bg-white rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-primary-green">Tambah Pengumuman Baru</h2>

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
                     role="alert">
                    <span className="block sm:inline">{successMessage}</span>
                </div>
            )}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                     role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="mb-4 flex flex-col sm:flex-row sm:items-center">
                <label htmlFor="banner" className="w-32 block text-sm font-medium mb-1 sm:mb-0">Banner</label>
                <input
                    type="file" // Mengubah tipe input menjadi file
                    id="banner"
                    className="flex-1 border rounded px-3 py-2 focus:ring-primary-green focus:border-primary-green transition-all duration-200"
                    onChange={handleBannerFileChange} // Menggunakan handler baru
                    accept="image/*" // Hanya menerima file gambar
                />
                {bannerFile && (
                    <span className="ml-2 text-sm text-gray-600">{bannerFile.name}</span>
                )}
            </div>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center">
                <label htmlFor="judul" className="w-32 block text-sm font-medium mb-1 sm:mb-0">Judul<span
                    className="text-red-500">*</span></label>
                <input
                    type="text"
                    id="judul"
                    className="flex-1 border rounded px-3 py-2 focus:ring-primary-green focus:border-primary-green transition-all duration-200"
                    value={judul}
                    onChange={e => setJudul(e.target.value)}
                    required
                    placeholder="Masukkan judul pengumuman"
                />
            </div>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-start">
                <label htmlFor="pengumuman" className="w-32 block text-sm font-medium mt-2 mb-1 sm:mb-0">Pengumuman<span
                    className="text-red-500">*</span></label>
                <div className="flex-1">
          <textarea
              id="pengumuman"
              className="w-full border rounded px-3 py-2 min-h-[120px] focus:ring-primary-green focus:border-primary-green transition-all duration-200"
              value={pengumuman}
              onChange={e => setPengumuman(e.target.value)}
              required
              placeholder="Tulis isi pengumuman di sini..."
          />
                </div>
            </div>
            <div className="mb-4 flex items-center">
                <label htmlFor="aktif" className="w-32 block text-sm font-medium">Aktif</label>
                <input
                    type="checkbox"
                    id="aktif"
                    className="mr-2 h-4 w-4 text-primary-green rounded focus:ring-primary-green"
                    checked={aktif}
                    onChange={e => setAktif(e.target.checked)}
                />
            </div>
            <div className="mb-6 flex items-center">
                <label htmlFor="prioritas" className="w-32 block text-sm font-medium">Prioritas</label>
                <input
                    type="checkbox"
                    id="prioritas"
                    className="mr-2 h-4 w-4 text-primary-green rounded focus:ring-primary-green"
                    checked={prioritas}
                    onChange={e => setPrioritas(e.target.checked)}
                />
                <span
                    className="text-xs text-gray-700">Pengumuman muncul paling atas meskipun banyak yang lebih baru</span>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                    <X size={16} className="mr-2"/> Batal
                </button>
                <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-primary-green text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? "Menyimpan..." : <><Save size={16} className="mr-2"/> Simpan</>}
                </button>
            </div>
        </form>
    );
};

export default FormAddAnnouncement;
