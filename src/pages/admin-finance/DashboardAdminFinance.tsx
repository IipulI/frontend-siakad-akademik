import React, { useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import ButtonClick from "../../components/admin-academic/student-data/ButtonClick";
import { Check, Search, X } from "lucide-react";
import Card from "../../components/admin-academic/dashboard/Card";
import { Pagination } from "../../components/admin-academic/Pagination";
import FacultyBill from "../../components/admin-finance/facultyBill";
import LastTransaction from "../../components/admin-finance/LastTransaction";

const DashboardAdminFinance = () => {
  function SearchSubmit() {
    alert("oke");
  }

  const dataTagihan = [
    {
      tanggal: "12/04/2025",
      kodeTagihan: "INV/20242/0000001",
      nim: "221106041234",
      nama: "MUHAMMAD RIDHO FATHAN",
      jenisTagihan: "SPP",
      nominal: "Rp 2.000.000",
      bayar: "Rp 2.000.000",
      lunas: true,
    },
    {
      tanggal: "12/04/2025",
      kodeTagihan: "INV/20242/0000002",
      nim: "221106041234",
      nama: "MUHAMMAD RIDHO FATHAN",
      jenisTagihan: "Ujian",
      nominal: "Rp 900.000",
      bayar: "Rp 900.000",
      lunas: false,
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <MainLayout titlePage={"Beranda"} isGreeting={false}>
      <div className="border-t-2 border-primary-green rounded-sm py-2">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-10 border-2 p-2">
          <select
            name=""
            id=""
            className="p-1 text-xs border-1 rounded w-22 text-gray-500"
          >
            <option value="semua">- Semua -</option>
          </select>

          <div className="flex items-center">
            <input
              type="text"
              className="border-2 p-1 rounded text-xs w-50  "
              placeholder="Cari Data Tagihan"
            />
            <ButtonClick
              icon={<Search size={16} strokeWidth={3} />}
              color="bg-primary-blueDark"
              onClick={SearchSubmit}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:px-40 my-7">
          <Card
            title="Total Tagihan"
            value="16.6 M"
            color="bg-primary-blueSoft"
          />
          <Card
            title="total Tagihan Terbayar"
            value="10 M"
            color="bg-primary-yellow"
          />
          <Card
            title="Total Tagihan Belum Terbayar"
            value="6.6 M"
            color="bg-red-500"
          />
        </div>

        <div className="border-2 p-2 shadow-sm">
          <h1 className="font-semibold text-lg sm:text-xl">
            Data Tagihan 30 Hari Terakhir
          </h1>
          {/* table */}
          <div className=" overflow-x-auto mt-3">
            <table className="w-full">
              <tbody>
                <tr className="bg-primary-green text-white">
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                    Tanggal
                  </td>
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                    Kode Tagihan
                  </td>
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                    NIM
                  </td>
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                    Nama
                  </td>
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                    Jenis Tagihan
                  </td>
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                    Nominal
                  </td>
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                    Bayar
                  </td>
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                    Lunas
                  </td>
                  <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                    Aksi
                  </td>
                </tr>
                {dataTagihan.map((data) => (
                  <tr>
                    <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                      {data.tanggal}
                    </td>
                    <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                      {data.kodeTagihan}
                    </td>
                    <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                      {data.nim}
                    </td>
                    <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                      {data.nama}
                    </td>
                    <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                      {data.jenisTagihan}
                    </td>
                    <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                      {data.nominal}
                    </td>
                    <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                      {data.bayar}
                    </td>
                    <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                      <div className="flex justify-center">
                        {data.lunas == true ? (
                          <Check color="green" />
                        ) : (
                          <X color="red" />
                        )}
                      </div>
                    </td>
                    <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                      aksi
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            <Pagination
              currentPage={currentPage}
              totalPages={1000}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              totalRows={65}
              onRowsPerPageChange={setRowsPerPage}
            />
        </div>

        <div className="grid grid-cols-7 mt-7 gap-10 mb-10">
          <FacultyBill />
          <LastTransaction/>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardAdminFinance;
