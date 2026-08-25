import { ChevronRight, House } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AdminFinanceRoute,
  StudentRoute,
  AdminAcademicRoute,
} from "../types/VarRoutes";
import { useBreadcrumbLabels } from "../context/BreadcrumbLabelContext";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function Breadcrumb() {
  const location = useLocation();
  const { labels } = useBreadcrumbLabels();
  // Path lengkap (termasuk segmen ID) dipakai buat bangun link yang benar --
  // segmen ID cuma disembunyikan dari LABEL kalau belum ada nama pengganti
  // yang didaftarkan halaman terkait lewat useSetBreadcrumbLabel.
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Jika hanya "/dashboard", gaperlu ada breadcrumb
  if (pathnames.length === 1 && pathnames[0] === "dashboard") {
    return null;
  }

  const isAdminFinance = pathnames.includes("admin-finance");
  const isAdminAcademic = pathnames.includes("admin-academic");

  let baseRoute = StudentRoute.dashboard;
  if (isAdminFinance) {
    baseRoute = AdminFinanceRoute.dashboardAdminFinance;
  } else if (isAdminAcademic) {
    baseRoute = AdminAcademicRoute.dashboardAdminAcademic;
  }

  // "default" itu bukan ID/nama entitas beneran, cuma placeholder fallback
  // param obeId yang gak pernah keisi -- gak ada gunanya ditampilin.
  const isVisible = (name: string) =>
    (!UUID_PATTERN.test(name) && name.toLowerCase() !== "default") || !!labels[name];

  const lastVisibleIndex = (() => {
    for (let i = pathnames.length - 1; i >= 0; i--) {
      if (isVisible(pathnames[i])) return i;
    }
    return -1;
  })();

  return (
    <div className="flex space-x-2 text-sm">
      <Link to={baseRoute} className="text-blue-500">
        <House color="#939396" size={18} />
      </Link>
      {pathnames.length > 0 && <span></span>}

      {pathnames.map((name, index) => {
        if (!isVisible(name)) return null;

        // Segmen terakhir yang punya label tetap harus mengarah ke URL LENGKAP
        // (termasuk ID setelahnya kalau ada), bukan cuma potongan sampai sini,
        // supaya link-nya gak mentok ke halaman tanpa parameter ID yang wajib.
        const routeTo =
          index === lastVisibleIndex
            ? location.pathname
            : `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === lastVisibleIndex;
        const displayName = labels[name] || decodeURIComponent(name);

        return (
          <div key={routeTo + index} className="flex space-x-2 items-center">
            <ChevronRight size={10} />
            <Link
              to={routeTo}
              className={`${
                isLast ? "text-[#444444]" : "text-[#939396]"
              } ${labels[name] ? "" : "capitalize"}`}
            >
              {displayName}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
