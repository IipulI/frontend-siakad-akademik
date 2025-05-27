import React from "react";
import { FaUser } from "react-icons/fa";

interface TotalSKSProps {
  currentSKS: number;
  totalSKS: number;
}

const circleSize = 160;
const strokeWidth = 20;
const radius = (circleSize - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;
const arcLength = 0.75 * circumference; // 270 derajat

const TotalSKS: React.FC<TotalSKSProps> = ({ currentSKS, totalSKS }) => {
  const percentage = Math.min(Math.round((currentSKS / totalSKS) * 100), 100);
  const progress = (percentage / 100) * arcLength;

  return (
    <div
      style={{
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
      className="w-full text-center bg-white p-6 rounded-lg"
    >
      <h1 className="font-semibold mb-6">
        Total SKS yang ditempuh di Semester Ini
      </h1>

      <div
        className="relative"
        style={{ width: circleSize, height: circleSize, margin: "0 auto" }}
      >
        <svg
          width={circleSize}
          height={circleSize}
          className="rotate-[136deg]"
        >
          {/* Background Trail */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke="#E6EAF3"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
          />

          {/* Progress */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke="#3563E9"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={arcLength - progress}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>

        {/* Tengah */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center">
          <FaUser color="#344BFD" size={18} className="mb-1" />
          <h1 className="font-semibold text-xl">{percentage}%</h1>
          <h3 className="text-gray-500 text-xs">
            {currentSKS}/{totalSKS} SKS
          </h3>
        </div>
      </div>

      <button
        style={{
          marginTop: 24,
          background: "#E6EFFF",
          color: "#3563E9",
          border: "none",
          borderRadius: 6,
          padding: "10px 32px",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        Details
      </button>
    </div>
  );
};

export default TotalSKS;
