import React from "react";
import SimpleMasterDataPage, { ISimpleFieldConfig } from "../../../components/admin-academic/setting/SimpleMasterDataPage";
import { IPekerjaan, IPekerjaanPayload } from "../../../types/models";
import { usePekerjaan } from "../../../hooks/admin-akademik/usePekerjaan";

const fields: ISimpleFieldConfig<IPekerjaanPayload>[] = [
    { key: "nama", header: "Nama", inputType: "text" },
];

const PekerjaanAdminAcademic: React.FC = () => {
    const { data, isLoading, isError, error, create, isCreating, update, isUpdating, remove, isDeleting } = usePekerjaan();

    return (
        <SimpleMasterDataPage<IPekerjaan, IPekerjaanPayload>
            titlePage="Pekerjaan"
            entityLabel="Pekerjaan"
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

export default PekerjaanAdminAcademic;
