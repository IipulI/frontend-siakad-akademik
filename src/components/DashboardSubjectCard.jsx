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
    <div className="flex justify-between">
      <div className="w-full">
        <div className="space-y-2 shadow-md w-full rounded-xl p-4">
          <h1 className="font-semibold text-primary-blue">
            {subject + ` (` + classes + `)`}
          </h1>
          <div className="w-full space-y-6 text-[#222222] tracking-wide font-medium">
            {datas.map((data, key) => (
              <div key={key}>
                {data.time && data.lecturer && (
                  <div className="flex justify-between">
                    <h1>{data.time}</h1>
                    <h1>{data.lecturer}</h1>
                  </div>
                )}
                {data.room && data.meet && (
                  <div className="flex justify-between">
                    <h1>{data.room}</h1>
                    <h1>{data.meet}</h1>
                  </div>
                )}
                {data.absent && data.sks && (
                  <div className="flex justify-between">
                    <h1>{data.absent}</h1>
                    <h1>{data.sks}</h1>
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
