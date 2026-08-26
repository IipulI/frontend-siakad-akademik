import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { getJenjang } from "../../../hooks/academic/useJenjang";
import { useBatasSks } from "../../../hooks/academic/useKurikulumProdi";
import LoadingSpinner from "../../../components/LoadingSpinner";
import TahunKurikulumSidebar from "../../../components/admin-academic/academic/obe/TahunKurikulumSidebar";
import TabSkalaNilai from "../../../components/admin-academic/academic/obe/TabSkalaNilai";
import TabBatasSks from "../../../components/admin-academic/academic/obe/TabBatasSks";
import TabPredikatKelulusan from "../../../components/admin-academic/academic/obe/TabPredikatKelulusan";
import TabAturanEvaluasi from "../../../components/admin-academic/academic/obe/TabAturanEvaluasi";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useSetBreadcrumbLabel } from "../../../context/BreadcrumbLabelContext";

type TabKey = "skalaNilai" | "batasSks" | "predikat" | "aturan";

const TAB_LABELS: Record<TabKey, string> = {
  skalaNilai: "Skala Nilai",
  batasSks: "Batas SKS",
  predikat: "Predikat Kelulusan",
  aturan: "Aturan Evaluasi",
};

export default function ObeKetentuanAkademik() {
  const navigate = useNavigate();
  const { id, jenjangId } = useParams<{ id: string; jenjangId: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>("skalaNilai");

  const { data: jenjangData = [] } = getJenjang();
  const jenjang = jenjangData.find((j: any) => j.id === jenjangId) as any;
  const jenjangLabel = jenjang ? `${jenjang.jenjang} - ${jenjang.nama}` : "";

  const { data } = useBatasSks(jenjangId!, id!, !!jenjangId && !!id);
  const header = data?.header;
  useSetBreadcrumbLabel(id, header?.kurikulum);
  useSetBreadcrumbLabel(jenjangId, jenjangLabel || undefined);

  const handleBack = () => navigate(AdminAcademicRoute.obeManagement.tahunKurikulum);

  return (
    <MainLayout isGreeting={false} titlePage={`${TAB_LABELS[activeTab]}${jenjangLabel ? ` (${jenjangLabel})` : ""}`}>
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex flex-col items-center justify-between mb-6 md:flex-row gap-4">
          <div className="flex items-center">
            <button onClick={handleBack} className="flex items-center bg-primary-yellow text-white px-2 py-3 rounded-l-md">
              <ArrowLeft className="mr-2" size={16} />
            </button>
            <div className="flex items-center">
              <input
                type="search"
                placeholder="Cari Tahun Kurikulum"
                className="px-3 py-2 border border-black/50 w-64"
                onChange={() => {}}
              />
              <button className="bg-primary-blueSoft px-3 py-3 rounded-r-md">
                <Search color="white" size={20} />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleBack} className="bg-primary-blueSoft text-white px-4 py-2 rounded flex items-center cursor-pointer">
              <ArrowLeft className="mr-2" size={16} />
              Kembali ke Daftar
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <TahunKurikulumSidebar tahunKurikulumId={id!} activeSection="ketentuan" activeJenjangId={jenjangId} />

          {/* Content */}
          <div className="w-full md:w-[80%]">
            {!header ? (
              <div className="flex justify-center p-12">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-2 bg-primary-green/10 p-4 md:grid-cols-2 mb-6">
                  <div className="flex justify-between">
                    <span className="font-semibold w-full text-left">Kurikulum:</span>
                    <span className="w-full text-left">{header.kurikulum}</span>
                  </div>
                  <div className="flex justify-between md:ml-8">
                    <span className="font-semibold w-full text-left">Tanggal Awal:</span>
                    <span className="w-full text-left">{header.tanggalAwal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold w-full text-left">Keterangan:</span>
                    <span className="w-full text-left">{header.keterangan}</span>
                  </div>
                  <div className="flex justify-between md:ml-8">
                    <span className="font-semibold w-full text-left">Tanggal Akhir:</span>
                    <span className="w-full text-left">{header.tanggalAkhir}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold w-full text-left">Mulai Berlaku:</span>
                    <span className="w-full text-left">{header.mulaiBerlaku}</span>
                  </div>
                </div>

                <div className="flex gap-1 mb-0 flex-wrap">
                  {(Object.keys(TAB_LABELS) as TabKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`px-4 py-2 text-sm font-semibold rounded-t-md border border-b-0 ${
                        activeTab === key
                          ? "bg-primary-blueDark text-white border-primary-blueDark"
                          : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {TAB_LABELS[key]}
                    </button>
                  ))}
                </div>

                <div className="border border-gray-200 rounded-b-sm rounded-tr-sm p-4">
                  {activeTab === "skalaNilai" && <TabSkalaNilai jenjangId={jenjangId!} tahunKurikulumId={id!} />}
                  {activeTab === "batasSks" && <TabBatasSks jenjangId={jenjangId!} tahunKurikulumId={id!} />}
                  {activeTab === "predikat" && <TabPredikatKelulusan jenjangId={jenjangId!} tahunKurikulumId={id!} />}
                  {activeTab === "aturan" && <TabAturanEvaluasi jenjangId={jenjangId!} tahunKurikulumId={id!} />}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
