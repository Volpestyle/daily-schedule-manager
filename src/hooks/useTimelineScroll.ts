import { useState, useCallback, useEffect, RefObject } from 'react';
import { Activity } from '@/types/schedule';
import { getTimelinePosition } from '@/lib/timelineUtils';

/**
 * A custom hook that manages timeline scrolling behavior and navigation controls.
 *
 * This hook handles scroll position tracking and navigation button visibility for a timeline
 * interface, providing controls to navigate to the first activity and showing/hiding
 * navigation buttons based on scroll position.
 *
 * @param scrollContainerRef - React ref object pointing to the scrollable timeline container
 * @param activities - Array of activities to track in the timeline
 * @param hourHeight - Height of one hour in pixels for position calculations
 *
 * Features:
 * - Tracks scroll position relative to first activity
 * - Shows/hides navigation buttons based on viewport position
 * - Provides smooth scrolling to first activity
 * - Handles scroll event cleanup automatically
 */
interface ScrollState {
  showTopButton: boolean;
  showBottomButton: boolean;
}

interface UseTimelineScrollProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
  activities: Activity[];
  hourHeight: number;
}

export const useTimelineScroll = ({ scrollContainerRef, activities, hourHeight }: UseTimelineScrollProps) => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    showTopButton: false,
    showBottomButton: false,
  });

  /**
   * Scrolls the timeline to position the first activity one hour height from the top.
   */
  const scrollToFirstActivity = useCallback(() => {
    if (!scrollContainerRef.current || !activities.length) return;
    const position = Math.max(getTimelinePosition(activities[0].time, hourHeight) - hourHeight, 0);
    scrollContainerRef.current.scrollTop = position;
  }, [activities, hourHeight]);

  /**
   * Updates navigation button visibility based on scroll position.
   */
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !activities.length) return;
    const container = scrollContainerRef.current;
    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;
    const hasFirstActivityAbove = getTimelinePosition(activities[0].time, hourHeight) < containerTop;
    const hasFirstActivityBelow = getTimelinePosition(activities[0].time, hourHeight) > containerBottom;

    setScrollState({
      showTopButton: hasFirstActivityAbove,
      showBottomButton: hasFirstActivityBelow,
    });
  }, [activities, hourHeight]);

  /**
   * Sets up scroll event listener and performs initial visibility check.
   */
  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    element.addEventListener('scroll', handleScroll);
    handleScroll(); // Run initial check

    return () => element.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    scrollToFirstActivity,
    showTopButton: scrollState.showTopButton,
    showBottomButton: scrollState.showBottomButton,
  };
};
