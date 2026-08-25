import React, {useState, useEffect} from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import FilterDropdown from "../../../components/admin-academic/FilterDropdown";
import {Search, Plus, Trash, ChevronLeft, Save} from "lucide-react";
import {TableAnnouncement} from "../../../components/admin-academic/announcement/TableAnnouncement";
import DetailAnnouncement from "../../../components/schedule/DetailAnnouncement";
import {Pagination} from "../../../components/admin-academic/Pagination";
import {Api} from "../../../api/Index"; // Import your axios instance
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useNavigate } from "react-router-dom";

const AnnouncementAdminAcademic = () => {
    const [id, setId] = useState<string | null>(null);
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const statusOptions = ["Semua Status", "Aktif", "Prioritas"];

    // Fungsi untuk mengambil data pengumuman dari API
    const fetchAnnouncements = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await Api.get(`/akademik/pengumuman`, {
                params: {
                    page: currentPage,
                    perPage: rowsPerPage,
                },
            });

            const result = response.data;

            if (result.status === "success") {
                const formattedData = result.data.map((item: any) => ({
                    id: item.id,
                    // Menggunakan 'createdAt' jika tersedia, jika tidak, menggunakan tanggal saat ini sebagai placeholder
                    tanggal: item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : new Date().toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                    penulis: item.user,
                    judul: item.judul,
                    aktif: item.isActive,
                    prioritas: item.isPriority,
                }));
                setAnnouncements(formattedData);
                setTotalPages(result.pagination.totalPage);
                setTotalItems(result.pagination.totalItems);
            } else {
                setError(result.message || "Gagal mengambil pengumuman.");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Terjadi kesalahan saat mengambil data.");
        } finally {
            setLoading(false);
        }
    };

    // Fungsi untuk menangani penghapusan pengumuman
    const handleDelete = async (announcementId: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) {
            try {
                setLoading(true);
                setError(null);
                const response = await Api.delete(`/akademik/pengumuman/${announcementId}`);
                if (response.data.status === "success") {
                    alert("Pengumuman berhasil dihapus!");
                    fetchAnnouncements(); // Ambil ulang data setelah penghapusan berhasil
                } else {
                    setError(response.data.message || "Gagal menghapus pengumuman.");
                }
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || "Terjadi kesalahan saat menghapus pengumuman.");
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, [currentPage, rowsPerPage]); // Panggil ulang saat halaman atau jumlah baris per halaman berubah

    const dataDetail = id ? announcements.find((item: any) => id === item.id) : null;

    return (
        <MainLayout
            titlePage={"Pengumuman"}
            isGreeting={false}
        >
           <FilterDropdown title={"Status"} options={statusOptions}/>
                        <div className="w-full mt-8 bg-white py-2 rounded-sm border-t-2 border-primary-green">
                            <div className="flex px-4 justify-between">
                                <div className="flex">
                                    <input
                                        type="search"
                                        placeholder="Cari Pengumuman"
                                        className="px-2 py-1 lg:w-70 w-40 text-xs lg:text-base rounded shadow-md border border-slate-300"
                                    />
                                    <button
                                        className="ml-2 bg-primary-yellow w-8 rounded flex items-center justify-center">
                                        <Search color="white" size={18}/>
                                    </button>
                                </div>
                                <div className="flex">
                                    <button
                                        className="ml-2 bg-primary-green cursor-pointer text-sm text-white  px-4 rounded flex items-center justify-center"
                                        onClick={() => navigate(AdminAcademicRoute.addAnnouncement)}
                                    >
                                        <Plus color="white" size={16} className="mr-2"/>
                                        Tambah
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Untuk menghapus beberapa item, Anda perlu mengelola item yang dipilih (misalnya, menggunakan checkbox).
                                            // Untuk saat ini, tombol ini akan memicu konfirmasi umum.
                                            // Jika Anda ingin menghapus satu item dari tabel, Anda akan meneruskan ID-nya ke handleDelete.
                                            alert("Untuk menghapus, pilih pengumuman terlebih dahulu atau implementasikan logika penghapusan massal.");
                                        }}
                                        className="ml-2 cursor-pointer bg-red-400 text-sm text-white  px-4 rounded flex items-center justify-center"
                                    >
                                        <Trash color="white" size={16} className="mr-2"/>
                                        Hapus
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-auto">
                                {loading && <p className="text-center py-4">Memuat pengumuman...</p>}
                                {error && <p className="text-center py-4 text-red-500">Error: {error}</p>}
                                {!loading && !error && (
                                    <TableAnnouncement
                                        data={announcements}
                                        error={null} // Penanganan error sekarang dilakukan di atas tabel
                                        setId={setId}
                                        onDelete={handleDelete} // Meneruskan handleDelete ke TableAnnouncement
                                    />
                                )}
                                {!loading && !error && announcements.length === 0 && (
                                    <p className="text-center py-4">Tidak ada pengumuman ditemukan.</p>
                                )}
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                rowsPerPage={rowsPerPage}
                                totalRows={totalItems}
                                onRowsPerPageChange={setRowsPerPage}
                            />
                        </div>
        </MainLayout>
    );
};

export default AnnouncementAdminAcademic;
