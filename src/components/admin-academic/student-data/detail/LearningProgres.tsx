import Biodata from "../../../biodata/Biodata";
import PerformanceIndexGraph from "./PerformanceIndexGraph";
import { ComparisonOfValues, SKSCourseGraph } from "./PieGraph";
import SksPassGraph from "./SksPassGraph";
import StudenLectureGraph from "./StudentLectureGraph";

export default function LearningProgress() {
  return (
    <div className="p-2 md:p-4 border border-gray-200 rounded-sm shadow-sm">
      <Biodata showLine={false} />

      <StudenLectureGraph />

      <div className=" mt-5 grid grid-cols-5 gap-5">
        <SksPassGraph />
        <SKSCourseGraph />
        <PerformanceIndexGraph />
        <ComparisonOfValues />
      </div>
    </div>
  );
}
