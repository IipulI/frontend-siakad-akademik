import React from "react"
import MainLayout from "../../../components/layouts/MainLayout"
import TableSetting from "../../../components/admin-academic/setting/TableSetting"
import { Plus } from "lucide-react"

const LevelAdminAcademic = () => {
    const tableHead = ["Nama", "Singkatan","Aksi"]
    const data = [
        {
            id: 1,
            nama: "Strata 1",
            singkatan: "S1",
            aksi: ""
        },
        {
            id: 2,
            nama: "Strata 2",
            singkatan: "S2",
            aksi: ""
        },
        {
            id: 3,
            nama: "Strata 3",
            singkatan: "D3",
            aksi: ""
        }
    ]

    return (
        <MainLayout
            titlePage={"Jenjang Pendidikan"}
            isGreeting={false}
        >
            <div className="max-w-2xl mx-auto mt-2 bg-white py-2 rounded-sm border-t-2 border-primary-green">
                <div className="flex justify-end">
                    <button 
                        className=" bg-primary-green cursor-pointer py-2 mr-4 text-sm text-white  px-4 rounded flex items-center justify-center"
                        >
                            <Plus color="white" size={16} className="mr-2" />
                            Tambah
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

export default LevelAdminAcademic