import React from "react";
import SimpleMasterDataPage, { ISimpleFieldConfig } from "../../../components/admin-academic/setting/SimpleMasterDataPage";
import { IRuangan, IRuanganPayload } from "../../../types/models";
import { useRuangan } from "../../../hooks/admin-akademik/useRuangan";
import { useFakultasOptions } from "../../../hooks/admin-akademik/useFakultasOptions";

const RuanganAdminAcademic: React.FC = () => {
    const { data, isLoading, isError, error, create, isCreating, update, isUpdating, remove, isDeleting } = useRuangan();
    const { options: fakultasOptions } = useFakultasOptions();

    const fields: ISimpleFieldConfig<IRuanganPayload>[] = [
        { key: "siakFakultasId", header: "Fakultas", inputType: "select", options: fakultasOptions },
        { key: "nama", header: "Nama Gedung", inputType: "text" },
        { key: "ruangan", header: "Ruangan", inputType: "text" },
        { key: "kapasitas", header: "Kapasitas", inputType: "number" },
        { key: "lantai", header: "Lantai", inputType: "number" },
    ];

    return (
        <SimpleMasterDataPage<IRuangan, IRuanganPayload>
            titlePage="Ruang Kuliah"
            entityLabel="Ruang Kuliah"
            fields={fields}
            emptyPayload={{ siakFakultasId: "", nama: "", ruangan: "", kapasitas: 0, lantai: 0 }}
            requiredKeys={["siakFakultasId", "nama", "ruangan", "kapasitas", "lantai"]}
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

export default RuanganAdminAcademic;
