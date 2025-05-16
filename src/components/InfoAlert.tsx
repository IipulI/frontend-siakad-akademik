import React from "react";

interface InfoAlertProps {
  title: string;
  boldText: string;
}

export default function InfoAlert({ title, boldText }: InfoAlertProps) {
  return (
    <div className="bg-green-100 text-green-700 p-3 rounded-md mt-4 mb-6 text-sm">
      {title} {boldText && <strong>{boldText}</strong>}
    </div>
  );
}
