import React from "react";
import Biodata from "../../../components/Biodata";
import MainLayout from "../../../components/layouts/MainLayout";
import { Table } from "../../../components/Table";

export default function Retake() {
  const tableHead = [
    "No",
    "Kode MK",
    "Nama Mata Kuliah",
    "Priode",
    "SKS",
    "Semester",
    "Nilai",
  ];

  const data = [
    {
      no: 1,
      kodeMk: "TIF202",
      mataKuliah: "Metode Penelitian",
      priode: "2024 Genap",
      sks: 3,
      semester: "4",
      nilai: "D",
    },
  ];

  return (
    <MainLayout isGreeting={false} titlePage={"Mengulang"} className="">
      <div className="w-full bg-white min-h-screen py-4 rounded-sm border-t-2 border-primary-yellow">
        <Biodata showLine={false} />

        <Table
          tableHead={tableHead}
          data={data}
          error={"Mahasiswa tidak pernah mengulang mata kuiah"}
        />
      </div>
    </MainLayout>
  );
}
