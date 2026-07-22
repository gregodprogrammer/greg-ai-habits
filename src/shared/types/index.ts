export type UUID = string;

export interface Timestamps {
  created_at: string;
  updated_at: string;
}

export interface User extends Timestamps {
  id: UUID;
  email: string;
  display_name: string | null;
}

export interface Habit extends Timestamps {
  id: UUID;
  user_id: UUID;
  name: string;
  description: string | null;
  frequency: 'daily' | 'weekly';
  target_count: number;
  color: string | null;
  is_archived: boolean;
}

export interface HabitEntry extends Timestamps {
  id: UUID;
  habit_id: UUID;
  user_id: UUID;
  logged_date: string;
  note: string | null;
}

export interface AIConversation extends Timestamps {
  id: UUID;
  user_id: UUID;
  role: 'user' | 'assistant';
  content: string;
}

export interface AnalyticsSummary {
  total_habits: number;
  active_habits: number;
  overall_completion_rate: number;
  current_streak: number;
  longest_streak: number;
  weekly_completions: WeeklyCompletion[];
  habit_stats: HabitStat[];
}

export interface WeeklyCompletion {
  date: string;
  count: number;
}

export interface HabitStat {
  habit_id: UUID;
  habit_name: string;
  completion_rate: number;
  current_streak: number;
}
