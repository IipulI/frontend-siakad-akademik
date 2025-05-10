import React from "react"
import MainLayout from "../../../components/layouts/MainLayout"
import TableSetting from "../../../components/admin-academic/setting/TableSetting"
import { Plus, Settings } from "lucide-react"
import FilterDropdown from "../../../components/admin-academic/FilterDropdown"
import { useNavigate } from "react-router-dom"

const CompositionAdminAcademic = () => {
    const navigate = useNavigate()
    const tableHead = ["Komposisi", "Persentase", "Aksi"]
    const data = [
        {
            komposisi: "Tugas Individu",
            persentase: "20%",
            aksi: ""
        },
        {
            komposisi: "UTS",
            persentase: "25%",
            aksi: ""
        },
        {
            komposisi: "UAS",
            persentase: "40%",
            aksi: ""
        },
        {
            komposisi: "Kehadiran",
            persentase: "15%",
            aksi: ""
        }
    ]

    const yearOptions = ["Tahun 2024", "Tahun 2025", "Tahun 2026"]

    return (
        <MainLayout
            titlePage={"Komposisi Nilai"}
            isGreeting={false}
        >
            <div className="max-w-2xl mx-auto">
                <FilterDropdown title={"Tahun Kurikulum"} options={yearOptions} />
            </div>
            <div className="max-w-2xl mx-auto mt-8 bg-white py-2 rounded-sm border-t-2 border-primary-green">
                <div className="flex justify-end">
                    <button 
                        className=" bg-primary-green cursor-pointer py-2 mr-4 text-sm text-white  px-4 rounded flex items-center justify-center"
                        >
                            <Plus color="white" size={16} className="mr-2" />
                            Tambah
                    </button>
                    <button 
                        onClick={() => {
                            navigate("/admin-akademik/komposisi-nilai/set-komposisi-nilai-mata-kuliah")
                        }}
                        className=" bg-primary-yellow cursor-pointer py-2 mr-4 text-sm text-white  px-4 rounded flex items-center justify-center"
                        >
                            <Settings color="white" size={16} className="mr-2" />
                            Set komposisi Nilai Mata Kuliah
                    </button>

                </div>
                <TableSetting
                    tableHead={tableHead}
                    data={data}
                    error={"error"}
                    // setId={setId}
                />
            </div>
        </MainLayout>

    )
}

export default CompositionAdminAcademic