import { useState } from "react";
import { Plus } from "lucide-react";
import MainLayout from "../../components/layouts/MainLayout";
import ContentCard from "../../components/final-level/layout/ContentCard";
import FilterSection from "../../components/final-level/layout/FilterSection";
import PeriodeSelector from "../../components/final-level/PeriodeSelector";
import FilterDropdown from "../../components/final-level/FilterDropdown";
import SearchBar from "../../components/final-level/SearchBar";
import ActionButton from "../../components/final-level/ActionButton";
import DataTable from "../../components/final-level/DataTable";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/final-level/Pagination";

export default function Consultation() {
  // State
  const [periodeAkademik, setPeriodeAkademik] = useState("2024 Genap");
  const [filterValue, setFilterValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [konsultasiData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [totalItems] = useState(10);

  const location = useNavigate();

  // Options for dropdowns
  const periodeOptions = [
    { value: "2024 Genap", label: "2024 Genap" },
    { value: "2024 Ganjil", label: "2024 Ganjil" },
    { value: "2023 Genap", label: "2023 Genap" },
  ];

  const filterOptions = [];

  // Table columns configuration
  const columns = [
    { header: "Post Terakhir", accessor: "postTerakhir" },
    { header: "Topik", accessor: "topik" },
    { header: "KRS Disetujui", accessor: "krsDisetujui" },
    { header: "Status", accessor: "status" },
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

  const handleRefresh = (e) => {
    e.preventDefault();
  };

  const handleAddNew = () => {
    location("/final-level/consultation/detail-consultation");
    // Implement add new logic here
  };

  return (
    <MainLayout titlePage="Konsultasi Pembimbing">
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
            placeholder="Cari Konsultasi Pembimbing"
          />
          <ActionButton
            icon={<Plus />}
            label="Tambah"
            onClick={handleAddNew}
            bgColor={"bg-primary-blueSoft"}
            hoverColor={"hover:bg-blue-400"}
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
