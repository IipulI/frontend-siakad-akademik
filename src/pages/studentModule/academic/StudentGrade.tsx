// src/pages/studentModule/academic/StudentGrade.tsx
import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import Biodata from "../../../components/biodata/Biodata";
import StudentGradeTable from "../../../components/student/StudentGradeTable"; // Assuming you moved the table
import { useStudentGradeData } from "../../../hooks/mahasiswa/useStudentGradeData";
import { useStudentRetakeData } from "../../../hooks/mahasiswa/useStudentRetakeData"; // To get biodata

const StudentGrade = () => {
  // Hook for getting grades data and period filter
  const {
    periods,
    grades,
    selectedPeriod,
    setSelectedPeriod,
    isLoading: isLoadingGrades,
    isError,
  } = useStudentGradeData();

  // Hook for getting the student's biodata
  const { biodata, isLoading: isLoadingBiodata } = useStudentRetakeData();

  return (
      <MainLayout isGreeting={false} titlePage={"Nilai Mahasiswa"} className="">
        <div className="w-full bg-white min-h-screen py-4 rounded-sm border-t-2 border-primary-yellow space-y-4">
          <Biodata biodata={biodata} isLoading={isLoadingBiodata} showLine={false} />

          <div className="flex justify-start space-x-2 border p-3 items-center">
            <p className="font-semibold text-primary-green">
              Periode:
            </p>
            <select
                className="bg-white px-2 text-gray-500 p-1 rounded border-2 text-center cursor-pointer"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                disabled={isLoadingGrades}
            >
              {periods.map((period) => (
                  <option key={period.id} value={period.nama || period.namaPeriode}>
                    {period.nama || period.namaPeriode}
                  </option>
              ))}
            </select>
          </div>

          {isLoadingGrades && <p className="text-center p-4">Memuat data nilai...</p>}
          {isError && <p className="text-center p-4 text-red-500">Gagal memuat data nilai.</p>}

          {!isLoadingGrades && !isError && (
              <StudentGradeTable data={grades} />
          )}
        </div>
      </MainLayout>
  );
};

export default StudentGrade;