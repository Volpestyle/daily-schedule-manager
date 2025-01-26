import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Activity } from '@/types/schedule';
import { to12Hour } from '@/lib/timeUtils';

interface ActivityContentProps {
  activity: Activity;
  use24Hour: boolean;
}

const ActivityContent: React.FC<ActivityContentProps> = ({ activity, use24Hour }) => (
  <div className="flex-1">
    <div className="flex items-center gap-2">
      <span className="font-medium">
        {use24Hour ? activity.time : to12Hour(activity.time)} - {activity.activity}
      </span>
      {activity.important && <AlertCircle className="text-red-500 w-4 h-4" />}
    </div>
    <div>{activity.activity}</div>
    <div className="text-sm text-gray-600">{activity.category}</div>
  </div>
);

export default ActivityContent;
