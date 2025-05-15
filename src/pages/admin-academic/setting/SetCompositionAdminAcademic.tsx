import React from "react"
import MainLayout from "../../../components/layouts/MainLayout"
import { Plus, Save } from "lucide-react"
import TableComposition from "../../../components/admin-academic/setting/TableComposition"

const SetCompositionAdminAcademic = () => {
    const tableHead = ["Komposisi", "Persentase"]
    const data = [
        {
            komposisi: "Tugas Individu",
            persentase: "20%",
        },
        {
            komposisi: "UTS",
            persentase: "25%",
        },
        {
            komposisi: "UAS",
            persentase: "40%",
        },
        {
            komposisi: "Kehadiran",
            persentase: "15%",
        },
        {
            komposisi: "Total",
            persentase: "100%",
        }
    ]

    const yearOptions = ["Tahun 2024", "Tahun 2025", "Tahun 2026"]
    const matkulOptions = ["Kalkulus", "Rekayasa Perangkat Lunak", "Pemrograman Web", "Pemrograman Perangkat Bergerak"]
    const compositionOptions = ["Tugas Individu", "UTS", "UAS", "Kehadiran"]

    return (
        <MainLayout
            titlePage={"Set Komposisi Nilai"}
            isGreeting={false}
        >
            <div className="flex text-sm bg-white space-x-5 items-center max-w-2xl mx-auto p-2 px-4 border-t-2 border-primary-yellow rounded-sm shadow-sm">
                <label htmlFor="" className="font-semibold">
                    Tahun Kurikulum
                </label>
                <select name="" id="" className="border-2 p-1 rounded w-40  ">
                    {yearOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
                <label htmlFor="" className="font-semibold">
                    Mata Kuliah
                </label>
                <select name="" id="" className="border-2 p-1 rounded w-40  ">
                    {matkulOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
            </div>
            <div className="text-sm my-4 bg-white max-w-2xl mx-auto p-2 px-4 border-t-2 border-primary-blueSoft rounded-sm shadow-sm">
                <div className="flex gap-4 items-center">
                    <label htmlFor="" className="font-semibold">
                        Komposisi Nilai
                    </label>
                    <select name="" id="" className="border-2 p-1 rounded w-40  ">
                        {compositionOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end">
                    <button 
                            className=" bg-primary-green cursor-pointer py-2 mr-4 text-sm text-white  px-4 rounded flex items-center justify-center"
                            >
                                <Plus color="white" size={16} className="mr-2" />
                                Tambah
                    </button>
                </div>
            </div>
            <div className="max-w-2xl mx-auto mt-8 bg-white py-2 rounded-sm border-t-2 border-primary-green">
                <div className="flex justify-end">
                    <button 
                        className=" bg-primary-blueSoft cursor-pointer py-2 mr-4 text-sm text-white  px-4 rounded flex items-center justify-center"
                        >
                            <Save color="white" size={16} className="mr-2" />
                            Simpan
                    </button>

                </div>
                <TableComposition
                    tableHead={tableHead}
                    data={data}
                    error={"error"}
                    // setId={setId}
                />
            </div>
        </MainLayout>

    )
}

export default SetCompositionAdminAcademic