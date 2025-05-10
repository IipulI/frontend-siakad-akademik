import React, { useState } from "react";

interface FormAddAnnouncementProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

const FormAddAnnouncement: React.FC<FormAddAnnouncementProps> = ({ onCancel, onSubmit }) => {
  const [banner, setBanner] = useState("");
  const [judul, setJudul] = useState("");
  const [pengumuman, setPengumuman] = useState("");
  const [aktif, setAktif] = useState(false);
  const [prioritas, setPrioritas] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ banner, judul, pengumuman, aktif, prioritas });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
      <div className="mb-4 flex items-center">
        <label className="w-32 block text-sm font-medium">Banner</label>
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1"
          value={banner}
          onChange={e => setBanner(e.target.value)}
        />
      </div>
      <div className="mb-4 flex items-center">
        <label className="w-32 block text-sm font-medium">Judul<span className="text-red-500">*</span></label>
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1"
          value={judul}
          onChange={e => setJudul(e.target.value)}
          required
        />
      </div>
      <div className="mb-4 flex items-start">
        <label className="w-32 block text-sm font-medium mt-2">Pengumuman<span className="text-red-500">*</span></label>
        <div className="flex-1">
          <textarea
            className="w-full border rounded px-2 py-1 min-h-[100px]"
            value={pengumuman}
            onChange={e => setPengumuman(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="mb-4 flex items-center">
        <label className="w-32 block text-sm font-medium">Aktif</label>
        <input
          type="checkbox"
          className="mr-2"
          checked={aktif}
          onChange={e => setAktif(e.target.checked)}
        />
      </div>
      <div className="mb-4 flex items-center">
        <label className="w-32 block text-sm font-medium">Prioritas</label>
        <input
          type="checkbox"
          className="mr-2"
          checked={prioritas}
          onChange={e => setPrioritas(e.target.checked)}
        />
        <span className="text-xs text-gray-700">Pengumuman muncul paling atas meskipun banyak yang lebih baru</span>
      </div>
      
    </form>
  );
};

export default FormAddAnnouncement;
