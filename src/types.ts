export type Screen = 'home' | 'command' | 'content' | 'personal' | 'knowledge' | 'finance' | 'settings';

export interface Project {
  id: string;
  name: string;
  status: 'on-track' | 'at-risk' | 'delayed';
  health: number;
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

export interface Habit {
  id: string;
  name: string;
  completed: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}
