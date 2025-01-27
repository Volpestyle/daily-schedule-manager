import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Activity } from '@/types/schedule';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useTimelineScroll } from '@/hooks/useTimelineScroll';
import { TimelineScrollButtons } from './TimelineScrollButtons';
import { getTimelinePosition } from '@/lib/timelineUtils';
import { ActivityItem } from './ActivityItem';
import { HourMarkers } from './HourMarkers';

type TimelineViewProps = {
  activities: Activity[];
  onActivityClick: (activity: Activity) => void;
  focusedActivityId?: number;
  newActivityId?: number;
};

export const HOUR_HEIGHT = 120;
export const TOTAL_TIMELINE_HEIGHT = 24 * HOUR_HEIGHT;

const TimelineView = ({ activities, onActivityClick, focusedActivityId, newActivityId }: TimelineViewProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { scrollToFirstActivity, showTopButton, showBottomButton } = useTimelineScroll({
    scrollContainerRef,
    activities,
    hourHeight: HOUR_HEIGHT,
  });

  const priorityScrollPosition = useMemo(() => {
    if (!activities.length) return undefined;

    const targetActivity = activities.find((activity) => activity.id === focusedActivityId || activity.id === newActivityId);

    if (targetActivity) {
      return Math.max(getTimelinePosition(targetActivity.time, HOUR_HEIGHT) - HOUR_HEIGHT, 0);
    }
    return undefined;
  }, [activities, focusedActivityId, newActivityId]);

  const defaultScrollPosition = activities.length ? Math.max(getTimelinePosition(activities[0].time, HOUR_HEIGHT) - HOUR_HEIGHT, 0) : 0;

  useScrollPosition(scrollContainerRef, {
    priorityScrollPosition,
    defaultPosition: defaultScrollPosition,
    isPriorityScroll: Boolean(focusedActivityId || newActivityId),
  });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    setIsDragging(true);
    const startY = e.clientY;
    const startHeight = containerRef.current.offsetHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;

      const newHeight = startHeight + (moveEvent.clientY - startY);
      containerRef.current.style.height = `${Math.max(300, Math.min(window.innerHeight, newHeight))}px`;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  const renderedActivities = useMemo(
    () =>
      activities.map((item) => {
        return <ActivityItem key={item.id} item={item} onClick={onActivityClick} />;
      }),
    [activities, onActivityClick]
  );

  return (
    <div ref={containerRef} className="relative min-h-[300px] max-h-screen border rounded-lg" style={{ height: '400px' }}>
      <TimelineScrollButtons showTopButton={showTopButton} showBottomButton={showBottomButton} onScroll={scrollToFirstActivity} />
      <div ref={scrollContainerRef} className="absolute inset-0 overflow-y-auto">
        <div className="relative border-l border-gray-200" style={{ height: TOTAL_TIMELINE_HEIGHT }}>
          <HourMarkers />
          {renderedActivities}
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize 
          hover:bg-gray-200 transition-colors ${isDragging ? 'bg-gray-300' : ''}`}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};
TimelineView.displayName = 'TimelineView';

export default TimelineView;
