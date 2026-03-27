export type Screen = 'home' | 'command' | 'content' | 'personal' | 'knowledge' | 'finance' | 'settings';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  status: 'on-track' | 'at-risk' | 'delayed';
  health: number;
  lead: string | null;
  risk: 'Low' | 'Medium' | 'High';
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  project_id: string | null;
  category: string | null;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  name: string;
  size: number;
  mime_type: string;
  storage_path: string;
  created_at: string;
}
