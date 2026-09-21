import React from "react";
import SimpleMasterDataPage, { ISimpleFieldConfig } from "../../../components/admin-academic/setting/SimpleMasterDataPage";
import { IJenisPertemuan, IJenisPertemuanPayload } from "../../../types/models";
import { useJenisPertemuan } from "../../../hooks/admin-akademik/useJenisPertemuan";

const fields: ISimpleFieldConfig<IJenisPertemuanPayload>[] = [
    { key: "nama", header: "Nama", inputType: "text" },
];

const JenisPertemuanAdminAcademic: React.FC = () => {
    const { data, isLoading, isError, error, create, isCreating, update, isUpdating, remove, isDeleting } = useJenisPertemuan();

    return (
        <SimpleMasterDataPage<IJenisPertemuan, IJenisPertemuanPayload>
            titlePage="Jenis Pertemuan"
            entityLabel="Jenis Pertemuan"
            fields={fields}
            emptyPayload={{ nama: "" }}
            requiredKeys={["nama"]}
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

export default JenisPertemuanAdminAcademic;
