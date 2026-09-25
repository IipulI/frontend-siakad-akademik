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
import { DosenAsyncSelect } from "../../../components/admin-academic/student-data/DosenAsyncSelect";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { TabNavigationButtonStudent } from "../../../components/admin-academic/dashboard/TabNavigasiButton";
import {
  getClassRPS,
  getClassAttendants,
  getDetailCollegeClass,
  getClassSchedule,
  getStudents,
  getAllDetailStudentAttendant,
  addStudentToClass,
  deleteStudentsFromClass,
  getStudentExams,
  addClassSchedule,
  deleteClassSchedule,
  getRooms,
  getSlotWaktu,
} from "../../../hooks/useKelasKuliah";
import { useJenisPertemuan } from "../../../hooks/admin-akademik/useJenisPertemuan";
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

  const queryClient = useQueryClient();

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
  } = getClassRPS(data?.mataKuliah?.id, data?.periodeAkademik?.id);

  const { data: rooms } = getRooms();
  const { data: jenisPertemuanList } = useJenisPertemuan();
  const { data: slotWaktuList } = getSlotWaktu();

  const [newScheduleList, setNewScheduleList] = useState([]);

  const { mutate: submitSchedule, isPending: isSubmittingSchedule } =
    addClassSchedule(id!);
  const { mutate: removeSchedule } = deleteClassSchedule(id!);

  const [activeTab, setActiveTab] = useState("classDetails");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const back = () => {
    navigate(AdminAcademicRoute.collegeClass.class);
  };

  const addNewSchedule = () => {
    setNewScheduleList((prev) => [...prev, emptyScheduleRow()]);
  };

  const handleChangeNewRow = (index, field, value) => {
    const updated = [...newScheduleList];
    updated[index][field] = value;
    setNewScheduleList(updated);
  };

  const handleLecturerChangeNewRow = (index, lecId, label) => {
    const updated = [...newScheduleList];
    updated[index].lecturer = lecId;
    updated[index].lecturerName = label;
    setNewScheduleList(updated);
  };

  const handleRemoveNewRow = (index) => {
    setNewScheduleList(newScheduleList.filter((_, i) => i !== index));
  };

  const handleDeleteSchedule = (jadwalId: string) => {
    if (!confirm("Hapus jadwal ini?")) return;

    removeSchedule(jadwalId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["classSchedule", id] });
      },
      onError: (error: any) => {
        alert(error?.response?.data?.message || "Gagal menghapus jadwal.");
      },
    });
  };

  const save = () => {
    if (newScheduleList.length === 0) {
      alert("Tidak ada perubahan jadwal untuk disimpan.");
      return;
    }

    const payload = {
      jadwalKuliah: newScheduleList.map((item) => ({
        hari: item.day,
        siakRuanganId: item.room,
        siakDosenId: item.lecturer || null,
        jamMulai: item.startTime + ":00",
        jamSelesai: item.endTime + ":00",
        jenisPertemuan: item.meetingType,
        metodePembelajaran: item.learningMethod,
      })),
    };

    submitSchedule(payload, {
      onSuccess: () => {
        alert("Jadwal berhasil ditambahkan.");
        setNewScheduleList([]);
        queryClient.invalidateQueries({ queryKey: ["classSchedule", id] });
      },
      onError: (error: any) => {
        alert(error?.response?.data?.message || "Gagal menambahkan jadwal.");
      },
    });
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
              text={isSubmittingSchedule ? "Menyimpan..." : "Simpan"}
              onClick={save}
              disabled={isSubmittingSchedule}
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
                  newScheduleList={newScheduleList}
                  onAddNewSchedule={addNewSchedule}
                  onChangeNewRow={handleChangeNewRow}
                  onLecturerChangeNewRow={handleLecturerChangeNewRow}
                  onRemoveNewRow={handleRemoveNewRow}
                  onDeleteSchedule={handleDeleteSchedule}
                  listRooms={rooms}
                  listJenisPertemuan={jenisPertemuanList}
                  listSlotWaktu={slotWaktuList}
                />
              )}
              {activeTab === "classAttendant" && (
                <ClassAttendant data={data.id} classData={data} />
              )}
              {activeTab === "rps" && <RPS RPS={classRPS} data={data} />}
              {activeTab === "examSchedule" && <ExamSchedule data={data} />}
            </div>
          </div>
        </BorderedGreenContainer>
      </div>
    </MainLayout>
  );
};

const emptyScheduleRow = () => ({
  day: "",
  startTime: "",
  endTime: "",
  meetingType: "",
  learningMethod: "",
  room: "",
  lecturer: "",
  lecturerName: "",
});

