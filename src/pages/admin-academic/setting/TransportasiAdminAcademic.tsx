import React from "react";
import SimpleMasterDataPage, { ISimpleFieldConfig } from "../../../components/admin-academic/setting/SimpleMasterDataPage";
import { ITransportasi, ITransportasiPayload } from "../../../types/models";
import { useTransportasi } from "../../../hooks/admin-akademik/useTransportasi";

const fields: ISimpleFieldConfig<ITransportasiPayload>[] = [
    { key: "kode", header: "Kode", inputType: "text" },
    { key: "nama", header: "Nama", inputType: "text" },
];

const TransportasiAdminAcademic: React.FC = () => {
    const { data, isLoading, isError, error, create, isCreating, update, isUpdating, remove, isDeleting } = useTransportasi();

    return (
        <SimpleMasterDataPage<ITransportasi, ITransportasiPayload>
            titlePage="Transportasi"
            entityLabel="Transportasi"
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

export default TransportasiAdminAcademic;
