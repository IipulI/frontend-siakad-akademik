import { Fragment } from "react"
import BiodataSection from "./BiodataSection"

const Biodata = () => {
    // tar data dari api
    const data = {
            id: 1,
            nim: "2211060042807",
            nama: "Muhammad Ridho Fatan",
            prodi: "Teknik Informatika",
            status: "Aktif",
            angkatan: "2022",
            kurikulum: "2021",
            semester: "6",
            pembimbing: "Berlina Wulandari S.T, M.Kom",
            sksLulus: "103 / 3.78",
            totalSks: "103 / 3.78"
    }

    const sections = [
        {
            title: ["NIM", "Nama Mahasiswa", "Program Studi", "Status Mahasiswa", "Angkatan"],
            value: [data.nim, data.nama, data.prodi, data.status, data.angkatan],
        },
        {
            title: ["Tahun Kurikulum", "Semester", "Pembimbing Akademik", "SKS Lulus/IPK Lulus", "Total SKS/IPK"],
            value: [data.kurikulum, data.semester, data.pembimbing, data.sksLulus, data.totalSks],
        }
    ]

    return (
        <div className="w-full flex justify-between items-center bg-primary-green/5 px-6 py-4 border-l-4 border-primary-green">
            {sections.map((section, index) => (
                <Fragment key={index}>
                    <BiodataSection key={`title-${index}`} title={section.title} isTitle={true} />
                    <BiodataSection key={`value-${index}`} title={section.value} isTitle={false}/>
                </Fragment>
            ))}
        </div>
    )
}

export default Biodata