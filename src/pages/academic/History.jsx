import Biodata from "../../components/Biodata"
import MainLayout from "../../components/layouts/MainLayout"
import Table from "../../components/Table"

export default function History() {

    const tableHead = ["No", "Kode MK", "Nama Mata Kuliah", "Kelas", "SKS", "Hari", "Jam", "Ruangan", "Dosen Pengajar"]
    const data = [
        { no: 1, kodeMk: "TIF302", mataKuliah: "Metode Penelitian", kelas: "REG_B", sks: 2, hari: "Kamis", jam: "09.00-11.00", ruangan: "206", dosen: "Safaruddin Hidayat S.Kom M.Kom" },
        { no: 2, kodeMk: "TIF304", mataKuliah: "Kapita Selekta", kelas: "REG_B", sks: 2, hari: "Jumat", jam: "13.00-15.00", ruangan: "203", dosen: "Dewi Primatasari S.Si" },
        { no: 3, kodeMk: "TIF306", mataKuliah: "Pemrograman Web", kelas: "REG_B", sks: 3, hari: "Senin", jam: "10.00-12.00", ruangan: "204", dosen: "Safaruddin Hidayat S.Kom M.Kom" },
        { no: 4, kodeMk: "TIF308", mataKuliah: "Jaringan Komputer", kelas: "REG_B", sks: 3, hari: "Selasa", jam: "08.00-10.00", ruangan: "301", dosen: "Safaruddin Hidayat S.Kom M.Kom" },
        { no: 5, kodeMk: "TIF310", mataKuliah: "Basis Data", kelas: "REG_B", sks: 3, hari: "Rabu", jam: "10.00-12.00", ruangan: "303", dosen: "Safaruddin Hidayat S.Kom M.Kom" },
        { no: 6, kodeMk: "TIF312", mataKuliah: "Keamanan Informasi", kelas: "REG_B", sks: 2, hari: "Kamis", jam: "13.00-15.00", ruangan: "207", dosen: "Safaruddin Hidayat S.Kom M.Kom" },
        { no: 7, kodeMk: "TIF314", mataKuliah: "Machine Learning", kelas: "REG_B", sks: 3, hari: "Jumat", jam: "08.00-10.00", ruangan: "208", dosen: "Safaruddin Hidayat S.Kom M.Kom" },
        { no: 8, kodeMk: "TIF316", mataKuliah: "RPL Lanjut", kelas: "REG_B", sks: 3, hari: "Senin", jam: "13.00-15.00", ruangan: "209", dosen: "Fitrah Satrya Fajar Kusumah S.Kom M.Kom" },
        { no: 9, kodeMk: "TIF318", mataKuliah: "Kecerdasan Buatan", kelas: "REG_B", sks: 3, hari: "Selasa", jam: "10.00-12.00", ruangan: "302", dosen: "Safaruddin Hidayat S.Kom M.Kom" },
        { no: 10, kodeMk: "TIF320", mataKuliah: "Cloud Computing", kelas: "REG_B", sks: 2, hari: "Rabu", jam: "08.00-10.00", ruangan: "206", dosen: "Safaruddin Hidayat S.Kom M.Kom" }
    ];


    return (
        <MainLayout isGreeting={false} titlePage={"Riwayat KRS"}>
            <div className="w-full bg-white min-h-screen py-2 rounded-2xl border-t-2 border-primary-green">
                <div className="flex justify-end gap-2 mx-4 mb-4">
                    <button type="button" className="bg-primary-green w-24 h-8 rounded"></button>
                    <button className="bg-orange-400 w-20 h-8 rounded"></button>
                </div>
                
                <Biodata />

                <div className="flex justify-between gap-4 m-4">
                    <button className="bg-primary-green w-24 h-8 rounded"></button>
                    <button className="bg-blue-400 w-32 h-8 rounded"></button>
                </div>

                <div className="w-full bg-primary-green/20 p-4">
                    <h1 className="text-primary-green">KRS ini <span className="font-semibold">Telah Divalidasi</span> dan tidak bisa diubah. Untuk membatalkan validasi KRS silakan menghubungi Pembimbing Akademik terkait</h1>
                </div>

                <Table tableHead={tableHead} data={data} />
            </div>
        </MainLayout>
    )
}
