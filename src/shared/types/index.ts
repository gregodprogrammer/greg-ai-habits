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

export interface BudgetCategory extends Timestamps {
  id: UUID;
  user_id: UUID;
  name: string;
  type: 'income' | 'expense' | 'both';
  color: string;
  icon: string | null;
  is_archived: boolean;
}

export interface BudgetTransaction extends Timestamps {
  id: UUID;
  user_id: UUID;
  category_id: UUID | null;
  category?: BudgetCategory;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  is_recurring: boolean;
  recurring_interval: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  notes: string | null;
}

export interface BudgetPlan extends Timestamps {
  id: UUID;
  user_id: UUID;
  month: number;
  year: number;
  monthly_limit: number | null;
  notes: string | null;
}

export interface CategorySummary {
  category_id: UUID | null;
  category_name: string;
  category_color: string;
  type: 'income' | 'expense';
  total: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: number;
  year: number;
  income: number;
  expenses: number;
  net: number;
}

export interface BudgetSummary {
  month: number;
  year: number;
  total_income: number;
  total_expenses: number;
  net_balance: number;
  running_balance: number;
  monthly_limit: number | null;
  by_category: CategorySummary[];
  monthly_trend: MonthlyTrend[];
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
