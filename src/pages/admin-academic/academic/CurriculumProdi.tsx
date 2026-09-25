import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { TableCurriculumProdi } from "../../../components/Table";
import { RefreshCw, Plus } from "lucide-react";
import { getProdi } from "../../../hooks/academic/useProdi.ts";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear.ts";
import {
  useMataKuliahPerSemester,
  useAddCurriculumProdi,
  useDeleteCurriculumProdi,
} from "../../../hooks/academic/useCurriculumProdi.ts";
import { SelectInput } from "../../../components/admin-academic/student-data/Input.tsx";
import { getSubjects } from "../../../hooks/useKelasKuliah.ts";

interface SemesterGroup {
  semester: number | string;
  totalSksSemester: number;
  mataKuliah: {
    id: string;
    kode: string;
    nama: string;
    totalSks: number;
    opsiWajib: boolean;
    statusMk: string;
    nilaiMin: string;
    semester: number | string;
    prasyarat: string;
    konsentrasi: string;
  }[];
}

const transformDataForTable = (semesterData: SemesterGroup[] = []): any[] => {
  const flatData: any[] = [];
  let no = 0;

  semesterData.forEach((group) => {
    group.mataKuliah.forEach((mk) => {
      no += 1;
      flatData.push({
        id: mk.id,
        no,
        semester: group.semester,
        kode: mk.kode,
        mataKuliah: mk.nama,
        sks: mk.totalSks,
        status: mk.statusMk,
        nilaiMin: mk.nilaiMin,
        prasyarat: mk.prasyarat,
        konsentrasiBidang: mk.konsentrasi,
      });
    });
  });

  return flatData;
};

