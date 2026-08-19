import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CircleX,
  Eye,
  Plus,
  Save,
  Settings,
  Trash,
  Trash2,
  Lock,
  Unlock,
  History,
  Grid3x3,
  Info,
  X,
  Printer,
  ShieldCheck,
  Pencil,
  Cpu,
} from "lucide-react";
import BorderedGreenContainer from "../../../components/BorderedGreenContainer";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { TabNavigationButtonStudent } from "../../../components/admin-academic/dashboard/TabNavigasiButton";
import {
  getClassRPS,
  getClassAttendants,
  getDetailCollegeClass,
  getLecturers,
  getLecturerSchedule,
  addLecturerSchedule,
  getStudents,
  getAllDetailStudentAttendant,
  addStudentToClass,
  deleteStudentsFromClass,
  getStudentExams,
} from "../../../hooks/useKelasKuliah";
import {
  useNilaiKelas,
  useKunciNilaiKelas,
  useFinalisasiNilaiKelas,
  useSimpanNilaiMahasiswa,
  useKomposisiNilai,
  fetchNilaiKelasPdfBlobUrl,
} from "../../../hooks/useNilaiPerkuliahan";
import { useCapaianCpmk, useCapaianCpl, fetchCapaianExportBlobUrl } from "../../../hooks/useCapaianPembelajaran";
import { useSimpanNilaiKomponenCbt } from "../../../hooks/useCbtManual";
import { useResetNilaiBeberapa, useResetNilaiSemua } from "../../../hooks/academic/useObeResetNilai";
import { useSetBreadcrumbLabel } from "../../../context/BreadcrumbLabelContext";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SearchableSelect from "../../../components/admin-academic/SearchableSelect";
import DateFormatter from "../../../helpers/DateFormatter";

interface ClassAttendant {
  id: string;
  nim: string;
  name: string;
  program: string;
  sks_semester: string;
  sks_total: string;
  semester: string;
}
interface CollegeClassTableProps {
  data: ClassAttendant[];
}

const DetailCollegeClass = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const { data, isLoading, error } = getDetailCollegeClass(id!);
  useSetBreadcrumbLabel(id, data ? `${data.mataKuliah?.kode || ""} ${data.nama || ""}`.trim() : undefined);
  const {
    data: classAttendants,
    isLoading: isLoadingClassAttendants,
    error: isErrorClassAttendants,
  } = getClassAttendants(id!);

  const { data: lecturers, isLoading: isLoadingLecturers } = getLecturers();

  const [scheduleList, setScheduleList] = useState([
    {
      day: "",
      startTime: "",
      endTime: "",
      meetingType: "",
      learningMethod: "",
      room: "",
    },
  ]);

  const [activeTab, setActiveTab] = useState("classDetails");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const addNewSchedule = () => {
    setScheduleList((prev) => [
      ...prev,
      {
        day: "",
        startTime: "",
        endTime: "",
        meetingType: "",
        learningMethod: "",
        room: "",
      },
    ]);
  };

  const back = () => {
    navigate(AdminAcademicRoute.collegeClass.class);
  };

  const save = () => {
    alert("save");
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  console.log("data Detail Kelas Kuliah", data);
  console.log("data Detail Peserta Kuliah", classAttendants);

  return (
    <MainLayout titlePage="Data Kelas" isGreeting={false}>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#DFF0D8] space-y-2 sm:space-y-0">
          <span className="text-sm sm:text-base">
            Default Isian Tanggal Mulai dan Tanggal Selesai diambil dari Periode
            Akademik dengan jenis Perkuliahan
          </span>
          <CircleX className="self-end sm:self-center" />
        </div>

        <BorderedGreenContainer>
          {/* Tombol aksi */}
          <div className="flex flex-wrap justify-end items-center gap-2 sm:gap-4 mb-4">
            <ButtonClick
              icon={<ArrowLeft size={15} strokeWidth={3} />}
              color="bg-primary-yellow"
              text="Kembali Ke Daftar"
              onClick={back}
            />
            <ButtonClick
              icon={<Save size={15} strokeWidth={3} />}
              color={
                activeTab == "classDetails" ? `bg-primary-blueSoft` : `hidden`
              }
              text="Simpan"
              onClick={save}
            />
          </div>

          {/* Navigasi Tab dan Konten */}
          <div className="flex flex-col lg:grid lg:grid-cols-6 gap-4 items-start">
            {/* Tab Navigation */}
            <div className="w-full lg:col-span-1">
              <div className="flex lg:flex-col gap-2 overflow-x-auto scrollbar-hide pb-2">
                <TabNavigationButtonStudent
                  isActive={activeTab === "classDetails"}
                  onClick={() => handleTabClick("classDetails")}
                >
                  Detail Kelas
                </TabNavigationButtonStudent>
                <TabNavigationButtonStudent
                  isActive={activeTab === "lecturer"}
                  onClick={() => handleTabClick("lecturer")}
                >
                  Dosen Pengajar
                </TabNavigationButtonStudent>
                <TabNavigationButtonStudent
                  isActive={activeTab === "classAttendant"}
                  onClick={() => handleTabClick("classAttendant")}
                >
                  Peserta Kelas
                </TabNavigationButtonStudent>
                <TabNavigationButtonStudent
                  isActive={activeTab === "rps"}
                  onClick={() => handleTabClick("rps")}
                >
                  RPS
                </TabNavigationButtonStudent>
                <TabNavigationButtonStudent
                  isActive={activeTab === "grading"}
                  onClick={() => handleTabClick("grading")}
                >
                  Nilai Perkuliahan
                </TabNavigationButtonStudent>
                <TabNavigationButtonStudent
                  isActive={activeTab === "capaian"}
                  onClick={() => handleTabClick("capaian")}
                >
                  Capaian Pembelajaran
                </TabNavigationButtonStudent>
                <TabNavigationButtonStudent
                  isActive={activeTab === "examSchedule"}
                  onClick={() => handleTabClick("examSchedule")}
                >
                  Jadwal Ujian
                </TabNavigationButtonStudent>
              </div>
            </div>

            {/* Konten Tab */}
            <div className="w-full lg:col-span-5">
              {activeTab === "classDetails" && (
                <CollegeClassInformation
                  data={data}
                  addNewSchedule={addNewSchedule}
                />
              )}
              {activeTab === "lecturer" && (
                <Lecturer lecturerLists={lecturers} data={data} />
              )}
              {activeTab === "classAttendant" && (
                <ClassAttendant data={data.id} />
              )}
              {activeTab === "rps" && <RPS data={data} />}
              {activeTab === "grading" && (
                <Grading data={data} />
              )}
              {activeTab === "capaian" && <CapaianPembelajaran data={data} />}
              {activeTab === "examSchedule" && <ExamSchedule data={data} />}
            </div>
          </div>
        </BorderedGreenContainer>
      </div>
    </MainLayout>
  );
};

