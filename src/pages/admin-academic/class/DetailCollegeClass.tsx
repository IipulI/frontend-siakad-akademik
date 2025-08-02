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
  getClassesGrades,
  getStudents,
  getAllDetailStudentAttendant,
  addStudentToClass,
  deleteStudentsFromClass,
  getStudentExams,
} from "../../../hooks/useKelasKuliah";
import LoadingSpinner from "../../../components/LoadingSpinner";
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
  const {
    data: classAttendants,
    isLoading: isLoadingClassAttendants,
    error: isErrorClassAttendants,
  } = getClassAttendants(id!);
  const {
    data: classRPS,
    isLoading: isLoadingRPS,
    error: isErrorRPS,
  } = getClassRPS(id!);

  const {
    data: classGrades,
    isLoading: isLoadingClassGrades,
    error: isErrorClassGrades,
  } = getClassesGrades(id!);

  const { data: lecturers, isLoading: isLoadingLecturers } = getLecturers();

  console.log("NIlai Kelas", classGrades);

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
                  Penilaian
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
              {activeTab === "rps" && <RPS RPS={classRPS} data={data} />}
              {activeTab === "grading" && (
                <Grading grades={classGrades} data={data} />
              )}
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
              value={data.periodeAkademik}
              label="Periode Akademik"
            />
            <InputFilter
              select={false}
              value={data.sistemKuliah}
              label="Sistem Kuliah"
            />
            <InputFilter
              select={false}
              value={data.programStudi.namaProgramStudi}
              label="Program Studi"
            />
            <InputFilter
              select={false}
              label="Kapasitas"
              value={data.kapasitas}
            />
            <InputFilter
              value={data.periodeAkademik}
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
              value={data.mataKuliah.namaMataKuliah}
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
              Program Studi: {`${data.programStudi.namaProgramStudi}`}
            </span>
          </p>
          <p>
            <span className="font-medium">
              Mata Kuliah:
              {` ${data.mataKuliah.kodeMataKuliah} - ${data.mataKuliah.namaMataKuliah} - 2SKS`}
            </span>
          </p>
          <p>
            <span className="font-medium">
              Kurikulum: {data.mataKuliah.tahunKurikulum}
            </span>
          </p>
          <p>
            <span className="font-medium">Kapasitas: {data.kapasitas}</span>
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <p>
            <span className="font-medium">Periode: {data.periodeAkademik}</span>
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
            <span className="font-medium">Peserta: {data.peserta}</span>
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
                  {student.programStudiResDto.namaProgramStudi}
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

const RPS = ({ RPS, data }) => {
  const InfoItem = ({ label, children }) => (
    <div className="mb-4">
      <h3 className="font-semibold text-gray-700 text-base md:text-lg">
        {label}
      </h3>
      <div className="mt-1 text-gray-800 text-sm md:text-base">{children}</div>
    </div>
  );

  if (!RPS) {
    return (
      <div className="space-y-4 w-full px-4 md:px-0">
        <ClassBio data={data} />
        <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow text-center text-gray-500">
          📭{" "}
          <span className="block mt-2">
            RPS belum tersedia untuk kelas ini.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full px-4 md:px-0">
      <ClassBio data={data} />
      <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow overflow-x-auto">
        <InfoItem label="Mata Kuliah">{RPS.mataKuliah.namaMataKuliah}</InfoItem>
        <InfoItem label="Tanggal Penyusunan">
          {DateFormatter(RPS.tanggalPenyusun)}
        </InfoItem>
        <InfoItem label="Dosen Penyusun">
          {RPS.dosenPenyusun.map((dosenPenyusun, key) => (
            <span key={key}>
              {dosenPenyusun.nidn} - {dosenPenyusun.nama}
              <br />
            </span>
          ))}
        </InfoItem>

        <InfoItem label="Deskripsi Mata Kuliah">
          {RPS.deskripsiMataKuliah}
        </InfoItem>

        <InfoItem label="Tujuan Mata Kuliah">{RPS.tujuanMataKuliah}</InfoItem>

        <InfoItem label="Materi Pembelajaran">
          {RPS.materiPembelajaran}
        </InfoItem>

        <InfoItem label="Pustaka Utama">{RPS.pustakaUtama}</InfoItem>

        <InfoItem label="Pustaka Pendukung">{RPS.pustakaPendukung}</InfoItem>

        <InfoItem label="Dokumen RPS">
          <a
            href="#"
            className="text-green-700 underline hover:text-green-900 break-words"
          >
            RPS Pengantar Akuntansi 1.pdf
          </a>
        </InfoItem>
      </div>
    </div>
  );
};

const Grading = ({ grades, data }) => {
  console.log("NILAI", grades);

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
                NIM
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Nama Mahasiswa
              </th>

              {grades.komposisiPenilaian.map((bobot, keyBobot) => (
                <th
                  key={keyBobot}
                  className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap"
                >
                  {bobot.nama} {`${bobot.persentase}%`}
                </th>
              ))}
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Nilai
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Grade
              </th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">
                Lulus
              </th>
            </tr>
          </thead>
          <tbody>
            {grades.mahasiswa.length > 0 ? (
              grades.mahasiswa.map((grade) => (
                <tr key={grade.npm} className="hover:bg-gray-50 text-center">
                  <td className="py-2 px-4 border border-gray-300 font-medium">
                    {grade.npm}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {grade.npm}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {grade.nama}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {grade.tugas ? grade.tugas : "Belum Ada Nilai"}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {grade.uts ? grade.uts : "Belum Ada Nilai"}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {grade.uas ? grade.uas : "Belum Ada Nilai"}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {grade.kehadiran ? grade.kehadiran : "Belum Ada Nilai"}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {grade.nilai ? grade.nilai : "Belum Ada Nilai"}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {grade.grade ? grade.grade : "Belum Ada Nilai"}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {grade.status === "A" ? (
                      <span className="text-green-600 text-lg">✅</span>
                    ) : (
                      <span className="text-red-600 text-lg">❌</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="text-center py-4 text-gray-500 border"
                >
                  Tidak ada data peserta kelas.
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
          <select
            id="mahasiswa"
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-primary-green"
          >
            <option value="">-- Cari Mahasiswa --</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.nama}
              </option>
            ))}
          </select>
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
