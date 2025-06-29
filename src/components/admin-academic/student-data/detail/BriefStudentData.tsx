import { Fragment } from "react";
import HorizontalLine from "../../../profile/HorizontalLine";
import BiodataSection from "../../../biodata/BiodataSection";
import { useStudentDetail } from "../../../../hooks/admin-akademik/useMahasiswa";
import { useLocation } from "react-router-dom";

interface BiodataProps {
  showLine?: boolean;
}

export const BriefStudentData = ({ showLine = true }: BiodataProps) => {

  const { state } = useLocation();

  const {data} = useStudentDetail(state);

  const sections = [
    {
      title: [
        "NIM",
        "Nama Mahasiswa",
        "Program Studi",
        "Status Mahasiswa",
        "Angkatan",
      ],
      value: [data?.npm, data?.nama, data?.namaProgramStudi, data?.statusMahasiswa, data?.angkatan],
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
        data?.kurikulum || "-",
        data?.semester,
        data?.pembimbingAkademik || "-",
        data?.sks || "-",
        data?.totalSks || "-",
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