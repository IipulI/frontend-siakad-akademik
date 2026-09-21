import React from "react";
import SimpleMasterDataPage, { ISimpleFieldConfig } from "../../../components/admin-academic/setting/SimpleMasterDataPage";
import { ISistemKuliah, ISistemKuliahPayload } from "../../../types/models";
import { useSistemKuliah } from "../../../hooks/admin-akademik/useSistemKuliah";

const fields: ISimpleFieldConfig<ISistemKuliahPayload>[] = [
    { key: "nama", header: "Nama", inputType: "text" },
    { key: "keterangan", header: "Keterangan", inputType: "text" },
];

const SistemKuliahAdminAcademic: React.FC = () => {
    const { data, isLoading, isError, error, create, isCreating, update, isUpdating, remove, isDeleting } = useSistemKuliah();

    return (
        <SimpleMasterDataPage<ISistemKuliah, ISistemKuliahPayload>
            titlePage="Sistem Kuliah"
            entityLabel="Sistem Kuliah"
            fields={fields}
            emptyPayload={{ nama: "", keterangan: "" }}
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

export default SistemKuliahAdminAcademic;
