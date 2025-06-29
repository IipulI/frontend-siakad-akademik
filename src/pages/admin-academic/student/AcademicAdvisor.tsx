import MainLayout from "../../../components/layouts/MainLayout";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import {
  Check,
  ChevronDown,
  Eye,
  Pen,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { useGetAcademicAdvisor } from "../../../hooks/admin-akademik/usePembimbingAkademik";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function AcademikAdvisor() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState({
    periodeAkademik: "2025 Ganjil", // Set default value yang valid
    programStudi: "",
    angkatan: "",
    statusKrs: "",
    namaMahasiswa: "",
    hasPembimbing: undefined as boolean | undefined,
    statusMahasiswa: "",
  });

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0); // Trigger untuk memaksa refetch
  const firstLoad = useRef(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hook with updated parameters
  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch, // Tambahkan refetch dari useQuery
  } = useGetAcademicAdvisor({
    page: currentPage,
    size: rowsPerPage,
    periodeAkademik: filters.periodeAkademik,
    programStudi: filters.programStudi,
    angkatan: filters.angkatan,
    statusKrs: filters.statusKrs,
    namaMahasiswa: filters.namaMahasiswa,
    hasPembimbing: filters.hasPembimbing,
    statusMahasiswa: filters.statusMahasiswa,
    sort: "createdAt,desc",
  });

  // Extract data dari response
  const studentRecords = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;

  console.log("Student Records:", studentRecords);
  console.log("Current Filters:", filters);

  useEffect(() => {
    if (!isLoading) {
      firstLoad.current = false;
    }
  }, [isLoading]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading && firstLoad.current) {
    return <LoadingSpinner title="Pembimbing Akademik" />;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-4">
        Gagal memuat data pembimbing akademik
      </div>
    );
  }

  // Handle filter change
  const handleFilterChange = (field: string, value: string) => {
    console.log(`Filter changed: ${field} = ${value}`);

    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [field]: value,
      };
      console.log("New filters:", newFilters);
      return newFilters;
    });
    setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
  };

  // Handle Enter key pada search input
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      SearchSubmit();
    }
  };

  // Fungsi untuk submit pencarian
  function SearchSubmit() {
    console.log("Search submitted with keyword:", searchKeyword);

    setFilters((prev) => {
      const newFilters = {
        ...prev,
        namaMahasiswa: searchKeyword.trim(), // Trim whitespace
      };
      console.log("Search filters updated:", newFilters);
      return newFilters;
    });
    setCurrentPage(1); // Reset ke halaman 1 saat search
    setSearchTrigger((prev) => prev + 1); // Trigger refetch
  }

  // Fungsi untuk clear search
  function ClearSearch() {
    console.log("Clearing search");
    setSearchKeyword("");
    setFilters((prev) => ({
      ...prev,
      namaMahasiswa: "",
    }));
    setCurrentPage(1);
  }

  function Edit() {
    alert("oke edit");
  }

  function Detail() {
    alert("oke Detail");
  }

  // Fungsi untuk perubahan halaman
  function handlePageChange(newPage: number) {
    setCurrentPage(newPage);
  }

  // Fungsi untuk perubahan rows per page
  function handleRowsPerPageChange(newRowsPerPage: number) {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset ke halaman 1 saat mengubah rows per page
  }

  // Action handlers for dropdown
  function handleSetujuiKrs() {
    alert("Setujui KRS dipilih");
    setIsOpen(false);
    // Add your logic here for approving KRS
  }

  function handleBatalkanKrs() {
    alert("Batalkan KRS dipilih");
    setIsOpen(false);
    // Add your logic here for canceling KRS
  }

  function handlePembimbingAkademik() {
    alert("Pembimbing Akademik dipilih");
    setIsOpen(false);
    // Add your logic here for academic advisor assignment
  }

  const periode = [
    { value: "2025 Ganjil", label: "2025 Ganjil" },
    { value: "2024 Genap", label: "2024 Genap" },
    { value: "2024 Ganjil", label: "2024 Ganjil" },
  ];

  const statusPembimbing = [
    { value: "", label: "-- Semua Status Pembimbing --" },
    { value: "true", label: "Sudah Ada Pembimbing" },
    { value: "false", label: "Belum Ada Pembimbing" },
  ];

  const semester = [
    { value: "", label: "-- Semua Semester --" },
    { value: "1", label: "Semester 1" },
    { value: "2", label: "Semester 2" },
    { value: "3", label: "Semester 3" },
    { value: "4", label: "Semester 4" },
    { value: "5", label: "Semester 5" },
    { value: "6", label: "Semester 6" },
    { value: "7", label: "Semester 7" },
    { value: "8", label: "Semester 8" },
  ];

  const unitKerja = [{ value: "", label: "Universitas Ibn Khaldun" }];

  const statusKRS = [
    { value: "", label: "-- Semua Status KRS --" },
    { value: "DIAJUKAN", label: "Diajukan" },
    { value: "DISETUJUI", label: "Disetujui" },
    { value: "DITOLAK", label: "Ditolak" },
  ];

  const statusMahasiswa = [
    { value: "", label: "-- Semua Status Mahasiswa --" },
    { value: "aktif", label: "Aktif" },
    { value: "cuti", label: "Cuti" },
    { value: "lulus", label: "Lulus" },
  ];

  const angkatan = [
    { value: "", label: "-- Semua Angkatan --" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2021", label: "2021" },
  ];

  return (
    <MainLayout isGreeting={false} titlePage="Pembimbing Akademik">
      <div className="grid xl:grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
        <InputFilter
          options={periode}
          label="Periode Akademik"
          value={filters.periodeAkademik}
          onChange={(value) => handleFilterChange("periodeAkademik", value)}
        />
        <InputFilter
          options={statusPembimbing}
          label="Status Pembimbing"
          value={
            filters.hasPembimbing !== undefined
              ? String(filters.hasPembimbing)
              : ""
          }
          onChange={(value) => {
            // Convert string to boolean or undefined
            let boolValue: boolean | undefined = undefined;
            if (value === "true") boolValue = true;
            else if (value === "false") boolValue = false;

            setFilters((prev) => ({
              ...prev,
              hasPembimbing: boolValue,
            }));
            setCurrentPage(1);
          }}
        />
        <InputFilter options={semester} label="Semester" />
        <InputFilter options={unitKerja} label="Unit kerja" />
        <InputFilter
          options={statusKRS}
          label="Status KRS"
          value={filters.statusKrs}
          onChange={(value) => handleFilterChange("statusKrs", value)}
        />
        <InputFilter
          options={statusMahasiswa}
          label="Status Mahasiswa"
          value={filters.statusMahasiswa}
          onChange={(value) => handleFilterChange("statusMahasiswa", value)}
        />
        <InputFilter
          options={angkatan}
          label="Angkatan"
          value={filters.angkatan}
          onChange={(value) => handleFilterChange("angkatan", value)}
        />
      </div>

      <div className="border-t-2 border-primary-green bg-white mt-5 p-2 py-4 rounded-sm shadow-sm pb-4">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                className="border-2 p-1 rounded text-xs w-60"
                placeholder="Cari nama mahasiswa"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              {searchKeyword && (
                <button
                  onClick={ClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <ButtonClick
              icon={<Search size={16} strokeWidth={3} />}
              color="bg-primary-yellow"
              onClick={SearchSubmit}
            />
            {filters.namaMahasiswa && (
              <div className="flex items-center bg-blue-100 px-2 py-1 rounded text-xs">
                <span className="mr-1">
                  Pencarian: "{filters.namaMahasiswa}"
                </span>
                <button
                  onClick={ClearSearch}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex bg-yellow-500 hover:bg-yellow-600 items-center rounded p-1 px-2 text-white font-semibold text-sm transition-colors"
            >
              <Settings color="white" size={17} className="mr-1" />
              <span className="mr-1">Aksi</span>
              <ChevronDown
                size={16}
                className={`transform transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[180px]">
                <button
                  onClick={handleSetujuiKrs}
                  className="w-full text-left px-3 py-2 text-black text-sm hover:bg-gray-100 rounded-t flex items-center"
                >
                  Setujui KRS
                </button>
                <button
                  onClick={handleBatalkanKrs}
                  className="w-full text-left px-3 py-2 text-black text-sm hover:bg-gray-100 flex items-center"
                >
                  Batalkan KRS
                </button>
                <button
                  onClick={handlePembimbingAkademik}
                  className="w-full text-left px-3 py-2 text-black text-sm hover:bg-gray-100 rounded-b flex items-center"
                >
                  Pembimbing Akademik
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto my-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center w-6">
                  <input type="checkbox" className="w-4 h-4" />
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  Nama Mahasiswa
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  Angkatan
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  Status Smt
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  Smt
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  SKS
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  Batas SKS
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  Total SKS
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  IPS
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  IPK
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  KRS Diajukan
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  KRS Disahkan
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  Pembimbing Akademik
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  No SK
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  Tgl SK
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={16} className="text-center py-4 text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : studentRecords.length === 0 ? (
                <tr>
                  <td colSpan={16} className="text-center py-4 text-gray-500">
                    {filters.namaMahasiswa
                      ? `Tidak ditemukan mahasiswa dengan nama "${filters.namaMahasiswa}"`
                      : "Tidak ada data yang ditemukan"}
                  </td>
                </tr>
              ) : (
                studentRecords.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      <input type="checkbox" className="w-4 h-4" />
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-sm">
                      {record.mahasiswa}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {record.angkatan}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {record.statusMahasiswa}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {record.semester}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {record.totalSks}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {record.batasSks}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {record.totalSks}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {record.ips}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {record.ipk}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      <div className="flex justify-center">
                        {record.statusDiajukan ? (
                          <Check color="green" size={20} />
                        ) : (
                          <X color="red" size={20} />
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      <div className="flex justify-center">
                        {record.statusDisetujui ? (
                          <Check color="green" size={20} />
                        ) : (
                          <X color="red" size={20} />
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-sm">
                      {record.pembimbingAkademik}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-sm">
                      {"-"}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center text-sm">
                      {"-"}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      <div className="flex justify-center space-x-2">
                        <ButtonClick
                          icon={<Pen size={16} />}
                          color="bg-primary-yellow"
                          onClick={Edit}
                        />
                        <ButtonClick
                          icon={<Eye size={16} />}
                          color="bg-primary-blueSoft"
                          onClick={Detail}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            rowsPerPage={pagination.perPage}
            totalRows={pagination.totalItems}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}
      </div>
      <div className="py-10"></div>
    </MainLayout>
  );
}
