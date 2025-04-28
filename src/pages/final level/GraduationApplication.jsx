import MainLayout from "../../components/layouts/MainLayout";
import ContentCard from "../../components/final level/layout/ContentCard";

export default function GraduationApplication() {
  return (
    <MainLayout titlePage="Yudisium Mahasiswa">
      <ContentCard>
        {/* sementara cuy, gatau isinya */}
        <div className="bg-red-100 text-sm xl:text-base md:w-[600px] lg:w-[900px] text-red-500 p-3 rounded-lg -mt-7">
          Anda belum terdaftar menjadi Peserta Yusidium, Harap konfirmasi ke
          bagian Adminstrasi
        </div>
      </ContentCard>
    </MainLayout>
  );
}
