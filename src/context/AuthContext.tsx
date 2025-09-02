import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  user: any;
  roles: string[];
  permissions: string[];
  setAuth: (data: any) => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);

  const setAuth = (data: any) => {
    setUser(data.user);

    const roleNames = data.detail.map((d: any) => d.role.name);
    setRoles(roleNames);

    // Ambil permission name berdasarkan role_has_permission
    const perms = data.detail.flatMap((d: any) => {
      const allowedIds = d.role_has_permission.map((p: any) => p.permission_id);
      return d.app_modul.permission
        .filter((perm: any) => allowedIds.includes(perm.id))
        .map((perm: any) => perm.name);
    });

    setPermissions(perms);
  };

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{ user, roles, permissions, setAuth, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
