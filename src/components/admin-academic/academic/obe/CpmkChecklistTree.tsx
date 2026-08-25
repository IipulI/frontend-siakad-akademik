import React from "react";

export interface MasterCpmkItem {
  id: string;
  kode: string;
  deskripsi: string;
  parent_id: string | null;
  subCpmk: Array<{ id: string; kode: string; deskripsi: string; parent_id: string }>;
}

interface CpmkChecklistTreeProps {
  masterCpmk: MasterCpmkItem[];
  checkedIds: string[];
  onChange?: (ids: string[]) => void;
  readOnly?: boolean;
}

export default function CpmkChecklistTree({ masterCpmk, checkedIds, onChange, readOnly = false }: CpmkChecklistTreeProps) {
  const isChecked = (id: string) => checkedIds.includes(id);

  const toggle = (id: string) => {
    if (readOnly || !onChange) return;
    if (checkedIds.includes(id)) {
      onChange(checkedIds.filter((c) => c !== id));
    } else {
      onChange([...checkedIds, id]);
    }
  };

  if (masterCpmk.length === 0) {
    return <p className="text-sm text-gray-400 italic">Belum ada CPMK yang dipetakan ke mata kuliah ini. Lengkapi dulu di menu Pemetaan CPMK.</p>;
  }

  return (
    <div className="border border-gray-200 rounded-sm overflow-hidden">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-primary-blueDark text-white">
            <th className="p-2 border-r border-white/20 w-10">#</th>
            <th className="p-2 border-r border-white/20 text-left w-32">Kode</th>
            <th className="p-2 text-left">Deskripsi</th>
          </tr>
        </thead>
        <tbody>
          {masterCpmk.map((cpmk) => (
            <React.Fragment key={cpmk.id}>
              <tr className="border-t border-gray-200 hover:bg-gray-50">
                <td className="p-2 border-r border-gray-200 text-center">
                  {readOnly ? (
                    isChecked(cpmk.id) ? <span className="text-primary-green font-bold">✔</span> : ""
                  ) : (
                    <input type="checkbox" checked={isChecked(cpmk.id)} onChange={() => toggle(cpmk.id)} />
                  )}
                </td>
                <td className="p-2 border-r border-gray-200 font-semibold">{cpmk.kode}</td>
                <td className="p-2">{cpmk.deskripsi}</td>
              </tr>
              {cpmk.subCpmk?.map((sub) => (
                <tr key={sub.id} className="border-t border-gray-100 hover:bg-gray-50 bg-gray-50/50">
                  <td className="p-2 border-r border-gray-200 text-center">
                    {readOnly ? (
                      isChecked(sub.id) ? <span className="text-primary-green font-bold">✔</span> : ""
                    ) : (
                      <input type="checkbox" checked={isChecked(sub.id)} onChange={() => toggle(sub.id)} />
                    )}
                  </td>
                  <td className="p-2 border-r border-gray-200 pl-6 text-gray-600">{sub.kode}</td>
                  <td className="p-2 text-gray-600">{sub.deskripsi}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
