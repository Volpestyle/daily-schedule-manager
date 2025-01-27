import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { Activity, DefaultCategories } from '@/types/schedule';
import ActivityList from './ActivityList';
import TimelineView from './TimelineView';
import { SettingsMenu } from './settingsMenu';
import ActivityModal from './ActivityModal';
import { useScheduleManager } from '@/hooks/useScheduleManager';

const defaultActivity: Activity = {
  time: '',
  duration: 30,
  activity: '',
  category: [DefaultCategories.Personal],
  important: false,
  id: 0,
};

enum ViewModes {
  list = 'list',
  timeline = 'timeline',
}

type ViewMode = keyof typeof ViewModes;

const InteractiveSchedule: React.FC = () => {
  const { activities, modifiedIds, stats, setActivities, setModifiedIds, handleDelete, handleSaveActivity, handleSnapToPrevious } =
    useScheduleManager();

  const [draggedItem, setDraggedItem] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewModes.list);
  const [currentActivity, setCurrentActivity] = useState<Activity>(defaultActivity);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [focusedActivityId, setFocusedActivityId] = useState<number | undefined>(undefined);

  // List view specific handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, activity: Activity) => {
    setDraggedItem(activity);
    (e.currentTarget as HTMLDivElement).style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLDivElement).style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetActivity: Activity) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetActivity.id) return;

    const newActivities = [...activities];
    const draggedIndex = activities.findIndex((item) => item.id === draggedItem.id);
    const targetIndex = activities.findIndex((item) => item.id === targetActivity.id);

    // Create copies to avoid mutating the original objects
    const draggedCopy = { ...draggedItem, time: targetActivity.time };
    const targetCopy = { ...targetActivity, time: draggedItem.time };

    // Remove both items
    newActivities.splice(Math.max(draggedIndex, targetIndex), 1);
    newActivities.splice(Math.min(draggedIndex, targetIndex), 1);

    // Insert them in swapped positions
    newActivities.splice(targetIndex, 0, draggedCopy);
    newActivities.splice(draggedIndex, 0, targetCopy);

    setActivities(newActivities);
    setModifiedIds([draggedItem.id, targetActivity.id]);
    setFocusedActivityId(draggedItem.id);
    setTimeout(() => setModifiedIds([]), 1000);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setCurrentActivity({
      ...activity,
      important: activity.important || false,
    });
    setFocusedActivityId(activity.id);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Interactive Daily Schedule</CardTitle>
            <div className="text-sm text-gray-500 mt-1">Total scheduled: {stats.totalHours} hours</div>
          </div>
          <div className="flex gap-2">
            <SettingsMenu />
            <Button onClick={() => setIsModalOpen(true)} variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <ActivityModal
          isOpen={isModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setEditingActivity(null);
              setCurrentActivity(defaultActivity);
            }
            setIsModalOpen(open);
          }}
          onSave={(activity) => {
            handleSaveActivity(activity, editingActivity);
            setFocusedActivityId(activity.id);
          }}
          editingActivity={editingActivity}
          currentActivity={currentActivity}
          setCurrentActivity={setCurrentActivity}
        />

        <CardContent className="relative">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)} className="mb-4">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            </TabsList>
          </Tabs>

          {viewMode === 'list' ? (
            <ActivityList
              activities={activities}
              modifiedIds={modifiedIds}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSnapToPrevious={handleSnapToPrevious}
            />
          ) : (
            <TimelineView activities={activities} onActivityClick={handleEdit} focusedActivityId={focusedActivityId} />
          )}
          {!!stats.categoryHours.length && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Time Distribution</h3>
              <div className="grid grid-cols-2 gap-2">
                {stats.categoryHours.map(({ category, hours }, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{category}:</span>
                    <span>{hours} hours</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveSchedule;
