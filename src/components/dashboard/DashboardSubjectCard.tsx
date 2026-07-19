import {
  Bookmark,
  CircleCheck,
  Clock3,
  DoorOpen,
  NotepadText,
  User,
} from "lucide-react";
import React from "react";

interface DashboardSubjectCardProps {
  time: string;
  lecturer: string;
  room?: string;
  meet?: string;
  absent?: string;
  sks?: string;
  subject: string;
  classes: string;
}

const DashboardSubjectCard = ({
                                time,
                                lecturer,
                                room,
                                meet,
                                absent,
                                sks,
                                subject,
                                classes,
                              }: DashboardSubjectCardProps) => {

  // Internal helper component to keep the layout consistent and code clean
  const DataBlock = ({ icon: Icon, label, value }: { icon: any, label: string, value?: string }) => (
      <div className="flex flex-col">
        <div className="flex space-x-2 items-center font-medium text-gray-900">
          <Icon size={18} color="#112233" />
          <span>{label}</span>
        </div>
        {/* ml-[26px] perfectly aligns the text below the label (18px icon + 8px gap) */}
        <span className="ml-[26px] mt-0.5 text-gray-700">
        {value || "-"}
      </span>
      </div>
  );

  return (
      <div className="space-y-6 shadow-sm border border-gray-200 w-full rounded-xl p-5 md:text-base text-sm bg-white">
        <h1 className="font-bold text-lg text-gray-900">
          {subject} ({classes})
        </h1>

        {/* 2-Column Grid Layout for Desktop, 1-Column for Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
          <DataBlock icon={Clock3} label="Waktu" value={time} />
          <DataBlock icon={User} label="Dosen Pengampu" value={lecturer} />
          <DataBlock icon={DoorOpen} label="Ruang" value={room} />
          {/*<DataBlock icon={NotepadText} label="Topik/Agenda" value={meet} />*/}
          {/*<DataBlock icon={CircleCheck} label="Status" value={absent} />*/}
          <DataBlock icon={Bookmark} label="SKS" value={sks} />
        </div>
      </div>
  );
};

export default DashboardSubjectCard;