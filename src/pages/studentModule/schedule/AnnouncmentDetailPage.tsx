import React, { useEffect, useState } from "react";import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../../components/layouts/MainLayout";
import { usePengumumanDetail, usePengumumanBanner } from "../../../hooks/usePengumuman"; // Hook yang sudah kita buat
import { ArrowLeft, Loader2 } from "lucide-react";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { IPengumuman } from "../../../types/common.types";


const RichTextDisplay: React.FC<{ content: string }> = ({ content }) => {
    if (!content || content.trim() === "") return <span>-</span>;

    try {
        const rawContent = JSON.parse(content);
        if (rawContent.blocks) {
            const contentState = convertFromRaw(rawContent);
            const html = stateToHTML(contentState);

            return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
        }
    } catch (e) {
        // Fallback untuk teks biasa jika parsing gagal
        return (
            <div className="prose prose-sm max-w-none">
                {content.split("\n").map((paragraph, index) =>
                    paragraph.trim() ? (
                        <p key={index} className="mb-2 text-gray-700 leading-relaxed">
                            {paragraph}
                        </p>
                    ) : null
                )}
            </div>
        );
    }

    return <span>-</span>;
};


// 1. Ini adalah komponen DetailAnnouncement Anda, sekarang di dalam file halaman detail.
//    Saya hanya mengubahnya untuk menerima data dari API.
const DetailView = ({ data, bannerUrl }: { data: IPengumuman; bannerUrl: string | null }) => {
    if (!data) return null;
    return (
        <div>
            <img
                src={bannerUrl || "/img/header_announcement.png"} // Use fetched banner, or fallback to default                alt="Berita Pengumuman"
                className="w-full object-cover"
            />
            <div className="p-8 bg-white rounded-b-lg shadow-md">
                <div className="grid grid-cols-12 gap-y-6 gap-x-4">
                    <div className="lg:col-span-2">
                        <span className="text-primary-green font-bold text-lg">Judul</span>
                    </div>
                    <div className="col-span-12 lg:col-span-10">
                        {/* Menggunakan data 'judul' dari API */}
                        <span className="text-primary-brown text-base">{data.judul}</span>
                    </div>
                    <div className="lg:col-span-2">
            <span className="text-primary-green font-bold text-lg">
              Pengumuman
            </span>
                    </div>
                    <div className="col-span-12 lg:col-span-10 flex flex-col items-start space-y-2">
                        {/* Menggunakan data 'isi' dari API */}
                        <RichTextDisplay content={data.isi} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function AnnouncementDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // --- PENGAMBILAN DATA ---
    // 4. Mengambil data teks pengumuman
    const {
        data: response,
        isLoading: isLoadingText,
        isError: isErrorText,
    } = usePengumumanDetail(id);

    // 6. Menggabungkan status loading dan error dari kedua hook
    const isLoading = isLoadingText;
    const isError = isErrorText;

    // Mendapatkan URL dasar untuk gambar dari VITE_API_BASE_URL (menghapus /api di akhir)
    const baseUrl = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "") : "";
    const bannerUrl = response?.data?.banner ? `${baseUrl}${response.data.banner}` : null;

    return (
        <MainLayout isGreeting={false} titlePage={"Detail Pengumuman"} className={""}>
            <div className="w-full bg-white min-h-screen rounded-sm">
                <div className="p-4 border-b flex justify-start">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-primary-blueSoft flex rounded-sm px-4 py-2 items-center text-white hover:bg-primary-blueDark transition-colors"
                    >
                        <ArrowLeft className="mr-2" />
                        Kembali ke Daftar
                    </button>
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center p-16">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                    </div>
                )}
                {isError && (
                    <p className="text-center p-16 text-red-600">
                        Gagal memuat detail pengumuman. Silakan coba lagi.
                    </p>
                )}

                {/* 7. Melewatkan data pengumuman dan URL banner ke DetailView */}
                {response?.data && <DetailView data={response.data} bannerUrl={bannerUrl} />}
            </div>
        </MainLayout>
    );
}