import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { Activity, Categories, TimeConflict } from "@/types/schedule";
import ActivityForm from "./ActivityForm";
import TimeConflictAlert from "./TimeConflictAlert";
import ActivityList from "./ActivityList";
import TimelineView from "./TimelineView";
// import { initialActivities } from "@/constants/hardcoded-schedules";

const defaultActivity: Activity = {
  time: "",
  duration: 30,
  activity: "",
  category: [Categories.Personal],
  important: false,
  id: 0,
};

enum ViewModes {
  list = "list",
  timeline = "timeline",
}

type ViewMode = keyof typeof ViewModes;

const InteractiveSchedule: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [draggedItem, setDraggedItem] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [timeConflicts, setTimeConflicts] = useState<TimeConflict[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewModes.list);
  const [currentActivity, setCurrentActivity] =
    useState<Activity>(defaultActivity);

  // Time calculations
  const calculateTotalHours = (): string => {
    const total = activities.reduce(
      (sum, activity) => sum + activity.duration,
      0
    );
    return (total / 60).toFixed(1);
  };

  const calculateCategoryHours = () => {
    const categoryMinutes = activities.reduce((acc, activity) => {
      acc[activity.category[0]] =
        (acc[activity.category[0]] || 0) + activity.duration;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryMinutes)
      .map(([category, minutes]) => ({
        category,
        hours: (minutes / 60).toFixed(1),
      }))
      .filter((cat) => parseFloat(cat.hours) > 0);
  };

  // Time validation
  const validateTimeOverlap = () => {
    const conflicts: TimeConflict[] = [];
    activities.forEach((activity1, i) => {
      const start1 = new Date(`2024-01-01 ${activity1.time}`);
      const end1 = new Date(start1.getTime() + activity1.duration * 60000);

      activities.forEach((activity2, j) => {
        if (i !== j) {
          const start2 = new Date(`2024-01-01 ${activity2.time}`);
          const end2 = new Date(start2.getTime() + activity2.duration * 60000);

          if (
            (start1 >= start2 && start1 < end2) ||
            (end1 > start2 && end1 <= end2) ||
            (start1 <= start2 && end1 >= end2)
          ) {
            conflicts.push({
              activity1: activity1.activity,
              activity2: activity2.activity,
              time1: activity1.time,
              time2: activity2.time,
            });
          }
        }
      });
    });
    setTimeConflicts([...new Set(conflicts)]);
  };

  useEffect(() => {
    validateTimeOverlap();
  }, [activities]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    activity: Activity
  ) => {
    setDraggedItem(activity);
    (e.currentTarget as HTMLDivElement).style.opacity = "0.5";
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLDivElement).style.opacity = "1";
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetActivity: Activity) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetActivity.id) return;

    const newActivities = [...activities];
    const draggedIndex = activities.findIndex(
      (item) => item.id === draggedItem.id
    );
    const targetIndex = activities.findIndex(
      (item) => item.id === targetActivity.id
    );

    newActivities.splice(draggedIndex, 1);
    newActivities.splice(targetIndex, 0, draggedItem);

    setActivities(newActivities);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setCurrentActivity({
      ...activity,
      important: activity.important || false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (activityId: number) => {
    setActivities(activities.filter((a) => a.id !== activityId));
  };

  const handleSubmit = () => {
    if (editingActivity) {
      setActivities(
        activities.map((a) =>
          a.id === editingActivity.id ? { ...currentActivity, id: a.id } : a
        )
      );
    } else {
      const newId = Math.max(...activities.map((a) => a.id), 0) + 1;
      setActivities([...activities, { ...currentActivity, id: newId }]);
    }
    setIsModalOpen(false);
    setEditingActivity(null);
    setCurrentActivity(defaultActivity);
  };

  return (
    <div className="space-y-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Interactive Daily Schedule</CardTitle>
            <div className="text-sm text-gray-500 mt-1">
              Total scheduled: {calculateTotalHours()} hours
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog
              open={isModalOpen}
              onOpenChange={(open) => {
                if (!open) {
                  setEditingActivity(null);
                  setCurrentActivity(defaultActivity);
                }
                setIsModalOpen(open);
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingActivity ? "Edit Activity" : "Add New Activity"}
                  </DialogTitle>
                </DialogHeader>
                <ActivityForm
                  currentActivity={currentActivity}
                  setCurrentActivity={setCurrentActivity}
                  onSubmit={handleSubmit}
                  isEditing={!!editingActivity}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="relative">
          <TimeConflictAlert conflicts={timeConflicts} />

          <Tabs
            value={viewMode}
            onValueChange={(value) => setViewMode(value as "list" | "timeline")}
            className="mb-4"
          >
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            </TabsList>
          </Tabs>

          {viewMode === "list" ? (
            <ActivityList
              activities={activities}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <TimelineView
              activities={activities}
              onActivityClick={handleEdit}
            />
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Time Distribution</h3>
            <div className="grid grid-cols-2 gap-2">
              {calculateCategoryHours().map(({ category, hours }, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{category}:</span>
                  <span>{hours} hours</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveSchedule;
