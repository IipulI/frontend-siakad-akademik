import React from "react";

interface CurriculumYearDetailProps {
  data: {
    id: number;
    tahun: string;
    deskripsi: string;
  } | null;
}

const DetailCurriculumYear: React.FC<CurriculumYearDetailProps> = ({ data }) => {
  if (!data) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">Data tidak ditemukan</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-300">
      <h2 className="text-xl font-bold mb-3">Detail Tahun Kurikulum</h2>
      <div className="mb-3">
        <span className="font-semibold">ID:</span> {data.id}
      </div>
      <div className="mb-3">
        <span className="font-semibold">Tahun:</span> {data.tahun}
      </div>
      <div className="mb-3">
        <span className="font-semibold">Deskripsi:</span>
        <p className="text-gray-600">{data.deskripsi}</p>
      </div>
    </div>
  );
};

export default DetailCurriculumYear;