const CollegeClassInformation = ({ data, addNewSchedule }) => {
  console.log("TEST DATA", data);

  return (
    <>
      {/* Informasi Kelas */}
      <div className="space-y-4">
        <div>
          <h1 className="font-bold text-xl sm:text-2xl mb-2">
            Informasi Kelas
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <InputFilter
              select={false}
              value={data.periodeAkademik.nama}
              label="Periode Akademik"
            />
            <InputFilter
              select={false}
              value={data.sistemKuliah}
              label="Sistem Kuliah"
            />
            <InputFilter
              select={false}
              value={data.mataKuliah.programStudi.nama}
              label="Program Studi"
            />
            <InputFilter
              select={false}
              label="Kapasitas"
              value={data.kapasitas}
            />
            <InputFilter
              value={data.mataKuliah.tahunKurikulum.tahun}
              select={false}
              label="Tahun Kurikulum"
            />
            <InputFilter
              value={data.tanggalMulai}
              select={false}
              label="Tanggal Mulai"
            />
            <InputFilter
              select={false}
              label="Mata Kuliah"
              value={data.mataKuliah.nama}
            />
            <InputFilter
              value={data.tanggalSelesai}
              select={false}
              label="Tanggal Selesai"
            />
            <InputFilter select={false} label="Nama Kelas" value={data.nama} />
            <InputFilter
              select={false}
              label="Jumlah Pertemuan"
              value={data.jumlahPertemuan}
            />
          </div>
        </div>

        {/* Jadwal Mingguan */}
        <div className="space-y-4">
          <h1 className="font-bold text-xl sm:text-2xl">Jadwal Mingguan</h1>
          {/* <DetailCollegeClassTable data={data} /> */}
          <div className="flex justify-end">
            <ButtonClick
              icon={<Plus size={15} strokeWidth={3} />}
              color="bg-primary-green"
              text="Tambah Jadwal"
              onClick={addNewSchedule}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const ClassBio = ({ data }) => {
  console.log("Class Bio", data);
  return (
    <div className="bg-[#F5FFF9] w-full px-4 py-4 mt-5 border-l-8 border-[#116E63] rounded-md">
      <h2 className="font-semibold text-base mb-4">Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm sm:text-base">
        <div className="flex flex-col space-y-2">
          <p>
            <span className="font-medium">
              Program Studi: {data.programStudi?.nama ?? "-"}
            </span>
          </p>
          <p>
            <span className="font-medium">
              Mata Kuliah:
              {` ${data.mataKuliah?.kode ?? "-"} - ${data.mataKuliah?.nama ?? "-"} - ${data.mataKuliah?.totalSks ?? "-"} SKS`}
            </span>
          </p>
          <p>
            <span className="font-medium">
              Kurikulum: {data.mataKuliah?.tahunKurikulum?.tahun ?? "-"}
            </span>
          </p>
          <p>
            <span className="font-medium">Kapasitas: {data.kapasitas}</span>
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <p>
            <span className="font-medium">Periode: {data.periodeAkademik?.nama ?? "-"}</span>
          </p>
          <p>
            <span className="font-medium">Nama Kelas: {data.nama}</span>
          </p>
          <p>
            <span className="font-medium">
              Sistem Kuliah: {data.sistemKuliah}
            </span>
          </p>
          <p>
            <span className="font-medium">Peserta: {data.jumlahPeminat ?? 0}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const Lecturer = ({ data, lecturerLists }) => {
  const [lecturers, setLecturers] = useState([{ id: "", jadwalIds: [] }]);

  const { data: lecturerSchedule, isLoading: isLoadingLecturerSchedule } =
    getLecturerSchedule(data.id);

  const { mutate: submitLecturerSchedule, isLoading: isSubmitting } =
    addLecturerSchedule(data.id);

  const handleAddLecturer = () => {
    setLecturers((prev) => [...prev, { id: "", jadwalIds: [] }]);
  };

  const handleRemoveLecturer = (index) => {
    setLecturers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeLecturer = (index, value) => {
    const updated = [...lecturers];
    updated[index].id = value;
    setLecturers(updated);
  };

  const toggleJadwalCheckbox = (lecturerIndex, jadwalId) => {
    const updated = [...lecturers];
    const current = updated[lecturerIndex].jadwalIds || [];

    if (current.includes(jadwalId)) {
      updated[lecturerIndex].jadwalIds = current.filter(
        (id) => id !== jadwalId
      );
    } else {
      updated[lecturerIndex].jadwalIds = [...current, jadwalId];
    }

    setLecturers(updated);
  };

  const lecturerHandleSubmit = () => {
    const payload = {
      jadwal: lecturers
        .filter((lec) => lec.id && lec.jadwalIds?.length > 0)
        .map((lec) => ({
          dosenId: lec.id,
          jadwalIds: lec.jadwalIds,
        })),
    };

    // console.log("Payload Yg dikirim", payload);

    submitLecturerSchedule(payload, {
      onSuccess: () => {
        alert("Berhasil menyimpan jadwal dosen.");
      },
      onError: (error) => {
        console.error("Gagal menyimpan jadwal dosen:", error);
        alert("Terjadi kesalahan saat menyimpan.");
      },
    });
  };

  if (isLoadingLecturerSchedule) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Informasi Kelas */}
      <ClassBio data={data} />

      {/* Tombol Tambah Dosen */}
      <div className="flex justify-end">
        <ButtonClick
          text="Tambah Dosen Pengajar"
          icon={<Plus size={15} />}
          color={
            lecturerSchedule.length === 1
              ? "bg-primary-green cursor-not-allowed opacity-50"
              : "bg-primary-green"
          }
          disabled={lecturerSchedule.length === 1}
          onClick={handleAddLecturer}
        />
      </div>

      {/* Form Dosen Pengajar */}
      {lecturers.length === 0 ? (
        <div className="text-center py-4">
          <h1 className="font-semibold text-lg sm:text-xl text-gray-700">
            Tidak Ada Dosen Pengajar
          </h1>
        </div>
      ) : (
        lecturers.map((lec, index) => (
          <div key={index} className="border-b border-teal-700 pb-4 space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-semibold">
                Dosen Pengajar {index + 1}
              </label>
              <button
                className="text-white bg-red-500 hover:bg-red-600 p-2 rounded"
                onClick={() => handleRemoveLecturer(index)}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <select
              className="border border-gray-300 rounded p-2 w-full"
              value={lec.id}
              onChange={(e) => handleChangeLecturer(index, e.target.value)}
            >
              <option value="">-- Pilih Dosen --</option>
              {lecturerLists.map((dosen) => (
                <option key={dosen.id} value={dosen.id}>
                  {dosen.nama}
                </option>
              ))}
            </select>

            <div className="flex flex-col gap-2 pt-2">
              {lecturerSchedule.map((jadwalDosen, keyJadwalDosen) => {
                const jadwalId = jadwalDosen.id;
                const isChecked = lec.jadwalIds.includes(jadwalId);

                return (
                  <label
                    key={keyJadwalDosen}
                    className="flex items-center gap-2 font-medium"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleJadwalCheckbox(index, jadwalId)}
                    />
                    <span>
                      {jadwalDosen.hari}, {jadwalDosen.siakRuangan.namaRuangan}{" "}
                      • {jadwalDosen.jamMulai?.split(":").slice(0, 2).join(":")}{" "}
                      -{" "}
                      {jadwalDosen.jamSelesai?.split(":").slice(0, 2).join(":")}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Tombol Simpan */}
      <ButtonClick
        spacing="2"
        icon={<Save />}
        text={isSubmitting ? "Menyimpan..." : "Simpan"}
        color="bg-primary-blueSoft cursor-pointer"
        onClick={lecturerHandleSubmit}
        disabled={isSubmitting}
      />
    </div>
  );
};

const ClassAttendant = ({ data }) => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!data) {
    return <LoadingSpinner />;
  }
  const {
    data: allStudents,
    isLoading: isLoadingStudents,
    isError: isErrorStudents,
  } = getStudents();

  const {
    data: getAllStudentDetailAttendant,
    isLoading: isLoadingAllStudentDetailAttendant,
  } = getAllDetailStudentAttendant(data);

  const { mutate: deleteMutate, isPending: isDeleting } =
    deleteStudentsFromClass(data);

  console.log("ini ID", data);

  if (isLoadingStudents || isLoadingAllStudentDetailAttendant) {
    return <LoadingSpinner />;
  }

  console.log("datas", data);

  const handleDelete = () => {
    console.log("Kelas ID:", data);
    console.log("Mahasiswa IDs:", selectedIds);

    deleteMutate(
      { mahasiswaIds: selectedIds },
      {
        onSuccess: () => {
          alert("Berhasil dihapus");
          queryClient.invalidateQueries({
            queryKey: ["kelas-detail", data.id],
          });
          setSelectedIds([]);
        },
        onError: () => {
          alert("Gagal menghapus");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Informasi Kelas */}
      {/* <ClassBio data={data} /> */}

      {/* Tombol Aksi */}
      <div className="flex flex-wrap justify-end items-center gap-2">
        <ButtonClick
          text="Tambah Mahasiswa"
          icon={<Plus size={15} />}
          color="bg-primary-green"
          onClick={() => setShowModal(true)} // Tampilkan modal
        />
        <ButtonClick
          icon={<Trash2 size={15} />}
          text="Hapus"
          color="bg-red-400"
          onClick={handleDelete}
        />
        <ButtonClick
          icon={<Settings size={15} />}
          color="bg-primary-yellow"
          text="Aksi"
          onClick={() => alert("Aksi")}
        />
      </div>

      {/* Tabel Peserta */}
      <div className="overflow-x-auto">
        <CollegeClassTable
          data={getAllStudentDetailAttendant}
          selectedIds={selectedIds}
          onChangeSelectedIds={setSelectedIds}
        />
      </div>

      {/* Modal Tambah Mahasiswa */}
      {showModal && (
        <AddStudentModal
          students={allStudents}
          kelasId={data}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            // invalidate query atau refresh data
            queryClient.invalidateQueries({
              queryKey: ["kelas-detail", data.id],
            });
            setShowModal(false); // tutup modal
          }}
        />
      )}
    </div>
  );
};

const CollegeClassTable = ({ data, selectedIds, onChangeSelectedIds }) => {
  if (!data) {
    return <LoadingSpinner />;
  }

  const allIds = data.map((student) => student.id); // atau pakai student.id jika ada
  const isAllSelected = allIds.every((id) => selectedIds.includes(id));

  const handleSelectAll = (checked) => {
    if (checked) {
      onChangeSelectedIds(allIds); // select all
    } else {
      onChangeSelectedIds([]); // deselect all
    }
  };

  const handleSelectRow = (id, checked) => {
    const updated = checked
      ? [...selectedIds, id]
      : selectedIds.filter((selectedId) => selectedId !== id);
    onChangeSelectedIds(updated);
  };

  console.log("tedttt", data);

  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-[600px] w-full text-sm text-left">
        <thead>
          <tr className="bg-primary-green text-white text-center">
            <th className="py-2 px-4 border border-gray-300">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </th>
            <th className="py-2 px-4 border border-gray-300">NIM</th>
            <th className="py-2 px-4 border border-gray-300">Nama Mahasiswa</th>
            <th className="py-2 px-4 border border-gray-300">Program Studi</th>
            <th className="py-2 px-4 border border-gray-300">Angkatan</th>
            <th className="py-2 px-4 border border-gray-300">Status KRS</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((student) => (
              <tr
                key={student.npm}
                className="hover:bg-gray-50 text-center transition-all duration-150"
              >
                <td className="py-2 px-4 border border-gray-300">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(student.id)} // gunakan ID mahasiswa
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...selectedIds, student.id]
                        : selectedIds.filter((id) => id !== student.id);
                      onChangeSelectedIds(updated);
                    }}
                  />
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.npm}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.nama}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.programStudi?.jenjang?.jenjang
                    ? `${student.programStudi.jenjang.jenjang} - ${student.programStudi.nama}`
                    : student.programStudi?.nama ?? "-"}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.angkatan}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {student.status == null ? "Belum ada Status" : student.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                Tidak ada data peserta kelas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const CreateCollegeSelectOption = () => {
  return (
    <select className="border-2 py-0.5 px-2 text-primary-brown">
      <option value="">-- Pilih --</option>
    </select>
  );
};

// const DetailCollegeClassTable = ({ data }) => {
//   return (
//     <div className="w-full overflow-x-auto rounded-md border border-gray-200">
//       <table className="min-w-[900px] w-full border-collapse text-sm">
//         <thead>
//           <tr className="bg-primary-green text-white text-center">
//             <th className="p-3 border border-gray-300">No</th>
//             <th className="p-3 border border-gray-300">Hari</th>
//             <th className="p-3 border border-gray-300">Jam Mulai</th>
//             <th className="p-3 border border-gray-300">Jam Selesai</th>
//             <th className="p-3 border border-gray-300">Jenis Pertemuan</th>
//             <th className="p-3 border border-gray-300">Metode Pembelajaran</th>
//             <th className="p-3 border border-gray-300">Ruangan</th>
//             <th className="p-3 border border-gray-300">Aksi</th>
//           </tr>
//         </thead>
//         <tbody>
//           {scheduleList.length > 0 ? (
//             scheduleList.map((_, index) => (
//               <tr key={index} className="text-center hover:bg-gray-50">
//                 <td className="p-3 border border-gray-300">{index + 1}</td>
//                 <td className="p-2 border border-gray-300">
//                   <CreateCollegeSelectOption />
//                 </td>
//                 <td className="p-2 border border-gray-300">
//                   <CreateCollegeSelectOption />
//                 </td>
//                 <td className="p-2 border border-gray-300">
//                   <CreateCollegeSelectOption />
//                 </td>
//                 <td className="p-2 border border-gray-300">
//                   <CreateCollegeSelectOption />
//                 </td>
//                 <td className="p-2 border border-gray-300">
//                   <CreateCollegeSelectOption />
//                 </td>
//                 <td className="p-2 border border-gray-300">
//                   <CreateCollegeSelectOption />
//                 </td>
//                 <td className="p-2 border border-gray-300">
//                   <button
//                     className="text-red-500 hover:underline text-xs"
//                     onClick={() => alert(`Hapus jadwal ${index + 1}`)}
//                   >
//                     Hapus
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={8} className="text-center py-4 text-gray-500">
//                 Tidak ada jadwal perkuliahan.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

const RPS = ({ data }) => {
  const [periodeId, setPeriodeId] = useState("");
  const { data: result, isLoading } = getClassRPS(data.id, periodeId);
  const rps = result?.rps;

  useEffect(() => {
    if (rps?.daftarPeriode?.length && !periodeId) {
      const aktif = rps.daftarPeriode.find((p) => p.status === "Aktif");
      setPeriodeId((aktif || rps.daftarPeriode[0]).id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rps]);

  const InfoItem = ({ label, children }) => (
    <div className="mb-4">
      <h3 className="font-semibold text-gray-700 text-base md:text-lg">
        {label}
      </h3>
      <div className="mt-1 text-gray-800 text-sm md:text-base">{children}</div>
    </div>
  );

  if (isLoading || !rps) {
    return <LoadingSpinner />;
  }

  const rpsData = rps.rpsData;

  return (
    <div className="space-y-4 w-full px-4 md:px-0">
      <ClassBio data={data} />

      <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow">
        <label className="font-semibold text-gray-700 mr-2">Periode Akademik</label>
        <select
          value={periodeId}
          onChange={(e) => setPeriodeId(e.target.value)}
          className="border border-gray-300 rounded-md p-2 text-sm"
        >
          {(rps.daftarPeriode || []).map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama} {p.adaDataRps ? "" : "(belum ada RPS)"}
            </option>
          ))}
        </select>
      </div>

      {!rpsData ? (
        <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow text-center text-gray-500">
          📭{" "}
          <span className="block mt-2">
            RPS belum tersedia untuk mata kuliah ini pada periode terpilih.
          </span>
        </div>
      ) : (
        <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow overflow-x-auto">
          <InfoItem label="Mata Kuliah">
            {rps.mataKuliah?.kode} - {rps.mataKuliah?.nama} ({rps.mataKuliah?.totalSks} SKS)
          </InfoItem>
          <InfoItem label="Unit Pengampu">{rps.mataKuliah?.unitPengampu}</InfoItem>
          <InfoItem label="Tanggal Penyusunan">
            {rpsData.tanggalPenyusunan ? DateFormatter(rpsData.tanggalPenyusunan) : "-"}
          </InfoItem>

          <InfoItem label="Deskripsi Mata Kuliah">
            {rpsData.deskripsiMataKuliah || "-"}
          </InfoItem>

          <InfoItem label="Tujuan Mata Kuliah">{rpsData.tujuanMataKuliah || "-"}</InfoItem>

          <InfoItem label="Materi Pembelajaran">
            {rpsData.materiPembelajaran || "-"}
          </InfoItem>

          <InfoItem label="Pustaka Utama">{rpsData.pustakaUtama || "-"}</InfoItem>

          <InfoItem label="Pustaka Pendukung">{rpsData.pustakaPendukung || "-"}</InfoItem>

          <InfoItem label="Media Perangkat Lunak">{rpsData.mediaPerangkatLunak || "-"}</InfoItem>

          <InfoItem label="Media Perangkat Keras">{rpsData.mediaPerangkatKeras || "-"}</InfoItem>

          <InfoItem label="Dokumen RPS">
            {rpsData.dokumenRpsUrl ? (
              <a
                href={rpsData.dokumenRpsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-green-700 underline hover:text-green-900 break-words"
              >
                {rpsData.dokumenRpsNamaFile || "Lihat Dokumen"}
              </a>
            ) : (
              "Belum ada dokumen"
            )}
          </InfoItem>
        </div>
      )}
    </div>
  );
};

const Grading = ({ data }) => {
  const navigate = useNavigate();
  const { data: nilai, isLoading } = useNilaiKelas(data.id);
  const kunciMutation = useKunciNilaiKelas(data.id);
  const finalisasiMutation = useFinalisasiNilaiKelas(data.id);
  const [showAksi, setShowAksi] = useState(false);
  const [showPanduan, setShowPanduan] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [finalisasiResult, setFinalisasiResult] = useState<any>(null);
  const [inputNilaiRow, setInputNilaiRow] = useState<any>(null);
  const [inputCbtRow, setInputCbtRow] = useState<any>(null);
  const [showResetNilai, setShowResetNilai] = useState(false);

  const tabel = nilai?.tabel || [];
  const headerKolom = nilai?.headerKolom || [];
  const semuaTerkunci = tabel.length > 0 && tabel.every((r) => r.keterangan !== "Belum Terkunci");
  const adaTerkunci = tabel.some((r) => r.keterangan !== "Belum Terkunci");

  const handleToggleKunci = () => {
    const action = semuaTerkunci ? "buka" : "kunci";
    const konfirmasi = action === "kunci" ? "Kunci nilai seluruh mahasiswa di kelas ini?" : "Buka kunci nilai seluruh mahasiswa di kelas ini?";
    if (!window.confirm(konfirmasi)) return;
    kunciMutation.mutate(action, {
      onError: (err: any) => alert(err?.response?.data?.message || err?.message || "Gagal mengubah status kunci."),
    });
  };

  const handleFinalisasi = () => {
    const konfirmasi =
      "Finalisasi nilai kelas ini?\n\nSetelah difinalisasi, status kelulusan mahasiswa (Lulus/Tidak Lulus) TIDAK BISA dibuka/diubah lagi lewat Buka Kunci Nilai. Pastikan semua nilai sudah benar sebelum lanjut.";
    if (!window.confirm(konfirmasi)) return;
    finalisasiMutation.mutate(undefined, {
      onSuccess: (result) => setFinalisasiResult(result),
      onError: (err: any) => alert(err?.response?.data?.message || err?.message || "Gagal memfinalisasi nilai."),
    });
  };

  const handleCetakPerkuliahan = () => {
    window.open(`${AdminAcademicRoute.collegeClass.laporanNilaiPerkuliahan}/${data.id}`, "_blank");
    setShowAksi(false);
  };
  const handleCetakDaftarNilai = () => {
    window.open(`${AdminAcademicRoute.collegeClass.laporanDaftarNilai}/${data.id}`, "_blank");
    setShowAksi(false);
  };
  const handleUnduhPdfNilai = async () => {
    setShowAksi(false);
    setIsDownloadingPdf(true);
    try {
      const url = await fetchNilaiKelasPdfBlobUrl(data.id);
      window.open(url, "_blank");
    } catch (err: any) {
      alert(err?.message || "Gagal mengunduh PDF Nilai Perkuliahan.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-4 px-4 md:px-0">
      <ClassBio data={data} />

      {!isLoading && nilai && (
        <div
          className={`p-3 rounded-md border flex gap-3 text-sm ${
            semuaTerkunci ? "bg-orange-50 border-orange-200 text-orange-800" : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          <span className="font-bold">i</span>
          {tabel.length === 0 ? (
            <p>Belum ada mahasiswa yang mengambil KRS di kelas ini.</p>
          ) : semuaTerkunci ? (
            <p>Nilai seluruh mahasiswa di kelas ini sudah dikunci.</p>
          ) : adaTerkunci ? (
            <p>Sebagian nilai mahasiswa di kelas ini sudah dikunci, sebagian masih terbuka untuk diubah.</p>
          ) : (
            <p>Nilai kelas ini masih terbuka, dosen masih bisa mengisi/mengubah nilai.</p>
          )}
        </div>
      )}

      <div className="flex flex-wrap justify-end items-center gap-2">
        <button
          onClick={handleToggleKunci}
          disabled={kunciMutation.isPending || tabel.length === 0}
          className="bg-primary-yellow text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
        >
          {semuaTerkunci ? <Unlock size={16} /> : <Lock size={16} />}
          {kunciMutation.isPending ? "Memproses..." : semuaTerkunci ? "Buka Kunci Nilai" : "Kunci Nilai"}
        </button>
        <button
          onClick={handleFinalisasi}
          disabled={finalisasiMutation.isPending || !semuaTerkunci}
          title={
            !semuaTerkunci
              ? "Kunci semua nilai mahasiswa dulu sebelum finalisasi"
              : "Aksi Kaprodi -- kunci status kelulusan secara permanen"
          }
          className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShieldCheck size={16} /> {finalisasiMutation.isPending ? "Memproses..." : "Finalisasi Nilai"}
        </button>
        <button
          disabled
          title="Riwayat perubahan nilai belum tersedia"
          className="bg-gray-300 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 cursor-not-allowed opacity-60"
        >
          <History size={16} /> Riwayat Nilai
        </button>
        <button
          onClick={() => navigate(`${AdminAcademicRoute.collegeClass.komposisiNilai}/${data.id}`)}
          className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90"
        >
          <Grid3x3 size={16} /> Komposisi Nilai
        </button>
        <button
          onClick={() => setShowPanduan(true)}
          className="bg-primary-blueDark text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90"
        >
          <Info size={16} /> Panduan Penilaian
        </button>
        <div className="relative">
          <button onClick={() => setShowAksi((v) => !v)} className="bg-primary-yellow text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
            <Settings size={16} /> Aksi
          </button>
          {showAksi && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowAksi(false)} />
              <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-20 text-sm overflow-hidden">
                <button onClick={handleCetakPerkuliahan} className="w-full text-left px-4 py-2 hover:bg-gray-50">
                  Cetak Nilai Perkuliahan
                </button>
                <button onClick={handleCetakDaftarNilai} className="w-full text-left px-4 py-2 hover:bg-gray-50">
                  Cetak Nilai Mahasiswa
                </button>
                <button onClick={handleUnduhPdfNilai} disabled={isDownloadingPdf} className="w-full text-left px-4 py-2 hover:bg-gray-50 disabled:opacity-50">
                  {isDownloadingPdf ? "Menyiapkan PDF..." : "Unduh PDF Nilai Perkuliahan"}
                </button>
                <button disabled title="Belum tersedia" className="w-full text-left px-4 py-2 text-gray-400 cursor-not-allowed">
                  Umumkan Nilai
                </button>
                <button
                  onClick={() => {
                    setShowAksi(false);
                    setShowResetNilai(true);
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 border-t border-gray-100"
                >
                  Reset Nilai (Dev/Admin Tool)
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showResetNilai && <ResetNilaiModal kelasId={data.id} kelasNama={data.nama} tabel={tabel} onClose={() => setShowResetNilai(false)} />}

      {isLoading || !nilai ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-sm">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary-green text-white">
                <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">No</th>
                <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">NIM</th>
                <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">Nama</th>
                <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">Hadir (%)</th>
                {headerKolom.map((h) => (
                  <th key={h.id} className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                    {h.labelKolom}
                  </th>
                ))}
                <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">Nilai</th>
                <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">Grade</th>
                <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">Lulus</th>
                <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">Keterangan</th>
                <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tabel.length > 0 ? (
                tabel.map((row) => (
                  <tr key={row.rincianKrsId} className="hover:bg-gray-50 text-center">
                    <td className="py-2 px-4 border border-gray-300 font-medium">{row.no}</td>
                    <td className="py-2 px-4 border border-gray-300">{row.nim}</td>
                    <td className="py-2 px-4 border border-gray-300 text-left">{row.nama}</td>
                    <td className="py-2 px-4 border border-gray-300">{row.hadir != null ? row.hadir.toFixed(2) : "-"}</td>
                    {headerKolom.map((h) => (
                      <td key={h.id} className="py-2 px-4 border border-gray-300">
                        {row.nilaiPerKomponen?.[h.label] ?? "-"}
                      </td>
                    ))}
                    <td className="py-2 px-4 border border-gray-300 font-semibold">{row.nilaiAkhir.toFixed(2)}</td>
                    <td className="py-2 px-4 border border-gray-300">{row.grade}</td>
                    <td className="py-2 px-4 border border-gray-300">
                      {row.lulus ? <span className="text-green-600">✅</span> : ""}
                    </td>
                    <td className="py-2 px-4 border border-gray-300 text-left text-xs">{row.keterangan}</td>
                    <td className="py-2 px-4 border border-gray-300">
                      <div className="flex justify-center gap-1.5">
                        <button
                          onClick={() => setInputNilaiRow(row)}
                          disabled={row.keterangan !== "Belum Terkunci"}
                          title={row.keterangan !== "Belum Terkunci" ? "Nilai sudah dikunci, tidak bisa diinput lagi" : "Input Nilai (Jalur A)"}
                          className="bg-primary-blueSoft hover:opacity-90 text-white p-1.5 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setInputCbtRow(row)}
                          disabled={row.keterangan !== "Belum Terkunci"}
                          title={row.keterangan !== "Belum Terkunci" ? "Nilai sudah dikunci, tidak bisa diinput lagi" : "Input Nilai Jalur D (CBT Manual)"}
                          className="bg-purple-600 hover:opacity-90 text-white p-1.5 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Cpu size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9 + headerKolom.length} className="text-center py-4 text-gray-500 border">
                    Tidak ada data peserta kelas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showPanduan && <PanduanPenilaianModal onClose={() => setShowPanduan(false)} />}

      {finalisasiResult && (
        <FinalisasiResultModal result={finalisasiResult} tabel={tabel} onClose={() => setFinalisasiResult(null)} />
      )}

      {inputNilaiRow && (
        <InputNilaiManualModal
          kelasId={data.id}
          row={inputNilaiRow}
          headerKolom={headerKolom}
          onClose={() => setInputNilaiRow(null)}
        />
      )}

      {inputCbtRow && (
        <InputNilaiCbtModal
          kelasId={data.id}
          mataKuliahId={data.mataKuliah?.id}
          periodeId={data.siakPeriodeAkademikId || data.periodeAkademik?.id}
          row={inputCbtRow}
          onClose={() => setInputCbtRow(null)}
        />
      )}
    </div>
  );
};

const ResetNilaiModal = ({
  kelasId,
  kelasNama,
  tabel,
  onClose,
}: {
  kelasId: string;
  kelasNama: string;
  tabel: any[];
  onClose: () => void;
}) => {
  const [selectedKrsIds, setSelectedKrsIds] = useState<Set<string>>(new Set());
  const [confirmText, setConfirmText] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const resetBeberapaMutation = useResetNilaiBeberapa(kelasId);
  const resetSemuaMutation = useResetNilaiSemua(kelasId);

  const toggle = (krsId: string, checked: boolean) => {
    setSelectedKrsIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(krsId);
      else next.delete(krsId);
      return next;
    });
  };

  const handleResetBeberapa = () => {
    setMessage(null);
    if (selectedKrsIds.size === 0) {
      setMessage({ type: "error", text: "Pilih minimal satu mahasiswa." });
      return;
    }
    if (confirmText.trim() !== kelasNama) {
      setMessage({ type: "error", text: `Ketik nama kelas ("${kelasNama}") persis untuk konfirmasi.` });
      return;
    }
    resetBeberapaMutation.mutate(Array.from(selectedKrsIds), {
      onSuccess: () => {
        setMessage({ type: "success", text: "Nilai mahasiswa terpilih berhasil direset." });
        setSelectedKrsIds(new Set());
        setConfirmText("");
      },
      onError: (error: any) => setMessage({ type: "error", text: error?.response?.data?.message || "Gagal mereset nilai." }),
    });
  };

  const handleResetSemua = () => {
    if (!window.confirm(`Reset SEMUA nilai kelas "${kelasNama}"? Semua nilai evaluasi, sub-CPMK, dan CPMK mahasiswa di kelas ini akan dihapus.`)) return;
    if (!window.confirm("Tindakan ini TIDAK DAPAT DIBATALKAN. Lanjutkan reset semua nilai?")) return;

    resetSemuaMutation.mutate(undefined, {
      onSuccess: () => setMessage({ type: "success", text: "Seluruh nilai kelas berhasil direset." }),
      onError: (error: any) => setMessage({ type: "error", text: error?.response?.data?.message || "Gagal mereset semua nilai." }),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h4 className="text-lg font-bold text-gray-800">Reset Nilai (Dev/Admin Tool)</h4>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">
          <div className="bg-red-50 border border-red-300 text-red-800 rounded p-4 mb-6 flex items-start gap-3 text-sm">
            <span className="font-bold">!</span>
            <p>
              Alat ini menghapus nilai evaluasi, nilai Sub-CPMK/CPMK mahasiswa untuk kelas ini dan{" "}
              <b>tidak dapat dibatalkan</b>. Gunakan hanya untuk keperluan pengujian/perbaikan data.
            </p>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded border ${message.type === "success" ? "bg-green-100 border-green-400 text-green-700" : "bg-red-100 border-red-400 text-red-700"}`}>
              {message.text}
            </div>
          )}

          <h5 className="text-sm font-bold mb-2">Reset Nilai Mahasiswa Terpilih</h5>
          <div className="overflow-x-auto border border-gray-200 rounded-sm mb-3 max-h-64">
            <table className="min-w-full text-sm border-collapse">
              <thead className="sticky top-0">
                <tr className="bg-primary-green text-white text-xs">
                  <th className="p-2 border w-12">Pilih</th>
                  <th className="p-2 border">NIM</th>
                  <th className="p-2 border">Nama</th>
                </tr>
              </thead>
              <tbody>
                {tabel.map((r) => (
                  <tr key={r.rincianKrsId} className="text-center">
                    <td className="p-2 border">
                      <input type="checkbox" checked={selectedKrsIds.has(r.rincianKrsId)} onChange={(e) => toggle(r.rincianKrsId, e.target.checked)} />
                    </td>
                    <td className="p-2 border">{r.nim}</td>
                    <td className="p-2 border text-left">{r.nama}</td>
                  </tr>
                ))}
                {tabel.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500 italic">Belum ada peserta di kelas ini.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              Ketik nama kelas (<b>{kelasNama}</b>) untuk konfirmasi reset mahasiswa terpilih
            </label>
            <input type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm" />
          </div>

          <button
            onClick={handleResetBeberapa}
            disabled={resetBeberapaMutation.isPending || selectedKrsIds.size === 0}
            className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-1 disabled:opacity-50 hover:bg-red-700"
          >
            <Trash2 size={16} /> {resetBeberapaMutation.isPending ? "Mereset..." : `Reset Nilai ${selectedKrsIds.size} Mahasiswa Terpilih`}
          </button>

          <hr className="my-6" />

          <h5 className="text-sm font-bold mb-2 text-red-700">Zona Berbahaya: Reset SEMUA Nilai Kelas</h5>
          <p className="text-xs text-gray-500 mb-3">Menghapus nilai seluruh peserta di kelas ini. Tidak dapat dibatalkan.</p>
          <button
            onClick={handleResetSemua}
            disabled={resetSemuaMutation.isPending}
            className="bg-red-800 text-white px-4 py-2 rounded flex items-center gap-1 disabled:opacity-50 hover:bg-red-900"
          >
            <Trash2 size={16} /> {resetSemuaMutation.isPending ? "Mereset..." : "Reset SEMUA Nilai Kelas Ini"}
          </button>
        </div>
      </div>
    </div>
  );
};

const InputNilaiManualModal = ({
  kelasId,
  row,
  headerKolom,
  onClose,
}: {
  kelasId: string;
  row: any;
  headerKolom: any[];
  onClose: () => void;
}) => {
  const simpanMutation = useSimpanNilaiMahasiswa(kelasId);
  const [skorMap, setSkorMap] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    headerKolom.forEach((h) => {
      const v = row.nilaiPerKomponen?.[h.label];
      init[h.id] = v != null ? String(v) : "";
    });
    return init;
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleSimpan = () => {
    const nilai = headerKolom.map((h) => ({ komposisiId: h.id, skor: Number(skorMap[h.id]) || 0 }));
    const invalid = nilai.some((n) => n.skor < 0 || n.skor > 100);
    if (invalid) {
      setErrorMessage("Skor tiap komponen harus di antara 0 - 100.");
      return;
    }
    setErrorMessage("");
    simpanMutation.mutate(
      { rincianKrsId: row.rincianKrsId, nilai },
      {
        onSuccess: onClose,
        onError: (err: any) => setErrorMessage(err?.response?.data?.message || err?.message || "Gagal menyimpan nilai."),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h4 className="text-lg font-bold text-gray-800">Input Nilai (Jalur A)</h4>
            <p className="text-xs text-gray-500">{row.nim} - {row.nama}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          {errorMessage && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{errorMessage}</div>}
          {headerKolom.map((h) => (
            <div key={h.id}>
              <label className="text-sm font-semibold text-gray-700 block mb-1">{h.labelKolom}</label>
              <input
                type="number"
                min={0}
                max={100}
                value={skorMap[h.id]}
                onChange={(e) => setSkorMap((prev) => ({ ...prev, [h.id]: e.target.value }))}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="0 - 100"
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-gray-400">
              Batalkan
            </button>
            <button
              onClick={handleSimpan}
              disabled={simpanMutation.isPending}
              className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
            >
              <Save size={16} /> {simpanMutation.isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

let unitUidCounter = 0;
const nextUnitUid = () => `unit-${Date.now()}-${unitUidCounter++}`;

interface CbtUnitRow {
  localId: string;
  cpmkIds: string[];
  skorDiperoleh: string;
  skorMaksimal: string;
}

// Bobot Poin TIDAK diketik manual -- selalu diturunkan dari bobot resmi CPMK
// itu di rencana evaluasi, dibagi rata ke semua soal yang menunjuk ke CPMK
// yang sama (sisa pembulatan diserap soal terakhir). 1 soal boleh nunjuk ke
// LEBIH DARI 1 Sub-CPMK sekaligus (mis. soal studi kasus UTS yang nguji 2
// Sub-CPMK bareng) -- makanya hasilnya per (soal, cpmk), bukan per soal doang.
const computeBobotPoinMap = (
  units: CbtUnitRow[],
  opsiCpmk: { cpmkId: string; bobotResmi: number }[]
): Record<string, Record<string, number>> => {
  const resmiMap: Record<string, number> = {};
  opsiCpmk.forEach((c) => { resmiMap[c.cpmkId] = c.bobotResmi; });

  // groups: cpmkId -> daftar localId soal yang nunjuk ke CPMK ini
  const groups: Record<string, string[]> = {};
  units.forEach((u) => {
    (u.cpmkIds || []).forEach((cpmkId) => {
      if (!groups[cpmkId]) groups[cpmkId] = [];
      groups[cpmkId].push(u.localId);
    });
  });

  const result: Record<string, Record<string, number>> = {};
  units.forEach((u) => { result[u.localId] = {}; });

  Object.entries(groups).forEach(([cpmkId, localIds]) => {
    const total = resmiMap[cpmkId] || 0;
    const count = localIds.length;
    const each = count > 0 ? parseFloat((total / count).toFixed(2)) : 0;
    localIds.forEach((id, idx) => {
      result[id][cpmkId] = idx === count - 1 ? parseFloat((total - each * (count - 1)).toFixed(2)) : each;
    });
  });
  return result;
};

const InputNilaiCbtModal = ({
  kelasId,
  mataKuliahId,
  periodeId,
  row,
  onClose,
}: {
  kelasId: string;
  mataKuliahId: string;
  periodeId: string;
  row: any;
  onClose: () => void;
}) => {
  const { data: komposisi, isLoading } = useKomposisiNilai(mataKuliahId, periodeId, !!mataKuliahId && !!periodeId);
  const simpanCbtMutation = useSimpanNilaiKomponenCbt(kelasId);
  const [rencanaEvaluasiId, setRencanaEvaluasiId] = useState("");
  const [units, setUnits] = useState<CbtUnitRow[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const KATA_KUNCI_NON_SOAL = ["kehadiran", "partisipasi", "presensi", "keaktifan", "absen"];
  const komponenSoal = (komposisi?.rencanaEvaluasi || []).filter((e) => {
    const teks = `${e.metodeEvaluasi || ""} ${e.jenisEvaluasi || ""}`.toLowerCase();
    return !KATA_KUNCI_NON_SOAL.some((kw) => teks.includes(kw));
  });

  const cpmkLabelMap: Record<string, string> = {};
  (komposisi?.masterCpmk || []).forEach((parent) => {
    cpmkLabelMap[parent.id] = parent.kode;
    (parent.subCpmk || []).forEach((s) => {
      cpmkLabelMap[s.id] = s.kode;
    });
  });

  const komponenTerpilih = komponenSoal.find((e) => e.id === rencanaEvaluasiId);
  const opsiCpmk = komponenTerpilih
    ? Object.entries(komponenTerpilih.mappingBobotCpmk || {}).map(([cpmkId, bobot]) => ({
        cpmkId,
        kode: cpmkLabelMap[cpmkId] || cpmkId,
        bobotResmi: bobot as number,
      }))
    : [];

  const bobotEvaluasi = komponenTerpilih?.bobotEvaluasi || 0;
  const bobotPoinMap = computeBobotPoinMap(units, opsiCpmk);
  const totalBobotPoin = Object.values(bobotPoinMap).reduce(
    (sum, perCpmk) => sum + Object.values(perCpmk).reduce((s, v) => s + v, 0),
    0
  );

  const handlePilihKomponen = (id: string) => {
    setRencanaEvaluasiId(id);
    setUnits([]);
    setErrorMessage("");
  };

  const handleTambahSoal = () => {
    if (opsiCpmk.length === 0) return;
    setUnits((prev) => [
      ...prev,
      {
        localId: nextUnitUid(),
        cpmkIds: [opsiCpmk[0].cpmkId],
        skorDiperoleh: "",
        skorMaksimal: "100",
      },
    ]);
  };

  const handleHapusSoal = (localId: string) => {
    setUnits((prev) => prev.filter((u) => u.localId !== localId));
  };

  const updateUnit = (localId: string, patch: Partial<CbtUnitRow>) => {
    setUnits((prev) => prev.map((u) => (u.localId === localId ? { ...u, ...patch } : u)));
  };

  // 1 soal boleh nunjuk ke lebih dari 1 Sub-CPMK/CPMK sekaligus (mis. soal
  // studi kasus UTS yang nguji 2 Sub-CPMK bareng) -- toggle checkbox per soal.
  const toggleUnitCpmk = (localId: string, cpmkId: string) => {
    setUnits((prev) =>
      prev.map((u) => {
        if (u.localId !== localId) return u;
        const sudahAda = u.cpmkIds.includes(cpmkId);
        const next = sudahAda ? u.cpmkIds.filter((id) => id !== cpmkId) : [...u.cpmkIds, cpmkId];
        return { ...u, cpmkIds: next };
      })
    );
  };

  const handleSimpan = () => {
    if (!rencanaEvaluasiId) {
      setErrorMessage("Pilih komponen evaluasi dulu.");
      return;
    }
    if (units.length === 0) {
      setErrorMessage("Tambahkan minimal 1 soal/unit penilaian dulu.");
      return;
    }
    const breakdown = units.map((u) => ({
      skorDiperoleh: Number(u.skorDiperoleh) || 0,
      skorMaksimal: Number(u.skorMaksimal) || 0,
      pemetaanCpmk: (u.cpmkIds || []).map((cpmkId) => ({
        cpmkId,
        bobotPoin: bobotPoinMap[u.localId]?.[cpmkId] || 0,
      })),
    }));
    const adaSkorInvalid = breakdown.some((b) => b.skorMaksimal <= 0 || b.skorDiperoleh < 0 || b.skorDiperoleh > b.skorMaksimal);
    if (adaSkorInvalid) {
      setErrorMessage("Tiap soal: Skor Maksimal harus > 0, dan Skor Diperoleh harus 0 sampai Skor Maksimal.");
      return;
    }
    const adaCpmkKosong = breakdown.some((b) => b.pemetaanCpmk.length === 0);
    if (adaCpmkKosong) {
      setErrorMessage("Tiap soal wajib dipetakan ke minimal 1 Sub-CPMK/CPMK.");
      return;
    }
    const adaBobotInvalid = breakdown.some((b) => b.pemetaanCpmk.some((p) => p.bobotPoin <= 0));
    if (adaBobotInvalid) {
      setErrorMessage("Ada CPMK dengan bobot resmi 0 di rencana evaluasi, tidak bisa dikirim. Cek Komposisi Nilai mata kuliah ini.");
      return;
    }
    setErrorMessage("");
    simpanCbtMutation.mutate(
      { rencanaEvaluasiId, krsId: row.rincianKrsId, breakdown },
      {
        onSuccess: onClose,
        onError: (err: any) => setErrorMessage(err?.response?.data?.message || err?.message || "Gagal mengirim nilai Jalur D."),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h4 className="text-lg font-bold text-gray-800">Input Nilai Jalur D (CBT Manual)</h4>
            <p className="text-xs text-gray-500">{row.nim} - {row.nama}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div className="p-3 bg-purple-50 border border-purple-200 text-purple-800 rounded text-xs">
            Dipakai sementara selagi integrasi CBT masih error buat ditest. Tambahkan sebanyak apapun soal/unit penilaian
            yang perlu (soal PG, esai, kriteria presentasi, dst) -- Skor Diperoleh dan Skor Maksimal bebas ditentukan
            dosen sendiri per soal (mau skala 0-100, 0-10, dst), gak dipatok sistem. Bobot Poin otomatis diambil dari
            rencana evaluasi resmi CPMK terkait, dibagi rata kalau ada beberapa soal menunjuk ke CPMK yang sama --
            jadi totalnya selalu akurat sesuai bobot resmi, mau 1 soal atau banyak soal per CPMK.
          </div>
          {errorMessage && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{errorMessage}</div>}

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Komponen Evaluasi</label>
                <select
                  value={rencanaEvaluasiId}
                  onChange={(e) => handlePilihKomponen(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                >
                  <option value="">-- Pilih Komponen --</option>
                  {komponenSoal.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.metodeEvaluasi} ({e.jenisEvaluasi}) - {e.bobotEvaluasi}%
                    </option>
                  ))}
                </select>
                {komponenSoal.length === 0 && (
                  <p className="text-xs text-gray-400 italic mt-1">
                    Tidak ada komponen "soal" di rencana evaluasi mata kuliah ini (komponen Kehadiran/Partisipasi tidak
                    dihitung lewat Jalur D, input manual lewat Jalur A).
                  </p>
                )}
              </div>

              {rencanaEvaluasiId && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">Daftar Soal/Unit Penilaian</p>
                    <span className={`text-xs font-semibold ${bobotEvaluasi > 0 && totalBobotPoin > bobotEvaluasi ? "text-red-600" : "text-gray-500"}`}>
                      Total Bobot Poin: {totalBobotPoin} / {bobotEvaluasi}
                    </span>
                  </div>

                  {opsiCpmk.length === 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-300 text-amber-800 rounded text-xs">
                      Komponen evaluasi ini belum punya bobot CPMK/Sub-CPMK di Rencana Evaluasi (kolom CPMK di
                      Komposisi Nilai Kelas masih kosong "-"), jadi belum bisa ditambahkan soal/unit. Isi dulu bobot
                      CPMK-nya lewat menu Rencana Evaluasi mata kuliah ini.
                    </div>
                  )}

                  {units.map((u, idx) => (
                    <div key={u.localId} className="border border-gray-200 rounded-md p-2 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500">Soal #{idx + 1}</span>
                        <button onClick={() => handleHapusSoal(u.localId)} className="text-red-500 hover:text-red-700" title="Hapus soal ini">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-0.5" title="1 soal boleh dicentang lebih dari 1 Sub-CPMK/CPMK sekaligus (mis. soal studi kasus)">
                          Sub-CPMK/CPMK yang diuji soal ini
                        </label>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 border border-gray-300 rounded-md p-1.5 max-h-24 overflow-y-auto">
                          {opsiCpmk.map((c) => (
                            <label key={c.cpmkId} className="flex items-center gap-1 text-xs cursor-pointer">
                              <input
                                type="checkbox"
                                checked={u.cpmkIds.includes(c.cpmkId)}
                                onChange={() => toggleUnitCpmk(u.localId, c.cpmkId)}
                                className="w-3.5 h-3.5"
                              />
                              {c.kode}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-gray-500 block mb-0.5">Skor Diperoleh</label>
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={u.skorDiperoleh}
                            onChange={(e) => updateUnit(u.localId, { skorDiperoleh: e.target.value })}
                            className="w-full border border-gray-300 rounded-md p-1.5 text-sm"
                            placeholder="mis. 85"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-0.5">Skor Maksimal</label>
                          <input
                            type="number"
                            min={0.01}
                            step="0.01"
                            value={u.skorMaksimal}
                            onChange={(e) => updateUnit(u.localId, { skorMaksimal: e.target.value })}
                            className="w-full border border-gray-300 rounded-md p-1.5 text-sm"
                            placeholder="mis. 100"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-0.5" title="Otomatis dari bobot resmi tiap CPMK di rencana evaluasi, dibagi rata ke semua soal yang menunjuk CPMK yang sama">
                            Bobot Poin (total)
                          </label>
                          <div className="w-full border border-gray-200 bg-gray-50 rounded-md p-1.5 text-sm text-gray-700 font-medium">
                            {Object.values(bobotPoinMap[u.localId] || {}).reduce((s, v) => s + v, 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      {u.cpmkIds.length > 1 && (
                        <p className="text-[11px] text-gray-500">
                          Rincian: {u.cpmkIds.map((cid) => {
                            const kode = opsiCpmk.find((c) => c.cpmkId === cid)?.kode || cid;
                            const bobot = bobotPoinMap[u.localId]?.[cid] ?? 0;
                            return `${kode}=${bobot}`;
                          }).join(", ")}
                        </p>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={handleTambahSoal}
                    disabled={opsiCpmk.length === 0}
                    className="w-full border border-dashed border-purple-300 text-purple-700 rounded-md py-2 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-purple-50 disabled:opacity-50"
                  >
                    <Plus size={16} /> Tambah Soal/Unit
                  </button>
                </div>
              )}
            </>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-gray-400">
              Batalkan
            </button>
            <button
              onClick={handleSimpan}
              disabled={simpanCbtMutation.isPending || !rencanaEvaluasiId || units.length === 0}
              className="bg-purple-600 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
            >
              <Cpu size={16} /> {simpanCbtMutation.isPending ? "Mengirim..." : `Kirim ${units.length || ""} Nilai Soal`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinalisasiResultModal = ({ result, tabel, onClose }: { result: any; tabel: any[]; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h4 className="text-lg font-bold text-gray-800">Hasil Finalisasi Nilai</h4>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      <div className="p-5 space-y-4 text-sm">
        <p className="text-gray-700">{result.pesan}</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-2xl font-bold text-green-700">{result.jumlahLulus}</p>
            <p className="text-xs text-green-700">Lulus</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-2xl font-bold text-red-700">{result.jumlahTidakLulus}</p>
            <p className="text-xs text-red-700">Tidak Lulus</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
            <p className="text-2xl font-bold text-gray-600">{result.jumlahSudahFinalSebelumnya}</p>
            <p className="text-xs text-gray-600">Sudah Final Sebelumnya</p>
          </div>
        </div>

        {(result.daftarPerluMengulangCpmk || []).length > 0 && (
          <div>
            <p className="font-semibold text-orange-700 mb-2">
              {result.daftarPerluMengulangCpmk.length} mahasiswa punya CPMK di bawah target, wajib mengulang:
            </p>
            <div className="border border-orange-200 rounded-md divide-y divide-orange-100 max-h-56 overflow-y-auto">
              {result.daftarPerluMengulangCpmk.map((item: any) => {
                const row = tabel.find((r: any) => r.rincianKrsId === item.rincianKrsId);
                return (
                  <div key={item.rincianKrsId} className="p-2 text-xs">
                    <p className="font-semibold">{row?.nama || item.mahasiswaId} {row?.nim ? `(${row.nim})` : ""}</p>
                    <p className="text-gray-600">
                      {item.cpmkGagal.map((c: any) => `${c.kode}: ${c.nilai} (target ${c.target})`).join(", ")}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="bg-primary-green text-white px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90">
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
);

const PanduanPenilaianModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h4 className="text-lg font-bold text-gray-800">Panduan Penilaian</h4>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      <div className="p-5 space-y-3 text-sm text-gray-700">
        <p>Nilai Akhir mahasiswa dihitung otomatis dari nilai per komponen evaluasi dikali bobotnya masing-masing (lihat menu Komposisi Nilai untuk rincian bobot tiap komponen).</p>
        <p>Huruf Mutu (Grade) ditentukan dari skala penilaian yang berlaku untuk jenjang dan tahun kurikulum program studi ini.</p>
        <p>Setelah nilai dikunci (Kunci Nilai), nilai mahasiswa di kelas ini tidak dapat diubah lagi kecuali dibuka kembali lewat tombol Buka Kunci Nilai.</p>
        <p>Mahasiswa dinyatakan Tidak Lulus mata kuliah jika Huruf Mutu akhirnya D atau E.</p>
      </div>
    </div>
  </div>
);

const CapaianPembelajaran = ({ data }) => {
  const [subTab, setSubTab] = useState<"cpmk" | "cpl">("cpmk");
  const { data: cpmkData, isLoading: isLoadingCpmk } = useCapaianCpmk(data.id, true);
  const { data: cplData, isLoading: isLoadingCpl } = useCapaianCpl(data.id, subTab === "cpl");
  const [isExporting, setIsExporting] = useState(false);

  const handleCetak = async () => {
    setIsExporting(true);
    try {
      const url = await fetchCapaianExportBlobUrl(data.id, subTab);
      window.open(url, "_blank");
    } catch (err: any) {
      alert(err?.message || "Gagal mengunduh PDF Capaian Pembelajaran.");
    } finally {
      setIsExporting(false);
    }
  };

  const isLoadingActive = subTab === "cpmk" ? isLoadingCpmk || !cpmkData : isLoadingCpl || !cplData;

  return (
    <div className="space-y-4 px-4 md:px-0">
      <ClassBio data={data} />

      {cpmkData?.pemetaanBerbeda && (
        <div className="p-3 rounded-md border bg-orange-50 border-orange-200 text-orange-800 flex gap-3 text-sm">
          <span className="font-bold">i</span>
          <p>
            Pemetaan capaian pada kelas ini berbeda dengan Mata Kuliah. Nilai CPMK yang sudah tersimpan masih memakai pemetaan lama.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1">
          <button
            onClick={() => setSubTab("cpmk")}
            className={`px-4 py-2 text-sm font-semibold rounded-t-md border border-b-0 ${
              subTab === "cpmk" ? "bg-primary-blueDark text-white border-primary-blueDark" : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
            }`}
          >
            CPMK
          </button>
          <button
            onClick={() => setSubTab("cpl")}
            className={`px-4 py-2 text-sm font-semibold rounded-t-md border border-b-0 ${
              subTab === "cpl" ? "bg-primary-blueDark text-white border-primary-blueDark" : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
            }`}
          >
            CPL
          </button>
        </div>
        <div className="flex gap-2">
          <button
            disabled
            title="Hitung ulang pemetaan capaian belum tersedia"
            className="bg-gray-300 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 cursor-not-allowed opacity-60"
          >
            <History size={16} /> Hitung Ulang
          </button>
          <button
            onClick={handleCetak}
            disabled={isExporting}
            className="bg-primary-blueSoft text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
          >
            <Printer size={16} /> {isExporting ? "Menyiapkan..." : "Cetak"}
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-b-sm rounded-tr-sm p-4">
        {isLoadingActive ? (
          <LoadingSpinner />
        ) : subTab === "cpmk" ? (
          <CapaianCpmkTable data={cpmkData} />
        ) : (
          <CapaianCplTable data={cplData} />
        )}
      </div>
    </div>
  );
};

const CapaianCpmkTable = ({ data }) => {
  const cols = data.cpmkInfo || [];
  if (cols.length === 0) {
    return <p className="text-center text-gray-400 italic py-8">{data.pesan || "CPMK belum disetup untuk mata kuliah ini."}</p>;
  }
  return (
    <div>
      <div className="bg-primary-green/10 p-4 mb-4">
        <p className="font-bold mb-2">CPMK Program Studi</p>
        <ul className="space-y-1 text-sm">
          {cols.map((c) => (
            <li key={c.id} className="flex gap-2">
              <span>&bull;</span>
              <span>
                <span className="font-semibold">{c.kode}</span>&nbsp;&nbsp;{c.deskripsi}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="overflow-x-auto border border-gray-200 rounded-sm">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary-green text-white">
              <th className="p-2 border border-gray-400">No.</th>
              <th className="p-2 border border-gray-400">NIM</th>
              <th className="p-2 border border-gray-400 text-left">Nama Mahasiswa</th>
              <th className="p-2 border border-gray-400">Angkatan</th>
              {cols.map((c) => (
                <th key={c.id} className="p-2 border border-gray-400">{c.kode}</th>
              ))}
              <th className="p-2 border border-gray-400">Status Capaian</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-primary-green text-white font-semibold">
              <td className="p-2 border border-gray-400" colSpan={4}>Target CPMK</td>
              {cols.map((c) => (
                <td key={c.id} className="p-2 border border-gray-400 text-center">
                  {(data.targetCpmk?.[c.kode] ?? 0).toFixed(2)}
                </td>
              ))}
              <td className="p-2 border border-gray-400"></td>
            </tr>
            {(data.tabel || []).length > 0 ? (
              data.tabel.map((row) => (
                <tr key={row.no} className="hover:bg-gray-50 text-center">
                  <td className="p-2 border border-gray-200">{row.no}</td>
                  <td className="p-2 border border-gray-200">{row.nim}</td>
                  <td className="p-2 border border-gray-200 text-left">{row.nama}</td>
                  <td className="p-2 border border-gray-200">{row.angkatan}</td>
                  {cols.map((c) => (
                    <td key={c.id} className="p-2 border border-gray-200">
                      {row.nilaiCpmk?.[c.kode] != null ? row.nilaiCpmk[c.kode].toFixed(2) : "-"}
                    </td>
                  ))}
                  <td className="p-2 border border-gray-200">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${
                        row.statusCapaian === "Sudah Memenuhi"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : row.statusCapaian === "Belum Memenuhi"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                    >
                      {row.statusCapaian}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5 + cols.length} className="p-6 text-center text-gray-400 italic">
                  {data.pesan || "Belum ada peserta/nilai di kelas ini."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CapaianCplTable = ({ data }) => {
  const cols = data.cplInfo || [];
  if (cols.length === 0) {
    return <p className="text-center text-gray-400 italic py-8">{data.pesan || "CPL belum dipetakan ke mata kuliah ini."}</p>;
  }
  return (
    <div>
      <div className="bg-primary-green/10 p-4 mb-4">
        <p className="font-bold mb-2">CPL Program Studi</p>
        <ul className="space-y-1 text-sm">
          {cols.map((c) => (
            <li key={c.id} className="flex gap-2">
              <span>&bull;</span>
              <span>
                <span className="font-semibold">{c.kode}</span>&nbsp;&nbsp;{c.deskripsi}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="overflow-x-auto border border-gray-200 rounded-sm">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary-green text-white">
              <th className="p-2 border border-gray-400">No.</th>
              <th className="p-2 border border-gray-400">NIM</th>
              <th className="p-2 border border-gray-400 text-left">Nama Mahasiswa</th>
              <th className="p-2 border border-gray-400">Angkatan</th>
              {cols.map((c) => (
                <th key={c.id} className="p-2 border border-gray-400">{c.kode}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-primary-green text-white font-semibold">
              <td className="p-2 border border-gray-400" colSpan={4}>Target CPL</td>
              {cols.map((c) => (
                <td key={c.id} className="p-2 border border-gray-400 text-center">
                  {(data.targetCpl?.[c.kode] ?? 0).toFixed(2)}
                </td>
              ))}
            </tr>
            {(data.tabel || []).length > 0 ? (
              data.tabel.map((row) => (
                <tr key={row.no} className="hover:bg-gray-50 text-center">
                  <td className="p-2 border border-gray-200">{row.no}</td>
                  <td className="p-2 border border-gray-200">{row.nim}</td>
                  <td className="p-2 border border-gray-200 text-left">{row.nama}</td>
                  <td className="p-2 border border-gray-200">{row.angkatan}</td>
                  {cols.map((c) => (
                    <td key={c.id} className="p-2 border border-gray-200">
                      {row.nilaiCpl?.[c.kode] != null ? row.nilaiCpl[c.kode].toFixed(2) : "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4 + cols.length} className="p-6 text-center text-gray-400 italic">
                  {data.pesan || "Belum ada peserta/nilai di kelas ini."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ExamSchedule = ({ data }) => {
  const {
    data: exams,
    isLoading: isLoadingExams,
    isError: isErrorExams,
  } = getStudentExams(data.id);

  console.log("123", exams);

  return (
    <div className="space-y-4 px-4 md:px-0">
      <ClassBio data={data} />
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm md:text-base border-collapse">
          <thead>
            <tr className="bg-primary-green text-white">
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                No
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Jenis Ujian
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Tanggal
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Waktu
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Ruang
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Pengawas Ujian
              </th>

              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {exams?.map((exam, index) => (
              <tr key={exam.id} className="hover:bg-gray-50 text-center">
                <td className="py-2 px-4 border border-gray-300 font-medium">
                  {index + 1}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {exam.jenisUjian}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {DateFormatter(exam.tanggal)}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {exam.jamMulai}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {exam.siakRuangan.namaRuangan}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {exam.siakDosen.nama}
                </td>

                <td className="py-2 px-4 border border-gray-300">
                  <button className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition">
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AddStudentModal = ({
  onClose,
  onSuccess,
  students,
  kelasId,
}: {
  onClose: () => void;
  onSuccess: () => void;
  students: any[];
  kelasId: string;
}) => {
  const [show, setShow] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const { mutate, isPending } = addStudentToClass(kelasId);

  useEffect(() => {
    setShow(true);
  }, []);

  const addStudentClassAttendant = () => {
    if (!selectedStudentId) {
      alert("Pilih mahasiswa terlebih dahulu.");
      return;
    }

    mutate(
      { mahasiswaIds: [selectedStudentId] },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Peserta berhasil ditambahkan ke kelas.",
            confirmButtonColor: "#10b981", // Tailwind green
            timer: 1500,
            showConfirmButton: false,
          });
          onSuccess(); // Panggil fungsi parent (invalidate + tutup modal)
        },
        onError: (err: any) => {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: err.message || "Gagal menambahkan peserta.",
            confirmButtonColor: "#ef4444", // Tailwind red
          });
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-white/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div
        className={`relative bg-white rounded-lg shadow-lg p-6 z-50 w-full max-w-md transform transition-all duration-300 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <h2 className="text-center text-lg font-semibold mb-4">
          Tambah Peserta Kelas
        </h2>

        <div className="mb-4">
          <label htmlFor="mahasiswa" className="block text-sm font-medium mb-1">
            Mahasiswa
          </label>
          <SearchableSelect
            value={selectedStudentId}
            onChange={setSelectedStudentId}
            placeholder="-- Cari Mahasiswa --"
            searchPlaceholder="Cari NIM/nama mahasiswa..."
            options={students.map((student) => ({
              value: student.id,
              label: student.npm ? `${student.npm} - ${student.nama}` : student.nama,
            }))}
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
            disabled={isPending}
          >
            Batalkan
          </button>
          <button
            onClick={addStudentClassAttendant}
            className="bg-primary-green text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={isPending}
          >
            {isPending ? "Menambahkan..." : "Tambah Peserta"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailCollegeClass;
