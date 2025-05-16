import MainLayout from "../../components/layouts/MainLayout";
import { InputFilter } from "../../components/admin-academic/student-data/Input";
import ButtonClick from "../../components/admin-academic/student-data/ButtonClick";
import { Check, Eye, Pen, Search, Settings, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Pagination } from "../../components/admin-academic/Pagination";

export default function AcademikAdvisor() {
  const periode = [{ value: "", label: "2025 Ganjil" }];
  const statusPembimbing = [
    { value: "", label: "-- Semua Status Pembimbing --" },
  ];
  const semester = [{ value: "", label: "-- Semua Semester --" }];
  const unitKerja = [{ value: "", label: "Universitas Ibn Khaldun" }];
  const statusKRS = [{ value: "", label: "-- Semua Status KRS --" }];
  const statusMahasiswa = [
    { value: "", label: "-- Semua Status Mahasiswa --" },
  ];
  const angkatan = [{ value: "", label: "-- Semua Angkatan --" }];

  function SearchSubmit() {
    alert("oke search");
  }

  // Student records data from the image
  const studentRecords = [
    {
      selected: true,
      nim: "22110643033 - MUHAMMAD SYAIFULLAH NURROHMAH",
      angkatan: "2022",
      statusSmt: "A",
      smt: "6",
      sks: "21",
      batasSks: "24",
      totalSks: "105",
      ips: "3.68",
      ipk: "3.75",
      krsDisetujui: false,
      krsDisahkan: false,
      pembimbingAkademik: "",
      noSk: "",
      tglSk: "",
      aksi: "",
    },
    {
      selected: true,
      nim: "22110643033 - MUHAMMAD SYAIFULLAH NURROHMAH",
      angkatan: "2022",
      statusSmt: "A",
      smt: "6",
      sks: "21",
      batasSks: "24",
      totalSks: "105",
      ips: "3.68",
      ipk: "3.75",
      krsDisetujui: true,
      krsDisahkan: false,
      pembimbingAkademik: "0401058603 - HERSANTO FAJRI, S.Ds.,M.M.D.",
      noSk: "328/KEP.DEK.FTS-UKA/X/2024",
      tglSk: "25 Okt 2024",
      aksi: "",
    },
    {
      selected: true,
      nim: "22110643033 - MUHAMMAD SYAIFULLAH NURROHMAH",
      angkatan: "2022",
      statusSmt: "A",
      smt: "6",
      sks: "21",
      batasSks: "24",
      totalSks: "105",
      ips: "3.68",
      ipk: "3.75",
      krsDisetujui: true,
      krsDisahkan: true,
      pembimbingAkademik: "0401058603 - HERSANTO FAJRI, S.Ds.,M.M.D.",
      noSk: "328/KEP.DEK.FTS-UKA/X/2024",
      tglSk: "25 Okt 2024",
      aksi: "",
    },
    {
      selected: true,
      nim: "22110643033 - MUHAMMAD SYAIFULLAH NURROHMAH",
      angkatan: "2022",
      statusSmt: "A",
      smt: "6",
      sks: "21",
      batasSks: "24",
      totalSks: "105",
      ips: "3.68",
      ipk: "3.75",
      krsDisetujui: true,
      krsDisahkan: true,
      pembimbingAkademik: "0401058603 - HERSANTO FAJRI, S.Ds.,M.M.D.",
      noSk: "328/KEP.DEK.FTS-UKA/X/2024",
      tglSk: "25 Okt 2024",
      aksi: "",
    },
    {
      selected: true,
      nim: "22110643033 - MUHAMMAD SYAIFULLAH NURROHMAH",
      angkatan: "2022",
      statusSmt: "A",
      smt: "6",
      sks: "21",
      batasSks: "24",
      totalSks: "105",
      ips: "3.68",
      ipk: "3.75",
      krsDisetujui: true,
      krsDisahkan: true,
      pembimbingAkademik: "0401058603 - HERSANTO FAJRI, S.Ds.,M.M.D.",
      noSk: "328/KEP.DEK.FTS-UKA/X/2024",
      tglSk: "25 Okt 2024",
      aksi: "",
    },
    {
      selected: true,
      nim: "22110643033 - MUHAMMAD SYAIFULLAH NURROHMAH",
      angkatan: "2022",
      statusSmt: "A",
      smt: "6",
      sks: "21",
      batasSks: "24",
      totalSks: "105",
      ips: "3.68",
      ipk: "3.75",
      krsDisetujui: true,
      krsDisahkan: true,
      pembimbingAkademik: "0401058603 - HERSANTO FAJRI, S.Ds.,M.M.D.",
      noSk: "328/KEP.DEK.FTS-UKA/X/2024",
      tglSk: "25 Okt 2024",
      aksi: "",
    },
    {
      selected: true,
      nim: "22110643033 - MUHAMMAD SYAIFULLAH NURROHMAH",
      angkatan: "2022",
      statusSmt: "A",
      smt: "6",
      sks: "21",
      batasSks: "24",
      totalSks: "105",
      ips: "3.68",
      ipk: "3.75",
      krsDisetujui: true,
      krsDisahkan: true,
      pembimbingAkademik: "0401058603 - HERSANTO FAJRI, S.Ds.,M.M.D.",
      noSk: "328/KEP.DEK.FTS-UKA/X/2024",
      tglSk: "25 Okt 2024",
      aksi: "",
    },
    {
      selected: true,
      nim: "22110643033 - MUHAMMAD SYAIFULLAH NURROHMAH",
      angkatan: "2022",
      statusSmt: "A",
      smt: "6",
      sks: "21",
      batasSks: "24",
      totalSks: "105",
      ips: "3.68",
      ipk: "3.75",
      krsDisetujui: true,
      krsDisahkan: true,
      pembimbingAkademik: "0401058603 - HERSANTO FAJRI, S.Ds.,M.M.D.",
      noSk: "328/KEP.DEK.FTS-UKA/X/2024",
      tglSk: "25 Okt 2024",
      aksi: "",
    },
    {
      selected: true,
      nim: "22110643033 - MUHAMMAD SYAIFULLAH NURROHMAH",
      angkatan: "2022",
      statusSmt: "A",
      smt: "6",
      sks: "21",
      batasSks: "24",
      totalSks: "105",
      ips: "3.68",
      ipk: "3.75",
      krsDisetujui: true,
      krsDisahkan: true,
      pembimbingAkademik: "0401058603 - HERSANTO FAJRI, S.Ds.,M.M.D.",
      noSk: "328/KEP.DEK.FTS-UKA/X/2024",
      tglSk: "25 Okt 2024",
      aksi: "",
    },
    {
      selected: true,
      nim: "22110643033 - MUHAMMAD SYAIFULLAH NURROHMAH",
      angkatan: "2022",
      statusSmt: "A",
      smt: "6",
      sks: "21",
      batasSks: "24",
      totalSks: "105",
      ips: "3.68",
      ipk: "3.75",
      krsDisetujui: true,
      krsDisahkan: true,
      pembimbingAkademik: "0401058603 - HERSANTO FAJRI, S.Ds.,M.M.D.",
      noSk: "328/KEP.DEK.FTS-UKA/X/2024",
      tglSk: "25 Okt 2024",
      aksi: "",
    },
  ];

  function Edit() {
    alert("oke edit");
  }

  function Detail() {
    alert("oke Detail");
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <MainLayout isGreeting={false} titlePage="Pembimbing Akademik">
      <div className="grid xl:grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
        <InputFilter options={periode} label="Periode Akademik" />
        <InputFilter options={statusPembimbing} label="Status Pembimbing" />
        <InputFilter options={semester} label="Semester" />
        <InputFilter options={unitKerja} label="Unit kerja" />
        <InputFilter options={statusKRS} label="Status KRS" />
        <InputFilter options={statusMahasiswa} label="Status Mahasiswa" />
        <InputFilter options={angkatan} label="Angkatan" />
      </div>

      <div className="border-t-2 border-primary-green bg-white mt-5 p-2 py-4 rounded-sm shadow-sm pb-4">
        <div className="flex justify-between">
          <div className="flex">
            <input
              type="text"
              className="border-2 p-1 rounded text-xs w-50  "
              placeholder="Cari Kelas Kuliah"
            />
            <ButtonClick
              icon={<Search size={16} strokeWidth={3} />}
              color="bg-primary-yellow"
              onClick={SearchSubmit}
            />
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
                  SKS
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
                  No SK
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  Tgl SK
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {studentRecords.map((record, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    <input type="checkbox" className="w-4 h-4" />
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-sm">
                    {record.nim}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {record.angkatan}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {record.statusSmt}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {record.smt}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {record.sks}
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
                      {record.krsDisetujui ? (
                        <Check color="green" size={20} />
                      ) : (
                        <X color="red" size={20} />
                      )}
                    </div>
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    <div className="flex justify-center">
                      {record.krsDisahkan ? (
                        <Check color="green" size={20} />
                      ) : (
                        <X color="red" size={20} />
                      )}
                    </div>
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-sm">
                    {record.pembimbingAkademik}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-sm">
                    {record.noSk}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center text-sm">
                    {record.tglSk}
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
                        onClick={Detail}
                      />
                    </div>
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
      <div className="py-10"></div>
    </MainLayout>
  );
}
