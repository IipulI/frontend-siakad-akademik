import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import FilterPanel from "../../../components/FilterPanel";
import { Plus, Recycle, RefreshCw, Search, Trash } from "lucide-react";
import DeleteButton from "../../../components/DeleteButton";
import AddButton from "../../../components/AddButton";

const CollegeClass = () => {
  return (
    <MainLayout isGreeting={false} titlePage="Kelas Kuliah">
      <div className="space-y-4">
        <FilterPanel>
          <FilterPanel.Select label={"Periode Akademik"}>
            <option value="">2025 Ganjil</option>
          </FilterPanel.Select>
          <FilterPanel.Select label={"Prodi Pengampu"}>
            <option value="">2025 Ganjil</option>
          </FilterPanel.Select>
          <FilterPanel.Select label={"Sistem Kuliah"}>
            <option value="">-- Semua Sistem Mata Kuliah -- </option>
          </FilterPanel.Select>
          <FilterPanel.Select label={"Tahun Kurikulum"}>
            <option value="">-- Tahun Kurikulum -- </option>
          </FilterPanel.Select>
        </FilterPanel>
        <div className="bg-white border-t-2 border-primary-green rounded-md shadow-sm p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <FilterPanel.Select>
                <option value="">-- semua --</option>
              </FilterPanel.Select>
              <div className="flex space-x-1">
                <input
                  placeholder="Cari Kelas Kuliah"
                  className="py-1.5 px-3 border rounded text-xs"
                  type="text"
                />
                <button className="bg-primary-yellow p-0.5 cursor-pointer rounded">
                  <Search size={24} color="#fff" />
                </button>
                <button className="bg-primary-blueDark  p-0.5 cursor-pointer rounded">
                  <RefreshCw size={24} color="#fff" />
                </button>
              </div>
            </div>
            <div className="flex space-x-4">
              <AddButton />
              <DeleteButton />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CollegeClass;
