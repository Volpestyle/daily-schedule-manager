import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Activity, TimeConflict } from '@/types/schedule';
import { getCategoryColor } from '@/lib/utils';

type TimelineViewProps = {
  activities: Activity[];
  timeConflicts: TimeConflict[];
  onActivityClick: (activity: Activity) => void;
};

const HOUR_HEIGHT = 60;
const TOTAL_TIMELINE_HEIGHT = 24 * HOUR_HEIGHT;

const getTimelinePosition = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours * HOUR_HEIGHT + minutes) * 2;
};

const HourMarkers = () => (
  <>
    {Array.from({ length: 24 }).map((_, i) => (
      <div
        key={i}
        className="absolute left-0 flex items-center text-sm text-gray-500"
        style={{ top: `${i * HOUR_HEIGHT}px` }}
      >
        <div className="w-12 text-right pr-2">
          {String(i).padStart(2, '0')}:00
        </div>
      </div>
    ))}
  </>
);

// Simple component without memo since parent handles memoization
const ActivityItem = ({
  item,
  isConflict,
  onClick,
}: {
  item: Activity;
  isConflict: boolean;
  onClick: (activity: Activity) => void;
}) => (
  <div
    className={`absolute left-14 rounded-lg p-2 ${
      !!isConflict && `ring-2 ring-red-500`
    } ${getCategoryColor(item.category[0])} 
      transition-all hover:opacity-90 cursor-pointer`}
    style={{
      top: `${getTimelinePosition(item.time)}px`,
      height: `${item.duration * 2}px`,
      width: 'calc(100% - 4rem)',
    }}
    onClick={() => onClick(item)}
  >
    <div className="text-sm font-medium">
      {item.time} - {item.activity}
    </div>
    <div className="text-xs text-gray-600">{item.category}</div>
  </div>
);

const TimelineView = ({
  activities,
  timeConflicts,
  onActivityClick,
}: TimelineViewProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    setIsDragging(true);
    const startY = e.clientY;
    const startHeight = containerRef.current.offsetHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;

      const newHeight = startHeight + (moveEvent.clientY - startY);
      containerRef.current.style.height = `${Math.max(
        300,
        Math.min(window.innerHeight, newHeight)
      )}px`;
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
      activities.map(item => {
        const isConflict = timeConflicts.some(
          ({ activity1, activity2 }) =>
            activity1 === item.activity || activity2 === item.activity
        );
        return (
          <ActivityItem
            key={item.id}
            item={item}
            isConflict={isConflict}
            onClick={onActivityClick}
          />
        );
      }),
    [activities, onActivityClick]
  );

  return (
    <div
      ref={containerRef}
      className="relative min-h-[300px] max-h-screen border rounded-lg"
      style={{ height: '400px' }}
    >
      <div className="absolute inset-0 overflow-y-auto">
        <div
          className="relative border-l border-gray-200"
          style={{ height: TOTAL_TIMELINE_HEIGHT }}
        >
          <HourMarkers />
          {renderedActivities}
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize 
          hover:bg-gray-200 transition-colors ${
            isDragging ? 'bg-gray-300' : ''
          }`}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};
TimelineView.displayName = 'TimelineView';

export default TimelineView;
