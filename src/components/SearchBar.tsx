import { RefreshCw, Search } from "lucide-react"
import React from "react"

interface SearchBarProps {
    search: string
    setSearch: (value: string) => void
    isPending: boolean
    placeholder: string
}

export default function SearchBar({search, setSearch, isPending, placeholder} : SearchBarProps) {
    return (
        <div className="flex">
            <input
                type="search"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-2 py-1 w-full min-w-0 flex-1 lg:w-70 lg:flex-none text-xs lg:text-base rounded shadow-md border border-black/50"
            />
            <button className="-ml-2 bg-[#00A65A] w-10 flex items-center justify-center">
                <Search color="white" size={20} />
            </button>
            <button className="bg-primary-blueDark rounded-r-md w-10 flex items-center justify-center">
                <RefreshCw className={`${isPending ? "animate-spin" : ""}`} color="white" size={20} />
            </button>
        </div>
    )
}