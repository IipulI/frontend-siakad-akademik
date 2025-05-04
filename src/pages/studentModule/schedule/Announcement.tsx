import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { Table } from "../../../components/Table";
import { RefreshCw, Search } from "lucide-react";

export default function Announcement() {
  const tableHead = ["Tanggal", "Penulis", "Judul", "Aksi"];
  const data = [
    {
      tanggal: "6 Mar 2025, 08:53:10",
      penulis: "Shesil Varista Dea Wulandari",
      judul: "[NEW] Cara Bayar Kuliah Melalui Shopee",
      aksi: "",
    },
    {
      tanggal: "19 Nov 2024, 14:54:13",
      penulis: "Shesil Varista Dea Wulandari",
      judul: "Cara bayar kuliah melalui Tokopedia",
      aksi: "",
    },
    {
      tanggal: "13 Nov 2024, 18:25:06",
      penulis: "Shesil Varista Dea Wulandari",
      judul: "Cara bayar kuliah melalui Bank Muamalat",
      aksi: "",
    },
  ];
  return (
    <MainLayout isGreeting={false} titlePage={"Pengumuman"} className={""}>
      <div className="w-full bg-white min-h-screen py-2 rounded-sm border-t-2 border-primary-yellow">
        <div className="flex px-2 justify-start gap-16 border-2 p-2">
          <select className="rounded px-3 text-primary-brown border-primary-brown border p-1">
            <option value={"semua"}>-Semua-</option>
          </select>
          <div className="flex">
            <input
              type="search"
              placeholder="Cari Pengumuman"
              className="px-2 py-1 w-70 rounded shadow-md border border-black/50"
            />
            <button className="-ml-2 bg-[#00A65A] w-10 flex items-center justify-center">
              <Search color="white" size={20} />
            </button>
            <button className="bg-primary-blueDark rounded-r-md w-10 flex items-center justify-center">
              <RefreshCw color="white" size={20} />
            </button>
          </div>
        </div>
        <Table tableHead={tableHead} data={data} error={"error"} />
      </div>
    </MainLayout>
  );
}
