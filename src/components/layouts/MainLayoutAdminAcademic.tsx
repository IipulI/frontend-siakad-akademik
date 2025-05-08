import { useEffect, useState } from "react";
import Breadcrumb from "../Breadcrumb";
import Header from "../Header";
import React from "react";

interface MainLayout {
  children: React.ReactNode;
  titlePage: string;
  className?: string;
}

export default function MainLayoutAdminAcademic({
  children,
  titlePage,
  className,
}: MainLayout) {
  return (
    <div className={`bg-primary-white min-h-screen ${className}`}>
      <Header />
      <div className="px-5 md:px-10 xl:px-40">
        <div className="py-4">
          <Breadcrumb />
          <div className="text-2xl flex">
            <h1 className="text-gray-text font-semibold">{titlePage}</h1>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
