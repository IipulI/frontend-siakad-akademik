import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { Api } from "../../../api/Index";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TableCurriculumProdi } from "../../../components/Table";
import { RefreshCw, Plus, Trash, Save } from "lucide-react";
import { getCourseData } from "../../../hooks/academic/useCourseManagement.ts";
import { getProdi } from "../../../hooks/academic/useProdi.ts";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear.ts";
import { useDeleteCurriculumProdi } from "../../../hooks/academic/useCurriculumProdi.ts";
import { SelectInput } from "../../../components/admin-academic/student-data/Input.tsx";
import { getSubjects } from "../../../hooks/useKelasKuliah.ts";

type CurriculumQueryParams = {
  programStudi: string;
  tahunKurikulum: string;
};

interface AddCurriculumProdiData {
  siakProgramStudiId: string;
  siakTahunKurikulumId: string;
  semester: number;
  opsiMataKuliah: boolean;
  nilaiMin: string;
}

const transformDataForTable = (data: any[]): any[] => {
  const flatData: any[] = [];

  data.forEach((semesterData) => {
    semesterData.mataKuliah.forEach((mk: any, index: number) => {
      flatData.push({
        ...mk,
        semester: semesterData.semester,
        totalSks: mk.sksTatapMuka + mk.sksPraktikum,
        prasyarat:
          [
            mk.prasyaratMataKuliah1?.kodeMataKuliah,
            mk.prasyaratMataKuliah2?.kodeMataKuliah,
            mk.prasyaratMataKuliah3?.kodeMataKuliah,
          ]
            .filter(Boolean)
            .join(", ") || "-",
        status: mk.opsiMataKuliah ? "Wajib" : "Pilihan",
      });
    });
  });

  return flatData;
};

const fetchCurriculumProdiData = async ({
  queryKey,
}: {
  queryKey: [string, CurriculumQueryParams];
}): Promise<any[]> => {
  const [, { programStudi, tahunKurikulum }] = queryKey;
  const token = localStorage.getItem("token");
  if (!token)
    throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get("/akademik/kurikulum-prodi", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      programStudi,
      tahunKurikulum,
    },
  });

  const data = response.data?.data;
  console.log("🔍 Raw kurikulum prodi API data:", data);

  return Array.isArray(data) ? data : [];
};

