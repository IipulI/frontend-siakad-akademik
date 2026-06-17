import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { TableObeCPL } from "../../../components/Table";
import { Search, ArrowLeft, Save, Plus } from "lucide-react";
import { getGraduateProfileData } from "../../../hooks/academic/useGraduateProfile.ts";
import {
  getObeCplData,
  useAddObeCpl,
  useUpdateObeCpl,
  useDeleteObeCpl,
  ObeCplData,
} from "../../../hooks/academic/useObeCpl.ts";
import LoadingSpinner from "../../../components/LoadingSpinner.tsx";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import SidebarOBE from "../../../components/admin-academic/academic/obe/SidebarOBE.tsx";

const ObeCpl: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<ObeCplData | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Queries
  const {
    data: cplResponse,
    isLoading: loading,
    error: cplError,
  } = getObeCplData(id!);

  // Fetch PL data to be mapped
  const {
    data: graduateProfileResponse,
    isLoading: isGraduateLoading,
  } = getGraduateProfileData(id!);

  const plList = graduateProfileResponse?.dataPl || [];
  const cplData = cplResponse?.dataCpl || (Array.isArray(cplResponse) ? cplResponse : []);
  const obeInfo = cplResponse?.header || graduateProfileResponse?.header || {};

  // Mutations
  const createMutation = useAddObeCpl();
  const updateMutation = useUpdateObeCpl();
  const deleteMutation = useDeleteObeCpl();

  // Loading states
  if (loading || isGraduateLoading) {
    return <LoadingSpinner />;
  }

  // Error states
  if (cplError) {
    return <div className="text-red-500">Gagal memuat data CPL</div>;
  }

  // Event handlers
  const handleBack = () => {
    navigate(AdminAcademicRoute.obeManagement.obeManagement);
  };

  const handleAddCpl = () => {
    setIsAdding(true);
    setIsEditing(false);
    setCurrentData({
      id: "",
      kode: "",
      deskripsi: "",
      kategori: "",
      profilLulusanIds: [],
    });
    setErrorMessage("");
  };

  const handleEdit = (editId: string) => {
    const selectedData = cplData.find((item: any) => item.id === editId);
    if (selectedData) {
      setCurrentData({
        id: selectedData.id,
        kode: selectedData.kode,
        deskripsi: selectedData.deskripsi,
        kategori: selectedData.kategori,
        profilLulusanIds: (selectedData.profilLulusan || []).map((pl: any) => pl.id),
      });
      setIsEditing(true);
      setIsAdding(false);
      setErrorMessage("");
    }
  };

  const handleDelete = (cplId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      deleteMutation.mutate(
        { id: cplId, obeId: id! },
        {
          onSuccess: () => {
            setErrorMessage("");
          },
          onError: (error) => {
            console.error("Delete error:", error);
            setErrorMessage("Gagal menghapus data. Silakan coba lagi.");
          },
        }
      );
    }
  };

  const handleCheckboxChange = (plId: string, checked: boolean) => {
    if (!currentData) return;

    const currentIds = currentData.profilLulusanIds || [];
    let nextIds = [];
    if (checked) {
      nextIds = [...currentIds, plId];
    } else {
      nextIds = currentIds.filter((x) => x !== plId);
    }

    setCurrentData({
      ...currentData,
      profilLulusanIds: nextIds,
    });
  };

  const handleSave = async () => {
    if (!currentData || !isFormValid()) {
      setErrorMessage("Semua kolom harus diisi.");
      return;
    }

    setErrorMessage("");

    const payload = {
      kode: currentData.kode.trim(),
      deskripsi: currentData.deskripsi.trim(),
      kategori: currentData.kategori.trim(),
      profilLulusanIds: currentData.profilLulusanIds || [],
    };

    const onSuccessCallback = () => {
      handleReset();
    };

    const onErrorCallback = (error: any) => {
      console.error("Save error:", error);
      if (error.response?.data?.message) {
        setErrorMessage(`Error: ${error.response.data.message}`);
      } else {
        setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
      }
    };

    if (isEditing && currentData.id) {
      updateMutation.mutate(
        { id: currentData.id, obeId: id!, payload },
        {
          onSuccess: onSuccessCallback,
          onError: onErrorCallback,
        }
      );
    } else if (isAdding) {
      createMutation.mutate(
        { obeId: id!, payload },
        {
          onSuccess: onSuccessCallback,
          onError: onErrorCallback,
        }
      );
    }
  };

  const handleReset = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentData(null);
    setErrorMessage("");
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const isFormValid = () => {
    return !!(
      currentData?.kode?.trim() &&
      currentData?.deskripsi?.trim() &&
      currentData?.kategori?.trim()
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const displayData = cplData.filter(
    (item: any) =>
      item.kode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kategori?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <MainLayout isGreeting={false} titlePage="Capaian Pembelajaran Lulusan (CPL)">
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex flex-col items-center justify-between mb-10 md:flex-row gap-4">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="flex items-center bg-primary-blueSoft text-white px-2 py-3 rounded-l-md"
            >
              <ArrowLeft className="mr-2" size={16} />
            </button>
            <div className="flex items-center">
              <input
                type="search"
                placeholder="Cari CPL"
                className="px-3 py-2 border border-black/50 w-64"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="bg-primary-yellow px-3 py-3 rounded-r-md">
                <Search color="white" size={20} />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBack}
              className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer"
            >
              <ArrowLeft className="mr-2" size={16} />
              Kembali ke Daftar
            </button>
            {(isAdding || isEditing) && (
              <button
                onClick={handleSave}
                disabled={!isFormValid() || isLoading}
                className="bg-primary-blueSoft text-white px-4 py-2 rounded flex items-center disabled:opacity-50"
              >
                <Save className="mr-2" size={16} />
                {isLoading ? "Menyimpan..." : "Simpan"}
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row">
          {/* Shared Sidebar Menu */}
          <SidebarOBE id={id!} activeTab="cpl" />

          <div className="w-full md:w-[80%] p-3">
            <div className="grid grid-cols-1 gap-2 bg-primary-green/10 p-4 md:grid-cols-2">
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">
                  Kode Prodi:
                </span>
                <span className="w-full text-left">
                  {obeInfo?.kodeProgramStudi || obeInfo?.kodeProdi || "-"}
                </span>
              </div>
              <div className="flex justify-between md:ml-8">
                <span className="font-semibold w-full text-left">
                  Tahun Kurikulum:
                </span>
                <span className="w-full text-left">
                  {obeInfo?.tahunKurikulum || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">
                  Program Studi:
                </span>
                <span className="w-full text-left">
                  {obeInfo?.programStudi || "-"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col md:items-center gap-2 md:flex-row justify-end">
              <button
                onClick={handleAddCpl}
                disabled={isAdding || isEditing}
                className={`w-full md:w-48 bg-primary-green text-white px-4 py-2 rounded flex items-center hover:bg-primary-blue justify-center ${
                  isAdding || isEditing ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Plus className="mr-2" size={16} />
                Tambah CPL
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <TableObeCPL
                data={displayData}
                tableHead={[
                  "Kode CPL",
                  "Deskripsi Capaian Pembelajaran Lulusan (CPL)",
                  "Kategori",
                  "Pemetaan PL ke CPL",
                  "Aksi",
                ]}
                error="Data tidak ditemukan."
                onEdit={handleEdit}
                onDelete={handleDelete}
                isEditing={isEditing}
                currentData={currentData}
                onSave={handleSave}
                onReset={handleReset}
                onInputChange={handleInputChange}
                isAdding={isAdding}
                isFormValid={isFormValid}
                plList={plList}
                onCheckboxChange={handleCheckboxChange}
              />
            </div>

            {/* Info */}
            <div className="mt-4 text-sm text-gray-600">
              <p>OBE ID: {id}</p>
              <p>Total Data: {cplData.length}</p>
              <p>Data Ditampilkan: {displayData.length}</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ObeCpl;
