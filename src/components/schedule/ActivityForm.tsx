import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActivityFormData, Category } from "@/types/schedule";

interface ActivityFormProps {
  currentActivity: ActivityFormData;
  setCurrentActivity: React.Dispatch<React.SetStateAction<ActivityFormData>>;
  onSubmit: () => void;
  isEditing: boolean;
}

const categories: Category[] = [
  "Career",
  "Portfolio",
  "Health",
  "Content",
  "Pet Care",
  "Personal",
  "Leisure",
  "Flexible",
];

const ActivityForm: React.FC<ActivityFormProps> = ({
  currentActivity,
  setCurrentActivity,
  onSubmit,
  isEditing,
}) => {
  const handleInputChange = (
    key: keyof ActivityFormData,
    value: string | number | boolean
  ) => {
    setCurrentActivity((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="time">Start Time (HH:MM)</Label>
        <Input
          id="time"
          value={currentActivity.time}
          onChange={(e) => handleInputChange("time", e.target.value)}
          placeholder="09:00"
          pattern="[0-2][0-9]:[0-5][0-9]"
        />
      </div>
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