const useAddCurriculumProdi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: AddCurriculumProdiData;
    }) => {
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error(
          "Token tidak ditemukan. Silakan login terlebih dahulu."
        );

      const payload = {
        siakProgramStudiId: data.siakProgramStudiId,
        siakTahunKurikulumId: data.siakTahunKurikulumId,
        semester: data.semester,
        opsiMataKuliah: data.opsiMataKuliah,
        nilaiMin: data.nilaiMin,
      };

      console.log("Final payload:", payload);

      const response = await Api.put(
        `/akademik/kurikulum-prodi/add/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["kurikulumProdi"] });
    },
    onError: (error: any) => {
      console.error("❌ Mutation error:", error);
      if (error.response) {
        console.error("Error status:", error.response.status);
        console.error("Error data:", error.response.data);
      }
    },
  });
};

const CurriculumProdi: React.FC = () => {
  // --- State Management ---
  const [selectedProgramStudi, setSelectedProgramStudi] = useState<string>("");
  const [selectedTahunKurikulum, setSelectedTahunKurikulum] =
    useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [selectedMataKuliah, setSelectedMataKuliah] = useState<string>("all");
  const [selectedNilaiMin, setSelectedNilaiMin] = useState<string>("all");
  const [opsiMataKuliah, setOpsiMataKuliah] = useState<string | null>(null);

  // Get query client for cache invalidation
  const queryClient = useQueryClient();

  const {
    data: courseData = [],
    isLoading: isCourseLoading,
    error: courseError,
  } = getSubjects();
  const {
    data: prodiData = [],
    isLoading: isProdiLoading,
    error: prodiError,
  } = getProdi();
  const {
    data: curriculumData = [],
    isLoading: isCurriculumLoading,
    error: curriculumError,
  } = getCurriculumYear();

  const { mutate } = useDeleteCurriculumProdi();

  useEffect(() => {
    if (prodiData.length > 0 && selectedProgramStudi === "") {
      setSelectedProgramStudi(prodiData[0].namaProgramStudi);
    }
  }, [prodiData, selectedProgramStudi]);

  useEffect(() => {
    if (curriculumData.length > 0 && selectedTahunKurikulum === "") {
      setSelectedTahunKurikulum(curriculumData[0].tahun.toString());
    }
  }, [curriculumData, selectedTahunKurikulum]);

  const queryParams = {
    programStudi: selectedProgramStudi,
    tahunKurikulum: selectedTahunKurikulum,
  };

  const { data: rawCurriculumProdiData = [], isLoading } = useQuery({
    queryKey: ["kurikulumProdi", queryParams],
    queryFn: fetchCurriculumProdiData,
    enabled: selectedProgramStudi !== "" && selectedTahunKurikulum !== "",
  });

  const curriculumProdiData = React.useMemo(() => {
    return transformDataForTable(rawCurriculumProdiData);
  }, [rawCurriculumProdiData]);

  const filteredData = React.useMemo(() => {
    let filtered = [...curriculumProdiData];

    return filtered;
  }, [curriculumProdiData]);

  const addCurriculumProdi = useAddCurriculumProdi();

  const handleTambahData = () => {
    const selectedCourse = courseData.find(
      (course) => course.namaMataKuliah === selectedMataKuliah
    );
    const selectedKurikulum = curriculumData.find(
      (item) => item.tahun.toString() === selectedTahunKurikulum
    );
    const selectedProdi = prodiData.find(
      (prodi) => prodi.namaProgramStudi === selectedProgramStudi
    );

    if (
      !selectedCourse ||
      !selectedKurikulum ||
      !selectedProdi ||
      selectedSemester === "all" ||
      selectedNilaiMin === "all" ||
      !opsiMataKuliah ||
      (opsiMataKuliah !== "wajib" && opsiMataKuliah !== "pilihan")
    ) {
      alert("Mohon lengkapi semua data terlebih dahulu sebelum menambahkan.");
      return;
    }

    const newData: AddCurriculumProdiData = {
      siakProgramStudiId: selectedProdi.id,
      siakTahunKurikulumId: selectedKurikulum.id,
      semester: Number(selectedSemester),
      opsiMataKuliah: opsiMataKuliah === "wajib",
      nilaiMin: selectedNilaiMin,
    };

    addCurriculumProdi.mutate(
      { id: selectedCourse.id, data: newData },
      {
        onSuccess: () => {
          setSelectedMataKuliah("all");
          setSelectedSemester("all");
          setSelectedNilaiMin("all");
          setOpsiMataKuliah(null);
          queryClient.invalidateQueries({ queryKey: ["kurikulumProdi"] });
        },
        onError: (error: any) => {
          console.error("❌ Gagal menambahkan data:", error);

          let errorMessage = "❌ Gagal menambahkan data.";

          if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            switch (status) {
              case 400:
                errorMessage = `❌ Data tidak valid: ${
                  data.message || "Periksa kembali data yang diinput"
                }`;
                break;
              case 401:
                errorMessage = "❌ Sesi telah berakhir. Silakan login kembali.";
                break;
              case 403:
                errorMessage =
                  "❌ Anda tidak memiliki akses untuk melakukan operasi ini.";
                break;
              case 409:
                errorMessage = "❌ Data sudah ada atau terjadi konflik data.";
                break;
              case 500:
                errorMessage =
                  "❌ Terjadi kesalahan server. Silakan hubungi admin.";
                break;
              default:
                errorMessage = `❌ Error ${status}: ${
                  data.message || "Terjadi kesalahan"
                }`;
            }
          }

          alert(errorMessage);
        },
      }
    );
  };

  // Get unique semesters for dropdown
  const availableSemesters = React.useMemo(() => {
    const semesters = [
      ...new Set(curriculumProdiData.map((item) => item.semester)),
    ];
    return semesters.sort((a, b) => parseInt(a) - parseInt(b));
  }, [curriculumProdiData]);

  // Event Handlers
  const handleProgramStudiChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedProgramStudi(e.target.value);
  };

  const handleTahunKurikulumChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTahunKurikulum(e.target.value);
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(e.target.value);
  };

  const handleMataKuliahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMataKuliah(e.target.value);
  };

  const handleNilaiMinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNilaiMin(e.target.value);
  };

  const handleOpsiMataKuliahChange = (value: string) => {
    setOpsiMataKuliah(value);
  };

  // PERBAIKAN: Form validation yang lebih tepat
  const isFormValid =
    selectedProgramStudi !== "" &&
    selectedTahunKurikulum !== "" &&
    selectedMataKuliah !== "all" &&
    selectedSemester !== "all" &&
    selectedNilaiMin !== "all" &&
    opsiMataKuliah !== null &&
    (opsiMataKuliah === "wajib" || opsiMataKuliah === "pilihan");

  console.log("COURSE DATA", courseData);

  return (
    <MainLayout isGreeting={false} titlePage="Kurikulum Prodi" className="">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5 flex flex-col items-center justify-between gap-4 md:flex-row md:mb-6">
        <div className="flex flex-col gap-4 mb-4 md:flex-row md:mb-0 w-full">
          <div className="flex items-center gap-2 w-full md:w-96">
            <span className="whitespace-nowrap w-28 text-primary-yellow font-semibold">
              Program Studi
            </span>
            <select
              className="rounded px-3 py-2 border border-primary-brown flex-1 w-20"
              value={selectedProgramStudi}
              onChange={handleProgramStudiChange}
            >
              <option value="">-- Pilih Program Studi --</option>
              {prodiData.map((prodi) => (
                <option key={prodi.id} value={prodi.namaProgramStudi}>
                  {prodi.namaProgramStudi}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 w-full md:w-72">
            <span className="whitespace-nowrap w-28 text-primary-yellow font-semibold">
              Kurikulum
            </span>
            <select
              className="rounded px-3 py-2 border border-primary-brown flex-1"
              value={selectedTahunKurikulum}
              onChange={handleTahunKurikulumChange}
            >
              <option value="">-- Pilih Tahun Kurikulum --</option>
              {curriculumData.map((item) => (
                <option key={item.id} value={item.tahun.toString()}>
                  {item.tahun}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add New Data Form */}
      <div className="w-full bg-white py-4 border-t-2 border-primary-green rounded-sm md:mb-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 px-4 md:px-8 max-w-screen-lg mx-auto">
          <div className="flex flex-col gap-4 md:flex-row w-full">
            {/* Mata Kuliah Dropdown */}
            <div className="flex flex-col gap-2 w-full md:w-96 md:ml-[-40px]">
              <span className="text-primary-green font-semibold">
                Mata Kuliah
              </span>
              <div className="relative">
                {/* <select
                  className="w-full px-4 py-2 border border-primary-brown bg-primary-light rounded hover:bg-primary-hover focus:outline-primary-green transition duration-200 text-primary-green font-semibold"
                  value={selectedMataKuliah}
                  onChange={handleMataKuliahChange}
                >
                  <option value="all">-- Cari Mata Kuliah --</option>
                  {courseData.map((mataKuliah) => (
                    <option
                      key={mataKuliah.id}
                      value={mataKuliah.namaMataKuliah}
                    >
                      {mataKuliah.namaMataKuliah}
                    </option>
                  ))}
                </select> */}

                <SelectInput
                  label="Mata Kuliah"
                  options={
                    courseData?.filter(
                      (matkul) =>
                        matkul.namaProgramStudi === selectedProgramStudi
                    ) ?? []
                  }
                  required
                  getOptionLabel={(opt) => opt.namaMataKuliah}
                  getOptionValue={(opt) => opt.id}
                  value={selectedMataKuliah}
                  onChange={(val) =>
                    setSelectedMataKuliah(val?.mataKuliahId ?? "")
                  }
                />
              </div>
            </div>

            {/* Semester Dropdown */}
            <div className="flex flex-col gap-2 w-full md:w-40">
              <span className="text-primary-green font-semibold">Semester</span>
              <div className="relative">
                <select
                  className="w-full px-4 py-2 border border-primary-brown bg-primary-light rounded hover:bg-primary-hover focus:outline-primary-green transition duration-200 text-primary-green font-semibold"
                  value={selectedSemester}
                  onChange={handleSemesterChange}
                >
                  <option value="all">-- Pilih Semester --</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option
                      key={sem}
                      value={sem.toString()}
                      className="font-semibold"
                    >
                      {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nilai Minimum Dropdown */}
            <div className="flex flex-col gap-2 w-full md:w-40">
              <span className="text-primary-green font-semibold">
                Nilai Minimum
              </span>
              <div className="relative">
                <select
                  className="w-full px-4 py-2 border border-primary-brown bg-primary-light rounded hover:bg-primary-hover focus:outline-primary-green transition duration-200 text-primary-green font-semibold"
                  value={selectedNilaiMin}
                  onChange={handleNilaiMinChange}
                >
                  <option value="all">-- Pilih Nilai --</option>
                  <option value="A" className="font-semibold">
                    A
                  </option>

                  <option value="AB" className="font-semibold">
                    AB
                  </option>
                  <option value="B" className="font-semibold">
                    B
                  </option>
                  <option value="BC" className="font-semibold">
                    BC
                  </option>
                  <option value="C" className="font-semibold">
                    C
                  </option>
                  <option value="CD" className="font-semibold">
                    CD
                  </option>
                  <option value="D" className="font-semibold">
                    D
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Checkbox & Button Section */}
          <div className="flex flex-col gap-3 md:gap-6 md:flex-row md:items-end">
            <div className="flex flex-col gap-2 text-primary-green">
              <h3 className="font-bold">Opsi Tambahan</h3>
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="opsiWajib"
                    name="opsiMataKuliah"
                    className="w-4 h-4"
                    checked={opsiMataKuliah === "wajib"}
                    onChange={() => handleOpsiMataKuliahChange("wajib")}
                  />
                  <label htmlFor="opsiWajib" className="font-semibold">
                    MK Wajib
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="opsiPilihan"
                    name="opsiMataKuliah"
                    className="w-4 h-4"
                    checked={opsiMataKuliah === "pilihan"}
                    onChange={() => handleOpsiMataKuliahChange("pilihan")}
                  />
                  <label htmlFor="opsiPilihan" className="font-semibold">
                    MK Pilihan
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="bg-primary-green text-white rounded px-4 py-2 flex items-center gap-1 cursor-pointer duration-200 disabled:bg-gray-400"
                onClick={handleTambahData}
                disabled={
                  !isFormValid || isLoading || addCurriculumProdi.isPending
                }
              >
                {isLoading || addCurriculumProdi.isPending ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Plus size={16} />
                )}
                {isLoading || addCurriculumProdi.isPending
                  ? "Loading..."
                  : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="w-full bg-white min-h-screen py-4 rounded-sm border-t-2 border-primary-yellow p-8">
        <div className="mt-8">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin" />
                <p>Memuat data...</p>
              </div>
            </div>
          ) : (
            <TableCurriculumProdi
              data={filteredData}
              tableHead={[
                "No",
                "Semester",
                "Kode",
                "Mata Kuliah",
                "SKS",
                "Status",
                "Nilai Min",
                "Prasyarat",
                "Aksi",
              ]}
              error="Data tidak ditemukan."
              onDelete={mutate}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CurriculumProdi;
