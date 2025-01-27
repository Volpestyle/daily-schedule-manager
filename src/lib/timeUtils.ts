import { Meridiem, MeridiemType } from '@/types/schedule';

/**
 * Converts a time string from 12-hour format to 24-hour format.
 *
 * @param time - The time string to convert. Can be in either "HH:MM" (24-hour)
 *               or "HH:MM AM/PM" (12-hour) format
 * @returns The time in 24-hour "HH:MM" format
 *
 * @example
 * to24Hour("3:30 PM") // Returns "15:30"
 * to24Hour("12:00 AM") // Returns "00:00"
 * to24Hour("14:30") // Returns "14:30" (already in 24-hour format)
 */
export const to24Hour = (time: string): string => {
  // If already in 24-hour format, return as is
  if (!time.includes('AM') && !time.includes('PM')) return time;

  const [timePart, meridiem] = time.split(' ');
  const [hours, minutes] = timePart.split(':').map(Number);

  let hour24 = hours;

  if (meridiem === 'PM' && hours !== 12) {
    hour24 = hours + 12;
  } else if (meridiem === 'AM' && hours === 12) {
    hour24 = 0;
  }

  return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const to12Hour = (time: string): string => {
  if (!time) return '';
  if (time.includes('AM') || time.includes('PM')) return time;

  const [hours, minutes] = time.split(':').map(Number);

  let hour12 = hours;
  let meridiem = 'AM';

  if (hours === 0) {
    hour12 = 12;
  } else if (hours === 12) {
    meridiem = 'PM';
  } else if (hours > 12) {
    hour12 = hours - 12;
    meridiem = 'PM';
  }

  return `${hour12}:${minutes.toString().padStart(2, '0')} ${meridiem}`;
};

/**
 * Converts and completes a time input string to a standardized format
 * Handles both 24-hour and 12-hour time formats
 *
 * @param input - Raw time input string (e.g., "14", "2:30", "230")
 * @param use24Hour - Whether to use 24-hour format
 * @returns Object containing completed time string and meridiem if converted, or null if invalid
 *
 * @example
 * autoCompleteTime("14", false) // returns { time: "02:00", meridiem: "PM" }
 * autoCompleteTime("2:30", true) // returns { time: "02:30" }
 * autoCompleteTime("25", true) // returns null
 */
export const autoCompleteTime = (
  input: string,
  use24Hour: boolean
): { time: string; meridiem?: MeridiemType } | null => {
  let hour: number;
  let minute: number;

  if (input.includes(':')) {
    [hour, minute] = input.split(':').map(Number);
  } else {
    if (input.length <= 2) {
      hour = Number(input);
      minute = 0;
    } else {
      hour = Number(input.slice(0, 2));
      minute = Number(input.slice(2));
    }
  }

  // Validate hours and minutes
  if (isNaN(hour) || isNaN(minute) || minute >= 60) return null;

  // Track if it's PM before converting hours
  const isPM = hour >= 12;

  // Convert hour 0 to 12 in 12-hour mode
  if (!use24Hour && hour === 0) {
    hour = 12;
  }

  // Handle 24-hour to 12-hour conversion
  if (!use24Hour && hour > 12 && hour <= 23) {
    hour -= 12;
  } else if (hour > 23) {
    return null;
  }

  const paddedHour = hour.toString().padStart(2, '0');
  const paddedMinute = minute.toString().padStart(2, '0');

  return {
    time: `${paddedHour}:${paddedMinute}`,
    meridiem: !use24Hour ? (isPM ? Meridiem.PM : Meridiem.AM) : undefined,
  };
};

/**
 * Converts a time string in HH:mm format to total minutes since midnight
 * @param time - Time string in HH:mm format (e.g. "14:30")
 * @returns Total minutes since midnight (e.g. "14:30" returns 870)
 *
 * @example
 * timeToMinutes("14:30") // Returns 870
 * timeToMinutes("09:15") // Returns 555
 * timeToMinutes("00:00") // Returns 0
 */
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};
