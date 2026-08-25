import { useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../../types/VarRoutes";
import { getPemetaanCpmk } from "../../../../hooks/academic/useObeCpmkMk";

interface SidebarObeCourseProps {
  obeId: string;
  mataKuliahId: string;
  activeTab: "data" | "cpl" | "cpmk" | "detailRps" | "rencanaPembelajaran" | "rencanaEvaluasi";
}

export default function SidebarObeCourse({ obeId, mataKuliahId, activeTab }: SidebarObeCourseProps) {
  const navigate = useNavigate();

  // Reuse query cache dari getPemetaanCpmk (dipakai juga di halaman Pemetaan CPMK)
  // buat tau prodi mata kuliah ini udah di-set OBE apa belum -- tab yang isinya
  // butuh OBE dipudarkan warnanya sebagai tanda gak ada gunanya dibuka.
  const { data: mappingData } = getPemetaanCpmk(mataKuliahId || "");
  const isObe = mappingData?.isObe !== false;

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
      butuhObe: false,
    },
    {
      key: "cpl",
      label: "Pemetaan CPL",
      path: `${AdminAcademicRoute.obeManagement.cplMataKuliah}/${finalObeId}/${mataKuliahId}`,
      butuhObe: true,
    },
    {
      key: "cpmk",
      label: "Pemetaan CPMK",
      path: `${AdminAcademicRoute.obeManagement.cpmkMataKuliah}/${finalObeId}/${mataKuliahId}`,
      butuhObe: true,
    },
    {
      key: "detailRps",
      label: "Detail RPS",
      path: `${AdminAcademicRoute.obeManagement.detailRps}/${finalObeId}/${mataKuliahId}`,
      butuhObe: false,
    },
    {
      key: "rencanaPembelajaran",
      label: "Rencana Pembelajaran",
      path: `${AdminAcademicRoute.obeManagement.rencanaPembelajaran}/${finalObeId}/${mataKuliahId}`,
      butuhObe: false,
    },
    {
      key: "rencanaEvaluasi",
      label: "Rencana Evaluasi",
      path: `${AdminAcademicRoute.obeManagement.rencanaEvaluasi}/${finalObeId}/${mataKuliahId}`,
      butuhObe: false,
    },
  ];

  return (
    <div className="w-full md:w-[20%] bg-white border border-gray-200 rounded-sm p-0 flex-shrink-0 overflow-hidden self-start">
      <div className="flex flex-col">
        {menuItems.map((item) => {
          const isActive = activeTab === item.key;
          const isMuted = item.butuhObe && !isObe;
          return (
            <button
              key={item.key}
              onClick={() => handleNavigation(item.path)}
              title={isMuted ? "Prodi mata kuliah ini belum di-set OBE untuk tahun kurikulumnya" : undefined}
              className={`w-full text-left px-4 py-3 text-xs font-semibold border-b border-gray-100 transition-colors duration-150 cursor-pointer ${
                isActive
                  ? "bg-[#eef5f9] text-[#00c0ef] border-l-4 border-[#00c0ef] font-bold"
                  : isMuted
                    ? "bg-white text-gray-300 hover:bg-gray-50 hover:text-gray-400 border-l-4 border-transparent"
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
