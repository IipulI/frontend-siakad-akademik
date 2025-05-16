import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useNavigate } from "react-router-dom";
import { TableGraduateProfile } from "../../../components/Table";
import { Search, ArrowLeft, Save, Plus } from "lucide-react";

interface GraduateProfileData {
  id: string;
  kodePl: string;
  profilLulusan: string;
  profesi: string;
  deskripsi: string;
}

const GraduateProfile: React.FC = () => {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<GraduateProfileData[]>([{ id: "1", kodePl: "PL001", profilLulusan: "MK001", profesi: "Algoritma", deskripsi: "Aktif" }]);
  const [selectedYear, setSelectedYear] = useState("2024");

  // State untuk add inline
  const [isAdding, setIsAdding] = useState(false);
  const [newProfile, setNewProfile] = useState<GraduateProfileData>({
    id: "",
    kodePl: "",
    profilLulusan: "",
    profesi: "",
    deskripsi: "",
  });

  const handleBack = () => {
    navigate(AdminAcademicRoute.courseManagement.courseManagement);
  };

  const handleSave = () => {
    console.log("Data disimpan");
  };

  const handleAddProfile = () => {
    setIsAdding(true);
    setNewProfile({
      id: Date.now().toString(),
      kodePl: "",
      profilLulusan: "",
      profesi: "",
      deskripsi: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNewProfile = () => {
    // Validasi sederhana: minimal kodePl dan profilLulusan tidak kosong
    if (newProfile.kodePl.trim() === "" || newProfile.profilLulusan.trim() === "") {
      alert("Kode PL dan Profil Lulusan wajib diisi");
      return;
    }
    setProfileData((prev) => [...prev, newProfile]);
    setIsAdding(false);
    setNewProfile({
      id: "",
      kodePl: "",
      profilLulusan: "",
      profesi: "",
      deskripsi: "",
    });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewProfile({
      id: "",
      kodePl: "",
      profilLulusan: "",
      profesi: "",
      deskripsi: "",
    });
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <MainLayout isGreeting={false} titlePage="Profil Lulusan" className="">
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
            <button onClick={handleSave} className="bg-primary-blueSoft text-white px-4 py-2 rounded flex items-center">
              <Save className="mr-2" size={16} />
              Simpan
            </button>
          </div>
        </div>

        <div className="flex ">
          {/* Sidebar Menu */}
          <div className="w-[20%] h-50 text-white p-3 space-y-2">
            <div className="flex items-center bg-[#116E63]/60  mb-1 text-black cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.obeManagement.graduateProfile)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p className="text-black font-semibold">Profil Lulusan</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.obeManagement.cpl)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>CPL </p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.obeManagement.cpmk)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>CPMK</p>
            </div>
          </div>

          {/* Detail Data Mata Kuliah */}
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
              <button onClick={handleAddProfile} disabled={isAdding} className={`ml-auto bg-primary-green text-white px-4 py-2 rounded flex items-center hover:bg-primary-blue ${isAdding ? "opacity-50 cursor-not-allowed" : ""}`}>
                <Plus className="mr-2" size={16} />
                Tambah Profil Lulusan
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <TableGraduateProfile
                data={profileData}
                tableHead={["Kode PL", "Profil Lulusan", "Profesi", "Deskripsi", "Aksi"]}
                error="Data tidak ditemukan."
                isAdding={isAdding}
                onInputChange={handleInputChange}
                onCancelAdd={handleCancelAdd}
                onSaveNewProfile={handleSaveNewProfile}
                newProfile={newProfile}
                onSave={handleSaveNewProfile}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GraduateProfile;
