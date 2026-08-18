import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import LoadingSpinner from "../../../LoadingSpinner";
import SearchableSelect from "../../SearchableSelect";
import { getCurriculumYear } from "../../../../hooks/academic/useCurriculumYear";
import { useEkivalensiMataKuliah, useDropdownMkLama, useSaveBulkEkivalensi } from "../../../../hooks/academic/useKurikulumProdi";

interface Props {
  prodiId: string;
  tahunKurikulumId: string;
}

export default function TabEkivalensiMataKuliah({ prodiId, tahunKurikulumId }: Props) {
  const { data: curriculumData = [] } = getCurriculumYear();
  const [kurikulumLamaId, setKurikulumLamaId] = useState("");

  const { data, isLoading } = useEkivalensiMataKuliah(prodiId, tahunKurikulumId, kurikulumLamaId, !!prodiId && !!tahunKurikulumId && !!kurikulumLamaId);
  const { data: mkLamaOptions = [] } = useDropdownMkLama(prodiId, kurikulumLamaId, !!prodiId && !!kurikulumLamaId);
  const saveMutation = useSaveBulkEkivalensi();

  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (data?.tabel) {
      const initial: Record<string, string> = {};
      data.tabel.forEach((row) => {
        if (row.mkLamaId) initial[row.mkBaruId] = row.mkLamaId;
      });
      setMapping(initial);
    }
  }, [data]);

  const handleSimpan = () => {
    setSuccessMessage("");
    const dataEkivalensi = (data?.tabel || []).map((row) => ({
      mkBaruId: row.mkBaruId,
      mkLamaId: mapping[row.mkBaruId] || null,
    }));
    saveMutation.mutate(dataEkivalensi, {
      onSuccess: () => setSuccessMessage("Pemetaan Ekivalensi Mata Kuliah berhasil disimpan."),
    });
  };

  const kurikulumBaruLabel = curriculumData.find((c: any) => c.id === tahunKurikulumId)?.tahun || "-";
  const kurikulumLamaLabel = curriculumData.find((c: any) => c.id === kurikulumLamaId)?.tahun || "-";

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-700">Dari Tahun Kurikulum</label>
          <div className="w-48">
            <SearchableSelect
              value={kurikulumLamaId}
              onChange={setKurikulumLamaId}
              placeholder="-- Pilih --"
              searchPlaceholder="Cari tahun kurikulum..."
              options={curriculumData.filter((c: any) => c.id !== tahunKurikulumId).map((c: any) => ({ value: c.id, label: c.tahun }))}
            />
          </div>
        </div>
        {kurikulumLamaId && (
          <button
            onClick={handleSimpan}
            disabled={saveMutation.isPending || isLoading}
            className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
          >
            <Save size={16} /> {saveMutation.isPending ? "Menyimpan..." : "Simpan Pemetaan"}
          </button>
        )}
      </div>

      {successMessage && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">{successMessage}</div>}

      {!kurikulumLamaId ? (
        <div className="p-6 text-center text-gray-400 italic border border-gray-200 rounded-md">
          Pilih Tahun Kurikulum lama untuk mulai memetakan ekivalensi Mata Kuliah.
        </div>
      ) : isLoading || !data ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-sm">
          <table className="min-w-full bg-white border-collapse text-sm">
            <thead>
              <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center">
                <th className="p-2 border border-gray-300" colSpan={3}>Mata Kuliah Kurikulum {kurikulumBaruLabel}</th>
                <th className="p-2 border border-gray-300" colSpan={2}>Mata Kuliah Kurikulum {kurikulumLamaLabel}</th>
              </tr>
              <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center">
                <th className="p-2 border border-gray-300">Kode</th>
                <th className="p-2 border border-gray-300 text-left">Mata Kuliah</th>
                <th className="p-2 border border-gray-300">SKS</th>
                <th className="p-2 border border-gray-300 text-left">Mata Kuliah (Ekivalen)</th>
                <th className="p-2 border border-gray-300">SKS</th>
              </tr>
            </thead>
            <tbody className="text-center text-gray-700">
              {data.tabel.map((row) => {
                const selectedLama = mkLamaOptions.find((o) => o.id === mapping[row.mkBaruId]);
                return (
                  <tr key={row.mkBaruId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-2 border border-gray-200">{row.mkBaruKode}</td>
                    <td className="p-2 border border-gray-200 text-left">{row.mkBaruNama}</td>
                    <td className="p-2 border border-gray-200">{row.mkBaruSks}</td>
                    <td className="p-2 border border-gray-200 text-left">
                      <SearchableSelect
                        value={mapping[row.mkBaruId] || ""}
                        onChange={(v) => setMapping((prev) => ({ ...prev, [row.mkBaruId]: v }))}
                        placeholder="-- Tidak ada ekivalensi --"
                        searchPlaceholder="Cari mata kuliah lama..."
                        options={mkLamaOptions.map((o) => ({ value: o.id, label: o.label }))}
                      />
                    </td>
                    <td className="p-2 border border-gray-200">{selectedLama ? selectedLama.label.match(/\((\d+) SKS\)/)?.[1] || "-" : "-"}</td>
                  </tr>
                );
              })}
              {data.tabel.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-400 italic">
                    Belum ada Mata Kuliah pada Kurikulum {kurikulumBaruLabel}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
