import React from "react";

interface ExamToggleButtonProps {
  examType: React.SetStateAction<"UTS" | "UAS">;
  setExamType: React.Dispatch<React.SetStateAction<"UTS" | "UAS">>;
}

export default function ExamToggleButton({ examType, setExamType }: ExamToggleButtonProps) {
  return (
    <div className="flex bg-gray-200 space-x-2 rounded-full">
      <button
        onClick={() => setExamType("UTS")}
        className={`px-2 py-1 rounded-full font-medium transition-all cursor-pointer ${
          examType === "UTS" ? "bg-white shadow text-black" : "text-gray-500"
        }`}
      >
        UTS
      </button>
      <button
        onClick={() => setExamType("UAS")}
        className={`px-2 py-1 rounded-full font-medium transition-all cursor-pointer ${
          examType === "UAS" ? "bg-white shadow text-black" : "text-gray-500"
        }`}
      >
        UAS
      </button>
    </div>
  );
}