const CollegeClassInformation = ({
  data,
  newScheduleList,
  onAddNewSchedule,
  onChangeNewRow,
  onLecturerChangeNewRow,
  onRemoveNewRow,
  onDeleteSchedule,
  listRooms,
  listJenisPertemuan,
  listSlotWaktu,
}) => {
  const { data: schedule, isLoading: isLoadingSchedule } = getClassSchedule(
    data.id
  );

  return (
    <>
      {/* Informasi Kelas */}
      <div className="space-y-4">
        <div>
          <h1 className="font-bold text-xl sm:text-2xl mb-2">
            Informasi Kelas
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          {isLoadingSchedule ? (
            <LoadingSpinner />
          ) : (
            <DetailCollegeClassTable
              data={schedule}
              onDelete={onDeleteSchedule}
              newRows={newScheduleList}
              onChangeNewRow={onChangeNewRow}
              onLecturerChangeNewRow={onLecturerChangeNewRow}
              onRemoveNewRow={onRemoveNewRow}
              listRooms={listRooms}
              listJenisPertemuan={listJenisPertemuan}
              listSlotWaktu={listSlotWaktu}
            />
          )}

          <div className="flex justify-end">
            <ButtonClick
              icon={<Plus size={15} strokeWidth={3} />}
              color="bg-primary-green"
              text="Tambah Jadwal"
              onClick={onAddNewSchedule}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const ClassBio = ({ data }) => {
  return (
    <div className="bg-[#F5FFF9] w-full px-4 py-4 mt-5 border-l-8 border-primary-green rounded-md">
      <h2 className="font-semibold text-base mb-4">Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm sm:text-base">
        <div className="flex flex-col space-y-2">
          <p>
            <span className="font-medium">
              Program Studi: {data.mataKuliah.programStudi.nama}
            </span>
          </p>
          <p>
            <span className="font-medium">
              Mata Kuliah:
              {` ${data.mataKuliah.kode} - ${data.mataKuliah.nama} - ${data.mataKuliah.totalSks}SKS`}
            </span>
          </p>
          <p>
            <span className="font-medium">
              Kurikulum: {data.mataKuliah.tahunKurikulum.tahun}
            </span>
          </p>
          <p>
            <span className="font-medium">Kapasitas: {data.kapasitas}</span>
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <p>
            <span className="font-medium">
              Periode: {data.periodeAkademik.nama}
            </span>
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

const ClassAttendant = ({ data, classData }) => {
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
      <ClassBio data={classData} />

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
              periodeAkademikId={classData?.periodeAkademik?.id}
              existingStudentIds={getAllStudentDetailAttendant?.map((s: any) => s.id) ?? []}
              onClose={() => setShowModal(false)}
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["kelas-detail", data] }); // sekaligus fix bug data.id
                setShowModal(false);
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
                  {student.programStudi?.nama ?? "-"}
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

const DetailCollegeClassTable = ({
  data,
  onDelete,
  newRows = [],
  onChangeNewRow,
  onLecturerChangeNewRow,
  onRemoveNewRow,
  listRooms,
  listJenisPertemuan,
  listSlotWaktu,
}) => {
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const learningMethod = ["Offline", "Online", "Hybrid"];
  const savedCount = data?.length ?? 0;

  return (
    <div className="w-full overflow-x-auto rounded-md border border-gray-200">
      <table className="min-w-[900px] w-full border-collapse text-sm">
        <thead>
          <tr className="bg-primary-green text-white text-center">
            <th className="p-3 border border-gray-300">No</th>
            <th className="p-3 border border-gray-300">Hari</th>
            <th className="p-3 border border-gray-300">Jam Mulai</th>
            <th className="p-3 border border-gray-300">Jam Selesai</th>
            <th className="p-3 border border-gray-300">Jenis Pertemuan</th>
            <th className="p-3 border border-gray-300">Metode Pembelajaran</th>
            <th className="p-3 border border-gray-300">Ruangan</th>
            <th className="p-3 border border-gray-300">Dosen</th>
            <th className="p-3 border border-gray-300">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {savedCount === 0 && newRows.length === 0 && (
            <tr>
              <td colSpan={9} className="text-center py-4 text-gray-500">
                Tidak ada jadwal perkuliahan.
              </td>
            </tr>
          )}
          {data?.map((jadwal, index) => (
            <tr key={jadwal.id ?? index} className="text-center hover:bg-gray-50">
              <td className="p-3 border border-gray-300">{index + 1}</td>
              <td className="p-2 border border-gray-300">{jadwal.hari}</td>
              <td className="p-2 border border-gray-300">
                {jadwal.jamMulai?.slice(0, 5)}
              </td>
              <td className="p-2 border border-gray-300">
                {jadwal.jamSelesai?.slice(0, 5)}
              </td>
              <td className="p-2 border border-gray-300">
                {jadwal.jenisPertemuan}
              </td>
              <td className="p-2 border border-gray-300">
                {jadwal.metodePembelajaran}
              </td>
              <td className="p-2 border border-gray-300">
                {jadwal.ruangan?.nama ?? "-"}
              </td>
              <td className="p-2 border border-gray-300">
                {jadwal.dosen?.nama ?? "-"}
              </td>
              <td className="p-2 border border-gray-300">
                <button
                  className="text-red-500 hover:underline text-xs"
                  onClick={() => onDelete(jadwal.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
          {newRows.map((item, index) => (
            <tr key={`new-${index}`} className="hover:bg-gray-50 text-center bg-yellow-50/40">
              <td className="p-2 border border-gray-300">
                {savedCount + index + 1}
              </td>
              <td className="p-2 border border-gray-300">
                <select
                  value={item.day}
                  onChange={(e) =>
                    onChangeNewRow(index, "day", e.target.value)
                  }
                  className="border p-1 w-full"
                >
                  <option value="">-- Pilih --</option>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2 border border-gray-300">
                <select
                  value={item.startTime}
                  onChange={(e) =>
                    onChangeNewRow(index, "startTime", e.target.value)
                  }
                  className="border p-1 w-full"
                >
                  <option value="">-- Pilih --</option>
                  {listSlotWaktu?.map((slot) => (
                    <option key={slot.id} value={slot.waktu.slice(0, 5)}>
                      {slot.waktu.slice(0, 5)}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2 border border-gray-300">
                <select
                  value={item.endTime}
                  onChange={(e) =>
                    onChangeNewRow(index, "endTime", e.target.value)
                  }
                  className="border p-1 w-full"
                >
                  <option value="">-- Pilih --</option>
                  {listSlotWaktu?.map((slot) => (
                    <option key={slot.id} value={slot.waktu.slice(0, 5)}>
                      {slot.waktu.slice(0, 5)}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2 border border-gray-300">
                <select
                  value={item.meetingType}
                  onChange={(e) =>
                    onChangeNewRow(index, "meetingType", e.target.value)
                  }
                  className="border p-1 w-full"
                >
                  <option value="">-- Pilih --</option>
                  {listJenisPertemuan?.map((jenis) => (
                    <option key={jenis.id} value={jenis.nama}>
                      {jenis.nama}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2 border border-gray-300">
                <select
                  value={item.learningMethod}
                  onChange={(e) =>
                    onChangeNewRow(index, "learningMethod", e.target.value)
                  }
                  className="border p-1 w-full"
                >
                  <option value="">-- Pilih --</option>
                  {learningMethod.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2 border border-gray-300">
                <select
                  value={item.room}
                  onChange={(e) =>
                    onChangeNewRow(index, "room", e.target.value)
                  }
                  className="border p-1 w-full"
                >
                  <option value="">-- Pilih --</option>
                  {listRooms?.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.nama}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2 border border-gray-300">
                <DosenAsyncSelect
                  value={item.lecturer}
                  selectedLabel={item.lecturerName}
                  onChange={(id, label) =>
                    onLecturerChangeNewRow(index, id, label)
                  }
                />
              </td>
              <td className="p-2 border border-gray-300">
                <button
                  className="text-red-500 hover:underline text-xs"
                  onClick={() => onRemoveNewRow(index)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const RPS = ({ RPS, data }) => {
  const InfoItem = ({ label, children }) => (
    <div className="mb-4">
      <h3 className="font-semibold text-gray-700 text-base md:text-lg">
        {label}
      </h3>
      <div className="mt-1 text-gray-800 text-sm md:text-base">{children}</div>
    </div>
  );

  if (!RPS?.rpsData) {
    return (
      <div className="space-y-4 w-full px-4 md:px-0">
        <ClassBio data={data} />
        <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow text-center text-gray-500">
          📭{" "}
          <span className="block mt-2">
            RPS belum tersedia untuk mata kuliah ini pada periode berjalan.
          </span>
        </div>
      </div>
    );
  }

  const { mataKuliah, rpsData } = RPS;

  return (
    <div className="space-y-4 w-full px-4 md:px-0">
      <ClassBio data={data} />
      <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow overflow-x-auto">
        <InfoItem label="Mata Kuliah">
          {mataKuliah.kode} - {mataKuliah.nama}
        </InfoItem>
        <InfoItem label="Tanggal Penyusunan">
          {rpsData.tanggalPenyusunan
            ? DateFormatter(rpsData.tanggalPenyusunan)
            : "-"}
        </InfoItem>

        <InfoItem label="Deskripsi Mata Kuliah">
          {rpsData.deskripsiMataKuliah || "-"}
        </InfoItem>

        <InfoItem label="Tujuan Mata Kuliah">
          {rpsData.tujuanMataKuliah || "-"}
        </InfoItem>

        <InfoItem label="Materi Pembelajaran">
          {rpsData.materiPembelajaran || "-"}
        </InfoItem>

        <InfoItem label="Pustaka Utama">{rpsData.pustakaUtama || "-"}</InfoItem>

        <InfoItem label="Pustaka Pendukung">
          {rpsData.pustakaPendukung || "-"}
        </InfoItem>

        <InfoItem label="Dokumen RPS">
          {rpsData.dokumenRpsUrl ? (
            <a
              href={rpsData.dokumenRpsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-green-700 underline hover:text-green-900 break-words"
            >
              {rpsData.dokumenRpsNamaFile}
            </a>
          ) : (
            "-"
          )}
        </InfoItem>
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
                  {exam.siakRuangan?.namaRuangan ?? "-"}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {exam.siakDosen?.nama ?? "-"}
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
                           periodeAkademikId,
                           existingStudentIds = [],
                         }: {
  onClose: () => void;
  onSuccess: () => void;
  students: any[];
  kelasId: string;
  periodeAkademikId: string;
  existingStudentIds?: string[];
}) => {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { mutate, isPending } = addStudentToClass(kelasId);

  useEffect(() => {
    setShow(true);
  }, []);

  const availableStudents = students.filter(
      (s) =>
          !existingStudentIds.includes(s.id) &&
          s.nama?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStudent = (id: string) => {
    setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const addStudentClassAttendant = () => {
    if (selectedIds.length === 0) {
      alert("Pilih minimal satu mahasiswa.");
      return;
    }
    if (!periodeAkademikId) {
      alert("Periode akademik tidak ditemukan.");
      return;
    }

    mutate(
        { mahasiswaIds: selectedIds, siakPeriodeAkademikId: periodeAkademikId },
        {
          onSuccess: (res: any) => {
            const results = res?.data?.results ?? res?.results;
            const failedList = results?.failed ?? [];

            if (failedList.length > 0) {
              const failedNames = failedList
                  .map((f: any) => `${f.nama}: ${f.error}`)
                  .join("<br/>");
              Swal.fire({
                icon: "warning",
                title: "Sebagian berhasil ditambahkan",
                html: `${results.success.length} berhasil, ${failedList.length} gagal:<br/><small>${failedNames}</small>`,
                confirmButtonColor: "#10b981",
              });
            } else {
              Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Peserta berhasil ditambahkan ke kelas.",
                confirmButtonColor: "#10b981",
                timer: 1500,
                showConfirmButton: false,
              });
            }
            onSuccess();
          },
          onError: (err: any) => {
            Swal.fire({
              icon: "error",
              title: "Gagal",
              text:
                  err?.response?.data?.message ||
                  err.message ||
                  "Gagal menambahkan peserta.",
              confirmButtonColor: "#ef4444",
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

          <input
              type="text"
              placeholder="Cari nama mahasiswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring focus:ring-primary-green"
          />

          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded mb-4">
            {availableStudents.length === 0 ? (
                <p className="text-center text-sm text-gray-500 py-4">
                  Tidak ada mahasiswa yang bisa ditambahkan.
                </p>
            ) : (
                availableStudents.map((student) => (
                    <label
                        key={student.id}
                        className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                          type="checkbox"
                          checked={selectedIds.includes(student.id)}
                          onChange={() => toggleStudent(student.id)}
                      />
                      <span className="text-sm">{student.nama}</span>
                    </label>
                ))
            )}
          </div>

          <p className="text-xs text-gray-500 mb-4">
            {selectedIds.length} mahasiswa dipilih
          </p>

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
                disabled={isPending || selectedIds.length === 0}
            >
              {isPending ? "Menambahkan..." : `Tambah (${selectedIds.length})`}
            </button>
          </div>
        </div>
      </div>
  );
};

export default DetailCollegeClass;
