import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
  title?: string;
}

export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  message = "Apakah Anda yakin ingin menghapus data ini?",
  title = "Konfirmasi Hapus",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] text-center">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="mb-6 text-sm">{message}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded cursor-pointer active:scale-95 transition-all"
          >
            Hapus
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-1 rounded cursor-pointer active:scale-95 transition-all"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
