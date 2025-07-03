import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useEffect, useState } from "react";
import SelectOption from "../../../components/lecturer/SelectOption";
import TableSchedule from "../../../components/lecturer/TableSchedule";
import { useAcademicPeriodDropdown } from "../../../hooks/lecturer/useFetchDropdown";
import { useScheduleList } from "../../../hooks/lecturer/useFetchSchedule";

const ScheduleLecturer = () => {

  const [selectedPeriode, setSelectedPeriode] = useState("");

  const { data: periodeAkademikDropdown } = useAcademicPeriodDropdown()
  const { data, isPending, error } = useScheduleList(selectedPeriode)
  
  const periodeOptions = periodeAkademikDropdown?.data?.map((item: any) => ({
    value: item.id,
    label: item.namaPeriode,
  })) || [];
  
  useEffect(() => {
    if (periodeAkademikDropdown?.data?.length > 0) {
      setSelectedPeriode(periodeAkademikDropdown?.data[0].id);

    }
  }, [periodeAkademikDropdown]);

  const hariList = [
    { key: "senin", label: "Senin" },
    { key: "selasa", label: "Selasa" },
    { key: "rabu", label: "Rabu" },
    { key: "kamis", label: "Kamis" },
    { key: "jumat", label: "Jumat" },
    { key: "sabtu", label: "Sabtu" },
  ];

  const jadwalData = data?.data
    ? hariList.map((hari) => ({
        hari: hari.label,
        dataKuliah: data.data[hari.key] || [],
      }))
    : [];


  return (
    <MainLayout
      isGreeting={false}
      titlePage={"Kalender Akademik"}
      className={""}
    >
      <div className="relative">
        <div className="flex w-full justify-end">
          <div className="py-2 absolute md:-top-14 -top-4 px-4 md:w-72 w-60 rounded-lg bg-white ">
            <SelectOption
              label="Periode Akademik"
              options={periodeOptions}
              value={selectedPeriode}
              onChange={setSelectedPeriode}
            />
          </div>
        </div>
        <div className="mt-10 md:mt-6">
          {hariList.map((hari, idx) => (
            <TableSchedule
              key={idx}
              hari={hari.label}
              data={isPending || error ? [] : (jadwalData[idx]?.dataKuliah || [])}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default ScheduleLecturer;
