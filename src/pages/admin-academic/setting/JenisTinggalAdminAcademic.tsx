import React from "react";
import SimpleMasterDataPage, { ISimpleFieldConfig } from "../../../components/admin-academic/setting/SimpleMasterDataPage";
import { IJenisTinggal, IJenisTinggalPayload } from "../../../types/models";
import { useJenisTinggal } from "../../../hooks/admin-akademik/useJenisTinggal";

const fields: ISimpleFieldConfig<IJenisTinggalPayload>[] = [
    { key: "kode", header: "Kode", inputType: "text" },
    { key: "nama", header: "Nama", inputType: "text" },
];

const JenisTinggalAdminAcademic: React.FC = () => {
    const { data, isLoading, isError, error, create, isCreating, update, isUpdating, remove, isDeleting } = useJenisTinggal();

    return (
        <SimpleMasterDataPage<IJenisTinggal, IJenisTinggalPayload>
            titlePage="Jenis Tinggal"
            entityLabel="Jenis Tinggal"
            fields={fields}
            emptyPayload={{ kode: "", nama: "" }}
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

export default JenisTinggalAdminAcademic;
