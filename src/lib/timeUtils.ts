// utils/timeUtils.ts
export const to24Hour = (time: string): string => {
  // If already in 24-hour format, return as is
  if (!time.includes("AM") && !time.includes("PM")) return time;

  const [timePart, meridiem] = time.split(" ");
  const [hours, minutes] = timePart.split(":").map(Number);

  let hour24 = hours;

  if (meridiem === "PM" && hours !== 12) {
    hour24 = hours + 12;
  } else if (meridiem === "AM" && hours === 12) {
    hour24 = 0;
  }

  return `${hour24.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

export const to12Hour = (time: string): string => {
  if (!time) return "";
  if (time.includes("AM") || time.includes("PM")) return time;

  const [hours, minutes] = time.split(":").map(Number);

  let hour12 = hours;
  let meridiem = "AM";

  if (hours === 0) {
    hour12 = 12;
  } else if (hours === 12) {
    meridiem = "PM";
  } else if (hours > 12) {
    hour12 = hours - 12;
    meridiem = "PM";
  }

  return `${hour12}:${minutes.toString().padStart(2, "0")} ${meridiem}`;
};

export const formatTime = (time: string, use24Hour: boolean): string => {
  if (!time) return "";
  return use24Hour ? to24Hour(time) : to12Hour(time);
};

export const parseUserInput = (value: string, use24Hour: boolean): string => {
  if (!value) return "";

  if (use24Hour) {
    // Validate 24-hour format
    const regex24 = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex24.test(value) ? value : "";
  } else {
    // Validate 12-hour format and convert to 24-hour
    const regex12 = /^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/i;
    return regex12.test(value) ? to24Hour(value.toUpperCase()) : "";
  }
};

// Helper for validation based on format
export const getTimePattern = (use24Hour: boolean): string => {
  return use24Hour
    ? "^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
    : "^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$";
};

// Helper for placeholder text
export const getTimePlaceholder = (use24Hour: boolean): string => {
  return use24Hour ? "14:30" : "2:30 PM";
};
