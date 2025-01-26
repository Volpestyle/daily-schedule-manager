export enum Categories {
  Career = 'Career',
  Portfolio = 'Portfolio',
  Health = 'Health',
  Content = 'Content',
  PetCare = 'Pet Care',
  Personal = 'Personal',
  Leisure = 'Leisure',
  Flexible = 'Flexible',
}

export type Category = Categories;
export interface Activity {
  id: number;
  time: string;
  duration: number;
  activity: string;
  category: Category[];
  important?: boolean;
}

export interface TimeConflict {
  activity1: string;
  activity2: string;
  time1: string;
  time2: string;
}

export enum Meridiem {
  AM = 'AM',
  PM = 'PM',
}

export type MeridiemType = `${Meridiem}`; // This creates a union type 'AM' | 'PM'
