import { Delete, Trash2 } from "lucide-react";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import Table from "../../../components/admin-finance/Tabel";
import MainLayout from "../../../components/layouts/MainLayout";
import ExpenseSelectionPanel from "../../../components/admin-finance/ExpenseSelectionPanel";

export default function FormCreateBill() {
  const headers = ["NPM", "Nama", "Fakultas", "Program Studi", "Semester"];

  const studentData = [
    {
      id: 'data-1',
      npm: "2211060643035",
      nama: "Maulana Ikhsan",
      fakultas: "Fakultas Teknik dan Sains",
      programStudi: "Teknik Informatika",
      semester: 7,
    },
    {
      id: 'data-2',
      npm: "2211060642918",
      nama: "Maraginda Pangabean",
      fakultas: "Fakultas Teknik dan Sains",
      programStudi: "Sistem Informasi",
      semester: 7,
    },
    {
      id: 'data-3',
      npm: "2211060643035",
      nama: "Alexander",
      fakultas: "Fakultas Teknik dan Sains",
      programStudi: "Teknik Informatika",
      semester: 7,
    },
    {
      id: 'data-4',
      npm: "2211060642918",
      nama: "Gabriella",
      fakultas: "Fakultas Teknik dan Sains",
      programStudi: "Sistem Informasi",
      semester: 7,
    },
    {
      id: 'data-5',
      npm: "2211060643035",
      nama: "Alexander",
      fakultas: "Fakultas Teknik dan Sains",
      programStudi: "Teknik Informatika",
      semester: 7,
    },
    {
      id: 'data-6',
      npm: "2211060642918",
      nama: "Gabriella",
      fakultas: "Fakultas Teknik dan Sains",
      programStudi: "Sistem Informasi",
      semester: 7,
    },
    {
      id: 'data-7',
      npm: "2211060643035",
      nama: "Alexander",
      fakultas: "Fakultas Teknik dan Sains",
      programStudi: "Teknik Informatika",
      semester: 7,
    },
    {
      id: 'data-8',
      npm: "2211060642918",
      nama: "Gabriella",
      fakultas: "Fakultas Teknik dan Sains",
      programStudi: "Sistem Informasi",
      semester: 7,
    },
    {
      id: 'data-9',
      npm: "2211060643035",
      nama: "Alexander",
      fakultas: "Fakultas Teknik dan Sains",
      programStudi: "Teknik Informatika",
      semester: 7,
    },
  ];

  function handleDelete() {
    alert("oke");
  }
  return (
    <MainLayout isGreeting={false} titlePage="Buat Tagihan">
      <div className="border-2 border-t-2 border-t-primary-green rounded-sm p-3 bg-white">
        <h1 className="text-lg sm:text-2xl font-semibold mb-2">
          Mahasiswa yang dipilih
        </h1>

        <Table
          headers={headers}
          data={studentData}
          showCheckbox={false}
          actions={{
            delete: () => handleDelete(),
          }}
        />

        <div className="flex flex-col gap-5 lg:flex-row my-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-semibold text-sm sm:text-base">
              Tanggal Tenggat
            </label>
            <input
              type="date"
              className="border-2 p-1 rounded-sm text-sm sm:text-base w-full md:w-96"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="font-semibold text-sm sm:text-base">
              Tahap
            </label>
            <select
              name=""
              id=""
              className="border-2 p-1 rounded-sm text-sm sm:text-base w-full md:w-96"
            >
              <option value="">- Pilih Tahap Pembayaran -</option>
            </select>
          </div>
        </div>

        <ExpenseSelectionPanel />
      </div>
      <div className="py-10"></div>
    </MainLayout>
  );
}
