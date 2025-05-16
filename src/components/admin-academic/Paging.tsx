import { ChevronLeft, ChevronRight } from "lucide-react"
import React from "react"

export default function Paging({page, setPage}: {page: number, setPage: (page: number) => void}) {
    return (
        <div className="flex justify-between">
            <div className="flex gap-4">
                <div className="bg-blue-50 py-2 px-4">
                    <p className="text-xs text-primary-brown text-center">Hal 1/8 (6 Data, 0.0032 Detik)</p>
                </div>
                <select className="rounded-md px-4 text-xs appearance-none text-primary-brown border-gray-400 border">
                    <option value="10">10 Baris</option>
                        <option value="20">20 Baris</option>
                </select>
            </div>
            <div className="flex">
                <button onClick={() => setPage(page - 1)} className="bg-gray-400 cursor-pointer text-white px-2">
                    <ChevronLeft color="white" size={16} />
                </button>
                {[1,2,3,4,5].map((item) => (
                    <button key={item} onClick={() => setPage(item)} className={`px-3 cursor-pointer ${page === item ? "bg-primary-green text-white" : ""}`}>
                        {item}
                    </button>
                ))}
                <button onClick={() => setPage(page + 1)} className="bg-gray-400 cursor-pointer text-white px-2">
                    <ChevronRight color="white" size={16} />
                </button>    
            </div>
        </div>
    )
}
