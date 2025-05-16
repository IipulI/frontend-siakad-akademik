import React from "react";

interface DataCard {
  title: string;
  desc: string | React.ReactNode;
}

export default function DataCard({ title, desc }: DataCard) {
  return (
    <div className="flex md:flex-row flex-col justify-between items-start md:items-center">
      <p className="w-full text-black/90 font-semibold">{title}</p>
      <p className="w-full">{desc}</p>
    </div>
  );
}
