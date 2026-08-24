import React from "react";
import SimpleMasterDataPage, { ISimpleFieldConfig } from "../../../components/admin-academic/setting/SimpleMasterDataPage";
import { ISlotWaktu, ISlotWaktuPayload } from "../../../types/models";
import { useSlotWaktu } from "../../../hooks/admin-akademik/useSlotWaktu";

const fields: ISimpleFieldConfig<ISlotWaktuPayload>[] = [
    { key: "nama", header: "Nama Slot", inputType: "text" },
    { key: "jamMulai", header: "Jam Mulai", inputType: "time" },
    { key: "jamSelesai", header: "Jam Selesai", inputType: "time" },
];

const SlotWaktuAdminAcademic: React.FC = () => {
    const { data, isLoading, isError, error, create, isCreating, update, isUpdating, remove, isDeleting } = useSlotWaktu();

    return (
        <SimpleMasterDataPage<ISlotWaktu, ISlotWaktuPayload>
            titlePage="Slot Waktu"
            entityLabel="Slot Waktu"
            fields={fields}
            emptyPayload={{ nama: "", jamMulai: "", jamSelesai: "" }}
            requiredKeys={["nama", "jamMulai", "jamSelesai"]}
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

export default SlotWaktuAdminAcademic;
