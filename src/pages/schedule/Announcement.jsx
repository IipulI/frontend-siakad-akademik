import Biodata from "../../components/Biodata"
import MainLayout from "../../components/layouts/MainLayout"
import Table from "../../components/Table"

export default function Announcement() {
    const tableHead = ["No", "Tanggal", "Penulis", "Judul", "Aksi"]
    const data = [{
        id: 1,
        tanggal: "6 Mar 2025, 08:53:10",
        penulis: "Shesil Varista Dea Wulandari",
        judul: "[NEW] Cara Bayar Kuliah Melalui Shopee",
        aksi: "",
    }, {
        id: 2,
        tanggal: "19 Nov 2024, 14:54:13",
        penulis: "Shesil Varista Dea Wulandari",
        judul: "Cara bayar kuliah melalui Tokopedia",
        aksi: "",
    }, {
        id: 3,
        tanggal: "13 Nov 2024, 18:25:06",
        penulis: "Shesil Varista Dea Wulandari",
        judul: "Cara bayar kuliah melalui Bank Muamalat",
        aksi: "",
    }]
    return (
        <MainLayout isGreeting={false} titlePage={"Pengumuman"}>
            <div className="w-full bg-white min-h-screen py-2 rounded-2xl border-t-2 border-primary-green">
                <div className="flex ml-4 justify-start gap-16">
                    <select className="rounded px-2 text-primary-brown appearance-none border-primary-brown border p-1">
                        <option value={""}>--Semua--</option>
                    </select>
                    <div className="flex">
                        <input type="search" placeholder="Cari Pengumuman" className="px-2 py-1 rounded shadow-md border border-black/50" />
                        <button className="-ml-2 bg-primary-green w-10"></button>
                        <button className="bg-blue-700 rounded-r-md w-10"></button>
                    </div>
                </div>
                <Table tableHead={tableHead} data={data} />
            </div>
        </MainLayout>
    )
}
