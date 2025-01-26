import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Category } from '@/types/schedule';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCategoryColor(category: Category): string {
  const colors: Record<Category, string> = {
    Career: 'bg-blue-100',
    Portfolio: 'bg-purple-100',
    Health: 'bg-green-100',
    Content: 'bg-yellow-100',
    'Pet Care': 'bg-red-100',
    Personal: 'bg-pink-100',
    Leisure: 'bg-indigo-100',
    Flexible: 'bg-gray-100',
  };
  return colors[category];
}

import { timeToMinutes } from './timeUtils';

/**
 * Generic binary search function that returns insertion index
 * @param target The target value to find
 * @param array The sorted array to search in
 * @param comparator Function to compare elements, where T is array type and U is target type
 * @returns The index where target should be inserted
 */
const binarySearchInsertionIndex = <T, U>(
  target: U,
  array: T[],
  comparator: (arrayItem: T, target: U) => number
): number => {
  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const comparison = comparator(array[mid], target);

    if (comparison === 0) return mid;
    if (comparison < 0) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return left;
};

/**
 * Finds the correct insertion index for an item based on its time value
 * @param time Time string in HH:mm format or number of minutes
 * @param items Array of objects sorted by time
 * @param timeKey Key to access the time value in each object, defaults to 'time'
 * @param timeToMinutesFn Optional function to convert time to minutes, defaults to timeToMinutes
 * @returns The index where the new item should be inserted
 */
export const findTimeInsertionIndex = <T extends Record<string, any>>(
  time: string | number,
  items: T[],
  timeKey: keyof T = 'time' as keyof T,
  timeToMinutesFn: (time: string) => number = timeToMinutes
): number => {
  const targetMinutes = typeof time === 'number' ? time : timeToMinutesFn(time);
  return binarySearchInsertionIndex(targetMinutes, items, (item, targetMins) => {
    const itemMinutes =
      typeof item[timeKey] === 'number'
        ? (item[timeKey] as number)
        : timeToMinutesFn(item[timeKey] as string);
    return itemMinutes - targetMins;
  });
};
