import { Fragment } from "react";
import HorizontalLine from "../../../profile/HorizontalLine";
import BiodataSection from "../../../biodata/BiodataSection";
import { useStudentDetail } from "../../../../hooks/admin-akademik/useMahasiswa";
import { useLocation } from "react-router-dom";
import { getStudentInfo } from "../../../../hooks/admin-akademik/useStudentDetail";

interface BiodataProps {
  showLine?: boolean;
}

export const BriefStudentData = ({ showLine = true }: BiodataProps) => {
  const { state } = useLocation();
  const { data } = getStudentInfo(state);

  console.log("data", data);

  const sections = [
    {
      title: [
        "NIM",
        "Nama Mahasiswa",
        "Program Studi",
        "Status Mahasiswa",
        "Angkatan",
      ],
      value: [
        data?.nim,
        data?.namaMahasiswa,
        data?.programStudi,
        data?.statusMahasiwa,
        data?.angkatan,
      ],
    },
    {
      title: [
        "Tahun Kurikulum",
        "Semester",
        "Pembimbing Akademik",
        "SKS Lulus/IPK Lulus",
        "Total SKS/IPK",
      ],
      value: [
        data?.tahunKurikulum || "-",
        data?.semester,
        data?.pembimbingAkademik,
        `${data?.sksLulus || 0}/${data?.ipkLulus || 0}`,
        `${data?.totalSks || 0}/${data?.ipk || 0}`,
      ],
    },
  ];

  return (
    <div className="space-y-1">
      {showLine && <HorizontalLine />}
      <div className="w-full grid grid-cols-2 lg:grid-cols-4 items-center bg-[#F5FFF9] px-6 py-4 border-l-4 border-primary-green">
        {sections.map((section, index) => (
          <Fragment key={index}>
            <BiodataSection
              key={`title-${index}`}
              title={section.title}
              isTitle={true}
            />
            <BiodataSection
              key={`value-${index}`}
              title={section.value}
              isTitle={false}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};
