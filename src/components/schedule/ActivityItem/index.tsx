import React from 'react';
import { GripHorizontal } from 'lucide-react';
import { Activity } from '@/types/schedule';
import { getCategoryColor } from '@/lib/utils';
import { useSettings } from '@/contexts/SettingsContext';
import { cn } from '@/lib/utils';
import ActivityContent from './ActivityContent';
import ActivityActions from './ActivityActions';

interface ActivityItemProps {
  activity: Activity;
  index: number;
  hasGapWithPrevious: boolean;
  isModified: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, activity: Activity) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, activity: Activity) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (id: number) => void;
  onSnapToPrevious: (activity: Activity) => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  hasGapWithPrevious,
  isModified,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onEdit,
  onDelete,
  onSnapToPrevious,
}) => {
  const { use24Hour } = useSettings();

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, activity)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, activity)}
      className={cn(
        'p-3 rounded-lg flex items-center gap-3 cursor-move',
        getCategoryColor(activity.category[0]),
        'transition-all hover:opacity-90',
        isModified && 'animate-highlight'
      )}
    >
      <GripHorizontal className="flex-shrink-0 w-4 h-4 text-gray-500" />
      <ActivityContent activity={activity} use24Hour={use24Hour} />
      <div className="text-sm text-gray-500">{activity.duration}min</div>
      <ActivityActions
        activity={activity}
        hasGapWithPrevious={hasGapWithPrevious}
        onEdit={onEdit}
        onDelete={onDelete}
        onSnapToPrevious={onSnapToPrevious}
      />
    </div>
  );
};

export default ActivityItem;
