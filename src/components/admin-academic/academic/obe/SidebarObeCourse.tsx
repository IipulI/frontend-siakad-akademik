import { useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../../types/VarRoutes";

interface SidebarObeCourseProps {
  obeId: string;
  mataKuliahId: string;
  activeTab: "data" | "cpl" | "cpmk" | "detailRps" | "rencanaPembelajaran" | "rencanaEvaluasi";
}

export default function SidebarObeCourse({ obeId, mataKuliahId, activeTab }: SidebarObeCourseProps) {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Safe fallback if obeId is empty/null/undefined
  const finalObeId = obeId || "default";

  // Menu items list matching the exact sidebar in the screenshots
  const menuItems = [
    {
      key: "data",
      label: "Data Mata Kuliah",
      path: `${AdminAcademicRoute.obeManagement.detailObeCourse}/${finalObeId}/${mataKuliahId}`,
    },
    {
      key: "cpl",
      label: "Pemetaan CPL",
      path: `${AdminAcademicRoute.obeManagement.cplMataKuliah}/${finalObeId}/${mataKuliahId}`,
    },
    {
      key: "cpmk",
      label: "Pemetaan CPMK",
      path: `${AdminAcademicRoute.obeManagement.cpmkMataKuliah}/${finalObeId}/${mataKuliahId}`,
    },
    {
      key: "detailRps",
      label: "Detail RPS",
      path: `${AdminAcademicRoute.obeManagement.detailRps}/${finalObeId}/${mataKuliahId}`,
    },
    {
      key: "rencanaPembelajaran",
      label: "Rencana Pembelajaran",
      path: `${AdminAcademicRoute.obeManagement.rencanaPembelajaran}/${finalObeId}/${mataKuliahId}`,
    },
    {
      key: "rencanaEvaluasi",
      label: "Rencana Evaluasi",
      path: `${AdminAcademicRoute.obeManagement.rencanaEvaluasi}/${finalObeId}/${mataKuliahId}`,
    },
  ];

  return (
    <div className="w-full md:w-[20%] bg-white border border-gray-200 rounded-sm p-0 flex-shrink-0 overflow-hidden self-start">
      <div className="flex flex-col">
        {menuItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleNavigation(item.path)}
              className={`w-full text-left px-4 py-3 text-xs font-semibold border-b border-gray-100 transition-colors duration-150 cursor-pointer ${
                isActive
                  ? "bg-[#eef5f9] text-[#00c0ef] border-l-4 border-[#00c0ef] font-bold"
                  : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
