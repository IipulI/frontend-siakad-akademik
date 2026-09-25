import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { ArrowLeft, CircleX, Plus, Save } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import BorderedGreenContainer from "../../../components/BorderedGreenContainer";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import {
  DateInput,
  InputFilter,
  SelectInput,
  TextInput,
} from "../../../components/admin-academic/student-data/Input";
import { DosenAsyncSelect } from "../../../components/admin-academic/student-data/DosenAsyncSelect";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import getAcademicPeriods from "../../../hooks/usePeriodeAkademik";
import { getProdi as getProgramStudies } from "../../../hooks/academic/useProdi";
import { useMutation } from "@tanstack/react-query";
import { Api } from "../../../api/Index";
import {
  addCollegeClass,
  CreateCollegeClassPayload,
  getRooms,
  getSlotWaktu,
  getSubjects,
  getYearCuriculum,
} from "../../../hooks/useKelasKuliah";
import { useJenisPertemuan } from "../../../hooks/admin-akademik/useJenisPertemuan";

const CreateCollegeClass = () => {
  const navigate = useNavigate();
  const [scheduleList, setScheduleList] = useState([]);

  const [academicPeriodId, setAcademicPeriodId] = useState("");
  const [systemType, setSystemType] = useState("");
  const [programStudyId, setProgramStudyId] = useState("");

  const [yearCurriculum, setYearCurriculum] = useState("");

  const [capacity, setCapacity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subject, setSubject] = useState("");
  const [nameClass, setNameClass] = useState("");
  const [totalMeet, setTotalMeet] = useState("");

  const { mutate } = useMutation({
    mutationFn: async (data: CreateCollegeClassPayload) => {
      const response = await Api.post("/akademik/kelas-kuliah", data);
      return response.data;
    },
    onSuccess: () => {
      alert("Kelas berhasil ditambahkan!");
      navigate(AdminAcademicRoute.collegeClass.class);
    },
    onError: (err) => {
      console.error("Terjadi kesalahan:", err);
    },
  });

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
        lecturer: "",
        lecturerName: "",
      },
    ]);
  };
  const back = () => {
    navigate(AdminAcademicRoute.collegeClass.class);
  };

  const removeSchedule = (index) => {
    setScheduleList((prev) => prev.filter((_, i) => i !== index));
  };

  const validSchedules = scheduleList.filter(
      (item) =>
          item.day || item.startTime || item.endTime || item.meetingType ||
          item.learningMethod || item.room || item.lecturer
  ); // drop fully-empty rows

  // optional: guard against half-filled rows before submit
  const incomplete = validSchedules.some(
      (item) => !item.day || !item.startTime || !item.endTime || !item.room
  );
  if (incomplete) {
    alert("Lengkapi jadwal yang sudah diisi, atau hapus baris yang kosong.");
    return;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      siakPeriodeAkademikId: academicPeriodId,
      sistemKuliah: systemType,
      siakProgramStudiId: programStudyId,
      kapasitas: parseInt(capacity),
      tanggalMulai: startDate,
      tanggalSelesai: endDate,
      siakMataKuliahId: subject,
      nama: nameClass,
      jumlahPertemuan: parseInt(totalMeet),
      jadwalKuliah: validSchedules.map((item) => ({
        hari: item.day,
        siakRuanganId: item.room,
        siakDosenId: item.lecturer || null,
        jamMulai: item.startTime + ":00",
        jamSelesai: item.endTime + ":00",
        jenisPertemuan: item.meetingType,
        metodePembelajaran: item.learningMethod,
      })),
    };

    console.log("Payload ke mutate:", payload);
    mutate(payload);
  };

  const {
    data: academicPeriods,
    isLoading: isLoadingAcademicPeriod,
    error: isErrorAcademicPeriod,
  } = getAcademicPeriods();

  const {
    data: programStudies,
    isLoading: isLoadingProgramStudy,
    error: isErrorProgramStudy,
  } = getProgramStudies();

  const {
    data: curiculumYear,
    isLoading: isLoadingCuriculumYear,
    error: isErrorCuriculumYear,
  } = getYearCuriculum();

  const {
    data: subjects,
    isLoading: isLoadingSubjects,
    error: isErrorSubjects,
  } = getSubjects({
    programStudiId: programStudyId,
    tahunKurikulumId: yearCurriculum,
  });

  const {
    data: rooms,
    isLoading: isLoadingRooms,
    error: isErrorRooms,
  } = getRooms();

  const { data: slotWaktuList } = getSlotWaktu();

  const { data: jenisPertemuanList, isLoading: isLoadingJenisPertemuan } =
    useJenisPertemuan();

  console.log("Periode Akademik", academicPeriods);
  console.log("Program Studi", programStudies);
  console.log("Tahun Kurikulum", curiculumYear);
  console.log("Mata Kuliah", subjects);

  if (isLoadingAcademicPeriod || isLoadingProgramStudy) {
    return <LoadingSpinner />;
  }

  if (isErrorAcademicPeriod || isErrorProgramStudy) {
    return <div>Terjadi kesalahan saat mengambil data.</div>;
  }
  interface AcademicPeriod {
    id: string;
    namaPeriode: string;
  }

  interface SystemProps {
    id: string;
    type: string;
  }

  interface ProgramStudy {
    id: string;
    namaProgramStudi: string;
    jenjang: {
      id: string;
      nama: string;
      jenjang: string;
    };
  }

  const systemOptions = [
    {
      id: "1",
      type: "Reguler",
    },
    {
      id: "2",
      type: "Karyawan",
    },
  ];

  return (
    <MainLayout titlePage="Data Kelas" isGreeting={false}>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-[#DFF0D8]">
          <span>
            Default Isian Tanggal Mulai dan Tanggal Selesai diambil dari Periode
            Akademik dengan jenis Perkuliahan
          </span>
          <CircleX />
        </div>
        <BorderedGreenContainer>
          <div className="flex justify-end items-center space-x-4">
            <ButtonClick
              icon={<ArrowLeft size={15} strokeWidth={3} />}
              color="bg-primary-yellow"
              text="Kembali Ke Daftar"
              onClick={back}
            />
            <ButtonClick
              icon={<Save size={15} strokeWidth={3} />}
              color="bg-primary-blueSoft"
              text="Simpan"
              onClick={handleSubmit}
            />
          </div>
          <div className="space-y-3">
            <div>
              <h1 className="font-bold text-2xl">Informasi Kelas</h1>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <SelectInput<AcademicPeriod>
                label="Periode Akademik"
                options={academicPeriods}
                required
                value={academicPeriodId}
                getOptionLabel={(opt) => opt.nama}
                getOptionValue={(opt) => opt.id}
                onChange={(val) => setAcademicPeriodId(val?.id ?? "")}
              />
              <SelectInput<SystemProps>
                label="Sistem Kuliah"
                options={systemOptions}
                value={systemType} // ✅ gunakan value
                required
                getOptionLabel={(opt) => opt.type}
                getOptionValue={(opt) => opt.type}
                onChange={(val) => setSystemType(val?.type ?? "")}
              />
              <SelectInput<ProgramStudy>
                label="Program Studi"
                options={programStudies}
                // defaultValue=""
                value={programStudyId}
                required
                getOptionLabel={(opt) => opt.nama}
                getOptionValue={(opt) => opt.id}
                onChange={(val) => {
                  setProgramStudyId(val?.id ?? "");
                  setSubject("");
                }}
              />
              <TextInput
                value={capacity}
                onChange={(e) => setCapacity(e)}
                label="Kapasitas"
              />
              <SelectInput
                label="Tahun Kurikulum"
                options={curiculumYear}
                value={yearCurriculum}
                required
                getOptionLabel={(opt) => opt.tahun}
                getOptionValue={(opt) => opt.id}
                onChange={(val) => {
                  setYearCurriculum(val?.id ?? "");
                  setSubject("");
                }}
              />
              {/* <SelectInput
                label="Tahun Kurikulum"
                options={curiculumYear}
                value={systemType} // ✅ gunakan value
                required
                getOptionLabel={(opt) => opt.type}
                getOptionValue={(opt) => opt.type}
                onChange={(val) => setSystemType(val?.type ?? "")}
              /> */}
              <DateInput
                value={startDate}
                onChange={setStartDate}
                label="Tanggal Mulai"
              />

              <SelectInput
                options={subjects ?? []}
                required={true}
                value={subject}
                disabled={!programStudyId || !yearCurriculum}
                disabledPlaceholder="-- Pilih Program Studi & Tahun Kurikulum dahulu --"
                getOptionLabel={(opt) => opt.nama}
                getOptionValue={(opt) => opt.id}
                label="Mata Kuliah"
                onChange={(val) => {
                  setSubject(val?.id ?? "");
                }}
              />

              <DateInput
                value={endDate}
                onChange={setEndDate}
                label="Tanggal Selesai"
              />
              <TextInput
                value={nameClass}
                onChange={(e) => setNameClass(e)}
                label="Nama Kelas"
              />
              <TextInput
                value={totalMeet}
                onChange={(e) => setTotalMeet(e)}
                label="Jumlah Pertemuan"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <h1 className="font-bold text-2xl">Jadwal Mingguan</h1>
            </div>
            <CreateCollegeClassTable
              setScheduleList={setScheduleList}
              scheduleList={scheduleList}
              listRooms={rooms}
              listJenisPertemuan={jenisPertemuanList}
              listSlotWaktu={slotWaktuList}
              removeSchedule={removeSchedule}
            />
            <ButtonClick
              icon={<Plus size={15} strokeWidth={3} />}
              color="bg-primary-green"
              text="Tambah Jadwal"
              onClick={addNewSchedule}
            />
          </div>
        </BorderedGreenContainer>
      </div>
    </MainLayout>
  );
};

