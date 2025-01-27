import { useEffect, RefObject, useRef } from 'react';
/**
 * A custom hook that manages scroll position persistence and priority scrolling behavior.
 *
 * This hook maintains scroll position across component re-renders and page refreshes while
 * also supporting priority scroll positions that can override the default behavior.
 *
 * @param ref - React ref object pointing to the scrollable container element
 * @param options - Configuration options for scroll behavior
 * @param options.priorityScrollPosition - Target scroll position that takes precedence over saved position
 * @param options.defaultPosition - Initial scroll position to use if no saved position exists
 * @param options.isPriorityScroll - Flag to force scrolling to priority position
 *
 * Features:
 * - Persists scroll position across component re-renders
 * - Supports priority scroll positions that can override saved positions
 * - Tracks manual user scrolling to prevent unwanted scroll position changes
 * - Handles programmatic vs user-initiated scrolling separately
 */

// Static variables to store scroll state during session
let sessionScrollPosition: number | null = null;
let hasManuallyScrolled = false;
let isScrollingProgrammatically = false;
let lastPriorityPosition: number | undefined;

export const useScrollPosition = (
  ref: RefObject<HTMLElement>,
  options: {
    priorityScrollPosition?: number; // Position to scroll to with highest priority
    defaultPosition?: number; // Fallback for first page load
    isPriorityScroll?: boolean; // Flag to force priority scroll
  }
) => {
  // Keep track of the last known good scroll position
  const lastKnownPosition = useRef<number>();

  /**
   * Manages scroll event handling and position tracking.
   */
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      if (isScrollingProgrammatically) {
        isScrollingProgrammatically = false;
        return;
      }
      const position = element.scrollTop;
      lastKnownPosition.current = position;
      sessionScrollPosition = position;
      hasManuallyScrolled = true;
    };

    element.addEventListener('scroll', handleScroll);
    return () => {
      if (lastKnownPosition.current) {
        sessionScrollPosition = lastKnownPosition.current;
      }
      element.removeEventListener('scroll', handleScroll);
    };
  }, [ref]);

  /**
   * Handles scroll position restoration and priority scrolling logic.
   */
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Only reset manual scroll when priority position actually changes
    if (options.priorityScrollPosition !== undefined && options.priorityScrollPosition !== lastPriorityPosition) {
      hasManuallyScrolled = false;
      lastPriorityPosition = options.priorityScrollPosition;
    }

    if (options.priorityScrollPosition !== undefined && !hasManuallyScrolled) {
      // Only scroll to priority position if user hasn't manually scrolled
      isScrollingProgrammatically = true;
      element.scrollTop = options.priorityScrollPosition;
    } else if (sessionScrollPosition) {
      // Restore last known scroll position
      isScrollingProgrammatically = true;
      element.scrollTop = sessionScrollPosition;
    } else if (options.defaultPosition !== undefined) {
      // Default to first activity position on initial load
      isScrollingProgrammatically = true;
      element.scrollTop = options.defaultPosition;
    }
  }, [ref, options.priorityScrollPosition, options.defaultPosition, options.isPriorityScroll]);
};
