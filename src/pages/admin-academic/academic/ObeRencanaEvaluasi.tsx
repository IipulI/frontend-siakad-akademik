import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../../api/Index";
import { ArrowLeft, Search, Plus, Settings, Sparkles } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SidebarObeCourse from "../../../components/admin-academic/academic/obe/SidebarObeCourse";
import { AdminAcademicRoute } from "../../../types/VarRoutes";

export default function ObeRencanaEvaluasi() {
  const { obeId, mataKuliahId } = useParams<{ obeId: string; mataKuliahId: string }>();
  const navigate = useNavigate();
  const [selectedPeriode, setSelectedPeriode] = useState<string>("all");

  const handleBack = () => {
    navigate(AdminAcademicRoute.obeManagement.obeManagement);
  };

  return (
    <MainLayout isGreeting={false} titlePage="Rencana Evaluasi">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">
            Admin - Akademik &gt; Obe &gt; Manajemen Obe &gt; Rencana Evaluasi
          </p>
        </div>

        {/* Action Header */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center w-full md:w-auto">
              <button 
                onClick={handleBack} 
                className="bg-primary-yellow text-white p-2.5 rounded-l-md flex items-center justify-center hover:bg-opacity-90"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Cari Evaluasi"
                  className="p-2 pl-3 border border-gray-300 rounded-none text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white w-64 text-gray-700"
                />
                <button className="bg-primary-blueDark text-white p-2.5 rounded-r-md flex items-center justify-center hover:bg-opacity-90">
                  <Search size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
              <button onClick={handleBack} className="bg-[#00c0ef] text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <ArrowLeft size={16} /> Kembali ke Daftar
              </button>
              <button className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <Plus size={16} /> Menambahkan
              </button>
              <button className="bg-primary-yellow text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <Settings size={16} /> Tindakan <span className="text-[10px]">▼</span>
              </button>
              <button className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <Sparkles size={16} /> Hasilkan AI
              </button>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            
            <SidebarObeCourse 
              obeId={obeId || "default"}
              mataKuliahId={mataKuliahId || ""}
              activeTab="rencanaEvaluasi"
            />
            
            <div className="w-full md:w-[80%]">
              <div className="flex items-center justify-center h-64 border border-gray-200 rounded-md bg-gray-50">
                <p className="text-gray-500">Data Rencana Evaluasi Belum Tersedia</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
