// src/pages/studentModule/academic/Retake.tsx

import React from "react";
import Biodata from "../../../components/biodata/Biodata";
import MainLayout from "../../../components/layouts/MainLayout";
import { Table } from "../../../components/Table";
import { useStudentRetakeData } from "../../../hooks/mahasiswa/useStudentRetakeData";

export default function Retake() {
  // The hook now returns the clean, flattened data
  const { biodata, retakeCourses, isLoading, isError, error } = useStudentRetakeData();

  const tableHead = [
    "No",
    "Kode MK",
    "Nama Mata Kuliah",
    "Priode",
    "SKS",
    "Semester",
    "Nilai",
  ];

  const tableError = isError
      ? `Gagal memuat data. Silakan coba lagi.`
      : "Mahasiswa tidak pernah mengulang mata kuliah";

  return (
    <MainLayout isGreeting={false} titlePage={"Mengulang"} className="">
      <div className="w-full bg-white min-h-screen py-4 rounded-sm border-t-2 border-primary-yellow">
        <Biodata showLine={false} />

        <div className="mt-6 overflow-auto">
          {isLoading ? (
              <p className="text-center p-4">Memuat data mata kuliah...</p>
          ) : (
              <Table
                  tableHead={tableHead}
                  data={retakeCourses}
                  error={tableError}
              />
          )}
        </div>
      </div>
    </MainLayout>
  );
}

//           <Biodata biodata={biodata} isLoading={isLoading} showLine={false} />