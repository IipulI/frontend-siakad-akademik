import React from "react";
import SimpleMasterDataPage, { ISimpleFieldConfig } from "../../../components/admin-academic/setting/SimpleMasterDataPage";
import { IPenghasilan, IPenghasilanPayload } from "../../../types/models";
import { usePenghasilan } from "../../../hooks/admin-akademik/usePenghasilan";

const fields: ISimpleFieldConfig<IPenghasilanPayload>[] = [
    { key: "range", header: "Rentang Penghasilan", inputType: "text" },
];

const PenghasilanAdminAcademic: React.FC = () => {
    const { data, isLoading, isError, error, create, isCreating, update, isUpdating, remove, isDeleting } = usePenghasilan();

    return (
        <SimpleMasterDataPage<IPenghasilan, IPenghasilanPayload>
            titlePage="Penghasilan"
            entityLabel="Penghasilan"
            fields={fields}
            emptyPayload={{ range: "" }}
            requiredKeys={["range"]}
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

export default PenghasilanAdminAcademic;
