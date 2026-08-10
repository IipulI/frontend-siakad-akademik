import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { studentAcademicService } from "../../api/mahasiswa/studentAcademicService";
import { IStudentBiodata } from "../../types/mahasiswa.types";
import { useAccountInfo } from "../../hooks/useAccountInfo";
import { useMahasiswaProfile } from "../../hooks/mahasiswa/useProfile";
import BiodataSection from "./BiodataSection";
import HorizontalLine from "../profile/HorizontalLine";

interface BiodataProps {
  showLine?: boolean;
  biodata?: IStudentBiodata;
  isLoading?: boolean;
}

const Biodata = ({ showLine = true, biodata: propBiodata, isLoading: propIsLoading }: BiodataProps) => {
  const accountInfo = useAccountInfo();

  // 1. Fetch from the specific student biodata API if not passed via props
  const { data: queryBiodata, isLoading: queryIsLoading, isError: queryIsError } = useQuery({
    queryKey: ['studentBiodata'],
    queryFn: studentAcademicService.getStudentBiodata,
    enabled: !propBiodata,
    retry: 1,
  });

  const hasBiodata = !!(propBiodata || queryBiodata);

  // 2. Fetch the profile as a fallback if the biodata API fails or is not available
  const { profile, loading: profileLoading } = useMahasiswaProfile(
    !hasBiodata && !propIsLoading && !queryIsLoading && accountInfo?.id ? accountInfo.id : null
  );

  const activeIsLoading = propIsLoading !== undefined ? propIsLoading : (queryIsLoading || (profileLoading && !hasBiodata));

  // Build the active data object with progressive fallbacks
  const getActiveData = () => {
    const source = propBiodata || queryBiodata;

    return {
      nim: source?.nim || profile?.npm || accountInfo?.code || "-",
      nama: source?.nama || profile?.nama || accountInfo?.nama || "-",
      prodi: source?.prodi || profile?.namaProgramStudi || "-",
      status: source?.status || profile?.statusMahasiswa || "-",
      angkatan: source?.angkatan || profile?.angkatan || "-",
      kurikulum: source?.kurikulum || profile?.kurikulum || "-",
      semester: source?.semester || (profile?.semester ? String(profile.semester) : "-"),
      pembimbing: source?.pembimbing || "-",
      sksLulus: source?.sksLulus || (profile?.sks !== null && profile?.ipk !== null && profile?.sks !== undefined && profile?.ipk !== undefined ? `${profile.sks} / ${profile.ipk}` : "-"),
      totalSks: source?.totalSks || (profile?.sks !== null && profile?.ipk !== null && profile?.sks !== undefined && profile?.ipk !== undefined ? `${profile.sks} / ${profile.ipk}` : "-"),
    };
  };

  const data = getActiveData();

  const sections = [
    {
      title: [
        "NIM",
        "Nama Mahasiswa",
        "Program Studi",
        "Status Mahasiswa",
        "Angkatan",
      ],
      value: [data.nim, data.nama, data.prodi, data.status, data.angkatan],
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
        data.kurikulum,
        data.semester,
        data.pembimbing,
        data.sksLulus,
        data.totalSks,
      ],
    },
  ];

  return (
    <div className="space-y-1">
      {showLine && <HorizontalLine />}
      <div className="w-full grid grid-cols-2 lg:grid-cols-4 items-center bg-[#F5FFF9] px-6 py-4 border-l-4 border-primary-green">
        {activeIsLoading && !hasBiodata ? (
          <div className="col-span-full flex justify-center items-center py-2">
            <p className="text-gray-500 font-medium text-sm">Memuat data biodata... ⏳</p>
          </div>
        ) : (
          sections.map((section, index) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default Biodata;

