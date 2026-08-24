import React from "react";
import SimpleMasterDataPage, { ISimpleFieldConfig } from "../../../components/admin-academic/setting/SimpleMasterDataPage";
import { IJasAlmamater, IJasAlmamaterPayload } from "../../../types/models";
import { useJasAlmamater } from "../../../hooks/admin-akademik/useJasAlmamater";

const fields: ISimpleFieldConfig<IJasAlmamaterPayload>[] = [
    { key: "nama", header: "Ukuran", inputType: "text" },
];

const JasAlmamaterAdminAcademic: React.FC = () => {
    const { data, isLoading, isError, error, create, isCreating, update, isUpdating, remove, isDeleting } = useJasAlmamater();

    return (
        <SimpleMasterDataPage<IJasAlmamater, IJasAlmamaterPayload>
            titlePage="Jas Almamater"
            entityLabel="Jas Almamater"
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

export default JasAlmamaterAdminAcademic;
