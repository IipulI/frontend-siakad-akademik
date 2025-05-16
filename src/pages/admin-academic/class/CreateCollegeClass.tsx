import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { ArrowLeft, CircleX, Plus, Save } from "lucide-react";
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

const CreateCollegeClass = () => {
  const systemOptions = [{ value: "", label: "Semua Sistem Kuliah" }];
  const periodOptions = [{ value: "", label: "2025 Ganjil" }];
  const subjectOptions = [{ value: "", label: "Mata Kuliah" }];
  const yearOptions = [{ value: "", label: "2025" }];
  const prodiOptions = [{ value: "", label: "Universitas Ibnu Khaldun" }];
  const curiculumOptions = [{ value: "", label: "Semua Kurikulum" }];
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
  return (
    <MainLayout titlePage="Data Kelas" isGreeting={false}>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-[#DFF0D8]">
          <span>
            Default Isian Tanngal Mulai dan Tanggal Selesai diambil dari Periode
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
              onClick={save}
            />
          </div>
          <div className="space-y-3">
            <div>
              <h1 className="font-bold text-2xl">Informasi Kelas</h1>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <SelectInput
                required={true}
                options={periodOptions}
                label="Periode Akademik"
              />
              <SelectInput
                required={true}
                options={systemOptions}
                label="Sistem Kuliah"
              />
              <SelectInput
                required={true}
                options={prodiOptions}
                label="Program Studi"
              />
              <TextInput label="Kapasitas" />
              <SelectInput
                options={yearOptions}
                required={true}
                label="Tahun Kurikulum"
              />
              <DateInput label="Tanggal Mulai" />
              <TextInput label="Mata Kuliah" />
              <DateInput label="Tanggal Selesai" />
              <TextInput label="Nama Kelas" />
              <TextInput label="Jumlah Pertemuan" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <h1 className="font-bold text-2xl">Jadwal Mingguan</h1>
            </div>
            <CreateCollegeClassTable scheduleList={scheduleList} />
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

const CreateCollegeClassTable = ({ scheduleList }) => {
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
            <th className="p-2 border font-semibold border-gray-300"></th>
          </tr>
        </thead>
        <tbody>
          {scheduleList.map((_, index) => (
            <tr key={index} className="hover:bg-gray-50 text-center">
              <td className="p-2 border border-gray-300 font-semibold">
                {index + 1}
              </td>
              <td className="p-2 border border-gray-300 font-semibold">
                <CreateCollegeSelectOption />
              </td>
              <td className="p-2 border border-gray-300 font-semibold">
                <CreateCollegeSelectOption />
              </td>
              <td className="p-2 border border-gray-300 font-semibold">
                <CreateCollegeSelectOption />
              </td>
              <td className="p-2 border border-gray-300 font-semibold">
                <CreateCollegeSelectOption />
              </td>
              <td className="p-2 border border-gray-300 font-semibold">
                <CreateCollegeSelectOption />
              </td>
              <td className="p-2 border border-gray-300 font-semibold">
                <CreateCollegeSelectOption />
              </td>
              <td className="p-2 border border-gray-300 font-semibold"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreateCollegeClass;
