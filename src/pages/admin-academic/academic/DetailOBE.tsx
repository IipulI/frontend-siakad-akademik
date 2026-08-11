import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { TableGraduateProfile } from "../../../components/Table";
import { Search, ArrowLeft, Save, Plus } from "lucide-react";
import {
  getGraduateProfileData,
  useAddGraduateProfile,
  useDeleteGraduateProfile,
  useUpdateGraduateProfile,
  GraduateProfileData,
} from "../../../hooks/academic/useGraduateProfile.ts";
import LoadingSpinner from "../../../components/LoadingSpinner.tsx";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import SidebarOBE from "../../../components/admin-academic/academic/obe/SidebarOBE.tsx";

const DetailOBE: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // State
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState<GraduateProfileData | null>(
    null
  );
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Queries
  const {
    data: graduateProfileResponse,
    isLoading: isGraduateProfileLoading,
    error: graduateProfileError,
  } = getGraduateProfileData(id!);

  // Mutations
  const createMutation = useAddGraduateProfile();
  const updateMutation = useUpdateGraduateProfile();
  const deleteMutation = useDeleteGraduateProfile();

  // Loading states
  if (isGraduateProfileLoading) {
    return <LoadingSpinner />;
  }

  // Error states
  if (graduateProfileError) {
    return <div className="text-red-500">Gagal memuat profil lulusan</div>;
  }

  const graduateProfileData = graduateProfileResponse?.dataPl || [];
  const obeInfo = graduateProfileResponse?.header || {};

  // Event handlers
  const handleEdit = (editId: string) => {
    const selectedData = graduateProfileData.find(
      (item) => item.id === editId
    );
    if (selectedData) {
      setCurrentData(selectedData);
      setIsEditing(true);
      setIsAdding(false);
      setErrorMessage("");
    }
  };

  const handleDelete = (deleteId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      deleteMutation.mutate(
        { id: deleteId, obeId: id! },
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

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setCurrentData({
      id: "",
      kode: "",
      profil: "",
      profesi: "",
      deskripsi: "",
      deskripsiEn: "",
    });
    setErrorMessage("");
  };

  const isFormValid = () => {
    return !!(
      currentData?.kode?.trim() &&
      currentData?.profil?.trim() &&
      currentData?.deskripsi?.trim()
    );
  };

  const handleSave = async () => {
    if (!currentData || !isFormValid()) {
      setErrorMessage("Kode, Profil Lulusan, dan Deskripsi harus diisi.");
      return;
    }

    setErrorMessage("");

    const dataToSave = {
      siakObeId: id!,
      kode: currentData.kode.trim(),
      profil: currentData.profil.trim(),
      deskripsi: currentData.deskripsi.trim(),
      ...(currentData.profesi?.trim() ? { profesi: currentData.profesi.trim() } : {}),
      ...(currentData.deskripsiEn?.trim() ? { deskripsiEn: currentData.deskripsiEn.trim() } : {}),
    };

    const onSuccessCallback = () => {
      setCurrentData(null);
      setIsAdding(false);
      setIsEditing(false);
      setErrorMessage("");
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
      const { siakObeId, ...updateData } = dataToSave;
      updateMutation.mutate(
        {
          id: currentData.id,
          obeId: id!,
          data: updateData,
        },
        {
          onSuccess: onSuccessCallback,
          onError: onErrorCallback,
        }
      );
    } else if (isAdding) {
      createMutation.mutate(dataToSave, {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
      });
    }
  };

  const handleReset = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentData(null);
    setErrorMessage("");
  };

  const handleBack = () => {
    navigate(AdminAcademicRoute.obeManagement.obeManagement);
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter data based on search term
  const displayData = graduateProfileData.filter(
    (item) =>
      item.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.profil.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.profesi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state for mutations
  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <MainLayout isGreeting={false} titlePage="Profil Lulusan">
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
                placeholder="Cari Profil Lulusan"
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
          <SidebarOBE id={id!} activeTab="pl" />

          {/* Detail Data Profil Lulusan */}
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
              <div className="flex justify-between ml-0 md:ml-8">
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

            <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center justify-end">
              <button
                onClick={handleAdd}
                disabled={isAdding || isEditing}
                className={`w-full md:w-56 bg-primary-green text-white px-4 py-2 rounded flex items-center hover:bg-primary-blue justify-center ${
                  isAdding || isEditing
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <Plus className="mr-2" size={16} />
                Tambah Profil Lulusan
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <TableGraduateProfile
                data={displayData}
                tableHead={[
                  "Kode PL",
                  "Profil Lulusan",
                  "Profesi",
                  "Deskripsi",
                  "Deskripsi (EN)",
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
              />
            </div>

            {/* Info */}
            <div className="mt-4 text-sm text-gray-600">
              <p>OBE ID: {id}</p>
              <p>Total Data: {graduateProfileData.length}</p>
              <p>Data Ditampilkan: {displayData.length}</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DetailOBE;
