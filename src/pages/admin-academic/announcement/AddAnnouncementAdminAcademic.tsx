import React from "react";
import FormAddAnnouncement from "../../../components/admin-academic/announcement/FormAddAnnouncement";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes";

export default function AddAnnouncementAdminAcademic() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(AdminAcademicRoute.announcement);
    };

    return (
        <MainLayout
            titlePage="Tambah Pengumuman"
            isGreeting={false}
        >
            <FormAddAnnouncement
                onCancel={handleBack}
                onSubmit={handleBack}
            />
        </MainLayout>
    );
}