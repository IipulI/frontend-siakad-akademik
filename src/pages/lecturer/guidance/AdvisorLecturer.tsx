import MainLayout from "../../../components/layouts/MainLayout";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { Check, Eye, Pen, RefreshCw, Search, Settings, X } from "lucide-react";
import { useState } from "react";
import { Pagination } from "../../../components/admin-academic/Pagination";
import React from "react";
import DetailAdvisorLecturer from "./DetailAdvisorLecturer";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../../../hooks/useDebounce";
import { Api } from "../../../api/Index";

export default function AdvisorLecturer() {
  const [id, setId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 1000);

  const { data: studentData, isPending } = useQuery({
    queryKey: ["dosen/pembimbing-akademik/all", currentPage, debouncedSearch],
    queryFn: () => Api.get(`/dosen/pembimbing-akademik/all?page=${currentPage}&keyword=${debouncedSearch}`),
  });

  const filterOptions = [
    {
      label: "Periode Akademik",
      options: [{ value: "", label: "2025 Ganjil" }],
    },
    {
      label: "Status Pembimbing",
      options: [{ value: "", label: "-- Semua Status Pembimbing --" }],
    },
    { label: "Semester", options: [{ value: "", label: "-- Semua Semester --" }] },
    {
      label: "Unit kerja",
      options: [{ value: "", label: "Universitas Ibn Khaldun" }],
    },
    {
      label: "Status KRS",
      options: [{ value: "", label: "-- Semua Status KRS --" }],
    },
    {
      label: "Status Mahasiswa",
      options: [{ value: "", label: "-- Semua Status Mahasiswa --" }],
    },
    { label: "Angkatan", options: [{ value: "", label: "-- Semua Angkatan --" }] },
  ];

  function Edit() {
    alert("oke edit");
  }


  return (
    <MainLayout isGreeting={false} titlePage="Pembimbing Akademik">
      {!id ? (
        <>
          <div className="grid xl:grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
            {filterOptions.map((filter, index) => (
              <InputFilter
                key={index}
                options={filter.options}
                label={filter.label}
              />
            ))}
          </div>

          <div className="border-t-2 border-primary-green bg-white mt-5 p-2 py-4 rounded-sm shadow-sm pb-4">
            <div className="flex justify-between">
              <div className="flex gap-8">
                <select className="rounded px-1 lg:px-3 lg:text-base appearance-none text-primary-brown text-xs border-primary-brown border p-1">
                  <option value={"Semua"}>Semua</option>
                </select>
                <div className="flex">
                  <input
                    type="search"
                    placeholder="Cari Mahasiswa"
                    className="px-2 py-1 lg:w-70 w-40 text-xs lg:text-base rounded shadow-md border border-black/50"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="-ml-2 bg-[#00A65A] w-10 flex items-center justify-center">
                    <Search color="white" size={20} />
                  </button>
                  <button
                    className="bg-primary-blueDark rounded-r-md w-10 flex items-center justify-center"
                  >
                    <RefreshCw
                      color="white"
                      size={20}
                      className={isPending ? "animate-spin" : ""}
                    />
                  </button>
                </div>
              </div>

              <div className="flex bg-primary-yellow items-center rounded p-1 px-2">
                <Settings color="white" size={17} />
                <select
                  name=""
                  id=""
                  className=" text-white rounded font-semibold text-sm w-16"
                >
                  <option value="" className="bg-white text-black">
                    Aksi
                  </option>
                  <option value="" className="bg-white text-black">
                    Setujui KRS
                  </option>
                  <option value="" className="bg-white text-black">
                    Batalkan KRS
                  </option>
                  <option value="" className="bg-white text-black">
                    Pembimbing Akademik
                  </option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center w-6">
                      <input type="checkbox" className="w-4 h-4" />
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      Nama Mahasiswa
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      Angkatan
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      Status Smt
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      Smt
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      Batas SKS
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      Total SKS
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      IPS
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      IPK
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      KRS Diajukan
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      KRS Disahkan
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      Pembimbing Akademik
                    </th>
                    <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isPending ? (
                    <tr>
                      <td colSpan={13} className="text-center py-4">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    studentData?.data.data.map((record: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          <input type="checkbox" className="w-4 h-4" />
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-sm">
                          {record.mahasiswa}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record.angkatan}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record.statusMahasiswa}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record.semester}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record.batasSks}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record.totalSks}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record.ips}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          {record.ipk}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          <div className="flex justify-center">
                            {record.statusDiajukan ? (
                              <Check color="green" size={20} />
                            ) : (
                              <X color="red" size={20} />
                            )}
                          </div>
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          <div className="flex justify-center">
                            {record.statusDisetujui ? (
                              <Check color="green" size={20} />
                            ) : (
                              <X color="red" size={20} />
                            )}
                          </div>
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-sm">
                          {record.pembimbingAkademik}
                        </td>
                        <td className="border border-gray-500 font-semibold p-2 text-center">
                          <div className="flex justify-center space-x-2">
                            <ButtonClick
                              icon={<Pen size={16} />}
                              color="bg-primary-yellow"
                              onClick={Edit}
                            />
                            <ButtonClick
                              icon={<Eye size={16} />}
                              color="bg-primary-blueSoft"
                              onClick={() => setId("1")}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {isPending ? (
              <div className="flex px-4 w-full items-center justify-between">
                <div className="h-8 w-1/4 bg-gray-300 rounded animate-pulse" />
                <div className="h-8 w-1/4 bg-gray-300 rounded animate-pulse" />
              </div>
            ) : (
              <Pagination
                currentPage={currentPage}
                totalPages={studentData?.data.pagination.totalPages}
                onPageChange={setCurrentPage}
                rowsPerPage={rowsPerPage}
                totalRows={studentData?.data.pagination.totalItems}
                onRowsPerPageChange={setRowsPerPage}
              />
            )}
          </div>
          <div className="py-10"></div>
        </>
      ) : (
        <DetailAdvisorLecturer />
      )}
    </MainLayout>
  );
}
