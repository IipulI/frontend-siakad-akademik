import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Save, Search } from "lucide-react";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SidebarObeCourse from "../../../components/admin-academic/academic/obe/SidebarObeCourse";
import { getCourseDataById } from "../../../hooks/academic/useCourseManagement";
import { getPemetaanCpmk, useSavePemetaanCpmk } from "../../../hooks/academic/useObeCpmkMk";

interface LocalBobot {
  cplId: string;
  bobotCpl: number;
}

interface LocalSubCpmk {
  localId: string;
  kode: string;
  deskripsi: string;
  cplPemetaan: LocalBobot[];
}

interface LocalCpmkRow {
  localId: string;
  kode: string;
  deskripsi: string;
  target: number;
  cplPemetaan: LocalBobot[];
  subCpmk: LocalSubCpmk[];
}

let uidCounter = 0;
const nextUid = () => `local-${Date.now()}-${uidCounter++}`;

export default function ObeCpmkMatkul() {
  const navigate = useNavigate();
  const { obeId, mataKuliahId } = useParams<{ obeId: string; mataKuliahId: string }>();

  const { data: courseDetail, isLoading: isCourseLoading, error: courseError } = getCourseDataById(mataKuliahId || "");
  const { data: mappingData, isLoading: isMappingLoading } = getPemetaanCpmk(mataKuliahId || "");
  const saveMutation = useSavePemetaanCpmk();

  const [levelPemetaan, setLevelPemetaan] = useState<"CPMK" | "Sub-CPMK">("CPMK");
  const [metodePembobotan, setMetodePembobotan] = useState<"Manual" | "Otomatis">("Manual");
  const [rows, setRows] = useState<LocalCpmkRow[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const cplHeaders = mappingData?.cplHeaders || [];

  useEffect(() => {
    if (!mappingData) return;
    setLevelPemetaan(mappingData.levelPemetaan || "CPMK");
    setMetodePembobotan(mappingData.metodePembobotan || "Manual");
    setRows(
      (mappingData.cpmkData || []).map((item) => ({
        localId: item.id || nextUid(),
        kode: item.kode || "",
        deskripsi: item.deskripsi || "",
        target: item.target || 0,
        cplPemetaan: (item.cplPemetaan || []).map((c) => ({
          cplId: c.idCpl || c.cplId || "",
          bobotCpl: c.bobotCpl ?? c.bobot ?? 0,
        })),
        subCpmk: (item.subCpmk || []).map((s) => ({
          localId: s.id || nextUid(),
          kode: s.kode || "",
          deskripsi: s.deskripsi || "",
          cplPemetaan: (s.cplPemetaan || []).map((c) => ({
            cplId: c.idCpl || c.cplId || "",
            bobotCpl: c.bobotCpl ?? c.bobot ?? 0,
          })),
        })),
      }))
    );
  }, [mappingData]);

  const handleBack = () => navigate(AdminAcademicRoute.obeManagement.obeManagement);

  const isLoading = isCourseLoading || isMappingLoading;

  if (isLoading) {
    return (
      <MainLayout isGreeting={false} titlePage="Pemetaan CPMK">
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  if (courseError || !courseDetail) {
    return (
      <MainLayout isGreeting={false} titlePage="Pemetaan CPMK">
        <div className="p-8 text-center text-red-500">Gagal memuat data Mata Kuliah. Silakan coba lagi.</div>
      </MainLayout>
    );
  }

  const getBobot = (list: LocalBobot[], cplId: string) => list.find((b) => b.cplId === cplId)?.bobotCpl ?? 0;

  const setBobot = (list: LocalBobot[], cplId: string, value: number): LocalBobot[] => {
    const idx = list.findIndex((b) => b.cplId === cplId);
    if (idx === -1) return [...list, { cplId, bobotCpl: value }];
    const next = [...list];
    next[idx] = { ...next[idx], bobotCpl: value };
    return next;
  };

  // "Dicentang" = CPL ini relevan buat baris ini (ada entrinya di cplPemetaan),
  // terlepas dari bobotnya udah keisi atau belum. Toggle nambah/buang entrinya.
  const isCplChecked = (list: LocalBobot[], cplId: string) => list.some((b) => b.cplId === cplId);
  const toggleCpl = (list: LocalBobot[], cplId: string): LocalBobot[] =>
    isCplChecked(list, cplId) ? list.filter((b) => b.cplId !== cplId) : [...list, { cplId, bobotCpl: 0 }];

  // Bagi rata `total` ke `count` slot, sisa pembulatan ditumpuk di slot TERAKHIR
  // -- rumus sama persis dengan pembagian rata di rowBobot/backend.
  const autoDistribute = (total: number, count: number): number[] => {
    if (count <= 0) return [];
    const each = parseFloat((total / count).toFixed(2));
    const dist = Array(count).fill(each);
    dist[count - 1] = parseFloat((total - each * (count - 1)).toFixed(2));
    return dist;
  };

  const subCpmkTotal = (sub: LocalSubCpmk) => sub.cplPemetaan.reduce((sum, b) => sum + (Number(b.bobotCpl) || 0), 0);

  const rowBobot = (row: LocalCpmkRow, index: number) => {
    if (metodePembobotan === "Otomatis") {
      // Samain persis sama pembagian rata di backend (services/cpmk.service.js):
      // tiap baris dapat 100/n dibulatkan 2 desimal, baris TERAKHIR nampung sisa
      // pembulatan biar totalnya pas 100.
      const n = rows.length;
      if (n === 0) return 0;
      const rata = parseFloat((100 / n).toFixed(2));
      const isLastRow = index === n - 1;
      return isLastRow ? parseFloat((100 - rata * (n - 1)).toFixed(2)) : rata;
    }
    if (levelPemetaan === "CPMK") {
      return row.cplPemetaan.reduce((sum, b) => sum + (Number(b.bobotCpl) || 0), 0);
    }
    return row.subCpmk.reduce((sum, s) => sum + subCpmkTotal(s), 0);
  };

  // Urutan CPL yang "dicentang" (ada entrinya) di satu daftar cplPemetaan, mengikuti urutan kolom cplHeaders
  const checkedCplIdsInOrder = (list: LocalBobot[]) => cplHeaders.filter((h) => isCplChecked(list, h.id)).map((h) => h.id);

  // Bobot CPL yang ditampilkan di mode CPMK saat Otomatis: bobot baris dibagi rata
  // ke CPL yang dicentang saja, bukan ke semua kolom CPL yang ada.
  const displayCpmkBobot = (row: LocalCpmkRow, rowIndex: number, cplId: string) => {
    if (metodePembobotan !== "Otomatis") return getBobot(row.cplPemetaan, cplId);
    const checkedIds = checkedCplIdsInOrder(row.cplPemetaan);
    const idx = checkedIds.indexOf(cplId);
    if (idx === -1) return 0;
    return autoDistribute(rowBobot(row, rowIndex), checkedIds.length)[idx];
  };

  // Semua pasangan (Sub-CPMK, CPL) yang dicentang milik satu baris CPMK, urut berdasar urutan
  // Sub-CPMK lalu urutan kolom CPL -- supaya bobot induk kebagi rata ke seluruh sel yang
  // dicentang LINTAS Sub-CPMK, bukan cuma dalam satu Sub-CPMK saja.
  const checkedSubCplPairs = (row: LocalCpmkRow) => {
    const pairs: { subLocalId: string; cplId: string }[] = [];
    row.subCpmk.forEach((s) => {
      cplHeaders.forEach((h) => {
        if (isCplChecked(s.cplPemetaan, h.id)) pairs.push({ subLocalId: s.localId, cplId: h.id });
      });
    });
    return pairs;
  };

  const displaySubBobot = (row: LocalCpmkRow, rowIndex: number, subLocalId: string, cplId: string) => {
    if (metodePembobotan !== "Otomatis") {
      const sub = row.subCpmk.find((s) => s.localId === subLocalId);
      return sub ? getBobot(sub.cplPemetaan, cplId) : 0;
    }
    const pairs = checkedSubCplPairs(row);
    const idx = pairs.findIndex((p) => p.subLocalId === subLocalId && p.cplId === cplId);
    if (idx === -1) return 0;
    return autoDistribute(rowBobot(row, rowIndex), pairs.length)[idx];
  };

  const subCpmkTotalDisplay = (row: LocalCpmkRow, rowIndex: number, sub: LocalSubCpmk) => {
    if (metodePembobotan !== "Otomatis") return subCpmkTotal(sub);
    const pairs = checkedSubCplPairs(row);
    const dist = autoDistribute(rowBobot(row, rowIndex), pairs.length);
    const total = pairs.reduce((sum, p, i) => (p.subLocalId === sub.localId ? sum + dist[i] : sum), 0);
    return parseFloat(total.toFixed(2));
  };

  const grandTotal = rows.reduce((sum, r, idx) => sum + rowBobot(r, idx), 0);

  const tambahCpmkRow = () => {
    setRows((prev) => [
      ...prev,
      { localId: nextUid(), kode: "", deskripsi: "", target: 0, cplPemetaan: [], subCpmk: [] },
    ]);
  };

  const hapusCpmkRow = (localId: string) => {
    if (!window.confirm("Hapus baris CPMK ini?")) return;
    setRows((prev) => prev.filter((r) => r.localId !== localId));
  };

  const updateRowField = (localId: string, field: "kode" | "deskripsi" | "target", value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.localId === localId ? { ...r, [field]: field === "target" ? Number(value) || 0 : value } : r))
    );
  };

  const updateRowBobot = (localId: string, cplId: string, value: string) => {
    const num = value === "" ? 0 : Number(value);
    setRows((prev) =>
      prev.map((r) => (r.localId === localId ? { ...r, cplPemetaan: setBobot(r.cplPemetaan, cplId, isNaN(num) ? 0 : num) } : r))
    );
  };

  const tambahSubCpmk = (rowLocalId: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.localId === rowLocalId
          ? { ...r, subCpmk: [...r.subCpmk, { localId: nextUid(), kode: "", deskripsi: "", cplPemetaan: [] }] }
          : r
      )
    );
  };

  const hapusSubCpmk = (rowLocalId: string, subLocalId: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.localId === rowLocalId ? { ...r, subCpmk: r.subCpmk.filter((s) => s.localId !== subLocalId) } : r
      )
    );
  };

  const updateSubField = (rowLocalId: string, subLocalId: string, field: "kode" | "deskripsi", value: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.localId === rowLocalId
          ? { ...r, subCpmk: r.subCpmk.map((s) => (s.localId === subLocalId ? { ...s, [field]: value } : s)) }
          : r
      )
    );
  };

  const updateSubBobot = (rowLocalId: string, subLocalId: string, cplId: string, value: string) => {
    const num = value === "" ? 0 : Number(value);
    setRows((prev) =>
      prev.map((r) =>
        r.localId === rowLocalId
          ? {
              ...r,
              subCpmk: r.subCpmk.map((s) =>
                s.localId === subLocalId ? { ...s, cplPemetaan: setBobot(s.cplPemetaan, cplId, isNaN(num) ? 0 : num) } : s
              ),
            }
          : r
      )
    );
  };

  const updateCplCheck = (localId: string, cplId: string) => {
    setRows((prev) => prev.map((r) => (r.localId === localId ? { ...r, cplPemetaan: toggleCpl(r.cplPemetaan, cplId) } : r)));
  };

  const updateSubCplCheck = (rowLocalId: string, subLocalId: string, cplId: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.localId === rowLocalId
          ? { ...r, subCpmk: r.subCpmk.map((s) => (s.localId === subLocalId ? { ...s, cplPemetaan: toggleCpl(s.cplPemetaan, cplId) } : s)) }
          : r
      )
    );
  };

  const handleSave = () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (rows.some((r) => !r.kode.trim() || !r.deskripsi.trim())) {
      setErrorMessage("Kode dan Deskripsi CPMK wajib diisi untuk semua baris.");
      return;
    }

    const cpmkList = rows.map((row, idx) => ({
      kode: row.kode.trim(),
      deskripsi: row.deskripsi.trim(),
      target: Number(row.target) || 0,
      bobot: rowBobot(row, idx),
      ...(levelPemetaan === "CPMK"
        ? {
            cplPemetaan: row.cplPemetaan
              .map((c) => ({ cplId: c.cplId, bobotCpl: displayCpmkBobot(row, idx, c.cplId) }))
              .filter((c) => Number(c.bobotCpl) > 0)
              .map((c) => ({ idCpl: c.cplId, bobotCpl: Number(c.bobotCpl) })),
          }
        : {
            subCpmk: row.subCpmk.map((s) => ({
              kode: s.kode.trim(),
              deskripsi: s.deskripsi.trim(),
              cplPemetaan: s.cplPemetaan
                .map((c) => ({ cplId: c.cplId, bobotCpl: displaySubBobot(row, idx, s.localId, c.cplId) }))
                .filter((c) => Number(c.bobotCpl) > 0)
                .map((c) => ({ idCpl: c.cplId, bobotCpl: Number(c.bobotCpl) })),
            })),
          }),
    }));

    saveMutation.mutate(
      { mataKuliahId: mataKuliahId!, levelPemetaan, metodePembobotan, cpmkList },
      {
        onSuccess: () => setSuccessMessage("Pemetaan CPMK berhasil disimpan."),
        onError: (error: any) => {
          setErrorMessage(error?.response?.data?.message || "Gagal menyimpan pemetaan CPMK.");
        },
      }
    );
  };

  const colSpanTotal = 3 + (cplHeaders.length || 1) + 2;

  return (
    <MainLayout isGreeting={false} titlePage="Pemetaan CPMK">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Admin - Akademik &gt; Obe &gt; Manajemen Obe &gt; Pemetaan CPMK</p>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center w-full md:w-auto">
              <button onClick={handleBack} className="bg-primary-yellow text-white p-2.5 rounded-l-md flex items-center justify-center hover:bg-opacity-90 cursor-pointer">
                <ArrowLeft size={16} />
              </button>
              <div className="flex items-center">
                <input type="text" placeholder="Cari Mata Kuliah" className="p-2 pl-3 border border-gray-300 rounded-none text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white w-64 text-gray-700" disabled />
                <button className="bg-indigo-600 text-white p-2.5 rounded-r-md flex items-center justify-center hover:bg-opacity-90 cursor-pointer" disabled>
                  <Search size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
              <button onClick={handleBack} className="bg-[#00c0ef] text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <ArrowLeft size={16} /> Kembali ke Daftar
              </button>
              <button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer disabled:opacity-50"
              >
                <Save size={16} /> {saveMutation.isPending ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <SidebarObeCourse obeId={obeId || "default"} mataKuliahId={mataKuliahId || ""} activeTab="cpmk" />

            <div className="w-full md:w-[80%]">
              <div className="flex mb-6 w-full rounded-sm overflow-hidden border border-gray-100 shadow-sm">
                <div className="bg-primary-green w-2 flex-shrink-0"></div>
                <div className="flex-1 bg-[#F5FFF9] p-5 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-sm text-gray-700">
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Kode Mata Kuliah</span>
                    <span className="flex-1 text-gray-800">{courseDetail.kode || "-"}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">SKS</span>
                    <span className="flex-1 text-gray-800">{courseDetail.totalSks ?? (courseDetail.sksTatapMuka || 0)}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Mata Kuliah</span>
                    <span className="flex-1 text-gray-800">{courseDetail.nama || "-"}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Jenis Mata Kuliah</span>
                    <span className="flex-1 text-gray-800">{courseDetail.jenis || "Kuliah"}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Tahun Kurikulum</span>
                    <span className="flex-1 text-gray-800">
                      {typeof courseDetail.tahunKurikulum === "object" ? courseDetail.tahunKurikulum?.tahun : (courseDetail.tahunKurikulum || "-")}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Unit Pengampu</span>
                    <span className="flex-1 text-gray-800">
                      {typeof courseDetail.programStudi === "object" ? courseDetail.programStudi?.nama : (courseDetail.programStudi || "-")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Level Pemetaan</label>
                  <select
                    value={levelPemetaan}
                    onChange={(e) => setLevelPemetaan(e.target.value as "CPMK" | "Sub-CPMK")}
                    className="w-full border border-gray-300 rounded p-2 text-sm"
                  >
                    <option value="CPMK">CPMK (langsung ke induk)</option>
                    <option value="Sub-CPMK">Sub-CPMK</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Metode Pembobotan</label>
                  <select
                    value={metodePembobotan}
                    onChange={(e) => setMetodePembobotan(e.target.value as "Manual" | "Otomatis")}
                    className="w-full border border-gray-300 rounded p-2 text-sm"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Otomatis">Otomatis</option>
                  </select>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                Bobot CPMK dihitung otomatis dari jumlah pemetaan bobot CPL {levelPemetaan === "Sub-CPMK" ? "pada Sub-CPMK-nya" : "pada baris itu"}. Total seluruh baris harus 100%.
              </p>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</div>
              )}

              {cplHeaders.length === 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded text-sm">
                  Belum ada CPL yang dipetakan ke mata kuliah ini. Lengkapi terlebih dahulu di menu "Pemetaan CPL".
                </div>
              )}

              <div className="overflow-x-auto border border-gray-200 rounded-sm">
                <table className="min-w-full bg-white border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-[#0b5c77] text-white text-sm font-semibold text-center border-b border-gray-400">
                      <th className="p-3 border-r border-gray-400 align-middle" rowSpan={2}>Kode CPMK</th>
                      <th className="p-3 border-r border-gray-400 align-middle" rowSpan={2}>Deskripsi CPMK</th>
                      <th className="p-3 border-r border-gray-400 align-middle" rowSpan={2}>Target</th>
                      <th className="p-2 border-b border-r border-gray-400" colSpan={cplHeaders.length > 0 ? cplHeaders.length : 1}>
                        Pemetaan ke CPL (bobot)
                      </th>
                      <th className="p-3 border-l border-gray-400 align-middle" rowSpan={2}>Bobot CPMK</th>
                      <th className="p-3 border-l border-gray-400 align-middle" rowSpan={2}>Aksi</th>
                    </tr>
                    <tr className="bg-[#0b5c77] text-white text-xs font-semibold text-center">
                      {cplHeaders.length > 0 ? (
                        cplHeaders.map((cpl) => (
                          <th key={cpl.id} className="p-2 border-r border-gray-400 min-w-[60px] max-w-[80px]">
                            {cpl.kode || cpl.kodeCpl || "CPL"}
                          </th>
                        ))
                      ) : (
                        <th className="p-2 border-r border-gray-400">-</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    {rows.length > 0 ? (
                      rows.map((row, rowIndex) => (
                        <React.Fragment key={row.localId}>
                          <tr className="border-b border-gray-200 hover:bg-gray-50 text-center align-top">
                            <td className="p-2 border-r border-gray-200">
                              <input
                                type="text"
                                value={row.kode}
                                onChange={(e) => updateRowField(row.localId, "kode", e.target.value)}
                                className="w-24 border rounded p-1 text-sm"
                                placeholder="CPMK01"
                              />
                            </td>
                            <td className="p-2 border-r border-gray-200 text-left">
                              <input
                                type="text"
                                value={row.deskripsi}
                                onChange={(e) => updateRowField(row.localId, "deskripsi", e.target.value)}
                                className="w-full border rounded p-1 text-sm"
                                placeholder="Deskripsi CPMK"
                              />
                            </td>
                            <td className="p-2 border-r border-gray-200">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={row.target}
                                onChange={(e) => updateRowField(row.localId, "target", e.target.value)}
                                className="w-16 border rounded p-1 text-sm text-center"
                              />
                            </td>

                            {levelPemetaan === "CPMK" ? (
                              cplHeaders.length > 0 ? (
                                cplHeaders.map((cpl) => {
                                  const checked = isCplChecked(row.cplPemetaan, cpl.id);
                                  return (
                                    <td key={cpl.id} className="p-1 border-r border-gray-200">
                                      <div className="flex flex-col items-center gap-0.5">
                                        <input
                                          type="checkbox"
                                          checked={checked}
                                          onChange={() => updateCplCheck(row.localId, cpl.id)}
                                          title={`Relevan ke ${cpl.kode || cpl.kodeCpl || "CPL ini"}`}
                                        />
                                        <input
                                          type="number"
                                          min={0}
                                          max={100}
                                          value={metodePembobotan === "Otomatis" ? displayCpmkBobot(row, rowIndex, cpl.id) : getBobot(row.cplPemetaan, cpl.id)}
                                          onChange={(e) => updateRowBobot(row.localId, cpl.id, e.target.value)}
                                          disabled={metodePembobotan === "Otomatis" || !checked}
                                          className="w-14 border rounded p-1 text-sm text-center disabled:bg-gray-100 disabled:text-gray-400"
                                        />
                                      </div>
                                    </td>
                                  );
                                })
                              ) : (
                                <td className="p-2 border-r border-gray-200">-</td>
                              )
                            ) : (
                              <td className="p-2 border-r border-gray-200 text-xs text-gray-500" colSpan={cplHeaders.length || 1}>
                                Isi bobot per CPL di baris Sub-CPMK di bawah
                              </td>
                            )}

                            <td className="p-2 font-semibold text-center border-r border-gray-200">{rowBobot(row, rowIndex)}</td>
                            <td className="p-2 text-center">
                              <button onClick={() => hapusCpmkRow(row.localId)} className="text-red-600 hover:text-red-800">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>

                          {levelPemetaan === "Sub-CPMK" &&
                            row.subCpmk.map((sub) => (
                              <tr key={sub.localId} className="border-b border-gray-100 bg-gray-50 text-center align-top">
                                <td className="p-2 border-r border-gray-200 pl-6 text-left text-xs text-gray-500" colSpan={1}>
                                  <input
                                    type="text"
                                    value={sub.kode}
                                    onChange={(e) => updateSubField(row.localId, sub.localId, "kode", e.target.value)}
                                    className="w-20 border rounded p-1 text-xs"
                                    placeholder="Sub01"
                                  />
                                </td>
                                <td className="p-2 border-r border-gray-200 text-left">
                                  <input
                                    type="text"
                                    value={sub.deskripsi}
                                    onChange={(e) => updateSubField(row.localId, sub.localId, "deskripsi", e.target.value)}
                                    className="w-full border rounded p-1 text-xs"
                                    placeholder="Deskripsi Sub-CPMK"
                                  />
                                </td>
                                <td className="p-2 border-r border-gray-200 text-xs text-gray-400">-</td>
                                {cplHeaders.length > 0 ? (
                                  cplHeaders.map((cpl) => {
                                    const checked = isCplChecked(sub.cplPemetaan, cpl.id);
                                    return (
                                      <td key={cpl.id} className="p-1 border-r border-gray-200">
                                        <div className="flex flex-col items-center gap-0.5">
                                          <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => updateSubCplCheck(row.localId, sub.localId, cpl.id)}
                                            title={`Relevan ke ${cpl.kode || cpl.kodeCpl || "CPL ini"}`}
                                          />
                                          <input
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={metodePembobotan === "Otomatis" ? displaySubBobot(row, rowIndex, sub.localId, cpl.id) : getBobot(sub.cplPemetaan, cpl.id)}
                                            onChange={(e) => updateSubBobot(row.localId, sub.localId, cpl.id, e.target.value)}
                                            disabled={metodePembobotan === "Otomatis" || !checked}
                                            className="w-14 border rounded p-1 text-xs text-center disabled:bg-gray-100 disabled:text-gray-400"
                                          />
                                        </div>
                                      </td>
                                    );
                                  })
                                ) : (
                                  <td className="p-2 border-r border-gray-200">-</td>
                                )}
                                <td className="p-2 font-semibold text-center border-r border-gray-200 text-xs">{subCpmkTotalDisplay(row, rowIndex, sub)}</td>
                                <td className="p-2 text-center">
                                  <button onClick={() => hapusSubCpmk(row.localId, sub.localId)} className="text-red-500 hover:text-red-700">
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))}

                          {levelPemetaan === "Sub-CPMK" && (
                            <tr className="border-b border-gray-200">
                              <td colSpan={colSpanTotal} className="p-1 pl-6">
                                <button
                                  onClick={() => tambahSubCpmk(row.localId)}
                                  className="text-xs text-primary-blueDark hover:underline flex items-center gap-1"
                                >
                                  <Plus size={12} /> Tambah Sub-CPMK untuk {row.kode || "CPMK ini"}
                                </button>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={colSpanTotal} className="p-4 text-center text-gray-600 font-medium">
                          Belum ada data. Klik "+ Tambah CPMK" untuk mulai.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {rows.length > 0 && (
                    <tfoot>
                      <tr className="bg-gray-100 font-bold text-center">
                        <td colSpan={3 + (cplHeaders.length || 1)} className="p-2 text-right border-r border-gray-300">
                          Total Bobot CPMK
                        </td>
                        <td className={`p-2 border-r border-gray-300 ${grandTotal === 100 ? "text-green-600" : "text-red-500"}`}>
                          {grandTotal}%
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>

              <button onClick={tambahCpmkRow} className="mt-3 bg-gray-200 border border-dashed border-gray-400 px-3 py-1.5 rounded text-sm flex items-center gap-1 hover:bg-gray-300">
                <Plus size={14} /> Tambah CPMK
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
