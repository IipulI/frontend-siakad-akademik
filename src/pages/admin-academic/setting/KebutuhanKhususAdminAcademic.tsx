import React from "react";
import SimpleMasterDataPage, { ISimpleFieldConfig } from "../../../components/admin-academic/setting/SimpleMasterDataPage";
import { IKebutuhanKhusus, IKebutuhanKhususPayload } from "../../../types/models";
import { useKebutuhanKhusus } from "../../../hooks/admin-akademik/useKebutuhanKhusus";

const fields: ISimpleFieldConfig<IKebutuhanKhususPayload>[] = [
    { key: "nama", header: "Nama", inputType: "text" },
];

const KebutuhanKhususAdminAcademic: React.FC = () => {
    const { data, isLoading, isError, error, create, isCreating, update, isUpdating, remove, isDeleting } = useKebutuhanKhusus();

    return (
        <SimpleMasterDataPage<IKebutuhanKhusus, IKebutuhanKhususPayload>
            titlePage="Kebutuhan Khusus"
            entityLabel="Kebutuhan Khusus"
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

export default KebutuhanKhususAdminAcademic;
