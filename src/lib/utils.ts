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
