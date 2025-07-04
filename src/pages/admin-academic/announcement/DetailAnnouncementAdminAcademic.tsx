import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import DetailAnnouncement from "../../../components/schedule/DetailAnnouncement";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes";

export default function DetailAnnouncementAdminAcademic() {
    return (
        <MainLayout
            titlePage="Detail Pengumuman"
            isGreeting={false}
        >
            <div className="w-full mt-2 bg-white py-2 rounded-sm border-t-2 border-primary-green">
                        <div className="flex mb-4 justify-end">
                            <div className="flex px-4 gap-4">
                                <Link
                                    to={AdminAcademicRoute.announcement}
                                    className="bg-primary-yellow flex rounded-sm pl-2 cursor-pointer pr-4 py-1 items-center ml-auto text-white"
                                >
                                    <ChevronLeft size={16} className="mr-4"/>
                                    Kembali ke daftar
                                </Link>
                            </div>
                        </div>
                        <DetailAnnouncement data={[]}/>
                    </div>
        </MainLayout>
    )
}