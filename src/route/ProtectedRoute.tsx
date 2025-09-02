import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({
  permission,
  children,
}: {
  permission: string;
  children: any;
}) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};
