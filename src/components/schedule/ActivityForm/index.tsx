import React, { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Category } from '@/types/schedule';
import { useSettings } from '@/contexts/SettingsContext';
import { TimeInput } from './TimeInput';
import { CategorySelect } from './CategorySelect';

interface ActivityFormProps {
  currentActivity: Activity;
  setCurrentActivity: Dispatch<SetStateAction<Activity>>;
  onSubmit: () => void;
  isEditing: boolean;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  currentActivity,
  setCurrentActivity,
  onSubmit,
  isEditing,
}) => {
  const { use24Hour } = useSettings();

  const handleInputChange = (
    key: keyof Activity,
    value: string | number | boolean | Category[]
  ) => {
    setCurrentActivity((prev: Activity) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <TimeInput
        initialTime={currentActivity.time}
        use24Hour={use24Hour}
        onTimeChange={(time) => handleInputChange('time', time)}
      />

      <div className="grid gap-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          id="duration"
          type="number"
          min={1}
          max={1440}
          value={currentActivity.duration}
          onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="activity">Activity Description</Label>
        <Input
          id="activity"
          value={currentActivity.activity}
          onChange={(e) => handleInputChange('activity', e.target.value)}
        />
      </div>

      <CategorySelect
        currentCategories={currentActivity.category}
        onCategoriesChange={(categories) => handleInputChange('category', categories)}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="important"
          checked={currentActivity.important}
          onChange={(e) => handleInputChange('important', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="important">Mark as Important</Label>
      </div>

      <Button type="submit">{isEditing ? 'Update Activity' : 'Add Activity'}</Button>
    </form>
  );
};

export default ActivityForm;
