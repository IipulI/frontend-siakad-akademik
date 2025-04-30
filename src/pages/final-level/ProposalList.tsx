import { useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import ContentCard from "../../components/final-level/layout/ContentCard";
import FilterSection from "../../components/final-level/layout/FilterSection";
import FilterDropdown from "../../components/final-level/FilterDropdown";
import SearchBar from "../../components/final-level/SearchBar";
import ActionButton from "../../components/final-level/ActionButton";
import DataTable from "../../components/final-level/DataTable";
import { Plus, Trash } from "lucide-react";
import Pagination from "../../components/final-level/Pagination";
import React from "react";

export default function ProposalList() {
  // State
  const [filterValue, setFilterValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [konsultasiData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [totalItems] = useState(10);

  const filterOptions = [];

  // Table columns configuration
  const columns = [
    { header: "Unit", accessor: "unit" },
    { header: "Judul", accessor: "judul" },
    { header: "Topik", accessor: "topik" },
    { header: "Nama Pembimbing", accessor: "namaPembimbing" },
    { header: "Tgl. Pengajuan", accessor: "tglPengajuan" },
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

  const handleRefresh = () => {
    location.reload();
    // Implement refresh logic here
  };

  const handleCreate = () => {
    window.location.href = "";
    // Implement add back logic here
  };
  const handleDelete = () => {
    alert("delete");
  };

  return (
    <MainLayout
      titlePage="Proposal Tingkat Akhir"
      isGreeting={false}
      className={""}
    >
      <ContentCard>
        <FilterSection>
          <div className="flex flex-col gap-5 lg:gap-10 items-center lg:flex-row justify-between w-full">
            <FilterDropdown
              value={filterValue}
              onChange={setFilterValue}
              options={filterOptions}
              placeholder={"-Semua-"}
            />
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              onRefresh={handleRefresh}
              placeholder="Cari Proposal Tingkat Akhir"
            />

            <div className="flex space-x-5 w-full justify-center lg:justify-end">
              <ActionButton
                icon={<Plus />}
                label="Tambah"
                onClick={handleCreate}
                bgColor={"bg-primary-blueSoft"}
                hoverColor={"hover:bg-blue-400"}
              />
              <ActionButton
                icon={<Trash />}
                label="Hapus"
                onClick={handleDelete}
                bgColor={"bg-red-400"}
                hoverColor={"hover:bg-red-500"}
              />
            </div>
          </div>
        </FilterSection>

        <DataTable
          columns={columns}
          data={konsultasiData}
          header={""}
          emptyMessage={"Data kosong"}
          tableClassName={
            " w-full border-collapse border-2 text-sm xl:text-base shrink-0"
          }
          headerClassName={
            "bg-primary-green text-white font-semibold text-center"
          }
          rowClassName={"border-b border-gray-200"}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / rowsPerPage) || 1}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
          rowsPerPage={rowsPerPage}
          loadTime={0.0076}
          infoComponent={undefined}
        />
      </ContentCard>
    </MainLayout>
  );
}