const CreateCollegeSelectOption = () => {
  return (
    <select className="border-2 py-0.5 px-2 text-primary-brown">
      <option value="">-- Pilih --</option>
    </select>
  );
};

const CreateCollegeClassTable = ({
  scheduleList,
  setScheduleList,
  listRooms,
  listJenisPertemuan,
  listSlotWaktu,
  removeSchedule,
}) => {
  const learningMethod = ["Offline", "Online", "Hybrid"];
  const handleChange = (index, field, value) => {
    const newSchedule = [...scheduleList];
    newSchedule[index][field] = value;
    setScheduleList(newSchedule);
  };

  const handleLecturerChange = (index, id, label) => {
    const newSchedule = [...scheduleList];
    newSchedule[index].lecturer = id;
    newSchedule[index].lecturerName = label;
    setScheduleList(newSchedule);
  };

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  // Sudah pakai ID

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[900px] w-full border-collapse">
        <thead>
          <tr className="bg-primary-green text-white">
            <th className="p-2 border font-semibold border-gray-300">No</th>
            <th className="p-2 border font-semibold border-gray-300">Hari</th>
            <th className="p-2 border font-semibold border-gray-300">
              Jam Mulai
            </th>
            <th className="p-2 border font-semibold border-gray-300">
              Jam Selesai
            </th>
            <th className="p-2 border font-semibold border-gray-300">
              Jenis Pertemuan
            </th>
            <th className="p-2 border font-semibold border-gray-300">
              Metode Pembelajaran
            </th>
            <th className="p-2 border font-semibold border-gray-300">
              Ruangan
            </th>
            <th className="p-2 border font-semibold border-gray-300">
              Dosen Pengajar
            </th>
            <th className="p-2 border font-semibold border-gray-300">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {scheduleList.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 text-center">
              <td className="p-2 border border-gray-300">{index + 1}</td>

              {/* Hari */}
              <td className="p-2 border border-gray-300">
                <select
                  value={item.day}
                  onChange={(e) => handleChange(index, "day", e.target.value)}
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

              {/* Jam Mulai */}
              <td className="p-2 border border-gray-300">
                <select
                  value={item.startTime}
                  onChange={(e) =>
                    handleChange(index, "startTime", e.target.value)
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

              {/* Jam Selesai */}
              <td className="p-2 border border-gray-300">
                <select
                  value={item.endTime}
                  onChange={(e) =>
                    handleChange(index, "endTime", e.target.value)
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

              {/* Jenis Pertemuan */}
              <td className="p-2 border border-gray-300">
                <select
                  value={item.meetingType}
                  onChange={(e) =>
                    handleChange(index, "meetingType", e.target.value)
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

              {/* Metode Pembelajaran */}
              <td className="p-2 border border-gray-300">
                <select
                  value={item.learningMethod}
                  onChange={(e) =>
                    handleChange(index, "learningMethod", e.target.value)
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

              {/* Ruangan */}
              <td className="p-2 border border-gray-300">
                <select
                  value={item.room}
                  onChange={(e) => handleChange(index, "room", e.target.value)}
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

              {/* Dosen Pengajar */}
              <td className="p-2 border border-gray-300">
                <DosenAsyncSelect
                  value={item.lecturer}
                  selectedLabel={item.lecturerName}
                  onChange={(id, label) =>
                    handleLecturerChange(index, id, label)
                  }
                />
              </td>
              <td className="p-2 border border-gray-300">
                <button
                    type="button"
                    onClick={() => removeSchedule(index)}
                    className="text-red-600 hover:text-red-800"
                    title="Hapus Jadwal"
                >
                  <CircleX size={18} strokeWidth={2} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreateCollegeClass;
