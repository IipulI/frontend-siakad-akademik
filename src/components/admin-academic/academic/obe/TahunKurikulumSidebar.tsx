import React from "react";
import { useNavigate } from "react-router-dom";
import { getJenjang } from "../../../../hooks/academic/useJenjang";
import { AdminAcademicRoute } from "../../../../types/VarRoutes";

type Section = "tahun" | "cplUmum" | "ketentuan";

interface Props {
  tahunKurikulumId: string;
  activeSection: Section;
  activeJenjangId?: string;
}

const activeClass = "w-full text-left px-4 py-3 text-xs font-bold bg-[#eef5f9] text-[#00c0ef] border-l-4 border-[#00c0ef] border-b border-gray-100";
const inactiveClass = "w-full text-left px-4 py-3 text-xs font-semibold text-gray-600 hover:bg-gray-50 border-b border-gray-100";

export default function TahunKurikulumSidebar({ tahunKurikulumId, activeSection, activeJenjangId }: Props) {
  const navigate = useNavigate();
  const { data: jenjangData = [] } = getJenjang();

  return (
    <div className="w-full md:w-[20%] bg-white border border-gray-200 rounded-sm overflow-hidden self-start flex-shrink-0">
      <div className="flex flex-col">
        <button
          onClick={() => navigate(`${AdminAcademicRoute.obeManagement.tahunKurikulumDetail}/${tahunKurikulumId}`)}
          className={activeSection === "tahun" ? activeClass : inactiveClass}
        >
          Tahun Kurikulum
        </button>
        <button
          onClick={() => navigate(`${AdminAcademicRoute.obeManagement.cplUmum}/${tahunKurikulumId}`)}
          className={activeSection === "cplUmum" ? activeClass : inactiveClass}
        >
          CPL Umum
        </button>
        <div className={`w-full text-left px-4 py-3 text-xs border-b border-gray-100 ${activeSection === "ketentuan" ? "font-bold text-gray-800" : "font-semibold text-gray-600"}`}>
          Ketentuan Akademik
        </div>
        {jenjangData.map((j: any) => {
          const isActive = activeSection === "ketentuan" && activeJenjangId === j.id;
          return (
            <button
              key={j.id}
              onClick={() => navigate(`${AdminAcademicRoute.obeManagement.ketentuanAkademik}/${tahunKurikulumId}/${j.id}`)}
              className={
                isActive
                  ? "w-full text-left pl-6 pr-4 py-2 text-xs font-bold bg-[#eef5f9] text-[#00c0ef] border-l-4 border-[#00c0ef] border-b border-gray-50"
                  : "w-full text-left pl-6 pr-4 py-2 text-xs text-gray-500 hover:bg-gray-50 border-b border-gray-50"
              }
            >
              &#8627; {j.jenjang} - {j.nama}
            </button>
          );
        })}
      </div>
    </div>
  );
}
