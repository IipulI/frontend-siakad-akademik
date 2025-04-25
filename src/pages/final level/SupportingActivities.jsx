import { useState } from "react";
import { FaPrint } from "react-icons/fa6";
import MainLayout from "../../components/layouts/MainLayout";
import ContentCard from "../../components/final level/layout/ContentCard";
import FilterSection from "../../components/final level/layout/FilterSection";
import PeriodeSelector from "../../components/final level/PeriodeSelector";
import FilterDropdown from "../../components/final level/FilterDropdown";
import SearchBar from "../../components/final level/SearchBar";
import ActionButton from "../../components/final level/ActionButton";
import DataTable from "../../components/final level/DataTable";
import Pagination from "../../components/final level/Pagination";

export default function SupportingActivities() {
  // State
  const [periodeAkademik, setPeriodeAkademik] = useState("2024 Genap");
  const [filterValue, setFilterValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [konsultasiData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [totalItems] = useState(10);

  // Options for dropdowns
  const periodeOptions = [
    { value: "2024 Genap", label: "2024 Genap" },
    { value: "2024 Ganjil", label: "2024 Ganjil" },
    { value: "2023 Genap", label: "2023 Genap" },
  ];

  const filterOptions = [];

  // Table columns configuration
  const columns = [
    { header: "Unit", accessor: "unit" },
    { header: "Jenis", accessor: "jenis" },
    { header: "Nama Kegiatan", accessor: "namaKegiatan" },
    { header: "Unit", accessor: "unit" },
    { header: "Instansi", accessor: "instansi" },
    { header: "Mulai", accessor: "mulai" },
    { header: "Selesai", accessor: "selesai" },
    {
      header: "Aksi",
      accessor: "id",
      render: () => (
        <div className="flex space-x-2 justify-center">
          <button className="bg-blue-500 text-white px-2 py-1 rounded">
            View
          </button>
        </div>
      ),
    },
  ];

  // Handlers
  const handleSearch = (query) => {
    alert("Searching for:" + query);
    // Implement search logic here
  };

  const handleRefresh = () => {
    setSearchQuery("");
    // Implement refresh logic here
  };

  const handlePrint = () => {
    alert("Add print clicked");
    // Implement add new logic here
  };

  return (
    <MainLayout titlePage="Kegiatan Pendukung">
      <ContentCard>
        <FilterSection>
          <PeriodeSelector
            value={periodeAkademik}
            onChange={setPeriodeAkademik}
            options={periodeOptions}
          />

          <FilterDropdown
            value={filterValue}
            onChange={setFilterValue}
            options={filterOptions}
          />

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            onRefresh={handleRefresh}
            placeholder="Cari Kegiatan Pendukung"
          />
          <ActionButton
            icon={<FaPrint />}
            label="Cetak"
            onClick={handlePrint}
            bgColor={"bg-blue-400"}
          />
        </FilterSection>

        <DataTable columns={columns} data={konsultasiData} />

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / rowsPerPage) || 1}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
          rowsPerPage={rowsPerPage}
          loadTime={"0.0076"}
        />
      </ContentCard>
    </MainLayout>
  );
}
