import React from "react";

interface DashboardAnnouncementCardProps {
  title: string;
  date: string;
  description: string;
}

export default function DashboardAnnouncementCard({
  title,
  date,
  description,
}: DashboardAnnouncementCardProps) {
  return (
    <div className="space-y-2">
      <h1 className="font-semibold">{title}</h1>
      <span className="text-primary-green text-sm font-semibold">{date}</span>
      <p className="text-secondary-gray w-full">{description}</p>
    </div>
  );
}
