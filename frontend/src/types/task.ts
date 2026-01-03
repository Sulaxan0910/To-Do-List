export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'incomplete';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  incomplete: number;
  completionRate: number;
}

export interface TaskFilters {
  status: 'all' | 'completed' | 'incomplete';
  sortBy: 'title' | 'status' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  search: string;
}

export interface TasksResponse {
  tasks: Task[];
  stats: TaskStats;
  filters: TaskFilters;
}