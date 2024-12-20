export type Category =
  | "Career"
  | "Portfolio"
  | "Health"
  | "Content"
  | "Pet Care"
  | "Personal"
  | "Leisure"
  | "Flexible";

export interface Activity {
  id: number;
  time: string;
  duration: number;
  activity: string;
  category: Category;
  important?: boolean;
}

export interface TimeConflict {
  activity1: string;
  activity2: string;
  time1: string;
  time2: string;
}

export interface ActivityFormData {
  time: string;
  duration: number;
  activity: string;
  category: Category;
  important: boolean;
}
