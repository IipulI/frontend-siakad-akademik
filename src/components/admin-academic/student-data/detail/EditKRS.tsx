import { Check, Eye, Pen, Trash2, X } from "lucide-react";
import ButtonClick from "../ButtonClick";
import { BriefStudentData } from "./BriefStudentData";
import { getAcademicPeriodeDropdown } from "../../../../hooks/useFilter";
import { useEffect, useRef, useState } from "react";
import {
  delSuntingDetail,
  getSuntingKrs,
} from "../../../../hooks/admin-akademik/useStudentDetail";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "../../../LoadingSpinner";
import { showToast } from "../../../admin-finance/Toastify";
import ConfirmModal from "../../../admin-finance/ConfirmModal";

export default function EditKRS() {
  const [filters, setFilters] = useState({
    namaPeriode: "",
  });
  // state untuk modal konfirmasi delete
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { state } = useLocation();

  const { data: suntingKrs } = getSuntingKrs(state, filters.namaPeriode);
  const { data: periodeAkademikDropdown } = getAcademicPeriodeDropdown();
  const deleteKrs = delSuntingDetail();

  const reversedDataPeriodeAkademik = periodeAkademikDropdown
    ?.slice()
    .reverse();

  function Edit() {
    alert("oke see");
  }

  async function confirmDelete() {
    if (!selectedId || deleteKrs.isPending) return;

    try {
      await deleteKrs.mutateAsync(selectedId);
      showToast.success("Data berhasil dihapus!");
    } catch (err) {
      showToast.error("Gagal menghapus data.");
    } finally {
      setIsModalOpen(false);
      setSelectedId(null);
    }
  }

  function openDeleteModal(id: string) {
    setSelectedId(id);
    setIsModalOpen(true);
  }

  // Handle filter change
  const handleFilterChange = (field: string, value: string) => {
    console.log(`Filter changed: ${field} = ${value}`);

    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [field]: value,
      };
      console.log("New filters:", newFilters);
      return newFilters;
    });
  };

  const totalSKS =
    suntingKrs?.reduce((total, course) => {
      return total + (Number(course.sks) || 0);
    }, 0) || 0;

  return (
    <div className="p-4 border-1 rounded-sm shadow-sm">
      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
      <BriefStudentData showLine={false} />

      <div className="flex items-center space-x-2 mt-4">
        <label htmlFor="" className="text-sm font-medium">
          Periode
        </label>
        <select
          name=""
          id=""
          className="border-2 rounded p-1 text-sm w-40"
          onChange={(e) => handleFilterChange("namaPeriode", e.target.value)}
          value={filters.namaPeriode}
        >
          {reversedDataPeriodeAkademik?.map((periode) => (
            <option key={periode.id} value={periode.namaPeriode}>
              {periode.namaPeriode}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse border border-gray-500">
          <thead>
            <tr>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                No
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Kur
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Kode MK
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Mata Kuliah
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Kelas
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                SKS
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Nilai Numerik
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Nilai Huruf
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Nilai Mutu
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Valid
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Lulus
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {!suntingKrs || suntingKrs.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="border border-gray-500 p-8 text-center text-gray-500"
                >
                  {!filters.namaPeriode
                    ? "Pilih periode untuk melihat data KRS"
                    : "Tidak ada data KRS untuk periode yang dipilih"}
                </td>
              </tr>
            ) : (
              <>
                {suntingKrs.map((course, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {course.kurikulum || "-"}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {course.kodeMataKuliah || "-"}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2">
                      {course.namaMataKuliah || "-"}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {course.namaKelas || "-"}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {course.sks || "-"}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {course.nilaiNumerik || "-"}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {course.nilaiHuruf || "-"}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {course.nilaiMutu || "-"}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {course.valid || "-"}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      <div className="flex justify-center align-center">
                        {course.lulus ? (
                          <Check color="green" />
                        ) : (
                          <X color="red" />
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      <div className="flex space-x-2 justify-center">
                        <ButtonClick
                          icon={<Pen size={16} strokeWidth={3} />}
                          color={"bg-primary-blueSoft"}
                          onClick={Edit}
                        />
                        <ButtonClick
                          icon={<Trash2 size={16} strokeWidth={3} />}
                          color={"bg-red-400"}
                          onClick={() => openDeleteModal(state)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100">
                  <td
                    colSpan={5}
                    className="border border-gray-500 p-2 font-bold text-left"
                  >
                    Jumlah SKS
                  </td>
                  <td className="border border-gray-500 p-2 text-center font-bold">
                    {totalSKS}
                  </td>
                  <td
                    colSpan={6}
                    className="border border-gray-500 font-semibold"
                  ></td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
