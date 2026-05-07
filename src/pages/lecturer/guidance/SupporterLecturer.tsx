import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";

const SupporterLecturer = () => {
    return (
        <MainLayout isGreeting={false} titlePage="Kegiatan Pendukung">
            <div className="bg-white p-6 rounded shadow-sm min-h-[50vh] mt-4">
                <h2 className="text-xl font-bold">Kegiatan Pendukung</h2>
                <p className="text-gray-500 mt-2">Halaman Kegiatan Pendukung sedang dalam pengembangan.</p>
            </div>
        </MainLayout>
    );
};

export default SupporterLecturer;
