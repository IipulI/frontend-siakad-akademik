import React from "react"
import MainLayout from "../../../components/layouts/MainLayout"
import TableSetting from "../../../components/admin-academic/setting/TableSetting"
import { Plus } from "lucide-react"
import FilterDropdown from "../../../components/admin-academic/FilterDropdown"

const ScaleAdminAcademic = () => {
    const tableHead = ["Jenjang", "Grade", "Bobot", "Nilai Bawah", "Nilai Atas", "Aksi"]
    const data = [
        {
            id: 1,
            jenjang: "S1-Teknik Informatika",
            grade: "A",
            bobot: "4.00",
            nilaiBawah: "80",
            nilaiAtas: "100",
            aksi: ""
        },
        {
            id: 2,
            jenjang: "S1-Teknik Informatika",
            grade: "A",
            bobot: "4.00",
            nilaiBawah: "80",
            nilaiAtas: "100",
            aksi: ""
        },
        {
            id: 3,
            jenjang: "S1-Teknik Informatika",
            grade: "A",
            bobot: "4.00",
            nilaiBawah: "80",
            nilaiAtas: "100",
            aksi: ""
        }
    ]

    const levelOptions = ["S-1 Teknik Informatika", "S-1 Teknik Mesin", "S-1 Teknik Sipil"]

    return (
        <MainLayout
            titlePage={"Skala Penilaian"}
            isGreeting={false}
        >
            <FilterDropdown title="Jenjang" options={levelOptions} />
            <div className="w-full mx-auto mt-8 bg-white py-2 rounded-sm border-t-2 border-primary-green">
                <div className="flex justify-end">
                    <button 
                        className="bg-primary-green cursor-pointer py-2 mr-4 text-sm text-white  px-4 rounded flex items-center justify-center"
                        >
                            <Plus color="white" size={16} className="mr-2" />
                            Tambah
                    </button>
                </div>
                <div className="overflow-auto">
                    <TableSetting
                        tableHead={tableHead}
                        data={data}
                        error={"error"}
                        // setId={setId}
                    />
                </div>
            </div>
        </MainLayout>

    )
}

export default ScaleAdminAcademic