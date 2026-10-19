import React, { useState } from "react";
import { Plus } from "lucide-react";
import ButtonClick from "./ButtonClick";
import { DosenAsyncSelect } from "./DosenAsyncSelect";

export interface DosenItem {
    id: string;
    nama: string;
    nip?: string;
}

interface DosenPengajarSectionProps {
    value: DosenItem[];
    onChange: (next: DosenItem[]) => void;
}

export const DosenPengajarSection = ({
                                         value,
                                         onChange,
                                     }: DosenPengajarSectionProps) => {
    const [showPicker, setShowPicker] = useState(false);

    const handleAddDosen = (id: string, nama: string, nip?: string) => {
        if (!id || value.some((d) => d.id === id)) return;
        onChange([...value, { id, nama, nip }]);
        setShowPicker(false);
    };

    const handleRemoveDosen = (id: string) => {
        onChange(value.filter((d) => d.id !== id));
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
                <h1 className="font-bold text-xl sm:text-2xl">Dosen Pengajar</h1>
                {showPicker ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="flex-1 min-w-[220px]">
                            <DosenAsyncSelect
                                value=""
                                selectedLabel=""
                                onChange={(id, label) => handleAddDosen(id, label)}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowPicker(false)}
                            className="text-xs text-gray-500 hover:underline whitespace-nowrap"
                        >
                            Batal
                        </button>
                    </div>
                ) : (
                    <ButtonClick
                        icon={<Plus size={15} strokeWidth={3} />}
                        color="bg-primary-green"
                        text="Tambah Dosen"
                        onClick={() => setShowPicker(true)}
                    />
                )}
            </div>

            <div className="rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
                {value.length === 0 ? (
                    <p className="text-center text-sm text-gray-500 py-6">
                        Belum ada dosen pengajar untuk kelas ini.
                    </p>
                ) : (
                    value.map((d, index) => (
                        <div
                            key={d.id}
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                        >
              <span className="text-sm sm:text-base">
                {index + 1}. {d.nama}
                  {d.nip ? ` - ${d.nip}` : ""}
              </span>
                            <button
                                type="button"
                                onClick={() => handleRemoveDosen(d.id)}
                                className="text-red-500 hover:underline text-xs"
                            >
                                Hapus
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};