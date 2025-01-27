import React from 'react';
import { Activity } from '@/types/schedule';
import { getCategoryColor } from '@/lib/utils';
import { getTimelinePosition } from '@/lib/timelineUtils';
import { HOUR_HEIGHT } from './index';

interface ActivityItemProps {
  item: Activity;
  onClick: (activity: Activity) => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = React.memo(({ item, onClick }) => (
  <div
    className={`absolute left-14 rounded-lg p-2 border border-black
     ${getCategoryColor(item.category[0])} 
      transition-all hover:opacity-90 cursor-pointer`}
    style={{
      top: `${getTimelinePosition(item.time, HOUR_HEIGHT)}px`,
      height: `${(item.duration / 60) * HOUR_HEIGHT}px`,
      width: 'calc(100% - 4rem)',
    }}
    onClick={() => onClick(item)}
  >
    <div className="text-sm font-medium">
      {item.time} - {item.activity}
    </div>
    <div className="text-xs text-gray-600">{item.category}</div>
  </div>
));

ActivityItem.displayName = 'ActivityItem';
