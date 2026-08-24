import React from "react";
import SimpleMasterDataPage, { ISimpleFieldConfig } from "../../../components/admin-academic/setting/SimpleMasterDataPage";
import { IAgama, IAgamaPayload } from "../../../types/models";
import { useAgama } from "../../../hooks/admin-akademik/useAgama";

const fields: ISimpleFieldConfig<IAgamaPayload>[] = [
    { key: "nama", header: "Nama", inputType: "text" },
];

const AgamaAdminAcademic: React.FC = () => {
    const { data, isLoading, isError, error, create, isCreating, update, isUpdating, remove, isDeleting } = useAgama();

    return (
        <SimpleMasterDataPage<IAgama, IAgamaPayload>
            titlePage="Agama"
            entityLabel="Agama"
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

export default AgamaAdminAcademic;
