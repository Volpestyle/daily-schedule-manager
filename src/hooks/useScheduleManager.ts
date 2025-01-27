import { useState, useMemo, useEffect } from 'react';
import { Activity, TimeConflict } from '@/types/schedule';
import { timeToMinutes } from '@/lib/timeUtils';
import { findTimeInsertionIndex } from '@/lib/utils';
import { initialActivities } from '@/constants/hardcoded-schedules';

interface ScheduleStats {
  totalHours: string;
  categoryHours: Array<{ category: string; hours: string }>;
}

const createInterval = (activity: Activity) => {
  const start = timeToMinutes(activity.time);
  return {
    start,
    end: start + activity.duration,
    activity,
  };
};

/**
 * A custom hook that provides comprehensive schedule management functionality.
 *
 * This hook handles all aspects of schedule management including activity CRUD operations,
 * automatic conflict resolution, schedule statistics calculation, and time-based sorting.
 *
 * @param initialActivities - Optional array of activities to initialize the schedule with
 *
 * Features:
 * - Maintains a time-ordered list of activities
 * - Automatically resolves time conflicts between activities
 * - Calculates and updates schedule statistics (total hours, category breakdown)
 * - Supports adding, editing, and deleting activities
 * - Provides snap-to-previous functionality for quick scheduling
 * - Tracks modified activities for animation purposes
 * - Maintains correct time-based ordering of activities
 */
export function useScheduleManager() {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [modifiedIds, setModifiedIds] = useState<number[]>([]);

  /**
   * Calculates and memoizes schedule statistics.
   *
   * Features:
   * - Computes total scheduled hours
   * - Breaks down hours by category
   * - Updates automatically when activities change
   * - Filters out categories with zero hours
   * - Formats all times to one decimal place
   */
  const stats: ScheduleStats = useMemo(() => {
    const totalHours = (activities.reduce((sum, activity) => sum + activity.duration, 0) / 60).toFixed(1);

    const categoryMinutes = activities.reduce(
      (acc, activity) => {
        acc[activity.category[0]] = (acc[activity.category[0]] || 0) + activity.duration;
        return acc;
      },
      {} as Record<string, number>
    );

    const categoryHours = Object.entries(categoryMinutes)
      .map(([category, minutes]) => ({
        category,
        hours: (minutes / 60).toFixed(1),
      }))
      .filter((cat) => parseFloat(cat.hours) > 0);

    return { totalHours, categoryHours };
  }, [activities]);

  // Shared handlers
  const handleDelete = (activityId: number) => {
    setActivities(activities.filter((a) => a.id !== activityId));
  };

  const handleSaveActivity = (activity: Activity, editingActivity: Activity | null) => {
    const newId = editingActivity?.id ?? Math.max(...activities.map((a) => a.id), 0) + 1;
    const newActivity = { ...activity, id: newId };
    const newActivities = [...activities];

    if (editingActivity) {
      const currentIndex = activities.findIndex((a) => a.id === editingActivity.id);

      // If time unchanged, just update in place
      if (currentIndex !== -1 && editingActivity.time === activity.time) {
        newActivities[currentIndex] = newActivity;
      } else if (currentIndex !== -1) {
        // Remove old activity and insert at new time position
        newActivities.splice(currentIndex, 1);
        const insertIndex = findTimeInsertionIndex(activity.time, newActivities);
        newActivities.splice(insertIndex, 0, newActivity);
      }
    } else {
      // Insert new activity at correct time position
      const insertIndex = findTimeInsertionIndex(activity.time, activities);
      newActivities.splice(insertIndex, 0, newActivity);
    }

    setActivities(newActivities);
    setModifiedIds([newActivity.id]);
    setTimeout(() => setModifiedIds([]), 1000);
  };

  const handleSnapToPrevious = (activity: Activity) => {
    const currentIndex = activities.findIndex((a) => a.id === activity.id);
    if (currentIndex <= 0) return;

    const previousActivity = activities[currentIndex - 1];
    const [prevHour, prevMinute] = previousActivity.time.split(':').map(Number);
    const totalMinutes = prevMinute + previousActivity.duration;
    const newHour = prevHour + Math.floor(totalMinutes / 60);
    const newMinute = totalMinutes % 60;
    const newStartTime = `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;

    const updatedActivity = {
      ...activity,
      time: newStartTime,
    };

    const newActivities = [...activities];
    newActivities[currentIndex] = updatedActivity;
    setActivities(newActivities);
    setModifiedIds([activity.id]);
    setTimeout(() => setModifiedIds([]), 1000);
  };

  /**
   * Handles activity conflict resolution and automatic time adjustments.
   *
   * Features:
   * - Detects overlapping time slots between activities
   * - Automatically adjusts start times to prevent overlaps
   * - Maintains chronological ordering of activities
   * - Tracks modified activities for UI updates
   * - Creates temporary highlight effect for adjusted activities
   */
  useEffect(() => {
    if (activities.length < 2) return;

    const updatedActivities = [...activities];
    const conflicts: TimeConflict[] = [];
    let hasChanges = false;
    const modifiedActivityIds: number[] = [];

    for (let i = 1; i < activities.length; i++) {
      const current = createInterval(updatedActivities[i]);
      const previous = createInterval(updatedActivities[i - 1]);

      if (current.start < previous.end) {
        conflicts.push({
          activity1: previous.activity.activity,
          activity2: current.activity.activity,
          time1: previous.activity.time,
          time2: current.activity.time,
        });

        const previousEndMinutes = previous.end;
        const hours = Math.floor(previousEndMinutes / 60);
        const minutes = previousEndMinutes % 60;
        const newStartTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        updatedActivities[i] = {
          ...updatedActivities[i],
          time: newStartTime,
        };
        hasChanges = true;
        modifiedActivityIds.push(updatedActivities[i].id);
      }
    }

    if (hasChanges) {
      setActivities(updatedActivities);
      setModifiedIds(modifiedActivityIds);
      setTimeout(() => setModifiedIds([]), 1000);
    }
  }, [activities]);

  return {
    activities,
    modifiedIds,
    stats,
    setActivities,
    setModifiedIds,
    handleDelete,
    handleSaveActivity,
    handleSnapToPrevious,
  };
}
