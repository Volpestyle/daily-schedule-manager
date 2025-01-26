import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, ArrowUp } from 'lucide-react';
import { Activity } from '@/types/schedule';

interface ActivityActionsProps {
  activity: Activity;
  hasGapWithPrevious: boolean;
  onEdit: (activity: Activity) => void;
  onDelete: (id: number) => void;
  onSnapToPrevious: (activity: Activity) => void;
}

const ActivityActions: React.FC<ActivityActionsProps> = ({
  activity,
  hasGapWithPrevious,
  onEdit,
  onDelete,
  onSnapToPrevious,
}) => (
  <div className="flex gap-2">
    {hasGapWithPrevious && (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onSnapToPrevious(activity)}
        title="Snap to previous activity"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    )}
    <Button variant="ghost" size="icon" onClick={() => onEdit(activity)}>
      <Edit2 className="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="icon" onClick={() => onDelete(activity.id)}>
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

export default ActivityActions;
