import { useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import ContentCard from "../../components/final-level/layout/ContentCard";
import FilterSection from "../../components/final-level/layout/FilterSection";
import SearchBar from "../../components/final-level/SearchBar";
import ActionButton from "../../components/final-level/ActionButton";
import React from "react";
import { ChevronLeft, Save, Settings } from "lucide-react";

export default function CreateConsultation() {
  // State
  const [searchQuery, setSearchQuery] = useState("");

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
    window.location.href = "/final-level/consultation";
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
                icon={<ChevronLeft />}
                label="Kembali ke Daftar"
                onClick={handleBack}
                bgColor={"bg-primary-blueSoft"}
                hoverColor={"hover:bg-blue-400"}
              />
              <ActionButton
                icon={<Save />}
                label="Simpan"
                onClick={handleSave}
                bgColor={"bg-primary-green"}
                hoverColor={"hover:bg-green-900"}
              />
              <ActionButton
                icon={<Settings />}
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
