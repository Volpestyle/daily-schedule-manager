import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Category, Categories } from "@/types/schedule";
import { useSettings } from "@/contexts/SettingsContext";
import { to24Hour } from "@/lib/timeUtils";

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
  const [timeInput, setTimeInput] = useState("");
  const [meridiem, setMeridiem] = useState<"AM" | "PM">("AM");

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
    const digits = value.replace(/[^\d]/g, "").slice(0, 4);
    let formatted = digits;

    // Format with colon
    if (digits.length > 2) {
      formatted = digits.slice(0, 2) + ":" + digits.slice(2);
    }

    setTimeInput(formatted);

    // If we have a valid time format, update the activity
    if (/^\d{2}:\d{2}$/.test(formatted)) {
      const timeValue = use24Hour ? formatted : `${formatted} ${meridiem}`;
      handleInputChange("time", to24Hour(timeValue));
    }
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
            placeholder={use24Hour ? "14:30" : "02:30"}
            className="flex-1"
          />
          {!use24Hour && (
            <select
              value={meridiem}
              onChange={(e) => setMeridiem(e.target.value as "AM" | "PM")}
              className="w-20 rounded-md border border-input bg-background px-3"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          )}
        </div>
        <div className="text-sm text-gray-500">
          Format: {use24Hour ? "HH:MM (24-hour)" : "HH:MM"}
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
          onChange={(e) =>
            handleInputChange("duration", parseInt(e.target.value))
          }
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="activity">Activity Description</Label>
        <Input
          id="activity"
          value={currentActivity.activity}
          onChange={(e) => handleInputChange("activity", e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1"
          value={currentActivity.category}
          onChange={(e) =>
            handleInputChange("category", e.target.value as Category)
          }
        >
          {categories.map((cat) => (
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
          onChange={(e) => handleInputChange("important", e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="important">Mark as Important</Label>
      </div>
      <Button onClick={onSubmit}>
        {isEditing ? "Update Activity" : "Add Activity"}
      </Button>
    </div>
  );
};

export default ActivityForm;
