import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Edit2, GripHorizontal, Trash2 } from "lucide-react";
import { Activity, TimeConflict } from "@/types/schedule";
import { getCategoryColor } from "@/lib/utils";
import { to12Hour } from "@/lib/timeUtils";
import { useSettings } from "@/contexts/SettingsContext";

interface ActivityListProps {
  activities: Activity[];
  timeConflicts: TimeConflict[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, activity: Activity) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (
    e: React.DragEvent<HTMLDivElement>,
    targetActivity: Activity
  ) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (id: number) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  timeConflicts,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onEdit,
  onDelete,
}) => {
  const { use24Hour } = useSettings();

  return (
    <div className="space-y-2">
      {activities
        .sort((a, b) => a.time.localeCompare(b.time))
        .map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, item)}
            className={`p-3 rounded-lg flex items-center gap-3 cursor-move 
              ${getCategoryColor(
                item.category[0]
              )} transition-all hover:opacity-90`}
          >
            <GripHorizontal className="flex-shrink-0 w-4 h-4 text-gray-500" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {use24Hour ? item.time : to12Hour(item.time)} -{" "}
                  {item.activity}
                </span>
                {item.important && (
                  <AlertCircle className="text-red-500 w-4 h-4" />
                )}
              </div>
              <div>{item.activity}</div>
              <div className="text-sm text-gray-600">{item.category}</div>
            </div>
            <div className="text-sm text-gray-500">{item.duration}min</div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ActivityList;
