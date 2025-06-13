import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { TableAnnouncement } from "../../../components/Table";
import { ArrowLeft, RefreshCw, Search } from "lucide-react";
import DetailAnnouncement from "../../../components/schedule/DetailAnnouncement";

export default function Announcement() {
  const [id, setId] = useState<string | null>(null);

  const tableHead = ["Tanggal", "Penulis", "Judul", "Aksi"];
  const data = [
    {
      id: 1,
      tanggal: "6 Mar 2025, 08:53:10",
      penulis: "Shesil Varista Dea Wulandari",
      judul: "[NEW] Cara Bayar Kuliah Melalui Shopee",
      aksi: "",
    },
    {
      id: 2,
      tanggal: "19 Nov 2024, 14:54:13",
      penulis: "Shesil Varista Dea Wulandari",
      judul: "Cara bayar kuliah melalui Tokopedia",
      aksi: "",
    },
    {
      id: 3,
      tanggal: "13 Nov 2024, 18:25:06",
      penulis: "Shesil Varista Dea Wulandari",
      judul: "Cara bayar kuliah melalui Bank Muamalat",
      aksi: "",
    },
  ];

  const dataDetail = id ? data.find((item) => parseInt(id) === item.id) : null;

  return (
    <MainLayout isGreeting={false} titlePage={"Pengumuman"} className={""}>
      <div className="w-full bg-white min-h-screen py-2 rounded-sm border-t-2 border-primary-yellow">
        <div className="px-2 gap-3 lg:gap-16 border-2 p-2 grid grid-cols-1 lg:grid-cols-3">
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
          {id && (
            <button
              onClick={() => setId(null)}
              className="bg-primary-blueSoft flex rounded-sm pl-2 cursor-pointer pr-4 items-center ml-auto text-white"
            >
              <ArrowLeft className="mr-4" />
              Kembali ke daftar
            </button>
          )}
        </div>
        {id ? (
          <DetailAnnouncement data={dataDetail} />
        ) : (
          <TableAnnouncement
            tableHead={tableHead}
            data={data}
            error={"error"}
            setId={setId}
          />
        )}
      </div>
    </MainLayout>
  );
}
