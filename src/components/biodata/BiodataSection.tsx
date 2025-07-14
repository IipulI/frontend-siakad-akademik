import React from "react";

interface BiodataSectionProps {
    title: any[];
    isTitle?: boolean;
}


export default function BiodataSection({ title, isTitle }: BiodataSectionProps) {
    return (
        <div className="flex flex-col gap-1">
            {title.map((item, key) => (
                <h3 key={key} className={isTitle ? "text-black font-semibold text-sm" : "text-sm"}>{item}</h3>
            ))}
        </div>
    )
}
