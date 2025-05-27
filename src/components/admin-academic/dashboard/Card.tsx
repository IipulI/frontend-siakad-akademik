import React from "react";

interface CardProps {
  title: string;
  value: string;
  color: string;
}

export default function Card({ title, value, color }: CardProps) {
  return (
    <div
      className={`text-white ${color} aspect-[3/2] sm:aspect-auto lg:aspect-auto rounded-md p-12 flex flex-col gap justify-center text-center space-y-3 lg:space-y-1`}
    >
      <h1 className="text-base sm:text-sm md:text-base lg:text-sm">{title}</h1>
      <p className="text-3xl sm:text-2xl font-semibold ">{value}</p>
    </div>
  );
}
