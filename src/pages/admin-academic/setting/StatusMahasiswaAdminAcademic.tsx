import React from "react";
import SimpleMasterDataPage, { ISimpleFieldConfig } from "../../../components/admin-academic/setting/SimpleMasterDataPage";
import { IStatusMahasiswa, IStatusMahasiswaPayload } from "../../../types/models";
import { useStatusMahasiswa } from "../../../hooks/admin-akademik/useStatusMahasiswa";

const fields: ISimpleFieldConfig<IStatusMahasiswaPayload>[] = [
    { key: "kode", header: "Kode", inputType: "text" },
    { key: "nama", header: "Nama", inputType: "text" },
    { key: "aktif", header: "Aktif", inputType: "select", boolean: true },
    { key: "kuliah", header: "Kuliah", inputType: "select", boolean: true },
];

const StatusMahasiswaAdminAcademic: React.FC = () => {
    const { data, isLoading, isError, error, create, isCreating, update, isUpdating, remove, isDeleting } = useStatusMahasiswa();

    return (
        <SimpleMasterDataPage<IStatusMahasiswa, IStatusMahasiswaPayload>
            titlePage="Status Mahasiswa"
            entityLabel="Status Mahasiswa"
            fields={fields}
            emptyPayload={{ kode: "", nama: "", aktif: true, kuliah: true }}
            requiredKeys={["kode", "nama"]}
            data={data}
            isLoading={isLoading}
            isError={isError}
            error={error}
            isCreating={isCreating}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            onCreate={create}
            onUpdate={update}
            onDelete={remove}
        />
    );
};

export default StatusMahasiswaAdminAcademic;
