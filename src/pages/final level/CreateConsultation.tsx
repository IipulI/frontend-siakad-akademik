import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { AiFillSave } from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";
import MainLayout from "../../components/layouts/MainLayout";
import ContentCard from "../../components/final level/layout/ContentCard";
import FilterSection from "../../components/final level/layout/FilterSection";
import SearchBar from "../../components/final level/SearchBar";
import ActionButton from "../../components/final level/ActionButton";
import React from "react";

export default function CreateConsultation() {
  // State
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleRefresh = () => {
    location.reload();
    // Implement refresh logic here
  };

  const handleBack = () => {
    window.location.href = "/final level/consultation";
    // Implement add back logic here
  };
  const handleSave = () => {
    alert("save");
  };
  const handleAksi = () => {
    alert("aksi");
  };

  return (
    <MainLayout titlePage="Konsultasi Pembimbing">
      <ContentCard>
        <FilterSection>
          <div className="flex flex-col gap-5 lg:gap-10 items-center lg:flex-row justify-between w-full">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              onRefresh={handleRefresh}
              placeholder="Cari Konsultasi Pembimbing"
            />

            <div className="flex space-x-5 w-full justify-center lg:justify-end">
              <ActionButton
                icon={<FaChevronLeft />}
                label="Kembali ke Daftar"
                onClick={handleBack}
                bgColor={"bg-blue-400"}
                hoverColor={"hover:bg-blue-500"}
              />
              <ActionButton
                icon={<AiFillSave />}
                label="Simpan"
                onClick={handleSave}
                bgColor={"bg-primary-green"}
                hoverColor={"hover:bg-green-900"}
              />
              <ActionButton
                icon={<IoMdSettings />}
                label="Aksi"
                onClick={handleAksi}
                bgColor={"bg-primary-yellow"}
                hoverColor={"hover:bg-yellow-600"}
              />
            </div>
          </div>
        </FilterSection>
        <table className="text-sm xl:text-base w-full">
          <tbody>
            <tr>
              <td className="p-2">Priode Akademik</td>
              <td className="p-2">2024 Genap</td>
            </tr>
            <tr>
              <td className="p-2">Mahasiswa</td>
              <td className="p-2">221106042807 - MUHAMMAD RIDHO FATHAN</td>
            </tr>
            <tr>
              <td className="p-2">Pembimbing</td>
              <td className="p-2">
                0412109102 - BERLINA WULANDARI, S.T., M.Kom
              </td>
            </tr>
            <tr>
              <td className="p-2">Tanggal Konsultasi</td>
              <td className="p-2">
                <input type="date" className="border-2 p-2 rounded-sm w-full" />
              </td>
            </tr>
            <tr>
              <td className="p-2">Topik</td>
              <td className="p-2">
                <input type="text" className="border-2 p-2 rounded-sm w-full" />
              </td>
            </tr>
            <tr>
              <td className="p-2">Keterangan</td>
              <td className="p-2">
                <textarea
                  name=""
                  id=""
                  className="border-2 p-2 rounded-sm w-full"
                ></textarea>
              </td>
            </tr>
            <tr>
              <td className="p-2">Pesan</td>
              <td className="p-2">
                <textarea
                  name=""
                  id=""
                  className="border-2 p-2 rounded-sm w-full"
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </ContentCard>
    </MainLayout>
  );
}
