import React from "react";
export default function DashboardAnnouncementCard({
  title,
  date,
  description,
}) {
  return (
    <div className="space-y-2">
      <h1 className="font-semibold">{title}</h1>
      <span className="text-primary-green text-sm font-semibold">{date}</span>
      <p className="text-secondary-gray w-full">{description}</p>
    </div>
  );
}
