import React from 'react';
import { Activity } from '@/types/schedule';
import ActivityItem from './ActivityItem';

interface ActivityListProps {
  activities: Activity[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, activity: Activity) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetActivity: Activity) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (id: number) => void;
  onSnapToPrevious: (activity: Activity) => void;
  modifiedIds: number[];
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onEdit,
  onDelete,
  onSnapToPrevious,
  modifiedIds,
}) => {
  const hasGapWithPrevious = (currentIndex: number): boolean => {
    if (currentIndex === 0) return false;

    const currentActivity = activities[currentIndex];
    const previousActivity = activities[currentIndex - 1];

    const [currentHour, currentMinute] = currentActivity.time.split(':').map(Number);
    const [prevHour, prevMinute] = previousActivity.time.split(':').map(Number);
    const prevEndMinutes = prevHour * 60 + prevMinute + previousActivity.duration;
    const currentStartMinutes = currentHour * 60 + currentMinute;

    return currentStartMinutes > prevEndMinutes;
  };

  return (
    <div className="space-y-2">
      {activities.map((activity, index) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          index={index}
          hasGapWithPrevious={hasGapWithPrevious(index)}
          isModified={modifiedIds.includes(activity.id)}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onEdit={onEdit}
          onDelete={onDelete}
          onSnapToPrevious={onSnapToPrevious}
        />
      ))}
    </div>
  );
};

export default ActivityList;
