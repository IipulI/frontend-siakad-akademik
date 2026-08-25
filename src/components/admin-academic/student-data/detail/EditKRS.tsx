import { Check, Eye, Pen, Trash2, X } from "lucide-react";
import ButtonClick from "../ButtonClick";
import { BriefStudentData } from "./BriefStudentData";
import { getAcademicPeriodeDropdown } from "../../../../hooks/useGeneral";
import { useEffect, useRef, useState } from "react";
import {
  delSuntingDetail,
  getSuntingKrs,
  useEditKrs, // Import hook baru
} from "../../../../hooks/admin-akademik/useStudentDetail";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "../../../LoadingSpinner";
import { showToast } from "../../../admin-finance/Toastify";
import ConfirmModal from "../../../admin-finance/ConfirmModal";

// Interface untuk edit form - hanya nilaiNumerik
interface EditFormData {
  id: string;
  nilaiNumerik: number;
}

export default function EditKRS() {
  const [filters, setFilters] = useState({
    namaPeriode: "",
  });

  // State untuk modal konfirmasi delete
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // State untuk edit mode
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editData, setEditData] = useState<{ [key: string]: EditFormData }>({});

  const { state } = useLocation();

  const { data: suntingKrs, isLoading } = getSuntingKrs(
    state,
    filters.namaPeriode
  );
  const { data: periodeAkademikDropdown } = getAcademicPeriodeDropdown();
  const deleteKrs = delSuntingDetail();
  const editKrs = useEditKrs(); // Hook untuk edit

  const reversedDataPeriodeAkademik = periodeAkademikDropdown
    ?.slice()
    .reverse();

  // Function untuk memulai edit mode
  function startEdit(course: any) {
    setEditMode((prev) => ({ ...prev, [course.id]: true }));
    setEditData((prev) => ({
      ...prev,
      [course.id]: {
        id: course.id,
        nilaiNumerik: course.nilaiNumerik || 0,
      },
    }));
  }

  // Function untuk cancel edit
  function cancelEdit(courseId: string) {
    setEditMode((prev) => ({ ...prev, [courseId]: false }));
    setEditData((prev) => {
      const newData = { ...prev };
      delete newData[courseId];
      return newData;
    });
  }

  // Function untuk save edit
  async function saveEdit(courseId: string) {
    const dataToSave = editData[courseId];
    if (!dataToSave) return;

    try {
      await editKrs.mutateAsync({
        krsId: courseId,
        nilaiNumerik: dataToSave.nilaiNumerik,
      });

      showToast.success("Nilai numerik berhasil diperbarui!");
      setEditMode((prev) => ({ ...prev, [courseId]: false }));
      setEditData((prev) => {
        const newData = { ...prev };
        delete newData[courseId];
        return newData;
      });
    } catch (error) {
      showToast.error("Gagal memperbarui nilai numerik.");
      console.error("Error updating KRS:", error);
    }
  }

  // Function untuk handle input change
  function handleInputChange(
    courseId: string,
    field: keyof EditFormData,
    value: any
  ) {
    setEditData((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [field]: value,
      },
    }));
  }

  // Function untuk confirm delete
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

  // Function untuk open delete modal
  function openDeleteModal(id: string) {
    setSelectedId(id);
    setIsModalOpen(true);
  }

  // Handle filter change
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
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
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus data KRS ini?"
      />

      <BriefStudentData showLine={false} />

      <div className="flex items-center space-x-2 mt-4">
        <label htmlFor="periode" className="text-sm font-medium">
          Periode
        </label>
        <select
          id="periode"
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
                  className="border-1 text-center border-gray-500 font-semibold p-2"
                >
                  Data KRS Tidak Tersedia
                </td>
              </tr>
            ) : (
              <>
                {suntingKrs.map((course, index) => {
                  const isEditing = editMode[course.id];
                  const currentEditData = editData[course.id];

                  return (
                    <tr key={course.id} className="hover:bg-gray-100">
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
                        {isEditing ? (
                          <input
                            type="number"
                            value={currentEditData?.nilaiNumerik || ""}
                            onChange={(e) =>
                              handleInputChange(
                                course.id,
                                "nilaiNumerik",
                                Number(e.target.value)
                              )
                            }
                            className="w-full px-1 py-1 border rounded text-sm"
                            min="0"
                            max="100"
                            step="0.1"
                          />
                        ) : (
                          course.nilaiNumerik || "-"
                        )}
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
                          {isEditing ? (
                            <>
                              <ButtonClick
                                icon={<Check size={16} strokeWidth={3} />}
                                color="bg-green-500"
                                onClick={() => saveEdit(course.id)}
                              />
                              <ButtonClick
                                icon={<X size={16} strokeWidth={3} />}
                                color="bg-gray-500"
                                onClick={() => cancelEdit(course.id)}
                              />
                            </>
                          ) : (
                            <>
                              <ButtonClick
                                icon={<Pen size={16} strokeWidth={3} />}
                                color="bg-primary-blueSoft"
                                onClick={() => startEdit(course)}
                              />
                              <ButtonClick
                                icon={<Trash2 size={16} strokeWidth={3} />}
                                color="bg-red-400"
                                onClick={() => openDeleteModal(course.id)}
                              />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
