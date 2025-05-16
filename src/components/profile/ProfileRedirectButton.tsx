import React from "react";
import { Link, useLocation } from "react-router-dom";

interface ProfileRedirectButtonProps {
  children: React.ReactNode;
  route: string;
}

export default function ProfileRedirectButton({ children, route }: ProfileRedirectButtonProps) {
  const location = useLocation();
  const isActive = location.pathname === route;

  return (
    <Link
      to={route}
      className={`py-3 px-2 w-full rounded-full text-center cursor-pointer transition-all ${
        isActive
          ? "bg-primary-green text-white shadow-md"
          : "bg-transparent text-primary-brown hover:bg-gray-200"
      }`}
    >
      {children}
    </Link>
  );
}
