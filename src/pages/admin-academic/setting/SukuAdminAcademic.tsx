import React from "react";
import SimpleMasterDataPage, { ISimpleFieldConfig } from "../../../components/admin-academic/setting/SimpleMasterDataPage";
import { ISuku, ISukuPayload } from "../../../types/models";
import { useSuku } from "../../../hooks/admin-akademik/useSuku";

const fields: ISimpleFieldConfig<ISukuPayload>[] = [
    { key: "nama", header: "Nama", inputType: "text" },
];

const SukuAdminAcademic: React.FC = () => {
    const { data, isLoading, isError, error, create, isCreating, update, isUpdating, remove, isDeleting } = useSuku();

    return (
        <SimpleMasterDataPage<ISuku, ISukuPayload>
            titlePage="Suku"
            entityLabel="Suku"
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

export default SukuAdminAcademic;
