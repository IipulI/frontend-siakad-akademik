import { Navigate, useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../../types/VarRoutes";

interface SidebarOBEProps {
  id: string;
  activeTab: "pl" | "cpl" | "cpmk";
}

export default function SidebarOBE({ id, activeTab }: SidebarOBEProps) {
  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  return (
    <div className="w-full md:w-[20%] h-50 text-white p-3 space-y-2">
      <div
        className={`flex items-center mb-1 cursor-pointer ${
          activeTab === "pl" ? "bg-[#116E63]/60 text-black" : "bg-[#116E63]/30 text-gray-600"
        }`}
        onClick={() =>
          handleNavigation(
            `${AdminAcademicRoute.obeManagement.detailOBE}/${id}`
          )
        }
      >
        <div className="w-1.5 h-10 bg-primary-green mr-3"></div>
        <p className={activeTab === "pl" ? "text-black font-semibold" : ""}>Profil Lulusan</p>
      </div>
      <div
        className={`flex items-center mb-1 cursor-pointer ${
          activeTab === "cpl" ? "bg-[#116E63]/60 text-black" : "bg-[#116E63]/30 text-gray-600"
        }`}
        onClick={() => handleNavigation(`${AdminAcademicRoute.obeManagement.cpl}/${id}`)}
      >
        <div className="w-1.5 h-10 bg-primary-green mr-3"></div>
        <p className={activeTab === "cpl" ? "text-black font-semibold" : ""}>CPL</p>
      </div>
      <div
        className={`flex items-center mb-1 cursor-pointer ${
          activeTab === "cpmk" ? "bg-[#116E63]/60 text-black" : "bg-[#116E63]/30 text-gray-600"
        }`}
        onClick={() => handleNavigation(`${AdminAcademicRoute.obeManagement.cpmk}/${id}`)}
      >
        <div className="w-1.5 h-10 bg-primary-green mr-3"></div>
        <p className={activeTab === "cpmk" ? "text-black font-semibold" : ""}>CPMK</p>
      </div>
    </div>
  );
}
