import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useNavigate, useParams } from "react-router-dom";
import { Search, ArrowLeft, Save, Plus, Trash2, HelpCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../../api/Index";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SidebarOBE from "../../../components/admin-academic/academic/obe/SidebarOBE";

const ObeCpmkMatkul: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { obeId, mataKuliahId } = useParams<{ obeId: string; mataKuliahId: string }>();

  // State for in-place editing
  const [cpmkList, setCpmkList] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // State for inline Sub-CPMK creation helper
  const [activeSubInputRowIdx, setActiveSubInputRowIdx] = useState<number | null>(null);
  const [newSubKode, setNewSubKode] = useState("");
  const [newSubDeskripsi, setNewSubDeskripsi] = useState("");

  // 1. Fetch Course Details
  const { data: courseDetail, isLoading: isCourseDetailLoading } = useQuery({
    queryKey: ["courseDetail", mataKuliahId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await Api.get(`/akademik/obe/mata-kuliah/${mataKuliahId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
    enabled: !!mataKuliahId,
  });

  // 2. Fetch CPMK mapping (CPL Headers + CPMKs)
  const { data: mappingData, isLoading: isMappingLoading } = useQuery({
    queryKey: ["cpmkMapping", mataKuliahId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await Api.get(`/akademik/obe/mata-kuliah/${mataKuliahId}/pemetaan-cpmk`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
    enabled: !!mataKuliahId,
  });

  const cplHeaders = mappingData?.cplHeaders || [];

  // Initialize local state from query response
  useEffect(() => {
    if (mappingData?.cpmkList) {
      const mapped = mappingData.cpmkList.map((cpmk: any) => {
        const cplMap = cpmk.cplPemetaan || [];
        const filledCplPemetaan = cplHeaders.map((cpl: any) => {
          const existing = cplMap.find((c: any) => c.idCpl === cpl.id || c.cplId === cpl.id);
          return {
            idCpl: cpl.id,
            bobotCpl: existing ? (existing.bobotCpl || existing.bobot || 0) : 0,
          };
        });
        return {
          id: cpmk.id || `db-${cpmk.kode}`,
          kode: cpmk.kode,
          deskripsi: cpmk.deskripsi,
          bobot: cpmk.bobot || 0,
          target: cpmk.target || 0,
          cplPemetaan: filledCplPemetaan,
          subCpmk: cpmk.subCpmk || [],
        };
      });
      setCpmkList(mapped);
    }
  }, [mappingData]);

  // 3. Save Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload: { cpmkList: any[] }) => {
      const token = localStorage.getItem("token");
      const response = await Api.post(`/akademik/obe/mata-kuliah/${mataKuliahId}/pemetaan-cpmk`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cpmkMapping", mataKuliahId] });
      setErrorMessage("");
      alert("Pemetaan CPMK berhasil disimpan!");
    },
    onError: (error: any) => {
      console.error(error);
      setErrorMessage(error.response?.data?.message || "Gagal menyimpan pemetaan CPMK. Silakan coba lagi.");
    },
  });

  // Calculate totals
  const totalBobotCpmk = cpmkList.reduce((acc, item) => acc + (parseFloat(item.bobot) || 0), 0);

  // Handlers
  const handleBack = () => {
    navigate(`${AdminAcademicRoute.obeManagement.cpmk}/${obeId}`);
  };

  const handleAddCpmk = () => {
    setCpmkList((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        kode: `CPMK${String(prev.length + 1).padStart(2, "0")}`,
        deskripsi: "",
        bobot: 0,
        target: 75, // Default target
        cplPemetaan: cplHeaders.map((cpl: any) => ({
          idCpl: cpl.id,
          bobotCpl: 0,
        })),
        subCpmk: [],
      },
    ]);
  };

  const handleRemoveCpmk = (idToRemove: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus CPMK ini?")) {
      setCpmkList((prev) => prev.filter((item) => item.id !== idToRemove));
    }
  };

  const handleFieldChange = (index: number, field: string, val: any) => {
    setCpmkList((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: val,
      };
      return updated;
    });
  };

  const handleCplWeightChange = (index: number, cplId: string, val: string) => {
    const numericVal = parseFloat(val) || 0;
    setCpmkList((prev) => {
      const updated = [...prev];
      const targetCpl = updated[index].cplPemetaan.find((c: any) => c.idCpl === cplId);
      if (targetCpl) {
        targetCpl.bobotCpl = numericVal;
      } else {
        updated[index].cplPemetaan.push({ idCpl: cplId, bobotCpl: numericVal });
      }
      return updated;
    });
  };

  // Sub-CPMK Handlers
  const handleAddSubCpmk = (index: number) => {
    if (!newSubKode.trim() || !newSubDeskripsi.trim()) {
      alert("Kode dan Deskripsi Sub-CPMK harus diisi.");
      return;
    }
    setCpmkList((prev) => {
      const updated = [...prev];
      updated[index].subCpmk = [
        ...(updated[index].subCpmk || []),
        { kode: newSubKode.trim(), deskripsi: newSubDeskripsi.trim() },
      ];
      return updated;
    });
    setNewSubKode("");
    setNewSubDeskripsi("");
    setActiveSubInputRowIdx(null);
  };

  const handleRemoveSubCpmk = (cpmkIdx: number, subIdx: number) => {
    setCpmkList((prev) => {
      const updated = [...prev];
      updated[cpmkIdx].subCpmk = updated[cpmkIdx].subCpmk.filter((_: any, idx: number) => idx !== subIdx);
      return updated;
    });
  };

  const handleSaveAll = () => {
    // Validate CPMK weights
    if (cpmkList.length === 0) {
      setErrorMessage("Silakan tambahkan minimal satu CPMK.");
      return;
    }

    if (totalBobotCpmk !== 100) {
      setErrorMessage(`Total bobot CPMK harus bernilai tepat 100% (Saat ini: ${totalBobotCpmk}%).`);
      return;
    }

    // Validate CPMK details
    for (const cpmk of cpmkList) {
      if (!cpmk.kode.trim() || !cpmk.deskripsi.trim()) {
        setErrorMessage("Kode dan Deskripsi CPMK tidak boleh kosong.");
        return;
      }
      const cplWeightsSum = cpmk.cplPemetaan.reduce((acc: number, c: any) => acc + (parseFloat(c.bobotCpl) || 0), 0);
      if (cplWeightsSum !== 100 && cplWeightsSum !== 0) {
        // If there's some mapping, the weights mapped to CPLs should sum to 100%
        setErrorMessage(`Untuk ${cpmk.kode}, jumlah bobot pemetaan CPL harus bernilai 100% (Saat ini: ${cplWeightsSum}%).`);
        return;
      }
    }

    setErrorMessage("");
    
    // Construct payload
    const payload = {
      cpmkList: cpmkList.map((item) => ({
        kode: item.kode,
        deskripsi: item.deskripsi,
        bobot: parseFloat(item.bobot) || 0,
        target: parseFloat(item.target) || 0,
        cplPemetaan: item.cplPemetaan
          .filter((c: any) => (parseFloat(c.bobotCpl) || 0) > 0)
          .map((c: any) => ({
            idCpl: c.idCpl,
            bobotCpl: parseFloat(c.bobotCpl) || 0,
          })),
        subCpmk: item.subCpmk.map((sub: any) => ({
          kode: sub.kode,
          deskripsi: sub.deskripsi,
        })),
      })),
    };

    saveMutation.mutate(payload);
  };

  if (isCourseDetailLoading || isMappingLoading) {
    return <LoadingSpinner />;
  }

  const isSaving = saveMutation.isPending;

  return (
    <MainLayout isGreeting={false} titlePage="Pemetaan CPMK Mata Kuliah">
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex flex-col items-center justify-between mb-8 md:flex-row gap-4">
          <div className="flex items-center">
            <button onClick={handleBack} className="flex items-center bg-primary-blueSoft text-white px-2 py-3 rounded-l-md mr-4">
              <ArrowLeft className="mr-2" size={16} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {courseDetail?.nama || "Loading Course..."}
              </h2>
              <p className="text-sm text-gray-500">
                Kode MK: {courseDetail?.kode || "-"} | SKS Tatap Muka: {courseDetail?.sksTatapMuka || 0}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleBack} className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer">
              <ArrowLeft className="mr-2" size={16} />
              Kembali
            </button>
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="bg-primary-blueSoft text-white px-6 py-2 rounded flex items-center cursor-pointer hover:bg-primary-blue disabled:opacity-50"
            >
              <Save className="mr-2" size={16} />
              {isSaving ? "Menyimpan..." : "Simpan Pemetaan"}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row">
          {/* Shared Sidebar Menu */}
          <SidebarOBE id={obeId!} activeTab="cpmk" />

          {/* Matrix Area */}
          <div className="w-full md:w-[80%] p-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-700">Tabel Matriks CPMK ke CPL</h3>
              <button
                onClick={handleAddCpmk}
                className="bg-primary-green text-white px-4 py-2 rounded flex items-center hover:bg-primary-green-dark"
              >
                <Plus className="mr-2" size={16} />
                Tambah CPMK
              </button>
            </div>

            <div className="overflow-x-auto border rounded-lg shadow-sm">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-[#116E63] text-white text-xs uppercase">
                  <tr>
                    <th className="p-3 border border-gray-600 text-center w-12">No</th>
                    <th className="p-3 border border-gray-600 text-center w-24">Kode CPMK</th>
                    <th className="p-3 border border-gray-600 w-80">Deskripsi CPMK</th>
                    <th className="p-3 border border-gray-600 text-center w-20">Bobot CPMK (%)</th>
                    <th className="p-3 border border-gray-600 text-center w-20">Target (%)</th>
                    {cplHeaders.map((cpl: any) => (
                      <th key={cpl.id} className="p-3 border border-gray-600 text-center w-20 bg-[#116E63]/90">
                        {cpl.kode} (%)
                      </th>
                    ))}
                    <th className="p-3 border border-gray-600 text-center w-16">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {cpmkList.length > 0 ? (
                    cpmkList.map((item, idx) => (
                      <React.Fragment key={item.id}>
                        {/* Main CPMK Row */}
                        <tr className="border-b border-gray-200 hover:bg-gray-50/50">
                          <td className="p-3 border text-center font-medium text-gray-600">{idx + 1}</td>
                          <td className="p-3 border text-center">
                            <input
                              type="text"
                              value={item.kode}
                              onChange={(e) => handleFieldChange(idx, "kode", e.target.value)}
                              className="w-full text-center p-1 border rounded focus:ring-1 focus:ring-primary-green"
                            />
                          </td>
                          <td className="p-3 border">
                            <textarea
                              rows={2}
                              value={item.deskripsi}
                              onChange={(e) => handleFieldChange(idx, "deskripsi", e.target.value)}
                              className="w-full p-1 border rounded text-xs focus:ring-1 focus:ring-primary-green"
                              placeholder="Deskripsi CPMK..."
                            />
                          </td>
                          <td className="p-3 border text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={item.bobot}
                              onChange={(e) => handleFieldChange(idx, "bobot", e.target.value)}
                              className="w-16 text-center p-1 border rounded focus:ring-1 focus:ring-primary-green font-semibold"
                            />
                          </td>
                          <td className="p-3 border text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={item.target}
                              onChange={(e) => handleFieldChange(idx, "target", e.target.value)}
                              className="w-16 text-center p-1 border rounded focus:ring-1 focus:ring-primary-green"
                            />
                          </td>
                          {/* Dynamic CPL Weight Inputs */}
                          {cplHeaders.map((cpl: any) => {
                            const cplVal = item.cplPemetaan.find((c: any) => c.idCpl === cpl.id)?.bobotCpl || 0;
                            return (
                              <td key={cpl.id} className="p-3 border text-center bg-gray-50/30">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={cplVal}
                                  onChange={(e) => handleCplWeightChange(idx, cpl.id, e.target.value)}
                                  className="w-16 text-center p-1 border rounded focus:ring-1 focus:ring-primary-green"
                                />
                              </td>
                            );
                          })}
                          <td className="p-3 border text-center">
                            <button
                              onClick={() => handleRemoveCpmk(item.id)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                        
                        {/* Sub-CPMK details list row */}
                        <tr className="bg-gray-50/20 border-b border-gray-200">
                          <td className="p-2 border text-center bg-gray-100/50"></td>
                          <td colSpan={4 + cplHeaders.length} className="p-3 border text-xs text-gray-700">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-primary-green">
                                  Sub-CPMK untuk {item.kode}:
                                </span>
                                {activeSubInputRowIdx !== idx ? (
                                  <button
                                    onClick={() => {
                                      setActiveSubInputRowIdx(idx);
                                      setNewSubKode(`${item.kode}-SUB`);
                                      setNewSubDeskripsi("");
                                    }}
                                    className="text-primary-blueSoft hover:underline font-semibold flex items-center gap-1"
                                  >
                                    <Plus size={14} /> Tambah Sub-CPMK
                                  </button>
                                ) : null}
                              </div>

                              {/* Sub-CPMK Creation Form */}
                              {activeSubInputRowIdx === idx && (
                                <div className="flex flex-col gap-2 p-2 border rounded bg-white mt-1">
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={newSubKode}
                                      onChange={(e) => setNewSubKode(e.target.value)}
                                      className="p-1 border rounded w-1/4 text-xs font-semibold"
                                      placeholder="Kode Sub (e.g. CPMK01a)"
                                    />
                                    <input
                                      type="text"
                                      value={newSubDeskripsi}
                                      onChange={(e) => setNewSubDeskripsi(e.target.value)}
                                      className="p-1 border rounded w-3/4 text-xs"
                                      placeholder="Deskripsi Sub-CPMK..."
                                    />
                                  </div>
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => setActiveSubInputRowIdx(null)}
                                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xxs font-medium"
                                    >
                                      Batal
                                    </button>
                                    <button
                                      onClick={() => handleAddSubCpmk(idx)}
                                      className="px-2 py-1 bg-primary-green text-white rounded text-xxs font-medium"
                                    >
                                      Tambahkan
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Sub-CPMK list items */}
                              {item.subCpmk && item.subCpmk.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                                  {item.subCpmk.map((sub: any, subIdx: number) => (
                                    <div key={subIdx} className="flex justify-between items-center bg-white p-2 rounded border border-gray-200 shadow-sm">
                                      <div>
                                        <span className="font-bold text-gray-800">{sub.kode}</span>
                                        <span className="mx-1">:</span>
                                        <span className="text-gray-600">{sub.deskripsi}</span>
                                      </div>
                                      <button
                                        onClick={() => handleRemoveSubCpmk(idx, subIdx)}
                                        className="text-red-400 hover:text-red-600 font-bold ml-2 text-sm"
                                        title="Hapus Sub-CPMK"
                                      >
                                        &times;
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-400 italic">Belum ada Sub-CPMK yang dibuat.</p>
                              )}
                            </div>
                          </td>
                          <td className="p-2 border bg-gray-100/50"></td>
                        </tr>
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6 + cplHeaders.length} className="p-8 text-center text-gray-400 italic">
                        Belum ada CPMK yang dibuat. Silakan klik "Tambah CPMK".
                      </td>
                    </tr>
                  )}
                  {/* Summary Row */}
                  {cpmkList.length > 0 && (
                    <tr className="bg-gray-100 font-bold">
                      <td colSpan={3} className="p-3 border text-right">TOTAL BOBOT:</td>
                      <td className={`p-3 border text-center ${totalBobotCpmk === 100 ? "text-primary-green" : "text-red-500"}`}>
                        {totalBobotCpmk}%
                      </td>
                      <td colSpan={2 + cplHeaders.length} className="p-3 border text-left text-xs text-gray-500 font-normal italic">
                        {totalBobotCpmk !== 100 && (
                          <span className="text-red-500 font-semibold">Total bobot CPMK harus bernilai tepat 100% sebelum disimpan.</span>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center text-xs text-gray-500 gap-1">
                <HelpCircle size={14} className="text-primary-green" />
                <span>Setiap baris CPMK yang dipetakan harus memiliki total bobot pemetaan CPL sebesar 100%.</span>
              </div>
              <button
                onClick={handleSaveAll}
                disabled={isSaving}
                className="bg-primary-blueSoft text-white px-8 py-3 rounded flex items-center hover:bg-primary-blue disabled:opacity-50 font-bold shadow-md cursor-pointer"
              >
                <Save className="mr-2" size={16} />
                {isSaving ? "Menyimpan..." : "Simpan Pemetaan CPMK"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ObeCpmkMatkul;
