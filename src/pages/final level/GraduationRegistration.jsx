import MainLayout from "../../components/layouts/MainLayout";
import ContentCard from "../../components/final level/layout/ContentCard";
import Biodata from "../../components/Biodata";

export default function GraduationRegistration() {
  return (
    <MainLayout titlePage="Data peserta Wisuda">
      <ContentCard>
        <div className="-mt-7">
          <Biodata showLine={false} />
        </div>

        {/* sementara cuy, gatau isinya */}
        <div className="bg-red-100 text-sm xl:text-base md:w-[600px] lg:w-[900px] text-red-500 p-3 rounded-lg mt-3">
          Wisuda
          <span className="font-semibold">
            221106042807 - MUHAMMAD RIDHO FATHAN
          </span>
          Belum Terjadwalkan
        </div>
      </ContentCard>
    </MainLayout>
  );
}
