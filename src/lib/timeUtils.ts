// utils/timeUtils.ts
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

  return `${hour24.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
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

export const formatTime = (time: string, use24Hour: boolean): string => {
  if (!time) return '';
  return use24Hour ? to24Hour(time) : to12Hour(time);
};

export const parseUserInput = (value: string, use24Hour: boolean): string => {
  if (!value) return '';

  if (use24Hour) {
    // Validate 24-hour format
    const regex24 = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex24.test(value) ? value : '';
  } else {
    // Validate 12-hour format and convert to 24-hour
    const regex12 = /^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/i;
    return regex12.test(value) ? to24Hour(value.toUpperCase()) : '';
  }
};

// Helper for validation based on format
export const getTimePattern = (use24Hour: boolean): string => {
  return use24Hour
    ? '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
    : '^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$';
};

// Helper for placeholder text
export const getTimePlaceholder = (use24Hour: boolean): string => {
  return use24Hour ? '14:30' : '2:30 PM';
};

/**
 * Automatically formats and validates time input in various formats to a standardized HH:mm format.
 * Handles different input patterns including:
 * - Single digits (e.g., "5" → "05:00")
 * - Two digits (e.g., "14" → "14:00")
 * - Three digits (e.g., "830" → "08:30")
 * - Four digits (e.g., "1430" → "14:30")
 * - Partial times with colon (e.g., "14:" → "14:00", "14:3" → "14:30")
 *
 * @param value - The input time string to be formatted
 * @param use24Hour - Boolean flag to determine if 24-hour format should be used
 *                    true: allows hours 0-23
 *                    false: allows hours 1-12
 *
 * @returns A formatted time string in "HH:mm" format if valid, null otherwise
 *
 * @example
 * // 24-hour format examples
 * autoCompleteTime("14", true)     // returns "14:00"
 * autoCompleteTime("830", true)    // returns "08:30"
 * autoCompleteTime("2:", true)     // returns "02:00"
 * autoCompleteTime("14:3", true)   // returns "14:30"
 *
 * // 12-hour format examples
 * autoCompleteTime("8", false)     // returns "08:00"
 * autoCompleteTime("11", false)    // returns "11:00"
 * autoCompleteTime("830", false)   // returns "08:30"
 * autoCompleteTime("1430", false)  // returns "12:30"
 */
export const autoCompleteTime = (
  value: string,
  use24Hour: boolean
): string | null => {
  // Handle input with colon separately
  if (value.includes(':')) {
    const [hours, minutes] = value.split(':');
    const parsedHours = parseInt(hours);
    const parsedMinutes = parseInt(minutes);

    if (isNaN(parsedHours)) return null;

    const validHours = use24Hour
      ? Math.min(Math.max(parsedHours, 0), 23)
      : Math.min(Math.max(parsedHours, 1), 12);

    // If minutes is a single digit, treat it as tens (e.g., '2' becomes '20')
    const validMinutes = !isNaN(parsedMinutes)
      ? minutes.length === 1
        ? Math.min(Math.max(parsedMinutes * 10, 0), 59)
        : Math.min(Math.max(parsedMinutes, 0), 59)
      : 0;

    return `${validHours.toString().padStart(2, '0')}:${validMinutes.toString().padStart(2, '0')}`;
  }

  // Remove any non-digits for non-colon inputs
  const digits = value.replace(/[^\d]/g, '');

  if (!digits) return null;

  if (digits.length === 1) {
    const hours = parseInt(digits);
    if (isNaN(hours)) return null;

    // In 24-hour mode, allow 0-23. In 12-hour mode, allow 1-12
    const validHours = use24Hour
      ? Math.min(Math.max(hours, 0), 23)
      : Math.min(Math.max(hours, 1), 12);

    // In 24-hour mode, keep original input if valid
    if (use24Hour && hours >= 0 && hours <= 9) {
      return `0${hours}:00`;
    }

    return `${validHours.toString().padStart(2, '0')}:00`;
  }

  // Handle two digits (e.g., "14" → "14:00")
  if (digits.length === 2) {
    const hours = parseInt(digits);
    if (isNaN(hours)) return null;

    const validHours = use24Hour
      ? Math.min(Math.max(hours, 0), 23)
      : Math.min(Math.max(hours, 1), 12);

    return `${validHours.toString().padStart(2, '0')}:00`;
  }

  // Handle three digits (e.g., "830" → "08:30")
  if (digits.length === 3) {
    const hours = parseInt(digits[0]);
    const minutes = parseInt(digits.slice(1));

    if (isNaN(hours) || isNaN(minutes)) return null;

    const validHours = use24Hour
      ? Math.min(Math.max(hours, 0), 23)
      : Math.min(Math.max(hours, 1), 12);
    const validMinutes = Math.min(Math.max(minutes, 0), 59);

    return `${validHours.toString().padStart(2, '0')}:${validMinutes.toString().padStart(2, '0')}`;
  }

  // Handle four digits (e.g., "1430" → "14:30")
  if (digits.length === 4) {
    const hours = parseInt(digits.slice(0, 2));
    const minutes = parseInt(digits.slice(2));

    if (isNaN(hours) || isNaN(minutes)) return null;

    const validHours = use24Hour
      ? Math.min(Math.max(hours, 0), 23)
      : Math.min(Math.max(hours, 1), 12);
    const validMinutes = Math.min(Math.max(minutes, 0), 59);

    return `${validHours.toString().padStart(2, '0')}:${validMinutes.toString().padStart(2, '0')}`;
  }

  return null;
};
