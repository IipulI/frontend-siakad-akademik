import { useNavigate } from "react-router-dom";
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

  const menuItems = [
    {
      key: "pl",
      label: "Profil Lulusan",
      path: `${AdminAcademicRoute.obeManagement.detailOBE}/${id}`,
    },
    {
      key: "cpl",
      label: "CPL",
      path: `${AdminAcademicRoute.obeManagement.cpl}/${id}`,
    },
    {
      key: "cpmk",
      label: "CPMK",
      path: `${AdminAcademicRoute.obeManagement.cpmk}/${id}`,
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
