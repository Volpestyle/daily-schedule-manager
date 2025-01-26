import React, { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Activity } from '@/types/schedule';
import ActivityForm from './ActivityForm';
interface ActivityModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (activity: Activity) => void;
  editingActivity: Activity | null;
  currentActivity: Activity;
  setCurrentActivity: Dispatch<SetStateAction<Activity>>;
}

const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  editingActivity,
  currentActivity,
  setCurrentActivity,
}) => {
  const handleSubmit = () => {
    onSave(currentActivity);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingActivity ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
        </DialogHeader>
        <ActivityForm
          currentActivity={currentActivity}
          setCurrentActivity={setCurrentActivity}
          onSubmit={handleSubmit}
          isEditing={!!editingActivity}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ActivityModal;
