import React from "react";
import { Activity } from "@/types/schedule";
import { getCategoryColor } from "@/lib/utils";

interface TimelineViewProps {
  activities: Activity[];
  onActivityClick: (activity: Activity) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  activities,
  onActivityClick,
}) => {
  const getTimelinePosition = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return ((hours - 7) * 60 + minutes) * 2; // 2px per minute
  };

  return (
    <div className="relative mt-8 h-96 border-l border-gray-200">
      {Array.from({ length: 17 }).map((_, i) => (
        <div
          key={i}
          className="absolute left-0 flex items-center text-sm text-gray-500"
          style={{ top: `${i * 60}px` }}
        >
          <div className="w-12 text-right pr-2">
            {String(i + 7).padStart(2, "0")}:00
          </div>
        </div>
      ))}
      {activities.map((item) => (
        <div
          key={item.id}
          className={`absolute left-14 rounded-lg p-2 ${getCategoryColor(
            item.category
          )} 
            transition-all hover:opacity-90 cursor-pointer`}
          style={{
            top: `${getTimelinePosition(item.time)}px`,
            height: `${item.duration * 2}px`,
            width: "calc(100% - 4rem)",
          }}
          onClick={() => onActivityClick(item)}
        >
          <div className="text-sm font-medium">
            {item.time} - {item.activity}
          </div>
          <div className="text-xs text-gray-600">{item.category}</div>
        </div>
      ))}
    </div>
  );
};

export default TimelineView;
