/**
 * Converts a time string (HH:MM) to a pixel position in the timeline
 * @param time - Time string in HH:MM format
 * @param hourHeight - Height in pixels for each hour block
 * @returns Calculated pixel position
 */
export const getTimelinePosition = (time: string, hourHeight: number): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * hourHeight + (minutes / 60) * hourHeight;
};
