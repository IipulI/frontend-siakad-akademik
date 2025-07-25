import { Navigate, useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../../types/VarRoutes";

export default function SidebarOBE({ id }) {
  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  return (
    <div className="w-full md:w-[20%] h-50 text-white p-3 space-y-2">
      <div
        className="flex items-center bg-[#116E63]/60 mb-1 text-black cursor-pointer"
        onClick={() =>
          handleNavigation(
            `${AdminAcademicRoute.obeManagement.detailOBE}/${id}`
          )
        }
      >
        <div className="w-1.5 h-10 bg-primary-green mr-3"></div>
        <p className="text-black font-semibold">Profil Lulusan</p>
      </div>
      <div
        className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer"
        onClick={() => handleNavigation(AdminAcademicRoute.obeManagement.cpl)}
      >
        <div className="w-1.5 h-10 bg-primary-green mr-3"></div>
        <p>CPL</p>
      </div>
      <div
        className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer"
        onClick={() => handleNavigation(AdminAcademicRoute.obeManagement.cpmk)}
      >
        <div className="w-1.5 h-10 bg-primary-green mr-3"></div>
        <p>CPMK</p>
      </div>
    </div>
  );
}
