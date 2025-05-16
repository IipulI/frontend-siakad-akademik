import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useNavigate } from "react-router-dom";
import { TableObeCpmkMatkul } from "../../../components/Table";
import { Search, ArrowLeft, Save, Plus, Table } from "lucide-react";

interface CpmkMatkulData {
  id: string;
  kodeCpmk: string;
  deskripsi: string;
  pemetaan: string;
}

const ObeCpmkMatkul: React.FC = () => {
  const navigate = useNavigate();

  const [cpmkMatkulData, setCpmkMatkulData] = useState<CpmkMatkulData[]>([{ id: "1", kodeCpmk: "PL001", deskripsi: "Pemrograman Dasar", pemetaan: "PPL001" }]);
  const [selectedYear, setSelectedYear] = useState("2024");

  const [isAdding, setIsAdding] = useState(false);
  const [newCpmkMatkul, setNewCpmkMatkul] = useState<CpmkMatkulData>({
    id: "",
    kodeCpmk: "",
    deskripsi: "",
    pemetaan: "",
  });

  const handleBack = () => {
    navigate(AdminAcademicRoute.courseManagement.courseManagement);
  };

  const handleSave = () => {
    console.log("Data disimpan", cpmkMatkulData);
  };

  const handleAddCpmkMatkul = () => {
    setIsAdding(true);
    setNewCpmkMatkul({ id: Date.now().toString(), kodeCpmk: "", deskripsi: "", pemetaan: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCpmkMatkul((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNewCpmkMatkul = () => {
    if (!newCpmkMatkul.kodeCpmk.trim() || !newCpmkMatkul.deskripsi.trim()) {
      alert("Kode CPMK dan Deskripsi wajib diisi");
      return;
    }
    setCpmkMatkulData((prev) => [...prev, newCpmkMatkul]);
    setIsAdding(false);
    setNewCpmkMatkul({ id: "", kodeCpmk: "", deskripsi: "", pemetaan: "" });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <MainLayout isGreeting={false} titlePage="CPMK Mata Kuliah" className="">
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center ">
            <button onClick={handleBack} className="flex items-center bg-primary-blueDark text-white px-3 py-3 rounded-l-md">
              <ArrowLeft className="mr-2" size={16} />
            </button>
            <div className="flex items-center">
              <input type="search" placeholder="Cari Mata Kuliah" className="px-3 py-2 border border-black/50  w-64" />
              <button className="bg-primary-yellow px-3 py-3 rounded-r-md">
                <Search color="white" size={20} />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleBack} className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer">
              <ArrowLeft className="mr-2" size={16} />
              Kembali ke Daftar
            </button>
            <button onClick={handleSave} className="bg-primary-blueSoft text-white px-4 py-2 rounded flex items-center cursor-pointer">
              <Save className="mr-2" size={16} />
              Simpan
            </button>
          </div>
        </div>

        <div className="flex">
          <div className="w-[20%] h-50 text-white p-3 space-y-2">
            <div className="flex items-center bg-[#116E63]/30  mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.obeManagement.graduateProfile)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>Profil Lulusan</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.obeManagement.cpl)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>CPL</p>
            </div>
            <div className="flex items-center bg-[#116E63]/60 mb-1 text-black cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.obeManagement.cpmk)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p className="text-black font-semibold">CPMK</p>
            </div>
          </div>

          <div className="w-[80%] p-3">
            <div className="grid grid-cols-2 gap-2 bg-primary-green/10 p-4">
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Kode Prodi:</span>
                <span className="w-full text-left">MK001</span>
              </div>
              <div className="flex justify-between ml-8 ">
                <span className="font-semibold w-full text-left">Tahun Kurikulum:</span>
                <span className="w-full text-left">{selectedYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Program Studi:</span>
                <span className="w-full text-left">Pemrograman Lanjut</span>
              </div>
              <div className="flex justify-between ml-8">
                <span className="font-semibold w-full text-left">Ketua Prodi:</span>
                <span className="w-full text-left">1</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <h2 className="text-lg font-semibold">Tahun Kurikulum</h2>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="border border-black/50 rounded-md px-2 py-1 w-40">
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
              <button onClick={handleAddCpmkMatkul} disabled={isAdding} className={`ml-auto bg-primary-green text-white px-4 py-2 rounded flex items-center hover:bg-primary-blue ${isAdding ? " cursor-not-allowed" : ""}`}>
                <Plus className="mr-2" size={16} />
                Tambah CPMK
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <TableObeCpmkMatkul
                data={cpmkMatkulData}
                tableHead={["Kode CPMK", "Deskripsi", "Pemetaan PL", "Aksi"]}
                error="Data tidak ditemukan."
                isAdding={isAdding}
                onInputChange={handleInputChange}
                onCancelAdd={handleCancelAdd}
                onSaveNewCpmkMatkul={handleSaveNewCpmkMatkul}
                newCpmkMatkul={newCpmkMatkul}
                onSave={handleSaveNewCpmkMatkul}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ObeCpmkMatkul;