const CurriculumProdi: React.FC = () => {
  // --- State Management ---
  const [selectedProgramStudiId, setSelectedProgramStudiId] = useState<string>("");
  const [selectedTahunKurikulumId, setSelectedTahunKurikulumId] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [selectedMataKuliah, setSelectedMataKuliah] = useState<string>("all");
  const [selectedNilaiMin, setSelectedNilaiMin] = useState<string>("all");
  const [opsiMataKuliah, setOpsiMataKuliah] = useState<string | null>(null);

  const {
    data: prodiData = [],
    isLoading: isProdiLoading,
  } = getProdi();
  const {
    data: curriculumData = [],
    isLoading: isCurriculumLoading,
  } = getCurriculumYear();
  const {
    data: courseData = [],
    isLoading: isCourseLoading,
  } = getSubjects({
    programStudiId: selectedProgramStudiId,
    tahunKurikulumId: selectedTahunKurikulumId,
  });

  useEffect(() => {
    if (prodiData.length > 0 && selectedProgramStudiId === "") {
      setSelectedProgramStudiId(prodiData[0].id);
    }
  }, [prodiData, selectedProgramStudiId]);

  useEffect(() => {
    if (curriculumData.length > 0 && selectedTahunKurikulumId === "") {
      setSelectedTahunKurikulumId(curriculumData[0].id);
    }
  }, [curriculumData, selectedTahunKurikulumId]);

  const {
    data: perSemesterData,
    isLoading: isCurriculumProdiLoading,
  } = useMataKuliahPerSemester(selectedProgramStudiId, selectedTahunKurikulumId);

  const curriculumProdiData = React.useMemo(() => {
    return transformDataForTable(perSemesterData?.semesterData ?? []);
  }, [perSemesterData]);

  const addCurriculumProdi = useAddCurriculumProdi();
  const deleteCurriculumProdi = useDeleteCurriculumProdi();

  const handleTambahData = () => {
    if (
      selectedMataKuliah === "all" ||
      selectedSemester === "all" ||
      selectedNilaiMin === "all" ||
      !opsiMataKuliah ||
      (opsiMataKuliah !== "wajib" && opsiMataKuliah !== "pilihan")
    ) {
      alert("Mohon lengkapi semua data terlebih dahulu sebelum menambahkan.");
      return;
    }

    addCurriculumProdi.mutate(
      {
        mataKuliahId: selectedMataKuliah,
        semester: Number(selectedSemester),
        nilaiMin: selectedNilaiMin,
        statusMk: opsiMataKuliah === "wajib" ? "Wajib" : "Pilihan",
      },
      {
        onSuccess: () => {
          setSelectedMataKuliah("all");
          setSelectedSemester("all");
          setSelectedNilaiMin("all");
          setOpsiMataKuliah(null);
        },
        onError: (error: any) => {
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

  const handleHapusData = (id: string) => {
    if (!confirm("Yakin ingin menghapus Mata Kuliah ini dari kurikulum?")) return;
    deleteCurriculumProdi.mutate(id, {
      onError: (error: any) => {
        alert(
          `❌ Gagal menghapus data: ${
            error.response?.data?.message || error.message
          }`
        );
      },
    });
  };

  // Event Handlers
  const handleProgramStudiChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedProgramStudiId(e.target.value);
    setSelectedMataKuliah("all");
  };

  const handleTahunKurikulumChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedTahunKurikulumId(e.target.value);
    setSelectedMataKuliah("all");
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(e.target.value);
  };

  const handleNilaiMinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNilaiMin(e.target.value);
  };

  const handleOpsiMataKuliahChange = (value: string) => {
    setOpsiMataKuliah(value);
  };

  const isFormValid =
    selectedProgramStudiId !== "" &&
    selectedTahunKurikulumId !== "" &&
    selectedMataKuliah !== "all" &&
    selectedSemester !== "all" &&
    selectedNilaiMin !== "all" &&
    opsiMataKuliah !== null &&
    (opsiMataKuliah === "wajib" || opsiMataKuliah === "pilihan");

  const isLoading =
    isProdiLoading || isCurriculumLoading || isCurriculumProdiLoading;

  return (
    <MainLayout isGreeting={false} titlePage="Kurikulum Prodi" className="">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5 flex flex-col items-center justify-between gap-4 md:flex-row md:mb-6">
        <div className="flex flex-col gap-4 mb-4 md:flex-row md:mb-0 w-full">
          <div className="flex items-center gap-2 w-full md:w-96">
            <span className="whitespace-nowrap w-28 text-primary-yellow font-semibold">
              Program Studi
            </span>
            <select
              className="rounded px-3 py-2 border border-primary-brown flex-1"
              value={selectedProgramStudiId}
              onChange={handleProgramStudiChange}
            >
              <option value="">-- Pilih Program Studi --</option>
              {prodiData.map((prodi) => (
                <option key={prodi.id} value={prodi.id}>
                  {prodi.nama}
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
              value={selectedTahunKurikulumId}
              onChange={handleTahunKurikulumChange}
            >
              <option value="">-- Pilih Tahun Kurikulum --</option>
              {curriculumData.map((item) => (
                <option key={item.id} value={item.id}>
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
                <SelectInput
                  label="Mata Kuliah"
                  options={courseData ?? []}
                  required
                  getOptionLabel={(opt) => opt.nama}
                  getOptionValue={(opt) => opt.id}
                  value={selectedMataKuliah}
                  onChange={(val) => setSelectedMataKuliah(val?.id ?? "all")}
                />
              </div>
            </div>

            {/* Semester Dropdown */}
            <div className="flex flex-col gap-2 w-full md:w-40">
              <span className="text-primary-green font-semibold">Semester</span>
              <div className="relative">
                <select
                  className="w-full px-4 py-2 border border-primary-brown bg-primary-green/10 rounded hover:bg-primary-green/20 focus:outline-primary-green transition duration-200 text-primary-green font-semibold"
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
                  className="w-full px-4 py-2 border border-primary-brown bg-primary-green/10 rounded hover:bg-primary-green/20 focus:outline-primary-green transition duration-200 text-primary-green font-semibold"
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
                  !isFormValid || isCourseLoading || addCurriculumProdi.isPending
                }
              >
                {isCourseLoading || addCurriculumProdi.isPending ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Plus size={16} />
                )}
                {isCourseLoading || addCurriculumProdi.isPending
                  ? "Loading..."
                  : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="w-full bg-white min-h-screen py-4 rounded-sm border-t-2 border-primary-yellow p-8">
        <div className="mt-8 overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <RefreshCw size={16} className="animate-spin" />
                <p>Memuat data...</p>
              </div>
            </div>
          ) : (
            <TableCurriculumProdi
              data={curriculumProdiData}
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
              onDelete={handleHapusData}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CurriculumProdi;
