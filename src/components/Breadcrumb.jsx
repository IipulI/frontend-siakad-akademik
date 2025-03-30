import { Link, useLocation } from "react-router-dom";

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Jika hanya "/dashboard", gaperlu ada breadcrumb
  if (pathnames.length === 1 && pathnames[0] === "dashboard") {
    return null;
  }

  return (
    <div className="flex space-x-2 text-sm">
      <Link to="/dashboard" className="text-blue-500">
        Dashboard
      </Link>
      {pathnames.length > 0 && <span>-</span>}

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;

        return (
          <div key={routeTo} className="flex space-x-2">
            <Link to={routeTo} className="text-blue-500 capitalize">
              {decodeURIComponent(name)}
            </Link>
            {index < pathnames.length - 1 && <span>-</span>}
          </div>
        );
      })}
    </div>
  );
}
