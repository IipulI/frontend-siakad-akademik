import {
  Bookmark,
  CircleCheck,
  Clock3,
  DoorOpen,
  NotepadText,
  User,
} from "lucide-react";
import React from "react";
const DashboardSubjectCard = ({
  time,
  lecturer,
  room,
  meet,
  absent,
  sks,
  subject,
  classes,
}) => {
  const datas = [
    { time: time, lecturer: lecturer },
    { room: room, meet: meet },
    { absent: absent, sks: sks },
  ];

  return (
    <div className="flex justify-between md:text-base text-sm">
      <div className="w-full">
        <div className="space-y-3 shadow-md border w-full rounded-xl p-4">
          <h1 className="font-semibold text-primary-blue">
            {subject + ` (` + classes + `)`}
          </h1>
          <div className="w-full space-y-6 text-[#222222] tracking-wide font-medium">
            {datas.map((data, key) => (
              <div className="whitespace-nowrap" key={key}>
                {data.time && data.lecturer && (
                  <div className="md:grid md:grid-cols-3 grid-cols-1">
                    <div className="flex space-x-2 items-center">
                      <Clock3 size={18} color="#112233" />
                      <h1>{data.time}</h1>
                    </div>
                    <div className="flex space-x-2 items-center">
                      <User size={18} color="#112233" />
                      <h1>{data.lecturer}</h1>
                    </div>
                  </div>
                )}
                {data.room && data.meet && (
                  <div className="md:grid md:grid-cols-3 grid-cols-1">
                    <div className="flex space-x-2 items-center">
                      <DoorOpen size={18} color="#112233" />
                      <h1>{data.room}</h1>
                    </div>
                    <div className="flex space-x-2 items-center">
                      <NotepadText size={18} color="#112233" />
                      <h1>{data.meet}</h1>
                    </div>
                  </div>
                )}
                {data.absent && data.sks && (
                  <div className="md:grid md:grid-cols-3 grid-cols-1">
                    <div className="flex space-x-2 items-center">
                      <CircleCheck size={18} color="#112233" />
                      <h1>{data.absent}</h1>
                    </div>
                    <div className="flex space-x-2 items-center">
                      <Bookmark size={18} color="#112233" />
                      <h1>{data.sks}</h1>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSubjectCard;
