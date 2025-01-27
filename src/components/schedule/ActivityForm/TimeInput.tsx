import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Meridiem, MeridiemType } from '@/types/schedule';
import { autoCompleteTime, to12Hour, to24Hour } from '@/lib/timeUtils';

interface TimeInputProps {
  initialTime: string;
  use24Hour: boolean;
  onTimeChange: (time: string) => void;
}

export const TimeInput: React.FC<TimeInputProps> = ({ initialTime, use24Hour, onTimeChange }) => {
  const [timeInput, setTimeInput] = useState(initialTime);
  const [meridiem, setMeridiem] = useState<MeridiemType>(
    to12Hour(initialTime).includes('PM') ? Meridiem.PM : Meridiem.AM
  );

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

  const completeAndUpdateTime = () => {
    const result = autoCompleteTime(timeInput, use24Hour);

    if (result) {
      const { time, meridiem: newMeridiem } = result;
      setTimeInput(time);

      if (newMeridiem) {
        setMeridiem(newMeridiem);
      }

      const timeValue = use24Hour ? time : `${time} ${newMeridiem || meridiem}`;
      onTimeChange(to24Hour(timeValue));
      return true;
    }
    return false;
  };

  const handleMeridiemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMeridiem = e.target.value as MeridiemType;
    setMeridiem(newMeridiem);
  };

  useEffect(() => {
    if (use24Hour) return;
    onTimeChange(to24Hour(`${timeInput} ${meridiem}`));
  }, [meridiem]);

  return (
    <div className="grid gap-2">
      <Label htmlFor="time">Start Time</Label>
      <div className="flex gap-2">
        <Input
          id="time"
          value={timeInput}
          onChange={handleTimeChange}
          onBlur={completeAndUpdateTime}
          placeholder={use24Hour ? '14:30' : '02:30'}
          className="flex-1"
        />
        {!use24Hour && (
          <select
            value={meridiem}
            onChange={handleMeridiemChange}
            className="w-20 rounded-md border border-input bg-background px-3"
          >
            {Object.values(Meridiem).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="text-sm text-gray-500">Format: {use24Hour ? 'HH:MM (24-hour)' : 'HH:MM'}</div>
    </div>
  );
};
