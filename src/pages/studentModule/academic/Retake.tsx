import React from "react";
import Biodata from "../../../components/Biodata";
import MainLayout from "../../../components/layouts/MainLayout";
import Table from "../../../components/Table";

export default function Retake() {
  const tableHead = [
    "No",
    "Kode MK",
    "Nama Mata Kuliah",
    "Kelas",
    "SKS",
    "Hari",
    "Jam",
    "Ruangan",
    "Dosen Pengajar",
  ];

  return (
    <MainLayout isGreeting={false} titlePage={"Mengulang"} className="">
      <div className="w-full bg-white min-h-screen py-2 rounded-2xl border-t-2 border-primary-green">
        <Biodata />

        <Table
          tableHead={tableHead}
          data={[]}
          error={"Mahasiswa tidak pernah mengulang mata kuiah"}
        />
      </div>
    </MainLayout>
  );
}
