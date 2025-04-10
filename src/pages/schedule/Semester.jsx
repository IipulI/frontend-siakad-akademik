import Biodata from "../../components/Biodata"
import MainLayout from "../../components/layouts/MainLayout"

export default function Semester() {
    return (
        <MainLayout isGreeting={false} titlePage={"Jadwal Semester"}>
            <div className="w-full bg-white min-h-screen py-2 rounded-2xl border-t-2 border-primary-green">
                <Biodata />
            </div>
        </MainLayout>
    )
}
