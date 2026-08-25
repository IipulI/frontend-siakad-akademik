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
  getSubjects,
  getYearCuriculum,
} from "../../../hooks/useKelasKuliah";

const CreateCollegeClass = () => {
  const navigate = useNavigate();
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

  const [academicPeriodId, setAcademicPeriodId] = useState("");
  const [systemType, setSystemType] = useState("");
  const [programStudyId, setProgramStudyId] = useState("");
  const [selectedProgramStudyName, setSelectedProgramStudyName] = useState("");

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
      },
    ]);
  };
  const back = () => {
    navigate(AdminAcademicRoute.collegeClass.class);
  };

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
      jadwalKuliah: scheduleList.map((item) => ({
        hari: item.day,
        siakRuanganId: item.room,
        jamMulai: item.startTime + ":00", // tambahkan detik
        jamSelesai: item.endTime + ":00", // tambahkan detik
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
  } = getSubjects();

  const {
    data: rooms,
    isLoading: isLoadingRooms,
    error: isErrorRooms,
  } = getRooms();

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

  console.log(subjects?.map((matkul) => matkul.programStudi.nama) ?? [])
  console.log(selectedProgramStudyName)
  console.log(subjects?.filter(
      (matkul) =>
          matkul.programStudi.nama === selectedProgramStudyName
  ) ?? [])

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
                  setSelectedProgramStudyName(val?.nama ?? "");
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
                getOptionValue={(opt) => opt.tahun}
                onChange={(val) => setYearCurriculum(val?.tahun ?? "")}
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
                options={
                  subjects?.filter(
                    (matkul) =>
                      matkul.programStudi.nama === selectedProgramStudyName
                  ) ?? []
                }
                required={true}
                value={subject}
                getOptionLabel={(opt) => opt.nama}
                getOptionValue={(opt) => opt.id}
                label="Mata Kuliah"
                onChange={(val) => {
                  console.log("Selected Mata Kuliah:", val);
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
}) => {
  const meetingTypes = ["Kuliah", "Kuliah Lapangan", "Praktikum"];
  const learningMethod = ["Offline", "Online", "Hybrid"];
  const handleChange = (index, field, value) => {
    const newSchedule = [...scheduleList];
    newSchedule[index][field] = value;
    setScheduleList(newSchedule);
  };

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  // Sudah pakai ID

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
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
                <input
                  type="time"
                  value={item.startTime}
                  onChange={(e) =>
                    handleChange(index, "startTime", e.target.value)
                  }
                  className="border p-1 w-full"
                />
              </td>

              {/* Jam Selesai */}
              <td className="p-2 border border-gray-300">
                <input
                  type="time"
                  value={item.endTime}
                  onChange={(e) =>
                    handleChange(index, "endTime", e.target.value)
                  }
                  className="border p-1 w-full"
                />
              </td>

              {/* Jenis Pertemuan */}
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  value={item.meetingType}
                  onChange={(e) =>
                    handleChange(index, "meetingType", e.target.value)
                  }
                  className="border p-1 w-full"
                />
              </td>

              {/* Metode Pembelajaran */}
              <td className="p-2 border border-gray-300">
                <input
                  type="text"
                  value={item.learningMethod}
                  onChange={(e) =>
                    handleChange(index, "learningMethod", e.target.value)
                  }
                  className="border p-1 w-full"
                />
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
                      {room.namaRuangan}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreateCollegeClass;
