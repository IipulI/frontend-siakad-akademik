import React from "react";

interface ExamScheduleCardProps {
  date: string;
  lecturer: string;
  status: string;
  time: string;
  room: string;
  subject: string;
  type: string;
}

export default function ExamScheduleCard({
  date,
  lecturer,
  status,
  time,
  room,
  subject,
  type,
}: ExamScheduleCardProps) {
  return (
    <div className="shadow-md rounded-md p-2 w-full space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold">{subject}</h1>
        <h1 className="">{type}</h1>
      </div>
      <div className="p-1 grid grid-cols-3 items-center w-full gap-x-16 gap-y-4 text-sm">
        <div className="font-semibold">
          <h1 className="text-primary-black">{date}</h1>
        </div>
        <div className="font-semibold whitespace-nowrap">
          <h1 className="text-primary-black">{lecturer}</h1>
        </div>
        <div className="font-semibold">
          <h1 className="text-secondary-gray">Status</h1>
        </div>
        <div className="font-semibold">
          <h1 className="text-primary-black">{time}</h1>
        </div>
        <div className="font-semibold whitespace-nowrap">
          <h1 className="text-primary-black">{room}</h1>
        </div>
        <div className="font-semibold">
          <button className="bg-[#EAE7F2] text-primary-green w-full rounded py-2 px-4">
            {status}
          </button>
        </div>
      </div>
    </div>
  );
}
