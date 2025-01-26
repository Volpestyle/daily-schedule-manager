import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Activity,
  Category,
  Categories,
  Meridiem,
  MeridiemType,
} from '@/types/schedule';
import { useSettings } from '@/contexts/SettingsContext';
import { autoCompleteTime, to24Hour } from '@/lib/timeUtils';

interface ActivityFormProps {
  currentActivity: Activity;
  setCurrentActivity: React.Dispatch<React.SetStateAction<Activity>>;
  onSubmit: () => void;
  isEditing: boolean;
}

const categories: Category[] = Object.values(Categories);

const ActivityForm: React.FC<ActivityFormProps> = ({
  currentActivity,
  setCurrentActivity,
  onSubmit,
  isEditing,
}) => {
  const { use24Hour } = useSettings();
  const [timeInput, setTimeInput] = useState(currentActivity.time);
  const [meridiem, setMeridiem] = useState<MeridiemType>(Meridiem.AM);

  const completeAndUpdateTime = () => {
    const completed = autoCompleteTime(timeInput, use24Hour);
    console.log('completed: ', completed);
    if (completed) {
      const timeValue = use24Hour ? completed : `${completed} ${meridiem}`;
      handleInputChange('time', to24Hour(timeValue));
      setTimeInput(completed);
      return true;
    }
    return false;
  };

  const handleInputChange = (
    key: keyof Activity,
    value: string | number | boolean
  ) => {
    setCurrentActivity((prev: Activity) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // If backspacing/deleting, always allow it
    if (value.length < timeInput.length) {
      setTimeInput(value);
      return;
    }

    // Don't allow invalid time formats
    if (value.includes(':')) {
      // H:M or HH:M or HH:MM pattern
      if (!/^\d{1,2}:\d{0,2}$/.test(value)) return;
    } else {
      // H or HH or HMM or HHMM pattern
      if (!/^\d{1,4}$/.test(value)) return;
    }

    setTimeInput(value);
  };

  const handleTimeBlur = () => {
    completeAndUpdateTime();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isTimeValid = completeAndUpdateTime();
    if (!isTimeValid) {
      return;
    }

    // Close modal
    onSubmit();
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="time">Start Time</Label>
        <div className="flex gap-2">
          <Input
            id="time"
            value={timeInput}
            onChange={handleTimeChange}
            onBlur={handleTimeBlur}
            placeholder={use24Hour ? '14:30' : '02:30'}
            className="flex-1"
          />
          {!use24Hour && (
            <select
              value={meridiem}
              onChange={e => setMeridiem(e.target.value as MeridiemType)}
              className="w-20 rounded-md border border-input bg-background px-3"
            >
              {Object.values(Meridiem).map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="text-sm text-gray-500">
          Format: {use24Hour ? 'HH:MM (24-hour)' : 'HH:MM'}
        </div>
      </div>

      {/* Rest of the form remains the same */}
      <div className="grid gap-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          id="duration"
          type="number"
          min={1}
          max={1440}
          value={currentActivity.duration}
          onChange={e =>
            handleInputChange('duration', parseInt(e.target.value))
          }
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="activity">Activity Description</Label>
        <Input
          id="activity"
          value={currentActivity.activity}
          onChange={e => handleInputChange('activity', e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1"
          value={currentActivity.category}
          onChange={e =>
            handleInputChange('category', e.target.value as Category)
          }
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="important"
          checked={currentActivity.important}
          onChange={e => handleInputChange('important', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="important">Mark as Important</Label>
      </div>
      <Button onClick={handleSubmit}>
        {isEditing ? 'Update Activity' : 'Add Activity'}
      </Button>
    </div>
  );
};

export default ActivityForm;
