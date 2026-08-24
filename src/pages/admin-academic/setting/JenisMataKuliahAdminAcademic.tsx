import React from "react";
import SimpleMasterDataPage, { ISimpleFieldConfig } from "../../../components/admin-academic/setting/SimpleMasterDataPage";
import { IJenisMataKuliah, IJenisMataKuliahPayload } from "../../../types/models";
import { useJenisMataKuliah } from "../../../hooks/admin-akademik/useJenisMataKuliah";

const fields: ISimpleFieldConfig<IJenisMataKuliahPayload>[] = [
    { key: "kode", header: "Kode", inputType: "text" },
    { key: "nama", header: "Nama", inputType: "text" },
];

const JenisMataKuliahAdminAcademic: React.FC = () => {
    const { data, isLoading, isError, error, create, isCreating, update, isUpdating, remove, isDeleting } = useJenisMataKuliah();

    return (
        <SimpleMasterDataPage<IJenisMataKuliah, IJenisMataKuliahPayload>
            titlePage="Jenis Mata Kuliah"
            entityLabel="Jenis Mata Kuliah"
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

export default JenisMataKuliahAdminAcademic;
