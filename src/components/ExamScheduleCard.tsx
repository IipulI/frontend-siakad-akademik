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
    <div className="shadow-md rounded-md p-4 w-full space-y-3 border border-gray-100 bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-4 border-b pb-2">
        <h1 className="font-semibold text-primary-blue text-base">{subject}</h1>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{type}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center w-full gap-x-4 sm:gap-x-8 md:gap-x-16 gap-y-3 sm:gap-y-4 text-sm pt-1">
        <div className="font-semibold">
          <p className="text-secondary-gray text-[11px] sm:hidden uppercase tracking-wider mb-0.5">Tanggal</p>
          <h1 className="text-primary-black break-words">{date}</h1>
        </div>
        <div className="font-semibold">
          <p className="text-secondary-gray text-[11px] sm:hidden uppercase tracking-wider mb-0.5">Dosen Penguji</p>
          <h1 className="text-primary-black break-words">{lecturer}</h1>
        </div>
        <div className="font-semibold hidden sm:block text-right">
          <h1 className="text-secondary-gray">Status</h1>
        </div>
        <div className="font-semibold">
          <p className="text-secondary-gray text-[11px] sm:hidden uppercase tracking-wider mb-0.5">Waktu</p>
          <h1 className="text-primary-black">{time}</h1>
        </div>
        <div className="font-semibold">
          <p className="text-secondary-gray text-[11px] sm:hidden uppercase tracking-wider mb-0.5">Ruangan</p>
          <h1 className="text-primary-black break-words">{room}</h1>
        </div>
        <div className="font-semibold flex justify-start sm:justify-end">
          <div className="w-full sm:w-auto">
            <p className="text-secondary-gray text-[11px] sm:hidden uppercase tracking-wider mb-1">Status Ujian</p>
            <button className="bg-[#E5F7ED] text-primary-green w-full sm:w-auto rounded-full py-1.5 px-4 text-center text-xs font-semibold cursor-default">
              {status}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
