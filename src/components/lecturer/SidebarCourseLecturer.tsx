import { useNavigate } from "react-router-dom";
import { LecturerRoute } from "../../types/VarRoutes";

interface SidebarCourseLecturerProps {
  mataKuliahId: string;
  activeTab: "data" | "cpl" | "cpmk" | "detailRps" | "rencanaPembelajaran" | "rencanaEvaluasi";
}

export default function SidebarCourseLecturer({ mataKuliahId, activeTab }: SidebarCourseLecturerProps) {
  const navigate = useNavigate();

  const menuItems = [
    { key: "data", label: "Data Mata Kuliah", path: `${LecturerRoute.courses.detailCourse}` },
    { key: "cpl", label: "Pemetaan CPL", path: `${LecturerRoute.courses.pemetaanCpl}/${mataKuliahId}` },
    { key: "cpmk", label: "Pemetaan CPMK", path: `${LecturerRoute.courses.pemetaanCpmk}/${mataKuliahId}` },
    { key: "detailRps", label: "Detail RPS", path: `${LecturerRoute.courses.detailRps}/${mataKuliahId}` },
    { key: "rencanaPembelajaran", label: "Rencana Pembelajaran", path: `${LecturerRoute.courses.rencanaPembelajaran}/${mataKuliahId}` },
    { key: "rencanaEvaluasi", label: "Rencana Evaluasi", path: `${LecturerRoute.courses.rencanaEvaluasi}/${mataKuliahId}` },
  ];

  return (
    <div className="w-full md:w-[20%] bg-white border border-gray-200 rounded-sm p-0 flex-shrink-0 overflow-hidden self-start">
      <div className="flex flex-col">
        {menuItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
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