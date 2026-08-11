import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { getGraduateProfileData } from "../../../hooks/academic/useGraduateProfile";
import { getObePlCplMapping, useSaveObePlCplMapping } from "../../../hooks/academic/useObePlCpl";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import SidebarOBE from "../../../components/admin-academic/academic/obe/SidebarOBE";

type Matrix = Record<string, Record<string, number>>;

export default function ObePlCplMapping() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: graduateProfileResponse, isLoading: isHeaderLoading } = getGraduateProfileData(id!);
  const { data: mapping, isLoading: isMappingLoading } = getObePlCplMapping(id!);
  const saveMutation = useSaveObePlCplMapping();

  const [matrix, setMatrix] = useState<Matrix>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const obeInfo = graduateProfileResponse?.header || {};
  const columns = mapping?.columns || [];
  const rows = mapping?.rows || [];

  useEffect(() => {
    if (!rows.length) return;
    const seeded: Matrix = {};
    rows.forEach((row) => {
      seeded[row.plId] = {};
      (row.bobotCpl || []).forEach((b) => {
        seeded[row.plId][b.cplId] = b.bobot;
      });
    });
    setMatrix(seeded);
  }, [mapping]);

  const handleBack = () => {
    navigate(AdminAcademicRoute.obeManagement.obeManagement);
  };

  const handleCellChange = (plId: string, cplId: string, value: string) => {
    const num = value === "" ? 0 : Number(value);
    setMatrix((prev) => ({
      ...prev,
      [plId]: {
        ...(prev[plId] || {}),
        [cplId]: isNaN(num) ? 0 : num,
      },
    }));
  };

  const rowTotal = (plId: string) => {
    const rowValues = matrix[plId] || {};
    return Object.values(rowValues).reduce((sum, v) => sum + (Number(v) || 0), 0);
  };

  const handleSave = () => {
    setErrorMessage("");
    setSuccessMessage("");

    const pemetaan: { plId: string; cplId: string; bobot: number }[] = [];
    Object.entries(matrix).forEach(([plId, cplBobots]) => {
      Object.entries(cplBobots).forEach(([cplId, bobot]) => {
        if (Number(bobot) > 0) {
          pemetaan.push({ plId, cplId, bobot: Number(bobot) });
        }
      });
    });

    saveMutation.mutate(
      { obeId: id!, pemetaan },
      {
        onSuccess: () => setSuccessMessage("Pemetaan PL ke CPL berhasil disimpan."),
        onError: (error: any) => {
          setErrorMessage(error?.response?.data?.message || "Gagal menyimpan pemetaan. Silakan coba lagi.");
        },
      }
    );
  };

  const isLoading = isHeaderLoading || isMappingLoading;

  return (
    <MainLayout isGreeting={false} titlePage="Pemetaan PL ke CPL">
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex flex-col items-center justify-between mb-10 md:flex-row gap-4">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="flex items-center bg-primary-blueSoft text-white px-2 py-3 rounded-l-md"
            >
              <ArrowLeft className="mr-2" size={16} />
              Kembali ke Daftar
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={saveMutation.isPending || isLoading}
            className="bg-primary-green text-white px-4 py-2 rounded flex items-center disabled:opacity-50"
          >
            <Save className="mr-2" size={16} />
            {saveMutation.isPending ? "Menyimpan..." : "Simpan Pemetaan"}
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</div>
        )}

        <div className="flex flex-col md:flex-row">
          <SidebarOBE id={id!} activeTab="plCpl" />

          <div className="w-full md:w-[80%] p-3">
            <div className="grid grid-cols-1 gap-2 bg-primary-green/10 p-4 md:grid-cols-2">
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Kode Prodi:</span>
                <span className="w-full text-left">{obeInfo?.kodeProgramStudi || obeInfo?.kodeProdi || "-"}</span>
              </div>
              <div className="flex justify-between md:ml-8">
                <span className="font-semibold w-full text-left">Tahun Kurikulum:</span>
                <span className="w-full text-left">{obeInfo?.tahunKurikulum || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Program Studi:</span>
                <span className="w-full text-left">{obeInfo?.programStudi || "-"}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              Isi bobot kontribusi tiap Profil Lulusan (PL) terhadap tiap Capaian Pembelajaran Lulusan (CPL). Total
              per baris idealnya 100%.
            </p>

            {isLoading ? (
              <div className="flex justify-center p-12">
                <LoadingSpinner />
              </div>
            ) : rows.length === 0 || columns.length === 0 ? (
              <div className="mt-4 p-6 text-center text-gray-500 italic border border-gray-200 rounded">
                Data Profil Lulusan atau CPL belum tersedia. Lengkapi data PL dan CPL terlebih dahulu.
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border border-gray-300 border-collapse">
                  <thead>
                    <tr className="bg-primary-green text-white text-sm">
                      <th className="p-2 border border-gray-400 text-left min-w-[220px]">Profil Lulusan (PL)</th>
                      {columns.map((col) => (
                        <th key={col.id} className="p-2 border border-gray-400 min-w-[70px]">
                          {col.kode}
                        </th>
                      ))}
                      <th className="p-2 border border-gray-400 min-w-[80px]">Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {rows.map((row) => {
                      const total = rowTotal(row.plId);
                      return (
                        <tr key={row.plId}>
                          <td className="p-2 border border-gray-300 font-semibold">{row.kodePl}</td>
                          {columns.map((col) => (
                            <td key={col.id} className="p-1 border border-gray-300 text-center">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                className="w-16 p-1 border rounded text-center"
                                value={matrix[row.plId]?.[col.id] ?? 0}
                                onChange={(e) => handleCellChange(row.plId, col.id, e.target.value)}
                              />
                            </td>
                          ))}
                          <td
                            className={`p-2 border border-gray-300 text-center font-bold ${
                              total === 100 ? "text-green-600" : "text-red-500"
                            }`}
                          >
                            {total}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
