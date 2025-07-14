export default function DashboardCardGuidance({name, desc, onClick} : {name: string, desc: string, onClick?: () => void}) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex flex-col">
                <h1 className="text-primary-green font-semibold">{name}</h1>
                <p className="text-primary-brown text-sm">{desc}</p>
            </div>
            <button onClick={onClick} className="rounded bg-[#00A65A] p-2 text-white text-xs cursor-pointer">Detail Bimbingan</button>
        </div>
    )
}