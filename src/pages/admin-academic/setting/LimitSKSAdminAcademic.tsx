import React from "react"
import MainLayout from "../../../components/layouts/MainLayout"
import TableSetting from "../../../components/admin-academic/setting/TableSetting"
import { Plus } from "lucide-react"

const LimitSKSAdminAcademic = () => {
    const tableHead = ["IPS Min", "IPS Max", "Batas SKS", "Aksi"]
    const data = [
        {
            id: 1,
            ipsMin: "0.00",
            ipsMax: "2.50",
            batasSKS: "18",
            aksi: ""
        },
        {
            id: 2,
            ipsMin: "2.51",
            ipsMax: "2.99",
            batasSKS: "21",
            aksi: ""
        },
        {
            id: 3,
            ipsMin: "3.00",
            ipsMax: "4.00",
            batasSKS: "24",
            aksi: ""
        }
    ]

    return (
        <MainLayout
            titlePage={"Batas SKS"}
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

export default LimitSKSAdminAcademic