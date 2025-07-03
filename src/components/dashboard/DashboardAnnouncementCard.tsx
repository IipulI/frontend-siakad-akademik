import React from "react";

interface DashboardAnnouncementCardProps {
    title: string;
    description: string;
    date?: string; // 1. Make the date prop optional by adding a '?'
}

export default function DashboardAnnouncementCard({
                                                      title,
                                                      date,
                                                      description,
                                                  }: DashboardAnnouncementCardProps) {
    return (
        <div className="space-y-2">
            <h1 className="font-semibold">{title}</h1>

            {/* 2. Only render the date span if a date is provided */}
            {date && (
                <span className="text-primary-green text-sm font-semibold">
          {date}
        </span>
            )}

            <p className="text-secondary-gray w-full">{description}</p>
        </div>
    );
}